#!/usr/bin/env python3
"""Point hostnames at this server through the Cloudflare API (used by scripts/setup.sh).

    CLOUDFLARE_API_TOKEN=... python3 scripts/cloudflare_dns.py plan  --zone example.com --ip 1.2.3.4 example.com www.example.com
    CLOUDFLARE_API_TOKEN=... python3 scripts/cloudflare_dns.py apply --zone example.com --ip 1.2.3.4 example.com www.example.com

`plan` prints one line per host and exits 0 when nothing needs replacing, 3 when existing
A/AAAA/CNAME records point elsewhere (setup.sh asks before running `apply`), 1 on errors.
`apply` removes those conflicting records and creates the A record. Other record types
(MX, TXT, ...) are never touched. Uses only the standard library.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API = os.environ.get("CF_API_BASE", "https://api.cloudflare.com/client/v4")
ROUTING_TYPES = {"A", "AAAA", "CNAME"}


def call(method, path, body=None):
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    req = urllib.request.Request(
        API + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            data = json.load(res)
    except urllib.error.HTTPError as e:
        try:
            data = json.load(e)
        except Exception:
            raise SystemExit(f"Cloudflare API {method} {path}: HTTP {e.code}")
    except urllib.error.URLError as e:
        raise SystemExit(f"Cannot reach the Cloudflare API: {e.reason}")
    if not data.get("success"):
        msgs = "; ".join(err.get("message", "") for err in data.get("errors", [])) or "unknown error"
        raise SystemExit(f"Cloudflare API {method} {path}: {msgs}")
    return data["result"]


def zone_id(zone):
    zones = call("GET", "/zones?" + urllib.parse.urlencode({"name": zone}))
    if not zones:
        raise SystemExit(f"Zone {zone} not found — does the token have access to it (Zone:DNS:Edit)?")
    return zones[0]["id"]


def plan(zid, hosts, ip, proxied):
    """Return [(host, keep_existing_a, conflicting_records)]."""
    out = []
    for host in hosts:
        records = call("GET", f"/zones/{zid}/dns_records?" + urllib.parse.urlencode({"name": host, "per_page": 100}))
        routing = [r for r in records if r["type"] in ROUTING_TYPES]
        good = [r for r in routing if r["type"] == "A" and r["content"] == ip and bool(r.get("proxied")) == proxied]
        conflicts = [r for r in routing if r not in good]
        out.append((host, bool(good), conflicts))
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["plan", "apply"])
    p.add_argument("--zone", required=True)
    p.add_argument("--ip", required=True)
    p.add_argument("--proxied", default="false", choices=["true", "false"])
    p.add_argument("hosts", nargs="+")
    a = p.parse_args()
    proxied = a.proxied == "true"

    if not os.environ.get("CLOUDFLARE_API_TOKEN"):
        raise SystemExit("CLOUDFLARE_API_TOKEN is not set")

    zid = zone_id(a.zone)
    steps = plan(zid, a.hosts, a.ip, proxied)

    if a.action == "plan":
        needs_ok = False
        for host, ok, conflicts in steps:
            if ok and not conflicts:
                print(f"{host}: already points at {a.ip}")
            for r in conflicts:
                needs_ok = True
                print(f"{host}: will replace {r['type']} {r['content']}{' (proxied)' if r.get('proxied') else ''}")
            if not ok and not conflicts:
                print(f"{host}: will create A {a.ip}")
        return 3 if needs_ok else 0

    for host, ok, conflicts in steps:
        for r in conflicts:
            call("DELETE", f"/zones/{zid}/dns_records/{r['id']}")
            print(f"{host}: removed {r['type']} {r['content']}")
        if not ok:
            call("POST", f"/zones/{zid}/dns_records", {"type": "A", "name": host, "content": a.ip, "ttl": 1, "proxied": proxied})
            print(f"{host}: A {a.ip}{' (proxied)' if proxied else ''}")
        elif not conflicts:
            print(f"{host}: already points at {a.ip}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
