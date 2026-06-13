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
            <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm animate-pulse">
                <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0"></div>
                    <div className="w-16 h-5 bg-brand-light rounded-full"></div>
                </div>
                <div className="mt-1 space-y-2">
                    <div className="h-4 bg-brand-light/60 rounded w-1/2"></div>
                    <div className="h-7 bg-brand-light rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    const isUp = trendType === 'up' || trend_type === 'up';

    return (
        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                    <iconify-icon icon={icon} class={`text-2xl ${iconColor}`}></iconify-icon>
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${isUp
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-rose-50 border-rose-100 text-rose-600'
                        }`}>
                        <iconify-icon icon={isUp ? 'uil:arrow-growth' : 'streamline:graph-arrow-decrease-remix'} class="text-sm"></iconify-icon>
                        <span>{trend}</span>
                    </span>
                )}
            </div>
            <div className="mt-1">
                <p className="text-sm text-brand-primary/50 font-medium truncate">{title}</p>
                <p className={`text-xl md:text-2xl mt-0.5 tracking-tight truncate ${(typeof value === 'string' && value.includes('Rp')) ? 'font-black text-brand-secondary' : 'font-bold text-brand-dark'}`}>{value}</p>
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
        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div>
                    <h3 className="text-lg font-extrabold text-brand-dark tracking-tight">Ringkasan Penjualan</h3>
                    <p className="text-xs text-brand-primary font-medium">{periodLabel}</p>
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
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${activePeriod === pill.value ? 'bg-brand-primary text-white border-brand-primary shadow-sm' : 'bg-white text-brand-primary border-brand-light hover:bg-brand-light/50 hover:text-brand-dark'}`}>
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
                                        <div className="w-full bg-brand-light rounded-t-lg" style={{ height: `${height}%` }}></div>
                                        <div className="h-2 w-8 bg-brand-light/60 rounded mt-1"></div>
                                    </div>
                                );
                            })
                        ) : chartData.values.length === 0 ? (
                            <p className="w-full text-center text-brand-primary italic text-sm py-16">Belum ada penjualan</p>
                        ) : (
                            chartData.values.map((point, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer relative h-full justify-end pb-[20px]">
                                    {/* Tooltip */}
                                    <span className="absolute bottom-[calc(100%-8px)] left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-brand-bg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-md bg-brand-dark/95 px-2.5 py-1 rounded-lg shadow-lg border border-white/10 whitespace-nowrap z-20 pointer-events-none">
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
                                    <span className="absolute bottom-0 text-[10px] font-extrabold text-brand-primary/50 group-hover:text-brand-dark transition-colors whitespace-nowrap">
                                        {chartData.labels[i]}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-6 text-xs font-bold text-brand-primary justify-center">
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary shadow-sm"></span> Pendapatan
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
                <h3 className="text-lg font-bold text-brand-dark mb-2">Gagal Memuat Dashboard</h3>
                <p className="text-sm text-brand-primary/70 max-w-md mb-6">
                    Terjadi kesalahan saat mengambil data dashboard dari server. Pastikan server Laravel Anda berjalan.
                </p>
                <button
                    onClick={() => fetchDashboard()}
                    className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
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
        pending: 'bg-brand-light',
    };

    const statusLabel = {
        preparing: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-700', label: 'Sedang Dimasak' },
        ready: { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-700', label: 'Siap Diambil' },
        pending: { bg: 'bg-brand-light border-brand-light', text: 'text-brand-primary', label: 'Menunggu' },
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
                        <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Dashboard Owner
                        </h1>
                        <p className="text-brand-primary mt-1 text-sm font-medium">
                            Selamat datang kembali, <span className="font-extrabold text-brand-dark">{user?.name}</span>.
                            Berikut ringkasan performa cafe Anda hari ini.
                        </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                        <button
                            onClick={() => fetchDashboard(true)}
                            disabled={isRefreshing}
                            className="bg-white hover:bg-brand-light/50 text-brand-primary p-2.5 rounded-xl border border-brand-light shadow-sm transition-all flex items-center justify-center active:scale-95 disabled:opacity-50 shrink-0"
                            title="Perbarui Data"
                        >
                            <iconify-icon
                                icon="solar:restart-linear"
                                class={`text-[18px] flex ${isRefreshing ? 'animate-spin text-brand-secondary' : ''}`}
                            ></iconify-icon>
                        </button>
                        <div className="text-[13px] text-brand-primary bg-white px-4 py-2.5 rounded-xl border border-brand-light shadow-sm flex items-center gap-2 font-medium shrink-0 whitespace-nowrap">
                            <iconify-icon icon="solar:clock-circle-linear" class="text-lg text-brand-secondary"></iconify-icon>
                            <span>Terakhir Update: <span className="font-bold text-brand-dark">{lastUpdated}</span></span>
                        </div>
                        <button
                            type="button"
                            onClick={exportDashboardSummary}
                            className="bg-white hover:bg-brand-light/50 text-brand-primary px-4 py-2.5 rounded-xl border border-brand-light shadow-sm transition-all flex items-center gap-2 font-bold active:scale-95 shrink-0 whitespace-nowrap"
                        >
                            <iconify-icon icon="solar:export-linear" class="text-[18px] text-brand-secondary"></iconify-icon>
                            Ekspor Ringkasan
                        </button>
                        <Link to="/pos"
                            className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-6 py-2.5 rounded-xl font-bold shrink-0 whitespace-nowrap transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30 active:scale-[0.98]">
                            <iconify-icon icon="solar:card-2-linear" class="text-[18px]"></iconify-icon>
                            Buka POS
                        </Link>
                    </div>
                </div>

                {/* ====== STAT CARDS ====== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Pendapatan Hari Ini"  {...stats.revenue} icon="solar:wallet-money-linear" iconBg="bg-brand-light" iconColor="text-brand-secondary" loading={pageLoading} />
                    <StatCard title="Estimasi Laba Bersih" {...stats.profit} icon="solar:chart-2-linear" iconBg="bg-emerald-100" iconColor="text-emerald-600" loading={pageLoading} />
                    <StatCard title="Total Pesanan"        {...stats.orders} icon="solar:bag-5-linear" iconBg="bg-brand-light" iconColor="text-brand-secondary" loading={pageLoading} />
                    <StatCard title="Rata-rata Tiket"      {...stats.avg_ticket} icon="solar:users-group-rounded-linear" iconBg="bg-brand-light" iconColor="text-brand-primary" loading={pageLoading} />
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
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                                <div className="flex justify-between items-center mb-5">
                                    <div>
                                        <h3 className="font-extrabold text-brand-dark tracking-tight">Menu Terlaris</h3>
                                        <p className="text-[10px] text-brand-primary/60 font-bold capitalize tracking-wider mt-0.5">Penjualan tertinggi hari ini</p>
                                    </div>
                                    <Link to="/menus" className="group text-xs text-brand-secondary font-extrabold hover:text-brand-primary transition-colors flex items-center gap-1">
                                        <span>Lihat Katalog</span>
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                                <div className="space-y-1.5">
                                    {pageLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 px-2.5 border border-transparent rounded-2xl animate-pulse">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-brand-light rounded-xl flex-shrink-0"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-brand-light rounded w-28"></div>
                                                        <div className="h-3 bg-brand-light/60 rounded w-16"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-right">
                                                    <div className="h-4 bg-brand-light rounded w-12 ml-auto"></div>
                                                    <div className="h-3 bg-brand-light/60 rounded w-8 ml-auto"></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : bestSellingMenus.length === 0 ? (
                                        <p className="text-sm text-brand-primary italic text-center py-4">Belum ada data penjualan menu hari ini.</p>
                                    ) : bestSellingMenus.map((menu, i) => {
                                        const rankColors = [
                                            'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-200/50',
                                            'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-200/50',
                                            'bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-orange-200/50',
                                        ][i] ?? 'bg-brand-light text-brand-primary';

                                        return (
                                            <Link key={i} to={`/menus/${menu.id}`} className="flex items-center justify-between py-2 px-2.5 bg-transparent hover:bg-gradient-to-r hover:from-brand-light/60 hover:to-transparent border border-transparent hover:border-brand-light/80 rounded-2xl transition-all duration-300 hover:shadow-md hover:shadow-brand-primary/5 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-brand-light/10 to-brand-light/30 border border-brand-light rounded-xl flex items-center justify-center text-brand-secondary shadow-sm">
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
                                                        <span className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md border border-white ${rankColors}`}>
                                                            {i + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-brand-dark tracking-tight group-hover:text-brand-secondary transition-colors">{menu.name}</p>
                                                        <p className="text-[10px] font-bold text-brand-primary/60 capitalize tracking-wider">{menu.category}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-extrabold text-brand-dark tracking-tight">{menu.sold}</p>
                                                    <p className={`text-[10px] font-bold mt-0.5 ${menu.trend_type === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {menu.trend_type === 'up' ? '▲' : '▼'} {menu.trend}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Jam Sibuk */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="font-extrabold text-brand-dark tracking-tight">Jam Sibuk</h3>
                                    <p className="text-[10px] text-brand-primary/60 font-bold capitalize tracking-wider mt-0.5">Tingkat hunian transaksi harian</p>
                                </div>
                                <div className="relative h-40 mt-6 pt-4 px-1">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-x-0 bottom-[20px] top-4 flex flex-col justify-between pointer-events-none z-0">
                                        <div className="border-t border-brand-light/30 w-full"></div>
                                        <div className="border-t border-brand-light/30 w-full"></div>
                                        <div className="border-t border-brand-light/30 w-full"></div>
                                    </div>

                                    <div className="h-full flex items-end justify-between gap-3 relative z-10">
                                        {pageLoading ? (
                                            Array.from({ length: 6 }).map((_, i) => {
                                                const heights = [30, 45, 80, 60, 40, 50];
                                                const height = heights[i % heights.length];
                                                return (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end pb-[20px] animate-pulse">
                                                        <div className="w-full bg-brand-light rounded-t-md" style={{ height: `${height}%` }}></div>
                                                        <div className="h-3 w-8 bg-brand-light/60 rounded mt-1"></div>
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
                                                    <span className="absolute bottom-[calc(100%-8px)] left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-brand-bg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-md bg-brand-dark/95 px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-20 pointer-events-none">
                                                        {slot.count} Transaksi
                                                    </span>
                                                    {/* Bar */}
                                                    <div
                                                        className={`w-full bg-gradient-to-t ${barGradient} rounded-t-md transition-all duration-300 group-hover:from-brand-dark group-hover:to-brand-primary min-h-[4px] shadow-sm`}
                                                        style={{ height: `${Math.max(slot.height, 4)}%` }}
                                                    ></div>
                                                    {/* Label */}
                                                    <span className="absolute bottom-0 text-[10px] font-extrabold text-brand-primary/50 group-hover:text-brand-dark transition-colors">
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
                        <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-extrabold text-brand-dark tracking-tight">Analisis Profitabilitas</h3>
                                <Link to="/recipe-costing" className="text-xs font-bold border border-brand-light text-brand-primary px-4 py-1.5 rounded-lg hover:bg-brand-light hover:text-brand-dark transition-colors shadow-sm">
                                    Detail HPP
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead>
                                        <tr className="text-xs text-brand-primary border-b border-brand-light capitalize tracking-wider">
                                            <th className="pb-3 font-extrabold">Nama Menu</th>
                                            <th className="pb-3 font-extrabold">Harga Jual</th>
                                            <th className="pb-3 font-extrabold">Estimasi HPP</th>
                                            <th className="pb-3 font-extrabold">Profit / Item</th>
                                            <th className="pb-3 font-extrabold text-right">Margin (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {pageLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="border-b border-brand-light/30 last:border-0 animate-pulse">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-4 bg-brand-light rounded w-36"></div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="h-4 bg-brand-light rounded w-20"></div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="h-4 bg-brand-light/60 rounded w-16"></div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="h-4 bg-brand-light rounded w-24"></div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <div className="w-16 bg-brand-light/30 h-2 rounded-full hidden sm:block"></div>
                                                            <div className="h-4 bg-brand-light rounded w-10"></div>
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
                                                className="border-b border-brand-light/30 last:border-0 hover:bg-gradient-to-r hover:from-brand-light/40 hover:to-transparent transition-all cursor-pointer"
                                            >
                                                <td className="p-0 font-bold text-brand-dark">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-3 hover:text-brand-secondary transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <span>{row.name}</span>
                                                            {row.margin_pct >= 50 && (
                                                                <span className="text-[9px] font-extrabold bg-[#ecfdf5] text-[#065f46] border border-[#d1fae5] px-2 py-0.5 rounded-md">
                                                                    High Margin
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="p-0 font-bold text-brand-dark/80">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-3">
                                                        {row.price}
                                                    </Link>
                                                </td>
                                                <td className="p-0 font-medium text-brand-primary/60">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-3">
                                                        {row.hpp}
                                                    </Link>
                                                </td>
                                                <td className="p-0 text-[#059669] font-extrabold">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-3">
                                                        {row.profit}
                                                    </Link>
                                                </td>
                                                <td className="p-0">
                                                    <Link to={`/menus/${row.id}`} className="block py-4 px-3">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <div className="w-16 bg-brand-light/40 h-2 rounded-full overflow-hidden hidden sm:block">
                                                                <div
                                                                    className={`h-full rounded-full ${row.margin_pct >= 50 ? 'bg-[#059669]' : 'bg-[#92400e]'
                                                                        }`}
                                                                    style={{ width: `${row.margin_pct}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-extrabold text-brand-dark text-right min-w-[32px]">{row.margin}</span>
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
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-brand-secondary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="relative z-10">
                                {pageLoading ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="flex justify-between items-center">
                                            <div className="h-3 bg-brand-light rounded w-20"></div>
                                            <div className="h-3 bg-brand-light rounded w-8"></div>
                                        </div>
                                        <div className="w-full bg-brand-light/30 h-2.5 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-brand-light rounded w-5/6"></div>
                                            <div className="h-3 bg-brand-light/60 rounded w-2/3"></div>
                                        </div>
                                        <div className="w-full h-9 bg-brand-light/40 rounded-xl"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-[10px] font-bold capitalize tracking-wider text-brand-primary/70">Goal Hari Ini</h3>
                                            <span className="text-brand-primary font-extrabold text-xs bg-brand-light/40 px-2 py-0.5 rounded-md">{dailyGoal.progress}%</span>
                                        </div>
                                        <div className="w-full bg-brand-light/30 h-2.5 rounded-full overflow-hidden mb-4 border border-brand-light/30">
                                            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full transition-all duration-700 ease-out rounded-full" style={{ width: `${dailyGoal.progress}%` }}></div>
                                        </div>
                                        <p className="text-[11px] font-medium text-brand-primary/95 leading-relaxed">
                                            {dailyGoal.progress >= 100 ? (
                                                <span className="text-emerald-600 font-extrabold">Target {dailyGoal.target} tercapai! 🎉</span>
                                            ) : (
                                                <>Tinggal <span className="font-extrabold text-brand-dark">{dailyGoal.remaining}</span> lagi untuk mencapai target <span className="font-extrabold text-brand-dark">{dailyGoal.target}</span>
                                                    {dailyGoal.label && <span className="block mt-1 text-[10px] text-brand-primary/60 italic font-bold">Label: {dailyGoal.label}</span>}
                                                </>
                                            )}
                                        </p>
                                        {(!currentTarget || dailyGoal.progress < 100) ? (
                                            <button onClick={() => setShowTargetModal(true)}
                                                className="w-full mt-4 py-2.5 text-xs font-extrabold text-brand-primary bg-brand-light/20 rounded-xl border border-brand-light hover:bg-brand-light hover:text-brand-dark transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]">
                                                <iconify-icon icon="solar:target-linear" class="text-sm text-brand-secondary"></iconify-icon>
                                                {currentTarget ? 'Ubah Target' : 'Set Target Hari Ini'}
                                            </button>
                                        ) : (
                                            <Link to="/targets-goals"
                                                className="block mt-4 w-full py-2.5 text-xs font-bold text-brand-bg bg-brand-secondary rounded-xl hover:bg-brand-primary transition-colors text-center shadow-md active:scale-[0.98]">
                                                Lihat Detail Target →
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Alert Stok Rendah */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <iconify-icon icon="solar:box-minimalistic-linear" class="text-lg text-rose-500"></iconify-icon>
                                    <h3 className="text-sm font-extrabold text-brand-dark">Alert Stok Rendah</h3>
                                </div>
                                <span className="bg-rose-50 text-rose-600 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-rose-100 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                                    {lowStockItems.length} Item
                                </span>
                            </div>
                            <div className="space-y-2.5">
                                {pageLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="p-3 border border-brand-light rounded-xl animate-pulse space-y-2">
                                            <div className="flex justify-between">
                                                <div className="h-3 bg-brand-light rounded w-24"></div>
                                                <div className="h-3 bg-brand-light rounded w-12"></div>
                                            </div>
                                            <div className="h-3 bg-brand-light/60 rounded w-32"></div>
                                        </div>
                                    ))
                                ) : lowStockItems.length === 0 ? (
                                    <p className="text-xs text-brand-primary italic text-center py-2">Semua stok dalam kondisi aman.</p>
                                ) : lowStockItems.map((item, i) => (
                                    <Link key={i} to={`/inventories/${item.id}`}
                                        className="block p-3 bg-rose-50/40 rounded-xl border border-rose-100 hover:bg-rose-50 hover:border-rose-300 hover:shadow-sm transition-all duration-200 group">
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-brand-dark group-hover:text-rose-900 transition-colors truncate">{item.name}</p>
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
                            <Link to="/inventories"
                                className="block w-full mt-4 py-2.5 text-xs font-extrabold text-brand-primary border border-brand-light bg-brand-bg rounded-xl hover:bg-brand-light/50 hover:text-brand-dark text-center transition-colors">
                                Manajemen Inventaris
                            </Link>
                        </div>

                        {/* Antrean Dapur */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-sm font-extrabold text-brand-dark">Antrean Dapur</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary bg-brand-light/30 border border-brand-light/50 px-2.5 py-0.5 rounded-full shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse"></span> Live
                                    </span>
                                    <Link to="/kitchen-orders" className="group text-[10px] text-brand-secondary font-extrabold hover:text-brand-primary transition-colors flex items-center gap-0.5 ml-1">
                                        <span>Lihat semua</span>
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {pageLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="p-3 border border-brand-light rounded-xl animate-pulse space-y-2">
                                            <div className="flex justify-between">
                                                <div className="h-3 bg-brand-light rounded w-32"></div>
                                                <div className="h-3 bg-brand-light rounded w-6"></div>
                                            </div>
                                            <div className="h-3 bg-brand-light/60 rounded w-24"></div>
                                        </div>
                                    ))
                                ) : kitchenQueue.length === 0 ? (
                                    <p className="text-xs text-brand-primary italic text-center py-2">Tidak ada pesanan di dapur saat ini.</p>
                                ) : kitchenQueue.map((order, i) => {
                                    const s = statusLabel[order.status] ?? statusLabel.pending;
                                    return (
                                        <Link key={i} to="/kitchen-orders"
                                            className="block p-3 rounded-xl border border-brand-light hover:bg-gradient-to-r hover:from-brand-light/60 hover:to-transparent hover:border-brand-secondary/50 hover:shadow-md hover:shadow-brand-primary/5 transition-all duration-200 group relative overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColor[order.status] ?? statusColor.pending}`}></div>
                                            <div className="flex justify-between items-start gap-3 pl-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-extrabold text-brand-dark group-hover:text-brand-secondary transition-colors truncate">
                                                        {order.id} <span className="font-normal text-brand-primary/50 mx-1">—</span>
                                                        <span className="font-medium text-brand-primary">{order.items}</span>
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-brand-primary/60">
                                                            <iconify-icon icon="solar:clock-circle-linear" class="text-[14px]"></iconify-icon>
                                                            {order.time_ago}
                                                        </span>
                                                        <span className={`text-[9px] font-bold ${s.bg} ${s.text} px-2 py-0.5 rounded-md border`}>
                                                            {s.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-brand-secondary text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
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
