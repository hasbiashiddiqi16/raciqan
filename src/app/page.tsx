import { Suspense } from "react";
import HomeRecipes from "@/components/HomeRecipes";
import { getTrending } from "@/lib/data";

export const instant = false;

const H = "'Bricolage Grotesque', 'DM Sans', sans-serif";

async function TrendingList() {
  const trending = getTrending() as any[];
  const bgs = ["#FF8A3D", "#FFE9A8", "#FFE9A8", "#FFE9A8"];
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 20 }}>
      {trending.map((r: any, i: number) => (
        <li key={r.id} style={{ flex: "1 1 240px", minWidth: 0, boxSizing: "border-box", padding: 22, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", border: "2px solid #12352B", background: bgs[i], fontFamily: H, fontWeight: 800, fontSize: 22, color: "#12352B" }}>{i + 1}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#3F5A4F" }}>{r.category}</span>
          </div>
          <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 22, lineHeight: 1.15, color: "#12352B" }}>{r.title}</h3>
          <p style={{ margin: 0, color: "#3F5A4F", fontSize: 16 }}>{r.description}</p>
          <p style={{ margin: 0, marginTop: "auto", paddingTop: 12, borderTop: "2px dashed #CFE3D2", fontSize: 15, fontWeight: 700, color: "#12352B" }}>{r.try_count ?? 0} orang sudah mencoba</p>
          <a href={`/resep/${r.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4, color: "#12352B", fontSize: 15 }}>Lihat resep →</a>
        </li>
      ))}
      {trending.length === 0 && <p style={{ color: "#3F5A4F" }}>Belum ada data.</p>}
    </ol>
  );
}

export default function Home() {
  return (
    <div style={{ background: "#F4F8EE", color: "#12352B", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 17, lineHeight: 1.55, minHeight: "100vh" }}>
      {/* Hero */}
      <section id="atas" style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 72px", boxSizing: "border-box", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 48 }}>
        <div style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={{ margin: 0, display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "#FFE9A8", fontWeight: 700, fontSize: 15, color: "#12352B" }}>Racikan makanan dan minuman</p>
          <h1 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(40px, 6vw, 68px)", lineHeight: 1.04, letterSpacing: "-0.02em", color: "#12352B" }}>Campur bahan biasa, jadi rasa baru.</h1>
          <p style={{ margin: 0, maxWidth: 520, color: "#3F5A4F", fontSize: 19 }}>Kumpulan racikan dari komunitas. Buka resepnya, coba sendiri di rumah, lalu ceritakan hasilnya.</p>
          <form action="/#resep" style={{ display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 540 }}>
            <label htmlFor="cari" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Cari racikan</label>
            <input id="cari" type="text" name="q" placeholder="Cari racikan, misalnya jeruk atau madu" style={{ flex: "1 1 260px", minWidth: 0, height: 52, boxSizing: "border-box", padding: "0 20px", border: "2px solid #12352B", borderRadius: 999, background: "#FFFFFF", color: "#12352B", fontFamily: "inherit", fontSize: 16 }} />
            <button type="submit" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 52, padding: "0 26px", border: "2px solid #12352B", borderRadius: 999, background: "#12352B", color: "#FFFFFF", fontFamily: "inherit", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              Cari
            </button>
          </form>
          <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, color: "#3F5A4F", fontSize: 15 }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D4F" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            Lihat semua resep tanpa perlu login
          </p>
        </div>
        <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 460, boxSizing: "border-box", padding: "28px 24px 24px", border: "2px solid #12352B", borderRadius: 32, background: "#FFD257", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <p style={{ margin: 0, alignSelf: "flex-start", fontWeight: 700, fontSize: 15, color: "#12352B" }}>Contoh racikan</p>
            <svg role="img" aria-label="Segelas es jeruk dengan lapisan madu" width="100%" viewBox="0 0 320 340" style={{ maxWidth: 300 }}>
              <circle cx="160" cy="180" r="140" fill="#FFE9A8" />
              <path d="M92 70 L228 70 L212 306 Q211 322 195 322 L125 322 Q109 322 108 306 Z" fill="#FFFFFF" fillOpacity="0.55" stroke="#12352B" strokeWidth="5" strokeLinejoin="round" />
              <path d="M99 118 L221 118 L210 304 Q209 314 196 314 L124 314 Q111 314 110 304 Z" fill="#FF8A3D" />
              <path d="M107 262 L213 262 L210 304 Q209 314 196 314 L124 314 Q111 314 110 304 Z" fill="#E8A317" />
              <rect x="126" y="132" width="44" height="44" rx="9" fill="#FFFFFF" fillOpacity="0.65" transform="rotate(-12 148 154)" />
              <rect x="170" y="156" width="38" height="38" rx="9" fill="#FFFFFF" fillOpacity="0.5" transform="rotate(14 189 175)" />
              <path d="M196 30 L168 220" stroke="#12352B" strokeWidth="9" strokeLinecap="round" />
              <circle cx="232" cy="78" r="30" fill="#FFD257" stroke="#12352B" strokeWidth="5" />
              <path d="M232 50 L232 106 M204 78 L260 78 M212 58 L252 98 M252 58 L212 98" stroke="#12352B" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div style={{ width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ padding: "6px 14px", borderRadius: 999, background: "#FFFFFF", fontWeight: 700, fontSize: 15, color: "#12352B" }}>Es jeruk</span>
              <span style={{ padding: "6px 14px", borderRadius: 999, background: "#FFFFFF", fontWeight: 700, fontSize: 15, color: "#12352B" }}>+ Nutrisari</span>
              <span style={{ padding: "6px 14px", borderRadius: 999, background: "#FFFFFF", fontWeight: 700, fontSize: 15, color: "#12352B" }}>+ Madu</span>
            </div>
            <p style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 26, color: "#12352B" }}>= Segar Madu</p>
          </div>
        </div>
      </section>

      {/* Lagi ramai dicoba */}
      <section id="populer" style={{ maxWidth: 1160, margin: "0 auto", padding: "8px 24px 80px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, display: "inline-flex", alignSelf: "flex-start", padding: "6px 14px", borderRadius: 999, background: "#FF8A3D", fontWeight: 700, fontSize: 15, color: "#12352B" }}>Minggu ini</p>
            <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, color: "#12352B" }}>Lagi ramai dicoba</h2>
            <p style={{ margin: 0, maxWidth: 560, color: "#3F5A4F" }}>Racikan yang paling banyak dicoba dan diulas orang minggu ini.</p>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#3F5A4F" }}>Contoh tampilan. Peringkat dan jumlah akan terisi dari ulasan pengguna.</p>
        </div>
        <Suspense fallback={<p style={{ color: "#3F5A4F" }}>Memuat...</p>}>
          <TrendingList />
        </Suspense>
      </section>

      <HomeRecipes />

      {/* Skor Rasa */}
      <section id="skor-rasa" style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 24px", boxSizing: "border-box", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 48 }}>
        <div style={{ flex: "1 1 380px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, color: "#12352B" }}>Lihat rasanya sebelum mencoba.</h2>
          <p style={{ margin: 0, color: "#3F5A4F", maxWidth: 480 }}>Setiap pengguna yang sudah mencoba ikut menilai empat rasa: manis, asam, segar, dan creamy. Hasilnya menjadi peta rasa yang membantumu memilih racikan.</p>
          <p style={{ margin: 0, color: "#3F5A4F", maxWidth: 480 }}>Saat memilih satu bahan, RACIQAN juga menyarankan padanan yang biasanya cocok.</p>
        </div>
        <div style={{ flex: "1 1 360px", minWidth: 0, boxSizing: "border-box", padding: 28, border: "2px solid #12352B", borderRadius: 28, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <h3 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 24, color: "#12352B" }}>Segar Madu</h3>
            <span style={{ fontSize: 14, color: "#3F5A4F" }}>Contoh tampilan peta rasa</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#12352B" }}><span>Manis</span><span>3 dari 5</span></div>
            <div style={{ height: 14, borderRadius: 999, background: "#E3EEDB" }}><div style={{ width: "60%", height: 14, borderRadius: 999, background: "#E8A317" }} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#12352B" }}><span>Asam</span><span>4 dari 5</span></div>
            <div style={{ height: 14, borderRadius: 999, background: "#E3EEDB" }}><div style={{ width: "80%", height: 14, borderRadius: 999, background: "#FF8A3D" }} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#12352B" }}><span>Segar</span><span>5 dari 5</span></div>
            <div style={{ height: 14, borderRadius: 999, background: "#E3EEDB" }}><div style={{ width: "100%", height: 14, borderRadius: 999, background: "#2E7D4F" }} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#12352B" }}><span>Creamy</span><span>1 dari 5</span></div>
            <div style={{ height: 14, borderRadius: 999, background: "#E3EEDB" }}><div style={{ width: "20%", height: 14, borderRadius: 999, background: "#7A5C3E" }} /></div>
          </div>
        </div>
      </section>

      {/* Komunitas */}
      <section id="komunitas" style={{ background: "#FFE9A8", borderTop: "2px solid #12352B", borderBottom: "2px solid #12352B" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, color: "#12352B" }}>Dari dapur orang lain, ke dapurmu.</h2>
            <p style={{ margin: 0, maxWidth: 560, color: "#3F5A4F" }}>Coba resepnya, tulis ulasan setelah mencoba, atau racik ulang dengan versimu sendiri.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            <article style={{ flex: "1 1 320px", minWidth: 0, boxSizing: "border-box", padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#3F5A4F" }}>Contoh ulasan</p>
              <p style={{ margin: 0, fontSize: 18, color: "#12352B" }}>[Isi ulasan pengguna tentang rasa dan hasil setelah mencoba racikan.]</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span style={{ padding: "4px 12px", borderRadius: 999, background: "#E3EEDB", fontSize: 14, fontWeight: 700, color: "#12352B" }}>Sesuai ekspektasi</span>
                <span style={{ padding: "4px 12px", borderRadius: 999, background: "#FFD9BF", fontSize: 14, fontWeight: 700, color: "#12352B" }}>Perlu kurangi manis</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, color: "#3F5A4F" }}>[Nama pengguna] untuk Segar Madu</p>
            </article>
            <article style={{ flex: "1 1 320px", minWidth: 0, boxSizing: "border-box", padding: 24, border: "2px solid #12352B", borderRadius: 24, background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#3F5A4F" }}>Contoh racik ulang</p>
              <p style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: 24, color: "#12352B" }}>Segar Madu Plus</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#FF8A3D" }}>Terinspirasi dari Segar Madu</p>
              <p style={{ margin: 0, color: "#3F5A4F" }}>Menambahkan daun mint untuk kesegaran ekstra.</p>
              <p style={{ margin: 0, fontSize: 15, color: "#3F5A4F" }}>Oleh Sari Dewi</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#12352B", color: "#FFFFFF", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <h2 style={{ margin: 0, fontFamily: H, fontWeight: 800, fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1 }}>Punya racikan andalan?</h2>
          <p style={{ margin: 0, color: "#CFE3D2", fontSize: 18, maxWidth: 560 }}>Bagikan resepmu ke komunitas. Login ringan hanya diminta saat menulis ulasan atau membagikan resep.</p>
          <a href="/bagikan" style={{ display: "inline-flex", alignItems: "center", minHeight: 52, padding: "0 32px", borderRadius: 999, background: "#FF8A3D", color: "#12352B", fontWeight: 700, fontSize: 17, textDecoration: "none", marginTop: 8 }}>Bagikan racikanmu</a>
        </div>
      </section>
    </div>
  );
}
