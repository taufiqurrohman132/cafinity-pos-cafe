import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Head from '@/Components/Head';
import { Icon } from '@iconify/react';
// Sesuaikan path layout Anda
import ModernDatePicker from '@/Components/ModernDatePicker';
import client from '@/api/client';
import TransactionsSkeleton from '@/Components/Skeletons/TransactionsSkeleton';

function StatCard({ title, value, trend, trendType, icon, iconBg, iconColor }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                    <iconify-icon icon={icon} class={`text-2xl ${iconColor}`}></iconify-icon>
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${trendType === 'up'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}>
                        <span>{trendType === 'up' ? '↑' : '↓'}</span>
                        <span>{trend}</span>
                    </span>
                )}
            </div>
            <div className="mt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1 truncate">{title}</p>
                <p className="text-xl md:text-2xl font-extrabold mt-0.5 tracking-tight truncate text-black leading-tight">{value}</p>
            </div>
        </div>
    );
}

export default function TransactionHistory() {
    const location = useLocation();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // State lokal untuk form filter
    const [params, setParams] = useState({
        search: '',
        status: '',
        method: '',
        date: ''
    });

    // Cek apakah ada filter yang sedang aktif
    const hasActiveFilters = Object.values(params).some(val => val !== '');

    // Fetch data whenever location.search changes
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                setError(null);
                const response = await client.get(`/transactions${location.search}`);
                setTransactions(response.data.transactions);
                setStats(response.data.stats);

                // Keep local params in sync with URL search parameters
                const searchParams = new URLSearchParams(location.search);
                setParams({
                    search: searchParams.get('search') || '',
                    status: searchParams.get('status') || '',
                    method: searchParams.get('method') || '',
                    date: searchParams.get('date') || ''
                });
            } catch (err) {
                console.error("Gagal mengambil data transaksi:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [location.search, refreshTrigger]);

    // Format Rupiah helper
    const formatRp = (value) => new Intl.NumberFormat('id-ID').format(value || 0);

    // Format Waktu Helper (dari string ISO Laravel ke H:i)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    // Format Tanggal Helper untuk badge (e.g., 27 Mei 2026)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Helper to get query params from Laravel full pagination URL
    const getRelativeUrl = (url) => {
        if (!url) return '';
        try {
            const parsed = new URL(url);
            return `/transactions${parsed.search}`;
        } catch (e) {
            if (url.includes('?')) {
                return `/transactions?${url.split('?')[1]}`;
            }
            return '/transactions';
        }
    };

    // Fungsi submit filter ke server (tanpa full reload)
    const submitFilters = (newParams = params) => {
        const cleanParams = {};
        Object.entries(newParams).forEach(([k, v]) => {
            if (v !== '' && v !== null && v !== undefined) {
                cleanParams[k] = v;
            }
        });
        const searchParams = new URLSearchParams(cleanParams);
        navigate(`/transactions?${searchParams.toString()}`, { replace: true });
    };

    // Handler ketika input non-teks berubah (langsung submit)
    const handleParamChange = (key, value) => {
        const newParams = { ...params, [key]: value };
        setParams(newParams);

        if (['date', 'status', 'method'].includes(key)) {
            submitFilters(newParams);
        }
    };

    // Handler untuk input text search (submit saat enter ditekan / tombol diklik)
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        submitFilters();
    };

    // Handler reset filter
    const handleReset = () => {
        setParams({ search: '', status: '', method: '', date: '' });
        navigate('/transactions');
    };

    // Handler unduh laporan CSV secara asinkron
    const handleExport = async () => {
        try {
            const cleanParams = {};
            Object.entries(params).forEach(([k, v]) => {
                if (v !== '' && v !== null && v !== undefined) {
                    cleanParams[k] = v;
                }
            });
            const searchParams = new URLSearchParams(cleanParams);
            const response = await client.get(`/transactions/export?${searchParams.toString()}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            link.setAttribute('download', `transaksi_${dateStr}.csv`);

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error('Failed to export report:', e);
        }
    };

    if (loading && !transactions) {
        return (
            <>
                <Head title="Riwayat Transaksi" />
                <TransactionsSkeleton />
            </>
        );
    }

    if (error && !transactions) {
        return (
            <>
                <Head title="Riwayat Transaksi" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <Icon icon="solar:danger-triangle-linear" className="text-rose-500 text-5xl mb-4 mx-auto block" />
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data transaksi dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all active:scale-[0.97]">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Riwayat Transaksi" />

            <div className="min-h-screen bg-brand-bg p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* ====== HEADER ====== */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                             <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">
                                Riwayat Transaksi
                            </h1>
                            <p className="text-xs sm:text-sm text-[#666666] font-normal mt-1">
                                Kelola dan tinjau semua aktivitas penjualan hari ini.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleExport}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#D0D0D0] rounded-xl text-sm font-semibold text-black hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-200 active:scale-[0.98]"
                            >
                                <Icon icon="solar:download-linear" className="text-lg" />
                                Ekspor Laporan
                            </button>

                            {/* Date Filter */}
                            <ModernDatePicker
                                value={params.date}
                                onChange={(dateVal) => handleParamChange('date', dateVal)}
                                variant="gradient"
                            />
                        </div>
                    </div>

                    {/* ====== STAT CARDS ====== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Penjualan"
                            value={`Rp ${formatRp(stats.total_revenue)}`}
                            trend="+12.5%"
                            trendType="up"
                            icon="solar:card-linear"
                            iconBg="bg-[#BFFF00]"
                            iconColor="text-black"
                        />
                        <StatCard
                            title="Jumlah Transaksi"
                            value={stats.total_transactions}
                            trend="+5.2%"
                            trendType="up"
                            icon="solar:cart-large-2-linear"
                            iconBg="bg-[#BFFF00]"
                            iconColor="text-black"
                        />
                        <StatCard
                            title="Rata-rata Pesanan"
                            value={`Rp ${formatRp(stats.avg_order)}`}
                            trend="+2.1%"
                            trendType="up"
                            icon="solar:wallet-linear"
                            iconBg="bg-[#BFFF00]"
                            iconColor="text-black"
                        />
                        <StatCard
                            title="Refund / Batal"
                            value={stats.total_refund_cancel}
                            trend="+0.5%"
                            trendType="down"
                            icon="solar:restart-circle-linear"
                            iconBg="bg-rose-50"
                            iconColor="text-rose-600"
                        />
                    </div>

                    {/* ====== TABLE CARD ====== */}
                    <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">

                        {/* Table Controls (Filters) */}
                        <form onSubmit={handleSearchSubmit}>
                            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#E6E6E6]">
                                <h2 className="text-base font-semibold text-black tracking-tight">Daftar Transaksi</h2>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative">
                                        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-[15px]" />
                                        <input
                                            type="text"
                                            value={params.search}
                                            onChange={(e) => setParams({ ...params, search: e.target.value })}
                                            placeholder="Cari ID Invoice..."
                                            className="w-[200px] h-[40px] bg-white border border-[#D0D0D0] rounded-xl pl-9 pr-4 text-sm font-normal text-black placeholder-[#999999] outline-none transition-all duration-150 hover:border-[#999999] focus:border-[#BFFF00] focus:ring-4 focus:ring-[#BFFF00]/10"
                                        />
                                    </div>

                                    <select
                                        value={params.status}
                                        onChange={(e) => handleParamChange('status', e.target.value)}
                                        className="h-[40px] bg-white border border-[#D0D0D0] rounded-xl px-3 text-sm font-normal text-black outline-none transition-all duration-150 cursor-pointer hover:border-[#999999] focus:border-[#BFFF00] focus:ring-4 focus:ring-[#BFFF00]/10"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="completed">Selesai</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Dibatalkan</option>
                                        <option value="refunded">Refund</option>
                                    </select>

                                    <select
                                        value={params.method}
                                        onChange={(e) => handleParamChange('method', e.target.value)}
                                        className="h-[40px] bg-white border border-[#D0D0D0] rounded-xl px-3 text-sm font-normal text-black outline-none transition-all duration-150 cursor-pointer hover:border-[#999999] focus:border-[#BFFF00] focus:ring-4 focus:ring-[#BFFF00]/10"
                                    >
                                        <option value="">Semua Metode</option>
                                        <option value="cash">Cash</option>
                                        <option value="qris">QRIS</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="debit">Debit</option>
                                    </select>

                                    <button type="submit" className="h-[40px] px-6 bg-[#BFFF00] text-black border border-[#BFFF00] rounded-xl text-sm font-semibold hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] transition-all duration-200 active:scale-[0.98]">
                                        Cari
                                    </button>

                                    {hasActiveFilters && (
                                        <button type="button" onClick={handleReset} className="h-[40px] px-4 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-200 flex items-center gap-1.5 border border-[#D0D0D0] active:scale-[0.98]">
                                            <Icon icon="solar:close-circle-linear" className="text-[15px]" />
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Active Filter Badges */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 px-6 py-3 bg-white border-b border-[#E6E6E6]">
                                {params.search && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-black bg-neutral-100 border border-[#E6E6E6] px-2.5 py-1 rounded-lg">
                                        <Icon icon="solar:magnifer-linear" className="text-[#999999]" /> {params.search}
                                    </span>
                                )}
                                {params.status && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-black bg-neutral-100 border border-[#E6E6E6] px-2.5 py-1 rounded-lg">
                                        <Icon icon="solar:tag-linear" className="text-[#999999]" /> Status: {params.status.charAt(0).toUpperCase() + params.status.slice(1)}
                                    </span>
                                )}
                                {params.method && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-black bg-neutral-100 border border-[#E6E6E6] px-2.5 py-1 rounded-lg">
                                        <Icon icon="solar:wallet-linear" className="text-[#999999]" /> Metode: {['qris', 'cod'].includes(params.method.toLowerCase()) ? params.method.toUpperCase() : (params.method.charAt(0).toUpperCase() + params.method.slice(1).toLowerCase())}
                                    </span>
                                )}
                                {params.date && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-black bg-neutral-100 border border-[#E6E6E6] px-2.5 py-1 rounded-lg">
                                        <Icon icon="solar:calendar-linear" className="text-[#999999]" /> {formatDate(params.date)}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className={`transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#E6E6E6] bg-[#E6E6E6]/20">
                                            <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">ID Invoice</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Waktu</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Kasir</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Item</th>
                                            <th className="text-right px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Total Tagihan</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Metode</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E6E6]/50">
                                        {transactions.data.length > 0 ? (
                                            transactions.data.map((trx) => (
                                                <tr
                                                    key={trx.id}
                                                    onClick={() => navigate(`/transactions/${trx.id}`)}
                                                    className="hover:bg-[#E6E6E6]/30 active:bg-[#E6E6E6]/60 transition-all duration-200 group cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 font-mono text-xs font-semibold text-black tracking-wide">
                                                        <Link to={`/transactions/${trx.id}`} className="group-hover:text-[#BFFF00] transition-colors duration-150" onClick={(e) => e.stopPropagation()}>
                                                            {trx.id}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-[13px] font-normal text-[#666666]">
                                                        {formatTime(trx.created_at)}
                                                    </td>
                                                     <td className="px-6 py-4 text-[13px] text-black font-medium">
                                                        {trx.cashier?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-[13px] font-normal text-[#666666]">
                                                        <span className="bg-[#E6E6E6]/50 px-2 py-1 rounded-lg text-[11px] font-bold text-black">
                                                            {trx.items.reduce((acc, item) => acc + item.qty, 0)} pcs
                                                        </span>
                                                    </td>
                                                     <td className="px-6 py-4 text-sm font-semibold text-black text-right">
                                                         Rp {formatRp(trx.total_amount)}
                                                     </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] font-bold text-black bg-[#E6E6E6] border border-[#D0D0D0] px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                                            {trx.payment_method?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {trx.status === 'completed' ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                                                <Icon icon="solar:check-circle-linear" className="text-[13px]" /> Selesai
                                                            </span>
                                                        ) : trx.status === 'pending' ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                                                <Icon icon="solar:clock-circle-linear" className="text-[13px]" /> Pending
                                                            </span>
                                                        ) : trx.status === 'refunded' ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#666666] bg-[#E6E6E6] border border-[#D0D0D0] px-2.5 py-1 rounded-full">
                                                                <Icon icon="solar:restart-circle-linear" className="text-[13px]" /> Refund
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                                                                <Icon icon="solar:close-circle-linear" className="text-[13px]" /> Dibatalkan
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3 text-brand-primary">
                                                        <div className="w-16 h-16 rounded-full bg-[#E6E6E6]/50 flex items-center justify-center">
                                                            <Icon icon="solar:inbox-line-duotone" className="text-4xl text-[#999999]" />
                                                        </div>
                                                        <p className="text-sm font-semibold text-black">Tidak ada transaksi ditemukan</p>
                                                        {hasActiveFilters && (
                                                            <button onClick={handleReset} className="text-xs font-semibold text-[#666666] hover:text-black transition-colors duration-150 active:scale-[0.98] border-b border-[#D0D0D0] hover:border-black pb-0.5">
                                                                Reset semua filter
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#E6E6E6] bg-white">
                                <span className="text-xs font-normal text-[#999999]">
                                    Menampilkan <span className="font-semibold text-black">{transactions.from || 0}</span>–<span className="font-semibold text-black">{transactions.to || 0}</span> dari <span className="font-semibold text-black">{transactions.total}</span> transaksi
                                </span>
                                <div className="flex items-center gap-2">
                                    {transactions.prev_page_url ? (
                                        <Link
                                            to={getRelativeUrl(transactions.prev_page_url)}
                                            className="px-4 py-2 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-200 active:scale-[0.98]"
                                        >
                                            &larr; Sebelumnya
                                        </Link>
                                    ) : (
                                        <button className="px-4 py-2 text-xs font-semibold text-[#999999] bg-[#E6E6E6] border border-[#D0D0D0] rounded-xl cursor-not-allowed" disabled>
                                            &larr; Sebelumnya
                                        </button>
                                    )}

                                    {transactions.next_page_url ? (
                                        <Link
                                            to={getRelativeUrl(transactions.next_page_url)}
                                            className="px-4 py-2 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-200 active:scale-[0.98]"
                                        >
                                            Selanjutnya &rarr;
                                        </Link>
                                    ) : (
                                        <button className="px-4 py-2 text-xs font-semibold text-[#999999] bg-[#E6E6E6] border border-[#D0D0D0] rounded-xl cursor-not-allowed" disabled>
                                            Selanjutnya &rarr;
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

// TransactionHistory.layout = (page) => <>{page}</>;
