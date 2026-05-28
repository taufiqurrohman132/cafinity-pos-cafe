export default function InventoryForm({ data, setData, errors, suppliers, categories }) {
    return (
        <div className="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 space-y-5">

            {/* Nama Bahan */}
            <div>
                <label className="block text-xs font-bold text-[#050316] mb-1.5">
                    Nama Bahan <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="Contoh: Susu UHT Full Cream"
                    className={`w-full h-11 px-4 text-sm border rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] transition ${errors.name ? 'border-red-400' : 'border-[#dddbff]'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Kategori & Satuan */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-[#050316] mb-1.5">Kategori</label>
                    <select
                        value={data.inventory_category_id}
                        onChange={e => setData('inventory_category_id', e.target.value)}
                        className="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] transition">
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#050316] mb-1.5">
                        Satuan <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.unit}
                        onChange={e => setData('unit', e.target.value)}
                        placeholder="Contoh: Kg, Liter, Pcs"
                        className={`w-full h-11 px-4 text-sm border rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] transition ${errors.unit ? 'border-red-400' : 'border-[#dddbff]'}`}
                    />
                    {errors.unit && <p className="text-xs text-red-500 mt-1">{errors.unit}</p>}
                </div>
            </div>

            {/* Stok & Min Stok */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-[#050316] mb-1.5">Stok Saat Ini</label>
                    <input
                        type="number"
                        value={data.stock}
                        onChange={e => setData('stock', e.target.value)}
                        min="0" step="0.01"
                        className="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] transition"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#050316] mb-1.5">Minimum Stok</label>
                    <input
                        type="number"
                        value={data.min_stock}
                        onChange={e => setData('min_stock', e.target.value)}
                        min="0" step="0.01"
                        className="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] transition"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Batas stok sebelum peringatan muncul</p>
                </div>
            </div>

            {/* Harga per Satuan */}
            <div>
                <label className="block text-xs font-bold text-[#050316] mb-1.5">Harga per Satuan (Rp)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
                    <input
                        type="number"
                        value={data.price_per_unit}
                        onChange={e => setData('price_per_unit', e.target.value)}
                        min="0" step="1"
                        className="w-full h-11 pl-10 pr-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] transition"
                    />
                </div>
            </div>

            {/* Supplier */}
            <div>
                <label className="block text-xs font-bold text-[#050316] mb-1.5">Supplier</label>
                <select
                    value={data.supplier_id}
                    onChange={e => setData('supplier_id', e.target.value)}
                    className="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] transition">
                    <option value="">-- Pilih Supplier --</option>
                    {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}