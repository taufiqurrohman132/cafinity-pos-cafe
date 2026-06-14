import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Head from '@/Components/Head';
import client from '@/api/client';
import MenusShowSkeleton from "@/Components/Skeletons/MenusShowSkeleton";

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
            <div className="w-full h-full bg-[#E6E6E6]/30 rounded-2xl border border-[#E6E6E6] flex items-center justify-center text-6xl text-black/60">
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
            className="w-full h-full object-cover rounded-2xl border border-[#E6E6E6]"
            onError={() => setHasError(true)}
        />
    );
}

function StatCard({ label, children, accent = false }) {
    return (
        <div
            className={`p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 group ${
                accent
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-[#E6E6E6] bg-white hover:border-[#D0D0D0]"
            }`}
        >
            <p
                className={`text-[10px] font-extrabold mb-1 uppercase tracking-wider ${
                    accent ? "text-emerald-700" : "text-black/40"
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
            className={`pb-3 border-b-2 text-sm font-bold transition-all ${ active ? "border-[#BFFF00] text-black" : "border-transparent text-black/50 hover:text-black hover:border-black/20" } active:scale-[0.97]`}
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
                        borderColor: "#000000",
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#000000",
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
                            color: "rgba(0, 0, 0, 0.6)",
                            font: { weight: "bold", size: 11 },
                        },
                    },
                    y: {
                        grid: { color: "#E6E6E6", lineWidth: 0.8 },
                        ticks: {
                            color: "rgba(0, 0, 0, 0.6)",
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
export default function Show() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(null);
    const [categories, setCategories] = useState([]);
    const [weeklySales, setWeeklySales] = useState([]);
    const [weeklyGrowth, setWeeklyGrowth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [tab, setTab] = useState("ringkasan");
    const [showEditModal, setShowEditModal] = useState(false);

    // Edit form states
    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        description: '',
        price: '',
        is_active: false,
        image: null,
        estimated_hpp: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch data
    useEffect(() => {
        const fetchMenuData = async () => {
            setLoading(true);
            try {
                setError(null);
                const res = await client.get(`/menus/${id}`);
                setMenu(res.data.menu);
                setCategories(res.data.categories || []);
                setWeeklySales(res.data.weeklySales || []);
                setWeeklyGrowth(res.data.weeklyGrowth || 0);
            } catch (err) {
                console.error("Gagal memuat data menu:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuData();
    }, [id, refreshTrigger]);

    // Update form data when menu changes
    useEffect(() => {
        if (menu) {
            setFormData({
                category_id: menu.category_id ?? '',
                name: menu.name ?? '',
                description: menu.description ?? '',
                price: menu.price ?? '',
                is_active: !!menu.is_active,
                image: null,
                estimated_hpp: menu.hpp ?? menu.recipe?.total_hpp ?? '',
            });
            setImagePreview(menu.image_url ?? null);
        }
    }, [menu]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            if (formData.image) {
                const dataObj = new FormData();
                dataObj.append('_method', 'PUT');
                dataObj.append('category_id', formData.category_id);
                dataObj.append('name', formData.name);
                dataObj.append('description', formData.description || '');
                dataObj.append('price', formData.price);
                dataObj.append('is_active', formData.is_active ? '1' : '0');
                dataObj.append('image', formData.image);
                if (formData.estimated_hpp !== undefined && formData.estimated_hpp !== null && formData.estimated_hpp !== '') {
                    dataObj.append('estimated_hpp', formData.estimated_hpp);
                }
                
                await client.post(`/menus/${menu.id}`, dataObj, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await client.put(`/menus/${menu.id}`, {
                    category_id: formData.category_id,
                    name: formData.name,
                    description: formData.description || '',
                    price: formData.price,
                    is_active: !!formData.is_active,
                    estimated_hpp: formData.estimated_hpp !== undefined && formData.estimated_hpp !== null && formData.estimated_hpp !== '' ? formData.estimated_hpp : '',
                });
            }
            setShowEditModal(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Gagal memperbarui menu:", err);
            if (err.response && err.response.status === 422) {
                const validationErrors = {};
                Object.entries(err.response.data.errors || {}).forEach(([key, messages]) => {
                    validationErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setErrors(validationErrors);
            } else {
                alert("Terjadi kesalahan saat menyimpan perubahan menu.");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: menu.name,
                text: menu.description || `Cek menu ${menu.name} di Cafinity!`,
                url: window.location.href,
            }).catch(() => {});
        }
    };

    if (loading && !menu) {
        return (
            <>
                <Head title="Detail Menu" />
                <MenusShowSkeleton />
            </>
        );
    }

    if (error && !menu) {
        return (
            <>
                <Head title="Detail Menu" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data detail menu dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all active:scale-[0.97]">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!menu) return null;

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

            <div className="min-h-screen bg-brand-bg p-4 md:p-6">

                {/* ── TOP NAV ── */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/menus" 
                            className="w-10 h-10 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center text-black/60 hover:text-black hover:bg-[#E6E6E6] hover:border-[#999999] transition shadow-sm shrink-0"
                        >
                            <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                        </Link>
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-black/60 font-semibold">
                            <Link
                                to="/menus"
                                className="hover:text-black transition-colors"
                            >
                                Menu
                            </Link>
                            <span className="text-black/30">›</span>
                            <span className="text-black font-extrabold">Detail {menu.name}</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D0D0D0] text-sm font-bold text-black bg-white hover:bg-[#E6E6E6] hover:border-[#999999] transition-all shadow-sm active:scale-[0.97]"
                        >
                            <Icon icon="solar:share-linear" /> Bagikan
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/menus/${id}/edit`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black text-sm font-bold transition-all shadow-sm active:scale-[0.97]"
                        >
                            <Icon icon="solar:pen-linear" /> Edit Produk
                        </button>
                    </div>
                </div>

                {/* ── HERO ── */}
                <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Image */}
                        <div className="relative w-full lg:w-72 h-64 lg:h-72 flex-shrink-0">
                            <MenuImage src={menu.image_url} name={menu.name} categoryName={menu.category?.name} />
                            {menu.is_best_seller && (
                                <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wide flex items-center gap-1">
                                    <iconify-icon icon="solar:cup-linear" class="text-xs"></iconify-icon> Terlaris #1
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[11px] font-bold bg-[#E6E6E6] text-black px-3 py-1 rounded-full">
                                        {menu.category?.name ?? "Uncategorized"}
                                    </span>
                                    <span className="text-[11px] font-semibold text-black/50 flex items-center gap-1">
                                        <Icon icon="solar:tag-linear" className="text-xs" />
                                        SKU: {menu.sku ?? "N/A"}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight mb-2">
                                    {menu.name}
                                </h1>
                                <p className="text-sm text-black/60 font-semibold leading-relaxed mb-6">
                                    {menu.description ?? "Tidak ada deskripsi."}
                                </p>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Harga Jual">
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-black text-black">
                                            Rp {fmt(menu.price)}
                                        </p>
                                        <div className="w-9 h-9 bg-neutral-50 rounded-xl flex items-center justify-center border border-[#E6E6E6] transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                            <Icon icon="solar:dollar-minimalistic-linear" className="text-lg text-black/60" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-black/50 font-bold mt-1">
                                        Harga standar outlet
                                    </p>
                                </StatCard>

                                <StatCard label="HPP (COGS)">
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-black text-black">
                                            Rp {fmt(hpp)}
                                        </p>
                                        <div className="w-9 h-9 bg-neutral-50 rounded-xl flex items-center justify-center border border-[#E6E6E6] transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                            <Icon icon="solar:cart-linear" className="text-lg text-black/60" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-black/50 font-bold mt-1">
                                        Biaya bahan baku per porsi
                                    </p>
                                </StatCard>

                                <StatCard label="Laba Bersih" accent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-black text-emerald-600">
                                                +Rp {fmt(laba)}
                                            </p>
                                            {menu.profit_trend && (
                                                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                                                    {menu.profit_trend} vs bulan lalu
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-9 h-9 bg-emerald-100/60 rounded-xl flex items-center justify-center border border-emerald-200 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                            <Icon icon="solar:graph-up-linear" className="text-lg text-emerald-600" />
                                        </div>
                                    </div>
                                </StatCard>

                                <StatCard label="Margin Profit">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-black text-black">
                                                {margin}%
                                            </p>
                                            <p className="text-[10px] font-bold text-black/50 mt-0.5">
                                                {marginLabel(margin)}
                                            </p>
                                        </div>
                                        <div className="w-9 h-9 bg-neutral-50 rounded-xl flex items-center justify-center border border-[#E6E6E6] transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                            <Icon icon="solar:pie-chart-2-linear" className="text-lg text-black/60" />
                                        </div>
                                    </div>
                                </StatCard>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TAB NAV ── */}
                <div className="border-b border-[#E6E6E6] mb-6 bg-white rounded-t-2xl px-6 pt-4">
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
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <div>
                                        <h3 className="font-extrabold text-black tracking-tight">
                                            Tren Penjualan Mingguan
                                        </h3>
                                        <p className="text-xs text-black/60 font-semibold mt-0.5">
                                            Volume penjualan per hari (7 hari terakhir)
                                        </p>
                                    </div>
                                    <Link
                                        to="/reports"
                                        className="text-xs font-bold border border-[#D0D0D0] hover:border-[#999999] hover:bg-[#E6E6E6] text-black px-4 py-2 rounded-xl transition-colors"
                                    >
                                        Detail Laporan
                                    </Link>
                                </div>

                                <WeeklyChart data={weeklySales ?? [40, 35, 55, 50, 70, 95, 90]} />

                                {/* Legend */}
                                <div className="flex items-center gap-6 mt-4 text-xs font-bold text-black/60">
                                    <span className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-black shadow-sm" />
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
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm">
                                <h3 className="font-extrabold text-black mb-5 tracking-tight">
                                    Komposisi Bahan Baku
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[500px]">
                                        <thead>
                                            <tr className="text-xs text-black/60 border-b border-[#E6E6E6] bg-neutral-50/50 uppercase tracking-wider">
                                                <th className="px-4 py-3 font-extrabold text-left">Bahan</th>
                                                <th className="px-4 py-3 font-extrabold text-left">Qty</th>
                                                <th className="px-4 py-3 font-extrabold text-left">Satuan</th>
                                                <th className="px-4 py-3 font-extrabold text-right">Biaya</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-[#E6E6E6]/50">
                                            {menu.recipe?.ingredients?.length > 0 ? (
                                                menu.recipe.ingredients.map((ing, i) => (
                                                    <tr
                                                        key={i}
                                                        className="hover:bg-neutral-50/50 transition-all cursor-pointer"
                                                    >
                                                        <td className="px-4 py-3.5 font-bold text-black">
                                                            {ing.name}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-black/70 font-semibold">
                                                            {ing.pivot?.qty}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-black/70 font-semibold">
                                                            {ing.unit}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-right font-black text-black">
                                                            Rp {fmt(ing.pivot?.qty * (ing.price_per_unit ?? 0))}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="py-8 text-center text-black/50 italic text-sm"
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
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm">
                                <h3 className="font-extrabold text-black mb-5 tracking-tight">
                                    Ulasan Pelanggan
                                </h3>
                                <p className="text-sm text-black/50 italic text-center py-8">
                                    Belum ada ulasan untuk menu ini.
                                </p>
                            </div>
                        )}

                        {/* Riwayat */}
                        {tab === "riwayat" && (
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm">
                                <h3 className="font-extrabold text-black mb-5 tracking-tight">
                                    Riwayat Perubahan
                                </h3>
                                <div className="space-y-4">
                                    {menu.audits?.length > 0 ? (
                                        menu.audits.map((audit, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-3 p-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-[#E6E6E6] transition-all duration-300 group"
                                            >
                                                <div className="w-2 h-2 mt-1.5 rounded-full bg-black flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-black">
                                                        {audit.event} oleh {audit.user?.name ?? "System"}
                                                    </p>
                                                    <p className="text-[10px] font-semibold text-black/50 mt-0.5">
                                                        {audit.created_at_human}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-black/50 italic text-center py-8">
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
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Icon icon="solar:box-minimalistic-linear" className="text-xl text-black" />
                                <h3 className="font-extrabold text-black tracking-tight">
                                    Status Bahan Baku
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {menu.recipe?.ingredients?.length > 0 ? (
                                    menu.recipe.ingredients.map((ing, i) => {
                                        const state = stockState(ing);
                                        const colors = {
                                            empty: "border-rose-200 bg-rose-50/30",
                                            low:   "border-amber-200 bg-amber-50/30",
                                            safe:  "border-[#E6E6E6] bg-white",
                                        };
                                        const badgeColors = {
                                            empty: "bg-rose-50/50 text-rose-700 border-rose-100",
                                            low:   "bg-amber-50/50 text-amber-700 border-amber-100",
                                            safe:  "bg-emerald-50/50 text-emerald-700 border-emerald-100",
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
                                                    <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-[#E6E6E6] flex items-center justify-center">
                                                        <Icon icon="solar:box-linear" className="text-sm text-black/60" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-black">
                                                            {ing.name}
                                                        </p>
                                                        <p className="text-[10px] font-semibold text-black/50">
                                                            {ing.stock ?? 0} {ing.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-[9px] font-bold px-2 py-1 rounded-md border ${badgeColors[state]}`}
                                                >
                                                    {badgeLabels[state]}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-xs text-black/50 italic text-center py-3">
                                        Belum ada bahan baku terdaftar.
                                    </p>
                                )}
                            </div>
                            <Link
                                to="/inventories"
                                className="block w-full mt-4 py-2.5 text-xs font-bold text-black border border-[#D0D0D0] hover:border-[#999999] hover:bg-[#E6E6E6] bg-white rounded-xl text-center transition-all active:scale-[0.97]"
                            >
                                Buat Pesanan Pembelian
                            </Link>
                        </div>

                        {/* Promo Aktif */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-sm">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-[#E6E6E6] flex items-center justify-center text-xl">
                                    ☕
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-black">
                                        {menu.active_bundle ? menu.active_bundle.name : "Promo Aktif"}
                                    </p>
                                    <p className="text-[10px] font-semibold text-black/50 mt-0.5">
                                        {menu.active_bundle ? menu.active_bundle.description : "Tidak ada promo aktif saat ini."}
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/promotions"
                                className="block mt-3 text-xs font-bold text-black/60 hover:text-black transition-colors"
                            >
                                Lihat Pengaturan Promo →
                            </Link>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#0E0E0E] p-5 rounded-2xl border border-black relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
                            />
                            <div className="relative z-10">
                                <p className="text-[10px] font-extrabold text-[#BFFF00] mb-3 tracking-widest uppercase">
                                    ⚡ Aksi Cepat
                                </p>
                                <div className="space-y-2">
                                    {[
                                        { onClick: () => navigate(`/menus/${id}/edit`), icon: "solar:pen-linear",      label: "Edit Detail Menu" },
                                        { href: "/recipe-costing",          icon: "solar:notebook-linear", label: "Kelola Resep & HPP" },
                                        { href: "/promotions",         icon: "solar:gift-linear",     label: "Buat Promo Bundle" },
                                    ].map((a) => (
                                        a.href ? (
                                            <Link
                                                key={a.label}
                                                to={a.href}
                                                className="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-[#BFFF00] hover:text-black rounded-xl text-white text-xs font-bold transition-all border border-white/5 active:scale-[0.97]"
                                            >
                                                <Icon icon={a.icon} /> {a.label}
                                            </Link>
                                        ) : (
                                            <button
                                                key={a.label}
                                                type="button"
                                                onClick={a.onClick}
                                                className="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-[#BFFF00] hover:text-black rounded-xl text-white text-xs font-bold transition-all border border-white/5 text-left active:scale-[0.97]"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-[#E6E6E6] p-8 w-full max-w-xl shadow-xl relative my-8">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        
                        {/* Close button X */}
                        <button
                            onClick={() => {
                                setShowEditModal(false);
                                setFormData({
                                    category_id: menu.category_id ?? '',
                                    name: menu.name ?? '',
                                    description: menu.description ?? '',
                                    price: menu.price ?? '',
                                    is_active: !!menu.is_active,
                                    image: null,
                                    estimated_hpp: menu.hpp ?? menu.recipe?.total_hpp ?? '',
                                });
                                setErrors({});
                                setImagePreview(menu.image_url ?? null);
                            }}
                            className="absolute top-6 right-6 p-1.5 text-black/40 hover:text-black hover:bg-neutral-50 rounded-xl transition-all z-20 flex items-center justify-center active:scale-[0.97]"
                        >
                            <iconify-icon icon="material-symbols:close" class="text-xl"></iconify-icon>
                        </button>

                        <h3 className="font-extrabold text-xl text-black mb-1 relative z-10">
                            Edit Detail Menu
                        </h3>
                        <p className="text-xs text-black/60 mb-8 relative z-10">
                            Ubah rincian informasi, harga jual, dan estimasi HPP menu hidangan.
                        </p>

                        <form onSubmit={handleEditSubmit} className="space-y-5 relative z-10">
                            {/* Row 1: Foto Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-black uppercase tracking-wider">
                                    Foto Menu
                                </label>
                                <div className="col-span-8 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#D0D0D0] hover:border-[#999999] bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative cursor-pointer transition-colors group">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <iconify-icon icon="solar:add-circle-linear" class="text-2xl text-black/40 group-hover:text-black transition-colors"></iconify-icon>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-[11px] text-black/60 font-semibold leading-relaxed max-w-[220px]">
                                        Format JPG, PNG atau WebP.<br />Maksimal ukuran file 2MB.
                                    </div>
                                </div>
                                {errors.image && (
                                    <p className="col-start-5 col-span-8 text-[11px] text-rose-500 font-bold mt-1">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Row 2: Nama Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-black uppercase tracking-wider">
                                    Nama Menu
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Contoh: Es Kopi Susu Gula Aren"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {errors.name && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Kategori */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-black uppercase tracking-wider">
                                    Kategori
                                </label>
                                <div className="col-span-8">
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all cursor-pointer font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    >
                                        <option value="" disabled>-- Pilih Kategori --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Harga Jual (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-black uppercase tracking-wider">
                                    Harga Jual (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        placeholder="25000"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-bold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {errors.price && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 5: Estimasi HPP (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-black uppercase tracking-wider mt-2.5">
                                    Estimasi HPP (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.estimated_hpp}
                                        onChange={(e) => setFormData(prev => ({ ...prev, estimated_hpp: e.target.value }))}
                                        placeholder="8500"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    <span className="text-[10px] text-neutral-400 mt-1 italic block leading-normal">
                                        *HPP akan diperbarui otomatis setelah resep dihubungkan.
                                    </span>
                                    {errors.estimated_hpp && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {errors.estimated_hpp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 6: Deskripsi */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-bold text-black uppercase tracking-wider mt-2.5">
                                    Deskripsi
                                </label>
                                <div className="col-span-8">
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Deskripsi..."
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all resize-none font-medium text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {errors.description && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {errors.description}
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
                                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-2 ${ formData.is_active ? 'bg-black' : 'bg-[#E6E6E6]' } active:scale-[0.97]`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                formData.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <span
                                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className="text-xs font-bold text-black cursor-pointer select-none"
                                    >
                                        Aktif & Tampilkan di POS
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center gap-4 mt-8 pt-4 border-t border-[#E6E6E6]/30">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setFormData({
                                            category_id: menu.category_id ?? '',
                                            name: menu.name ?? '',
                                            description: menu.description ?? '',
                                            price: menu.price ?? '',
                                            is_active: !!menu.is_active,
                                            image: null,
                                            estimated_hpp: menu.hpp ?? menu.recipe?.total_hpp ?? '',
                                        });
                                        setErrors({});
                                        setImagePreview(menu.image_url ?? null);
                                    }}
                                    className="px-6 py-2.5 text-xs font-extrabold text-black/60 hover:text-black transition-colors active:scale-[0.97]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 active:scale-[0.97]"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
