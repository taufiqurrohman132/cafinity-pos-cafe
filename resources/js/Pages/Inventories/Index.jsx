// Inventories/Index.jsx
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function InventoriesIndex({
    inventories,
    totalValue,
    lowStockCount,
    restockCount,
    recentLogs,
    criticalItem,
}) {
    const { url } = usePage()
    const params = new URLSearchParams(url.split('?')[1] || '')

    const [search, setSearch] = useState(params.get('search') || '')
    const status = params.get('status') || ''

    function handleSearch(e) {
        e.preventDefault()
        router.get(route('inventories.index'), { search, status }, { preserveState: true, replace: true })
    }

    function handleStatus(e) {
        router.get(route('inventories.index'), { search, status: e.target.value }, { preserveState: true, replace: true })
    }

    function handleDelete(id, name) {
        if (!confirm(`Hapus ${name}?`)) return
        router.delete(route('inventories.destroy', id), { preserveScroll: true })
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
            blue: 'bg-[#dddbff] text-[#2f27ce]',
            yellow: 'bg-yellow-100 text-yellow-700',
            orange: 'bg-orange-100 text-orange-600',
            red: 'bg-red-100 text-red-600',
        }[color]
        const barCls = {
            blue: 'bg-[#2f27ce]',
            yellow: 'bg-yellow-400',
            orange: 'bg-orange-400',
            red: 'bg-red-400',
        }[color]
        return { percent, label, badgeCls, barCls }
    }

    return (
        <>
            <Head title="Manajemen Inventaris" />

            <div className="min-h-screen bg-[#fbfbfe]">
                <div className="grid grid-cols-1 xl:grid-cols-12">

                    {/* ── MAIN ── */}
                    <div className="xl:col-span-9 p-4 md:p-6 space-y-6">

                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#050316]">Manajemen Inventaris</h1>
                                <p className="text-gray-500 mt-1">Lacak dan kelola stok bahan baku operasional kafe Anda secara real-time.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={status}
                                    onChange={handleStatus}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#dddbff]"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="safe">Aman</option>
                                    <option value="low">Stok Rendah</option>
                                    <option value="empty">Habis</option>
                                </select>
                                <Link
                                    href={route('inventories.create')}
                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] hover:bg-[#443dff] rounded-xl transition shadow-sm"
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
                                    icon: '📦',
                                    iconBg: 'bg-[#dddbff] text-[#2f27ce]',
                                },
                                {
                                    label: 'Peringatan Stok Rendah',
                                    value: `${lowStockCount} Item`,
                                    sub: 'Perlu segera dipesan',
                                    subColor: 'text-red-500',
                                    icon: '⚠️',
                                    iconBg: 'bg-orange-100 text-orange-500',
                                },
                                {
                                    label: 'Saran Restock',
                                    value: `${restockCount} Item`,
                                    sub: 'Berdasarkan batas minimum stok',
                                    subColor: 'text-gray-400',
                                    icon: '📈',
                                    iconBg: 'bg-[#dddbff] text-[#2f27ce]',
                                },
                            ].map((card) => (
                                <div key={card.label} className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500">{card.label}</p>
                                            <h2 className="text-2xl font-bold text-[#050316] mt-3">{card.value}</h2>
                                            <p className={`text-xs font-semibold mt-3 ${card.subColor}`}>{card.sub}</p>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${card.iconBg}`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Card */}
                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                            {/* Table Header */}
                            <div className="px-6 py-5 border-b border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <h3 className="font-bold text-[#050316]">Daftar Bahan Baku</h3>
                                <form onSubmit={handleSearch}>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari bahan..."
                                            className="w-full lg:w-64 h-10 pl-9 pr-4 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dddbff]"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[800px]">
                                    <thead>
                                        <tr className="text-xs font-medium text-gray-400 bg-[#fbfbfe] border-b border-[#dddbff]">
                                            {['Nama Bahan', 'Kategori', 'Stok Saat Ini', 'Satuan', 'Harga/Satuan', 'Status', 'Aksi'].map((h) => (
                                                <th key={h} className="px-6 py-3">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-[#dddbff]">
                                        {inventories.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-4xl">📦</span>
                                                        <p>Belum ada data inventaris.</p>
                                                        <Link href={route('inventories.create')} className="text-[#2f27ce] font-semibold hover:underline text-xs">
                                                            + Tambah bahan pertama
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : inventories.data.map((item) => {
                                            const { percent, label, badgeCls, barCls } = getStockMeta(item)
                                            return (
                                                <tr key={item.id} className="hover:bg-[#fbfbfe] transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-[#dddbff] text-[#2f27ce] font-bold text-sm flex items-center justify-center flex-shrink-0">
                                                                {item.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <p className="font-semibold text-[#050316]">{item.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 rounded-full bg-[#fbfbfe] border border-[#dddbff] text-gray-600 text-xs font-medium">
                                                            {item.category?.name ?? '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="font-semibold text-[#050316]">{item.stock} / {item.min_stock}</span>
                                                                <span className="text-gray-400">{percent}%</span>
                                                            </div>
                                                            <div className="w-28 h-1.5 rounded-full bg-[#dddbff] overflow-hidden">
                                                                <div className={`h-full rounded-full ${barCls}`} style={{ width: `${percent}%` }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                                                    <td className="px-6 py-4 font-semibold text-[#050316]">
                                                        Rp {Number(item.price_per_unit).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeCls}`}>{label}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={route('inventories.show', item.id)}
                                                                className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition"
                                                                title="Detail"
                                                            >
                                                                👁
                                                            </Link>
                                                            <Link
                                                                href={route('inventories.edit', item.id)}
                                                                className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition"
                                                                title="Edit"
                                                            >
                                                                ✏️
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item.id, item.name)}
                                                                className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition"
                                                                title="Hapus"
                                                            >
                                                                🗑
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
                            <div className="px-6 py-4 border-t border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                <p className="text-xs text-gray-400">
                                    Menampilkan {inventories.from ?? 0}–{inventories.to ?? 0} dari {inventories.total} jenis bahan baku
                                </p>
                                <div className="flex items-center gap-4">
                                    <Link href={route('reports.inventory')} className="text-xs font-semibold text-gray-500 hover:text-[#2f27ce] transition">
                                        Unduh Laporan Stok
                                    </Link>
                                    {/* Pagination */}
                                    <div className="flex items-center gap-1">
                                        {inventories.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url ?? '#'}
                                                className={`px-3 py-1 text-xs rounded-lg border transition ${
                                                    link.active
                                                        ? 'bg-[#2f27ce] text-white border-[#2f27ce]'
                                                        : 'border-[#dddbff] text-gray-500 hover:border-[#2f27ce] hover:text-[#2f27ce]'
                                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SIDEBAR ── */}
                    <div className="xl:col-span-3 border-l border-[#dddbff] bg-white p-4 md:p-6 space-y-6">

                        {/* Aksi Cepat */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aksi Cepat</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('inventories.create')}
                                    className="w-full bg-[#2f27ce] hover:bg-[#443dff] transition rounded-xl p-4 text-left text-white flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-[#443dff] flex items-center justify-center text-lg flex-shrink-0">+</div>
                                    <div>
                                        <h4 className="text-sm font-bold">Tambah Bahan Baru</h4>
                                        <p className="text-xs text-[#dddbff] mt-0.5">Input item inventaris baru</p>
                                    </div>
                                </Link>
                                <Link
                                    href={route('inventories.low-stock')}
                                    className="w-full border border-[#dddbff] rounded-xl p-4 text-left flex items-center gap-3 hover:bg-[#fbfbfe] transition"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center text-[#2f27ce] text-lg flex-shrink-0">⚠️</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#050316]">Stok Menipis</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Lihat semua item kritis</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Log Aktivitas */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Log Aktivitas</h3>
                                <Link href={route('inventories.index')} className="text-xs font-semibold text-[#2f27ce] hover:text-[#443dff]">Semua</Link>
                            </div>
                            <div className="space-y-4">
                                {recentLogs.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">Belum ada aktivitas.</p>
                                ) : recentLogs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-[#2f27ce] pl-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-xs font-bold text-[#050316]">
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
                        <div className="bg-[#dddbff] border border-[#dddbff] rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#fbfbfe] flex items-center justify-center text-[#2f27ce] text-lg flex-shrink-0">💡</div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#050316] mb-1">Tips Efisiensi</h4>
                                    {criticalItem ? (
                                        <>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                <strong>{criticalItem.name}</strong> hampir habis (sisa {criticalItem.stock} {criticalItem.unit}). Segera lakukan restock sebelum kehabisan.
                                            </p>
                                            <Link href={route('inventories.show', criticalItem.id)} className="inline-block mt-2 text-xs font-semibold text-[#2f27ce] hover:underline">
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
                <div className="border-t border-[#dddbff] bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    <p className="text-[10px] text-gray-400">© 2024 Smart Cafe POS v2.4.0</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#2f27ce] inline-block" /> System Online
                        </span>
                        <span>Support ID: #POS-8821</span>
                    </div>
                </div>
            </div>
        </>
    )
}