import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rid = Number(id);
  const recipe = db.prepare(
    `SELECT r.*, u.name as creator_name FROM recipes r LEFT JOIN users u ON u.id = r.creator_id WHERE r.id = ?`
  ).get(rid) as any;
  if (!recipe) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  const ingredients = db.prepare("SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY sort_order").all(rid);
  const steps = db.prepare("SELECT * FROM steps WHERE recipe_id = ? ORDER BY sort_order").all(rid);
  const try_count = (db.prepare("SELECT COUNT(*) as c FROM tries WHERE recipe_id = ?").get(rid) as any).c;
  const reviews = db.prepare(
    `SELECT rv.*, u.name as user_name FROM reviews rv JOIN users u ON u.id = rv.user_id WHERE rv.recipe_id = ? ORDER BY rv.created_at DESC`
  ).all(rid);
  const inspired = recipe.inspired_by_id
    ? db.prepare("SELECT id, title FROM recipes WHERE id = ?").get(recipe.inspired_by_id)
    : null;
  // taste averages
  const avg = db.prepare(
    `SELECT AVG(manis) as manis, AVG(asam) as asam, AVG(segar) as segar, AVG(creamy) as creamy, COUNT(*) as n FROM reviews WHERE recipe_id = ?`
  ).get(rid) as any;
  return NextResponse.json({ recipe, ingredients, steps, try_count, reviews, inspired, averages: avg });
}
