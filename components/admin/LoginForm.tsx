"use client";

import { useFormState, useFormStatus } from "react-dom";
import { inputCls, btnCls, Field } from "./ui";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${btnCls} w-full py-3`}>
      {pending ? "Signing in…" : label}
    </button>
  );
}

export default function LoginForm({
  action,
  title,
  subtitle,
}: {
  action: (state: unknown, fd: FormData) => Promise<{ error?: string } | undefined | void>;
  title: string;
  subtitle: string;
}) {
  const [state, formAction] = useFormState(action, undefined);
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form action={formAction} className="w-full max-w-sm space-y-5 rounded-2xl border border-white/5 bg-bg-elevated p-8">
        <div>
          <a href="/" className="font-display text-xl text-ice">
            M<span className="text-violet-300">.</span>
          </a>
          <h1 className="mt-6 font-display text-2xl text-ice">{title}</h1>
          <p className="mt-1 font-body text-sm text-muted">{subtitle}</p>
        </div>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </Field>
        <Field label="Password">
          <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
        </Field>
        {state?.error && <p className="font-body text-sm text-red-300">{state.error}</p>}
        <Submit label="Sign in" />
      </form>
    </main>
  );
}
