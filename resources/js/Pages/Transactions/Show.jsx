import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

function fmt(n) {
    return new Intl.NumberFormat("id-ID").format(n ?? 0);
}

function Icon({ icon, className = "" }) {
    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{ __html: `<iconify-icon icon="${icon}"></iconify-icon>` }}
        />
    );
}

function StatusBadge({ status }) {
    const map = {
        completed: {
            icon: "solar:check-circle-linear",
            label: "Selesai",
            cls: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
        pending: {
            icon: "solar:clock-circle-linear",
            label: "Pending",
            cls: "text-amber-600 bg-amber-50 border-amber-100",
        },
    };
    const s = map[status] ?? {
        icon: "solar:close-circle-linear",
        label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "-",
        cls: "text-rose-600 bg-rose-50 border-rose-100",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold border px-3 py-1 rounded-full ${s.cls}`}>
            <Icon icon={s.icon} className="text-[13px]" />
            {s.label}
        </span>
    );
}

function SummaryRow({ label, value, bold = false, border = false }) {
    return (
        <div className={`flex items-center justify-between ${border ? "pt-2 border-t border-gray-100" : ""}`}>
            <span className={bold ? "text-gray-800 font-semibold" : "text-gray-500"}>{label}</span>
            <span className={bold ? "text-gray-900 font-bold" : "font-semibold text-gray-900"}>
                Rp {fmt(value)}
            </span>
        </div>
    );
}

export default function Show({ transaction }) {
    const createdAt = transaction.created_at
        ? new Date(transaction.created_at).toLocaleString("id-ID", {
              day: "2-digit", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
          })
        : "-";

    function handleRefund() {
        if (!confirm("Yakin refund transaksi ini?")) return;
        router.post(route("transactions.refund", transaction.id));
    }

    return (
        <>
            <Head title={`Detail Transaksi #${transaction.id}`} />

            <div className="min-h-screen bg-gray-50 p-6 md:p-8">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* ── Header ── */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Detail Transaksi</h1>
                            <p className="text-sm text-gray-400 mt-1">Invoice #{transaction.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("transactions.invoice", transaction.id)}
                                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition shadow-sm inline-flex items-center gap-2"
                            >
                                <Icon icon="solar:printer-minimalistic-linear" />
                                Cetak
                            </Link>
                            <button
                                onClick={handleRefund}
                                className="px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition shadow-sm inline-flex items-center gap-2"
                            >
                                <Icon icon="solar:refresh-circle-broken-linear" />
                                Refund
                            </button>
                        </div>
                    </div>

                    {/* ── Summary Cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <p className="text-xs text-gray-400 font-medium">Kasir</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                {transaction.cashier?.name ?? "-"}
                            </p>
                            <div className="mt-4">
                                <p className="text-xs text-gray-400 font-medium">Waktu</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">{createdAt}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <p className="text-xs text-gray-400 font-medium">Status</p>
                            <div className="mt-2">
                                <StatusBadge status={transaction.status} />
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-gray-400 font-medium">Metode Pembayaran</p>
                                <p className="text-base font-semibold text-gray-900 mt-1">
                                    {transaction.payment_method ?? "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Items Table ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-900">Item Transaksi</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {["Menu", "Qty", "Harga", "Subtotal", "Catatan"].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 capitalize tracking-wider"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transaction.items?.length > 0 ? (
                                        transaction.items.map((item, i) => (
                                            <tr key={i} className="hover:bg-gray-50/60 transition">
                                                <td className="px-6 py-4 text-[13px] text-gray-800 font-medium">
                                                    {item.menu?.name ?? "Menu"}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-gray-600">{item.qty}</td>
                                                <td className="px-6 py-4 text-[13px] text-gray-600">
                                                    Rp {fmt(item.price)}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] font-bold text-gray-900">
                                                    Rp {fmt(item.subtotal)}
                                                </td>
                                                <td className="px-6 py-4 text-[13px] text-gray-600">
                                                    {item.notes ?? "-"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-6 text-center text-gray-400">
                                                Tidak ada item.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Totals + Kitchen ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Ringkasan */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
                            <h2 className="text-base font-bold text-gray-900">Ringkasan</h2>
                            <div className="mt-4 space-y-2 text-sm">
                                <SummaryRow label="Diskon"    value={transaction.discount} />
                                <SummaryRow label="Pajak"     value={transaction.tax} />
                                <SummaryRow label="Total"     value={transaction.total_amount}  bold border />
                                <SummaryRow label="Dibayar"   value={transaction.paid_amount} />
                                <SummaryRow label="Kembalian" value={transaction.change_amount} />
                            </div>
                            {transaction.notes && (
                                <div className="mt-4">
                                    <p className="text-xs text-gray-400 font-medium">Notes</p>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{transaction.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Kitchen Order */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-base font-bold text-gray-900">Kitchen Order</h2>
                            <div className="mt-4 space-y-2">
                                <p className="text-xs text-gray-400 font-medium">Status</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {transaction.kitchen_order?.status ?? "-"}
                                </p>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-gray-400 font-medium">Items</p>
                                <div className="mt-2 space-y-2">
                                    {transaction.kitchen_order?.items?.length > 0 ? (
                                        transaction.kitchen_order.items.map((kItem, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">
                                                    {kItem.menu?.name ?? "Menu"}
                                                </span>
                                                <span className="font-semibold text-gray-900">x{kItem.qty}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">Belum ada data.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <AppLayout>{page}</AppLayout>;