import { useState } from "react";

const recipes = [
  {
    id: 1,
    name: "Creamy Hazelnut Latte",
    category: "COFFEE",
    hpp: 12500,
    price: 35000,
    margin: 64.2,
    badge: "LOWEST",
    ingredients: [
      { id: "I1", name: "Espresso Roast (Arabica)", qty: 18, unit: "g", unitPrice: 350, subtotal: 6300 },
      { id: "I2", name: "Fresh Milk", qty: 200, unit: "ml", unitPrice: 20, subtotal: 4000 },
      { id: "I3", name: "Hazelnut Syrup", qty: 15, unit: "ml", unitPrice: 120, subtotal: 1800 },
      { id: "I4", name: "Paper Cup & Lid", qty: 1, unit: "pcs", unitPrice: 400, subtotal: 400 },
    ],
  },
  {
    id: 2,
    name: "Classic Beef Burger",
    category: "MAIN COURSE",
    hpp: 28000,
    price: 55000,
    margin: 49.1,
    badge: null,
    ingredients: [
      { id: "I1", name: "Beef Patty", qty: 150, unit: "g", unitPrice: 120, subtotal: 18000 },
      { id: "I2", name: "Burger Bun", qty: 1, unit: "pcs", unitPrice: 3500, subtotal: 3500 },
      { id: "I3", name: "Cheddar Cheese", qty: 30, unit: "g", unitPrice: 180, subtotal: 5400 },
      { id: "I4", name: "Lettuce & Tomato", qty: 50, unit: "g", unitPrice: 22, subtotal: 1100 },
    ],
  },
  {
    id: 3,
    name: "Matcha Zen Smoothie",
    category: "NON-COFFEE",
    hpp: 18200,
    price: 38000,
    margin: 52.1,
    badge: null,
    ingredients: [
      { id: "I1", name: "Matcha Powder", qty: 8, unit: "g", unitPrice: 900, subtotal: 7200 },
      { id: "I2", name: "Oat Milk", qty: 250, unit: "ml", unitPrice: 28, subtotal: 7000 },
      { id: "I3", name: "Honey", qty: 20, unit: "ml", unitPrice: 60, subtotal: 1200 },
      { id: "I4", name: "Ice Cubes", qty: 100, unit: "g", unitPrice: 5, subtotal: 500 },
      { id: "I5", name: "Paper Cup & Lid", qty: 1, unit: "pcs", unitPrice: 400, subtotal: 400 },
    ],
  },
];

const fmt = (n) =>
  "Rp " + n.toLocaleString("id-ID");

