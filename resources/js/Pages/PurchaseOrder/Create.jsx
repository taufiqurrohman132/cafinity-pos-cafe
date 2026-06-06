// PurchaseOrder/Create.jsx
import { Head, Link, useForm } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import AppLayout from '@/Layouts/AppLayout'

export default function PurchaseOrderCreate({ suppliers, inventories }) {
    // Form management using Inertia useForm
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        delivery_location: '',
        delivery_date: '',
        reference_number: '',
        payment_term: '',
        notes: '',
        discount_global: 0,
        shipping_cost: 0,
        items: [
            { inventory_id: '', description: '', qty: 1, unit: '', price_per_unit: 0, discount: 0, tax_enabled: true }
        ]
    })

    // Local states for supplier search and select
    const [searchSupplier, setSearchSupplier] = useState('')
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [filteredSuppliers, setFilteredSuppliers] = useState([])

    // Filter suppliers on search query change
    useEffect(() => {
        if (searchSupplier.trim() === '') {
            setFilteredSuppliers([])
        } else {
            const matches = suppliers.filter(s => 
                s.name.toLowerCase().includes(searchSupplier.toLowerCase())
            )
            setFilteredSuppliers(matches)
        }
    }, [searchSupplier, suppliers])

    // Handle selecting a supplier
    function handleSelectSupplier(supplier) {
        setSelectedSupplier(supplier)
        setData('supplier_id', supplier.id)
        setSearchSupplier(supplier.name)
        setFilteredSuppliers([])
    }

    // Add new item row to the table
    function addRow() {
        const updatedItems = [...data.items]
        updatedItems.push({ inventory_id: '', description: '', qty: 1, unit: '', price_per_unit: 0, discount: 0, tax_enabled: true })
        setData('items', updatedItems)
    }

    // Remove item row from the table
    function removeRow(index) {
        if (data.items.length > 1) {
            const updatedItems = [...data.items]
            updatedItems.splice(index, 1)
            setData('items', updatedItems)
        }
    }

    // Update specific field in item row
    function updateItemRow(index, field, value) {
        const updatedItems = [...data.items]
        updatedItems[index][field] = value

        // When changing inventory, auto-populate unit and default price
        if (field === 'inventory_id') {
            const selectedInv = inventories.find(inv => String(inv.id) === String(value))
            if (selectedInv) {
                updatedItems[index].unit = selectedInv.unit || ''
                updatedItems[index].price_per_unit = selectedInv.price_per_unit || 0
                updatedItems[index].description = selectedInv.category?.name || 'Bahan Baku'
            } else {
                updatedItems[index].unit = ''
                updatedItems[index].price_per_unit = 0
                updatedItems[index].description = ''
            }
        }
        
        setData('items', updatedItems)
    }

    // Calculations
    const calculateRowSubtotal = (item) => {
        const gross = (item.qty || 0) * (item.price_per_unit || 0)
        const discountAmount = gross * ((item.discount || 0) / 100)
        return gross - discountAmount
    }

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + calculateRowSubtotal(item), 0)
    }

    const calculateGlobalDiscount = () => {
        const subtotal = calculateSubtotal()
        return subtotal * ((data.discount_global || 0) / 100)
    }

    const calculateTax = () => {
        const subtotal = calculateSubtotal()
        const discount = calculateGlobalDiscount()
        const taxableAmount = subtotal - discount
        
        // Sum items that have PPN active (11%)
        return data.items.reduce((sum, item) => {
            if (item.tax_enabled) {
                const itemSub = calculateRowSubtotal(item)
                // Proportion of global discount on this item
                const proportion = subtotal > 0 ? (itemSub / subtotal) : 0
                const itemTaxable = itemSub - (discount * proportion)
                return sum + (itemTaxable * 0.11)
            }
            return sum;
        }, 0)
    }

    const calculateTotal = () => {
        const subtotal = calculateSubtotal()
        const discount = calculateGlobalDiscount()
        const tax = calculateTax()
        const shipping = Number(data.shipping_cost) || 0
        return subtotal - discount + tax + shipping
    }

    // Validation checklist states
    const isSupplierValid = !!data.supplier_id
    const isItemsValid = data.items.length >= 1 && data.items.every(item => item.inventory_id && item.qty > 0)
    const isLocationValid = !!data.delivery_location

    // Submit form
    function handleSubmit(e) {
        e.preventDefault()
        if (!isSupplierValid || !isItemsValid) {
            alert('Harap lengkapi semua validasi sebelum mengirim PO.')
            return
        }
        post(route('purchase-orders.store'))
    }

    function formatRupiah(value) {
        return 'Rp ' + Math.round(value).toLocaleString('id-ID')
    }

    return (
        <>
            <Head title="Buat Pesanan Pembelian Baru" />

            <div className="min-h-screen bg-brand-bg p-4 md:p-6">
                <div className="max-w-[1280px] mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                href={route('purchase-orders.index')} 
                                className="w-10 h-10 rounded-full bg-white border border-brand-light flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition shadow-sm"
                            >
                                <iconify-icon icon="solar:arrow-left-linear" class="text-lg"></iconify-icon>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">Buat Pesanan Pembelian Baru</h1>
                                <p className="text-xs text-gray-500 mt-1">Isi detail di bawah untuk membuat draf pesanan pembelian baru.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-start md:self-center">
                            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-gray-100 text-gray-500 border border-gray-200 uppercase">
                                Draft
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">Disimpan baru saja</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* ── LEFT COLUMN (FORM FIELDS) ── */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* 1. Informasi Pemasok */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                                        <iconify-icon icon="solar:users-group-rounded-linear" class="text-brand-primary text-lg"></iconify-icon>
                                        Informasi Pemasok
                                    </h3>
                                    <a href="#" className="text-xs font-bold text-brand-primary hover:underline">+ Tambah Pemasok Baru</a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    {/* Search Supplier */}
                                    <div className="md:col-span-6 space-y-1.5 relative">
                                        <label className="text-xs font-bold text-gray-700">Cari Pemasok</label>
                                        <div className="relative">
                                            <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></iconify-icon>
                                            <input 
                                                type="text"
                                                value={searchSupplier}
                                                onChange={(e) => setSearchSupplier(e.target.value)}
                                                placeholder="Ketik nama pemasok..."
                                                className="w-full h-11 pl-9 pr-4 text-xs bg-brand-bg border border-brand-light rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light"
                                            />
                                        </div>

                                        {/* Dropdown Suggestions */}
                                        {filteredSuppliers.length > 0 && (
                                            <div className="absolute left-0 right-0 mt-1 bg-white border border-brand-light rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto">
                                                {filteredSuppliers.map((s) => (
                                                    <button 
                                                        key={s.id}
                                                        type="button"
                                                        onClick={() => handleSelectSupplier(s)}
                                                        className="w-full text-left px-4 py-2.5 hover:bg-brand-light/20 text-xs font-medium text-gray-700 transition"
                                                    >
                                                        {s.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact Details box */}
                                    <div className="md:col-span-6 bg-gray-50 border border-dashed border-brand-light rounded-xl p-4 flex flex-col justify-center min-h-[90px]">
                                        <span className="text-[10px] font-bold text-brand-primary/60 uppercase tracking-wider block mb-1">Informasi Kontak</span>
                                        {selectedSupplier ? (
                                            <div className="text-xs space-y-1 text-gray-600">
                                                <p className="font-bold text-brand-dark">{selectedSupplier.name}</p>
                                                <p><span className="font-semibold text-gray-400">Telp:</span> {selectedSupplier.phone || '-'}</p>
                                                <p><span className="font-semibold text-gray-400">Email:</span> {selectedSupplier.email || '-'}</p>
                                                <p><span className="font-semibold text-gray-400">Alamat:</span> {selectedSupplier.address || '-'}</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Pilih pemasok untuk melihat detail kontak dan alamat.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Detail Pesanan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <h3 class="text-sm font-extrabold text-brand-dark flex items-center gap-2 border-b border-brand-light/50 pb-3">
                                    <iconify-icon icon="solar:document-text-linear" class="text-brand-primary text-lg"></iconify-icon>
                                    Detail Pesanan
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* PO Number */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Nomor PO</label>
                                        <input 
                                            type="text" 
                                            readOnly 
                                            placeholder="PO-2026-XXXX"
                                            className="w-full h-11 text-xs bg-gray-50 border border-brand-light rounded-xl px-4 text-gray-500 font-semibold focus:outline-none" 
                                        />
                                        <span className="text-[10px] text-gray-400 font-medium block">Tergenerasi otomatis oleh sistem.</span>
                                    </div>

                                    {/* PO Date */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Tanggal PO</label>
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={new Date().toISOString().split('T')[0]}
                                            className="w-full h-11 text-xs bg-gray-50 border border-brand-light rounded-xl px-4 text-gray-500 font-semibold focus:outline-none" 
                                        />
                                    </div>

                                    {/* Delivery Date */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Estimasi Pengiriman</label>
                                        <input 
                                            type="date"
                                            value={data.delivery_date}
                                            onChange={(e) => setData('delivery_date', e.target.value)}
                                            className="w-full h-11 text-xs border border-brand-light rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-brand-light focus:outline-none" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Shipping Location */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Lokasi Pengiriman</label>
                                        <select 
                                            value={data.delivery_location}
                                            onChange={(e) => setData('delivery_location', e.target.value)}
                                            className="w-full h-11 text-xs border border-brand-light rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-brand-light focus:outline-none bg-brand-bg"
                                        >
                                            <option value="">Pilih Gudang atau Alamat...</option>
                                            <option value="Gudang Utama">Gudang Utama</option>
                                            <option value="Gudang Depan">Gudang Depan</option>
                                            <option value="Gudang Belakang">Gudang Belakang</option>
                                        </select>
                                    </div>

                                    {/* Payment Terms */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Syarat Pembayaran</label>
                                        <select 
                                            value={data.payment_term}
                                            onChange={(e) => setData('payment_term', e.target.value)}
                                            className="w-full h-11 text-xs border border-brand-light rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-brand-light focus:outline-none bg-brand-bg"
                                        >
                                            <option value="">Pilih Ketentuan (e.g. Net 30)...</option>
                                            <option value="COD">COD</option>
                                            <option value="Net 7">Net 7</option>
                                            <option value="Net 14">Net 14</option>
                                            <option value="Net 30">Net 30</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Item Pesanan Table */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-brand-light/50 pb-3">
                                    <h3 class="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                                        <iconify-icon icon="solar:box-linear" class="text-brand-primary text-lg"></iconify-icon>
                                        Item Pesanan
                                    </h3>
                                    <button type="button" className="flex items-center gap-1.5 border border-brand-light hover:bg-brand-light/20 text-brand-primary px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition">
                                        <iconify-icon icon="solar:import-linear" class="text-xs"></iconify-icon>
                                        Impor dari Inventori
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[750px]">
                                        <thead>
                                            <tr className="text-[10px] font-bold text-gray-400 bg-gray-50 border-b border-brand-light uppercase">
                                                <th className="px-4 py-3">Produk / Item</th>
                                                <th className="px-3 py-3">Deskripsi</th>
                                                <th className="px-3 py-3">Satuan</th>
                                                <th className="px-3 py-3 w-16">Qty</th>
                                                <th className="px-3 py-3 w-28">Harga Satuan</th>
                                                <th className="px-3 py-3 w-16">Diskon</th>
                                                <th className="px-3 py-3 w-16">Pajak</th>
                                                <th className="px-4 py-3 text-right">Subtotal</th>
                                                <th className="px-3 py-3 w-8"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs divide-y divide-brand-light/50">
                                            {data.items.map((row, idx) => (
                                                <tr key={idx} className="align-middle">
                                                    {/* Select Item */}
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={row.inventory_id}
                                                            onChange={(e) => updateItemRow(idx, 'inventory_id', e.target.value)}
                                                            className="w-full text-xs border border-brand-light rounded-lg py-1.5 px-2.5 focus:ring-brand-light focus:outline-none bg-brand-bg"
                                                        >
                                                            <option value="">Cari...</option>
                                                            {inventories.map((inv) => (
                                                                <option key={inv.id} value={inv.id}>{inv.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    {/* Description */}
                                                    <td className="px-3 py-3">
                                                        <input 
                                                            type="text" 
                                                            value={row.description}
                                                            onChange={(e) => updateItemRow(idx, 'description', e.target.value)}
                                                            placeholder="Deskr"
                                                            className="w-full text-xs border border-brand-light rounded-lg py-1.5 px-2 focus:ring-brand-light focus:outline-none bg-brand-bg"
                                                        />
                                                    </td>
                                                    {/* Unit */}
                                                    <td className="px-3 py-3">
                                                        <input 
                                                            type="text" 
                                                            readonly
                                                            value={row.unit}
                                                            placeholder="Unit"
                                                            className="w-16 text-xs bg-gray-50 border border-brand-light rounded-lg py-1.5 px-2 text-gray-500 font-semibold focus:outline-none text-center"
                                                        />
                                                    </td>
                                                    {/* Qty */}
                                                    <td className="px-3 py-3">
                                                        <input 
                                                            type="number" 
                                                            min="0.01" 
                                                            step="0.01"
                                                            value={row.qty}
                                                            onChange={(e) => updateItemRow(idx, 'qty', Number(e.target.value))}
                                                            className="w-16 text-xs border border-brand-light rounded-lg py-1.5 px-2 focus:ring-brand-light focus:outline-none"
                                                        />
                                                    </td>
                                                    {/* Price */}
                                                    <td className="px-3 py-3">
                                                        <div className="relative">
                                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span>
                                                            <input 
                                                                type="number" 
                                                                min="0"
                                                                value={row.price_per_unit}
                                                                onChange={(e) => updateItemRow(idx, 'price_per_unit', Number(e.target.value))}
                                                                className="w-24 pl-7 pr-2 py-1.5 text-xs border border-brand-light rounded-lg focus:ring-brand-light focus:outline-none font-semibold text-right"
                                                            />
                                                        </div>
                                                    </td>
                                                    {/* Discount */}
                                                    <td className="px-3 py-3">
                                                        <div className="relative">
                                                            <input 
                                                                type="number" 
                                                                min="0"
                                                                max="100"
                                                                value={row.discount}
                                                                onChange={(e) => updateItemRow(idx, 'discount', Number(e.target.value))}
                                                                className="w-16 pr-5 pl-2 py-1.5 text-xs border border-brand-light rounded-lg focus:ring-brand-light focus:outline-none font-semibold text-right"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                                                        </div>
                                                    </td>
                                                    {/* Tax checkbox */}
                                                    <td className="px-3 py-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => updateItemRow(idx, 'tax_enabled', !row.tax_enabled)}
                                                            className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition ${row.tax_enabled 
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                                                : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                                                        >
                                                            PPN
                                                        </button>
                                                    </td>
                                                    {/* Subtotal */}
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                        {formatRupiah(calculateRowSubtotal(row))}
                                                    </td>
                                                    {/* Action remove */}
                                                    <td className="px-3 py-3">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeRow(idx)}
                                                            disabled={data.items.length <= 1}
                                                            className={`text-gray-400 hover:text-red-500 transition ${data.items.length <= 1 ? 'opacity-40 pointer-events-none' : ''}`}
                                                        >
                                                            <iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button 
                                    type="button" 
                                    onClick={addRow}
                                    className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-secondary font-bold transition pt-2"
                                >
                                    <iconify-icon icon="solar:plus-circle-linear" class="text-lg"></iconify-icon>
                                    Tambah Baris Baru
                                </button>
                            </div>

                            {/* 4. Catatan & Ketentuan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-3">
                                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <iconify-icon icon="solar:pen-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Catatan & Ketentuan
                                </h3>
                                <textarea 
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Tambahkan catatan internal atau ketentuan khusus untuk pemasok..."
                                    rows="4" 
                                    className="w-full text-xs border border-brand-light rounded-xl p-4 focus:ring-2 focus:ring-brand-light focus:outline-none bg-brand-bg"
                                />
                            </div>

                            {/* 5. Lampiran Pendukung */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-3">
                                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <iconify-icon icon="solar:upload-minimalistic-linear" class="text-brand-primary text-base"></iconify-icon>
                                    Lampiran Pendukung
                                </h3>
                                <div className="border-2 border-dashed border-brand-light hover:bg-brand-light/5 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition">
                                    <div className="w-12 h-12 rounded-full bg-brand-light/40 flex items-center justify-center text-brand-primary mb-3">
                                        <iconify-icon icon="solar:upload-linear" class="text-2xl"></iconify-icon>
                                    </div>
                                    <p className="text-xs font-bold text-brand-dark mb-1">Klik atau geser file ke sini</p>
                                    <p className="text-[10px] text-gray-400 font-medium">PDF, JPG, PNG (Maks. 5MB)</p>
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT COLUMN (SUMMARY & STATUS) ── */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* 1. Ringkasan Biaya */}
                            <div className="bg-white rounded-2xl border border-brand-light shadow-sm overflow-hidden">
                                <div className="h-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
                                <div className="p-6 space-y-6">
                                    <h3 className="font-extrabold text-brand-dark text-sm">Ringkasan Biaya</h3>
                                    
                                    <div className="space-y-4 text-xs">
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Subtotal</span>
                                            <span className="font-bold text-gray-900">{formatRupiah(calculateSubtotal())}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Diskon Keseluruhan (%)</span>
                                            <div className="relative">
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    max="100"
                                                    value={data.discount_global}
                                                    onChange={(e) => setData('discount_global', Number(e.target.value))}
                                                    className="w-20 pr-5 pl-2 py-1.5 text-xs border border-brand-light rounded-lg focus:outline-none font-semibold text-right"
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <span>Pajak (PPN 11%)</span>
                                                <span className="bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded text-[9px] border border-emerald-200">Otomatis</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{formatRupiah(calculateTax())}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-gray-500 border-b border-brand-light/50 pb-4">
                                            <span>Ongkos Kirim</span>
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={data.shipping_cost}
                                                onChange={(e) => setData('shipping_cost', Number(e.target.value))}
                                                className="w-24 pl-3 pr-2 py-1.5 text-xs border border-brand-light rounded-lg focus:outline-none font-semibold text-right"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-extrabold text-brand-dark text-sm">Total Keseluruhan</span>
                                            <span className="text-xl font-extrabold text-brand-primary">{formatRupiah(calculateTotal())}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium block text-right">Terhitung dalam mata uang IDR</span>
                                    </div>

                                    <div className="space-y-2.5 pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition shadow-sm active:scale-[0.98]"
                                        >
                                            <iconify-icon icon="solar:check-circle-linear" class="text-base"></iconify-icon>
                                            Kirim untuk Approval
                                        </button>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <button 
                                                type="button" 
                                                className="w-full border border-brand-light hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-bold text-xs transition"
                                            >
                                                Simpan Draft
                                            </button>
                                            <Link 
                                                href={route('purchase-orders.index')}
                                                className="w-full border border-brand-light hover:bg-gray-50 text-gray-500 py-2.5 rounded-xl font-bold text-xs text-center block transition"
                                            >
                                                Batal
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Checklist Validasi */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-gray-900 tracking-wide">CHECKLIST VALIDASI</h4>
                                    <iconify-icon icon="solar:alt-arrow-down-linear" class="text-gray-400"></iconify-icon>
                                </div>
                                <div className="space-y-3 text-xs">
                                    {/* Supplier check */}
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon 
                                            icon={isSupplierValid ? "solar:check-circle-bold" : "solar:close-circle-bold"} 
                                            class={`text-lg ${isSupplierValid ? 'text-emerald-500' : 'text-gray-300'}`}
                                        />
                                        <span className={isSupplierValid ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                                            Pilih pemasok yang terdaftar
                                        </span>
                                    </div>

                                    {/* Items check */}
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon 
                                            icon={isItemsValid ? "solar:check-circle-bold" : "solar:close-circle-bold"} 
                                            class={`text-lg ${isItemsValid ? 'text-emerald-500' : 'text-gray-300'}`}
                                        />
                                        <span className={isItemsValid ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                                            Minimal satu item dengan kuantitas &gt; 0
                                        </span>
                                    </div>

                                    {/* Location check */}
                                    <div className="flex items-center gap-2.5">
                                        <iconify-icon 
                                            icon={isLocationValid ? "solar:check-circle-bold" : "solar:close-circle-bold"} 
                                            class={`text-lg ${isLocationValid ? 'text-emerald-500' : 'text-gray-300'}`}
                                        />
                                        <span className={isLocationValid ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                                            Tentukan lokasi pengiriman
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Log Perubahan */}
                            <div className="bg-white p-6 rounded-2xl border border-brand-light shadow-sm space-y-3">
                                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider flex items-center gap-2">
                                    <iconify-icon icon="solar:history-linear" class="text-lg"></iconify-icon>
                                    Log Perubahan
                                </h4>
                                <div className="border-l border-gray-100 pl-3.5 space-y-1">
                                    <p className="text-xs font-bold text-brand-dark">Draft Dibuat</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Oleh Alex Manager • Baru saja</p>
                                </div>
                            </div>

                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}

PurchaseOrderCreate.layout = (page) => <AppLayout>{page}</AppLayout>;
