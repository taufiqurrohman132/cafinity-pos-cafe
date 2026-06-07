import { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Head from '@/Components/Head';
import client from '@/api/client';

export default function SettingsIndex() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [activeTab, setActiveTab] = useState('profile'); // profile, operational, billing, localization, security
    const [show2faModal, setShow2faModal] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // --- Tab 1: Profile States ---
    const [cafeName, setCafeName] = useState('');
    const [cafeCategory, setCafeCategory] = useState('');
    const [cafeAddress, setCafeAddress] = useState('');
    const [cafePhone, setCafePhone] = useState('');
    const [cafeEmail, setCafeEmail] = useState('');

    // --- Tab 2: Operational Hours State ---
    const [operationalHours, setOperationalHours] = useState({});

    // --- Tab 3: Billing & Tax State ---
    const [taxRate, setTaxRate] = useState('');
    const [serviceCharge, setServiceCharge] = useState('');
    const [taxInclusive, setTaxInclusive] = useState(false);

    // --- Tab 4: Localization State ---
    const [currency, setCurrency] = useState('');
    const [timezone, setTimezone] = useState('');
    const [language, setLanguage] = useState('');

    // --- Tab 5: Security Policy States (Password & 2FA) ---
    const [minPasswordLength, setMinPasswordLength] = useState(12);
    const [passwordComplexity, setPasswordComplexity] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    });
    const [passwordExpiry, setPasswordExpiry] = useState('90');
    const [preventOldPassword, setPreventOldPassword] = useState('5');
    const [requireRole2fa, setRequireRole2fa] = useState({
        owner: true,
        manager: true,
        admin: true,
        cashier: false
    });
    const [global2fa, setGlobal2fa] = useState(true);

    // --- Active Sessions State (Simulated) ---
    const [sessions, setSessions] = useState([
        { id: 1, device: 'MacBook Pro 14"', browser: 'Chrome', ip: '182.253.140.22', location: 'Jakarta, ID', last_active: 'Sekarang' },
        { id: 2, device: 'iPhone 15 Pro', browser: 'Safari App', ip: '114.124.172.8', location: 'Bandung, ID', last_active: '2 menit yang lalu' },
        { id: 3, device: 'Windows Desktop', browser: 'Edge', ip: '36.72.210.45', location: 'Surabaya, ID', last_active: '45 menit yang lalu' }
    ]);

    // --- Modal Manage 2FA Users State ---
    const [modalSearch, setModalSearch] = useState('');
    const [modalRoleFilter, setModalRoleFilter] = useState('');
    const [modalStatusFilter, setModalStatusFilter] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [users2fa, setUsers2fa] = useState([
        { id: 1, name: 'Ahmad Subarjo', email: 'ahmad.s@perusahaan.com', role: 'Owner', method: 'Authenticator', status: 'Terdaftar', last_verified: '12 Okt 2023, 14:20' },
        { id: 2, name: 'Siti Aminah', email: 'siti.a@perusahaan.com', role: 'Manager', method: 'SMS', status: 'Terdaftar', last_verified: '15 Okt 2023, 09:15' },
        { id: 3, name: 'Budi Hartanto', email: 'budi.h@perusahaan.com', role: 'Employee', method: 'None', status: 'Belum Aktif', last_verified: 'Never' },
        { id: 4, name: 'Dewi Lestari', email: 'dewi.l@perusahaan.com', role: 'Manager', method: 'Authenticator', status: 'Terdaftar', last_verified: '14 Okt 2023, 17:45' },
        { id: 5, name: 'Rian Hidayat', email: 'rian.h@perusahaan.com', role: 'Employee', method: 'None', status: 'Belum Aktif', last_verified: 'Never' },
        { id: 6, name: 'Farhan Maulana', email: 'farhan.m@perusahaan.com', role: 'Cashier', method: 'Email', status: 'Terdaftar', last_verified: '18 Okt 2023, 11:30' },
    ]);

    // Track input changes to set unsaved changes flag
    const triggerChange = () => setHasUnsavedChanges(true);

    const handleHourToggle = (day) => {
        triggerChange();
        setOperationalHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                active: !prev[day].active
            }
        }));
    };

    const handleTimeChange = (day, type, value) => {
        triggerChange();
        setOperationalHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: value
            }
        }));
    };

    const defaultHours = {
        'Senin': { active: true, open: '08:00', close: '22:00' },
        'Selasa': { active: true, open: '09:00', close: '23:00' },
        'Rabu': { active: true, open: '08:00', close: '23:00' },
        'Kamis': { active: true, open: '09:00', close: '23:00' },
        'Jumat': { active: true, open: '09:00', close: '23:00' },
        'Sabtu': { active: true, open: '09:00', close: '23:00' },
        'Minggu': { active: false, open: '09:00', close: '18:00' }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await client.get('/settings');
                const s = res.data.settings || {};
                setSettings(s);

                setCafeName(s.cafe_name || 'SmartCafe Sudirman');
                setCafeCategory(s.cafe_category || 'Cafe & Restaurant');
                setCafeAddress(s.cafe_address || 'Jl. Jendral Sudirman No. 12, Senayan, Jakarta Selatan');
                setCafePhone(s.cafe_phone || '+62 21 555 0123');
                setCafeEmail(s.cafe_email || 'contact@smartcafe.id');

                let parsedHours = {};
                try {
                    parsedHours = s.operational_hours ? JSON.parse(s.operational_hours) : {};
                } catch (e) {
                    parsedHours = {};
                }
                setOperationalHours({ ...defaultHours, ...parsedHours });

                setTaxRate(s.tax_rate || '12');
                setServiceCharge(s.service_charge || '5');
                setTaxInclusive(s.tax_inclusive === '1');

                setCurrency(s.currency || 'IDR (Indonesian Rupiah)');
                setTimezone(s.timezone || '(GMT+07:00) Asia/Jakarta');
                setLanguage(s.language || 'Bahasa Indonesia (ID)');

                setError(null);
            } catch (err) {
                console.error("Gagal memuat pengaturan:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [refreshTrigger]);

    const handleSave = async () => {
        try {
            if (activeTab === 'security') {
                const res = await client.put('/settings/security', {
                    session_timeout: settings?.session_timeout || '15',
                    require_2fa: global2fa
                });
                setSettings(res.data.settings);
                setHasUnsavedChanges(false);
            } else {
                const res = await client.put('/settings/general', {
                    cafe_name: cafeName,
                    cafe_category: cafeCategory,
                    cafe_address: cafeAddress,
                    cafe_phone: cafePhone,
                    cafe_email: cafeEmail,
                    tax_rate: taxRate,
                    service_charge: serviceCharge,
                    tax_inclusive: taxInclusive ? '1' : '0',
                    currency: currency,
                    timezone: timezone,
                    language: language,
                    operational_hours: operationalHours
                });
                setSettings(res.data.settings);
                setHasUnsavedChanges(false);
            }
            alert('Pengaturan berhasil disimpan.');
        } catch (err) {
            console.error("Gagal menyimpan pengaturan:", err);
            alert('Gagal menyimpan pengaturan.');
        }
    };

    const handleCancel = () => {
        setHasUnsavedChanges(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleTerminateSession = (id, device) => {
        if (confirm(`Hentikan sesi aktif di ${device}?`)) {
            setSessions(sessions.filter(s => s.id !== id));
            alert('Sesi dihentikan.');
        }
    };

    const handleLogoutAllSessions = () => {
        if (confirm('Apakah Anda yakin ingin menghentikan semua sesi aktif lainnya?')) {
            setSessions(sessions.filter(s => s.last_active === 'Sekarang'));
            alert('Semua sesi lainnya telah dihentikan.');
        }
    };

    // Modal select helpers
    const handleSelectAllUsers = (e) => {
        if (e.target.checked) {
            setSelectedUserIds(filteredUsers.map(u => u.id));
        } else {
            setSelectedUserIds([]);
        }
    };

    const handleSelectUser = (id) => {
        setSelectedUserIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Filters for 2FA user modal list
    const filteredUsers = users2fa.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(modalSearch.toLowerCase()) || 
                              user.email.toLowerCase().includes(modalSearch.toLowerCase());
        const matchesRole = modalRoleFilter === '' || user.role.toLowerCase() === modalRoleFilter.toLowerCase();
        const matchesStatus = modalStatusFilter === '' || user.status.toLowerCase() === modalStatusFilter.toLowerCase();
        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading && !settings) {
        return (
            <AppLayout>
                <Head title="Pengaturan Bisnis" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-brand-primary">Memuat Data...</p>
                    </div>
                </div>
            </AppLayout>
        )
    }

    if (error && !settings) {
        return (
            <AppLayout>
                <Head title="Pengaturan Bisnis" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat pengaturan dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <Head title="Pengaturan Bisnis" />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6 lg:p-8">
                <div className="max-w-[1450px] mx-auto space-y-6">
                    
                    {/* Header */}
                    <div className="text-left space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black text-brand-dark tracking-tight">Pengaturan Bisnis</h1>
                        <p className="text-gray-500 text-sm">Kelola identitas toko, kebijakan perpajakan, dan preferensi lokalisasi Anda di sini.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* ── LEFT COLUMN: SIDEBAR NAVIGATION TABS ── */}
                        <div className="lg:col-span-3 space-y-2 bg-white p-4 rounded-2xl border border-brand-light/80 shadow-sm text-left">
                            {[
                                { id: 'profile', label: 'Profil Toko', icon: 'solar:shop-linear' },
                                { id: 'operational', label: 'Jam Operasional', icon: 'solar:clock-circle-linear' },
                                { id: 'billing', label: 'Penagihan & Pajak', icon: 'solar:bill-list-linear' },
                                { id: 'localization', label: 'Lokalisasi', icon: 'solar:global-linear' },
                                { id: 'security', label: 'Keamanan', icon: 'solar:shield-keyhole-linear' }
                            ].map((tab) => (
                                <button 
                                    key={tab.id}
                                    onClick={() => {
                                        if (hasUnsavedChanges) {
                                            if (!confirm('Anda memiliki perubahan yang belum disimpan. Pindah tab?')) return;
                                        }
                                        setActiveTab(tab.id);
                                        setHasUnsavedChanges(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                                        activeTab === tab.id
                                            ? 'bg-brand-primary text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <iconify-icon icon={tab.icon} class="text-lg"></iconify-icon>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── RIGHT COLUMN: SETTINGS CONTENT CARDS ── */}
                        <div className="lg:col-span-9 space-y-6">
                            
                            {/* TAB 1: PROFIL TOKO */}
                            {activeTab === 'profile' && (
                                <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                                            <iconify-icon icon="solar:shop-linear" class="text-brand-primary text-lg"></iconify-icon>
                                            Informasi Dasar Toko
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">Detail ini akan muncul pada struk belanja pelanggan.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nama Bisnis</label>
                                            <input 
                                                type="text"
                                                value={cafeName}
                                                onChange={(e) => { setCafeName(e.target.value); triggerChange(); }}
                                                className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                placeholder="Nama Toko"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Kategori Bisnis</label>
                                            <select 
                                                value={cafeCategory}
                                                onChange={(e) => { setCafeCategory(e.target.value); triggerChange(); }}
                                                className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all cursor-pointer"
                                            >
                                                <option value="Cafe & Restaurant">Cafe &amp; Restaurant</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Co-Working Space">Co-Working Space</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Alamat Lengkap</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                <iconify-icon icon="solar:map-point-linear" class="text-base"></iconify-icon>
                                            </span>
                                            <input 
                                                type="text"
                                                value={cafeAddress}
                                                onChange={(e) => { setCafeAddress(e.target.value); triggerChange(); }}
                                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                placeholder="Alamat"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nomor Telepon</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                    <iconify-icon icon="solar:phone-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <input 
                                                    type="text"
                                                    value={cafePhone}
                                                    onChange={(e) => { setCafePhone(e.target.value); triggerChange(); }}
                                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                    placeholder="Telepon Toko"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Email Bisnis</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                    <iconify-icon icon="solar:letter-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <input 
                                                    type="email"
                                                    value={cafeEmail}
                                                    onChange={(e) => { setCafeEmail(e.target.value); triggerChange(); }}
                                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                    placeholder="Email Bisnis"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: JAM OPERASIONAL */}
                            {activeTab === 'operational' && (
                                <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                                            <iconify-icon icon="solar:clock-circle-linear" class="text-brand-primary text-lg"></iconify-icon>
                                            Jam Operasional
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">Atur ketersediaan toko Anda di aplikasi pelanggan.</p>
                                    </div>

                                    <div className="space-y-3.5">
                                        {Object.keys(operationalHours).map((day) => {
                                            const schedule = operationalHours[day];
                                            return (
                                                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2.5 border-b border-brand-light/35 last:border-none">
                                                    <div className="flex items-center gap-3 w-28 flex-shrink-0">
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleHourToggle(day)}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                                schedule.active ? 'bg-brand-primary' : 'bg-gray-200'
                                                            }`}
                                                        >
                                                            <span 
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                    schedule.active ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                            />
                                                        </button>
                                                        <span className="text-sm font-bold text-gray-700">{day}</span>
                                                    </div>

                                                    {schedule.active ? (
                                                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                                                            <input 
                                                                type="time" 
                                                                value={schedule.open}
                                                                onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                                                                className="px-3 py-1.5 border border-brand-light rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                                            />
                                                            <span>sampai</span>
                                                            <input 
                                                                type="time" 
                                                                value={schedule.close}
                                                                onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                                                                className="px-3 py-1.5 border border-brand-light rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <span className="px-3 py-1 bg-white border border-orange-200 rounded-lg text-orange-500 font-bold text-[10px] uppercase tracking-wider">
                                                                Hari Libur
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: PENAGIHAN & PAJAK */}
                            {activeTab === 'billing' && (
                                <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                                            <iconify-icon icon="solar:bill-list-linear" class="text-brand-primary text-lg"></iconify-icon>
                                            Kebijakan Pajak &amp; Biaya
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">Konfigurasi PPN dan biaya layanan standar.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Pajak Penjualan (PPN %)</label>
                                            <div className="relative">
                                                <input 
                                                    type="number"
                                                    value={taxRate}
                                                    onChange={(e) => { setTaxRate(e.target.value); triggerChange(); }}
                                                    className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                    min="0"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Biaya Layanan (%)</label>
                                            <div className="relative">
                                                <input 
                                                    type="number"
                                                    value={serviceCharge}
                                                    onChange={(e) => { setServiceCharge(e.target.value); triggerChange(); }}
                                                    className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                    min="0"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tax Inclusive Switch */}
                                    <div className="p-4 bg-gray-50/40 border border-brand-light/60 rounded-xl flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h4 className="text-xs font-bold text-gray-700">Pajak Termasuk dalam Harga</h4>
                                            <p className="text-[10px] text-gray-400 font-medium">Aktifkan jika harga menu sudah termasuk PPN.</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => { setTaxInclusive(!taxInclusive); triggerChange(); }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                taxInclusive ? 'bg-brand-primary' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span 
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    taxInclusive ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: LOKALISASI */}
                            {activeTab === 'localization' && (
                                <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                                            <iconify-icon icon="solar:global-linear" class="text-brand-primary text-lg"></iconify-icon>
                                            Lokalisasi &amp; Satuan
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">Atur bahasa, mata uang, dan format waktu.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Mata Uang Utama</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                    <iconify-icon icon="solar:wallet-money-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <select 
                                                    value={currency} 
                                                    onChange={(e) => { setCurrency(e.target.value); triggerChange(); }}
                                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all cursor-pointer"
                                                >
                                                    <option value="IDR (Indonesian Rupiah)">IDR (Indonesian Rupiah)</option>
                                                    <option value="USD (US Dollar)">USD (US Dollar)</option>
                                                    <option value="SGD (Singapore Dollar)">SGD (Singapore Dollar)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Zona Waktu</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                                    <iconify-icon icon="solar:clock-circle-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <select 
                                                    value={timezone} 
                                                    onChange={(e) => { setTimezone(e.target.value); triggerChange(); }}
                                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all cursor-pointer"
                                                >
                                                    <option value="(GMT+07:00) Asia/Jakarta">(GMT+07:00) Asia/Jakarta</option>
                                                    <option value="(GMT+08:00) Asia/Makassar">(GMT+08:00) Asia/Makassar</option>
                                                    <option value="(GMT+09:00) Asia/Jayapura">(GMT+09:00) Asia/Jayapura</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Bahasa Sistem</label>
                                        <select 
                                            value={language} 
                                            onChange={(e) => { setLanguage(e.target.value); triggerChange(); }}
                                            className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-brand-light rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all cursor-pointer"
                                        >
                                            <option value="Bahasa Indonesia (ID)">Bahasa Indonesia (ID)</option>
                                            <option value="English (US)">English (US)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: KEAMANAN (MOCKUP VISLY REDESIGN) */}
                            {activeTab === 'security' && (
                                <div className="space-y-6 text-left animate-fadeIn">
                                    
                                    {/* Card 1: Kebijakan Kata Sandi */}
                                    <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-6">
                                        <div>
                                            <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                                                <iconify-icon icon="solar:lock-keyhole-linear" class="text-brand-primary text-lg"></iconify-icon>
                                                Kebijakan Kata Sandi
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-1">Atur standar kompleksitas sandi untuk seluruh pengguna.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                            {/* Left side: Length & Complexity */}
                                            <div className="space-y-5">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs font-extrabold text-gray-500">
                                                        <span className="uppercase tracking-wider">Panjang Kata Sandi Minimal</span>
                                                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-mono text-sm">{minPasswordLength}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="range"
                                                            min="8"
                                                            max="32"
                                                            value={minPasswordLength}
                                                            onChange={(e) => { setMinPasswordLength(parseInt(e.target.value)); triggerChange(); }}
                                                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-semibold">Tentukan jumlah karakter minimum yang diperlukan (8-32 karakter).</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Kompleksitas Karakter</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">Pilih jenis karakter yang wajib ada dalam kata sandi.</p>
                                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                                        {[
                                                            { id: 'uppercase', label: 'Huruf Besar (A-Z)' },
                                                            { id: 'lowercase', label: 'Huruf Kecil (a-z)' },
                                                            { id: 'numbers', label: 'Angka (0-9)' },
                                                            { id: 'symbols', label: 'Simbol (!@#$%)' }
                                                        ].map(opt => (
                                                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={passwordComplexity[opt.id]}
                                                                    onChange={() => {
                                                                        setPasswordComplexity(prev => ({ ...prev, [opt.id]: !prev[opt.id] }));
                                                                        triggerChange();
                                                                    }}
                                                                    className="w-4 h-4 rounded text-brand-primary border-brand-light focus:ring-brand-primary"
                                                                />
                                                                {opt.label}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right side: Expiry & Roles */}
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Masa Berlaku &amp; Riwayat</label>
                                                    <p className="text-[10px] text-gray-400 font-medium pb-1.5">Atur kapan sandi harus diganti dan pembatasan penggunaan sandi lama.</p>
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <span className="text-xs font-semibold text-gray-500">Kedaluwarsa Sandi</span>
                                                            <select 
                                                                value={passwordExpiry}
                                                                onChange={(e) => { setPasswordExpiry(e.target.value); triggerChange(); }}
                                                                className="w-full px-3 py-2 text-xs bg-gray-50/50 border border-brand-light rounded-xl focus:ring-brand-primary"
                                                            >
                                                                <option value="30">Setiap 30 Hari</option>
                                                                <option value="90">Setiap 90 Hari</option>
                                                                <option value="180">Setiap 180 Hari</option>
                                                                <option value="never">Tidak Pernah</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-xs font-semibold text-gray-500">Cegah Penggunaan Sandi Lama</span>
                                                            <select 
                                                                value={preventOldPassword}
                                                                onChange={(e) => { setPreventOldPassword(e.target.value); triggerChange(); }}
                                                                className="w-full px-3 py-2 text-xs bg-gray-50/50 border border-brand-light rounded-xl focus:ring-brand-primary"
                                                            >
                                                                <option value="3">3 Sandi Terakhir</option>
                                                                <option value="5">5 Sandi Terakhir</option>
                                                                <option value="10">10 Sandi Terakhir</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Wajibkan Untuk Role</label>
                                                    <p className="text-[10px] text-gray-400 font-medium pb-1">Terapkan kebijakan ini secara ketat pada level akses tertentu.</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                        {[
                                                            { id: 'owner', label: 'Owner' },
                                                            { id: 'manager', label: 'Manager' },
                                                            { id: 'admin', label: 'Admin' },
                                                            { id: 'cashier', label: 'Kasir' }
                                                        ].map(role => (
                                                            <label key={role.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={requireRole2fa[role.id]}
                                                                    onChange={() => {
                                                                        setRequireRole2fa(prev => ({ ...prev, [role.id]: !prev[role.id] }));
                                                                        triggerChange();
                                                                    }}
                                                                    className="w-4 h-4 rounded text-brand-primary border-brand-light focus:ring-brand-primary"
                                                                />
                                                                {role.label}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 2: Autentikasi Dua Faktor (2FA) */}
                                    <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-6">
                                        <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
                                            <div>
                                                <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                                                    <iconify-icon icon="solar:shield-keyhole-linear" class="text-brand-primary text-lg"></iconify-icon>
                                                    Autentikasi Dua Faktor (2FA)
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">Lapisan keamanan tambahan menggunakan kode verifikasi perangkat.</p>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                                <span className="text-xs font-extrabold text-gray-500 uppercase">Status Global:</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => { setGlobal2fa(!global2fa); triggerChange(); }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                        global2fa ? 'bg-brand-primary' : 'bg-gray-200'
                                                    }`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${global2fa ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                            {/* Sub-card: Metode diizinkan */}
                                            <div className="lg:col-span-4 p-4 border border-brand-light/60 rounded-2xl bg-gray-50/20 text-left space-y-2 flex flex-col justify-between">
                                                <div className="space-y-1.5">
                                                    <span className="inline-block px-2.5 py-0.5 bg-violet-50 text-brand-primary border border-brand-light text-[9px] font-black uppercase tracking-wider rounded-full">
                                                        Direkomendasikan
                                                    </span>
                                                    <h4 className="text-xs font-black text-gray-800 pt-1">Metode yang Diizinkan</h4>
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                                                    Aplikasi Authenticator (Google/Microsoft), SMS OTP, dan Email.
                                                </p>
                                            </div>

                                            {/* Sub-card: Panduan */}
                                            <div className="lg:col-span-4 p-4 border border-brand-light/60 rounded-2xl bg-gray-50/20 text-left space-y-2 flex flex-col justify-between">
                                                <h4 className="text-xs font-black text-gray-800">Panduan Pendaftaran</h4>
                                                <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                                                    Berikan instruksi langkah-demi-langkah kepada staf Anda untuk aktivasi.
                                                </p>
                                                <a href="#" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
                                                    Lihat Panduan
                                                    <iconify-icon icon="solar:export-linear" class="text-[10px]"></iconify-icon>
                                                </a>
                                            </div>

                                            {/* Sub-card: Gauge register */}
                                            <div className="lg:col-span-4 p-4 border border-brand-light/60 rounded-2xl bg-brand-primary/5 text-center flex flex-col items-center justify-between gap-3">
                                                <div className="flex items-center justify-center gap-3">
                                                    {/* Circular gauge */}
                                                    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-full h-full transform -rotate-90">
                                                            <circle cx="24" cy="24" r="20" stroke="rgb(var(--color-brand-light))" strokeWidth="4" fill="transparent" />
                                                            <circle cx="24" cy="24" r="20" stroke="rgb(var(--color-brand-primary))" strokeWidth="4" fill="transparent" 
                                                                strokeDasharray={`${2 * Math.PI * 20}`}
                                                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - 0.6)}`}
                                                            />
                                                        </svg>
                                                        <span className="absolute text-[10px] font-black text-brand-primary">60%</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <h5 className="text-xs font-extrabold text-gray-800">3 dari 5 Pengguna</h5>
                                                        <p className="text-[9px] text-gray-400 font-semibold">Telah mengaktifkan 2FA.</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => setShow2faModal(true)}
                                                    className="w-full py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-extrabold rounded-xl transition duration-150 active:scale-95 shadow-sm"
                                                >
                                                    Kelola per User
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 3: Sesi Aktif */}
                                    <div className="bg-white p-6 rounded-2xl border border-brand-light/80 shadow-sm space-y-4">
                                        <div className="flex items-center justify-between border-b border-brand-light/40 pb-3">
                                            <div>
                                                <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                                                    <iconify-icon icon="solar:history-linear" class="text-brand-primary text-lg"></iconify-icon>
                                                    Sesi Aktif
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">Daftar perangkat yang saat ini masuk ke akun Anda.</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={handleLogoutAllSessions}
                                                className="px-3.5 py-1.5 text-xs font-extrabold text-red-500 border border-red-200 hover:bg-red-50 rounded-xl transition"
                                            >
                                                Logout Semua Sesi
                                            </button>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                    <tr className="bg-gray-50/50 border-b border-brand-light/60">
                                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Perangkat &amp; Browser</th>
                                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Alamat IP</th>
                                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Lokasi</th>
                                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Aktivitas Terakhir</th>
                                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-brand-light/40">
                                                    {sessions.map(s => (
                                                        <tr key={s.id} className="hover:bg-gray-50/30 font-medium">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center">
                                                                        <iconify-icon icon={s.device.includes('iPhone') ? "solar:iphone-linear" : "solar:laptop-linear"}></iconify-icon>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-extrabold text-gray-800">{s.device}</h4>
                                                                        <p className="text-[10px] text-gray-400 font-semibold">{s.browser}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 font-mono text-gray-500">{s.ip}</td>
                                                            <td className="px-5 py-3.5 text-gray-700 font-semibold">{s.location}</td>
                                                            <td className="px-5 py-3.5 font-semibold">
                                                                <span className={s.last_active === 'Sekarang' ? 'text-emerald-500' : 'text-gray-400'}>
                                                                    {s.last_active}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                {s.last_active !== 'Sekarang' ? (
                                                                    <button 
                                                                        onClick={() => handleTerminateSession(s.id, s.device)}
                                                                        className="text-xs font-extrabold text-gray-400 hover:text-red-500 transition"
                                                                    >
                                                                        Hentikan Sesi
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider px-2 py-0.5 rounded bg-gray-50 border border-gray-100">Aktif</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 pt-2 border-t border-brand-light/40">
                                            <iconify-icon icon="solar:info-circle-linear" class="text-xs"></iconify-icon>
                                            Kami merekomendasikan untuk mengakhiri sesi yang tidak dikenali segera.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Actions Form Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-light/40 pt-4 pb-6">
                                <div className="text-xs text-amber-500 font-bold flex items-center gap-1.5">
                                    {hasUnsavedChanges && (
                                        <>
                                            <iconify-icon icon="solar:info-circle-bold" class="text-sm"></iconify-icon>
                                            Ada perubahan belum disimpan
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 text-xs font-bold text-gray-600 bg-white border border-brand-light rounded-xl hover:bg-gray-50 transition active:scale-95 shadow-sm"
                                    >
                                        Batalkan
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleSave}
                                        className="px-7 py-2.5 text-xs font-bold text-white bg-brand-primary hover:bg-brand-secondary rounded-xl transition active:scale-95 shadow-sm hover:shadow"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── MODAL: KELOLA 2FA PER USER ── */}
            {show2faModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 shadow-2xl border border-gray-100 overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-brand-light/50 flex justify-between items-start">
                            <div className="flex gap-3 text-left">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/5 text-brand-primary flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="solar:shield-keyhole-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-gray-800">Kelola 2FA per User</h3>
                                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Daftar pengguna dan status keamanan autentikasi mereka</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setShow2faModal(false); setSelectedUserIds([]); }}
                                className="w-8 h-8 rounded-full border border-gray-100 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition active:scale-95"
                            >
                                <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                            </button>
                        </div>

                        {/* Search & Filters */}
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-brand-light/40 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
                                    <iconify-icon icon="solar:magnifer-linear" class="text-base"></iconify-icon>
                                </span>
                                <input 
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    value={modalSearch}
                                    onChange={(e) => setModalSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-brand-light rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                                />
                            </div>

                            <select 
                                value={modalRoleFilter} 
                                onChange={(e) => setModalRoleFilter(e.target.value)}
                                className="px-3 py-2 text-xs bg-white border border-brand-light rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary cursor-pointer"
                            >
                                <option value="">Semua Role</option>
                                <option value="owner">Owner</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                                <option value="employee">Employee</option>
                                <option value="cashier">Cashier</option>
                            </select>

                            <select 
                                value={modalStatusFilter} 
                                onChange={(e) => setModalStatusFilter(e.target.value)}
                                className="px-3 py-2 text-xs bg-white border border-brand-light rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary cursor-pointer"
                            >
                                <option value="">Semua Status</option>
                                <option value="terdaftar">Terdaftar</option>
                                <option value="belum aktif">Belum Aktif</option>
                            </select>
                        </div>

                        {/* Modal Users Table */}
                        <div className="overflow-y-auto max-h-[350px]">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-brand-light/50">
                                        <th className="px-6 py-3.5 w-12 text-center">
                                            <input 
                                                type="checkbox"
                                                onChange={handleSelectAllUsers}
                                                checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                                                className="w-4 h-4 rounded text-brand-primary border-brand-light focus:ring-brand-primary"
                                            />
                                        </th>
                                        <th className="px-6 py-3.5 font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-3.5 font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3.5 font-bold text-gray-400 uppercase tracking-wider">Metode 2FA</th>
                                        <th className="px-6 py-3.5 font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3.5 font-bold text-gray-400 uppercase tracking-wider">Terakhir Verifikasi</th>
                                        <th className="px-6 py-3.5 font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-light/30">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-400 font-medium">
                                                Tidak ada pengguna yang cocok dengan kriteria filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50/20 font-medium">
                                                <td className="px-6 py-3 text-center">
                                                    <input 
                                                        type="checkbox"
                                                        checked={selectedUserIds.includes(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                        className="w-4 h-4 rounded text-brand-primary border-brand-light focus:ring-brand-primary"
                                                    />
                                                </td>
                                                <td className="px-6 py-3 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-violet-100 text-brand-primary flex items-center justify-center font-bold text-[10px] border border-white flex-shrink-0">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="text-left overflow-hidden">
                                                        <h4 className="font-extrabold text-gray-800 truncate">{user.name}</h4>
                                                        <p className="text-[9px] text-gray-400 font-semibold truncate">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-left">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-left">
                                                    <span className="inline-flex items-center gap-1.5 font-bold text-gray-700">
                                                        <iconify-icon 
                                                            icon={user.method === 'None' ? 'solar:shield-warning-linear' : user.method === 'SMS' ? 'solar:letter-linear' : 'solar:shield-keyhole-linear'} 
                                                            class={user.method === 'None' ? 'text-gray-300' : 'text-brand-primary'}
                                                        ></iconify-icon>
                                                        {user.method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-left">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                        user.status === 'Terdaftar' 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                            : 'bg-gray-50 text-gray-400 border-gray-200'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-left text-gray-500 font-semibold">{user.last_verified}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button 
                                                            onClick={() => alert(`Kirim pengingat pendaftaran 2FA ke ${user.name}`)}
                                                            className="p-1 rounded bg-white border border-brand-light text-gray-500 hover:text-brand-primary hover:border-brand-primary transition active:scale-95"
                                                            title="Kirim Pengingat"
                                                        >
                                                            <iconify-icon icon="solar:letter-linear" class="text-xs"></iconify-icon>
                                                        </button>
                                                        <button 
                                                            onClick={() => alert(`Reset kunci 2FA untuk ${user.name}`)}
                                                            className="p-1 rounded bg-white border border-brand-light text-gray-500 hover:text-red-500 hover:border-red-200 transition active:scale-95"
                                                            title="Reset 2FA"
                                                        >
                                                            <iconify-icon icon="solar:history-linear" class="text-xs"></iconify-icon>
                                                        </button>
                                                        <button 
                                                            onClick={() => alert(`Kelola hak akses/opsi 2FA untuk ${user.name}`)}
                                                            className="p-1 rounded bg-white border border-brand-light text-gray-500 hover:text-brand-primary hover:border-brand-primary transition active:scale-95"
                                                            title="Kelola User"
                                                        >
                                                            <iconify-icon icon="solar:user-plus-linear" class="text-xs"></iconify-icon>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-brand-light/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-xs font-bold text-gray-500 text-left">
                                {selectedUserIds.length} User Terpilih <span className="text-gray-300 font-normal px-1">|</span> <span className="font-semibold text-gray-400">Pilih user untuk melakukan aksi massal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => {
                                        if (selectedUserIds.length === 0) return alert('Silakan pilih setidaknya 1 user.');
                                        alert(`Mengirim pesan email pengingat masal ke ${selectedUserIds.length} user...`);
                                        setSelectedUserIds([]);
                                    }}
                                    className="px-4 py-2 border border-brand-light hover:bg-gray-50 bg-white text-gray-700 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 active:scale-95"
                                >
                                    <iconify-icon icon="solar:letter-linear" class="text-sm"></iconify-icon>
                                    Kirim Pengingat Masal
                                </button>
                                <button 
                                    onClick={() => {
                                        if (selectedUserIds.length === 0) return alert('Silakan pilih setidaknya 1 user.');
                                        if (confirm(`Reset kunci 2FA untuk ${selectedUserIds.length} user terpilih?`)) {
                                            alert(`${selectedUserIds.length} kunci 2FA berhasil di-reset.`);
                                            setSelectedUserIds([]);
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 active:scale-95"
                                >
                                    <iconify-icon icon="solar:history-linear" class="text-sm"></iconify-icon>
                                    Reset 2FA Terpilih
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
