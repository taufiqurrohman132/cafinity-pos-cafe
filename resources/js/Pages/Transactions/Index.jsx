import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import AppLayout from '@/Layouts/AppLayout'; // Sesuaikan path layout Anda

function ModernDatePicker({ value, onChange }) {
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
        if (!value) return 'Pilih Tanggal';
        const d = new Date(value);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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
                className="flex items-center gap-2.5 pl-10 pr-4 py-2.5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl text-sm font-bold cursor-pointer transition-all shadow-lg shadow-[#443dff]/30 active:scale-[0.98] select-none"
            >
                <iconify-icon icon="solar:calendar-linear" class="text-base"></iconify-icon>
                <span>{getFormattedValue()}</span>
                <iconify-icon icon="solar:alt-arrow-down-linear" class={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></iconify-icon>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2.5 w-[310px] bg-white border border-[#dddbff] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="w-8 h-8 rounded-lg border border-[#dddbff] flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff]/30 hover:text-[#050316] transition-all"
                        >
                            <iconify-icon icon="solar:alt-arrow-left-linear" class="text-sm"></iconify-icon>
                        </button>
                        <span className="font-extrabold text-[13px] text-[#050316]">
                            {months[currentMonth]} {currentYear}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="w-8 h-8 rounded-lg border border-[#dddbff] flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff]/30 hover:text-[#050316] transition-all"
                        >
                            <iconify-icon icon="solar:alt-arrow-right-linear" class="text-sm"></iconify-icon>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                        {daysOfWeek.map((day) => (
                            <span key={day} className="text-[10px] font-extrabold text-[#2f27ce]/60 py-0.5">
                                {day}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((dayObj, index) => {
                            const selected = isSelected(dayObj);
                            const today = isToday(dayObj);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => handleSelectDay(dayObj, e)}
                                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
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

                    <div className="flex items-center justify-between border-t border-[#dddbff] mt-3.5 pt-3">
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
                            className="text-[10px] font-extrabold text-[#443dff] hover:text-[#2f27ce] transition-colors"
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
                                className="text-[10px] font-extrabold text-rose-500 hover:text-rose-700 transition-colors"
                            >
                                Hapus Filter
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

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
                <p className="text-xs text-[#2f27ce]/50 font-extrabold capitalize tracking-wide truncate">{title}</p>
                <p className="text-xl md:text-2xl font-black text-[#050316] mt-0.5 tracking-tight truncate">{value}</p>
            </div>
        </div>
    );
}

export default function TransactionHistory({ transactions, filters, stats }) {
    // State lokal untuk form filter
    const [params, setParams] = useState({
        search: filters.search || '',
        status: filters.status || '',
        method: filters.method || '',
        date: filters.date || ''
    });

    // Cek apakah ada filter yang sedang aktif
    const hasActiveFilters = Object.values(params).some(val => val !== '');

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

    // Fungsi submit filter ke server (tanpa full reload)
    const submitFilters = (newParams = params) => {
        router.get(route('transactions.index'), newParams, {
            preserveState: true,
            replace: true
        });
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
        router.get(route('transactions.index'));
    };

    return (
        <>
            <Head title="Riwayat Transaksi" />

            <div className="min-h-screen bg-[#fbfbfe] p-6 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* ====== HEADER ====== */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#000000] to-[#2f27ce] tracking-tight">
                                Riwayat Transaksi
                            </h1>
                            <p className="text-sm text-[#2f27ce] font-medium mt-1">
                                Kelola dan tinjau semua aktivitas penjualan hari ini.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href={route('transactions.export', params)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#dddbff] rounded-xl text-sm font-bold text-[#2f27ce] hover:bg-[#dddbff]/50 hover:text-[#050316] transition-all shadow-sm"
                            >
                                <Icon icon="solar:download-linear" className="text-lg" />
                                Ekspor Laporan
                            </a>

                            {/* Date Filter */}
                            <ModernDatePicker
                                value={params.date}
                                onChange={(dateVal) => handleParamChange('date', dateVal)}
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
                            iconBg="bg-[#dddbff]"
                            iconColor="text-[#443dff]"
                        />
                        <StatCard
                            title="Jumlah Transaksi"
                            value={stats.total_transactions}
                            trend="+5.2%"
                            trendType="up"
                            icon="solar:cart-large-2-linear"
                            iconBg="bg-[#dddbff]"
                            iconColor="text-[#443dff]"
                        />
                        <StatCard
                            title="Rata-rata Pesanan"
                            value={`Rp ${formatRp(stats.avg_order)}`}
                            trend="+2.1%"
                            trendType="up"
                            icon="solar:wallet-linear"
                            iconBg="bg-[#dddbff]"
                            iconColor="text-[#443dff]"
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
                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                        {/* Table Controls (Filters) */}
                        <form onSubmit={handleSearchSubmit}>
                            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#dddbff]/50">
                                <h2 className="text-base font-extrabold text-[#050316]">Daftar Transaksi</h2>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative">
                                        <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2f27ce]/70 text-[15px]" />
                                        <input
                                            type="text"
                                            value={params.search}
                                            onChange={(e) => setParams({ ...params, search: e.target.value })}
                                            placeholder="Cari ID Invoice..."
                                            className="w-[200px] h-[38px] bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-9 pr-4 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/50 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all"
                                        />
                                    </div>

                                    <select
                                        value={params.status}
                                        onChange={(e) => handleParamChange('status', e.target.value)}
                                        className="h-[38px] bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-3 text-[13px] font-bold text-[#2f27ce] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer"
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
                                        className="h-[38px] bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-3 text-[13px] font-bold text-[#2f27ce] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer"
                                    >
                                        <option value="">Semua Metode</option>
                                        <option value="cash">Cash</option>
                                        <option value="qris">QRIS</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="debit">Debit</option>
                                    </select>

                                    <button type="submit" className="h-[38px] px-5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white rounded-xl text-[13px] font-extrabold hover:from-[#2f27ce] hover:to-[#050316] shadow-lg shadow-[#443dff]/40 transition-all active:scale-95">
                                        Cari
                                    </button>

                                    {hasActiveFilters && (
                                        <button type="button" onClick={handleReset} className="h-[38px] px-3 bg-[#dddbff]/30 text-[#2f27ce] rounded-xl text-[13px] font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all flex items-center gap-1 border border-transparent hover:border-[#dddbff]">
                                            <Icon icon="solar:close-circle-linear" className="text-[16px]" />
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Active Filter Badges */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 px-6 py-3 bg-gradient-to-r from-[#dddbff]/10 to-[#fbfbfe] border-b border-[#dddbff]/50">
                                {params.search && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:magnifer-linear" className="text-[#443dff]" /> {params.search}
                                    </span>
                                )}
                                {params.status && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:tag-linear" className="text-[#443dff]" /> Status: {params.status.charAt(0).toUpperCase() + params.status.slice(1)}
                                    </span>
                                )}
                                {params.method && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:wallet-linear" className="text-[#443dff]" /> Metode: {params.method.toUpperCase()}
                                    </span>
                                )}
                                {params.date && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                        <Icon icon="solar:calendar-linear" className="text-[#443dff]" /> {formatDate(params.date)}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#dddbff] bg-gradient-to-r from-[#fbfbfe] to-[#dddbff]/20">
                                        <th className="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-wider">ID Invoice</th>
                                        <th className="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-wider">Waktu</th>
                                        <th className="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-wider">Kasir</th>
                                        <th className="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-wider">Item</th>
                                        <th className="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-wider">Total Tagihan</th>
                                        <th className="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-wider">Metode</th>
                                        <th className="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#dddbff]/50">
                                    {transactions.data.length > 0 ? (
                                        transactions.data.map((trx) => (
                                            <tr
                                                key={trx.id}
                                                onClick={() => router.get(route('transactions.show', trx.id))}
                                                className="hover:bg-[#dddbff]/20 active:bg-[#dddbff]/60 transition-all duration-200 group cursor-pointer"
                                            >
                                                <td className="px-6 py-4 text-[13px] font-extrabold text-[#050316]">
                                                    <Link href={route('transactions.show', trx.id)} className="group-hover:text-[#443dff] hover:text-[#2f27ce] transition-colors" onClick={(e) => e.stopPropagation()}>
                                                        {trx.id}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-[13px] font-medium text-[#2f27ce]">
                                                    {formatTime(trx.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-[#050316] font-semibold group-hover:text-[#443dff] transition-colors">
                                                    {trx.cashier?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] font-medium text-[#2f27ce]">
                                                    <span className="bg-gradient-to-r from-[#dddbff]/40 to-[#dddbff]/20 px-2 py-1 rounded-md">
                                                        {trx.items.reduce((acc, item) => acc + item.qty, 0)} pcs
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[14px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#443dff] to-[#2f27ce]">
                                                    Rp {formatRp(trx.total_amount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[11px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-[#dddbff]/50 to-[#dddbff]/20 border border-[#dddbff] px-2.5 py-1 rounded-lg">
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
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-[#dddbff] to-[#dddbff]/50 border border-[#dddbff] px-2.5 py-1 rounded-full">
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
                                                <div className="flex flex-col items-center gap-3 text-[#2f27ce]">
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#dddbff]/50 to-[#dddbff]/20 flex items-center justify-center">
                                                        <Icon icon="solar:inbox-line-duotone" className="text-4xl text-[#443dff]" />
                                                    </div>
                                                    <p className="text-sm font-bold text-[#050316]">Tidak ada transaksi ditemukan</p>
                                                    {hasActiveFilters && (
                                                        <button onClick={handleReset} className="text-xs font-bold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors">
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#dddbff]/50 bg-gradient-to-r from-[#fbfbfe] to-[#dddbff]/10">
                            <span className="text-[12px] font-medium text-[#2f27ce]">
                                Menampilkan <span className="font-bold text-[#050316]">{transactions.from || 0}</span>–<span className="font-bold text-[#050316]">{transactions.to || 0}</span> dari <span className="font-bold text-[#050316]">{transactions.total}</span> transaksi
                            </span>
                            <div className="flex items-center gap-2">
                                {transactions.prev_page_url ? (
                                    <Link
                                        href={transactions.prev_page_url}
                                        className="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-white to-[#dddbff]/30 border border-[#dddbff] rounded-xl hover:from-[#dddbff] hover:to-[#dddbff]/50 hover:text-[#050316] transition-all shadow-sm"
                                    >
                                        &larr; Sebelumnya
                                    </Link>
                                ) : (
                                    <button className="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed" disabled>
                                        &larr; Sebelumnya
                                    </button>
                                )}

                                {transactions.next_page_url ? (
                                    <Link
                                        href={transactions.next_page_url}
                                        className="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-white to-[#dddbff]/30 border border-[#dddbff] rounded-xl hover:from-[#dddbff] hover:to-[#dddbff]/50 hover:text-[#050316] transition-all shadow-sm"
                                    >
                                        Selanjutnya &rarr;
                                    </Link>
                                ) : (
                                    <button className="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed" disabled>
                                        Selanjutnya &rarr;
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

TransactionHistory.layout = (page) => <AppLayout>{page}</AppLayout>;
