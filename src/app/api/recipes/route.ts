import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const category = url.searchParams.get("category") || "";
  let sql = `SELECT r.id, r.title, r.category, r.description, r.taste_description, r.creator_id, r.inspired_by_id, r.created_at,
    u.name as creator_name,
    (SELECT COUNT(*) FROM tries t WHERE t.recipe_id = r.id) as try_count,
    (SELECT COUNT(*) FROM reviews rv WHERE rv.recipe_id = r.id) as review_count
    FROM recipes r LEFT JOIN users u ON u.id = r.creator_id
    WHERE r.status = 'published'`;
  const params: any[] = [];
  if (category && category !== "Semua") {
    sql += " AND r.category = ?";
    params.push(category);
  }
  if (q) {
    sql += " AND (LOWER(r.title) LIKE ? OR EXISTS (SELECT 1 FROM ingredients i WHERE i.recipe_id = r.id AND LOWER(i.name) LIKE ?))";
    params.push(`%${q}%`, `%${q}%`);
  }
  sql += " ORDER BY r.created_at DESC";
  const rows = db.prepare(sql).all(...params);
  return NextResponse.json({ recipes: rows });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
  const body = await req.json();
  const title = (body.title || "").trim();
  const category = (body.category || "").trim();
  const description = (body.description || "").trim();
  const taste_description = (body.taste_description || "").trim();
  const caution = (body.caution || "").trim();
  const ingredients = body.ingredients || [];
  const steps = body.steps || [];
  const inspired_by_id = body.inspired_by_id ? Number(body.inspired_by_id) : null;
  if (!title || !category) return NextResponse.json({ error: "Nama dan kategori wajib" }, { status: 400 });
  // basic automated moderation
  const forbidden = ["http://", "https://", "www.", ".com", "jual", "beli", "obat", "penyakit", "sembuh", "racun", "narkoba"];
  const combined = (title + " " + description + " " + taste_description + " " + caution + " " + ingredients.map((i:any)=>i.name).join(" ") + " " + (body.steps||[]).join(" ")).toLowerCase();
  for (const w of forbidden) {
    if (combined.includes(w)) {
      return NextResponse.json({ error: "Resep ditolak pemeriksaan otomatis: mengandung kata/tautan yang tidak diperbolehkan." }, { status: 400 });
    }
  }
  if (ingredients.length === 0 || !ingredients.some((i:any)=> (i.name||"").trim())) {
    return NextResponse.json({ error: "Minimal satu bahan wajib diisi." }, { status: 400 });
  }
  if ((body.steps||[]).filter((s:any)=> (typeof s==="string"?s:s.text||"").trim()).length === 0) {
    return NextResponse.json({ error: "Minimal satu langkah wajib diisi." }, { status: 400 });
  }
  const r = db.prepare(
    "INSERT INTO recipes (title, category, description, taste_description, caution, creator_id, inspired_by_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'published')"
  ).run(title, category, description, taste_description, caution, user.id, inspired_by_id) as { lastInsertRowid: number };
  const rid = r.lastInsertRowid as number;
  ingredients.forEach((ing: any, i: number) => {
    db.prepare("INSERT INTO ingredients (recipe_id, name, amount, sort_order) VALUES (?, ?, ?, ?)").run(rid, ing.name || "", ing.amount || "", i);
  });
  steps.forEach((s: any, i: number) => {
    db.prepare("INSERT INTO steps (recipe_id, text, sort_order) VALUES (?, ?, ?)").run(rid, typeof s === "string" ? s : s.text, i);
  });
  return NextResponse.json({ id: rid });
}
