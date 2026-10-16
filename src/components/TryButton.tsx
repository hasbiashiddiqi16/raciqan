"use client";
import { useEffect, useState } from "react";

export default function TryButton({ recipeId }: { recipeId: number }) {
  const [count, setCount] = useState<number | null>(null);
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/recipes/${recipeId}`).then(r => r.json()).then(d => {
      if (typeof d.try_count === "number") setCount(d.try_count);
    }).catch(() => {});
  }, [recipeId]);

  const tryIt = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/try`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipe_id: recipeId }) });
      if (res.status === 401) {
        window.location.href = `/masuk?next=${encodeURIComponent(`/resep/${recipeId}`)}`;
        return;
      }
      if (res.ok) {
        setTried(true);
        setCount(c => (c ?? 0) + 1);
      } else {
        const d = await res.json().catch(()=>({}));
        alert(d.error || "Gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={tryIt} disabled={loading || tried}
        style={{ minHeight: 44, padding: "0 20px", borderRadius: 999, border: "2px solid #12352B", background: tried ? "#2E7D4F" : "#FF8A3D", color: tried ? "#FFFFFF" : "#12352B", fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
        {tried ? "Sudah dicoba ✓" : "Saya sudah mencoba"}
      </button>
      {count !== null && <p style={{ margin: 0, fontSize: 14, color: "#3F5A4F" }}>{count} orang sudah mencoba</p>}
    </div>
  );
}
