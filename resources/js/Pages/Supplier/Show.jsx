import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';

export default function SupplierShow({ supplier }) {
    const navigate = useNavigate();
    const primaryContact = supplier.contacts?.find(c => c.is_primary) || supplier.contacts?.[0];
    const [noteInput, setNoteInput] = useState('');

    const handleDelete = async () => {
        if (confirm(`Apakah Anda yakin ingin menghapus supplier "${supplier.name}"? Semua data kontak dan PO terkait akan ikut terhapus.`)) {
            try {
                await client.delete(`/suppliers/${supplier.id}`);
                navigate('/suppliers');
            } catch (err) {
                console.error("Gagal menghapus supplier:", err);
                alert("Gagal menghapus supplier.");
            }
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (confirm(`Ubah status supplier ke "${newStatus === 'active' ? 'Aktif' : newStatus === 'inactive' ? 'Nonaktif' : 'Blacklist'}"?`)) {
            try {
                await client.put(`/suppliers/${supplier.id}`, {
                    ...supplier,
                    contact_name: primaryContact?.name || '-',
                    contact_phone: primaryContact?.phone || '',
                    contact_email: primaryContact?.email || '',
                    contact_position: primaryContact?.position || 'Finance Manager',
                    status: newStatus
                });
                if (window.routerReload) window.routerReload();
            } catch (err) {
                console.error("Gagal memperbarui status supplier:", err);
                alert("Gagal memperbarui status supplier.");
            }
        }
    };

    const formatCurrency = (value) => {
        const val = parseFloat(value) || 0;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    // Parse Join Date in Indonesian format
    const getJoinDate = () => {
        if (!supplier.created_at) return '12 Januari 2022';
        const date = new Date(supplier.created_at);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Generate dynamic performa values based on rating
    const rating = parseFloat(supplier.rating) || 2.8;
    const isCritical = rating < 3.0;

    const getPerformanceMetrics = () => {
        if (rating >= 4.5) {
            return {
                punctuality: 94,
                quality: 92,
                responsiveness: 90,
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                badgeText: 'Sangat Terpercaya'
            };
        } else if (rating >= 3.5) {
            return {
                punctuality: 82,
                quality: 85,
                responsiveness: 80,
                badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                badgeText: 'Terpercaya'
            };
        } else if (rating >= 3.0) {
            return {
                punctuality: 72,
                quality: 75,
                responsiveness: 70,
                badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                badgeText: 'Cukup Terpercaya'
            };
        } else {
            return {
                punctuality: 65,
                quality: 78,
                responsiveness: 45,
                badgeColor: 'bg-red-50 text-red-600 border-red-200',
                badgeText: 'Underperforming'
            };
        }
    };

    const metrics = getPerformanceMetrics();

    const getStatusBadge = (supStatus) => {
        switch (supStatus) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        Inactive
                    </span>
                );
            case 'blacklist':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Blacklist
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200">
                        {supStatus}
                    </span>
                );
        }
    };

    const getPoStatusBadge = (status) => {
        switch (status) {
            case 'received':
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'approved':
            case 'shipped':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <>
            <Head title={`Detail Supplier - ${supplier.name}`} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6 lg:p-8">
                <div className="max-w-[1400px] mx-auto space-y-5">
                    
                    {/* Top Breadcrumb & Actions Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light/40 pb-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                            <Link to="/suppliers" className="hover:text-brand-primary transition">Daftar Supplier</Link>
                            <iconify-icon icon="solar:alt-arrow-right-linear" class="text-[10px]"></iconify-icon>
                            <span className="text-gray-600">Detail Supplier</span>
                        </div>

                        {/* Top Actions Grid */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Link 
                                to={`/suppliers/${supplier.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-brand-light rounded-xl hover:bg-gray-50 active:scale-95 transition"
                            >
                                <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon>
                                Edit
                            </Link>
                            <button 
                                onClick={() => alert('Mengekspor laporan ke PDF...')}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-brand-light rounded-xl hover:bg-gray-50 active:scale-95 transition"
                            >
                                <iconify-icon icon="solar:document-linear" class="text-sm"></iconify-icon>
                                Export PDF
                            </button>
                            <button 
                                onClick={() => handleStatusChange(supplier.status === 'active' ? 'inactive' : 'active')}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 bg-white border border-red-200 rounded-xl hover:bg-red-50 active:scale-95 transition"
                            >
                                <iconify-icon icon="solar:close-circle-linear" class="text-sm"></iconify-icon>
                                {supplier.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <button 
                                onClick={() => handleStatusChange('blacklist')}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl active:scale-95 transition shadow-sm"
                            >
                                <iconify-icon icon="solar:danger-circle-linear" class="text-sm"></iconify-icon>
                                Blacklist
                            </button>
                        </div>
                    </div>

                    {/* Critical Performance Warning Banner */}
                    {isCritical && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="solar:danger-triangle-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div className="space-y-0.5 text-left">
                                    <h4 className="text-xs font-extrabold text-red-700 uppercase tracking-wider">Perhatian: Performa Kritis</h4>
                                    <p className="text-xs text-red-600 font-semibold leading-relaxed">
                                        Rating supplier ini berada di bawah ambang batas (3.0). Disarankan untuk meninjau kembali kontrak kerjasama atau mencari alternatif supplier.
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => alert('Membuka tiket laporan kendala supplier...')}
                                className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-extrabold rounded-xl transition flex-shrink-0"
                            >
                                Tinjau Masalah
                            </button>
                        </div>
                    )}

                    {/* Title Header */}
                    <div className="space-y-1.5 text-left">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl md:text-3xl font-black text-brand-dark tracking-tight">{supplier.name}</h2>
                            {getStatusBadge(supplier.status)}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                            Kode: <span className="font-bold text-gray-600">{supplier.code || `SUP-SKL-${supplier.id + 100}`}</span>
                            <span className="mx-2">•</span>
                            Bergabung sejak {getJoinDate()}
                        </p>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* ── LEFT COLUMN: DETAILS & DIRECTORY ── */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* Identitas Perusahaan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5 text-left">
                                <h3 className="text-sm font-extrabold text-brand-dark border-b border-brand-light/40 pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:shop-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Identitas Perusahaan
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Kategori Produk</p>
                                        <p className="text-xs font-bold text-gray-800">{supplier.category || 'Transportasi & Logistik'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">NPWP / Pajak</p>
                                        <p className="text-xs font-bold text-gray-800">01.234.567.8-901.000</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Termin Pembayaran</p>
                                        <p className="text-xs font-bold text-gray-800">{supplier.payment_term || 'Net 30'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Lead Time Estimasi</p>
                                        <p className="text-xs font-bold text-gray-800">{supplier.lead_time ? `${supplier.lead_time} Hari` : '3-5 Hari'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Direktori Kontak */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5 text-left">
                                <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
                                    <h3 className="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                                        <iconify-icon icon="solar:users-group-two-rounded-linear" class="text-brand-primary text-base"></iconify-icon>
                                        Direktori Kontak
                                    </h3>
                                    <button 
                                        onClick={() => alert('Menambahkan kontak PIC baru...')}
                                        className="text-xs font-extrabold text-brand-primary hover:underline"
                                    >
                                        + Tambah PIC
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {supplier.contacts && supplier.contacts.length > 0 ? (
                                        supplier.contacts.map(contact => (
                                            <div key={contact.id} className="p-4 border border-brand-light/60 rounded-2xl bg-gray-50/20 flex items-center justify-between shadow-sm relative group">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded-full bg-violet-100 text-brand-primary flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm border border-white">
                                                        {contact.name.charAt(0)}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <h4 className="text-xs font-black text-gray-800 truncate">{contact.name}</h4>
                                                        <p className="text-[10px] text-gray-400 font-semibold">{contact.position || 'Sales Manager'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    {contact.email && (
                                                        <a 
                                                            href={`mailto:${contact.email}`}
                                                            className="w-8 h-8 rounded-full border border-brand-light bg-white text-gray-500 hover:text-brand-primary hover:border-brand-primary flex items-center justify-center transition hover:shadow-sm"
                                                            title={contact.email}
                                                        >
                                                            <iconify-icon icon="solar:letter-linear" class="text-sm"></iconify-icon>
                                                        </a>
                                                    )}
                                                    {contact.phone && (
                                                        <a 
                                                            href={`tel:${contact.phone}`}
                                                            className="w-8 h-8 rounded-full border border-brand-light bg-white text-gray-500 hover:text-brand-primary hover:border-brand-primary flex items-center justify-center transition hover:shadow-sm"
                                                            title={contact.phone}
                                                        >
                                                            <iconify-icon icon="solar:phone-linear" class="text-sm"></iconify-icon>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 border border-brand-light/60 rounded-2xl bg-gray-50/20 flex items-center justify-between shadow-sm relative">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-violet-100 text-brand-primary flex items-center justify-center font-bold text-xs">
                                                    PIC
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-gray-800">Belum ada Kontak</h4>
                                                    <p className="text-[10px] text-gray-400 font-semibold">Gunakan PIC Kontak utama di form edit.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Alamat Utama & Pengiriman */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4 text-left">
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-violet-50 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <iconify-icon icon="solar:map-point-linear" class="text-lg"></iconify-icon>
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Alamat Utama &amp; Pengiriman</h4>
                                        <p className="text-xs font-bold text-gray-800 leading-relaxed">
                                            {supplier.address || 'Jl. Industri No. 45, Kawasan MM2100, Cikarang Barat'}{supplier.city && `, ${supplier.city}`}{supplier.province && `, ${supplier.province}`}
                                        </p>
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(supplier.address || '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1 mt-1.5"
                                        >
                                            Lihat di Peta
                                            <iconify-icon icon="solar:export-linear" class="text-[11px]"></iconify-icon>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Minimum Order */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4 text-left">
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-violet-50 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <iconify-icon icon="solar:wallet-money-linear" class="text-lg"></iconify-icon>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Informasi Minimum Order</h4>
                                        <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                                            Minimum pembelanjaan untuk supplier ini adalah <span className="font-extrabold text-gray-800">{formatCurrency(supplier.min_order || 5000000)}</span> per Purchase Order.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Dokumen & Lampiran */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4 text-left">
                                <h3 className="text-sm font-extrabold text-brand-dark border-b border-brand-light/40 pb-3 flex items-center gap-2">
                                    <iconify-icon icon="solar:document-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Dokumen &amp; Lampiran
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { name: 'Kontrak_Kerjasama_2024.pdf', date: '01 JAN 2024', size: '2.4 MB' },
                                        { name: 'Sertifikat_ISO_9001.pdf', date: '15 MAR 2023', size: '1.1 MB' },
                                        { name: 'Legalitas_Perusahaan.zip', date: '10 DES 2022', size: '5.8 MB' }
                                    ].map(doc => (
                                        <div key={doc.name} className="p-3 border border-brand-light/80 rounded-xl bg-white flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                <iconify-icon icon="solar:document-linear" class="text-gray-400 text-lg flex-shrink-0"></iconify-icon>
                                                <div className="text-left overflow-hidden">
                                                    <p className="text-xs font-bold text-gray-700 truncate">{doc.name}</p>
                                                    <span className="text-[10px] text-gray-400 font-semibold">{doc.date} • {doc.size}</span>
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => alert(`Mengunduh berkas ${doc.name}...`)} 
                                                className="text-brand-primary hover:text-brand-secondary transition p-1 hover:bg-brand-primary/5 rounded-lg flex-shrink-0"
                                            >
                                                <iconify-icon icon="solar:download-linear" class="text-lg"></iconify-icon>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: PERFORMANCE, PO, ACTIVITIES ── */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Rating Performa Card */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-6 text-left">
                                <h3 className="text-sm font-extrabold text-brand-dark border-b border-brand-light/40 pb-2 flex items-center gap-2">
                                    <iconify-icon icon="solar:ranking-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Rating Performa
                                </h3>

                                <div className="flex items-center gap-5">
                                    {/* Big Circle Score Gauge */}
                                    <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                                            <circle cx="48" cy="48" r="40" 
                                                stroke={isCritical ? '#ef4444' : 'rgb(var(--color-brand-primary))'} 
                                                strokeWidth="8" 
                                                fill="transparent" 
                                                strokeDasharray={`${2 * Math.PI * 40}`}
                                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - rating / 5.0)}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-gray-800 leading-none">{rating.toFixed(1)}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Dari 5.0</span>
                                        </div>
                                    </div>

                                    {/* Score Info */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-black text-gray-800">Tingkat Kepercayaan</h4>
                                        <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                                            Dihitung berdasarkan 50+ transaksi terakhir dalam 12 bulan.
                                        </p>
                                        <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${metrics.badgeColor}`}>
                                            {metrics.badgeText}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bars metrics */}
                                <div className="space-y-4 pt-2 border-t border-brand-light/40">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold text-gray-600">
                                            <span>Ketepatan Waktu (Punctuality)</span>
                                            <span>{metrics.punctuality}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${metrics.punctuality}%` }} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold text-gray-600">
                                            <span>Kualitas Produk (Quality)</span>
                                            <span>{metrics.quality}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${metrics.quality}%` }} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold text-gray-600">
                                            <span>Responsivitas PIC</span>
                                            <span>{metrics.responsiveness}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ 
                                                width: `${metrics.responsiveness}%`, 
                                                backgroundColor: metrics.responsiveness < 50 ? '#ef4444' : 'rgb(var(--color-brand-primary))' 
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Riwayat PO Terakhir */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4 text-left">
                                <div className="flex items-center justify-between border-b border-brand-light/40 pb-2">
                                    <h3 className="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                                        <iconify-icon icon="solar:document-text-linear" class="text-brand-primary text-base"></iconify-icon>
                                        Riwayat PO Terakhir
                                    </h3>
                                    <Link to="/purchase-orders" className="text-xs font-extrabold text-brand-primary hover:underline">
                                        Lihat Semua
                                    </Link>
                                </div>

                                <div className="space-y-3 text-xs">
                                    {supplier.purchase_orders && supplier.purchase_orders.length > 0 ? (
                                        supplier.purchase_orders.slice(0, 5).map(po => (
                                            <div key={po.id} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-none">
                                                <div className="flex flex-col text-left">
                                                    <span className="font-extrabold text-brand-primary hover:underline cursor-pointer">
                                                        {po.po_number || `PO-${po.id}`}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">
                                                        {po.ordered_at ? new Date(po.ordered_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                    </span>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getPoStatusBadge(po.status)}`}>
                                                    {po.status === 'received' ? 'Delivered' : po.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        // Standard mockup list if database has no PO transactions yet
                                        [
                                            { po: 'PO-2024-0012', date: '14 Okt 2024', status: 'Delivered' },
                                            { po: 'PO-2024-0045', date: '20 Sep 2024', status: 'Delivered' },
                                            { po: 'PO-2024-0088', date: '12 Sep 2024', status: 'Shipped' },
                                            { po: 'PO-2024-0122', date: '01 Agu 2024', status: 'Pending' },
                                            { po: 'PO-2024-0156', date: '15 Jul 2024', status: 'Delivered' }
                                        ].map(item => (
                                            <div key={item.po} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-none">
                                                <div className="flex flex-col text-left">
                                                    <span className="font-extrabold text-gray-800">{item.po}</span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">{item.date}</span>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getPoStatusBadge(item.status.toLowerCase())}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Log Aktivitas */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4 text-left">
                                <h3 className="text-sm font-extrabold text-brand-dark border-b border-brand-light/40 pb-2 flex items-center gap-2">
                                    <iconify-icon icon="solar:bell-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Log Aktivitas
                                </h3>

                                <div className="space-y-4 text-xs">
                                    {[
                                        { user: 'Alex Thompson', action: 'memperbarui Alamat Pengiriman', time: '2 jam yang lalu' },
                                        { user: 'Sistem', action: 'mencatat penurunan Rating Performa', time: 'Kemarin, 14:20' },
                                        { user: 'Sarah Miller', action: 'mengunggah Kontrak_Kerjasama_2024.pdf', time: '3 hari yang lalu' },
                                        { user: 'Alex Thompson', action: 'menambahkan PIC baru: Siti Aminah', time: '1 minggu yang lalu' }
                                    ].map((log, idx) => (
                                        <div key={idx} className="flex gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0 mt-1.5" />
                                            <div className="space-y-0.5">
                                                <p className="text-gray-600 leading-relaxed font-medium">
                                                    <span className="font-extrabold text-gray-800">{log.user}</span> {log.action}
                                                </p>
                                                <span className="text-[10px] text-gray-400 font-semibold block">{log.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => alert('Memuat log aktivitas lebih lama...')}
                                    className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-700 pt-2 border-t border-brand-light/40 block"
                                >
                                    Muat Lebih Banyak
                                </button>
                            </div>

                            {/* Kirim Catatan Cepat Widget */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4 text-left">
                                <h3 className="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                                    <iconify-icon icon="solar:letter-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Kirim Catatan Cepat
                                </h3>

                                <textarea 
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    placeholder="Tulis catatan internal atau pesan untuk PIC..."
                                    className="w-full text-xs border border-brand-light rounded-xl py-2 px-3 focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none min-h-[70px] bg-gray-50/50"
                                />

                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            if (noteInput.trim()) {
                                                alert(`Catatan dikirim ke PIC: "${noteInput}"`);
                                                setNoteInput('');
                                            }
                                        }}
                                        className="flex-1 py-2 px-3 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-extrabold rounded-xl transition duration-150 active:scale-95 shadow-sm"
                                    >
                                        Kirim Pesan
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            if (noteInput.trim()) {
                                                alert(`Catatan disimpan secara internal.`);
                                                setNoteInput('');
                                            }
                                        }}
                                        className="py-2 px-4 bg-white border border-brand-light text-gray-700 text-xs font-extrabold rounded-xl hover:bg-gray-50 transition"
                                    >
                                        Simpan Catatan
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
