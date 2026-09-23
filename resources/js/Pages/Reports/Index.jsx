import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ModernDatePicker from "@/Components/ModernDatePicker";
import Head from "@/Components/Head";
import client from "@/api/client";
import ReportsSkeleton from "@/Components/Skeletons/ReportsSkeleton";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
    "Rp " + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });
const fmtNum = (n) =>
    Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

const trendClass = (type) =>
    type === "up"
        ? "text-emerald-700 bg-emerald-50 border-emerald-100"
        : "text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20";

function PeriodDropdown({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const options = [
        { value: "7", label: "7 Hari Terakhir" },
        { value: "30", label: "30 Hari Terakhir" },
        { value: "90", label: "3 Bulan Terakhir" },
    ];

    const currentLabel = options.find((o) => o.value === String(value))?.label ?? "Pilih Periode";

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white border border-[#D0D0D0] rounded-xl px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-sm font-semibold text-black hover:bg-[#E6E6E6] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 transition-all select-none cursor-pointer active:scale-[0.97]"
            >
                <iconify-icon icon="solar:calendar-linear" class="text-black text-lg" />
                <span>{currentLabel}</span>
                <iconify-icon icon="solar:alt-arrow-down-linear" class={`text-xs text-[#666666]/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E6E6E6] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${String(value) === opt.value ? "bg-[#BFFF00] text-black" : "text-black hover:bg-[#E6E6E6]"} active:scale-[0.97]`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, trend, trendType, iconBg, iconColor, icon }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),_0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.02)]`}>
                    <iconify-icon icon={icon} class={`${iconColor} text-xl`}></iconify-icon>
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-xs font-bold border px-2 py-0.5 rounded-full ${trendClass(trendType)}`}>
                        <iconify-icon
                            icon={trendType === "up" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                            class="text-[11px]"
                        ></iconify-icon>
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2 truncate">
                {title}
            </p>
            <p className="text-xl md:text-2xl font-extrabold mt-0.5 tracking-tight truncate text-black leading-tight">
                {value}
            </p>
        </div>
    );
}

// ── RevenueChart ──────────────────────────────────────────────────────────────
function RevenueChart({ labels, revenue, profit }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !window.Chart) return;

        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new window.Chart(canvasRef.current, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Pendapatan",
                        data: revenue,
                        borderColor: "#0E0E0E",
                        backgroundColor: "rgba(14,14,14,0.08)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#0E0E0E",
                        pointRadius: 3,
                        pointHoverRadius: 5,
                    },
                    {
                        label: "Laba Bersih",
                        data: profit,
                        borderColor: "#059669",
                        backgroundColor: "rgba(5,150,105,0.06)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#059669",
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
                            label: (ctx) =>
                                "Rp " +
                                ctx.parsed.y.toLocaleString("id-ID"),
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "#666666",
                            font: { weight: "semibold", size: 11 },
                        },
                    },
                    y: {
                        grid: { color: "#E6E6E6", lineWidth: 0.8 },
                        ticks: {
                            color: "#666666",
                            font: { size: 10 },
                            callback: (val) =>
                                "Rp " + (val / 1_000_000).toFixed(1) + "M",
                        },
                    },
                },
            },
        });

        return () => chartRef.current?.destroy();
    }, [labels, revenue, profit]);

    return <canvas ref={canvasRef} />;
}

// ── DonutChart ────────────────────────────────────────────────────────────────
function DonutChart({ labels, data, bg }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !window.Chart) return;

        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new window.Chart(canvasRef.current, {
            type: "doughnut",
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: bg,
                        borderWidth: 0,
                        hoverOffset: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "72%",
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.label + ": " + ctx.parsed + "%",
                        },
                    },
                },
            },
        });

        return () => chartRef.current?.destroy();
    }, [labels, data, bg]);

    return <canvas ref={canvasRef} />;
}

