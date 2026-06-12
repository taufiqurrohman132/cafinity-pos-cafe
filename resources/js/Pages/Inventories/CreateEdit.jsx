import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Head from "@/Components/Head";
import client from "@/api/client";
import InventoriesEditSkeleton from "@/Components/Skeletons/InventoriesEditSkeleton";

export default function InventoriesCreateEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Data lists from server
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Form inputs
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [unit, setUnit] = useState("");
    const [stock, setStock] = useState("");
    const [minStock, setMinStock] = useState("10");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [storageLocation, setStorageLocation] = useState("");
    const [notes, setNotes] = useState("");

    // Errors & Alerts
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Modals
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [catProcessing, setCatProcessing] = useState(false);
    const [catErrors, setCatErrors] = useState({});

    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [newSupplierName, setNewSupplierName] = useState("");
    const [newSupplierCategory, setNewSupplierCategory] = useState("Bahan Baku");
    const [newSupplierContact, setNewSupplierContact] = useState("");
    const [supplierProcessing, setSupplierProcessing] = useState(false);
    const [supplierErrors, setSupplierErrors] = useState({});

    // Fetch data on mount / route change
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setErrors({});
                setErrorMessage("");

                if (isEditMode) {
                    const res = await client.get(`/inventories/${id}/edit`);
                    const inv = res.data.inventory;
                    
                    setName(inv.name || "");
                    setCategoryId(inv.inventory_category_id || "");
                    setUnit(inv.unit || "");
                    setStock(inv.stock !== undefined && inv.stock !== null ? String(inv.stock) : "0");
                    setMinStock(inv.min_stock !== undefined && inv.min_stock !== null ? String(inv.min_stock) : "10");
                    setPricePerUnit(inv.price_per_unit !== undefined && inv.price_per_unit !== null ? String(inv.price_per_unit) : "");
                    setSupplierId(inv.supplier_id || "");
                    
                    setSuppliers(res.data.suppliers || []);
                    setCategories(res.data.categories || []);
                } else {
                    const res = await client.get("/inventories/create");
                    setSuppliers(res.data.suppliers || []);
                    setCategories(res.data.categories || []);
                    
                    // Reset to defaults for create mode
                    setName("");
                    setCategoryId("");
                    setUnit("Liter"); // Default unit to Liter
                    setStock("0");
                    setMinStock("10");
                    setPricePerUnit("");
                    setSupplierId("");
                    setStorageLocation("");
                    setNotes("");
                }
            } catch (err) {
                console.error("Gagal memuat data form inventori:", err);
                setErrorMessage("Gagal memuat data dari server. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    // Format helpers
    const fmt = (val) => {
        return new Intl.NumberFormat("id-ID").format(val ?? 0);
    };

    // Calculate dynamic values
    const computedStock = parseFloat(stock) || 0;
    const computedPrice = parseFloat(pricePerUnit) || 0;
    const estimatedValue = computedStock * computedPrice;

    // Get active category object & dynamic restock advisory
    const activeCategoryObj = categories.find((c) => c.id == categoryId);
    const categoryName = activeCategoryObj ? activeCategoryObj.name : "";

    const getRestockAdvisory = () => {
        if (!categoryName) {
            return (
                <>
                    Pilih kategori <span className="font-bold text-brand-secondary">dairy</span>, <span className="font-bold text-brand-secondary">coffee</span>, atau <span className="font-bold text-brand-secondary">sirup</span> untuk melihat saran stok minimum yang ideal.
                </>
            );
        }
        
        const catLower = categoryName.toLowerCase();
        const currentUnit = unit || "Unit";
        
        if (catLower.includes("dairy") || catLower.includes("susu")) {
            return (
                <>
                    Berdasarkan data kategori <span className="font-bold text-brand-secondary">Dairy</span>, kami menyarankan stok awal minimal <span className="font-bold text-brand-secondary">12 {currentUnit}</span> untuk memenuhi kebutuhan operasional <span className="font-bold text-brand-secondary">3 hari</span> ke depan.
                </>
            );
        } else if (catLower.includes("coffee") || catLower.includes("biji kopi") || catLower.includes("kopi")) {
            return (
                <>
                    Berdasarkan data kategori <span className="font-bold text-brand-secondary">Coffee</span>, kami menyarankan stok awal minimal <span className="font-bold text-brand-secondary">5 {currentUnit}</span> untuk memenuhi kebutuhan operasional <span className="font-bold text-brand-secondary">7 hari</span> ke depan.
                </>
            );
        } else if (catLower.includes("sirup") || catLower.includes("syrup") || catLower.includes("sauce")) {
            return (
                <>
                    Berdasarkan data kategori <span className="font-bold text-brand-secondary">Syrup</span>, kami menyarankan stok awal minimal <span className="font-bold text-brand-secondary">6 {currentUnit}</span> untuk memenuhi kebutuhan operasional <span className="font-bold text-brand-secondary">5 hari</span> ke depan.
                </>
            );
        } else {
            return (
                <>
                    Berdasarkan data kategori <span className="font-bold text-brand-secondary">{categoryName}</span>, kami menyarankan stok awal minimal <span className="font-bold text-brand-secondary">10 {currentUnit}</span> untuk memenuhi kebutuhan operasional standar.
                </>
            );
        }
    };

    // Form Submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        setProcessing(true);
        setErrors({});
        setErrorMessage("");
        setSuccessMessage("");

        // Basic client validation
        const validationErrors = {};
        if (!name.trim()) validationErrors.name = "Nama bahan wajib diisi.";
        if (!categoryId) validationErrors.inventory_category_id = "Kategori wajib dipilih.";
        if (!unit.trim()) validationErrors.unit = "Satuan wajib ditentukan.";
        if (stock === "" || parseFloat(stock) < 0) validationErrors.stock = "Stok awal minimal 0.";
        if (minStock === "" || parseFloat(minStock) < 0) validationErrors.min_stock = "Minimum stock alert minimal 0.";
        if (pricePerUnit === "" || parseFloat(pricePerUnit) < 0) validationErrors.price_per_unit = "Harga per satuan minimal 0.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setProcessing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const payload = {
            name: name.trim(),
            inventory_category_id: categoryId,
            unit: unit.trim(),
            stock: parseFloat(stock) || 0,
            min_stock: parseFloat(minStock) || 0,
            price_per_unit: parseInt(pricePerUnit) || 0,
            supplier_id: supplierId || null,
        };

        try {
            if (isEditMode) {
                await client.put(`/inventories/${id}`, payload);
                setSuccessMessage("Bahan baku berhasil diperbarui!");
            } else {
                await client.post("/inventories", payload);
                setSuccessMessage("Bahan baku berhasil ditambahkan!");
            }

            // Redirect back to catalogs page
            setTimeout(() => {
                navigate("/inventories");
            }, 1000);
        } catch (err) {
            console.error("Gagal menyimpan bahan baku:", err);
            if (err.response && err.response.status === 422) {
                const validationErrors = {};
                Object.entries(err.response.data.errors || {}).forEach(([key, messages]) => {
                    validationErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setErrors(validationErrors);
                setErrorMessage("Ada kesalahan validasi data. Silakan periksa kembali.");
            } else {
                setErrorMessage("Terjadi kesalahan saat menyimpan bahan baku.");
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setProcessing(false);
        }
    };

    // Category Quick Creation Submit
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) {
            setCatErrors({ name: "Nama kategori wajib diisi." });
            return;
        }

        setCatProcessing(true);
        setCatErrors({});

        try {
            const res = await client.post("/inventory-categories", {
                name: newCatName.trim(),
            });
            
            // Re-fetch form categories
            const fetchRes = isEditMode
                ? await client.get(`/inventories/${id}/edit`)
                : await client.get("/inventories/create");
            
            const updatedCategories = fetchRes.data.categories || [];
            setCategories(updatedCategories);

            // Select newly created category
            if (res.data.category && res.data.category.id) {
                setCategoryId(res.data.category.id);
            }

            setShowCategoryModal(false);
            setNewCatName("");
        } catch (err) {
            console.error("Gagal menambahkan kategori baru:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                setCatErrors({ name: err.response.data.errors.name[0] });
            } else {
                alert("Gagal menambahkan kategori.");
            }
        } finally {
            setCatProcessing(false);
        }
    };

    // Supplier Quick Creation Submit
    const handleSupplierSubmit = async (e) => {
        e.preventDefault();
        if (!newSupplierName.trim()) {
            setSupplierErrors({ name: "Nama supplier wajib diisi." });
            return;
        }
        if (!newSupplierContact.trim()) {
            setSupplierErrors({ contact_name: "Nama kontak utama wajib diisi." });
            return;
        }

        setSupplierProcessing(true);
        setSupplierErrors({});

        try {
            const payload = {
                name: newSupplierName.trim(),
                category: newSupplierCategory.trim(),
                contact_name: newSupplierContact.trim(),
                status: "active",
            };

            const res = await client.post("/suppliers", payload);

            // Re-fetch form suppliers
            const fetchRes = isEditMode
                ? await client.get(`/inventories/${id}/edit`)
                : await client.get("/inventories/create");
            
            const updatedSuppliers = fetchRes.data.suppliers || [];
            setSuppliers(updatedSuppliers);

            // Select newly created supplier
            if (res.data.supplier && res.data.supplier.id) {
                setSupplierId(res.data.supplier.id);
            }

            setShowSupplierModal(false);
            setNewSupplierName("");
            setNewSupplierContact("");
            setNewSupplierCategory("Bahan Baku");
        } catch (err) {
            console.error("Gagal menambahkan supplier baru:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const formatted = {};
                Object.entries(err.response.data.errors).forEach(([k, v]) => {
                    formatted[k] = Array.isArray(v) ? v[0] : v;
                });
                setSupplierErrors(formatted);
            } else {
                alert("Gagal menambahkan supplier.");
            }
        } finally {
            setSupplierProcessing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Head title={isEditMode ? "Edit Bahan Baku" : "Tambah Bahan Baku"} />
                <InventoriesEditSkeleton />
            </>
        );
    }

    return (
        <>
            <Head title={isEditMode ? "Edit Bahan Baku" : "Tambah Bahan Baku"} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6 pb-48">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Top Breadcrumb & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/inventories" 
                                className="w-10 h-10 rounded-full bg-white border border-brand-light flex items-center justify-center text-brand-primary/60 hover:text-brand-primary hover:border-brand-primary transition shadow-sm shrink-0"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div>
                                <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-primary/60 font-medium mb-1">
                                    <Link to="/inventories" className="hover:text-brand-primary transition-colors">Inventori</Link>
                                    <span className="text-brand-primary/40">›</span>
                                    <span className="text-brand-dark font-semibold">{isEditMode ? "Edit Bahan" : "Tambah Bahan"}</span>
                                </nav>
                                <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                                    {isEditMode ? "Edit Detail Bahan Baku" : "Tambah Bahan Baku Baru"}
                                </h1>
                                <p className="text-brand-primary/60 font-medium text-xs mt-1">
                                    Kelola spesifikasi bahan baku, status stok awal, dan integrasi supplier utama.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                to="/inventories"
                                className="px-5 py-2.5 text-xs font-extrabold text-brand-dark/75 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition duration-150 active:scale-95 shadow-sm"
                            >
                                Batal
                            </Link>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="px-6 py-2.5 text-xs font-extrabold text-white bg-brand-dark hover:bg-brand-primary rounded-xl transition duration-150 active:scale-95 shadow-md disabled:opacity-60"
                            >
                                {processing ? "Menyimpan..." : "Simpan Bahan"}
                            </button>
                        </div>
                    </div>

                    {/* Alert Notifications */}
                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center text-xl text-emerald-500">
                                    <iconify-icon icon="solar:check-circle-linear"></iconify-icon>
                                </span>
                                <span className="text-xs font-bold">{successMessage}</span>
                            </div>
                            <Link to="/inventories" className="text-xs font-extrabold text-emerald-600 hover:text-emerald-800 transition-colors">
                                Lihat di Katalog
                            </Link>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn">
                            <span className="flex items-center text-xl text-rose-500">
                                <iconify-icon icon="solar:danger-triangle-linear"></iconify-icon>
                            </span>
                            <span className="text-xs font-bold">{errorMessage}</span>
                        </div>
                    )}

                    {/* Form & Sidebar Layout */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT COLUMN: Form Cards */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Card 1: Informasi Dasar */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <h3 className="font-bold text-brand-dark text-base flex items-center gap-1.5">
                                        Informasi Dasar
                                    </h3>
                                    <span className="text-brand-primary/40 hover:text-brand-dark cursor-pointer flex items-center text-sm" title="Informasi detail mengenai bahan baku">
                                        <iconify-icon icon="solar:info-circle-linear"></iconify-icon>
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {/* Nama Bahan */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                            Nama Bahan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Contoh: Susu UHT Full Cream"
                                            className={`w-full h-10 px-3 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-semibold text-brand-dark ${
                                                errors.name ? "border-rose-300 ring-2 ring-rose-50" : "border-brand-light"
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Kategori & Satuan */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Kategori Select with Add Button */}
                                        <div>
                                            <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                                Kategori <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    required
                                                    value={categoryId}
                                                    onChange={(e) => setCategoryId(e.target.value)}
                                                    className={`flex-1 h-10 px-3 text-xs bg-brand-light/30 border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all cursor-pointer font-semibold text-brand-dark ${
                                                        errors.inventory_category_id ? "border-rose-300 ring-2 ring-rose-50" : ""
                                                    }`}
                                                >
                                                    <option value="" disabled>-- Pilih Kategori --</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCategoryModal(true)}
                                                    className="w-10 h-10 border border-brand-light bg-brand-light/30 rounded-xl flex items-center justify-center text-lg text-brand-primary hover:bg-brand-light transition active:scale-95"
                                                    title="Tambah Kategori Baru"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            {errors.inventory_category_id && (
                                                <p className="text-[10px] text-rose-500 font-bold mt-1">
                                                    {errors.inventory_category_id}
                                                </p>
                                            )}
                                        </div>

                                        {/* Satuan Select/Combo Input */}
                                        <div>
                                            <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                                Satuan <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                                className={`w-full h-10 px-3 text-xs bg-brand-light/30 border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all cursor-pointer font-semibold text-brand-dark ${
                                                    errors.unit ? "border-rose-300 ring-2 ring-rose-50" : ""
                                                }`}
                                            >
                                                <option value="" disabled>-- Pilih Satuan --</option>
                                                <option value="Gram">Gram (g)</option>
                                                <option value="Mililiter">Mililiter (ml)</option>
                                                <option value="Liter">Liter (L)</option>
                                                <option value="Kilogram">Kilogram (kg)</option>
                                                <option value="Pcs">Pcs</option>
                                                <option value="Porsi">Porsi</option>
                                                <option value="Pack">Pack</option>
                                                <option value="Botol">Botol</option>
                                                <option value="Kaleng">Kaleng</option>
                                                <option value="Box">Box</option>
                                            </select>
                                            {errors.unit && (
                                                <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.unit}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Manajemen Stok & Harga */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-brand-dark text-base">Manajemen Stok & Harga</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Stok Awal */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                            Stok Awal
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            placeholder="0"
                                            className="w-full h-10 px-3 text-xs bg-white border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-semibold text-brand-dark"
                                        />
                                        <span className="text-[10px] text-brand-primary/50 mt-1.5 block leading-normal">
                                            Jumlah stok saat ini yang tersedia di gudang/toko.
                                        </span>
                                        {errors.stock && (
                                            <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.stock}</p>
                                        )}
                                    </div>

                                    {/* Minimum Stock Alert */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                            Minimum Stock Alert
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="any"
                                                value={minStock}
                                                onChange={(e) => setMinStock(e.target.value)}
                                                placeholder="10"
                                                className="w-full h-10 pl-3 pr-10 text-xs bg-white border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-semibold text-brand-dark"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 flex items-center text-sm">
                                                <iconify-icon icon="solar:danger-triangle-linear"></iconify-icon>
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-brand-primary/50 mt-1.5 block leading-normal">
                                            Sistem akan memberi notifikasi jika stok di bawah angka ini.
                                        </span>
                                        {errors.min_stock && (
                                            <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.min_stock}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Harga Rata-rata (Rp) */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                            Harga Rata-rata (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            value={pricePerUnit}
                                            onChange={(e) => setPricePerUnit(e.target.value)}
                                            placeholder="Rp 0"
                                            className="w-full h-10 px-3 text-xs bg-brand-light/20 border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-bold text-brand-secondary"
                                        />
                                        {errors.price_per_unit && (
                                            <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.price_per_unit}</p>
                                        )}
                                    </div>

                                    {/* Lokasi Penyimpanan */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                            Lokasi Penyimpanan
                                        </label>
                                        <input
                                            type="text"
                                            value={storageLocation}
                                            onChange={(e) => setStorageLocation(e.target.value)}
                                            placeholder="Contoh: Chiller A, Rak 2"
                                            className="w-full h-10 px-3 text-xs bg-white border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all font-semibold text-brand-dark"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Supplier & Keterangan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-brand-dark text-base">Supplier & Keterangan</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Supplier Select with Add Button */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                            Supplier Utama
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={supplierId}
                                                onChange={(e) => setSupplierId(e.target.value)}
                                                className="flex-1 h-10 px-3 text-xs bg-brand-light/30 border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all cursor-pointer font-semibold text-brand-dark"
                                            >
                                                <option value="">-- Pilih Supplier --</option>
                                                {suppliers.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowSupplierModal(true)}
                                                className="w-10 h-10 border border-brand-light bg-brand-light/30 rounded-xl flex items-center justify-center text-lg text-brand-primary hover:bg-brand-light transition active:scale-95"
                                                title="Tambah Supplier Baru"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Keterangan Tambahan */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-dark block mb-1.5">
                                            Keterangan Tambahan
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Catatan mengenai cara penyimpanan khusus atau detail lainnya..."
                                            rows={4}
                                            className="w-full p-3 text-xs bg-white border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary transition-all resize-none font-medium text-brand-dark"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Sidebar Summary & Helpers */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                            
                            {/* Card 1: RINGKASAN INPUT */}
                            <div className="bg-emerald-500 text-white p-5 rounded-2xl border border-emerald-400 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <p className="text-[10px] font-bold tracking-widest capitalize opacity-90">
                                        RINGKASAN INPUT
                                    </p>
                                    
                                    <div className="flex items-center justify-between border-b border-white/20 pb-3">
                                        <p className="text-xs font-semibold">Nama Bahan</p>
                                        <p className={`text-xs font-bold ${!name.trim() ? "italic text-emerald-100/70" : ""}`}>
                                            {name.trim() ? name.trim() : "Belum diisi"}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-white/20 pb-3">
                                        <p className="text-xs font-semibold">Estimasi Nilai</p>
                                        <p className="text-xs font-bold">
                                            Rp {fmt(estimatedValue)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold">Status Awal</p>
                                        <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded text-[9px] font-black tracking-wider capitalize">
                                            {isEditMode ? "TERSEDIA" : "DRAFT"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Saran Restock */}
                            <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-3">
                                <div className="flex items-center gap-2 text-brand-dark font-bold text-xs">
                                    <span className="text-base text-brand-primary flex items-center">
                                        <iconify-icon icon="solar:notebook-linear"></iconify-icon>
                                    </span>
                                    Saran Restock
                                </div>
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-[10px] text-brand-secondary font-semibold leading-relaxed">
                                    {getRestockAdvisory()}
                                </div>
                            </div>

                            {/* Card 3: Quick Help */}
                            <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-3">
                                <h4 className="text-brand-dark font-bold text-xs">Quick Help</h4>
                                <ul className="space-y-2 text-[10px] text-brand-primary/60 font-semibold leading-relaxed">
                                    <li className="flex gap-2 items-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Gunakan Satuan Terkecil untuk akurasi resep yang lebih baik.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Foto label bahan bisa diunggah di bagian keterangan (Opsional).</span>
                                    </li>
                                </ul>
                            </div>

                        </div>

                    </form>

                    {/* Spacer to prevent content from being covered by the sticky footer */}
                    <div className="h-36"></div>

                </div>
            </div>

            {/* STICKY BOTTOM FOOTER BANNER */}
            <div className="fixed bottom-0 left-[260px] right-0 z-40 bg-white border-t border-brand-light py-4 px-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-brand-primary/60">
                        Perubahan belum disimpan
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/inventories"
                        className="px-5 py-2.5 text-xs font-bold text-brand-dark/75 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition duration-150 shadow-sm active:scale-95"
                    >
                        Batalkan
                    </Link>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition duration-150 active:scale-95 shadow-md disabled:opacity-60"
                    >
                        {processing ? "Menyimpan..." : "Simpan Bahan"}
                    </button>
                </div>
            </div>

            {/* INLINE CATEGORY QUICK CREATION MODAL */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-brand-light p-6 w-full max-w-sm shadow-xl relative my-8 animate-fadeIn">
                        
                        <button
                            type="button"
                            onClick={() => {
                                setShowCategoryModal(false);
                                setCatErrors({});
                                setNewCatName("");
                            }}
                            className="absolute top-4 right-4 p-1.5 text-brand-primary/40 hover:text-brand-dark hover:bg-brand-light/35 rounded-xl transition-all"
                        >
                            ✕
                        </button>

                        <h3 className="font-extrabold text-md text-brand-dark mb-1">
                            Tambah Kategori Baru
                        </h3>
                        <p className="text-[10px] text-brand-primary/60 mb-5">
                            Buat kategori bahan baku baru di outlet Anda.
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
                                    placeholder="Contoh: Dairy, Sirup, Coffee"
                                    className={`w-full h-9 px-3 text-xs bg-brand-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-semibold text-brand-dark ${
                                        catErrors.name ? "border-rose-300 ring-2 ring-rose-50" : "border-brand-light"
                                    }`}
                                />
                                {catErrors.name && (
                                    <p className="text-[9px] text-rose-500 font-bold mt-1">
                                        {catErrors.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-brand-light">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCategoryModal(false);
                                        setCatErrors({});
                                        setNewCatName("");
                                    }}
                                    className="flex-1 py-2 bg-white border border-brand-light text-brand-primary/65 rounded-lg text-xs font-bold hover:bg-brand-light/30 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={catProcessing}
                                    className="flex-1 py-2 bg-brand-dark hover:bg-brand-primary text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                >
                                    {catProcessing ? "Proses..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* INLINE SUPPLIER QUICK CREATION MODAL */}
            {showSupplierModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-brand-light p-6 w-full max-w-sm shadow-xl relative my-8 animate-fadeIn">
                        
                        <button
                            type="button"
                            onClick={() => {
                                setShowSupplierModal(false);
                                setSupplierErrors({});
                                setNewSupplierName("");
                                setNewSupplierContact("");
                            }}
                            className="absolute top-4 right-4 p-1.5 text-brand-primary/40 hover:text-brand-dark hover:bg-brand-light/35 rounded-xl transition-all"
                        >
                            ✕
                        </button>

                        <h3 className="font-extrabold text-md text-brand-dark mb-1">
                            Tambah Supplier Baru
                        </h3>
                        <p className="text-[10px] text-brand-primary/60 mb-5">
                            Daftarkan supplier utama baru untuk pengadaan inventaris.
                        </p>

                        <form onSubmit={handleSupplierSubmit} className="space-y-4">
                            {/* Supplier Name */}
                            <div>
                                <label className="text-[10px] font-bold text-brand-dark capitalize block mb-1">
                                    Nama Supplier <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newSupplierName}
                                    onChange={(e) => setNewSupplierName(e.target.value)}
                                    placeholder="Contoh: PT. Global Dairy Milk"
                                    className={`w-full h-9 px-3 text-xs bg-brand-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-semibold text-brand-dark ${
                                        supplierErrors.name ? "border-rose-300 ring-2 ring-rose-50" : "border-brand-light"
                                    }`}
                                />
                                {supplierErrors.name && (
                                    <p className="text-[9px] text-rose-500 font-bold mt-1">
                                        {supplierErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Contact Name */}
                            <div>
                                <label className="text-[10px] font-bold text-brand-dark capitalize block mb-1">
                                    Nama Kontak Person <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newSupplierContact}
                                    onChange={(e) => setNewSupplierContact(e.target.value)}
                                    placeholder="Contoh: Dian Permata"
                                    className={`w-full h-9 px-3 text-xs bg-brand-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-semibold text-brand-dark ${
                                        supplierErrors.contact_name ? "border-rose-300 ring-2 ring-rose-50" : "border-brand-light"
                                    }`}
                                />
                                {supplierErrors.contact_name && (
                                    <p className="text-[9px] text-rose-500 font-bold mt-1">
                                        {supplierErrors.contact_name}
                                    </p>
                                )}
                            </div>

                            {/* Supplier Category */}
                            <div>
                                <label className="text-[10px] font-bold text-brand-dark capitalize block mb-1">
                                    Kategori Kemitraan
                                </label>
                                <input
                                    type="text"
                                    value={newSupplierCategory}
                                    onChange={(e) => setNewSupplierCategory(e.target.value)}
                                    placeholder="Contoh: Bahan Baku, Packaging"
                                    className="w-full h-9 px-3 text-xs bg-brand-bg border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-secondary font-semibold text-brand-dark"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-brand-light">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSupplierModal(false);
                                        setSupplierErrors({});
                                        setNewSupplierName("");
                                        setNewSupplierContact("");
                                    }}
                                    className="flex-1 py-2 bg-white border border-brand-light text-brand-primary/65 rounded-lg text-xs font-bold hover:bg-brand-light/30 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={supplierProcessing}
                                    className="flex-1 py-2 bg-brand-dark hover:bg-brand-primary text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                >
                                    {supplierProcessing ? "Proses..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}