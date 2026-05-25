{{-- resources/views/shared/recipe-costiong/create.blade.php --}}
@extends('layouts.app')

@section('content')
    <div class="flex h-[calc(100vh-72px)] bg-[#fbfbfe] items-center justify-center p-8">
        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm w-full max-w-3xl">

            {{-- Header --}}
            <div class="px-8 py-6 border-b border-[#dddbff] flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-bold text-[#050316]">Tambah Resep Baru</h2>
                    <p class="text-xs text-[#2f27ce]/70 mt-1">Pilih menu lalu susun komposisi bahan bakunya</p>
                </div>
                <a href="{{ route('recipe.index') }}"
                    class="text-xs font-semibold text-[#2f27ce]/60 hover:text-[#443dff] transition flex items-center gap-1">
                    <iconify-icon icon="solar:alt-arrow-left-linear"></iconify-icon> Kembali
                </a>
            </div>

            <form action="{{ route('recipe.store') }}" method="POST" class="px-8 py-6 space-y-6">
                @csrf

                {{-- Pilih Menu --}}
                <div>
                    <label class="block text-xs font-bold text-[#2f27ce] uppercase tracking-wider mb-2">Menu</label>
                    <select name="menu_id" required
                        class="w-full px-4 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                        <option value="" disabled selected>-- Pilih menu --</option>
                        @foreach ($menus as $menu)
                            <option value="{{ $menu->id }}" {{ old('menu_id') == $menu->id ? 'selected' : '' }}>
                                {{ $menu->name }} — Rp {{ number_format($menu->price, 0, ',', '.') }}
                            </option>
                        @endforeach
                    </select>
                    @error('menu_id')
                        <p class="text-xs text-rose-500 mt-1">{{ $message }}</p>
                    @enderror
                </div>

                {{-- Notes --}}
                <div>
                    <label class="block text-xs font-bold text-[#2f27ce] uppercase tracking-wider mb-2">Catatan
                        (opsional)</label>
                    <textarea name="notes" rows="2" placeholder="Contoh: versi summer, tanpa gula, dll..."
                        class="w-full px-4 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all resize-none">{{ old('notes') }}</textarea>
                </div>

                {{-- Komposisi Bahan --}}
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <label class="text-xs font-bold text-[#2f27ce] uppercase tracking-wider">Komposisi Bahan
                            Baku</label>
                        <button type="button" id="btn-tambah-bahan"
                            class="flex items-center gap-1 text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-[#443dff] hover:bg-[#dddbff] transition-all">
                            <iconify-icon icon="solar:add-circle-linear"></iconify-icon> Tambah Bahan
                        </button>
                    </div>

                    @error('ingredients')
                        <p class="text-xs text-rose-500 mb-2">{{ $message }}</p>
                    @enderror

                    <div id="ingredients-wrapper" class="space-y-3">
                        {{-- Row pertama default --}}
                        <div class="ingredient-row grid grid-cols-12 gap-3 items-start">
                            <div class="col-span-5">
                                <select name="ingredients[0][inventory_id]" required
                                    class="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                                    <option value="" disabled selected>-- Pilih bahan --</option>
                                    @foreach ($inventories as $inv)
                                        <option value="{{ $inv->id }}" data-price="{{ $inv->price_per_unit }}"
                                            data-unit="{{ $inv->unit }}">
                                            {{ $inv->name }} (Rp
                                            {{ number_format($inv->price_per_unit, 0, ',', '.') }}/{{ $inv->unit }})
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
                                    class="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
                            </div>
                            <div class="col-span-1 flex items-center justify-center pt-1">
                                <button type="button"
                                    class="btn-hapus-bahan w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center opacity-0 pointer-events-none">
                                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Footer Form --}}
                <div class="flex items-center justify-between pt-4 border-t border-[#dddbff]">
                    <a href="{{ route('recipe.index') }}"
                        class="px-5 py-2.5 text-sm font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition">
                        Batal
                    </a>
                    <button type="submit"
                        class="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] rounded-xl transition shadow-lg shadow-[#443dff]/30 active:scale-95">
                        <iconify-icon icon="solar:diskette-bold-duotone"></iconify-icon> Simpan Resep
                    </button>
                </div>
            </form>
        </div>
    </div>

    @push('scripts')
        <script>
            let rowIndex = 1;
            const wrapper = document.getElementById('ingredients-wrapper');
            const inventories = {!! $inventoriesJson !!};

            function buildOptions(selectedId = null) {
                return inventories.map(inv =>
                    `<option value="${inv.id}" data-unit="${inv.unit}"
                ${inv.id == selectedId ? 'selected' : ''}>
                ${inv.name} (Rp ${inv.price.toLocaleString('id-ID')}/${inv.unit})
            </option>`
                ).join('');
            }

            function makeRow(index) {
                return `
        <div class="ingredient-row grid grid-cols-12 gap-3 items-start">
            <div class="col-span-5">
                <select name="ingredients[${index}][inventory_id]" required
                    class="inv-select w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                    <option value="" disabled selected>-- Pilih bahan --</option>
                    ${buildOptions()}
                </select>
            </div>
            <div class="col-span-3">
                <input type="number" name="ingredients[${index}][qty]" min="0.01" step="0.01"
                    placeholder="Qty" required
                    class="w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
            </div>
            <div class="col-span-3">
                <input type="text" name="ingredients[${index}][unit]"
                    placeholder="Satuan (g, ml...)" required
                    class="unit-input w-full px-3 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
            </div>
            <div class="col-span-1 flex items-center justify-center pt-1">
                <button type="button"
                    class="btn-hapus-bahan w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center">
                    <iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon>
                </button>
            </div>
        </div>`;
            }

            // Auto-fill satuan saat pilih bahan
            wrapper.addEventListener('change', function(e) {
                if (e.target.classList.contains('inv-select')) {
                    const row = e.target.closest('.ingredient-row');
                    const unitInput = row.querySelector('.unit-input');
                    const selected = e.target.options[e.target.selectedIndex];
                    if (unitInput && selected.dataset.unit) {
                        unitInput.value = selected.dataset.unit;
                    }
                }
            });

            // Tambah row bahan
            document.getElementById('btn-tambah-bahan').addEventListener('click', function() {
                wrapper.insertAdjacentHTML('beforeend', makeRow(rowIndex++));
            });

            // Hapus row bahan
            wrapper.addEventListener('click', function(e) {
                const btn = e.target.closest('.btn-hapus-bahan');
                if (btn) {
                    const rows = wrapper.querySelectorAll('.ingredient-row');
                    if (rows.length > 1) btn.closest('.ingredient-row').remove();
                }
            });
        </script>
    @endpush
@endsection
