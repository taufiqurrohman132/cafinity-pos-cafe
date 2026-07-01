// resources/js/Pages/TargetsGoals/Aov.jsx

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Head from "@/Components/Head";
import { Icon } from "@iconify/react";
import ModernDatePicker from "@/Components/ModernDatePicker";

// Helpers
const fmt = (n) =>
    "Rp " + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });
const fmtNum = (n) =>
    Number(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

// Line Chart component using Chart.js via CDN
function AovTimeChart({ labels, data }) {
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
                        label: "AOV (IDR)",
                        data: data,
                        borderColor: "#BFFF00",
                        backgroundColor: "rgba(191, 255, 0, 0.06)",
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#BFFF00",
                        pointBorderColor: "#ffffff",
                        pointBorderWidth: 1.5,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#0E0E0E",
                        titleColor: "#E6E6E6",
                        bodyColor: "#fff",
                        padding: 10,
                        cornerRadius: 10,
                        callbacks: {
                            label: (ctx) => "Rp " + ctx.parsed.y.toLocaleString("id-ID"),
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "#666666",
                            font: { size: 10, weight: "700" },
                        },
                    },
                    y: {
                        grid: { color: "rgba(0,0,0,0.06)", drawBorder: false },
                        ticks: {
                            color: "#666666",
                            font: { size: 10, weight: "700" },
                            callback: (val) => "Rp " + (val / 1000) + "k",
                        },
                    },
                },
            },
        });

        return () => chartRef.current?.destroy();
    }, [labels, data]);

    return <canvas ref={canvasRef} />;
}

