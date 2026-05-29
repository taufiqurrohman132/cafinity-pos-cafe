import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const STATUS_CONFIG = {
    preparing: {
        badge: 'bg-[#443dff]/10 text-[#443dff] border-[#443dff]/20',
        icon: 'solar:fire-bold-duotone',
        label: 'Sedang Dimasak',
        card: 'bg-gradient-to-b from-[#eeeeff] to-white border-[#c4c0ff]',
    },
    pending: {
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: 'solar:clock-circle-bold-duotone',
        label: 'Menunggu',
        card: 'bg-gradient-to-b from-amber-50 to-white border-amber-200',
    },
    ready: {
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: 'solar:check-circle-bold-duotone',
        label: 'Siap Diambil',
        card: 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200',
    },
};

const DRINK_KEYWORDS = ['minum', 'drink', 'beverage', 'juice', 'coffee', 'tea'];

function isDrinkCategory(categoryName = '') {
    const lower = categoryName.toLowerCase();
    return DRINK_KEYWORDS.some(k => lower.includes(k));
}

function isLateOrder(order) {
    if (!['pending', 'preparing'].includes(order.status)) return false;
    const created = new Date(order.created_at);
    const diffMinutes = (Date.now() - created.getTime()) / 60000;
    return diffMinutes >= 15;
}

function LiveClock() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return <span className="font-bold text-[#050316]">{time}</span>;
}