// ── FilterModal ───────────────────────────────────────────────────────────────
function FilterModal({ open, onClose, kasir, kategori, payments, days }) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const [form, setForm] = useState({
        start_date: params.get("start_date") ?? "",
        end_date: params.get("end_date") ?? "",
        kasir_id: params.get("kasir_id") ?? "",
        kategori_id: params.get("kategori_id") ?? "",
        payment_method: params.get("payment_method") ?? "",
    });

    if (!open) return null;

    const apply = () => {
        const q = new URLSearchParams({ days, ...form });
        Object.keys(form).forEach((k) => !form[k] && q.delete(k));
        navigate("/reports?" + q.toString());
        onClose();
    };

    const reset = () => {
        navigate("/reports");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-[#0E0E0E]/40 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#E6E6E6] w-full max-w-md mx-4 p-6 z-10">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-semibold text-black">
                        Filter Laporan
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#999999] hover:bg-[#E6E6E6] hover:text-black rounded-xl p-1 transition-colors active:scale-[0.98]"
                    >
                        <iconify-icon icon="solar:close-circle-linear" class="text-xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-[#666666] mb-1 block">
                                Dari Tanggal
                            </label>
                            <ModernDatePicker
                                value={form.start_date}
                                onChange={(val) => setForm({ ...form, start_date: val })}
                                placeholder="Pilih Tanggal"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#666666] mb-1 block">
                                Sampai Tanggal
                            </label>
                            <ModernDatePicker
                                value={form.end_date}
                                onChange={(val) => setForm({ ...form, end_date: val })}
                                placeholder="Pilih Tanggal"
                            />
                        </div>
                    </div>

                    {[
                        {
                            label: "Kasir",
                            key: "kasir_id",
                            options: kasir.map((k) => ({
                                value: k.id,
                                label: k.name,
                            })),
                            placeholder: "Semua Kasir",
                        },
                        {
                            label: "Kategori",
                            key: "kategori_id",
                            options: kategori.map((k) => ({
                                value: k.id,
                                label: k.name,
                            })),
                            placeholder: "Semua Kategori",
                        },
                        {
                            label: "Metode Pembayaran",
                            key: "payment_method",
                            options: payments.map((p) => ({
                                value: p,
                                label: p,
                            })),
                            placeholder: "Semua Metode",
                        },
                    ].map(({ label, key, options, placeholder }) => (
                        <div key={key}>
                            <label className="text-xs font-semibold text-[#666666] mb-1 block">
                                {label}
                            </label>
                            <select
                                value={form[key]}
                                onChange={(e) =>
                                    setForm({ ...form, [key]: e.target.value })
                                }
                                className="w-full bg-white border border-[#D0D0D0] rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 cursor-pointer transition-all duration-150"
                            >
                                <option value="">{placeholder}</option>
                                {options.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={reset}
                        className="flex-1 py-2.5 text-sm font-semibold border border-[#D0D0D0] rounded-xl text-black hover:bg-[#E6E6E6] transition-colors active:scale-[0.98]"
                    >
                        Reset
                    </button>
                    <button
                        onClick={apply}
                        className="flex-1 py-2.5 text-sm font-semibold bg-[#BFFF00] hover:bg-[#C8FF5E] text-black rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98]"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportsIndex() {
    const [filterOpen, setFilterOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const hasFilter = ["start_date", "end_date", "kasir_id", "kategori_id", "payment_method"].some(
        (k) => new URLSearchParams(location.search).has(k)
    );

    const changePeriod = (val) => {
        const params = new URLSearchParams(location.search);
        params.set("days", val);
        navigate("/reports?" + params.toString());
    };

    useEffect(() => {
        let isMounted = true;
        const fetchReports = async () => {
            setLoading(true);
            try {
                const res = await client.get(`/reports${location.search}`);
                if (isMounted) {
                    setData(res.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Gagal memuat laporan:", err);
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchReports();
        return () => {
            isMounted = false;
        };
    }, [location.search, refreshTrigger]);

    const handleExportExcel = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await client.get(`/reports/export/excel${location.search}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Gagal mengunduh laporan:", err);
            alert("Gagal mengunduh laporan.");
        }
    };

    const handleViewReport = async (e, path) => {
        if (e) e.preventDefault();
        try {
            const response = await client.get(path, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }));
            window.open(url, '_blank');
        } catch (err) {
            console.error("Gagal membuka laporan:", err);
            alert("Gagal memuat laporan.");
        }
    };

    // Chart.js perlu di-load via CDN karena tidak di-bundle
    useEffect(() => {
        if (window.Chart) return;
        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
        script.async = true;
        document.head.appendChild(script);
    }, []);

    const {
        totalRevenue = 0,
        totalOrders = 0,
        avgTransaction = 0,
        totalProfit = 0,
        days = 7,
        revenueTrend = 0,
        revenueTrendType = "up",
        ordersTrend = 0,
        ordersTrendType = "up",
        avgTrend = 0,
        avgTrendType = "up",
        profitTrend = 0,
        profitTrendType = "up",
        bestMenus = [],
        chartLabels = [],
        chartRevenue = [],
        chartProfit = [],
        donutLabels = [],
        donutData = [],
        donutBg = [],
        busySlots = [],
        targetRevenue = 0,
        currentRevenue = 0,
        targetProgress = 0,
        targetRemaining = 0,
        recentReports = [],
        filterKasir = [],
        filterKategori = [],
        filterPayments = [],
    } = data || {};

    const categoryColors = {
        Coffee: "bg-[#E6E6E6] text-black border border-[#D0D0D0]",
        "Non-Coffee": "bg-emerald-50 text-emerald-700 border border-emerald-100",
        "Main Course": "bg-amber-50 text-amber-700 border border-amber-100",
        Snacks: "bg-rose-50 text-[#FF3B30] border border-[#FF3B30]/10",
    };

    const navItems = [
        {
            label: "Laporan Penjualan",
            icon: "solar:chart-2-linear",
            path: "/reports/sales",
        },
        {
            label: "Laporan Harian",
            icon: "solar:calendar-mark-linear",
            path: "/reports/daily",
        },
        {
            label: "Laporan Bulanan",
            icon: "solar:calendar-linear",
            path: "/reports/monthly",
        },
        {
            label: "Laba & Rugi",
            icon: "solar:graph-up-linear",
            path: "/reports/profit-loss",
        },
        {
            label: "Laporan Inventaris",
            icon: "solar:box-linear",
            path: "/reports/inventory",
        },
    ];

    if (loading && !data) {
        return (
            <>
                <Head title="Laporan Bisnis" />
                <ReportsSkeleton />
            </>
        )
    }

    if (error && !data) {
        return (
            <>
                <Head title="Laporan Bisnis" />
                <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]/30 p-4">
                    <div className="bg-white p-8 rounded-3xl border border-[#E6E6E6] max-w-md w-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-[#FF3B30] text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-base font-semibold text-black mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-[#666666] mb-6">
                            Gagal memuat data laporan dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-[#BFFF00] hover:bg-[#C8FF5E] text-black py-2.5 rounded-xl font-semibold shadow-md active:scale-[0.97] transition-all">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Head title="Laporan Bisnis" />

            <div className="space-y-6 p-4 md:p-6 bg-[#E6E6E6]/30 min-h-screen">

                {/* ── TOP HEADER ── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-black to-[#333333]">
                            Laporan Bisnis
                        </h1>
                        <p className="text-xs text-[#666666] font-normal mt-1">
                            Pantau performa dan pertumbuhan cafe Anda secara real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Period Filter */}
                        <PeriodDropdown
                            value={days}
                            onChange={(val) => changePeriod(val)}
                        />

                        {/* Filter Button */}
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="text-sm font-semibold text-black bg-white border border-[#D0D0D0] px-4 py-2.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#E6E6E6] transition-all flex items-center gap-2 active:scale-[0.97]"
                        >
                            <iconify-icon
                                icon="solar:filter-linear"
                                class="text-black"
                            />
                            Filter
                            {hasFilter && (
                                <span className="w-2 h-2 bg-[#BFFF00] rounded-full" />
                            )}
                        </button>

                        {/* Export */}
                        <button
                            onClick={handleExportExcel}
                            className="bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] active:scale-[0.97]"
                        >
                            <iconify-icon
                                icon="solar:export-linear"
                                class="text-[18px]"
                            />
                            Ekspor Laporan
                        </button>
                    </div>
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Pendapatan"
                        value={fmt(totalRevenue)}
                        trend={(revenueTrend >= 0 ? "+" : "") + revenueTrend + "%"}
                        trendType={revenueTrendType}
                        icon="heroicons:currency-dollar"
                        iconBg="bg-[#E6E6E6]/50"
                        iconColor="text-black"
                    />
                    <StatCard
                        title="Estimasi Laba Bersih"
                        value={fmt(totalProfit)}
                        trend={(profitTrend >= 0 ? "+" : "") + profitTrend + "%"}
                        trendType={profitTrendType}
                        icon="heroicons:chart-pie"
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-700"
                    />
                    <StatCard
                        title="Total Pesanan"
                        value={fmtNum(totalOrders)}
                        trend={(ordersTrend >= 0 ? "+" : "") + ordersTrend + "%"}
                        trendType={ordersTrendType}
                        icon="heroicons:shopping-bag"
                        iconBg="bg-[#E6E6E6]/50"
                        iconColor="text-black"
                    />
                    <StatCard
                        title="Rata-rata Transaksi"
                        value={fmt(avgTransaction)}
                        trend={(avgTrend >= 0 ? "+" : "") + avgTrend + "%"}
                        trendType={avgTrendType}
                        icon="heroicons:receipt-percent"
                        iconBg="bg-[#E6E6E6]/50"
                        iconColor="text-black"
                    />
                </div>

                {/* ── MAIN GRID ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* ── LEFT CONTENT ── */}
                    <div className="xl:col-span-9 space-y-6">

                        {/* Tren Pendapatan & Komposisi Penjualan */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* Line Chart */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <h3 className="text-base font-semibold text-black">
                                            Tren Pendapatan & Laba
                                        </h3>
                                        <p className="text-xs text-[#666666] font-normal mt-0.5">
                                            Visualisasi harian dalam {days} hari terakhir.
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/20 px-3 py-1 rounded-full">
                                        <span className="w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
                                        Live Data
                                    </span>
                                </div>
                                <div className="mt-5 h-48 relative">
                                    <RevenueChart
                                        labels={chartLabels}
                                        revenue={chartRevenue}
                                        profit={chartProfit}
                                    />
                                </div>
                                <div className="flex gap-5 mt-4 text-xs font-bold text-[#666666] justify-center">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#0E0E0E]" />
                                        Pendapatan
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                                        Laba Bersih
                                    </span>
                                </div>
                            </div>

                            {/* Donut Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-base font-semibold text-black">
                                        Komposisi Penjualan
                                    </h3>
                                    <p className="text-xs text-[#666666] font-normal mt-0.5">
                                        Berdasarkan kategori produk utama.
                                    </p>
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="relative w-36 h-36">
                                        {donutLabels.length > 0 ? (
                                            <DonutChart
                                                labels={donutLabels}
                                                data={donutData}
                                                bg={donutBg}
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full border-4 border-[#E6E6E6] flex items-center justify-center">
                                                <span className="text-xs text-[#999999] font-normal text-center px-2">
                                                    Belum ada data
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5 space-y-2">
                                    {donutLabels.length > 0 ? (
                                        donutLabels.map((label, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between text-xs"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                donutBg[i] ?? "#E6E6E6",
                                                        }}
                                                    />
                                                    <span className="font-semibold text-black">
                                                        {label}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-black">
                                                    {donutData[i] ?? 0}%
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-[#999999] italic text-center py-2">
                                            Belum ada data penjualan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Produk Terlaris */}
                        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-5">
                                <div>
                                    <h3 className="text-base font-semibold text-black">Produk Terlaris</h3>
                                    <p className="text-xs text-[#666666] font-normal mt-0.5">
                                        Item dengan volume penjualan dan profitabilitas tertinggi.
                                    </p>
                                </div>
                                <Link
                                    to="/menus"
                                    className="text-xs text-black border-b border-[#D0D0D0] hover:border-black font-semibold pb-0.5 flex items-center gap-1 transition-all"
                                >
                                    Lihat Semua Menu
                                    <iconify-icon icon="solar:arrow-right-linear" />
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="bg-[#E6E6E6]/20 border-b border-[#E6E6E6]">
                                            <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Nama Menu</th>
                                            <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Kategori</th>
                                            <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999] text-center">Qty Terjual</th>
                                            <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999] text-right">Total Pendapatan</th>
                                            <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999] text-right">Est. Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E6E6]/50">
                                        {bestMenus.length > 0 ? (
                                            bestMenus.map((menu, i) => (
                                                <tr key={i} className="hover:bg-[#E6E6E6]/30 active:bg-[#E6E6E6]/60 transition-all duration-200">
                                                    <td className="px-6 py-4">
                                                        <p className="text-[13px] font-medium text-[#000000] truncate max-w-[200px]" title={menu.name}>
                                                            {menu.name}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${categoryColors[menu.category] ?? 'bg-[#E6E6E6]/60 text-[#666666] border-[#D0D0D0]'
                                                            }`}>
                                                            {menu.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-[13px] text-[#666666]">
                                                        {fmtNum(menu.qty)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-[14px] font-semibold text-[#000000]">
                                                        {fmt(menu.revenue)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-[14px] font-semibold text-emerald-700">
                                                        {menu.margin}%
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-[#E6E6E6]/50 flex items-center justify-center">
                                                            <iconify-icon icon="solar:chart-linear" class="text-3xl text-[#999999]"></iconify-icon>
                                                        </div>
                                                        <p className="text-sm font-semibold text-black">
                                                            Belum ada data penjualan dalam {days} hari terakhir.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Performa Jam Sibuk & Target Bulanan */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Jam Sibuk */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <h3 className="text-base font-semibold text-black mb-1">
                                    Performa Jam Sibuk
                                </h3>
                                <p className="text-xs text-[#666666] font-normal mb-5">
                                    Volume transaksi berdasarkan waktu operasional.
                                </p>
                                {busySlots.length > 0 ? (
                                    <>
                                        <div className="flex items-end justify-between h-40 gap-2">
                                            {busySlots.map((slot, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                                                    title={`${slot.count} transaksi`}
                                                >
                                                    <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A1A1A] px-1.5 py-0.5 rounded-md mb-1 shadow-sm">
                                                        {slot.count}
                                                    </span>
                                                    <div
                                                        className="w-full bg-[#E6E6E6] group-hover:bg-[#BFFF00] rounded-t-lg transition-all duration-300"
                                                        style={{
                                                            height: `${slot.height}%`,
                                                            minHeight: "4px",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-3">
                                            {busySlots.map((slot, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] font-semibold text-[#666666]"
                                                >
                                                    {slot.label}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-[#999999] italic text-center py-10">
                                        Belum ada data transaksi.
                                    </p>
                                )}
                            </div>

                            {/* Target Bulanan */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-black mb-1">
                                        Target Penjualan Bulanan
                                    </h3>
                                    <p className="text-xs text-[#666666] font-normal mb-6">
                                        Progress pencapaian target bulan ini.
                                    </p>
                                </div>

                                {targetRevenue > 0 ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-36 h-36">
                                            <svg
                                                className="w-full h-full -rotate-90"
                                                viewBox="0 0 36 36"
                                            >
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15.9"
                                                    fill="none"
                                                    stroke="#E6E6E6"
                                                    strokeWidth="3"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15.9"
                                                    fill="none"
                                                    stroke="#BFFF00"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${targetProgress}, 100`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-bold text-black">
                                                    {targetProgress}%
                                                </span>
                                                <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
                                                    Tercapai
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-black">
                                                {fmt(currentRevenue)} / {fmt(targetRevenue)}
                                            </p>
                                            <p className="text-xs text-[#666666] font-normal mt-1">
                                                {targetProgress >= 100 ? (
                                                    "🎉 Target bulan ini tercapai!"
                                                ) : (
                                                    <>
                                                        Butuh{" "}
                                                        <span className="font-bold text-black">
                                                            {fmt(targetRemaining)}
                                                        </span>{" "}
                                                        lagi untuk mencapai target!
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-3 py-6">
                                        <div className="w-14 h-14 rounded-2xl bg-[#E6E6E6]/50 border border-[#E6E6E6] flex items-center justify-center">
                                            <iconify-icon
                                                icon="solar:target-linear"
                                                class="text-2xl text-black"
                                            />
                                        </div>
                                        <p className="text-xs text-[#666666] font-normal text-center">
                                            Belum ada target bulanan yang ditetapkan.
                                        </p>
                                    </div>
                                )}

                                <a href="/targets-goals"
                                    className="mt-5 block w-full py-2.5 text-xs font-semibold text-center text-black border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] transition-all">
                                    {targetRevenue > 0
                                        ? "Lihat Rincian Target"
                                        : "Set Target Bulanan"}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="xl:col-span-3 space-y-6">

                        {/* AI Insight */}
                        <div className="bg-[#0E0E0E] text-white p-5 rounded-2xl border border-black shadow-[0_4px_16px_rgba(0,0,0,0.08)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#BFFF00]/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <iconify-icon
                                        icon="solar:stars-linear"
                                        class="text-[#BFFF00] text-xl"
                                    />
                                    <span className="text-xs font-semibold text-[#BFFF00] uppercase tracking-wider">
                                        Insight AI Hari Ini
                                    </span>
                                </div>
                                <p className="text-xs font-normal text-[#E6E6E6] leading-relaxed mb-3">
                                    "Pesanan{" "}
                                    <span className="font-semibold text-white">Kopi Susu</span> naik{" "}
                                    <span className="font-semibold text-[#BFFF00]">15%</span>{" "}
                                    di hari Jumat malam. Pastikan stok biji kopi House Blend
                                    tersedia cukup untuk akhir pekan ini."
                                </p>
                                <Link
                                    to="/targets-goals/aov"
                                    className="text-xs font-semibold text-[#BFFF00] hover:text-[#C8FF5E] transition-colors flex items-center gap-1"
                                >
                                    Lihat Analisis Detail
                                    <iconify-icon
                                        icon="solar:arrow-right-linear"
                                        class="text-[12px]"
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Laporan Terbaru */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <h3 className="text-base font-semibold text-black mb-4">
                                Laporan Terbaru
                            </h3>

                            <div className="space-y-3">
                                {recentReports.length > 0 ? (
                                    recentReports.map((report, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => handleViewReport(e, report.route)}
                                            className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-[#D0D0D0] hover:border-[#BFFF00] hover:bg-[#E6E6E6]/10 transition-all group active:scale-[0.98]"
                                        >
                                            <div className="w-9 h-9 bg-[#E6E6E6]/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#BFFF00] transition-colors">
                                                <iconify-icon
                                                    icon="solar:document-linear"
                                                    class="text-black text-base group-hover:text-black transition-colors"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-black truncate group-hover:text-black transition-colors">
                                                    {report.label}
                                                </p>

                                                <p className="text-[10px] text-[#999999] font-mono mt-0.5">
                                                    {report.date}
                                                </p>
                                            </div>

                                            <iconify-icon
                                                icon="solar:arrow-right-linear"
                                                class="text-[#E6E6E6] group-hover:text-[#BFFF00] transition-colors text-sm flex-shrink-0"
                                            />
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-4">
                                        <iconify-icon
                                            icon="solar:document-linear"
                                            class="text-[#E6E6E6] text-3xl"
                                        />

                                        <p className="text-xs text-[#999999] italic text-center">
                                            Belum ada laporan tersimpan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Aksi Cepat */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <h3 className="text-base font-semibold text-black mb-4">
                                Aksi Cepat
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleExportExcel}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] transition-all group text-black font-semibold text-[11px] w-full active:scale-[0.98]"
                                >
                                    <iconify-icon
                                        icon="solar:share-linear"
                                        class="text-black text-2xl group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-[11px] font-semibold text-black">
                                        Bagikan
                                    </span>
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] transition-all group text-black font-semibold text-[11px] w-full active:scale-[0.98]"
                                >
                                    <iconify-icon
                                        icon="solar:printer-linear"
                                        class="text-black text-2xl group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-[11px] font-semibold text-black">
                                        Cetak
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Navigasi Laporan */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <h3 className="text-base font-semibold text-black mb-4">
                                Navigasi Laporan
                            </h3>
                            <div className="space-y-2">
                                {navItems.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => handleViewReport(e, item.path)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#E6E6E6] transition-all group text-left active:scale-[0.98]"
                                    >
                                        <iconify-icon
                                            icon={item.icon}
                                            class="text-black text-lg flex-shrink-0"
                                        />
                                        <span className="text-xs font-semibold text-black group-hover:text-black transition-colors">
                                            {item.label}
                                        </span>
                                        <iconify-icon
                                            icon="solar:arrow-right-linear"
                                            class="text-[#E6E6E6] group-hover:text-black transition-colors text-xs ml-auto"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Filter Modal ── */}
            <FilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                kasir={filterKasir}
                kategori={filterKategori}
                payments={filterPayments}
                days={days}
            />
        </>
    );
}
