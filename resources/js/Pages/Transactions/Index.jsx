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
        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                    <iconify-icon icon={icon} class={`text-2xl ${iconColor}`}></iconify-icon>
                </div>
                {trend && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${trendType === 'up'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-rose-50 border-rose-100 text-rose-600'
                        }`}>
                        <span>{trendType === 'up' ? '▲' : '▼'}</span>
                        <span>{trend}</span>
                    </span>
                )}
            </div>
            <div className="mt-1">
                <p className="text-xs text-brand-primary/50 font-extrabold capitalize tracking-wide truncate">{title}</p>
                <p className="text-xl md:text-2xl font-black text-brand-dark mt-0.5 tracking-tight truncate">{value}</p>
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
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
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
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#000000] to-brand-primary tracking-tight">
                                Riwayat Transaksi
                            </h1>
                            <p className="text-sm text-brand-primary font-medium mt-1">
                                Kelola dan tinjau semua aktivitas penjualan hari ini.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-light rounded-xl text-sm font-bold text-brand-primary hover:bg-brand-light/50 hover:text-brand-dark transition-all shadow-sm"
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
                            iconBg="bg-brand-light"
                            iconColor="text-brand-secondary"
                        />
                        <StatCard
                            title="Jumlah Transaksi"
                            value={stats.total_transactions}
                            trend="+5.2%"
                            trendType="up"
                            icon="solar:cart-large-2-linear"
                            iconBg="bg-brand-light"
                            iconColor="text-brand-secondary"
                        />
                        <StatCard
                            title="Rata-rata Pesanan"
                            value={`Rp ${formatRp(stats.avg_order)}`}
                            trend="+2.1%"
                            trendType="up"
                            icon="solar:wallet-linear"
                            iconBg="bg-brand-light"
                            iconColor="text-brand-secondary"
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
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">

                        {/* Table Controls (Filters) */}
                        <form onSubmit={handleSearchSubmit}>
                            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-brand-light/50">
                                <h2 className="text-base font-extrabold text-brand-dark">Daftar Transaksi</h2>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative">
                                        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/70 text-[15px]" />
                                        <input
                                            type="text"
                                            value={params.search}
                                            onChange={(e) => setParams({ ...params, search: e.target.value })}
                                            placeholder="Cari ID Invoice..."
                                            className="w-[200px] h-[38px] bg-brand-bg border border-brand-light rounded-xl pl-9 pr-4 text-[13px] font-semibold text-brand-dark placeholder-brand-primary/50 outline-none focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all"
                                        />
                                    </div>

                                    <select
                                        value={params.status}
                                        onChange={(e) => handleParamChange('status', e.target.value)}
                                        className="h-[38px] bg-brand-bg border border-brand-light rounded-xl px-3 text-[13px] font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all cursor-pointer"
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
                                        className="h-[38px] bg-brand-bg border border-brand-light rounded-xl px-3 text-[13px] font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all cursor-pointer"
                                    >
                                        <option value="">Semua Metode</option>
                                        <option value="cash">Cash</option>
                                        <option value="qris">QRIS</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="debit">Debit</option>
                                    </select>

                                    <button type="submit" className="h-[38px] px-5 bg-gradient-to-r from-brand-secondary to-brand-primary text-white rounded-xl text-[13px] font-extrabold hover:from-brand-primary hover:to-brand-dark shadow-lg shadow-brand-secondary/40 transition-all active:scale-95">
                                        Cari
                                    </button>

                                    {hasActiveFilters && (
                                        <button type="button" onClick={handleReset} className="h-[38px] px-3 bg-brand-light/30 text-brand-primary rounded-xl text-[13px] font-bold hover:bg-brand-light hover:text-brand-dark transition-all flex items-center gap-1 border border-transparent hover:border-brand-light">
                                            <Icon icon="solar:close-circle-linear" className="text-[16px]" />
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Active Filter Badges */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 px-6 py-3 bg-gradient-to-r from-brand-light/10 to-brand-bg border-b border-brand-light/50">
                                {params.search && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-dark bg-white border border-brand-light px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:magnifer-linear" className="text-brand-secondary" /> {params.search}
                                    </span>
                                )}
                                {params.status && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-dark bg-white border border-brand-light px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:tag-linear" className="text-brand-secondary" /> Status: {params.status.charAt(0).toUpperCase() + params.status.slice(1)}
                                    </span>
                                )}
                                {params.method && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-dark bg-white border border-brand-light px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:wallet-linear" className="text-brand-secondary" /> Metode: {params.method.toUpperCase()}
                                    </span>
                                )}
                                {params.date && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-dark bg-white border border-brand-light px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:calendar-linear" className="text-brand-secondary" /> {formatDate(params.date)}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className={`transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-brand-light bg-gradient-to-r from-brand-bg to-brand-light/20">
                                            <th className="text-left px-6 py-3 text-[11px] font-extrabold text-brand-primary capitalize tracking-wider">ID Invoice</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-extrabold text-brand-primary capitalize tracking-wider">Waktu</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-extrabold text-brand-primary capitalize tracking-wider">Kasir</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-extrabold text-brand-primary capitalize tracking-wider">Item</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-extrabold text-brand-primary capitalize tracking-wider">Total Tagihan</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-extrabold text-brand-primary capitalize tracking-wider">Metode</th>
                                            <th className="text-left px-6 py-3 text-[11px] font-extrabold text-brand-primary capitalize tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-light/50">
                                        {transactions.data.length > 0 ? (
                                            transactions.data.map((trx) => (
                                                <tr
                                                    key={trx.id}
                                                    onClick={() => navigate(`/transactions/${trx.id}`)}
                                                    className="hover:bg-brand-light/20 active:bg-brand-light/60 transition-all duration-200 group cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 text-[13px] font-extrabold text-brand-dark">
                                                        <Link to={`/transactions/${trx.id}`} className="group-hover:text-brand-secondary hover:text-brand-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                                                            {trx.id}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-[13px] font-medium text-brand-primary">
                                                        {formatTime(trx.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-[13px] text-brand-dark font-semibold group-hover:text-brand-secondary transition-colors">
                                                        {trx.cashier?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-[13px] font-medium text-brand-primary">
                                                        <span className="bg-gradient-to-r from-brand-light/40 to-brand-light/20 px-2 py-1 rounded-md">
                                                            {trx.items.reduce((acc, item) => acc + item.qty, 0)} pcs
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-[14px] font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">
                                                        Rp {formatRp(trx.total_amount)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] font-extrabold text-brand-primary bg-gradient-to-r from-brand-light/50 to-brand-light/20 border border-brand-light px-2.5 py-1 rounded-lg">
                                                            {trx.payment_method?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {trx.status === 'completed' ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                                                <Icon icon="solar:check-circle-linear" className="text-[13px]" /> Selesai
                                                            </span>
                                                        ) : trx.status === 'pending' ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                                                <Icon icon="solar:clock-circle-linear" className="text-[13px]" /> Pending
                                                            </span>
                                                        ) : trx.status === 'refunded' ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-primary bg-gradient-to-r from-brand-light to-brand-light/50 border border-brand-light px-2.5 py-1 rounded-full">
                                                                <Icon icon="solar:restart-circle-linear" className="text-[13px]" /> Refund
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
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
                                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-light/50 to-brand-light/20 flex items-center justify-center">
                                                            <Icon icon="solar:inbox-line-duotone" className="text-4xl text-brand-secondary" />
                                                        </div>
                                                        <p className="text-sm font-bold text-brand-dark">Tidak ada transaksi ditemukan</p>
                                                        {hasActiveFilters && (
                                                            <button onClick={handleReset} className="text-xs font-bold text-brand-secondary hover:text-brand-primary transition-colors">
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
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-brand-light/50 bg-gradient-to-r from-brand-bg to-brand-light/10">
                                <span className="text-[12px] font-medium text-brand-primary">
                                    Menampilkan <span className="font-bold text-brand-dark">{transactions.from || 0}</span>–<span className="font-bold text-brand-dark">{transactions.to || 0}</span> dari <span className="font-bold text-brand-dark">{transactions.total}</span> transaksi
                                </span>
                                <div className="flex items-center gap-2">
                                    {transactions.prev_page_url ? (
                                        <Link
                                            to={getRelativeUrl(transactions.prev_page_url)}
                                            className="px-4 py-2 text-[12px] font-extrabold text-brand-primary bg-gradient-to-r from-white to-brand-light/30 border border-brand-light rounded-xl hover:from-brand-light hover:to-brand-light/50 hover:text-brand-dark transition-all shadow-sm"
                                        >
                                            &larr; Sebelumnya
                                        </Link>
                                    ) : (
                                        <button className="px-4 py-2 text-[12px] font-bold text-brand-primary/40 bg-brand-bg border border-brand-light rounded-xl cursor-not-allowed" disabled>
                                            &larr; Sebelumnya
                                        </button>
                                    )}

                                    {transactions.next_page_url ? (
                                        <Link
                                            to={getRelativeUrl(transactions.next_page_url)}
                                            className="px-4 py-2 text-[12px] font-extrabold text-brand-primary bg-gradient-to-r from-white to-brand-light/30 border border-brand-light rounded-xl hover:from-brand-light hover:to-brand-light/50 hover:text-brand-dark transition-all shadow-sm"
                                        >
                                            Selanjutnya &rarr;
                                        </Link>
                                    ) : (
                                        <button className="px-4 py-2 text-[12px] font-bold text-brand-primary/40 bg-brand-bg border border-brand-light rounded-xl cursor-not-allowed" disabled>
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
