import { useState, useEffect } from 'react';
import Head from '@/Components/Head';
import client from '@/api/client';
import SettingsSkeleton from '@/Components/Skeletons/SettingsSkeleton';
import { useConfirm } from '@/context/ConfirmContext';
import CustomSelect from '@/Components/CustomSelect';

export default function SettingsIndex() {
    const confirm = useConfirm();
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

    const handleTerminateSession = async (id, device) => {
        if (await confirm({
            title: 'Hentikan Sesi Aktif?',
            message: `Apakah Anda yakin ingin menghentikan sesi aktif di ${device}?`,
            isDanger: true,
            confirmText: 'Hentikan',
            cancelText: 'Batal'
        })) {
            setSessions(sessions.filter(s => s.id !== id));
            alert('Sesi dihentikan.');
        }
    };

    const handleLogoutAllSessions = async () => {
        if (await confirm({
            title: 'Hentikan Semua Sesi?',
            message: 'Apakah Anda yakin ingin menghentikan semua sesi aktif lainnya?',
            isDanger: true,
            confirmText: 'Hentikan Semua',
            cancelText: 'Batal'
        })) {
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
            <>
                <Head title="Pengaturan Bisnis" />
                <SettingsSkeleton />
            </>
        )
    }

    if (error && !settings) {
        return (
            <>
                <Head title="Pengaturan Bisnis" />
                <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6]/30 p-4">
                    <div className="bg-white p-8 rounded-3xl border border-[#E6E6E6] max-w-md w-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-[#FF3B30] text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-base font-semibold text-black mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-[#666666] mb-6">
                            Gagal memuat pengaturan dari server. Silakan coba lagi.
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
            <Head title="Pengaturan Bisnis" />

            <div className="min-h-screen bg-[#E6E6E6]/30 p-4 md:p-6 lg:p-8">
                <div className="max-w-[1450px] mx-auto space-y-6">

                    {/* Header */}
                    <div className="text-left space-y-1">
                        <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-black to-[#333333]">Pengaturan Bisnis</h1>
                        <p className="text-[13px] text-[#666666] font-normal mt-1">Kelola identitas toko, kebijakan perpajakan, dan preferensi lokalisasi Anda di sini.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* ── LEFT COLUMN: SIDEBAR NAVIGATION TABS ── */}
                        <div className="lg:col-span-3 space-y-2 bg-white p-4 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
                            {[
                                { id: 'profile', label: 'Profil Toko', icon: 'solar:shop-linear' },
                                { id: 'operational', label: 'Jam Operasional', icon: 'solar:clock-circle-linear' },
                                { id: 'billing', label: 'Penagihan & Pajak', icon: 'solar:bill-list-linear' },
                                { id: 'localization', label: 'Lokalisasi', icon: 'solar:global-linear' },
                                { id: 'security', label: 'Keamanan', icon: 'solar:shield-keyhole-linear' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={async () => {
                                        if (hasUnsavedChanges) {
                                            if (!await confirm({
                                                title: 'Tinggalkan Halaman?',
                                                message: 'Anda memiliki perubahan yang belum disimpan. Pindah tab?',
                                                isDanger: true,
                                                confirmText: 'Pindah Tab',
                                                cancelText: 'Batal'
                                            })) return;
                                        }
                                        setActiveTab(tab.id);
                                        setHasUnsavedChanges(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${activeTab === tab.id ? 'bg-[#BFFF00] text-black shadow-sm' : 'text-[#666666] hover:bg-[#E6E6E6]/60 hover:text-black'}`}
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
                                <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                            <iconify-icon icon="solar:shop-linear" class="text-black text-lg"></iconify-icon>
                                            Informasi Dasar Toko
                                        </h3>
                                        <p className="text-[13px] text-[#999999] mt-1">Detail ini akan muncul pada struk belanja pelanggan.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-black block">Nama Bisnis</label>
                                            <input
                                                type="text"
                                                value={cafeName}
                                                onChange={(e) => { setCafeName(e.target.value); triggerChange(); }}
                                                className="w-full h-11 px-4 py-2.5 text-[13px] bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all duration-200 shadow-sm font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                placeholder="Nama Toko"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-black block">Kategori Bisnis</label>
                                            <CustomSelect
                                                value={cafeCategory}
                                                onChange={(val) => { setCafeCategory(val); triggerChange(); }}
                                                options={[
                                                    { value: 'Cafe & Restaurant', label: 'Cafe & Restaurant' },
                                                    { value: 'Retail', label: 'Retail' },
                                                    { value: 'Co-Working Space', label: 'Co-Working Space' },
                                                    { value: 'Lainnya', label: 'Lainnya' }
                                                ]}
                                                placeholder="Pilih Kategori"
                                                className="w-full h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Alamat Lengkap</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center">
                                                <iconify-icon icon="solar:map-point-linear" class="text-base"></iconify-icon>
                                            </span>
                                            <input
                                                type="text"
                                                value={cafeAddress}
                                                onChange={(e) => { setCafeAddress(e.target.value); triggerChange(); }}
                                                className="w-full h-11 pl-10 pr-4 text-[13px] bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all duration-200 shadow-sm font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                placeholder="Alamat"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-black mb-1.5 block">Nomor Telepon</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center">
                                                    <iconify-icon icon="solar:phone-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <input
                                                    type="text"
                                                    value={cafePhone}
                                                    onChange={(e) => { setCafePhone(e.target.value); triggerChange(); }}
                                                    className="w-full h-11 pl-10 pr-4 text-[13px] bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all duration-200 shadow-sm font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                    placeholder="Telepon Toko"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-black mb-1.5 block">Email Bisnis</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center">
                                                    <iconify-icon icon="solar:letter-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <input
                                                    type="email"
                                                    value={cafeEmail}
                                                    onChange={(e) => { setCafeEmail(e.target.value); triggerChange(); }}
                                                    className="w-full h-11 pl-10 pr-4 text-[13px] bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all duration-200 shadow-sm font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                    placeholder="Email Bisnis"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: JAM OPERASIONAL */}
                            {activeTab === 'operational' && (
                                <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                            <iconify-icon icon="solar:clock-circle-linear" class="text-black text-lg"></iconify-icon>
                                            Jam Operasional
                                        </h3>
                                        <p className="text-[13px] text-[#999999] mt-1">Atur ketersediaan toko Anda di aplikasi pelanggan.</p>
                                    </div>

                                    <div className="space-y-3.5">
                                        {Object.keys(operationalHours).map((day) => {
                                            const schedule = operationalHours[day];
                                            return (
                                                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2.5 border-b border-[#E6E6E6]/60 last:border-none">
                                                    <div className="flex items-center gap-3 w-28 flex-shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleHourToggle(day)}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${schedule.active ? 'bg-[#BFFF00]' : 'bg-[#E6E6E6]'} active:scale-[0.97]`}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${schedule.active ? 'translate-x-6' : 'translate-x-1'
                                                                    }`}
                                                            />
                                                        </button>
                                                        <span className="text-sm font-semibold text-black">{day}</span>
                                                    </div>

                                                    {schedule.active ? (
                                                        <div className="flex items-center gap-3 text-xs font-semibold text-[#666666]">
                                                            <input
                                                                type="time"
                                                                value={schedule.open}
                                                                onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                                                                className="px-3 py-1.5 text-xs border border-[#D0D0D0] rounded-xl bg-white transition-all outline-none font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                            />
                                                            <span>sampai</span>
                                                            <input
                                                                type="time"
                                                                value={schedule.close}
                                                                onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                                                                className="px-3 py-1.5 text-xs border border-[#D0D0D0] rounded-xl bg-white transition-all outline-none font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 font-semibold text-xs capitalize tracking-wider">
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
                                <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                            <iconify-icon icon="solar:bill-list-linear" class="text-black text-lg"></iconify-icon>
                                            Kebijakan Pajak &amp; Biaya
                                        </h3>
                                        <p className="text-[13px] text-[#999999] mt-1">Konfigurasi PPN dan biaya layanan standar.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-black mb-1.5 block">Pajak Penjualan (PPN %)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={taxRate}
                                                    onChange={(e) => { setTaxRate(e.target.value); triggerChange(); }}
                                                    className="w-full h-11 px-4 py-2.5 pr-10 text-[13px] bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] outline-none transition-all duration-200 shadow-sm font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                    min="0"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black font-semibold">%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-black mb-1.5 block">Biaya Layanan (%)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={serviceCharge}
                                                    onChange={(e) => { setServiceCharge(e.target.value); triggerChange(); }}
                                                    className="w-full h-11 px-4 py-2.5 pr-10 text-[13px] bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] outline-none transition-all duration-200 shadow-sm font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                                    min="0"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black font-semibold">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tax Inclusive Switch */}
                                    <div className="p-4 bg-gray-50/40 border border-[#E6E6E6] rounded-xl flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h4 className="text-sm font-semibold text-black">Pajak Termasuk dalam Harga</h4>
                                            <p className="text-[13px] text-[#999999] font-normal">Aktifkan jika harga menu sudah termasuk PPN.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setTaxInclusive(!taxInclusive); triggerChange(); }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${taxInclusive ? 'bg-[#BFFF00]' : 'bg-[#E6E6E6]'} active:scale-[0.97]`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${taxInclusive ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: LOKALISASI */}
                            {activeTab === 'localization' && (
                                <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5 text-left animate-fadeIn">
                                    <div>
                                        <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                            <iconify-icon icon="solar:global-linear" class="text-black text-lg"></iconify-icon>
                                            Lokalisasi &amp; Satuan
                                        </h3>
                                        <p className="text-[13px] text-[#999999] mt-1">Atur bahasa, mata uang, dan format waktu.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-black mb-1.5 block">Mata Uang Utama</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center pointer-events-none">
                                                    <iconify-icon icon="solar:wallet-money-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <CustomSelect
                                                    value={currency}
                                                    onChange={(val) => { setCurrency(val); triggerChange(); }}
                                                    options={[
                                                        { value: 'IDR (Indonesian Rupiah)', label: 'IDR (Indonesian Rupiah)' },
                                                        { value: 'USD (US Dollar)', label: 'USD (US Dollar)' },
                                                        { value: 'SGD (Singapore Dollar)', label: 'SGD (Singapore Dollar)' }
                                                    ]}
                                                    placeholder="Pilih Mata Uang"
                                                    className="w-full h-11"
                                                    buttonClassName="pl-10 text-[13px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-black mb-1.5 block">Zona Waktu</label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center pointer-events-none">
                                                    <iconify-icon icon="solar:clock-circle-linear" class="text-base"></iconify-icon>
                                                </span>
                                                <CustomSelect
                                                    value={timezone}
                                                    onChange={(val) => { setTimezone(val); triggerChange(); }}
                                                    options={[
                                                        { value: '(GMT+07:00) Asia/Jakarta', label: '(GMT+07:00) Asia/Jakarta' },
                                                        { value: '(GMT+08:00) Asia/Makassar', label: '(GMT+08:00) Asia/Makassar' },
                                                        { value: '(GMT+09:00) Asia/Jayapura', label: '(GMT+09:00) Asia/Jayapura' }
                                                    ]}
                                                    placeholder="Pilih Zona Waktu"
                                                    className="w-full h-11"
                                                    buttonClassName="pl-10 text-[13px]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-black mb-1.5 block">Bahasa Sistem</label>
                                        <CustomSelect
                                            value={language}
                                            onChange={(val) => { setLanguage(val); triggerChange(); }}
                                            options={[
                                                { value: 'Bahasa Indonesia (ID)', label: 'Bahasa Indonesia (ID)' },
                                                { value: 'English (US)', label: 'English (US)' }
                                            ]}
                                            placeholder="Pilih Bahasa"
                                            className="w-full h-11"
                                            buttonClassName="text-[13px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: KEAMANAN (MOCKUP VISLY REDESIGN) */}
                            {activeTab === 'security' && (
                                <div className="space-y-6 text-left animate-fadeIn">

                                    {/* Card 1: Kebijakan Kata Sandi */}
                                    <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
                                        <div>
                                            <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                                <iconify-icon icon="solar:lock-keyhole-linear" class="text-black text-lg"></iconify-icon>
                                                Kebijakan Kata Sandi
                                            </h3>
                                            <p className="text-[13px] text-[#999999] mt-1">Atur standar kompleksitas sandi untuk seluruh pengguna.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                            {/* Left side: Length & Complexity */}
                                            <div className="space-y-5">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs font-semibold text-[#666666]">
                                                        <span className="capitalize tracking-wider">Panjang Kata Sandi Minimal</span>
                                                        <span className="bg-[#E6E6E6]/60 text-black px-3 py-1 rounded-lg font-mono text-sm">{minPasswordLength}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="range"
                                                            min="8"
                                                            max="32"
                                                            value={minPasswordLength}
                                                            onChange={(e) => { setMinPasswordLength(parseInt(e.target.value)); triggerChange(); }}
                                                            className="w-full h-1.5 bg-[#E6E6E6] rounded-lg appearance-none cursor-pointer accent-[#BFFF00]"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-[#999999] font-normal">Tentukan jumlah karakter minimum yang diperlukan (8-32 karakter).</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-semibold text-[#666666] capitalize tracking-wider">Kompleksitas Karakter</p>
                                                    <p className="text-[13px] text-[#999999] font-normal">Pilih jenis karakter yang wajib ada dalam kata sandi.</p>
                                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                                        {[
                                                            { id: 'uppercase', label: 'Huruf Besar (A-Z)' },
                                                            { id: 'lowercase', label: 'Huruf Kecil (a-z)' },
                                                            { id: 'numbers', label: 'Angka (0-9)' },
                                                            { id: 'symbols', label: 'Simbol (!@#$%)' }
                                                        ].map(opt => (
                                                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-black">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={passwordComplexity[opt.id]}
                                                                    onChange={() => {
                                                                        setPasswordComplexity(prev => ({ ...prev, [opt.id]: !prev[opt.id] }));
                                                                        triggerChange();
                                                                    }}
                                                                    className="rounded border-[#D0D0D0] text-black focus:ring-[#BFFF00] focus:ring-offset-0 transition-all focus:ring-2"
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
                                                    <label className="text-xs font-semibold text-[#666666] capitalize tracking-wider block">Masa Berlaku &amp; Riwayat</label>
                                                    <p className="text-[13px] text-[#999999] font-normal pb-1.5">Atur kapan sandi harus diganti dan pembatasan penggunaan sandi lama.</p>
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <span className="text-xs font-semibold text-[#666666] block mb-1">Kedaluwarsa Sandi</span>
                                                            <CustomSelect
                                                                value={passwordExpiry}
                                                                onChange={(val) => { setPasswordExpiry(val); triggerChange(); }}
                                                                options={[
                                                                    { value: '30', label: 'Setiap 30 Hari' },
                                                                    { value: '90', label: 'Setiap 90 Hari' },
                                                                    { value: '180', label: 'Setiap 180 Hari' },
                                                                    { value: 'never', label: 'Tidak Pernah' }
                                                                ]}
                                                                placeholder="Pilih Masa Berlaku"
                                                                className="w-full h-11"
                                                                buttonClassName="text-[13px]"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-xs font-semibold text-[#666666] block mb-1">Cegah Penggunaan Sandi Lama</span>
                                                            <CustomSelect
                                                                value={preventOldPassword}
                                                                onChange={(val) => { setPreventOldPassword(val); triggerChange(); }}
                                                                options={[
                                                                    { value: '3', label: '3 Sandi Terakhir' },
                                                                    { value: '5', label: '5 Sandi Terakhir' },
                                                                    { value: '10', label: '10 Sandi Terakhir' }
                                                                ]}
                                                                placeholder="Pilih Batasan"
                                                                className="w-full h-11"
                                                                buttonClassName="text-[13px]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <label className="text-xs font-semibold text-[#666666] capitalize tracking-wider block">Wajibkan Untuk Role</label>
                                                    <p className="text-[13px] text-[#999999] font-normal pb-1">Terapkan kebijakan ini secara ketat pada level akses tertentu.</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                        {[
                                                            { id: 'owner', label: 'Owner' },
                                                            { id: 'manager', label: 'Manager' },
                                                            { id: 'admin', label: 'Admin' },
                                                            { id: 'cashier', label: 'Kasir' }
                                                        ].map(role => (
                                                            <label key={role.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-black">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={requireRole2fa[role.id]}
                                                                    onChange={() => {
                                                                        setRequireRole2fa(prev => ({ ...prev, [role.id]: !prev[role.id] }));
                                                                        triggerChange();
                                                                    }}
                                                                    className="rounded border-[#D0D0D0] text-black focus:ring-[#BFFF00] focus:ring-offset-0 transition-all focus:ring-2"
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
                                    <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
                                        <div className="flex items-center justify-between border-b border-[#E6E6E6]/60 pb-3">
                                            <div>
                                                <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                                    <iconify-icon icon="solar:shield-keyhole-linear" class="text-black text-lg"></iconify-icon>
                                                    Autentikasi Dua Faktor (2FA)
                                                </h3>
                                                <p className="text-[13px] text-[#999999] mt-1">Lapisan keamanan tambahan menggunakan kode verifikasi perangkat.</p>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-[#E6E6E6]/40 px-3 py-1.5 rounded-xl border border-[#E6E6E6]">
                                                <span className="text-xs font-semibold text-black capitalize">Status Global:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => { setGlobal2fa(!global2fa); triggerChange(); }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${global2fa ? 'bg-[#BFFF00]' : 'bg-[#E6E6E6]'} active:scale-[0.97]`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${global2fa ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                                            {/* Sub-card: Metode diizinkan */}
                                            <div className="lg:col-span-4 p-4 border border-[#E6E6E6] rounded-2xl bg-[#E6E6E6]/10 text-left space-y-2 flex flex-col justify-between">
                                                <div className="space-y-1.5">
                                                    <span className="inline-block px-2.5 py-0.5 bg-[#E6E6E6] text-black border border-[#D0D0D0] text-xs font-semibold capitalize tracking-wider rounded-full">
                                                        Direkomendasikan
                                                    </span>
                                                    <h4 className="text-sm font-semibold text-black pt-1">Metode yang Diizinkan</h4>
                                                </div>
                                                <p className="text-[13px] text-[#666666] font-normal leading-relaxed">
                                                    Aplikasi Authenticator (Google/Microsoft), SMS OTP, dan Email.
                                                </p>
                                            </div>

                                            {/* Sub-card: Panduan */}
                                            <div className="lg:col-span-4 p-4 border border-[#E6E6E6] rounded-2xl bg-[#E6E6E6]/10 text-left space-y-2 flex flex-col justify-between">
                                                <h4 className="text-sm font-semibold text-black">Panduan Pendaftaran</h4>
                                                <p className="text-[13px] text-[#666666] font-normal leading-relaxed">
                                                    Berikan instruksi langkah-demi-langkah kepada staf Anda untuk aktivasi.
                                                </p>
                                                <a href="#" className="text-xs font-semibold text-black border-b border-[#D0D0D0] hover:border-black transition-all pb-0.5 inline-flex w-fit items-center gap-1">
                                                    Lihat Panduan
                                                    <iconify-icon icon="solar:export-linear" class="text-[10px]"></iconify-icon>
                                                </a>
                                            </div>

                                            {/* Sub-card: Gauge register */}
                                            <div className="lg:col-span-4 p-4 border border-[#E6E6E6] rounded-2xl bg-[#BFFF00]/5 text-center flex flex-col items-center justify-between gap-3">
                                                <div className="flex items-center justify-center gap-3">
                                                    {/* Circular gauge */}
                                                    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-full h-full transform -rotate-90">
                                                            <circle cx="24" cy="24" r="20" stroke="#E6E6E6" strokeWidth="4" fill="transparent" />
                                                            <circle cx="24" cy="24" r="20" stroke="#BFFF00" strokeWidth="4" fill="transparent"
                                                                strokeDasharray={`${2 * Math.PI * 20}`}
                                                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - 0.6)}`}
                                                            />
                                                        </svg>
                                                        <span className="absolute text-xs font-semibold text-black">60%</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <h5 className="text-sm font-semibold text-black">3 dari 5 Pengguna</h5>
                                                        <p className="text-xs text-[#666666] font-normal">Telah mengaktifkan 2FA.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShow2faModal(true)}
                                                    className="w-full py-2 bg-[#BFFF00] hover:bg-[#C8FF5E] text-black text-sm font-semibold rounded-xl duration-150 active:scale-[0.97] shadow-sm transition-all"
                                                >
                                                    Kelola per User
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 3: Sesi Aktif */}
                                    <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
                                        <div className="flex items-center justify-between border-b border-[#E6E6E6]/60 pb-3">
                                            <div>
                                                <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                                    <iconify-icon icon="solar:history-linear" class="text-black text-lg"></iconify-icon>
                                                    Sesi Aktif
                                                </h3>
                                                <p className="text-[13px] text-[#999999] mt-1">Daftar perangkat yang saat ini masuk ke akun Anda.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleLogoutAllSessions}
                                                className="px-3.5 py-1.5 text-xs font-semibold text-[#FF3B30] border border-[#FF3B30]/20 hover:bg-[#FF3B30]/5 rounded-xl transition-all duration-200 active:scale-[0.97]"
                                            >
                                                Logout Semua Sesi
                                            </button>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                    <tr className="bg-[#E6E6E6]/30 border-b border-[#E6E6E6]">
                                                        <th className="px-5 py-3 text-xs font-semibold text-[#666666] capitalize tracking-wider">Perangkat &amp; Browser</th>
                                                        <th className="px-5 py-3 text-xs font-semibold text-[#666666] capitalize tracking-wider">Alamat IP</th>
                                                        <th className="px-5 py-3 text-xs font-semibold text-[#666666] capitalize tracking-wider">Lokasi</th>
                                                        <th className="px-5 py-3 text-xs font-semibold text-[#666666] capitalize tracking-wider">Aktivitas Terakhir</th>
                                                        <th className="px-5 py-3 text-xs font-semibold text-[#666666] capitalize tracking-wider text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#E6E6E6]/60">
                                                    {sessions.map(s => (
                                                        <tr key={s.id} className="hover:bg-[#E6E6E6]/30 transition-all cursor-pointer font-normal text-black">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-[#E6E6E6]/40 text-black flex items-center justify-center">
                                                                        <iconify-icon icon={s.device.includes('iPhone') ? "solar:iphone-linear" : "solar:laptop-linear"}></iconify-icon>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold text-black">{s.device}</h4>
                                                                        <p className="text-xs text-[#999999] font-normal">{s.browser}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 font-mono text-[#666666]">{s.ip}</td>
                                                            <td className="px-5 py-3.5 text-black font-semibold">{s.location}</td>
                                                            <td className="px-5 py-3.5 font-semibold">
                                                                <span className={s.last_active === 'Sekarang' ? 'text-emerald-600' : 'text-[#999999]'}>
                                                                    {s.last_active}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                {s.last_active !== 'Sekarang' ? (
                                                                    <button
                                                                        onClick={() => handleTerminateSession(s.id, s.device)}
                                                                        className="text-xs font-semibold text-black border-b border-[#D0D0D0] hover:border-black transition-colors duration-150 active:scale-[0.97]"
                                                                    >
                                                                        Hentikan Sesi
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 capitalize font-semibold tracking-wider px-2.5 py-0.5 rounded-full">Aktif</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-xs text-[#666666] font-normal flex items-center gap-1 pt-2 border-t border-[#E6E6E6]">
                                            <iconify-icon icon="solar:info-circle-linear" class="text-xs text-[#999999]"></iconify-icon>
                                            Kami merekomendasikan untuk mengakhiri sesi yang tidak dikenali segera.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Actions Form Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E6E6E6] pt-4 pb-6">
                                <div className="text-sm text-amber-600 font-semibold flex items-center gap-1.5">
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
                                        className="px-6 py-2.5 text-sm font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] transition-all duration-200 active:scale-[0.98] shadow-sm"
                                    >
                                        Batalkan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="px-7 py-2.5 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-[#BFFF00]/10"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-6xl w-full mx-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#E6E6E6] overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-[#E6E6E6] flex justify-between items-start">
                            <div className="flex gap-3 text-left">
                                <div className="w-10 h-10 rounded-xl bg-[#E6E6E6]/40 text-black flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="solar:shield-keyhole-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-black">Kelola 2FA per User</h3>
                                    <p className="text-[13px] text-[#999999] font-normal mt-0.5">Daftar pengguna dan status keamanan autentikasi mereka</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setShow2faModal(false); setSelectedUserIds([]); }}
                                className="w-8 h-8 rounded-full border border-[#D0D0D0] text-black/50 hover:text-black bg-white hover:bg-[#E6E6E6] flex items-center justify-center active:scale-[0.98] transition-all duration-150"
                            >
                                <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                            </button>
                        </div>

                        {/* Search & Filters */}
                        <div className="px-6 py-4 bg-[#E6E6E6]/10 border-b border-[#E6E6E6]/60 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 flex items-center justify-center pointer-events-none">
                                    <iconify-icon icon="solar:magnifer-linear" class="text-base"></iconify-icon>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    value={modalSearch}
                                    onChange={(e) => setModalSearch(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 text-[13px] bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none transition-all duration-200 shadow-sm font-normal text-black hover:border-[#999999] focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
                                />
                            </div>

                            <CustomSelect
                                value={modalRoleFilter}
                                onChange={(val) => setModalRoleFilter(val)}
                                options={[
                                    { value: '', label: 'Semua Role' },
                                    { value: 'owner', label: 'Owner' },
                                    { value: 'manager', label: 'Manager' },
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'employee', label: 'Employee' },
                                    { value: 'cashier', label: 'Cashier' }
                                ]}
                                placeholder="Semua Role"
                                className="w-[140px]"
                            />

                            <CustomSelect
                                value={modalStatusFilter}
                                onChange={(val) => setModalStatusFilter(val)}
                                options={[
                                    { value: '', label: 'Semua Status' },
                                    { value: 'terdaftar', label: 'Terdaftar' },
                                    { value: 'belum aktif', label: 'Belum Aktif' }
                                ]}
                                placeholder="Semua Status"
                                className="w-[140px]"
                            />
                        </div>

                        {/* Modal Users Table */}
                        <div className="overflow-y-auto max-h-[350px]">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="text-xs font-semibold text-[#666666] bg-[#E6E6E6]/30 border-b border-[#E6E6E6] tracking-wider text-[11px] capitalize">
                                        <th className="px-6 py-3.5 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAllUsers}
                                                checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                                                className="rounded border-[#D0D0D0] text-black focus:ring-[#BFFF00] focus:ring-offset-0 transition-all focus:ring-2"
                                            />
                                        </th>
                                        <th className="px-6 py-3.5">Nama</th>
                                        <th className="px-6 py-3.5">Role</th>
                                        <th className="px-6 py-3.5">Metode 2FA</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5">Terakhir Verifikasi</th>
                                        <th className="px-6 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E6E6E6]/60">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-[#999999] font-normal">
                                                Tidak ada pengguna yang cocok dengan kriteria filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-[#E6E6E6]/30 transition-all cursor-pointer font-normal text-black">
                                                <td className="px-6 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUserIds.includes(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                        className="rounded border-[#D0D0D0] text-black focus:ring-[#BFFF00] focus:ring-offset-0 transition-all focus:ring-2"
                                                    />
                                                </td>
                                                <td className="px-6 py-3 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-100 text-black flex items-center justify-center font-semibold text-xs border border-[#E6E6E6] flex-shrink-0">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="text-left overflow-hidden">
                                                        <h4 className="font-semibold text-black truncate">{user.name}</h4>
                                                        <p className="text-[13px] text-[#999999] font-normal truncate">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-left">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize tracking-wider bg-[#E6E6E6]/40 text-black border border-[#D0D0D0]">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-left">
                                                    <span className="inline-flex items-center gap-1.5 font-semibold text-black">
                                                        <iconify-icon
                                                            icon={user.method === 'None' ? 'solar:shield-warning-linear' : user.method === 'SMS' ? 'solar:letter-linear' : 'solar:shield-keyhole-linear'}
                                                            class={user.method === 'None' ? 'text-[#999999]' : 'text-black'}
                                                        ></iconify-icon>
                                                        {user.method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-left">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize tracking-wider border ${user.status === 'Terdaftar'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            : 'bg-[#E6E6E6]/20 text-[#666666] border-[#D0D0D0]'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-left text-[#666666] font-semibold">{user.last_verified}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => alert(`Kirim pengingat pendaftaran 2FA ke ${user.name}`)}
                                                            className="w-7 h-7 rounded-xl bg-white border border-[#D0D0D0] flex items-center justify-center text-[#666666] hover:text-black hover:border-black hover:shadow-sm active:scale-[0.97] transition-all duration-150"
                                                            title="Kirim Pengingat"
                                                        >
                                                            <iconify-icon icon="solar:letter-linear" class="text-xs"></iconify-icon>
                                                        </button>
                                                        <button
                                                            onClick={() => alert(`Reset kunci 2FA untuk ${user.name}`)}
                                                            className="w-7 h-7 rounded-xl bg-white border border-[#D0D0D0] flex items-center justify-center text-[#666666] hover:text-[#FF3B30] hover:border-[#FF3B30] hover:shadow-sm active:scale-[0.97] transition-all duration-150"
                                                            title="Reset 2FA"
                                                        >
                                                            <iconify-icon icon="solar:history-linear" class="text-xs"></iconify-icon>
                                                        </button>
                                                        <button
                                                            onClick={() => alert(`Kelola hak akses/opsi 2FA untuk ${user.name}`)}
                                                            className="w-7 h-7 rounded-xl bg-white border border-[#D0D0D0] flex items-center justify-center text-[#666666] hover:text-black hover:border-black hover:shadow-sm active:scale-[0.97] transition-all duration-150"
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
                        <div className="px-6 py-4 bg-[#E6E6E6]/10 border-t border-[#E6E6E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-[13px] font-semibold text-[#666666] text-left">
                                {selectedUserIds.length} User Terpilih <span className="text-gray-300 font-normal px-1">|</span> <span className="font-semibold text-[#999999]">Pilih user untuk melakukan aksi massal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        if (selectedUserIds.length === 0) return alert('Silakan pilih setidaknya 1 user.');
                                        alert(`Mengirim pesan email pengingat masal ke ${selectedUserIds.length} user...`);
                                        setSelectedUserIds([]);
                                    }}
                                    className="px-4 py-2 bg-white border border-[#D0D0D0] text-black hover:bg-[#E6E6E6] text-sm font-semibold rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-all duration-150"
                                >
                                    <iconify-icon icon="solar:letter-linear" class="text-sm"></iconify-icon>
                                    Kirim Pengingat Masal
                                </button>
                                <button
                                    onClick={async () => {
                                        if (selectedUserIds.length === 0) return alert('Silakan pilih setidaknya 1 user.');
                                        if (await confirm({
                                            title: 'Reset Kunci 2FA?',
                                            message: `Reset kunci 2FA untuk ${selectedUserIds.length} user terpilih? Tindakan ini tidak dapat dibatalkan.`,
                                            isDanger: true,
                                            confirmText: 'Reset',
                                            cancelText: 'Batal'
                                        })) {
                                            alert(`${selectedUserIds.length} kunci 2FA berhasil di-reset.`);
                                            setSelectedUserIds([]);
                                        }
                                    }}
                                    className="px-4 py-2 bg-[#FF3B30] hover:bg-red-700 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-all duration-150"
                                >
                                    <iconify-icon icon="solar:history-linear" class="text-sm"></iconify-icon>
                                    Reset 2FA Terpilih
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
