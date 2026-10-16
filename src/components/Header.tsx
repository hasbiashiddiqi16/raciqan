"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const LogoSvg = () => (
  <svg aria-hidden="true" width="42" height="42" viewBox="0 0 42 42" style={{ margin: "0 1px", flex: "none" }}>
    <circle cx="19" cy="19" r="15" fill="#FF8A3D" stroke="#12352B" strokeWidth="3.5" />
    <circle cx="19" cy="19" r="10.5" fill="none" stroke="#FFE9A8" strokeWidth="1.8" />
    <path d="M19 8.5v21M8.5 19h21M11.6 11.6l14.8 14.8M26.4 11.6L11.6 26.4" stroke="#FFE9A8" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M28 28l10 10" stroke="#12352B" strokeWidth="5.5" strokeLinecap="round" />
  </svg>
);

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
  }, []);

  return (
    <header style={{ maxWidth: 1160, margin: "0 auto", padding: "20px 24px", boxSizing: "border-box", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <Link href="/" aria-label="RACIQAN, ke bagian atas beranda" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#12352B", fontFamily: "'Bricolage Grotesque', 'DM Sans', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "0.02em" }}>
        <span>RACI</span>
        <LogoSvg />
        <span>AN</span>
      </Link>
      <nav aria-label="Menu utama" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 24px" }}>
        <Link href="/#resep" style={{ fontWeight: 500, textDecoration: "none", padding: "10px 0", color: "#12352B" }}>Resep</Link>
        <Link href="/#skor-rasa" style={{ fontWeight: 500, textDecoration: "none", padding: "10px 0", color: "#12352B" }}>Skor Rasa</Link>
        <Link href="/#komunitas" style={{ fontWeight: 500, textDecoration: "none", padding: "10px 0", color: "#12352B" }}>Komunitas</Link>
        <Link href="/bagikan" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 20px", borderRadius: 999, background: "#12352B", color: "#FFFFFF", fontWeight: 700, textDecoration: "none" }}>Bagikan racikan</Link>
        {user ? (
          <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); location.reload(); }}
            style={{ minHeight: 44, padding: "0 16px", borderRadius: 999, border: "2px solid #12352B", background: "transparent", color: "#12352B", fontWeight: 700, cursor: "pointer" }}>
            {user.name}
          </button>
        ) : (
          <Link href="/masuk" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 16px", borderRadius: 999, border: "2px solid #12352B", color: "#12352B", fontWeight: 700, textDecoration: "none" }}>Masuk</Link>
        )}
      </nav>
    </header>
  );
}
