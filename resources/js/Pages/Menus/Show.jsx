import { useState, useEffect, useRef } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
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
function MenuImage({ src, name, categoryName }) {
    const [hasError, setHasError] = useState(false);

    const renderPlaceholder = () => {
        const lower = (categoryName || '').toLowerCase();
        let icon = 'solar:widget-linear';
        if (lower.includes('kopi') || lower.includes('coffee')) icon = 'solar:cup-hot-linear';
        else if (lower.includes('non')) icon = 'solar:cup-star-linear';
        else if (lower.includes('makanan') || lower.includes('main')) icon = 'solar:plate-linear';
        else if (lower.includes('snack') || lower.includes('cemilan')) icon = 'solar:donut-linear';

        return (
            <div className="w-full h-full bg-[#dddbff]/30 rounded-2xl border border-[#dddbff] flex items-center justify-center text-6xl text-[#443dff]">
                <iconify-icon icon={icon} class="text-6xl"></iconify-icon>
            </div>
        );
    };

    if (!src || hasError) {
        return renderPlaceholder();
    }

    return (
        <img
            src={src}
            alt={name}
            className="w-full h-full object-cover rounded-2xl border border-[#dddbff]"
            onError={() => setHasError(true)}
        />
    );
}

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
                className={`text-xs font-extrabold mb-1 capitalize tracking-wide ${
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
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const [chartLoaded, setChartLoaded] = useState(!!window.Chart);

    useEffect(() => {
        if (window.Chart) {
            setChartLoaded(true);
            return;
        }

        let script = document.querySelector('script[src*="chart.umd.min.js"]');
        if (!script) {
            script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
            script.async = true;
            document.head.appendChild(script);
        }

        const handleLoad = () => setChartLoaded(true);
        script.addEventListener("load", handleLoad);
        return () => {
            script.removeEventListener("load", handleLoad);
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !window.Chart) return;

        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new window.Chart(canvasRef.current, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Unit Terjual",
                        data: data,
                        borderColor: "#443dff",
                        backgroundColor: "rgba(68,61,255,0.08)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#443dff",
                        pointRadius: 3,
                        pointHoverRadius: 5,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.parsed.y} unit terjual`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "#2f27ce",
                            font: { weight: "bold", size: 11 },
                        },
                    },
                    y: {
                        grid: { color: "#dddbff", lineWidth: 0.8 },
                        ticks: {
                            color: "#2f27ce",
                            font: { size: 10 },
                            stepSize: 1,
                        },
                    },
                },
            },
        });

        return () => chartRef.current?.destroy();
    }, [chartLoaded, data]);

    return (
        <div className="mt-5 h-48 relative">
            <canvas ref={canvasRef} />
        </div>
    );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function Show({ menu, categories = [], weeklySales, weeklyGrowth }) {
    const [tab, setTab] = useState("ringkasan");
    const [showEditModal, setShowEditModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(menu.image_url ?? null);

    const editForm = useForm({
        category_id: menu.category_id ?? '',
        name: menu.name ?? '',
        description: menu.description ?? '',
        price: menu.price ?? '',
        is_active: !!menu.is_active,
        image: null,
        estimated_hpp: menu.hpp ?? menu.recipe?.total_hpp ?? '',
    });

    useEffect(() => {
        editForm.setData({
            category_id: menu.category_id ?? '',
            name: menu.name ?? '',
            description: menu.description ?? '',
            price: menu.price ?? '',
            is_active: !!menu.is_active,
            image: null,
            estimated_hpp: menu.hpp ?? menu.recipe?.total_hpp ?? '',
        });
        setImagePreview(menu.image_url ?? null);
    }, [menu]);

    const handleEditSubmit = (e) => {
        e.preventDefault()
        if (editForm.data.image) {
            // PHP cannot read files in multipart PUT requests, so spoof via POST with _method: 'PUT'
            editForm.transform((data) => ({
                ...data,
                _method: 'PUT',
            }))
            editForm.post(route('menus.update', menu.id), {
                onSuccess: () => {
                    setShowEditModal(false)
                    editForm.reset()
                    setImagePreview(menu.image_url ?? null)
                },
                preserveScroll: true,
            })
        } else {
            // Clean any transform
            editForm.transform((data) => data)
            editForm.put(route('menus.update', menu.id), {
                onSuccess: () => {
                    setShowEditModal(false)
                    editForm.reset()
                    setImagePreview(menu.image_url ?? null)
                },
                preserveScroll: true,
            })
        }
    }

    const handleEditImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            editForm.setData('image', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: menu.name,
                text: menu.description || `Cek menu ${menu.name} di Cafinity!`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Tautan halaman detail menu berhasil disalin ke papan klip!');
        }
    };

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
                            <Icon icon="solar:arrow-left-linear" className="text-base" />
                            Kembali ke Menu
                        </Link>
                        <span className="text-[#dddbff]">/</span>
                        <span className="text-[#050316] font-extrabold truncate max-w-[200px]">
                            {menu.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dddbff] text-sm font-bold text-[#2f27ce] bg-white hover:bg-[#dddbff] hover:text-[#050316] transition-all shadow-sm"
                        >
                            <Icon icon="solar:share-linear" /> Bagikan
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-bold transition-all shadow-lg shadow-[#443dff]/30"
                        >
                            <Icon icon="solar:pen-linear" /> Edit Produk
                        </button>
                    </div>
                </div>

                {/* ── HERO ── */}
                <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Image */}
                        <div className="relative w-full lg:w-72 h-64 lg:h-72 flex-shrink-0">
                            <MenuImage src={menu.image_url} name={menu.name} categoryName={menu.category?.name} />
                            {menu.is_best_seller && (
                                <span className="absolute top-3 left-3 bg-[#443dff] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wide flex items-center gap-1">
                                    <iconify-icon icon="solar:cup-linear" class="text-xs"></iconify-icon> Terlaris #1
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
                                        <Icon icon="solar:tag-linear" className="text-xs" />
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
                                            <Icon icon="solar:dollar-minimalistic-linear" className="text-lg text-[#443dff]" />
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
                                            <Icon icon="solar:cart-linear" className="text-lg text-[#443dff]" />
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
                                            <Icon icon="solar:graph-up-linear" className="text-lg text-emerald-600" />
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
                                            <Icon icon="solar:pie-chart-2-linear" className="text-lg text-[#443dff]" />
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


                                {/* Legend */}
                                <div className="flex items-center gap-6 mt-4 text-xs font-bold text-[#2f27ce]">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#443dff] shadow-sm" />
                                        Unit Terjual
                                    </span>
                                    {weeklyGrowth && (
                                        <span className="flex items-center gap-1.5 text-emerald-600">
                                            <Icon icon="solar:graph-up-linear" />
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
                                            <tr className="text-xs text-[#2f27ce] border-b border-[#dddbff] capitalize tracking-wider">
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
                                                            {ing.pivot?.qty}
                                                        </td>
                                                        <td className="py-3 text-[#050316]/70 font-medium">
                                                            {ing.unit}
                                                        </td>
                                                        <td className="py-3 text-right font-extrabold text-[#050316]">
                                                            Rp {fmt(ing.pivot?.qty * (ing.price_per_unit ?? 0))}
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
                                <Icon icon="solar:box-minimalistic-linear" className="text-xl text-[#443dff]" />
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
                                                        <Icon icon="solar:box-linear" className="text-sm text-[#443dff]" />
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
                                    <p className="text-xs font-extrabold text-[#050316]">
                                        {menu.active_bundle ? menu.active_bundle.name : "Promo Aktif"}
                                    </p>
                                    <p className="text-[10px] font-medium text-[#2f27ce]/70 mt-0.5">
                                        {menu.active_bundle ? menu.active_bundle.description : "Tidak ada promo aktif saat ini."}
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
                                <p className="text-[10px] font-extrabold text-[#dddbff] mb-3 tracking-widest capitalize">
                                    ⚡ Aksi Cepat
                                </p>
                                <div className="space-y-2">
                                    {[
                                        { onClick: () => setShowEditModal(true), icon: "solar:pen-linear",      label: "Edit Detail Menu" },
                                        { href: route("recipe.index"),          icon: "solar:notebook-linear", label: "Kelola Resep & HPP" },
                                        { href: route("bundles.index"),         icon: "solar:gift-linear",     label: "Buat Promo Bundle" },
                                    ].map((a) => (
                                        a.href ? (
                                            <Link
                                                key={a.label}
                                                href={a.href}
                                                className="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all border border-white/10"
                                            >
                                                <Icon icon={a.icon} /> {a.label}
                                            </Link>
                                        ) : (
                                            <button
                                                key={a.label}
                                                type="button"
                                                onClick={a.onClick}
                                                className="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all border border-white/10 text-left"
                                            >
                                                <Icon icon={a.icon} /> {a.label}
                                            </button>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Edit Menu Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-[#dddbff] p-8 w-full max-w-xl shadow-xl relative my-8">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#dddbff]/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        
                        {/* Close button X */}
                        <button
                            onClick={() => {
                                setShowEditModal(false)
                                editForm.reset()
                                setImagePreview(menu.image_url ?? null)
                            }}
                            className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all z-20 flex items-center justify-center active:scale-95"
                        >
                            <iconify-icon icon="material-symbols:close" class="text-xl"></iconify-icon>
                        </button>

                        <h3 className="font-extrabold text-xl text-[#050316] mb-1 relative z-10">
                            Edit Detail Menu
                        </h3>
                        <p className="text-xs text-[#2f27ce]/60 mb-8 relative z-10">
                            Ubah rincian informasi, harga jual, dan estimasi HPP menu hidangan.
                        </p>

                        <form onSubmit={handleEditSubmit} className="space-y-5 relative z-10">
                            {/* Row 1: Foto Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-[#050316] capitalize tracking-wider">
                                    Foto Menu
                                </label>
                                <div className="col-span-8 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#dddbff] bg-[#fbfbfe] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative cursor-pointer hover:border-[#443dff] transition-colors group">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <iconify-icon icon="solar:add-circle-linear" class="text-2xl text-[#2f27ce]/50 group-hover:text-[#443dff] transition-colors"></iconify-icon>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-[11px] text-[#2f27ce]/60 font-medium leading-relaxed max-w-[220px]">
                                        Format JPG, PNG atau WebP.<br />Maksimal ukuran file 2MB.
                                    </div>
                                </div>
                                {editForm.errors.image && (
                                    <p className="col-start-5 col-span-8 text-[11px] text-rose-500 font-bold mt-1">
                                        {editForm.errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Row 2: Nama Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-[#050316] capitalize tracking-wider">
                                    Nama Menu
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        placeholder="Contoh: Es Kopi Susu Gula Aren"
                                        className="w-full h-10 px-3 py-2 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] focus:ring-4 focus:ring-[#dddbff]/30 transition-all font-semibold text-[#050316]"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Kategori */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-[#050316] capitalize tracking-wider">
                                    Kategori
                                </label>
                                <div className="col-span-8">
                                    <select
                                        required
                                        value={editForm.data.category_id}
                                        onChange={(e) => editForm.setData('category_id', e.target.value)}
                                        className="w-full h-10 px-3 py-2 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] focus:ring-4 focus:ring-[#dddbff]/30 transition-all cursor-pointer font-semibold text-[#050316]"
                                    >
                                        <option value="" disabled>-- Pilih Kategori --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {editForm.errors.category_id && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.category_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Harga Jual (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-[#050316] capitalize tracking-wider">
                                    Harga Jual (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={editForm.data.price}
                                        onChange={(e) => editForm.setData('price', e.target.value)}
                                        placeholder="25000"
                                        className="w-full h-10 px-3 py-2 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] focus:ring-4 focus:ring-[#dddbff]/30 transition-all font-bold text-[#443dff]"
                                    />
                                    {editForm.errors.price && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 5: Estimasi HPP (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-[#050316] capitalize tracking-wider mt-2.5">
                                    Estimasi HPP (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.data.estimated_hpp}
                                        onChange={(e) => editForm.setData('estimated_hpp', e.target.value)}
                                        placeholder="8500"
                                        className="w-full h-10 px-3 py-2 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] focus:ring-4 focus:ring-[#dddbff]/30 transition-all font-semibold text-[#050316]"
                                    />
                                    <span className="text-[10px] text-neutral-400 mt-1 italic block leading-normal">
                                        *HPP akan diperbarui otomatis setelah resep dihubungkan.
                                    </span>
                                    {editForm.errors.estimated_hpp && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.estimated_hpp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 6: Deskripsi */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-[#050316] capitalize tracking-wider mt-2.5">
                                    Deskripsi
                                </label>
                                <div className="col-span-8">
                                    <textarea
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        placeholder="Deskripsi..."
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] focus:ring-4 focus:ring-[#dddbff]/30 transition-all resize-none font-medium text-[#050316]"
                                    />
                                    {editForm.errors.description && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 7: Status Aktif */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <div className="col-span-4"></div>
                                <div className="col-span-8 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => editForm.setData('is_active', !editForm.data.is_active)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#443dff] focus:ring-offset-2 ${
                                            editForm.data.is_active ? 'bg-[#443dff]' : 'bg-[#dddbff]'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                editForm.data.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <span
                                        onClick={() => editForm.setData('is_active', !editForm.data.is_active)}
                                        className="text-xs font-bold text-[#050316] cursor-pointer select-none"
                                    >
                                        Aktif & Tampilkan di POS
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center gap-4 mt-8 pt-4 border-t border-[#dddbff]/30">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false)
                                        editForm.reset()
                                        setImagePreview(menu.image_url ?? null)
                                    }}
                                    className="px-6 py-2.5 text-xs font-extrabold text-[#2f27ce] hover:text-[#050316] transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#2f27ce]/20 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}


Show.layout = (page) => <AppLayout>{page}</AppLayout>;