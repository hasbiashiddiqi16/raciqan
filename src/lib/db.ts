import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "raciqan.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  taste_description TEXT NOT NULL DEFAULT '',
  caution TEXT NOT NULL DEFAULT '',
  creator_id INTEGER,
  inspired_by_id INTEGER,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  amount TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(recipe_id, user_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  labels TEXT NOT NULL DEFAULT '[]',
  manis INTEGER NOT NULL DEFAULT 3,
  asam INTEGER NOT NULL DEFAULT 3,
  segar INTEGER NOT NULL DEFAULT 3,
  creamy INTEGER NOT NULL DEFAULT 3,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(recipe_id, user_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_type TEXT NOT NULL,
  target_id INTEGER NOT NULL,
  reporter_id INTEGER,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);
`);

// Migration: ensure caution column exists on older databases
try { db.exec("ALTER TABLE recipes ADD COLUMN caution TEXT NOT NULL DEFAULT ''"); } catch { /* already exists */ }

export default db;

// Seed on first run
const _seedCount = (db.prepare("SELECT COUNT(*) as c FROM recipes").get() as { c: number }).c;
if (_seedCount === 0) {
  const insertUser = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  const u1 = insertUser.run("Oceana Luma", "oceana@raciqan.id").lastInsertRowid as number;
  const u2 = insertUser.run("Budi Santoso", "budi@raciqan.id").lastInsertRowid as number;
  const u3 = insertUser.run("Sari Dewi", "sari@raciqan.id").lastInsertRowid as number;

  const insertRecipe = db.prepare(
    "INSERT INTO recipes (title, category, description, taste_description, creator_id, inspired_by_id, status) VALUES (?, ?, ?, ?, ?, ?, 'published')"
  );
  const insertIng = db.prepare(
    "INSERT INTO ingredients (recipe_id, name, amount, sort_order) VALUES (?, ?, ?, ?)"
  );
  const insertStep = db.prepare(
    "INSERT INTO steps (recipe_id, text, sort_order) VALUES (?, ?, ?)"
  );

  const recipes = [
    { title: "Segar Madu", category: "Minuman dingin", description: "Es jeruk dipadu Nutrisari dan madu, segar manis.", taste: "Manis segar dengan sentuhan asam jeruk.", creator: u1, inspired: null as number | null,
      ingredients: [["Es jeruk","1 gelas"],["Nutrisari jeruk","1 sachet"],["Madu","1 sdm"],["Air dingin","100 ml"]],
      steps: ["Siapkan gelas berisi es batu.","Tuang es jeruk dan Nutrisari.","Tambahkan madu, aduk rata.","Sajikan dingin."] },
    { title: "Cokelat Hangat Jahe", category: "Minuman hangat", description: "Cokelat hangat dengan sentuhan jahe yang menghangatkan.", taste: "Creamy manis dengan pedas jahe ringan.", creator: u2, inspired: null,
      ingredients: [["Susu cokelat","200 ml"],["Jahe parut","1/2 sdt"],["Gula","1 sdt"],["Kayu manis","sejumput"]],
      steps: ["Panaskan susu cokelat.","Tambahkan jahe parut dan gula.","Aduk hingga rata.","Tabur kayu manis, sajikan hangat."] },
    { title: "Keripik Singkong Balado", category: "Camilan", description: "Keripik singkong renyah dengan bumbu balado pedas.", taste: "Gurih pedas dengan aroma jeruk nipis.", creator: u3, inspired: null,
      ingredients: [["Singkong","500 g"],["Bumbu balado","2 sdm"],["Minyak goreng","secukupnya"],["Jeruk nipis","1/2 buah"]],
      steps: ["Iris singkong tipis.","Goreng hingga kering.","Campur dengan bumbu balado.","Perciki jeruk nipis, sajikan."] },
    { title: "Es Teh Lemon Madu", category: "Minuman dingin", description: "Es teh dengan lemon dan madu, segar dan menenangkan.", taste: "Asam segar dengan manis madu.", creator: u1, inspired: null,
      ingredients: [["Teh celup","1 kantong"],["Lemon","1/2 buah"],["Madu","1 sdm"],["Es batu","secukupnya"]],
      steps: ["Seduh teh, dinginkan.","Peras lemon ke dalam teh.","Tambahkan madu, aduk.","Sajikan dengan es batu."] },
    { title: "Susu Jahe Hangat", category: "Minuman hangat", description: "Susu hangat dengan jahe, cocok untuk malam hari.", taste: "Creamy hangat dengan pedas jahe.", creator: u2, inspired: null,
      ingredients: [["Susu","200 ml"],["Jahe","1 ruas"],["Gula merah","1 sdt"]],
      steps: ["Rebus jahe dalam air.","Tambahkan susu dan gula merah.","Aduk hingga hangat, sajikan."] },
    { title: "Pisang Goreng Keju", category: "Camilan", description: "Pisang goreng renyah dengan taburan keju.", taste: "Manis gurih dengan aroma keju.", creator: u3, inspired: null,
      ingredients: [["Pisang","4 buah"],["Tepung","100 g"],["Keju parut","50 g"],["Minyak","secukupnya"]],
      steps: ["Celup pisang ke tepung.","Goreng hingga keemasan.","Tabur keju parut, sajikan hangat."] },
  ];

  const ids: number[] = [];
  for (const rec of recipes) {
    const rid = insertRecipe.run(rec.title, rec.category, rec.description, rec.taste, rec.creator, rec.inspired) as { lastInsertRowid: number };
    const ridn = rid.lastInsertRowid as number;
    ids.push(ridn);
    rec.ingredients.forEach((ing, i) => insertIng.run(ridn, ing[0], ing[1], i));
    rec.steps.forEach((s, i) => insertStep.run(ridn, s, i));
  }
  // remix recipe inspired by first
  const remixId = insertRecipe.run("Segar Madu Plus", "Minuman dingin", "Racik ulang Segar Madu dengan tambahan mint.", "Segar mint dengan manis madu.", u2, ids[0]) as { lastInsertRowid: number };
  const remixN = remixId.lastInsertRowid as number;
  [["Es jeruk","1 gelas"],["Nutrisari jeruk","1 sachet"],["Madu","1 sdm"],["Daun mint","3 lembar"]].forEach((ing, i) => insertIng.run(remixN, ing[0], ing[1], i));
  ["Siapkan gelas berisi es batu.","Tuang es jeruk dan Nutrisari.","Tambahkan madu dan mint, aduk.","Sajikan dingin."].forEach((s, i) => insertStep.run(remixN, s, i));
  ids.push(remixN);

  const insertTry = db.prepare("INSERT OR IGNORE INTO tries (recipe_id, user_id) VALUES (?, ?)");
  const insertReview = db.prepare(
    "INSERT OR REPLACE INTO reviews (recipe_id, user_id, text, labels, manis, asam, segar, creamy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const users = [u1, u2, u3];
  for (let i = 0; i < 4; i++) {
    const rid = ids[i];
    for (const uid of users) insertTry.run(rid, uid);
    insertReview.run(rid, users[0], "Enak dan segar!", '["Sesuai ekspektasi"]', 4, 2, 5, 1);
    insertReview.run(rid, users[1], "Perlu kurangi manis.", '["Perlu kurangi manis"]', 5, 1, 4, 2);
  }
  // extra tries for first recipe
  insertTry.run(ids[0], u1);
  insertTry.run(ids[0], u2);
  insertTry.run(ids[0], u3);
}
