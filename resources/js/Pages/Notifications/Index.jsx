import React, { useState, useEffect, useMemo } from "react";
import Head from "@/Components/Head";
import { Icon } from "@iconify/react";
import client from "@/api/client";

// ── helpers ───────────────────────────────────────────────────────────────────
const TABS = [
    { id: "all", label: "Semua Notifikasi" },
    { id: "operational", label: "Operasional & Stok" },
    { id: "review", label: "Ulasan Pelanggan" },
    { id: "payment", label: "Pembayaran" },
];

const STATS_CONFIG = [
    { key: "unread", label: "Belum Dibaca", icon: "solar:bell-bing-linear", colorClass: "bg-brand-primary/10 text-brand-primary border-brand-primary/20" },
    { key: "urgent", label: "Urgensi Tinggi", icon: "solar:danger-triangle-linear", colorClass: "bg-rose-50 text-rose-600 border-rose-100" },
    { key: "new_reviews", label: "Ulasan Baru", icon: "solar:star-linear", colorClass: "bg-amber-50 text-amber-500 border-amber-100" },
    { key: "failed_payment", label: "Gagal Bayar", icon: "solar:card-send-linear", colorClass: "bg-orange-50 text-orange-600 border-orange-100" },
];

const getNotifAvatarConfig = (type) => {
    const configs = {
        stock: {
            icon: "solar:box-minimalistic-linear",
            bg: "bg-orange-50 text-orange-600 border border-orange-100"
        },
        system: {
            icon: "solar:shield-warning-linear",
            bg: "bg-brand-primary/5 text-brand-primary border border-brand-primary/10"
        },
        review: {
            icon: "solar:chat-round-like-linear",
            bg: "bg-amber-50 text-amber-500 border border-amber-100"
        },
        payment_failed: {
            icon: "solar:card-send-linear",
            bg: "bg-rose-50 text-rose-500 border border-rose-100"
        },
        payment: {
            icon: "solar:card-transfer-linear",
            bg: "bg-emerald-50 text-emerald-500 border border-emerald-100"
        },
        default: {
            icon: "solar:bell-linear",
            bg: "bg-gray-50 text-gray-500 border border-gray-100"
        }
    };
    return configs[type] || configs.default;
};

function PriorityBadge({ priority }) {
    if (priority === "urgent") {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md font-extrabold capitalize tracking-wider ml-2">
                <Icon icon="solar:danger-triangle-bold" className="text-xs" />
                Urgent
            </span>
        );
    }
    if (priority === "important") {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-md font-extrabold capitalize tracking-wider ml-2">
                <Icon icon="solar:info-circle-bold" className="text-xs" />
                Penting
            </span>
        );
    }
    return null;
}

function NotifActions({ notification, onRead, onDelete }) {
    return (
        <div className="flex gap-1">
            {!notification.is_read && (
                <button
                    onClick={() => onRead(notification.id)}
                    className="p-2 text-brand-primary hover:text-brand-secondary hover:bg-brand-light/40 rounded-xl transition-all duration-150 active:scale-[0.97]"
                    title="Tandai dibaca"
                >
                    <Icon icon="solar:check-read-linear" className="text-lg" />
                </button>
            )}
            <button
                onClick={() => onDelete(notification.id)}
                className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-150 active:scale-[0.97]"
                title="Hapus"
            >
                <Icon icon="solar:trash-bin-trash-linear" className="text-lg" />
            </button>
        </div>
    );
}

