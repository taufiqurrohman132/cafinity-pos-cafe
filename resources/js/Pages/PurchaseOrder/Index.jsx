// PurchaseOrder/Index.jsx
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import AppLayout from '@/Layouts/AppLayout'

export default function PurchaseOrderIndex({
    orders,
    stats,
    recentApprovals,
    filters,
}) {
    const { url } = usePage()
    const params = new URLSearchParams(url.split('?')[1] || '')

    const [search, setSearch] = useState(params.get('search') || '')
    const status = params.get('status') || ''

    useEffect(() => {
        setSearch(params.get('search') || '')
    }, [url])

    function handleSearch(e) {
        e.preventDefault()
        router.get(route('purchase-orders.index'), { search, status }, { preserveState: true, replace: true })
    }

    function handleStatus(statusVal) {
        router.get(route('purchase-orders.index'), { search, status: statusVal }, { preserveState: true, replace: true })
    }

    function handleApprove(id) {
        if (!confirm('Setujui Purchase Order ini?')) return
        router.post(route('purchase-orders.approve', id), {}, { preserveScroll: true })
    }

    function handleReject(id) {
        if (!confirm('Tolak Purchase Order ini?')) return
        router.post(route('purchase-orders.reject', id), {}, { preserveScroll: true })
    }

    function handleReceive(id) {
        if (!confirm('Tandai barang telah diterima dan update stok?')) return
        router.post(route('purchase-orders.receive', id), {}, { preserveScroll: true })
    }

    function formatRupiah(amount) {
        return 'Rp ' + Number(amount).toLocaleString('id-ID')
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    return (
        <>
            <Head title="Daftar Purchase Order" />

            <div className="min-h-screen bg-[#fbfbfe]">
                <div className="grid grid-cols-1 xl:grid-cols-12">

                    {/* ── MAIN CONTENT ── */}
                    <div className="xl:col-span-9 p-4 md:p-6 space-y-6">

                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#050316]">Daftar Purchase Order</h1>
                                <p className="text-gray-500 mt-1">Kelola dan pantau semua pesanan pembelian perusahaan Anda di satu tempat.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                                    <iconify-icon icon="solar:import-linear" class="text-lg"></iconify-icon>
                                    Import
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                                    <iconify-icon icon="solar:export-linear" class="text-lg"></iconify-icon>
                                    Export CSV
                                </button>
                                <Link
                                    href={route('purchase-orders.create')}
                                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] hover:bg-[#443dff] rounded-xl transition shadow-sm"
                                >
                                    <iconify-icon icon="solar:plus-linear" class="text-base"></iconify-icon>
                                    Buat PO Baru
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                {
                                    label: 'Total Purchase Orders',
                                    value: stats?.total_orders ?? 0,
                                    sub: '+12% dari bulan lalu',
                                    subColor: 'text-green-500',
                                    icon: 'solar:document-text-linear',
                                    iconBg: 'bg-[#dddbff] text-[#2f27ce]',
                                },
                                {
                                    label: 'Menunggu Persetujuan',
                                    value: stats?.pending_approvals ?? 0,
                                    sub: `${stats?.urgent_orders ?? 0} PO bersifat Mendesak`,
                                    subColor: 'text-orange-500',
                                    icon: 'solar:danger-triangle-linear',
                                    iconBg: 'bg-orange-100 text-orange-500',
                                },
                                {
                                    label: 'Menunggu Penerimaan',
                                    value: stats?.waiting_delivery ?? 0,
                                    sub: 'Estimasi kirim aktif',
                                    subColor: 'text-emerald-500',
                                    icon: 'solar:check-circle-linear',
                                    iconBg: 'bg-emerald-100 text-emerald-500',
                                },
                            ].map((card) => (
                                <div key={card.label} className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500">{card.label}</p>
                                            <h2 className="text-2xl font-bold text-[#050316] mt-3">{card.value}</h2>
                                            <p className={`text-xs font-semibold mt-3 ${card.subColor}`}>{card.sub}</p>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                                            <iconify-icon icon={card.icon} class="text-xl"></iconify-icon>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Card */}
                        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                            {/* Table Header Controls */}
                            <div className="px-6 py-5 border-b border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1 flex gap-2 max-w-md">
                                    <form onSubmit={handleSearch} className="w-full relative">
                                        <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></iconify-icon>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari Nomor PO, Supplier, atau Approver..."
                                            className="w-full h-10 pl-9 pr-4 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dddbff]"
                                        />
                                    </form>
                                    { (search || status) && (
                                        <Link href={route('purchase-orders.index')} className="border border-[#dddbff] hover:bg-gray-50 text-gray-500 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center">
                                            Reset
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatus(e.target.value)}
                                        className="text-xs border-[#dddbff] rounded-xl py-2.5 px-4 focus:ring-[#2f27ce] focus:border-[#2f27ce] bg-[#fbfbfe]"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="pending">Pending Approval</option>
                                        <option value="approved">Approved</option>
                                        <option value="received">Received</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* Table Element */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[900px]">
                                    <thead>
                                        <tr className="text-xs font-medium text-gray-400 bg-[#fbfbfe] border-b border-[#dddbff]">
                                            <th className="pl-6 pr-3 py-3 w-4">
                                                <input type="checkbox" className="rounded border-[#dddbff] text-[#2f27ce] focus:ring-[#2f27ce]" />
                                            </th>
                                            {['Nomor PO', 'Tanggal', 'Supplier', 'Total Nilai', 'Est. Kirim', 'Status', 'Pembuat', 'Aksi'].map((h) => (
                                                <th key={h} className="px-6 py-3">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-[#dddbff]">
                                        {orders.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-10 text-center text-gray-400 text-sm">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <iconify-icon icon="solar:document-text-linear" class="text-4xl text-[#443dff]"></iconify-icon>
                                                        <p>Belum ada data purchase order.</p>
                                                        <Link href={route('purchase-orders.create')} className="text-[#2f27ce] font-semibold hover:underline text-xs">
                                                            + Buat purchase order pertama
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : orders.data.map((order) => {
                                            const poNumber = order.po_number || `PO-${String(order.id).padStart(4, '0')}`
                                            const isUrgent = order.status === 'pending' && (!order.delivery_date || new Date(order.delivery_date) <= new Date())
                                            const statusClass = {
                                                approved: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
                                                pending: 'bg-amber-50 text-amber-600 border border-amber-100',
                                                received: 'bg-blue-50 text-blue-600 border border-blue-100',
                                                rejected: 'bg-red-50 text-red-600 border border-red-100',
                                            }[order.status] || 'bg-gray-50 text-gray-600 border border-gray-100'

                                            const statusText = {
                                                approved: 'Approved',
                                                pending: 'Pending Approval',
                                                received: 'Received',
                                                rejected: 'Rejected',
                                            }[order.status] || order.status

                                            return (
                                                <tr key={order.id} className="hover:bg-[#fbfbfe] transition">
                                                    <td className="pl-6 pr-3 py-4">
                                                        <input type="checkbox" className="rounded border-[#dddbff] text-[#2f27ce] focus:ring-[#2f27ce]" />
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-[#2f27ce] hover:underline">
                                                        <Link href={route('purchase-orders.show', order.id)}>
                                                            {poNumber}
                                                        </Link>
                                                        {isUrgent && (
                                                            <span className="ml-1.5 px-2 py-0.5 text-[9px] font-bold rounded bg-red-100 text-red-600 uppercase tracking-wide">Urgent</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {formatDate(order.ordered_at || order.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-[#050316]">
                                                        {order.supplier?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-[#050316]">
                                                        {formatRupiah(order.total_amount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {formatDate(order.delivery_date)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {order.created_by_user?.name || order.user?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={route('purchase-orders.show', order.id)}
                                                                className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition"
                                                                title="Detail"
                                                            >
                                                                <iconify-icon icon="solar:eye-linear" class="text-lg"></iconify-icon>
                                                            </Link>
                                                            
                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleApprove(order.id)}
                                                                        className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-300 transition"
                                                                        title="Approve"
                                                                    >
                                                                        <iconify-icon icon="solar:check-circle-linear" class="text-lg"></iconify-icon>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(order.id)}
                                                                        className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition"
                                                                        title="Reject"
                                                                    >
                                                                        <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                                                                    </button>
                                                                    <Link
                                                                        href={route('purchase-orders.edit', order.id)}
                                                                        className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-amber-500 hover:border-amber-300 transition"
                                                                        title="Edit"
                                                                    >
                                                                        <iconify-icon icon="solar:pen-linear" class="text-lg"></iconify-icon>
                                                                    </Link>
                                                                </>
                                                            )}

                                                            {order.status === 'approved' && (
                                                                <button
                                                                    onClick={() => handleReceive(order.id)}
                                                                    className="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition"
                                                                    title="Terima Barang"
                                                                >
                                                                    <iconify-icon icon="solar:box-linear" class="text-lg"></iconify-icon>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer / Pagination */}
                            <div className="px-6 py-4 border-t border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
                                <p className="text-xs text-gray-400">
                                    Menampilkan {orders.from ?? 0}–{orders.to ?? 0} dari {orders.total} Purchase Order
                                </p>
                                <div className="flex items-center gap-1">
                                    {orders.links?.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url ?? '#'}
                                            className={`px-3 py-1 text-xs rounded-lg border transition ${link.active
                                                    ? 'bg-[#2f27ce] text-white border-[#2f27ce]'
                                                    : 'border-[#dddbff] text-gray-500 hover:border-[#2f27ce] hover:text-[#2f27ce]'
                                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SIDEBAR (Right) ── */}
                    <div className="xl:col-span-3 border-l border-[#dddbff] bg-white p-4 md:p-6 space-y-6">

                        {/* Recent Activity Log */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-gray-400 capitalize tracking-wider flex items-center gap-2">
                                    <iconify-icon icon="solar:history-linear" class="text-[#2f27ce] text-lg"></iconify-icon>
                                    Aktivitas Terkini
                                </h3>
                                <a href="#" className="text-[11px] font-semibold text-[#2f27ce] hover:underline">Lihat Semua</a>
                            </div>
                            
                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#dddbff]">
                                {recentApprovals && recentApprovals.length > 0 ? (
                                    recentApprovals.map((appr, idx) => (
                                        <div key={idx} className="relative pl-8">
                                            <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white
                                                ${appr.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <div className="text-[11px] mb-1 leading-normal">
                                                <span className="font-bold text-[#050316]">{appr.approver?.name || 'User'}</span>{' '}
                                                <span className="text-gray-500">
                                                    {appr.status === 'approved' ? 'menyetujui' : 'menolak'} PO
                                                </span>{' '}
                                                <Link href={route('purchase-orders.show', appr.purchase_order_id)} className="font-bold text-[#2f27ce] hover:underline">
                                                    #{appr.purchase_order?.po_number || `PO-${appr.purchase_order_id}`}
                                                </Link>
                                            </div>
                                            <span className="text-[9px] text-gray-400 font-medium block">
                                                {appr.acted_at_diff || appr.created_at_diff || 'Baru saja'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {/* Mock timelines mimicking screenshot */}
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
                                            <div className="text-[11px] mb-1">
                                                <span className="font-bold text-[#050316]">Budi Santoso</span> <span class="text-gray-500">menyetujui PO</span> <span class="font-bold text-[#2f27ce]">#PO-2024-001</span>
                                            </div>
                                            <span className="text-[9px] text-gray-400 font-medium block">2 jam yang lalu</span>
                                        </div>
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-amber-500 border-4 border-white rounded-full"></span>
                                            <div className="text-[11px] mb-1">
                                                <span className="font-bold text-[#050316]">Siti Aminah</span> <span class="text-gray-500">membuat draft PO baru untuk Supplier CV. Makmur</span>
                                            </div>
                                            <span className="text-[9px] text-gray-400 font-medium block">4 jam yang lalu</span>
                                        </div>
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-rose-500 border-4 border-white rounded-full"></span>
                                            <div className="text-[11px] mb-1">
                                                <span className="font-bold text-[#050316]">Alex Manager</span> <span class="text-gray-500">membatalkan PO</span> <span class="font-bold text-[#2f27ce]">#PO-2023-998</span>
                                            </div>
                                            <span className="text-[9px] text-gray-400 font-medium block">Kemarin, 16:45</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* System Announcements */}
                        <div className="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-[#050316] flex items-center gap-2">
                                <iconify-icon icon="solar:bell-bing-linear" class="text-red-500 text-lg"></iconify-icon>
                                Pemberitahuan Sistem
                            </h4>
                            
                            <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-3">
                                <iconify-icon icon="solar:danger-triangle-bold" class="text-red-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                                <p className="text-[11px] font-semibold text-rose-800 leading-normal">
                                    {stats?.late_deliveries > 0 
                                        ? `${stats.late_deliveries} PO melewati tanggal estimasi pengiriman. Segera hubungi supplier terkait.`
                                        : '3 PO melewati tanggal estimasi pengiriman. Segera hubungi supplier terkait.'}
                                </p>
                            </div>
                            
                            <button className="w-full border border-[#dddbff] hover:bg-[#dddbff]/20 text-[#2f27ce] py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                                Buka Laporan Keterlambatan
                            </button>
                        </div>

                    </div>
                </div>

                {/* Footer bar */}
                <div className="border-t border-[#dddbff] bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    <p className="text-[10px] text-gray-400">© 2024 Purchase Order Management System</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400">
                        <a href="#" className="hover:underline">Support</a>
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Terms of Service</a>
                    </div>
                </div>
            </div>
        </>
    )
}

PurchaseOrderIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
