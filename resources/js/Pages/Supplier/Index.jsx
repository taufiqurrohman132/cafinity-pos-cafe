import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';
import { useConfirm } from '@/context/ConfirmContext';
import CustomSelect from '@/Components/CustomSelect';

export default function SupplierIndex({ suppliers, filters, categories, stats, recent_activities }) {
    const confirm = useConfirm();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [category, setCategory] = useState(filters.category || '');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Data for stat cards
    const statCards = [
        {
            label: 'Total Supplier Aktif',
            value: stats.total_active,
            icon: 'solar:users-group-two-rounded-linear',
            iconBg: 'bg-[#E6E6E6]',
            iconColor: 'text-black',
            trend: '+8.2%',
            trendType: 'up',
        },
        {
            label: 'Supplier Baru Bulan Ini',
            value: `+${stats.new_this_month}`,
            icon: 'solar:add-circle-linear',
            iconBg: 'bg-[#E6E6E6]',
            iconColor: 'text-black',
            trend: 'Bertambah',
            trendType: 'up',
        },
        {
            label: 'Rata-rata Lead Time',
            value: `${stats.avg_lead_time} Hari`,
            icon: 'solar:clock-circle-linear',
            iconBg: 'bg-[#E6E6E6]',
            iconColor: 'text-black',
            trend: '-0.5 hari',
            trendType: 'down',
        },
        {
            label: 'Skor Performa Global',
            value: `${stats.avg_rating}/5.0`,
            icon: 'solar:ranking-linear',
            iconBg: 'bg-[#E6E6E6]',
            iconColor: 'text-black',
            trend: 'Stabil & Prima',
            trendType: 'up',
        }
    ];

    // Sync input search state if filters change from outside
    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/suppliers?search=${search}&status=${status}&category=${category}`);
    };

    const handleFilterReset = () => {
        setSearch('');
        setStatus('');
        setCategory('');
        navigate('/suppliers');
        setShowFilterModal(false);
    };

    const handleFilterApply = () => {
        navigate(`/suppliers?search=${search}&status=${status}&category=${category}`);
        setShowFilterModal(false);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(suppliers.data.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDelete = async (id, name) => {
        if (await confirm({
            title: 'Hapus Supplier?',
            message: `Apakah Anda yakin ingin menghapus supplier "${name}"? Semua data kontak dan PO terkait akan ikut terhapus.`,
            isDanger: true,
            confirmText: 'Hapus',
            cancelText: 'Batal'
        })) {
            try {
                await client.delete(`/suppliers/${id}`);
                if (window.routerReload) window.routerReload();
                setSelectedIds([]);
            } catch (err) {
                console.error("Gagal menghapus supplier:", err);
                alert("Gagal menghapus supplier.");
            }
        }
    };

    const getRelativeUrl = (url) => {
        if (!url) return '#';
        try {
            const parsed = new URL(url);
            return `/suppliers${parsed.search}`;
        } catch (e) {
            if (url.includes('?')) {
                return `/suppliers?${url.split('?')[1]}`;
            }
            return '/suppliers';
        }
    };

    const renderStars = (ratingVal) => {
        const rating = parseFloat(ratingVal) || 0;
        const stars = [];
        const floor = Math.floor(rating);
        const hasHalf = rating - floor >= 0.25 && rating - floor < 0.75;
        const hasFullCeil = rating - floor >= 0.75;

        for (let i = 1; i <= 5; i++) {
            if (i <= floor) {
                stars.push(<iconify-icon key={i} icon="solar:star-bold" class="text-amber-400 text-sm"></iconify-icon>);
            } else if (i === floor + 1 && hasHalf) {
                stars.push(<iconify-icon key={i} icon="solar:star-bold-duotone" class="text-amber-400 text-sm"></iconify-icon>);
            } else if (i === floor + 1 && hasFullCeil) {
                stars.push(<iconify-icon key={i} icon="solar:star-bold" class="text-amber-400 text-sm"></iconify-icon>);
            } else {
                stars.push(<iconify-icon key={i} icon="solar:star-linear" class="text-gray-300 text-sm"></iconify-icon>);
            }
        }
        return stars;
    };

    const getStatusBadge = (supStatus) => {
        switch (supStatus) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Aktif
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Nonaktif
                    </span>
                );
            case 'blacklist':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                        Blacklist
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200">
                        {supStatus}
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Daftar Supplier" />

            <div className="min-h-screen bg-[#E6E6E6]/30 p-4 md:p-6 lg:p-8">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* ── MAIN AREA ── */}
                        <div className="lg:col-span-9 space-y-6">

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-black to-[#333333]">
                                        Daftar Supplier
                                    </h1>
                                    <p className="text-xs sm:text-sm text-[#666666] font-normal mt-1">
                                        Kelola dan pantau seluruh mitra supplier aktif dalam satu dashboard.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <Link
                                        to="/suppliers/create"
                                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] rounded-xl transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                                    >
                                        <iconify-icon icon="solar:user-plus-linear" class="text-base"></iconify-icon>
                                        Tambah Supplier
                                    </Link>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                                {statCards.map((card) => {
                                    const isUp = card.trendType === 'up';
                                    return (
                                        <div key={card.label} className="bg-white p-5 rounded-2xl border border-brand-light shadow-level-1 stat-card-glow group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                                    <iconify-icon icon={card.icon} class={`text-2xl ${card.iconColor}`}></iconify-icon>
                                                </div>
                                                {card.trend && (
                                                    <span className={`inline-flex items-center gap-1 text-caption font-semibold px-2.5 py-1 rounded-full border ${isUp
                                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                        : 'bg-rose-50 border-rose-100 text-rose-600'
                                                        }`}>
                                                        <iconify-icon icon={isUp ? 'uil:arrow-growth' : 'streamline:graph-arrow-decrease-remix'} class="text-sm"></iconify-icon>
                                                        <span>{card.trend}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1">
                                                <p className="text-body-compact text-brand-primary/60 font-medium truncate">{card.label}</p>
                                                <p className="text-xl md:text-2xl font-extrabold mt-0.5 tracking-tight truncate text-black leading-tight">{card.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Table Control and Search Bar */}
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                                <div className="p-4 md:p-5 border-b border-[#E6E6E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                    {/* Left controls: search and filter trigger */}
                                    <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                                        <form onSubmit={handleSearch} className="relative flex-1 min-w-[240px]">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center">
                                                <iconify-icon icon="solar:magnifer-linear" class="text-lg"></iconify-icon>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Cari supplier..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all duration-200 hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 text-black font-normal"
                                            />
                                        </form>

                                        <button
                                            onClick={() => setShowFilterModal(!showFilterModal)}
                                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border rounded-xl transition-all duration-200 active:scale-[0.97] whitespace-nowrap ${showFilterModal || status || category ? 'bg-black text-[#BFFF00] border-black hover:bg-black/90' : 'bg-white border-[#D0D0D0] text-black hover:bg-[#E6E6E6]'}`}
                                        >
                                            <iconify-icon icon="solar:filter-linear" class="text-base"></iconify-icon>
                                            Filter
                                            {(status || category) && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#BFFF00]"></span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Right controls */}
                                    <div className="flex items-center gap-3">
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert('Fitur Unduh CSV sedang disiapkan.');
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                                        >
                                            <iconify-icon icon="solar:download-linear" class="text-base"></iconify-icon>
                                            Unduh CSV
                                        </a>
                                    </div>
                                </div>

                                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50/50 border-[#E6E6E6] transition-all duration-300 ease-in-out overflow-hidden ${showFilterModal
                                    ? 'max-h-[300px] opacity-100 p-5 border-b border-[#E6E6E6]'
                                    : 'max-h-0 opacity-0 p-0 border-b-0 border-transparent pointer-events-none'
                                    }`}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-[#666666]/60 capitalize tracking-wide">Status</label>
                                        <CustomSelect
                                            value={status}
                                            onChange={(val) => setStatus(val)}
                                            options={[
                                                { value: '', label: 'Semua Status' },
                                                { value: 'active', label: 'Aktif' },
                                                { value: 'inactive', label: 'Nonaktif' },
                                                { value: 'blacklist', label: 'Blacklist' }
                                            ]}
                                            placeholder="Semua Status"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-[#666666]/60 capitalize tracking-wide">Kategori</label>
                                        <CustomSelect
                                            value={category}
                                            onChange={(val) => setCategory(val)}
                                            options={[
                                                { value: '', label: 'Semua Kategori' },
                                                ...categories.map(cat => ({ value: cat, label: cat }))
                                            ]}
                                            placeholder="Semua Kategori"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button
                                            onClick={handleFilterApply}
                                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] rounded-xl transition-all duration-200 active:scale-[0.97]"
                                        >
                                            Terapkan
                                        </button>
                                        <button
                                            onClick={handleFilterReset}
                                            className="px-4 py-2.5 text-sm font-semibold text-black bg-white border border-[#D0D0D0] hover:bg-[#E6E6E6] rounded-xl transition-all duration-200 active:scale-[0.97]"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                {/* Supplier Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[900px]">
                                        <thead>
                                            <tr className="bg-[#E6E6E6]/20 border-b border-[#E6E6E6]">
                                                <th className="pl-6 pr-3 py-3 w-12 text-center">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedIds.length === suppliers.data.length && suppliers.data.length > 0}
                                                        className="rounded border-[#D0D0D0] focus:ring-2 focus:ring-[#BFFF00]/10 focus:border-[#BFFF00] transition-all"
                                                    />
                                                </th>
                                                {['Nama Supplier', 'Kategori', 'Kontak Utama', 'Lead Time', 'Rating', 'Status', 'Aksi'].map((h) => (
                                                    <th key={h} className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E6E6E6]/50">
                                            {suppliers.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-16 h-16 rounded-full bg-[#E6E6E6]/50 flex items-center justify-center">
                                                                <iconify-icon icon="solar:users-group-two-rounded-broken" class="text-3xl text-[#999999]"></iconify-icon>
                                                            </div>
                                                            <p className="text-sm font-semibold text-black">Tidak ada data supplier yang ditemukan.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : suppliers.data.map((supplier) => {
                                                const primaryContact = supplier.contacts?.find(c => c.is_primary) || supplier.contacts?.[0];
                                                return (
                                                    <tr
                                                        key={supplier.id}
                                                        onClick={() => navigate(`/suppliers/${supplier.id}`)}
                                                        className="hover:bg-[#E6E6E6]/30 active:bg-[#E6E6E6]/60 transition-all duration-200 cursor-pointer"
                                                    >
                                                        <td className="pl-6 pr-3 py-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.includes(supplier.id)}
                                                                onChange={() => handleSelectOne(supplier.id)}
                                                                className="rounded border-[#D0D0D0] focus:ring-2 focus:ring-[#BFFF00]/10 focus:border-[#BFFF00] transition-all"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Link
                                                                to={`/suppliers/${supplier.id}`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-[13px] font-medium text-[#000000] line-clamp-2 max-w-[200px] block"
                                                                title={supplier.name}
                                                            >
                                                                {supplier.name}
                                                            </Link>
                                                            <span className="text-[12px] font-semibold text-[#999999] font-mono mt-0.5 block">
                                                                {supplier.code || `SUP-${supplier.id + 1000}`}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-3 py-1 rounded-full bg-[#E6E6E6]/60 border border-[#D0D0D0] text-[11px] font-bold uppercase tracking-wide text-[#666666]">
                                                                {supplier.category || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-[13px] font-medium text-[#000000] truncate max-w-[140px]" title={primaryContact?.name || '-'}>
                                                                {primaryContact?.name || '-'}
                                                            </p>
                                                            <p className="text-[12px] text-[#666666] mt-0.5 truncate max-w-[140px]">
                                                                {primaryContact?.position || 'Finance Manager'}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 text-[13px] text-[#666666]">
                                                            {supplier.lead_time} Hari
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="flex items-center">
                                                                    {renderStars(supplier.rating)}
                                                                </div>
                                                                <span className="text-[12px] font-semibold text-[#999999]">
                                                                    {supplier.rating ? parseFloat(supplier.rating).toFixed(1) : '0.0'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(supplier.status)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Link
                                                                    to={`/suppliers/${supplier.id}/edit`}
                                                                    className="w-8 h-8 rounded-xl bg-transparent border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] flex items-center justify-center text-[#666666] hover:text-black active:scale-[0.97] transition-all"
                                                                    title="Edit"
                                                                >
                                                                    <iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(supplier.id, supplier.name)}
                                                                    className="w-8 h-8 rounded-xl bg-transparent border border-[#D0D0D0] hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center text-[#666666] hover:text-rose-600 active:scale-[0.97] transition-all"
                                                                    title="Hapus"
                                                                >
                                                                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {suppliers.links && suppliers.links.length > 3 && (
                                        <div className="px-6 py-4 border-t border-[#E6E6E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <p className="text-[12px] text-[#999999]">
                                                Menampilkan <span className="font-semibold text-[#000000]">{suppliers.from || 0}</span>–<span className="font-semibold text-[#000000]">{suppliers.to || 0}</span> dari <span className="font-semibold text-[#000000]">{suppliers.total || 0}</span> supplier
                                            </p>
                                            <div className="flex items-center gap-1">
                                                {suppliers.links.map((link) => {
                                                    if (link.label.includes('Previous')) {
                                                        return (
                                                            <Link
                                                                key={link.label}
                                                                to={getRelativeUrl(link.url)}
                                                                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-150 active:scale-[0.97] ${link.url ? 'bg-white border-[#D0D0D0] text-[#000000] hover:bg-[#E6E6E6]' : 'bg-[#E6E6E6] border-[#E6E6E6] text-[#999999] cursor-not-allowed pointer-events-none'}`}
                                                            >
                                                                <iconify-icon icon="solar:alt-arrow-left-linear" class="text-sm"></iconify-icon>
                                                            </Link>
                                                        );
                                                    }
                                                    if (link.label.includes('Next')) {
                                                        return (
                                                            <Link
                                                                key={link.label}
                                                                to={getRelativeUrl(link.url)}
                                                                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-150 active:scale-[0.97] ${link.url ? 'bg-white border-[#D0D0D0] text-[#000000] hover:bg-[#E6E6E6]' : 'bg-[#E6E6E6] border-[#E6E6E6] text-[#999999] cursor-not-allowed pointer-events-none'}`}
                                                            >
                                                                <iconify-icon icon="solar:alt-arrow-right-linear" class="text-sm"></iconify-icon>
                                                            </Link>
                                                        );
                                                    }
                                                    return (
                                                        <Link
                                                            key={link.label}
                                                            to={getRelativeUrl(link.url)}
                                                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-semibold border transition-all duration-150 active:scale-[0.97] ${link.active
                                                                ? 'bg-white border-[#D0D0D0] text-[#000000]'
                                                                : 'bg-[#E6E6E6] border-[#E6E6E6] text-[#999999] hover:bg-[#E6E6E6]/60'
                                                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── SIDEBAR AREA ── */}
                        <div className="lg:col-span-3 space-y-6">

                            {/* Aktivitas Terbaru */}
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-semibold text-[#666666] uppercase tracking-wider flex items-center gap-2">
                                        <iconify-icon icon="solar:document-text-linear" class="text-black text-lg"></iconify-icon>
                                        Aktivitas Terbaru
                                    </h4>
                                    <a href="#" className="group text-[11px] font-semibold text-black hover:text-black/70 transition-colors flex items-center gap-0.5">
                                        <span>Lihat Semua</span>
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                                <div className="space-y-4">
                                    {recent_activities.map((act) => (
                                        <div key={act.id} className="flex gap-3 text-xs text-left">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 text-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <iconify-icon icon="solar:bell-linear" class="text-xs"></iconify-icon>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[#666666] leading-normal font-normal text-xs">
                                                    <span className="font-semibold text-black">{act.user_name}</span> {act.description}
                                                </p>
                                                <span className="text-[10px] text-[#999999] block flex items-center gap-1 font-normal">
                                                    <iconify-icon icon="solar:clock-circle-linear" class="text-[11px]"></iconify-icon>
                                                    {act.time_diff}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips Admin Widget (Premium Dark Card) */}
                            <div className="bg-[#0E0E0E] rounded-2xl border border-black p-5 flex gap-3.5 text-left text-white shadow-lg">
                                <div className="text-[#BFFF00] mt-0.5 flex-shrink-0">
                                    <iconify-icon icon="solar:lightbulb-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-xs font-semibold text-[#BFFF00] uppercase tracking-wider">Tips Admin</h5>
                                    <p className="text-xs text-[#E6E6E6] leading-relaxed font-normal">
                                        Supplier dengan rating di bawah 3.0 akan otomatis masuk ke daftar tinjauan mingguan.
                                    </p>
                                </div>
                            </div>

                            {/* Aksi Cepat */}
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 space-y-4">
                                <h4 className="text-xs font-semibold text-[#666666] uppercase tracking-wider flex items-center gap-2">
                                    <iconify-icon icon="solar:bolt-linear" class="text-black text-lg"></iconify-icon>
                                    Aksi Cepat
                                </h4>
                                <div className="space-y-2.5">
                                    <Link
                                        to="/suppliers/create"
                                        className="w-full flex items-center justify-between px-4 py-3 border border-[#D0D0D0] hover:border-black hover:bg-neutral-50 rounded-xl text-left bg-white text-xs font-semibold text-black hover:text-black active:scale-[0.98] transition duration-150 hover:shadow-sm"
                                    >
                                        <span className="flex items-center gap-2">
                                            <iconify-icon icon="solar:add-circle-linear" class="text-base"></iconify-icon>
                                            Daftarkan Vendor Baru
                                        </span>
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs"></iconify-icon>
                                    </Link>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert('Laporan performa Q4 sedang dibuat...');
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 border border-[#D0D0D0] hover:border-black hover:bg-neutral-50 rounded-xl text-left bg-white text-xs font-semibold text-black hover:text-black active:scale-[0.98] transition duration-150 hover:shadow-sm"
                                    >
                                        <span className="flex items-center gap-2">
                                            <iconify-icon icon="solar:document-linear" class="text-base"></iconify-icon>
                                            Laporan Performa Q4
                                        </span>
                                        <iconify-icon icon="solar:download-linear" class="text-xs"></iconify-icon>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

