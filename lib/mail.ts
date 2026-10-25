import "server-only";
import nodemailer from "nodemailer";

const configured = !!process.env.SMTP_HOST;

const transport = configured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    })
  : null;

export function siteUrl(path = "") {
  return `${(process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}${path}`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// Never throws — a failed email must not break the request that triggered it.
export async function sendMail({ to, subject, text, link }: { to: string; subject: string; text: string; link?: { label: string; url: string } }) {
  const body = link ? `${text}\n\n${link.label}: ${link.url}` : text;
  if (!transport || !to) {
    console.log(`[mail:not-configured] to=${to} subject="${subject}"\n${body}`);
    return;
  }
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111">
    ${escapeHtml(text).replace(/\n/g, "<br>")}
    ${link ? `<p><a href="${link.url}" style="display:inline-block;background:#8B5CF6;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">${escapeHtml(link.label)}</a></p>` : ""}
    <p style="color:#888;font-size:12px">Michael Musyoka · Nairobi, Kenya</p></div>`;
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text: body, html });
  } catch (err) {
    console.error("[mail] send failed", err);
  }
}

export function notifyAdmin(subject: string, text: string, path?: string) {
  const to = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || "";
  return sendMail({ to, subject, text, link: path ? { label: "Open dashboard", url: siteUrl(path) } : undefined });
}
