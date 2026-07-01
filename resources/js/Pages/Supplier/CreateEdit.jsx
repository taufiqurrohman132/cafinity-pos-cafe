import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from '@/api/inertia-mock';
import client from '@/api/client';
import Head from '@/Components/Head';
import SupplierFormSkeleton from '@/Components/Skeletons/SupplierFormSkeleton';

export default function SupplierCreateEdit() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    // Categories tag management
    const [categoriesList, setCategoriesList] = useState(['Hardware', 'IT Services']);
    const [newCategoryInput, setNewCategoryInput] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    // Simulated files upload state
    const [uploadedFiles, setUploadedFiles] = useState([
        { name: 'NPWP_Perusahaan_202.pdf', size: '2.4 MB' },
        { name: 'Profil_Bisnis_Digital.pdf', size: '4.1 MB' }
    ]);

    const { data, setData, post, put, processing, errors } = useForm({
        name: '',
        code: '',
        category: 'Hardware, IT Services', // Synced with categoriesList
        phone: '',
        email: '',
        address: '',
        city: '',
        province: '',
        payment_term: '',
        lead_time: 14,
        min_order: 50,
        status: 'active',
        notes: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        contact_position: 'Finance Manager',
    });

    // Load supplier data in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchSupplier = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await client.get(`/suppliers/${id}/edit`);
                    const supplier = res.data.supplier;
                    const primaryContact = supplier?.contacts?.find(c => c.is_primary) || supplier?.contacts?.[0] || {};
                    
                    setData({
                        name: supplier.name || '',
                        code: supplier.code || '',
                        category: supplier.category || '',
                        phone: supplier.phone || '',
                        email: supplier.email || '',
                        address: supplier.address || '',
                        city: supplier.city || '',
                        province: supplier.province || '',
                        payment_term: supplier.payment_term || '',
                        lead_time: supplier.lead_time ?? 14,
                        min_order: supplier.min_order ? parseInt(supplier.min_order) : 50,
                        status: supplier.status || 'active',
                        notes: supplier.notes || '',
                        contact_name: primaryContact.name || '',
                        contact_phone: primaryContact.phone || '',
                        contact_email: primaryContact.email || '',
                        contact_position: primaryContact.position || 'Finance Manager',
                    });

                    const initialCategories = supplier.category
                        ? supplier.category.split(',').map(s => s.trim()).filter(s => s !== '')
                        : ['Hardware', 'IT Services'];
                    setCategoriesList(initialCategories);
                } catch (err) {
                    console.error("Gagal memuat data supplier", err);
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSupplier();
        } else {
            // Generate automatic SUP code for create mode
            const year = new Date().getFullYear();
            const rand = Math.floor(Math.random() * 9000) + 1000;
            setData('code', `SUP-${year}-${rand}`);
            setLoading(false);
        }
    }, [id, isEditMode]);

    // Sync categoriesList array to form category field
    useEffect(() => {
        setData('category', categoriesList.join(', '));
    }, [categoriesList]);

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategoryInput.trim() !== '' && !categoriesList.includes(newCategoryInput.trim())) {
            setCategoriesList([...categoriesList, newCategoryInput.trim()]);
            setNewCategoryInput('');
            setShowCategoryInput(false);
        }
    };

    const handleRemoveCategory = (tagToRemove) => {
        setCategoriesList(categoriesList.filter(tag => tag !== tagToRemove));
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).map(file => ({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            }));
            setUploadedFiles([...uploadedFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (fileName) => {
        setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            put(`/suppliers/${id}`, {
                onSuccess: () => {
                    navigate('/suppliers');
                }
            });
        } else {
            post('/suppliers', {
                onSuccess: () => {
                    navigate('/suppliers');
                }
            });
        }
    };

    if (loading) {
        return <SupplierFormSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]/30 p-4">
                <div className="bg-white p-8 rounded-3xl border border-[#E6E6E6] max-w-md w-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-center">
                    <iconify-icon icon="solar:danger-triangle-linear" class="text-[#FF3B30] text-5xl mb-4 mx-auto block"></iconify-icon>
                    <h3 className="text-base font-semibold text-black mb-2">Terjadi Kesalahan</h3>
                    <p className="text-sm text-[#666666] mb-6">
                        Gagal memuat data supplier dari server. Silakan coba lagi.
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="w-full bg-[#BFFF00] hover:bg-[#C8FF5E] text-black py-2.5 rounded-xl font-semibold shadow-md active:scale-[0.97] transition-all"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    // Checklist criteria calculation
    const hasBasicInfo = data.name.trim() !== '' && categoriesList.length > 0;
    const hasPICInfo = data.contact_name.trim() !== '' && data.contact_phone.trim() !== '' && data.contact_email.trim() !== '';
    const hasDocuments = uploadedFiles.length > 0;
    const hasLogisticsInfo = data.address.trim() !== '' && data.city.trim() !== '' && data.province.trim() !== '' && data.lead_time > 0 && data.min_order > 0;

    return (
        <>
            <Head title={isEditMode ? `Edit Supplier - ${data.name}` : "Tambah Supplier Baru"} />

            <div className="min-h-screen bg-[#E6E6E6]/30 p-4 md:p-6 lg:p-8">
                <div className="max-w-[1400px] mx-auto space-y-6">

                    {/* Top Breadcrumb & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/suppliers" 
                                className="w-10 h-10 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center text-black/60 hover:text-black hover:border-black transition shadow-sm shrink-0"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div>
                                <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#666666] font-normal mb-1">
                                    <Link to="/suppliers" className="hover:text-black transition-colors">Supplier</Link>
                                    <span className="text-black/30">›</span>
                                    <span className="text-black font-semibold">{isEditMode ? "Edit Supplier" : "Tambah Supplier"}</span>
                                </nav>
                                <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-black to-[#333333]">
                                    {isEditMode ? "Edit Supplier" : "Tambah Supplier Baru"}
                                </h1>
                                <p className="text-[#666666] font-normal text-xs mt-1">
                                    {isEditMode 
                                        ? `Perbarui rincian informasi dan dokumen untuk mitra bisnis ${data.name}.` 
                                        : "Lengkapi informasi di bawah untuk mendaftarkan mitra bisnis baru ke sistem."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* ── LEFT COLUMN: FORM FIELDS ── */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Card 1: Identitas Perusahaan */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
                                <h3 className="text-base font-semibold text-black border-b border-[#E6E6E6] pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:shop-linear" class="text-black text-lg"></iconify-icon>
                                    Identitas Perusahaan
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Nama Supplier <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                            placeholder="PT. Teknologi Maju Utama"
                                            required
                                        />
                                        {errors.name && <p className="text-xs text-[#FF3B30] font-semibold">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Kode Supplier</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.code}
                                                disabled
                                                className="w-full px-4 py-2.5 text-sm bg-[#E6E6E6]/40 border border-[#D0D0D0] text-[#999999] rounded-xl font-mono cursor-not-allowed outline-none"
                                            />
                                        </div>
                                        <p className="text-[10px] text-[#999999] font-normal italic flex items-center gap-1">
                                            <iconify-icon icon="solar:info-circle-linear" class="text-xs"></iconify-icon>
                                            Dihasilkan secara otomatis oleh sistem.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Kategori Produk <span className="text-red-500">*</span></label>
                                        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-[#D0D0D0] rounded-xl min-h-[44px]">
                                            {categoriesList.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black text-[#BFFF00] border border-[#BFFF00]/10">
                                                    {tag}
                                                    <button type="button" onClick={() => handleRemoveCategory(tag)} className="hover:text-[#FF3B30] text-[10px] mt-0.5 transition-all duration-150 active:scale-[0.97]">
                                                        <iconify-icon icon="solar:close-circle-linear"></iconify-icon>
                                                    </button>
                                                </span>
                                            ))}

                                            {showCategoryInput ? (
                                                <div className="inline-flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={newCategoryInput}
                                                        onChange={(e) => setNewCategoryInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleAddCategory(e);
                                                        }}
                                                        className="px-2 py-0.5 text-xs border border-[#D0D0D0] rounded bg-white focus:outline-none w-24 transition-all duration-150 hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                        placeholder="Kategori..."
                                                        autoFocus
                                                    />
                                                    <button type="button" onClick={handleAddCategory} className="text-xs font-semibold text-black hover:text-black/70 transition-colors active:scale-[0.97]">Ok</button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCategoryInput(true)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-black border border-[#D0D0D0] hover:bg-[#E6E6E6] transition-all duration-150 active:scale-[0.97]"
                                                >
                                                    + Tambah
                                                </button>
                                            )}
                                        </div>
                                        {errors.category && <p className="text-xs text-[#FF3B30] font-semibold">{errors.category}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Status Akun</label>
                                        <div className="flex items-center gap-3 h-[44px]">
                                            <button
                                                type="button"
                                                onClick={() => setData('status', data.status === 'active' ? 'inactive' : 'active')}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${data.status === 'active' ? 'bg-[#BFFF00]' : 'bg-[#E6E6E6]' } active:scale-[0.97]`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <span className="text-sm font-semibold text-black">
                                                {data.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Informasi Kontak Utama */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
                                <h3 className="text-base font-semibold text-black border-b border-[#E6E6E6] pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:user-rounded-linear" class="text-black text-lg"></iconify-icon>
                                    Informasi Kontak Utama
                                </h3>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black mb-1.5 block">Nama PIC (Person In Charge) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                        placeholder="Hendra Wijaya"
                                        required
                                    />
                                    {errors.contact_name && <p className="text-xs text-[#FF3B30] font-semibold">{errors.contact_name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Nomor Telepon <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center">
                                                <iconify-icon icon="solar:phone-linear" class="text-base"></iconify-icon>
                                            </span>
                                            <input
                                                type="text"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                placeholder="+62 812 3456 7890"
                                                required
                                            />
                                        </div>
                                        <p className="text-[10px] text-[#999999] font-normal">Format: +62 812XXXXXXXX</p>
                                        {errors.contact_phone && <p className="text-xs text-[#FF3B30] font-semibold">{errors.contact_phone}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Email Bisnis <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center">
                                                <iconify-icon icon="solar:letter-linear" class="text-base"></iconify-icon>
                                            </span>
                                            <input
                                                type="email"
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                placeholder="hendra.w@tekmajua.co.id"
                                                required
                                            />
                                        </div>
                                        {errors.contact_email && <p className="text-xs text-[#FF3B30] font-semibold">{errors.contact_email}</p>}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => alert('Fitur tambah kontak sekunder sedang disiapkan.')}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black border border-[#D0D0D0] hover:bg-[#E6E6E6] rounded-xl transition-all duration-150 active:scale-[0.98]"
                                >
                                    + Tambah Kontak Sekunder
                                </button>
                            </div>

                            {/* Card 3: Detail Logistik & Operasional */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
                                <h3 className="text-base font-semibold text-black border-b border-[#E6E6E6] pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:map-point-linear" class="text-black text-lg"></iconify-icon>
                                    Detail Logistik &amp; Operasional
                                </h3>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black mb-1.5 block">Alamat Pengiriman / Gudang Utama <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 min-h-[80px]"
                                        placeholder="Jl. Industri No. 45, Kawasan Industri Jababeka, Cikarang"
                                        required
                                    />
                                    {errors.address && <p className="text-xs text-[#FF3B30] font-semibold">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Kota <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                            placeholder="Bekasi"
                                            required
                                        />
                                        {errors.city && <p className="text-xs text-[#FF3B30] font-semibold">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Provinsi <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                            placeholder="Jawa Barat"
                                            required
                                        />
                                        {errors.province && <p className="text-xs text-[#FF3B30] font-semibold">{errors.province}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Term Pembayaran <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.payment_term}
                                            onChange={(e) => setData('payment_term', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                            placeholder="e.g. Net 30"
                                            required
                                        />
                                        {errors.payment_term && <p className="text-xs text-[#FF3B30] font-semibold">{errors.payment_term}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Lead Time (Hari) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={data.lead_time}
                                                onChange={(e) => setData('lead_time', e.target.value)}
                                                className="w-full px-4 py-2.5 pr-10 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                min="0"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center pointer-events-none">
                                                <iconify-icon icon="solar:clock-circle-linear" class="text-base"></iconify-icon>
                                            </span>
                                        </div>
                                        {errors.lead_time && <p className="text-xs text-[#FF3B30] font-semibold">{errors.lead_time}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Minimum Order (MOQ) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={data.min_order}
                                                onChange={(e) => setData('min_order', e.target.value)}
                                                className="w-full px-4 py-2.5 pr-10 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                min="0"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center pointer-events-none">
                                                <iconify-icon icon="solar:box-linear" class="text-base"></iconify-icon>
                                            </span>
                                        </div>
                                        {errors.min_order && <p className="text-xs text-[#FF3B30] font-semibold">{errors.min_order}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Dokumen & Lampiran */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
                                <h3 className="text-base font-semibold text-black border-b border-[#E6E6E6] pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:document-linear" class="text-black text-lg"></iconify-icon>
                                    Dokumen &amp; Lampiran
                                </h3>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-black mb-1.5 block">Catatan Internal (Opsional)</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 min-h-[90px]"
                                        placeholder="Informasi tambahan untuk tim procurement..."
                                    />
                                    {errors.notes && <p className="text-xs text-[#FF3B30] font-semibold">{errors.notes}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-black mb-1.5 block">Lampiran Dokumen (NPWP, SIUP, Kontrak)</label>

                                    {/* Drag & Drop Area */}
                                    <div className="relative border-2 border-dashed border-[#D0D0D0] hover:border-[#BFFF00] rounded-2xl p-8 text-center bg-white hover:bg-[#BFFF00]/5 transition duration-150 cursor-pointer group flex flex-col items-center justify-center gap-2">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="w-12 h-12 rounded-full bg-neutral-100 text-black flex items-center justify-center group-hover:scale-110 transition duration-200">
                                            <iconify-icon icon="solar:upload-linear" class="text-2xl"></iconify-icon>
                                        </div>
                                        <p className="text-xs font-semibold text-black mt-2">Klik atau geser file untuk upload</p>
                                        <p className="text-[10px] text-[#999999] font-normal">Format yang didukung: PDF, JPG, PNG (Maks 10MB per file)</p>
                                    </div>

                                    {/* Uploaded Files Grid */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                            {uploadedFiles.map(file => (
                                                <div key={file.name} className="p-3 border border-[#E6E6E6] rounded-xl bg-white flex items-center justify-between shadow-sm">
                                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                                        <iconify-icon icon="solar:document-linear" class="text-[#999999] text-lg flex-shrink-0"></iconify-icon>
                                                        <div className="text-left overflow-hidden">
                                                            <p className="text-xs font-semibold text-black truncate">{file.name}</p>
                                                            <span className="text-[10px] text-[#999999] font-normal">{file.size}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(file.name)}
                                                        className="text-[#FF3B30] hover:text-red-700 p-1 hover:bg-red-50 rounded-lg flex-shrink-0 transition-all duration-150 active:scale-[0.97]"
                                                    >
                                                        <iconify-icon icon="solar:trash-bin-trash-linear" class="text-sm"></iconify-icon>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: SIDEBAR SUMMARY & CHECKLIST ── */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Live Preview Summary Card */}
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                                <div className="h-1.5 bg-[#BFFF00]" />
                                <div className="p-6 space-y-6">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-center text-xs">
                                        <span className={`px-2 py-0.5 rounded-full font-semibold capitalize tracking-wider text-[10px] border ${data.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                                            }`}>
                                            {data.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                        <span className="font-mono text-[#999999] font-normal">{data.code || 'SUP-XXXX-XXXX'}</span>
                                    </div>

                                    {/* Name and Tags */}
                                    <div className="space-y-2 text-left">
                                        <h3 className="text-lg font-semibold text-black leading-snug">
                                            {data.name.trim() || 'Nama Supplier'}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {categoriesList.length > 0 ? (
                                                categoriesList.map(tag => (
                                                    <span key={tag} className="text-[10px] font-semibold text-[#666666] bg-[#E6E6E6]/40 border border-[#D0D0D0] px-2.5 py-0.5 rounded-full capitalize tracking-wider">
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] font-semibold text-[#999999] bg-[#E6E6E6]/20 px-2 py-0.5 rounded capitalize tracking-wider">
                                                    Belum ada Kategori
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Details with Icons */}
                                    <div className="space-y-3 text-left border-t border-[#E6E6E6] pt-4">
                                        <div className="flex items-center gap-3 text-xs text-black">
                                            <div className="w-8 h-8 rounded-lg bg-[#E6E6E6]/40 text-black flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon="solar:users-group-two-rounded-linear" class="text-sm"></iconify-icon>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#999999] capitalize tracking-wider font-semibold">PIC</p>
                                                <p className="font-semibold text-black">{data.contact_name || 'Belum diisi'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-black">
                                            <div className="w-8 h-8 rounded-lg bg-[#E6E6E6]/40 text-black flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon="solar:phone-linear" class="text-sm"></iconify-icon>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#999999] capitalize tracking-wider font-semibold">Telepon</p>
                                                <p className="font-semibold text-black">{data.contact_phone || 'Belum diisi'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-black">
                                            <div className="w-8 h-8 rounded-lg bg-[#E6E6E6]/40 text-black flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon="solar:map-point-linear" class="text-sm"></iconify-icon>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#999999] capitalize tracking-wider font-semibold">Lokasi</p>
                                                <p className="font-semibold text-black">
                                                    {data.city && data.province
                                                        ? `${data.city}, ${data.province}`
                                                        : data.city || data.province || 'Belum diisi'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lead Time & Min Order */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-[#E6E6E6] pt-4">
                                        <div className="bg-[#E6E6E6]/20 border border-[#E6E6E6] rounded-xl p-3 text-center">
                                            <p className="text-[9px] font-semibold text-[#999999] capitalize tracking-widest">Lead Time</p>
                                            <p className="text-sm font-semibold text-black mt-1">{data.lead_time || '0'} Hari</p>
                                        </div>
                                        <div className="bg-[#E6E6E6]/20 border border-[#E6E6E6] rounded-xl p-3 text-center">
                                            <p className="text-[9px] font-semibold text-[#999999] capitalize tracking-widest">Min. Order</p>
                                            <p className="text-sm font-semibold text-black mt-1">{data.min_order || '0'} Unit</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 border-t border-[#E6E6E6] pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3 px-4 bg-[#BFFF00] hover:bg-[#C8FF5E] text-black text-xs font-semibold rounded-xl duration-150 active:scale-[0.98] shadow-sm disabled:opacity-60 transition-all"
                                        >
                                            {isEditMode ? "Simpan Perubahan" : "Simpan & Aktifkan"}
                                        </button>
                                        <div className="flex gap-2">
                                            {!isEditMode && (
                                                <button
                                                    type="button"
                                                    onClick={() => alert('Draf disimpan.')}
                                                    className="flex-1 py-2 text-xs font-semibold text-black bg-white hover:bg-[#E6E6E6] rounded-xl border border-[#D0D0D0] transition-all duration-150 active:scale-[0.98]"
                                                >
                                                    Simpan Draft
                                                </button>
                                            )}
                                            <Link
                                                to="/suppliers"
                                                className="flex-1 py-2 text-center text-xs font-semibold text-black bg-white hover:bg-[#E6E6E6] rounded-xl transition flex items-center justify-center border border-[#D0D0D0]"
                                            >
                                                Batal
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist Criteria Widget */}
                            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 space-y-4">
                                <h4 className="font-semibold text-black text-xs capitalize tracking-wider border-b border-[#E6E6E6] pb-2">
                                    Persyaratan Checklist
                                </h4>
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon
                                            icon={hasBasicInfo ? "solar:check-circle-bold" : "solar:round-transfer-broken"}
                                            class={`text-base ${hasBasicInfo ? 'text-emerald-500' : 'text-[#999999]'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasBasicInfo ? 'text-black' : 'text-[#999999]'}`}>Informasi Identitas Dasar</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon
                                            icon={hasPICInfo ? "solar:check-circle-bold" : "solar:round-transfer-broken"}
                                            class={`text-base ${hasPICInfo ? 'text-emerald-500' : 'text-[#999999]'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasPICInfo ? 'text-black' : 'text-[#999999]'}`}>Kontak Utama (PIC) Valid</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon
                                            icon={hasDocuments ? "solar:check-circle-bold" : "solar:round-transfer-broken"}
                                            class={`text-base ${hasDocuments ? 'text-emerald-500' : 'text-[#999999]'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasDocuments ? 'text-black' : 'text-[#999999]'}`}>Dokumen Legal Terlampir</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon
                                            icon={hasLogisticsInfo ? "solar:check-circle-bold" : "solar:round-transfer-broken"}
                                            class={`text-base ${hasLogisticsInfo ? 'text-emerald-500' : 'text-[#999999]'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasLogisticsInfo ? 'text-black' : 'text-[#999999]'}`}>Lengkapi Detail Logistik</span>
                                    </div>
                                </div>
                            </div>

                            {/* Help Banner Widget */}
                            <div className="bg-[#0E0E0E] rounded-2xl border border-black p-5 flex gap-3 text-left text-white">
                                <div className="text-[#BFFF00] mt-0.5 flex-shrink-0">
                                    <iconify-icon icon="solar:info-circle-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-xs font-semibold text-[#BFFF00] capitalize tracking-wider">Butuh bantuan?</h5>
                                    <p className="text-xs text-[#E6E6E6] leading-relaxed font-normal">
                                        Jika Anda kesulitan mendapatkan dokumen legal supplier, silakan hubungi tim Compliance di ekstensi 442.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
