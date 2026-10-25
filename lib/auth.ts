import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import { SESSION_COOKIE, Session, signSession, verifySession, sessionCookieOptions } from "./session";

export async function getSession(): Promise<Session | null> {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const s = await getSession();
  if (s?.role !== "admin") redirect("/admin/login");
}

export async function requireClient(): Promise<string> {
  const s = await getSession();
  if (s?.role !== "client") redirect("/portal/login");
  return s.clientId;
}

export async function startSession(session: Session) {
  cookies().set(SESSION_COOKIE, await signSession(session), sessionCookieOptions);
}

export function endSession() {
  cookies().delete(SESSION_COOKIE);
}

export function checkAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expectedPassword);
  const passwordOk = a.length === b.length && timingSafeEqual(a, b);
  return passwordOk && email.trim().toLowerCase() === expectedEmail.toLowerCase();
}

// Small in-memory throttle for login forms (single-container deployment).
const attempts = new Map<string, { count: number; until: number }>();

export function loginThrottled(key: string) {
  const entry = attempts.get(key);
  return !!entry && entry.count >= 5 && entry.until > Date.now();
}

export function recordLoginFailure(key: string) {
  const entry = attempts.get(key);
  const fresh = !entry || entry.until < Date.now();
  attempts.set(key, { count: fresh ? 1 : entry.count + 1, until: Date.now() + 15 * 60 * 1000 });
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