export default function RecipeCosting() {
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");
  const [simValue, setSimValue] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const recipe = recipes[selected];
  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const simHpp = Math.round(recipe.hpp * (1 + simValue / 100));
  const simMargin = (((recipe.price - simHpp) / recipe.price) * 100).toFixed(1);
  const simImpact = (simMargin - recipe.margin).toFixed(1);
  const cogs = ((recipe.hpp / recipe.price) * 100).toFixed(1);
  const profitPerPorsi = recipe.price - recipe.hpp;
  const rekomendasiHarga = Math.round(recipe.hpp / 0.62 / 500) * 500;

  const marginColor = (m) => {
    if (m >= 60) return "#16a34a";
    if (m >= 50) return "#ca8a04";
    return "#dc2626";
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8faf8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100vh" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 280, background: "#fff", borderRight: "1px solid #e8f0e8", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Header */}
          <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid #e8f0e8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>Katalog Resep</span>
            <button style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
          </div>

          {/* Search */}
          <div style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f3f7f3", borderRadius: 10, padding: "8px 12px" }}>
              <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari resep menu..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#374151", width: "100%" }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ padding: "4px 10px 8px", overflowY: "auto", flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", padding: "4px 6px 10px" }}>TERAKHIR DIUPDATE</p>
            {filtered.map((r, i) => {
              const idx = recipes.indexOf(r);
              const active = idx === selected;
              return (
                <div
                  key={r.id}
                  onClick={() => { setSelected(idx); setSimValue(0); }}
                  style={{
                    padding: "12px 12px",
                    borderRadius: 12,
                    cursor: "pointer",
                    marginBottom: 4,
                    background: active ? "#f0faf0" : "transparent",
                    border: active ? "1.5px solid #bbf7d0" : "1.5px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: "#111" }}>{r.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: marginColor(r.margin), background: active ? "#dcfce7" : "#f3f4f6", padding: "2px 7px", borderRadius: 20 }}>{r.margin}%</span>
                  </div>
                  <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500, marginBottom: 4 }}>{r.category}</p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#6b7280" }}>HPP: {fmt(r.hpp)}</span>
                    <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>{fmt(r.price)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* Top */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: 0 }}>{recipe.name}</h1>
                <span style={{ fontSize: 11, fontWeight: 600, background: "#f0faf0", color: "#16a34a", border: "1px solid #bbf7d0", padding: "2px 10px", borderRadius: 20 }}>{recipe.category}</span>
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                <span>🕒</span> Terakhir disinkronisasi dengan harga inventory: 2 jam yang lalu
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ padding: "9px 18px", borderRadius: 10, border: "1.5px solid #d1d5db", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}>
                💾 Simpan Perubahan
              </button>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: "#16a34a", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>
                {editMode ? "✓ Selesai Edit" : "✏️ Edit Menu"}
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              { label: "TOTAL HPP", value: fmt(recipe.hpp), badge: recipe.badge, badgeColor: "#16a34a", sub: null },
              { label: "HARGA JUAL", value: fmt(recipe.price), badge: null, sub: null },
              { label: "MARGIN KOTOR", value: `${recipe.margin}%`, badge: null, arrow: "↗", color: marginColor(recipe.margin) },
            ].map((c, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e8f0e8" }}>
                <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 8 }}>{c.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: c.color || "#111" }}>{c.value}</span>
                  {c.badge && <span style={{ fontSize: 10, fontWeight: 700, color: c.badgeColor, background: "#dcfce7", padding: "2px 8px", borderRadius: 20 }}>{c.badge}</span>}
                  {c.arrow && <span style={{ color: c.color, fontSize: 18 }}>{c.arrow}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Ingredients Table */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8f0e8", padding: "22px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: 0 }}>Komposisi Bahan Baku</h2>
              <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#16a34a", background: "none", border: "none", cursor: "pointer" }}>
                + Tambah Bahan
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f4f0" }}>
                  {["NAMA BAHAN", "KUANTITAS", "HARGA SATUAN", "SUBTOTAL"].map((h) => (
                    <th key={h} style={{ textAlign: "left", fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", paddingBottom: 12, paddingRight: 16 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ing) => (
                  <tr key={ing.id} style={{ borderBottom: "1px solid #f8faf8" }}>
                    <td style={{ padding: "13px 16px 13px 0" }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "#111", margin: 0 }}>{ing.name}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", fontFamily: "'DM Mono', monospace" }}>ID: {ing.id}</p>
                    </td>
                    <td style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
                      {ing.qty} <span style={{ color: "#9ca3af" }}>{ing.unit}</span>
                    </td>
                    <td style={{ fontSize: 14, color: "#374151" }}>{fmt(ing.unitPrice)}</td>
                    <td style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{fmt(ing.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #e8f0e8", paddingTop: 14, marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em" }}>TOTAL KALKULASI BIAYA</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111", fontFamily: "'DM Mono', monospace" }}>{fmt(recipe.hpp)}</span>
            </div>
          </div>

          {/* Struktur Harga */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8f0e8", padding: "22px 24px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 16px" }}>Struktur Harga vs Biaya</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Cost of Goods Sold (HPP)</span>
              <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 13 }}>{cogs}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 99, background: "#f0f4f0", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ height: "100%", width: `${cogs}%`, background: "linear-gradient(90deg, #16a34a, #4ade80)", borderRadius: 99, transition: "width 0.5s" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: "#f0faf0", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>LABA PER PORSI</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: "#16a34a", margin: 0, fontFamily: "'DM Mono', monospace" }}>{fmt(profitPerPorsi)}</p>
              </div>
              <div style={{ background: "#f8faf8", borderRadius: 12, padding: "16px 18px", border: "1px solid #e8f0e8" }}>
                <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>REKOMENDASI HARGA</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0, fontFamily: "'DM Mono', monospace" }}>{fmt(rekomendasiHarga)}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: 20 }}>Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside style={{ width: 268, background: "#fff", borderLeft: "1px solid #e8f0e8", overflowY: "auto", padding: "22px 18px", display: "flex", flexDirection: "column", gap: 18, flexShrink: 0 }}>

          {/* What-If Simulator */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <span>📊</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Simulator "What-If"</span>
            </div>
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>Kenaikan Biaya Bahan Baku (%)</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <input
                type="range" min={0} max={50} value={simValue}
                onChange={(e) => setSimValue(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#16a34a" }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", minWidth: 32, textAlign: "right" }}>+{simValue}%</span>
            </div>
            <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 14 }}>*Simulasikan kenaikan harga pasar global pada resep ini.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Proyeksi HPP Baru</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111", fontFamily: "'DM Mono', monospace" }}>{fmt(simHpp)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Proyeksi Margin</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: marginColor(Number(simMargin)) }}>{simMargin}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.04em" }}>IMPACT ON PROFIT</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: Number(simImpact) < 0 ? "#dc2626" : "#16a34a" }}>
                  {Number(simImpact) < 0 ? "↘" : "↗"} {simImpact}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setSimValue(0)}
              style={{ marginTop: 14, width: "100%", padding: "8px", borderRadius: 10, border: "1.5px solid #d1d5db", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              ↺ Reset Simulasi
            </button>
          </div>

          {/* Opsi Strategis */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 10 }}>Opsi Strategis</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Update Harga Inventory Global", "Cetak Laporan Profitabilitas", "Bandingkan dengan Resep Lain"].map((label) => (
                <button key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8f0e8", background: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#374151", textAlign: "left" }}>
                  {label}
                  <span style={{ color: "#9ca3af" }}>›</span>
                </button>
              ))}
            </div>
          </div>

          {/* Peringatan Margin */}
          {recipe.margin < 65 && (
            <div style={{ background: "#fff8f8", borderRadius: 14, border: "1.5px solid #fecaca", padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span>⚠️</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", letterSpacing: "0.05em" }}>PERINGATAN MARGIN</span>
              </div>
              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>
                Margin pada <strong>{recipe.name}</strong> mendekati batas minimum 40%. Pertimbangkan untuk menaikkan harga jual jika biaya bahan baku naik lebih dari Rp2.000.
              </p>
              <button style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                Analisis Strategi Harga →
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <div style={{ background: "#fff", borderTop: "1px solid #e8f0e8", padding: "10px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>© 2024 Smart Cafe POS v2.4.0</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#16a34a" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
            System Online
          </span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>Support ID: #POS-8821</span>
        </div>
      </div>
    </div>
  );
}