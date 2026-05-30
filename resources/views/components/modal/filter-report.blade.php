@props([
    'kasir'    => collect(),
    'kategori' => collect(),
    'payments' => collect(),
    'days'     => 7,
])

<dialog id="filter-modal" class="backdrop:bg-[#050316]/60 backdrop:backdrop-blur-sm w-full max-w-lg rounded-2xl p-0 border-0 shadow-2xl">
    <div class="bg-white rounded-2xl w-full border border-[#dddbff] overflow-hidden">

        {{-- Header --}}
        <div class="flex items-start justify-between p-6 border-b border-[#dddbff]/50">
            <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-[#dddbff]/50 border border-[#dddbff] flex items-center justify-center">
                    <iconify-icon icon="solar:filter-bold-duotone" class="text-[#443dff] text-2xl"></iconify-icon>
                </div>
                <div>
                    <h2 class="text-xl font-extrabold text-[#050316] tracking-tight">Filter Laporan</h2>
                    <p class="text-xs font-medium text-[#2f27ce] mt-0.5">Saring data laporan sesuai kebutuhan Anda.</p>
                </div>
            </div>
            <button type="button" onclick="document.getElementById('filter-modal').close()"
                class="w-8 h-8 rounded-xl bg-[#dddbff]/50 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-[#2f27ce] transition-colors">
                <iconify-icon icon="solar:close-circle-bold" class="text-xl"></iconify-icon>
            </button>
        </div>

        <form method="GET" action="{{ route('reports.index') }}" class="p-6 space-y-5">

            {{-- Range Tanggal --}}
            <div>
                <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Range Tanggal</label>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs font-bold text-[#050316] mb-1 block">Dari</label>
                        <input type="date" name="start_date"
                            value="{{ request('start_date', now()->subDays($days - 1)->format('Y-m-d')) }}"
                            class="w-full h-11 rounded-xl border border-[#dddbff] focus:border-[#443dff] focus:ring-2 focus:ring-[#dddbff] text-sm font-bold text-[#050316] px-3 bg-[#fbfbfe] outline-none transition-all cursor-pointer">
                    </div>
                    <div>
                        <label class="text-xs font-bold text-[#050316] mb-1 block">Sampai</label>
                        <input type="date" name="end_date"
                            value="{{ request('end_date', now()->format('Y-m-d')) }}"
                            class="w-full h-11 rounded-xl border border-[#dddbff] focus:border-[#443dff] focus:ring-2 focus:ring-[#dddbff] text-sm font-bold text-[#050316] px-3 bg-[#fbfbfe] outline-none transition-all cursor-pointer">
                    </div>
                </div>
                {{-- Quick range pills --}}
                <div class="flex flex-wrap gap-2 mt-3">
                    @foreach ([7 => '7 Hari', 30 => '30 Hari', 90 => '3 Bulan'] as $d => $label)
                        <a href="{{ route('reports.index', ['days' => $d]) }}"
                            class="text-xs font-bold px-3 py-1.5 rounded-lg border transition-all
                                {{ $days == $d ? 'bg-[#2f27ce] text-white border-[#2f27ce]' : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]' }}">
                            {{ $label }}
                        </a>
                    @endforeach
                </div>
            </div>

            {{-- Filter Kategori Menu --}}
            <div>
                <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Kategori Menu</label>
                <div class="relative">
                    <select name="kategori_id"
                        class="w-full h-11 rounded-xl border border-[#dddbff] focus:border-[#443dff] text-sm font-bold text-[#050316] px-4 pr-10 bg-[#fbfbfe] outline-none appearance-none transition-all">
                        <option value="">Semua Kategori</option>
                        @foreach ($kategori as $kat)
                            <option value="{{ $kat->id }}" {{ request('kategori_id') == $kat->id ? 'selected' : '' }}>
                                {{ $kat->name }}
                            </option>
                        @endforeach
                    </select>
                    <iconify-icon icon="solar:alt-arrow-down-bold" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#2f27ce] text-base pointer-events-none"></iconify-icon>
                </div>
            </div>

            {{-- Filter Metode Pembayaran --}}
            <div>
                <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Metode Pembayaran</label>
                <div class="flex flex-wrap gap-2">
                    <label class="cursor-pointer">
                        <input type="radio" name="payment_method" value="" class="sr-only peer"
                            {{ !request('payment_method') ? 'checked' : '' }}>
                        <span class="block text-xs font-bold px-4 py-2 rounded-xl border transition-all
                            peer-checked:bg-[#050316] peer-checked:text-white peer-checked:border-[#050316]
                            bg-white text-[#2f27ce] border-[#dddbff] hover:border-[#443dff]">
                            Semua
                        </span>
                    </label>
                    @foreach ($payments as $method)
                        <label class="cursor-pointer">
                            <input type="radio" name="payment_method" value="{{ $method }}" class="sr-only peer"
                                {{ request('payment_method') === $method ? 'checked' : '' }}>
                            <span class="block text-xs font-bold px-4 py-2 rounded-xl border transition-all
                                peer-checked:bg-[#050316] peer-checked:text-white peer-checked:border-[#050316]
                                bg-white text-[#2f27ce] border-[#dddbff] hover:border-[#443dff]">
                                {{ strtoupper($method) }}
                            </span>
                        </label>
                    @endforeach
                </div>
            </div>

            {{-- Filter Kasir --}}
            <div>
                <label class="text-[11px] font-extrabold text-[#2f27ce] capitalize tracking-widest mb-2 block">Kasir</label>
                <div class="relative">
                    <select name="kasir_id"
                        class="w-full h-11 rounded-xl border border-[#dddbff] focus:border-[#443dff] text-sm font-bold text-[#050316] px-4 pr-10 bg-[#fbfbfe] outline-none appearance-none transition-all">
                        <option value="">Semua Kasir</option>
                        @foreach ($kasir as $k)
                            <option value="{{ $k->id }}" {{ request('kasir_id') == $k->id ? 'selected' : '' }}>
                                {{ $k->name }}
                            </option>
                        @endforeach
                    </select>
                    <iconify-icon icon="solar:alt-arrow-down-bold" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#2f27ce] text-base pointer-events-none"></iconify-icon>
                </div>
            </div>

            {{-- Footer --}}
            <div class="flex items-center gap-3 pt-4 border-t border-[#dddbff]/50">
                <button type="submit"
                    class="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                    <iconify-icon icon="solar:filter-bold" class="text-base"></iconify-icon>
                    Terapkan Filter
                </button>
                <a href="{{ route('reports.index') }}"
                    class="h-11 px-5 rounded-xl border border-[#dddbff] text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-colors flex items-center">
                    Reset
                </a>
            </div>
        </form>
    </div>
</dialog>