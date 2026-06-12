// resources/js/Pages/Menus/CreateEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';

export default function MenusCreateEdit() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    // Form States
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [estimatedHpp, setEstimatedHpp] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Mock States for UI compliance
    const [sku, setSku] = useState('');
    const [tags, setTags] = useState(['Best Seller', 'Seasonal']);
    const [newTag, setNewTag] = useState('');
    const [showTagInput, setShowTagInput] = useState(false);
    
    const [isInventoryEnabled, setIsInventoryEnabled] = useState(false);
    const [initialStock, setInitialStock] = useState('50');
    const [unit, setUnit] = useState('Porsi');
    const [minStock, setMinStock] = useState('10');

    // UI & API states
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Alerts states
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Inline Category Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [newCatActive, setNewCatActive] = useState(true);
    const [catProcessing, setCatProcessing] = useState(false);
    const [catErrors, setCatErrors] = useState({});

    const fileInputRef = useRef(null);

    // Fetch Categories and Menu data (in Edit Mode)
    useEffect(() => {
        const loadPageData = async () => {
            try {
                // First fetch categories from /menus or /categories
                const menuRes = await client.get('/menus');
                setCategories(menuRes.data.categories || []);

                if (isEditMode) {
                    const detailRes = await client.get(`/menus/${id}`);
                    const menu = detailRes.data.menu;
                    if (menu) {
                        setName(menu.name || '');
                        setCategoryId(menu.category_id || '');
                        setPrice(menu.price || '');
                        setEstimatedHpp(menu.hpp || menu.recipe?.total_hpp || '');
                        setDescription(menu.description || '');
                        setIsActive(!!menu.is_active);
                        setImagePreview(menu.image_url || null);
                        if (menu.sku) setSku(menu.sku);
                    }
                }
            } catch (err) {
                console.error("Gagal mengambil data halaman:", err);
                setErrorMessage("Gagal memuat data menu dari server.");
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [id, isEditMode]);

    // Calculate Margin Profit dynamically
    const computedPrice = parseFloat(price) || 0;
    const computedHpp = parseFloat(estimatedHpp) || 0;
    const marginPercent = computedPrice > 0 
        ? ((computedPrice - computedHpp) / computedPrice * 100) 
        : 0;

    // Handle Image file select
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Ukuran file maksimal adalah 2MB.' }));
                return;
            }
            setErrors(prev => {
                const copy = { ...prev };
                delete copy.image;
                return copy;
            });
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Form validation check
    const validateForm = () => {
        const validationErrors = {};
        if (!name.trim()) validationErrors.name = 'Nama menu wajib diisi.';
        if (!categoryId) validationErrors.category_id = 'Kategori wajib dipilih.';
        if (!price || parseFloat(price) < 0) validationErrors.price = 'Masukkan angka yang valid untuk harga jual.';
        
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e, redirectBack = true) => {
        if (e) e.preventDefault();
        if (!validateForm()) {
            setErrorMessage("Periksa kembali: Ada beberapa field yang bermasalah.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setProcessing(true);
        setErrors({});
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const hasImage = !!imageFile;
            
            if (isEditMode) {
                if (hasImage) {
                    const dataObj = new FormData();
                    dataObj.append('_method', 'PUT');
                    dataObj.append('category_id', categoryId);
                    dataObj.append('name', name);
                    dataObj.append('description', description || '');
                    dataObj.append('price', price);
                    dataObj.append('is_active', isActive ? '1' : '0');
                    dataObj.append('image', imageFile);
                    if (estimatedHpp !== '') {
                        dataObj.append('estimated_hpp', estimatedHpp);
                    }
                    
                    await client.post(`/menus/${id}`, dataObj, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                } else {
                    await client.put(`/menus/${id}`, {
                        category_id: categoryId,
                        name: name,
                        description: description || '',
                        price: price,
                        is_active: !!isActive,
                        estimated_hpp: estimatedHpp !== '' ? estimatedHpp : '',
                    });
                }
            } else {
                const dataObj = new FormData();
                dataObj.append('category_id', categoryId);
                dataObj.append('name', name);
                dataObj.append('description', description || '');
                dataObj.append('price', price);
                dataObj.append('is_active', isActive ? '1' : '0');
                if (hasImage) {
                    dataObj.append('image', imageFile);
                }
                if (estimatedHpp !== '') {
                    dataObj.append('estimated_hpp', estimatedHpp);
                }

                await client.post('/menus', dataObj, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            if (redirectBack) {
                navigate('/menus');
            } else {
                // Save & Add more (Create Mode only)
                setSuccessMessage(`Menu "${name}" berhasil ditambahkan!`);
                // Reset form values
                setName('');
                setCategoryId('');
                setPrice('');
                setEstimatedHpp('');
                setDescription('');
                setIsActive(true);
                handleRemoveImage();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Gagal menyimpan menu:", err);
            if (err.response && err.response.status === 422) {
                const validationErrors = {};
                Object.entries(err.response.data.errors || {}).forEach(([key, messages]) => {
                    validationErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setErrors(validationErrors);
                setErrorMessage("Ada kesalahan validasi data. Silakan periksa kembali.");
            } else {
                setErrorMessage("Terjadi kesalahan saat menyimpan menu.");
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setProcessing(false);
        }
    };

    // Category Creation Submit
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) {
            setCatErrors({ name: 'Nama kategori wajib diisi.' });
            return;
        }

        setCatProcessing(true);
        setCatErrors({});

        try {
            const payload = {
                name: newCatName,
                description: newCatDesc,
                is_active: newCatActive
            };
            const res = await client.post('/categories', payload);
            
            // Reload all categories
            const menuRes = await client.get('/menus');
            const updatedCategories = menuRes.data.categories || [];
            setCategories(updatedCategories);

            // Select newly created category
            if (res.data.category && res.data.category.id) {
                setCategoryId(res.data.category.id);
            }

            // Close modal & reset form
            setShowCategoryModal(false);
            setNewCatName('');
            setNewCatDesc('');
            setNewCatActive(true);
        } catch (err) {
            console.error("Gagal menyimpan kategori:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const formatted = {};
                Object.entries(err.response.data.errors).forEach(([k, v]) => {
                    formatted[k] = Array.isArray(v) ? v[0] : v;
                });
                setCatErrors(formatted);
            } else {
                alert("Gagal menyimpan kategori.");
            }
        } finally {
            setCatProcessing(false);
        }
    };

    // Add Tag function
    const handleAddTag = (e) => {
        e.preventDefault();
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
            setShowTagInput(false);
        }
    };

    // Remove Tag function
    const handleRemoveTag = (indexToRemove) => {
        setTags(tags.filter((_, idx) => idx !== indexToRemove));
    };

    // Get Active Category Object for Preview
    const activeCategoryObj = categories.find(c => c.id == categoryId);
    const categoryNameUpper = activeCategoryObj ? activeCategoryObj.name.toUpperCase() : 'KATEGORI';

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-brand-light border-t-brand-primary animate-spin" />
                    <p className="text-sm font-bold text-brand-primary">Memuat data menu...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={isEditMode ? "Edit Menu" : "Tambah Menu Baru"} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6 pb-12">
                <div className="max-w-6xl mx-auto space-y-6">
                    
                    {/* Top Breadcrumb & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/menus" 
                                className="w-10 h-10 rounded-full bg-white border border-brand-light flex items-center justify-center text-brand-primary/60 hover:text-brand-primary hover:border-brand-primary transition shadow-sm shrink-0"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary mb-1">
                                    <Link to="/menus" className="hover:text-brand-dark transition-colors">Menu Catalog</Link>
                                    <span className="text-brand-light">/</span>
                                    <span className="text-brand-dark">{isEditMode ? "Edit Menu" : "Tambah Menu"}</span>
                                </div>
                                <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                                    {isEditMode ? "Edit Detail Menu" : "Tambah Menu Baru"}
                                </h1>
                                <p className="text-brand-primary/60 font-medium text-xs mt-1">
                                    Konfigurasi detail produk, harga, dan manajemen inventori cafe Anda.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Link 
                                to="/menus" 
                                className="px-5 py-2.5 text-xs font-extrabold text-brand-dark/75 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition duration-150 active:scale-95 shadow-sm"
                            >
                                Batal
                            </Link>
                            <button 
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={processing}
                                className="px-6 py-2.5 text-xs font-extrabold text-white bg-brand-dark hover:bg-brand-primary rounded-xl transition duration-150 active:scale-95 shadow-md disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Menu'}
                            </button>
                        </div>
                    </div>

                    {/* Alerts Container */}
                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
                            <div className="flex items-center gap-2">
                                <iconify-icon icon="solar:check-circle-linear" class="text-xl text-emerald-500"></iconify-icon>
                                <span className="text-xs font-bold">{successMessage}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link to="/menus" className="text-xs font-extrabold text-emerald-600 hover:text-emerald-800 transition-colors">Lihat di Katalog</Link>
                                <button onClick={() => setSuccessMessage('')} className="text-emerald-500 hover:text-emerald-800 text-xs font-black">Tutup</button>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn">
                            <iconify-icon icon="solar:danger-triangle-linear" class="text-xl text-rose-500"></iconify-icon>
                            <span className="text-xs font-bold">{errorMessage}</span>
                        </div>
                    )}

                    {/* Double-column Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT COLUMN: FORM DETAILS */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Card 1: Foto Menu */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <iconify-icon icon="solar:camera-linear" class="text-lg text-brand-secondary"></iconify-icon>
                                    <h3 className="font-extrabold text-sm text-brand-dark">Foto Menu</h3>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-5 items-center">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-2xl border-2 border-dashed border-brand-light bg-brand-bg/50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-secondary transition-colors relative overflow-hidden group shrink-0"
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <>
                                                <iconify-icon icon="solar:camera-add-linear" class="text-xl text-brand-primary/50 group-hover:text-brand-secondary transition-colors"></iconify-icon>
                                                <span className="text-[9px] text-brand-primary/50 font-bold mt-1">PILIH FOTO</span>
                                            </>
                                        )}
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="text-xs font-bold text-brand-dark">Unggah Gambar Produk</p>
                                        <p className="text-[10px] text-brand-primary/60 font-medium leading-relaxed mt-1">
                                            Gunakan format JPG, PNG atau WebP. Maksimal ukuran file 2MB.<br />Rasio ideal 1:1 untuk tampilan katalog yang rapi.
                                        </p>
                                        <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 text-[10px] font-bold bg-brand-light/40 text-brand-primary hover:bg-brand-light rounded-lg border border-brand-light transition duration-150"
                                            >
                                                Pilih File
                                            </button>
                                            {imagePreview && (
                                                <button 
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="px-3 py-1.5 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition duration-150"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {errors.image && (
                                    <p className="text-[10px] text-rose-500 font-bold mt-2">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Card 2: Informasi Dasar */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <iconify-icon icon="solar:document-text-linear" class="text-lg text-brand-secondary"></iconify-icon>
                                    <h3 className="font-extrabold text-sm text-brand-dark">Informasi Dasar</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Nama Menu */}
                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                            Nama Menu <span className="text-rose-500">*</span>
                                        </label>
                                        <input 
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Contoh: Caramel Macchiato Large"
                                            className={`w-full h-10 px-3 text-xs bg-brand-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-semibold text-brand-dark ${errors.name ? 'border-rose-300 ring-2 ring-rose-50' : 'border-brand-light'}`}
                                        />
                                        {errors.name && (
                                            <p className="text-[10px] text-rose-500 font-bold mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Kategori */}
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                            Kategori <span className="text-rose-500">*</span>
                                        </label>
                                        <select 
                                            required
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className={`w-full h-10 px-3 text-xs bg-brand-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all cursor-pointer font-semibold text-brand-dark ${errors.category_id ? 'border-rose-300 ring-2 ring-rose-50' : 'border-brand-light'}`}
                                        >
                                            <option value="" disabled>-- Pilih Kategori --</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="text-[10px] text-rose-500 font-bold mt-1">
                                                {errors.category_id}
                                            </p>
                                        )}
                                        <button 
                                            type="button"
                                            onClick={() => setShowCategoryModal(true)}
                                            className="text-[10px] font-bold text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-1 mt-1.5"
                                        >
                                            <iconify-icon icon="solar:add-circle-linear" class="text-xs"></iconify-icon>
                                            Tambah Kategori
                                        </button>
                                    </div>

                                    {/* Kode / SKU */}
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                            Kode / SKU
                                        </label>
                                        <input 
                                            type="text"
                                            value={sku}
                                            onChange={(e) => setSku(e.target.value)}
                                            placeholder="MAC-D01"
                                            className="w-full h-10 px-3 text-xs bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-semibold text-brand-dark"
                                        />
                                        <span className="text-[9px] text-brand-primary/60 mt-1 italic block">
                                            Opsional untuk manajemen inventori eksternal.
                                        </span>
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                            Deskripsi Singkat
                                        </label>
                                        <textarea 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Jelaskan rasa, bahan utama, atau catatan penyajian..."
                                            rows={3}
                                            className="w-full p-3 text-xs bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all resize-none font-medium text-brand-dark"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Harga & Biaya */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <iconify-icon icon="solar:tag-price-linear" class="text-lg text-brand-secondary"></iconify-icon>
                                    <h3 className="font-extrabold text-sm text-brand-dark">Harga & Biaya</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                    {/* Harga Jual */}
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                            Harga Jual (Rp) <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-primary/60">Rp</span>
                                            <input 
                                                type="number"
                                                required
                                                min="0"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0"
                                                className={`w-full h-10 pl-9 pr-3 text-xs bg-brand-bg border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-bold text-brand-secondary ${errors.price ? 'border-rose-300 ring-2 ring-rose-50' : 'border-brand-light'}`}
                                            />
                                        </div>
                                        {errors.price && (
                                            <p className="text-[10px] text-rose-500 font-bold mt-1">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>

                                    {/* HPP */}
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                            HPP (Opsional)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-primary/60">Rp</span>
                                            <input 
                                                type="number"
                                                min="0"
                                                value={estimatedHpp}
                                                onChange={(e) => setEstimatedHpp(e.target.value)}
                                                placeholder="0"
                                                className="w-full h-10 pl-9 pr-3 text-xs bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-semibold text-brand-dark"
                                            />
                                        </div>
                                    </div>

                                    {/* Margin */}
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                            Margin Keuntungan
                                        </label>
                                        <div className="w-full h-10 bg-brand-light/30 border border-brand-light rounded-xl flex items-center px-4 text-xs font-bold text-brand-dark">
                                            {marginPercent.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Recipe Costing Box */}
                                <Link 
                                    to="/recipe-costing"
                                    className="block p-4 rounded-xl border border-brand-light bg-brand-bg hover:border-brand-secondary hover:shadow-sm transition-all duration-150 group"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2 text-xs font-extrabold text-brand-dark">
                                            <iconify-icon icon="solar:notebook-linear" class="text-base text-brand-secondary"></iconify-icon>
                                            Recipe Costing
                                        </div>
                                        <span className="text-[10px] font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">Pilih Recipe</span>
                                    </div>
                                    <p className="text-[10px] text-brand-primary/60 font-medium leading-relaxed">
                                        Hubungkan menu ini dengan resep yang sudah ada untuk menghitung HPP secara otomatis berdasarkan harga bahan baku terbaru.
                                    </p>
                                </Link>
                            </div>

                            {/* Card 4: Status & Label */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <iconify-icon icon="solar:tag-linear" class="text-lg text-brand-secondary"></iconify-icon>
                                    <h3 className="font-extrabold text-sm text-brand-dark">Status & Label</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Status Ketersediaan */}
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-2">
                                            Status Ketersediaan
                                        </label>
                                        <div className="flex items-center bg-brand-bg p-1 rounded-xl border border-brand-light w-fit">
                                            <button 
                                                type="button"
                                                onClick={() => setIsActive(true)}
                                                className={`px-4 py-1.5 text-xs font-extrabold rounded-lg transition-all ${isActive ? 'bg-white text-brand-dark shadow-sm border border-brand-light' : 'text-brand-primary/40 hover:text-brand-dark'}`}
                                            >
                                                Tersedia
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setIsActive(false)}
                                                className={`px-4 py-1.5 text-xs font-extrabold rounded-lg transition-all ${!isActive ? 'bg-white text-brand-dark shadow-sm border border-brand-light' : 'text-brand-primary/40 hover:text-brand-dark'}`}
                                            >
                                                Habis
                                            </button>
                                        </div>
                                        <span className="text-[9px] text-brand-primary/60 mt-2 block">
                                            Tentukan apakah menu ini aktif di kasir.
                                        </span>
                                    </div>

                                    {/* Tags / Label */}
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-dark capitalize tracking-wider block mb-2">
                                            Tags / Label Produk
                                        </label>
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {tags.map((tag, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold bg-brand-light/30 text-brand-primary border border-brand-light rounded-lg"
                                                >
                                                    {tag}
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleRemoveTag(idx)}
                                                        className="text-brand-primary/50 hover:text-rose-500 font-bold shrink-0"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                            
                                            {showTagInput ? (
                                                <form onSubmit={handleAddTag} className="flex items-center gap-1">
                                                    <input 
                                                        type="text" 
                                                        value={newTag}
                                                        onChange={(e) => setNewTag(e.target.value)}
                                                        placeholder="Ketik tag..."
                                                        className="w-20 h-6 px-1.5 text-[10px] bg-white border border-brand-light rounded focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-bold text-brand-dark"
                                                        autoFocus
                                                    />
                                                    <button type="submit" className="text-xs text-brand-secondary hover:text-brand-primary">✓</button>
                                                    <button type="button" onClick={() => setShowTagInput(false)} className="text-xs text-brand-primary/40 hover:text-rose-500">✕</button>
                                                </form>
                                            ) : (
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowTagInput(true)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold bg-white border border-brand-light text-brand-primary rounded-lg hover:border-brand-secondary hover:bg-brand-bg transition-all"
                                                >
                                                    + Tambah Tag
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIVE PREVIEW & INVENTORY */}
                        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
                            
                            {/* Live Preview Card */}
                            <div className="bg-gradient-to-b from-brand-bg to-brand-light/30 rounded-3xl border border-brand-light shadow-sm p-4 relative overflow-hidden flex flex-col items-center">
                                <p className="text-[10px] font-extrabold text-brand-primary tracking-widest capitalize mb-3 self-start">Katalog Preview</p>
                                
                                <div className="bg-white w-full rounded-2xl border border-brand-light shadow-md overflow-hidden relative group flex flex-col max-w-[290px]">
                                    
                                    {/* Card Image Area */}
                                    <div className="relative aspect-square w-full bg-brand-light/25 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Catalog" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-brand-secondary/60">
                                                <iconify-icon icon="solar:cup-hot-linear" class="text-5xl"></iconify-icon>
                                                <span className="text-[9px] font-bold mt-2">PREVIEW IMAGE</span>
                                            </div>
                                        )}
                                        
                                        {/* Price Tag Overlay */}
                                        <div className="absolute top-2.5 right-2.5 bg-brand-dark text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-md tracking-wider">
                                            Rp {computedPrice.toLocaleString('id-ID')}
                                        </div>

                                        {/* Tag Overlay if Best Seller */}
                                        {tags.includes('Best Seller') && (
                                            <span className="absolute top-2.5 left-2.5 bg-brand-secondary text-white text-[8px] font-extrabold px-2 py-1 rounded shadow-sm tracking-wide">
                                                BEST SELLER
                                            </span>
                                        )}

                                        {/* Glassmorphism Title/Desc Box overlay */}
                                        <div className="absolute bottom-2 left-2 right-2 bg-white/70 backdrop-blur-md rounded-xl p-3 border border-white/40 shadow-sm flex flex-col justify-start">
                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                <span className="text-[8px] font-black tracking-wider text-brand-primary bg-brand-light/50 px-2 py-0.5 rounded">
                                                    {categoryNameUpper}
                                                </span>
                                                {tags.length > 0 && tags[0] !== 'Best Seller' && (
                                                    <span className="text-[8px] font-bold text-brand-secondary">
                                                        {tags[0].toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-extrabold text-[12px] text-brand-dark leading-tight line-clamp-1">
                                                {name || 'Nama Menu Baru'}
                                            </h4>
                                            <p className="text-[9px] text-brand-primary/70 font-semibold leading-normal line-clamp-2 mt-0.5">
                                                {description || 'Deskripsi singkat rasa, komposisi bahan baku, dan penyajian.'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Profitability Row Below Preview */}
                                    <div className="flex items-center justify-between border-t border-brand-light bg-brand-bg/50 p-3 text-center divide-x divide-brand-light">
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-[8px] font-bold text-brand-primary/60 tracking-wider">ESTIMASI MARGIN</span>
                                            <span className="text-xs font-black text-brand-dark mt-0.5">{marginPercent.toFixed(1)}%</span>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-[8px] font-bold text-brand-primary/60 tracking-wider">HPP PRODUK</span>
                                            <span className="text-xs font-black text-brand-dark mt-0.5">Rp {computedHpp.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Manajemen Inventori */}
                            <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <iconify-icon icon="solar:box-minimalistic-linear" class="text-lg text-brand-secondary"></iconify-icon>
                                        <h3 className="font-extrabold text-sm text-brand-dark">Manajemen Inventori</h3>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsInventoryEnabled(!isInventoryEnabled)}
                                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            isInventoryEnabled ? 'bg-brand-secondary' : 'bg-brand-light'
                                        }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            isInventoryEnabled ? 'translate-x-5' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-brand-primary/60 font-medium leading-normal mb-4">
                                    Lacak stok otomatis setiap kali ada penjualan untuk menu ini.
                                </p>

                                {/* Expanded form inputs */}
                                {isInventoryEnabled && (
                                    <div className="space-y-3 pt-3 border-t border-brand-light/50 animate-slideDown">
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Stok Awal */}
                                            <div>
                                                <label className="text-[9px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                                    Stok Awal
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={initialStock}
                                                    onChange={(e) => setInitialStock(e.target.value)}
                                                    className="w-full h-8 px-2.5 text-xs bg-brand-bg border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-bold text-brand-dark"
                                                />
                                            </div>

                                            {/* Satuan Unit */}
                                            <div>
                                                <label className="text-[9px] font-bold text-brand-dark capitalize tracking-wider block mb-1">
                                                    Satuan Unit
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={unit}
                                                    onChange={(e) => setUnit(e.target.value)}
                                                    className="w-full h-8 px-2.5 text-xs bg-brand-bg border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-bold text-brand-dark"
                                                />
                                            </div>
                                        </div>

                                        {/* Minimum Stock Alert */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-[9px] font-bold text-brand-dark capitalize tracking-wider block">
                                                    Minimum Stock Alert
                                                </label>
                                                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-[8px] font-bold text-rose-500 border border-rose-100 flex items-center gap-0.5">
                                                    <iconify-icon icon="solar:bell-linear" class="text-[9px]"></iconify-icon>
                                                    ALERT
                                                </span>
                                            </div>
                                            <input 
                                                type="number"
                                                value={minStock}
                                                onChange={(e) => setMinStock(e.target.value)}
                                                className="w-full h-8 px-2.5 text-xs bg-brand-bg border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-bold text-brand-dark"
                                            />
                                            <span className="text-[9px] text-brand-primary/60 mt-1 block">
                                                Sistem akan memberi notifikasi saat stok di bawah angka ini.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit & Cancel Buttons block */}
                            <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm flex flex-col gap-3">
                                <button 
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={processing}
                                    className="w-full py-3 bg-brand-dark text-white rounded-xl text-xs font-black shadow-md hover:bg-brand-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Memproses...' : isEditMode ? 'Simpan Menu Baru' : 'Simpan Menu Baru'}
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link 
                                        to="/menus"
                                        className="py-2.5 text-xs font-bold text-brand-dark/75 bg-white border border-brand-light rounded-xl hover:bg-brand-bg text-center transition-all shadow-sm flex items-center justify-center"
                                    >
                                        Batal
                                    </Link>
                                    <button 
                                        type="button"
                                        disabled={processing || isEditMode}
                                        onClick={(e) => handleSubmit(e, false)}
                                        className="py-2.5 text-xs font-bold text-brand-primary bg-white border border-brand-light rounded-xl hover:bg-brand-bg text-center transition-all shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Simpan & Tambah Lagi
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>



            {/* INLINE CATEGORY CREATION MODAL */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-brand-light p-6 w-full max-w-sm shadow-xl relative my-8 animate-fadeIn">
                        
                        <button 
                            type="button"
                            onClick={() => setShowCategoryModal(false)}
                            className="absolute top-4 right-4 p-1.5 text-brand-primary/40 hover:text-brand-dark hover:bg-brand-light/30 rounded-xl transition-all"
                        >
                            ✕
                        </button>

                        <h3 className="font-extrabold text-md text-brand-dark mb-1">
                            Tambah Kategori Baru
                        </h3>
                        <p className="text-[10px] text-brand-primary/60 mb-5">
                            Buat kategori menu hidangan baru di outlet Anda.
                        </p>

                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-brand-dark capitalize block mb-1">
                                    Nama Kategori <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    placeholder="Contoh: Coffee Khas"
                                    className="w-full h-9 px-3 text-xs bg-brand-bg border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-semibold text-brand-dark"
                                />
                                {catErrors.name && (
                                    <p className="text-[9px] text-rose-500 font-bold mt-1">
                                        {catErrors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-brand-dark capitalize block mb-1">
                                    Deskripsi
                                </label>
                                <textarea 
                                    value={newCatDesc}
                                    onChange={(e) => setNewCatDesc(e.target.value)}
                                    placeholder="Keterangan singkat..."
                                    rows={2}
                                    className="w-full p-2.5 text-xs bg-brand-bg border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary resize-none font-medium text-brand-dark"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setNewCatActive(!newCatActive)}
                                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        newCatActive ? 'bg-brand-secondary' : 'bg-brand-light'
                                    }`}
                                >
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        newCatActive ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                                </button>
                                <span className="text-[10px] font-bold text-brand-dark cursor-pointer select-none">
                                    Kategori Aktif
                                </span>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-brand-light">
                                <button 
                                    type="button"
                                    onClick={() => setShowCategoryModal(false)}
                                    className="flex-1 py-2 bg-white border border-brand-light text-brand-dark/75 rounded-lg text-xs font-bold hover:bg-brand-bg transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={catProcessing}
                                    className="flex-1 py-2 bg-brand-dark hover:bg-brand-primary text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                >
                                    {catProcessing ? 'Proses...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
