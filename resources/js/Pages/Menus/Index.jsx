// Menus/Index.jsx
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import AppLayout from '@/Layouts/AppLayout'

export default function MenusIndex({ menus, categories, totalMenus }) {
    const { url } = usePage()
    const params = new URLSearchParams(url.split('?')[1] || '')

    const [search, setSearch] = useState(params.get('search') || '')
    const [view, setViewState] = useState('list')

    useEffect(() => {
        const saved = localStorage.getItem('menu-view')
        if (saved === 'grid') setViewState('grid')
    }, [])

    useEffect(() => {
        setSearch(params.get('search') || '')
    }, [url])

    function setView(mode) {
        setViewState(mode)
        localStorage.setItem('menu-view', mode)
    }

    function filter(overrides = {}) {
        const current = {
            search: params.get('search') || '',
            status: params.get('status') || '',
            category: params.get('category') || '',
        }
        const paramsObj = { ...current, ...overrides }
        Object.keys(paramsObj).forEach(key => {
            if (!paramsObj[key]) delete paramsObj[key]
        })
        router.get(route('menus.index'), paramsObj, { preserveState: true, replace: true })
    }

    function handleSearch(e) {
        e.preventDefault()
        filter({ search, page: 1 })
    }

    function handleStatus(e) {
        filter({ status: e.target.value, page: 1 })
    }

    function handleDelete(id, name) {
        if (!confirm(`Hapus menu ${name}? Tindakan ini tidak bisa dibatalkan.`)) return
        router.delete(route('menus.destroy', id), { preserveScroll: true })
    }

    function handleToggleStatus(id) {
        router.post(route('menus.toggle-status', id), {}, { preserveScroll: true })
    }

    function getMarginStyle(margin) {
        if (margin >= 60) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        if (margin >= 40) return 'bg-amber-100 text-amber-700 border-amber-200'
        return 'bg-rose-100 text-rose-700 border-rose-200'
    }

    const activeCategory = params.get('category') || ''
    const activeStatus = params.get('status') || ''

    // Pagination pages array
    function getPages() {
        const current = menus.current_page
        const last = menus.last_page
        const window = 2
        const pages = []

        pages.push(1)
        if (current - window > 2) pages.push('...')
        for (let i = Math.max(2, current - window); i <= Math.min(last - 1, current + window); i++) {
            pages.push(i)
        }
        if (current + window < last - 1) pages.push('...')
        if (last > 1) pages.push(last)

        return pages
    }

    return (
        <AppLayout>
            <Head title="Katalog Menu" />

            <div className="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
                <div className="space-y-6 max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                                Katalog Menu
                            </h1>
                            <p className="text-[#2f27ce] font-medium text-sm mt-1">
                                Kelola item menu, harga jual, dan pantau margin keuntungan Anda.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right mr-2">
                                <p className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-wider">Total Menu</p>
                                <p className="text-2xl font-black text-[#443dff] leading-none mt-0.5">{totalMenus}</p>
                            </div>
                            <a
                                href={route('menus.create')}
                                className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]"
                            >
                                + Tambah Menu
                            </a>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                            <div className="flex items-center gap-3 flex-1">

                                {/* Search */}
                                <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
                                    <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#2f27ce]/70 text-[18px]"></iconify-icon>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari menu..."
                                        className="w-full h-10 bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-9 pr-4 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/50 focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all"
                                    />
                                </form>

                                {/* Status Filter */}
                                <select
                                    value={activeStatus}
                                    onChange={handleStatus}
                                    className="h-10 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-3 text-[13px] font-bold text-[#2f27ce] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Tersedia</option>
                                    <option value="inactive">Habis</option>
                                </select>

                                <button
                                    onClick={handleSearch}
                                    className="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white rounded-xl text-[13px] font-extrabold hover:from-[#2f27ce] hover:to-[#050316] transition-all shadow-md shadow-[#443dff]/30 active:scale-95"
                                >
                                    Cari
                                </button>

                                {(params.get('search') || params.get('status') || params.get('category')) && (
                                    <Link
                                        href={route('menus.index')}
                                        className="h-10 px-3 bg-[#dddbff]/30 text-[#2f27ce] rounded-xl text-[13px] font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all flex items-center border border-transparent hover:border-[#dddbff]"
                                    >
                                        Reset
                                    </Link>
                                )}
                            </div>

                            {/* Category Tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto shrink-0">
                                <button
                                    onClick={() => filter({ category: '', page: 1 })}
                                    className={`px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all whitespace-nowrap ${
                                        !activeCategory
                                            ? 'bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white shadow-md'
                                            : 'bg-white border border-[#dddbff] text-[#2f27ce] hover:bg-[#dddbff]/50 hover:text-[#050316]'
                                    }`}
                                >
                                    Semua
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => filter({ category: cat.id, page: 1 })}
                                        className={`px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all whitespace-nowrap ${
                                            activeCategory == cat.id
                                                ? 'bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white shadow-md'
                                                : 'bg-white border border-[#dddbff] text-[#2f27ce] hover:bg-[#dddbff]/50 hover:text-[#050316]'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-[#fbfbfe] border border-[#dddbff] p-1 rounded-xl shrink-0">
                            <button
                                onClick={() => setView('grid')}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                    view === 'grid'
                                        ? 'bg-white border border-[#dddbff] text-[#050316] shadow-sm'
                                        : 'text-[#2f27ce]/50 hover:text-[#2f27ce]'
                                }`}
                            >
                                <iconify-icon icon="solar:widget-linear" class="text-lg"></iconify-icon>
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                    view === 'list'
                                        ? 'bg-white border border-[#dddbff] text-[#050316] shadow-sm'
                                        : 'text-[#2f27ce]/50 hover:text-[#2f27ce]'
                                }`}
                            >
                                <iconify-icon icon="solar:list-bold" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    </div>

                    {/* Table / Grid Card */}
                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                        {/* ── TABLE VIEW ── */}
                        {view === 'list' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead>
                                        <tr className="bg-[#fbfbfe]/50 border-b border-[#dddbff]">
                                            {['Foto', 'Nama Menu', 'Kategori', 'Harga Jual', 'HPP', 'Margin', 'Status', 'Aksi'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#dddbff]/50">
                                        {menus.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-[#dddbff]/50 flex items-center justify-center text-[#443dff]">
                                                            <iconify-icon icon="solar:cookie-bold-duotone" class="text-3xl"></iconify-icon>
                                                        </div>
                                                        <p className="text-sm font-bold text-[#050316]">Tidak ada menu ditemukan.</p>
                                                        <Link
                                                            href={route('menus.create')}
                                                            className="bg-gradient-to-r text-xs from-[#2f27ce] to-[#443dff] text-white px-3 py-1.5 rounded-lg font-bold"
                                                        >
                                                            + Tambah Menu Pertama
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : menus.data.map((menu) => {
                                            const hpp = menu.recipe?.total_hpp ?? 0
                                            const margin = menu.recipe?.margin ?? 0
                                            return (
                                                <tr
                                                    key={menu.id}
                                                    className="hover:bg-[#dddbff]/10 transition-colors group cursor-pointer"
                                                    onClick={() => window.location.href = route('menus.show', menu.id)}
                                                >
                                                    {/* Foto */}
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <a href={route('menus.show', menu.id)}>
                                                            <img
                                                                src={menu.image_url ?? `https://placehold.co/100x100/dddbff/2f27ce?text=Menu`}
                                                                className="w-10 h-10 rounded-xl object-cover border border-[#dddbff] shadow-sm group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </a>
                                                    </td>

                                                    {/* Nama */}
                                                    <td className="px-6 py-4">
                                                        <p className="font-extrabold text-[#050316] text-[13px] group-hover:text-[#443dff] transition-colors">
                                                            {menu.name}
                                                        </p>
                                                        {menu.description && (
                                                            <p className="text-[11px] text-[#2f27ce]/50 font-medium mt-0.5 truncate max-w-[180px]">
                                                                {menu.description}
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* Kategori */}
                                                    <td className="px-6 py-4">
                                                        <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#2f27ce]">
                                                            <iconify-icon icon="solar:tag-linear" class="text-base text-[#443dff]"></iconify-icon>
                                                            {menu.category?.name ?? '-'}
                                                        </span>
                                                    </td>

                                                    {/* Harga */}
                                                    <td className="px-6 py-4 font-black text-[#443dff] text-[13px]">
                                                        Rp {Number(menu.price).toLocaleString('id-ID')}
                                                    </td>

                                                    {/* HPP */}
                                                    <td className="px-6 py-4 text-[13px] font-bold text-[#050316]/60">
                                                        {hpp > 0
                                                            ? `Rp ${Number(hpp).toLocaleString('id-ID')}`
                                                            : <span className="text-[#2f27ce]/30 italic text-[11px]">Belum diset</span>
                                                        }
                                                    </td>

                                                    {/* Margin */}
                                                    <td className="px-6 py-4">
                                                        {hpp > 0 ? (
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getMarginStyle(margin)}`}>
                                                                {margin}%
                                                            </span>
                                                        ) : (
                                                            <span className="text-[#2f27ce]/30 italic text-[11px]">-</span>
                                                        )}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                                            menu.is_active
                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                : 'bg-rose-100 text-rose-700 border-rose-200'
                                                        }`}>
                                                            {menu.is_active ? 'Tersedia' : 'Habis'}
                                                        </span>
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                            <a
                                                                href={route('menus.show', menu.id)}
                                                                className="p-2 text-[#2f27ce] hover:text-[#443dff] rounded-xl hover:bg-[#dddbff]/50 inline-flex active:scale-95 transition-all"
                                                                title="Lihat Detail"
                                                            >
                                                                <iconify-icon icon="solar:eye-linear" class="text-lg"></iconify-icon>
                                                            </a>
                                                            <a
                                                                href={route('menus.edit', menu.id)}
                                                                className="p-2 text-[#2f27ce] hover:text-[#443dff] rounded-xl hover:bg-[#dddbff]/50 inline-flex active:scale-95 transition-all"
                                                                title="Edit"
                                                            >
                                                                <iconify-icon icon="solar:pen-linear" class="text-lg"></iconify-icon>
                                                            </a>
                                                            <button
                                                                onClick={() => handleDelete(menu.id, menu.name)}
                                                                className="p-2 text-rose-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 inline-flex active:scale-95 transition-all"
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
                        )}

                        {/* ── GRID VIEW ── */}
                        {view === 'grid' && (
                            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {menus.data.length === 0 ? (
                                    <div className="col-span-full py-16 text-center">
                                        <div className="w-16 h-16 rounded-full bg-[#dddbff]/50 flex items-center justify-center mb-3 mx-auto text-[#443dff]">
                                            <iconify-icon icon="solar:cookie-bold-duotone" class="text-3xl"></iconify-icon>
                                        </div>
                                        <p className="text-sm font-bold text-[#050316]">Tidak ada menu ditemukan.</p>
                                    </div>
                                ) : menus.data.map((menu) => {
                                    const hpp = menu.recipe?.total_hpp ?? 0
                                    const margin = menu.recipe?.margin ?? 0
                                    return (
                                        <div
                                            key={menu.id}
                                            className="group bg-[#fbfbfe] border border-[#dddbff] rounded-2xl overflow-hidden hover:border-[#443dff] hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => window.location.href = route('menus.show', menu.id)}
                                        >
                                            {/* Foto */}
                                            <div className="relative aspect-square overflow-hidden bg-[#dddbff]/20">
                                                <img
                                                    src={menu.image_url ?? `https://placehold.co/200x200/dddbff/2f27ce?text=Menu`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {/* Status toggle */}
                                                <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleToggleStatus(menu.id)}
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border transition-all ${
                                                            menu.is_active
                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'
                                                                : 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200'
                                                        }`}
                                                    >
                                                        {menu.is_active ? 'Tersedia' : 'Habis'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-3">
                                                <p className="font-extrabold text-[#050316] text-[12px] truncate">{menu.name}</p>
                                                <p className="text-[11px] text-[#2f27ce]/60 font-medium mt-0.5">{menu.category?.name ?? '-'}</p>
                                                <p className="text-[13px] font-black text-[#443dff] mt-1.5">
                                                    Rp {Number(menu.price).toLocaleString('id-ID')}
                                                </p>
                                                {hpp > 0 && (
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border mt-1 ${getMarginStyle(margin)}`}>
                                                        Margin {margin}%
                                                    </span>
                                                )}

                                                {/* Aksi */}
                                                <div
                                                    className="flex items-center gap-1 mt-2 pt-2 border-t border-[#dddbff]/50 opacity-0 group-hover:opacity-100 transition-all"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <a
                                                        href={route('menus.edit', menu.id)}
                                                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold text-[#2f27ce] hover:text-[#443dff] hover:bg-[#dddbff]/50 rounded-lg transition-all"
                                                    >
                                                        <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon> Edit
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(menu.id, menu.name)}
                                                        className="flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-bold text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    >
                                                        <iconify-icon icon="solar:trash-bin-trash-linear" class="text-sm"></iconify-icon>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#dddbff]/50 bg-[#fbfbfe]/30">
                            <p className="text-[12px] font-medium text-[#2f27ce]">
                                Menampilkan <span className="font-bold text-[#050316]">{menus.data.length}</span>{' '}
                                dari <span className="font-bold text-[#050316]">{menus.total}</span> menu
                            </p>
                            <div className="flex items-center gap-2">
                                {/* Prev */}
                                {menus.current_page === 1 ? (
                                    <button disabled className="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed">
                                        Sebelumnya
                                    </button>
                                ) : (
                                    <Link href={menus.prev_page_url} className="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm">
                                        Sebelumnya
                                    </Link>
                                )}

                                {/* Page numbers */}
                                {getPages().map((page, i) =>
                                    page === '...' ? (
                                        <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-[12px] font-bold text-[#2f27ce]/40">…</span>
                                    ) : (
                                        <Link
                                            key={page}
                                            href={menus.links?.find(l => l.label == page)?.url ?? '#'}
                                            className={`w-9 h-9 flex items-center justify-center text-[12px] font-extrabold rounded-xl border transition-colors shadow-sm ${
                                                page === menus.current_page
                                                    ? 'bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white border-[#443dff] shadow-[#443dff]/30'
                                                    : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff] hover:text-[#050316]'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    )
                                )}

                                {/* Next */}
                                {!menus.next_page_url ? (
                                    <button disabled className="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed">
                                        Berikutnya
                                    </button>
                                ) : (
                                    <Link href={menus.next_page_url} className="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm">
                                        Berikutnya
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}