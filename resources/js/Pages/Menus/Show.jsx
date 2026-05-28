import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from '@/Layouts/AppLayout'

// ── helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
    return new Intl.NumberFormat("id-ID").format(n ?? 0);
}

function marginLabel(m) {
    if (m >= 60) return "Efisiensi biaya sangat baik";
    if (m >= 40) return "Efisiensi biaya baik";
    return "Perlu evaluasi HPP";
}

// ── icon shim (Iconify via CDN assumed in layout) ────────────────────────────
function Icon({ icon, className = "" }) {
    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{
                __html: `<iconify-icon icon="${icon}"></iconify-icon>`,
            }}
        />
    );
}

// ── sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, children, accent = false }) {
    return (
        <div
            className={`p-4 rounded-2xl border ${
                accent
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-[#dddbff] bg-[#fbfbfe]"
            }`}
        >
            <p
                className={`text-xs font-extrabold mb-1 uppercase tracking-wide ${
                    accent ? "text-emerald-700" : "text-[#2f27ce]"
                }`}
            >
                {label}
            </p>
            {children}
        </div>
    );
}

function TabButton({ id, label, active, onClick }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`pb-3 border-b-2 text-sm font-bold transition-all ${
                active
                    ? "border-[#443dff] text-[#443dff]"
                    : "border-transparent text-[#2f27ce]/50 hover:text-[#2f27ce]"
            }`}
        >
            {label}
        </button>
    );
}

