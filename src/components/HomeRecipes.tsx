"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const H = "'Bricolage Grotesque', 'DM Sans', sans-serif";

const CATS = ["Semua", "Minuman dingin", "Minuman hangat", "Camilan"];
const catBg: Record<string, string> = {
  "Semua": "#FFFFFF",
  "Minuman dingin": "#DCEBFF",
  "Minuman hangat": "#FFD9BF",
  "Camilan": "#D9F0DD",
};
const recipeHeaderBg: Record<string, string> = {
  "Minuman dingin": "#DCEBFF",
  "Minuman hangat": "#FFD9BF",
  "Camilan": "#D9F0DD",
};

function HomeRecipesInner() {
  const sp = useSearchParams();
  const [category, setCategory] = useState(sp.get("category") || "Semua");
  const [q, setQ] = useState(sp.get("q") || "");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "Semua") params.set("category", category);
    if (q.trim()) params.set("q", q.trim());
    fetch(`/api/recipes?${params}`).then(r => r.json()).then(d => {
      setRecipes(d.recipes || []);
      setLoading(false);
    });
  }, [category, q]);


  return (
    <section id="resep" style={{ background: "#FFFFFF", borderTop: "2px solid #12352B", borderBottom: "2px solid #12352B" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, color: "#12352B" }}>Racikan untuk dicoba</h2>
          <p style={{ margin: 0, maxWidth: 560, color: "#3F5A4F" }}>Pilih satu kategori, lalu lihat bahan dan rasanya.</p>
        </div>

        <div role="group" aria-label="Kategori racikan" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {CATS.map(c => (
            <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={category === c}
              style={{ minHeight: 44, padding: "0 20px", border: "2px solid #12352B", borderRadius: 999, background: category === c ? "#12352B" : (catBg[c] || "#FFFFFF"), color: category === c ? "#FFFFFF" : "#12352B", fontFamily: "inherit", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              {c}
            </button>
          ))}
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari racikan..."
              style={{ height: 44, padding: "0 16px", border: "2px solid #12352B", borderRadius: 999, background: "#FFFFFF", color: "#12352B", fontFamily: "inherit", fontSize: 15, minWidth: 200 }} />
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 14, color: "#3F5A4F" }}>{loading ? "Memuat..." : `Menampilkan ${recipes.length} racikan`}</p>

        {loading ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {[1,2,3].map(i => <div key={i} style={{ flex: "1 1 320px", height: 260, borderRadius: 24, background: "#E3EEDB", border: "2px solid #12352B" }} />)}
          </div>
        ) : recipes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#3F5A4F" }}>
            <p style={{ fontSize: 18, fontWeight: 700 }}>Belum ada racikan yang cocok.</p>
            <p>Coba kata kunci lain atau pilih kategori Semua.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {recipes.map(r => {
              return (
                <article key={r.id} style={{ flex: "1 1 320px", maxWidth: "100%", minWidth: 0, display: "flex", flexDirection: "column", border: "2px solid #12352B", borderRadius: 24, overflow: "hidden", background: "#FFFFFF" }}>
                  <div style={{ background: recipeHeaderBg[r.category] || "#E3EEDB", padding: 24, display: "flex", flexDirection: "column", gap: 14, minHeight: 120, borderBottom: "2px solid #12352B" }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#12352B" }}>{r.category}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ padding: "4px 12px", borderRadius: 999, background: "#FFFFFF", fontSize: 15, fontWeight: 700, color: "#12352B", border: "1.5px solid #12352B" }}>{r.title}</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 10, flex: "1 1 auto" }}>
                    <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 24, lineHeight: 1.15, color: "#12352B" }}>{r.title}</h3>
                    <p style={{ margin: 0, color: "#3F5A4F", fontSize: 16 }}>{r.description}</p>
                    <a href={`/resep/${r.id}`} style={{ marginTop: "auto", paddingTop: 8, display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4, color: "#12352B" }}>
                      Lihat resep
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomeRecipes() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "#3F5A4F", textAlign: "center" }}>Memuat...</div>}>
      <HomeRecipesInner />
    </Suspense>
  );
}
