import db from "./db";

export function getRecipeDetail(id: number) {
  const recipe = db.prepare(
    `SELECT r.*, u.name as creator_name FROM recipes r LEFT JOIN users u ON u.id = r.creator_id WHERE r.id = ?`
  ).get(id) as any;
  if (!recipe) return null;
  const ingredients = db.prepare("SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY sort_order").all(id);
  const steps = db.prepare("SELECT * FROM steps WHERE recipe_id = ? ORDER BY sort_order").all(id);
  const try_count = (db.prepare("SELECT COUNT(*) as c FROM tries WHERE recipe_id = ?").get(id) as any).c;
  const reviews = db.prepare(
    `SELECT rv.*, u.name as user_name FROM reviews rv JOIN users u ON u.id = rv.user_id WHERE rv.recipe_id = ? ORDER BY rv.created_at DESC`
  ).all(id);
  let inspired: { id: number; title: string; deleted?: boolean } | null = null;
  if (recipe.inspired_by_id) {
    const row = db.prepare("SELECT id, title FROM recipes WHERE id = ?").get(recipe.inspired_by_id) as { id: number; title: string } | undefined;
    if (row) inspired = row;
    else inspired = { id: recipe.inspired_by_id, title: "", deleted: true };
  }
  const avg = db.prepare(
    `SELECT AVG(manis) as manis, AVG(asam) as asam, AVG(segar) as segar, AVG(creamy) as creamy, COUNT(*) as n FROM reviews WHERE recipe_id = ?`
  ).get(id) as any;
  return { recipe, ingredients, steps, try_count, reviews, inspired, averages: avg };
}

export function getCreator(id: number) {
  const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(id) as any;
  if (!user) return null;
  const recipes = db.prepare(
    `SELECT r.*, (SELECT COUNT(*) FROM tries t WHERE t.recipe_id = r.id) as try_count,
     (SELECT COUNT(*) FROM reviews rv WHERE rv.recipe_id = r.id) as review_count
     FROM recipes r WHERE r.creator_id = ? AND r.status='published' ORDER BY r.created_at DESC`
  ).all(id);
  return { user, recipes };
}

export function getTrending() {
  return db.prepare(
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
}

export function listRecipes(opts: { q?: string; category?: string }) {
  const q = (opts.q || "").trim().toLowerCase();
  const category = opts.category || "";
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
  return db.prepare(sql).all(...params);
}
