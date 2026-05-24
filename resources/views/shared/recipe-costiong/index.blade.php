{{-- resources/views/shared/recipe-costiong/index.blade.php --}}
@extends('layouts.app')

@section('content')
    @php
        /** @var \Illuminate\Pagination\Paginator|\App\Models\Recipe[] $recipes */
        $selectedRecipe = $recipes->first();
    @endphp

    <div class="flex h-[calc(100vh-72px)] bg-[#fbfbfe] overflow-hidden">

        {{-- ======================== SIDEBAR KIRI ======================== --}}
        <div class="w-80 min-w-[280px] bg-white border-r border-[#dddbff] flex flex-col z-10 shadow-[10px_0_30px_rgba(47,39,206,0.03)]">
            {{-- Header Sidebar --}}
            <div class="p-5 border-b border-[#dddbff]/50 flex items-center justify-between bg-[#fbfbfe]/50">
                <h2 class="text-lg font-bold text-[#050316]">Katalog Resep</h2>
                <a href="#" class="w-8 h-8 bg-gradient-to-br from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl flex items-center justify-center font-bold text-lg transition-all shadow-md shadow-[#443dff]/30 active:scale-95">
                    <iconify-icon icon="solar:add-circle-linear" class="text-[20px]"></iconify-icon>
                </a>
            </div>

            {{-- Search --}}
            <div class="px-4 pt-5 pb-2">
                <div class="relative">
                    <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/70 text-sm"></iconify-icon>
                    <input type="text" placeholder="Cari resep menu..."
                        class="w-full pl-10 pr-4 py-2.5 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all" />
                </div>
            </div>

            {{-- List Resep --}}
            <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-auto">
                <p class="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-3 pl-1">Terakhir Diupdate</p>

                @foreach ($recipes as $resep)
                    @php
                        $isActive = $selectedRecipe && $selectedRecipe->id === $resep->id;
                        $menuName = $resep->menu->name ?? 'Menu Dihapus';
                    @endphp
                    <a href="{{ route('recipe.show', $resep) }}" class="block focus:outline-none focus:ring-2 focus:ring-[#443dff] rounded-xl">
                    <div @class([
                        'p-4 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden',
                        'bg-gradient-to-br from-[#443dff] to-[#2f27ce] border-transparent shadow-lg shadow-[#443dff]/20' => $isActive,
                        'bg-white border border-[#dddbff] hover:border-[#443dff] hover:shadow-md hover:shadow-[#dddbff]/50' => !$isActive,
                    ])>
                        @if($isActive)
                            <div class="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full blur-xl -mr-5 -mt-5 pointer-events-none"></div>
                        @endif

                        <div class="flex justify-between items-start mb-1.5 relative z-10">
                            <p @class([
                                'text-sm font-bold line-clamp-1 pr-2',
                                'text-white' => $isActive,
                                'text-[#050316] group-hover:text-[#443dff] transition-colors' => !$isActive,
                            ])>{{ $menuName }}</p>
                            <span @class([
                                'text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0',
                                'bg-[#050316]/20 text-white border border-white/10' => $isActive,
                                'bg-[#dddbff]/50 text-[#2f27ce] border border-[#dddbff]' => !$isActive,
                            ])>{{ $resep->margin }}%</span>
                        </div>
                        <p @class([
                            'text-[10px] font-semibold mb-2 relative z-10',
                            'text-[#dddbff]' => $isActive,
                            'text-[#2f27ce]/70' => !$isActive,
                        ])>{{ strtoupper($resep->menu->category->name ?? 'N/A') }}</p>
                        
                        <div class="flex justify-between items-center relative z-10 mt-2 pt-2 border-t {{ $isActive ? 'border-white/10' : 'border-[#dddbff]/50' }}">
                            <span class="text-[10px] {{ $isActive ? 'text-[#dddbff]' : 'text-[#2f27ce]/70' }}">HPP: Rp {{ number_format($resep->total_hpp, 0, ',', '.') }}</span>
                            <span class="text-xs font-bold {{ $isActive ? 'text-white' : 'text-[#050316]' }}">Rp {{ number_format($resep->menu->price ?? 0, 0, ',', '.') }}</span>
                        </div>
                    </div>
                    </a>
                @endforeach
            </div>

            {{-- Footer Sidebar --}}
            <div class="p-4 border-t border-[#dddbff] bg-[#fbfbfe] text-[10px] text-[#2f27ce]/50 text-center">
                © {{ date('Y') }} Devora POS v2.4.0
            </div>
        </div>

        {{-- ======================== KONTEN UTAMA ======================== --}}
        <div class="flex-1 overflow-y-auto flex flex-col bg-[#fbfbfe]">

            @if ($selectedRecipe)
                @php $menu = $selectedRecipe->menu; @endphp

                {{-- Top Bar --}}
                <div class="bg-white/80 backdrop-blur-md border-b border-[#dddbff] px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div>
                        <div class="flex items-center gap-3 mb-1.5">
                            <h1 class="text-2xl font-bold text-[#050316]">{{ $menu->name ?? 'Menu Dihapus' }}</h1>
                            <span class="text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 border border-[#dddbff] px-3 py-1 rounded-full">{{ strtoupper($menu->category->name ?? 'N/A') }}</span>
                        </div>
                        <p class="text-xs text-[#2f27ce] flex items-center gap-1">
                            <iconify-icon icon="solar:info-circle-bold-duotone" class="text-[#443dff] text-sm"></iconify-icon>
                            Terakhir disinkronisasi dengan harga inventory: 2 jam yang lalu
                        </p>
                    </div>
                <div class="flex items-center gap-3">
                    <a href="{{ route('recipe.index') }}"
                        class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#050316] bg-[#fbfbfe] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-all shadow-sm">
                        <iconify-icon icon="solar:diskette-bold-duotone" class="text-base text-[#443dff]"></iconify-icon> Simpan Perubahan
                    </a>
                    @if (!empty($menu?->id))
                        <a href="{{ route('menus.edit', $menu->id) }}"
                            class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#443dff] hover:to-[#2f27ce] rounded-xl transition-all shadow-md shadow-[#443dff]/30 active:scale-95">
                            Edit Menu
                        </a>
                    @endif
                </div>
                </div>

                <div class="p-8 space-y-6 max-w-7xl mx-auto w-full">

                    {{-- ===== STAT CARDS ===== --}}
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {{-- Total HPP --}}
                        <div class="bg-gradient-to-br from-[#dddbff]/50 to-white border border-[#dddbff] rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <iconify-icon icon="solar:wallet-money-bold-duotone" class="absolute -right-4 -bottom-4 text-6xl text-[#443dff] opacity-10"></iconify-icon>
                            <p class="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-2">Total HPP</p>
                            <div class="flex items-center gap-3 relative z-10">
                                <p class="text-2xl font-bold text-[#050316]">Rp {{ number_format($selectedRecipe->total_hpp, 0, ',', '.') }}</p>
                            </div>
                        </div>

                        {{-- Harga Jual --}}
                        <div class="bg-white border border-[#dddbff] rounded-2xl p-6 shadow-sm">
                            <p class="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-2">Harga Jual</p>
                            <p class="text-2xl font-bold text-[#050316]">Rp {{ number_format($menu->price ?? 0, 0, ',', '.') }}</p>
                        </div>

                        {{-- Margin Kotor --}}
                        <div class="bg-white border border-[#dddbff] rounded-2xl p-6 shadow-sm">
                            <p class="text-[10px] font-bold text-[#2f27ce] uppercase tracking-widest mb-2">Margin Kotor</p>
                            <div class="flex items-center gap-2">
                                <p class="text-2xl font-bold text-[#050316]">{{ $selectedRecipe->margin }}%</p>
                                <iconify-icon icon="solar:graph-up-bold-duotone" class="text-emerald-500 text-xl"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

                        {{-- ===== MAIN LEFT CONTENT ===== --}}
                        <div class="xl:col-span-8 space-y-6">

                            {{-- Komposisi Bahan Baku --}}
                            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="font-bold text-[#050316]">Komposisi Bahan Baku</h3>
                                    <a href="{{ route('recipe.index') }}" class="flex items-center gap-1 text-xs font-semibold text-[#443dff] bg-[#dddbff]/30 px-3 py-1.5 rounded-lg border border-transparent hover:border-[#443dff] hover:bg-[#dddbff] transition-all">
                                        + Tambah Bahan
                                    </a>
                                </div>

                                {{-- Table --}}
                                <div class="overflow-x-auto">
                                    <table class="w-full text-sm">
                                        <thead>
                                            <tr class="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider border-b border-[#dddbff]/50 bg-[#fbfbfe]/50">
                                                <th class="py-3 px-4 text-left">Nama Bahan</th>
                                                <th class="py-3 px-4 text-left">Kuantitas</th>
                                                <th class="py-3 px-4 text-left">Harga Satuan</th>
                                                <th class="py-3 px-4 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-[#dddbff]/50">
                                            @foreach ($selectedRecipe->ingredients as $bahan)
                                                @php $subtotal = (int) $bahan->pivot->qty * $bahan->price_per_unit; @endphp
                                                <tr class="hover:bg-[#dddbff]/10 transition-colors">
                                                    <td class="py-4 px-4">
                                                        <p class="font-medium text-[#050316]">{{ $bahan->name }}</p>
                                                        <p class="text-[10px] text-[#2f27ce]/70">ID: {{ $bahan->id }}</p>
                                                    </td>
                                                    <td class="py-4 px-4 text-[#050316]">
                                                        {{ $bahan->pivot->qty }} {{ $bahan->pivot->unit }}
                                                    </td>
                                                    <td class="py-4 px-4 text-[#2f27ce]">Rp {{ number_format($bahan->price_per_unit, 0, ',', '.') }}</td>
                                                    <td class="py-4 px-4 font-bold text-[#443dff] text-right">Rp {{ number_format($subtotal, 0, ',', '.') }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                        <tfoot>
                                            <tr class="border-t-2 border-[#dddbff]">
                                                <td colspan="3" class="pt-4 px-4 text-xs font-bold text-[#2f27ce] uppercase tracking-wider text-right">
                                                    Total Kalkulasi Biaya
                                                </td>
                                                <td class="pt-4 px-4 font-bold text-[#050316] text-base text-right">Rp {{ number_format($selectedRecipe->total_hpp, 0, ',', '.') }}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {{-- Struktur Harga vs Biaya --}}
                            @php
                                $cogsPercent = $menu->price > 0 ? round(($selectedRecipe->total_hpp / $menu->price) * 100, 1) : 0;
                                $profitPerServing = ($menu->price ?? 0) - $selectedRecipe->total_hpp;
                                $recommendedPrice = $selectedRecipe->total_hpp > 0 ? (int) round($selectedRecipe->total_hpp / 0.4) : 0;
                            @endphp
                            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                <h3 class="font-bold text-[#050316] mb-4">Struktur Harga vs Biaya</h3>

                                {{-- Progress Bar --}}
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-sm inline-block"></span>
                                        <span class="text-xs text-[#2f27ce]">Cost of Goods Sold (HPP)</span>
                                    </div>
                                    <span class="text-xs font-bold text-[#050316]">{{ $cogsPercent }}%</span>
                                </div>
                                <div class="w-full bg-[#dddbff]/30 h-3 rounded-full overflow-hidden mb-5 shadow-inner">
                                    <div class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500" style="width: {{ $cogsPercent }}%"></div>
                                </div>

                                {{-- Bottom Cards --}}
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-[#fbfbfe] rounded-xl p-4 border border-[#dddbff]">
                                        <p class="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wider mb-1">Laba Per Porsi</p>
                                        <p class="text-xl font-bold text-[#443dff]">Rp {{ number_format($profitPerServing, 0, ',', '.') }}</p>
                                    </div>
                                    <div class="bg-gradient-to-br from-[#050316] to-[#2f27ce] rounded-xl p-4 border border-[#2f27ce] shadow-lg shadow-[#2f27ce]/20">
                                        <p class="text-[10px] font-bold text-[#dddbff] uppercase tracking-wider mb-1">Rekomendasi Harga</p>
                                        <div class="flex items-center gap-2">
                                            <p class="text-xl font-bold text-white">Rp {{ number_format($recommendedPrice, 0, ',', '.') }}</p>
                                            <span class="text-[10px] font-bold text-[#050316] bg-emerald-400 px-2 py-0.5 rounded-md shadow-sm">Optimal</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- ===== SIDEBAR KANAN ===== --}}
                        <div class="xl:col-span-4 space-y-6">

                            {{-- Simulator What-If --}}
                            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                                <div class="flex items-center gap-2 mb-4 border-b border-[#dddbff]/50 pb-4">
                                    <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500">
                                        <iconify-icon icon="solar:chart-square-bold-duotone" class="text-lg"></iconify-icon>
                                    </div>
                                    <h3 class="text-sm font-bold text-[#050316]">Simulator "What-If"</h3>
                                </div>

                                <div class="flex justify-between items-center mb-3">
                                    <p class="text-xs text-[#2f27ce]">Kenaikan Biaya Bahan (%)</p>
                                    <span class="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">+0%</span>
                                </div>

                                {{-- Slider --}}
                                <input type="range" min="0" max="50" value="0"
                                    class="w-full accent-[#443dff] mb-2 cursor-ew-resize h-1.5 bg-[#dddbff] rounded-lg appearance-none" />
                                <p class="text-[10px] text-[#2f27ce]/70 italic mb-4">*Simulasikan kenaikan harga pasar global pada resep ini untuk melihat dampaknya.</p>

                                <div class="space-y-3 bg-[#fbfbfe] border border-[#dddbff] p-4 rounded-xl">
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs text-[#2f27ce]">Proyeksi HPP Baru</span>
                                        <span class="text-xs font-bold text-[#050316]">Rp {{ number_format($selectedRecipe->total_hpp, 0, ',', '.') }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-t border-[#dddbff]/50 pt-3">
                                        <span class="text-xs text-[#2f27ce]">Proyeksi Margin</span>
                                        <span class="text-xs font-bold text-[#050316]">{{ $selectedRecipe->margin }}%</span>
                                    </div>
                                    <div class="flex justify-between items-center border-t border-[#dddbff]/50 pt-3">
                                        <span class="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Impact on Profit</span>
                                        <span class="text-xs font-bold text-rose-600 flex items-center gap-1">
                                            <iconify-icon icon="solar:graph-down-bold"></iconify-icon> -0.1%
                                        </span>
                                    </div>
                                </div>

                                <button class="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-colors">
                                    <iconify-icon icon="solar:refresh-circle-linear" class="text-sm"></iconify-icon> Reset Simulasi
                                </button>
                            </div>

                            {{-- Opsi Strategis --}}
                            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                                <h3 class="text-sm font-bold text-[#050316] mb-3">Opsi Strategis</h3>
                                <div class="space-y-2">
                                    @foreach ([
                                        'Update Harga Inventory Global',
                                        'Cetak Laporan Profitabilitas',
                                        'Bandingkan dengan Resep Lain',
                                    ] as $opsi)
                                        <button class="w-full flex justify-between items-center py-3 px-4 text-xs font-semibold text-[#050316] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-colors">
                                            {{ $opsi }}
                                            <iconify-icon icon="solar:alt-arrow-right-linear" class="text-[#2f27ce]/50"></iconify-icon>
                                        </button>
                                    @endforeach
                                </div>
                            </div>

                            {{-- Peringatan Margin --}}
                            @php
                                $showWarning = $selectedRecipe->margin > 0 && $selectedRecipe->margin < 40;
                            @endphp
                            @if ($showWarning)
                                <div class="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm p-5 relative overflow-hidden">
                                    <div class="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl"></div>
                                    <div class="flex items-center gap-2 mb-3 relative z-10">
                                        <iconify-icon icon="solar:danger-triangle-bold-duotone" class="text-rose-500 text-xl"></iconify-icon>
                                        <h3 class="text-xs font-bold text-rose-500 uppercase tracking-wider">Peringatan Margin</h3>
                                    </div>
                                    <p class="text-xs text-rose-800 leading-relaxed mb-4 relative z-10">
                                        Margin pada <span class="font-bold">{{ $menu->name }}</span> mendekati batas minimum 40%.
                                        Pertimbangkan untuk menaikkan harga jual jika biaya bahan baku naik lebih dari Rp2.000.
                                    </p>
                                    <a href="#" class="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg inline-flex shadow-sm border border-rose-100 transition-colors relative z-10">
                                        Analisis Strategi Harga <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
                                    </a>
                                </div>
                            @endif
                        </div>

                    </div>{{-- end grid --}}
                </div>{{-- end p-8 --}}

                {{-- Footer --}}
                <div class="mt-auto px-8 py-4 border-t border-[#dddbff] bg-white flex justify-between items-center text-[10px] text-[#2f27ce]/60">
                    <span>© {{ date('Y') }} Devora POS v2.4.0</span>
                    <div class="flex items-center gap-3">
                        <span class="flex items-center gap-1.5 text-emerald-600">
                            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> System Online
                        </span>
                        <span>Support ID: #POS-8821</span>
                    </div>
                </div>
            @else
                {{-- Empty State --}}
                <div class="flex-1 flex items-center justify-center p-8">
                    <div class="text-center space-y-4 max-w-sm">
                        <div class="w-24 h-24 bg-gradient-to-br from-[#dddbff] to-[#fbfbfe] border border-[#dddbff] rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <iconify-icon icon="solar:book-bookmark-bold-duotone" class="text-5xl text-[#443dff]"></iconify-icon>
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-[#050316]">Belum ada resep</h2>
                            <p class="text-sm text-[#2f27ce]">Tambahkan resep menu pertama untuk mulai menganalisis margin dan struktur HPP bisnis Anda.</p>
                        </div>
                        <a href="{{ route('recipe.store') }}" method="POST"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#443dff]/30 active:scale-95 mt-2">
                            <iconify-icon icon="solar:add-circle-bold" class="text-lg"></iconify-icon> Tambah Resep Pertama
                        </a>
                    </div>
                </div>
            @endif

        </div>{{-- end main content --}}
    </div>{{-- end flex --}}
@endsection