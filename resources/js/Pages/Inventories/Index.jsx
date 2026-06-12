// Inventories/Index.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Head from '@/Components/Head'
import client from '@/api/client'
import InventoriesSkeleton from '@/Components/Skeletons/InventoriesSkeleton'

export default function InventoriesIndex() {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)

    const [inventories, setInventories] = useState(null)
    const [totalValue, setTotalValue] = useState(0)
    const [lowStockCount, setLowStockCount] = useState(0)
    const [restockCount, setRestockCount] = useState(0)
    const [recentLogs, setRecentLogs] = useState([])
    const [criticalItem, setCriticalItem] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [showAdjustModal, setShowAdjustModal] = useState(false)
    const [showOpnameModal, setShowOpnameModal] = useState(false)

    const [search, setSearch] = useState(queryParams.get('search') || '')
    const status = queryParams.get('status') || ''
    const categoryId = queryParams.get('category_id') || ''

    // Fetch data whenever location.search or refreshTrigger changes
    useEffect(() => {
        const fetchInventories = async () => {
            setLoading(true)
            try {
                setError(null)
                const res = await client.get(`/inventories${location.search}`)
                setInventories(res.data.inventories)
                setTotalValue(res.data.totalValue)
                setLowStockCount(res.data.lowStockCount)
                setRestockCount(res.data.restockCount)
                setRecentLogs(res.data.recentLogs)
                setCriticalItem(res.data.criticalItem)
                setCategories(res.data.categories || [])

                const qParams = new URLSearchParams(location.search)
                setSearch(qParams.get('search') || '')
            } catch (err) {
                console.error("Gagal mengambil data inventaris:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchInventories()
    }, [location.search, refreshTrigger])

    function handleSearch(e) {
        e.preventDefault()
        const qParams = new URLSearchParams(location.search)
        if (search) {
            qParams.set('search', search)
        } else {
            qParams.delete('search')
        }
        qParams.delete('page') // Reset page on new search
        navigate(`/inventories?${qParams.toString()}`, { replace: true })
    }

    function handleStatus(e) {
        const val = e.target.value
        const qParams = new URLSearchParams(location.search)
        if (val) {
            qParams.set('status', val)
        } else {
            qParams.delete('status')
        }
        qParams.delete('page') // Reset page on status change
        navigate(`/inventories?${qParams.toString()}`, { replace: true })
    }

    function handleCategoryChange(e) {
        const val = e.target.value
        const qParams = new URLSearchParams(location.search)
        if (val) {
            qParams.set('category_id', val)
        } else {
            qParams.delete('category_id')
        }
        qParams.delete('page') // Reset page on category change
        navigate(`/inventories?${qParams.toString()}`, { replace: true })
    }

    async function handleDelete(id, name) {
        if (!confirm(`Hapus ${name}?`)) return
        try {
            await client.delete(`/inventories/${id}`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menghapus bahan baku:", err)
            alert("Gagal menghapus bahan baku.")
        }
    }

    const getRelativeUrl = (url) => {
        if (!url) return '#'
        try {
            const parsed = new URL(url)
            return `/inventories${parsed.search}`
        } catch (e) {
            if (url.includes('?')) {
                return `/inventories?${url.split('?')[1]}`
            }
            return '/inventories'
        }
    }

    // Handler unduh laporan stok via blob
    const handleDownloadReport = async (e) => {
        e.preventDefault()
        try {
            const response = await client.get('/reports/inventory', {
                responseType: 'blob',
            })
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }))
            window.open(url, '_blank')
        } catch (err) {
            console.error("Gagal mengunduh laporan stok:", err)
        }
    }

    if (loading && !inventories) {
        return (
            <>
                <Head title="Manajemen Inventaris" />
                <InventoriesSkeleton />
            </>
        )
    }

    if (error && !inventories) {
        return (
            <>
                <Head title="Manajemen Inventaris" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data inventaris dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        )
    }

    function getStockMeta(item) {
        const percent = item.min_stock > 0 ? Math.min(100, Math.round((item.stock / item.min_stock) * 100)) : 100
        const color =
            item.stock === 0 ? 'red'
                : item.stock <= item.min_stock ? 'orange'
                    : percent <= 75 ? 'yellow'
                        : 'blue'
        const label = { red: 'Habis', orange: 'Kritis', yellow: 'Menipis', blue: 'Aman' }[color]
        const badgeCls = {
            blue: 'bg-brand-light text-brand-primary',
            yellow: 'bg-yellow-100 text-yellow-700',
            orange: 'bg-orange-100 text-orange-600',
            red: 'bg-red-100 text-red-600',
        }[color]
        const barCls = {
            blue: 'bg-brand-primary',
            yellow: 'bg-yellow-400',
            orange: 'bg-orange-400',
            red: 'bg-red-400',
        }[color]
        return { percent, label, badgeCls, barCls }
    }

    return (
        <>
            <Head title="Manajemen Inventaris" />

            <div className="min-h-screen bg-brand-bg">
                <div className="grid grid-cols-1 xl:grid-cols-12">

                    {/* ── MAIN ── */}
                    <div className="xl:col-span-9 p-4 md:p-6 space-y-6">

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">Manajemen Inventaris</h1>
                                <p className="text-gray-500 text-sm mt-1">Lacak dan kelola stok bahan baku operasional kafe Anda secara real-time.</p>
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <Link
                                    to="/inventories/create"
                                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30 active:scale-[0.98]"
                                >
                                    <iconify-icon icon="solar:add-circle-linear" class="text-lg"></iconify-icon>
                                    Tambah Bahan
                                </Link>
                            </div>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                {
                                    label: 'Total Nilai Inventaris',
                                    value: `Rp ${totalValue.toLocaleString('id-ID')}`,
                                    sub: 'Nilai stok keseluruhan',
                                    subColor: 'text-green-500',
                                    icon: 'solar:box-linear',
                                    iconBg: 'bg-brand-light text-brand-primary',
                                },
                                {
                                    label: 'Peringatan Stok Rendah',
                                    value: `${lowStockCount} Item`,
                                    sub: 'Perlu segera dipesan',
                                    subColor: 'text-red-500',
                                    icon: 'solar:danger-triangle-linear',
                                    iconBg: 'bg-orange-100 text-orange-500',
                                },
                                {
                                    label: 'Saran Restock',
                                    value: `${restockCount} Item`,
                                    sub: 'Berdasarkan batas minimum stok',
                                    subColor: 'text-gray-400',
                                    icon: 'solar:graph-up-linear',
                                    iconBg: 'bg-brand-light text-brand-primary',
                                },
                            ].map((card) => (
                                <div key={card.label} className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500">{card.label}</p>
                                            <h2 className="text-2xl font-bold text-brand-dark mt-3">{card.value}</h2>
                                            <p className={`text-xs font-semibold mt-3 ${card.subColor}`}>{card.sub}</p>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm ${card.iconBg}`}>
                                            <iconify-icon icon={card.icon} class="text-xl"></iconify-icon>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Card */}
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">

                            {/* Table Header */}
                            <div className="px-6 py-5 border-b border-brand-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <h3 className="font-bold text-brand-dark">Daftar Bahan Baku</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    <select
                                        value={categoryId}
                                        onChange={handleCategoryChange}
                                        className="h-10 px-4 text-xs font-semibold text-gray-700 bg-brand-bg border border-brand-light rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-light"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={status}
                                        onChange={handleStatus}
                                        className="h-10 px-4 text-xs font-semibold text-gray-700 bg-brand-bg border border-brand-light rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-light"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="safe">Aman</option>
                                        <option value="low">Stok Rendah</option>
                                        <option value="empty">Habis</option>
                                    </select>
                                    <form onSubmit={handleSearch}>
                                        <div className="relative">
                                            <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></iconify-icon>
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Cari bahan..."
                                                className="w-full lg:w-64 h-10 pl-9 pr-4 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light"
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className={`transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[800px]">
                                        <thead>
                                            <tr className="text-xs font-medium text-gray-400 bg-brand-bg border-b border-brand-light">
                                                {['Nama Bahan', 'Kategori', 'Stok Saat Ini', 'Satuan', 'Harga/Satuan', 'Status', 'Aksi'].map((h) => (
                                                    <th key={h} className="px-6 py-3">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-brand-light">
                                            {inventories.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <iconify-icon icon="solar:box-linear" class="text-4xl text-brand-secondary"></iconify-icon>
                                                            <p>Belum ada data inventaris.</p>
                                                            <Link to="/inventories/create" className="text-brand-primary hover:text-brand-secondary font-bold text-xs flex items-center gap-1.5 transition-colors">
                                                                <iconify-icon icon="solar:add-circle-linear" class="text-sm"></iconify-icon>
                                                                Tambah bahan pertama
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : inventories.data.map((item) => {
                                                const { percent, label, badgeCls, barCls } = getStockMeta(item)
                                                return (
                                                    <tr key={item.id} className="hover:bg-brand-bg transition">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-brand-light text-brand-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                                                                    {item.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <p className="font-semibold text-brand-dark">{item.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2.5 py-1 rounded-full bg-brand-bg border border-brand-light text-gray-600 text-xs font-medium">
                                                                {item.category?.name ?? '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <span className="font-semibold text-brand-dark">{item.stock} / {item.min_stock}</span>
                                                                    <span className="text-gray-400">{percent}%</span>
                                                                </div>
                                                                <div className="w-28 h-1.5 rounded-full bg-brand-light overflow-hidden">
                                                                    <div className={`h-full rounded-full ${barCls}`} style={{ width: `${percent}%` }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                                                        <td className="px-6 py-4 font-semibold text-brand-dark">
                                                            Rp {Number(item.price_per_unit).toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeCls}`}>{label}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <InventoryActions item={item} onDelete={handleDelete} />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Table Footer */}
                                <div className="px-6 py-4 border-t border-brand-light flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                    <p className="text-xs text-gray-400">
                                        Menampilkan {inventories.from ?? 0}–{inventories.to ?? 0} dari {inventories.total} jenis bahan baku
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button onClick={handleDownloadReport} className="text-xs font-semibold text-gray-500 hover:text-brand-primary transition">
                                            Unduh Laporan Stok
                                        </button>
                                        {/* Pagination */}
                                        <div className="flex items-center gap-1">
                                            {inventories.links?.map((link, i) => (
                                                <Link
                                                    key={i}
                                                    to={getRelativeUrl(link.url)}
                                                    className={`px-3 py-1 text-xs rounded-lg border transition ${link.active
                                                            ? 'bg-brand-primary text-white border-brand-primary'
                                                            : 'border-brand-light text-gray-500 hover:border-brand-primary hover:text-brand-primary'
                                                        } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SIDEBAR ── */}
                    <div className="xl:col-span-3 border-l border-brand-light bg-white p-4 md:p-6 space-y-6">

                        {/* Aksi Cepat */}
                        <div>
                            <h3 className="text-[10px] font-extrabold text-brand-primary/60 capitalize tracking-widest mb-3">Aksi Cepat</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowAdjustModal(true)}
                                    className="w-full bg-brand-primary hover:bg-brand-secondary transition rounded-2xl p-4 text-left text-white flex items-center gap-3 active:scale-[0.98] shadow-sm cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0 text-xl">
                                        <iconify-icon icon="solar:restart-linear"></iconify-icon>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">Penyesuaian Stok</h4>
                                        <p className="text-xs text-brand-light/95 mt-0.5">Input stok masuk/keluar manual</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setShowOpnameModal(true)}
                                    className="w-full bg-white border border-brand-light hover:border-brand-primary hover:bg-brand-bg transition rounded-2xl p-4 text-left flex items-center gap-3 active:scale-[0.98] shadow-sm cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-brand-light/40 text-brand-primary flex items-center justify-center flex-shrink-0 text-xl">
                                        <iconify-icon icon="solar:clipboard-check-linear"></iconify-icon>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-dark">Stock Opname</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Audit fisik vs sistem mingguan</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Log Aktivitas */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold text-gray-400 capitalize tracking-wider">Log Aktivitas</h3>
                                <Link to="/inventories" className="text-xs font-semibold text-brand-primary hover:text-brand-secondary">Semua</Link>
                            </div>
                            <div className="space-y-4">
                                {recentLogs.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">Belum ada aktivitas.</p>
                                ) : recentLogs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-brand-primary pl-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-xs font-bold text-brand-dark">
                                                {log.type.charAt(0).toUpperCase() + log.type.slice(1)} — {log.inventory?.name}
                                            </p>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{log.created_at_diff}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{log.notes ?? '-'} oleh {log.user?.name ?? 'Sistem'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-brand-light border border-brand-light rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-brand-bg flex items-center justify-center text-brand-primary flex-shrink-0">
                                    <iconify-icon icon="solar:lightbulb-linear" class="text-lg"></iconify-icon>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-brand-dark mb-1">Tips Efisiensi</h4>
                                    {criticalItem ? (
                                        <>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                <strong>{criticalItem.name}</strong> hampir habis (sisa {criticalItem.stock} {criticalItem.unit}). Segera lakukan restock sebelum kehabisan.
                                            </p>
                                            <Link to={`/inventories/${criticalItem.id}`} className="inline-block mt-2 text-xs font-semibold text-brand-primary hover:underline">
                                                Lihat Detail →
                                            </Link>
                                        </>
                                    ) : (
                                        <p className="text-xs text-gray-600 leading-relaxed">Semua stok dalam kondisi aman. Pantau terus secara berkala.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-brand-light bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    <p className="text-[10px] text-gray-400">© 2024 Smart Cafe POS v2.4.0</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" /> System Online
                        </span>
                        <span>Support ID: #POS-8821</span>
                    </div>
                </div>
            </div>

            <AdjustStockModal
                isOpen={showAdjustModal}
                onClose={() => setShowAdjustModal(false)}
                items={inventories?.data || []}
                onSaveSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />

            <StockOpnameModal
                isOpen={showOpnameModal}
                onClose={() => setShowOpnameModal(false)}
                items={inventories?.data || []}
                onSaveSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />
        </>
    )
}

// ── Modals Components ──────────────────────────────────────────

function AdjustStockModal({ isOpen, onClose, items, onSaveSuccess }) {
    const [selectedId, setSelectedId] = useState('');
    const [qty, setQty] = useState('');
    const [type, setType] = useState('restock');
    const [direction, setDirection] = useState('in');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (type === 'waste') {
            setDirection('out');
        } else if (type === 'restock') {
            setDirection('in');
        }
    }, [type]);

    useEffect(() => {
        if (isOpen && items.length > 0) {
            setSelectedId(items[0].id);
        }
    }, [isOpen, items]);

    const selectedItem = items.find(i => i.id === Number(selectedId));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedId) return;
        if (!qty || parseFloat(qty) <= 0) {
            alert('Kuantitas penyesuaian harus lebih besar dari 0.');
            return;
        }
        setProcessing(true);
        try {
            await client.post(`/inventories/${selectedId}/adjust`, {
                qty: parseFloat(qty),
                type,
                direction,
                notes
            });
            setQty('');
            setNotes('');
            setType('restock');
            setDirection('in');
            onSaveSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan penyesuaian stok.');
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl border border-brand-light shadow-2xl w-full max-w-md mx-4 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-brand-light">
                    <h3 className="font-bold text-brand-dark flex items-center gap-2">
                        <iconify-icon icon="solar:restart-linear" class="text-brand-secondary text-lg"></iconify-icon>
                        Penyesuaian Stok Cepat
                    </h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <iconify-icon icon="solar:close-circle-linear" class="text-xl"></iconify-icon>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Bahan Baku</label>
                        <select
                            value={selectedId}
                            onChange={e => setSelectedId(e.target.value)}
                            className="w-full h-11 px-4 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            {items.map(item => (
                                <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-brand-dark mb-1.5">Jenis</label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full h-11 px-3 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            >
                                <option value="restock">Restock</option>
                                <option value="adjustment">Koreksi</option>
                                <option value="waste">Waste</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-dark mb-1.5">Arah Stok</label>
                            <select
                                value={direction}
                                onChange={e => setDirection(e.target.value)}
                                disabled={type === 'waste'}
                                className="w-full h-11 px-3 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
                            >
                                <option value="in">Masuk (+)</option>
                                <option value="out">Keluar (-)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Jumlah {selectedItem ? `(${selectedItem.unit})` : ''}
                        </label>
                        <input
                            type="number"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                            placeholder="Kuantitas..."
                            min="0.01" step="0.01" required
                            className="w-full h-11 px-4 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary font-semibold text-brand-dark"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Keterangan</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Catatan penyesuaian..."
                            rows="2"
                            className="w-full p-3 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-brand-primary hover:bg-brand-secondary transition disabled:opacity-50 active:scale-[0.98]"
                    >
                        {processing ? 'Memproses...' : 'Simpan Penyesuaian'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function StockOpnameModal({ isOpen, onClose, items, onSaveSuccess }) {
    const [selectedId, setSelectedId] = useState('');
    const [physicalStock, setPhysicalStock] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isOpen && items.length > 0) {
            setSelectedId(items[0].id);
        }
    }, [isOpen, items]);

    const selectedItem = items.find(i => i.id === Number(selectedId));
    const systemStock = selectedItem ? parseFloat(selectedItem.stock) : 0;
    const physicalVal = physicalStock !== '' ? parseFloat(physicalStock) : systemStock;
    const difference = physicalVal - systemStock;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedId) return;
        if (physicalStock === '') {
            alert('Masukkan stok fisik.');
            return;
        }
        
        if (difference === 0) {
            alert('Stok fisik sama dengan stok sistem. Tidak ada perubahan yang disimpan.');
            onClose();
            return;
        }

        setProcessing(true);
        try {
            await client.post(`/inventories/${selectedId}/adjust`, {
                qty: Math.abs(difference),
                type: 'adjustment',
                direction: difference > 0 ? 'in' : 'out',
                notes: notes || `Stock Opname: Selisih ${difference > 0 ? '+' : ''}${difference} ${selectedItem.unit}`
            });
            setPhysicalStock('');
            setNotes('');
            onSaveSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan Stock Opname.');
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl border border-brand-light shadow-2xl w-full max-w-md mx-4 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-brand-light">
                    <h3 className="font-bold text-brand-dark flex items-center gap-2">
                        <iconify-icon icon="solar:clipboard-check-linear" class="text-brand-secondary text-lg"></iconify-icon>
                        Pencatatan Stock Opname
                    </h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <iconify-icon icon="solar:close-circle-linear" class="text-xl"></iconify-icon>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Bahan Baku</label>
                        <select
                            value={selectedId}
                            onChange={e => {
                                setSelectedId(e.target.value);
                                setPhysicalStock('');
                            }}
                            className="w-full h-11 px-4 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            {items.map(item => (
                                <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-brand-bg p-4 rounded-2xl border border-brand-light text-center">
                        <div>
                            <span className="text-[10px] font-extrabold text-brand-primary/60 capitalize">Stok Sistem</span>
                            <p className="text-xl font-extrabold text-brand-dark mt-1">
                                {systemStock} <span className="text-xs font-medium text-gray-500">{selectedItem?.unit}</span>
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] font-extrabold text-brand-primary/60 capitalize">Selisih</span>
                            <p className={`text-xl font-extrabold mt-1 ${
                                difference === 0 ? 'text-brand-dark' 
                                : difference > 0 ? 'text-emerald-500' 
                                : 'text-rose-500'
                            }`}>
                                {difference > 0 ? '+' : ''}{difference.toFixed(2)} <span className="text-xs font-medium text-gray-500">{selectedItem?.unit}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Stok Fisik Sebenarnya ({selectedItem?.unit})
                        </label>
                        <input
                            type="number"
                            value={physicalStock}
                            onChange={e => setPhysicalStock(e.target.value)}
                            placeholder="Masukkan stok di lapangan..."
                            step="0.01" required
                            className="w-full h-11 px-4 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary font-semibold text-brand-dark"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1.5">Catatan Perbedaan</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Contoh: Koreksi selisih timbangan, barang rusak..."
                            rows="2"
                            className="w-full p-3 text-sm border border-brand-light rounded-xl bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-brand-primary hover:bg-brand-secondary transition disabled:opacity-50 active:scale-[0.98]"
                    >
                        {processing ? 'Memproses...' : 'Simpan Stock Opname'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function InventoryActions({ item, onDelete }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen(!open)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className="p-2 text-brand-primary/50 hover:text-brand-secondary hover:bg-brand-light/50 rounded-xl transition-all"
            >
                <iconify-icon icon="solar:menu-dots-linear" class="text-lg"></iconify-icon>
            </button>
            {open && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-brand-light rounded-xl shadow-xl z-20 overflow-hidden">
                    <Link
                        to={`/inventories/${item.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-dark font-semibold hover:bg-brand-light/30 text-left w-full"
                    >
                        <iconify-icon icon="solar:eye-linear" class="text-brand-primary"></iconify-icon>
                        Detail
                    </Link>
                    <Link
                        to={`/inventories/${item.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-dark font-semibold hover:bg-brand-light/30 text-left w-full"
                    >
                        <iconify-icon icon="solar:pen-linear" class="text-brand-primary"></iconify-icon>
                        Edit
                    </Link>
                    <button
                        onClick={() => onDelete(item.id, item.name)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 font-semibold hover:bg-[#fef2f2] border-t border-brand-light text-left w-full"
                    >
                        <iconify-icon icon="solar:trash-bin-trash-linear" class="text-red-500"></iconify-icon>
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}

// InventoriesIndex.layout = (page) => <>{page}</>;