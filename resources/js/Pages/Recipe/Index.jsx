// Recipe/Index.jsx
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import AppLayout from '@/Layouts/AppLayout'

export default function RecipeIndex({ recipes, selectedRecipe, inventories, menus }) {
    const { url } = usePage()
    const params = new URLSearchParams(url.split('?')[1] || '')

    const [search, setSearch] = useState('')
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)

    // What-If Simulator state
    const baseHpp = selectedRecipe?.total_hpp ?? 0
    const hargaJual = selectedRecipe?.menu?.price ?? 0
    const baseMargin = selectedRecipe?.margin ?? 0
    const [sliderVal, setSliderVal] = useState(0)
    // reset slider & ingredients saat ganti resep
    useEffect(() => {
        setSliderVal(0)
        setIngredients(
            selectedRecipe?.ingredients?.map(b => ({
                inventory_id: b.id,
                qty: b.pivot.qty,
                unit: b.pivot.unit,
            })) ?? []
        )
        setEditNotes(selectedRecipe?.notes ?? '')
    }, [selectedRecipe?.id])

    const hppBaru = baseHpp * (1 + sliderVal / 100)
    const marginBaru = hargaJual > 0 ? ((hargaJual - hppBaru) / hargaJual * 100) : 0
    const impactPersen = (marginBaru - baseMargin).toFixed(1)

    // Edit modal ingredients state
    const [ingredients, setIngredients] = useState(
        selectedRecipe?.ingredients?.map(b => ({
            inventory_id: b.id,
            qty: b.pivot.qty,
            unit: b.pivot.unit,
        })) ?? []
    )
    const [editNotes, setEditNotes] = useState(selectedRecipe?.notes ?? '')

    // Create modal state
    const [createForm, setCreateForm] = useState({
        menu_id: '',
        notes: '',
        ingredients: [{ inventory_id: '', qty: '', unit: '' }],
    })

    const filteredRecipes = recipes.filter(r =>
        r.menu?.name?.toLowerCase().includes(search.toLowerCase())
    )

    function handleEditSubmit(e) {
        e.preventDefault()
        router.put(route('recipe.update', selectedRecipe.id), {
            notes: editNotes,
            ingredients,
        }, {
            onSuccess: () => setShowEditModal(false),
            preserveScroll: true,
        })
    }

    function handleCreateSubmit(e) {
        e.preventDefault()
        router.post(route('recipe.store'), createForm, {
            onSuccess: () => {
                setShowCreateModal(false)
                setCreateForm({ menu_id: '', notes: '', ingredients: [{ inventory_id: '', qty: '', unit: '' }] })
            },
        })
    }

    function addIngredientRow(setter) {
        setter(prev => ({ ...prev, ingredients: [...prev.ingredients, { inventory_id: '', qty: '', unit: '' }] }))
    }

    function removeIngredientRow(index, isEdit = false) {
        if (isEdit) {
            setIngredients(prev => prev.filter((_, i) => i !== index))
        } else {
            setCreateForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }))
        }
    }

    function updateIngredient(index, field, value, isEdit = false) {
        if (isEdit) {
            setIngredients(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row))
        } else {
            setCreateForm(prev => ({
                ...prev,
                ingredients: prev.ingredients.map((row, i) => i === index ? { ...row, [field]: value } : row)
            }))
        }
    }

    function onInventoryChange(index, inventoryId, isEdit = false) {
        const inv = inventories.find(i => i.id == inventoryId)
        if (isEdit) {
            setIngredients(prev => prev.map((row, i) => i === index ? { ...row, inventory_id: inventoryId, unit: inv?.unit ?? row.unit } : row))
        } else {
            setCreateForm(prev => ({
                ...prev,
                ingredients: prev.ingredients.map((row, i) => i === index ? { ...row, inventory_id: inventoryId, unit: inv?.unit ?? row.unit } : row)
            }))
        }
    }

    const menu = selectedRecipe?.menu
    const cogsPercent = menu?.price > 0 ? Math.round((selectedRecipe.total_hpp / menu.price) * 100 * 10) / 10 : 0
    const profitPerServing = (menu?.price ?? 0) - (selectedRecipe?.total_hpp ?? 0)
    const recommendedPrice = selectedRecipe?.total_hpp > 0 ? Math.round(selectedRecipe.total_hpp / 0.4) : 0
    const showWarning = selectedRecipe?.margin > 0 && selectedRecipe?.margin < 40

    return (
        <>
            <Head title="Recipe Costing" />

            <div className="flex h-[calc(100vh-72px)] bg-[#fbfbfe] overflow-hidden">

                {/* ── SIDEBAR KIRI ── */}
                <div className="w-80 min-w-[280px] bg-white border-r border-[#dddbff] flex flex-col z-10 shadow-[10px_0_30px_rgba(47,39,206,0.03)]">
                    <div className="p-5 border-b border-[#dddbff]/50 flex items-center justify-between bg-[#fbfbfe]/50">
                        <h2 className="text-lg font-bold text-[#050316]">Katalog Resep</h2>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-8 h-8 bg-gradient-to-br from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl flex items-center justify-center font-bold text-lg transition-all shadow-md shadow-[#443dff]/30 active:scale-95"
                        >
                            +
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-4 pt-5 pb-2">
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/70 text-sm">🔍</span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari resep menu..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                        <p className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-3 pl-1">Terakhir Diupdate</p>

                        {filteredRecipes.map((resep) => {
                            const isActive = selectedRecipe?.id === resep.id
                            return (
                                <Link
                                    key={resep.id}
                                    href={route('recipe.index', { id: resep.id })}
                                    className="block focus:outline-none focus:ring-2 focus:ring-[#443dff] rounded-xl"
                                >
                                    <div className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-br from-[#443dff] to-[#2f27ce] border-transparent shadow-lg shadow-[#443dff]/20'
                                        : 'bg-white border border-[#dddbff] hover:border-[#443dff] hover:shadow-md'
                                        }`}>
                                        {isActive && (
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full blur-xl -mr-5 -mt-5 pointer-events-none" />
                                        )}
                                        <div className="flex justify-between items-start mb-1.5 relative z-10">
                                            <p className={`text-sm font-bold line-clamp-1 pr-2 ${isActive ? 'text-white' : 'text-[#050316] group-hover:text-[#443dff] transition-colors'}`}>
                                                {resep.menu?.name ?? 'Menu Dihapus'}
                                            </p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-[#050316]/20 text-white border border-white/10' : 'bg-[#dddbff]/50 text-[#2f27ce] border border-[#dddbff]'
                                                }`}>
                                                {resep.margin}%
                                            </span>
                                        </div>
                                        <p className={`text-[10px] font-semibold mb-2 relative z-10 ${isActive ? 'text-[#dddbff]' : 'text-[#2f27ce]/70'}`}>
                                            {(resep.menu?.category?.name ?? 'N/A').toUpperCase()}
                                        </p>
                                        <div className={`flex justify-between items-center relative z-10 mt-2 pt-2 border-t ${isActive ? 'border-white/10' : 'border-[#dddbff]/50'}`}>
                                            <span className={`text-[10px] ${isActive ? 'text-[#dddbff]' : 'text-[#2f27ce]/70'}`}>
                                                HPP: Rp {Number(resep.total_hpp).toLocaleString('id-ID')}
                                            </span>
                                            <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#050316]'}`}>
                                                Rp {Number(resep.menu?.price ?? 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="p-4 border-t border-[#dddbff] bg-[#fbfbfe] text-[10px] text-[#2f27ce]/50 text-center">
                        © {new Date().getFullYear()} Devora POS v2.4.0
                    </div>
                </div>

                {/* ── KONTEN UTAMA ── */}
                <div className="flex-1 overflow-y-auto flex flex-col bg-[#fbfbfe]">

                    {selectedRecipe ? (
                        <>
                            {/* Top Bar */}
                            <div className="bg-white/80 backdrop-blur-md border-b border-[#dddbff] px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h1 className="text-2xl font-bold text-[#050316]">{menu?.name ?? 'Menu Dihapus'}</h1>
                                        <span className="text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 border border-[#dddbff] px-3 py-1 rounded-full">
                                            {(menu?.category?.name ?? 'N/A').toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#2f27ce] flex items-center gap-1">
                                        ℹ️ Terakhir disinkronisasi dengan harga inventory: 2 jam yang lalu
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {menu?.id && (
                                        <a
                                            href={route('menus.edit', menu.id)}
                                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#443dff] hover:to-[#2f27ce] rounded-xl transition-all shadow-md shadow-[#443dff]/30 active:scale-95"
                                        >
                                            Edit Menu
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">

                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-[#dddbff]/50 to-white border border-[#dddbff] rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                        <span className="absolute -right-4 -bottom-4 text-6xl opacity-10">💰</span>
                                        <p className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-2">Total HPP</p>
                                        <p className="text-2xl font-bold text-[#050316] relative z-10">
                                            Rp {Number(selectedRecipe.total_hpp).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-[#dddbff] rounded-2xl p-6 shadow-sm">
                                        <p className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-2">Harga Jual</p>
                                        <p className="text-2xl font-bold text-[#050316]">
                                            Rp {Number(menu?.price ?? 0).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-[#dddbff] rounded-2xl p-6 shadow-sm">
                                        <p className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-2">Margin Kotor</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-bold text-[#050316]">{selectedRecipe.margin}%</p>
                                            <span className="text-emerald-500 text-xl">📈</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                                    {/* Left */}
                                    <div className="xl:col-span-8 space-y-6">

                                        {/* Komposisi Bahan */}
                                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-[#050316]">Komposisi Bahan Baku</h3>
                                                <button
                                                    onClick={() => setShowEditModal(true)}
                                                    className="flex items-center gap-1 text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-[#443dff] hover:bg-[#dddbff] transition-all"
                                                >
                                                    ✏️ Edit Bahan
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider border-b border-[#dddbff]/50 bg-[#fbfbfe]/50">
                                                            <th className="py-3 px-4 text-left">Nama Bahan</th>
                                                            <th className="py-3 px-4 text-left">Kuantitas</th>
                                                            <th className="py-3 px-4 text-left">Harga Satuan</th>
                                                            <th className="py-3 px-4 text-right">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#dddbff]/50">
                                                        {selectedRecipe.ingredients.map((bahan) => {
                                                            const subtotal = bahan.pivot.qty * bahan.price_per_unit
                                                            return (
                                                                <tr key={bahan.id} className="hover:bg-[#dddbff]/10 transition-colors">
                                                                    <td className="py-4 px-4">
                                                                        <p className="font-medium text-[#050316]">{bahan.name}</p>
                                                                        <p className="text-[10px] text-[#2f27ce]/70">ID: {bahan.id}</p>
                                                                    </td>
                                                                    <td className="py-4 px-4 text-[#050316]">
                                                                        {bahan.pivot.qty} {bahan.pivot.unit}
                                                                    </td>
                                                                    <td className="py-4 px-4 text-[#2f27ce]">
                                                                        Rp {Number(bahan.price_per_unit).toLocaleString('id-ID')}
                                                                    </td>
                                                                    <td className="py-4 px-4 font-bold text-[#443dff] text-right">
                                                                        Rp {Number(subtotal).toLocaleString('id-ID')}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="border-t-2 border-[#dddbff]">
                                                            <td colSpan={3} className="pt-4 px-4 text-xs font-bold text-[#2f27ce] uppercase tracking-wider text-right">
                                                                Total Kalkulasi Biaya
                                                            </td>
                                                            <td className="pt-4 px-4 font-bold text-[#050316] text-base text-right">
                                                                Rp {Number(selectedRecipe.total_hpp).toLocaleString('id-ID')}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Struktur Harga */}
                                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                            <h3 className="font-bold text-[#050316] mb-4">Struktur Harga vs Biaya</h3>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                                                    <span className="text-xs text-[#2f27ce]">Cost of Goods Sold (HPP)</span>
                                                </div>
                                                <span className="text-xs font-bold text-[#050316]">{cogsPercent}%</span>
                                            </div>
                                            <div className="w-full bg-[#dddbff]/30 h-3 rounded-full overflow-hidden mb-5 shadow-inner">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${cogsPercent}%` }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-[#fbfbfe] rounded-xl p-4 border border-[#dddbff]">
                                                    <p className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider mb-1">Laba Per Porsi</p>
                                                    <p className="text-xl font-bold text-[#443dff]">
                                                        Rp {Number(profitPerServing).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="bg-gradient-to-br from-[#050316] to-[#2f27ce] rounded-xl p-4 border border-[#2f27ce] shadow-lg shadow-[#2f27ce]/20">
                                                    <p className="text-[10px] font-bold text-[#dddbff] uppercase tracking-wider mb-1">Rekomendasi Harga</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xl font-bold text-white">
                                                            Rp {Number(recommendedPrice).toLocaleString('id-ID')}
                                                        </p>
                                                        <span className="text-[10px] font-bold text-[#050316] bg-emerald-400 px-2 py-0.5 rounded-md">Optimal</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Sidebar */}
                                    <div className="xl:col-span-4 space-y-6">

                                        {/* What-If Simulator */}
                                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                            <div className="flex items-center gap-2 mb-4 border-b border-[#dddbff]/50 pb-4">
                                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500">📊</div>
                                                <h3 className="text-sm font-bold text-[#050316]">Simulator "What-If"</h3>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-xs text-[#2f27ce]">Kenaikan Biaya Bahan (%)</p>
                                                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                                                    +{sliderVal}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0" max="50"
                                                value={sliderVal}
                                                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                                                className="w-full accent-[#443dff] mb-2 cursor-ew-resize h-1.5 bg-[#dddbff] rounded-lg appearance-none"
                                            />
                                            <p className="text-[10px] text-[#2f27ce]/70 italic mb-4">
                                                *Simulasikan kenaikan harga pasar global pada resep ini untuk melihat dampaknya.
                                            </p>
                                            <div className="space-y-3 bg-[#fbfbfe] border border-[#dddbff] p-4 rounded-xl">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-[#2f27ce]">Proyeksi HPP Baru</span>
                                                    <span className="text-xs font-bold text-[#050316]">
                                                        Rp {Math.round(hppBaru).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-[#dddbff]/50 pt-3">
                                                    <span className="text-xs text-[#2f27ce]">Proyeksi Margin</span>
                                                    <span className="text-xs font-bold text-[#050316]">
                                                        {marginBaru.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-[#dddbff]/50 pt-3">
                                                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Impact on Profit</span>
                                                    <span className={`text-xs font-bold flex items-center gap-1 ${impactPersen >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {impactPersen >= 0 ? '↗ +' : '↘ '}{impactPersen}%
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSliderVal(0)}
                                                className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-colors"
                                            >
                                                🔄 Reset Simulasi
                                            </button>
                                        </div>

                                        {/* Opsi Strategis */}
                                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                                            <h3 className="text-sm font-bold text-[#050316] mb-3">Opsi Strategis</h3>
                                            <div className="space-y-2">
                                                {['Update Harga Inventory Global', 'Cetak Laporan Profitabilitas', 'Bandingkan dengan Resep Lain'].map((opsi) => (
                                                    <button
                                                        key={opsi}
                                                        className="w-full flex justify-between items-center py-3 px-4 text-xs font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-colors"
                                                    >
                                                        {opsi}
                                                        <span className="text-[#2f27ce]/50">→</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Peringatan Margin */}
                                        {showWarning && (
                                            <div className="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm p-5 relative overflow-hidden">
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl" />
                                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                                    <span className="text-rose-500 text-xl">⚠️</span>
                                                    <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Peringatan Margin</h3>
                                                </div>
                                                <p className="text-xs text-rose-800 leading-relaxed mb-4 relative z-10">
                                                    Margin pada <span className="font-bold">{menu?.name}</span> mendekati batas minimum 40%.
                                                    Pertimbangkan untuk menaikkan harga jual jika biaya bahan baku naik lebih dari Rp2.000.
                                                </p>
                                                <button className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-rose-100 transition-colors relative z-10">
                                                    Analisis Strategi Harga →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto px-8 py-4 border-t border-[#dddbff] bg-white flex justify-between items-center text-[10px] text-[#2f27ce]/60">
                                <span>© {new Date().getFullYear()} Devora POS v2.4.0</span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-emerald-600">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        System Online
                                    </span>
                                    <span>Support ID: #POS-8821</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center space-y-4 max-w-sm">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#dddbff] to-[#fbfbfe] border border-[#dddbff] rounded-full flex items-center justify-center mx-auto shadow-inner text-5xl">
                                    📖
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#050316]">Belum ada resep</h2>
                                    <p className="text-sm text-[#2f27ce]">Tambahkan resep menu pertama untuk mulai menganalisis margin dan struktur HPP bisnis Anda.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#443dff]/30 active:scale-95 mt-2"
                                >
                                    + Tambah Resep Pertama
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODAL EDIT BAHAN ── */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-bg">
                    <div className="absolute inset-0 bg-[#050316]/50" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-white rounded-2xl border border-[#dddbff] shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-5 border-b border-[#dddbff] flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-[#050316]">Edit Komposisi Bahan</h3>
                                <p className="text-xs text-[#2f27ce]/70 mt-0.5">{selectedRecipe?.menu?.name}</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-xl text-[#2f27ce]/50 hover:bg-[#dddbff] hover:text-[#443dff] transition flex items-center justify-center">✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto px-6 py-4 space-y-3">
                                <div className="grid grid-cols-12 gap-3 px-1">
                                    {['Bahan', 'Qty', 'Satuan', ''].map((h, i) => (
                                        <p key={i} className={`${i === 0 ? 'col-span-5' : i === 3 ? 'col-span-1' : 'col-span-3'} text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider`}>{h}</p>
                                    ))}
                                </div>
                                {ingredients.map((row, index) => (
                                    <IngredientRow
                                        key={index}
                                        row={row}
                                        index={index}
                                        inventories={inventories}
                                        onChange={(field, val) => updateIngredient(index, field, val, true)}
                                        onInventoryChange={(id) => onInventoryChange(index, id, true)}
                                        onRemove={() => removeIngredientRow(index, true)}
                                        canRemove={ingredients.length > 1}
                                    />
                                ))}
                            </div>
                            <div className="px-6 py-4 border-t border-[#dddbff] flex items-center justify-between flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIngredients(prev => [...prev, { inventory_id: '', qty: '', unit: '' }])}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 px-3 py-2 rounded-lg border border-transparent hover:border-[#443dff] hover:bg-[#dddbff] transition-all"
                                >
                                    + Tambah Bahan
                                </button>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-sm font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition">Batal</button>
                                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#443dff] to-[#2f27ce] rounded-xl transition shadow-lg shadow-[#443dff]/30 active:scale-95">
                                        💾 Simpan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL CREATE RESEP ── */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#050316]/50" onClick={() => setShowCreateModal(false)} />
                    <div className="relative bg-white rounded-2xl border border-[#dddbff] shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-5 border-b border-[#dddbff] flex items-center justify-between flex-shrink-0">
                            <h3 className="font-bold text-[#050316]">Tambah Resep Baru</h3>
                            <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-xl text-[#2f27ce]/50 hover:bg-[#dddbff] hover:text-[#443dff] transition flex items-center justify-center">✕</button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto px-6 py-4 space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider">Menu</label>
                                    <select
                                        value={createForm.menu_id}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, menu_id: e.target.value }))}
                                        required
                                        className="mt-1 w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] transition-all"
                                    >
                                        <option value="" disabled>-- Pilih menu --</option>
                                        {menus.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="px-6 pt-4">
                                    <label className="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider">Catatan (opsional)</label>
                                    <textarea
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        rows={2}
                                        placeholder="Contoh: versi summer, tanpa gula, dll..."
                                        className="mt-1 w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] transition-all resize-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-12 gap-3 px-1">
                                        {['Bahan', 'Qty', 'Satuan', ''].map((h, i) => (
                                            <p key={i} className={`${i === 0 ? 'col-span-5' : i === 3 ? 'col-span-1' : 'col-span-3'} text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider`}>{h}</p>
                                        ))}
                                    </div>
                                    {createForm.ingredients.map((row, index) => (
                                        <IngredientRow
                                            key={index}
                                            row={row}
                                            index={index}
                                            inventories={inventories}
                                            onChange={(field, val) => updateIngredient(index, field, val, false)}
                                            onInventoryChange={(id) => onInventoryChange(index, id, false)}
                                            onRemove={() => removeIngredientRow(index, false)}
                                            canRemove={createForm.ingredients.length > 1}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-[#dddbff] flex items-center justify-between flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => addIngredientRow(setCreateForm)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 px-3 py-2 rounded-lg border border-transparent hover:border-[#443dff] hover:bg-[#dddbff] transition-all"
                                >
                                    + Tambah Bahan
                                </button>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-sm font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition">Batal</button>
                                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#443dff] to-[#2f27ce] rounded-xl transition shadow-lg shadow-[#443dff]/30 active:scale-95">
                                        💾 Simpan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

RecipeIndex.layout = (page) => <AppLayout>{page}</AppLayout>;

// Sub-component baris ingredient (reusable untuk edit & create)
function IngredientRow({ row, inventories, onChange, onInventoryChange, onRemove, canRemove }) {
    return (
        <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-5">
                <select
                    value={row.inventory_id}
                    onChange={(e) => onInventoryChange(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] transition-all"
                >
                    <option value="" disabled>-- Pilih bahan --</option>
                    {inventories.map(inv => (
                        <option key={inv.id} value={inv.id}>
                            {inv.name} (Rp {Number(inv.price).toLocaleString('id-ID')}/{inv.unit})
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-span-3">
                <input
                    type="number"
                    value={row.qty}
                    onChange={(e) => onChange('qty', e.target.value)}
                    min="0.01" step="0.01" placeholder="Qty" required
                    className="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] transition-all"
                />
            </div>
            <div className="col-span-3">
                <input
                    type="text"
                    value={row.unit}
                    onChange={(e) => onChange('unit', e.target.value)}
                    placeholder="g, ml..." required
                    className="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:border-[#443dff] transition-all"
                />
            </div>
            <div className="col-span-1 flex justify-center">
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    🗑
                </button>
            </div>
        </div>
    )
}

