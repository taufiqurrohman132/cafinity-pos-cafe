// resources/js/Pages/Reports/Index.jsx

import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { useEffect, useRef, useState } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
    "Rp " + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });
const fmtNum = (n) =>
    Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

const trendClass = (type) =>
    type === "up"
        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
        : "text-rose-600 bg-rose-50 border-rose-100";

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
                className="flex items-center gap-2 bg-white border border-[#dddbff] rounded-xl px-4 py-2.5 shadow-sm text-sm font-bold text-[#050316] hover:bg-[#dddbff]/30 transition-all select-none cursor-pointer"
            >
                <iconify-icon icon="solar:calendar-linear" class="text-[#443dff] text-lg" />
                <span>{currentLabel}</span>
                <iconify-icon icon="solar:alt-arrow-down-linear" class={`text-xs text-[#2f27ce]/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#dddbff] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                                String(value) === opt.value
                                    ? "bg-[#dddbff]/40 text-[#443dff]"
                                    : "text-[#050316] hover:bg-[#dddbff]/20"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function ModernDatePicker({ value, onChange, placeholder = 'Pilih Tanggal' }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const initialDate = value ? new Date(value) : new Date();
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            setCurrentMonth(d.getMonth());
            setCurrentYear(d.getFullYear());
        }
    }, [value]);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];
        const firstDayOfWeek = date.getDay();
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonthDaysCount = new Date(prevYear, prevMonth + 1, 0).getDate();
        
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDaysCount - i,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false
            });
        }

        const daysCount = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysCount; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true
            });
        }

        const totalCells = Math.ceil(days.length / 7) * 7;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        let nextDay = 1;
        while (days.length < totalCells) {
            days.push({
                day: nextDay++,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false
            });
        }

        return days;
    };

    const calendarDays = getDaysInMonth(currentMonth, currentYear);

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleSelectDay = (dayObj, e) => {
        e.stopPropagation();
        const d = dayObj.day.toString().padStart(2, '0');
        const m = (dayObj.month + 1).toString().padStart(2, '0');
        const y = dayObj.year;
        onChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const getFormattedValue = () => {
        if (!value) return placeholder;
        const d = new Date(value);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const isToday = (dayObj) => {
        const today = new Date();
        return today.getDate() === dayObj.day && today.getMonth() === dayObj.month && today.getFullYear() === dayObj.year;
    };

    const isSelected = (dayObj) => {
        if (!value) return false;
        const d = new Date(value);
        return d.getDate() === dayObj.day && d.getMonth() === dayObj.month && d.getFullYear() === dayObj.year;
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-[#dddbff] rounded-xl px-3 py-2 text-sm text-[#050316] bg-white hover:border-[#443dff] transition-all cursor-pointer select-none"
            >
                <span className={value ? "text-[#050316] font-bold" : "text-[#2f27ce]/50 font-medium"}>
                    {getFormattedValue()}
                </span>
                <iconify-icon icon="solar:calendar-linear" class="text-[#443dff] text-base"></iconify-icon>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-[280px] bg-white border border-[#dddbff] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="w-7 h-7 rounded-lg border border-[#dddbff] flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff]/30 hover:text-[#050316] transition-all"
                        >
                            <iconify-icon icon="solar:alt-arrow-left-linear" class="text-xs"></iconify-icon>
                        </button>
                        <span className="font-extrabold text-[11px] text-[#050316]">
                            {months[currentMonth]} {currentYear}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="w-7 h-7 rounded-lg border border-[#dddbff] flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff]/30 hover:text-[#050316] transition-all"
                        >
                            <iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs"></iconify-icon>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {daysOfWeek.map((day) => (
                            <span key={day} className="text-[9px] font-extrabold text-[#2f27ce]/60 py-0.5">
                                {day}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0.5">
                        {calendarDays.map((dayObj, index) => {
                            const selected = isSelected(dayObj);
                            const today = isToday(dayObj);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => handleSelectDay(dayObj, e)}
                                    className={`h-7 w-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                                        selected
                                            ? 'bg-gradient-to-br from-[#443dff] to-[#2f27ce] text-white shadow-md shadow-[#443dff]/20'
                                            : today
                                            ? 'bg-[#dddbff]/60 text-[#2f27ce] border border-[#2f27ce]/20'
                                            : dayObj.isCurrentMonth
                                            ? 'text-[#050316] hover:bg-[#dddbff]/30 hover:text-[#2f27ce]'
                                            : 'text-[#2f27ce]/30 hover:bg-[#dddbff]/10'
                                    }`}
                                >
                                    {dayObj.day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#dddbff] mt-2.5 pt-2.5">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                const today = new Date();
                                const y = today.getFullYear();
                                const m = (today.getMonth() + 1).toString().padStart(2, '0');
                                const d = today.getDate().toString().padStart(2, '0');
                                onChange(`${y}-${m}-${d}`);
                                setIsOpen(false);
                            }}
                            className="text-[9px] font-extrabold text-[#443dff] hover:text-[#2f27ce] transition-colors"
                        >
                            Hari Ini
                        </button>
                        {value && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="text-[9px] font-extrabold text-rose-500 hover:text-rose-700 transition-colors"
                            >
                                Hapus
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, trend, trendType, iconBg, iconColor, icon }) {
    return (
        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 hover:shadow-lg hover:shadow-[#2f27ce]/10 transition-all duration-300 group">
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
            <p className="text-xs font-bold text-[#2f27ce] capitalize tracking-wide truncate">
                {title}
            </p>
            <p className="text-xl font-extrabold text-[#050316] mt-0.5 truncate">
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
                        borderColor: "#443dff",
                        backgroundColor: "rgba(68,61,255,0.08)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#443dff",
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
                            color: "#2f27ce",
                            font: { weight: "bold", size: 11 },
                        },
                    },
                    y: {
                        grid: { color: "#dddbff", lineWidth: 0.8 },
                        ticks: {
                            color: "#2f27ce",
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
    const { url } = usePage();
    const params = new URLSearchParams(url.split("?")[1] ?? "");

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
        router.get(route("reports.index") + "?" + q.toString());
        onClose();
    };

    const reset = () => {
        router.get(route("reports.index"));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-[#dddbff] w-full max-w-md mx-4 p-6 z-10">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-extrabold text-[#050316]">
                        Filter Laporan
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#2f27ce] hover:text-[#050316] transition-colors"
                    >
                        <iconify-icon icon="solar:close-circle-linear" class="text-xl" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-[#2f27ce] mb-1 block">
                                Dari Tanggal
                            </label>
                            <ModernDatePicker
                                value={form.start_date}
                                onChange={(val) => setForm({ ...form, start_date: val })}
                                placeholder="Pilih Tanggal"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#2f27ce] mb-1 block">
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
                            <label className="text-xs font-bold text-[#2f27ce] mb-1 block">
                                {label}
                            </label>
                            <select
                                value={form[key]}
                                onChange={(e) =>
                                    setForm({ ...form, [key]: e.target.value })
                                }
                                className="w-full border border-[#dddbff] rounded-xl px-3 py-2 text-sm text-[#050316] focus:outline-none focus:border-[#443dff] bg-white"
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
                        className="flex-1 py-2.5 text-sm font-bold border border-[#dddbff] rounded-xl text-[#2f27ce] hover:bg-[#dddbff]/30 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={apply}
                        className="flex-1 py-2.5 text-sm font-bold bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportsIndex({
    totalRevenue,
    totalOrders,
    avgTransaction,
    totalProfit,
    days,
    revenueTrend,
    revenueTrendType,
    ordersTrend,
    ordersTrendType,
    avgTrend,
    avgTrendType,
    profitTrend,
    profitTrendType,
    bestMenus,
    chartLabels,
    chartRevenue,
    chartProfit,
    donutLabels,
    donutData,
    donutBg,
    busySlots,
    targetRevenue,
    currentRevenue,
    targetProgress,
    targetRemaining,
    recentReports,
    filterKasir,
    filterKategori,
    filterPayments,
}) {
    const [filterOpen, setFilterOpen] = useState(false);
    const { url } = usePage();

    const hasFilter = ["start_date", "end_date", "kasir_id", "kategori_id", "payment_method"].some(
        (k) => new URLSearchParams(url.split("?")[1] ?? "").has(k)
    );

    const changePeriod = (val) => {
        router.get(route("reports.index") + "?days=" + val);
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

    const categoryColors = {
        Coffee: "bg-[#dddbff] text-[#2f27ce]",
        "Non-Coffee": "bg-emerald-100 text-emerald-700",
        "Main Course": "bg-amber-100 text-amber-700",
        Snacks: "bg-rose-100 text-rose-600",
    };

    const navItems = [
        {
            label: "Laporan Penjualan",
            icon: "solar:chart-2-linear",
            route: "reports.sales",
        },
        {
            label: "Laporan Harian",
            icon: "solar:calendar-mark-linear",
            route: "reports.daily",
        },
        {
            label: "Laporan Bulanan",
            icon: "solar:calendar-linear",
            route: "reports.monthly",
        },
        {
            label: "Laba & Rugi",
            icon: "solar:graph-up-linear",
            route: "reports.profit-loss",
        },
        {
            label: "Laporan Inventaris",
            icon: "solar:box-linear",
            route: "reports.inventory",
        },
    ];

    return (
        <>
            <Head title="Laporan Bisnis" />

            <div className="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">

                {/* ── TOP HEADER ── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Laporan Bisnis
                        </h1>
                        <p className="text-[#2f27ce] mt-1 text-sm font-medium">
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
                            className="text-sm font-bold text-[#2f27ce] bg-white border border-[#dddbff] px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#dddbff]/40 transition-all flex items-center gap-2"
                        >
                            <iconify-icon
                                icon="solar:filter-linear"
                                class="text-[#443dff]"
                            />
                            Filter
                            {hasFilter && (
                                <span className="w-2 h-2 bg-[#443dff] rounded-full" />
                            )}
                        </button>

                        {/* Export */}
                        <a
                            href={route("reports.export.excel")}
                            className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]"
                        >
                            <iconify-icon
                                icon="solar:export-linear"
                                class="text-[18px]"
                            />
                            Ekspor Laporan
                        </a>
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
                        iconBg="bg-[#dddbff]"
                        iconColor="text-[#443dff]"
                    />
                    <StatCard
                        title="Estimasi Laba Bersih"
                        value={fmt(totalProfit)}
                        trend={(profitTrend >= 0 ? "+" : "") + profitTrend + "%"}
                        trendType={profitTrendType}
                        icon="heroicons:chart-pie"
                        iconBg="bg-emerald-100"
                        iconColor="text-emerald-600"
                    />
                    <StatCard
                        title="Total Pesanan"
                        value={fmtNum(totalOrders)}
                        trend={(ordersTrend >= 0 ? "+" : "") + ordersTrend + "%"}
                        trendType={ordersTrendType}
                        icon="heroicons:shopping-bag"
                        iconBg="bg-[#dddbff]"
                        iconColor="text-[#443dff]"
                    />
                    <StatCard
                        title="Rata-rata Transaksi"
                        value={fmt(avgTransaction)}
                        trend={(avgTrend >= 0 ? "+" : "") + avgTrend + "%"}
                        trendType={avgTrendType}
                        icon="heroicons:receipt-percent"
                        iconBg="bg-[#dddbff]"
                        iconColor="text-[#2f27ce]"
                    />
                </div>

                {/* ── MAIN GRID ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* ── LEFT CONTENT ── */}
                    <div className="xl:col-span-9 space-y-6">

                        {/* Tren Pendapatan & Komposisi Penjualan */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                            {/* Line Chart */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <h3 className="text-base font-extrabold text-[#050316] tracking-tight">
                                            Tren Pendapatan & Laba
                                        </h3>
                                        <p className="text-xs text-[#2f27ce] font-medium mt-0.5">
                                            Visualisasi harian dalam {days} hari terakhir.
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
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
                                <div className="flex gap-5 mt-4 text-xs font-bold text-[#2f27ce] justify-center">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#443dff]" />
                                        Pendapatan
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                        Laba Bersih
                                    </span>
                                </div>
                            </div>

                            {/* Donut Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-base font-extrabold text-[#050316] tracking-tight">
                                        Komposisi Penjualan
                                    </h3>
                                    <p className="text-xs text-[#2f27ce] font-medium mt-0.5">
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
                                            <div className="w-full h-full rounded-full border-4 border-[#dddbff] flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-[#2f27ce] text-center px-2">
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
                                                                donutBg[i] ?? "#dddbff",
                                                        }}
                                                    />
                                                    <span className="font-medium text-[#050316]">
                                                        {label}
                                                    </span>
                                                </div>
                                                <span className="font-extrabold text-[#050316]">
                                                    {donutData[i] ?? 0}%
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-[#2f27ce] italic text-center py-2">
                                            Belum ada data penjualan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Produk Terlaris */}
                        <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <div>
                                    <h3 className="text-base font-extrabold text-[#050316] tracking-tight">
                                        Produk Terlaris
                                    </h3>
                                    <p className="text-xs text-[#2f27ce] font-medium mt-0.5">
                                        Item dengan volume penjualan and profitabilitas tertinggi.
                                    </p>
                                </div>

                                <a
                                    href={route("menus.index")}
                                    className="text-xs text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline flex items-center gap-1 transition-colors"
                                >
                                    Lihat Semua Menu
                                    <iconify-icon icon="solar:arrow-right-linear" />
                                </a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="text-xs text-[#2f27ce] border-b border-[#dddbff] capitalize tracking-wider">
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
                                                    className="border-b border-[#dddbff]/50 last:border-0 hover:bg-[#dddbff]/10 transition-colors"
                                                >
                                                    <td className="py-4 font-bold text-[#050316]">
                                                        {menu.name}
                                                    </td>
                                                    <td className="py-4">
                                                        <span
                                                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${categoryColors[menu.category] ??
                                                                "bg-[#dddbff] text-[#2f27ce]"
                                                                }`}
                                                        >
                                                            {menu.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-center font-bold text-[#050316]">
                                                        {fmtNum(menu.qty)}
                                                    </td>
                                                    <td className="py-4 text-right font-bold text-[#050316]">
                                                        {fmt(menu.revenue)}
                                                    </td>
                                                    <td className="py-4 text-right font-extrabold text-emerald-600">
                                                        {menu.margin}%
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-8 text-center text-[#2f27ce] italic text-sm"
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
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <h3 className="text-base font-extrabold text-[#050316] tracking-tight mb-1">
                                    Performa Jam Sibuk
                                </h3>
                                <p className="text-xs text-[#2f27ce] font-medium mb-5">
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
                                                    <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-[#050316] px-1.5 py-0.5 rounded-md mb-1">
                                                        {slot.count}
                                                    </span>
                                                    <div
                                                        className="w-full bg-[#dddbff] group-hover:bg-[#443dff] rounded-t-lg transition-all duration-300"
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
                                                    className="text-[10px] font-extrabold text-[#2f27ce]"
                                                >
                                                    {slot.label}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-[#2f27ce] italic text-center py-10">
                                        Belum ada data transaksi.
                                    </p>
                                )}
                            </div>

                            {/* Target Bulanan */}
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-extrabold text-[#050316] tracking-tight mb-1">
                                        Target Penjualan Bulanan
                                    </h3>
                                    <p className="text-xs text-[#2f27ce] font-medium mb-6">
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
                                                    stroke="#dddbff"
                                                    strokeWidth="3"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15.9"
                                                    fill="none"
                                                    stroke="#443dff"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${targetProgress}, 100`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-extrabold text-[#050316]">
                                                    {targetProgress}%
                                                </span>
                                                <span className="text-[10px] font-bold text-[#2f27ce] capitalize tracking-wide">
                                                    Tercapai
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-extrabold text-[#050316]">
                                                {fmt(currentRevenue)} / {fmt(targetRevenue)}
                                            </p>
                                            <p className="text-xs font-medium text-[#2f27ce] mt-1">
                                                {targetProgress >= 100 ? (
                                                    "🎉 Target bulan ini tercapai!"
                                                ) : (
                                                    <>
                                                        Butuh{" "}
                                                        <span className="font-extrabold text-[#050316]">
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
                                        <div className="w-14 h-14 rounded-2xl bg-[#dddbff]/50 border border-[#dddbff] flex items-center justify-center">
                                            <iconify-icon
                                                icon="solar:target-linear"
                                                class="text-2xl text-[#443dff]"
                                            />
                                        </div>
                                        <p className="text-xs font-medium text-[#2f27ce] text-center">
                                            Belum ada target bulanan yang ditetapkan.
                                        </p>
                                    </div>
                                )}

                                <a href={route("targets-goals.index")}
                                    className="mt-5 block w-full py-2.5 text-xs font-extrabold text-center text-[#2f27ce] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
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
                        <div className="bg-gradient-to-br from-[#443dff]/10 to-[#dddbff]/40 p-5 rounded-2xl border border-[#dddbff] shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#443dff]/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <iconify-icon
                                        icon="solar:stars-linear"
                                        class="text-[#443dff] text-xl"
                                    />
                                    <span className="text-xs font-extrabold text-[#443dff] capitalize tracking-widest">
                                        Insight AI Hari Ini
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-[#050316] leading-relaxed mb-3">
                                    "Pesanan{" "}
                                    <span className="font-extrabold">Kopi Susu</span> naik{" "}
                                    <span className="font-extrabold text-[#443dff]">15%</span>{" "}
                                    di hari Jumat malam. Pastikan stok biji kopi House Blend
                                    tersedia cukup untuk akhir pekan ini."
                                </p>
                                <a
                                    href={route("reports.analytics.aov")}
                                    className="text-xs font-extrabold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors flex items-center gap-1"
                                >
                                    Lihat Analisis Detail
                                    <iconify-icon
                                        icon="solar:arrow-right-linear"
                                        class="text-[12px]"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Laporan Terbaru */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                            <h3 className="text-sm font-extrabold text-[#050316] mb-4">
                                Laporan Terbaru
                            </h3>

                            <div className="space-y-3">
                                {recentReports.length > 0 ? (
                                    recentReports.map((report, i) => (
                                        <a
                                            key={i}
                                            href={route(report.route)}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/20 hover:border-[#443dff] transition-all group"
                                        >
                                            <div className="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <iconify-icon
                                                    icon="solar:document-linear"
                                                    class="text-[#443dff] text-base"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-[#050316] truncate group-hover:text-[#443dff] transition-colors">
                                                    {report.label}
                                                </p>

                                                <p className="text-[10px] font-medium text-[#2f27ce] mt-0.5">
                                                    {report.date}
                                                </p>
                                            </div>

                                            <iconify-icon
                                                icon="solar:arrow-right-linear"
                                                class="text-[#dddbff] group-hover:text-[#443dff] transition-colors text-sm flex-shrink-0"
                                            />
                                        </a>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-4">
                                        <iconify-icon
                                            icon="solar:document-linear"
                                            class="text-[#dddbff] text-3xl"
                                        />

                                        <p className="text-xs text-[#2f27ce] italic text-center">
                                            Belum ada laporan tersimpan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Aksi Cepat */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                            <h3 className="text-sm font-extrabold text-[#050316] mb-4">
                                Aksi Cepat
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href={route("reports.export.excel")}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/30 hover:border-[#443dff] transition-all group"
                                >
                                    <iconify-icon
                                        icon="solar:share-linear"
                                        class="text-[#443dff] text-2xl group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-[11px] font-extrabold text-[#050316]">
                                        Bagikan
                                    </span>
                                </a>
                                <button
                                    onClick={() => window.print()}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/30 hover:border-[#443dff] transition-all group"
                                >
                                    <iconify-icon
                                        icon="solar:printer-linear"
                                        class="text-[#443dff] text-2xl group-hover:scale-110 transition-transform"
                                    />
                                    <span className="text-[11px] font-extrabold text-[#050316]">
                                        Cetak
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Navigasi Laporan */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                            <h3 className="text-sm font-extrabold text-[#050316] mb-4">
                                Navigasi Laporan
                            </h3>
                            <div className="space-y-2">
                                {navItems.map((item, i) => (
                                    <a
                                        key={i}
                                        href={route(item.route)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#dddbff]/30 hover:text-[#443dff] transition-all group"
                                    >
                                        <iconify-icon
                                            icon={item.icon}
                                            class="text-[#443dff] text-lg flex-shrink-0"
                                        />
                                        <span className="text-xs font-bold text-[#050316] group-hover:text-[#443dff] transition-colors">
                                            {item.label}
                                        </span>
                                        <iconify-icon
                                            icon="solar:arrow-right-linear"
                                            class="text-[#dddbff] group-hover:text-[#443dff] transition-colors text-xs ml-auto"
                                        />
                                    </a>
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

ReportsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
