"use client";

import { useFormState, useFormStatus } from "react-dom";
import { acceptInvite } from "@/app/portal/actions";
import { inputCls, btnCls, Field } from "@/components/admin/ui";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${btnCls} w-full py-3`}>
      {pending ? "Saving…" : "Set password & enter portal"}
    </button>
  );
}

export default function InviteForm({ token }: { token: string }) {
  const [state, action] = useFormState(acceptInvite, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Field label="New password">
        <input name="password" type="password" minLength={8} required autoComplete="new-password" className={inputCls} />
      </Field>
      <Field label="Confirm password">
        <input name="confirm" type="password" minLength={8} required autoComplete="new-password" className={inputCls} />
      </Field>
      {state?.error && <p className="font-body text-sm text-red-300">{state.error}</p>}
      <Submit />
    </form>
  );
}
