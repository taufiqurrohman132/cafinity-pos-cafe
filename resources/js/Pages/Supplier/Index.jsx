import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function SupplierIndex({ suppliers, filters, categories, stats, recent_activities }) {
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
        router.get(route('suppliers.index'), { search, status, category }, { preserveState: true, replace: true });
    };

    const handleFilterReset = () => {
        setSearch('');
        setStatus('');
        setCategory('');
        router.get(route('suppliers.index'), {}, { replace: true });
        setShowFilterModal(false);
    };

    const handleFilterApply = () => {
        router.get(route('suppliers.index'), { search, status, category }, { preserveState: true, replace: true });
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

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus supplier "${name}"? Semua data kontak dan PO terkait akan ikut terhapus.`)) {
            router.delete(route('suppliers.destroy', id), {
                onSuccess: () => setSelectedIds([]),
            });
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Aktif
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Nonaktif
                    </span>
                );
            case 'blacklist':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Blacklist
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200">
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
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">Daftar Supplier</h1>
                                    <p className="text-gray-500 mt-1.5 text-sm md:text-base">Kelola dan pantau seluruh mitra supplier aktif dalam satu dashboard.</p>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <Link 
                                        href={route('suppliers.create')}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95"
                                    >
                                        <iconify-icon icon="solar:user-plus-linear" class="text-lg"></iconify-icon>
                                        Tambah Supplier
                                    </Link>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                                {/* Total Active */}
                                <div className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex justify-between items-start hover:shadow-md transition-all duration-200">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Supplier Aktif</p>
                                        <h3 className="text-3xl font-black text-brand-dark mt-2">{stats.total_active}</h3>
                                        <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-0.5">
                                            <iconify-icon icon="solar:arrow-left-up-linear" class="rotate-45 text-sm font-bold"></iconify-icon>
                                            +8.2% <span className="text-gray-400 font-normal">vs bulan lalu</span>
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                        <iconify-icon icon="solar:users-group-two-rounded-linear" class="text-xl"></iconify-icon>
                                    </div>
                                </div>

                                {/* New Suppliers */}
                                <div className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex justify-between items-start hover:shadow-md transition-all duration-200">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Supplier Baru Bulan Ini</p>
                                        <h3 className="text-3xl font-black text-brand-dark mt-2">+{stats.new_this_month}</h3>
                                        <p className="text-xs text-brand-primary font-bold mt-2 flex items-center gap-0.5">
                                            <iconify-icon icon="solar:calendar-add-linear" class="text-sm"></iconify-icon>
                                            Aktif bertambah
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-brand-primary flex items-center justify-center">
                                        <iconify-icon icon="solar:add-circle-linear" class="text-xl"></iconify-icon>
                                    </div>
                                </div>

                                {/* Avg Lead Time */}
                                <div className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex justify-between items-start hover:shadow-md transition-all duration-200">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rata-rata Lead Time</p>
                                        <h3 className="text-3xl font-black text-brand-dark mt-2">{stats.avg_lead_time} Hari</h3>
                                        <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-0.5">
                                            <iconify-icon icon="solar:arrow-left-down-linear" class="rotate-45 text-sm"></iconify-icon>
                                            -0.5 hari <span className="text-gray-400 font-normal">vs bulan lalu</span>
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                        <iconify-icon icon="solar:clock-circle-linear" class="text-xl"></iconify-icon>
                                    </div>
                                </div>

                                {/* Global Performance Rating */}
                                <div className="bg-white p-5 rounded-2xl border border-brand-light/80 shadow-sm flex justify-between items-start hover:shadow-md transition-all duration-200">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skor Performa Global</p>
                                        <h3 className="text-3xl font-black text-brand-dark mt-2">{stats.avg_rating}/5.0</h3>
                                        <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-0.5">
                                            <iconify-icon icon="solar:graph-up-linear" class="text-sm"></iconify-icon>
                                            Stabil &amp; Prima
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <iconify-icon icon="solar:ranking-linear" class="text-xl"></iconify-icon>
                                    </div>
                                </div>
                            </div>

                            {/* Table Control and Search Bar */}
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm overflow-hidden">
                                <div className="p-4 md:p-5 border-b border-brand-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    
                                    {/* Left controls: search and filter trigger */}
                                    <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                                        <form onSubmit={handleSearch} className="relative flex-1 min-w-[240px]">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                <iconify-icon icon="solar:magnifer-linear" class="text-lg"></iconify-icon>
                                            </span>
                                            <input 
                                                type="text"
                                                placeholder="Cari supplier..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 hover:bg-gray-50 border border-brand-light/70 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                            />
                                        </form>
                                        
                                        <button 
                                            onClick={() => setShowFilterModal(!showFilterModal)}
                                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border rounded-xl transition-all ${
                                                showFilterModal || status || category
                                                    ? 'bg-brand-primary/5 border-brand-primary text-brand-primary'
                                                    : 'bg-white border-brand-light text-gray-700 hover:bg-gray-50'
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
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-brand-light rounded-xl hover:bg-gray-50 active:scale-95 transition"
                                        >
                                            <iconify-icon icon="solar:download-linear" class="text-base"></iconify-icon>
                                            Unduh CSV
                                        </a>
                                    </div>
                                </div>

                                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 border-brand-light transition-all duration-300 ease-in-out overflow-hidden ${
                                    showFilterModal 
                                        ? 'max-h-[300px] opacity-100 p-5 border-b border-brand-light/60' 
                                        : 'max-h-0 opacity-0 p-0 border-b-0 border-brand-light/0 pointer-events-none'
                                }`}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                        <select 
                                            value={status} 
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-white border border-brand-light rounded-xl focus:ring-brand-primary focus:border-brand-primary"
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Nonaktif</option>
                                            <option value="blacklist">Blacklist</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</label>
                                        <select 
                                            value={category} 
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-white border border-brand-light rounded-xl focus:ring-brand-primary focus:border-brand-primary"
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
                                            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-xl transition"
                                        >
                                            Terapkan
                                        </button>
                                        <button 
                                            onClick={handleFilterReset}
                                            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-brand-light rounded-xl hover:bg-gray-50 transition"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                {/* Supplier Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-brand-light/60">
                                                <th className="px-6 py-4 w-12 text-center">
                                                    <input 
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedIds.length === suppliers.data.length && suppliers.data.length > 0}
                                                        className="w-4 h-4 rounded text-brand-primary border-brand-light focus:ring-brand-primary"
                                                    />
                                                </th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Supplier</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kontak Utama</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Lead Time</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
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
                                                        <tr key={supplier.id} className="hover:bg-gray-50/30 transition-all group">
                                                            <td className="px-6 py-4 text-center">
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={selectedIds.includes(supplier.id)}
                                                                    onChange={() => handleSelectOne(supplier.id)}
                                                                    className="w-4 h-4 rounded text-brand-primary border-brand-light focus:ring-brand-primary"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <Link 
                                                                        href={route('suppliers.show', supplier.id)}
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
                                                                        href={route('suppliers.edit', supplier.id)}
                                                                        className="p-1.5 rounded-lg border border-brand-light text-gray-500 hover:text-brand-primary hover:border-brand-primary bg-white transition hover:shadow-sm"
                                                                    >
                                                                        <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon>
                                                                    </Link>
                                                                    <button 
                                                                        onClick={() => handleDelete(supplier.id, supplier.name)}
                                                                        className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 bg-white transition hover:shadow-sm"
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
                                </div>

                                {/* Pagination */}
                                {suppliers.links && suppliers.links.length > 3 && (
                                    <div className="px-6 py-4 border-t border-brand-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="text-xs text-gray-500">
                                            Menampilkan <span className="font-bold text-gray-700">{suppliers.from || 0}</span>-
                                            <span className="font-bold text-gray-700">{suppliers.to || 0}</span> dari <span className="font-bold text-gray-700">{suppliers.total || 0}</span> supplier
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {suppliers.links.map((link) => {
                                                if (link.label.includes('Previous')) {
                                                    return (
                                                        <Link 
                                                            key={link.label}
                                                            href={link.url || '#'}
                                                            disabled={!link.url}
                                                            className={`w-9 h-9 border border-brand-light rounded-xl flex items-center justify-center transition-all ${
                                                                link.url ? 'bg-white hover:bg-gray-50 text-gray-500 active:scale-95' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <iconify-icon icon="solar:alt-arrow-left-linear" class="text-sm"></iconify-icon>
                                                        </Link>
                                                    );
                                                }
                                                if (link.label.includes('Next')) {
                                                    return (
                                                        <Link 
                                                            key={link.label}
                                                            href={link.url || '#'}
                                                            disabled={!link.url}
                                                            className={`w-9 h-9 border border-brand-light rounded-xl flex items-center justify-center transition-all ${
                                                                link.url ? 'bg-white hover:bg-gray-50 text-gray-500 active:scale-95' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <iconify-icon icon="solar:alt-arrow-right-linear" class="text-sm"></iconify-icon>
                                                        </Link>
                                                    );
                                                }
                                                return (
                                                    <Link
                                                        key={link.label}
                                                        href={link.url || '#'}
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                                                            link.active
                                                                ? 'bg-brand-primary text-white shadow'
                                                                : 'bg-white border border-brand-light text-gray-600 hover:bg-gray-50 active:scale-95'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── SIDEBAR AREA ── */}
                        <div className="lg:col-span-3 space-y-6">
                            
                            {/* Aktivitas Terbaru */}
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-extrabold text-brand-dark text-sm md:text-base flex items-center gap-2">
                                        <iconify-icon icon="solar:document-text-linear" class="text-lg text-brand-primary"></iconify-icon>
                                        Aktivitas Terbaru
                                    </h4>
                                    <a href="#" className="text-xs font-bold text-brand-primary hover:underline">Lihat Semua</a>
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
                                    <h5 className="text-xs font-black text-brand-primary uppercase tracking-wider">Tips Admin</h5>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                        Supplier dengan rating di bawah 3.0 akan otomatis masuk ke daftar tinjauan mingguan.
                                    </p>
                                </div>
                            </div>

                            {/* Aksi Cepat */}
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                                <h4 className="font-extrabold text-brand-dark text-xs uppercase tracking-wider">Aksi Cepat</h4>
                                <div className="space-y-2.5">
                                    <Link 
                                        href={route('suppliers.create')}
                                        className="w-full flex items-center justify-between px-4 py-3 border border-brand-light hover:border-brand-primary rounded-xl text-left bg-white text-xs font-bold text-gray-700 hover:text-brand-primary transition duration-150 hover:shadow-sm"
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
                                        className="w-full flex items-center justify-between px-4 py-3 border border-brand-light hover:border-brand-primary rounded-xl text-left bg-white text-xs font-bold text-gray-700 hover:text-brand-primary transition duration-150 hover:shadow-sm"
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

SupplierIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
