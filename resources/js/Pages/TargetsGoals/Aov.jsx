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
                        borderColor: "rgb(var(--color-brand-secondary))", // Purple matching user's theme
                        backgroundColor: "rgb(var(--color-brand-secondary) / 0.06)",
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "rgb(var(--color-brand-secondary))",
                        pointBorderColor: "#ffffff",
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
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
                            label: (ctx) => "Rp " + ctx.parsed.y.toLocaleString("id-ID"),
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "#9ca3af",
                            font: { size: 10, weight: "600" },
                        },
                    },
                    y: {
                        grid: { color: "#f3f4f6", lineWidth: 1 },
                        ticks: {
                            color: "#9ca3af",
                            font: { size: 10 },
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
            iconBg: "bg-brand-light text-brand-secondary",
        },
        {
            title: "Volume Pesanan",
            value: fmtNum(orderVolume),
            trend: (volumeTrend >= 0 ? "+" : "") + volumeTrend + "%",
            trendType: volumeTrend >= 0 ? "up" : "down",
            desc: (volumeTrend >= 0 ? "Meningkat " : "Menurun ") + periodDesc,
            icon: "solar:cart-2-linear",
            iconBg: "bg-brand-light text-brand-primary",
        },
        {
            title: "Pendapatan Bruto",
            value: fmt(grossRevenue),
            trend: (revenueTrend >= 0 ? "+" : "") + revenueTrend + "%",
            trendType: revenueTrend >= 0 ? "up" : "down",
            desc: (revenueTrend >= 0 ? "Meningkat " : "Menurun ") + periodDesc,
            icon: "solar:wallet-linear",
            iconBg: "bg-amber-50 text-amber-500",
        },
        {
            title: "AOV Delivery",
            value: fmt(aovDelivery),
            trend: (aovTrend >= 0 ? "+" : "") + aovTrend + "%",
            trendType: aovTrend >= 0 ? "up" : "down",
            desc: "Rerata pesanan online",
            icon: "solar:delivery-linear",
            iconBg: "bg-rose-50 text-rose-500",
        },
    ];

    const handleExportPdf = () => {
        window.print();
    };

    return (
        <>
            <Head title="Laporan Rata-rata Nilai Tiket (AOV)" />

            <div className="flex flex-col gap-6 py-6 px-8 max-w-7xl mx-auto bg-brand-bg min-h-[calc(100vh-72px)]">

                {/* ── HEADER SECTION ── */}
                <div className="flex flex-col gap-4 border-b border-brand-light/50 pb-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight leading-tight">
                                    Laporan Rata-rata Nilai Tiket (AOV)
                                </h1>
                                <p className="text-xs text-brand-primary/60 font-medium mt-1">
                                    Analisis performa belanja per transaksi di seluruh saluran penjualan.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-3 self-stretch md:self-auto justify-end">
                            {/* Period Filter Tabs */}
                            <div className="bg-white border border-brand-light p-1 rounded-xl flex items-center shadow-sm">
                                {["Hari Ini", "Minggu", "Bulan", "Kustom"].map((period) => (
                                    <button
                                        key={period}
                                        type="button"
                                        onClick={() => handlePeriodChange(period)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-[0.98] ${selectedPeriod === period
                                                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                                                : "text-brand-primary/60 hover:text-brand-dark hover:bg-brand-light/20"
                                            }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>

                            {/* Export Button */}
                            <button
                                type="button"
                                onClick={handleExportPdf}
                                className="flex items-center gap-2 bg-white border border-brand-light px-4 py-2.5 rounded-xl text-xs font-extrabold text-brand-primary hover:bg-brand-light hover:text-brand-dark transition-all duration-200 active:scale-[0.98] shadow-sm whitespace-nowrap"
                            >
                                <Icon icon="solar:document-text-linear" className="text-base text-brand-secondary" />
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
                            <form onSubmit={handleCustomFilterSubmit} className="flex items-center gap-2 bg-white border border-brand-light p-2 rounded-xl shadow-sm">
                                <div className="w-40">
                                    <ModernDatePicker
                                        value={startDate}
                                        onChange={setStartDate}
                                        placeholder="Mulai Tanggal"
                                        disabled={selectedPeriod !== "Kustom"}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-brand-primary/60 capitalize">s/d</span>
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
                                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-4 py-2 rounded-xl text-xs font-extrabold active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 h-[38px]"
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
                            className="bg-white rounded-2xl border border-brand-light p-5 shadow-sm hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                    <Icon icon={card.icon} className="text-lg" />
                                </div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${card.trendType === "up"
                                        ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                                        : "text-rose-700 bg-rose-50 border-rose-100"
                                    }`}>
                                    {card.trendType === "up" ? "↗" : "↘"} {card.trend}
                                </span>
                            </div>

                            <p className="text-[11px] font-bold capitalize tracking-widest text-gray-400 mb-1">
                                {card.title}
                            </p>
                            <p className={`text-2xl font-extrabold mb-2 ${card.title.includes("Volume") ? "text-brand-dark" : "text-brand-secondary"}`}>
                                {card.value}
                            </p>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-2">
                                <Icon icon="solar:clock-circle-linear" className="text-sm" />
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── MIDDLE ROW: TREN TIME CHART & CHANNEL COMPARISON ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Line Chart card */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-lg font-bold text-brand-dark">
                                    Tren AOV Berdasarkan Waktu
                                </h4>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-secondary">
                                        <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
                                        <span>AOV (IDR)</span>
                                    </div>
                                    <button className="text-xs text-brand-primary hover:text-brand-dark p-1 transition-colors">
                                        <Icon icon="solar:filter-linear" className="text-base" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-brand-primary/60 font-medium mb-5">
                                Fluktuasi nilai rata-rata pesanan sepanjang jam operasional.
                            </p>
                        </div>

                        <div className="h-64 relative mt-2">
                            <AovTimeChart labels={chartLabels} data={chartData} />
                        </div>
                    </div>

                    {/* Channel comparison card */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-brand-dark">
                                Perbandingan Saluran
                            </h4>
                            <p className="text-xs text-brand-primary/60 font-medium mb-5">
                                AOV Berdasarkan metode pemesanan.
                            </p>

                            {/* Bar Chart list */}
                            <div className="space-y-4">
                                {/* Dine-in */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-sm font-medium text-brand-dark">
                                        <span className="text-gray-700">Dine-in</span>
                                        <span className="font-black text-brand-secondary">{fmt(aovDineIn)}</span>
                                    </div>
                                    <div className="w-full h-8 bg-brand-bg rounded-xl overflow-hidden border border-brand-light/50 relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-500 rounded-l-xl"
                                            style={{ width: `${(aovDineIn / maxChannelAov) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Delivery */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-sm font-medium text-brand-dark">
                                        <span className="text-gray-700">Delivery</span>
                                        <span className="font-black text-brand-secondary">{fmt(aovDelivery)}</span>
                                    </div>
                                    <div className="w-full h-8 bg-brand-bg rounded-xl overflow-hidden border border-brand-light/50 relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-secondary/80 to-brand-primary/80 transition-all duration-500 rounded-l-xl"
                                            style={{ width: `${(aovDelivery / maxChannelAov) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Takeaway */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-sm font-medium text-brand-dark">
                                        <span className="text-gray-700">Takeaway</span>
                                        <span className="font-black text-brand-secondary">{fmt(aovTakeaway)}</span>
                                    </div>
                                    <div className="w-full h-8 bg-brand-bg rounded-xl overflow-hidden border border-brand-light/50 relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-secondary/60 to-brand-primary/60 transition-all duration-500 rounded-l-xl"
                                            style={{ width: `${(aovTakeaway / maxChannelAov) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wawasan Utama block */}
                        <div className="border-t border-brand-light mt-6 pt-5">
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <Icon icon="solar:lightbulb-linear" className="text-brand-secondary text-base" />
                                <span className="text-[11px] font-bold capitalize tracking-widest text-gray-400">Wawasan Utama</span>
                            </div>

                            <div className="bg-brand-bg border border-brand-light p-3 rounded-xl">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-bold text-brand-dark">{leadChannel} Unggul</span>
                                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        +{fmt(leadDiff)} vs Avg
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Pesanan <span className="font-bold text-brand-dark">{leadChannel}</span> memiliki AOV tertinggi karena frekuensi pemesanan tambahan (desserts/appetizers) yang lebih besar dibandingkan Delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM ROW: KONTRIBUSI KATEGORI & PEAK HOUR HEATMAP ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Category Contribution Card */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-lg font-bold text-brand-dark">
                                    Kontribusi Kategori
                                </h4>
                                <Link
                                    to="/menus"
                                    className="text-xs font-bold text-brand-secondary hover:text-brand-primary transition-colors"
                                >
                                    Detail Menu
                                </Link>
                            </div>
                            <p className="text-xs text-brand-primary/60 font-medium mb-6">
                                Pangsa nilai transaksi berdasarkan jenis menu.
                            </p>

                            <div className="space-y-4 mb-6">
                                {categoriesContribution.map((cat, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-sm font-medium text-brand-dark">
                                            <span className="text-gray-700">{cat.name}</span>
                                            <span className="font-bold text-brand-secondary">{cat.percentage}%</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-brand-bg rounded-full overflow-hidden border border-brand-light/50">
                                            <div
                                                className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-500 rounded-full"
                                                style={{ width: `${cat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bundling Opportunities Box */}
                        <div className="bg-brand-bg border border-brand-light p-4 rounded-xl flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon icon="solar:tag-linear" className="text-base" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-brand-dark mb-0.5">Peluang Bundling</h5>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Peningkatan AOV sebesar 12% terlihat pada transaksi yang mencakup paket bundle "Kopi + Croissant". Pertimbangkan untuk menambahkan lebih banyak variasi bundle.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Peak Hour Heatmap Card */}
                    <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-brand-dark">
                                Analisis Jam Puncak (Heatmap)
                            </h4>
                            <p className="text-xs text-brand-primary/60 font-medium mb-6">
                                AOV Tertinggi berdasarkan waktu dan volume.
                            </p>

                            {/* Heatmap Grid */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {heatmapSlots.map((slot, idx) => {
                                    let bgClass = "bg-brand-bg text-brand-primary/60 border border-brand-light/70";
                                    let isHigh = slot.level === "High";
                                    let isMed = slot.level === "Med";

                                    if (isHigh) {
                                        bgClass = "bg-gradient-to-br from-brand-secondary to-brand-primary text-white shadow-md shadow-brand-secondary/25";
                                    } else if (isMed) {
                                        bgClass = "bg-brand-light text-brand-dark border border-brand-light";
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 ${bgClass}`}
                                        >
                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isHigh ? 'text-white/80' : 'text-brand-primary/60'}`}>
                                                {slot.time}
                                            </span>
                                            <span className="text-sm font-black my-1 flex items-center justify-center gap-0.5">
                                                {slot.count}
                                                {isHigh && <span role="img" aria-label="fire">🔥</span>}
                                            </span>
                                            <span className={`text-[9px] font-bold ${isHigh ? 'text-white/90' : 'text-brand-primary/80'}`}>
                                                {slot.level}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t border-brand-light pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-bold text-gray-400 capitalize tracking-widest">
                            <span className="text-brand-dark">Legenda Intensitas AOV</span>
                            <span className="flex items-center gap-1.5 normal-case tracking-normal font-medium text-gray-600">
                                <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                                &gt; Rp 90k
                            </span>
                            <span className="flex items-center gap-1.5 normal-case tracking-normal font-medium text-gray-600">
                                <span className="w-2 h-2 rounded-full bg-brand-light border border-brand-light" />
                                Rp 70k - 90k
                            </span>
                            <span className="flex items-center gap-1.5 normal-case tracking-normal font-medium text-gray-600">
                                <span className="w-2 h-2 rounded-full bg-brand-bg border border-brand-light/70" />
                                &lt; Rp 70k
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER UPDATED TIME ── */}
                <div className="flex justify-between items-center text-[11px] text-brand-primary/50 mt-2 font-medium">
                    <span>Cafe POS v2.4.0 • Analisis AOV Real-time</span>
                    <span className="flex items-center gap-1 font-bold">
                        <Icon icon="solar:clock-circle-linear" className="text-xs text-emerald-500 animate-pulse" />
                        Data terakhir diperbarui: {lastUpdated}
                    </span>
                </div>
            </div>
        </>
    );
}
