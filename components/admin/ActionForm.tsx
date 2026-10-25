"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { btnCls } from "./ui";

type Result = { error?: string; ok?: boolean; link?: string } | undefined;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btnCls}>
      {pending ? "Working…" : label}
    </button>
  );
}

// Form bound to a server action returning { error } | { ok, link? }; resets on success.
export default function ActionForm({
  action,
  submitLabel,
  children,
  successText,
}: {
  action: (state: Result, fd: FormData) => Promise<Result>;
  submitLabel: string;
  children: React.ReactNode;
  successText?: string;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="space-y-4">
      {children}
      {state?.error && <p className="font-body text-sm text-red-300">{state.error}</p>}
      {state?.ok && successText && (
        <p className="font-body text-sm text-emerald-300">
          {successText}
          {state.link && (
            <>
              {" "}
              <span className="break-all font-mono text-xs text-muted">{state.link}</span>
            </>
          )}
        </p>
      )}
      <Submit label={submitLabel} />
    </form>
  );
}
