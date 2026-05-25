{{-- ===== MODAL TAMBAH RESEP ===== --}}
<dialog id="modal-tambah-resep"
    class="rounded-2xl border border-[#dddbff] shadow-2xl w-full max-w-2xl p-0 backdrop:bg-[#050316]/50">
    <div class="flex flex-col max-h-[90vh]">

        {{-- Header --}}
        <div class="px-6 py-5 border-b border-[#dddbff] flex items-center justify-between flex-shrink-0">
            <div>
                <h3 class="font-bold text-[#050316]">Tambah Resep Baru</h3>
                <p class="text-xs text-[#2f27ce]/70 mt-0.5">Pilih menu lalu susun komposisi bahan bakunya</p>
            </div>
            <button id="btn-tutup-modal-create" type="button"
                class="w-8 h-8 rounded-xl text-[#2f27ce]/50 hover:bg-[#dddbff] hover:text-[#443dff] transition flex items-center justify-center">
                <iconify-icon icon="solar:close-circle-linear" class="text-xl"></iconify-icon>
            </button>
        </div>

        {{-- Form --}}
        <form action="{{ route('recipe.store') }}" method="POST" class="flex flex-col flex-1 overflow-hidden">
            @csrf

            <div class="overflow-y-auto px-6 py-5 space-y-5">

                {{-- Pilih Menu --}}
                <div>
                    <label class="block text-xs font-bold text-[#2f27ce] uppercase tracking-wider mb-2">Menu</label>
                    <select name="menu_id" required
                        class="w-full px-4 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                        <option value="" disabled selected>-- Pilih menu --</option>
                        @foreach ($menus as $menu)
                            <option value="{{ $menu->id }}">
                                {{ $menu->name }} — Rp {{ number_format($menu->price, 0, ',', '.') }}
                            </option>
                        @endforeach
                    </select>
                </div>

                {{-- Notes --}}
                <div>
                    <label class="block text-xs font-bold text-[#2f27ce] uppercase tracking-wider mb-2">Catatan
                        (opsional)</label>
                    <textarea name="notes" rows="2" placeholder="Contoh: versi summer, tanpa gula, dll..."
                        class="w-full px-4 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all resize-none"></textarea>
                </div>

                {{-- Komposisi Bahan --}}
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <label class="text-xs font-bold text-[#2f27ce] uppercase tracking-wider">Komposisi Bahan
                            Baku</label>
                        <button type="button" id="btn-tambah-bahan-create"
                            class="flex items-center gap-1 text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-[#443dff] hover:bg-[#dddbff] transition-all">
                            <iconify-icon icon="solar:add-circle-linear"></iconify-icon> Tambah Bahan
                        </button>
                    </div>

                    <div id="create-ingredients-wrapper" class="space-y-3">
                        {{-- Row pertama default --}}
                        <div class="ingredient-row grid grid-cols-12 gap-3 items-center">
                            <div class="col-span-5">
                                <select name="ingredients[0][inventory_id]" required
                                    class="inv-select-create w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                                    <option value="" disabled selected>-- Pilih bahan --</option>
                                    @foreach ($inventories as $inv)
                                        <option value="{{ $inv->id }}" data-unit="{{ $inv->unit }}">
                                            {{ $inv->name }} (Rp {{ number_format($inv->price_per_unit, 0, ',', '.') }}/{{ $inv->unit }})
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-span-3">
                                <input type="number" name="ingredients[0][qty]" min="0.01" step="0.01"
                                    placeholder="Qty" required
                                    class="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
                            </div>
                            <div class="col-span-3">
                                <input type="text" name="ingredients[0][unit]" placeholder="Satuan (g, ml...)" required
                                    class="unit-input-create w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
                            </div>
                            <div class="col-span-1 flex justify-center">
                                <button type="button"
                                    class="btn-hapus-create w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center opacity-0 pointer-events-none">
                                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Footer --}}
            <div class="px-6 py-4 border-t border-[#dddbff] flex items-center justify-between flex-shrink-0">
                <button type="button" id="btn-batal-modal-create"
                    class="px-5 py-2.5 text-sm font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition">
                    Batal
                </button>
                <button type="submit"
                    class="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] rounded-xl transition shadow-lg shadow-[#443dff]/30 active:scale-95">
                    <iconify-icon icon="solar:diskette-bold-duotone"></iconify-icon> Simpan Resep
                </button>
            </div>
        </form>
    </div>
</dialog>