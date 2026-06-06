// PurchaseOrder/Show.jsx
import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function PurchaseOrderShow({ order, auditLogs, currentUser }) {
    
    // Status color mapping helper
    const getStatusMeta = (status) => {
        const meta = {
            pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Pending Approval' },
            approved: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Approved (Waiting Delivery)' },
            received: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Received (Stok Diperbarui)' },
            rejected: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', label: 'Rejected (Ditolak)' }
        }
        return meta[status] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', label: status }
    }

    const statusMeta = getStatusMeta(order.status)

    // Form handlers
    function handleApprove() {
        if (!confirm('Setujui Purchase Order ini?')) return
        router.post(route('purchase-orders.approve', order.id), {}, { preserveScroll: true })
    }

    function handleReject() {
        if (!confirm('Tolak Purchase Order ini?')) return
        router.post(route('purchase-orders.reject', order.id), {}, { preserveScroll: true })
    }

    function handleReceive() {
        if (!confirm('Terima semua barang dan tambahkan ke stok inventaris?')) return
        router.post(route('purchase-orders.receive', order.id), {}, { preserveScroll: true })
    }

    function handleCancel() {
        if (!confirm('Batalkan dan hapus Purchase Order ini?')) return
        router.delete(route('purchase-orders.destroy', order.id))
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

    return (
        <>
            <Head title={`PO #${order.po_number || order.id}`} />

            <div className="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
                <div className="max-w-[1280px] mx-auto space-y-6">

                    {/* Top Header Actions Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                href={route('purchase-orders.index')} 
                                className="w-10 h-10 rounded-full bg-white border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition shadow-sm"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-extrabold text-[#050316] tracking-tight">
                                        PO #{order.po_number || String(order.id).padStart(4, '0')}
                                    </h1>
                                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border} uppercase`}>
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
                            <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-700 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                                <iconify-icon icon="solar:printer-linear" class="text-base"></iconify-icon>
                                Cetak PDF
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-700 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                                <iconify-icon icon="solar:download-linear" class="text-base"></iconify-icon>
                                Download
                            </button>
                            
                            {order.status === 'pending' && (
                                <>
                                    <Link 
                                        href={route('purchase-orders.edit', order.id)}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#2f27ce] bg-[#dddbff]/50 border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition"
                                    >
                                        <iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon>
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={handleCancel}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm"
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
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm space-y-6">
                                <h3 className="text-sm font-extrabold text-[#050316] flex items-center gap-2">
                                    <iconify-icon icon="solar:delivery-linear" class="text-[#2f27ce] text-lg"></iconify-icon>
                                    Informasi Pengiriman & Supplier
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Supplier Card */}
                                    <div className="bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4 flex gap-3.5">
                                        <div className="w-10 h-10 rounded-lg bg-[#dddbff] text-[#2f27ce] flex items-center justify-center flex-shrink-0">
                                            <iconify-icon icon="solar:users-group-rounded-bold" class="text-xl"></iconify-icon>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <span className="text-[10px] font-bold text-[#2f27ce]/60 uppercase tracking-wide block">SUPPLIER</span>
                                            <p className="font-bold text-[#050316]">{order.supplier?.name || '-'}</p>
                                            <p className="text-gray-500 leading-normal">{order.supplier?.address || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Shipping Address Card */}
                                    <div className="bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4 flex gap-3.5">
                                        <div className="w-10 h-10 rounded-lg bg-[#dddbff] text-[#2f27ce] flex items-center justify-center flex-shrink-0">
                                            <iconify-icon icon="solar:map-point-bold" class="text-xl"></iconify-icon>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <span className="text-[10px] font-bold text-[#2f27ce]/60 uppercase tracking-wide block">ALAMAT PENGIRIMAN</span>
                                            <p className="font-bold text-[#050316]">{order.delivery_location || 'Gudang Utama - Jakarta Central'}</p>
                                            <p className="text-gray-500 leading-normal">Jl. Gatot Subroto No. 45, Kuningan Timur, Setiabudi, Jakarta Selatan 12950</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 border-t border-[#dddbff]/50">
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            <iconify-icon icon="solar:card-linear" class="text-base"></iconify-icon> ID Supplier
                                        </span>
                                        <p className="font-bold text-gray-900">{order.supplier?.code || 'SUP-002931'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            <iconify-icon icon="solar:wallet-linear" class="text-base"></iconify-icon> Metode Bayar
                                        </span>
                                        <p className="font-bold text-gray-900">{order.payment_term || 'Net 30 Days'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            <iconify-icon icon="solar:calendar-minimalistic-linear" class="text-base"></iconify-icon> Est. Pengiriman
                                        </span>
                                        <p className="font-bold text-gray-900">{formatDate(order.delivery_date) || '-'}</p>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            <iconify-icon icon="solar:user-circle-linear" class="text-base"></iconify-icon> PIC Penerima
                                        </span>
                                        <p className="font-bold text-gray-900">Budi Santoso</p>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Rincian Barang & Jasa Table */}
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-[#dddbff]/50 pb-3">
                                    <h3 class="text-sm font-extrabold text-[#050316] flex items-center gap-2">
                                        <iconify-icon icon="solar:box-linear" class="text-[#2f27ce] text-lg"></iconify-icon>
                                        Rincian Barang & Jasa
                                    </h3>
                                    
                                    {order.status === 'approved' && (
                                        <button 
                                            onClick={handleReceive}
                                            className="flex items-center gap-1.5 bg-[#2f27ce] hover:bg-[#443dff] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                                        >
                                            <iconify-icon icon="solar:box-linear" class="text-base"></iconify-icon>
                                            Terima Barang
                                        </button>
                                    )}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead>
                                            <tr className="text-[10px] font-bold text-gray-400 bg-gray-50 border-b border-[#dddbff] uppercase">
                                                <th className="px-4 py-3">Informasi Item</th>
                                                <th className="px-3 py-3 text-center">Qty Dipesan</th>
                                                <th className="px-3 py-3 text-center">Qty Diterima</th>
                                                <th className="px-3 py-3">Satuan</th>
                                                <th className="px-3 py-3 text-right">Harga Satuan</th>
                                                <th className="px-3 py-3 text-right">Pajak (11%)</th>
                                                <th className="px-4 py-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs divide-y divide-[#dddbff]/50">
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
                                                            <p className="text-[10px] text-gray-400 mt-0.5 tracking-wider uppercase font-semibold">{itemCode}</p>
                                                        </td>
                                                        <td className="px-3 py-4 text-center font-bold text-gray-800">
                                                            {item.qty}
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] border 
                                                                ${order.status === 'received' 
                                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
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
                                            <tr className="bg-gray-50/50 font-bold border-t border-[#dddbff]">
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
                                                <td colSpan="6" className="px-6 py-4 text-right text-[#2f27ce] text-xs">Total Pembayaran Keseluruhan</td>
                                                <td className="px-4 py-4 text-right text-sm text-[#2f27ce] font-extrabold">
                                                    {formatRupiah(order.total_amount * 1.11)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Terms & Notes under table */}
                                <div className="pt-4 border-t border-[#dddbff]/50">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">CATATAN & SYARAT</span>
                                    <p className="text-[11px] text-gray-500 leading-normal italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {order.notes || "*Barang harap dikirimkan sebelum jam operasional gudang berakhir (17:00 WIB). Lampirkan surat jalan asli dan copy PO saat pengiriman."}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT COLUMN (APPROVALS & AUDIT LOGS) ── */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* 1. Status Persetujuan */}
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm space-y-6">
                                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                                    <iconify-icon icon="solar:history-linear" class="text-[#2f27ce] text-base"></iconify-icon>
                                    Status Persetujuan
                                </h3>

                                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#dddbff]">
                                    
                                    {/* Creator ( Sarah Admin ) */}
                                    <div className="relative pl-8">
                                        <span className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Sarah Admin</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Creator • {formatDate(order.created_at, true)}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded">Approved</span>
                                        </div>
                                    </div>

                                    {/* Level 1 Approval ( Jane Manager ) */}
                                    <div className="relative pl-8">
                                        <span className={`absolute left-0 top-1.5 w-4 h-4 border-4 border-white rounded-full 
                                            ${order.status !== 'pending' && order.status !== 'rejected' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Jane Manager</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Operational Manager • 14 Okt 2024, 11:45</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold border rounded 
                                                ${order.status !== 'pending' && order.status !== 'rejected' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                    : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
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
                                                    ? 'bg-red-500' 
                                                    : 'bg-amber-400'}`} />
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Alex Manager</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Finance Owner • {order.status === 'pending' ? 'Waiting...' : 'Processed'}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold border rounded 
                                                ${order.status === 'approved' || order.status === 'received' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                    : order.status === 'rejected' 
                                                        ? 'bg-red-50 text-red-600 border-red-100' 
                                                        : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {order.status === 'approved' || order.status === 'received' ? 'Approved' : order.status === 'rejected' ? 'Rejected' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Approval Actions (Role-based, showing for Alex Manager or Admin) */}
                                {order.status === 'pending' && (
                                    <div className="pt-4 border-t border-[#dddbff]/50 space-y-2.5">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">AKSI PERSETUJUAN (ROLE: OWNER / ADMIN)</span>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <button 
                                                type="button" 
                                                onClick={handleApprove}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition"
                                            >
                                                <iconify-icon icon="solar:check-circle-linear" class="text-base"></iconify-icon>
                                                Setujui PO
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={handleReject}
                                                className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition"
                                            >
                                                <iconify-icon icon="solar:close-circle-linear" class="text-base"></iconify-icon>
                                                Tolak
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Jejak Audit & Aktivitas */}
                            <div className="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm space-y-6">
                                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                                    <iconify-icon icon="solar:history-linear" class="text-[#2f27ce] text-base"></iconify-icon>
                                    Jejak Audit & Aktivitas
                                </h3>

                                <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#dddbff]">
                                    {auditLogs && auditLogs.length > 0 ? (
                                        auditLogs.map((log) => (
                                            <div key={log.id} className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-[#2f27ce] border-4 border-white rounded-full"></span>
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
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-amber-500 border-4 border-white rounded-full"></span>
                                                <div className="flex justify-between items-start text-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-900">Ditinjau oleh Ops Manager</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Oleh Jane Manager</p>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400 font-semibold">14/10/24 10:30</span>
                                                </div>
                                            </div>

                                            <div className="relative pl-8">
                                                <span className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
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
                                
                                <a href="#" className="block text-center text-[#2f27ce] font-bold text-xs mt-6 hover:underline">
                                    Lihat Semua Aktivitas
                                </a>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer bar */}
                <div className="border-t border-[#dddbff] bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2 mt-6">
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

PurchaseOrderShow.layout = (page) => <AppLayout>{page}</AppLayout>;
