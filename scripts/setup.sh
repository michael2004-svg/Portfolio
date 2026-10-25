#!/usr/bin/env bash
set -Eeuo pipefail

# portfolio: one-command setup and redeploy for the VPS (Ubuntu + Docker + Caddy).
# Serves both sites from one container:
#   michaelmusyoka.com          portfolio, /admin dashboard, /portal client portal
#   booking.michaelmusyoka.com  conversion-focused booking site
#
#   bash scripts/setup.sh
#
# Safe to run again at any time (it is also how you redeploy by hand). It:
#   1. creates .env and generates every secret (session key, admin password, database password);
#      values already in .env are never changed,
#   2. finds the shared PostgreSQL container and creates the portfolio database and user in it
#      (or starts a private PostgreSQL if there is no shared one),
#   3. asks once, in the terminal, for the few things only you know (admin email, SMTP mailbox).
#      Press Enter to skip any of them. They can also be passed in advance, e.g.
#      SMTP_HOST=... SMTP_USER=... SMTP_PASS=... bash scripts/setup.sh
#   4. backs up the database, applies migrations, builds and starts the app and waits until healthy,
#   5. points the domains at this server in Cloudflare DNS (asks once for an API token; Enter to skip),
#   6. adds both domains to Caddy for HTTPS.
#
# The admin login is ADMIN_EMAIL / ADMIN_PASSWORD in .env: edit them and run this script again to change it.

for arg in "$@"; do
  case "${arg}" in
    -h|--help) sed -n '3,23p' "$0"; exit 0 ;;
    *) echo "[error] Unknown option: ${arg} (try --help)" >&2; exit 1 ;;
  esac
done

# Values that may be passed to this script (read before .env lookups reuse the names).
PASSED_BOOKING_DOMAIN="${BOOKING_DOMAIN:-}"
PASSED_PG_CONTAINER="${PG_CONTAINER:-}"
PASSED_SERVER_IP="${SERVER_IP:-}"

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${APP_DIR}/compose.yml"
ENV_FILE="${APP_DIR}/.env"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-240}"
CADDYFILE="${CADDYFILE:-/opt/stacks/proxy/Caddyfile}"
CADDY_CONTAINER="${CADDY_CONTAINER:-caddy}"
BACKUP_DIR="${APP_DIR}/backups"
DEFAULT_DOMAIN="michaelmusyoka.com"
DB_NAME="portfolio"
DB_USER="portfolio"

log()  { echo "[setup] $*"; }
warn() { echo "[warn]  $*" >&2; }
die()  { echo "[error] $*" >&2; exit 1; }
trap 'die "failed at line ${LINENO}: ${BASH_COMMAND}"' ERR

