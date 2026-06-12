import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';
import TargetModal from '@/Components/TargetModal';
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
// Jika Anda menggunakan package iconify untuk react: npm install @iconify/react
import { Icon } from '@iconify/react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const getBrandColor = (varName, fallback, opacity = 1) => {
    if (typeof window === 'undefined') return `rgba(${fallback}, ${opacity})`;
    const rootStyle = getComputedStyle(document.documentElement);
    const val = rootStyle.getPropertyValue(varName).trim();
    if (!val) return `rgba(${fallback}, ${opacity})`;
    const rgbStr = val.includes(' ') ? val.split(' ').join(', ') : val;
    return `rgba(${rgbStr}, ${opacity})`;
};

// Anda dapat mengganti ini dengan komponen Layout standar Anda

export default function TargetPerforma({
    target = null,
    targetValue = 0,
    currentValue = 0,
    progress = 0,
    remaining = 0,
    lastUpdated = '-',
    period = 'harian',
    estimasi = 0,
    trendEstimasi = 0,
    avgHarian = 0,
    history = { labels: [], actuals: [], targets: [] },  // ← ini paling penting
    staffPerformance = [],                                // ← ini juga
    maxStaff = 1,
    paymentSummary = '',
    peakLabel = '-',
    promoAktif = '-',
}) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [savedLabel, setSavedLabel] = useState('');

    const handleSaveSuccess = (label) => {
        setSavedLabel(label);
        setShowSuccessToast(true);
        setTimeout(() => {
            setShowSuccessToast(false);
        }, 5000);
    };

    const handleUndo = async () => {
        if (target?.id) {
            try {
                await client.delete(`/targets-goals/${target.id}`);
                setShowSuccessToast(false);
                if (window.routerReload) window.routerReload();
            } catch (err) {
                console.error("Gagal menghapus target:", err);
            }
        } else {
            setShowSuccessToast(false);
        }
    };

    // Format Rupiah helper
    const formatRp = (value) => new Intl.NumberFormat('id-ID').format(value);

    // Data periode untuk tab
    const periods = [
        { val: 'harian', label: 'Harian' },
        { val: 'mingguan', label: 'Mingguan' },
        { val: 'bulanan', label: 'Bulanan' },
    ];

    // Konfigurasi Chart.js
    const chartData = {
        labels: history.labels,
        datasets: [
            {
                label: 'Pencapaian Riil',
                data: history.actuals,
                borderColor: getBrandColor('--color-brand-secondary', '68, 61, 255'),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const ctx = chart?.ctx;
                    if (!ctx) return getBrandColor('--color-brand-secondary', '68, 61, 255', 0.08);
                    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
                    gradient.addColorStop(0, getBrandColor('--color-brand-secondary', '68, 61, 255', 0.18));
                    gradient.addColorStop(1, getBrandColor('--color-brand-secondary', '68, 61, 255', 0.00));
                    return gradient;
                },
                borderWidth: 2.5,
                pointRadius: 3,
                pointBackgroundColor: getBrandColor('--color-brand-secondary', '68, 61, 255'),
                pointBorderColor: '#fff',
                pointBorderWidth: 1.5,
                tension: 0.45,
                fill: true,
            },
            {
                label: 'Target Penjualan',
                data: history.targets,
                borderColor: getBrandColor('--color-brand-dark', '5, 3, 22'),
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderDash: [6, 4],
                pointRadius: 0,
                tension: 0,
                fill: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: getBrandColor('--color-brand-dark', '5, 3, 22'),
                titleColor: getBrandColor('--color-brand-light', '221, 219, 255'),
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 10,
                callbacks: {
                    label: (ctx) => ` Rp ${ctx.parsed.y.toLocaleString('id-ID')}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: getBrandColor('--color-brand-primary', '47, 39, 206'), font: { size: 10, weight: '700' }, maxRotation: 0, maxTicksLimit: 10 },
            },
            y: {
                grid: { color: getBrandColor('--color-brand-light', '221, 219, 255', 0.33), drawBorder: false },
                ticks: {
                    color: getBrandColor('--color-brand-primary', '47, 39, 206'),
                    font: { size: 10, weight: '700' },
                    callback: (val) => `Rp ${(val / 1000000).toFixed(0)}jt`,
                },
            },
        },
    };

    return (
        <>
            <Head title="Target & Performa" />

            <div className="space-y-6 p-4 md:p-6 bg-brand-bg min-h-screen">

                {/* ====== TOP HEADER ====== */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Target & Performa
                        </h1>
                        <p className="text-xs md:text-sm text-brand-primary/60 font-medium mt-1">
                            Pantau pencapaian KPI harian dan riwayat pertumbuhan outlet Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {periods.map((p) => (
                            <Link
                                key={p.val}
                                to={`/targets-goals?period=${p.val}`}
                                className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all duration-200 active:scale-[0.98] ${period === p.val
                                    ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20'
                                    : 'bg-white text-brand-primary border-brand-light hover:bg-brand-light hover:text-brand-dark'
                                    }`}
                            >
                                {p.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ====== TARGET HARI INI — HERO CARD ====== */}
                <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Icon icon="solar:target-linear" className="text-xl text-brand-secondary" />
                            <span className="text-sm font-extrabold text-brand-secondary capitalize tracking-widest">
                                Target {period.charAt(0).toUpperCase() + period.slice(1)}
                            </span>
                            {target?.label && (
                                <span className="text-[10px] font-bold text-brand-primary/60 bg-brand-light/50 px-2 py-0.5 rounded-md border border-brand-light">
                                    {target.label}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div>
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary tracking-tight">
                                    Rp {formatRp(targetValue)}
                                </p>
                                <p className="text-xs text-brand-primary/60 font-medium mt-1">
                                    Status pembaruan terakhir: {lastUpdated}
                                </p>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest mb-1">Tercapai</p>
                                        <p className="text-2xl font-black text-brand-secondary">
                                            Rp {formatRp(currentValue)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest mb-1">Progress</p>
                                        <p className="text-2xl font-extrabold text-brand-dark">{progress}%</p>
                                    </div>
                                </div>

                                <div className="w-full bg-brand-light/50 h-3 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between text-[10px] font-bold text-brand-primary/60">
                                    <span>Target Info</span>
                                    <span>Sisa: Rp {formatRp(remaining)}</span>
                                    <span>Target: Rp {formatRp(targetValue)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-brand-light/60">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-2 shadow-lg shadow-brand-primary/30 active:scale-[0.98]"
                            >
                                <Icon icon="solar:pen-linear" className="text-sm" />
                                {target ? 'Ubah Target' : 'Set Target'}
                            </button>
                            <Link
                                to="/targets-goals/aov"
                                className="px-5 py-2.5 text-xs font-bold text-brand-primary bg-white border border-brand-light rounded-xl hover:bg-brand-light hover:text-brand-dark transition-all duration-200 active:scale-[0.98]"
                            >
                                Lihat Detail AOV
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ====== STAT CARDS ====== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest leading-tight">Sisa Target</p>
                            <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                <Icon icon="solar:wallet-linear" className="text-lg text-brand-secondary" />
                            </div>
                        </div>
                        <p className="text-xl font-black text-brand-secondary leading-tight">
                            Rp {formatRp(remaining)}
                        </p>
                        <p className="text-[11px] font-medium text-brand-primary/70 mt-1.5">Perlu dicapai hari ini</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest leading-tight">Estimasi Penutupan</p>
                            <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                <Icon icon="solar:graph-up-linear" className="text-lg text-brand-secondary" />
                            </div>
                        </div>
                        <p className="text-xl font-black text-brand-secondary leading-tight">
                            Rp {formatRp(estimasi)}
                        </p>
                        <p className={`text-[11px] font-bold mt-1.5 ${trendEstimasi >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {trendEstimasi >= 0 ? '↑' : '↓'} {Math.abs(trendEstimasi)}%
                            <span className="text-brand-primary/60 font-normal ml-1">Berdasarkan tren saat ini</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest leading-tight">Rata-rata Harian</p>
                            <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                <Icon icon="solar:chart-2-linear" className="text-lg text-brand-secondary" />
                            </div>
                        </div>
                        <p className="text-xl font-black text-brand-secondary leading-tight">
                            Rp {formatRp(avgHarian)}
                        </p>
                        <p className="text-[11px] font-bold text-emerald-500 mt-1.5">30 hari terakhir</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-brand-primary capitalize tracking-widest leading-tight">Update Terakhir</p>
                            <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm">
                                <Icon icon="solar:calendar-linear" className="text-lg text-brand-secondary" />
                            </div>
                        </div>
                        <p className="text-xl font-black text-brand-dark leading-tight">Live</p>
                        <p className="text-[11px] font-medium text-brand-primary/70 mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Sinkronisasi otomatis aktif
                        </p>
                    </div>
                </div>

                {/* ====== MAIN GRID ====== */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* CHART */}
                    <div className="xl:col-span-8 bg-white rounded-2xl border border-brand-light shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                            <div>
                                <h3 className="text-base font-extrabold text-brand-dark tracking-tight">Riwayat Pencapaian (30 Hari Terakhir)</h3>
                                <p className="text-xs text-brand-primary font-medium mt-0.5">Perbandingan antara target harian vs realisasi penjualan</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-dark bg-brand-light/50 border border-brand-light px-3 py-1.5 rounded-lg flex-shrink-0">
                                <span className="w-2 h-2 bg-brand-secondary rounded-full"></span> Penjualan Real
                            </div>
                        </div>

                        <div className="relative w-full h-[260px]">
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        <div className="flex items-center gap-6 mt-5 text-[11px] font-bold text-brand-primary justify-center">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-brand-secondary rounded-full inline-block"></span> Pencapaian Riil
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-brand-dark rounded-full inline-block border-t-2 border-dashed border-brand-dark bg-transparent"></span> Target Penjualan
                            </span>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="xl:col-span-4 space-y-5">
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5">
                            <h3 className="text-xs font-bold text-gray-400 capitalize tracking-wider flex items-center gap-2 mb-4">
                                <Icon icon="solar:graph-up-linear" className="text-brand-primary text-lg" />
                                Wawasan Performa
                            </h3>

                            <div className="mb-4 pb-4 border-b border-brand-light">
                                <p className="text-xs font-extrabold text-brand-dark mb-1">Jam Sibuk Diprediksi</p>
                                <p className="text-[11px] font-medium text-brand-primary leading-relaxed">
                                    Pukul <span className="font-extrabold text-brand-dark">{peakLabel}</span> biasanya menjadi jam tersibuk berdasarkan data 7 hari terakhir.
                                </p>
                                {promoAktif !== '-' && (
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-bold text-brand-secondary bg-brand-light/50 px-2 py-0.5 rounded-md border border-brand-light">Promo Aktif</span>
                                        <span className="text-[10px] font-bold text-brand-primary">"{promoAktif}"</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs font-extrabold text-brand-dark mb-3">Pencapaian Staf</p>
                                <div className="space-y-3">
                                    {staffPerformance.length > 0 ? (
                                        staffPerformance.map((staff, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[11px] font-bold text-brand-dark">
                                                        {staff.name} {staff.role && <span className="font-normal text-brand-primary/60">({staff.role})</span>}
                                                    </span>
                                                    <span className="text-[11px] font-extrabold text-brand-dark">
                                                        Rp {formatRp(staff.total / 1000)}k
                                                    </span>
                                                </div>
                                                <div className="w-full bg-brand-light/50 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.round((staff.total / maxStaff) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[11px] text-brand-primary/60 italic">Belum ada data staf hari ini.</p>
                                    )}
                                </div>
                                <Link
                                    to="/dashboard"
                                    className="block w-full mt-4 py-2.5 text-xs font-bold text-brand-primary bg-white border border-brand-light rounded-xl hover:bg-brand-light hover:text-brand-dark text-center transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5"
                                >
                                    Lihat Laporan Lengkap
                                    <Icon icon="solar:arrow-right-linear" className="text-sm" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon icon="solar:card-linear" className="text-xl text-brand-secondary" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-primary/60 capitalize tracking-wide mb-1">Metode Pembayaran Terpopuler</p>
                                <p className="text-xs text-brand-dark font-medium mt-1 leading-relaxed">
                                    {paymentSummary || 'Belum ada transaksi hari ini.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ====== SET TARGET MODAL ====== */}
            <TargetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentTarget={target}
                currentValue={currentValue}
                avgHarian={avgHarian}
                onSaveSuccess={handleSaveSuccess}
                defaultPeriod={period}
            />

            {/* ====== CUSTOM TOAST NOTIFICATION (Mockup Style) ====== */}
            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 z-[100] bg-white border border-brand-light rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-circle-linear" className="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-extrabold text-brand-dark">Target Berhasil Disimpan!</p>
                        <p className="text-[10px] text-brand-primary/60 font-semibold truncate">Target {savedLabel} telah aktif.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleUndo}
                            className="text-[10px] font-bold text-brand-primary hover:text-brand-secondary hover:underline flex items-center gap-1 active:scale-[0.95] transition-all"
                        >
                            <Icon icon="solar:restart-linear" className="text-xs" />
                            Urungkan
                        </button>
                        <button
                            onClick={() => setShowSuccessToast(false)}
                            className="text-brand-primary/40 hover:text-brand-dark active:scale-[0.95] flex-shrink-0 transition-all font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}
