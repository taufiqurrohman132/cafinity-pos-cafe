// PurchaseOrder/Show.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Head from '@/Components/Head'
import client from '@/api/client'
import PurchaseOrderShowSkeleton from '@/Components/Skeletons/PurchaseOrderShowSkeleton'
import { useConfirm } from '@/context/ConfirmContext'

export default function PurchaseOrderShow() {
    const confirm = useConfirm()
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
            pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', label: 'Pending Approval' },
            approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'Approved (Waiting Delivery)' },
            received: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', label: 'Received (Stok Diperbarui)' },
            rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', label: 'Rejected (Ditolak)' }
        }
        return meta[status] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', label: status }
    }

    const statusMeta = order ? getStatusMeta(order.status) : null

    // Form handlers
    async function handleApprove() {
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

    async function handleReject() {
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

    async function handleReceive() {
        if (!await confirm({
            title: 'Terima Barang?',
            message: 'Terima semua barang dan tambahkan ke stok inventaris?',
            isDanger: false,
            confirmText: 'Terima',
            cancelText: 'Batal'
        })) return
        try {
            await client.post(`/purchase-orders/${id}/receive`)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            console.error("Gagal menerima barang:", err)
            alert("Gagal menerima barang.")
        }
    }

    async function handleCancel() {
        if (!await confirm({
            title: 'Batalkan Purchase Order?',
            message: 'Apakah Anda yakin ingin membatalkan dan menghapus Purchase Order ini? Tindakan ini tidak dapat dibatalkan.',
            isDanger: true,
            confirmText: 'Batalkan',
            cancelText: 'Batal'
        })) return
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
            <Head title={`PO #${order.po_number || order.id}`} />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="max-w-[1280px] mx-auto space-y-6">

                    {/* Top Header Actions Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/purchase-orders"
                                className="w-10 h-10 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center text-black/60 hover:text-black hover:border-black transition shadow-sm shrink-0"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div>
                                <nav className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-black/60 leading-[18px] mb-1">
                                    <Link to="/purchase-orders" className="hover:text-black transition-colors">Purchase Order</Link>
                                    <span className="text-black/40">›</span>
                                    <span className="text-black font-semibold">Detail PO #{order.po_number || String(order.id).padStart(4, '0')}</span>
                                </nav>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary leading-10 tracking-[-0.5px]">
                                        PO #{order.po_number || String(order.id).padStart(4, '0')}
                                    </h1>
                                    <span className={`px-2.5 py-1 text-[11px] font-semibold leading-[14px] rounded-lg border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border} capitalize`}>
                                        {statusMeta.label}
                                    </span>
                                </div>
                                <p className="text-[13px] font-normal leading-[18px] text-black/60 mt-1">
                                    Dibuat pada {formatDate(order.ordered_at || order.created_at)} oleh <span className="font-semibold text-black">{order.createdBy?.name || order.user?.name || 'N/A'}</span>
                                </p>
                            </div>
                        </div>

                        {/* Top Actions */}
                        <div className="flex items-center gap-2.5 self-start md:self-center">
                            <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold leading-5 tracking-[0.5px] text-black bg-transparent border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-150 active:scale-[0.97]">
                                <iconify-icon icon="solar:printer-linear" class="text-base"></iconify-icon>
                                Cetak PDF
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold leading-5 tracking-[0.5px] text-black bg-transparent border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-150 active:scale-[0.97]">
                                <iconify-icon icon="solar:download-linear" class="text-base"></iconify-icon>
                                Download
                            </button>

                            {order.status === 'pending' && (
                                <>
                                    <Link
                                        to={`/purchase-orders/${order.id}/edit`}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold leading-5 tracking-[0.5px] text-black bg-transparent border border-[#D0D0D0] rounded-xl hover:bg-[#E6E6E6] hover:border-[#999999] transition-all duration-150 active:scale-[0.97]"
                                    >
                                        <iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold leading-5 tracking-[0.5px] text-white bg-[#FF3B30] hover:bg-[#E03128] rounded-xl shadow-sm transition-all duration-150 active:scale-[0.97] border-0"
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
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1 space-y-6">
                                <h3 className="text-base font-semibold text-black tracking-[-0.3px] leading-6 flex items-center gap-2 mb-4">
                                    <iconify-icon icon="solar:delivery-linear" class="text-black/60 text-lg"></iconify-icon>
                                    Informasi Pengiriman & Supplier
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Supplier Card */}
                                    <div className="bg-neutral-50 border border-[#E6E6E6] rounded-xl p-4 flex gap-3.5">
                                        <div className="w-10 h-10 rounded-lg bg-[#E6E6E6]/60 text-black flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <iconify-icon icon="solar:users-group-rounded-bold" class="text-xl"></iconify-icon>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <span className="text-[11px] font-semibold text-black/50 uppercase tracking-wide leading-[14px] block mb-0.5">Supplier</span>
                                            <p className="text-sm font-semibold leading-5 text-black">{order.supplier?.name || '-'}</p>
                                            <p className="text-[13px] font-normal leading-[18px] text-black/60">{order.supplier?.address || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Shipping Address Card */}
                                    <div className="bg-neutral-50 border border-[#E6E6E6] rounded-xl p-4 flex gap-3.5">
                                        <div className="w-10 h-10 rounded-lg bg-[#E6E6E6]/60 text-black flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <iconify-icon icon="solar:map-point-bold" class="text-xl"></iconify-icon>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <span className="text-[11px] font-semibold text-black/50 uppercase tracking-wide leading-[14px] block mb-0.5">Alamat Pengiriman</span>
                                            <p className="text-sm font-semibold leading-5 text-black">{order.delivery_location || 'Gudang Utama - Jakarta Central'}</p>
                                            <p className="text-[13px] font-normal leading-[18px] text-black/60">Jl. Gatot Subroto No. 45, Kuningan Timur, Setiabudi, Jakarta Selatan 12950</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-[#E6E6E6]">
                                    <div className="text-xs space-y-1">
                                        <span className="text-[11px] font-semibold text-black/50 uppercase leading-[14px] flex items-center gap-1">
                                            <iconify-icon icon="solar:card-linear" class="text-base"></iconify-icon> ID Supplier
                                        </span>
                                        <p className="text-[13px] font-semibold leading-[18px] text-black">{order.supplier?.code || 'SUP-002931'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[11px] font-semibold text-black/50 uppercase leading-[14px] flex items-center gap-1">
                                            <iconify-icon icon="solar:wallet-linear" class="text-base"></iconify-icon> Metode Bayar
                                        </span>
                                        <p className="text-[13px] font-semibold leading-[18px] text-black">{order.payment_term || 'Net 30 Days'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[11px] font-semibold text-black/50 uppercase leading-[14px] flex items-center gap-1">
                                            <iconify-icon icon="solar:calendar-minimalistic-linear" class="text-base"></iconify-icon> Est. Pengiriman
                                        </span>
                                        <p className="text-[13px] font-semibold leading-[18px] text-black">{formatDate(order.delivery_date) || '-'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[11px] font-semibold text-black/50 uppercase leading-[14px] flex items-center gap-1">
                                            <iconify-icon icon="solar:user-circle-linear" class="text-base"></iconify-icon> PIC Penerima
                                        </span>
                                        <p className="text-[13px] font-semibold leading-[18px] text-black">Budi Santoso</p>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Rincian Barang & Jasa Table */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1 space-y-4">
                                <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-3 mb-4">
                                    <h3 className="text-base font-semibold text-black tracking-[-0.3px] leading-6 flex items-center gap-2">
                                        <iconify-icon icon="solar:box-linear" class="text-black/60 text-lg"></iconify-icon>
                                        Rincian Barang & Jasa
                                    </h3>

                                    {order.status === 'approved' && (
                                        <button
                                            onClick={handleReceive}
                                            className="flex items-center gap-1.5 bg-[#BFFF00] hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] text-black px-4 py-2 rounded-xl text-sm font-semibold leading-5 tracking-[0.5px] shadow-md transition-all duration-150 active:scale-[0.97]"
                                        >
                                            <iconify-icon icon="solar:box-linear" class="text-base"></iconify-icon>
                                            Terima Barang
                                        </button>
                                    )}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead>
                                            <tr className="text-xs font-semibold text-black/60 bg-[#E6E6E6]/40 border-b border-[#E6E6E6] capitalize leading-4">
                                                <th className="px-4 py-3 pb-3 border-b border-[#E6E6E6]">Informasi Item</th>
                                                <th className="px-3 py-3 pb-3 border-b border-[#E6E6E6] text-center">Qty Dipesan</th>
                                                <th className="px-3 py-3 pb-3 border-b border-[#E6E6E6] text-center">Qty Diterima</th>
                                                <th className="px-3 py-3 pb-3 border-b border-[#E6E6E6]">Satuan</th>
                                                <th className="px-3 py-3 pb-3 border-b border-[#E6E6E6] text-right">Harga Satuan</th>
                                                <th className="px-3 py-3 pb-3 border-b border-[#E6E6E6] text-right">Pajak (11%)</th>
                                                <th className="px-4 py-3 pb-3 border-b border-[#E6E6E6] text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[13px] font-normal leading-[18px] divide-y divide-[#E6E6E6]">
                                            {order.items?.map((item) => {
                                                const itemName = item.inventory?.name || 'Item N/A'
                                                const itemCode = item.inventory?.category?.name || 'Bahan Baku'
                                                const subtotal = item.subtotal || ((item.qty || 0) * (item.price_per_unit || 0))
                                                const taxAmount = calculateRowTax(item)
                                                const finalSub = subtotal + taxAmount

                                                return (
                                                    <tr key={item.id} className="hover:bg-[#E6E6E6]/20 transition-all cursor-pointer">
                                                        <td className="px-4 py-4">
                                                            <p className="text-sm font-semibold leading-5 text-black">{itemName}</p>
                                                            <p className="text-[11px] font-semibold leading-[14px] text-black/50 mt-0.5 tracking-wider capitalize">{itemCode}</p>
                                                        </td>
                                                        <td className="px-3 py-4 text-center font-semibold text-black text-[13px] leading-[18px]">
                                                            {item.qty}
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded-lg font-semibold text-[11px] leading-[14px] border 
                                                                ${order.status === 'received'
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                                    : 'bg-neutral-100 text-black/40 border-[#D0D0D0]'}`}>
                                                                {order.status === 'received' ? item.qty : 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 text-black/60 font-normal text-[13px] leading-[18px]">
                                                            {item.unit || 'Unit'}
                                                        </td>
                                                        <td className="px-3 py-4 text-right font-semibold text-black text-[13px] leading-[18px]">
                                                            {formatRupiah(item.price_per_unit)}
                                                        </td>
                                                        <td className="px-3 py-4 text-right font-semibold text-black text-[13px] leading-[18px]">
                                                            {formatRupiah(taxAmount)}
                                                        </td>
                                                        <td className="px-4 py-4 text-right font-semibold text-black text-[13px] leading-[18px]">
                                                            {formatRupiah(finalSub)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                            {/* Cost Calculations */}
                                            <tr className="bg-[#E6E6E6]/10 font-semibold border-t border-[#E6E6E6]">
                                                <td colSpan="6" className="px-6 py-4 text-right text-black/60 text-[13px] font-semibold leading-[18px]">Total Pembelian (Sebelum Pajak)</td>
                                                <td className="px-4 py-4 text-right text-[13px] font-semibold leading-[18px] text-black">
                                                    {formatRupiah(order.total_amount)}
                                                </td>
                                            </tr>
                                            <tr className="bg-[#E6E6E6]/10 font-semibold">
                                                <td colSpan="6" className="px-6 py-4 text-right text-black/60 text-[13px] font-semibold leading-[18px]">Total PPN (11%)</td>
                                                <td className="px-4 py-4 text-right text-[13px] font-semibold leading-[18px] text-black">
                                                    {formatRupiah(order.total_amount * 0.11)}
                                                </td>
                                            </tr>
                                            <tr className="bg-[#E6E6E6]/10 font-semibold border-b border-[#E6E6E6]">
                                                <td colSpan="6" className="px-6 py-4 text-right text-sm font-semibold leading-5 text-black">Total Pembayaran Keseluruhan</td>
                                                <td className="px-4 py-4 text-right text-lg font-extrabold leading-6 text-black">
                                                    {formatRupiah(order.total_amount * 1.11)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Terms & Notes under table */}
                                <div className="pt-4 border-t border-[#E6E6E6]">
                                    <span className="text-[11px] font-semibold text-black/50 uppercase tracking-wide leading-[14px] block mb-1">Catatan & Syarat</span>
                                    <p className="text-xs font-normal leading-4 text-black/60 italic bg-neutral-50 p-4 rounded-xl border border-[#E6E6E6]">
                                        {order.notes || "*Barang harap dikirimkan sebelum jam operasional gudang berakhir (17:00 WIB). Lampirkan surat jalan asli dan copy PO saat pengiriman."}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT COLUMN (APPROVALS & AUDIT LOGS) ── */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* 1. Status Persetujuan */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1 space-y-6">
                                <h3 className="text-xs font-semibold text-black flex items-center gap-2 uppercase tracking-wider leading-4 mb-4">
                                    <iconify-icon icon="solar:history-linear" class="text-black/60 text-base"></iconify-icon>
                                    Status Persetujuan
                                </h3>

                                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#E6E6E6]">

                                    {/* Creator ( Sarah Admin ) */}
                                    <div className="relative pl-8">
                                        <span className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
                                        <div className="text-xs">
                                            <p className="text-sm font-semibold leading-5 text-black">Sarah Admin</p>
                                            <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Creator • {formatDate(order.created_at, true)}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 text-[11px] font-semibold leading-[14px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">Approved</span>
                                        </div>
                                    </div>

                                    {/* Level 1 Approval ( Jane Manager ) */}
                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1.5 w-4 h-4 border-4 border-white rounded-full 
                                            ${order.status !== 'pending' && order.status !== 'rejected' ? 'bg-emerald-500' : 'bg-black/20'}`} />
                                        <div className="text-xs">
                                            <p className="text-sm font-semibold leading-5 text-black">Jane Manager</p>
                                            <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Operational Manager • 14 Okt 2024, 11:45</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[11px] font-semibold leading-[14px] border rounded-lg 
                                                ${order.status !== 'pending' && order.status !== 'rejected'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-neutral-100 text-black/40 border-[#D0D0D0]'}`}>
                                                {order.status !== 'pending' && order.status !== 'rejected' ? 'Approved' : 'Waiting...'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Level 2 Approval ( Alex Manager ) */}
                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1.5 w-4 h-4 border-4 border-white rounded-full 
                                            ${order.status === 'approved' || order.status === 'received'
                                                ? 'bg-emerald-500'
                                                : order.status === 'rejected'
                                                    ? 'bg-rose-500'
                                                    : 'bg-amber-500'}`} />
                                        <div className="text-xs">
                                            <p className="text-sm font-semibold leading-5 text-black">Alex Manager</p>
                                            <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Finance Owner • {order.status === 'pending' ? 'Waiting...' : 'Processed'}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[11px] font-semibold leading-[14px] border rounded-lg 
                                                ${order.status === 'approved' || order.status === 'received'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : order.status === 'rejected'
                                                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                                                        : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                {order.status === 'approved' || order.status === 'received' ? 'Approved' : order.status === 'rejected' ? 'Rejected' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Approval Actions (Role-based, showing for Alex Manager or Admin) */}
                                {order.status === 'pending' && (
                                    <div className="pt-4 border-t border-[#E6E6E6] space-y-2.5">
                                        <span className="text-xs font-semibold leading-4 tracking-wide text-black/40 uppercase block mb-2">Aksi Persetujuan (Role: Owner / Admin)</span>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={handleApprove}
                                                className="w-full bg-[#BFFF00] hover:bg-[#C8FF5E] hover:shadow-[0_4px_12px_rgba(191,255,0,0.3)] text-black py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 text-sm leading-5 tracking-[0.5px] transition-all duration-150 active:scale-[0.97]"
                                            >
                                                <iconify-icon icon="solar:check-circle-linear" class="text-base"></iconify-icon>
                                                Setujui PO
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleReject}
                                                className="w-full border border-[#D0D0D0] hover:bg-[#E6E6E6] text-black py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 text-sm leading-5 tracking-[0.5px] transition-all duration-150 active:scale-[0.97]"
                                            >
                                                <iconify-icon icon="solar:close-circle-linear" class="text-base"></iconify-icon>
                                                Tolak
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Jejak Audit & Aktivitas */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-level-1 space-y-6">
                                <h3 className="text-xs font-semibold text-black flex items-center gap-2 uppercase tracking-wider leading-4 mb-4">
                                    <iconify-icon icon="solar:history-linear" class="text-black/60 text-base"></iconify-icon>
                                    Jejak Audit & Aktivitas
                                </h3>

                                <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#E6E6E6]">
                                    {auditLogs && auditLogs.length > 0 ? (
                                        auditLogs.map((log) => (
                                            <div key={log.id} className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-black/60 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="text-[13px] font-semibold leading-[18px] text-black">{log.action}</p>
                                                        <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Oleh {log.user?.name || 'System'}</p>
                                                    </div>
                                                    <span className="text-xs font-semibold leading-4 text-black/40">{formatDate(log.created_at, true)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {/* Static fallback timeline matching mockup */}
                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-black/60 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="text-[13px] font-semibold leading-[18px] text-black">PO Baru Dibuat (Draft)</p>
                                                        <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Oleh Sarah Admin</p>
                                                    </div>
                                                    <span className="text-xs font-semibold leading-4 text-black/40">14/10/24 09:12</span>
                                                </div>
                                            </div>

                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-indigo-500 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="text-[13px] font-semibold leading-[18px] text-black">Dikirim untuk Persetujuan</p>
                                                        <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Oleh Sarah Admin</p>
                                                    </div>
                                                    <span className="text-xs font-semibold leading-4 text-black/40">14/10/24 09:15</span>
                                                </div>
                                            </div>

                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-amber-500 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="text-[13px] font-semibold leading-[18px] text-black">Ditinjau oleh Ops Manager</p>
                                                        <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Oleh Jane Manager</p>
                                                    </div>
                                                    <span className="text-xs font-semibold leading-4 text-black/40">14/10/24 10:30</span>
                                                </div>
                                            </div>

                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="text-[13px] font-semibold leading-[18px] text-black">Disetujui Level 1</p>
                                                        <p className="text-xs font-normal leading-4 text-black/50 mt-0.5">Oleh Jane Manager</p>
                                                    </div>
                                                    <span className="text-xs font-semibold leading-4 text-black/40">14/10/24 11:45</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <a href="#" className="block text-center text-sm font-semibold leading-5 text-black hover:underline mt-6 transition-colors">
                                    Lihat Semua Aktivitas
                                </a>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer bar */}
                <div className="border-t border-[#E6E6E6] bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2 mt-6">
                    <p className="text-[10px] text-black/40">© 2024 Purchase Order Management System</p>
                    <div className="flex items-center gap-4 text-[10px] text-black/40">
                        <a href="#" className="hover:text-black transition-colors">Support</a>
                        <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </>
    )
}

// PurchaseOrderShow.layout = (page) => <>{page}</>;
