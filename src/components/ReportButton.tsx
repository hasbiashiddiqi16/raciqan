"use client";
import { useState } from "react";

const REASONS = ["Tidak pantas", "Spam", "Tidak aman", "Lainnya"];

export default function ReportButton({ targetType, targetId }: { targetType: "recipe" | "review"; targetId: number }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target_type: targetType, target_id: targetId, reason }) });
      if (res.ok) { setStatus("Laporan terkirim."); setOpen(false); }
      else { const d = await res.json(); setStatus(d.error || "Gagal"); }
    } catch { setStatus("Gagal"); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ display: "inline-block" }}>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: "#3F5A4F", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Laporkan</button>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <select value={reason} onChange={e => setReason(e.target.value)} style={{ height: 36, padding: "0 10px", borderRadius: 12, border: "2px solid #12352B", background: "#FFFFFF", color: "#12352B", fontSize: 13 }}>
            {REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <button onClick={submit} disabled={submitting} style={{ height: 36, padding: "0 12px", borderRadius: 12, border: "2px solid #12352B", background: "#FF8A3D", color: "#12352B", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Kirim</button>
          <button onClick={() => setOpen(false)} style={{ height: 36, padding: "0 12px", borderRadius: 12, border: "2px solid #12352B", background: "#FFFFFF", color: "#12352B", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Batal</button>
        </div>
      )}
      {status && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#2E7D4F", fontWeight: 700 }}>{status}</p>}
    </div>
  );
}
