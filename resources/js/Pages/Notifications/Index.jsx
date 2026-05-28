import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

// ── helpers ───────────────────────────────────────────────────────────────────
function Icon({ icon, className = "" }) {
    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{ __html: `<iconify-icon icon="${icon}"></iconify-icon>` }}
        />
    );
}

const TABS = [
    { id: "all",        label: "Semua Notifikasi" },
    { id: "operational", label: "Operasional & Stok" },
    { id: "review",     label: "Ulasan Pelanggan" },
    { id: "payment",    label: "Pembayaran" },
];

const STATS_CONFIG = [
    { key: "unread",          label: "Belum Dibaca",  color: "emerald" },
    { key: "urgent",          label: "Urgensi Tinggi", color: "rose" },
    { key: "new_reviews",     label: "Ulasan Baru",   color: "amber" },
    { key: "failed_payment",  label: "Gagal Bayar",   color: "orange" },
];

const COLOR_MAP = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose:    "text-rose-600 bg-rose-50 border-rose-100",
    amber:   "text-amber-600 bg-amber-50 border-amber-100",
    orange:  "text-orange-600 bg-orange-50 border-orange-100",
};

function PriorityBadge({ priority }) {
    if (priority === "urgent")    return <span className="ml-2 text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase">Urgent</span>;
    if (priority === "important") return <span className="ml-2 text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Penting</span>;
    return null;
}

function NotifAvatar({ notification }) {
    if (notification.avatar_url) {
        return <img src={notification.avatar_url} className="w-10 h-10 rounded-full flex-shrink-0" alt="" />;
    }

    const iconMap = {
        stock:          { icon: "solar:box-linear",            bg: "bg-gray-50",     text: "text-gray-400" },
        review:         { icon: "solar:star-linear",           bg: "bg-amber-50",    text: "text-amber-500" },
        payment_failed: { icon: "solar:danger-circle-linear",  bg: "bg-orange-50",   text: "text-orange-500" },
        default:        { icon: "solar:bell-linear",           bg: "bg-gray-50",     text: "text-gray-400" },
    };
    const { icon, bg, text } = iconMap[notification.type] ?? iconMap.default;

    return (
        <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center ${text} flex-shrink-0`}>
            <Icon icon={icon} className="text-xl" />
        </div>
    );
}

function NotifActions({ notification, onRead, onDelete }) {
    return (
        <div className="flex gap-4 text-gray-400">
            <button onClick={() => onRead(notification.id)} className="hover:text-emerald-500" title="Tandai dibaca">
                <Icon icon="solar:check-read-linear" className="text-lg" />
            </button>
            <button onClick={() => onDelete(notification.id)} className="hover:text-rose-500" title="Hapus">
                <Icon icon="solar:trash-bin-minimalistic-linear" className="text-lg" />
            </button>
            <button className="hover:text-gray-600" title="Opsi lain">
                <Icon icon="solar:menu-dots-bold" className="text-lg" />
            </button>
        </div>
    );
}

function NotifCard({ notification, onRead, onDelete }) {
    const isRead = notification.is_read;

    return (
        <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 transition ${
            isRead ? "opacity-70" : "border-l-4 border-l-emerald-500"
        }`}>
            <NotifAvatar notification={notification} />

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h4 className="text-sm font-bold text-gray-800">
                            {notification.title}
                            <PriorityBadge priority={notification.priority} />
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{notification.body}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {notification.time_ago}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    {notification.action_label && notification.action_url ? (
                        <a
                            href={notification.action_url}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 transition"
                        >
                            {notification.action_label}
                            <Icon icon="solar:arrow-right-linear" />
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

    function handleReadAll() {
        router.post(route("notifications.read-all"));
    }

    function handleRead(id) {
        router.post(route("notifications.read", id));
    }

    function handleDelete(id) {
        router.delete(route("notifications.destroy", id));
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

    const filtered = activeTab === "all"
        ? notifications.data
        : notifications.data.filter((n) => tabTypeMap[activeTab]?.includes(n.type));

    return (
        <>
            <Head title="Pusat Notifikasi" />

            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* ── Header ── */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pusat Notifikasi</h1>
                            <p className="text-sm text-gray-500">
                                Pantau aktivitas operasional, ulasan pelanggan, dan status sistem secara real-time.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                                <Icon icon="solar:filter-linear" /> Filter Lanjutan
                            </button>
                            <button
                                onClick={handleReadAll}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition"
                            >
                                Tandai Semua Dibaca
                            </button>
                        </div>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {STATS_CONFIG.map(({ key, label, color }) => (
                            <div key={key} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                                <span className="text-sm font-medium text-gray-500">{label}</span>
                                <span className={`text-lg font-bold px-3 py-0.5 rounded-lg border ${COLOR_MAP[color]}`}>
                                    {stats[key] ?? 0}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ── Tabs ── */}
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-200 gap-4">
                        <div className="flex gap-6 md:gap-8">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-bold transition border-b-2 ${
                                        activeTab === tab.id
                                            ? "text-emerald-600 border-emerald-500"
                                            : "text-gray-400 border-transparent hover:text-gray-600"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <span className="pb-4 text-xs text-gray-400 font-medium">
                            Menampilkan {notifications.data?.length ?? 0} dari {notifications.total ?? 0} notifikasi
                        </span>
                    </div>

                    {/* ── Notification List ── */}
                    <div className="space-y-4">
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
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                                <Icon icon="solar:bell-off-linear" className="text-4xl text-gray-300 block mb-3" />
                                <p className="text-sm font-semibold text-gray-400">Tidak ada notifikasi.</p>
                            </div>
                        )}
                    </div>

                    {/* ── Load More ── */}
                    {notifications.next_page_url && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                            >
                                Muat Lebih Banyak
                                <Icon icon="solar:alt-arrow-down-linear" />
                            </button>
                        </div>
                    )}

                    {/* ── Bottom Cards ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm flex-shrink-0">
                                <Icon icon="solar:cup-hot-linear" className="text-2xl" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-gray-800">Tips Efisiensi</h5>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Aktifkan notifikasi mobile untuk mendapatkan peringatan stok kritis secara instan di manapun Anda berada.
                                </p>
                            </div>
                        </div>
                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm flex-shrink-0">
                                <Icon icon="solar:refresh-circle-linear" className="text-2xl" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-gray-800">Sinkronisasi Data</h5>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Sistem melakukan sinkronisasi dengan inventory pusat setiap 15 menit. Terakhir diperbarui: 14:30 WIB.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AppLayout>{page}</AppLayout>;