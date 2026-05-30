import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Icon } from '@iconify/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function PromotionsIndex({
    totalRedemptions,
    estimasiRevenue,
    kampanyeAktif,
    efisiensiPromo,
    campaigns,
    highlightCampaign,
    menus,
    chartLabels,
    chartData,
}) {
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

    const handlePromoSubmit = (e) => {
        e.preventDefault();
        if (isEditModalOpen && editingCampaign) {
            router.put(route('promotions.update', editingCampaign.id), promoForm.data, {
                onSuccess: () => { setIsEditModalOpen(false); showNotification('Promosi berhasil diperbarui!'); },
            });
        } else {
            router.post(route('promotions.store'), promoForm.data, {
                onSuccess: () => { setIsCreateModalOpen(false); promoForm.reset(); showNotification('Promosi baru berhasil ditambahkan!'); },
            });
        }
    };

    const handleBundleSubmit = (e) => {
        e.preventDefault();
        const formattedMenus = bundleForm.data.menus.map((m) => ({ id: m.id, qty: m.qty }));
        const submitData = { ...bundleForm.data, menus: formattedMenus };
        if (isEditModalOpen && editingCampaign) {
            router.put(route('bundles.update', editingCampaign.id), submitData, {
                onSuccess: () => { setIsEditModalOpen(false); showNotification('Bundle berhasil diperbarui!'); },
            });
        } else {
            router.post(route('bundles.store'), submitData, {
                onSuccess: () => { setIsCreateModalOpen(false); bundleForm.reset(); showNotification('Bundle baru berhasil ditambahkan!'); },
            });
        }
    };

    const showNotification = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleDeleteCampaign = (campaign) => {
        const routeName = campaign.type === 'bundle' ? 'bundles.destroy' : 'promotions.destroy';
        if (confirm(`Apakah Anda yakin ingin menghapus ${campaign.name}?`)) {
            router.delete(route(routeName, campaign.id), {
                onSuccess: () => { setActiveDropdownId(null); showNotification(`${campaign.name} berhasil dihapus!`); },
            });
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
            borderColor: '#443dff',
            backgroundColor: (context) => {
                const chart = context.chart;
                const ctx = chart?.ctx;
                if (!ctx) return 'rgba(68,61,255,0.08)';
                const gradient = ctx.createLinearGradient(0, 0, 0, 220);
                gradient.addColorStop(0, 'rgba(68,61,255,0.18)');
                gradient.addColorStop(1, 'rgba(68,61,255,0.00)');
                return gradient;
            },
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#443dff',
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
                backgroundColor: '#050316',
                titleColor: '#dddbff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 10,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#2f27ce', font: { weight: '700', size: 11 } },
            },
            y: {
                border: { dash: [4, 4] },
                grid: { color: 'rgba(221,219,255,0.4)' },
                ticks: { color: '#2f27ce', font: { size: 10, weight: '600' } },
            },
        },
    };

    // Input class reusable
    const inputCls = "w-full px-4 py-3 rounded-xl border border-[#dddbff] focus:border-[#443dff] focus:ring-2 focus:ring-[#dddbff] outline-none text-xs font-semibold text-[#050316] placeholder:text-[#2f27ce]/40 transition-all bg-[#fbfbfe] focus:bg-white";

    return (
        <>
            <Head title="Promosi & Bundling" />

            <div className="flex-1 overflow-y-auto bg-[#fbfbfe] min-h-screen px-6 py-6 space-y-6">

                {/* ── HEADER ── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Promosi & Bundling
                        </h1>
                        <p className="text-sm font-medium text-[#2f27ce] mt-1">
                            Kelola kampanye pemasaran dan tingkatkan penjualan dengan penawaran menarik.
                        </p>
                    </div>
                    <button
                        onClick={() => { promoForm.reset(); bundleForm.reset(); setIsCreateModalOpen(true); }}
                        className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98] text-[13px] self-start"
                    >
                        <Icon icon="solar:add-circle-bold" className="text-lg" />
                        Buat Promo Baru
                    </button>
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1 */}
                    <div className="bg-white border border-[#dddbff] p-5 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                            <Icon icon="solar:ticket-bold-duotone" className="text-[22px] text-[#443dff]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Total Redemptions</p>
                            <p className="text-2xl font-extrabold text-[#050316] leading-tight">{formatRp(totalRedemptions)}</p>
                            <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">+12% <span className="font-medium text-[#2f27ce]/60">bulan ini</span></p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-[#dddbff] p-5 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                            <Icon icon="solar:graph-up-bold-duotone" className="text-[22px] text-[#443dff]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Estimasi Revenue</p>
                            <p className="text-xl font-extrabold text-[#050316] leading-tight">
                                Rp {(estimasiRevenue / 1000000).toFixed(2)}M
                            </p>
                            <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">+8.4% <span className="font-medium text-[#2f27ce]/60">vs bulan lalu</span></p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-[#dddbff] p-5 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                            <Icon icon="solar:tag-bold-duotone" className="text-[22px] text-[#443dff]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Kampanye Aktif</p>
                            <p className="text-2xl font-extrabold text-[#050316] leading-tight">{kampanyeAktif}</p>
                            <p className="text-[10px] font-extrabold text-amber-500 mt-0.5">2 akan berakhir</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white border border-[#dddbff] p-5 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                            <Icon icon="solar:star-bold-duotone" className="text-[22px] text-[#443dff]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Efisiensi Promo</p>
                            <p className="text-2xl font-extrabold text-[#050316] leading-tight">{efisiensiPromo}%</p>
                            <p className="text-[10px] font-extrabold text-emerald-600 mt-0.5">+1.2% <span className="font-medium text-[#2f27ce]/60">peningkatan</span></p>
                        </div>
                    </div>
                </div>

                {/* ── SPOTLIGHT / HIGHLIGHT CAMPAIGN ── */}
                <div className="bg-white border border-[#dddbff] rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#dddbff]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:graph-up-bold-duotone" className="text-lg text-[#443dff]" />
                                <span className="text-[10px] font-extrabold text-[#443dff] uppercase tracking-widest">Bundel Spesial</span>
                            </div>
                            <span className="text-[10px] font-extrabold bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white px-3 py-1 rounded-full tracking-wide">
                                Kampanye Utama
                            </span>
                        </div>

                        <h2 className="text-xl font-extrabold text-[#050316] tracking-tight">
                            {highlightCampaign?.name || 'Weekend Bundle'}
                        </h2>
                        <p className="text-xs font-medium text-[#2f27ce] mt-1.5 max-w-xl leading-relaxed">
                            {highlightCampaign?.description || 'Dapatkan diskon 10% untuk setiap pembelian kombinasi 1 Croissant dan 1 Kopi varian apapun di akhir pekan (Sabtu & Minggu).'}
                        </p>

                        <div className="grid grid-cols-3 gap-6 max-w-lg mt-5 pt-5 border-t border-[#dddbff]">
                            <div>
                                <p className="text-[10px] font-extrabold text-[#2f27ce]/50 uppercase tracking-widest mb-1">Diskon</p>
                                <p className="text-lg font-extrabold text-[#443dff]">
                                    {highlightCampaign?.discount_display || 'Diskon 10%'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-[#2f27ce]/50 uppercase tracking-widest mb-1">Total Pendapatan</p>
                                <p className="text-lg font-extrabold text-[#050316]">
                                    Rp {formatRp(highlightCampaign?.revenue || 4260000)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-[#2f27ce]/50 uppercase tracking-widest mb-1">Penebusan</p>
                                <p className="text-lg font-extrabold text-[#050316]">
                                    {highlightCampaign?.redemptions || 142} <span className="text-xs text-[#2f27ce]/50 font-medium">Kali</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => highlightCampaign && handleEditCampaignClick(highlightCampaign)}
                                className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-sm shadow-[#443dff]/20 transition-all active:scale-[0.98]"
                            >
                                Kelola Bundel
                            </button>
                            <button className="px-5 py-2.5 rounded-xl border border-[#dddbff] text-[#2f27ce] bg-white font-extrabold text-xs hover:bg-[#dddbff]/50 hover:text-[#050316] transition-all active:scale-[0.98]">
                                Lihat Analitik
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── DAFTAR KAMPANYE ── */}
                <div className="bg-white border border-[#dddbff] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                        <div>
                            <h3 className="text-base font-extrabold text-[#050316] tracking-tight">Daftar Kampanye</h3>
                            <p className="text-xs font-medium text-[#2f27ce] mt-0.5">Semua promosi yang terdaftar dalam sistem.</p>
                        </div>
                        {/* Filter tabs */}
                        <div className="flex items-center gap-2">
                            {['Semua', 'Aktif', 'Terjadwal'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all
                                        ${activeTab === tab
                                            ? 'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm'
                                            : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50 hover:text-[#050316]'
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
                                <tr className="text-[10px] text-[#2f27ce] border-b border-[#dddbff] uppercase tracking-wider">
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
                                        className="border-b border-[#dddbff]/50 last:border-0 hover:bg-[#dddbff]/10 transition-colors">
                                        <td className="py-4 pr-3">
                                            <p className="font-extrabold text-[#050316]">{camp.name}</p>
                                            {camp.description && (
                                                <p className="text-[10px] text-[#2f27ce]/60 mt-0.5 truncate max-w-[200px]">{camp.description}</p>
                                            )}
                                            {camp.menus?.length > 0 && (
                                                <p className="text-[10px] text-[#443dff] mt-0.5">
                                                    {camp.menus.map((m) => `${m.qty}x ${m.name}`).join(' + ')}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-4 font-extrabold text-[#443dff]">{camp.discount_display}</td>
                                        <td className="py-4 text-xs text-[#2f27ce]/70 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Icon icon="solar:calendar-linear" className="text-sm text-[#443dff]" />
                                                {camp.period_display}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-6">
                                            <div className="flex items-center gap-3">
                                                <span className="font-extrabold text-[#050316] w-8 text-right text-xs">{camp.redemptions}</span>
                                                <div className="flex-1 h-1.5 bg-[#dddbff]/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#2f27ce] to-[#443dff] rounded-full"
                                                        style={{ width: `${Math.min(100, (camp.redemptions / 540) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 font-extrabold text-[#050316] text-xs">
                                            Rp {formatRp(camp.revenue)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg border tracking-wide
                                                ${camp.status === 'Aktif'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    : camp.status === 'Terjadwal'
                                                        ? 'bg-[#dddbff] text-[#2f27ce] border-[#c4c0ff]'
                                                        : 'bg-[#dddbff]/40 text-[#2f27ce]/60 border-[#dddbff]'
                                                }`}>
                                                {camp.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveDropdownId(
                                                    activeDropdownId === `${camp.type}-${camp.id}` ? null : `${camp.type}-${camp.id}`
                                                )}
                                                className="text-[#2f27ce]/40 hover:text-[#443dff] w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#dddbff]/50 transition-all ml-auto"
                                            >
                                                <Icon icon="solar:menu-dots-bold" className="text-base" />
                                            </button>
                                            {activeDropdownId === `${camp.type}-${camp.id}` && (
                                                <div className="absolute right-0 mt-1 w-40 bg-white border border-[#dddbff] rounded-xl shadow-lg z-10 py-1.5 text-left">
                                                    <button
                                                        onClick={() => handleEditCampaignClick(camp)}
                                                        className="w-full px-4 py-2 hover:bg-[#dddbff]/30 text-xs font-bold text-[#050316] flex items-center gap-2 transition-colors"
                                                    >
                                                        <Icon icon="solar:pen-linear" className="text-[#443dff]" />
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

                    <div className="flex justify-between items-center mt-5 pt-5 border-t border-[#dddbff]/50">
                        <span className="text-[11px] font-bold text-[#2f27ce]/60">
                            Menampilkan {filteredCampaigns.length} dari {campaigns.length} promosi
                        </span>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-[#dddbff] rounded-xl bg-white text-xs font-extrabold text-[#2f27ce]/40 cursor-not-allowed">
                                Sebelumnya
                            </button>
                            <button className="px-4 py-2 border border-[#dddbff] rounded-xl bg-white text-xs font-extrabold text-[#2f27ce] hover:bg-[#dddbff]/50 hover:text-[#050316] transition-colors">
                                Berikutnya
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── CHART TREN ── */}
                <div className="bg-white border border-[#dddbff] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center">
                                <Icon icon="solar:graph-up-bold-duotone" className="text-lg text-[#443dff]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-[#050316] tracking-tight">Tren Penebusan Mingguan</h3>
                                <p className="text-[10px] font-medium text-[#2f27ce] mt-0.5">
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
                    <div className="flex items-center justify-center gap-6 mt-4 text-[11px] font-bold text-[#2f27ce]">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-0.5 bg-[#443dff] rounded-full inline-block"></span>
                            Jumlah Penebusan
                        </span>
                    </div>
                </div>

            </div>

            {/* ── MODAL CREATE / EDIT ── */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-[#050316]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-[#dddbff] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

                        {/* Modal Header */}
                        {!isEditModalOpen ? (
                            <div className="flex border-b border-[#dddbff]">
                                {[
                                    { key: 'promotion', label: 'Diskon Promosi', icon: 'solar:ticket-sale-linear' },
                                    { key: 'bundle',    label: 'Bundling Menu',  icon: 'solar:box-linear' },
                                ].map((t) => (
                                    <button
                                        key={t.key}
                                        onClick={() => setActiveFormType(t.key)}
                                        className={`flex-1 py-4 text-sm font-extrabold transition-all flex items-center justify-center gap-2
                                            ${activeFormType === t.key
                                                ? 'border-b-2 border-[#443dff] text-[#443dff] bg-[#dddbff]/20'
                                                : 'text-[#2f27ce]/50 hover:bg-[#dddbff]/20'
                                            }`}
                                    >
                                        <Icon icon={t.icon} className="text-base" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-4 border-b border-[#dddbff] flex justify-between items-center">
                                <h3 className="text-base font-extrabold text-[#050316]">
                                    Ubah {activeFormType === 'promotion' ? 'Promosi' : 'Bundling'}
                                </h3>
                                <button
                                    onClick={() => { setIsEditModalOpen(false); setEditingCampaign(null); }}
                                    className="w-8 h-8 rounded-xl bg-[#dddbff]/50 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-[#2f27ce] transition-colors"
                                >
                                    <Icon icon="solar:close-circle-bold" className="text-lg" />
                                </button>
                            </div>
                        )}

                        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">

                            {/* FORM PROMOSI */}
                            {activeFormType === 'promotion' && (
                                <form onSubmit={handlePromoSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">
                                            Nama Promo <span className="text-rose-500">*</span>
                                        </label>
                                        <input type="text" required value={promoForm.data.name}
                                            onChange={(e) => promoForm.setData('name', e.target.value)}
                                            placeholder="Contoh: Diskon Kopi Senja"
                                            className={inputCls} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">Tipe Potongan</label>
                                            <select value={promoForm.data.type}
                                                onChange={(e) => promoForm.setData('type', e.target.value)}
                                                className={inputCls}>
                                                <option value="percentage">Persentase (%)</option>
                                                <option value="fixed">Nominal Tetap (Rp)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">Nilai Potongan</label>
                                            <input type="number" required min="0" value={promoForm.data.value}
                                                onChange={(e) => promoForm.setData('value', e.target.value)}
                                                placeholder={promoForm.data.type === 'percentage' ? '10' : '5000'}
                                                className={inputCls} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">Minimal Pembelian (Rp)</label>
                                        <input type="number" min="0" value={promoForm.data.min_purchase}
                                            onChange={(e) => promoForm.setData('min_purchase', e.target.value)}
                                            placeholder="30000" className={inputCls} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">Tanggal Mulai</label>
                                            <input type="date" required value={promoForm.data.start_date}
                                                onChange={(e) => promoForm.setData('start_date', e.target.value)}
                                                className={inputCls} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">Tanggal Selesai</label>
                                            <input type="date" required value={promoForm.data.end_date}
                                                onChange={(e) => promoForm.setData('end_date', e.target.value)}
                                                className={inputCls} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 pt-1">
                                        <input type="checkbox" id="promoActiveToggle"
                                            checked={promoForm.data.is_active}
                                            onChange={(e) => promoForm.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 accent-[#443dff] rounded border-[#dddbff]" />
                                        <label htmlFor="promoActiveToggle" className="text-xs font-semibold text-[#2f27ce]/70 cursor-pointer">
                                            Aktifkan promosi ini segera
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-[#dddbff]">
                                        <button type="submit" disabled={promoForm.processing}
                                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white text-xs font-extrabold transition-all shadow-sm active:scale-[0.98]">
                                            {isEditModalOpen ? 'Simpan Perubahan' : 'Terapkan Promosi'}
                                        </button>
                                        <button type="button"
                                            onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                            className="h-11 px-5 rounded-xl border border-[#dddbff] text-[#2f27ce] text-xs font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* FORM BUNDLE */}
                            {activeFormType === 'bundle' && (
                                <form onSubmit={handleBundleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">
                                            Nama Bundel <span className="text-rose-500">*</span>
                                        </label>
                                        <input type="text" required value={bundleForm.data.name}
                                            onChange={(e) => bundleForm.setData('name', e.target.value)}
                                            placeholder="Contoh: Weekend Bundle Croissant + Kopi"
                                            className={inputCls} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">Deskripsi Kampanye</label>
                                        <textarea rows={2} value={bundleForm.data.description}
                                            onChange={(e) => bundleForm.setData('description', e.target.value)}
                                            placeholder="Tuliskan info bundel..."
                                            className={`${inputCls} resize-none`} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-[#2f27ce] uppercase tracking-wide mb-1.5">
                                            Harga Bundel Spesial (Rp) <span className="text-rose-500">*</span>
                                        </label>
                                        <input type="number" required min="0" value={bundleForm.data.price}
                                            onChange={(e) => bundleForm.setData('price', e.target.value)}
                                            placeholder="45000" className={inputCls} />
                                    </div>

                                    {/* Menu Selector */}
                                    <div className="bg-[#dddbff]/20 border border-[#dddbff] p-4 rounded-xl space-y-3">
                                        <p className="text-xs font-extrabold text-[#050316]">Menu yang Termasuk dalam Paket</p>
                                        <div className="flex gap-2">
                                            <select value={selectedMenuToAdd}
                                                onChange={(e) => setSelectedMenuToAdd(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-xl border border-[#dddbff] text-xs font-semibold text-[#050316] bg-white focus:outline-none focus:border-[#443dff]">
                                                <option value="">Pilih Menu...</option>
                                                {menus.map((m) => (
                                                    <option key={m.id} value={m.id}>{m.name} (Rp {formatRp(m.price)})</option>
                                                ))}
                                            </select>
                                            <input type="number" min="1" value={quantityToAdd}
                                                onChange={(e) => setQuantityToAdd(parseInt(e.target.value) || 1)}
                                                className="w-16 px-3 py-2 rounded-xl border border-[#dddbff] text-xs font-bold text-[#050316] text-center focus:outline-none focus:border-[#443dff]" />
                                            <button type="button" onClick={handleAddMenuToBundle}
                                                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white font-extrabold text-xs active:scale-95 transition-all">
                                                Tambah
                                            </button>
                                        </div>
                                        {bundleForm.data.menus.length > 0 ? (
                                            <div className="divide-y divide-[#dddbff] max-h-32 overflow-y-auto">
                                                {bundleForm.data.menus.map((menu) => (
                                                    <div key={menu.id} className="flex justify-between items-center py-2 text-xs">
                                                        <span className="font-bold text-[#050316]">{menu.qty}x {menu.name}</span>
                                                        <button type="button" onClick={() => handleRemoveMenuFromBundle(menu.id)}
                                                            className="text-rose-500 hover:text-rose-700 font-extrabold text-[10px]">
                                                            Hapus
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-[#2f27ce]/50 font-medium text-center py-2">
                                                Belum ada menu terpilih.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2.5 pt-1">
                                        <input type="checkbox" id="bundleActiveToggle"
                                            checked={bundleForm.data.is_active}
                                            onChange={(e) => bundleForm.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 accent-[#443dff] rounded border-[#dddbff]" />
                                        <label htmlFor="bundleActiveToggle" className="text-xs font-semibold text-[#2f27ce]/70 cursor-pointer">
                                            Aktifkan bundel ini segera
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-[#dddbff]">
                                        <button type="submit" disabled={bundleForm.processing}
                                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white text-xs font-extrabold transition-all shadow-sm active:scale-[0.98]">
                                            {isEditModalOpen ? 'Simpan Perubahan' : 'Terapkan Bundel'}
                                        </button>
                                        <button type="button"
                                            onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                            className="h-11 px-5 rounded-xl border border-[#dddbff] text-[#2f27ce] text-xs font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
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
                <div className="fixed bottom-6 right-6 z-[100] bg-white border border-[#dddbff] rounded-2xl p-4 shadow-xl flex items-center gap-3 max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-circle-bold-duotone" className="text-xl text-[#443dff]" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-extrabold text-[#050316]">Sukses!</p>
                        <p className="text-[10px] text-[#2f27ce] font-semibold truncate">{toastMessage}</p>
                    </div>
                    <button onClick={() => setShowToast(false)}
                        className="text-[#2f27ce]/40 hover:text-[#050316] text-xs font-bold flex-shrink-0">
                        <Icon icon="solar:close-circle-bold" className="text-lg" />
                    </button>
                </div>
            )}
        </>
    );
}

PromotionsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;