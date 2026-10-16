import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rid = Number(id);
  const reviews = db.prepare(
    `SELECT rv.*, u.name as user_name FROM reviews rv JOIN users u ON u.id = rv.user_id WHERE rv.recipe_id = ? ORDER BY rv.created_at DESC`
  ).all(rid);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
  const { id } = await params;
  const rid = Number(id);
  // must have tried
  const tried = db.prepare("SELECT 1 FROM tries WHERE recipe_id = ? AND user_id = ?").get(rid, user.id);
  if (!tried) return NextResponse.json({ error: "Tandai sudah mencoba dulu" }, { status: 400 });
  const body = await req.json();
  const text = (body.text || "").trim();
  const labels = JSON.stringify(body.labels || []);
  const manis = Math.min(5, Math.max(1, Number(body.manis) || 3));
  const asam = Math.min(5, Math.max(1, Number(body.asam) || 3));
  const segar = Math.min(5, Math.max(1, Number(body.segar) || 3));
  const creamy = Math.min(5, Math.max(1, Number(body.creamy) || 3));
  try {
    db.prepare(
      "INSERT INTO reviews (recipe_id, user_id, text, labels, manis, asam, segar, creamy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(rid, user.id, text, labels, manis, asam, segar, creamy);
  } catch (e) {
    db.prepare(
      "UPDATE reviews SET text=?, labels=?, manis=?, asam=?, segar=?, creamy=?, updated_at=datetime('now') WHERE recipe_id=? AND user_id=?"
    ).run(text, labels, manis, asam, segar, creamy, rid, user.id);
  }
  return NextResponse.json({ ok: true });
}
