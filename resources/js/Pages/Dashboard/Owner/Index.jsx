import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// ── Stat Card Component ──────────────────────────────────────────
function StatCard({ title, value, trend, trendType, icon, iconBg, iconColor }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <iconify-icon icon={icon} class={`text-2xl ${iconColor}`}></iconify-icon>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#2f27ce]/70 uppercase tracking-wide truncate">{title}</p>
                <p className="text-xl font-extrabold text-[#050316] mt-0.5 truncate">{value}</p>
                {trend && (
                    <p className={`text-[11px] font-bold mt-0.5 ${trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trendType === 'up' ? '▲' : '▼'} {trend} vs kemarin
                    </p>
                )}
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
            const res = await fetch(`/owner/sales-chart?period=${period}`, {
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

            {/* Chart */}
            <div className="h-52 md:h-64 w-full flex items-end justify-between gap-2 px-2 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                        <iconify-icon icon="svg-spinners:ring-resize" class="text-3xl text-[#443dff]"></iconify-icon>
                    </div>
                )}
                {chartData.values.length === 0 && !loading ? (
                    <p className="w-full text-center text-[#2f27ce] italic text-sm py-16">Belum ada penjualan</p>
                ) : (
                    chartData.values.map((point, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                            <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-[#050316] px-2 py-0.5 rounded-md mb-1 shadow-md">
                                Rp {point.amount?.toLocaleString('id-ID')}
                            </span>
                            <div
                                className="w-full bg-[#443dff] rounded-t-md transition-all duration-300 group-hover:bg-[#2f27ce] min-h-[4px] shadow-sm"
                                style={{ height: `${Math.max(point.height, 4)}%` }}
                            ></div>
                            <span className="text-[10px] font-bold text-[#2f27ce]/50 group-hover:text-[#050316] transition-colors">
                                {chartData.labels[i]}
                            </span>
                        </div>
                    ))
                )}
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
                            <iconify-icon icon="material-symbols:avg-time-outline" class="text-lg text-[#443dff]"></iconify-icon>
                            <span>Terakhir Update: <span className="font-bold text-[#050316]">{lastUpdated}</span></span>
                        </div>
                        <Link href="/pos"
                            className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                            <iconify-icon icon="solar:card-2-bold" class="text-[18px]"></iconify-icon>
                            Buka POS
                        </Link>
                    </div>
                </div>

                {/* ====== STAT CARDS ====== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Pendapatan Hari Ini"  {...stats.revenue}    icon="solar:wallet-money-bold-duotone" iconBg="bg-[#dddbff]"    iconColor="text-[#443dff]" />
                    <StatCard title="Estimasi Laba Bersih" {...stats.profit}     icon="solar:chart-2-bold-duotone"     iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                    <StatCard title="Total Pesanan"        {...stats.orders}     icon="solar:bag-5-bold-duotone"       iconBg="bg-[#dddbff]"    iconColor="text-[#443dff]" />
                    <StatCard title="Rata-rata Tiket"      {...stats.avg_ticket} icon="solar:users-group-rounded-bold-duotone" iconBg="bg-[#dddbff]" iconColor="text-[#2f27ce]" />
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
                                    <h3 className="font-extrabold text-[#050316] tracking-tight">Menu Terlaris</h3>
                                    <Link href="/menus" className="text-xs text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline transition-colors">
                                        Lihat Katalog
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {bestSellingMenus.length === 0 ? (
                                        <p className="text-sm text-[#2f27ce] italic text-center py-4">Belum ada data penjualan menu hari ini.</p>
                                    ) : bestSellingMenus.map((menu, i) => (
                                        <div key={i} className="flex items-center justify-between p-2.5 hover:bg-[#dddbff]/20 rounded-xl transition-colors">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="w-12 h-12 bg-[#dddbff]/30 border border-[#dddbff] rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                                    {menu.emoji}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-[#050316]">{menu.name}</p>
                                                    <p className="text-xs font-medium text-[#2f27ce]">{menu.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-extrabold text-[#050316]">{menu.sold}</p>
                                                <p className={`text-[10px] font-bold ${menu.trend_type === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {menu.trend} vs kemarin
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Jam Sibuk */}
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                                <h3 className="font-extrabold text-[#050316] tracking-tight mb-5">Jam Sibuk</h3>
                                <div className="flex items-end justify-between h-40 pt-4 gap-2">
                                    {busyHours.map((slot, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                            <div
                                                className="w-full bg-[#dddbff] rounded-t-md transition-all duration-300 group-hover:bg-[#443dff] min-h-[4px] shadow-sm"
                                                style={{ height: `${Math.max(slot.height, 4)}%` }}
                                                title={`${slot.count} transaksi`}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-3 text-[10px] text-[#2f27ce] font-extrabold">
                                    {busyHours.map((slot, i) => (
                                        <span key={i}>{slot.label}</span>
                                    ))}
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
                                            <tr key={i} className="border-b border-[#dddbff]/50 last:border-0 hover:bg-[#dddbff]/10 transition-colors">
                                                <td className="py-4 font-bold text-[#050316]">{row.name}</td>
                                                <td className="py-4 font-medium text-[#050316]/70">{row.price}</td>
                                                <td className="py-4 font-medium text-[#050316]/70">{row.hpp}</td>
                                                <td className="py-4 text-emerald-600 font-extrabold">{row.profit}</td>
                                                <td className="py-4 text-right font-extrabold text-[#050316]">{row.margin}</td>
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
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#dddbff] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#2f27ce]">Goal Hari Ini</h3>
                                    <span className="text-[#443dff] font-extrabold text-sm">{dailyGoal.progress}%</span>
                                </div>
                                <div className="w-full bg-[#dddbff]/50 h-2.5 rounded-full overflow-hidden mb-3 shadow-inner">
                                    <div className="bg-[#443dff] h-full transition-all duration-500 ease-out" style={{ width: `${dailyGoal.progress}%` }}></div>
                                </div>
                                <p className="text-[11px] font-medium text-[#2f27ce] leading-relaxed">
                                    {dailyGoal.progress >= 100 ? (
                                        <>Target <span className="font-extrabold text-[#050316]">{dailyGoal.target}</span> tercapai! 🎉</>
                                    ) : (
                                        <>Tinggal <span className="font-extrabold text-[#050316]">{dailyGoal.remaining}</span> lagi untuk mencapai target {dailyGoal.target}
                                            {dailyGoal.label && <span className="block mt-0.5 text-[#2f27ce]/70 italic">({dailyGoal.label})</span>}
                                        </>
                                    )}
                                </p>
                                {(!currentTarget || dailyGoal.progress < 100) ? (
                                    <button onClick={() => setShowTargetModal(true)}
                                        className="w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] bg-[#dddbff]/30 rounded-xl border border-[#dddbff] hover:bg-[#dddbff] hover:text-[#050316] hover:border-[#443dff] transition-all flex items-center justify-center gap-1.5 shadow-sm">
                                        <iconify-icon icon="solar:target-linear" class="text-sm text-[#443dff]"></iconify-icon>
                                        {currentTarget ? 'Ubah Target' : 'Set Target Hari Ini'}
                                    </button>
                                ) : (
                                    <Link href="/targets-goals"
                                        className="block mt-4 w-full py-2.5 text-xs font-bold text-[#fbfbfe] bg-[#443dff] rounded-xl hover:bg-[#2f27ce] transition-colors text-center">
                                        Lihat Detail Target →
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Alert Stok Rendah */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <iconify-icon icon="solar:box-minimalistic-bold-duotone" class="text-lg text-rose-500"></iconify-icon>
                                    <h3 className="text-sm font-extrabold text-[#050316]">Alert Stok Rendah</h3>
                                </div>
                                <span className="bg-rose-100 text-rose-700 text-[10px] px-2.5 py-1 rounded-md font-extrabold border border-rose-200">
                                    {lowStockItems.length} Item
                                </span>
                            </div>
                            <div className="space-y-3">
                                {lowStockItems.length === 0 ? (
                                    <p className="text-xs text-[#2f27ce] italic text-center py-2">Semua stok dalam kondisi aman.</p>
                                ) : lowStockItems.map((item, i) => (
                                    <Link key={i} href={`/inventories/${item.id}`}
                                        className="block p-3 bg-rose-50/80 rounded-xl border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all group">
                                        <div className="flex justify-between items-center gap-2">
                                            <div>
                                                <p className="text-xs font-bold text-[#050316] group-hover:text-rose-900 transition-colors">{item.name}</p>
                                                <p className="text-[10px] font-medium text-rose-500 mt-0.5">
                                                    Sisa <span className="font-bold">{item.stock} {item.unit}</span> (min {item.min_stock})
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0 bg-white px-2 py-1 rounded-lg shadow-sm border border-rose-100">
                                                Detail →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href={lowStockItems.length > 0 ? `/inventories/${lowStockItems[0].id}` : '/inventories'}
                                className="block w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] border border-[#dddbff] bg-[#fbfbfe] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] text-center transition-colors">
                                Manajemen Inventaris
                            </Link>
                        </div>

                        {/* Antrean Dapur */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-sm font-extrabold text-[#050316]">Antrean Dapur</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#2f27ce] bg-[#dddbff]/50 px-2 py-0.5 rounded-md">
                                        <span className="w-1.5 h-1.5 bg-[#443dff] rounded-full animate-pulse"></span> Live
                                    </span>
                                    <Link href="/kitchen-orders" className="text-[10px] text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline ml-1">
                                        Lihat semua →
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {kitchenQueue.length === 0 ? (
                                    <p className="text-xs text-[#2f27ce] italic text-center py-2">Tidak ada pesanan di dapur saat ini.</p>
                                ) : kitchenQueue.map((order, i) => {
                                    const s = statusLabel[order.status] ?? statusLabel.pending;
                                    return (
                                        <Link key={i} href="/kitchen-orders"
                                            className="block p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/20 hover:border-[#443dff] hover:shadow-sm transition-all group relative overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor[order.status] ?? statusColor.pending}`}></div>
                                            <div className="flex justify-between items-start gap-3 pl-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-extrabold text-[#050316] group-hover:text-[#443dff] transition-colors truncate">
                                                        {order.id} <span className="font-normal text-[#2f27ce]/50 mx-1">—</span>
                                                        <span className="font-medium text-[#2f27ce]">{order.items}</span>
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#2f27ce]">
                                                            <iconify-icon icon="solar:clock-circle-bold-duotone" class="text-[14px]"></iconify-icon>
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

            {/* Target Modal — bisa dibuat komponen terpisah nanti */}
            {showTargetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl border border-[#dddbff] p-6 w-full max-w-sm shadow-xl">
                        <h3 className="font-extrabold text-[#050316] mb-4">Set Target Harian</h3>
                        <p className="text-sm text-[#2f27ce]">Form target akan ditambahkan di sini.</p>
                        <button onClick={() => setShowTargetModal(false)}
                            className="mt-4 w-full py-2.5 text-xs font-bold text-[#2f27ce] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-colors">
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

OwnerDashboard.layout = (page) => <AppLayout>{page}</AppLayout>;