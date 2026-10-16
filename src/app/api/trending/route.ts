import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const rows = db.prepare(
    `SELECT r.id, r.title, r.category, r.description, r.creator_id,
      u.name as creator_name,
      (SELECT COUNT(*) FROM tries t WHERE t.recipe_id = r.id AND t.created_at >= datetime('now','-7 days')) as try_count_7d,
      (SELECT COUNT(*) FROM reviews rv WHERE rv.recipe_id = r.id AND rv.created_at >= datetime('now','-7 days')) as review_count_7d,
      (SELECT COUNT(*) FROM tries t WHERE t.recipe_id = r.id) as try_count
     FROM recipes r LEFT JOIN users u ON u.id = r.creator_id
     WHERE r.status = 'published'
     ORDER BY (try_count_7d + review_count_7d) DESC, try_count DESC
     LIMIT 4`
  ).all();
  return NextResponse.json({ recipes: rows });
}
