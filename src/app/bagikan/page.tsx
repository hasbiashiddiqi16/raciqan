"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const H = "'Bricolage Grotesque', 'DM Sans', sans-serif";

const inputStyle = { height: 48, padding: "0 16px", borderRadius: 16, border: "2px solid #12352B", background: "#FFFFFF", color: "#12352B", fontFamily: "inherit", fontSize: 15, boxSizing: "border-box" as const, width: "100%" };

function BagikanForm() {
  const sp = useSearchParams();
  const inspired = sp.get("inspired");
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Minuman dingin");
  const [description, setDescription] = useState("");
  const [taste, setTaste] = useState("");
  const [caution, setCaution] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState([""]);
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.user) {
        const next = inspired ? `/bagikan?inspired=${inspired}` : "/bagikan";
        window.location.href = `/masuk?next=${encodeURIComponent(next)}`;
      }
      setUser(d.user);
    });
  }, [inspired]);

  useEffect(() => {
    if (!inspired) return;
    fetch(`/api/recipes/${inspired}`).then(r => r.json()).then(d => {
      if (d.recipe) {
        setTitle(d.recipe.title ? `${d.recipe.title} Plus` : "");
        setCategory(d.recipe.category || "Minuman dingin");
        setDescription(d.recipe.description || "");
        setTaste(d.recipe.taste_description || "");
        setCaution(d.recipe.caution || "");
        if (Array.isArray(d.ingredients) && d.ingredients.length) {
          setIngredients(d.ingredients.map((i:any) => ({ name: i.name || "", amount: i.amount || "" })));
        }
        if (Array.isArray(d.steps) && d.steps.length) {
          setSteps(d.steps.map((st:any) => (typeof st === "string" ? st : st.text || "")));
        }
      }
    }).catch(() => {});
  }, [inspired]);

  function addIng() { setIngredients([...ingredients, { name: "", amount: "" }]); }
  function addStep() { setSteps([...steps, ""]); }
  function removeIng(i: number) { setIngredients(ingredients.filter((_, idx) => idx !== i)); }
  function removeStep(i: number) { setSteps(steps.filter((_, idx) => idx !== i)); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, category, description, taste_description: taste, caution,
        ingredients: ingredients.filter(i => i.name.trim()),
        steps: steps.filter(s => s.trim()),
        inspired_by_id: inspired ? Number(inspired) : null,
      }),
    });
    const d = await res.json();
    if (res.ok) {
      window.location.href = `/resep/${d.id}`;
    } else {
      setMsg(d.error || "Gagal membagikan");
    }
    setSubmitting(false);
  }

  if (!user) return <div style={{ maxWidth: 720, margin: "0 auto", padding: 40, color: "#3F5A4F" }}>Memuat...</div>;

  const card = { boxSizing: "border-box" as const, padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column" as const, gap: 16 };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#FF8A3D", textTransform: "uppercase", letterSpacing: "0.1em" }}>Bagikan</p>
        <h1 style={{ margin: "4px 0 0", fontFamily: H, fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "#12352B" }}>Bagikan racikanmu</h1>
        {inspired && <p style={{ margin: "8px 0 0", color: "#FF8A3D", fontWeight: 700, fontSize: 15 }}>✨ Meracik ulang dari resep #{inspired}</p>}
        <p style={{ margin: "8px 0 0", color: "#3F5A4F", fontSize: 16 }}>Isi detail resep, lalu terbitkan. Ada pratinjau sebelum terbit.</p>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={card}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#3F5A4F" }}>Nama racikan</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Misal: Segar Madu Plus" required style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#3F5A4F" }}>Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                <option>Minuman dingin</option>
                <option>Minuman hangat</option>
                <option>Camilan</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#3F5A4F" }}>Deskripsi rasa</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Satu kalimat" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#3F5A4F" }}>Catatan rasa (opsional)</label>
            <textarea value={taste} onChange={e => setTaste(e.target.value)} placeholder="Deskripsi rasa tambahan"
              style={{ ...inputStyle, height: 80, padding: 12, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#3F5A4F" }}>Perlu diperhatikan (alergen, opsional)</label>
            <input value={caution} onChange={e => setCaution(e.target.value)} placeholder="Misal: mengandung susu, kacang, madu" style={inputStyle} />
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 20, color: "#12352B" }}>Bahan</h3>
            <button type="button" onClick={addIng} style={{ background: "none", border: "none", color: "#2E7D4F", fontWeight: 700, cursor: "pointer" }}>+ Tambah</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <input value={ing.name} onChange={e => { const a = [...ingredients]; a[i].name = e.target.value; setIngredients(a); }} placeholder="Nama bahan" style={{ ...inputStyle, flex: 1 }} />
                <input value={ing.amount} onChange={e => { const a = [...ingredients]; a[i].amount = e.target.value; setIngredients(a); }} placeholder="Takaran" style={{ ...inputStyle, width: 120 }} />
                {ingredients.length > 1 && <button type="button" onClick={() => removeIng(i)} style={{ padding: "0 8px", border: "2px solid #12352B", borderRadius: 12, background: "#FFFFFF", cursor: "pointer" }}>✕</button>}
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 20, color: "#12352B" }}>Langkah</h3>
            <button type="button" onClick={addStep} style={{ background: "none", border: "none", color: "#2E7D4F", fontWeight: 700, cursor: "pointer" }}>+ Tambah</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", background: "#FF8A3D", border: "2px solid #12352B", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: H, fontWeight: 800, fontSize: 16, color: "#12352B" }}>{i + 1}</span>
                <input value={s} onChange={e => { const a = [...steps]; a[i] = e.target.value; setSteps(a); }} placeholder={`Langkah ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
                {steps.length > 1 && <button type="button" onClick={() => removeStep(i)} style={{ padding: "0 8px", border: "2px solid #12352B", borderRadius: 12, background: "#FFFFFF", cursor: "pointer" }}>✕</button>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button type="button" onClick={() => setPreview(!preview)}
            style={{ padding: "0 20px", minHeight: 48, borderRadius: 999, border: "2px solid #12352B", background: "#FFFFFF", color: "#12352B", fontWeight: 700, cursor: "pointer" }}>
            {preview ? "Tutup pratinjau" : "Pratinjau"}
          </button>
          <button type="submit" disabled={submitting}
            style={{ flex: 1, minHeight: 48, borderRadius: 999, border: "2px solid #12352B", background: "#12352B", color: "#FFFFFF", fontWeight: 700, cursor: submitting ? "wait" : "pointer" }}>
            {submitting ? "Menerbitkan..." : "Terbitkan resep"}
          </button>
        </div>

        {preview && (
          <div style={{ boxSizing: "border-box", padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#F4F8EE" }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#3F5A4F", textTransform: "uppercase", letterSpacing: "0.1em" }}>Pratinjau</p>
            <h3 style={{ margin: "8px 0 0", fontFamily: H, fontWeight: 800, fontSize: 22, color: "#12352B" }}>{title || "Nama racikan"}</h3>
            <p style={{ margin: "4px 0 0", color: "#3F5A4F", fontSize: 14 }}>{category}</p>
            {description && <p style={{ margin: "8px 0 0", color: "#12352B" }}>{description}</p>}
            {taste && <p style={{ margin: "4px 0 0", color: "#3F5A4F", fontStyle: "italic" }}>{taste}</p>}
            <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {ingredients.filter(i => i.name.trim()).map((i, idx) => <li key={idx} style={{ color: "#12352B" }}>• {i.name} {i.amount && <span style={{ color: "#3F5A4F" }}>— {i.amount}</span>}</li>)}
            </ul>
            <ol style={{ margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              {steps.filter(s => s.trim()).map((s, idx) => <li key={idx} style={{ color: "#12352B" }}>{s}</li>)}
            </ol>
          </div>
        )}

        {msg && <p style={{ margin: 0, color: "#FF8A3D", fontWeight: 700, textAlign: "center" }}>{msg}</p>}
      </form>
    </div>
  );
}

export default function BagikanPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 760, margin: "0 auto", padding: 40, color: "#3F5A4F" }}>Memuat...</div>}>
      <BagikanForm />
    </Suspense>
  );
}
