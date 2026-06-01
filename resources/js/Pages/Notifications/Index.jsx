import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import AppLayout from "@/Layouts/AppLayout";

// ── helpers ───────────────────────────────────────────────────────────────────
const TABS = [
    { id: "all",         label: "Semua Notifikasi" },
    { id: "operational", label: "Operasional & Stok" },
    { id: "review",      label: "Ulasan Pelanggan" },
    { id: "payment",     label: "Pembayaran" },
];

const STATS_CONFIG = [
    { key: "unread",          label: "Belum Dibaca",   icon: "solar:bell-bing-linear",           colorClass: "bg-[#2f27ce]/10 text-[#2f27ce] border-[#2f27ce]/20" },
    { key: "urgent",          label: "Urgensi Tinggi",  icon: "solar:danger-triangle-linear",     colorClass: "bg-rose-50 text-rose-600 border-rose-100" },
    { key: "new_reviews",     label: "Ulasan Baru",    icon: "solar:star-linear",                colorClass: "bg-amber-50 text-amber-500 border-amber-100" },
    { key: "failed_payment",  label: "Gagal Bayar",    icon: "solar:card-send-linear",           colorClass: "bg-orange-50 text-orange-600 border-orange-100" },
];

const getNotifAvatarConfig = (type) => {
    const configs = {
        stock: {
            icon: "solar:box-minimalistic-linear",
            bg: "bg-orange-50 text-orange-600 border border-orange-100"
        },
        system: {
            icon: "solar:shield-warning-linear",
            bg: "bg-[#2f27ce]/5 text-[#2f27ce] border border-[#2f27ce]/10"
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
            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider ml-2">
                <Icon icon="solar:danger-triangle-bold" className="text-xs" />
                Urgent
            </span>
        );
    }
    if (priority === "important") {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider ml-2">
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
                    className="p-2 text-[#2f27ce] hover:text-[#443dff] hover:bg-[#dddbff]/40 rounded-xl transition-all duration-150"
                    title="Tandai dibaca"
                >
                    <Icon icon="solar:check-read-linear" className="text-lg" />
                </button>
            )}
            <button
                onClick={() => onDelete(notification.id)}
                className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-150"
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
            className={`bg-white p-5 rounded-2xl border transition-all duration-200 flex gap-4 ${
                isRead
                    ? "border-[#dddbff]/60 opacity-65 hover:opacity-90"
                    : "border-[#dddbff] shadow-sm border-l-4 border-l-[#2f27ce] hover:shadow-md"
            }`}
        >
            {notification.avatar_url ? (
                <img
                    src={notification.avatar_url}
                    className="w-12 h-12 rounded-xl flex-shrink-0 border border-[#dddbff] object-cover"
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
                        <h4 className="text-sm font-bold text-[#050316] flex items-center flex-wrap gap-1">
                            {notification.title}
                            <PriorityBadge priority={notification.priority} />
                        </h4>
                        <p className="text-sm text-[#050316]/70 mt-1 leading-relaxed break-words">{notification.body}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#2f27ce]/50 whitespace-nowrap sm:self-start">
                        {notification.time_ago}
                    </span>
                </div>

                <div className="flex justify-between items-center gap-4">
                    {notification.action_label && notification.action_url ? (
                        <a
                            href={notification.action_url}
                            className="inline-flex items-center gap-1.5 bg-[#2f27ce] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#050316] shadow-sm shadow-[#2f27ce]/10 transition-all duration-150 active:scale-[0.95]"
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
export default function Index({ notifications, stats }) {
    const [activeTab, setActiveTab] = useState("all");
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'unread' | 'read'
    const [filterPriority, setFilterPriority] = useState("all"); // 'all' | 'urgent' | 'important' | 'normal'

    function handleReadAll() {
        router.post(route("notifications.read-all"));
    }

    function handleRead(id) {
        router.post(route("notifications.read", id), {}, { preserveScroll: true });
    }

    function handleDelete(id) {
        router.delete(route("notifications.destroy", id), { preserveScroll: true });
    }

    function handleLoadMore() {
        if (notifications.next_page_url) {
            router.get(notifications.next_page_url, {}, { preserveScroll: true });
        }
    }

    // client-side tab filter (type field from backend)
    const tabTypeMap = {
        all:         null,
        operational: ["stock", "system"],
        review:      ["review"],
        payment:     ["payment_failed", "payment"],
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

            <div className="min-h-screen bg-[#fbfbfe] font-inter text-[#050316] p-4 md:p-6 space-y-6">
                
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Pusat Notifikasi
                        </h1>
                        <p className="text-sm text-[#2f27ce]/70 font-medium mt-1">
                            Pantau aktivitas operasional, ulasan pelanggan, dan status sistem secara real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-bold transition-all active:scale-[0.98] duration-150 ${
                                showFilterPanel
                                    ? 'border-[#2f27ce] text-[#2f27ce] shadow-sm shadow-[#2f27ce]/10'
                                    : 'border-[#dddbff] text-[#050316] hover:bg-[#dddbff]/20'
                            }`}
                        >
                            <Icon icon="solar:filter-linear" className="text-lg" />
                            Filter Lanjutan
                        </button>
                        <button
                            onClick={handleReadAll}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/25 transition-all active:scale-[0.98] duration-150 whitespace-nowrap"
                        >
                            <Icon icon="solar:check-read-linear" className="text-lg" />
                            Tandai Semua Dibaca
                        </button>
                    </div>
                </div>

                {/* ── Advanced Filter Panel ── */}
                <div
                    className={`bg-white border border-[#dddbff] shadow-sm rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-300 ease-in-out overflow-hidden ${
                        showFilterPanel
                            ? "max-h-[500px] opacity-100 p-5 mt-2 translate-y-0 scale-100 visible"
                            : "max-h-0 opacity-0 p-0 m-0 translate-y-[-10px] scale-95 invisible pointer-events-none"
                    }`}
                >
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-widest">
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
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-[0.97] ${
                                        filterStatus === opt.id
                                            ? "border-[#2f27ce] bg-[#2f27ce] text-white shadow-sm"
                                            : "border-[#dddbff] bg-[#fbfbfe] text-[#050316] hover:bg-[#dddbff]/30"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-widest">
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
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-[0.97] ${
                                        filterPriority === opt.id
                                            ? "border-[#2f27ce] bg-[#2f27ce] text-white shadow-sm"
                                            : "border-[#dddbff] bg-[#fbfbfe] text-[#050316] hover:bg-[#dddbff]/30"
                                    }`}
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
                            className="bg-white p-5 rounded-2xl border border-[#dddbff] flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-[#2f27ce]/50 uppercase tracking-widest">{label}</span>
                                <p className="text-2xl font-black text-[#050316]">{stats[key] ?? 0}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass} flex-shrink-0`}>
                                <Icon icon={icon} className="text-xl" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Style for smooth tab switching ── */}
                <style dangerouslySetInnerHTML={{ __html: `
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
                <div className="flex flex-wrap items-center justify-between border-b border-[#dddbff] gap-4">
                    <div className="flex gap-6 md:gap-8">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 text-sm font-extrabold transition-all duration-300 border-b-2 relative ${
                                    activeTab === tab.id
                                        ? "text-[#2f27ce] border-[#2f27ce]"
                                        : "text-[#050316]/50 border-transparent hover:text-[#050316]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <span className="pb-4 text-xs text-[#050316]/50 font-bold">
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
                        <div className="bg-white rounded-2xl border border-[#dddbff] p-12 text-center flex flex-col items-center justify-center shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-[#dddbff]/30 flex items-center justify-center text-[#2f27ce]/30 text-4xl mb-4">
                                <Icon icon="solar:bell-off-linear" />
                            </div>
                            <p className="font-bold text-[#050316]">Tidak ada notifikasi.</p>
                            <p className="text-sm text-[#2f27ce]/50 mt-1 font-medium">
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
                            className="flex items-center gap-2 px-6 py-2.5 border border-[#dddbff] bg-white text-[#2f27ce] rounded-xl text-sm font-bold hover:bg-[#dddbff]/20 transition-all active:scale-[0.98]"
                        >
                            Muat Lebih Banyak
                            <Icon icon="solar:alt-arrow-down-linear" className="text-lg animate-bounce" />
                        </button>
                    </div>
                )}

                {/* ── Bottom Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <div className="bg-[#dddbff]/10 p-5 rounded-2xl border border-[#dddbff] flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2f27ce] border border-[#dddbff]/50 shadow-sm flex-shrink-0">
                            <Icon icon="solar:cup-hot-linear" className="text-xl" />
                        </div>
                        <div>
                            <h5 className="text-sm font-extrabold text-[#050316]">Tips Efisiensi</h5>
                            <p className="text-xs text-[#050316]/60 mt-1 leading-relaxed font-medium">
                                Aktifkan notifikasi mobile untuk mendapatkan peringatan stok kritis secara instan di manapun Anda berada.
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#dddbff]/10 p-5 rounded-2xl border border-[#dddbff] flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#2f27ce] border border-[#dddbff]/50 shadow-sm flex-shrink-0">
                            <Icon icon="solar:refresh-circle-linear" className="text-xl" />
                        </div>
                        <div>
                            <h5 className="text-sm font-extrabold text-[#050316]">Sinkronisasi Data</h5>
                            <p className="text-xs text-[#050316]/60 mt-1 leading-relaxed font-medium">
                                Sistem melakukan sinkronisasi dengan inventory pusat setiap 15 menit. Terakhir diperbarui: 14:30 WIB.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

Index.layout = (page) => <AppLayout>{page}</AppLayout>;