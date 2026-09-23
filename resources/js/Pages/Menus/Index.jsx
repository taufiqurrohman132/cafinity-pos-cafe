// Menus/Index.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Head from '@/Components/Head'
import client from '@/api/client'
import MenusSkeleton from '@/Components/Skeletons/MenusSkeleton'
import { useConfirm } from '@/context/ConfirmContext'
import CustomSelect from '@/Components/CustomSelect'

function MenuImage({ src, name, categoryName, isThumbnail = false }) {
    const [hasError, setHasError] = useState(false);

    const renderPlaceholder = () => {
        const lower = (categoryName || '').toLowerCase();
        let icon = 'solar:widget-linear';
        if (lower.includes('kopi') || lower.includes('coffee')) icon = 'solar:cup-hot-linear';
        else if (lower.includes('non')) icon = 'solar:cup-star-linear';
        else if (lower.includes('makanan') || lower.includes('main')) icon = 'solar:plate-linear';
        else if (lower.includes('snack') || lower.includes('cemilan')) icon = 'solar:donut-linear';

        return (
            <div className={`w-full h-full bg-brand-light/30 flex items-center justify-center text-brand-secondary ${isThumbnail ? 'rounded-xl border border-brand-light shadow-sm' : ''}`}>
                <iconify-icon icon={icon} class={isThumbnail ? 'text-[20px]' : 'text-[48px]'}></iconify-icon>
            </div>
        );
    };

    if (!src || hasError) {
        return renderPlaceholder();
    }

    return (
        <img
            src={src}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-300 ${isThumbnail ? 'rounded-xl border border-brand-light shadow-sm group-hover:scale-105' : 'group-hover:scale-105'}`}
            onError={() => setHasError(true)}
        />
    );
}

// Custom form hook mimicking Inertia's useForm API
function useForm(initialValues) {
    const [data, setDataState] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [transformFn, setTransformFn] = useState(() => (d) => d);

    const setData = (keyOrObj, value) => {
        if (typeof keyOrObj === 'object' && keyOrObj !== null) {
            setDataState(prev => ({ ...prev, ...keyOrObj }));
        } else {
            setDataState(prev => ({ ...prev, [keyOrObj]: value }));
        }
    };

    const reset = () => {
        setDataState(initialValues);
        setErrors({});
        setProcessing(false);
    };

    const transform = (fn) => {
        setTransformFn(() => fn);
    };

    const submit = async (method, url, options = {}) => {
        setProcessing(true);
        setErrors({});
        try {
            const submitData = transformFn(data);
            let res;
            const hasFile = Object.values(submitData).some(val => val instanceof File);
            const headers = hasFile ? { 'Content-Type': 'multipart/form-data' } : {};

            if (method.toLowerCase() === 'post') {
                res = await client.post(url, submitData, { headers });
            } else if (method.toLowerCase() === 'put') {
                res = await client.put(url, submitData, { headers });
            }

            if (options.onSuccess) {
                options.onSuccess(res);
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.errors) {
                const formattedErrors = {};
                Object.entries(err.response.data.errors).forEach(([k, v]) => {
                    formattedErrors[k] = Array.isArray(v) ? v[0] : v;
                });
                setErrors(formattedErrors);
            } else {
                alert("Terjadi kesalahan.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return {
        data,
        setData,
        errors,
        processing,
        transform,
        reset,
        post: (url, options) => submit('post', url, options),
        put: (url, options) => submit('put', url, options),
    };
}

export default function MenusIndex() {
    const confirm = useConfirm()
    const location = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search)

    const [menus, setMenus] = useState(null)
    const [categories, setCategories] = useState([])
    const [totalMenus, setTotalMenus] = useState(0)
    const [editMenu, setEditMenu] = useState(null)

    const [search, setSearch] = useState(params.get('search') || '')
    const [view, setViewState] = useState('list')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editMenuId, setEditMenuId] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [managerCategories, setManagerCategories] = useState([])
    const [catLoading, setCatLoading] = useState(false)
    const [catName, setCatName] = useState('')
    const [catDesc, setCatDesc] = useState('')
    const [catActive, setCatActive] = useState(true)
    const [editingCatId, setEditingCatId] = useState(null)
    const [catProcessing, setCatProcessing] = useState(false)
    const [catErrors, setCatErrors] = useState({})

    const fetchManagerCategories = async () => {
        setCatLoading(true)
        try {
            const res = await client.get('/categories')
            setManagerCategories(res.data.categories?.data || res.data.categories || [])
        } catch (err) {
            console.error("Gagal mengambil kategori:", err)
        } finally {
            setCatLoading(false)
        }
    }

    useEffect(() => {
        if (showCategoryModal) {
            fetchManagerCategories()
        }
    }, [showCategoryModal])

    const handleCategorySubmit = async (e) => {
        e.preventDefault()
        setCatProcessing(true)
        setCatErrors({})
        try {
            const payload = {
                name: catName,
                description: catDesc,
                is_active: catActive
            }

            if (editingCatId) {
                await client.put(`/categories/${editingCatId}`, payload)
            } else {
                await client.post('/categories', payload)
            }

            setCatName('')
            setCatDesc('')
            setCatActive(true)
            setEditingCatId(null)

            fetchManagerCategories()
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error(err)
            if (err.response && err.response.data && err.response.data.errors) {
                const formatted = {}
                Object.entries(err.response.data.errors).forEach(([k, v]) => {
                    formatted[k] = Array.isArray(v) ? v[0] : v
                })
                setCatErrors(formatted)
            } else {
                alert("Gagal menyimpan kategori.")
            }
        } finally {
            setCatProcessing(false)
        }
    }

    const startEditCategory = (cat) => {
        setEditingCatId(cat.id)
        setCatName(cat.name || '')
        setCatDesc(cat.description || '')
        setCatActive(!!cat.is_active)
    }

    const cancelCategoryEdit = () => {
        setEditingCatId(null)
        setCatName('')
        setCatDesc('')
        setCatActive(true)
        setCatErrors({})
    }

    const handleDeleteCategory = async (id, name) => {
        if (!await confirm({
            title: 'Hapus Kategori?',
            message: `Apakah Anda yakin ingin menghapus kategori "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            isDanger: true,
            confirmText: 'Hapus',
            cancelText: 'Batal'
        })) return
        try {
            await client.delete(`/categories/${id}`)
            fetchManagerCategories()
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menghapus kategori:", err)
            alert("Gagal menghapus kategori.")
        }
    }

    // Form Tambah Menu
    const createForm = useForm({
        category_id: '',
        name: '',
        description: '',
        price: '',
        is_active: true,
        image: null,
        estimated_hpp: '',
    })

    // Form Edit Menu
    const editForm = useForm({
        category_id: '',
        name: '',
        description: '',
        price: '',
        is_active: true,
        image: null,
        estimated_hpp: '',
    })

    // Fetch catalog data
    useEffect(() => {
        const fetchMenus = async () => {
            setLoading(true)
            try {
                setError(null)
                const res = await client.get(`/menus${location.search}`)
                setMenus(res.data.menus)
                setCategories(res.data.categories || [])
                setTotalMenus(res.data.totalMenus || 0)
                setEditMenu(res.data.editMenu || null)
            } catch (err) {
                console.error("Gagal mengambil data katalog menu:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchMenus()
    }, [location.search, refreshTrigger])

    // Handle parameter query (?create=1 atau ?edit=id)
    useEffect(() => {
        if (params.get('create') === '1') {
            navigate('/menus/create', { replace: true })
        }

        const editId = params.get('edit')
        if (editId) {
            navigate(`/menus/${editId}/edit`, { replace: true })
        }
    }, [location.search])

    const openEditModal = (menu) => {
        setEditMenuId(menu.id)
        editForm.setData({
            category_id: menu.category_id ?? '',
            name: menu.name ?? '',
            description: menu.description ?? '',
            price: menu.price ?? '',
            is_active: !!menu.is_active,
            image: null,
            estimated_hpp: menu.hpp ?? menu.recipe?.total_hpp ?? '',
        })
        setImagePreview(menu.image_url ?? null)
        setShowEditModal(true)
    }

    const handleCreateSubmit = (e) => {
        e.preventDefault()
        createForm.post('/menus', {
            onSuccess: () => {
                setShowCreateModal(false)
                createForm.reset()
                setImagePreview(null)
                setRefreshTrigger(prev => prev + 1)
            },
        })
    }

    const handleEditSubmit = (e) => {
        e.preventDefault()
        if (editForm.data.image) {
            editForm.transform((data) => ({
                ...data,
                _method: 'PUT',
            }))
            editForm.post(`/menus/${editMenuId}`, {
                onSuccess: () => {
                    setShowEditModal(false)
                    editForm.reset()
                    setEditMenuId(null)
                    setImagePreview(null)
                    setRefreshTrigger(prev => prev + 1)
                },
            })
        } else {
            editForm.transform((data) => data)
            editForm.put(`/menus/${editMenuId}`, {
                onSuccess: () => {
                    setShowEditModal(false)
                    editForm.reset()
                    setEditMenuId(null)
                    setImagePreview(null)
                    setRefreshTrigger(prev => prev + 1)
                },
            })
        }
    }

    const handleCreateImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            createForm.setData('image', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleEditImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            editForm.setData('image', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        const saved = localStorage.getItem('menu-view')
        if (saved === 'grid') setViewState('grid')
    }, [])

    useEffect(() => {
        setSearch(params.get('search') || '')
    }, [location.search])

    function setView(mode) {
        setViewState(mode)
        localStorage.setItem('menu-view', mode)
    }

    const getRelativeUrl = (url) => {
        if (!url) return '#'
        try {
            const parsed = new URL(url)
            return `/menus${parsed.search}`
        } catch (e) {
            if (url.includes('?')) {
                return `/menus?${url.split('?')[1]}`
            }
            return '/menus'
        }
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
        const qs = new URLSearchParams(paramsObj).toString()
        navigate(`/menus${qs ? '?' + qs : ''}`, { replace: true })
    }

    function handleSearch(e) {
        e.preventDefault()
        filter({ search, page: 1 })
    }

    function handleStatus(e) {
        filter({ status: e.target.value, page: 1 })
    }

    async function handleDelete(id, name) {
        if (!await confirm({
            title: 'Hapus Menu?',
            message: `Apakah Anda yakin ingin menghapus menu ${name}? Tindakan ini tidak dapat dibatalkan.`,
            isDanger: true,
            confirmText: 'Hapus',
            cancelText: 'Batal'
        })) return
        try {
            await client.delete(`/menus/${id}`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menghapus menu:", err)
            alert("Gagal menghapus menu.")
        }
    }

    async function handleToggleStatus(id) {
        try {
            await client.post(`/menus/${id}/toggle-status`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal mengubah status menu:", err)
            alert("Gagal mengubah status menu.")
        }
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

    if (loading && !menus) {
        return (
            <>
                <Head title="Katalog Menu" />
                <MenusSkeleton />
            </>
        )
    }

    if (error && !menus) {
        return (
            <>
                <Head title="Katalog Menu" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data katalog menu dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all active:scale-[0.97]">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        )
    }

    if (!menus) return null;

    return (
        <>
            <Head title="Katalog Menu" />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="space-y-6 max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                                Katalog Menu
                            </h1>
                            <p className="text-black/60 font-semibold text-sm mt-1">
                                Kelola item menu, harga jual, dan pantau margin keuntungan Anda.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right mr-2">
                                <p className="text-[10px] font-extrabold text-black/40 capitalize tracking-wider">Total Menu</p>
                                <p className="text-2xl font-black text-black leading-none mt-0.5">{totalMenus}</p>
                            </div>
                            <button
                                onClick={() => setShowCategoryModal(true)}
                                className="bg-white hover:bg-[#E6E6E6] border border-[#D0D0D0] hover:border-[#999999] text-black px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm active:scale-[0.97]"
                            >
                                <iconify-icon icon="solar:tag-linear" class="text-lg text-black/60"></iconify-icon>
                                Kelola Kategori
                            </button>
                            <button
                                onClick={() => navigate('/menus/create')}
                                className="bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-level-1 active:scale-[0.97]"
                            >
                                + Tambah Menu
                            </button>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-2xl border border-[#E6E6E6] shadow-level-1 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                            <div className="flex items-center gap-3 flex-1">

                                {/* Search */}
                                <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
                                    <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 text-[18px]"></iconify-icon>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari menu..."
                                        className="w-full h-10 bg-white border border-[#D0D0D0] rounded-xl pl-9 pr-4 text-[13px] font-semibold text-black placeholder-[#808080] focus:outline-none transition-all hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                </form>

                                {/* Status Filter */}
                                <CustomSelect
                                    value={activeStatus}
                                    onChange={(val) => handleStatus({ target: { value: val } })}
                                    options={[
                                        { value: '', label: 'Semua Status' },
                                        { value: 'active', label: 'Tersedia' },
                                        { value: 'inactive', label: 'Habis' }
                                    ]}
                                    placeholder="Semua Status"
                                    className="w-[140px]"
                                />

                                <button
                                    onClick={handleSearch}
                                    className="flex items-center gap-2 h-10 px-5 bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black rounded-xl text-[13px] font-semibold transition-all active:scale-[0.97]"
                                >
                                    Cari
                                </button>

                                {(params.get('search') || params.get('status') || params.get('category')) && (
                                    <Link
                                        to="/menus"
                                        className="h-10 px-3 bg-white border border-[#D0D0D0] text-black rounded-xl text-[13px] font-semibold hover:bg-[#E6E6E6] hover:border-[#999999] transition-all flex items-center shadow-sm"
                                    >
                                        Reset
                                    </Link>
                                )}
                            </div>

                            {/* Category Tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto shrink-0">
                                <button
                                    onClick={() => filter({ category: '', page: 1 })}
                                    className={`px-3.5 py-1.5 text-[11px] font-bold rounded-full transition-all whitespace-nowrap ${ !activeCategory ? 'bg-[#BFFF00] text-black' : 'bg-white border border-[#D0D0D0] text-black/70 hover:bg-[#E6E6E6] hover:text-black hover:border-[#999999]' } active:scale-[0.97]`}
                                >
                                    Semua
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => filter({ category: cat.id, page: 1 })}
                                        className={`px-3.5 py-1.5 text-[11px] font-bold rounded-full transition-all whitespace-nowrap ${ activeCategory == cat.id ? 'bg-[#BFFF00] text-black' : 'bg-white border border-[#D0D0D0] text-black/70 hover:bg-[#E6E6E6] hover:text-black hover:border-[#999999]' } active:scale-[0.97]`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-neutral-50 border border-[#E6E6E6] p-1 rounded-xl shrink-0">
                            <button
                                onClick={() => setView('grid')}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${ view === 'grid' ? 'bg-white border border-[#E6E6E6] text-black shadow-sm' : 'text-black/40 hover:text-black' } active:scale-[0.97]`}
                            >
                                <iconify-icon icon="solar:widget-linear" class="text-lg"></iconify-icon>
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${ view === 'list' ? 'bg-white border border-[#E6E6E6] text-black shadow-sm' : 'text-black/40 hover:text-black' } active:scale-[0.97]`}
                            >
                                <iconify-icon icon="solar:list-linear" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    </div>

                    {/* Table / Grid Card */}
                    <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 overflow-hidden">

                        {/* ── TABLE VIEW ── */}
                        {view === 'list' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead>
                                        <tr className="bg-neutral-50 border-b border-[#E6E6E6]">
                                            {['Foto', 'Nama Menu', 'Kategori', 'Harga Jual', 'HPP', 'Margin', 'Status', 'Aksi'].map((h) => (
                                                <th key={h} className="px-6 py-3.5 text-[11px] font-bold text-black/60 uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E6E6]">
                                        {menus.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-black/40">
                                                            <iconify-icon icon="solar:cookie-linear" class="text-3xl"></iconify-icon>
                                                        </div>
                                                        <p className="text-sm font-bold text-black">Tidak ada menu ditemukan.</p>
                                                        <button
                                                            onClick={() => navigate('/menus/create')}
                                                            className="bg-[#BFFF00] text-xs text-black px-4 py-2 rounded-xl font-bold transition-all active:scale-[0.97]"
                                                        >
                                                            + Tambah Menu Pertama
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : menus.data.map((menu) => {
                                            const hpp = menu.recipe?.total_hpp ?? 0
                                            const margin = menu.recipe?.margin ?? 0
                                            return (
                                                <tr
                                                    key={menu.id}
                                                    className="hover:bg-[#E6E6E6]/40 transition-colors group cursor-pointer"
                                                    onClick={() => navigate(`/menus/${menu.id}`)}
                                                >
                                                    {/* Foto */}
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <Link to={`/menus/${menu.id}`} className="block w-10 h-10 relative">
                                                            <MenuImage src={menu.image_url} name={menu.name} categoryName={menu.category?.name} isThumbnail={true} />
                                                        </Link>
                                                    </td>

                                                    {/* Nama */}
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-black text-[13px] group-hover:text-black/80 transition-colors">
                                                            {menu.name}
                                                        </p>
                                                        {menu.description && (
                                                            <p className="text-[11px] text-black/50 font-medium mt-0.5 truncate max-w-[180px]">
                                                                {menu.description}
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* Kategori */}
                                                    <td className="px-6 py-4">
                                                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-black/70">
                                                            <iconify-icon icon="solar:tag-linear" class="text-base text-black/40"></iconify-icon>
                                                            {menu.category?.name ?? '-'}
                                                        </span>
                                                    </td>

                                                    {/* Harga */}
                                                    <td className="px-6 py-4 font-bold text-black text-[13px]">
                                                        Rp {Number(menu.price).toLocaleString('id-ID')}
                                                    </td>

                                                    {/* HPP */}
                                                    <td className="px-6 py-4 text-[13px] font-semibold text-black/60">
                                                        {hpp > 0
                                                            ? `Rp ${Number(hpp).toLocaleString('id-ID')}`
                                                            : <span className="text-black/30 italic text-[11px]">Belum diset</span>
                                                        }
                                                    </td>

                                                    {/* Margin */}
                                                    <td className="px-6 py-4">
                                                        {hpp > 0 ? (
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getMarginStyle(margin)}`}>
                                                                {margin}%
                                                            </span>
                                                        ) : (
                                                            <span className="text-black/30 italic text-[11px]">-</span>
                                                        )}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                                            menu.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                                : 'bg-rose-50 text-rose-700 border-rose-100'
                                                        }`}>
                                                            {menu.is_active ? 'Tersedia' : 'Habis'}
                                                        </span>
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                            <Link
                                                                to={`/menus/${menu.id}`}
                                                                className="p-2 text-black/60 hover:text-black rounded-xl hover:bg-[#E6E6E6] inline-flex active:scale-95 transition-all"
                                                                title="Lihat Detail"
                                                            >
                                                                <iconify-icon icon="solar:eye-linear" class="text-lg"></iconify-icon>
                                                            </Link>
                                                            <button
                                                                onClick={() => navigate(`/menus/${menu.id}/edit`)}
                                                                className="p-2 text-black/60 hover:text-black rounded-xl hover:bg-[#E6E6E6] inline-flex active:scale-[0.97] transition-all"
                                                                title="Edit"
                                                            >
                                                                <iconify-icon icon="solar:pen-linear" class="text-lg"></iconify-icon>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(menu.id, menu.name)}
                                                                className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50 inline-flex active:scale-[0.97] transition-all"
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
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3 mx-auto text-black/40">
                                            <iconify-icon icon="solar:cookie-linear" class="text-3xl"></iconify-icon>
                                        </div>
                                        <p className="text-sm font-bold text-black">Tidak ada menu ditemukan.</p>
                                    </div>
                                ) : menus.data.map((menu) => {
                                    const hpp = menu.recipe?.total_hpp ?? 0
                                    const margin = menu.recipe?.margin ?? 0
                                    return (
                                        <div
                                            key={menu.id}
                                            className="group bg-white border border-[#E6E6E6] rounded-2xl overflow-hidden hover:border-black hover:shadow-level-2 transition-all cursor-pointer shadow-level-1"
                                            onClick={() => navigate(`/menus/${menu.id}`)}
                                        >
                                            {/* Foto */}
                                            <div className="relative aspect-square overflow-hidden bg-neutral-50">
                                                <MenuImage src={menu.image_url} name={menu.name} categoryName={menu.category?.name} />
                                                {/* Status toggle */}
                                                <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleToggleStatus(menu.id)}
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${ menu.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100' } active:scale-[0.97]`}
                                                    >
                                                        {menu.is_active ? 'Tersedia' : 'Habis'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-3">
                                                <p className="font-bold text-black text-[12px] truncate">{menu.name}</p>
                                                <p className="text-[11px] text-black/50 font-medium mt-0.5">{menu.category?.name ?? '-'}</p>
                                                <p className="text-[13px] font-bold text-black mt-1.5">
                                                    Rp {Number(menu.price).toLocaleString('id-ID')}
                                                </p>
                                                {hpp > 0 && (
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${getMarginStyle(margin)}`}>
                                                        Margin {margin}%
                                                    </span>
                                                )}

                                                {/* Aksi */}
                                                <div
                                                    className="flex items-center gap-1 mt-2 pt-2 border-t border-[#E6E6E6] opacity-0 group-hover:opacity-100 transition-all"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={() => navigate(`/menus/${menu.id}/edit`)}
                                                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold text-black hover:bg-[#E6E6E6] border border-[#D0D0D0] hover:border-[#999999] rounded-lg transition-all active:scale-[0.97]"
                                                    >
                                                        <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(menu.id, menu.name)}
                                                        className="flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-semibold text-rose-500 hover:text-rose-700 border border-[#D0D0D0] hover:border-rose-200 hover:bg-rose-50 rounded-lg transition-all active:scale-[0.97]"
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#E6E6E6] bg-neutral-50/50">
                            <p className="text-[12px] font-medium text-black/60">
                                Menampilkan <span className="font-bold text-black">{menus.data.length}</span>{' '}
                                dari <span className="font-bold text-black">{menus.total}</span> menu
                            </p>
                            <div className="flex items-center gap-2">
                                {/* Prev */}
                                {menus.current_page === 1 ? (
                                    <button disabled className="px-4 py-2 text-[12px] font-semibold text-black/30 bg-neutral-50 border border-[#E6E6E6] rounded-xl cursor-not-allowed">
                                        Sebelumnya
                                    </button>
                                ) : (
                                    <Link to={getRelativeUrl(menus.prev_page_url)} className="px-4 py-2 text-[12px] font-bold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all shadow-sm">
                                        Sebelumnya
                                    </Link>
                                )}

                                {/* Page numbers */}
                                {getPages().map((page, i) =>
                                    page === '...' ? (
                                        <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-[12px] font-semibold text-black/30">…</span>
                                    ) : (
                                        <Link
                                            key={page}
                                            to={getRelativeUrl(menus.links?.find(l => l.label == page)?.url)}
                                            className={`w-9 h-9 flex items-center justify-center text-[12px] font-bold rounded-xl border transition-all ${
                                                page === menus.current_page
                                                    ? 'bg-[#BFFF00] text-black border-transparent font-bold'
                                                    : 'bg-white text-black border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999]'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    )
                                )}

                                {/* Next */}
                                {!menus.next_page_url ? (
                                    <button disabled className="px-4 py-2 text-[12px] font-semibold text-black/30 bg-neutral-50 border border-[#E6E6E6] rounded-xl cursor-not-allowed">
                                        Berikutnya
                                    </button>
                                ) : (
                                    <Link to={getRelativeUrl(menus.next_page_url)} className="px-4 py-2 text-[12px] font-bold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all shadow-sm">
                                        Berikutnya
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

              {/* Create Menu Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-[#E6E6E6] p-8 w-full max-w-xl shadow-level-3 relative my-8">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        
                        {/* Close button X */}
                        <button
                            onClick={() => {
                                setShowCreateModal(false)
                                createForm.reset()
                                setImagePreview(null)
                            }}
                            className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all z-20 flex items-center justify-center active:scale-[0.97]"
                        >
                            <iconify-icon icon="material-symbols:close" class="text-xl"></iconify-icon>
                        </button>

                        <h3 className="font-bold text-xl text-black mb-1 relative z-10">
                            Tambah Menu Baru
                        </h3>
                        <p className="text-xs text-black/60 mb-8 relative z-10">
                            Isi informasi dasar menu. Anda dapat mengatur resep detail di layar Recipe Costing.
                        </p>

                        <form onSubmit={handleCreateSubmit} className="space-y-5 relative z-10">
                            {/* Row 1: Foto Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Foto Menu
                                </label>
                                <div className="col-span-8 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#D0D0D0] bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative cursor-pointer hover:border-[#999999] transition-colors group">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <iconify-icon icon="solar:add-circle-linear" class="text-2xl text-black/40 group-hover:text-black transition-colors"></iconify-icon>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCreateImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-[11px] text-black/55 font-medium leading-relaxed max-w-[220px]">
                                        Format JPG, PNG atau WebP.<br />Maksimal ukuran file 2MB.
                                    </div>
                                </div>
                                {createForm.errors.image && (
                                    <p className="col-start-5 col-span-8 text-[11px] text-rose-500 font-bold mt-1">
                                        {createForm.errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Row 2: Nama Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Nama Menu
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Contoh: Es Kopi Susu Gula Aren"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {createForm.errors.name && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {createForm.errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Kategori */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Kategori
                                </label>
                                <div className="col-span-8">
                                    <CustomSelect
                                        value={createForm.data.category_id}
                                        onChange={(val) => createForm.setData('category_id', val)}
                                        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                        placeholder="Pilih Kategori"
                                        className="w-full h-10"
                                    />
                                    {createForm.errors.category_id && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {createForm.errors.category_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Harga Jual (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Harga Jual (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={createForm.data.price}
                                        onChange={(e) => createForm.setData('price', e.target.value)}
                                        placeholder="25000"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {createForm.errors.price && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {createForm.errors.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 5: Estimasi HPP (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider mt-2.5">
                                    Estimasi HPP (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        min="0"
                                        value={createForm.data.estimated_hpp}
                                        onChange={(e) => createForm.setData('estimated_hpp', e.target.value)}
                                        placeholder="8500"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    <span className="text-[10px] text-neutral-400 mt-1 italic block leading-normal">
                                        *HPP akan diperbarui otomatis setelah resep dihubungkan.
                                    </span>
                                    {createForm.errors.estimated_hpp && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {createForm.errors.estimated_hpp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 6: Deskripsi */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider mt-2.5">
                                    Deskripsi
                                </label>
                                <div className="col-span-8">
                                    <textarea
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        placeholder="Deskripsi singkat mengenai rasa, komposisi, atau detail penyajian..."
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all resize-none font-medium text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {createForm.errors.description && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {createForm.errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 7: Status Aktif */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <div className="col-span-4"></div>
                                <div className="col-span-8 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => createForm.setData('is_active', !createForm.data.is_active)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-black ${ createForm.data.is_active ? 'bg-black' : 'bg-[#E6E6E6]' } active:scale-[0.97]`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                createForm.data.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <span
                                        onClick={() => createForm.setData('is_active', !createForm.data.is_active)}
                                        className="text-xs font-semibold text-black cursor-pointer select-none"
                                    >
                                        Aktif & Tampilkan di POS
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center gap-4 mt-8 pt-4 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false)
                                        createForm.reset()
                                        setImagePreview(null)
                                    }}
                                    className="px-6 py-2.5 text-xs font-bold text-black/60 hover:text-black transition-colors active:scale-[0.97]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-level-1 disabled:opacity-50 active:scale-[0.97]"
                                >
                                    {createForm.processing ? 'Menyimpan...' : 'Simpan Menu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Menu Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-[#E6E6E6] p-8 w-full max-w-xl shadow-level-3 relative my-8">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        
                        {/* Close button X */}
                        <button
                            onClick={() => {
                                setShowEditModal(false)
                                editForm.reset()
                                setEditMenuId(null)
                                setImagePreview(null)
                            }}
                            className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all z-20 flex items-center justify-center active:scale-[0.97]"
                        >
                            <iconify-icon icon="material-symbols:close" class="text-xl"></iconify-icon>
                        </button>

                        <h3 className="font-bold text-xl text-black mb-1 relative z-10">
                            Edit Detail Menu
                        </h3>
                        <p className="text-xs text-black/60 mb-8 relative z-10">
                            Ubah rincian informasi, harga jual, dan estimasi HPP menu hidangan.
                        </p>

                        <form onSubmit={handleEditSubmit} className="space-y-5 relative z-10">
                            {/* Row 1: Foto Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Foto Menu
                                </label>
                                <div className="col-span-8 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#D0D0D0] bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative cursor-pointer hover:border-[#999999] transition-colors group">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <iconify-icon icon="solar:add-circle-linear" class="text-2xl text-black/40 group-hover:text-black transition-colors"></iconify-icon>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-[11px] text-black/55 font-medium leading-relaxed max-w-[220px]">
                                        Format JPG, PNG atau WebP.<br />Maksimal ukuran file 2MB.
                                    </div>
                                </div>
                                {editForm.errors.image && (
                                    <p className="col-start-5 col-span-8 text-[11px] text-rose-500 font-bold mt-1">
                                        {editForm.errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Row 2: Nama Menu */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Nama Menu
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        placeholder="Contoh: Es Kopi Susu Gula Aren"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Kategori */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Kategori
                                </label>
                                <div className="col-span-8">
                                    <CustomSelect
                                        value={editForm.data.category_id}
                                        onChange={(val) => editForm.setData('category_id', val)}
                                        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                        placeholder="Pilih Kategori"
                                        className="w-full h-10"
                                    />
                                    {editForm.errors.category_id && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.category_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 4: Harga Jual (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider">
                                    Harga Jual (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={editForm.data.price}
                                        onChange={(e) => editForm.setData('price', e.target.value)}
                                        placeholder="25000"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {editForm.errors.price && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 5: Estimasi HPP (Rp) */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider mt-2.5">
                                    Estimasi HPP (Rp)
                                </label>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.data.estimated_hpp}
                                        onChange={(e) => editForm.setData('estimated_hpp', e.target.value)}
                                        placeholder="8500"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    <span className="text-[10px] text-neutral-400 mt-1 italic block leading-normal">
                                        *HPP akan diperbarui otomatis setelah resep dihubungkan.
                                    </span>
                                    {editForm.errors.estimated_hpp && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.estimated_hpp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 6: Deskripsi */}
                            <div className="grid grid-cols-12 gap-x-4 items-start">
                                <label className="col-span-4 text-right pr-6 text-xs font-semibold text-black/80 capitalize tracking-wider mt-2.5">
                                    Deskripsi
                                </label>
                                <div className="col-span-8">
                                    <textarea
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        placeholder="Deskripsi..."
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all resize-none font-medium text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {editForm.errors.description && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {editForm.errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 7: Status Aktif */}
                            <div className="grid grid-cols-12 gap-x-4 items-center">
                                <div className="col-span-4"></div>
                                <div className="col-span-8 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => editForm.setData('is_active', !editForm.data.is_active)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-black ${ editForm.data.is_active ? 'bg-black' : 'bg-[#E6E6E6]' } active:scale-[0.97]`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                editForm.data.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <span
                                        onClick={() => editForm.setData('is_active', !editForm.data.is_active)}
                                        className="text-xs font-semibold text-black cursor-pointer select-none"
                                    >
                                        Aktif & Tampilkan di POS
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center gap-4 mt-8 pt-4 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false)
                                        editForm.reset()
                                        setEditMenuId(null)
                                        setImagePreview(null)
                                    }}
                                    className="px-6 py-2.5 text-xs font-bold text-black/60 hover:text-black transition-colors active:scale-[0.97]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black px-6 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-level-1 disabled:opacity-50 active:scale-[0.97]"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Manager Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-[#E6E6E6] p-6 md:p-8 w-full max-w-4xl shadow-level-3 relative my-8 flex flex-col md:flex-row gap-6 h-[85vh] overflow-hidden">
                        
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowCategoryModal(false)
                                cancelCategoryEdit()
                            }}
                            className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all z-20 flex items-center justify-center active:scale-[0.97]"
                        >
                            <iconify-icon icon="material-symbols:close" class="text-xl"></iconify-icon>
                        </button>

                        {/* Left Side: Create / Edit Form */}
                        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col justify-start border-b md:border-b-0 md:border-r border-[#E6E6E6] pb-6 md:pb-0 md:pr-6">
                            <h3 className="font-bold text-lg text-black mb-1">
                                {editingCatId ? 'Edit Kategori' : 'Tambah Kategori'}
                            </h3>
                            <p className="text-xs text-black/60 mb-6">
                                {editingCatId ? 'Perbarui detail informasi kategori menu.' : 'Buat kategori menu hidangan baru.'}
                            </p>

                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-black/80 capitalize tracking-wider block mb-1.5">
                                        Nama Kategori
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={catName}
                                        onChange={(e) => setCatName(e.target.value)}
                                        placeholder="Contoh: Kopi Khas"
                                        className="w-full h-10 px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all font-semibold text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {catErrors.name && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {catErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-black/80 capitalize tracking-wider block mb-1.5">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={catDesc}
                                        onChange={(e) => setCatDesc(e.target.value)}
                                        placeholder="Keterangan singkat..."
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D0] rounded-xl focus:outline-none transition-all resize-none font-medium text-black hover:border-[#999999] focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                    {catErrors.description && (
                                        <p className="text-[11px] text-rose-500 font-bold mt-1">
                                            {catErrors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCatActive(!catActive)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-black ${ catActive ? 'bg-black' : 'bg-[#E6E6E6]' } active:scale-[0.97]`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                catActive ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <span
                                        onClick={() => setCatActive(!catActive)}
                                        className="text-xs font-semibold text-black cursor-pointer select-none"
                                    >
                                        Status Aktif
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    {editingCatId && (
                                        <button
                                            type="button"
                                            onClick={cancelCategoryEdit}
                                            className="flex-1 py-2 bg-white hover:bg-[#E6E6E6] text-black border border-[#D0D0D0] hover:border-[#999999] rounded-xl text-xs font-bold transition-all active:scale-[0.97]"
                                        >
                                            Batal
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={catProcessing}
                                        className="bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black flex-1 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-[0.97]"
                                    >
                                        {catProcessing ? 'Menyimpan...' : (editingCatId ? 'Simpan' : 'Tambah')}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Side: Category List */}
                        <div className="flex-1 flex flex-col min-w-0">
                            <h3 className="font-bold text-lg text-black mb-4">
                                Daftar Kategori
                            </h3>

                            {catLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                                    <iconify-icon icon="line-md:loading-twotone-loop" class="text-3xl text-black/50"></iconify-icon>
                                    <span className="text-xs font-bold text-black/50">Memuat...</span>
                                </div>
                            ) : managerCategories.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-neutral-50 rounded-2xl border border-[#E6E6E6] border-dashed">
                                    <iconify-icon icon="solar:tag-linear" class="text-3xl text-black/40 mb-2"></iconify-icon>
                                    <p className="text-xs font-bold text-black/60">Belum ada kategori</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto divide-y divide-[#E6E6E6] border border-[#E6E6E6] rounded-2xl bg-neutral-50/30 pr-1">
                                    {managerCategories.map((cat) => (
                                        <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-[#E6E6E6]/30 transition-colors group">
                                            <div className="min-w-0 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-black">
                                                        {cat.name}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                                        cat.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            : 'bg-rose-50 text-rose-700 border-rose-100'
                                                    }`}>
                                                        {cat.is_active ? 'Aktif' : 'Non-aktif'}
                                                    </span>
                                                </div>
                                                {cat.description && (
                                                    <p className="text-xs text-black/60 font-medium mt-1 leading-normal">
                                                        {cat.description}
                                                    </p>
                                                )}
                                                <p className="text-[10px] text-black/40 font-semibold mt-1 flex items-center gap-1">
                                                    <iconify-icon icon="solar:clipboard-list-linear" class="text-xs text-black/40"></iconify-icon>
                                                    {cat.menus_count ?? 0} menu hidangan
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEditCategory(cat)}
                                                    className="p-2 text-black/60 hover:text-black rounded-xl hover:bg-[#E6E6E6] inline-flex active:scale-[0.97] transition-all"
                                                    title="Edit"
                                                >
                                                    <iconify-icon icon="solar:pen-linear" class="text-lg"></iconify-icon>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                                    className="p-2 text-rose-500 hover:text-rose-700 rounded-xl hover:bg-rose-50 inline-flex active:scale-[0.97] transition-all"
                                                    title="Hapus"
                                                >
                                                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-lg"></iconify-icon>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

// MenusIndex.layout = (page) => <>{page}</>;