compose() { docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" "$@"; }
interactive() { [ -t 0 ] && [ -t 1 ]; }
SKIPPED=()

# ── prerequisites ──────────────────────────────────────────────────────────────────────────
command -v docker >/dev/null 2>&1 || die "Docker is not installed."
command -v git >/dev/null 2>&1 || die "git is not installed."
docker compose version >/dev/null 2>&1 || die "The Docker Compose plugin is not installed."
docker info >/dev/null 2>&1 || die "Docker is not running, or this user cannot use it (try: sudo usermod -aG docker \$USER)."

# compose.yml requires an image tag even for helper services.
IMAGE_TAG="$(git -C "${APP_DIR}" rev-parse HEAD 2>/dev/null || echo local)"
export IMAGE_TAG

if ! docker network ls --format '{{.Name}}' | grep -qx 'proxy'; then
  log "Creating the shared 'proxy' network..."
  docker network create proxy >/dev/null
fi

# ── .env helpers ───────────────────────────────────────────────────────────────────────────
# Values are written single-quoted so passwords with spaces, $ or # survive both docker compose
# and this script. Reading strips the quotes again.
[ -f "${ENV_FILE}" ] || { : > "${ENV_FILE}"; chmod 600 "${ENV_FILE}"; log "Created .env"; }

env_get() {
  local line
  line="$(grep -E "^${1}=" "${ENV_FILE}" | tail -n 1 || true)"
  line="${line#*=}"
  line="${line%$'\r'}"
  if [[ "${line}" == \'*\' || "${line}" == \"*\" ]]; then line="${line:1:${#line}-2}"; fi
  printf '%s' "${line}"
}

env_set() {
  local key="$1" value="$2" tmp
  [[ "${value}" == *"'"* ]] && die "${key} must not contain a single quote (')."
  tmp="$(mktemp)"
  grep -vE "^${key}=" "${ENV_FILE}" > "${tmp}" || true
  printf "%s='%s'\n" "${key}" "${value}" >> "${tmp}"
  cat "${tmp}" > "${ENV_FILE}" && rm -f "${tmp}"
}

rand_hex() { openssl rand -hex "$1" 2>/dev/null || head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'; }
rand_password() { printf 'Mm%s7' "$(rand_hex 9)"; } # 21 chars, letters and digits
gen_hex32() { rand_hex 32; }

# Fill KEY when it is empty: from the same-named variable passed to this script, else by generator.
GENERATED_ADMIN_PASSWORD=0
ensure() {
  local key="$1" generator="$2" label="$3" passed
  [ -n "$(env_get "${key}")" ] && return 0
  passed="${!key:-}"
  if [ -n "${passed}" ]; then env_set "${key}" "${passed}"; log "${label}: taken from the environment"; return 0; fi
  env_set "${key}" "$(${generator})"
  log "${label}: generated"
  [ "${key}" = "ADMIN_PASSWORD" ] && GENERATED_ADMIN_PASSWORD=1
  return 0
}

# Ask for a value only you know, once. Enter keeps the default (or skips when there is none).
ask() {
  local key="$1" prompt="$2" secret="${3:-no}" default="${4:-}" passed value=""
  [ -n "$(env_get "${key}")" ] && return 0
  passed="${!key:-}"
  if [ -n "${passed}" ]; then env_set "${key}" "${passed}"; log "${key}: taken from the environment"; return 0; fi
  if interactive; then
    local hint="Enter to skip"; [ -n "${default}" ] && hint="Enter for ${default}"
    if [ "${secret}" = "secret" ]; then read -r -s -p "  ${prompt} (${hint}): " value; echo; else read -r -p "  ${prompt} (${hint}): " value; fi
  fi
  value="${value:-${default}}"
  if [ -n "${value}" ]; then env_set "${key}" "${value}"; else SKIPPED+=("${key}"); fi
}

# ── domains ────────────────────────────────────────────────────────────────────────────────
log "Checking settings in .env..."
DOMAIN="$(env_get APP_DOMAIN)"
if [ -z "${DOMAIN}" ]; then
  DOMAIN="${APP_DOMAIN:-}"
  if [ -z "${DOMAIN}" ] && interactive; then read -r -p "  Portfolio domain [${DEFAULT_DOMAIN}]: " DOMAIN; fi
  DOMAIN="${DOMAIN:-${DEFAULT_DOMAIN}}"
  DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN%%/*}"
  env_set APP_DOMAIN "${DOMAIN}"
fi
BOOKING_DOMAIN="$(env_get BOOKING_DOMAIN)"
if [ -z "${BOOKING_DOMAIN}" ]; then
  BOOKING_DOMAIN="${PASSED_BOOKING_DOMAIN:-booking.${DOMAIN}}"
  env_set BOOKING_DOMAIN "${BOOKING_DOMAIN}"
fi
[ -n "$(env_get SITE_URL)" ] || env_set SITE_URL "https://${DOMAIN}"
[ -n "$(env_get BOOKING_HOST_PREFIX)" ] || env_set BOOKING_HOST_PREFIX "${BOOKING_DOMAIN%%.*}."
[ -n "$(env_get NEXT_PUBLIC_PORTFOLIO_URL)" ] || env_set NEXT_PUBLIC_PORTFOLIO_URL "https://${DOMAIN}"
[ -n "$(env_get UPLOAD_DIR)" ] || env_set UPLOAD_DIR "/app/uploads"

# ── generated secrets ──────────────────────────────────────────────────────────────────────
ensure SESSION_SECRET gen_hex32     "Session signing key"
ensure ADMIN_PASSWORD rand_password "Admin password"

# ── settings only you know ─────────────────────────────────────────────────────────────────
if interactive && { [ -z "$(env_get ADMIN_EMAIL)" ] || [ -z "$(env_get SMTP_HOST)" ]; }; then
  log "A few settings only you know (asked once, saved to .env):"
fi
ask ADMIN_EMAIL "Admin login email (also gets lead alerts)" no "admin@${DOMAIN}"
ask SMTP_HOST   "SMTP server for sending email, e.g. smtp.gmail.com"
if [ -n "$(env_get SMTP_HOST)" ]; then
  ask SMTP_PORT "SMTP port" no "587"
  ask SMTP_USER "SMTP username (usually the mailbox address)"
  ask SMTP_PASS "SMTP password / app password" secret
  [ -n "$(env_get MAIL_FROM)" ] || env_set MAIL_FROM "Michael Musyoka <$(env_get SMTP_USER)>"
fi
[ -n "$(env_get NOTIFY_EMAIL)" ] || env_set NOTIFY_EMAIL "$(env_get ADMIN_EMAIL)"

# ── database ───────────────────────────────────────────────────────────────────────────────
# Find the shared PostgreSQL container (Supabase's database is left alone).
detect_pg() {
  docker ps --format '{{.Names}}\t{{.Image}}' \
    | awk -F'\t' 'tolower($2) ~ /(^|\/)(postgres|postgis|postgresql)(:|$)/ {print $1}' \
    | grep -viE 'supabase|^portfolio-postgres$' || true
}

PG_CONTAINER="$(env_get PG_CONTAINER)"
if [ -z "${PG_CONTAINER}" ]; then
  PG_CONTAINER="${PASSED_PG_CONTAINER}"
  if [ -z "${PG_CONTAINER}" ]; then
    mapfile -t candidates < <(detect_pg)
    if [ "${#candidates[@]}" -eq 1 ]; then
      PG_CONTAINER="${candidates[0]}"
    elif [ "${#candidates[@]}" -gt 1 ]; then
      if interactive; then
        log "Several PostgreSQL containers are running:"
        for i in "${!candidates[@]}"; do echo "    $((i + 1))) ${candidates[$i]}"; done
        read -r -p "  Which one is the shared database? [1]: " pick
        PG_CONTAINER="${candidates[$(( ${pick:-1} - 1 ))]}"
      else
        PG_CONTAINER="${candidates[0]}"
        warn "Several PostgreSQL containers found; using ${PG_CONTAINER}. Set PG_CONTAINER in .env to choose another."
      fi
    fi
  fi
  if [ -z "${PG_CONTAINER}" ]; then
    log "No shared PostgreSQL found — starting a private one for this app."
    PG_CONTAINER="portfolio-postgres"
  fi
  env_set PG_CONTAINER "${PG_CONTAINER}"
fi

if [ "${PG_CONTAINER}" = "portfolio-postgres" ]; then
  docker network ls --format '{{.Name}}' | grep -qx 'backend' || docker network create backend >/dev/null
  [ -n "$(env_get DB_NETWORK)" ] || env_set DB_NETWORK "backend"
  ensure LOCALDB_SUPERUSER_PASSWORD gen_hex32 "Private database superuser password"
  compose --profile localdb up -d postgres
  for _ in $(seq 1 40); do
    [ "$(docker inspect --format '{{.State.Health.Status}}' portfolio-postgres 2>/dev/null)" = "healthy" ] && break
    sleep 2
  done
fi

docker inspect "${PG_CONTAINER}" >/dev/null 2>&1 || die "PostgreSQL container '${PG_CONTAINER}' (PG_CONTAINER in .env) is not running."
log "Using PostgreSQL container: ${PG_CONTAINER}"

# The network the app must join to reach the database.
if [ -z "$(env_get DB_NETWORK)" ]; then
  nets="$(docker inspect --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' "${PG_CONTAINER}" | grep -vE '^(bridge|host|none)?$' || true)"
  net="$(printf '%s\n' "${nets}" | grep -x 'backend' || printf '%s\n' "${nets}" | head -n 1)"
  if [ -z "${net}" ]; then
    log "Connecting ${PG_CONTAINER} to a 'backend' network so the app can reach it..."
    docker network ls --format '{{.Name}}' | grep -qx 'backend' || docker network create backend >/dev/null
    docker network connect backend "${PG_CONTAINER}"
    net="backend"
  fi
  env_set DB_NETWORK "${net}"
fi
DB_NETWORK="$(env_get DB_NETWORK)"

PG_SUPERUSER="$(docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "${PG_CONTAINER}" | sed -n 's/^POSTGRES_USER=//p' | head -n 1)"
PG_SUPERUSER="${PG_SUPERUSER:-postgres}"
psql_super() { docker exec -i "${PG_CONTAINER}" psql -U "${PG_SUPERUSER}" -d postgres -v ON_ERROR_STOP=1 -tA "$@"; }

ensure DB_PASSWORD gen_hex32 "Database password"
DB_PASSWORD="$(env_get DB_PASSWORD)"
log "Making sure database '${DB_NAME}' and user '${DB_USER}' exist..."
psql_super >/dev/null <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END \$\$;
SQL
if ! psql_super -c "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1; then
  psql_super -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" >/dev/null
  log "Created database ${DB_NAME}."
fi
env_set DATABASE_URL "postgresql://${DB_USER}:${DB_PASSWORD}@${PG_CONTAINER}:5432/${DB_NAME}?schema=public"

# Back up before migrations run.
if docker exec -i "${PG_CONTAINER}" psql -U "${PG_SUPERUSER}" -d "${DB_NAME}" -tAc "SELECT to_regclass('public._prisma_migrations') IS NOT NULL" 2>/dev/null | grep -q t; then
  mkdir -p "${BACKUP_DIR}"
  backup="${BACKUP_DIR}/${DB_NAME}-$(date +%Y%m%d-%H%M%S).sql.gz"
  log "Backing up the database to ${backup#"${APP_DIR}"/}..."
  docker exec -i "${PG_CONTAINER}" pg_dump -U "${PG_SUPERUSER}" -d "${DB_NAME}" --no-owner | gzip > "${backup}"
  chmod 600 "${backup}"
  ls -1t "${BACKUP_DIR}"/*.sql.gz 2>/dev/null | tail -n +11 | xargs -r rm -f # keep the 10 newest
fi
chmod 600 "${ENV_FILE}"

# ── build ──────────────────────────────────────────────────────────────────────────────────
cd "${APP_DIR}"
log "Building images (tag ${IMAGE_TAG:0:12})..."
compose build web
compose --profile tools build migrate

log "Applying database migrations..."
compose --profile tools run --rm migrate

# ── application ────────────────────────────────────────────────────────────────────────────
wait_healthy() {
  local service="$1" elapsed=0 id status health
  while [ "${elapsed}" -lt "${HEALTH_TIMEOUT}" ]; do
    id="$(compose ps -q "${service}")"
    [ -n "${id}" ] || die "${service} container not found"
    status="$(docker inspect --format '{{.State.Status}}' "${id}")"
    health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "${id}")"
    if [ "${health}" = "healthy" ] || { [ "${health}" = "none" ] && [ "${status}" = "running" ]; }; then log "${service} is up."; return 0; fi
    if [ "${status}" = "exited" ] || [ "${status}" = "dead" ] || [ "${health}" = "unhealthy" ]; then
      docker logs --tail 80 "${id}" 2>&1 || true
      die "${service} failed to start (logs above)."
    fi
    sleep 3; elapsed=$((elapsed + 3))
  done
  docker logs --tail 80 "$(compose ps -q "${service}")" 2>&1 || true
  die "${service} was not healthy after ${HEALTH_TIMEOUT}s (logs above)."
}

log "Starting the website..."
compose up -d --no-deps --force-recreate web
wait_healthy web
git rev-parse HEAD > .deployed_sha 2>/dev/null || true

# ── DNS (Cloudflare) ───────────────────────────────────────────────────────────────────────
# Replaces the A/AAAA/CNAME records of the three hosts (e.g. old Vercel ones) with an A record for
# this server. Needs an API token with Zone → DNS → Edit for the domain. MX/TXT records are untouched.
DNS_HOSTS=("${DOMAIN}" "www.${DOMAIN}" "${BOOKING_DOMAIN}")
SERVER_IP="$(env_get SERVER_IP)"
if [ -z "${SERVER_IP}" ]; then
  SERVER_IP="${PASSED_SERVER_IP:-$(curl -4 -fsS --max-time 10 https://api.ipify.org 2>/dev/null || curl -4 -fsS --max-time 10 https://ifconfig.me 2>/dev/null || true)}"
  [ -n "${SERVER_IP}" ] && env_set SERVER_IP "${SERVER_IP}"
fi
[ -n "$(env_get CF_PROXIED)" ] || env_set CF_PROXIED "${CF_PROXIED:-false}"
ask CLOUDFLARE_API_TOKEN "Cloudflare API token (Zone > DNS > Edit) to point ${DOMAIN} here" secret

DNS_STATUS="not changed"
CF_TOKEN="$(env_get CLOUDFLARE_API_TOKEN)"
indent() { printf '%s\n' "$1" | sed 's/^/    /'; }
cf_dns() {
  CLOUDFLARE_API_TOKEN="${CF_TOKEN}" python3 "${APP_DIR}/scripts/cloudflare_dns.py" "$1" \
    --zone "${DOMAIN}" --ip "${SERVER_IP}" --proxied "$(env_get CF_PROXIED)" "${DNS_HOSTS[@]}"
}
if [ -z "${CF_TOKEN}" ]; then
  DNS_STATUS="manual: add A records for ${DNS_HOSTS[*]} -> ${SERVER_IP:-the IP of this server}"
elif [ -z "${SERVER_IP}" ]; then
  DNS_STATUS="could not detect this server's public IP; set SERVER_IP in .env and run again"
elif ! command -v python3 >/dev/null 2>&1; then
  DNS_STATUS="python3 is not installed (sudo apt install -y python3); DNS not changed"
else
  log "Checking Cloudflare DNS for ${DNS_HOSTS[*]}..."
  plan_rc=0; plan_out="$(cf_dns plan 2>&1)" || plan_rc=$?
  indent "${plan_out}"
  apply=0
  if [ "${plan_rc}" = 0 ]; then
    grep -q 'will create' <<<"${plan_out}" && apply=1
    [ "${apply}" = 0 ] && DNS_STATUS="already points at ${SERVER_IP}"
  elif [ "${plan_rc}" = 3 ]; then
    # Existing records point elsewhere: replacing them moves live traffic, so confirm first.
    if [ "${DNS_REPLACE:-}" = "yes" ]; then
      apply=1
    elif interactive; then
      read -r -p "  Replace those records so the sites are served from this server? [y/N]: " yn
      [[ "${yn}" =~ ^[Yy] ]] && apply=1
    fi
    [ "${apply}" = 0 ] && DNS_STATUS="left as is (answer y, or run with DNS_REPLACE=yes, to switch)"
  else
    DNS_STATUS="Cloudflare check failed (see above); DNS not changed"
  fi
  if [ "${apply}" = 1 ]; then
    if apply_out="$(cf_dns apply 2>&1)"; then
      indent "${apply_out}"
      DNS_STATUS="${DNS_HOSTS[*]} -> ${SERVER_IP}"
      if [ "$(env_get CF_PROXIED)" != "true" ]; then
        # Give resolvers a moment so Caddy's first certificate attempt succeeds (it retries anyway).
        for _ in $(seq 1 20); do
          [ "$(getent ahostsv4 "${DOMAIN}" 2>/dev/null | awk 'NR==1{print $1}')" = "${SERVER_IP}" ] && break
          sleep 3
        done
      fi
    else
      indent "${apply_out}"
      DNS_STATUS="Cloudflare update failed (see above)"
    fi
  fi
fi

# ── HTTPS through Caddy ────────────────────────────────────────────────────────────────────
# add_caddy_site <host to look for> <site address line> <extra directives>
add_caddy_site() {
  local host="$1" address="$2" extra="$3"
  if grep -qE "(^|[[:space:],])${host//./\\.}([[:space:],]|\{|$)" "${CADDYFILE}"; then
    echo "already routes ${host}"
    return 1
  fi
  printf '\n%s {\n    encode zstd gzip\n%b    reverse_proxy portfolio:3000\n}\n' "${address}" "${extra}" >> "${CADDYFILE}"
  echo "added ${host}"
}

CADDY_STATUS="not configured"
if [ -f "${CADDYFILE}" ]; then
  if [ -w "${CADDYFILE}" ]; then
    changed=0
    s1="$(add_caddy_site "${DOMAIN}" "${DOMAIN}, www.${DOMAIN}" "    request_body {\n        max_size 30MB\n    }\n")" && changed=1
    s2="$(add_caddy_site "${BOOKING_DOMAIN}" "${BOOKING_DOMAIN}" "")" && changed=1
    CADDY_STATUS="${s1}; ${s2}"
    if [ "${changed}" = 1 ]; then
      if docker exec "${CADDY_CONTAINER}" caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1; then
        CADDY_STATUS="${CADDY_STATUS}; Caddy reloaded"
      else
        CADDY_STATUS="${CADDY_STATUS}; reload failed — run: docker exec ${CADDY_CONTAINER} caddy reload --config /etc/caddy/Caddyfile"
      fi
    fi
  else
    CADDY_STATUS="${CADDYFILE} is not writable by this user; add the blocks from deploy/Caddyfile.snippet"
  fi
else
  CADDY_STATUS="no Caddyfile at ${CADDYFILE}; point your proxy at portfolio:3000 for ${DOMAIN} and ${BOOKING_DOMAIN}"
fi

# ── summary ────────────────────────────────────────────────────────────────────────────────
echo
log "Done."
echo "  Portfolio:    https://${DOMAIN}"
echo "  Booking:      https://${BOOKING_DOMAIN}"
echo "  Admin:        https://${DOMAIN}/admin   ($(env_get ADMIN_EMAIL))"
if [ "${GENERATED_ADMIN_PASSWORD}" = 1 ]; then
  echo "  Admin pass:   $(env_get ADMIN_PASSWORD)   <- generated now; also saved in .env"
else
  echo "  Admin pass:   ADMIN_PASSWORD in .env"
fi
echo "  Client portal: https://${DOMAIN}/portal"
echo "  Database:     ${DB_NAME} on ${PG_CONTAINER} (network ${DB_NETWORK})"
echo "  DNS:          ${DNS_STATUS}"
echo "  HTTPS:        ${CADDY_STATUS}"
[ -n "${backup:-}" ] && echo "  Backup:       ${backup#"${APP_DIR}"/}"
if [ "${#SKIPPED[@]}" -gt 0 ]; then
  echo
  warn "Skipped (add to .env and run this script again to enable):"
  for k in "${SKIPPED[@]}"; do
    case "$k" in
      CLOUDFLARE_API_TOKEN) why="DNS not managed: point the A records at ${SERVER_IP:-this server} yourself" ;;
      SMTP_*) why="no emails: lead alerts, client invites and review requests are logged instead (invite links still show in /admin)" ;;
      *)      why="" ;;
    esac
    printf "    %-14s %s\n" "$k" "$why"
  done
fi
echo
echo "  Moving from Vercel? Once the sites load from here, remove ${DOMAIN} and ${BOOKING_DOMAIN} from the Vercel project."
[ "$(env_get CF_PROXIED)" = "true" ] && echo "  Cloudflare proxy is on: set SSL/TLS mode to Full (strict) for ${DOMAIN}."
echo "  After schema changes in a new commit, run this script again (it backs up, then migrates)."
