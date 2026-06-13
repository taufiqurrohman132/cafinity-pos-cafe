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
        ? "text-[#059669] bg-[#ecfdf5] border-[#d1fae5]"
        : "text-[#991b1b] bg-[#fef2f2] border-[#fecaca]";

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
                className="flex items-center gap-2 bg-white border border-brand-light rounded-xl px-4 py-2.5 shadow-sm text-sm font-bold text-brand-dark hover:bg-brand-light/30 transition-all select-none cursor-pointer"
            >
                <iconify-icon icon="solar:calendar-linear" class="text-brand-secondary text-lg" />
                <span>{currentLabel}</span>
                <iconify-icon icon="solar:alt-arrow-down-linear" class={`text-xs text-brand-primary/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-light rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${String(value) === opt.value
                                    ? "bg-brand-light/40 text-brand-secondary"
                                    : "text-brand-dark hover:bg-brand-light/20"
                                }}`}
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
        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
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
            <p className="text-xs font-bold text-brand-primary capitalize tracking-wide truncate">
                {title}
            </p>
            <p className={`text-xl mt-0.5 truncate ${title?.toLowerCase()?.includes('laba') ? 'text-[#059669]' : ((typeof value === 'string' && value.startsWith('Rp')) ? 'text-brand-secondary' : 'text-brand-dark')} ${(title?.toLowerCase()?.includes('laba') || (typeof value === 'string' && value.startsWith('Rp'))) ? 'font-black' : 'font-extrabold'}`}>
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
                        borderColor: "rgb(var(--color-brand-secondary))",
                        backgroundColor: "rgb(var(--color-brand-secondary) / 0.08)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "rgb(var(--color-brand-secondary))",
                        pointRadius: 3,
                        pointHoverRadius: 5,
                    },
                    {
                        label: "Laba Bersih",
                        data: profit,
                        borderColor: "#34d399",
                        backgroundColor: "rgba(52,211,153,0.06)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#34d399",
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
                            color: "rgb(var(--color-brand-primary))",
                            font: { weight: "bold", size: 11 },
                        },
                    },
                    y: {
                        grid: { color: "rgb(var(--color-brand-light))", lineWidth: 0.8 },
                        ticks: {
                            color: "rgb(var(--color-brand-primary))",
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
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-brand-light w-full max-w-md mx-4 p-6 z-10">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-extrabold text-brand-dark">
                        Filter Laporan
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-brand-primary hover:text-brand-dark transition-colors"
                    >
                        <iconify-icon icon="solar:close-circle-linear" class="text-xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-brand-primary mb-1 block">
                                Dari Tanggal
                            </label>
                            <ModernDatePicker
                                value={form.start_date}
                                onChange={(val) => setForm({ ...form, start_date: val })}
                                placeholder="Pilih Tanggal"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-brand-primary mb-1 block">
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
                            <label className="text-xs font-bold text-brand-primary mb-1 block">
                                {label}
                            </label>
                            <select
                                value={form[key]}
                                onChange={(e) =>
                                    setForm({ ...form, [key]: e.target.value })
                                }
                                className="w-full border border-brand-light rounded-xl px-3 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-secondary bg-white"
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
                        className="flex-1 py-2.5 text-sm font-bold border border-brand-light rounded-xl text-brand-primary hover:bg-brand-light/30 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={apply}
                        className="flex-1 py-2.5 text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:opacity-90 transition-opacity"
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
        Coffee: "bg-brand-light text-brand-primary",
        "Non-Coffee": "bg-[#ecfdf5] text-[#065f46] border border-[#d1fae5]",
        "Main Course": "bg-amber-100 text-amber-700",
        Snacks: "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]",
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
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data laporan dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
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

            <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen">

                {/* ── TOP HEADER ── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Laporan Bisnis
                        </h1>
                        <p className="text-brand-primary mt-1 text-sm font-medium">
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
                            className="text-sm font-bold text-brand-primary bg-white border border-brand-light px-4 py-2.5 rounded-xl shadow-sm hover:bg-brand-light/40 transition-all flex items-center gap-2"
                        >
                            <iconify-icon
                                icon="solar:filter-linear"
                                class="text-brand-secondary"
                            />
                            Filter
                            {hasFilter && (
                                <span className="w-2 h-2 bg-brand-secondary rounded-full" />
                            )}
                        </button>

                        {/* Export */}
                        <button
                            onClick={handleExportExcel}
                            className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30 active:scale-[0.98]"
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
                        iconBg="bg-brand-light"
                        iconColor="text-brand-secondary"
                    />
                    <StatCard
                        title="Estimasi Laba Bersih"
                        value={fmt(totalProfit)}
                        trend={(profitTrend >= 0 ? "+" : "") + profitTrend + "%"}
                        trendType={profitTrendType}
                        icon="heroicons:chart-pie"
                        iconBg="bg-[#ecfdf5]"
                        iconColor="text-[#059669]"
                    />
                    <StatCard
                        title="Total Pesanan"
                        value={fmtNum(totalOrders)}
                        trend={(ordersTrend >= 0 ? "+" : "") + ordersTrend + "%"}
                        trendType={ordersTrendType}
                        icon="heroicons:shopping-bag"
                        iconBg="bg-brand-light"
                        iconColor="text-brand-secondary"
                    />
                    <StatCard
                        title="Rata-rata Transaksi"
                        value={fmt(avgTransaction)}
                        trend={(avgTrend >= 0 ? "+" : "") + avgTrend + "%"}
                        trendType={avgTrendType}
                        icon="heroicons:receipt-percent"
                        iconBg="bg-brand-light"
                        iconColor="text-brand-primary"
                    />
                </div>

                {/* ── MAIN GRID ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* ── LEFT CONTENT ── */}
                    <div className="xl:col-span-9 space-y-6">

                        {/* Tren Pendapatan & Komposisi Penjualan */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* Line Chart */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <h3 className="text-base font-extrabold text-brand-dark tracking-tight">
                                            Tren Pendapatan & Laba
                                        </h3>
                                        <p className="text-xs text-brand-primary font-medium mt-0.5">
                                            Visualisasi harian dalam {days} hari terakhir.
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#991b1b] bg-[#fef2f2] border border-[#fecaca] px-3 py-1 rounded-full">
                                        <span className="w-2 h-2 bg-[#b91c1c] rounded-full animate-pulse" />
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
                                <div className="flex gap-5 mt-4 text-xs font-bold text-brand-primary justify-center">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
                                        Pendapatan
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                                        Laba Bersih
                                    </span>
                                </div>
                            </div>

                            {/* Donut Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-base font-extrabold text-brand-dark tracking-tight">
                                        Komposisi Penjualan
                                    </h3>
                                    <p className="text-xs text-brand-primary font-medium mt-0.5">
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
                                            <div className="w-full h-full rounded-full border-4 border-brand-light flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-brand-primary text-center px-2">
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
                                                                donutBg[i] ?? "rgb(var(--color-brand-light))",
                                                        }}
                                                    />
                                                    <span className="font-medium text-brand-dark">
                                                        {label}
                                                    </span>
                                                </div>
                                                <span className="font-extrabold text-brand-dark">
                                                    {donutData[i] ?? 0}%
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-brand-primary italic text-center py-2">
                                            Belum ada data penjualan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Produk Terlaris */}
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <div>
                                    <h3 className="text-base font-extrabold text-brand-dark tracking-tight">
                                        Produk Terlaris
                                    </h3>
                                    <p className="text-xs text-brand-primary font-medium mt-0.5">
                                        Item dengan volume penjualan and profitabilitas tertinggi.
                                    </p>
                                </div>

                                <Link
                                    to="/menus"
                                    className="text-xs text-brand-secondary font-extrabold hover:text-brand-primary flex items-center gap-1 transition-colors"
                                >
                                    Lihat Semua Menu
                                    <iconify-icon icon="solar:arrow-right-linear" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="text-xs text-brand-primary border-b border-brand-light capitalize tracking-wider">
                                            <th className="pb-3 font-extrabold">Nama Menu</th>
                                            <th className="pb-3 font-extrabold">Kategori</th>
                                            <th className="pb-3 font-extrabold text-center">Qty Terjual</th>
                                            <th className="pb-3 font-extrabold text-right">Total Pendapatan</th>
                                            <th className="pb-3 font-extrabold text-right">Estimasi Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {bestMenus.length > 0 ? (
                                            bestMenus.map((menu, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b border-brand-light/50 last:border-0 hover:bg-brand-light/10 transition-colors"
                                                >
                                                    <td className="py-4 font-bold text-brand-dark">
                                                        {menu.name}
                                                    </td>
                                                    <td className="py-4">
                                                        <span
                                                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${categoryColors[menu.category] ??
                                                                "bg-brand-light text-brand-primary"
                                                                }`}
                                                        >
                                                            {menu.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-center font-bold text-brand-dark">
                                                        {fmtNum(menu.qty)}
                                                    </td>
                                                    <td className="py-4 text-right font-bold text-brand-dark">
                                                        {fmt(menu.revenue)}
                                                    </td>
                                                     <td className="py-4 text-right font-extrabold text-[#059669]">
                                                         {menu.margin}%
                                                     </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-8 text-center text-brand-primary italic text-sm"
                                                >
                                                    Belum ada data penjualan dalam {days} hari terakhir.
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
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                                <h3 className="text-base font-extrabold text-brand-dark tracking-tight mb-1">
                                    Performa Jam Sibuk
                                </h3>
                                <p className="text-xs text-brand-primary font-medium mb-5">
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
                                                    <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark px-1.5 py-0.5 rounded-md mb-1">
                                                        {slot.count}
                                                    </span>
                                                    <div
                                                        className="w-full bg-brand-light group-hover:bg-brand-secondary rounded-t-lg transition-all duration-300"
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
                                                    className="text-[10px] font-extrabold text-brand-primary"
                                                >
                                                    {slot.label}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-brand-primary italic text-center py-10">
                                        Belum ada data transaksi.
                                    </p>
                                )}
                            </div>

                            {/* Target Bulanan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-extrabold text-brand-dark tracking-tight mb-1">
                                        Target Penjualan Bulanan
                                    </h3>
                                    <p className="text-xs text-brand-primary font-medium mb-6">
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
                                                    stroke="rgb(var(--color-brand-light))"
                                                    strokeWidth="3"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15.9"
                                                    fill="none"
                                                    stroke="rgb(var(--color-brand-secondary))"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${targetProgress}, 100`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-extrabold text-brand-dark">
                                                    {targetProgress}%
                                                </span>
                                                <span className="text-[10px] font-bold text-brand-primary capitalize tracking-wide">
                                                    Tercapai
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-extrabold text-brand-dark">
                                                {fmt(currentRevenue)} / {fmt(targetRevenue)}
                                            </p>
                                            <p className="text-xs font-medium text-brand-primary mt-1">
                                                {targetProgress >= 100 ? (
                                                    "🎉 Target bulan ini tercapai!"
                                                ) : (
                                                    <>
                                                        Butuh{" "}
                                                        <span className="font-extrabold text-brand-dark">
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
                                        <div className="w-14 h-14 rounded-2xl bg-brand-light/50 border border-brand-light flex items-center justify-center">
                                            <iconify-icon
                                                icon="solar:target-linear"
                                                class="text-2xl text-brand-secondary"
                                            />
                                        </div>
                                        <p className="text-xs font-medium text-brand-primary text-center">
                                            Belum ada target bulanan yang ditetapkan.
                                        </p>
                                    </div>
                                )}

                                <a href="/targets-goals"
                                    className="mt-5 block w-full py-2.5 text-xs font-extrabold text-center text-brand-primary border border-brand-light rounded-xl hover:bg-brand-light hover:text-brand-dark transition-colors">
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
                        <div className="bg-gradient-to-br from-brand-secondary/10 to-brand-light/40 p-5 rounded-2xl border border-brand-light shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <iconify-icon
                                        icon="solar:stars-linear"
                                        class="text-brand-secondary text-xl"
                                    />
                                    <span className="text-xs font-extrabold text-brand-secondary capitalize tracking-widest">
                                        Insight AI Hari Ini
                                    </span>
                                </div>
                                <p className="text-xs font-medium text-brand-dark leading-relaxed mb-3">
                                    "Pesanan{" "}
                                    <span className="font-extrabold">Kopi Susu</span> naik{" "}
                                    <span className="font-extrabold text-brand-secondary">15%</span>{" "}
                                    di hari Jumat malam. Pastikan stok biji kopi House Blend
                                    tersedia cukup untuk akhir pekan ini."
                                </p>
                                <Link
                                    to="/targets-goals/aov"
                                    className="text-xs font-extrabold text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-1"
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
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm">
                            <h3 className="text-sm font-extrabold text-brand-dark mb-4">
                                Laporan Terbaru
                            </h3>

                            <div className="space-y-3">
                                {recentReports.length > 0 ? (
                                    recentReports.map((report, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => handleViewReport(e, report.route)}
                                            className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-brand-light hover:bg-brand-light/20 hover:border-brand-secondary transition-all group"
                                        >
                                            <div className="w-9 h-9 bg-brand-light/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <iconify-icon
                                                    icon="solar:document-linear"
                                                    class="text-brand-secondary text-base"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-brand-dark truncate group-hover:text-brand-secondary transition-colors">
                                                    {report.label}
                                                </p>

                                                <p className="text-[10px] font-medium text-brand-primary mt-0.5">
                                                    {report.date}
                                                </p>
                                            </div>

                                            <iconify-icon
                                                icon="solar:arrow-right-linear"
                                                class="text-brand-light group-hover:text-brand-secondary transition-colors text-sm flex-shrink-0"
                                            />
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-4">
                                        <iconify-icon
                                            icon="solar:document-linear"
                                            class="text-brand-light text-3xl"
                                        />

                                        <p className="text-xs text-brand-primary italic text-center">
                                            Belum ada laporan tersimpan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Aksi Cepat */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm">
                            <h3 className="text-sm font-extrabold text-brand-dark mb-4">
                                Aksi Cepat
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleExportExcel}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-brand-light hover:bg-brand-light/30 hover:border-brand-secondary transition-all group"
                                >
                                    <iconify-icon
                                        icon="solar:share-linear"
                                        class="text-brand-secondary text-2xl group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-[11px] font-extrabold text-brand-dark">
                                        Bagikan
                                    </span>
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-brand-light hover:bg-brand-light/30 hover:border-brand-secondary transition-all group"
                                >
                                    <iconify-icon
                                        icon="solar:printer-linear"
                                        class="text-brand-secondary text-2xl group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-[11px] font-extrabold text-brand-dark">
                                        Cetak
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Navigasi Laporan */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm">
                            <h3 className="text-sm font-extrabold text-brand-dark mb-4">
                                Navigasi Laporan
                            </h3>
                            <div className="space-y-2">
                                {navItems.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => handleViewReport(e, item.path)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-light/30 hover:text-brand-secondary transition-all group text-left"
                                    >
                                        <iconify-icon
                                            icon={item.icon}
                                            class="text-brand-secondary text-lg flex-shrink-0"
                                        />
                                        <span className="text-xs font-bold text-brand-dark group-hover:text-brand-secondary transition-colors">
                                            {item.label}
                                        </span>
                                        <iconify-icon
                                            icon="solar:arrow-right-linear"
                                            class="text-brand-light group-hover:text-brand-secondary transition-colors text-xs ml-auto"
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
