export default function RecipeCard({ recipe }: { recipe: any }) {
  const H = "'Bricolage Grotesque', 'DM Sans', sans-serif";
  return (
    <article style={{ flex: "1 1 320px", border: "2px solid #12352B", borderRadius: 24, overflow: "hidden", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#E3EEDB", padding: 24, borderBottom: "2px solid #12352B" }}>
        <p style={{ margin: 0, fontWeight: 700, color: "#12352B" }}>{recipe.category}</p>
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 22, color: "#12352B" }}>{recipe.title}</h3>
        <p style={{ margin: 0, color: "#3F5A4F" }}>{recipe.description}</p>
        <a href={`/resep/${recipe.id}`} style={{ marginTop: "auto", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4, color: "#12352B" }}>Lihat resep</a>
      </div>
    </article>
  );
}
