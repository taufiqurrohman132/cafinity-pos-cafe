import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';

export default function SupplierIndex({ suppliers, filters, categories, stats, recent_activities }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [category, setCategory] = useState(filters.category || '');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);

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
        if (confirm(`Apakah Anda yakin ingin menghapus supplier "${name}"? Semua data kontak dan PO terkait akan ikut terhapus.`)) {
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-500 bg-emerald-50 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Aktif
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Nonaktif
                    </span>
                );
            case 'blacklist':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Blacklist
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100">
                        {supStatus}
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Daftar Supplier" />

            <div className="min-h-screen bg-brand-bg">
                <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* ── MAIN AREA ── */}
                        <div className="lg:col-span-9 space-y-6">

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">Daftar Supplier</h1>
                                    <p className="text-xs md:text-sm text-brand-primary/60 font-medium mt-1">Kelola dan pantau seluruh mitra supplier aktif dalam satu dashboard.</p>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <Link
                                        to="/suppliers/create"
                                        className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary rounded-xl transition-all duration-200 shadow-lg shadow-brand-primary/30 active:scale-[0.98] whitespace-nowrap"
                                    >
                                        <iconify-icon icon="solar:user-plus-linear" class="text-base"></iconify-icon>
                                        Tambah Supplier
                                    </Link>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                                {[
                                    {
                                        label: 'Total Supplier Aktif',
                                        value: stats.total_active,
                                        sub: (
                                            <span className="flex items-center gap-0.5">
                                                <iconify-icon icon="solar:arrow-left-up-linear" class="rotate-45 text-sm font-bold"></iconify-icon>
                                                +8.2% <span className="text-gray-400 font-normal">vs bulan lalu</span>
                                            </span>
                                        ),
                                        subColor: 'text-emerald-500',
                                        icon: 'solar:users-group-two-rounded-linear',
                                        iconBg: 'bg-brand-light text-brand-primary',
                                    },
                                    {
                                        label: 'Supplier Baru Bulan Ini',
                                        value: `+${stats.new_this_month}`,
                                        sub: (
                                            <span className="flex items-center gap-1">
                                                <iconify-icon icon="solar:calendar-add-linear" class="text-sm"></iconify-icon>
                                                Aktif bertambah
                                            </span>
                                        ),
                                        subColor: 'text-brand-primary',
                                        icon: 'solar:add-circle-linear',
                                        iconBg: 'bg-brand-light text-brand-secondary',
                                    },
                                    {
                                        label: 'Rata-rata Lead Time',
                                        value: `${stats.avg_lead_time} Hari`,
                                        sub: (
                                            <span className="flex items-center gap-0.5">
                                                <iconify-icon icon="solar:arrow-left-down-linear" class="rotate-45 text-sm"></iconify-icon>
                                                -0.5 hari <span className="text-gray-400 font-normal">vs bulan lalu</span>
                                            </span>
                                        ),
                                        subColor: 'text-rose-500',
                                        icon: 'solar:clock-circle-linear',
                                        iconBg: 'bg-amber-50 text-amber-500',
                                    },
                                    {
                                        label: 'Skor Performa Global',
                                        value: `${stats.avg_rating}/5.0`,
                                        sub: (
                                            <span className="flex items-center gap-1">
                                                <iconify-icon icon="solar:graph-up-linear" class="text-sm"></iconify-icon>
                                                Stabil &amp; Prima
                                            </span>
                                        ),
                                        subColor: 'text-emerald-500',
                                        icon: 'solar:ranking-linear',
                                        iconBg: 'bg-emerald-50 text-emerald-500',
                                    },
                                ].map((card) => (
                                    <div key={card.label} className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-semibold text-brand-primary/70 capitalize tracking-wide">{card.label}</p>
                                                <h3 className="text-2xl font-black text-brand-dark mt-3">{card.value}</h3>
                                                <p className={`text-xs font-bold mt-3 ${card.subColor}`}>{card.sub}</p>
                                            </div>
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm ${card.iconBg}`}>
                                                <iconify-icon icon={card.icon} class="text-xl"></iconify-icon>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Table Control and Search Bar */}
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm overflow-hidden">
                                <div className="p-4 md:p-5 border-b border-brand-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                    {/* Left controls: search and filter trigger */}
                                    <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                                        <form onSubmit={handleSearch} className="relative flex-1 min-w-[240px]">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary/50 flex items-center justify-center">
                                                <iconify-icon icon="solar:magnifer-linear" class="text-lg"></iconify-icon>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Cari supplier..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full h-11 pl-10 pr-4 text-[13px] bg-brand-bg border border-brand-light rounded-xl placeholder-brand-primary/50 outline-none focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all duration-200 shadow-sm font-semibold text-brand-dark"
                                            />
                                        </form>

                                        <button
                                            onClick={() => setShowFilterModal(!showFilterModal)}
                                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border rounded-xl transition-all duration-200 active:scale-[0.98] whitespace-nowrap ${showFilterModal || status || category
                                                    ? 'bg-brand-light text-brand-dark border-brand-primary'
                                                    : 'bg-white border-brand-light text-brand-primary hover:bg-brand-light hover:text-brand-dark'
                                                }`}
                                        >
                                            <iconify-icon icon="solar:filter-linear" class="text-base"></iconify-icon>
                                            Filter
                                            {(status || category) && (
                                                <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
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
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-brand-primary bg-white border border-brand-light rounded-xl hover:bg-brand-light hover:text-brand-dark transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                                        >
                                            <iconify-icon icon="solar:download-linear" class="text-base"></iconify-icon>
                                            Unduh CSV
                                        </a>
                                    </div>
                                </div>

                                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 border-brand-light transition-all duration-300 ease-in-out overflow-hidden ${showFilterModal
                                        ? 'max-h-[300px] opacity-100 p-5 border-b border-brand-light/60'
                                        : 'max-h-0 opacity-0 p-0 border-b-0 border-brand-light/0 pointer-events-none'
                                    }`}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-brand-primary/60 capitalize tracking-wide">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full px-3 py-2.5 text-xs border border-brand-light rounded-xl focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary bg-brand-bg transition-all outline-none font-semibold text-brand-dark"
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Nonaktif</option>
                                            <option value="blacklist">Blacklist</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-brand-primary/60 capitalize tracking-wide">Kategori</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-3 py-2.5 text-xs border border-brand-light rounded-xl focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary bg-brand-bg transition-all outline-none font-semibold text-brand-dark"
                                        >
                                            <option value="">Semua Kategori</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button
                                            onClick={handleFilterApply}
                                            className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary rounded-xl transition-all duration-200 active:scale-[0.98]"
                                        >
                                            Terapkan
                                        </button>
                                        <button
                                            onClick={handleFilterReset}
                                            className="px-4 py-2.5 text-xs font-bold text-brand-primary bg-white border border-brand-light rounded-xl hover:bg-brand-light hover:text-brand-dark transition-all duration-200 active:scale-[0.98]"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                {/* Supplier Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-xs font-extrabold text-brand-primary/60 bg-brand-bg border-b border-brand-light tracking-wider text-[11px] uppercase">
                                                <th className="px-6 py-3.5 w-12 text-center">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedIds.length === suppliers.data.length && suppliers.data.length > 0}
                                                        className="rounded border-brand-light text-brand-primary focus:ring-4 focus:ring-brand-light/50 focus:ring-offset-0 focus:border-brand-secondary transition-all"
                                                    />
                                                </th>
                                                <th className="px-6 py-3.5">Nama Supplier</th>
                                                <th className="px-6 py-3.5">Kategori</th>
                                                <th className="px-6 py-3.5">Kontak Utama</th>
                                                <th className="px-6 py-3.5">Lead Time</th>
                                                <th className="px-6 py-3.5">Rating</th>
                                                <th className="px-6 py-3.5">Status</th>
                                                <th className="px-6 py-3.5 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-light/40">
                                            {suppliers.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                                        <iconify-icon icon="solar:users-group-two-rounded-broken" class="text-4xl text-gray-300 mb-2"></iconify-icon>
                                                        <p className="text-sm font-medium">Tidak ada data supplier yang ditemukan.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                suppliers.data.map((supplier) => {
                                                    const primaryContact = supplier.contacts?.find(c => c.is_primary) || supplier.contacts?.[0];
                                                    return (
                                                        <tr key={supplier.id} className="hover:bg-gradient-to-r hover:from-brand-light/40 hover:to-transparent transition-all cursor-pointer group">
                                                            <td className="px-6 py-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedIds.includes(supplier.id)}
                                                                    onChange={() => handleSelectOne(supplier.id)}
                                                                    className="rounded border-brand-light text-brand-primary focus:ring-4 focus:ring-brand-light/50 focus:ring-offset-0 focus:border-brand-secondary transition-all"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <Link
                                                                        to={`/suppliers/${supplier.id}`}
                                                                        className="font-bold text-brand-primary hover:text-brand-secondary hover:underline text-sm md:text-base transition-colors"
                                                                    >
                                                                        {supplier.name}
                                                                    </Link>
                                                                    <span className="text-xs text-gray-400 font-mono mt-0.5">{supplier.code || `SUP-${supplier.id + 1000}`}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm font-semibold text-gray-600">{supplier.category || '-'}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-brand-dark">{primaryContact?.name || '-'}</span>
                                                                    <span className="text-xs text-gray-400 mt-0.5">{primaryContact?.position || 'Finance Manager'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm font-bold text-brand-dark">{supplier.lead_time} Hari</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="flex items-center">
                                                                        {renderStars(supplier.rating)}
                                                                    </div>
                                                                    <span className="text-xs font-bold text-gray-500 mt-0.5">{supplier.rating ? parseFloat(supplier.rating).toFixed(1) : '0.0'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {getStatusBadge(supplier.status)}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Link
                                                                        to={`/suppliers/${supplier.id}/edit`}
                                                                        className="w-8 h-8 rounded-xl bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:shadow-sm active:scale-90 transition-all duration-150"
                                                                    >
                                                                        <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon>
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(supplier.id, supplier.name)}
                                                                        className="w-8 h-8 rounded-xl bg-white border border-red-100 flex items-center justify-center text-red-500 hover:text-red-600 hover:border-red-300 hover:shadow-sm active:scale-90 transition-all duration-150"
                                                                    >
                                                                        <iconify-icon icon="solar:trash-bin-trash-linear" class="text-sm"></iconify-icon>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {suppliers.links && suppliers.links.length > 3 && (
                                        <div className="px-6 py-4 border-t border-brand-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="text-xs text-gray-500 font-medium">
                                                Menampilkan <span className="font-bold text-gray-700">{suppliers.from || 0}</span>-
                                                <span className="font-bold text-gray-700">{suppliers.to || 0}</span> dari <span className="font-bold text-gray-700">{suppliers.total || 0}</span> supplier
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {suppliers.links.map((link) => {
                                                    if (link.label.includes('Previous')) {
                                                        return (
                                                            <Link
                                                                key={link.label}
                                                                to={getRelativeUrl(link.url)}
                                                                className={`w-9 h-9 border border-brand-light rounded-xl flex items-center justify-center transition-all duration-150 ${link.url ? 'bg-white hover:bg-brand-light hover:text-brand-dark text-brand-primary active:scale-95' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
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
                                                                className={`w-9 h-9 border border-brand-light rounded-xl flex items-center justify-center transition-all duration-150 ${link.url ? 'bg-white hover:bg-brand-light hover:text-brand-dark text-brand-primary active:scale-95' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                                            >
                                                                <iconify-icon icon="solar:alt-arrow-right-linear" class="text-sm"></iconify-icon>
                                                            </Link>
                                                        );
                                                    }
                                                    return (
                                                        <Link
                                                            key={link.label}
                                                            to={getRelativeUrl(link.url)}
                                                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-150 ${link.active
                                                                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20'
                                                                    : 'bg-white border border-brand-light text-brand-primary hover:bg-brand-light hover:text-brand-dark active:scale-95'
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
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-gray-400 capitalize tracking-wider flex items-center gap-2">
                                        <iconify-icon icon="solar:document-text-linear" class="text-brand-primary text-lg"></iconify-icon>
                                        Aktivitas Terbaru
                                    </h4>
                                    <a href="#" className="text-[11px] font-semibold text-brand-primary hover:underline">Lihat Semua</a>
                                </div>
                                <div className="space-y-4">
                                    {recent_activities.map((act) => (
                                        <div key={act.id} className="flex gap-3 text-xs">
                                            <div className="w-6 h-6 rounded-full bg-violet-100 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <iconify-icon icon="solar:bell-linear" class="text-xs"></iconify-icon>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-600 leading-normal">
                                                    <span className="font-bold text-brand-dark">{act.user_name}</span> {act.description}
                                                </p>
                                                <span className="text-[10px] text-gray-400 block flex items-center gap-1">
                                                    <iconify-icon icon="solar:clock-circle-linear" class="text-[11px]"></iconify-icon>
                                                    {act.time_diff}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips Admin Widget */}
                            <div className="bg-gradient-to-br from-brand-primary/5 to-violet-50 rounded-2xl border border-brand-primary/10 p-5 flex gap-3.5">
                                <div className="text-amber-500 mt-0.5 flex-shrink-0">
                                    <iconify-icon icon="solar:lightbulb-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-xs font-black text-brand-primary capitalize tracking-wide">Tips Admin</h5>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        Supplier dengan rating di bawah 3.0 akan otomatis masuk ke daftar tinjauan mingguan.
                                    </p>
                                </div>
                            </div>

                            {/* Aksi Cepat */}
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 capitalize tracking-wider flex items-center gap-2">
                                    <iconify-icon icon="solar:bolt-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Aksi Cepat
                                </h4>
                                <div className="space-y-2.5">
                                    <Link
                                        to="/suppliers/create"
                                        className="w-full flex items-center justify-between px-4 py-3 border border-brand-light hover:border-brand-primary hover:bg-brand-light/20 rounded-xl text-left bg-white text-xs font-bold text-gray-700 hover:text-brand-primary active:scale-[0.98] transition duration-150 hover:shadow-sm"
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
                                        className="w-full flex items-center justify-between px-4 py-3 border border-brand-light hover:border-brand-primary hover:bg-brand-light/20 rounded-xl text-left bg-white text-xs font-bold text-gray-700 hover:text-brand-primary active:scale-[0.98] transition duration-150 hover:shadow-sm"
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
