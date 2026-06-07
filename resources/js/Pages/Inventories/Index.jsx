// Inventories/Index.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Head from '@/Components/Head'
import AppLayout from '@/Layouts/AppLayout'
import client from '@/api/client'

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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const [search, setSearch] = useState(queryParams.get('search') || '')
    const status = queryParams.get('status') || ''

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
            <AppLayout>
                <Head title="Manajemen Inventaris" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-brand-primary">Memuat Data...</p>
                    </div>
                </div>
            </AppLayout>
        )
    }

    if (error && !inventories) {
        return (
            <AppLayout>
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
            </AppLayout>
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
        <AppLayout>
            <Head title="Manajemen Inventaris" />

            <div className="min-h-screen bg-brand-bg">
                <div className="grid grid-cols-1 xl:grid-cols-12">

                    {/* ── MAIN ── */}
                    <div className="xl:col-span-9 p-4 md:p-6 space-y-6">

                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-brand-dark">Manajemen Inventaris</h1>
                                <p className="text-gray-500 mt-1">Lacak dan kelola stok bahan baku operasional kafe Anda secara real-time.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={status}
                                    onChange={handleStatus}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-light"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="safe">Aman</option>
                                    <option value="low">Stok Rendah</option>
                                    <option value="empty">Habis</option>
                                </select>
                                <Link
                                    to="/inventories/create"
                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary rounded-xl transition shadow-sm"
                                >
                                    <span className="text-base">+</span>
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
                                <div key={card.label} className="bg-white rounded-2xl border border-brand-light shadow-sm p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500">{card.label}</p>
                                            <h2 className="text-2xl font-bold text-brand-dark mt-3">{card.value}</h2>
                                            <p className={`text-xs font-semibold mt-3 ${card.subColor}`}>{card.sub}</p>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
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
                                                            <Link to="/inventories/create" className="text-brand-primary font-semibold hover:underline text-xs">
                                                                + Tambah bahan pertama
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
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    to={`/inventories/${item.id}`}
                                                                    className="w-8 h-8 rounded-lg bg-brand-bg border border-brand-light flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition"
                                                                    title="Detail"
                                                                >
                                                                    <iconify-icon icon="solar:eye-linear" class="text-lg"></iconify-icon>
                                                                </Link>
                                                                <Link
                                                                    to={`/inventories/${item.id}/edit`}
                                                                    className="w-8 h-8 rounded-lg bg-brand-bg border border-brand-light flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition"
                                                                    title="Edit"
                                                                >
                                                                    <iconify-icon icon="solar:pen-linear" class="text-lg"></iconify-icon>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(item.id, item.name)}
                                                                    className="w-8 h-8 rounded-lg bg-brand-bg border border-brand-light flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition"
                                                                    title="Hapus"
                                                                >
                                                                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-lg"></iconify-icon>
                                                                </button>
                                                            </div>
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
                            <h3 className="text-xs font-bold text-gray-400 capitalize tracking-wider mb-3">Aksi Cepat</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/inventories/create"
                                    className="w-full bg-brand-primary hover:bg-brand-secondary transition rounded-xl p-4 text-left text-white flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-brand-secondary flex items-center justify-center text-lg flex-shrink-0">+</div>
                                    <div>
                                        <h4 className="text-sm font-bold">Tambah Bahan Baru</h4>
                                        <p className="text-xs text-brand-light mt-0.5">Input item inventaris baru</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/inventories/low-stock/list"
                                    className="w-full border border-brand-light rounded-xl p-4 text-left flex items-center gap-3 hover:bg-brand-bg transition"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary text-lg flex-shrink-0">
                                        <iconify-icon icon="solar:danger-triangle-linear" class="text-lg"></iconify-icon>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-dark">Stok Menipis</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Lihat semua item kritis</p>
                                    </div>
                                </Link>
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
        </AppLayout>
    )
}

// InventoriesIndex.layout = (page) => <AppLayout>{page}</AppLayout>;