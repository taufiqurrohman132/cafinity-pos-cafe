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
    history = { labels: [], actuals: [], targets: [] },
    staffPerformance = [],
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

    const formatRp = (value) => new Intl.NumberFormat('id-ID').format(value);

    const periods = [
        { val: 'harian', label: 'Harian' },
        { val: 'mingguan', label: 'Mingguan' },
        { val: 'bulanan', label: 'Bulanan' },
    ];

    // Chart.js config — V-3.0 palette
    const chartData = {
        labels: history.labels,
        datasets: [
            {
                label: 'Pencapaian Riil',
                data: history.actuals,
                borderColor: '#BFFF00',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const ctx = chart?.ctx;
                    if (!ctx) return 'rgba(191,255,0,0.10)';
                    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
                    gradient.addColorStop(0, 'rgba(191,255,0,0.18)');
                    gradient.addColorStop(1, 'rgba(191,255,0,0.00)');
                    return gradient;
                },
                borderWidth: 2.5,
                pointRadius: 3,
                pointBackgroundColor: '#BFFF00',
                pointBorderColor: '#fff',
                pointBorderWidth: 1.5,
                tension: 0.45,
                fill: true,
            },
            {
                label: 'Target Penjualan',
                data: history.targets,
                borderColor: '#000000',
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
                backgroundColor: '#0E0E0E',
                titleColor: '#E6E6E6',
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
                ticks: {
                    color: '#666666',
                    font: { size: 10, weight: '700' },
                    maxRotation: 0,
                    maxTicksLimit: 10,
                },
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
                ticks: {
                    color: '#666666',
                    font: { size: 10, weight: '700' },
                    callback: (val) => `Rp ${(val / 1000000).toFixed(0)}jt`,
                },
            },
        },
    };

    return (
        <>
            <Head title="Target & Performa" />

            <div className="space-y-6 p-4 md:p-6 bg-[#E6E6E6]/30 min-h-screen">

                {/* ====== TOP HEADER ====== */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.5px] leading-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary">
                            Target &amp; Performa
                        </h1>
                        <p className="text-xs sm:text-sm text-[#666666] font-normal mt-1">
                            Pantau pencapaian KPI harian dan riwayat pertumbuhan outlet Anda.
                        </p>
                    </div>

                    {/* Period Tabs — V-3.0 */}
                    <div className="flex items-center gap-2">
                        {periods.map((p) => (
                            <Link
                                key={p.val}
                                to={`/targets-goals?period=${p.val}`}
                                className={`px-6 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 active:scale-[0.98] ${
                                    period === p.val
                                        ? 'bg-[#BFFF00] text-black border-[#BFFF00] shadow-sm hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)]'
                                        : 'bg-white text-black border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999]'
                                }`}
                            >
                                {p.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ====== TARGET HARI INI — HERO CARD ====== */}
                <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#BFFF00]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Icon icon="solar:target-linear" className="text-xl text-black" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#999999]">
                                Target {period}
                            </span>
                            {target?.label && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold text-gray-500 bg-[#E6E6E6] border border-[#D0D0D0]">
                                    {target.label}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                                    Rp {formatRp(targetValue)}
                                </p>
                                <p className="text-xs text-[#999999] font-normal mt-1">
                                    Status pembaruan terakhir: {lastUpdated}
                                </p>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1">Tercapai</p>
                                        <p className="text-xl sm:text-2xl font-extrabold text-black">
                                            Rp {formatRp(currentValue)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1">Progress</p>
                                        <p className="text-xl sm:text-2xl font-extrabold text-black">{progress}%</p>
                                    </div>
                                </div>

                                {/* Progress bar — V-3.0 neon green */}
                                <div className="w-full bg-[#E6E6E6] h-3 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                                            progress >= 100 ? 'bg-emerald-500' : 'bg-[#BFFF00]'
                                        }`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between text-xs text-[#999999] font-normal">
                                    <span>Target Info</span>
                                    <span>Sisa: Rp {formatRp(remaining)}</span>
                                    <span>Target: Rp {formatRp(targetValue)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-[#E6E6E6]">
                            {/* Primary CTA — V-3.0 neon green */}
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] rounded-xl transition-all duration-200 active:scale-[0.98] border border-[#BFFF00]"
                            >
                                <Icon icon="solar:pen-linear" className="text-sm" />
                                {target ? 'Ubah Target' : 'Set Target'}
                            </button>
                            <Link
                                to="/targets-goals/aov"
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-white border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] rounded-xl transition-all duration-200 active:scale-[0.98]"
                            >
                                Lihat Detail AOV
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ====== STAT CARDS ====== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* Card 1 — Sisa Target */}
                    <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1">Sisa Target</p>
                            <div className="w-9 h-9 rounded-xl bg-[#BFFF00] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                <Icon icon="solar:wallet-linear" className="text-lg text-black" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-black leading-tight">
                            Rp {formatRp(remaining)}
                        </p>
                        <p className="text-xs text-[#999999] font-normal mt-2">Perlu dicapai hari ini</p>
                    </div>

                    {/* Card 2 — Estimasi Penutupan */}
                    <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1">Estimasi Penutupan</p>
                            <div className="w-9 h-9 rounded-xl bg-[#BFFF00] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                <Icon icon="solar:graph-up-linear" className="text-lg text-black" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-black leading-tight">
                            Rp {formatRp(estimasi)}
                        </p>
                        <p className={`text-xs font-semibold mt-2 ${trendEstimasi >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {trendEstimasi >= 0 ? '↑' : '↓'} {Math.abs(trendEstimasi)}%
                            <span className="text-gray-400 font-normal ml-1">Berdasarkan tren</span>
                        </p>
                    </div>

                    {/* Card 3 — Rata-rata Harian */}
                    <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1">Rata-rata Harian</p>
                            <div className="w-9 h-9 rounded-xl bg-[#BFFF00] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                <Icon icon="solar:chart-2-linear" className="text-lg text-black" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-black leading-tight">
                            Rp {formatRp(avgHarian)}
                        </p>
                        <p className="text-xs font-semibold text-emerald-700 mt-2">30 hari terakhir</p>
                    </div>

                    {/* Card 4 — Update Terakhir */}
                    <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_10px_25px_-4px_rgba(191,255,0,0.16),0_4px_12px_-2px_rgba(191,255,0,0.10)] transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#999999] mb-1">Update Terakhir</p>
                            <div className="w-9 h-9 rounded-xl bg-[#BFFF00] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                <Icon icon="solar:calendar-linear" className="text-lg text-black" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-black leading-tight">Live</p>
                        <p className="text-xs font-normal text-[#999999] mt-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Sinkronisasi otomatis aktif
                        </p>
                    </div>
                </div>

                {/* ====== MAIN GRID ====== */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* CHART */}
                    <div className="xl:col-span-8 bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                            <div>
                                <h3 className="text-base font-semibold text-black tracking-tight">
                                    Riwayat Pencapaian (30 Hari Terakhir)
                                </h3>
                                <p className="text-xs text-[#999999] font-normal mt-1">
                                    Perbandingan antara target harian vs realisasi penjualan
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-black bg-[#BFFF00] px-3.5 py-1.5 rounded-xl flex-shrink-0">
                                <span className="w-2 h-2 bg-black rounded-full"></span> Penjualan Real
                            </div>
                        </div>

                        <div className="relative w-full h-[260px]">
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        <div className="flex items-center gap-6 mt-5 text-xs font-semibold text-[#666666] justify-center">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-[#BFFF00] rounded-full inline-block"></span> Pencapaian Riil
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-black rounded-full inline-block border-t-2 border-dashed border-black bg-transparent"></span> Target Penjualan
                            </span>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="xl:col-span-4 space-y-5">

                        {/* Wawasan Performa */}
                        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm p-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#999999] flex items-center gap-2 mb-4">
                                <Icon icon="solar:graph-up-linear" className="text-black text-lg" />
                                Wawasan Performa
                            </h3>

                            <div className="mb-4 pb-4 border-b border-[#E6E6E6]">
                                <p className="text-sm font-semibold text-black mb-1">Jam Sibuk Diprediksi</p>
                                <p className="text-xs text-[#666666] leading-relaxed">
                                    Pukul <span className="font-extrabold text-black">{peakLabel}</span> biasanya menjadi jam tersibuk berdasarkan data 7 hari terakhir.
                                </p>
                                {promoAktif !== '-' && (
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-bold text-black bg-[#BFFF00] px-2 py-0.5 rounded">Promo Aktif</span>
                                        <span className="text-xs font-medium text-[#666666]">"{promoAktif}"</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-black mb-3.5">Pencapaian Staf</p>
                                <div className="space-y-3">
                                    {staffPerformance.length > 0 ? (
                                        staffPerformance.map((staff, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-semibold text-black">
                                                        {staff.name} {staff.role && <span className="font-normal text-gray-400">({staff.role})</span>}
                                                    </span>
                                                    <span className="text-xs font-semibold text-black">
                                                        Rp {formatRp(staff.total / 1000)}k
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[#E6E6E6] h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#BFFF00] rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.round((staff.total / maxStaff) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Belum ada data staf hari ini.</p>
                                    )}
                                </div>
                                <Link
                                    to="/dashboard"
                                    className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-2.5 text-sm font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-200 active:scale-[0.98]"
                                >
                                    Lihat Laporan Lengkap
                                    <Icon icon="solar:arrow-right-linear" className="text-sm" />
                                </Link>
                            </div>
                        </div>

                        {/* Dark tip widget — V-3.0 */}
                        <div className="bg-[#0E0E0E] rounded-2xl p-6 flex items-start gap-4 shadow-lg border border-black">
                            <div className="w-10 h-10 rounded-xl bg-[#BFFF00] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon icon="solar:card-linear" className="text-xl text-black" />
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold text-[#BFFF00] uppercase tracking-wider mb-1.5">Metode Pembayaran Terpopuler</h5>
                                <p className="text-xs text-[#E6E6E6] leading-relaxed">
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

            {/* ====== SUCCESS TOAST ====== */}
            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 z-[100] bg-white border border-[#E6E6E6] rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-slide-in-bottom max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-circle-linear" className="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-semibold text-black">Target Berhasil Disimpan!</p>
                        <p className="text-xs text-[#999999] truncate">Target {savedLabel} telah aktif.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleUndo}
                            className="text-xs font-semibold text-[#666666] hover:text-black flex items-center gap-1 active:scale-[0.97] transition-all"
                        >
                            <Icon icon="solar:restart-linear" className="text-xs" />
                            Urungkan
                        </button>
                        <button
                            onClick={() => setShowSuccessToast(false)}
                            className="text-gray-400 hover:text-black active:scale-[0.97] flex-shrink-0 transition-all font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
