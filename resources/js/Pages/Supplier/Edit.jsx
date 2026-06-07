import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@/api/inertia-mock';
import Head from '@/Components/Head';

export default function SupplierEdit({ supplier }) {
    const navigate = useNavigate();
    const primaryContact = supplier.contacts?.find(c => c.is_primary) || supplier.contacts?.[0] || {};

    // Parse categories from database comma-separated format
    const initialCategories = supplier.category 
        ? supplier.category.split(',').map(s => s.trim()).filter(s => s !== '') 
        : ['Hardware', 'IT Services'];

    const [categoriesList, setCategoriesList] = useState(initialCategories);
    const [newCategoryInput, setNewCategoryInput] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    // Simulated files upload state
    const [uploadedFiles, setUploadedFiles] = useState([
        { name: 'NPWP_Perusahaan_202.pdf', size: '2.4 MB' },
        { name: 'Profil_Bisnis_Digital.pdf', size: '4.1 MB' }
    ]);

    const { data, setData, put, processing, errors } = useForm({
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
        put(`/suppliers/${supplier.id}`, {
            onSuccess: () => {
                navigate('/suppliers');
            }
        });
    };

    // Checklist criteria calculation
    const hasBasicInfo = data.name.trim() !== '' && categoriesList.length > 0;
    const hasPICInfo = data.contact_name.trim() !== '' && data.contact_phone.trim() !== '' && data.contact_email.trim() !== '';
    const hasDocuments = uploadedFiles.length > 0;
    const hasLogisticsInfo = data.address.trim() !== '' && data.city.trim() !== '' && data.province.trim() !== '' && data.lead_time > 0 && data.min_order > 0;

    return (
        <AppLayout>
            <Head title={`Edit Supplier - ${supplier.name}`} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6 lg:p-8">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    
                    {/* Breadcrumbs & Header */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                            <Link to="/suppliers" className="hover:text-brand-primary transition">Daftar Supplier</Link>
                            <iconify-icon icon="solar:alt-arrow-right-linear" class="text-[10px]"></iconify-icon>
                            <span className="text-gray-600">Edit Supplier</span>
                        </div>
                        <h1 className="text-3xl font-black text-brand-dark tracking-tight mt-1">Edit Supplier</h1>
                        <p className="text-gray-500 text-sm">Perbarui rincian informasi dan dokumen untuk mitra bisnis {supplier.name}.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* ── LEFT COLUMN: FORM FIELDS ── */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* Card 1: Identitas Perusahaan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                                <h3 className="text-base font-extrabold text-brand-dark border-b border-brand-light/40 pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:shop-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Identitas Perusahaan
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nama Supplier <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                            placeholder="PT. Teknologi Maju Utama"
                                            required
                                        />
                                        {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Kode Supplier</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={data.code}
                                                disabled
                                                className="w-full px-4 py-2.5 text-sm bg-gray-100 border border-brand-light text-gray-500 rounded-xl font-mono cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium italic flex items-center gap-1">
                                            <iconify-icon icon="solar:info-circle-linear" class="text-xs"></iconify-icon>
                                            Dihasilkan secara otomatis oleh sistem.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Kategori Produk <span className="text-red-500">*</span></label>
                                        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50/50 border border-brand-light rounded-xl min-h-[44px]">
                                            {categoriesList.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                                                    {tag}
                                                    <button type="button" onClick={() => handleRemoveCategory(tag)} className="hover:text-red-500 transition text-[10px] mt-0.5">
                                                        <iconify-icon icon="solar:close-circle-linear"></iconify-icon>
                                                    </button>
                                                </span>
                                            ))}
                                            
                                            {showCategoryInput ? (
                                                <form onSubmit={handleAddCategory} className="inline-flex items-center gap-1">
                                                    <input 
                                                        type="text"
                                                        value={newCategoryInput}
                                                        onChange={(e) => setNewCategoryInput(e.target.value)}
                                                        className="px-2 py-0.5 text-xs border border-brand-light rounded bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary w-24"
                                                        placeholder="Kategori..."
                                                        autoFocus
                                                    />
                                                    <button type="submit" className="text-xs font-bold text-brand-primary hover:underline">Ok</button>
                                                </form>
                                            ) : (
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowCategoryInput(true)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-brand-primary hover:bg-brand-primary/5 transition"
                                                >
                                                    + Tambah
                                                </button>
                                            )}
                                        </div>
                                        {errors.category && <p className="text-xs text-red-500 font-semibold">{errors.category}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Status Akun</label>
                                        <div className="flex items-center gap-3 h-[44px]">
                                            <button 
                                                type="button"
                                                onClick={() => setData('status', data.status === 'active' ? 'inactive' : 'active')}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                    data.status === 'active' ? 'bg-brand-primary' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span 
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        data.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                            <span className="text-sm font-bold text-gray-700">
                                                {data.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Informasi Kontak Utama */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                                <h3 className="text-base font-extrabold text-brand-dark border-b border-brand-light/40 pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:user-rounded-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Informasi Kontak Utama
                                </h3>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nama PIC (Person In Charge) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text"
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                        placeholder="Hendra Wijaya"
                                        required
                                    />
                                    {errors.contact_name && <p className="text-xs text-red-500 font-semibold">{errors.contact_name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nomor Telepon <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                <iconify-icon icon="solar:phone-linear" class="text-base"></iconify-icon>
                                            </span>
                                            <input 
                                                type="text"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                placeholder="+62 812 3456 7890"
                                                required
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-semibold">Format: +62 812XXXXXXXX</p>
                                        {errors.contact_phone && <p className="text-xs text-red-500 font-semibold">{errors.contact_phone}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Email Bisnis <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                <iconify-icon icon="solar:letter-linear" class="text-base"></iconify-icon>
                                            </span>
                                            <input 
                                                type="email"
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                placeholder="hendra.w@tekmajua.co.id"
                                                required
                                            />
                                        </div>
                                        {errors.contact_email && <p className="text-xs text-red-500 font-semibold">{errors.contact_email}</p>}
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => alert('Fitur tambah kontak sekunder sedang disiapkan.')}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-primary border border-brand-light hover:bg-brand-primary/5 rounded-xl transition"
                                >
                                    + Tambah Kontak Sekunder
                                </button>
                            </div>

                            {/* Card 3: Detail Logistik & Operasional */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                                <h3 className="text-base font-extrabold text-brand-dark border-b border-brand-light/40 pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:map-point-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Detail Logistik &amp; Operasional
                                </h3>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Alamat Pengiriman / Gudang Utama <span className="text-red-500">*</span></label>
                                    <textarea 
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all min-h-[80px]"
                                        placeholder="Jl. Industri No. 45, Kawasan Industri Jababeka, Cikarang"
                                        required
                                    />
                                    {errors.address && <p className="text-xs text-red-500 font-semibold">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Kota <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                            placeholder="Bekasi"
                                            required
                                        />
                                        {errors.city && <p className="text-xs text-red-500 font-semibold">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Provinsi <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text"
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                            placeholder="Jawa Barat"
                                            required
                                        />
                                        {errors.province && <p className="text-xs text-red-500 font-semibold">{errors.province}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Term Pembayaran <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text"
                                            value={data.payment_term}
                                            onChange={(e) => setData('payment_term', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                            placeholder="e.g. Net 30"
                                            required
                                        />
                                        {errors.payment_term && <p className="text-xs text-red-500 font-semibold">{errors.payment_term}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Lead Time (Hari) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input 
                                                type="number"
                                                value={data.lead_time}
                                                onChange={(e) => setData('lead_time', e.target.value)}
                                                className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                min="0"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
                                                <iconify-icon icon="solar:clock-circle-linear" class="text-base"></iconify-icon>
                                            </span>
                                        </div>
                                        {errors.lead_time && <p className="text-xs text-red-500 font-semibold">{errors.lead_time}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Minimum Order (MOQ) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input 
                                                type="number"
                                                value={data.min_order}
                                                onChange={(e) => setData('min_order', e.target.value)}
                                                className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                min="0"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
                                                <iconify-icon icon="solar:box-linear" class="text-base"></iconify-icon>
                                            </span>
                                        </div>
                                        {errors.min_order && <p className="text-xs text-red-500 font-semibold">{errors.min_order}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Dokumen & Lampiran */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5">
                                <h3 className="text-base font-extrabold text-brand-dark border-b border-brand-light/40 pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:document-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Dokumen &amp; Lampiran
                                </h3>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Catatan Internal (Opsional)</label>
                                    <textarea 
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all min-h-[90px]"
                                        placeholder="Informasi tambahan untuk tim procurement..."
                                    />
                                    {errors.notes && <p className="text-xs text-red-500 font-semibold">{errors.notes}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">Lampiran Dokumen (NPWP, SIUP, Kontrak)</label>
                                    
                                    {/* Drag & Drop Area */}
                                    <div className="relative border-2 border-dashed border-brand-light hover:border-brand-primary rounded-2xl p-8 text-center bg-gray-50/30 hover:bg-brand-primary/5 transition duration-150 cursor-pointer group flex flex-col items-center justify-center gap-2">
                                        <input 
                                            type="file" 
                                            multiple
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="w-12 h-12 rounded-full bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:scale-110 transition duration-200">
                                            <iconify-icon icon="solar:upload-linear" class="text-2xl"></iconify-icon>
                                        </div>
                                        <p className="text-xs font-extrabold text-brand-primary mt-2">Klik atau geser file untuk upload</p>
                                        <p className="text-[10px] text-gray-400 font-semibold">Format yang didukung: PDF, JPG, PNG (Maks 10MB per file)</p>
                                    </div>

                                    {/* Uploaded Files Grid */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                            {uploadedFiles.map(file => (
                                                <div key={file.name} className="p-3 border border-brand-light/80 rounded-xl bg-white flex items-center justify-between shadow-sm">
                                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                                        <iconify-icon icon="solar:document-linear" class="text-gray-400 text-lg flex-shrink-0"></iconify-icon>
                                                        <div className="text-left overflow-hidden">
                                                            <p className="text-xs font-bold text-gray-700 truncate">{file.name}</p>
                                                            <span className="text-[10px] text-gray-400 font-semibold">{file.size}</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveFile(file.name)} 
                                                        className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded-lg flex-shrink-0"
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
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm overflow-hidden flex flex-col">
                                <div className="h-1.5 bg-brand-primary" />
                                <div className="p-6 space-y-6">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-center text-xs">
                                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                                            data.status === 'active' 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                        }`}>
                                            {data.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                        <span className="font-mono text-gray-400 font-bold">{data.code || 'SUP-XXXX-XXXX'}</span>
                                    </div>

                                    {/* Name and Tags */}
                                    <div className="space-y-2 text-left">
                                        <h3 className="text-lg font-black text-brand-dark leading-snug">
                                            {data.name.trim() || 'Nama Supplier'}
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {categoriesList.length > 0 ? (
                                                categoriesList.map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                    Belum ada Kategori
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Details with Icons */}
                                    <div className="space-y-3 text-left border-t border-brand-light/50 pt-4">
                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/5 text-brand-primary flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon="solar:users-group-two-rounded-linear" class="text-sm"></iconify-icon>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">PIC</p>
                                                <p className="font-bold text-gray-800">{data.contact_name || 'Belum diisi'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/5 text-brand-primary flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon="solar:phone-linear" class="text-sm"></iconify-icon>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Telepon</p>
                                                <p className="font-bold text-gray-800">{data.contact_phone || 'Belum diisi'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/5 text-brand-primary flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon="solar:map-point-linear" class="text-sm"></iconify-icon>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Lokasi</p>
                                                <p className="font-bold text-gray-800">
                                                    {data.city && data.province 
                                                        ? `${data.city}, ${data.province}` 
                                                        : data.city || data.province || 'Belum diisi'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lead Time & Min Order */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-brand-light/50 pt-4">
                                        <div className="bg-gray-50/50 border border-brand-light/50 rounded-xl p-3 text-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lead Time</p>
                                            <p className="text-sm font-black text-brand-primary mt-1">{data.lead_time || '0'} Hari</p>
                                        </div>
                                        <div className="bg-gray-50/50 border border-brand-light/50 rounded-xl p-3 text-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Min. Order</p>
                                            <p className="text-sm font-black text-brand-primary mt-1">{data.min_order || '0'} Unit</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 border-t border-brand-light/50 pt-4">
                                        <button 
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className="w-full py-3 px-4 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl transition duration-150 active:scale-95 shadow-sm disabled:opacity-60"
                                        >
                                            Simpan Perubahan
                                        </button>
                                        <div className="flex gap-2">
                                            <Link 
                                                to="/suppliers"
                                                className="flex-1 py-2 text-center text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-brand-light transition flex items-center justify-center"
                                            >
                                                Batal
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist Criteria Widget */}
                            <div className="bg-white rounded-2xl border border-brand-light/80 shadow-sm p-5 space-y-4">
                                <h4 className="font-extrabold text-brand-dark text-xs uppercase tracking-wider border-b border-brand-light/40 pb-2">
                                    Persyaratan Checklist
                                </h4>
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon 
                                            icon={hasBasicInfo ? "solar:check-circle-bold" : "solar:round-transfer-broken"} 
                                            class={`text-base ${hasBasicInfo ? 'text-emerald-500' : 'text-gray-300'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasBasicInfo ? 'text-brand-dark' : 'text-gray-400'}`}>Informasi Identitas Dasar</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon 
                                            icon={hasPICInfo ? "solar:check-circle-bold" : "solar:round-transfer-broken"} 
                                            class={`text-base ${hasPICInfo ? 'text-emerald-500' : 'text-gray-300'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasPICInfo ? 'text-brand-dark' : 'text-gray-400'}`}>Kontak Utama (PIC) Valid</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon 
                                            icon={hasDocuments ? "solar:check-circle-bold" : "solar:round-transfer-broken"} 
                                            class={`text-base ${hasDocuments ? 'text-emerald-500' : 'text-gray-300'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasDocuments ? 'text-brand-dark' : 'text-gray-400'}`}>Dokumen Legal Terlampir</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon 
                                            icon={hasLogisticsInfo ? "solar:check-circle-bold" : "solar:round-transfer-broken"} 
                                            class={`text-base ${hasLogisticsInfo ? 'text-emerald-500' : 'text-gray-300'}`}
                                        ></iconify-icon>
                                        <span className={`font-semibold ${hasLogisticsInfo ? 'text-brand-dark' : 'text-gray-400'}`}>Lengkapi Detail Logistik</span>
                                    </div>
                                </div>
                            </div>

                            {/* Help Banner Widget */}
                            <div className="bg-brand-primary/5 rounded-2xl border border-brand-primary/10 p-5 flex gap-3 text-left">
                                <div className="text-brand-primary mt-0.5 flex-shrink-0">
                                    <iconify-icon icon="solar:info-circle-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-xs font-black text-brand-primary uppercase tracking-wider">Butuh bantuan?</h5>
                                    <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                                        Jika Anda kesulitan mendapatkan dokumen legal supplier, silakan hubungi tim Compliance di ekstensi 442.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
