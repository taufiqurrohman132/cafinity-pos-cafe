import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import TargetModal from '@/Components/TargetModal';
import DashboardSkeleton from '@/Components/Skeletons/DashboardSkeleton';

// ── Stat Card Component ──────────────────────────────────────────
function StatCard({ title, value, trend, trendType, trend_type, icon, iconBg, iconColor, loading }) {
    if (loading) {
        return (
            <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-level-1 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-[#E6E6E6] flex items-center justify-center flex-shrink-0"></div>
                    <div className="w-16 h-5 bg-[#E6E6E6] rounded-full"></div>
                </div>
                <div className="mt-1 space-y-2">
                    <div className="h-4 bg-[#E6E6E6]/60 rounded w-1/2"></div>
                    <div className="h-7 bg-[#E6E6E6] rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    const isUp = trendType === 'up' || trend_type === 'up';

    return (
        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-level-1 stat-card-glow group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                    <iconify-icon icon={icon} class={`text-2xl ${iconColor}`}></iconify-icon>
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-caption font-semibold px-2.5 py-1 rounded-full border ${isUp
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-rose-50 border-rose-100 text-rose-600'
                        }`}>
                        <iconify-icon icon={isUp ? 'uil:arrow-growth' : 'streamline:graph-arrow-decrease-remix'} class="text-sm"></iconify-icon>
                        <span>{trend}</span>
                    </span>
                )}
            </div>
            <div className="mt-1">
                <p className="text-body-compact text-brand-primary/60 font-medium truncate">{title}</p>
                <p className="text-[20px] font-semibold mt-1 tracking-tight truncate text-black">{value}</p>
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

    // Update internal chart data when initial data updates from dashboard fetch
    useEffect(() => {
        if (activePeriod === 'today') {
            setChartData({ labels: initialLabels, values: initialValues });
        }
    }, [initialLabels, initialValues]);

    const pills = [
        { label: 'Hari Ini', value: 'today' },
        { label: '7 Hari', value: '7days' },
        { label: '30 Hari', value: '30days' },
        { label: 'Bulan Ini', value: 'month' },
    ];

    const periodLabel = {
        today: 'Tren pendapatan hari ini',
        '7days': 'Tren pendapatan 7 hari terakhir',
        '30days': 'Tren pendapatan 30 hari terakhir',
        month: 'Tren pendapatan bulan ini',
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
            const res = await client.get(`/dashboard/sales-chart?period=${period}`);
            setChartData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div>
                    <h3 className="text-heading text-black tracking-tight">Ringkasan Penjualan</h3>
                    <p className="text-caption text-brand-primary/60 font-medium">{periodLabel}</p>
                </div>
                <span className="flex items-center gap-1.5 text-caption font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full shadow-sm w-fit">
                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.6)]"></span>
                    LIVE
                </span>
            </div>

            {/* Period Pills */}
            <div className="flex items-center gap-2 mb-6">
                {pills.map(pill => (
                    <button key={pill.value}
                        onClick={() => setPeriod(pill.value)}
                        className={`px-4 py-1.5 text-[13px] font-medium rounded-lg border transition-all ${activePeriod === pill.value ? 'bg-[#BFFF00] text-black border-[#BFFF00] shadow-sm' : 'bg-white text-black border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999]'} active:scale-[0.97]`}>
                        {pill.label}
                    </button>
                ))}
            </div>

            {/* Chart Container */}
            <div className="overflow-x-auto pb-2 scrollbar-auto">
                <div className="h-56 md:h-64 min-w-[550px] w-full relative pt-8 px-2">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-x-0 bottom-[24px] top-8 flex flex-col justify-between pointer-events-none z-0">
                        <div className="border-t border-brand-light/40 w-full"></div>
                        <div className="border-t border-brand-light/40 w-full"></div>
                        <div className="border-t border-brand-light/40 w-full"></div>
                        <div className="border-t border-brand-light/40 w-full"></div>
                    </div>

                    <div className="h-full w-full flex items-end justify-between gap-1.5 relative z-10">
                        {loading ? (
                            Array.from({ length: activePeriod === '7days' ? 7 : (activePeriod === '30days' || activePeriod === 'month') ? 15 : (initialLabels.length || 12) }).map((_, i) => {
                                const heights = [35, 60, 45, 80, 50, 70, 40, 55, 90, 65, 30, 75, 45, 85, 60];
                                const height = heights[i % heights.length];
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end pb-[20px] animate-pulse">
                                        <div className="w-full bg-[#E6E6E6] rounded-t-lg" style={{ height: `${height}%` }}></div>
                                        <div className="h-2 w-8 bg-[#E6E6E6]/60 rounded mt-1"></div>
                                    </div>
                                );
                            })
                        ) : chartData.values.length === 0 ? (
                            <p className="w-full text-center text-brand-primary italic text-sm py-16">Belum ada penjualan</p>
                        ) : (
                            chartData.values.map((point, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative h-full justify-end pb-[20px]">
                                    {/* Tooltip */}
                                    <span className="absolute bottom-[calc(100%-8px)] left-1/2 -translate-x-1/2 text-caption font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 bg-[#1A1A1A] px-2.5 py-1 rounded-lg shadow-level-3 border border-[#D0D0D0]/10 whitespace-nowrap z-20 pointer-events-none">
                                        Rp {point.amount?.toLocaleString('id-ID')}
                                    </span>
                                    {/* Bar */}
                                    <div
                                        className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-lg transition-all duration-300 group-hover:from-brand-dark group-hover:to-brand-primary min-h-[4px] shadow-sm relative overflow-hidden"
                                        style={{ height: `${Math.max(point.height, 4)}%` }}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/20"></div>
                                    </div>
                                    {/* Label */}
                                    <span className="absolute bottom-0 text-caption font-medium text-brand-primary/60 group-hover:text-black transition-colors whitespace-nowrap">
                                        {chartData.labels[i]}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-6 text-caption font-semibold text-black justify-center">
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BFFF00] shadow-sm"></span> Pendapatan
                </span>
            </div>
        </div>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function OwnerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [showTargetModal, setShowTargetModal] = useState(false);

    const fetchDashboard = async (silent = false) => {
        if (!silent) {
            setLoading(true);
            setError(null);
        } else {
            setIsRefreshing(true);
        }
        try {
            const res = await client.get('/dashboard');
            setDashboardData(res.data);
        } catch (e) {
            console.error('Failed to fetch owner dashboard data', e);
            if (!silent) {
                setError(e);
            }
        } finally {
            if (!silent) {
                setLoading(false);
            } else {
                setIsRefreshing(false);
            }
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-brand-bg text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 border border-rose-100 animate-bounce">
                    <iconify-icon icon="solar:danger-circle-linear" class="text-3xl"></iconify-icon>
                </div>
                <h3 className="text-heading text-black mb-2">Gagal Memuat Dashboard</h3>
                <p className="text-body text-brand-primary/60 max-w-md mb-6">
                    Terjadi kesalahan saat mengambil data dashboard dari server. Pastikan server Laravel Anda berjalan.
                </p>
                <button
                    onClick={() => fetchDashboard()}
                    className="px-6 py-2.5 bg-[#BFFF00] hover:bg-[#C8FF5E] text-black text-sm font-semibold rounded-xl transition-all shadow-level-1 hover:shadow-level-2 active:bg-[#AFEE00] active:scale-[0.97] flex items-center gap-2"
                >
                    <iconify-icon icon="solar:restart-linear" class="text-lg"></iconify-icon>
                    Coba Lagi
                </button>
            </div>
        );
    }

    const statusColor = {
        preparing: 'bg-amber-400',
        ready: 'bg-emerald-500',
        pending: 'bg-[#D0D0D0]',
    };

    const statusLabel = {
        preparing: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-700', label: 'Sedang Dimasak' },
        ready: { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-700', label: 'Siap Diambil' },
        pending: { bg: 'bg-[#E6E6E6] border-[#D0D0D0]', text: 'text-black/60', label: 'Menunggu' },
    };

    // Fallbacks while initial load
    const stats = dashboardData?.stats || {
        revenue: { value: 'Rp 0', trend: '0%', trend_type: 'up' },
        profit: { value: 'Rp 0', trend: '0%', trend_type: 'up' },
        orders: { value: '0', trend: '0%', trend_type: 'up' },
        avg_ticket: { value: 'Rp 0', trend: '0%', trend_type: 'up' },
    };
    const lastUpdated = dashboardData?.lastUpdated || '--:--';
    const salesChart = dashboardData?.salesChart || { labels: [], values: [] };
    const bestSellingMenus = dashboardData?.bestSellingMenus || [];
    const busyHours = dashboardData?.busyHours || [];
    const profitability = dashboardData?.profitability || [];
    const dailyGoal = dashboardData?.dailyGoal || { progress: 0, remaining: 'Rp 0', target: 'Rp 0', label: '' };
    const currentTarget = dashboardData?.currentTarget || null;
    const lowStockItems = dashboardData?.lowStockItems || [];
    const kitchenQueue = dashboardData?.kitchenQueue || [];

    const exportDashboardSummary = () => {
        if (!dashboardData) return;

        let csvContent = "";

        // 1. Stats Section
        csvContent += "CAFINTY OWNER DASHBOARD SUMMARY\n";
        csvContent += `Terakhir Update,${lastUpdated}\n\n`;

        csvContent += "METRIK UTAMA\n";
        csvContent += "Metrik,Nilai,Tren\n";
        csvContent += `Pendapatan Hari Ini,"${stats.revenue.value}","${stats.revenue.trend} (${stats.revenue.trend_type === 'up' ? 'Naik' : 'Turun'})"\n`;
        csvContent += `Estimasi Laba Bersih,"${stats.profit.value}","${stats.profit.trend} (${stats.profit.trend_type === 'up' ? 'Naik' : 'Turun'})"\n`;
        csvContent += `Total Pesanan,"${stats.orders.value}","${stats.orders.trend} (${stats.orders.trend_type === 'up' ? 'Naik' : 'Turun'})"\n`;
        csvContent += `Rata-rata Tiket,"${stats.avg_ticket.value}","${stats.avg_ticket.trend} (${stats.avg_ticket.trend_type === 'up' ? 'Naik' : 'Turun'})"\n\n`;

        // 2. Best Selling Menus Section
        csvContent += "MENU TERLARIS HARI INI\n";
        csvContent += "Peringkat,Nama Menu,Kategori,Terjual,Tren\n";
        bestSellingMenus.forEach((menu, index) => {
            csvContent += `${index + 1},"${menu.name}","${menu.category}","${menu.sold}","${menu.trend} (${menu.trend_type === 'up' ? 'Naik' : 'Turun'})"\n`;
        });
        csvContent += "\n";

        // 3. Profitability Analysis Section
        csvContent += "ANALISIS PROFITABILITAS (HIGH MARGIN)\n";
        csvContent += "Nama Menu,Harga Jual,Estimasi HPP,Profit per Item,Margin (%)\n";
        profitability.forEach((row) => {
            csvContent += `"${row.name}","${row.price}","${row.hpp}","${row.profit}","${row.margin}"\n`;
        });
        csvContent += "\n";

        // 4. Low Stock Alert Section
        csvContent += "ALERT STOK RENDAH\n";
        csvContent += "Nama Item,Stok Saat Ini,Batas Minimum,Satuan\n";
        lowStockItems.forEach((item) => {
            csvContent += `"${item.name}",${item.stock},${item.min_stock},"${item.unit}"\n`;
        });

        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `dashboard-owner-summary-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const pageLoading = loading;

    return (
        <>
            <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen">
                {/* ====== TOP HEADER ====== */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-display text-black tracking-tight">
                            Dashboard Owner
                        </h1>
                        <p className="text-brand-primary/60 mt-1 text-body-compact">
                            Selamat datang kembali, <span className="font-semibold text-black">{user?.name}</span>.
                            Berikut ringkasan performa cafe Anda hari ini.
                        </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                        <button
                            onClick={() => fetchDashboard(true)}
                            disabled={isRefreshing}
                            className="bg-white hover:bg-[#E6E6E6] text-black p-2.5 rounded-xl border border-[#D0D0D0] hover:border-[#999999] shadow-sm transition-all flex items-center justify-center active:bg-[#D0D0D0] active:scale-[0.97] disabled:opacity-50 shrink-0"
                            title="Perbarui Data"
                        >
                            <iconify-icon
                                icon="solar:restart-linear"
                                class={`text-[18px] flex ${isRefreshing ? 'animate-spin text-black' : ''}`}
                            ></iconify-icon>
                        </button>
                        <div className="text-body-compact text-black bg-white px-4 py-2.5 rounded-xl border border-[#D0D0D0] shadow-sm flex items-center gap-2 font-medium shrink-0 whitespace-nowrap">
                            <iconify-icon icon="solar:clock-circle-linear" class="text-lg text-[#0E0E0E]"></iconify-icon>
                            <span>Terakhir Update: <span className="font-semibold text-black">{lastUpdated}</span></span>
                        </div>
                        <button
                            type="button"
                            onClick={exportDashboardSummary}
                            className="bg-white hover:bg-[#E6E6E6] text-black px-4 py-2.5 rounded-xl border border-[#D0D0D0] hover:border-[#999999] shadow-sm transition-all flex items-center gap-2 font-semibold active:bg-[#D0D0D0] active:scale-[0.97] shrink-0 whitespace-nowrap"
                        >
                            <iconify-icon icon="solar:export-linear" class="text-[18px] text-[#0E0E0E]"></iconify-icon>
                            Ekspor Ringkasan
                        </button>
                        <Link to="/pos"
                            className="bg-[#BFFF00] hover:bg-[#C8FF5E] text-black px-6 py-2.5 rounded-xl font-semibold shrink-0 whitespace-nowrap transition-all flex items-center gap-2 shadow-level-1 hover:shadow-level-2 active:bg-[#AFEE00] active:scale-[0.98]">
                            <iconify-icon icon="solar:card-2-linear" class="text-[18px]"></iconify-icon>
                            Buka POS
                        </Link>
                    </div>
                </div>

                {/* ====== STAT CARDS ====== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Pendapatan Hari Ini"  {...stats.revenue} icon="solar:wallet-money-linear" iconBg="bg-[#E6E6E6]" iconColor="text-black" loading={pageLoading} />
                    <StatCard title="Estimasi Laba Bersih" {...stats.profit} icon="solar:chart-2-linear" iconBg="bg-emerald-50" iconColor="text-emerald-600" loading={pageLoading} />
                    <StatCard title="Total Pesanan"        {...stats.orders} icon="solar:bag-5-linear" iconBg="bg-[#E6E6E6]" iconColor="text-black" loading={pageLoading} />
                    <StatCard title="Rata-rata Tiket"      {...stats.avg_ticket} icon="solar:users-group-rounded-linear" iconBg="bg-[#E6E6E6]" iconColor="text-black" loading={pageLoading} />
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
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1 hover:border-[#D0D0D0] transition-all duration-300">
                                <div className="flex justify-between items-center mb-5">
                                    <div>
                                        <h3 className="text-heading text-black tracking-tight">Menu Terlaris</h3>
                                        <p className="text-caption text-brand-primary/60 font-medium capitalize tracking-wider mt-0.5">Penjualan tertinggi hari ini</p>
                                    </div>
                                    <Link to="/menus" className="group text-[13px] text-[#0E0E0E] hover:text-black font-semibold border-b border-[#D0D0D0] hover:border-black pb-0.5 transition-all flex items-center gap-1">
                                        <span>Lihat Katalog</span>
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                                <div className="space-y-1.5">
                                    {pageLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 px-2.5 border border-transparent rounded-2xl animate-pulse">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-[#E6E6E6] rounded-xl flex-shrink-0"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-[#E6E6E6] rounded w-28"></div>
                                                        <div className="h-3 bg-[#E6E6E6]/60 rounded w-16"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-right">
                                                    <div className="h-4 bg-[#E6E6E6] rounded w-12 ml-auto"></div>
                                                    <div className="h-3 bg-[#E6E6E6]/60 rounded w-8 ml-auto"></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : bestSellingMenus.length === 0 ? (
                                        <p className="text-sm text-brand-primary italic text-center py-4">Belum ada data penjualan menu hari ini.</p>
                                    ) : bestSellingMenus.map((menu, i) => {
                                        const rankColors = [
                                            'bg-[#BFFF00] text-black border-[#BFFF00]',
                                            'bg-[#1A1A1A] text-white border-[#1A1A1A]',
                                            'bg-[#E6E6E6] text-black border-[#D0D0D0]',
                                        ][i] ?? 'bg-[#E6E6E6] text-black border-[#D0D0D0]';

                                        return (
                                            <Link key={i} to={`/menus/${menu.id}`} className="flex items-center justify-between py-2 px-2.5 bg-transparent hover:bg-[#E6E6E6]/40 border border-transparent hover:border-[#E6E6E6] rounded-2xl transition-all duration-200 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-[#E6E6E6] border border-[#D0D0D0] rounded-xl flex items-center justify-center text-[#000000] shadow-sm">
                                                            <iconify-icon icon={(() => {
                                                                const map = {
                                                                    '☕': 'solar:cup-hot-linear',
                                                                    '🍵': 'solar:cup-hot-linear',
                                                                    '🥐': 'solar:croissant-linear',
                                                                    '🍚': 'solar:bowl-linear',
                                                                    '🍽️': 'solar:hamburger-linear',
                                                                };
                                                                const val = menu.emoji || '';
                                                                return val.startsWith('solar:') ? val : (map[val] || 'solar:hamburger-linear');
                                                            })()} class="text-2xl"></iconify-icon>
                                                        </div>
                                                        <span className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-sm border ${rankColors}`}>
                                                            {i + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-semibold text-black group-hover:text-black transition-colors">{menu.name}</p>
                                                        <p className="text-caption font-medium text-brand-primary/60 capitalize tracking-wider">{menu.category}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[14px] font-semibold text-black">{menu.sold}</p>
                                                    <p className={`text-caption font-semibold mt-0.5 ${menu.trend_type === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {menu.trend_type === 'up' ? '▲' : '▼'} {menu.trend}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Jam Sibuk */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-heading text-black tracking-tight">Jam Sibuk</h3>
                                    <p className="text-caption text-brand-primary/60 font-medium capitalize tracking-wider mt-0.5">Tingkat hunian transaksi harian</p>
                                </div>
                                <div className="relative h-40 mt-6 pt-4 px-1">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-x-0 bottom-[20px] top-4 flex flex-col justify-between pointer-events-none z-0">
                                        <div className="border-t border-[#E6E6E6]/40 w-full"></div>
                                        <div className="border-t border-[#E6E6E6]/40 w-full"></div>
                                        <div className="border-t border-[#E6E6E6]/40 w-full"></div>
                                    </div>

                                    <div className="h-full flex items-end justify-between gap-3 relative z-10">
                                        {pageLoading ? (
                                            Array.from({ length: 6 }).map((_, i) => {
                                                const heights = [30, 45, 80, 60, 40, 50];
                                                const height = heights[i % heights.length];
                                                return (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end pb-[20px] animate-pulse">
                                                        <div className="w-full bg-[#E6E6E6] rounded-t-sm" style={{ height: `${height}%` }}></div>
                                                        <div className="h-3 w-8 bg-[#E6E6E6]/60 rounded-sm mt-1"></div>
                                                    </div>
                                                );
                                            })
                                        ) : busyHours.map((slot, i) => {
                                            const isPeak = slot.height >= 75;
                                            const isMedium = slot.height >= 35 && slot.height < 75;

                                            let barGradient = 'from-brand-light/60 to-brand-secondary/20';
                                            if (isPeak) {
                                                barGradient = 'from-brand-primary to-brand-secondary';
                                            } else if (isMedium) {
                                                barGradient = 'from-brand-secondary/60 to-brand-secondary';
                                            }

                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative h-full justify-end pb-[20px]">
                                                    {/* Tooltip */}
                                                    <span className="absolute bottom-[calc(100%-8px)] left-1/2 -translate-x-1/2 text-caption font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 bg-[#1A1A1A] px-2 py-0.5 rounded shadow-level-2 border border-[#D0D0D0]/10 whitespace-nowrap z-20 pointer-events-none">
                                                        {slot.count} Transaksi
                                                    </span>
                                                    {/* Bar */}
                                                    <div
                                                        className={`w-full bg-gradient-to-t ${barGradient} rounded-t-md transition-all duration-300 group-hover:from-brand-dark group-hover:to-brand-primary min-h-[4px] shadow-sm`}
                                                        style={{ height: `${Math.max(slot.height, 4)}%` }}
                                                    ></div>
                                                    {/* Label */}
                                                    <span className="absolute bottom-0 text-caption font-semibold text-brand-primary/60 group-hover:text-black transition-colors">
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
                        <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-heading text-black tracking-tight">Analisis Profitabilitas</h3>
                                <Link to="/recipe-costing" className="text-[13px] font-medium border border-[#D0D0D0] text-black bg-white px-4 py-1.5 rounded-lg hover:bg-[#E6E6E6] hover:border-[#999999] transition-colors shadow-sm">
                                    Detail HPP
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead>
                                        <tr className="text-caption text-brand-primary/60 border-b border-[#E6E6E6] capitalize tracking-wider">
                                            <th className="px-6 py-3.5 font-semibold">Nama Menu</th>
                                            <th className="px-6 py-3.5 font-semibold">Harga Jual</th>
                                            <th className="px-6 py-3.5 font-semibold">Estimasi HPP</th>
                                            <th className="px-6 py-3.5 font-semibold">Profit / Item</th>
                                            <th className="px-6 py-3.5 font-semibold text-right">Margin (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {pageLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="border-b border-[#E6E6E6]/50 last:border-0 animate-pulse">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-4 bg-[#E6E6E6] rounded w-36"></div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="h-4 bg-[#E6E6E6] rounded w-20"></div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="h-4 bg-[#E6E6E6]/60 rounded w-16"></div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="h-4 bg-[#E6E6E6] rounded w-24"></div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <div className="w-16 bg-[#E6E6E6]/30 h-2 rounded-full hidden sm:block"></div>
                                                            <div className="h-4 bg-[#E6E6E6] rounded w-10"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : profitability.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-brand-primary italic">
                                                    Tambahkan menu dan resep untuk melihat analisis profit.
                                                </td>
                                            </tr>
                                        ) : profitability.map((row, i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-[#E6E6E6]/50 last:border-0 hover:bg-[#E6E6E6]/40 transition-all cursor-pointer"
                                            >
                                                <td className="p-0 font-semibold text-black">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-6 hover:text-black transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <span>{row.name}</span>
                                                            {row.margin_pct >= 50 && (
                                                                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md">
                                                                    High Margin
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="p-0 font-semibold text-black/80">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-6">
                                                        {row.price}
                                                    </Link>
                                                </td>
                                                <td className="p-0 font-normal text-brand-primary/60">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-6">
                                                        {row.hpp}
                                                    </Link>
                                                </td>
                                                <td className="p-0 text-emerald-600 font-semibold">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-6">
                                                        {row.profit}
                                                    </Link>
                                                </td>
                                                <td className="p-0">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-6">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <div className="w-16 bg-[#E6E6E6] h-2 rounded-full overflow-hidden hidden sm:block">
                                                                <div
                                                                    className={`h-full rounded-full ${row.margin_pct >= 50 ? 'bg-[#BFFF00]' : 'bg-[#1A1A1A]'
                                                                        }`}
                                                                    style={{ width: `${row.margin_pct}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-semibold text-black text-right min-w-[32px]">{row.margin}</span>
                                                        </div>
                                                    </Link>
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
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-level-1 relative overflow-hidden hover:shadow-level-2 hover:border-[#D0D0D0] transition-all duration-300">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-[#BFFF00]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="relative z-10">
                                {pageLoading ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="flex justify-between items-center">
                                            <div className="h-3 bg-[#E6E6E6] rounded w-20"></div>
                                            <div className="h-3 bg-[#E6E6E6] rounded w-8"></div>
                                        </div>
                                        <div className="w-full bg-[#E6E6E6]/30 h-2 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-[#E6E6E6] rounded w-5/6"></div>
                                            <div className="h-3 bg-[#E6E6E6]/60 rounded w-2/3"></div>
                                        </div>
                                        <div className="w-full h-9 bg-[#E6E6E6]/40 rounded-xl"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-caption font-medium text-brand-primary/70">Goal Hari Ini</h3>
                                            <span className="text-black font-semibold text-xs bg-[#E6E6E6] px-2 py-0.5 rounded-md">{dailyGoal.progress}%</span>
                                        </div>
                                        <div className="w-full bg-[#E6E6E6] h-2 rounded-full overflow-hidden mb-4 border border-[#E6E6E6]">
                                            <div className="bg-[#BFFF00] h-full transition-all duration-700 ease-out rounded-full shadow-sm" style={{ width: `${dailyGoal.progress}%` }}></div>
                                        </div>
                                        <p className="text-caption font-medium text-black leading-relaxed">
                                            {dailyGoal.progress >= 100 ? (
                                                <span className="text-emerald-600 font-semibold">Target {dailyGoal.target} tercapai! 🎉</span>
                                            ) : (
                                                <>Tinggal <span className="font-semibold text-black">{dailyGoal.remaining}</span> lagi untuk mencapai target <span className="font-semibold text-black">{dailyGoal.target}</span>
                                                    {dailyGoal.label && <span className="block mt-1 text-caption text-brand-primary/60 italic font-medium">Label: {dailyGoal.label}</span>}
                                                </>
                                            )}
                                        </p>
                                        {(!currentTarget || dailyGoal.progress < 100) ? (
                                            <button onClick={() => setShowTargetModal(true)}
                                                className="w-full mt-4 py-2.5 text-[13px] font-medium text-black bg-white rounded-xl border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] transition-all flex items-center justify-center gap-1.5 shadow-sm active:bg-[#D0D0D0] active:scale-[0.97]">
                                                <iconify-icon icon="solar:target-linear" class="text-sm text-black"></iconify-icon>
                                                {currentTarget ? 'Ubah Target' : 'Set Target Hari Ini'}
                                            </button>
                                        ) : (
                                            <Link to="/targets-goals"
                                                className="block mt-4 w-full py-2.5 text-[13px] font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] rounded-xl transition-colors text-center shadow-level-1 hover:shadow-level-2 active:bg-[#AFEE00] active:scale-[0.98]">
                                                Lihat Detail Target →
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Alert Stok Rendah */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-level-1 hover:shadow-level-2 hover:border-[#D0D0D0] transition-all duration-300">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <iconify-icon icon="solar:box-minimalistic-linear" class="text-lg text-rose-500"></iconify-icon>
                                    <h3 className="text-heading text-black">Alert Stok Rendah</h3>
                                </div>
                                <span className="bg-rose-50 text-rose-700 text-caption px-2.5 py-0.5 rounded-full font-semibold border border-rose-100 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
                                    {lowStockItems.length} Item
                                </span>
                            </div>
                            <div className="space-y-2.5">
                                {pageLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="p-3 border border-[#E6E6E6] rounded-xl animate-pulse space-y-2">
                                            <div className="flex justify-between">
                                                <div className="h-3 bg-[#E6E6E6] rounded w-24"></div>
                                                <div className="h-3 bg-[#E6E6E6] rounded w-12"></div>
                                            </div>
                                            <div className="h-3 bg-[#E6E6E6]/60 rounded w-32"></div>
                                        </div>
                                    ))
                                ) : lowStockItems.length === 0 ? (
                                    <p className="text-xs text-brand-primary italic text-center py-2">Semua stok dalam kondisi aman.</p>
                                ) : lowStockItems.map((item, i) => (
                                    <Link key={i} to={`/inventories/${item.id}`}
                                        className="block p-3 bg-rose-50/20 rounded-xl border border-rose-100 hover:bg-rose-50 hover:border-rose-200 hover:shadow-sm transition-all duration-200 group">
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-semibold text-black group-hover:text-rose-950 transition-colors truncate">{item.name}</p>
                                                <p className="text-caption font-medium text-rose-600 mt-0.5">
                                                    Sisa <span className="font-bold">{item.stock} {item.unit}</span> (min {item.min_stock})
                                                </p>
                                            </div>
                                            <span className="text-caption font-semibold text-rose-700 border border-rose-100/50 bg-white rounded-lg px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                                                Detail →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link to="/inventories"
                                className="block w-full mt-4 py-2.5 text-[13px] font-medium text-black border border-[#D0D0D0] bg-white rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] text-center transition-all shadow-sm active:bg-[#D0D0D0]">
                                Manajemen Inventaris
                            </Link>
                        </div>

                        {/* Antrean Dapur */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-level-1 hover:shadow-level-2 hover:border-[#D0D0D0] transition-all duration-300">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-heading text-black">Antrean Dapur</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="flex items-center gap-1.5 text-caption font-semibold text-black bg-[#E6E6E6] border border-[#D0D0D0] px-2.5 py-0.5 rounded-full shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-[#BFFF00] rounded-full animate-pulse"></span> Live
                                    </span>
                                    <Link to="/kitchen-orders" className="group text-caption text-[#0E0E0E] hover:text-[#000000] font-semibold border-b border-[#D0D0D0] hover:border-black transition-all flex items-center gap-0.5 ml-1 pb-0.5">
                                        <span>Lihat semua</span>
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {pageLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="p-3 border border-[#E6E6E6] rounded-xl animate-pulse space-y-2">
                                            <div className="flex justify-between">
                                                <div className="h-3 bg-[#E6E6E6] rounded w-32"></div>
                                                <div className="h-3 bg-[#E6E6E6] rounded w-6"></div>
                                            </div>
                                            <div className="h-3 bg-[#E6E6E6]/60 rounded w-24"></div>
                                        </div>
                                    ))
                                ) : kitchenQueue.length === 0 ? (
                                    <p className="text-xs text-brand-primary italic text-center py-2">Tidak ada pesanan di dapur saat ini.</p>
                                ) : kitchenQueue.map((order, i) => {
                                    const s = statusLabel[order.status] ?? statusLabel.pending;
                                    return (
                                        <Link key={i} to="/kitchen-orders"
                                            className="block p-3 rounded-xl border border-[#E6E6E6] hover:bg-[#E6E6E6]/40 hover:border-[#D0D0D0] hover:shadow-sm transition-all duration-200 group relative overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor[order.status] ?? statusColor.pending}`}></div>
                                            <div className="flex justify-between items-start gap-3 pl-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-semibold text-black group-hover:text-black transition-colors truncate">
                                                        {order.id} <span className="font-normal text-black/50 mx-1">—</span>
                                                        <span className="font-normal text-black/80">{order.items}</span>
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="flex items-center gap-0.5 text-caption font-medium text-brand-primary/60">
                                                            <iconify-icon icon="solar:clock-circle-linear" class="text-[14px]"></iconify-icon>
                                                            {order.time_ago}
                                                        </span>
                                                        <span className={`text-[10px] font-semibold ${s.bg} ${s.text} px-2 py-0.5 rounded-md border`}>
                                                            {s.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-black text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Promo Banner */}
                        <Link to="/promotions"
                            className="block bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary p-6 rounded-2xl border border-brand-primary relative overflow-hidden hover:shadow-lg hover:shadow-brand-secondary/30 transition-all duration-300 group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-extrabold text-brand-light mb-1.5 tracking-widest flex items-center gap-1"><iconify-icon icon="solar:stars-linear" class="text-sm"></iconify-icon> Promo Akhir Pekan</p>
                                <p className="text-xs font-medium text-white leading-relaxed mb-4 pr-6">
                                    Buat paket bundling menu terlaris untuk meningkatkan penjualan akhir pekan Anda.
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-dark bg-brand-bg rounded-lg px-4 py-2 transition-all duration-300 group-hover:bg-brand-light shadow-sm">
                                    Buat Sekarang <span className="group-hover:translate-x-1 transition-transform text-brand-secondary">→</span>
                                </span>
                            </div>
                            <iconify-icon icon="solar:gift-linear" class="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 transform text-white"></iconify-icon>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Reusable Target Modal */}
            <TargetModal
                isOpen={showTargetModal}
                onClose={() => setShowTargetModal(false)}
                currentTarget={currentTarget}
                currentValue={parseInt(stats.revenue.value.replace(/[^0-9]/g, ''), 10) || 0}
                defaultPeriod="daily"
                onSaveSuccess={() => fetchDashboard(true)}
            />
        </>
    );
}
