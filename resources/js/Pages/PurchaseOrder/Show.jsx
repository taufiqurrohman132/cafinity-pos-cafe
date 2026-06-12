// PurchaseOrder/Show.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Head from '@/Components/Head'
import client from '@/api/client'
import PurchaseOrderShowSkeleton from '@/Components/Skeletons/PurchaseOrderShowSkeleton'

export default function PurchaseOrderShow() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState(null)
    const [auditLogs, setAuditLogs] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true)
            try {
                setError(null)
                const res = await client.get(`/purchase-orders/${id}`)
                setOrder(res.data.order)
                setAuditLogs(res.data.auditLogs || [])
                setCurrentUser(res.data.currentUser || null)
            } catch (err) {
                console.error("Gagal mengambil detail Purchase Order:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrderDetails()
    }, [id, refreshTrigger])

    // Status color mapping helper
    const getStatusMeta = (status) => {
        const meta = {
            pending: { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]', border: 'border-[#fde68a]', label: 'Pending Approval' },
            approved: { bg: 'bg-[#ecfdf5]', text: 'text-[#065f46]', border: 'border-[#d1fae5]', label: 'Approved (Waiting Delivery)' },
            received: { bg: 'bg-[#eff6ff]', text: 'text-[#1e40af]', border: 'border-[#dbeafe]', label: 'Received (Stok Diperbarui)' },
            rejected: { bg: 'bg-[#fef2f2]', text: 'text-[#991b1b]', border: 'border-[#fecaca]', label: 'Rejected (Ditolak)' }
        }
        return meta[status] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', label: status }
    }

    const statusMeta = order ? getStatusMeta(order.status) : null

    // Form handlers
    async function handleApprove() {
        if (!confirm('Setujui Purchase Order ini?')) return
        try {
            await client.post(`/purchase-orders/${id}/approve`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menyetujui Purchase Order:", err)
            alert("Gagal menyetujui Purchase Order.")
        }
    }

    async function handleReject() {
        if (!confirm('Tolak Purchase Order ini?')) return
        try {
            await client.post(`/purchase-orders/${id}/reject`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menolak Purchase Order:", err)
            alert("Gagal menolak Purchase Order.")
        }
    }

    async function handleReceive() {
        if (!confirm('Terima semua barang dan tambahkan ke stok inventaris?')) return
        try {
            await client.post(`/purchase-orders/${id}/receive`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menerima barang:", err)
            alert("Gagal menerima barang.")
        }
    }

    async function handleCancel() {
        if (!confirm('Batalkan dan hapus Purchase Order ini?')) return
        try {
            await client.delete(`/purchase-orders/${id}`)
            navigate('/purchase-orders')
        } catch (err) {
            console.error("Gagal membatalkan Purchase Order:", err)
            alert("Gagal membatalkan Purchase Order.")
        }
    }

    function formatRupiah(value) {
        return 'Rp ' + Math.round(value).toLocaleString('id-ID')
    }

    function formatDate(dateStr, includeTime = false) {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        const opts = includeTime
            ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
            : { day: 'numeric', month: 'short', year: 'numeric' }
        return date.toLocaleDateString('id-ID', opts)
    }

    // Tax calculation per item row (11%)
    const calculateRowTax = (item) => {
        const sub = (item.qty || 0) * (item.price_per_unit || 0)
        return sub * 0.11
    }

    if (loading && !order) {
        return (
            <>
                <Head title="Detail Purchase Order" />
                <PurchaseOrderShowSkeleton />
            </>
        )
    }

    if (error && !order) {
        return (
            <>
                <Head title="Detail Purchase Order" />
                <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
                    <div className="bg-white p-8 rounded-3xl border border-brand-light max-w-md w-full shadow-lg text-center">
                        <iconify-icon icon="solar:danger-triangle-linear" class="text-rose-500 text-5xl mb-4 mx-auto block"></iconify-icon>
                        <h3 className="text-lg font-extrabold text-brand-dark mb-2">Terjadi Kesalahan</h3>
                        <p className="text-sm text-brand-primary/70 mb-6">
                            Gagal memuat detail purchase order dari server. Silakan coba lagi.
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
            <Head title={`PO #${order.po_number || order.id}`} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="max-w-[1280px] mx-auto space-y-6">

                    {/* Top Header Actions Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/purchase-orders"
                                className="w-10 h-10 rounded-full bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition shadow-sm"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">
                                        PO #{order.po_number || String(order.id).padStart(4, '0')}
                                    </h1>
                                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border} capitalize`}>
                                        {statusMeta.label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Dibuat pada {formatDate(order.ordered_at || order.created_at)} oleh <span className="font-semibold text-gray-700">{order.createdBy?.name || order.user?.name || 'N/A'}</span>
                                </p>
                            </div>
                        </div>

                        {/* Top Actions */}
                        <div className="flex items-center gap-2.5 self-start md:self-center">
                            <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-700 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition">
                                <iconify-icon icon="solar:printer-linear" class="text-base"></iconify-icon>
                                Cetak PDF
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-700 bg-white border border-brand-light rounded-xl hover:bg-brand-bg transition">
                                <iconify-icon icon="solar:download-linear" class="text-base"></iconify-icon>
                                Download
                            </button>

                            {order.status === 'pending' && (
                                <>
                                    <Link
                                        to={`/purchase-orders/${order.id}/edit`}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-brand-primary bg-brand-light/50 border border-brand-light rounded-xl hover:bg-brand-light transition"
                                    >
                                        <iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#b91c1c] hover:bg-[#991b1b] rounded-xl transition shadow-sm"
                                    >
                                        <iconify-icon icon="solar:close-square-linear" class="text-base"></iconify-icon>
                                        Batalkan PO
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* ── LEFT COLUMN (DETAILS & ITEMS) ── */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* 1. Informasi Pengiriman & Supplier Card */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                                <h3 className="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                                    <iconify-icon icon="solar:delivery-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Informasi Pengiriman & Supplier
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Supplier Card */}
                                    <div className="bg-brand-bg border border-brand-light rounded-xl p-4 flex gap-3.5">
                                        <div className="w-10 h-10 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0">
                                            <iconify-icon icon="solar:users-group-rounded-bold" class="text-xl"></iconify-icon>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <span className="text-[10px] font-bold text-brand-primary/60 capitalize tracking-wide block">SUPPLIER</span>
                                            <p className="font-bold text-brand-dark">{order.supplier?.name || '-'}</p>
                                            <p className="text-gray-500 leading-normal">{order.supplier?.address || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Shipping Address Card */}
                                    <div className="bg-brand-bg border border-brand-light rounded-xl p-4 flex gap-3.5">
                                        <div className="w-10 h-10 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center flex-shrink-0">
                                            <iconify-icon icon="solar:map-point-bold" class="text-xl"></iconify-icon>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <span className="text-[10px] font-bold text-brand-primary/60 capitalize tracking-wide block">ALAMAT PENGIRIMAN</span>
                                            <p className="font-bold text-brand-dark">{order.delivery_location || 'Gudang Utama - Jakarta Central'}</p>
                                            <p className="text-gray-500 leading-normal">Jl. Gatot Subroto No. 45, Kuningan Timur, Setiabudi, Jakarta Selatan 12950</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 border-t border-brand-light/50">
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 capitalize flex items-center gap-1">
                                            <iconify-icon icon="solar:card-linear" class="text-base"></iconify-icon> ID Supplier
                                        </span>
                                        <p className="font-bold text-gray-900">{order.supplier?.code || 'SUP-002931'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 capitalize flex items-center gap-1">
                                            <iconify-icon icon="solar:wallet-linear" class="text-base"></iconify-icon> Metode Bayar
                                        </span>
                                        <p className="font-bold text-gray-900">{order.payment_term || 'Net 30 Days'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 capitalize flex items-center gap-1">
                                            <iconify-icon icon="solar:calendar-minimalistic-linear" class="text-base"></iconify-icon> Est. Pengiriman
                                        </span>
                                        <p className="font-bold text-gray-900">{formatDate(order.delivery_date) || '-'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 capitalize flex items-center gap-1">
                                            <iconify-icon icon="solar:user-circle-linear" class="text-base"></iconify-icon> PIC Penerima
                                        </span>
                                        <p className="font-bold text-gray-900">Budi Santoso</p>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Rincian Barang & Jasa Table */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-brand-light/50 pb-3">
                                    <h3 class="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                                        <iconify-icon icon="solar:box-linear" class="text-brand-primary text-lg"></iconify-icon>
                                        Rincian Barang & Jasa
                                    </h3>

                                    {order.status === 'approved' && (
                                        <button
                                            onClick={handleReceive}
                                            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                                        >
                                            <iconify-icon icon="solar:box-linear" class="text-base"></iconify-icon>
                                            Terima Barang
                                        </button>
                                    )}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead>
                                            <tr className="text-[10px] font-bold text-gray-400 bg-gray-50 border-b border-brand-light capitalize">
                                                <th className="px-4 py-3">Informasi Item</th>
                                                <th className="px-3 py-3 text-center">Qty Dipesan</th>
                                                <th className="px-3 py-3 text-center">Qty Diterima</th>
                                                <th className="px-3 py-3">Satuan</th>
                                                <th className="px-3 py-3 text-right">Harga Satuan</th>
                                                <th className="px-3 py-3 text-right">Pajak (11%)</th>
                                                <th className="px-4 py-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs divide-y divide-brand-light/50">
                                            {order.items?.map((item) => {
                                                const itemName = item.inventory?.name || 'Item N/A'
                                                const itemCode = item.inventory?.category?.name || 'Bahan Baku'
                                                const subtotal = item.subtotal || ((item.qty || 0) * (item.price_per_unit || 0))
                                                const taxAmount = calculateRowTax(item)
                                                const finalSub = subtotal + taxAmount

                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                                        <td className="px-4 py-4">
                                                            <p className="font-bold text-gray-900">{itemName}</p>
                                                            <p className="text-[10px] text-gray-400 mt-0.5 tracking-wider capitalize font-semibold">{itemCode}</p>
                                                        </td>
                                                        <td className="px-3 py-4 text-center font-bold text-gray-800">
                                                            {item.qty}
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] border 
                                                                ${order.status === 'received'
                                                                    ? 'bg-[#ecfdf5] text-[#065f46] border-[#d1fae5]'
                                                                    : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                                                {order.status === 'received' ? item.qty : 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 text-gray-500 font-medium">
                                                            {item.unit || 'Unit'}
                                                        </td>
                                                        <td className="px-3 py-4 text-right font-medium text-gray-700">
                                                            {formatRupiah(item.price_per_unit)}
                                                        </td>
                                                        <td className="px-3 py-4 text-right text-gray-500">
                                                            {formatRupiah(taxAmount)}
                                                        </td>
                                                        <td className="px-4 py-4 text-right font-bold text-gray-900">
                                                            {formatRupiah(finalSub)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                            {/* Cost Calculations */}
                                            <tr className="bg-gray-50/50 font-bold border-t border-brand-light">
                                                <td colSpan="6" className="px-6 py-4 text-right text-gray-900 text-xs">Total Pembelian (Sebelum Pajak)</td>
                                                <td className="px-4 py-4 text-right text-xs text-gray-900">
                                                    {formatRupiah(order.total_amount)}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50/50 font-bold">
                                                <td colSpan="6" className="px-6 py-4 text-right text-gray-900 text-xs">Total PPN (11%)</td>
                                                <td className="px-4 py-4 text-right text-xs text-gray-900">
                                                    {formatRupiah(order.total_amount * 0.11)}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50/50 font-bold">
                                                <td colSpan="6" className="px-6 py-4 text-right text-brand-primary text-xs">Total Pembayaran Keseluruhan</td>
                                                <td className="px-4 py-4 text-right text-sm text-brand-primary font-extrabold">
                                                    {formatRupiah(order.total_amount * 1.11)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Terms & Notes under table */}
                                <div className="pt-4 border-t border-brand-light/50">
                                    <span className="text-[10px] font-bold text-gray-400 capitalize tracking-wide block mb-1">CATATAN & SYARAT</span>
                                    <p className="text-[11px] text-gray-500 leading-normal italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {order.notes || "*Barang harap dikirimkan sebelum jam operasional gudang berakhir (17:00 WIB). Lampirkan surat jalan asli dan copy PO saat pengiriman."}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT COLUMN (APPROVALS & AUDIT LOGS) ── */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* 1. Status Persetujuan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 capitalize tracking-wide">
                                    <iconify-icon icon="solar:history-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Status Persetujuan
                                </h3>

                                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-brand-light">

                                    {/* Creator ( Sarah Admin ) */}
                                    <div className="relative pl-8">
                                        <span className="absolute left-0 top-1.5 w-4 h-4 bg-[#059669] border-4 border-white rounded-full"></span>
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Sarah Admin</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Creator • {formatDate(order.created_at, true)}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-[#ecfdf5] text-[#065f46] border border-[#d1fae5] rounded">Approved</span>
                                        </div>
                                    </div>

                                    {/* Level 1 Approval ( Jane Manager ) */}
                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1.5 w-4 h-4 border-4 border-white rounded-full 
                                            ${order.status !== 'pending' && order.status !== 'rejected' ? 'bg-[#059669]' : 'bg-gray-300'}`} />
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Jane Manager</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Operational Manager • 14 Okt 2024, 11:45</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold border rounded 
                                                ${order.status !== 'pending' && order.status !== 'rejected'
                                                    ? 'bg-[#ecfdf5] text-[#065f46] border-[#d1fae5]'
                                                    : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                                {order.status !== 'pending' && order.status !== 'rejected' ? 'Approved' : 'Waiting...'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Level 2 Approval ( Alex Manager ) */}
                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1.5 w-4 h-4 border-4 border-white rounded-full 
                                            ${order.status === 'approved' || order.status === 'received'
                                                ? 'bg-[#059669]'
                                                : order.status === 'rejected'
                                                    ? 'bg-[#b91c1c]'
                                                    : 'bg-[#92400e]'}`} />
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Alex Manager</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Finance Owner • {order.status === 'pending' ? 'Waiting...' : 'Processed'}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold border rounded 
                                                ${order.status === 'approved' || order.status === 'received'
                                                    ? 'bg-[#ecfdf5] text-[#065f46] border-[#d1fae5]'
                                                    : order.status === 'rejected'
                                                        ? 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                                                        : 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'}`}>
                                                {order.status === 'approved' || order.status === 'received' ? 'Approved' : order.status === 'rejected' ? 'Rejected' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Approval Actions (Role-based, showing for Alex Manager or Admin) */}
                                {order.status === 'pending' && (
                                    <div className="pt-4 border-t border-brand-light/50 space-y-2.5">
                                        <span className="text-[10px] font-bold text-gray-400 capitalize tracking-wide block">AKSI PERSETUJUAN (ROLE: OWNER / ADMIN)</span>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={handleApprove}
                                                className="w-full bg-[#059669] hover:bg-[#065f46] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition"
                                            >
                                                <iconify-icon icon="solar:check-circle-linear" class="text-base"></iconify-icon>
                                                Setujui PO
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleReject}
                                                className="w-full border border-[#fecaca] hover:bg-[#fef2f2] text-[#991b1b] py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition"
                                            >
                                                <iconify-icon icon="solar:close-circle-linear" class="text-base"></iconify-icon>
                                                Tolak
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Jejak Audit & Aktivitas */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-6">
                                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 capitalize tracking-wide">
                                    <iconify-icon icon="solar:history-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Jejak Audit & Aktivitas
                                </h3>

                                <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-brand-light">
                                    {auditLogs && auditLogs.length > 0 ? (
                                        auditLogs.map((log) => (
                                            <div key={log.id} className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-brand-primary border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{log.action}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Oleh {log.user?.name || 'System'}</p>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400 font-semibold">{formatDate(log.created_at, true)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {/* Static fallback timeline matching mockup */}
                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-gray-400 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-900">PO Baru Dibuat (Draft)</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Oleh Sarah Admin</p>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400 font-semibold">14/10/24 09:12</span>
                                                </div>
                                            </div>

                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-indigo-500 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-900">Dikirim untuk Persetujuan</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Oleh Sarah Admin</p>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400 font-semibold">14/10/24 09:15</span>
                                                </div>
                                            </div>

                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-[#92400e] border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-900">Ditinjau oleh Ops Manager</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Oleh Jane Manager</p>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400 font-semibold">14/10/24 10:30</span>
                                                </div>
                                            </div>

                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-[#059669] border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-900">Disetujui Level 1</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Oleh Jane Manager</p>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400 font-semibold">14/10/24 11:45</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <a href="#" className="block text-center text-brand-primary font-bold text-xs mt-6 hover:underline">
                                    Lihat Semua Aktivitas
                                </a>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer bar */}
                <div className="border-t border-brand-light bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2 mt-6">
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

// PurchaseOrderShow.layout = (page) => <>{page}</>;
