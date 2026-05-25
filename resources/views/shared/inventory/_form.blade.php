{{-- Error bag --}}
@if ($errors->any())
    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
        <ul class="text-xs text-red-600 space-y-1 list-disc list-inside">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 space-y-5">

    {{-- Nama Bahan --}}
    <div>
        <label class="block text-xs font-bold text-[#050316] mb-1.5">Nama Bahan <span class="text-red-400">*</span></label>
        <input type="text" name="name" value="{{ old('name', $inventory->name ?? '') }}"
            placeholder="Contoh: Susu UHT Full Cream"
            class="w-full h-11 px-4 text-sm border rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] focus:border-transparent transition
                {{ $errors->has('name') ? 'border-red-400' : 'border-[#dddbff]' }}">
    </div>

    {{-- Kategori & Satuan --}}
    <div class="grid grid-cols-2 gap-4">
        <div>
            <label class="block text-xs font-bold text-[#050316] mb-1.5">Kategori</label>
            <select name="inventory_category_id"
                class="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] focus:border-transparent transition">
                <option value="">-- Pilih Kategori --</option>
                @foreach ($categories as $cat)
                    <option value="{{ $cat->id }}"
                        {{ old('inventory_category_id', $inventory->inventory_category_id ?? '') == $cat->id ? 'selected' : '' }}>
                        {{ $cat->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div>
            <label class="block text-xs font-bold text-[#050316] mb-1.5">Satuan <span class="text-red-400">*</span></label>
            <input type="text" name="unit" value="{{ old('unit', $inventory->unit ?? '') }}"
                placeholder="Contoh: Kg, Liter, Pcs"
                class="w-full h-11 px-4 text-sm border rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] focus:border-transparent transition
                    {{ $errors->has('unit') ? 'border-red-400' : 'border-[#dddbff]' }}">
        </div>
    </div>

    {{-- Stok & Min Stok --}}
    <div class="grid grid-cols-2 gap-4">
        <div>
            <label class="block text-xs font-bold text-[#050316] mb-1.5">Stok Saat Ini</label>
            <input type="number" name="stock" value="{{ old('stock', $inventory->stock ?? 0) }}"
                min="0" step="0.01"
                class="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] focus:border-transparent transition">
        </div>

        <div>
            <label class="block text-xs font-bold text-[#050316] mb-1.5">Minimum Stok</label>
            <input type="number" name="min_stock" value="{{ old('min_stock', $inventory->min_stock ?? 0) }}"
                min="0" step="0.01"
                class="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] focus:border-transparent transition">
            <p class="text-[10px] text-gray-400 mt-1">Batas stok sebelum peringatan muncul</p>
        </div>
    </div>

    {{-- Harga per Satuan --}}
    <div>
        <label class="block text-xs font-bold text-[#050316] mb-1.5">Harga per Satuan (Rp)</label>
        <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
            <input type="number" name="price_per_unit" value="{{ old('price_per_unit', $inventory->price_per_unit ?? 0) }}"
                min="0" step="1"
                class="w-full h-11 pl-10 pr-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] focus:border-transparent transition">
        </div>
    </div>

    {{-- Supplier --}}
    <div>
        <label class="block text-xs font-bold text-[#050316] mb-1.5">Supplier</label>
        <select name="supplier_id"
            class="w-full h-11 px-4 text-sm border border-[#dddbff] rounded-xl bg-[#fbfbfe] focus:outline-none focus:ring-2 focus:ring-[#2f27ce] focus:border-transparent transition">
            <option value="">-- Pilih Supplier --</option>
            @foreach ($suppliers as $supplier)
                <option value="{{ $supplier->id }}"
                    {{ old('supplier_id', $inventory->supplier_id ?? '') == $supplier->id ? 'selected' : '' }}>
                    {{ $supplier->name }}
                </option>
            @endforeach
        </select>
    </div>

</div>