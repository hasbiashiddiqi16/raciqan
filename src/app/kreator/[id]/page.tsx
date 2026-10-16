import { notFound } from "next/navigation";
import { getCreator } from "@/lib/data";

const H = "'Bricolage Grotesque', 'DM Sans', sans-serif";

export const instant = false;

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getCreator(Number(id));
  if (!data) notFound();
  const { user, recipes } = data;
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 80px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ boxSizing: "border-box", padding: 32, border: "2px solid #12352B", borderRadius: 32, background: "#FFD9BF", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 72, height: 72, borderRadius: "50%", background: "#FF8A3D", border: "2px solid #12352B", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: H, fontWeight: 800, fontSize: 32, color: "#12352B" }}>{user.name?.[0]}</span>
          <div>
            <h1 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "#12352B" }}>{user.name}</h1>
            <p style={{ margin: 0, color: "#3F5A4F", fontSize: 15 }}>Kreator RACIQAN</p>
          </div>
        </div>
        <p style={{ margin: 0, color: "#3F5A4F", fontSize: 16 }}>{recipes.length} racikan dipublikasikan</p>
      </div>

      <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 28, color: "#12352B" }}>Racikan dari {user.name}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {recipes.map((r: any) => (
          <a key={r.id} href={`/resep/${r.id}`} style={{ flex: "1 1 300px", boxSizing: "border-box", padding: 20, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", textDecoration: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3F5A4F" }}>{r.category}</span>
            <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 22, color: "#12352B" }}>{r.title}</h3>
            <p style={{ margin: 0, color: "#3F5A4F", fontSize: 15 }}>{r.description}</p>
            <span style={{ marginTop: "auto", fontSize: 14, fontWeight: 700, color: "#2E7D4F" }}>{r.try_count} mencoba · {r.review_count} ulasan</span>
          </a>
        ))}
        {recipes.length === 0 && <p style={{ color: "#3F5A4F" }}>Belum ada racikan.</p>}
      </div>
    </div>
  );
}
