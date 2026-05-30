// resources/js/Pages/TargetsGoals/Aov.jsx

import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Icon } from "@iconify/react";

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
                        borderColor: "#10b981", // Emerald green track line matching mockup
                        backgroundColor: "rgba(16,185,129,0.06)",
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#10b981",
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
    overallAov,
    orderVolume,
    grossRevenue,
    aovTrend,
    volumeTrend,
    revenueTrend,
    aovDineIn,
    aovDelivery,
    aovTakeaway,
    countDineIn,
    countDelivery,
    countTakeaway,
    chartLabels,
    chartData,
    heatmapSlots,
    categoriesContribution,
}) {
    const [selectedPeriod, setSelectedPeriod] = useState("Bulan");
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

    const statCards = [
        {
            title: "Rerata Nilasi Tiket (AOV)",
            value: fmt(overallAov),
            trend: (aovTrend >= 0 ? "+" : "") + aovTrend + "%",
            trendType: aovTrend >= 0 ? "up" : "down",
            desc: aovTrend >= 0 ? "Meningkat dari bulan lalu" : "Penurunan dibanding bulan lalu",
            icon: "solar:graph-up-linear",
            iconBg: "bg-emerald-50 text-emerald-500",
        },
        {
            title: "Volume Pesanan",
            value: fmtNum(orderVolume),
            trend: (volumeTrend >= 0 ? "+" : "") + volumeTrend + "%",
            trendType: volumeTrend >= 0 ? "up" : "down",
            desc: "Total pesanan diselesaikan",
            icon: "solar:cart-2-linear",
            iconBg: "bg-blue-50 text-[#443dff]",
        },
        {
            title: "Pendapatan Bruto",
            value: fmt(grossRevenue),
            trend: (revenueTrend >= 0 ? "+" : "") + revenueTrend + "%",
            trendType: revenueTrend >= 0 ? "up" : "down",
            desc: "Total penjualan kotor",
            icon: "solar:wallet-linear",
            iconBg: "bg-amber-50 text-amber-500",
        },
        {
            title: "AOV Delivery",
            value: fmt(aovDelivery),
            trend: "-2.1%", // Styled like mockup
            trendType: "down",
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

            <div className="flex flex-col gap-6 py-6 px-8 max-w-7xl mx-auto bg-[#fbfbfe] min-h-[calc(100vh-72px)]">
                
                {/* Back button to Targets & Goals */}
                <div className="flex items-center gap-2">
                    <Link
                        href={route("targets-goals.index")}
                        className="flex items-center gap-1 text-xs font-bold text-[#2f27ce] hover:text-[#050316] transition-colors"
                    >
                        <Icon icon="solar:alt-arrow-left-linear" className="text-sm" />
                        Kembali ke Targets & Goals
                    </Link>
                </div>

                {/* ── HEADER SECTION ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#dddbff]/50 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-[#050316] tracking-tight">
                            Laporan Rata-rata Nilai Tiket (AOV)
                        </h1>
                        <p className="text-xs text-[#2f27ce] font-medium mt-1">
                            Analisis performa belanja per transaksi di seluruh saluran penjualan.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-stretch md:self-auto">
                        {/* Period Filter Tabs */}
                        <div className="bg-white border border-[#dddbff] p-1 rounded-xl flex items-center shadow-sm">
                            {["Hari Ini", "Minggu", "Bulan", "Kustom"].map((period) => (
                                <button
                                    key={period}
                                    type="button"
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        selectedPeriod === period
                                            ? "bg-[#443dff] text-white shadow-sm"
                                            : "text-[#2f27ce]/60 hover:text-[#050316] hover:bg-[#dddbff]/20"
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
                            className="flex items-center gap-2 bg-white border border-[#dddbff] px-4 py-2.5 rounded-xl text-xs font-extrabold text-[#050316] hover:bg-[#dddbff]/30 active:scale-[0.98] transition-all shadow-sm"
                        >
                            <Icon icon="solar:document-text-linear" className="text-base text-[#443dff]" />
                            <span>Ekspor PDF</span>
                        </button>
                    </div>
                </div>

                {/* ── STAT CARDS GRID ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-2xl border border-[#dddbff] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                                    <Icon icon={card.icon} className="text-lg" />
                                </div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                    card.trendType === "up"
                                        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                        : "text-rose-600 bg-rose-50 border-rose-100"
                                }`}>
                                    {card.trendType === "up" ? "↗" : "↘"} {card.trend}
                                </span>
                            </div>

                            <p className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest leading-none mb-1">
                                {card.title}
                            </p>
                            <p className="text-xl font-black text-[#050316] tracking-tight mb-2">
                                {card.value}
                            </p>
                            <p className="text-[10px] text-[#2f27ce]/60 font-semibold flex items-center gap-1">
                                <Icon icon="solar:clock-circle-linear" className="text-xs" />
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── MIDDLE ROW: TREN TIME CHART & CHANNEL COMPARISON ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Line Chart card */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-sm font-extrabold text-[#050316] tracking-tight">
                                    Tren AOV Berdasarkan Waktu
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#10b981]">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                                        <span>AOV (IDR)</span>
                                    </div>
                                    <button className="text-xs text-[#2f27ce] hover:text-[#050316] p-1 transition-colors">
                                        <Icon icon="solar:filter-linear" className="text-base" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] text-[#2f27ce]/60 font-semibold mb-5">
                                Fluktuasi nilai rata-rata pesanan sepanjang jam operasional.
                            </p>
                        </div>

                        <div className="h-64 relative mt-2">
                            <AovTimeChart labels={chartLabels} data={chartData} />
                        </div>
                    </div>

                    {/* Channel comparison card */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-[#050316] tracking-tight font-black">
                                Perbandingan Saluran
                            </h3>
                            <p className="text-[10px] text-[#2f27ce]/60 font-semibold mb-5">
                                AOV Berdasarkan metode pemesanan.
                            </p>

                            {/* Bar Chart list */}
                            <div className="space-y-4">
                                {/* Dine-in */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-bold text-[#050316]">
                                        <span>Dine-in</span>
                                        <span>{fmt(aovDineIn)}</span>
                                    </div>
                                    <div className="w-full h-8 bg-[#fbfbfe] rounded-xl overflow-hidden border border-[#dddbff]/50 relative">
                                        <div 
                                            className="h-full bg-[#050316] transition-all duration-500 rounded-l-xl" 
                                            style={{ width: `${(aovDineIn / maxChannelAov) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Delivery */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-bold text-[#050316]">
                                        <span>Delivery</span>
                                        <span>{fmt(aovDelivery)}</span>
                                    </div>
                                    <div className="w-full h-8 bg-[#fbfbfe] rounded-xl overflow-hidden border border-[#dddbff]/50 relative">
                                        <div 
                                            className="h-full bg-[#050316]/80 transition-all duration-500 rounded-l-xl" 
                                            style={{ width: `${(aovDelivery / maxChannelAov) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Takeaway */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-bold text-[#050316]">
                                        <span>Takeaway</span>
                                        <span>{fmt(aovTakeaway)}</span>
                                    </div>
                                    <div className="w-full h-8 bg-[#fbfbfe] rounded-xl overflow-hidden border border-[#dddbff]/50 relative">
                                        <div 
                                            className="h-full bg-[#050316]/65 transition-all duration-500 rounded-l-xl" 
                                            style={{ width: `${(aovTakeaway / maxChannelAov) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wawasan Utama block */}
                        <div className="border-t border-[#dddbff] mt-6 pt-5">
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <Icon icon="solar:lightbulb-linear" className="text-emerald-500 text-base" />
                                <span className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest">Wawasan Utama</span>
                            </div>
                            
                            <div className="bg-[#fbfbfe] border border-[#dddbff] p-3 rounded-xl">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-extrabold text-[#050316]">{leadChannel} Unggul</span>
                                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                        +{fmt(leadDiff)} vs Avg
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#2f27ce]/80 font-medium leading-relaxed">
                                    Pesanan <span className="font-bold">{leadChannel}</span> memiliki AOV tertinggi karena frekuensi pemesanan tambahan (desserts/appetizers) yang lebih besar dibandingkan Delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM ROW: KONTRIBUSI KATEGORI & PEAK HOUR HEATMAP ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Category Contribution Card */}
                    <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-sm font-extrabold text-[#050316] tracking-tight">
                                    Kontribusi Kategori
                                </h3>
                                <Link 
                                    href={route("menus.index")} 
                                    className="text-xs font-bold text-[#443dff] hover:text-[#2f27ce] hover:underline"
                                >
                                    Detail Menu
                                </Link>
                            </div>
                            <p className="text-[10px] text-[#2f27ce]/60 font-semibold mb-6">
                                Pangsa nilai transaksi berdasarkan jenis menu.
                            </p>

                            <div className="space-y-4 mb-6">
                                {categoriesContribution.map((cat, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-bold text-[#050316]">
                                            <span>{cat.name}</span>
                                            <span>{cat.percentage}%</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-[#fbfbfe] rounded-full overflow-hidden border border-[#dddbff]/50">
                                            <div 
                                                className="h-full bg-gradient-to-r from-[#443dff] to-[#2f27ce] transition-all duration-500 rounded-full" 
                                                style={{ width: `${cat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bundling Opportunities Box */}
                        <div className="bg-[#fbfbfe] border border-[#dddbff] p-4 rounded-xl flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon icon="solar:tag-linear" className="text-base" />
                            </div>
                            <div>
                                <h4 className="text-xs font-extrabold text-[#050316] mb-0.5">Peluang Bundling</h4>
                                <p className="text-[10px] text-[#2f27ce]/80 font-medium leading-relaxed">
                                    Peningkatan AOV sebesar 12% terlihat pada transaksi yang mencakup paket bundle "Kopi + Croissant". Pertimbangkan untuk menambahkan lebih banyak variasi bundle.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Peak Hour Heatmap Card */}
                    <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-[#050316] tracking-tight font-black">
                                Analisis Jam Puncak (Heatmap)
                            </h3>
                            <p className="text-[10px] text-[#2f27ce]/60 font-semibold mb-6">
                                AOV Tertinggi berdasarkan waktu dan volume.
                            </p>

                            {/* Heatmap Grid */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {heatmapSlots.map((slot, idx) => {
                                    let bgClass = "bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]";
                                    let isHigh = slot.level === "High";
                                    let isMed = slot.level === "Med";

                                    if (isHigh) {
                                        bgClass = "bg-[#10b981] text-white shadow-sm shadow-[#10b981]/20";
                                    } else if (isMed) {
                                        bgClass = "bg-[#a7f3d0] text-[#065f46] border border-[#6ee7b7]/30";
                                    }

                                    return (
                                        <div 
                                            key={idx} 
                                            className={`rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 ${bgClass}`}
                                        >
                                            <span className={`text-[8px] font-extrabold tracking-wider ${isHigh ? 'text-white/80' : 'text-[#2f27ce]/60'}`}>
                                                {slot.time}
                                            </span>
                                            <span className="text-sm font-black my-1 flex items-center justify-center gap-0.5">
                                                {slot.count}
                                                {isHigh && <span role="img" aria-label="fire">🔥</span>}
                                            </span>
                                            <span className={`text-[8px] font-bold ${isHigh ? 'text-white/90' : 'text-[#050316]/70'}`}>
                                                {slot.level}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="border-t border-[#dddbff] pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-extrabold text-[#2f27ce]/70 uppercase tracking-widest">
                            <span className="text-[#050316]">LEGENDA INTENSITAS AOV</span>
                            <span className="flex items-center gap-1.5 normal-case tracking-normal">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                                &gt; Rp 90k
                            </span>
                            <span className="flex items-center gap-1.5 normal-case tracking-normal">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#a7f3d0] border border-[#6ee7b7]/30" />
                                Rp 70k - 90k
                            </span>
                            <span className="flex items-center gap-1.5 normal-case tracking-normal">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#f3f4f6] border border-[#e5e7eb]" />
                                &lt; Rp 70k
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER UPDATED TIME ── */}
                <div className="flex justify-between items-center text-[10px] text-[#2f27ce]/50 mt-2">
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

AovReport.layout = (page) => <AppLayout>{page}</AppLayout>;
