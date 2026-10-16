"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const H = "'Bricolage Grotesque', 'DM Sans', sans-serif";

function MasukForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const endpoint = "/api/auth/login";
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: name || email.split("@")[0] }) });
      const d = await res.json();
      if (!res.ok) { setStatus(d.error || "Gagal"); return; }
      router.push(next);
      router.refresh();
    } catch {
      setStatus("Gagal mengirim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 24px 80px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ boxSizing: "border-box", padding: 32, border: "2px solid #12352B", borderRadius: 32, background: "#FFE9A8", display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", color: "#12352B" }}>Masuk</h1>
        <p style={{ margin: 0, color: "#3F5A4F", fontSize: 16 }}>Login ringan untuk review dan bagikan racikan.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setMode("login")} style={{ flex: 1, minHeight: 44, borderRadius: 999, border: "2px solid #12352B", background: mode === "login" ? "#12352B" : "#FFFFFF", color: mode === "login" ? "#FFFFFF" : "#12352B", fontWeight: 700, cursor: "pointer" }}>Masuk</button>
          <button onClick={() => setMode("register")} style={{ flex: 1, minHeight: 44, borderRadius: 999, border: "2px solid #12352B", background: mode === "register" ? "#12352B" : "#FFFFFF", color: mode === "register" ? "#FFFFFF" : "#12352B", fontWeight: 700, cursor: "pointer" }}>Daftar</button>
        </div>
        {mode === "register" && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama"
            style={{ height: 48, padding: "0 16px", borderRadius: 16, border: "2px solid #12352B", background: "#FFFFFF", color: "#12352B", fontFamily: "inherit", fontSize: 15, boxSizing: "border-box", width: "100%" }} />
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email"
          style={{ height: 48, padding: "0 16px", borderRadius: 16, border: "2px solid #12352B", background: "#FFFFFF", color: "#12352B", fontFamily: "inherit", fontSize: 15, boxSizing: "border-box", width: "100%" }} />
        <button onClick={submit} disabled={loading}
          style={{ minHeight: 48, borderRadius: 999, border: "2px solid #12352B", background: "#FF8A3D", color: "#12352B", fontWeight: 700, cursor: loading ? "wait" : "pointer" }}>
          {loading ? "Memproses..." : (mode === "login" ? "Masuk" : "Daftar")}
        </button>
        {status && <p style={{ margin: 0, color: "#FF8A3D", fontWeight: 700 }}>{status}</p>}
      </div>
    </div>
  );
}


export default function MasukPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 520, margin: "0 auto", padding: 60, color: "#3F5A4F" }}>Memuat...</div>}>
      <MasukForm />
    </Suspense>
  );
}
