"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { btnCls, inputCls, Field } from "./ui";

export default function UploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("projectId", projectId);
    const res = await fetch("/api/admin/documents", { method: "POST", body: fd });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json().catch(() => null))?.error ?? "Upload failed.");
      return;
    }
    ref.current?.reset();
    router.refresh();
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Display name (optional)"><input name="name" className={inputCls} placeholder="e.g. Signed contract" /></Field>
        <Field label="Type">
          <select name="kind" className={inputCls} defaultValue="contract">
            <option value="contract">Contract</option>
            <option value="invoice">Invoice</option>
            <option value="deliverable">Deliverable</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>
      <input name="file" type="file" required className="block w-full font-body text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:font-mono file:text-xs file:text-ice" />
      <label className="flex items-center gap-2 font-body text-sm text-muted">
        <input type="checkbox" name="notify" defaultChecked /> Email the client
      </label>
      {error && <p className="font-body text-sm text-red-300">{error}</p>}
      <button disabled={busy} className={btnCls}>{busy ? "Uploading…" : "Upload"}</button>
    </form>
  );
}
