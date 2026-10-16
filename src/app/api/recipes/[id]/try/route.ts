import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
  const { id } = await params;
  const rid = Number(id);
  try {
    db.prepare("INSERT INTO tries (recipe_id, user_id) VALUES (?, ?)").run(rid, user.id);
  } catch (e) {
    // already tried
  }
  const count = (db.prepare("SELECT COUNT(*) as c FROM tries WHERE recipe_id = ?").get(rid) as any).c;
  return NextResponse.json({ ok: true, try_count: count });
}
