// Recipe/Index.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Head from '@/Components/Head'
import client from '@/api/client'
import RecipeSkeleton from '@/Components/Skeletons/RecipeSkeleton'

export default function RecipeIndex() {
    const location = useLocation()
    const navigate = useNavigate()
    const [recipes, setRecipes] = useState([])
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [inventories, setInventories] = useState([])
    const [menus, setMenus] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await client.get(`/recipe-costing${location.search}`)
                setRecipes(res.data.recipes || [])
                setSelectedRecipe(res.data.selectedRecipe || null)
                setInventories(res.data.inventories || [])
                setMenus(res.data.menus || [])
                setError(null)
            } catch (err) {
                console.error("Gagal memuat resep:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [location.search, refreshTrigger])

    const hppBaru = baseHpp * (1 + sliderVal / 100)
    const marginBaru = hargaJual > 0 ? ((hargaJual - hppBaru) / hargaJual * 100) : 0
    const impactPersen = (marginBaru - baseMargin).toFixed(1)

    // Edit modal ingredients state
    const [ingredients, setIngredients] = useState([])
    const [editNotes, setEditNotes] = useState('')

    // Create modal state
    const [createForm, setCreateForm] = useState({
        menu_id: '',
        notes: '',
        ingredients: [{ inventory_id: '', qty: '', unit: '' }],
    })

    const filteredRecipes = recipes.filter(r =>
        r.menu?.name?.toLowerCase().includes(search.toLowerCase())
    )

    async function handleEditSubmit(e) {
        e.preventDefault()
        try {
            await client.put(`/recipe-costing/${selectedRecipe.id}`, {
                notes: editNotes,
                ingredients,
            })
            setShowEditModal(false)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menyimpan resep:", err)
            alert("Gagal menyimpan resep.")
        }
    }

    async function handleCreateSubmit(e) {
        e.preventDefault()
        try {
            const res = await client.post('/recipe-costing', createForm)
            setShowCreateModal(false)
            setCreateForm({ menu_id: '', notes: '', ingredients: [{ inventory_id: '', qty: '', unit: '' }] })
            if (res.data.recipe) {
                navigate(`/recipe-costing?id=${res.data.recipe.id}`)
            } else {
                setRefreshTrigger(prev => prev + 1)
            }
        } catch (err) {
            console.error("Gagal membuat resep:", err)
            alert("Gagal membuat resep.")
        }
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

    if (loading && recipes.length === 0) {
        return (
            <>
                <Head title="Recipe Costing" />
                <RecipeSkeleton />
            </>
        )
    }

    if (error && recipes.length === 0) {
        return (
            <>
                <Head title="Recipe Costing" />
                <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]/30 p-4">
                    <div className="bg-white p-8 rounded-3xl border border-[#E6E6E6] max-w-md w-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-[#FF3B30] text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-base font-semibold text-black mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-[#666666] mb-6">
                            Gagal memuat data resep dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-[#BFFF00] hover:bg-[#C8FF5E] text-black py-2.5 rounded-xl font-semibold shadow-md active:scale-[0.97] transition-all">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Head title="Recipe Costing" />

            <div className="flex h-[calc(100vh-72px)] bg-[#E6E6E6]/30 overflow-hidden">

                {/* ── SIDEBAR KIRI ── */}
                <div className="w-80 min-w-[280px] bg-white border-r border-[#E6E6E6] flex flex-col z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
                    <div className="p-5 border-b border-[#E6E6E6] flex items-center justify-between bg-white">
                        <h2 className="text-base font-semibold text-black">Katalog Resep</h2>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-9 h-9 bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black rounded-xl flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.97]"
                            title="Tambah"
                        >
                            <iconify-icon icon="solar:add-circle-linear" class="text-lg"></iconify-icon>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-4 pt-5 pb-2">
                        <div className="relative">
                            <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] text-sm"></iconify-icon>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari resep menu..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 text-black placeholder-[#999999] transition-all"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                        <p className="text-xs font-bold text-[#666666] capitalize tracking-widest mb-3 pl-1">Terakhir Diupdate</p>

                        {filteredRecipes.map((resep) => {
                            const isActive = selectedRecipe?.id === resep.id
                            return (
                                <Link
                                    key={resep.id}
                                    to={`/recipe-costing?id=${resep.id}`}
                                    className="block focus:outline-none focus:ring-2 focus:ring-[#BFFF00]/20 rounded-xl"
                                >
                                    <div className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-[#0E0E0E] text-white border-transparent shadow-[0_0_12px_rgba(191,255,0,0.15)]'
                                        : 'bg-white border border-[#D0D0D0] hover:border-[#BFFF00] hover:shadow-md text-black'
                                        }`}>
                                        {isActive && (
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full blur-xl -mr-5 -mt-5 pointer-events-none" />
                                        )}
                                        <div className="flex justify-between items-start mb-1.5 relative z-10">
                                            <p className={`text-sm font-semibold line-clamp-1 pr-2 ${isActive ? 'text-white' : 'text-black group-hover:text-black transition-colors'}`}>
                                                {resep.menu?.name ?? 'Menu Dihapus'}
                                            </p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-[#1A1A1A] text-[#BFFF00] border border-[#BFFF00]/40' : 'bg-[#E6E6E6] text-black border border-[#D0D0D0]'
                                                }`}>
                                                {resep.margin}%
                                            </span>
                                        </div>
                                        <p className={`text-[10px] font-medium mb-2 relative z-10 ${isActive ? 'text-[#999999]' : 'text-[#666666]'}`}>
                                            {resep.menu?.category?.name ?? 'N/A'}
                                        </p>
                                        <div className={`flex justify-between items-center relative z-10 mt-2 pt-2 border-t ${isActive ? 'border-[#BFFF00]/40' : 'border-[#E6E6E6]'}`}>
                                            <span className={`text-[10px] ${isActive ? 'text-[#999999]' : 'text-[#666666]'}`}>
                                                HPP: <span className={`font-bold ${isActive ? 'text-white' : 'text-black'}`}>Rp {Number(resep.total_hpp).toLocaleString('id-ID')}</span>
                                            </span>
                                            <span className={`text-xs font-semibold ${isActive ? 'text-[#BFFF00]' : 'text-black'}`}>
                                                Rp {Number(resep.menu?.price ?? 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="p-4 border-t border-[#E6E6E6] bg-white text-[10px] text-[#999999] text-center">
                        © {new Date().getFullYear()} Devora POS v2.4.0
                    </div>
                </div>

                {/* ── KONTEN UTAMA ── */}
                <div className="flex-1 overflow-y-auto flex flex-col bg-[#E6E6E6]/30">

                    {selectedRecipe ? (
                        <>
                            {/* Top Bar */}
                            <div className="bg-white/80 backdrop-blur-md border-b border-[#E6E6E6] px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h1 className="text-3xl font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-black to-[#333333]">{menu?.name ?? 'Menu Dihapus'}</h1>
                                        <span className="text-xs font-semibold text-black bg-[#E6E6E6] border border-[#D0D0D0] px-3 py-1 rounded-full">
                                            {menu?.category?.name ?? 'N/A'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#666666] flex items-center gap-1 font-normal">
                                        <iconify-icon icon="solar:info-circle-linear" class="text-sm text-[#666666]"></iconify-icon> Terakhir disinkronisasi dengan harga inventory: 2 jam yang lalu
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {menu?.id && (
                                        <Link
                                            to={`/menus?edit=${menu.id}`}
                                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] active:scale-95"
                                        >
                                            Edit Menu
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">

                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),_0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 relative overflow-hidden group">
                                        <iconify-icon icon="solar:wallet-money-linear" class="absolute -right-4 -bottom-4 text-6xl opacity-10 text-black"></iconify-icon>
                                        <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Total HPP</p>
                                        <p className="text-2xl font-bold text-black relative z-10">
                                            Rp {Number(selectedRecipe.total_hpp).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),_0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 relative overflow-hidden group">
                                        <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Harga Jual</p>
                                        <p className="text-2xl font-bold text-black">
                                            Rp {Number(menu?.price ?? 0).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),_0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 relative overflow-hidden group">
                                        <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Margin Kotor</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-bold text-black">{selectedRecipe.margin}%</p>
                                            <iconify-icon icon="solar:graph-up-linear" class="text-emerald-700 text-xl"></iconify-icon>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                                    {/* Left */}
                                    <div className="xl:col-span-8 space-y-6">

                                        {/* Komposisi Bahan */}
                                        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                                            <div className="flex justify-between items-center px-6 py-5">
                                                <h3 className="text-base font-semibold text-black">Komposisi Bahan Baku</h3>
                                                <button
                                                    onClick={() => setShowEditModal(true)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-black bg-transparent border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] px-3 py-1.5 rounded-xl transition-all active:scale-[0.97]"
                                                >
                                                    <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon> Edit Bahan
                                                </button>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-[#E6E6E6]/20 border-b border-[#E6E6E6]">
                                                            <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#999999]">Nama Bahan</th>
                                                            <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#999999]">Kuantitas</th>
                                                            <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#999999]">Harga Satuan</th>
                                                            <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#999999]">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#E6E6E6]/50">
                                                        {selectedRecipe.ingredients.map((bahan) => {
                                                            const subtotal = bahan.pivot.qty * bahan.price_per_unit
                                                            return (
                                                                <tr key={bahan.id} className="hover:bg-[#E6E6E6]/30 active:bg-[#E6E6E6]/60 transition-all duration-200">
                                                                    <td className="px-6 py-4">
                                                                        <p className="text-[13px] font-medium text-[#000000]">{bahan.name}</p>
                                                                        <p className="text-[12px] font-semibold text-[#999999] font-mono mt-0.5">#{bahan.id}</p>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-[13px] text-[#666666]">
                                                                        {bahan.pivot.qty} {bahan.pivot.unit}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-[14px] font-semibold text-[#000000]">
                                                                        Rp {Number(bahan.price_per_unit).toLocaleString('id-ID')}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-[14px] font-semibold text-[#000000] text-right">
                                                                        Rp {Number(subtotal).toLocaleString('id-ID')}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="border-t border-[#E6E6E6] bg-[#E6E6E6]/20">
                                                            <td colSpan={3} className="px-6 py-4 text-[11px] font-bold text-[#999999] uppercase tracking-wider text-right">
                                                                Total Kalkulasi Biaya
                                                            </td>
                                                            <td className="px-6 py-4 text-[14px] font-semibold text-[#000000] text-right">
                                                                Rp {Number(selectedRecipe.total_hpp).toLocaleString('id-ID')}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Struktur Harga */}
                                        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
                                            <h3 className="text-base font-semibold text-black mb-4">Struktur Harga vs Biaya</h3>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-[#1A1A1A] inline-block" />
                                                    <span className="text-xs text-[#666666] font-medium">Cost of Goods Sold (HPP)</span>
                                                </div>
                                                <span className="text-xs font-semibold text-black">{cogsPercent}%</span>
                                            </div>
                                            <div className="w-full bg-[#E6E6E6] h-3 rounded-full overflow-hidden mb-5 shadow-inner">
                                                <div
                                                    className="bg-[#1A1A1A] h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${cogsPercent}%` }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-[#E6E6E6]/40 rounded-xl p-4 border border-[#D0D0D0]">
                                                    <p className="text-xs font-bold text-[#666666] capitalize tracking-wider mb-1">Laba Per Porsi</p>
                                                    <p className="text-lg font-bold text-black">
                                                        Rp {Number(profitPerServing).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="bg-[#0E0E0E] text-white rounded-xl p-4 border border-black shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                                                    <p className="text-xs font-bold text-[#999999] capitalize tracking-wider mb-1">Rekomendasi Harga</p>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-lg font-bold text-[#BFFF00]">
                                                            Rp {Number(recommendedPrice).toLocaleString('id-ID')}
                                                        </p>
                                                        <span className="text-[10px] font-semibold text-black bg-[#BFFF00] px-2 py-0.5 rounded-md">Optimal</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Sidebar */}
                                    <div className="xl:col-span-4 space-y-6">

                                        {/* What-If Simulator */}
                                        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                                            <div className="flex items-center gap-2 mb-4 border-b border-[#E6E6E6] pb-4">
                                                <div className="w-8 h-8 rounded-lg bg-[#E6E6E6]/50 flex items-center justify-center text-black">
                                                    <iconify-icon icon="solar:chart-2-linear" class="text-lg"></iconify-icon>
                                                </div>
                                                <h3 className="text-base font-semibold text-black">Simulator "What-If"</h3>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-xs font-medium text-[#666666]">Kenaikan Biaya Bahan</p>
                                                <span className="text-xs font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2.5 py-1 rounded-lg border border-[#FF3B30]/20">
                                                    +{sliderVal}%
                                                </span>
                                            </div>
                                            <div className="relative mb-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50"
                                                    value={sliderVal}
                                                    onChange={(e) => setSliderVal(parseInt(e.target.value))}
                                                    className="custom-slider w-full cursor-ew-resize appearance-none"
                                                    style={{
                                                        background: `linear-gradient(to right, #BFFF00 0%, #BFFF00 ${sliderVal * 2}%, #E6E6E6 ${sliderVal * 2}%, #E6E6E6 100%)`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-[#666666] italic mb-4 leading-normal">
                                                *Simulasikan kenaikan harga pasar global pada resep ini untuk melihat dampaknya pada margin profit.
                                            </p>
                                            <div className="space-y-3 bg-[#E6E6E6]/30 border border-[#D0D0D0] p-4 rounded-xl">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-[#666666]">Proyeksi HPP Baru</span>
                                                    <span className="text-sm font-semibold text-black">
                                                        Rp {Math.round(hppBaru).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-[#D0D0D0]/50 pt-3">
                                                    <span className="text-xs text-[#666666]">Proyeksi Margin</span>
                                                    <span className="text-sm font-semibold text-black">
                                                        {marginBaru.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-[#D0D0D0]/50 pt-3">
                                                    <span className="text-[10px] font-semibold text-[#FF3B30] uppercase tracking-wider">Dampak pada Profit</span>
                                                    <span className={`text-sm font-semibold flex items-center gap-1 ${impactPersen >= 0 ? 'text-emerald-700' : 'text-[#FF3B30]'}`}>
                                                        {impactPersen >= 0 ? '↗ +' : '↘ '}{impactPersen}%
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSliderVal(0)}
                                                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-black border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] active:scale-[0.98] transition-all"
                                            >
                                                <iconify-icon icon="solar:restart-circle-linear" class="text-base"></iconify-icon> Reset Simulasi
                                            </button>
                                        </div>

                                        {/* Opsi Strategis */}
                                        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5">
                                            <h3 className="text-base font-semibold text-black mb-3">Opsi Strategis</h3>
                                            <div className="space-y-2">
                                                {['Update Harga Inventory Global', 'Cetak Laporan Profitabilitas', 'Bandingkan dengan Resep Lain'].map((opsi) => (
                                                    <button
                                                        key={opsi}
                                                        className="w-full flex justify-between items-center py-3 px-4 text-xs font-semibold text-black border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] active:scale-[0.98] transition-colors"
                                                    >
                                                        {opsi}
                                                        <span className="text-[#999999]">→</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Peringatan Margin */}
                                        {showWarning && (
                                            <div className="bg-[#FF3B30]/5 rounded-2xl border border-[#FF3B30]/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-5 relative overflow-hidden">
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#FF3B30]/10 rounded-full blur-xl" />
                                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                                    <iconify-icon icon="solar:danger-triangle-linear" class="text-[#FF3B30] text-xl"></iconify-icon>
                                                    <h3 className="text-xs font-semibold text-[#FF3B30] uppercase tracking-wider">Peringatan Margin</h3>
                                                </div>
                                                <p className="text-xs text-black/80 leading-relaxed mb-4 relative z-10">
                                                    Margin pada <span className="font-bold">{menu?.name}</span> mendekati batas minimum 40%.
                                                    Pertimbangkan untuk menaikkan harga jual jika biaya bahan baku naik lebih dari Rp2.000.
                                                </p>
                                                <button className="text-xs font-semibold text-[#FF3B30] hover:bg-[#FF3B30]/5 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#FF3B30]/20 shadow-sm transition-colors relative z-10 active:scale-[0.98]">
                                                    Analisis Strategi Harga →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto px-8 py-4 border-t border-[#E6E6E6] bg-white flex justify-between items-center text-[10px] text-[#999999]">
                                <span>© {new Date().getFullYear()} Devora POS v2.4.0</span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-emerald-700">
                                        <span className="w-2 h-2 bg-emerald-700 rounded-full animate-pulse" />
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
                                <div className="w-24 h-24 bg-gradient-to-br from-[#E6E6E6]/50 to-white border border-[#E6E6E6] rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <iconify-icon icon="solar:notebook-linear" class="text-5xl text-black"></iconify-icon>
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-black">Belum ada resep</h2>
                                    <p className="text-sm text-[#666666]">Tambahkan resep menu pertama untuk mulai menganalisis margin dan struktur HPP bisnis Anda.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black font-semibold rounded-xl text-sm transition-all shadow-md active:scale-[0.97] mt-2"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#0E0E0E]/40 backdrop-blur-md" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-white rounded-3xl border border-[#E6E6E6] shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-full max-w-2xl mx-4 flex flex-col h-[90vh] z-10">
                        <div className="px-6 py-5 border-b border-[#E6E6E6] flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-base font-semibold text-black">Edit Komposisi Bahan</h3>
                                <p className="text-xs text-[#666666] mt-0.5 font-normal">{selectedRecipe?.menu?.name}</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-xl text-[#999999] hover:bg-[#E6E6E6] hover:text-black flex items-center justify-center transition-all duration-150 active:scale-[0.98]">✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto px-6 py-4 space-y-3">
                                <div className="grid grid-cols-12 gap-3 px-1">
                                    {['Bahan', 'Qty', 'Satuan', ''].map((h, i) => (
                                        <p key={i} className={`${i === 0 ? 'col-span-5' : i === 3 ? 'col-span-1' : 'col-span-3'} text-xs font-semibold text-[#666666] uppercase tracking-wider`}>{h}</p>
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
                            <div className="px-6 py-4 border-t border-[#E6E6E6] flex items-center justify-between flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIngredients(prev => [...prev, { inventory_id: '', qty: '', unit: '' }])}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-black bg-transparent border border-[#D0D0D0] hover:bg-[#E6E6E6] px-3 py-2 rounded-xl transition-all active:scale-[0.98]"
                                >
                                    + Tambah Bahan
                                </button>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-sm font-semibold text-black border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] transition-all duration-150 active:scale-[0.98]">Batal</button>
                                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all duration-150">
                                        <iconify-icon icon="solar:diskette-linear" class="text-sm"></iconify-icon> Simpan
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
                    <div className="absolute inset-0 bg-[#0E0E0E]/40 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
                    <div className="relative bg-white rounded-3xl border border-[#E6E6E6] shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-full max-w-2xl mx-4 flex flex-col h-[90vh] z-10">
                        <div className="px-6 py-5 border-b border-[#E6E6E6] flex items-center justify-between flex-shrink-0">
                            <h3 className="text-base font-semibold text-black">Tambah Resep Baru</h3>
                            <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-xl text-[#999999] hover:bg-[#E6E6E6] hover:text-black flex items-center justify-center transition-all duration-150 active:scale-[0.98]">✕</button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto px-6 py-4 space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Menu</label>
                                    <select
                                        value={createForm.menu_id}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, menu_id: e.target.value }))}
                                        required
                                        className="mt-1 w-full px-3 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 text-black transition-all cursor-pointer"
                                    >
                                        <option value="" disabled>-- Pilih menu --</option>
                                        {menus.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="px-0 pt-0">
                                    <label className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Catatan (opsional)</label>
                                    <textarea
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        rows={2}
                                        placeholder="Contoh: versi summer, tanpa gula, dll..."
                                        className="mt-1 w-full px-3 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 text-black transition-all resize-none placeholder-[#999999]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-12 gap-3 px-1">
                                        {['Bahan', 'Qty', 'Satuan', ''].map((h, i) => (
                                            <p key={i} className={`${i === 0 ? 'col-span-5' : i === 3 ? 'col-span-1' : 'col-span-3'} text-xs font-semibold text-[#666666] uppercase tracking-wider`}>{h}</p>
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
                            <div className="px-6 py-4 border-t border-[#E6E6E6] flex items-center justify-between flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => addIngredientRow(setCreateForm)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-black bg-transparent border border-[#D0D0D0] hover:bg-[#E6E6E6] px-3 py-2 rounded-xl transition-all active:scale-[0.98]"
                                >
                                    + Tambah Bahan
                                </button>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-sm font-semibold text-black border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] transition-all duration-150 active:scale-[0.98]">Batal</button>
                                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all duration-150">
                                        <iconify-icon icon="solar:diskette-linear" class="text-sm"></iconify-icon> Simpan
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

// Sub-component baris ingredient (reusable untuk edit & create)
function IngredientRow({ row, inventories, onChange, onInventoryChange, onRemove, canRemove }) {
    return (
        <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-5">
                <select
                    value={row.inventory_id}
                    onChange={(e) => onInventoryChange(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 text-black transition-all cursor-pointer"
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
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 text-black transition-all"
                />
            </div>
            <div className="col-span-3">
                <input
                    type="text"
                    value={row.unit}
                    onChange={(e) => onChange('unit', e.target.value)}
                    placeholder="g, ml..." required
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 text-black transition-all"
                />
            </div>
            <div className="col-span-1 flex justify-center">
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="w-8 h-8 rounded-lg text-[#FF3B30] hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]"
                >
                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-lg"></iconify-icon>
                </button>
            </div>
        </div>
    )
}

