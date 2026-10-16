"use client";
export default function TasteBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  const colors: Record<string, string> = {
    Manis: "#E8A317",
    Asam: "#FF8A3D",
    Segar: "#2E7D4F",
    Creamy: "#7A5C3E",
  };
  const c = colors[label] || "#FF8A3D";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#12352B" }}>
        <span>{label}</span><span>{value} dari 5</span>
      </div>
      <div style={{ height: 14, borderRadius: 999, background: "#E3EEDB" }}>
        <div style={{ width: `${pct}%`, height: 14, borderRadius: 999, background: c, transition: "width 0.7s ease" }} />
      </div>
    </div>
  );
}