export default function AovReport({
    filters = {},
    overallAov = 0,
    orderVolume = 0,
    grossRevenue = 0,
    aovTrend = 0,
    volumeTrend = 0,
    revenueTrend = 0,
    aovDineIn = 0,
    aovDelivery = 0,
    aovTakeaway = 0,
    countDineIn = 0,
    countDelivery = 0,
    countTakeaway = 0,
    chartLabels = [],
    chartData = [],
    heatmapSlots = [],      // ← ini yang crash
    categoriesContribution = [],  // ← ini juga
}) {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState(filters.period || "Bulan");
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    const [lastUpdated, setLastUpdated] = useState("");

    // Dynamic calculations for insights
    const maxChannelAov = Math.max(aovDineIn, aovDelivery, aovTakeaway) || 1;
    const isDineInHighest = aovDineIn >= maxChannelAov;
    const isDeliveryHighest = aovDelivery >= maxChannelAov;

    let leadChannel = "Dine-in";
    let leadDiff = aovDineIn - overallAov;
    if (isDeliveryHighest) {
        leadChannel = "Delivery";
        leadDiff = aovDelivery - overallAov;
    } else if (aovTakeaway >= maxChannelAov) {
        leadChannel = "Takeaway";
        leadDiff = aovTakeaway - overallAov;
    }

    // Load Chart.js CDN
    useEffect(() => {
        if (!window.Chart) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
            script.async = true;
            document.head.appendChild(script);
        }

        // Formatted current time for footer
        const now = new Date();
        const timeStr = now.toTimeString().split(" ")[0];
        setLastUpdated(timeStr + " WIB");
    }, []);

    // Sync state with filters on navigate
    useEffect(() => {
        if (filters.period) {
            setSelectedPeriod(filters.period);
        }
        if (filters.start_date) setStartDate(filters.start_date);
        if (filters.end_date) setEndDate(filters.end_date);
    }, [filters]);

    const handlePeriodChange = (period) => {
        if (period === "Kustom") {
            setSelectedPeriod("Kustom");
            return;
        }
        setSelectedPeriod(period);
        navigate(`/targets-goals/aov?period=${period}`);
    };

    const handleCustomFilterSubmit = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        navigate(`/targets-goals/aov?period=Kustom&start_date=${startDate}&end_date=${endDate}`);
    };

    let periodDesc = "dari periode sebelumnya";
    if (selectedPeriod === "Hari Ini") periodDesc = "dari kemarin";
    else if (selectedPeriod === "Minggu") periodDesc = "dari minggu lalu";
    else if (selectedPeriod === "Bulan") periodDesc = "dari bulan lalu";

    const statCards = [
        {
            title: "Rerata Nilai Tiket (AOV)",
            value: fmt(overallAov),
            trend: (aovTrend >= 0 ? "+" : "") + aovTrend + "%",
            trendType: aovTrend >= 0 ? "up" : "down",
            desc: (aovTrend >= 0 ? "Meningkat " : "Menurun ") + periodDesc,
            icon: "solar:graph-up-linear",
            iconBg: "bg-[#BFFF00] text-black",
        },
        {
            title: "Volume Pesanan",
            value: fmtNum(orderVolume),
            trend: (volumeTrend >= 0 ? "+" : "") + volumeTrend + "%",
            trendType: volumeTrend >= 0 ? "up" : "down",
            desc: (volumeTrend >= 0 ? "Meningkat " : "Menurun ") + periodDesc,
            icon: "solar:cart-2-linear",
            iconBg: "bg-[#BFFF00] text-black",
        },
        {
            title: "Pendapatan Bruto",
            value: fmt(grossRevenue),
            trend: (revenueTrend >= 0 ? "+" : "") + revenueTrend + "%",
            trendType: revenueTrend >= 0 ? "up" : "down",
            desc: (revenueTrend >= 0 ? "Meningkat " : "Menurun ") + periodDesc,
            icon: "solar:wallet-linear",
            iconBg: "bg-[#BFFF00] text-black",
        },
        {
            title: "AOV Delivery",
            value: fmt(aovDelivery),
            trend: (aovTrend >= 0 ? "+" : "") + aovTrend + "%",
            trendType: aovTrend >= 0 ? "up" : "down",
            desc: "Rerata pesanan online",
            icon: "solar:delivery-linear",
            iconBg: "bg-[#BFFF00] text-black",
        },
    ];

    const handleExportPdf = () => {
        window.print();
    };

    return (
        <>
            <Head title="Laporan Rata-rata Nilai Tiket (AOV)" />

            <div className="min-h-screen bg-[#E6E6E6]/30 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* ── HEADER SECTION ── */}
                    <div className="flex flex-col gap-4 border-b border-[#E6E6E6] pb-5">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/targets-goals" 
                                    className="w-10 h-10 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center text-black/60 hover:text-black hover:border-black hover:bg-[#E6E6E6] transition shadow-sm shrink-0 active:scale-95"
                                >
                                    <Icon icon="solar:arrow-left-linear" className="text-lg" />
                                </Link>
                                <div>
                                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#666666] font-normal mb-1">
                                        <Link to="/targets-goals" className="hover:text-black transition-colors">Target &amp; Performa</Link>
                                        <span className="text-black/30">›</span>
                                        <span className="text-black font-semibold">Laporan AOV</span>
                                    </nav>
                                    <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">
                                        Laporan Rata-rata Nilai Tiket (AOV)
                                    </h1>
                                </div>
                            </div>

                            <div className="flex flex-row items-center gap-3 self-stretch md:self-auto justify-end">
                                {/* Period Filter Tabs */}
                                <div className="flex items-center gap-2">
                                    {["Hari Ini", "Minggu", "Bulan", "Kustom"].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => handlePeriodChange(p)}
                                            className={`px-6 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 active:scale-[0.98] ${
                                                selectedPeriod === p
                                                    ? "bg-[#BFFF00] text-black border-[#BFFF00] shadow-sm hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)]"
                                                    : "bg-white text-black border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999]"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                {/* Export Button */}
                                <button
                                    type="button"
                                    onClick={handleExportPdf}
                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-white border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm whitespace-nowrap"
                                >
                                    <Icon icon="solar:document-text-linear" className="text-sm text-[#999999]" />
                                    <span>Ekspor PDF</span>
                                </button>
                            </div>
                        </div>

                        {/* Custom Date Picker Form */}
                        <div className={`transition-all duration-300 ease-in-out ${
                            selectedPeriod === "Kustom"
                                ? "max-h-24 opacity-100 mt-2 overflow-visible"
                                : "max-h-0 opacity-0 pointer-events-none mt-0 overflow-hidden"
                        }`}>
                            <div className="flex justify-end">
                                <form onSubmit={handleCustomFilterSubmit} className="flex items-center gap-2 bg-white border border-[#E6E6E6] p-2 rounded-2xl shadow-sm">
                                    <div className="w-40">
                                        <ModernDatePicker
                                            value={startDate}
                                            onChange={setStartDate}
                                            placeholder="Mulai Tanggal"
                                            disabled={selectedPeriod !== "Kustom"}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-[#999999] lowercase">s/d</span>
                                    <div className="w-40">
                                        <ModernDatePicker
                                            value={endDate}
                                            onChange={setEndDate}
                                            placeholder="Sampai Tanggal"
                                            disabled={selectedPeriod !== "Kustom"}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={selectedPeriod !== "Kustom"}
                                        className="px-6 py-2 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 h-[38px] border-none"
                                    >
                                        Terapkan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* ── STAT CARDS GRID ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {statCards.map((card, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl border border-[#E6E6E6] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                        <Icon icon={card.icon} className="text-lg" />
                                    </div>
                                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.trendType === "up"
                                            ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                                            : "text-rose-700 bg-rose-50 border-rose-100"
                                        }`}>
                                        {card.trendType === "up" ? "↑" : "↓"} {card.trend}
                                    </span>
                                </div>

                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-extrabold text-black mb-2">
                                    {card.value}
                                </p>
                                <p className="text-xs text-[#999999] font-normal flex items-center gap-1.5 mt-2">
                                    <Icon icon="solar:clock-circle-linear" className="text-sm" />
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── MIDDLE ROW: TREN TIME CHART & CHANNEL COMPARISON ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Line Chart card */}
                        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-base font-semibold text-black">
                                        Tren AOV Berdasarkan Waktu
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-black bg-[#BFFF00] px-3.5 py-1.5 rounded-xl flex-shrink-0">
                                            <span className="w-2.5 h-2.5 rounded-full bg-black" />
                                            <span>AOV (IDR)</span>
                                        </div>
                                        <button className="w-8 h-8 rounded-xl bg-white border border-[#D0D0D0] flex items-center justify-center text-[#666666] hover:text-black hover:border-black active:scale-90 transition-all duration-150">
                                            <Icon icon="solar:filter-linear" className="text-base" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-[#999999] font-normal mt-1 mb-5">
                                    Fluktuasi nilai rata-rata pesanan sepanjang jam operasional.
                                </p>
                            </div>

                            <div className="h-64 relative mt-2">
                                <AovTimeChart labels={chartLabels} data={chartData} />
                            </div>
                        </div>

                        {/* Channel comparison card */}
                        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-black">
                                    Perbandingan Saluran
                                </h3>
                                <p className="text-xs text-[#999999] font-normal mt-1 mb-5">
                                    AOV Berdasarkan metode pemesanan.
                                </p>

                                {/* Bar Chart list */}
                                <div className="space-y-4">
                                    {/* Dine-in */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-semibold text-black">
                                            <span className="text-gray-700">Dine-in</span>
                                            <span className="font-bold text-black">{fmt(aovDineIn)}</span>
                                        </div>
                                        <div className="w-full h-2 bg-[#E6E6E6] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#BFFF00] rounded-full transition-all duration-500"
                                                style={{ width: `${(aovDineIn / maxChannelAov) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Delivery */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-semibold text-black">
                                            <span className="text-gray-700">Delivery</span>
                                            <span className="font-bold text-black">{fmt(aovDelivery)}</span>
                                        </div>
                                        <div className="w-full h-2 bg-[#E6E6E6] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#BFFF00] rounded-full transition-all duration-500"
                                                style={{ width: `${(aovDelivery / maxChannelAov) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Takeaway */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-semibold text-black">
                                            <span className="text-gray-700">Takeaway</span>
                                            <span className="font-bold text-black">{fmt(aovTakeaway)}</span>
                                        </div>
                                        <div className="w-full h-2 bg-[#E6E6E6] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#BFFF00] rounded-full transition-all duration-500"
                                                style={{ width: `${(aovTakeaway / maxChannelAov) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Wawasan Utama block */}
                            <div className="border-t border-[#E6E6E6] mt-6 pt-5">
                                <div className="flex items-center gap-1.5 mb-2.5">
                                    <Icon icon="solar:lightbulb-linear" className="text-[#BFFF00] text-base" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#999999]">Wawasan Utama</span>
                                </div>

                                <div className="bg-[#0E0E0E] p-4 rounded-2xl text-white shadow-md border border-black">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-bold text-white">{leadChannel} Unggul</span>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                            +{fmt(leadDiff)} vs Avg
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#E6E6E6] leading-relaxed mt-2">
                                        Pesanan <span className="font-bold text-[#BFFF00]">{leadChannel}</span> memiliki AOV tertinggi karena frekuensi pemesanan tambahan (desserts/appetizers) yang lebih besar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── BOTTOM ROW: KONTRIBUSI KATEGORI & PEAK HOUR HEATMAP ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Category Contribution Card */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-base font-semibold text-black">
                                        Kontribusi Kategori
                                    </h3>
                                    <Link
                                        to="/menus"
                                        className="text-xs font-bold text-black border-b border-[#D0D0D0] hover:border-black transition-all pb-0.5"
                                    >
                                        Detail Menu
                                    </Link>
                                </div>
                                <p className="text-xs text-[#999999] font-normal mt-1 mb-6">
                                    Pangsa nilai transaksi berdasarkan jenis menu.
                                </p>

                                <div className="space-y-4 mb-6">
                                    {categoriesContribution.map((cat, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs font-semibold text-black">
                                                <span className="text-gray-700">{cat.name}</span>
                                                <span className="font-bold text-black">{cat.percentage}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-[#E6E6E6] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#BFFF00] rounded-full transition-all duration-500"
                                                    style={{ width: `${cat.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bundling Opportunities Box */}
                            <div className="bg-neutral-50 border border-[#E6E6E6] p-4 rounded-2xl flex gap-3.5 items-start">
                                <div className="w-8 h-8 rounded-xl bg-neutral-100 text-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                    <Icon icon="solar:tag-linear" className="text-base" />
                                </div>
                                <div>
                                    <h5 className="text-xs font-bold text-black uppercase tracking-wider mb-1">Peluang Bundling</h5>
                                    <p className="text-xs text-[#666666] leading-relaxed">
                                        Peningkatan AOV sebesar 12% terlihat pada transaksi yang mencakup paket bundle "Kopi + Croissant". Pertimbangkan untuk menambahkan lebih banyak variasi bundle.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Peak Hour Heatmap Card */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-black">
                                    Analisis Jam Puncak (Heatmap)
                                </h3>
                                <p className="text-xs text-[#999999] font-normal mt-1 mb-6">
                                    AOV Tertinggi berdasarkan waktu dan volume.
                                </p>

                                {/* Heatmap Grid */}
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    {heatmapSlots.map((slot, idx) => {
                                        let bgClass = "bg-white text-black/50 border border-[#D0D0D0]";
                                        let isHigh = slot.level === "High";
                                        let isMed = slot.level === "Med";

                                        if (isHigh) {
                                            bgClass = "bg-[#BFFF00] text-black border border-[#BFFF00] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)]";
                                        } else if (isMed) {
                                            bgClass = "bg-[#E6E6E6] text-black border border-[#D0D0D0]";
                                        }

                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 ${bgClass}`}
                                            >
                                                <span className={`text-[9px] font-bold uppercase tracking-wider ${isHigh ? 'text-black/60' : 'text-[#999999]'}`}>
                                                    {slot.time}
                                                </span>
                                                <span className="text-sm font-extrabold my-1 flex items-center justify-center gap-0.5">
                                                    {slot.count}
                                                    {isHigh && <span role="img" aria-label="fire">🔥</span>}
                                                </span>
                                                <span className={`text-[9px] font-bold ${isHigh ? 'text-black/80' : 'text-[#666666]'}`}>
                                                    {slot.level}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-t border-[#E6E6E6] pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold text-[#999999] uppercase tracking-wider">
                                <span className="text-black font-bold">Legenda Intensitas AOV</span>
                                <span className="flex items-center gap-1.5 normal-case tracking-normal font-medium text-[#666666]">
                                    <span className="w-2 h-2 rounded-full bg-[#BFFF00]" />
                                    &gt; Rp 90k
                                </span>
                                <span className="flex items-center gap-1.5 normal-case tracking-normal font-medium text-[#666666]">
                                    <span className="w-2 h-2 rounded-full bg-[#E6E6E6] border border-[#D0D0D0]" />
                                    Rp 70k - 90k
                                </span>
                                <span className="flex items-center gap-1.5 normal-case tracking-normal font-medium text-[#666666]">
                                    <span className="w-2 h-2 rounded-full bg-white border border-[#D0D0D0]" />
                                    &lt; Rp 70k
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── FOOTER UPDATED TIME ── */}
                    <div className="flex justify-between items-center text-xs text-[#999999] mt-2 font-normal">
                        <span>Cafe POS v2.4.0 • Analisis AOV Real-time</span>
                        <span className="flex items-center gap-1.5 font-semibold text-[#666666]">
                            <Icon icon="solar:clock-circle-linear" className="text-xs text-emerald-500 animate-pulse" />
                            Data terakhir diperbarui: {lastUpdated}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