export default function KitchenOrdersIndex({ orders, stats, filter }) {
    // Auto-refresh setiap 30 detik
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['orders', 'stats'] }), 30000);
        return () => clearInterval(id);
    }, []);

    const postAction = (url) => {
        router.post(url, {}, { preserveScroll: true });
    };

    const FILTER_TABS = [
        { key: 'all',       label: 'Semua' },
        { key: 'pending',   label: 'Menunggu' },
        { key: 'preparing', label: 'Memasak' },
        { key: 'ready',     label: 'Siap' },
    ];

    const statCards = [
        { label: 'Pesanan Aktif',    value: stats.active_orders,    icon: 'solar:clipboard-list-bold-duotone',  iconBg: 'bg-[#dddbff]',    iconColor: 'text-[#443dff]',   labelColor: 'text-[#2f27ce]' },
        { label: 'Rata-rata Masak',  value: stats.avg_cook_time,    icon: 'solar:stopwatch-bold-duotone',       iconBg: 'bg-[#dddbff]',    iconColor: 'text-[#443dff]',   labelColor: 'text-[#2f27ce]' },
        { label: 'Pesanan Terlambat',value: stats.late_orders,      icon: 'solar:danger-triangle-bold-duotone', iconBg: 'bg-rose-100',     iconColor: 'text-rose-500',    labelColor: 'text-rose-500' },
        { label: 'Selesai Hari Ini', value: stats.completed_today,  icon: 'solar:check-circle-bold-duotone',   iconBg: 'bg-emerald-100',  iconColor: 'text-emerald-600', labelColor: 'text-emerald-600' },
    ];

    return (
        <>
            <Head title="Antrean Dapur" />

            <div className="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">

                {/* ── Header ── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Antrean Dapur
                        </h1>
                        <p className="text-[#2f27ce] mt-1 text-sm font-medium">
                            Kelola persiapan makanan dan minuman secara real-time.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="text-[13px] text-[#2f27ce] bg-white px-4 py-2.5 rounded-xl border border-[#dddbff] shadow-sm flex items-center gap-2 font-medium">
                            <iconify-icon icon="solar:clock-circle-bold-duotone" class="text-lg text-[#443dff]" />
                            <span>Sekarang: <LiveClock /></span>
                        </div>
                        <Link href={route('pos.index')}
                            className="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98] text-[13px]">
                            <iconify-icon icon="solar:card-2-bold" class="text-[18px]" />
                            Buka POS
                        </Link>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-[#2f27ce]/10 transition-all duration-300 group">
                            <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                <iconify-icon icon={card.icon} class={`text-[22px] ${card.iconColor}`} />
                            </div>
                            <div>
                                <p className={`text-[10px] font-extrabold uppercase tracking-widest ${card.labelColor}`}>
                                    {card.label}
                                </p>
                                <p className="text-2xl font-extrabold text-[#050316] leading-tight">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filter Tabs ── */}
                <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        {FILTER_TABS.map(tab => (
                            <Link
                                key={tab.key}
                                href={route('kitchen-orders.index', { filter: tab.key })}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                    filter === tab.key
                                        ? 'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm'
                                        : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50 hover:text-[#050316]'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#2f27ce] font-semibold">
                        <span className="w-1.5 h-1.5 bg-[#443dff] rounded-full animate-pulse" />
                        Diperbarui otomatis setiap 30 detik
                    </div>
                </div>

                {/* ── Order Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {orders.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl border border-[#dddbff] shadow-sm p-14 text-center">
                            <iconify-icon icon="solar:clipboard-list-bold-duotone" class="text-5xl text-[#dddbff]" />
                            <p className="mt-3 text-sm font-bold text-[#2f27ce]">Tidak ada pesanan di dapur saat ini.</p>
                            <p className="text-xs text-[#2f27ce]/60 mt-1 font-medium">
                                Pesanan baru akan muncul di sini secara otomatis.
                            </p>
                        </div>
                    ) : orders.map(order => {
                        const late    = isLateOrder(order);
                        const cfg     = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                        const diffMin = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

                        return (
                            <div key={order.id} className={`rounded-2xl overflow-hidden flex flex-col shadow-sm border transition-all hover:shadow-md ${cfg.card}`}>
                                <div className="p-5 flex flex-col gap-3 flex-1">

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base font-black text-[#050316] tracking-tight">
                                                #KO-{String(order.id).padStart(4, '0')}
                                            </span>
                                            {late && (
                                                <span className="text-[9px] font-extrabold bg-rose-100 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md tracking-wide uppercase">
                                                    Terlambat
                                                </span>
                                            )}
                                        </div>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border flex-shrink-0 ${cfg.badge}`}>
                                            <iconify-icon icon={cfg.icon} class="text-[12px]" />
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* Transaksi + waktu */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-[#050316]/50">
                                            Transaksi #{order.transaction_id}
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#050316]/40 flex-shrink-0">
                                            <iconify-icon icon="solar:clock-circle-bold-duotone" class="text-xs" />
                                            {diffMin} menit lalu
                                        </span>
                                    </div>

                                    {/* Notes */}
                                    {order.notes && (
                                        <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                            <iconify-icon icon="solar:danger-triangle-bold-duotone" class="text-amber-500 text-sm flex-shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-semibold text-amber-700 italic leading-relaxed">{order.notes}</p>
                                        </div>
                                    )}

                                    {/* Items */}
                                    <div className="border-t border-black/5 pt-3 space-y-2.5">
                                        {order.items.map((item, i) => {
                                            const drink = isDrinkCategory(item.menu?.category?.name);
                                            return (
                                                <div key={i} className="flex items-start gap-2.5">
                                                    <span className="text-xs font-black text-[#443dff]/70 w-7 flex-shrink-0 pt-0.5">
                                                        {item.qty}x
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-[#050316] leading-snug">
                                                            {item.menu?.name ?? '—'}
                                                        </p>
                                                        {item.notes && (
                                                            <p className="text-[10px] text-[#2f27ce]/60 mt-0.5 flex items-center gap-1 italic">
                                                                <iconify-icon icon="solar:chat-round-line-linear" class="text-[11px] flex-shrink-0" />
                                                                {item.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <iconify-icon
                                                        icon={drink ? 'solar:cup-hot-bold-duotone' : 'solar:fire-bold-duotone'}
                                                        class={`text-sm flex-shrink-0 mt-0.5 ${drink ? 'text-sky-400' : 'text-rose-400'}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="px-5 pb-5 flex gap-2.5">
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => postAction(route('kitchen-orders.prepare', order.id))}
                                            className="flex-1 py-2.5 text-xs font-extrabold bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl transition-all shadow-md shadow-[#2f27ce]/20 active:scale-[0.98]"
                                        >
                                            Mulai Memasak
                                        </button>
                                    )}

                                    {order.status === 'preparing' && (<>
                                        <Link href={route('kitchen-orders.show', order.id)}
                                            className="py-2.5 px-4 text-xs font-extrabold text-[#443dff] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff]/40 transition-colors flex items-center gap-1.5 flex-shrink-0">
                                            <iconify-icon icon="solar:eye-bold-duotone" class="text-sm" />
                                            Detail
                                        </Link>
                                        <button
                                            onClick={() => postAction(route('kitchen-orders.ready', order.id))}
                                            className="flex-1 py-2.5 text-xs font-extrabold bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl transition-all shadow-md shadow-[#2f27ce]/20 active:scale-[0.98]"
                                        >
                                            Siap Diambil
                                        </button>
                                    </>)}

                                    {order.status === 'ready' && (<>
                                        <Link href={route('kitchen-orders.show', order.id)}
                                            className="py-2.5 px-4 text-xs font-extrabold text-[#443dff] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff]/40 transition-colors flex items-center gap-1.5 flex-shrink-0">
                                            <iconify-icon icon="solar:eye-bold-duotone" class="text-sm" />
                                            Detail
                                        </Link>
                                        <button
                                            onClick={() => postAction(route('kitchen-orders.complete', order.id))}
                                            className="flex-1 py-2.5 text-xs font-extrabold bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <iconify-icon icon="solar:check-circle-bold" class="text-sm" />
                                            Telah Diambil
                                        </button>
                                    </>)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Tips Banner ── */}
                <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex-1">
                        <p className="text-sm font-extrabold text-[#443dff] mb-2 flex items-center gap-2">
                            <iconify-icon icon="solar:fire-bold-duotone" class="text-base" />
                            Tips Dapur Hari Ini
                        </p>
                        <p className="text-xs font-medium text-[#2f27ce] leading-relaxed">
                            Ingat untuk menandai item yang sudah selesai secepat mungkin agar pelayan
                            dapat segera mengantarkannya ke pelanggan. Pesanan yang melebihi{' '}
                            <span className="font-extrabold text-[#050316]">15 menit</span>{' '}
                            akan otomatis ditandai terlambat.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <Link href={route('targets-goals.index')}
                            className="px-5 py-2.5 text-xs font-extrabold text-[#2f27ce] bg-[#dddbff]/30 border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
                            Lihat Target Harian
                        </Link>
                        <Link href={route('dashboard')}
                            className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] rounded-xl transition-all shadow-sm shadow-[#2f27ce]/20">
                            Laporan Performa
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}


KitchenOrdersIndex.layout = (page) => <AppLayout>{page}</AppLayout>;