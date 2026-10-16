"use client";
import { useState } from "react";

const LABELS = ["Sesuai ekspektasi", "Perlu kurangi manis", "Perlu tambah manis", "Segar", "Creamy", "Kurang asam", "Pas"];

export default function ReviewForm({ recipeId }: { recipeId: number }) {
  const [text, setText] = useState("");
  const [manis, setManis] = useState(3);
  const [asam, setAsam] = useState(3);
  const [segar, setSegar] = useState(3);
  const [creamy, setCreamy] = useState(3);
  const [labels, setLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (l: string) => setLabels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

  const submit = async () => {
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/reviews`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipe_id: recipeId, text, manis, asam, segar, creamy, labels }) });
      const d = await res.json();
      if (res.status === 401) { window.location.href = `/masuk?next=${encodeURIComponent(`/resep/${recipeId}`)}`; return; }
      if (!res.ok) { setStatus(d.error || "Gagal"); return; }
      setStatus("Ulasan terkirim. Terima kasih!");
      setText("");
    } catch {
      setStatus("Gagal mengirim");
    } finally {
      setSubmitting(false);
    }
  };

  const slider = (label: string, val: number, set: (n: number) => void) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#12352B" }}>
        <span>{label}</span><span>{val}/5</span>
      </div>
      <input type="range" min={1} max={5} value={val} onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "#FF8A3D" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 20, border: "2px solid #12352B", borderRadius: 20, background: "#F4F8EE" }}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Tulis ulasanmu..."
        style={{ width: "100%", minHeight: 90, padding: 12, borderRadius: 16, border: "2px solid #12352B", background: "#FFFFFF", color: "#12352B", fontFamily: "inherit", fontSize: 15, resize: "vertical", boxSizing: "border-box" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {slider("Manis", manis, setManis)}
        {slider("Asam", asam, setAsam)}
        {slider("Segar", segar, setSegar)}
        {slider("Creamy", creamy, setCreamy)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {LABELS.map(l => (
          <button key={l} type="button" onClick={() => toggle(l)}
            style={{ padding: "6px 14px", borderRadius: 999, border: "2px solid #12352B", background: labels.includes(l) ? "#FF8A3D" : "#FFFFFF", color: "#12352B", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>
      <button onClick={submit} disabled={submitting}
        style={{ minHeight: 44, padding: "0 20px", borderRadius: 999, border: "2px solid #12352B", background: "#12352B", color: "#FFFFFF", fontWeight: 700, cursor: submitting ? "wait" : "pointer", alignSelf: "flex-start" }}>
        {submitting ? "Mengirim..." : "Kirim ulasan"}
      </button>
      {status && <p style={{ margin: 0, color: "#2E7D4F", fontWeight: 700 }}>{status}</p>}
    </div>
  );
}
