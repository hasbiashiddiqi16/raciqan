export default function Footer() {
  return (
    <footer style={{ borderTop: "2px solid #12352B", background: "#FFFFFF", marginTop: 40 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "24px", boxSizing: "border-box", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", width: 32, height: 32, borderRadius: 8, background: "#FF8A3D", border: "2px solid #12352B", alignItems: "center", justifyContent: "center", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 16, color: "#12352B" }}>Q</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#12352B" }}>RACIQAN</p>
            <p style={{ margin: 0, fontSize: 12, color: "#3F5A4F" }}>Racikan, dengan huruf Q.</p>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "#3F5A4F" }}>© 2026 RACIQAN. Dibuat untuk komunitas.</p>
      </div>
    </footer>
  );
}