function NotifCard({ notification, onRead, onDelete }) {
    const isRead = notification.is_read;
    const avatarConfig = getNotifAvatarConfig(notification.type);

    return (
        <div
            className={`bg-white p-5 rounded-2xl border transition-all duration-200 flex gap-4 ${isRead
                ? "border-brand-light/60 opacity-65 hover:opacity-90"
                : "border-brand-light shadow-sm border-l-4 border-l-brand-primary hover:shadow-md"
                }`}
        >
            {notification.avatar_url ? (
                <img
                    src={notification.avatar_url}
                    className="w-12 h-12 rounded-xl flex-shrink-0 border border-brand-light object-cover"
                    alt=""
                />
            ) : (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${avatarConfig.bg}`}>
                    <Icon icon={avatarConfig.icon} />
                </div>
            )}

            <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="min-w-0">
                        <h4 className="text-base font-semibold leading-6 text-brand-dark flex items-center flex-wrap gap-1">
                            {notification.title}
                            <PriorityBadge priority={notification.priority} />
                        </h4>
                        <p className="text-sm font-normal leading-5 text-brand-dark/70 mt-1 break-words">{notification.body}</p>
                    </div>
                    <span className="text-xs font-medium text-brand-dark/40 whitespace-nowrap sm:self-start">
                        {notification.time_ago}
                    </span>
                </div>

                <div className="flex justify-between items-center gap-4">
                    {notification.action_label && notification.action_url ? (
                        <a
                            href={notification.action_url}
                            className="inline-flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-dark shadow-sm shadow-brand-primary/10 transition-all duration-150 active:scale-[0.95]"
                        >
                            {notification.action_label}
                            <Icon icon="solar:arrow-right-linear" className="text-sm" />
                        </a>
                    ) : (
                        <span />
                    )}
                    <NotifActions notification={notification} onRead={onRead} onDelete={onDelete} />
                </div>
            </div>
        </div>
    );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function Index({ notifications: initialNotifications, stats: initialStats }) {
    const [notifications, setNotifications] = useState(initialNotifications || { data: [], next_page_url: null });
    const [stats, setStats] = useState(initialStats || {});
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("all");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'unread' | 'read'
    const [filterPriority, setFilterPriority] = useState("all"); // 'all' | 'urgent' | 'important' | 'normal'

    useEffect(() => {
        if (initialNotifications) {
            setNotifications(initialNotifications);
        }
        if (initialStats) {
            setStats(initialStats);
        }
    }, [initialNotifications, initialStats]);

    async function handleReadAll() {
        try {
            await client.post('/notifications/read-all');
            setNotifications(prev => ({
                ...prev,
                data: prev.data.map(n => ({ ...n, is_read: true }))
            }));
            setStats(prev => ({
                ...prev,
                unread: 0,
                urgent: 0,
                new_reviews: 0,
                failed_payment: 0
            }));
        } catch (err) {
            console.error("Gagal menandai semua dibaca:", err);
        }
    }

    async function handleRead(id) {
        try {
            await client.post(`/notifications/${id}/read`);

            // Find notification to update stats
            const notif = notifications.data.find(n => n.id === id);

            setNotifications(prev => ({
                ...prev,
                data: prev.data.map(n => n.id === id ? { ...n, is_read: true } : n)
            }));

            if (notif && !notif.is_read) {
                setStats(prev => {
                    const updated = { ...prev };
                    if (updated.unread > 0) updated.unread--;
                    if (notif.type === 'payment_failed' && updated.failed_payment > 0) {
                        updated.failed_payment--;
                        updated.urgent--;
                    }
                    if (notif.type === 'review' && updated.new_reviews > 0) {
                        updated.new_reviews--;
                    }
                    return updated;
                });
            }
        } catch (err) {
            console.error("Gagal menandai dibaca:", err);
        }
    }

    async function handleDelete(id) {
        try {
            await client.delete(`/notifications/${id}`);

            // Find notification to adjust stats if it was unread
            const notif = notifications.data.find(n => n.id === id);

            setNotifications(prev => ({
                ...prev,
                data: prev.data.filter(n => n.id !== id),
                total: (prev.total || 1) - 1
            }));

            if (notif && !notif.is_read) {
                setStats(prev => {
                    const updated = { ...prev };
                    if (updated.unread > 0) updated.unread--;
                    if (notif.type === 'payment_failed' && updated.failed_payment > 0) {
                        updated.failed_payment--;
                        updated.urgent--;
                    }
                    if (notif.type === 'review' && updated.new_reviews > 0) {
                        updated.new_reviews--;
                    }
                    return updated;
                });
            }
        } catch (err) {
            console.error("Gagal menghapus notifikasi:", err);
        }
    }

    async function handleLoadMore() {
        if (!notifications.next_page_url || loading) return;

        setLoading(true);
        try {
            const urlObj = new URL(notifications.next_page_url, window.location.origin);
            const page = urlObj.searchParams.get('page');

            const res = await client.get(`/notifications`, { params: { page } });

            setNotifications(prev => ({
                ...res.data.notifications,
                data: [...prev.data, ...(res.data.notifications?.data || [])]
            }));
        } catch (err) {
            console.error("Gagal memuat notifikasi lainnya:", err);
        } finally {
            setLoading(false);
        }
    }

    // client-side tab filter (type field from backend)
    const tabTypeMap = {
        all: null,
        operational: ["stock", "system"],
        review: ["review"],
        payment: ["payment_failed", "payment"],
    };

    const filtered = useMemo(() => {
        let list = notifications.data || [];

        // 1. Filter by Tab
        if (activeTab !== "all") {
            list = list.filter((n) => tabTypeMap[activeTab]?.includes(n.type));
        }

        // 2. Filter by Status
        if (filterStatus === "unread") {
            list = list.filter((n) => !n.is_read);
        } else if (filterStatus === "read") {
            list = list.filter((n) => n.is_read);
        }

        // 3. Filter by Priority
        if (filterPriority !== "all") {
            list = list.filter((n) => n.priority === filterPriority);
        }

        return list;
    }, [notifications.data, activeTab, filterStatus, filterPriority]);

    return (
        <>
            <Head title="Pusat Notifikasi" />

            <div className="min-h-screen bg-brand-bg font-inter text-brand-dark p-4 md:p-6 space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">
                            Pusat Notifikasi
                        </h1>
                        <p className="text-sm font-medium text-brand-dark/60 mt-1">
                            Pantau aktivitas operasional, ulasan pelanggan, dan status sistem secara real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold transition-all active:scale-[0.97] duration-150 ${showFilterPanel ? 'border-brand-primary text-brand-primary shadow-sm shadow-brand-primary/10' : 'border-brand-light text-brand-dark hover:bg-brand-light/20'}`}
                        >
                            <Icon icon="solar:filter-linear" className="text-lg" />
                            Filter Lanjutan
                        </button>
                        <button
                            onClick={handleReadAll}
                            className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-primary/25 transition-all active:scale-[0.97] duration-150 whitespace-nowrap"
                        >
                            <Icon icon="solar:check-read-linear" className="text-lg" />
                            Tandai Semua Dibaca
                        </button>
                    </div>
                </div>

                {/* ── Advanced Filter Panel ── */}
                <div
                    className={`bg-white border border-brand-light shadow-sm rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-300 ease-in-out overflow-hidden ${showFilterPanel
                        ? "max-h-[500px] opacity-100 p-5 mt-2 translate-y-0 scale-100 visible"
                        : "max-h-0 opacity-0 p-0 m-0 translate-y-[-10px] scale-95 invisible pointer-events-none"
                        }`}
                >
                    <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-brand-dark/60 tracking-wider mb-1.5">
                            Status Notifikasi
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: "all", label: "Semua" },
                                { id: "unread", label: "Belum Dibaca" },
                                { id: "read", label: "Sudah Dibaca" }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setFilterStatus(opt.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-[0.97] ${filterStatus === opt.id ? "border-brand-primary bg-brand-primary text-white shadow-sm" : "border-brand-light bg-brand-bg text-brand-dark hover:bg-brand-light/30"}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-brand-dark/60 tracking-wider mb-1.5">
                            Tingkat Urgensi
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: "all", label: "Semua" },
                                { id: "urgent", label: "Urgent" },
                                { id: "important", label: "Penting" },
                                { id: "normal", label: "Normal" }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setFilterPriority(opt.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-[0.97] ${filterPriority === opt.id ? "border-brand-primary bg-brand-primary text-white shadow-sm" : "border-brand-light bg-brand-bg text-brand-dark hover:bg-brand-light/30"}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS_CONFIG.map(({ key, label, icon, colorClass }) => (
                        <div
                            key={key}
                            className="bg-white p-5 rounded-2xl border border-brand-light flex justify-between items-center shadow-level-1 stat-card-glow group transition-all duration-300"
                        >
                            <div className="space-y-1">
                                <span className="text-xs font-extrabold text-brand-dark/50 tracking-wider">{label}</span>
                                <p className="text-2xl font-bold text-brand-dark">{stats[key] ?? 0}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass} flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                                <Icon icon={icon} className="text-xl" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Style for smooth tab switching ── */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes notifFadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(8px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-notif-fade-in {
                        animation: notifFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                `}} />

                {/* ── Tabs ── */}
                <div className="flex flex-wrap items-center justify-between border-b border-brand-light gap-4">
                    <div className="flex gap-6 md:gap-8">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 border-b-2 text-sm font-bold transition-all ${
                                    activeTab === tab.id
                                        ? "border-[#BFFF00] text-brand-dark"
                                        : "border-transparent text-brand-dark/50 hover:text-brand-dark hover:border-brand-dark/20"
                                } active:scale-[0.97]`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <span className="pb-3 text-xs font-medium text-brand-dark/50">
                        Menampilkan {filtered.length} dari {notifications.total ?? 0} notifikasi
                    </span>
                </div>

                {/* ── Notification List ── */}
                <div
                    className="space-y-4 animate-notif-fade-in"
                    key={`${activeTab}-${filterStatus}-${filterPriority}`}
                >
                    {filtered.length > 0 ? (
                        filtered.map((notif) => (
                            <NotifCard
                                key={notif.id}
                                notification={notif}
                                onRead={handleRead}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl border border-brand-light p-12 text-center flex flex-col items-center justify-center shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-brand-light/30 flex items-center justify-center text-brand-primary/30 text-4xl mb-4">
                                <Icon icon="solar:bell-off-linear" />
                            </div>
                            <p className="text-base font-semibold text-brand-dark">Tidak ada notifikasi.</p>
                            <p className="text-sm font-normal text-brand-dark/50 mt-1 leading-5">
                                Anda telah membaca semua notifikasi atau tidak ada data yang cocok dengan kriteria filter.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Load More ── */}
                {notifications.next_page_url && (
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleLoadMore}
                            className="flex items-center gap-2 px-6 py-2.5 border border-[#D0D0D0] bg-white text-brand-dark hover:bg-[#E6E6E6] hover:border-[#999999] rounded-xl text-sm font-semibold transition-all active:scale-[0.97]"
                        >
                            Muat Lebih Banyak
                            <Icon icon="solar:alt-arrow-down-linear" className="text-lg animate-bounce" />
                        </button>
                    </div>
                )}

                {/* ── Bottom Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <div className="bg-brand-light/10 p-5 rounded-2xl border border-brand-light flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary border border-brand-light/50 shadow-sm flex-shrink-0">
                            <Icon icon="solar:cup-hot-linear" className="text-xl" />
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-brand-dark">Tips Efisiensi</h5>
                            <p className="text-xs font-normal text-brand-dark/60 mt-1 leading-5">
                                Aktifkan notifikasi mobile untuk mendapatkan peringatan stok kritis secara instan di manapun Anda berada.
                            </p>
                        </div>
                    </div>
                    <div className="bg-brand-light/10 p-5 rounded-2xl border border-brand-light flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary border border-brand-light/50 shadow-sm flex-shrink-0">
                            <Icon icon="solar:refresh-circle-linear" className="text-xl" />
                        </div>
                        <div>
                            <h5 className="text-sm font-bold text-brand-dark">Sinkronisasi Data</h5>
                            <p className="text-xs font-normal text-brand-dark/60 mt-1 leading-5">
                                Sistem melakukan sinkronisasi dengan inventory pusat setiap 15 menit. Terakhir diperbarui: 14:30 WIB.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
