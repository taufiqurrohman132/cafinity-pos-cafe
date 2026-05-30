{{-- resources/views/components/menu/modal-create.blade.php --}}
@props(['categories' => []])

<dialog id="menu-create-modal"
    class="backdrop:bg-[#050316]/60 backdrop:backdrop-blur-sm w-full max-w-2xl rounded-2xl p-0 border-0 shadow-2xl">
    <div class="bg-white rounded-2xl w-full border border-[#dddbff] overflow-hidden">

        {{-- Header --}}
        <div class="flex items-start justify-between p-6 border-b border-[#dddbff]/50">
            <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-[#dddbff]/50 border border-[#dddbff] flex items-center justify-center">
                    <iconify-icon icon="solar:dish-bold-duotone" class="text-[#443dff] text-2xl"></iconify-icon>
                </div>
                <div>
                    <h2 class="text-xl font-extrabold text-[#050316] tracking-tight">Tambah Menu</h2>
                    <p class="text-xs font-medium text-[#2f27ce] mt-0.5">Isi data menu baru. Foto bersifat opsional.</p>
                </div>
            </div>
            <button type="button" onclick="document.getElementById('menu-create-modal').close()"
                class="w-8 h-8 rounded-xl bg-[#dddbff]/50 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-[#2f27ce] transition-colors flex-shrink-0 mt-0.5">
                <iconify-icon icon="solar:close-circle-bold" class="text-xl"></iconify-icon>
            </button>
        </div>

        <form method="POST" action="{{ route('menus.store') }}" enctype="multipart/form-data" class="p-6 space-y-5">
            @csrf

            {{-- Foto Upload --}}
            <div>
                <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Foto Menu <span class="font-medium normal-case text-[#2f27ce]/50">(opsional)</span></label>
                <div class="flex items-center gap-4">
                    <div id="create-image-preview"
                        class="w-20 h-20 rounded-xl border-2 border-dashed border-[#dddbff] bg-[#fbfbfe] flex items-center justify-center overflow-hidden flex-shrink-0 transition-all">
                        <iconify-icon icon="solar:camera-add-bold-duotone" class="text-3xl text-[#dddbff]" id="create-image-icon"></iconify-icon>
                        <img id="create-image-thumb" src="" class="w-full h-full object-cover hidden rounded-xl">
                    </div>
                    <div class="flex-1">
                        <label for="create-image-input"
                            class="flex items-center gap-2 px-4 py-2.5 bg-[#fbfbfe] border border-[#dddbff] rounded-xl text-[13px] font-bold text-[#2f27ce] hover:bg-[#dddbff]/50 hover:border-[#443dff] hover:text-[#050316] transition-all cursor-pointer w-fit">
                            <iconify-icon icon="solar:upload-bold" class="text-base"></iconify-icon>
                            Pilih Foto
                        </label>
                        <input type="file" name="image" id="create-image-input" accept="image/*" class="hidden"
                            onchange="previewCreateImage(event)">
                        <p class="text-[11px] text-[#2f27ce]/50 font-medium mt-1.5">JPG, PNG, WEBP — maks. 2MB</p>
                    </div>
                </div>
            </div>

            {{-- Nama & Kategori --}}
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Nama Menu</label>
                    <input type="text" name="name" required placeholder="contoh: Nasi Goreng Spesial"
                        class="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-4 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/30 focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                </div>
                <div>
                    <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Kategori</label>
                    <div class="relative">
                        <select name="category_id" required
                            class="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-4 pr-10 text-[13px] font-bold text-[#2f27ce] appearance-none focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer">
                            <option value="">Pilih kategori...</option>
                            @foreach ($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                        <iconify-icon icon="solar:alt-arrow-down-bold"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-[#2f27ce] text-base pointer-events-none"></iconify-icon>
                    </div>
                </div>
            </div>

            {{-- Harga --}}
            <div>
                <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Harga Jual</label>
                <div class="flex items-center gap-3 border-2 border-[#dddbff] focus-within:border-[#443dff] rounded-xl px-5 py-3 transition-all bg-[#fbfbfe] focus-within:bg-white">
                    <span class="text-lg font-extrabold text-[#050316]">Rp</span>
                    <input type="number" name="price" required min="0" step="500" placeholder="0"
                        class="flex-1 text-lg font-extrabold text-[#050316] bg-transparent border-none outline-none placeholder:text-[#dddbff]">
                </div>
            </div>

            {{-- Deskripsi --}}
            <div>
                <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Deskripsi <span class="font-medium normal-case text-[#2f27ce]/50">(opsional)</span></label>
                <textarea name="description" rows="2" placeholder="Deskripsi singkat menu..."
                    class="w-full bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-4 py-3 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/30 focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all resize-none"></textarea>
            </div>

            {{-- Status --}}
            <div class="flex items-center justify-between p-4 bg-[#fbfbfe] border border-[#dddbff] rounded-xl">
                <div>
                    <p class="text-[13px] font-extrabold text-[#050316]">Status Menu</p>
                    <p class="text-[11px] font-medium text-[#2f27ce]/60 mt-0.5">Aktifkan agar menu langsung tersedia di POS</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="hidden" name="is_active" value="0">
                    <input type="checkbox" name="is_active" value="1" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-[#dddbff] peer-checked:bg-[#443dff] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
            </div>

            {{-- Footer --}}
            <div class="flex items-center justify-end gap-3 pt-2 border-t border-[#dddbff]/50">
                <button type="button" onclick="document.getElementById('menu-create-modal').close()"
                    class="px-5 py-2.5 text-sm font-bold text-[#2f27ce] hover:text-[#050316] transition-colors">
                    Batal
                </button>
                <button type="submit"
                    class="px-6 py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] rounded-xl transition-all shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98] flex items-center gap-2">
                    <iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
                    Simpan Menu
                </button>
            </div>
        </form>
    </div>
</dialog>

@once
    @push('scripts')
        <script>
            function previewCreateImage(event) {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = e => {
                    const thumb = document.getElementById('create-image-thumb');
                    const icon = document.getElementById('create-image-icon');
                    thumb.src = e.target.result;
                    thumb.classList.remove('hidden');
                    icon.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        </script>
    @endpush
@endonce