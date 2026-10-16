import { cookies } from "next/headers";
import db from "./db";

const COOKIE = "raciqan_session";

export type SessionUser = { id: number; name: string; email: string };

export async function getSessionUser(): Promise<SessionUser | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  const id = Number(c);
  if (!id) return null;
  const row = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(id) as SessionUser | undefined;
  return row || null;
}

export async function setSession(userId: number) {
  (await cookies()).set(COOKIE, String(userId), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export function findOrCreateUser(name: string, email: string): SessionUser {
  const existing = db.prepare("SELECT id, name, email FROM users WHERE email = ?").get(email) as SessionUser | undefined;
  if (existing) return existing;
  const r = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(name, email) as { lastInsertRowid: number };
  return { id: r.lastInsertRowid as number, name, email };
}
