import React, { useState, useEffect } from 'react';
import Head from '@/Components/Head';
import { Icon } from '@iconify/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import client from '@/api/client';
import PromotionsSkeleton from '@/Components/Skeletons/PromotionsSkeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const getBrandColor = (varName, fallback, opacity = 1) => {
    if (typeof window === 'undefined') return `rgba(${fallback}, ${opacity})`;
    const rootStyle = getComputedStyle(document.documentElement);
    const val = rootStyle.getPropertyValue(varName).trim();
    if (!val) return `rgba(${fallback}, ${opacity})`;
    const rgbStr = val.includes(' ') ? val.split(' ').join(', ') : val;
    return `rgba(${rgbStr}, ${opacity})`;
};

function useForm(initialValues = {}) {
    const [data, setDataState] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setData = (key, value) => {
        if (typeof key === 'object') {
            setDataState(prev => ({ ...prev, ...key }));
        } else {
            setDataState(prev => ({ ...prev, [key]: value }));
        }
    };

    const reset = () => {
        setDataState(initialValues);
        setErrors({});
        setProcessing(false);
    };

    return {
        data,
        setData,
        errors,
        setErrors,
        processing,
        setProcessing,
        reset
    };
}

export default function PromotionsIndex() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [totalRedemptions, setTotalRedemptions] = useState(0);
    const [estimasiRevenue, setEstimasiRevenue] = useState(0);
    const [kampanyeAktif, setKampanyeAktif] = useState(0);
    const [efisiensiPromo, setEfisiensiPromo] = useState(0);
    const [campaigns, setCampaigns] = useState([]);
    const [highlightCampaign, setHighlightCampaign] = useState(null);
    const [menus, setMenus] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchPromotionsData = async () => {
            setLoading(true);
            try {
                setError(null);
                const res = await client.get('/promotions');
                setTotalRedemptions(res.data.totalRedemptions ?? 0);
                setEstimasiRevenue(res.data.estimasiRevenue ?? 0);
                setKampanyeAktif(res.data.kampanyeAktif ?? 0);
                setEfisiensiPromo(res.data.efisiensiPromo ?? 0);
                setCampaigns(res.data.campaigns ?? []);
                setHighlightCampaign(res.data.highlightCampaign ?? null);
                setMenus(res.data.menus ?? []);
                setChartLabels(res.data.chartLabels ?? []);
                setChartData(res.data.chartData ?? []);
            } catch (err) {
                console.error("Gagal mengambil data promosi:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotionsData();
    }, [refreshTrigger]);

    const [activeTab, setActiveTab] = useState('Semua');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [activeFormType, setActiveFormType] = useState('promotion');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [activeDropdownId, setActiveDropdownId] = useState(null);

    const filteredCampaigns = campaigns.filter((c) => {
        if (activeTab === 'Semua') return true;
        return c.status === activeTab;
    });

    const promoForm = useForm({
        name: '',
        type: 'percentage',
        value: '',
        min_purchase: 0,
        start_date: '',
        end_date: '',
        is_active: true,
    });

    const bundleForm = useForm({
        name: '',
        description: '',
        price: '',
        is_active: true,
        menus: [],
    });

    const [menuSearchQuery, setMenuSearchQuery] = useState('');
    const [selectedMenuToAdd, setSelectedMenuToAdd] = useState('');
    const [quantityToAdd, setQuantityToAdd] = useState(1);

    const handleAddMenuToBundle = () => {
        if (!selectedMenuToAdd) return;
        const menuObj = menus.find((m) => m.id === parseInt(selectedMenuToAdd));
        if (!menuObj) return;
        const exists = bundleForm.data.menus.find((m) => m.id === menuObj.id);
        if (exists) {
            bundleForm.setData('menus', bundleForm.data.menus.map((m) =>
                m.id === menuObj.id ? { ...m, qty: m.qty + quantityToAdd } : m
            ));
        } else {
            bundleForm.setData('menus', [...bundleForm.data.menus, { id: menuObj.id, name: menuObj.name, qty: quantityToAdd }]);
        }
        setSelectedMenuToAdd('');
        setQuantityToAdd(1);
    };

    const handleRemoveMenuFromBundle = (menuId) => {
        bundleForm.setData('menus', bundleForm.data.menus.filter((m) => m.id !== menuId));
    };

    const formatRp = (value) => new Intl.NumberFormat('id-ID').format(value);

    const handlePromoSubmit = async (e) => {
        e.preventDefault();
        promoForm.setProcessing(true);
        promoForm.setErrors({});
        try {
            if (isEditModalOpen && editingCampaign) {
                await client.put(`/promotions/${editingCampaign.id}`, promoForm.data);
                setIsEditModalOpen(false);
                showNotification('Promosi berhasil diperbarui!');
            } else {
                await client.post('/promotions', promoForm.data);
                setIsCreateModalOpen(false);
                promoForm.reset();
                showNotification('Promosi baru berhasil ditambahkan!');
            }
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Gagal menyimpan promosi:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const formattedErrors = {};
                Object.entries(err.response.data.errors).forEach(([k, v]) => {
                    formattedErrors[k] = Array.isArray(v) ? v[0] : v;
                });
                promoForm.setErrors(formattedErrors);
            } else {
                alert("Terjadi kesalahan saat menyimpan promosi.");
            }
        } finally {
            promoForm.setProcessing(false);
        }
    };

    const handleBundleSubmit = async (e) => {
        e.preventDefault();
        bundleForm.setProcessing(true);
        bundleForm.setErrors({});
        const formattedMenus = bundleForm.data.menus.map((m) => ({ id: m.id, qty: m.qty }));
        const submitData = { ...bundleForm.data, menus: formattedMenus };
        try {
            if (isEditModalOpen && editingCampaign) {
                await client.put(`/bundles/${editingCampaign.id}`, submitData);
                setIsEditModalOpen(false);
                showNotification('Bundle berhasil diperbarui!');
            } else {
                await client.post('/bundles', submitData);
                setIsCreateModalOpen(false);
                bundleForm.reset();
                showNotification('Bundle baru berhasil ditambahkan!');
            }
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Gagal menyimpan bundle:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                const formattedErrors = {};
                Object.entries(err.response.data.errors).forEach(([k, v]) => {
                    formattedErrors[k] = Array.isArray(v) ? v[0] : v;
                });
                bundleForm.setErrors(formattedErrors);
            } else {
                alert("Terjadi kesalahan saat menyimpan bundle.");
            }
        } finally {
            bundleForm.setProcessing(false);
        }
    };

    const showNotification = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleDeleteCampaign = async (campaign) => {
        const path = campaign.type === 'bundle' ? `/bundles/${campaign.id}` : `/promotions/${campaign.id}`;
        if (confirm(`Apakah Anda yakin ingin menghapus ${campaign.name}?`)) {
            try {
                await client.delete(path);
                setActiveDropdownId(null);
                showNotification(`${campaign.name} berhasil dihapus!`);
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                console.error("Gagal menghapus kampanye:", err);
                alert("Gagal menghapus kampanye.");
            }
        }
    };

    const handleEditCampaignClick = (campaign) => {
        setEditingCampaign(campaign);
        setActiveFormType(campaign.type);
        setActiveDropdownId(null);
        if (campaign.type === 'promotion') {
            promoForm.setData({
                name: campaign.name, type: campaign.raw_type || 'percentage',
                value: campaign.raw_value || 0, min_purchase: campaign.min_purchase || 0,
                start_date: campaign.start_date || '', end_date: campaign.end_date || '',
                is_active: campaign.is_active,
            });
        } else {
            bundleForm.setData({
                name: campaign.name, description: campaign.description || '',
                price: campaign.price || 0, is_active: campaign.is_active,
                menus: campaign.menus || [],
            });
        }
        setIsEditModalOpen(true);
    };

    // Chart
    const chartRenderData = {
        labels: chartLabels,
        datasets: [{
            label: 'Jumlah Penebusan Promo',
            data: chartData,
            borderColor: getBrandColor('--color-brand-secondary', '68, 61, 255'),
            backgroundColor: (context) => {
                const chart = context.chart;
                const ctx = chart?.ctx;
                if (!ctx) return getBrandColor('--color-brand-secondary', '68, 61, 255', 0.08);
                const gradient = ctx.createLinearGradient(0, 0, 0, 220);
                gradient.addColorStop(0, getBrandColor('--color-brand-secondary', '68, 61, 255', 0.18));
                gradient.addColorStop(1, getBrandColor('--color-brand-secondary', '68, 61, 255', 0.00));
                return gradient;
            },
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: getBrandColor('--color-brand-secondary', '68, 61, 255'),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0.45,
            fill: true,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: getBrandColor('--color-brand-dark', '5, 3, 22'),
                titleColor: getBrandColor('--color-brand-light', '221, 219, 255'),
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 10,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: getBrandColor('--color-brand-primary', '47, 39, 206'), font: { weight: '700', size: 11 } },
            },
            y: {
                border: { dash: [4, 4] },
                grid: { color: getBrandColor('--color-brand-light', '221, 219, 255', 0.4) },
                ticks: { color: getBrandColor('--color-brand-primary', '47, 39, 206'), font: { size: 10, weight: '600' } },
            },
        },
    };

    // Input class reusable
    const inputCls = "w-full h-11 bg-brand-bg border border-brand-light rounded-xl px-4 py-2.5 text-[13px] font-semibold text-brand-dark placeholder-brand-primary/50 outline-none focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all shadow-sm";

    if (loading) {
        return (
            <>
                <Head title="Promosi & Bundling" />
                <PromotionsSkeleton />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head title="Promosi & Bundling" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <Icon icon="solar:danger-triangle-linear" className="text-rose-500 text-5xl mb-4 mx-auto block" />
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data promosi dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Promosi & Bundling" />

            <div className="flex-1 overflow-y-auto bg-brand-bg min-h-screen px-6 py-6 space-y-6">

                {/* ── HEADER ── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Promosi & Bundling
                        </h1>
                        <p className="text-xs md:text-sm text-brand-primary/60 font-medium mt-1">
                            Kelola kampanye pemasaran dan tingkatkan penjualan dengan penawaran menarik.
                        </p>
                    </div>
                    <button
                        onClick={() => { promoForm.reset(); bundleForm.reset(); setIsCreateModalOpen(true); }}
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/30 active:scale-[0.98] text-[13px] self-start"
                    >
                        <Icon icon="solar:add-circle-linear" className="text-lg" />
                        Buat Promo Baru
                    </button>
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1 */}
                    <div className="bg-white border border-brand-light p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                            <Icon icon="solar:ticket-linear" className="text-[22px] text-brand-secondary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest">Total Redemptions</p>
                            <p className="text-2xl font-extrabold text-brand-dark leading-tight">{formatRp(totalRedemptions)}</p>
                            <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">+12% <span className="font-medium text-brand-primary/60">bulan ini</span></p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-brand-light p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                            <Icon icon="solar:graph-up-linear" className="text-[22px] text-brand-secondary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest">Estimasi Revenue</p>
                            <p className="text-xl font-extrabold text-brand-dark leading-tight">
                                Rp {(estimasiRevenue / 1000000).toFixed(2)}M
                            </p>
                            <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">+8.4% <span className="font-medium text-brand-primary/60">vs bulan lalu</span></p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-brand-light p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                            <Icon icon="solar:tag-linear" className="text-[22px] text-brand-secondary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest">Kampanye Aktif</p>
                            <p className="text-2xl font-extrabold text-brand-dark leading-tight">{kampanyeAktif}</p>
                            <p className="text-[10px] font-extrabold text-amber-500 mt-0.5">2 akan berakhir</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white border border-brand-light p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                            <Icon icon="solar:star-linear" className="text-[22px] text-brand-secondary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest">Efisiensi Promo</p>
                            <p className="text-2xl font-extrabold text-brand-dark leading-tight">{efisiensiPromo}%</p>
                            <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">+1.2% <span className="font-medium text-brand-primary/60">peningkatan</span></p>
                        </div>
                    </div>
                </div>

                {/* ── SPOTLIGHT / HIGHLIGHT CAMPAIGN ── */}
                <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:graph-up-linear" className="text-lg text-brand-secondary" />
                                <span className="text-[10px] font-extrabold text-brand-secondary capitalize tracking-widest">Bundel Spesial</span>
                            </div>
                            <span className="text-[10px] font-extrabold bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-3 py-1 rounded-full tracking-wide">
                                Kampanye Utama
                            </span>
                        </div>

                        <h2 className="text-xl font-extrabold text-brand-dark tracking-tight">
                            {highlightCampaign?.name || 'Weekend Bundle'}
                        </h2>
                        <p className="text-xs font-medium text-brand-primary mt-1.5 max-w-xl leading-relaxed">
                            {highlightCampaign?.description || 'Dapatkan diskon 10% untuk setiap pembelian kombinasi 1 Croissant dan 1 Kopi varian apapun di akhir pekan (Sabtu & Minggu).'}
                        </p>

                        <div className="grid grid-cols-3 gap-6 max-w-lg mt-5 pt-5 border-t border-brand-light">
                            <div>
                                <p className="text-[10px] font-extrabold text-brand-primary/50 capitalize tracking-widest mb-1">Diskon</p>
                                <p className="text-lg font-extrabold text-brand-secondary">
                                    {highlightCampaign?.discount_display || 'Diskon 10%'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-brand-primary/50 capitalize tracking-widest mb-1">Total Pendapatan</p>
                                <p className="text-lg font-extrabold text-brand-dark">
                                    Rp {formatRp(highlightCampaign?.revenue || 4260000)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-brand-primary/50 capitalize tracking-widest mb-1">Penebusan</p>
                                <p className="text-lg font-extrabold text-brand-dark">
                                    {highlightCampaign?.redemptions || 142} <span className="text-xs text-brand-primary/50 font-medium">Kali</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => highlightCampaign && handleEditCampaignClick(highlightCampaign)}
                                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-primary/30 transition-all active:scale-[0.98]"
                            >
                                Kelola Bundel
                            </button>
                            <button className="px-5 py-2.5 border border-brand-light bg-white text-brand-primary text-xs font-bold hover:bg-brand-light hover:text-brand-dark transition-colors rounded-xl active:scale-[0.98]">
                                Lihat Analitik
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── DAFTAR KAMPANYE ── */}
                <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                        <div>
                            <h3 className="text-base font-extrabold text-brand-dark tracking-tight">Daftar Kampanye</h3>
                            <p className="text-xs font-medium text-brand-primary mt-0.5">Semua promosi yang terdaftar dalam sistem.</p>
                        </div>
                        {/* Filter tabs */}
                        <div className="flex items-center gap-2">
                            {['Semua', 'Aktif', 'Terjadwal'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all
                                        ${activeTab === tab
                                            ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                            : 'bg-white text-brand-primary border-brand-light hover:bg-brand-light/50 hover:text-brand-dark'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="text-[10px] text-brand-primary border-b border-brand-light capitalize tracking-wider">
                                    <th className="pb-3 font-extrabold">Nama Promo</th>
                                    <th className="pb-3 font-extrabold">Potongan</th>
                                    <th className="pb-3 font-extrabold">Periode</th>
                                    <th className="pb-3 font-extrabold w-40">Penebusan</th>
                                    <th className="pb-3 font-extrabold">Total Revenue</th>
                                    <th className="pb-3 font-extrabold">Status</th>
                                    <th className="pb-3 font-extrabold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredCampaigns.map((camp) => (
                                    <tr key={`${camp.type}-${camp.id}`}
                                        className="border-b border-brand-light/30 last:border-0 hover:bg-gradient-to-r hover:from-brand-light/40 hover:to-transparent transition-all">
                                        <td className="py-4 pr-3">
                                            <p className="font-extrabold text-brand-dark">{camp.name}</p>
                                            {camp.description && (
                                                <p className="text-[10px] text-brand-primary/60 mt-0.5 truncate max-w-[200px]">{camp.description}</p>
                                            )}
                                            {camp.menus?.length > 0 && (
                                                <p className="text-[10px] text-brand-secondary mt-0.5">
                                                    {camp.menus.map((m) => `${m.qty}x ${m.name}`).join(' + ')}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-4 font-extrabold text-brand-secondary">{camp.discount_display}</td>
                                        <td className="py-4 text-xs text-brand-primary/70 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Icon icon="solar:calendar-linear" className="text-sm text-brand-secondary" />
                                                {camp.period_display}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-6">
                                            <div className="flex items-center gap-3">
                                                <span className="font-extrabold text-brand-dark w-8 text-right text-xs">{camp.redemptions}</span>
                                                <div className="flex-1 h-1.5 bg-brand-light/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                                                        style={{ width: `${Math.min(100, (camp.redemptions / 540) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 font-extrabold text-brand-dark text-xs">
                                            Rp {formatRp(camp.revenue)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg border tracking-wide
                                                ${camp.status === 'Aktif'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    : camp.status === 'Terjadwal'
                                                        ? 'bg-brand-light text-brand-primary border-[#c4c0ff]'
                                                        : 'bg-brand-light/40 text-brand-primary/60 border-brand-light'
                                                }`}>
                                                {camp.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveDropdownId(
                                                    activeDropdownId === `${camp.type}-${camp.id}` ? null : `${camp.type}-${camp.id}`
                                                )}
                                                className="text-brand-primary/40 hover:text-brand-secondary w-8 h-8 rounded-lg flex items-center justify-center hover:bg-brand-light/50 transition-all ml-auto"
                                            >
                                                <Icon icon="solar:menu-dots-linear" className="text-base" />
                                            </button>
                                            {activeDropdownId === `${camp.type}-${camp.id}` && (
                                                <div className="absolute right-0 mt-1 w-40 bg-white border border-brand-light rounded-xl shadow-lg z-10 py-1.5 text-left">
                                                    <button
                                                        onClick={() => handleEditCampaignClick(camp)}
                                                        className="w-full px-4 py-2 hover:bg-brand-light/30 text-xs font-bold text-brand-dark flex items-center gap-2 transition-colors"
                                                    >
                                                        <Icon icon="solar:pen-linear" className="text-brand-secondary" />
                                                        Ubah Promo
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCampaign(camp)}
                                                        className="w-full px-4 py-2 hover:bg-rose-50 text-xs font-bold text-rose-600 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Icon icon="solar:trash-bin-trash-linear" />
                                                        Hapus Promo
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-5 pt-5 border-t border-brand-light/50">
                        <span className="text-[11px] font-bold text-brand-primary/60">
                            Menampilkan {filteredCampaigns.length} dari {campaigns.length} promosi
                        </span>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-brand-light rounded-xl bg-white text-xs font-extrabold text-brand-primary/40 cursor-not-allowed">
                                Sebelumnya
                            </button>
                            <button className="px-4 py-2 border border-brand-light rounded-xl bg-white text-xs font-extrabold text-brand-primary hover:bg-brand-light/50 hover:text-brand-dark transition-colors">
                                Berikutnya
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── CHART TREN ── */}
                <div className="bg-white border border-brand-light rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center">
                                <Icon icon="solar:graph-up-linear" className="text-lg text-brand-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-brand-dark tracking-tight">Tren Penebusan Mingguan</h3>
                                <p className="text-[10px] font-medium text-brand-primary mt-0.5">
                                    Fluktuasi penggunaan promo dan voucher dalam 7 hari terakhir.
                                </p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                            Live Data
                        </span>
                    </div>
                    <div className="h-56 relative w-full">
                        <Line data={chartRenderData} options={chartOptions} />
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-[11px] font-bold text-brand-primary">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-0.5 bg-brand-secondary rounded-full inline-block"></span>
                            Jumlah Penebusan
                        </span>
                    </div>
                </div>

            </div>

            {/* ── MODAL CREATE / EDIT ── */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-brand-light rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

                        {/* Modal Header */}
                        {!isEditModalOpen ? (
                            <div className="flex border-b border-brand-light">
                                {[
                                    { key: 'promotion', label: 'Diskon Promosi', icon: 'solar:ticket-sale-linear' },
                                    { key: 'bundle', label: 'Bundling Menu', icon: 'solar:box-linear' },
                                ].map((t) => (
                                    <button
                                        key={t.key}
                                        onClick={() => setActiveFormType(t.key)}
                                        className={`flex-1 py-4 text-sm font-extrabold transition-all flex items-center justify-center gap-2
                                            ${activeFormType === t.key
                                                ? 'border-b-2 border-brand-secondary text-brand-secondary bg-brand-light/20'
                                                : 'text-brand-primary/50 hover:bg-brand-light/20'
                                            }`}
                                    >
                                        <Icon icon={t.icon} className="text-base" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-4 border-b border-brand-light flex justify-between items-center">
                                <h3 className="text-base font-extrabold text-brand-dark">
                                    Ubah {activeFormType === 'promotion' ? 'Promosi' : 'Bundling'}
                                </h3>
                                <button
                                    onClick={() => { setIsEditModalOpen(false); setEditingCampaign(null); }}
                                    className="w-8 h-8 rounded-xl bg-brand-light/50 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-brand-primary transition-colors"
                                >
                                    <Icon icon="solar:close-circle-linear" className="text-lg" />
                                </button>
                            </div>
                        )}

                        <div className="p-6 h-[75vh] overflow-y-auto space-y-4">

                            {/* FORM PROMOSI */}
                            {activeFormType === 'promotion' && (
                                <form onSubmit={handlePromoSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">
                                            Nama Promo <span className="text-rose-500">*</span>
                                        </label>
                                        <input type="text" required value={promoForm.data.name}
                                            onChange={(e) => promoForm.setData('name', e.target.value)}
                                            placeholder="Contoh: Diskon Kopi Senja"
                                            className={inputCls} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">Tipe Potongan</label>
                                            <select value={promoForm.data.type}
                                                onChange={(e) => promoForm.setData('type', e.target.value)}
                                                className={inputCls}>
                                                <option value="percentage">Persentase (%)</option>
                                                <option value="fixed">Nominal Tetap (Rp)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">Nilai Potongan</label>
                                            <input type="number" required min="0" value={promoForm.data.value}
                                                onChange={(e) => promoForm.setData('value', e.target.value)}
                                                placeholder={promoForm.data.type === 'percentage' ? '10' : '5000'}
                                                className={inputCls} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">Minimal Pembelian (Rp)</label>
                                        <input type="number" min="0" value={promoForm.data.min_purchase}
                                            onChange={(e) => promoForm.setData('min_purchase', e.target.value)}
                                            placeholder="30000" className={inputCls} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">Tanggal Mulai</label>
                                            <input type="date" required value={promoForm.data.start_date}
                                                onChange={(e) => promoForm.setData('start_date', e.target.value)}
                                                className={inputCls} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">Tanggal Selesai</label>
                                            <input type="date" required value={promoForm.data.end_date}
                                                onChange={(e) => promoForm.setData('end_date', e.target.value)}
                                                className={inputCls} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 pt-1">
                                        <input type="checkbox" id="promoActiveToggle"
                                            checked={promoForm.data.is_active}
                                            onChange={(e) => promoForm.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 accent-brand-secondary rounded border-brand-light" />
                                        <label htmlFor="promoActiveToggle" className="text-xs font-semibold text-brand-primary/70 cursor-pointer">
                                            Aktifkan promosi ini segera
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-brand-light">
                                        <button type="submit" disabled={promoForm.processing}
                                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white text-xs font-bold shadow-lg shadow-brand-primary/30 transition-all active:scale-[0.98]">
                                            {isEditModalOpen ? 'Simpan Perubahan' : 'Terapkan Promosi'}
                                        </button>
                                        <button type="button"
                                            onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                            className="h-11 px-5 rounded-xl border border-brand-light bg-white text-brand-primary text-xs font-bold hover:bg-brand-light hover:text-brand-dark transition-colors rounded-xl">
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* FORM BUNDLE */}
                            {activeFormType === 'bundle' && (
                                <form onSubmit={handleBundleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">
                                            Nama Bundel <span className="text-rose-500">*</span>
                                        </label>
                                        <input type="text" required value={bundleForm.data.name}
                                            onChange={(e) => bundleForm.setData('name', e.target.value)}
                                            placeholder="Contoh: Weekend Bundle Croissant + Kopi"
                                            className={inputCls} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">Deskripsi Kampanye</label>
                                        <textarea rows={2} value={bundleForm.data.description}
                                            onChange={(e) => bundleForm.setData('description', e.target.value)}
                                            placeholder="Tuliskan info bundel..."
                                            className={`${inputCls} resize-none`} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-brand-primary capitalize tracking-wide mb-1.5">
                                            Harga Bundel Spesial (Rp) <span className="text-rose-500">*</span>
                                        </label>
                                        <input type="number" required min="0" value={bundleForm.data.price}
                                            onChange={(e) => bundleForm.setData('price', e.target.value)}
                                            placeholder="45000" className={inputCls} />
                                    </div>

                                    {/* Menu Selector */}
                                    <div className="bg-brand-light/20 border border-brand-light p-4 rounded-xl space-y-3">
                                        <p className="text-xs font-extrabold text-brand-dark">Menu yang Termasuk dalam Paket</p>
                                        <div className="flex gap-2">
                                            <select value={selectedMenuToAdd}
                                                onChange={(e) => setSelectedMenuToAdd(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-xl border border-brand-light text-xs font-semibold text-brand-dark bg-white focus:outline-none focus:border-brand-secondary">
                                                <option value="">Pilih Menu...</option>
                                                {menus.map((m) => (
                                                    <option key={m.id} value={m.id}>{m.name} (Rp {formatRp(m.price)})</option>
                                                ))}
                                            </select>
                                            <input type="number" min="1" value={quantityToAdd}
                                                onChange={(e) => setQuantityToAdd(parseInt(e.target.value) || 1)}
                                                className="w-16 px-3 py-2 rounded-xl border border-brand-light text-xs font-bold text-brand-dark text-center focus:outline-none focus:border-brand-secondary" />
                                            <button type="button" onClick={handleAddMenuToBundle}
                                                className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-xs active:scale-[0.98] transition-all shadow-sm">
                                                Tambah
                                            </button>
                                        </div>
                                        {bundleForm.data.menus.length > 0 ? (
                                            <div className="divide-y divide-brand-light max-h-32 overflow-y-auto">
                                                {bundleForm.data.menus.map((menu) => (
                                                    <div key={menu.id} className="flex justify-between items-center py-2 text-xs">
                                                        <span className="font-bold text-brand-dark">{menu.qty}x {menu.name}</span>
                                                        <button type="button" onClick={() => handleRemoveMenuFromBundle(menu.id)}
                                                            className="text-rose-500 hover:text-rose-700 font-extrabold text-[10px]">
                                                            Hapus
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-brand-primary/50 font-medium text-center py-2">
                                                Belum ada menu terpilih.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2.5 pt-1">
                                        <input type="checkbox" id="bundleActiveToggle"
                                            checked={bundleForm.data.is_active}
                                            onChange={(e) => bundleForm.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 accent-brand-secondary rounded border-brand-light" />
                                        <label htmlFor="bundleActiveToggle" className="text-xs font-semibold text-brand-primary/70 cursor-pointer">
                                            Aktifkan bundel ini segera
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-brand-light">
                                        <button type="submit" disabled={bundleForm.processing}
                                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white text-xs font-bold shadow-lg shadow-brand-primary/30 transition-all active:scale-[0.98]">
                                            {isEditModalOpen ? 'Simpan Perubahan' : 'Terapkan Bundel'}
                                        </button>
                                        <button type="button"
                                            onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                            className="h-11 px-5 rounded-xl border border-brand-light bg-white text-brand-primary text-xs font-bold hover:bg-brand-light hover:text-brand-dark transition-colors rounded-xl">
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── TOAST ── */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-[100] bg-white border border-brand-light rounded-2xl p-4 shadow-xl flex items-center gap-3 max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-circle-linear" className="text-xl text-brand-secondary" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-extrabold text-brand-dark">Sukses!</p>
                        <p className="text-[10px] text-brand-primary font-semibold truncate">{toastMessage}</p>
                    </div>
                    <button onClick={() => setShowToast(false)}
                        className="text-brand-primary/40 hover:text-brand-dark text-xs font-bold flex-shrink-0">
                        <Icon icon="solar:close-circle-linear" className="text-lg" />
                    </button>
                </div>
            )}
        </>
    );
}

// PromotionsIndex.layout = (page) => <>{page}</>;