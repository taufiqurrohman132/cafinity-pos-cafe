@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#fbfbfe] p-4 md:p-6">

    {{-- ====== TOP NAV ====== --}}
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2 text-sm text-[#2f27ce] font-medium">
            <a href="{{ route('menus.index') }}" class="flex items-center gap-1.5 hover:text-[#050316] transition-colors font-bold">
                <iconify-icon icon="solar:arrow-left-bold" class="text-base"></iconify-icon>
                Kembali ke Menu
            </a>
            <span class="text-[#dddbff]">/</span>
            <span class="text-[#050316] font-extrabold truncate max-w-[200px]">{{ $menu->name }}</span>
        </div>
        <div class="flex items-center gap-3">
            <button class="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#dddbff] text-sm font-bold text-[#2f27ce] bg-white hover:bg-[#dddbff] hover:text-[#050316] transition-all shadow-sm">
                <iconify-icon icon="solar:share-bold"></iconify-icon> Bagikan
            </button>
            <a href="{{ route('menus.edit', $menu->id) }}"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white text-sm font-bold transition-all shadow-lg shadow-[#443dff]/30">
                <iconify-icon icon="solar:pen-bold"></iconify-icon> Edit Produk
            </a>
        </div>
    </div>

    {{-- ====== HERO SECTION ====== --}}
    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 mb-6">
        <div class="flex flex-col lg:flex-row gap-8">

            {{-- Image --}}
            <div class="relative w-full lg:w-72 h-64 lg:h-72 flex-shrink-0">
                @if ($menu->image)
                    <img src="{{ asset('storage/' . $menu->image) }}" alt="{{ $menu->name }}"
                        class="w-full h-full object-cover rounded-2xl border border-[#dddbff]">
                @else
                    <div class="w-full h-full bg-[#dddbff]/30 rounded-2xl border border-[#dddbff] flex items-center justify-center text-6xl">
                        {{ $menu->emoji ?? '☕' }}
                    </div>
                @endif
                @if ($menu->is_best_seller ?? false)
                    <span class="absolute top-3 left-3 bg-[#443dff] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md tracking-wide">
                        🏆 Terlaris #1
                    </span>
                @endif
            </div>

            {{-- Info --}}
            <div class="flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[11px] font-extrabold bg-[#dddbff] text-[#2f27ce] px-3 py-1 rounded-full border border-[#dddbff]">
                            {{ $menu->category->name ?? 'Uncategorized' }}
                        </span>
                        <span class="text-[11px] font-medium text-[#2f27ce]/60 flex items-center gap-1">
                            <iconify-icon icon="solar:tag-bold-duotone" class="text-xs"></iconify-icon>
                            SKU: {{ $menu->sku ?? 'N/A' }}
                        </span>
                    </div>
                    <h1 class="text-3xl font-extrabold text-[#050316] tracking-tight mb-2">{{ $menu->name }}</h1>
                    <p class="text-sm text-[#2f27ce]/70 font-medium leading-relaxed mb-6">{{ $menu->description ?? 'Tidak ada deskripsi.' }}</p>
                </div>

                {{-- Stat Cards --}}
                <div class="grid grid-cols-2 gap-4">
                    {{-- Harga Jual --}}
                    <div class="p-4 rounded-2xl border border-[#dddbff] bg-[#fbfbfe]">
                        <p class="text-xs font-extrabold text-[#2f27ce] mb-1 uppercase tracking-wide">Harga Jual</p>
                        <div class="flex items-center justify-between">
                            <p class="text-2xl font-extrabold text-[#050316]">Rp {{ number_format($menu->price, 0, ',', '.') }}</p>
                            <div class="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center border border-[#dddbff]">
                                <iconify-icon icon="solar:dollar-minimalistic-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                            </div>
                        </div>
                        <p class="text-[10px] text-[#2f27ce]/60 font-medium mt-1">Harga standar outlet</p>
                    </div>

                    {{-- HPP --}}
                    <div class="p-4 rounded-2xl border border-[#dddbff] bg-[#fbfbfe]">
                        <p class="text-xs font-extrabold text-[#2f27ce] mb-1 uppercase tracking-wide">HPP (COGS)</p>
                        <div class="flex items-center justify-between">
                            <p class="text-2xl font-extrabold text-[#050316]">Rp {{ number_format($menu->hpp ?? 0, 0, ',', '.') }}</p>
                            <div class="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center border border-[#dddbff]">
                                <iconify-icon icon="solar:cart-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                            </div>
                        </div>
                        <p class="text-[10px] text-[#2f27ce]/60 font-medium mt-1">Biaya bahan baku per porsi</p>
                    </div>

                    {{-- Laba Bersih --}}
                    <div class="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                        <p class="text-xs font-extrabold text-emerald-700 mb-1 uppercase tracking-wide">Laba Bersih</p>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-2xl font-extrabold text-emerald-600">+Rp {{ number_format(($menu->price ?? 0) - ($menu->hpp ?? 0), 0, ',', '.') }}</p>
                                @if ($menu->profit_trend ?? false)
                                    <p class="text-[10px] font-bold text-emerald-500 mt-0.5">{{ $menu->profit_trend }} vs bulan lalu</p>
                                @endif
                            </div>
                            <div class="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200">
                                <iconify-icon icon="solar:graph-up-bold-duotone" class="text-lg text-emerald-600"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    {{-- Margin --}}
                    <div class="p-4 rounded-2xl border border-[#dddbff] bg-[#fbfbfe]">
                        <p class="text-xs font-extrabold text-[#2f27ce] mb-1 uppercase tracking-wide">Margin Profit</p>
                        <div class="flex items-center justify-between">
                            @php
                                $margin = $menu->price > 0
                                    ? round((($menu->price - ($menu->hpp ?? 0)) / $menu->price) * 100)
                                    : 0;
                            @endphp
                            <div>
                                <p class="text-2xl font-extrabold text-[#050316]">{{ $margin }}%</p>
                                <p class="text-[10px] font-medium text-[#2f27ce]/60 mt-0.5">
                                    {{ $margin >= 60 ? 'Efisiensi biaya sangat baik' : ($margin >= 40 ? 'Efisiensi biaya baik' : 'Perlu evaluasi HPP') }}
                                </p>
                            </div>
                            <div class="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center border border-[#dddbff]">
                                <iconify-icon icon="solar:pie-chart-2-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- ====== TAB NAV ====== --}}
    <div class="border-b border-[#dddbff] mb-6 bg-white rounded-t-2xl px-6 pt-4 -mb-px">
        <div class="flex gap-6 text-sm font-bold">
            <button onclick="switchTab('ringkasan')" id="tab-ringkasan"
                class="tab-btn pb-3 border-b-2 border-[#443dff] text-[#443dff] transition-all">
                Ringkasan Performa
            </button>
            <button onclick="switchTab('bahan')" id="tab-bahan"
                class="tab-btn pb-3 border-b-2 border-transparent text-[#2f27ce]/50 hover:text-[#2f27ce] transition-all">
                Bahan Baku
            </button>
            <button onclick="switchTab('ulasan')" id="tab-ulasan"
                class="tab-btn pb-3 border-b-2 border-transparent text-[#2f27ce]/50 hover:text-[#2f27ce] transition-all">
                Ulasan Pelanggan
            </button>
            <button onclick="switchTab('riwayat')" id="tab-riwayat"
                class="tab-btn pb-3 border-b-2 border-transparent text-[#2f27ce]/50 hover:text-[#2f27ce] transition-all">
                Riwayat Perubahan
            </button>
        </div>
    </div>

    {{-- ====== TAB CONTENT ====== --}}
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {{-- LEFT: Chart & Table --}}
        <div class="xl:col-span-8 space-y-6">

            {{-- TAB: Ringkasan --}}
            <div id="panel-ringkasan">
                <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                    <div class="flex items-center justify-between mb-1">
                        <div>
                            <h3 class="font-extrabold text-[#050316] tracking-tight">Tren Penjualan Mingguan</h3>
                            <p class="text-xs text-[#2f27ce]/60 font-medium">Volume penjualan per hari (7 hari terakhir)</p>
                        </div>
                        <a href="{{ route('reports.index') }}"
                            class="text-xs font-bold border border-[#dddbff] text-[#2f27ce] px-4 py-2 rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
                            Detail Laporan
                        </a>
                    </div>

                    {{-- Line Chart (SVG) --}}
                    <div class="mt-6 relative h-52 w-full">
                        @php
                            $chartData = $weeklySales ?? [40, 35, 55, 50, 70, 95, 90];
                            $labels    = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
                            $maxVal    = max($chartData) ?: 1;
                            $w = 100; $h = 100;
                            $pts = [];
                            foreach ($chartData as $i => $v) {
                                $x = ($i / (count($chartData) - 1)) * $w;
                                $y = $h - ($v / $maxVal) * $h;
                                $pts[] = "$x,$y";
                            }
                            $polyline = implode(' ', $pts);
                            // fill polygon (close path to bottom)
                            $fill = $polyline . " {$w},{$h} 0,{$h}";
                        @endphp
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute inset-0 w-full h-full">
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#443dff" stop-opacity="0.15"/>
                                    <stop offset="100%" stop-color="#443dff" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                            {{-- Grid lines --}}
                            @foreach ([25, 50, 75, 100] as $g)
                                <line x1="0" y1="{{ 100 - $g }}" x2="100" y2="{{ 100 - $g }}"
                                    stroke="#dddbff" stroke-width="0.5" stroke-dasharray="2,2"/>
                            @endforeach
                            {{-- Fill --}}
                            <polygon points="{{ $fill }}" fill="url(#areaGrad)"/>
                            {{-- Line --}}
                            <polyline points="{{ $polyline }}"
                                fill="none" stroke="#443dff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
                            {{-- Dots --}}
                            @foreach ($chartData as $i => $v)
                                @php
                                    $x = ($i / (count($chartData) - 1)) * $w;
                                    $y = $h - ($v / $maxVal) * $h;
                                @endphp
                                <circle cx="{{ $x }}" cy="{{ $y }}" r="1.5" fill="#443dff"/>
                            @endforeach
                        </svg>

                        {{-- Y-axis labels --}}
                        <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] font-bold text-[#2f27ce]/40 pr-2 pb-0">
                            <span>{{ $maxVal }}</span>
                            <span>{{ round($maxVal * 0.75) }}</span>
                            <span>{{ round($maxVal * 0.5) }}</span>
                            <span>{{ round($maxVal * 0.25) }}</span>
                            <span>0</span>
                        </div>
                    </div>

                    {{-- X-axis labels --}}
                    <div class="flex justify-between mt-2 text-[10px] font-extrabold text-[#2f27ce]/50 px-2">
                        @foreach ($labels as $label)
                            <span>{{ $label }}</span>
                        @endforeach
                    </div>

                    {{-- Legend --}}
                    <div class="flex items-center gap-6 mt-4 text-xs font-bold text-[#2f27ce]">
                        <span class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-[#443dff] shadow-sm"></span> Unit Terjual
                        </span>
                        @if ($weeklyGrowth ?? false)
                            <span class="flex items-center gap-1.5 text-emerald-600">
                                <iconify-icon icon="solar:graph-up-bold"></iconify-icon>
                                +{{ $weeklyGrowth }}% Pertumbuhan Mingguan
                            </span>
                        @endif
                    </div>
                </div>
            </div>

            {{-- TAB: Bahan Baku --}}
            <div id="panel-bahan" class="hidden">
                <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                    <h3 class="font-extrabold text-[#050316] mb-5 tracking-tight">Komposisi Bahan Baku</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[500px]">
                            <thead>
                                <tr class="text-xs text-[#2f27ce] border-b border-[#dddbff] uppercase tracking-wider">
                                    <th class="pb-3 font-extrabold">Bahan</th>
                                    <th class="pb-3 font-extrabold">Qty</th>
                                    <th class="pb-3 font-extrabold">Satuan</th>
                                    <th class="pb-3 font-extrabold text-right">Biaya</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                @forelse ($menu->recipes ?? [] as $recipe)
                                    <tr class="border-b border-[#dddbff]/50 last:border-0 hover:bg-[#dddbff]/10 transition-colors">
                                        <td class="py-3 font-bold text-[#050316]">{{ $recipe->ingredient->name }}</td>
                                        <td class="py-3 text-[#050316]/70 font-medium">{{ $recipe->quantity }}</td>
                                        <td class="py-3 text-[#050316]/70 font-medium">{{ $recipe->ingredient->unit }}</td>
                                        <td class="py-3 text-right font-extrabold text-[#050316]">Rp {{ number_format($recipe->cost ?? 0, 0, ',', '.') }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="py-8 text-center text-[#2f27ce] italic text-sm">Belum ada resep yang ditambahkan.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {{-- TAB: Ulasan --}}
            <div id="panel-ulasan" class="hidden">
                <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                    <h3 class="font-extrabold text-[#050316] mb-5 tracking-tight">Ulasan Pelanggan</h3>
                    <p class="text-sm text-[#2f27ce] italic text-center py-8">Belum ada ulasan untuk menu ini.</p>
                </div>
            </div>

            {{-- TAB: Riwayat --}}
            <div id="panel-riwayat" class="hidden">
                <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                    <h3 class="font-extrabold text-[#050316] mb-5 tracking-tight">Riwayat Perubahan</h3>
                    <div class="space-y-4">
                        @forelse ($menu->audits ?? [] as $audit)
                            <div class="flex gap-3 p-3 rounded-xl hover:bg-[#dddbff]/10 transition-colors">
                                <div class="w-2 h-2 mt-1.5 rounded-full bg-[#443dff] flex-shrink-0"></div>
                                <div>
                                    <p class="text-xs font-bold text-[#050316]">{{ $audit->event }} oleh {{ $audit->user->name ?? 'System' }}</p>
                                    <p class="text-[10px] font-medium text-[#2f27ce]/60 mt-0.5">{{ $audit->created_at->diffForHumans() }}</p>
                                </div>
                            </div>
                        @empty
                            <p class="text-sm text-[#2f27ce] italic text-center py-8">Belum ada riwayat perubahan.</p>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>

        {{-- RIGHT SIDEBAR --}}
        <div class="xl:col-span-4 space-y-6">

            {{-- Status Bahan Baku --}}
            <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                <div class="flex items-center gap-2 mb-5">
                    <iconify-icon icon="solar:box-minimalistic-bold-duotone" class="text-xl text-[#443dff]"></iconify-icon>
                    <h3 class="font-extrabold text-[#050316] tracking-tight">Status Bahan Baku</h3>
                </div>
                <div class="space-y-3">
                    @forelse ($menu->recipes ?? [] as $recipe)
                        @php
                            $stock      = $recipe->ingredient->stock ?? 0;
                            $minStock   = $recipe->ingredient->min_stock ?? 0;
                            $isSafe     = $stock > $minStock;
                            $isLow      = $stock <= $minStock && $stock > 0;
                            $isEmpty    = $stock <= 0;
                        @endphp
                        <div class="flex items-center justify-between p-3 rounded-xl border
                            {{ $isEmpty ? 'border-rose-200 bg-rose-50/50' : ($isLow ? 'border-amber-200 bg-amber-50/50' : 'border-[#dddbff] bg-[#fbfbfe]') }}">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-[#dddbff]/30 border border-[#dddbff] flex items-center justify-center">
                                    <iconify-icon icon="solar:box-bold-duotone" class="text-sm text-[#443dff]"></iconify-icon>
                                </div>
                                <div>
                                    <p class="text-xs font-extrabold text-[#050316]">{{ $recipe->ingredient->name }}</p>
                                    <p class="text-[10px] font-medium text-[#2f27ce]/60">{{ $stock }} {{ $recipe->ingredient->unit }}</p>
                                </div>
                            </div>
                            @if ($isEmpty)
                                <span class="text-[9px] font-extrabold bg-rose-100 text-rose-700 px-2 py-1 rounded-md border border-rose-200">Habis</span>
                            @elseif ($isLow)
                                <span class="text-[9px] font-extrabold bg-amber-100 text-amber-700 px-2 py-1 rounded-md border border-amber-200">Menipis</span>
                            @else
                                <span class="text-[9px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">Aman</span>
                            @endif
                        </div>
                    @empty
                        <p class="text-xs text-[#2f27ce] italic text-center py-3">Belum ada bahan baku terdaftar.</p>
                    @endforelse
                </div>
                <a href="{{ route('inventories.index') }}"
                    class="block w-full mt-4 py-2.5 text-xs font-extrabold text-[#443dff] border border-[#dddbff] bg-[#fbfbfe] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] text-center transition-colors">
                    Buat Pesanan Pembelian
                </a>
            </div>

            {{-- Promo Aktif --}}
            <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                <div class="flex items-center gap-3 mb-1">
                    <div class="w-10 h-10 rounded-xl bg-[#dddbff]/30 border border-[#dddbff] flex items-center justify-center text-xl">
                        ☕
                    </div>
                    <div>
                        <p class="text-xs font-extrabold text-[#050316]">Promo Aktif</p>
                        @if ($menu->activeBundle ?? false)
                            <p class="text-[10px] font-medium text-[#2f27ce]/70 mt-0.5">{{ $menu->activeBundle->description }}</p>
                        @else
                            <p class="text-[10px] font-medium text-[#2f27ce]/70 mt-0.5">Tidak ada promo aktif saat ini.</p>
                        @endif
                    </div>
                </div>
                <a href="{{ route('bundles.index') }}"
                    class="block mt-3 text-xs font-extrabold text-[#443dff] hover:text-[#2f27ce] transition-colors hover:underline">
                    Lihat Pengaturan Promo →
                </a>
            </div>

            {{-- Quick Actions --}}
            <div class="bg-gradient-to-br from-[#050316] via-[#2f27ce] to-[#443dff] p-5 rounded-2xl border border-[#2f27ce] relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div class="relative z-10">
                    <p class="text-[10px] font-extrabold text-[#dddbff] mb-3 tracking-widest uppercase">⚡ Aksi Cepat</p>
                    <div class="space-y-2">
                        <a href="{{ route('menus.edit', $menu->id) }}"
                            class="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all border border-white/10">
                            <iconify-icon icon="solar:pen-bold"></iconify-icon> Edit Detail Menu
                        </a>
                        <a href="{{ route('recipe.index') }}"
                            class="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all border border-white/10">
                            <iconify-icon icon="solar:notebook-bold"></iconify-icon> Kelola Resep & HPP
                        </a>
                        <a href="{{ route('bundles.index') }}"
                            class="flex items-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-xs font-bold transition-all border border-white/10">
                            <iconify-icon icon="solar:gift-bold"></iconify-icon> Buat Promo Bundle
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<script>
    function switchTab(tab) {
        const panels = ['ringkasan', 'bahan', 'ulasan', 'riwayat'];
        panels.forEach(p => {
            document.getElementById('panel-' + p)?.classList.add('hidden');
            const btn = document.getElementById('tab-' + p);
            if (btn) {
                btn.classList.remove('border-[#443dff]', 'text-[#443dff]');
                btn.classList.add('border-transparent', 'text-[#2f27ce]/50');
            }
        });
        document.getElementById('panel-' + tab)?.classList.remove('hidden');
        const activeBtn = document.getElementById('tab-' + tab);
        if (activeBtn) {
            activeBtn.classList.add('border-[#443dff]', 'text-[#443dff]');
            activeBtn.classList.remove('border-transparent', 'text-[#2f27ce]/50');
        }
    }
</script>
@endsection