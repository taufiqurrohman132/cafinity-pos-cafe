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

export default function Invoice({ transaction }) {
    const createdAt = transaction.created_at
        ? new Date(transaction.created_at).toLocaleString("id-ID", {
              day: "2-digit", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
          })
        : "-";

    function handlePrint() {
        router.post(route("transactions.print", transaction.id));
    }

    return (
        <>
            <Head title={`Invoice #${transaction.id}`} />

            <div className="min-h-screen bg-gray-50 p-6 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* ── Header ── */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                #{transaction.id} • {createdAt}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("transactions.show", transaction.id)}
                                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition shadow-sm inline-flex items-center gap-2"
                            >
                                <Icon icon="solar:arrow-left-linear" />
                                Kembali
                            </Link>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition shadow-sm inline-flex items-center gap-2"
                            >
                                <Icon icon="solar:printer-minimalistic-bold" />
                                Cetak
                            </button>
                        </div>
                    </div>

                    {/* ── Invoice Card ── */}
                    <div id="invoice-print" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                        {/* Kasir & Metode */}
                        <div className="px-6 py-5 border-b border-gray-100">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Kasir</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {transaction.cashier?.name ?? "-"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-medium">Metode</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {transaction.payment_method ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="px-6 py-5">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            {["Item", "Qty", "Harga", "Subtotal"].map((h, i) => (
                                                <th
                                                    key={h}
                                                    className={`py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${
                                                        i === 3 ? "text-right" : "text-left"
                                                    }`}
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {transaction.items?.length > 0 ? (
                                            transaction.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td className="py-4 pr-3 text-[13px] text-gray-800 font-medium">
                                                        {item.menu?.name ?? "Menu"}
                                                        {item.notes && (
                                                            <div className="text-[12px] text-gray-500 font-medium mt-1">
                                                                {item.notes}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 text-[13px] text-gray-600">{item.qty}</td>
                                                    <td className="py-4 text-[13px] text-gray-600">
                                                        Rp {fmt(item.price)}
                                                    </td>
                                                    <td className="py-4 text-[13px] font-bold text-gray-900 text-right">
                                                        Rp {fmt(item.subtotal)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-6 text-center text-gray-400">
                                                    Tidak ada item.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="mt-6 space-y-2 text-sm">
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

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-500">
                                Status:{" "}
                                <span className="font-semibold text-gray-800">
                                    {transaction.status
                                        ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                                        : "-"}
                                </span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

Invoice.layout = (page) => <AppLayout>{page}</AppLayout>;