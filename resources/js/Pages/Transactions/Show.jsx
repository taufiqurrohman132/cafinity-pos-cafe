import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Head from "@/Components/Head";
import client from "@/api/client";

function fmt(n) {
    return new Intl.NumberFormat("id-ID").format(n ?? 0);
}

const formatOrderTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const isToday = new Date().toDateString() === d.toDateString();
    const timeStr = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    if (isToday) {
        return `Hari ini, ${timeStr}`;
    }
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) + `, ${timeStr}`;
};

const formatOrderTimeOnly = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";
};

const formatOrderDateLong = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const dateFormatted = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const timeFormatted = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    return `${dateFormatted}, ${timeFormatted}`;
};

const getReceiptDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" });
};

const getReceiptTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const getTableInfo = (id) => {
    if (!id) return "-";
    if (id % 4 === 0) return "Takeaway";
    const area = id % 3 === 0 ? "Area Merokok" : "Area Indoor";
    const table = (id % 12) + 1;
    return `${area} - Meja ${table}`;
};

export default function Show({ transaction }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState(transaction.notes ?? "");

    // Detect active tab from location pathname
    const isInvoicePath = location.pathname.endsWith("/invoice");
    const [activeTab, setActiveTab] = useState(isInvoicePath ? "invoice" : "detail");

    // Sync tab when pathname updates
    useEffect(() => {
        setActiveTab(location.pathname.endsWith("/invoice") ? "invoice" : "detail");
    }, [location.pathname]);

    const subtotal = transaction.items?.reduce((sum, item) => sum + item.subtotal, 0) ?? 0;
    const serviceCharge = Math.round(subtotal * 0.05);

    async function handleRefund() {
        if (!confirm("Yakin refund transaksi ini?")) return;
        try {
            await client.post(`/transactions/${transaction.id}/refund`);
            if (window.routerReload) window.routerReload();
        } catch (err) {
            console.error("Gagal melakukan refund:", err);
            alert("Gagal melakukan refund.");
        }
    }

    async function handlePrint() {
        try {
            await client.post(`/transactions/${transaction.id}/print`);
            alert("Struk berhasil dikirim ke printer.");
        } catch (err) {
            console.error("Gagal mencetak transaksi:", err);
            alert("Gagal mengirim perintah cetak.");
        }
    }

    async function handleSaveNote() {
        try {
            await client.put(`/transactions/${transaction.id}`, { notes: noteText });
            setShowNoteModal(false);
            if (window.routerReload) window.routerReload();
        } catch (err) {
            console.error("Gagal menyimpan catatan:", err);
            alert("Gagal menyimpan catatan.");
        }
    }

    return (
        <>
            <Head title={`Detail Transaksi #${transaction.id}`} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* ── Breadcrumb & Title ── */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/transactions" 
                                className="w-10 h-10 rounded-full bg-white border border-brand-light flex items-center justify-center text-brand-primary/60 hover:text-brand-primary hover:border-brand-primary transition shadow-sm shrink-0"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div className="space-y-1">
                                <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-primary/60 font-medium">
                                    <Link to="/transactions" className="hover:text-brand-primary transition-colors">
                                        Transaksi
                                    </Link>
                                    <span className="text-brand-primary/40">›</span>
                                    <span className="text-brand-dark font-bold">Detail TRX-{transaction.id}</span>
                                </nav>
                                <h1 className="text-2xl sm:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight leading-tight pt-1">
                                    Detail Transaksi
                                </h1>
                            </div>
                        </div>
 
                        {/* Actions */}
                        <div className="flex items-center gap-3 relative">

                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] flex items-center gap-2"
                                >
                                    <span>Tindakan Transaksi</span>
                                    <iconify-icon icon="solar:alt-arrow-down-linear" class="text-xs" />
                                </button>

                                {showDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-brand-light shadow-lg z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                            <Link
                                                to={`/transactions/${transaction.id}/invoice`}
                                                onClick={() => setShowDropdown(false)}
                                                className="w-full px-4 py-2 text-xs text-brand-dark hover:bg-brand-bg font-bold text-left transition-colors flex items-center gap-2 border-b border-brand-light/40"
                                            >
                                                <iconify-icon icon="solar:printer-minimalistic-linear" class="text-base text-brand-primary/60" />
                                                Cetak Invoice
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    handleRefund();
                                                }}
                                                className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold text-left transition-colors flex items-center gap-2"
                                            >
                                                <iconify-icon icon="solar:refresh-circle-broken-linear" class="text-base text-rose-400" />
                                                Refund Transaksi
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Modern Underline Tabs Switcher ── */}
                    <div className="border-b border-brand-light flex items-center gap-8 pt-2">
                        <Link
                            to={`/transactions/${transaction.id}`}
                            className={`pb-3.5 text-sm font-bold relative flex items-center gap-2 transition-all duration-200 ${
                                activeTab === "detail"
                                    ? "text-brand-primary"
                                    : "text-brand-primary/60 hover:text-brand-primary"
                            }`}
                        >
                            <span>Detail Transaksi</span>
                            {activeTab === "detail" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                            )}
                        </Link>
                        <Link
                            to={`/transactions/${transaction.id}/invoice`}
                            className={`pb-3.5 text-sm font-bold relative flex items-center gap-2 transition-all duration-200 ${
                                activeTab === "invoice"
                                    ? "text-brand-primary"
                                    : "text-brand-primary/60 hover:text-brand-primary"
                            }`}
                        >
                            <span>Invoice (Pratinjau Struk)</span>
                            {activeTab === "invoice" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                            )}
                        </Link>
                    </div>

                    {/* ── Tab Content Grid ── */}
                    {activeTab === "detail" ? (
                        /* ── TAB 1: DETAIL TRANSAKSI ── */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                            {/* Left Column (Wider) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Daftar Item Card */}
                                <div className="bg-white rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-brand-light flex items-center justify-between bg-white">
                                        <h3 className="font-bold text-brand-dark text-sm">Daftar Item</h3>
                                        <span className="text-[10px] font-bold bg-amber-50 border border-amber-200/60 text-amber-700 px-3 py-1 rounded-full capitalize">
                                            {transaction.items?.length ?? 0} Item Terdaftar
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-xs text-brand-primary/60 border-b border-brand-light font-bold">
                                                    <th className="py-4 px-6 font-bold">Nama Menu</th>
                                                    <th className="py-4 px-6 font-bold text-center">Qty</th>
                                                    <th className="py-4 px-6 font-bold text-center">Harga Satuan</th>
                                                    <th className="py-4 px-6 font-bold text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xs divide-y divide-brand-light/30">
                                                {transaction.items?.map((item, i) => (
                                                    <tr key={i} className="hover:bg-gradient-to-r hover:from-brand-light/40 hover:to-transparent transition-all cursor-pointer">
                                                        <td className="py-4 px-6 font-bold text-brand-dark">
                                                            {item.menu?.name ?? "Menu"}
                                                        </td>
                                                        <td className="py-4 px-6 text-brand-dark/70 text-center font-normal">
                                                            {item.qty}
                                                        </td>
                                                        <td className="py-4 px-6 text-brand-secondary text-center font-black">
                                                            Rp {fmt(item.price)}
                                                        </td>
                                                        <td className="py-4 px-6 font-black text-brand-secondary text-right">
                                                            Rp {fmt(item.subtotal)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Catatan Internal Card */}
                                <div className="bg-white rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 p-6 space-y-4">
                                    <h3 className="font-bold text-brand-dark text-sm">Catatan Internal</h3>
                                    <div className="border-t border-brand-light/60 pt-4">
                                        {transaction.notes ? (
                                            <div className="bg-brand-bg border border-brand-light p-4 rounded-xl flex items-start gap-3 text-xs text-brand-dark leading-relaxed font-normal">
                                                <iconify-icon icon="solar:info-circle-linear" class="text-lg text-brand-secondary shrink-0 mt-0.5" />
                                                <span>{transaction.notes}</span>
                                            </div>
                                        ) : (
                                            <div className="bg-brand-bg border border-dashed border-brand-light p-6 rounded-xl flex items-center justify-center gap-3 text-xs text-brand-primary/60 font-medium italic">
                                                <iconify-icon icon="solar:info-circle-linear" class="text-lg shrink-0" />
                                                <span>Belum ada catatan untuk transaksi ini. Gunakan menu "Tindakan" untuk menambahkan catatan.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Narrower) */}
                            <div className="space-y-6">
                                {/* Ringkasan Pembayaran Card */}
                                <div className="bg-white rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 p-6 space-y-4">
                                    <h3 className="font-bold text-brand-dark text-sm pb-3 border-b border-brand-light">
                                        Ringkasan Pembayaran
                                    </h3>

                                    <div className="space-y-3.5 text-xs">
                                        <div className="flex justify-between items-center text-brand-primary/60 font-medium">
                                            <span>Subtotal</span>
                                            <span className="font-black text-brand-secondary">Rp {fmt(subtotal)}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-brand-primary/60 font-medium">
                                            <span>Pajak (10%)</span>
                                            <span className="font-black text-brand-secondary">Rp {fmt(transaction.tax)}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-brand-primary/60 font-medium">
                                            <span>Diskon Bundle</span>
                                            <span className="text-[#10b981] font-black">-Rp {fmt(transaction.discount)}</span>
                                        </div>

                                        <div className="border-t border-brand-light pt-4 flex justify-between items-center">
                                            <span className="font-bold text-brand-dark text-xs">Total Akhir</span>
                                            <span className="text-lg font-black text-brand-secondary">Rp {fmt(transaction.total_amount)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-center">
                                        {transaction.status === "completed" ? (
                                            <div className="w-full py-2 bg-[#ecfdf5] border border-emerald-200 text-[#10b981] font-bold text-xs rounded-full text-center capitalize">
                                                Pembayaran Selesai
                                            </div>
                                        ) : transaction.status === "refunded" ? (
                                            <div className="w-full py-2 bg-[#fef2f2] border border-rose-200 text-[#ef4444] font-bold text-xs rounded-full text-center capitalize">
                                                Transaksi Direfund
                                            </div>
                                        ) : transaction.status === "cancelled" ? (
                                            <div className="w-full py-2 bg-brand-bg border border-brand-light text-brand-primary/60 font-bold text-xs rounded-full text-center capitalize">
                                                Transaksi Dibatalkan
                                            </div>
                                        ) : (
                                            <div className="w-full py-2 bg-[#fef3c7] border border-amber-200 text-[#f59e0b] font-bold text-xs rounded-full text-center capitalize">
                                                Menunggu Pembayaran
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Informasi Pelanggan Card */}
                                <div className="bg-white rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 p-6 space-y-4">
                                    <h3 className="font-bold text-brand-dark text-sm pb-3 border-b border-brand-light">
                                        Informasi Pelanggan
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-brand-primary/60 font-medium mb-1 capitalize">Nama</p>
                                            <p className="font-bold text-brand-dark text-xs">Walk-in Guest</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-brand-primary/60 font-medium mb-1 capitalize">Waktu Pesan</p>
                                            <p className="font-bold text-brand-dark text-xs">{formatOrderTime(transaction.created_at)}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-brand-primary/60 font-medium mb-1 capitalize">Meja / Area</p>
                                            <p className="font-bold text-brand-dark text-xs">{getTableInfo(transaction.id)}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-brand-primary/60 font-medium mb-1 capitalize">Dilayani Oleh</p>
                                            <p className="font-bold text-brand-dark text-xs">{transaction.cashier?.name ?? "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ── TAB 2: INVOICE / PRATINJAU STRUK ── */
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                            {/* Left Column: Pratinjau Struk */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 overflow-hidden flex flex-col">
                                    <div className="px-6 py-5 border-b border-brand-light flex items-center gap-2 bg-white">
                                        <iconify-icon icon="solar:bill-list-linear" class="text-xl text-brand-secondary" />
                                        <h3 className="font-bold text-brand-dark text-sm">Pratinjau Struk</h3>
                                    </div>

                                    <div className="p-6 md:p-8 bg-brand-bg flex justify-center items-center border-b border-brand-light">
                                        <div className="bg-white border border-dashed border-brand-light shadow-[0_8px_30px_rgba(0,0,0,0.02)] w-full max-w-[360px] p-6 text-brand-dark flex flex-col font-mono text-xs leading-relaxed">
                                            <div className="text-center space-y-1 mb-4">
                                                <h4 className="font-extrabold text-sm tracking-wide text-brand-dark">SmartCafe</h4>
                                                <p className="text-[10px] text-brand-primary/60">Jl. Menteng Raya No. 42, Jakarta Pusat</p>
                                                <p className="text-[10px] text-brand-primary/60">Telp: (021) 555-0123</p>
                                            </div>

                                            <div className="border-t border-dashed border-brand-light my-2"></div>

                                            <div className="grid grid-cols-2 text-[10px] text-brand-primary/60 gap-y-0.5">
                                                <div>NO: TRX-{transaction.id}</div>
                                                <div className="text-right">TGL: {getReceiptDate(transaction.created_at)}</div>
                                                <div>KASIR: {transaction.cashier?.name ?? "-"}</div>
                                                <div className="text-right">JAM: {getReceiptTime(transaction.created_at)}</div>
                                            </div>

                                            <div className="border-t border-dashed border-brand-light my-2"></div>

                                            <div className="space-y-3 my-2">
                                                {transaction.items?.map((item, i) => (
                                                    <div key={i} className="flex flex-col">
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-bold text-brand-dark max-w-[200px] break-words">
                                                                {item.menu?.name ?? "Menu"}
                                                            </span>
                                                            <span className="font-bold text-brand-dark text-right shrink-0">
                                                                Rp {fmt(item.subtotal)}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] text-brand-primary/60">
                                                            x{item.qty}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t border-dashed border-brand-light my-2"></div>

                                            <div className="space-y-1.5 my-2">
                                                <div className="flex justify-between">
                                                    <span className="text-brand-primary/60">Subtotal</span>
                                                    <span className="font-black text-brand-dark">Rp {fmt(subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-brand-primary/60">Pajak (10%)</span>
                                                    <span className="font-black text-brand-dark">Rp {fmt(transaction.tax)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-brand-primary/60">Service Charge</span>
                                                    <span className="font-black text-brand-dark">Rp {fmt(serviceCharge)}</span>
                                                </div>
                                                {transaction.discount > 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-brand-primary/60">Diskon Bundle</span>
                                                        <span className="font-black text-[#10b981]">-Rp {fmt(transaction.discount)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border-t border-dashed border-brand-light my-2"></div>

                                            <div className="flex justify-between items-center text-sm font-extrabold text-brand-dark my-2">
                                                <span>Total</span>
                                                <span>Rp {fmt(transaction.total_amount)}</span>
                                            </div>

                                            <div className="text-center text-[10px] text-brand-primary/60 italic mt-6 space-y-4">
                                                <p>Terima kasih atas kunjungan Anda!</p>
                                                <div className="w-12 h-12 border border-brand-light rounded mx-auto bg-brand-bg"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-brand-bg flex justify-center">
                                        <p className="text-xs text-brand-primary/60 italic font-medium">
                                            Dokumen ini adalah pratinjau digital dari sistem POS.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Detail & Tindakan */}
                            <div className="space-y-6">
                                {/* Card 1: Detail Transaksi */}
                                <div className="bg-white rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 p-6 space-y-5">
                                    <h3 className="font-bold text-brand-dark text-sm">Detail Transaksi</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-bg text-brand-primary flex items-center justify-center shrink-0 border border-brand-light">
                                                <iconify-icon icon="solar:user-linear" class="text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-brand-primary/60 font-bold tracking-wider capitalize">Pelanggan</p>
                                                <p className="font-bold text-brand-dark text-sm">Walk-in Guest</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-bg text-brand-primary flex items-center justify-center shrink-0 border border-brand-light">
                                                <iconify-icon icon="solar:clock-circle-linear" class="text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-brand-primary/60 font-bold tracking-wider capitalize">Waktu Pemesanan</p>
                                                <p className="font-bold text-brand-dark text-sm">
                                                    {formatOrderTimeOnly(transaction.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-bg text-brand-primary flex items-center justify-center shrink-0 border border-brand-light">
                                                <iconify-icon icon="solar:card-transfer-linear" class="text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-brand-primary/60 font-bold tracking-wider capitalize">Metode Pembayaran</p>
                                                <p className="font-bold text-brand-dark text-sm">
                                                    {transaction.status === "pending" || transaction.status === "held"
                                                        ? "Belum Dipilih (Sistem Pending)"
                                                        : (transaction.payment_method === "cash"
                                                            ? "Tunai (Cash)"
                                                            : (transaction.payment_method?.toUpperCase() ?? "-"))
                                                }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Tindakan Operasional */}
                                <div className="bg-brand-bg rounded-2xl border border-brand-light p-6 space-y-4">
                                    <h3 className="font-bold text-brand-dark text-sm">Tindakan Operasional</h3>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handlePrint}
                                            className="w-full py-3 px-4 bg-[#10b981] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <iconify-icon icon="solar:printer-minimalistic-linear" class="text-base" />
                                            <span>Cetak Ulang Struk (Reprint)</span>
                                        </button>

                                        <button
                                            onClick={handleRefund}
                                            disabled={transaction.status === "refunded"}
                                            className="w-full py-3 px-4 bg-white border border-brand-light hover:bg-brand-bg disabled:opacity-50 disabled:hover:bg-white text-brand-dark font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <iconify-icon icon="solar:refresh-circle-linear" class="text-base text-brand-primary/60" />
                                            <span>Ajukan Pengembalian (Refund)</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setNoteText(transaction.notes ?? "");
                                                setShowNoteModal(true);
                                            }}
                                            className="w-full py-3 px-4 bg-white border border-brand-light hover:bg-brand-bg text-brand-dark font-bold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <iconify-icon icon="solar:document-add-linear" class="text-base text-brand-primary/60" />
                                            <span>
                                                {transaction.notes ? "Edit Catatan Internal" : "Tambah Catatan Internal"}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Card 3: Catatan Internal */}
                                <div className="bg-white rounded-2xl border border-brand-light shadow-sm hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 p-6 space-y-4">
                                    <h3 className="font-bold text-brand-dark text-sm">Catatan Internal</h3>

                                    {transaction.notes ? (
                                        <div className="space-y-4">
                                            <div className="bg-brand-bg border border-brand-light p-4 rounded-xl space-y-3">
                                                <p className="text-xs text-brand-dark italic leading-relaxed">
                                                    "{transaction.notes}"
                                                </p>
                                                <div className="flex justify-between items-center text-[10px] font-bold text-brand-primary/60 border-t border-brand-light pt-2.5">
                                                    <span className="text-brand-primary font-bold">{transaction.cashier?.name ?? "Kasir"}</span>
                                                    <span>Baru saja</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-brand-primary/60 text-xs font-medium italic border border-dashed border-brand-light rounded-xl bg-brand-bg">
                                            Belum ada catatan internal.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Note Edit Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-brand-light animate-in zoom-in-95 duration-150">
                        <h3 className="font-bold text-brand-dark text-base mb-3">Edit Catatan Internal</h3>
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Tulis catatan internal untuk transaksi ini..."
                            className="w-full h-32 px-4 py-3 border border-brand-light rounded-xl text-xs focus:ring-2 focus:ring-brand-light focus:border-brand-secondary resize-none font-medium text-brand-dark focus:outline-none"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowNoteModal(false)}
                                className="px-4 py-2 border border-brand-light rounded-lg text-xs font-bold text-brand-primary/80 hover:bg-brand-bg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveNote}
                                className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-secondary transition-colors shadow-sm active:scale-[0.98]"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
