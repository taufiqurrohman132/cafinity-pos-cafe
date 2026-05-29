import { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// ── Stat Card Component ──────────────────────────────────────────
function StatCard({ title, value, trend, trendType, icon, iconBg, iconColor }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm hover:shadow-lg hover:shadow-[#2f27ce]/10 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                    <iconify-icon icon={icon} class={`text-2xl ${iconColor}`}></iconify-icon>
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        trendType === 'up'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                        <span>{trendType === 'up' ? '▲' : '▼'}</span>
                        <span>{trend}</span>
                    </span>
                )}
            </div>
            <div className="mt-1">
                <p className="text-sm text-[#2f27ce]/50 font-medium truncate">{title}</p>
                <p className="text-xl md:text-2xl font-extrabold text-[#050316] mt-0.5 tracking-tight truncate">{value}</p>
            </div>
        </div>
    );
}

// ── Sales Chart Component ────────────────────────────────────────
function SalesChart({ initialLabels, initialValues }) {
    const [activePeriod, setActivePeriod] = useState('today');
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({
        labels: initialLabels,
        values: initialValues,
    });

    const pills = [
        { label: 'Hari Ini', value: 'today' },
        { label: '7 Hari',   value: '7days' },
        { label: '30 Hari',  value: '30days' },
        { label: 'Bulan Ini', value: 'month' },
    ];

    const periodLabel = {
        today:   'Tren pendapatan hari ini',
        '7days': 'Tren pendapatan 7 hari terakhir',
        '30days':'Tren pendapatan 30 hari terakhir',
        month:   'Tren pendapatan bulan ini',
    }[activePeriod] ?? '';

    const setPeriod = async (period) => {
        if (activePeriod === period) return;
        setActivePeriod(period);

        if (period === 'today') {
            setChartData({ labels: initialLabels, values: initialValues });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/dashboard/owner/sales-chart?period=${period}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const data = await res.json();
            setChartData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div>
                    <h3 className="text-lg font-extrabold text-[#050316] tracking-tight">Ringkasan Penjualan</h3>
                    <p className="text-xs text-[#2f27ce] font-medium">{periodLabel}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full shadow-sm w-fit">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                    LIVE
                </span>
            </div>

            {/* Period Pills */}
            <div className="flex items-center gap-2 mb-6">
                {pills.map(pill => (
                    <button key={pill.value}
                        onClick={() => setPeriod(pill.value)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${activePeriod === pill.value ? 'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm' : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50 hover:text-[#050316]'}`}>
                        {pill.label}
                    </button>
                ))}
            </div>

            {/* Chart Container */}
            <div className="overflow-x-auto pb-2 scrollbar-auto">
                <div className="h-56 md:h-64 min-w-[550px] w-full relative pt-8 px-2">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-x-0 bottom-[24px] top-8 flex flex-col justify-between pointer-events-none z-0">
                        <div className="border-t border-[#dddbff]/40 w-full"></div>
                        <div className="border-t border-[#dddbff]/40 w-full"></div>
                        <div className="border-t border-[#dddbff]/40 w-full"></div>
                        <div className="border-t border-[#dddbff]/40 w-full"></div>
                    </div>

                    <div className="h-full w-full flex items-end justify-between gap-1.5 relative z-10">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl z-30">
                                <iconify-icon icon="svg-spinners:ring-resize" class="text-3xl text-[#443dff]"></iconify-icon>
                            </div>
                        )}
                        {chartData.values.length === 0 && !loading ? (
                            <p className="w-full text-center text-[#2f27ce] italic text-sm py-16">Belum ada penjualan</p>
                        ) : (
                            chartData.values.map((point, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative h-full justify-end pb-[20px]">
                                    {/* Tooltip */}
                                    <span className="absolute bottom-[calc(100%-8px)] left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-[#fbfbfe] opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-md bg-[#050316]/95 px-2.5 py-1 rounded-lg shadow-lg border border-white/10 whitespace-nowrap z-20 pointer-events-none">
                                        Rp {point.amount?.toLocaleString('id-ID')}
                                    </span>
                                    {/* Bar */}
                                    <div
                                        className="w-full bg-gradient-to-t from-[#2f27ce] to-[#443dff] rounded-t-lg transition-all duration-300 group-hover:from-[#050316] group-hover:to-[#2f27ce] min-h-[4px] shadow-sm relative overflow-hidden"
                                        style={{ height: `${Math.max(point.height, 4)}%` }}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/20"></div>
                                    </div>
                                    {/* Label */}
                                    <span className="absolute bottom-0 text-[10px] font-extrabold text-[#2f27ce]/50 group-hover:text-[#050316] transition-colors whitespace-nowrap">
                                        {chartData.labels[i]}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-6 text-xs font-bold text-[#2f27ce] justify-center">
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#443dff] shadow-sm"></span> Pendapatan
                </span>
            </div>
        </div>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function OwnerDashboard({
    user,
    lastUpdated,
    stats,
    salesChart,
    bestSellingMenus,
    busyHours,
    profitability,
    dailyGoal,
    currentTarget,
    lowStockItems,
    kitchenQueue,
}) {
    const [showTargetModal, setShowTargetModal] = useState(false);

    const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD local time

    const { data, setData, post, processing, errors } = useForm({
        label: currentTarget?.label ?? 'Target Harian',
        type: 'revenue',
        period: 'daily',
        target_value: currentTarget?.target_value ?? '',
        start_date: currentTarget?.start_date ?? todayStr,
        end_date: currentTarget?.end_date ?? todayStr,
    });

    useEffect(() => {
        if (currentTarget) {
            setData({
                label: currentTarget.label,
                type: 'revenue',
                period: 'daily',
                target_value: currentTarget.target_value,
                start_date: currentTarget.start_date,
                end_date: currentTarget.end_date,
            });
        } else {
            setData({
                label: 'Target Harian',
                type: 'revenue',
                period: 'daily',
                target_value: '',
                start_date: todayStr,
                end_date: todayStr,
            });
        }
    }, [currentTarget, showTargetModal]);

    const handleTargetSubmit = (e) => {
        e.preventDefault();
        post(route('targets-goals.store'), {
            onSuccess: () => {
                setShowTargetModal(false);
            },
        });
    };

    const statusColor = {
        preparing: 'bg-amber-400',
        ready:     'bg-emerald-500',
        pending:   'bg-[#dddbff]',
    };

    const statusLabel = {
        preparing: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-700', label: 'Sedang Dimasak' },
        ready:     { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-700', label: 'Siap Diambil' },
        pending:   { bg: 'bg-[#dddbff] border-[#dddbff]', text: 'text-[#2f27ce]', label: 'Menunggu' },
    };

    return (
        <>
            <Head title="Dashboard Owner" />
            <div className="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">

                {/* ====== TOP HEADER ====== */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Dashboard Owner
                        </h1>
                        <p className="text-[#2f27ce] mt-1 text-sm font-medium">
                            Selamat datang kembali, <span className="font-extrabold text-[#050316]">{user?.name}</span>.
                            Berikut ringkasan performa cafe Anda hari ini.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="text-[13px] text-[#2f27ce] bg-white px-4 py-2.5 rounded-xl border border-[#dddbff] shadow-sm flex items-center gap-2 font-medium">
                            <iconify-icon icon="solar:clock-circle-linear" class="text-lg text-[#443dff]"></iconify-icon>
                            <span>Terakhir Update: <span className="font-bold text-[#050316]">{lastUpdated}</span></span>
                        </div>
                        <Link href="/pos"
                            className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                            <iconify-icon icon="solar:card-2-linear" class="text-[18px]"></iconify-icon>
                            Buka POS
                        </Link>
                    </div>
                </div>

                {/* ====== STAT CARDS ====== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Pendapatan Hari Ini"  {...stats.revenue}    icon="solar:wallet-money-linear" iconBg="bg-[#dddbff]"    iconColor="text-[#443dff]" />
                    <StatCard title="Estimasi Laba Bersih" {...stats.profit}     icon="solar:chart-2-linear"     iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                    <StatCard title="Total Pesanan"        {...stats.orders}     icon="solar:bag-5-linear"       iconBg="bg-[#dddbff]"    iconColor="text-[#443dff]" />
                    <StatCard title="Rata-rata Tiket"      {...stats.avg_ticket} icon="solar:users-group-rounded-linear" iconBg="bg-[#dddbff]" iconColor="text-[#2f27ce]" />
                </div>

                {/* ====== MAIN GRID ====== */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* ===== LEFT CONTENT ===== */}
                    <div className="xl:col-span-9 space-y-6">

                        {/* Sales Chart */}
                        <SalesChart
                            initialLabels={salesChart.labels}
                            initialValues={salesChart.values}
                        />

                        {/* Menu Terlaris & Jam Sibuk */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Menu Terlaris */}
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <div className="flex justify-between items-center mb-5">
                                    <div>
                                        <h3 className="font-extrabold text-[#050316] tracking-tight">Menu Terlaris</h3>
                                        <p className="text-[10px] text-[#2f27ce]/60 font-bold uppercase tracking-wider mt-0.5">Penjualan tertinggi hari ini</p>
                                    </div>
                                    <Link href="/menus" className="text-xs text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline transition-colors">
                                        Lihat Katalog
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {bestSellingMenus.length === 0 ? (
                                        <p className="text-sm text-[#2f27ce] italic text-center py-4">Belum ada data penjualan menu hari ini.</p>
                                    ) : bestSellingMenus.map((menu, i) => {
                                        const rankColors = [
                                            'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-200/50',
                                            'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-200/50',
                                            'bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-orange-200/50',
                                        ][i] ?? 'bg-[#dddbff] text-[#2f27ce]';

                                        return (
                                            <div key={i} className="flex items-center justify-between p-3 hover:bg-[#dddbff]/10 border border-transparent hover:border-[#dddbff]/50 rounded-2xl transition-all duration-300 hover:shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-[#dddbff]/10 to-[#dddbff]/30 border border-[#dddbff] rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                                            {menu.emoji}
                                                        </div>
                                                        <span className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md border border-white ${rankColors}`}>
                                                            {i + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-[#050316] tracking-tight">{menu.name}</p>
                                                        <p className="text-[10px] font-bold text-[#2f27ce]/60 uppercase tracking-wider">{menu.category}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-extrabold text-[#050316] tracking-tight">{menu.sold}</p>
                                                    <p className={`text-[10px] font-bold mt-0.5 ${menu.trend_type === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {menu.trend_type === 'up' ? '▲' : '▼'} {menu.trend}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Jam Sibuk */}
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="font-extrabold text-[#050316] tracking-tight">Jam Sibuk</h3>
                                    <p className="text-[10px] text-[#2f27ce]/60 font-bold uppercase tracking-wider mt-0.5">Tingkat hunian transaksi harian</p>
                                </div>
                                <div className="relative h-40 mt-6 pt-4 px-1">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-x-0 bottom-[20px] top-4 flex flex-col justify-between pointer-events-none z-0">
                                        <div className="border-t border-[#dddbff]/30 w-full"></div>
                                        <div className="border-t border-[#dddbff]/30 w-full"></div>
                                        <div className="border-t border-[#dddbff]/30 w-full"></div>
                                    </div>
                                    
                                    <div className="h-full flex items-end justify-between gap-3 relative z-10">
                                        {busyHours.map((slot, i) => {
                                            const isPeak = slot.height >= 75;
                                            const isMedium = slot.height >= 35 && slot.height < 75;
                                            
                                            let barGradient = 'from-[#dddbff]/60 to-[#443dff]/20';
                                            if (isPeak) {
                                                barGradient = 'from-[#2f27ce] to-[#443dff]';
                                            } else if (isMedium) {
                                                barGradient = 'from-[#443dff]/60 to-[#443dff]';
                                            }

                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative h-full justify-end pb-[20px]">
                                                    {/* Tooltip */}
                                                    <span className="absolute bottom-[calc(100%-8px)] left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-[#fbfbfe] opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-md bg-[#050316]/95 px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-20 pointer-events-none">
                                                        {slot.count} Transaksi
                                                    </span>
                                                    {/* Bar */}
                                                    <div
                                                        className={`w-full bg-gradient-to-t ${barGradient} rounded-t-md transition-all duration-300 group-hover:from-[#050316] group-hover:to-[#2f27ce] min-h-[4px] shadow-sm`}
                                                        style={{ height: `${Math.max(slot.height, 4)}%` }}
                                                    ></div>
                                                    {/* Label */}
                                                    <span className="absolute bottom-0 text-[10px] font-extrabold text-[#2f27ce]/50 group-hover:text-[#050316] transition-colors">
                                                        {slot.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analisis Profitabilitas */}
                        <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-extrabold text-[#050316] tracking-tight">Analisis Profitabilitas</h3>
                                <Link href="/recipe-costing" className="text-xs font-bold border border-[#dddbff] text-[#2f27ce] px-4 py-1.5 rounded-lg hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm">
                                    Detail HPP
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead>
                                        <tr className="text-xs text-[#2f27ce] border-b border-[#dddbff] uppercase tracking-wider">
                                            <th className="pb-3 font-extrabold">Nama Menu</th>
                                            <th className="pb-3 font-extrabold">Harga Jual</th>
                                            <th className="pb-3 font-extrabold">Estimasi HPP</th>
                                            <th className="pb-3 font-extrabold">Profit / Item</th>
                                            <th className="pb-3 font-extrabold text-right">Margin (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {profitability.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-[#2f27ce] italic">
                                                    Tambahkan menu dan resep untuk melihat analisis profit.
                                                </td>
                                            </tr>
                                        ) : profitability.map((row, i) => (
                                            <tr key={i} className="border-b border-[#dddbff]/30 last:border-0 hover:bg-[#dddbff]/10 transition-colors">
                                                <td className="py-4 font-bold text-[#050316]">
                                                    <div className="flex items-center gap-2">
                                                        <span>{row.name}</span>
                                                        {row.margin_pct >= 50 && (
                                                            <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md">
                                                                High Margin
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 font-semibold text-[#050316]/80">{row.price}</td>
                                                <td className="py-4 font-medium text-[#2f27ce]/60">{row.hpp}</td>
                                                <td className="py-4 text-emerald-600 font-extrabold">{row.profit}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <div className="w-16 bg-[#dddbff]/40 h-2 rounded-full overflow-hidden hidden sm:block">
                                                            <div 
                                                                className={`h-full rounded-full ${
                                                                    row.margin_pct >= 50 ? 'bg-emerald-500' : 'bg-amber-400'
                                                                }`} 
                                                                style={{ width: `${row.margin_pct}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="font-extrabold text-[#050316] text-right min-w-[32px]">{row.margin}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT SIDEBAR ===== */}
                    <div className="xl:col-span-3 space-y-6">

                        {/* Goal Hari Ini */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-[#443dff]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#2f27ce]/70">Goal Hari Ini</h3>
                                    <span className="text-[#2f27ce] font-extrabold text-xs bg-[#dddbff]/40 px-2 py-0.5 rounded-md">{dailyGoal.progress}%</span>
                                </div>
                                <div className="w-full bg-[#dddbff]/30 h-2.5 rounded-full overflow-hidden mb-4 border border-[#dddbff]/30">
                                    <div className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] h-full transition-all duration-700 ease-out rounded-full" style={{ width: `${dailyGoal.progress}%` }}></div>
                                </div>
                                <p className="text-[11px] font-medium text-[#2f27ce]/95 leading-relaxed">
                                    {dailyGoal.progress >= 100 ? (
                                        <span className="text-emerald-600 font-extrabold">Target {dailyGoal.target} tercapai! 🎉</span>
                                    ) : (
                                        <>Tinggal <span className="font-extrabold text-[#050316]">{dailyGoal.remaining}</span> lagi untuk mencapai target <span className="font-extrabold text-[#050316]">{dailyGoal.target}</span>
                                            {dailyGoal.label && <span className="block mt-1 text-[10px] text-[#2f27ce]/60 italic font-bold">Label: {dailyGoal.label}</span>}
                                        </>
                                    )}
                                </p>
                                {(!currentTarget || dailyGoal.progress < 100) ? (
                                    <button onClick={() => setShowTargetModal(true)}
                                        className="w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] bg-[#dddbff]/20 rounded-xl border border-[#dddbff] hover:bg-[#dddbff] hover:text-[#050316] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]">
                                        <iconify-icon icon="solar:target-linear" class="text-sm text-[#443dff]"></iconify-icon>
                                        {currentTarget ? 'Ubah Target' : 'Set Target Hari Ini'}
                                    </button>
                                ) : (
                                    <Link href="/targets-goals"
                                        className="block mt-4 w-full py-2.5 text-xs font-bold text-[#fbfbfe] bg-[#443dff] rounded-xl hover:bg-[#2f27ce] transition-colors text-center shadow-md active:scale-[0.98]">
                                        Lihat Detail Target →
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Alert Stok Rendah */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <iconify-icon icon="solar:box-minimalistic-linear" class="text-lg text-rose-500"></iconify-icon>
                                    <h3 className="text-sm font-extrabold text-[#050316]">Alert Stok Rendah</h3>
                                </div>
                                <span className="bg-rose-50 text-rose-600 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-rose-100 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                                    {lowStockItems.length} Item
                                </span>
                            </div>
                            <div className="space-y-2.5">
                                {lowStockItems.length === 0 ? (
                                    <p className="text-xs text-[#2f27ce] italic text-center py-2">Semua stok dalam kondisi aman.</p>
                                ) : lowStockItems.map((item, i) => (
                                    <Link key={i} href={`/inventories/${item.id}`}
                                        className="block p-3 bg-rose-50/40 rounded-xl border border-rose-100 hover:bg-rose-50 hover:border-rose-300 hover:shadow-sm transition-all duration-200 group">
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-[#050316] group-hover:text-rose-900 transition-colors truncate">{item.name}</p>
                                                <p className="text-[10px] font-medium text-rose-500 mt-0.5">
                                                    Sisa <span className="font-bold">{item.stock} {item.unit}</span> (min {item.min_stock})
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 bg-white px-2 py-1 rounded-lg shadow-sm border border-rose-100">
                                                Detail →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/inventories"
                                className="block w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] border border-[#dddbff] bg-[#fbfbfe] rounded-xl hover:bg-[#dddbff]/50 hover:text-[#050316] text-center transition-colors">
                                Manajemen Inventaris
                            </Link>
                        </div>

                        {/* Antrean Dapur */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-sm font-extrabold text-[#050316]">Antrean Dapur</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#2f27ce] bg-[#dddbff]/30 border border-[#dddbff]/50 px-2.5 py-0.5 rounded-full shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-[#443dff] rounded-full animate-pulse"></span> Live
                                    </span>
                                    <Link href="/kitchen-orders" className="text-[10px] text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline ml-1">
                                        Lihat semua →
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {kitchenQueue.length === 0 ? (
                                    <p className="text-xs text-[#2f27ce] italic text-center py-2">Tidak ada pesanan di dapur saat ini.</p>
                                ) : kitchenQueue.map((order, i) => {
                                    const s = statusLabel[order.status] ?? statusLabel.pending;
                                    return (
                                        <Link key={i} href="/kitchen-orders"
                                            className="block p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/10 hover:border-[#443dff] hover:shadow-sm transition-all duration-200 group relative overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor[order.status] ?? statusColor.pending}`}></div>
                                            <div className="flex justify-between items-start gap-3 pl-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-extrabold text-[#050316] group-hover:text-[#443dff] transition-colors truncate">
                                                        {order.id} <span className="font-normal text-[#2f27ce]/50 mx-1">—</span>
                                                        <span className="font-medium text-[#2f27ce]">{order.items}</span>
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#2f27ce]/60">
                                                            <iconify-icon icon="solar:clock-circle-linear" class="text-[14px]"></iconify-icon>
                                                            {order.time_ago}
                                                        </span>
                                                        <span className={`text-[9px] font-bold ${s.bg} ${s.text} px-2 py-0.5 rounded-md border`}>
                                                            {s.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-[#443dff] text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Promo Banner */}
                        <Link href="/bundles"
                            className="block bg-gradient-to-br from-[#050316] via-[#2f27ce] to-[#443dff] p-6 rounded-2xl border border-[#2f27ce] relative overflow-hidden hover:shadow-lg hover:shadow-[#443dff]/30 transition-all duration-300 group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-extrabold text-[#dddbff] mb-1.5 tracking-widest">✨ PROMO AKHIR PEKAN?</p>
                                <p className="text-xs font-medium text-white leading-relaxed mb-4 pr-6">
                                    Buat paket bundling menu terlaris untuk meningkatkan penjualan akhir pekan Anda.
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#050316] bg-[#fbfbfe] rounded-lg px-4 py-2 transition-all duration-300 group-hover:bg-[#dddbff] shadow-sm">
                                    Buat Sekarang <span className="group-hover:translate-x-1 transition-transform text-[#443dff]">→</span>
                                </span>
                            </div>
                            <span className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 transform">🎁</span>
                        </Link>

                    </div>
                </div>
            </div>

            {/* Target Modal */}
            {showTargetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                                                    <div className="bg-white rounded-2xl border border-[#dddbff] p-6 w-full max-w-sm shadow-xl relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#dddbff]/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                                        <h3 className="font-extrabold text-base text-[#050316] mb-1 relative z-10 flex items-center gap-1.5">
                                                            <iconify-icon icon="solar:target-linear" class="text-xl text-[#443dff]"></iconify-icon>
                                                            {currentTarget ? 'Ubah Target Harian' : 'Set Target Harian'}
                                                        </h3>
                        <p className="text-xs text-[#2f27ce]/70 mb-5 relative z-10">Tentukan target pendapatan operasional untuk hari ini.</p>

                        <form onSubmit={handleTargetSubmit} className="space-y-4 relative z-10">
                            <div>
                                <label className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider block mb-1">Nama / Label Target</label>
                                <input
                                    type="text"
                                    required
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="Contoh: Target Normal, Target Libur"
                                    className="w-full px-3 py-2 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] transition-all"
                                />
                                {errors.label && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.label}</p>}
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider block mb-1">Target Pendapatan (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-sm font-bold text-[#2f27ce]/50">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={data.target_value}
                                        onChange={(e) => setData('target_value', e.target.value)}
                                        placeholder="e.g. 1500000"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] transition-all font-semibold text-[#050316]"
                                    />
                                </div>
                                {errors.target_value && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.target_value}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowTargetModal(false)}
                                    className="flex-1 py-2.5 text-xs font-extrabold text-[#2f27ce] border border-[#dddbff] rounded-xl hover:bg-[#dddbff]/30 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] rounded-xl hover:from-[#050316] hover:to-[#2f27ce] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#2f27ce]/20 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

OwnerDashboard.layout = (page) => <AppLayout>{page}</AppLayout>;