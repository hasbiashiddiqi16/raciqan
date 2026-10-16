import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  const body = await req.json();
  const target_type = body.target_type;
  const target_id = Number(body.target_id);
  const reason = (body.reason || "").trim();
  if (!target_type || !target_id) return NextResponse.json({ error: "Target wajib" }, { status: 400 });
  db.prepare("INSERT INTO reports (target_type, target_id, reporter_id, reason) VALUES (?, ?, ?, ?)").run(
    target_type, target_id, user ? user.id : null, reason
  );
  return NextResponse.json({ ok: true });
}
