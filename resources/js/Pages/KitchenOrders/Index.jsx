import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Head from '@/Components/Head';
import client from '@/api/client';
import { useNotifications } from '@/context/NotificationContext';
import KitchenOrdersSkeleton from '@/Components/Skeletons/KitchenOrdersSkeleton';

const STATUS_CONFIG = {
    preparing: {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        icon: 'solar:fire-linear',
        label: 'Sedang Dimasak',
        card: 'bg-white border-[#E6E6E6]',
    },
    pending: {
        badge: 'bg-amber-50 text-amber-700 border-amber-100',
        icon: 'solar:clock-circle-linear',
        label: 'Menunggu',
        card: 'bg-white border-[#E6E6E6]',
    },
    ready: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        icon: 'solar:check-circle-linear',
        label: 'Siap Diambil',
        card: 'bg-white border-[#E6E6E6]',
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

    return <span className="font-bold text-black">{time}</span>;
}

export default function KitchenOrdersIndex() {
    const location = useLocation();
    const { triggerLocalNotif } = useNotifications();
    const [orders, setOrders] = useState(null);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const prevOrderIdsRef = useRef(new Set());
    const isFirstLoadRef = useRef(true);

    // Fetch data whenever location.search or refreshTrigger changes
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                setError(null);
                const res = await client.get(`/kitchen-orders${location.search}`);
                const fetchedOrders = res.data.orders || [];
                setOrders(fetchedOrders);
                setStats(res.data.stats);
                setFilter(res.data.filter || 'all');

                const fetchedIds = fetchedOrders.map(o => o.id);

                if (isFirstLoadRef.current) {
                    prevOrderIdsRef.current = new Set(fetchedIds);
                    isFirstLoadRef.current = false;
                } else {
                    let hasNew = false;
                    fetchedIds.forEach(id => {
                        if (!prevOrderIdsRef.current.has(id)) {
                            hasNew = true;
                        }
                    });

                    if (hasNew) {
                        triggerLocalNotif(
                            "Antrean Dapur Baru",
                            "Pesanan hidangan baru telah masuk ke antrean dapur. Silakan mulai memasak!",
                            "info",
                            "kitchen_order"
                        );
                    }
                    prevOrderIdsRef.current = new Set(fetchedIds);
                }
            } catch (err) {
                console.error("Gagal mengambil data antrean dapur:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [location.search, refreshTrigger]);

    // Auto-refresh setiap 5 detik agar real-time
    useEffect(() => {
        const id = setInterval(() => {
            setRefreshTrigger(prev => prev + 1);
        }, 5000);
        return () => clearInterval(id);
    }, []);

    const postAction = async (url) => {
        try {
            await client.post(url);
            setRefreshTrigger(prev => prev + 1);
        } catch (e) {
            console.error('Failed to perform kitchen order action', e);
            alert('Gagal melakukan aksi dapur.');
        }
    };

    const FILTER_TABS = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: 'Menunggu' },
        { key: 'preparing', label: 'Memasak' },
        { key: 'ready', label: 'Siap' },
    ];

    if (loading && !orders) {
        return (
            <>
                <Head title="Antrean Dapur" />
                <KitchenOrdersSkeleton />
            </>
        );
    }

    if (error && !orders) {
        return (
            <>
                <Head title="Antrean Dapur" />
                <div className="min-h-screen flex items-center justify-center bg-white p-4">
                    <div className="bg-white p-8 rounded-2xl border border-[#E6E6E6] max-w-md w-full shadow-level-3 text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-heading text-black mb-2">Terjadi Kesalahan</h3>
                        <p className="text-body-compact text-black/60 mb-6">
                            Gagal memuat data antrean dapur dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black py-2.5 rounded-xl font-semibold transition-all active:scale-[0.97]">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!orders || !stats) return null;

    const statCards = [
        { label: 'Pesanan Aktif', value: stats.active_orders, icon: 'solar:clipboard-list-linear', iconBg: 'bg-[#E6E6E6]', iconColor: 'text-black', labelColor: 'text-black/60' },
        { label: 'Rata-rata Masak', value: stats.avg_cook_time, icon: 'solar:stopwatch-linear', iconBg: 'bg-[#E6E6E6]', iconColor: 'text-black', labelColor: 'text-black/60' },
        { label: 'Pesanan Terlambat', value: stats.late_orders, icon: 'solar:danger-triangle-linear', iconBg: 'bg-rose-50', iconColor: 'text-rose-600 border border-rose-100', labelColor: 'text-rose-700' },
        { label: 'Selesai Hari Ini', value: stats.completed_today, icon: 'solar:check-circle-linear', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600 border border-emerald-100', labelColor: 'text-emerald-700' },
    ];

    return (
        <>
            <Head title="Antrean Dapur" />

            <div className="space-y-6 p-4 md:p-6 bg-white min-h-screen">

                {/* ── Header ── */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight leading-tight">
                            Antrean Dapur
                        </h1>
                        <p className="text-black/60 mt-1 text-xs font-semibold">
                            Kelola persiapan makanan dan minuman secara real-time.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="text-[13px] text-black bg-white px-4 py-2.5 rounded-xl border border-[#D0D0D0] shadow-sm flex items-center gap-2 font-semibold">
                            <iconify-icon icon="solar:clock-circle-linear" class="text-lg text-black/50" />
                            <span>Sekarang: <LiveClock /></span>
                        </div>
                        <Link to="/pos"
                            className="bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-level-1 hover:shadow-level-2 active:scale-[0.98] text-[13px]">
                            <iconify-icon icon="solar:card-2-linear" class="text-[18px] text-black" />
                            Buka POS
                        </Link>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-5 flex items-center gap-4 hover:shadow-level-2 hover:border-[#D0D0D0] transition-all duration-300 group">
                            <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                <iconify-icon icon={card.icon} class={`text-[22px] ${card.iconColor}`} />
                            </div>
                            <div>
                                <p className={`text-[10px] font-semibold uppercase tracking-wider ${card.labelColor}`}>
                                    {card.label}
                                </p>
                                <p className="text-2xl font-bold text-black leading-tight mt-0.5">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filter Tabs ── */}
                <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        {FILTER_TABS.map(tab => (
                            <Link
                                key={tab.key}
                                to={tab.key === 'all' ? '/kitchen-orders' : `/kitchen-orders?filter=${tab.key}`}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${filter === tab.key
                                        ? 'bg-[#BFFF00] text-black border-[#BFFF00] shadow-sm'
                                        : 'bg-white text-black/60 border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] hover:text-black'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-black/60 font-semibold">
                        <span className="w-1.5 h-1.5 bg-[#BFFF00] rounded-full animate-pulse" />
                        Diperbarui otomatis setiap 5 detik
                    </div>
                </div>

                {/* ── Order Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {orders.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-14 text-center">
                            <iconify-icon icon="solar:clipboard-list-linear" class="text-5xl text-black/20" />
                            <p className="mt-3 text-sm font-semibold text-black">Tidak ada pesanan di dapur saat ini.</p>
                            <p className="text-xs text-black/60 mt-1 font-medium">
                                Pesanan baru akan muncul di sini secara otomatis.
                            </p>
                        </div>
                    ) : orders.map(order => {
                        const late = isLateOrder(order);
                        const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                        const diffMin = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

                        return (
                            <div key={order.id} className={`rounded-2xl overflow-hidden flex flex-col shadow-level-1 border border-[#E6E6E6] bg-white transition-all hover:shadow-level-2 hover:border-[#D0D0D0] ${cfg.card}`}>
                                <div className="p-5 flex flex-col gap-3 flex-1">

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base font-bold text-black tracking-tight">
                                                #KO-{String(order.id).padStart(4, '0')}
                                            </span>
                                            {late && (
                                                <span className="text-[9px] font-semibold bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-md tracking-wide capitalize">
                                                    Terlambat
                                                </span>
                                            )}
                                        </div>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 ${cfg.badge}`}>
                                            <iconify-icon icon={cfg.icon} class="text-[12px]" />
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* Transaksi + waktu */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-black/40">
                                            Transaksi #{order.transaction_id}
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px] font-semibold text-black/40 flex-shrink-0">
                                            <iconify-icon icon="solar:clock-circle-linear" class="text-xs text-black/30" />
                                            {diffMin} menit lalu
                                        </span>
                                    </div>

                                    {/* Notes */}
                                    {order.notes && (
                                        <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                            <iconify-icon icon="solar:danger-triangle-linear" class="text-amber-600 text-sm flex-shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-semibold text-amber-700 italic leading-relaxed">{order.notes}</p>
                                        </div>
                                    )}

                                    {/* Items */}
                                    <div className="border-t border-black/5 pt-3 space-y-2.5">
                                        {order.items.map((item, i) => {
                                            const drink = isDrinkCategory(item.menu?.category?.name);
                                            return (
                                                <div key={i} className="flex items-start gap-2.5">
                                                    <span className="text-xs font-bold text-black w-7 flex-shrink-0 pt-0.5">
                                                        {item.qty}x
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-black leading-snug">
                                                            {item.menu?.name ?? '—'}
                                                        </p>
                                                        {item.notes && (
                                                            <p className="text-[10px] text-black/50 mt-0.5 flex items-center gap-1 italic font-medium">
                                                                <iconify-icon icon="solar:chat-round-line-linear" class="text-[11px] flex-shrink-0 text-black/30" />
                                                                {item.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <iconify-icon
                                                        icon={drink ? 'solar:cup-hot-linear' : 'solar:fire-linear'}
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
                                            onClick={() => postAction(`/kitchen-orders/${order.id}/prepare`)}
                                            className="flex-1 py-2.5 text-xs font-semibold bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black rounded-xl transition-all shadow-level-1 active:scale-[0.97]"
                                        >
                                            Mulai Memasak
                                        </button>
                                    )}

                                    {order.status === 'preparing' && (<>
                                        <button
                                            onClick={() => postAction(`/kitchen-orders/${order.id}/back`)}
                                            className="py-2.5 px-4 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-[0.97]"
                                            title="Kembalikan Status"
                                        >
                                            <iconify-icon icon="solar:undo-left-round-linear" class="text-sm text-black/60" />
                                            Batal
                                        </button>
                                        <button
                                            onClick={() => postAction(`/kitchen-orders/${order.id}/ready`)}
                                            className="flex-1 py-2.5 text-xs font-semibold bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black rounded-xl transition-all shadow-level-1 active:scale-[0.97]"
                                        >
                                            Siap Diambil
                                        </button>
                                    </>)}

                                    {order.status === 'ready' && (<>
                                        <button
                                            onClick={() => postAction(`/kitchen-orders/${order.id}/back`)}
                                            className="py-2.5 px-4 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-[0.97]"
                                            title="Kembalikan Status"
                                        >
                                            <iconify-icon icon="solar:undo-left-round-linear" class="text-sm text-black/60" />
                                            Batal
                                        </button>
                                        <button
                                            onClick={() => postAction(`/kitchen-orders/${order.id}/complete`)}
                                            className="flex-1 py-2.5 text-xs font-semibold bg-[#BFFF00] hover:bg-[#C8FF5E] active:bg-[#AFEE00] text-black rounded-xl transition-all shadow-level-1 active:scale-[0.97] flex items-center justify-center gap-2"
                                        >
                                            <iconify-icon icon="solar:check-circle-linear" class="text-sm" />
                                            Telah Diambil
                                        </button>
                                    </>)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Tips Banner ── */}
                <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                            <iconify-icon icon="solar:fire-linear" class="text-base text-black" />
                            Tips Dapur Hari Ini
                        </p>
                        <p className="text-xs font-semibold text-black/60 leading-relaxed">
                            Ingat untuk menandai item yang sudah selesai secepat mungkin agar pelayan
                            dapat segera mengantarkannya ke pelanggan. Pesanan yang melebihi{' '}
                            <span className="font-bold text-black">15 menit</span>{' '}
                            akan otomatis ditandai terlambat.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <Link to="/targets-goals"
                            className="px-5 py-2.5 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-colors active:scale-95 shadow-sm">
                            Lihat Target Harian
                        </Link>
                        <Link to="/dashboard"
                            className="px-5 py-2.5 text-xs font-semibold text-black bg-white border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-colors active:scale-95 shadow-sm">
                            Laporan Performa
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

// KitchenOrdersIndex.layout = (page) => <>{page}</>;
