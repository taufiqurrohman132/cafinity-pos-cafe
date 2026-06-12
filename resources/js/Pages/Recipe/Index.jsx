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
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data resep dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
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

            <div className="flex h-[calc(100vh-72px)] bg-brand-bg overflow-hidden">

                {/* ── SIDEBAR KIRI ── */}
                <div className="w-80 min-w-[280px] bg-white border-r border-brand-light flex flex-col z-10 shadow-[10px_0_30px_rgb(var(--color-brand-primary)/0.03)]">
                    <div className="p-5 border-b border-brand-light/50 flex items-center justify-between bg-brand-bg/50">
                        <h2 className="text-lg font-bold text-brand-dark">Katalog Resep</h2>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-8 h-8 bg-gradient-to-br from-brand-secondary to-brand-primary hover:from-brand-primary hover:to-brand-dark text-white rounded-xl flex items-center justify-center font-bold text-lg transition-all shadow-md shadow-brand-secondary/30 active:scale-95"
                        >
                            +
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-4 pt-5 pb-2">
                        <div className="relative">
                            <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary/70 text-sm"></iconify-icon>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari resep menu..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                        <p className="text-[10px] font-bold text-brand-primary capitalize tracking-widest mb-3 pl-1">Terakhir Diupdate</p>

                        {filteredRecipes.map((resep) => {
                            const isActive = selectedRecipe?.id === resep.id
                            return (
                                <Link
                                    key={resep.id}
                                    to={`/recipe-costing?id=${resep.id}`}
                                    className="block focus:outline-none focus:ring-2 focus:ring-brand-secondary rounded-xl"
                                >
                                    <div className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-br from-brand-secondary to-brand-primary border-transparent shadow-lg shadow-brand-secondary/20'
                                        : 'bg-white border border-brand-light hover:border-brand-secondary hover:shadow-md'
                                        }`}>
                                        {isActive && (
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full blur-xl -mr-5 -mt-5 pointer-events-none" />
                                        )}
                                        <div className="flex justify-between items-start mb-1.5 relative z-10">
                                            <p className={`text-sm font-bold line-clamp-1 pr-2 ${isActive ? 'text-white' : 'text-brand-dark group-hover:text-brand-secondary transition-colors'}`}>
                                                {resep.menu?.name ?? 'Menu Dihapus'}
                                            </p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-brand-dark/20 text-white border border-white/10' : 'bg-brand-light/50 text-brand-primary border border-brand-light'
                                                }`}>
                                                {resep.margin}%
                                            </span>
                                        </div>
                                        <p className={`text-[10px] font-semibold mb-2 relative z-10 ${isActive ? 'text-brand-light' : 'text-brand-primary/70'}`}>
                                            {(resep.menu?.category?.name ?? 'N/A').toUpperCase()}
                                        </p>
                                        <div className={`flex justify-between items-center relative z-10 mt-2 pt-2 border-t ${isActive ? 'border-white/25' : 'border-brand-light'}`}>
                                            <span className={`text-[10px] ${isActive ? 'text-brand-light' : 'text-brand-primary/70'}`}>
                                                HPP: Rp {Number(resep.total_hpp).toLocaleString('id-ID')}
                                            </span>
                                            <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-brand-dark'}`}>
                                                Rp {Number(resep.menu?.price ?? 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="p-4 border-t border-brand-light bg-brand-bg text-[10px] text-brand-primary/50 text-center">
                        © {new Date().getFullYear()} Devora POS v2.4.0
                    </div>
                </div>

                {/* ── KONTEN UTAMA ── */}
                <div className="flex-1 overflow-y-auto flex flex-col bg-brand-bg">

                    {selectedRecipe ? (
                        <>
                            {/* Top Bar */}
                            <div className="bg-white/80 backdrop-blur-md border-b border-brand-light px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h1 className="text-2xl font-bold text-brand-dark">{menu?.name ?? 'Menu Dihapus'}</h1>
                                        <span className="text-xs font-semibold text-brand-secondary bg-brand-light/30 border border-brand-light px-3 py-1 rounded-full">
                                            {(menu?.category?.name ?? 'N/A').toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-brand-primary flex items-center gap-1">
                                        <iconify-icon icon="solar:info-circle-linear" class="text-sm text-brand-primary"></iconify-icon> Terakhir disinkronisasi dengan harga inventory: 2 jam yang lalu
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {menu?.id && (
                                        <Link
                                            to={`/menus?edit=${menu.id}`}
                                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary rounded-xl transition-all shadow-md shadow-brand-secondary/30 active:scale-95"
                                        >
                                            Edit Menu
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">

                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-brand-light/50 to-white border border-brand-light rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                        <iconify-icon icon="solar:wallet-money-linear" class="absolute -right-4 -bottom-4 text-6xl opacity-10 text-brand-secondary"></iconify-icon>
                                        <p className="text-[10px] font-bold text-brand-primary capitalize tracking-widest mb-2">Total HPP</p>
                                        <p className="text-2xl font-bold text-brand-dark relative z-10">
                                            Rp {Number(selectedRecipe.total_hpp).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm">
                                        <p className="text-[10px] font-bold text-brand-primary capitalize tracking-widest mb-2">Harga Jual</p>
                                        <p className="text-2xl font-bold text-brand-dark">
                                            Rp {Number(menu?.price ?? 0).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm">
                                        <p className="text-[10px] font-bold text-brand-primary capitalize tracking-widest mb-2">Margin Kotor</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-bold text-brand-dark">{selectedRecipe.margin}%</p>
                                            <iconify-icon icon="solar:graph-up-linear" class="text-[#059669] text-xl"></iconify-icon>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                                    {/* Left */}
                                    <div className="xl:col-span-8 space-y-6">

                                        {/* Komposisi Bahan */}
                                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-brand-dark">Komposisi Bahan Baku</h3>
                                                <button
                                                    onClick={() => setShowEditModal(true)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-secondary bg-brand-light/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-brand-secondary hover:bg-brand-light transition-all"
                                                >
                                                    <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon> Edit Bahan
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-[10px] font-bold text-brand-primary capitalize tracking-wider border-b border-brand-light/50 bg-brand-bg/50">
                                                            <th className="py-3 px-4 text-left">Nama Bahan</th>
                                                            <th className="py-3 px-4 text-left">Kuantitas</th>
                                                            <th className="py-3 px-4 text-left">Harga Satuan</th>
                                                            <th className="py-3 px-4 text-right">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-brand-light/50">
                                                        {selectedRecipe.ingredients.map((bahan) => {
                                                            const subtotal = bahan.pivot.qty * bahan.price_per_unit
                                                            return (
                                                                <tr key={bahan.id} className="hover:bg-brand-light/10 transition-colors">
                                                                    <td className="py-4 px-4">
                                                                        <p className="font-medium text-brand-dark">{bahan.name}</p>
                                                                        <p className="text-[10px] text-brand-primary/70">ID: {bahan.id}</p>
                                                                    </td>
                                                                    <td className="py-4 px-4 text-brand-dark">
                                                                        {bahan.pivot.qty} {bahan.pivot.unit}
                                                                    </td>
                                                                    <td className="py-4 px-4 text-brand-primary">
                                                                        Rp {Number(bahan.price_per_unit).toLocaleString('id-ID')}
                                                                    </td>
                                                                    <td className="py-4 px-4 font-bold text-brand-secondary text-right">
                                                                        Rp {Number(subtotal).toLocaleString('id-ID')}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="border-t-2 border-brand-light">
                                                            <td colSpan={3} className="pt-4 px-4 text-xs font-bold text-brand-primary capitalize tracking-wider text-right">
                                                                Total Kalkulasi Biaya
                                                            </td>
                                                            <td className="pt-4 px-4 font-bold text-brand-dark text-base text-right">
                                                                Rp {Number(selectedRecipe.total_hpp).toLocaleString('id-ID')}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Struktur Harga */}
                                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6">
                                            <h3 className="font-bold text-brand-dark mb-4">Struktur Harga vs Biaya</h3>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-[#059669] inline-block" />
                                                    <span className="text-xs text-brand-primary">Cost of Goods Sold (HPP)</span>
                                                </div>
                                                <span className="text-xs font-bold text-brand-dark">{cogsPercent}%</span>
                                            </div>
                                            <div className="w-full bg-brand-light/30 h-3 rounded-full overflow-hidden mb-5 shadow-inner">
                                                <div
                                                    className="bg-gradient-to-r from-[#10b981] to-[#059669] h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${cogsPercent}%` }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-brand-bg rounded-xl p-4 border border-brand-light">
                                                    <p className="text-[10px] font-bold text-brand-primary capitalize tracking-wider mb-1">Laba Per Porsi</p>
                                                    <p className="text-xl font-bold text-brand-secondary">
                                                        Rp {Number(profitPerServing).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="bg-gradient-to-br from-brand-dark to-brand-primary rounded-xl p-4 border border-brand-primary shadow-lg shadow-brand-primary/20">
                                                    <p className="text-[10px] font-bold text-brand-light capitalize tracking-wider mb-1">Rekomendasi Harga</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xl font-bold text-white">
                                                            Rp {Number(recommendedPrice).toLocaleString('id-ID')}
                                                        </p>
                                                        <span className="text-[10px] font-bold text-[#065f46] bg-[#ecfdf5] border border-[#d1fae5] px-2 py-0.5 rounded-md">Optimal</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Sidebar */}
                                    <div className="xl:col-span-4 space-y-6">

                                        {/* What-If Simulator */}
                                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 transition-all duration-300 hover:shadow-md">
                                            <div className="flex items-center gap-2 mb-4 border-b border-brand-light/50 pb-4">
                                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500">
                                                    <iconify-icon icon="solar:chart-2-linear" class="text-lg"></iconify-icon>
                                                </div>
                                                <h3 className="text-sm font-bold text-brand-dark">Simulator "What-If"</h3>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-xs font-medium text-brand-primary">Kenaikan Biaya Bahan</p>
                                                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
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
                                                        background: `linear-gradient(to right, rgb(var(--color-brand-secondary)) 0%, rgb(var(--color-brand-secondary)) ${sliderVal * 2}%, rgb(var(--color-brand-light)) ${sliderVal * 2}%, rgb(var(--color-brand-light)) 100%)`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-brand-primary/70 italic mb-4 leading-normal">
                                                *Simulasikan kenaikan harga pasar global pada resep ini untuk melihat dampaknya pada margin profit.
                                            </p>
                                            <div className="space-y-3 bg-brand-bg border border-brand-light p-4 rounded-xl">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-brand-primary">Proyeksi HPP Baru</span>
                                                    <span className="text-xs font-bold text-brand-dark">
                                                        Rp {Math.round(hppBaru).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-brand-light/50 pt-3">
                                                    <span className="text-xs text-brand-primary">Proyeksi Margin</span>
                                                    <span className="text-xs font-bold text-brand-dark">
                                                        {marginBaru.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-brand-light/50 pt-3">
                                                    <span className="text-[10px] font-bold text-[#b91c1c] capitalize tracking-wider">Dampak pada Profit</span>
                                                    <span className={`text-xs font-bold flex items-center gap-1 ${impactPersen >= 0 ? 'text-[#059669]' : 'text-[#b91c1c]'}`}>
                                                        {impactPersen >= 0 ? '↗ +' : '↘ '}{impactPersen}%
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSliderVal(0)}
                                                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-brand-dark border border-brand-light rounded-xl hover:bg-brand-light/50 active:scale-[0.98] transition-all"
                                            >
                                                <iconify-icon icon="solar:restart-circle-linear" class="text-base"></iconify-icon> Reset Simulasi
                                            </button>
                                        </div>

                                        {/* Opsi Strategis */}
                                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5">
                                            <h3 className="text-sm font-bold text-brand-dark mb-3">Opsi Strategis</h3>
                                            <div className="space-y-2">
                                                {['Update Harga Inventory Global', 'Cetak Laporan Profitabilitas', 'Bandingkan dengan Resep Lain'].map((opsi) => (
                                                    <button
                                                        key={opsi}
                                                        className="w-full flex justify-between items-center py-3 px-4 text-xs font-semibold text-brand-dark border border-brand-light rounded-xl hover:bg-brand-light transition-colors"
                                                    >
                                                        {opsi}
                                                        <span className="text-brand-primary/50">→</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Peringatan Margin */}
                                        {showWarning && (
                                            <div className="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm p-5 relative overflow-hidden">
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl" />
                                                <div className="flex items-center gap-2 mb-3 relative z-10">
                                                    <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-xl"></iconify-icon>
                                                    <h3 className="text-xs font-bold text-rose-500 capitalize tracking-wider">Peringatan Margin</h3>
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
                            <div className="mt-auto px-8 py-4 border-t border-brand-light bg-white flex justify-between items-center text-[10px] text-brand-primary/60">
                                <span>© {new Date().getFullYear()} Devora POS v2.4.0</span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-[#059669]">
                                        <span className="w-2 h-2 bg-[#059669] rounded-full animate-pulse" />
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
                                <div className="w-24 h-24 bg-gradient-to-br from-brand-light to-brand-bg border border-brand-light rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <iconify-icon icon="solar:notebook-linear" class="text-5xl text-brand-secondary"></iconify-icon>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-brand-dark">Belum ada resep</h2>
                                    <p className="text-sm text-brand-primary">Tambahkan resep menu pertama untuk mulai menganalisis margin dan struktur HPP bisnis Anda.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-primary hover:to-brand-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-secondary/30 active:scale-95 mt-2"
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
                    <div className="absolute inset-0 bg-brand-dark/50" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-white rounded-2xl border border-brand-light shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-5 border-b border-brand-light flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-brand-dark">Edit Komposisi Bahan</h3>
                                <p className="text-xs text-brand-primary/70 mt-0.5">{selectedRecipe?.menu?.name}</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-xl text-brand-primary/50 hover:bg-brand-light hover:text-brand-secondary transition flex items-center justify-center">✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto px-6 py-4 space-y-3">
                                <div className="grid grid-cols-12 gap-3 px-1">
                                    {['Bahan', 'Qty', 'Satuan', ''].map((h, i) => (
                                        <p key={i} className={`${i === 0 ? 'col-span-5' : i === 3 ? 'col-span-1' : 'col-span-3'} text-[10px] font-bold text-brand-primary capitalize tracking-wider`}>{h}</p>
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
                            <div className="px-6 py-4 border-t border-brand-light flex items-center justify-between flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIngredients(prev => [...prev, { inventory_id: '', qty: '', unit: '' }])}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-secondary bg-brand-light/30 px-3 py-2 rounded-lg border border-transparent hover:border-brand-secondary hover:bg-brand-light transition-all"
                                >
                                    + Tambah Bahan
                                </button>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-sm font-semibold text-brand-dark border border-brand-light rounded-xl hover:bg-brand-light transition">Batal</button>
                                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl transition shadow-lg shadow-brand-secondary/30 active:scale-95">
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
                    <div className="absolute inset-0 bg-brand-dark/50" onClick={() => setShowCreateModal(false)} />
                    <div className="relative bg-white rounded-2xl border border-brand-light shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-5 border-b border-brand-light flex items-center justify-between flex-shrink-0">
                            <h3 className="font-bold text-brand-dark">Tambah Resep Baru</h3>
                            <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-xl text-brand-primary/50 hover:bg-brand-light hover:text-brand-secondary transition flex items-center justify-center">✕</button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto px-6 py-4 space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-brand-primary capitalize tracking-wider">Menu</label>
                                    <select
                                        value={createForm.menu_id}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, menu_id: e.target.value }))}
                                        required
                                        className="mt-1 w-full px-3 py-2.5 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary transition-all"
                                    >
                                        <option value="" disabled>-- Pilih menu --</option>
                                        {menus.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="px-6 pt-4">
                                    <label className="text-[10px] font-bold text-brand-primary capitalize tracking-wider">Catatan (opsional)</label>
                                    <textarea
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        rows={2}
                                        placeholder="Contoh: versi summer, tanpa gula, dll..."
                                        className="mt-1 w-full px-3 py-2.5 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary transition-all resize-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-12 gap-3 px-1">
                                        {['Bahan', 'Qty', 'Satuan', ''].map((h, i) => (
                                            <p key={i} className={`${i === 0 ? 'col-span-5' : i === 3 ? 'col-span-1' : 'col-span-3'} text-[10px] font-bold text-brand-primary capitalize tracking-wider`}>{h}</p>
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
                            <div className="px-6 py-4 border-t border-brand-light flex items-center justify-between flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => addIngredientRow(setCreateForm)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-secondary bg-brand-light/30 px-3 py-2 rounded-lg border border-transparent hover:border-brand-secondary hover:bg-brand-light transition-all"
                                >
                                    + Tambah Bahan
                                </button>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-sm font-semibold text-brand-dark border border-brand-light rounded-xl hover:bg-brand-light transition">Batal</button>
                                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl transition shadow-lg shadow-brand-secondary/30 active:scale-95">
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
                    className="w-full px-3 py-2.5 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary transition-all"
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
                    className="w-full px-3 py-2.5 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary transition-all"
                />
            </div>
            <div className="col-span-3">
                <input
                    type="text"
                    value={row.unit}
                    onChange={(e) => onChange('unit', e.target.value)}
                    placeholder="g, ml..." required
                    className="w-full px-3 py-2.5 text-sm bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:border-brand-secondary transition-all"
                />
            </div>
            <div className="col-span-1 flex justify-center">
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-lg"></iconify-icon>
                </button>
            </div>
        </div>
    )
}

