// PurchaseOrder/Index.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Head from '@/Components/Head'
import client from '@/api/client'
import PurchaseOrderSkeleton from '@/Components/Skeletons/PurchaseOrderSkeleton'

export default function PurchaseOrderIndex() {
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
        if (!confirm('Setujui Purchase Order ini?')) return
        try {
            await client.post(`/purchase-orders/${id}/approve`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menyetujui Purchase Order:", err)
            alert("Gagal menyetujui Purchase Order.")
        }
    }

    async function handleReject(id) {
        if (!confirm('Tolak Purchase Order ini?')) return
        try {
            await client.post(`/purchase-orders/${id}/reject`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menolak Purchase Order:", err)
            alert("Gagal menolak Purchase Order.")
        }
    }

    async function handleReceive(id) {
        if (!confirm('Tandai barang telah diterima dan update stok?')) return
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
                        <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-dark transition-all">
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
                                <h1 className="text-2xl md:text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight">Daftar Purchase Order</h1>
                                <p className="text-xs md:text-sm text-brand-primary/60 font-medium mt-1">Kelola dan pantau semua pesanan pembelian perusahaan Anda di satu tempat.</p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-brand-primary bg-white border border-brand-light rounded-xl hover:bg-brand-light hover:text-brand-dark transition-all duration-200 active:scale-[0.98] whitespace-nowrap">
                                    <iconify-icon icon="solar:import-linear" class="text-base"></iconify-icon>
                                    Import
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-brand-primary bg-white border border-brand-light rounded-xl hover:bg-brand-light hover:text-brand-dark transition-all duration-200 active:scale-[0.98] whitespace-nowrap">
                                    <iconify-icon icon="solar:export-linear" class="text-base"></iconify-icon>
                                    Export CSV
                                </button>
                                <Link
                                    to="/purchase-orders/create"
                                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary rounded-xl transition-all duration-200 shadow-lg shadow-brand-primary/30 active:scale-[0.98] whitespace-nowrap"
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
                                    iconBg: 'bg-brand-light text-brand-primary',
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
                                <div key={card.label} className="bg-white rounded-2xl border border-brand-light shadow-sm p-6 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500">{card.label}</p>
                                            <h2 className="text-2xl font-bold text-brand-dark mt-3">{card.value}</h2>
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
                        <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">

                            {/* Table Header Controls */}
                            <div className="px-6 py-5 border-b border-brand-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1 flex gap-2 max-w-md">
                                    <form onSubmit={handleSearch} className="w-full relative">
                                        <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary/50 text-base"></iconify-icon>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari Nomor PO, Supplier, atau Approver..."
                                            className="w-full h-11 pl-10 pr-4 text-[13px] bg-brand-bg border border-brand-light rounded-xl placeholder-brand-primary/50 outline-none focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all duration-200 shadow-sm font-semibold text-brand-dark"
                                        />
                                    </form>
                                    {(search || status) && (
                                        <Link to="/purchase-orders" className="border border-brand-light bg-white hover:bg-brand-light hover:text-brand-dark text-brand-primary px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center active:scale-[0.98]">
                                            Reset
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatus(e.target.value)}
                                        className="text-xs border border-brand-light rounded-xl py-2.5 px-4 focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary bg-brand-bg transition-all outline-none font-semibold text-brand-dark"
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
                                        <tr className="text-xs font-extrabold text-brand-primary/60 bg-brand-bg border-b border-brand-light tracking-wider text-[11px] uppercase">
                                            <th className="pl-6 pr-3 py-3.5 w-4">
                                                <input type="checkbox" className="rounded border-brand-light text-brand-primary focus:ring-4 focus:ring-brand-light/50 focus:ring-offset-0 focus:border-brand-secondary transition-all" />
                                            </th>
                                            {['Nomor PO', 'Tanggal', 'Supplier', 'Total Nilai', 'Est. Kirim', 'Status', 'Pembuat', 'Aksi'].map((h) => (
                                                <th key={h} className="px-6 py-3.5">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-brand-light">
                                        {orders.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-10 text-center text-gray-400 text-sm">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <iconify-icon icon="solar:document-text-linear" class="text-4xl text-brand-secondary"></iconify-icon>
                                                        <p>Belum ada data purchase order.</p>
                                                        <Link to="/purchase-orders/create" className="text-brand-primary font-semibold hover:underline text-xs">
                                                            + Buat purchase order pertama
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : orders.data.map((order) => {
                                            const poNumber = order.po_number || `PO-${String(order.id).padStart(4, '0')}`
                                            const isUrgent = order.status === 'pending' && (!order.delivery_date || new Date(order.delivery_date) <= new Date())
                                            const statusClass = {
                                                approved: 'bg-emerald-50 text-emerald-500 border border-emerald-100',
                                                pending: 'bg-amber-50 text-amber-500 border border-amber-100',
                                                received: 'bg-blue-50 text-blue-500 border border-blue-100',
                                                rejected: 'bg-rose-50 text-rose-500 border border-rose-100',
                                            }[order.status] || 'bg-gray-50 text-gray-500 border border-gray-100'

                                            const statusText = {
                                                approved: 'Approved',
                                                pending: 'Pending Approval',
                                                received: 'Received',
                                                rejected: 'Rejected',
                                            }[order.status] || order.status

                                            return (
                                                <tr key={order.id} className="hover:bg-gradient-to-r hover:from-brand-light/40 hover:to-transparent transition-all cursor-pointer">
                                                    <td className="pl-6 pr-3 py-4">
                                                        <input type="checkbox" className="rounded border-brand-light text-brand-primary focus:ring-4 focus:ring-brand-light/50 focus:ring-offset-0 focus:border-brand-secondary transition-all" />
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-brand-primary hover:underline">
                                                        <Link to={`/purchase-orders/${order.id}`}>
                                                            {poNumber}
                                                        </Link>
                                                        {isUrgent && (
                                                            <span className="ml-1.5 px-2 py-0.5 text-[9px] font-bold rounded bg-rose-50 text-rose-500 border border-rose-100 uppercase tracking-wide">Urgent</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                                        {formatDate(order.ordered_at || order.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-brand-dark">
                                                        {order.supplier?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[14px] font-black text-brand-secondary">
                                                            {formatRupiah(order.total_amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                                        {formatDate(order.delivery_date)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 font-medium">
                                                        {order.created_by_user?.name || order.user?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                to={`/purchase-orders/${order.id}`}
                                                                className="w-8 h-8 rounded-xl bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:shadow-sm active:scale-90 transition-all duration-150"
                                                                title="Detail"
                                                            >
                                                                <iconify-icon icon="solar:eye-linear" class="text-lg"></iconify-icon>
                                                            </Link>

                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleApprove(order.id)}
                                                                        className="w-8 h-8 rounded-xl bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:border-emerald-300 hover:shadow-sm active:scale-90 transition-all duration-150"
                                                                        title="Approve"
                                                                    >
                                                                        <iconify-icon icon="solar:check-circle-linear" class="text-lg"></iconify-icon>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(order.id)}
                                                                        className="w-8 h-8 rounded-xl bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-rose-500 hover:border-rose-300 hover:shadow-sm active:scale-90 transition-all duration-150"
                                                                        title="Reject"
                                                                    >
                                                                        <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                                                                    </button>
                                                                    <Link
                                                                        to={`/purchase-orders/${order.id}/edit`}
                                                                        className="w-8 h-8 rounded-xl bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-amber-500 hover:border-amber-300 hover:shadow-sm active:scale-90 transition-all duration-150"
                                                                        title="Edit"
                                                                    >
                                                                        <iconify-icon icon="solar:pen-linear" class="text-lg"></iconify-icon>
                                                                    </Link>
                                                                </>
                                                            )}

                                                            {order.status === 'approved' && (
                                                                <button
                                                                    onClick={() => handleReceive(order.id)}
                                                                    className="w-8 h-8 rounded-xl bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-300 hover:shadow-sm active:scale-90 transition-all duration-150"
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
                            <div className="px-6 py-4 border-t border-brand-light flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
                                <p className="text-xs text-gray-400">
                                    Menampilkan {orders.from ?? 0}–{orders.to ?? 0} dari {orders.total} Purchase Order
                                </p>
                                <div className="flex items-center gap-1">
                                    {orders.links?.map((link, i) => (
                                        <Link
                                            key={i}
                                            to={getRelativeUrl(link.url)}
                                            className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all duration-150 active:scale-95 ${link.active
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20'
                                                : 'border-brand-light bg-white text-brand-primary hover:bg-brand-light hover:text-brand-dark'
                                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SIDEBAR (Right) ── */}
                    <div className="xl:col-span-3 border-l border-brand-light bg-white p-4 md:p-6 space-y-6">

                        {/* Recent Activity Log */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-gray-400 capitalize tracking-wider flex items-center gap-2">
                                    <iconify-icon icon="solar:history-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Aktivitas Terkini
                                </h3>
                                <a href="#" className="text-[11px] font-semibold text-brand-primary hover:underline">Lihat Semua</a>
                            </div>

                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-brand-light">
                                {recentApprovals && recentApprovals.length > 0 ? (
                                    recentApprovals.map((appr, idx) => (
                                        <div key={idx} className="relative pl-8">
                                            <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white
                                                ${appr.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <div className="text-[11px] mb-1 leading-normal">
                                                <span className="font-bold text-brand-dark">{appr.approver?.name || 'User'}</span>{' '}
                                                <span className="text-gray-500">
                                                    {appr.status === 'approved' ? 'menyetujui' : 'menolak'} PO
                                                </span>{' '}
                                                <Link to={`/purchase-orders/${appr.purchase_order_id}`} className="font-bold text-brand-primary hover:underline">
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
                                                <span className="font-bold text-brand-dark">Budi Santoso</span> <span class="text-gray-500">menyetujui PO</span> <span class="font-bold text-brand-primary">#PO-2024-001</span>
                                            </div>
                                            <span className="text-[9px] text-gray-400 font-medium block">2 jam yang lalu</span>
                                        </div>
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-amber-500 border-4 border-white rounded-full"></span>
                                            <div className="text-[11px] mb-1">
                                                <span className="font-bold text-brand-dark">Siti Aminah</span> <span class="text-gray-500">membuat draft PO baru untuk Supplier CV. Makmur</span>
                                            </div>
                                            <span className="text-[9px] text-gray-400 font-medium block">4 jam yang lalu</span>
                                        </div>
                                        <div className="relative pl-8">
                                            <span className="absolute left-0 top-1.5 w-4 h-4 bg-rose-500 border-4 border-white rounded-full"></span>
                                            <div className="text-[11px] mb-1">
                                                <span className="font-bold text-brand-dark">Alex Manager</span> <span class="text-gray-500">membatalkan PO</span> <span class="font-bold text-brand-primary">#PO-2023-998</span>
                                            </div>
                                            <span className="text-[9px] text-gray-400 font-medium block">Kemarin, 16:45</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* System Announcements */}
                        <div className="bg-white p-5 rounded-2xl border border-brand-light shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-brand-dark flex items-center gap-2">
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

                            <button className="w-full border border-brand-light bg-white text-brand-primary hover:bg-brand-light hover:text-brand-dark py-2.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2">
                                Buka Laporan Keterlambatan
                            </button>
                        </div>

                    </div>
                </div>

                {/* Footer bar */}
                <div className="border-t border-brand-light bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
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

// PurchaseOrderIndex.layout = (page) => <>{page}</>;