// ── chart (pure SVG, matches blade original) ──────────────────────────────────
function WeeklyChart({ data = [40, 35, 55, 50, 70, 95, 90] }) {
    const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const maxVal = Math.max(...data) || 1;
    const W = 100,
        H = 100;

    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - (v / maxVal) * H;
        return `${x},${y}`;
    });
    const polyline = pts.join(" ");
    const fill = `${polyline} ${W},${H} 0,${H}`;

    return (
        <div className="mt-6 relative h-52 w-full">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
            >
                <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="0%"
                            stopColor="#443dff"
                            stopOpacity="0.15"
                        />
                        <stop
                            offset="100%"
                            stopColor="#443dff"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>
                {[25, 50, 75, 100].map((g) => (
                    <line
                        key={g}
                        x1="0"
                        y1={100 - g}
                        x2="100"
                        y2={100 - g}
                        stroke="#dddbff"
                        strokeWidth="0.5"
                        strokeDasharray="2,2"
                    />
                ))}
                <polygon points={fill} fill="url(#areaGrad)" />
                <polyline
                    points={polyline}
                    fill="none"
                    stroke="#443dff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                {data.map((v, i) => {
                    const x = (i / (data.length - 1)) * W;
                    const y = H - (v / maxVal) * H;
                    return (
                        <circle key={i} cx={x} cy={y} r="1.5" fill="#443dff" />
                    );
                })}
            </svg>
            {/* Y-axis */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] font-bold text-[#2f27ce]/40 pr-2">
                <span>{maxVal}</span>
                <span>{Math.round(maxVal * 0.75)}</span>
                <span>{Math.round(maxVal * 0.5)}</span>
                <span>{Math.round(maxVal * 0.25)}</span>
                <span>0</span>
            </div>
        </div>
    );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function Show({ menu, weeklySales, weeklyGrowth }) {
    const [tab, setTab] = useState("ringkasan");

    const hpp = menu.hpp ?? 0;
    const laba = (menu.price ?? 0) - hpp;
    const margin =
        menu.price > 0 ? Math.round(((menu.price - hpp) / menu.price) * 100) : 0;

    // ingredient stock helpers
    function stockState(ingredient) {
        const stock = ingredient?.stock ?? 0;
        const min = ingredient?.min_stock ?? 0;
        if (stock <= 0) return "empty";
        if (stock <= min) return "low";
        return "safe";
    }

    return (
        <>
            <Head title={menu.name} />

            <div className="min-h-screen bg-[#fbfbfe] p-4 md:p-6">

                {/* ── TOP NAV ── */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-[#2f27ce] font-medium">
                        <Link
                            href={route("menus.index")}
                            className="flex items-center gap-1.5 hover:text-[#050316] transition-colors font-bold"
                        >
                            <Icon icon="solar:arrow-left-bold" className="text-base" />
                            Kembali ke Menu
                        </Link>
                        <span className="text-[#dddbff]">/</span>
                        <span className="text-[#050316] font-extrabold truncate max-w-[200px]">
                            {menu.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dddbff] text-sm font-bold text-[#2f27ce] bg-white hover:bg-[#dddbff] hover:text-[#050316] transition-all shadow-sm">
                            <Icon icon="solar:share-bold" /> Bagikan
                        </button>
                        <Link
                            href={route("menus.edit", menu.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-bold transition-all shadow-lg shadow-[#443dff]/30"
                        >
                            <Icon icon="solar:pen-bold" /> Edit Produk
                        </Link>
                    </div>
                </div>

                {/* ── HERO ── */}
                <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Image */}
                        <div className="relative w-full lg:w-72 h-64 lg:h-72 flex-shrink-0">
                            {menu.image ? (
                                <img
                                    src={`/storage/${menu.image}`}
                                    alt={menu.name}
                                    className="w-full h-full object-cover rounded-2xl border border-[#dddbff]"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#dddbff]/30 rounded-2xl border border-[#dddbff] flex items-center justify-center text-6xl">
                                    {menu.emoji ?? "☕"}
                                </div>
                            )}
                            {menu.is_best_seller && (
                                <span className="absolute top-3 left-3 bg-[#443dff] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wide">
                                    🏆 Terlaris #1
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[11px] font-extrabold bg-[#dddbff] text-[#2f27ce] px-3 py-1 rounded-full border border-[#dddbff]">
                                        {menu.category?.name ?? "Uncategorized"}
                                    </span>
                                    <span className="text-[11px] font-medium text-[#2f27ce]/60 flex items-center gap-1">
                                        <Icon icon="solar:tag-bold-duotone" className="text-xs" />
                                        SKU: {menu.sku ?? "N/A"}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-[#050316] tracking-tight mb-2">
                                    {menu.name}
                                </h1>
                                <p className="text-sm text-[#2f27ce]/70 font-medium leading-relaxed mb-6">
                                    {menu.description ?? "Tidak ada deskripsi."}
                                </p>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Harga Jual">
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-extrabold text-[#050316]">
                                            Rp {fmt(menu.price)}
                                        </p>
                                        <div className="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center border border-[#dddbff]">
                                            <Icon icon="solar:dollar-minimalistic-bold-duotone" className="text-lg text-[#443dff]" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-[#2f27ce]/60 font-medium mt-1">
                                        Harga standar outlet
                                    </p>
                                </StatCard>

                                <StatCard label="HPP (COGS)">
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-extrabold text-[#050316]">
                                            Rp {fmt(hpp)}
                                        </p>
                                        <div className="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center border border-[#dddbff]">
                                            <Icon icon="solar:cart-bold-duotone" className="text-lg text-[#443dff]" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-[#2f27ce]/60 font-medium mt-1">
                                        Biaya bahan baku per porsi
                                    </p>
                                </StatCard>

                                <StatCard label="Laba Bersih" accent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-extrabold text-emerald-600">
                                                +Rp {fmt(laba)}
                                            </p>
                                            {menu.profit_trend && (
                                                <p className="text-[10px] font-bold text-emerald-500 mt-0.5">
                                                    {menu.profit_trend} vs bulan lalu
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200">
                                            <Icon icon="solar:graph-up-bold-duotone" className="text-lg text-emerald-600" />
                                        </div>
                                    </div>
                                </StatCard>

                                <StatCard label="Margin Profit">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-extrabold text-[#050316]">
                                                {margin}%
                                            </p>
                                            <p className="text-[10px] font-medium text-[#2f27ce]/60 mt-0.5">
                                                {marginLabel(margin)}
                                            </p>
                                        </div>
                                        <div className="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center border border-[#dddbff]">
                                            <Icon icon="solar:pie-chart-2-bold-duotone" className="text-lg text-[#443dff]" />
                                        </div>
                                    </div>
                                </StatCard>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TAB NAV ── */}
                <div className="border-b border-[#dddbff] mb-6 bg-white rounded-t-2xl px-6 pt-4">
                    <div className="flex gap-6">
                        {[
                            { id: "ringkasan", label: "Ringkasan Performa" },
                            { id: "bahan",     label: "Bahan Baku" },
                            { id: "ulasan",    label: "Ulasan Pelanggan" },
                            { id: "riwayat",   label: "Riwayat Perubahan" },
                        ].map((t) => (
                            <TabButton
                                key={t.id}
                                id={t.id}
                                label={t.label}
                                active={tab === t.id}
                                onClick={setTab}
                            />
                        ))}
                    </div>
                </div>

                {/* ── TAB CONTENT ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* LEFT */}
                    <div className="xl:col-span-8 space-y-6">

                        {/* Ringkasan */}
                        {tab === "ringkasan" && (
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <div>
                                        <h3 className="font-extrabold text-[#050316] tracking-tight">
                                            Tren Penjualan Mingguan
                                        </h3>
                                        <p className="text-xs text-[#2f27ce]/60 font-medium">
                                            Volume penjualan per hari (7 hari terakhir)
                                        </p>
                                    </div>
                                    <Link
                                        href={route("reports.index")}
                                        className="text-xs font-bold border border-[#dddbff] text-[#2f27ce] px-4 py-2 rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors"
                                    >
                                        Detail Laporan
                                    </Link>
                                </div>

                                <WeeklyChart data={weeklySales ?? [40, 35, 55, 50, 70, 95, 90]} />

                                {/* X-axis */}
                                <div className="flex justify-between mt-2 text-[10px] font-extrabold text-[#2f27ce]/50 px-2">
                                    {["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map((l) => (
                                        <span key={l}>{l}</span>
                                    ))}
                                </div>

                                {/* Legend */}
                                <div className="flex items-center gap-6 mt-4 text-xs font-bold text-[#2f27ce]">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#443dff] shadow-sm" />
                                        Unit Terjual
                                    </span>
                                    {weeklyGrowth && (
                                        <span className="flex items-center gap-1.5 text-emerald-600">
                                            <Icon icon="solar:graph-up-bold" />
                                            +{weeklyGrowth}% Pertumbuhan Mingguan
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bahan Baku */}
                        {tab === "bahan" && (
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <h3 className="font-extrabold text-[#050316] mb-5 tracking-tight">
                                    Komposisi Bahan Baku
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[500px]">
                                        <thead>
                                            <tr className="text-xs text-[#2f27ce] border-b border-[#dddbff] uppercase tracking-wider">
                                                <th className="pb-3 font-extrabold">Bahan</th>
                                                <th className="pb-3 font-extrabold">Qty</th>
                                                <th className="pb-3 font-extrabold">Satuan</th>
                                                <th className="pb-3 font-extrabold text-right">Biaya</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {menu.recipe?.ingredients?.length > 0 ? (
                                                menu.recipe.ingredients.map((ing, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-[#dddbff]/50 last:border-0 hover:bg-[#dddbff]/10 transition-colors"
                                                    >
                                                        <td className="py-3 font-bold text-[#050316]">
                                                            {ing.name}
                                                        </td>
                                                        <td className="py-3 text-[#050316]/70 font-medium">
                                                            {ing.pivot?.quantity}
                                                        </td>
                                                        <td className="py-3 text-[#050316]/70 font-medium">
                                                            {ing.unit}
                                                        </td>
                                                        <td className="py-3 text-right font-extrabold text-[#050316]">
                                                            Rp {fmt(ing.pivot?.cost ?? 0)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="py-8 text-center text-[#2f27ce] italic text-sm"
                                                    >
                                                        Belum ada resep yang ditambahkan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Ulasan */}
                        {tab === "ulasan" && (
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <h3 className="font-extrabold text-[#050316] mb-5 tracking-tight">
                                    Ulasan Pelanggan
                                </h3>
                                <p className="text-sm text-[#2f27ce] italic text-center py-8">
                                    Belum ada ulasan untuk menu ini.
                                </p>
                            </div>
                        )}

                        {/* Riwayat */}
                        {tab === "riwayat" && (
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <h3 className="font-extrabold text-[#050316] mb-5 tracking-tight">
                                    Riwayat Perubahan
                                </h3>
                                <div className="space-y-4">
                                    {menu.audits?.length > 0 ? (
                                        menu.audits.map((audit, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-3 p-3 rounded-xl hover:bg-[#dddbff]/10 transition-colors"
                                            >
                                                <div className="w-2 h-2 mt-1.5 rounded-full bg-[#443dff] flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-[#050316]">
                                                        {audit.event} oleh {audit.user?.name ?? "System"}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-[#2f27ce]/60 mt-0.5">
                                                        {audit.created_at_human}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-[#2f27ce] italic text-center py-8">
                                            Belum ada riwayat perubahan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="xl:col-span-4 space-y-6">

                        {/* Status Bahan Baku */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Icon icon="solar:box-minimalistic-bold-duotone" className="text-xl text-[#443dff]" />
                                <h3 className="font-extrabold text-[#050316] tracking-tight">
                                    Status Bahan Baku
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {menu.recipe?.ingredients?.length > 0 ? (
                                    menu.recipe.ingredients.map((ing, i) => {
                                        const state = stockState(ing);
                                        const colors = {
                                            empty: "border-rose-200 bg-rose-50/50",
                                            low:   "border-amber-200 bg-amber-50/50",
                                            safe:  "border-[#dddbff] bg-[#fbfbfe]",
                                        };
                                        const badgeColors = {
                                            empty: "bg-rose-100 text-rose-700 border-rose-200",
                                            low:   "bg-amber-100 text-amber-700 border-amber-200",
                                            safe:  "bg-emerald-100 text-emerald-700 border-emerald-200",
                                        };
                                        const badgeLabels = {
                                            empty: "Habis",
                                            low:   "Menipis",
                                            safe:  "Aman",
                                        };
                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-center justify-between p-3 rounded-xl border ${colors[state]}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#dddbff]/30 border border-[#dddbff] flex items-center justify-center">
                                                        <Icon icon="solar:box-bold-duotone" className="text-sm text-[#443dff]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-extrabold text-[#050316]">
                                                            {ing.name}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-[#2f27ce]/60">
                                                            {ing.stock ?? 0} {ing.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-[9px] font-extrabold px-2 py-1 rounded-md border ${badgeColors[state]}`}
                                                >
                                                    {badgeLabels[state]}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-xs text-[#2f27ce] italic text-center py-3">
                                        Belum ada bahan baku terdaftar.
                                    </p>
                                )}
                            </div>
                            <Link
                                href={route("inventories.index")}
                                className="block w-full mt-4 py-2.5 text-xs font-extrabold text-[#443dff] border border-[#dddbff] bg-[#fbfbfe] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] text-center transition-colors"
                            >
                                Buat Pesanan Pembelian
                            </Link>
                        </div>

                        {/* Promo Aktif */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-[#dddbff]/30 border border-[#dddbff] flex items-center justify-center text-xl">
                                    ☕
                                </div>
                                <div>
                                    <p className="text-xs font-extrabold text-[#050316]">Promo Aktif</p>
                                    <p className="text-[10px] font-medium text-[#2f27ce]/70 mt-0.5">
                                        {menu.active_bundle?.description ?? "Tidak ada promo aktif saat ini."}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route("bundles.index")}
                                className="block mt-3 text-xs font-extrabold text-[#443dff] hover:text-[#2f27ce] transition-colors hover:underline"
                            >
                                Lihat Pengaturan Promo →
                            </Link>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-[#050316] via-[#2f27ce] to-[#443dff] p-5 rounded-2xl border border-[#2f27ce] relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
                            />
                            <div className="relative z-10">
                                <p className="text-[10px] font-extrabold text-[#dddbff] mb-3 tracking-widest uppercase">
                                    ⚡ Aksi Cepat
                                </p>
                                <div className="space-y-2">
                                    {[
                                        { href: route("menus.edit", menu.id),  icon: "solar:pen-bold",      label: "Edit Detail Menu" },
                                        { href: route("recipe.index"),          icon: "solar:notebook-bold", label: "Kelola Resep & HPP" },
                                        { href: route("bundles.index"),         icon: "solar:gift-bold",     label: "Buat Promo Bundle" },
                                    ].map((a) => (
                                        <Link
                                            key={a.label}
                                            href={a.href}
                                            className="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all border border-white/10"
                                        >
                                            <Icon icon={a.icon} /> {a.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}


Show.layout = (page) => <AppLayout>{page}</AppLayout>;