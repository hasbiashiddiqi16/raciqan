import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uid = Number(id);
  const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(uid);
  if (!user) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  const recipes = db.prepare(
    `SELECT r.*, (SELECT COUNT(*) FROM tries t WHERE t.recipe_id = r.id) as try_count,
     (SELECT COUNT(*) FROM reviews rv WHERE rv.recipe_id = r.id) as review_count
     FROM recipes r WHERE r.creator_id = ? AND r.status='published' ORDER BY r.created_at DESC`
  ).all(uid);
  return NextResponse.json({ user, recipes });
}
