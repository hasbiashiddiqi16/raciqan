import { Suspense } from "react";
import { notFound } from "next/navigation";
import TasteBar from "@/components/TasteBar";
import TryButton from "@/components/TryButton";
import ReviewForm from "@/components/ReviewForm";
import ReportButton from "@/components/ReportButton";
import { getRecipeDetail } from "@/lib/data";

const H = "'Bricolage Grotesque', 'DM Sans', sans-serif";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getRecipeDetail(Number(id));
  if (!data) return { title: "RACIQAN" };
  return { title: `${data.recipe.title} — RACIQAN`, description: data.recipe.description || data.recipe.taste_description };
}

export const instant = false;

async function RecipeContent({ id }: { id: number }) {
  const data = getRecipeDetail(id);
  if (!data) notFound();
  const { recipe, ingredients, steps, try_count, reviews, inspired, averages } = data;

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 80px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Header card */}
      <div style={{ boxSizing: "border-box", padding: "32px 28px", border: "2px solid #12352B", borderRadius: 32, background: "#FFD257", display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ display: "inline-flex", alignSelf: "flex-start", padding: "6px 14px", borderRadius: 999, background: "#FFFFFF", fontWeight: 700, fontSize: 14, color: "#12352B", border: "2px solid #12352B" }}>{recipe.category}</span>
        <h1 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, color: "#12352B" }}>{recipe.title}</h1>
        <p style={{ margin: 0, color: "#3F5A4F", fontSize: 18, maxWidth: 720 }}>{recipe.description}</p>
        {recipe.taste_description && <p style={{ margin: 0, color: "#3F5A4F", fontSize: 16, fontStyle: "italic" }}>{recipe.taste_description}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 8 }}>
          <a href={`/kreator/${recipe.creator_id}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "#FFFFFF", border: "2px solid #12352B", fontWeight: 700, fontSize: 14, color: "#12352B", textDecoration: "none" }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#FF8A3D", border: "2px solid #12352B", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{recipe.creator_name?.[0]}</span>
            {recipe.creator_name}
          </a>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#3F5A4F" }}>{try_count} orang sudah mencoba</span>
        </div>
        {recipe.inspired_by_id && (
          <p style={{ margin: 0, fontSize: 15, color: "#12352B" }}>
            <span style={{ fontWeight: 700, color: "#FF8A3D" }}>Terinspirasi dari </span>
            {inspired && !inspired.deleted ? (
              <a href={`/resep/${inspired.id}`} style={{ fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4, color: "#12352B" }}>{inspired.title}</a>
            ) : (
              <span style={{ fontWeight: 700, fontStyle: "italic" }}>resep yang sudah dihapus</span>
            )}
          </p>
        )}
        <div style={{ marginTop: 8 }}>
          <a href={`/bagikan?inspired=${recipe.id}`} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 20px", borderRadius: 999, background: "#12352B", color: "#FFFFFF", fontWeight: 700, textDecoration: "none" }}>Racik ulang resep ini</a>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {/* Left column */}
        <div style={{ flex: "1 1 600px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <section style={{ boxSizing: "border-box", padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 24, color: "#12352B" }}>Bahan</h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {ingredients.map((ing: any) => (
                <li key={ing.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1.5px dashed #CFE3D2" }}>
                  <span style={{ color: "#12352B", fontWeight: 500 }}>{ing.name}</span>
                  {ing.amount && <span style={{ color: "#3F5A4F", fontWeight: 700, fontSize: 15 }}>{ing.amount}</span>}
                </li>
              ))}
            </ul>
          </section>

          <section style={{ boxSizing: "border-box", padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 24, color: "#12352B" }}>Langkah</h2>
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {steps.map((s: any, i: number) => (
                <li key={s.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", background: "#FF8A3D", border: "2px solid #12352B", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: H, fontWeight: 800, fontSize: 16, color: "#12352B" }}>{i + 1}</span>
                  <span style={{ color: "#12352B", paddingTop: 4, lineHeight: 1.5 }}>{s.text}</span>
                </li>
              ))}
            </ol>
          </section>

          {(recipe.caution || (ingredients || []).some((ing:any)=> /madu|honey/i.test(ing.name))) && (
            <section style={{ boxSizing: "border-box", padding: 20, border: "2px solid #12352B", borderRadius: 24, background: "#FFD9BF", display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 20, color: "#12352B" }}>Perlu diperhatikan</h2>
              {recipe.caution && <p style={{ margin: 0, color: "#12352B", fontSize: 15 }}>{recipe.caution}</p>}
              {(ingredients || []).some((ing:any)=> /madu|honey/i.test(ing.name)) && (
                <p style={{ margin: 0, color: "#12352B", fontSize: 15 }}>Madu tidak dianjurkan untuk bayi di bawah satu tahun.</p>
              )}
            </section>
          )}
          <section style={{ boxSizing: "border-box", padding: 20, border: "2px solid #12352B", borderRadius: 24, background: "#F4F8EE", display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0, color: "#3F5A4F", fontSize: 14 }}>Resep ini adalah kreasi pengguna. Pembaca bertanggung jawab atas kondisi dirinya, termasuk alergi.</p>
          </section>
          <section style={{ boxSizing: "border-box", padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 24, color: "#12352B" }}>Ulasan</h2>
              <ReportButton targetType="recipe" targetId={recipe.id} />
            </div>
            <ReviewForm recipeId={recipe.id} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
              {reviews.map((rv: any) => (
                <div key={rv.id} style={{ boxSizing: "border-box", padding: 18, border: "2px solid #12352B", borderRadius: 20, background: "#F4F8EE", display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ margin: 0, color: "#12352B", fontSize: 16 }}>{rv.text}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(JSON.parse(rv.labels || "[]") as string[]).map((l: string) => (
                      <span key={l} style={{ padding: "4px 12px", borderRadius: 999, background: "#E3EEDB", fontSize: 13, fontWeight: 700, color: "#12352B", border: "1.5px solid #12352B" }}>{l}</span>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: 13, color: "#3F5A4F" }}>
                    <span>Manis <b style={{ color: "#12352B" }}>{rv.manis}</b></span>
                    <span>Asam <b style={{ color: "#12352B" }}>{rv.asam}</b></span>
                    <span>Segar <b style={{ color: "#12352B" }}>{rv.segar}</b></span>
                    <span>Creamy <b style={{ color: "#12352B" }}>{rv.creamy}</b></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#3F5A4F" }}>— {rv.user_name}</p>
                    <ReportButton targetType="review" targetId={rv.id} />
                  </div>
                </div>
              ))}
              {reviews.length === 0 && <p style={{ color: "#3F5A4F" }}>Belum ada ulasan. Jadilah yang pertama!</p>}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <section style={{ boxSizing: "border-box", padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 90 }}>
            <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 22, color: "#12352B" }}>Skor Rasa</h2>
            {averages && averages.n > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <TasteBar label="Manis" value={Math.round(averages.manis || 0)} />
                <TasteBar label="Asam" value={Math.round(averages.asam || 0)} />
                <TasteBar label="Segar" value={Math.round(averages.segar || 0)} />
                <TasteBar label="Creamy" value={Math.round(averages.creamy || 0)} />
                <p style={{ margin: 0, fontSize: 13, color: "#3F5A4F" }}>Dari {averages.n} ulasan</p>
              </div>
            ) : (
              <p style={{ color: "#3F5A4F", fontSize: 15 }}>Belum ada ulasan.</p>
            )}
            <div style={{ borderTop: "2px dashed #CFE3D2", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 18, color: "#12352B" }}>Sudah mencoba?</h3>
              <TryButton recipeId={recipe.id} />
            </div>
            <a href={`/bagikan?inspired=${recipe.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 48, borderRadius: 999, background: "#2E7D4F", color: "#FFFFFF", fontWeight: 700, textDecoration: "none", marginTop: 4 }}>Racik ulang resep ini</a>
          </section>
        </div>
      </div>
    </div>
  );
}

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div style={{ maxWidth: 1160, margin: "0 auto", padding: 40, color: "#3F5A4F" }}>Memuat...</div>}>
      <RecipeContent id={Number(id)} />
    </Suspense>
  );
}
