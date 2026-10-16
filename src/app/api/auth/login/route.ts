import { NextResponse } from "next/server";
import { findOrCreateUser, setSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  if (!name || !email) return NextResponse.json({ error: "Nama dan email wajib" }, { status: 400 });
  const user = findOrCreateUser(name, email);
  await setSession(user.id);
  return NextResponse.json({ user });
}
