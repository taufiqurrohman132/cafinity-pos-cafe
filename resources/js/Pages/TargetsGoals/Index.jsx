import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TargetModal from '@/Components/TargetModal';
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
// Jika Anda menggunakan package iconify untuk react: npm install @iconify/react
import { Icon } from '@iconify/react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

// Anda dapat mengganti ini dengan komponen Layout standar Anda
import AppLayout from '@/Layouts/AppLayout';

export default function TargetPerforma({
    target, targetValue, currentValue, progress, remaining, lastUpdated,
    period, estimasi, trendEstimasi, avgHarian, history, staffPerformance,
    maxStaff, paymentSummary, peakLabel, promoAktif
}) {
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

    const handleUndo = () => {
        if (target?.id) {
            router.delete(route('targets-goals.destroy', target.id), {
                onSuccess: () => {
                    setShowSuccessToast(false);
                },
                preserveScroll: true
            });
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
                borderColor: '#443dff',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
                    gradient.addColorStop(0, 'rgba(68, 61, 255, 0.18)');
                    gradient.addColorStop(1, 'rgba(68, 61, 255, 0.00)');
                    return gradient;
                },
                borderWidth: 2.5,
                pointRadius: 3,
                pointBackgroundColor: '#443dff',
                pointBorderColor: '#fff',
                pointBorderWidth: 1.5,
                tension: 0.45,
                fill: true,
            },
            {
                label: 'Target Penjualan',
                data: history.targets,
                borderColor: '#050316',
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
                backgroundColor: '#050316',
                titleColor: '#dddbff',
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
                ticks: { color: '#2f27ce', font: { size: 10, weight: '700' }, maxRotation: 0, maxTicksLimit: 10 },
            },
            y: {
                grid: { color: '#dddbff55', drawBorder: false },
                ticks: {
                    color: '#2f27ce',
                    font: { size: 10, weight: '700' },
                    callback: (val) => `Rp ${(val / 1000000).toFixed(0)}jt`,
                },
            },
        },
    };

    return (
        <>
            <Head title="Target & Performa" />

            <div className="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">

                {/* ====== TOP HEADER ====== */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Target & Performa
                        </h1>
                        <p className="text-[#2f27ce] mt-1 text-sm font-medium">
                            Pantau pencapaian KPI harian dan riwayat pertumbuhan outlet Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {periods.map((p) => (
                            <Link
                                key={p.val}
                                href={route('targets-goals.index', { period: p.val })}
                                className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all ${period === p.val
                                        ? 'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm'
                                        : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50'
                                    }`}
                            >
                                {p.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ====== TARGET HARI INI — HERO CARD ====== */}
                <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#dddbff]/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Icon icon="solar:target-linear" className="text-xl text-[#443dff]" />
                            <span className="text-sm font-extrabold text-[#443dff] capitalize tracking-widest">
                                Target {period.charAt(0).toUpperCase() + period.slice(1)}
                            </span>
                            {target?.label && (
                                <span className="text-[10px] font-bold text-[#2f27ce]/60 bg-[#dddbff]/50 px-2 py-0.5 rounded-md border border-[#dddbff]">
                                    {target.label}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div>
                                <p className="text-3xl font-extrabold text-[#050316] tracking-tight">
                                    Rp {formatRp(targetValue)}
                                </p>
                                <p className="text-xs font-medium text-[#2f27ce]/70 mt-1.5">
                                    Status pembaruan terakhir: {lastUpdated}
                                </p>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-1">Tercapai</p>
                                        <p className="text-2xl font-extrabold text-[#443dff]">
                                            Rp {formatRp(currentValue)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-1">Progress</p>
                                        <p className="text-2xl font-extrabold text-[#050316]">{progress}%</p>
                                    </div>
                                </div>

                                <div className="w-full bg-[#dddbff]/50 h-3 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#2f27ce] to-[#443dff]'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between text-[10px] font-bold text-[#2f27ce]/60">
                                    <span>Target Info</span>
                                    <span>Sisa: Rp {formatRp(remaining)}</span>
                                    <span>Target: Rp {formatRp(targetValue)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-[#dddbff]/60">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]"
                            >
                                <Icon icon="solar:pen-linear" className="text-sm" />
                                {target ? 'Ubah Target' : 'Set Target'}
                            </button>
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2.5 text-xs font-extrabold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff]/50 hover:text-[#050316] transition-colors"
                            >
                                Lihat Detail AOV
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ====== STAT CARDS ====== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest leading-tight">Sisa Target</p>
                            <div className="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                                <Icon icon="solar:wallet-linear" className="text-lg text-[#443dff]" />
                            </div>
                        </div>
                        <p className="text-xl font-extrabold text-[#050316] leading-tight">
                            Rp {formatRp(remaining)}
                        </p>
                        <p className="text-[11px] font-medium text-[#2f27ce]/70 mt-1.5">Perlu dicapai hari ini</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest leading-tight">Estimasi Penutupan</p>
                            <div className="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                                <Icon icon="solar:graph-up-linear" className="text-lg text-[#443dff]" />
                            </div>
                        </div>
                        <p className="text-xl font-extrabold text-[#050316] leading-tight">
                            Rp {formatRp(estimasi)}
                        </p>
                        <p className={`text-[11px] font-medium mt-1.5 ${trendEstimasi >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {trendEstimasi >= 0 ? '↑' : '↓'} {Math.abs(trendEstimasi)}%
                            <span className="text-[#2f27ce]/60 font-normal ml-1">Berdasarkan tren saat ini</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest leading-tight">Rata-rata Harian</p>
                            <div className="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                                <Icon icon="solar:chart-2-linear" className="text-lg text-[#443dff]" />
                            </div>
                        </div>
                        <p className="text-xl font-extrabold text-[#050316] leading-tight">
                            Rp {formatRp(avgHarian)}
                        </p>
                        <p className="text-[11px] font-medium text-emerald-600 mt-1.5">30 hari terakhir</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-[10px] font-extrabold text-[#2f27ce] capitalize tracking-widest leading-tight">Update Terakhir</p>
                            <div className="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                                <Icon icon="solar:calendar-linear" className="text-lg text-[#443dff]" />
                            </div>
                        </div>
                        <p className="text-xl font-extrabold text-[#050316] leading-tight">Live</p>
                        <p className="text-[11px] font-medium text-[#2f27ce]/70 mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Sinkronisasi otomatis aktif
                        </p>
                    </div>
                </div>

                {/* ====== MAIN GRID ====== */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* CHART */}
                    <div className="xl:col-span-8 bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                            <div>
                                <h3 className="text-base font-extrabold text-[#050316] tracking-tight">Riwayat Pencapaian (30 Hari Terakhir)</h3>
                                <p className="text-xs text-[#2f27ce] font-medium mt-0.5">Perbandingan antara target harian vs realisasi penjualan</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#050316] bg-[#dddbff]/50 border border-[#dddbff] px-3 py-1.5 rounded-lg flex-shrink-0">
                                <span className="w-2 h-2 bg-[#443dff] rounded-full"></span> Penjualan Real
                            </div>
                        </div>

                        <div className="relative w-full h-[260px]">
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        <div className="flex items-center gap-6 mt-5 text-[11px] font-bold text-[#2f27ce] justify-center">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-[#443dff] rounded-full inline-block"></span> Pencapaian Riil
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-[#050316] rounded-full inline-block border-t-2 border-dashed border-[#050316] bg-transparent"></span> Target Penjualan
                            </span>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="xl:col-span-4 space-y-5">
                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                            <h3 className="font-extrabold text-[#050316] tracking-tight mb-4 flex items-center gap-2 text-sm">
                                <Icon icon="solar:graph-up-linear" className="text-[#443dff] text-lg" />
                                Wawasan Performa
                            </h3>

                            <div className="mb-4 pb-4 border-b border-[#dddbff]">
                                <p className="text-xs font-extrabold text-[#050316] mb-1">Jam Sibuk Diprediksi</p>
                                <p className="text-[11px] font-medium text-[#2f27ce] leading-relaxed">
                                    Pukul <span className="font-extrabold text-[#050316]">{peakLabel}</span> biasanya menjadi jam tersibuk berdasarkan data 7 hari terakhir.
                                </p>
                                {promoAktif !== '-' && (
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-extrabold text-[#443dff] bg-[#dddbff] px-2 py-0.5 rounded-md border border-[#c4c0ff]">Promo Aktif</span>
                                        <span className="text-[10px] font-bold text-[#2f27ce]">"{promoAktif}"</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs font-extrabold text-[#050316] mb-3">Pencapaian Staf</p>
                                <div className="space-y-3">
                                    {staffPerformance.length > 0 ? (
                                        staffPerformance.map((staff, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[11px] font-bold text-[#050316]">
                                                        {staff.name} {staff.role && <span className="font-normal text-[#2f27ce]/60">({staff.role})</span>}
                                                    </span>
                                                    <span className="text-[11px] font-extrabold text-[#050316]">
                                                        Rp {formatRp(staff.total / 1000)}k
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[#dddbff]/50 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#2f27ce] to-[#443dff] rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.round((staff.total / maxStaff) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[11px] text-[#2f27ce]/60 italic">Belum ada data staf hari ini.</p>
                                    )}
                                </div>
                                <Link
                                    href={route('dashboard')}
                                    className="block w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] text-center transition-colors flex items-center justify-center gap-1.5"
                                >
                                    Lihat Laporan Lengkap
                                    <Icon icon="solar:arrow-right-linear" className="text-sm" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon icon="solar:card-linear" className="text-xl text-[#443dff]" />
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-[#050316] mb-1">Metode Pembayaran Terpopuler</p>
                                <p className="text-[11px] font-medium text-[#2f27ce] leading-relaxed">
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
                <div className="fixed bottom-6 right-6 z-[100] bg-white border border-[#dddbff] rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-circle-linear" className="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-extrabold text-[#050316]">Target Berhasil Disimpan!</p>
                        <p className="text-[10px] text-[#2f27ce]/60 font-semibold truncate">Target {savedLabel} telah aktif.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleUndo} 
                            className="text-[10px] font-extrabold text-[#050316] hover:underline flex items-center gap-1 active:scale-95"
                        >
                            <Icon icon="solar:restart-linear" className="text-xs" />
                            Urungkan
                        </button>
                        <button 
                            onClick={() => setShowSuccessToast(false)} 
                            className="text-[#2f27ce]/50 hover:text-[#443dff] active:scale-95 flex-shrink-0"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}

TargetPerforma.layout = (page) => <AppLayout>{page}</AppLayout>;
