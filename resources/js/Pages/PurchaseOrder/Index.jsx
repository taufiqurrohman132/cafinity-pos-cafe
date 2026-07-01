// PurchaseOrder/Index.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Head from '@/Components/Head'
import client from '@/api/client'
import PurchaseOrderSkeleton from '@/Components/Skeletons/PurchaseOrderSkeleton'
import { useConfirm } from '@/context/ConfirmContext'

export default function PurchaseOrderIndex() {
    const confirm = useConfirm()
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)

    const [orders, setOrders] = useState(null)
    const [stats, setStats] = useState(null)
    const [recentApprovals, setRecentApprovals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const [search, setSearch] = useState(queryParams.get('search') || '')
    const status = queryParams.get('status') || ''

    // Fetch data whenever location.search or refreshTrigger changes
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            try {
                setError(null)
                const res = await client.get(`/purchase-orders${location.search}`)
                setOrders(res.data.orders)
                setStats(res.data.stats)
                setRecentApprovals(res.data.recentApprovals || [])

                const qParams = new URLSearchParams(location.search)
                setSearch(qParams.get('search') || '')
            } catch (err) {
                console.error("Gagal mengambil data purchase order:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [location.search, refreshTrigger])

    function handleSearch(e) {
        e.preventDefault()
        const qParams = new URLSearchParams(location.search)
        if (search) {
            qParams.set('search', search)
        } else {
            qParams.delete('search')
        }
        qParams.delete('page') // Reset page on new search
        navigate(`/purchase-orders?${qParams.toString()}`, { replace: true })
    }

    function handleStatus(statusVal) {
        const qParams = new URLSearchParams(location.search)
        if (statusVal) {
            qParams.set('status', statusVal)
        } else {
            qParams.delete('status')
        }
        qParams.delete('page') // Reset page on status change
        navigate(`/purchase-orders?${qParams.toString()}`, { replace: true })
    }

    async function handleApprove(id) {
        if (!await confirm({
            title: 'Setujui Purchase Order?',
            message: 'Apakah Anda yakin ingin menyetujui Purchase Order ini?',
            isDanger: false,
            confirmText: 'Setujui',
            cancelText: 'Batal'
        })) return
        try {
            await client.post(`/purchase-orders/${id}/approve`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menyetujui Purchase Order:", err)
            alert("Gagal menyetujui Purchase Order.")
        }
    }

    async function handleReject(id) {
        if (!await confirm({
            title: 'Tolak Purchase Order?',
            message: 'Apakah Anda yakin ingin menolak Purchase Order ini?',
            isDanger: true,
            confirmText: 'Tolak',
            cancelText: 'Batal'
        })) return
        try {
            await client.post(`/purchase-orders/${id}/reject`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menolak Purchase Order:", err)
            alert("Gagal menolak Purchase Order.")
        }
    }

    async function handleReceive(id) {
        if (!await confirm({
            title: 'Terima Barang?',
            message: 'Tandai barang telah diterima dan update stok inventaris?',
            isDanger: false,
            confirmText: 'Terima',
            cancelText: 'Batal'
        })) return
        try {
            await client.post(`/purchase-orders/${id}/receive`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menandai barang diterima:", err)
            alert("Gagal menandai barang diterima.")
        }
    }

    const getRelativeUrl = (url) => {
        if (!url) return '#'
        try {
            const parsed = new URL(url)
            return `/purchase-orders${parsed.search}`
        } catch (e) {
            if (url.includes('?')) {
                return `/purchase-orders?${url.split('?')[1]}`
            }
            return '/purchase-orders'
        }
    }

    function formatRupiah(amount) {
        return 'Rp ' + Number(amount).toLocaleString('id-ID')
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    if (loading && !orders) {
        return (
            <>
                <Head title="Daftar Purchase Order" />
                <PurchaseOrderSkeleton />
            </>
        )
    }

    if (error && !orders) {
        return (
            <>
                <Head title="Daftar Purchase Order" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat data purchase order dari server. Silakan coba lagi.
                        </p>
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all active:scale-[0.97]">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Head title="Daftar Purchase Order" />

            <div className="min-h-screen bg-brand-bg">
                <div className="grid grid-cols-1 xl:grid-cols-12">

                    {/* ── MAIN CONTENT ── */}
                    <div className="xl:col-span-9 p-4 md:p-6 space-y-6">

                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">Daftar Purchase Order</h1>
                                <p className="text-xs md:text-sm text-black/60 font-medium mt-1">Kelola dan pantau semua pesanan pembelian perusahaan Anda di satu tempat.</p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-transparent border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-200 active:scale-[0.97] whitespace-nowrap">
                                    <iconify-icon icon="solar:import-linear" class="text-base"></iconify-icon>
                                    Import
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-transparent border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-200 active:scale-[0.97] whitespace-nowrap">
                                    <iconify-icon icon="solar:export-linear" class="text-base"></iconify-icon>
                                    Export CSV
                                </button>
                                <Link
                                    to="/purchase-orders/create"
                                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-black bg-[#BFFF00] hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] rounded-xl transition-all duration-200 shadow-md active:scale-[0.98] whitespace-nowrap"
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
                                    iconBg: 'bg-[#E6E6E6]/50 text-black',
                                },
                                {
                                    label: 'Menunggu Persetujuan',
                                    value: stats?.pending_approvals ?? 0,
                                    sub: `${stats?.urgent_orders ?? 0} PO bersifat Mendesak`,
                                    subColor: 'text-orange-500',
                                    icon: 'solar:danger-triangle-linear',
                                    iconBg: 'bg-amber-50 text-amber-700',
                                },
                                {
                                    label: 'Menunggu Penerimaan',
                                    value: stats?.waiting_delivery ?? 0,
                                    sub: 'Estimasi kirim aktif',
                                    subColor: 'text-emerald-500',
                                    icon: 'solar:check-circle-linear',
                                    iconBg: 'bg-emerald-50 text-emerald-700',
                                },
                            ].map((card) => (
                                <div key={card.label} className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 p-6 stat-card-glow hover:border-neutral-300 transition-all duration-300 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-semibold text-black/60 tracking-tight">{card.label}</p>
                                            <h2 className="text-2xl font-extrabold text-brand-dark mt-3">{card.value}</h2>
                                            <p className={`text-xs font-semibold mt-3 ${card.subColor}`}>{card.sub}</p>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm ${card.iconBg}`}>
                                            <iconify-icon icon={card.icon} class="text-xl"></iconify-icon>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table Card */}
                        <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-level-1 overflow-hidden">

                            {/* Table Header Controls */}
                            <div className="px-6 py-5 border-b border-[#E6E6E6] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1 flex gap-2 max-w-md">
                                    <form onSubmit={handleSearch} className="w-full relative">
                                        <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 text-base"></iconify-icon>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari Nomor PO, Supplier, atau Approver..."
                                            className="w-full h-11 pl-10 pr-4 text-sm font-normal text-black bg-white border border-[#D0D0D0] rounded-xl placeholder-[#999999] placeholder:italic outline-none focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10 transition-all shadow-sm"
                                        />
                                    </form>
                                    {(search || status) && (
                                        <Link to="/purchase-orders" className="border border-[#D0D0D0] bg-transparent text-black hover:bg-[#E6E6E6] hover:border-[#999999] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center active:scale-[0.98]">
                                            Reset
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatus(e.target.value)}
                                        className="text-xs border border-[#D0D0D0] rounded-xl py-2.5 px-4 bg-white transition-all outline-none font-semibold text-black cursor-pointer focus:border-[#BFFF00] focus:ring-2 focus:ring-[#BFFF00]/10"
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
                                        <tr className="bg-[#E6E6E6]/20 border-b border-[#E6E6E6]">
                                            <th className="pl-6 pr-3 py-3 w-4">
                                                <input type="checkbox" className="rounded border-[#D0D0D0] focus:ring-2 focus:ring-[#BFFF00]/10 focus:border-[#BFFF00] transition-all" />
                                            </th>
                                            {['Nomor PO', 'Tanggal', 'Supplier', 'Total Nilai', 'Est. Kirim', 'Status', 'Pembuat', 'Aksi'].map((h) => (
                                                <th key={h} className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E6E6E6]/50">
                                        {orders.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-[#E6E6E6]/50 flex items-center justify-center">
                                                            <iconify-icon icon="solar:document-text-linear" class="text-3xl text-[#999999]"></iconify-icon>
                                                        </div>
                                                        <p className="text-sm font-semibold text-black">Belum ada data purchase order.</p>
                                                        <Link to="/purchase-orders/create" className="text-[13px] font-semibold text-[#666666] hover:text-black flex items-center gap-1.5 transition-colors">
                                                            <iconify-icon icon="solar:add-circle-linear" class="text-sm"></iconify-icon>
                                                            Buat purchase order pertama
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : orders.data.map((order) => {
                                            const poNumber = order.po_number || `PO-${String(order.id).padStart(4, '0')}`
                                            const isUrgent = order.status === 'pending' && (!order.delivery_date || new Date(order.delivery_date) <= new Date())
                                            const statusClass = {
                                                approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                pending: 'bg-amber-50 text-amber-700 border-amber-200',
                                                received: 'bg-blue-50 text-blue-700 border-blue-200',
                                                rejected: 'bg-rose-50 text-rose-700 border-rose-200',
                                            }[order.status] || 'bg-[#E6E6E6] text-[#666666] border-[#D0D0D0]'

                                            const statusText = {
                                                approved: 'Approved',
                                                pending: 'Pending',
                                                received: 'Received',
                                                rejected: 'Rejected',
                                            }[order.status] || order.status

                                            return (
                                                <tr key={order.id} className="hover:bg-[#E6E6E6]/30 active:bg-[#E6E6E6]/60 transition-all duration-200 cursor-pointer">
                                                    <td className="pl-6 pr-3 py-4">
                                                        <input type="checkbox" className="rounded border-[#D0D0D0] focus:ring-2 focus:ring-[#BFFF00]/10 focus:border-[#BFFF00] transition-all" />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                to={`/purchase-orders/${order.id}`}
                                                                className="text-[12px] font-semibold text-[#000000] font-mono hover:underline"
                                                            >
                                                                {poNumber}
                                                            </Link>
                                                            {isUrgent && (
                                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
                                                                    Urgent
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-[13px] text-[#666666]">
                                                        {formatDate(order.ordered_at || order.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-[13px] font-medium text-[#000000] truncate max-w-[160px]" title={order.supplier?.name || '-'}>
                                                            {order.supplier?.name || '-'}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 text-[14px] font-semibold text-[#000000]">
                                                        {formatRupiah(order.total_amount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-[13px] text-[#666666]">
                                                        {formatDate(order.delivery_date)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusClass}`}>
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-[13px] text-[#666666] truncate max-w-[120px]" title={order.created_by_user?.name || order.user?.name || '-'}>
                                                            {order.created_by_user?.name || order.user?.name || '-'}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Link
                                                                to={`/purchase-orders/${order.id}`}
                                                                className="w-8 h-8 rounded-xl bg-transparent border border-[#D0D0D0] hover:bg-[#E6E6E6] hover:border-[#999999] flex items-center justify-center text-[#666666] hover:text-black active:scale-[0.97] transition-all"
                                                                title="Detail"
                                                            >
                                                                <iconify-icon icon="solar:eye-linear" class="text-base"></iconify-icon>
                                                            </Link>

                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleApprove(order.id)}
                                                                        className="w-8 h-8 rounded-xl bg-transparent border border-[#D0D0D0] hover:bg-emerald-50 hover:border-emerald-200 flex items-center justify-center text-[#666666] hover:text-emerald-600 active:scale-[0.97] transition-all"
                                                                        title="Approve"
                                                                    >
                                                                        <iconify-icon icon="solar:check-circle-linear" class="text-base"></iconify-icon>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(order.id)}
                                                                        className="w-8 h-8 rounded-xl bg-transparent border border-[#D0D0D0] hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center text-[#666666] hover:text-rose-600 active:scale-[0.97] transition-all"
                                                                        title="Reject"
                                                                    >
                                                                        <iconify-icon icon="solar:close-circle-linear" class="text-base"></iconify-icon>
                                                                    </button>
                                                                    <Link
                                                                        to={`/purchase-orders/${order.id}/edit`}
                                                                        className="w-8 h-8 rounded-xl bg-transparent border border-[#D0D0D0] hover:bg-amber-50 hover:border-amber-200 flex items-center justify-center text-[#666666] hover:text-amber-600 active:scale-[0.97] transition-all"
                                                                        title="Edit"
                                                                    >
                                                                        <iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon>
                                                                    </Link>
                                                                </>
                                                            )}

                                                            {order.status === 'approved' && (
                                                                <button
                                                                    onClick={() => handleReceive(order.id)}
                                                                    className="w-8 h-8 rounded-xl bg-transparent border border-[#D0D0D0] hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center text-[#666666] hover:text-blue-600 active:scale-[0.97] transition-all"
                                                                    title="Terima Barang"
                                                                >
                                                                    <iconify-icon icon="solar:box-linear" class="text-base"></iconify-icon>
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
                            <div className="px-6 py-4 border-t border-[#E6E6E6] flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
                                <p className="text-xs font-semibold text-black/50">
                                    Menampilkan {orders.from ?? 0}–{orders.to ?? 0} dari {orders.total} Purchase Order
                                </p>
                                <div className="flex items-center gap-1">
                                    {orders.links?.map((link, i) => (
                                        <Link
                                            key={i}
                                            to={getRelativeUrl(link.url)}
                                            className={`px-3 py-1.5 text-xs rounded-xl border font-semibold transition-all duration-150 active:scale-95 ${link.active
                                                ? 'bg-[#BFFF00] text-black border-[#BFFF00] shadow-sm'
                                                : 'border-[#D0D0D0] bg-transparent text-black hover:bg-[#E6E6E6] hover:border-[#999999]'
                                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SIDEBAR (Right) ── */}
                    <div className="xl:col-span-3 border-l border-[#E6E6E6] bg-white p-4 md:p-6 space-y-6">

                        {/* Recent Activity Log */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-semibold text-black/50 tracking-tight capitalize flex items-center gap-2">
                                    <iconify-icon icon="solar:history-linear" class="text-black text-lg"></iconify-icon>
                                    Aktivitas Terkini
                                </h3>
                                <a href="#" className="group text-xs font-semibold text-black hover:underline transition-colors flex items-center gap-0.5"><span>Lihat Semua</span><iconify-icon icon="solar:alt-arrow-right-linear" class="text-xs transition-transform duration-200 group-hover:translate-x-0.5" /></a>
                            </div>

                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#E6E6E6]">
                                {recentApprovals && recentApprovals.length > 0 ? (
                                    recentApprovals.map((appr, idx) => (
                                        <div key={idx} className="relative pl-8">
                                            <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white
                                                ${appr.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <div className="text-xs text-black/80 font-normal mb-1 leading-normal">
                                                <span className="font-semibold text-black">{appr.approver?.name || 'User'}</span>{' '}
                                                <span className="text-gray-500">
                                                    {appr.status === 'approved' ? 'menyetujui' : 'menolak'} PO
                                                </span>{' '}
                                                <Link to={`/purchase-orders/${appr.purchase_order_id}`} className="font-semibold text-black hover:underline">
                                                    #{appr.purchase_order?.po_number || `PO-${appr.purchase_order_id}`}
                                                </Link>
                                            </div>
                                            <span className="text-[10px] text-black/50 font-normal block">
                                                {appr.acted_at_diff || appr.created_at_diff || 'Baru saja'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {/* Mock timelines mimicking screenshot */}
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
                                            <div className="text-xs text-black/80 font-normal mb-1">
                                                <span className="font-semibold text-black">Budi Santoso</span> <span class="text-gray-500">menyetujui PO</span> <span class="font-semibold text-black hover:underline">#PO-2024-001</span>
                                            </div>
                                            <span className="text-[10px] text-black/50 font-normal block">2 jam yang lalu</span>
                                        </div>
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-amber-500 border-4 border-white rounded-full"></span>
                                            <div className="text-xs text-black/80 font-normal mb-1">
                                                <span className="font-semibold text-black">Siti Aminah</span> <span class="text-gray-500">membuat draft PO baru untuk Supplier CV. Makmur</span>
                                            </div>
                                            <span className="text-[10px] text-black/50 font-normal block">4 jam yang lalu</span>
                                        </div>
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-rose-500 border-4 border-white rounded-full"></span>
                                            <div className="text-xs text-black/80 font-normal mb-1">
                                                <span className="font-semibold text-black">Alex Manager</span> <span class="text-gray-500">membatalkan PO</span> <span class="font-semibold text-black hover:underline">#PO-2023-998</span>
                                            </div>
                                            <span className="text-[10px] text-black/50 font-normal block">Kemarin, 16:45</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* System Announcements */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E6E6] shadow-level-1 space-y-4">
                            <h4 className="text-xs font-semibold text-black tracking-tight flex items-center gap-2">
                                <iconify-icon icon="solar:bell-bing-linear" class="text-red-500 text-lg"></iconify-icon>
                                Pemberitahuan Sistem
                            </h4>

                            <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-3">
                                <iconify-icon icon="solar:danger-triangle-bold" class="text-red-500 text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                                <p className="text-xs font-semibold text-rose-800 leading-normal">
                                    {stats?.late_deliveries > 0
                                        ? `${stats.late_deliveries} PO melewati tanggal estimasi pengiriman. Segera hubungi supplier terkait.`
                                        : '3 PO melewati tanggal estimasi pengiriman. Segera hubungi supplier terkait.'}
                                </p>
                            </div>

                            <button className="w-full border border-[#D0D0D0] bg-transparent text-black hover:bg-[#E6E6E6] hover:border-[#999999] py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2">
                                Buka Laporan Keterlambatan
                            </button>
                        </div>

                    </div>
                </div>

                {/* Footer bar */}
                <div className="border-t border-brand-light bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    <p className="text-[10px] text-gray-400">© 2024 Purchase Order Management System</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400">
                        <a href="#" className="hover:text-brand-primary transition-colors">Support</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </>
    )
}

// PurchaseOrderIndex.layout = (page) => <>{page}</>;
