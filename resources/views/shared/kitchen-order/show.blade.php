@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#fbfbfe] p-6 md:p-8">
    <div class="max-w-6xl mx-auto space-y-6">

        {{-- Breadcrumb --}}
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm">
                <a href="{{ route('menu.index') }}"
                    class="flex items-center gap-1.5 text-[#443dff] font-bold hover:text-[#2f27ce] transition-colors">
                    <iconify-icon icon="solar:arrow-left-linear" class="text-base"></iconify-icon>
                    Kembali ke Menu
                </a>
                <span class="text-[#050316]/30">/</span>
                <span class="text-[#050316]/60 font-medium">{{ $menu->name }}</span>
            </div>
            <div class="flex items-center gap-2">
                <button class="flex items-center gap-2 px-4 py-2 bg-white border border-[#dddbff] rounded-xl text-sm font-bold text-[#2f27ce] hover:bg-[#dddbff]/40 transition-all shadow-sm">
                    <iconify-icon icon="solar:share-linear" class="text-base"></iconify-icon>
                    Bagikan
                </button>
                <a href="{{ route('menu.edit', $menu->id) }}"
                    class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white rounded-xl text-sm font-bold hover:from-[#2f27ce] hover:to-[#050316] transition-all shadow-md shadow-[#443dff]/30">
                    <iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon>
                    Edit Produk
                </a>
            </div>
        </div>

        {{-- Hero Section --}}
        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">
            <div class="flex flex-col md:flex-row gap-0">

                {{-- Image --}}
                <div class="relative md:w-80 lg:w-96 flex-shrink-0">
                    @if($menu->image)
                        <img src="{{ asset('storage/' . $menu->image) }}"
                            alt="{{ $menu->name }}"
                            class="w-full h-64 md:h-full object-cover">
                    @else
                        <div class="w-full h-64 md:h-full bg-gradient-to-br from-[#dddbff]/50 to-[#dddbff]/20 flex items-center justify-center">
                            <iconify-icon icon="solar:bowl-spoon-bold-duotone" class="text-6xl text-[#443dff]/30"></iconify-icon>
                        </div>
                    @endif
                    {{-- Badge terlaris --}}
                    @if(isset($isBestSeller) && $isBestSeller)
                        <div class="absolute top-4 left-4">
                            <span class="inline-flex items-center gap-1 text-[11px] font-extrabold bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white px-3 py-1.5 rounded-lg shadow-md shadow-[#443dff]/30">
                                <iconify-icon icon="solar:star-bold" class="text-xs"></iconify-icon>
                                Terlaris #1
                            </span>
                        </div>
                    @endif
                </div>

                {{-- Info --}}
                <div class="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div class="space-y-3">
                        {{-- Category + SKU --}}
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[11px] font-extrabold text-[#443dff] bg-[#dddbff]/50 border border-[#dddbff] px-2.5 py-1 rounded-lg">
                                {{ $menu->category->name ?? 'Uncategorized' }}
                            </span>
                            @if($menu->sku)
                                <span class="text-[11px] font-semibold text-[#050316]/40 flex items-center gap-1">
                                    <iconify-icon icon="solar:barcode-linear" class="text-sm"></iconify-icon>
                                    {{ $menu->sku }}
                                </span>
                            @endif
                        </div>

                        {{-- Name --}}
                        <h1 class="text-3xl font-black text-[#050316] tracking-tight leading-tight">
                            {{ $menu->name }}
                        </h1>

                        {{-- Description --}}
                        @if($menu->description)
                            <p class="text-sm text-[#050316]/50 font-medium leading-relaxed">
                                {{ $menu->description }}
                            </p>
                        @endif
                    </div>

                    {{-- Price Stats Grid --}}
                    <div class="grid grid-cols-2 gap-3 mt-6">

                        {{-- Harga Jual --}}
                        <div class="bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs font-extrabold text-[#2f27ce]/70 uppercase tracking-wide">Harga Jual</p>
                                    <p class="text-xl font-black text-[#050316] mt-1">
                                        Rp {{ number_format($menu->price, 0, ',', '.') }}
                                    </p>
                                    <p class="text-[10px] text-[#050316]/40 font-medium mt-0.5">Harga standar outlet</p>
                                </div>
                                <div class="w-8 h-8 rounded-lg bg-[#dddbff]/50 flex items-center justify-center text-[#443dff]">
                                    <iconify-icon icon="solar:dollar-linear" class="text-base"></iconify-icon>
                                </div>
                            </div>
                        </div>

                        {{-- HPP / COGS --}}
                        <div class="bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs font-extrabold text-[#2f27ce]/70 uppercase tracking-wide">HPP (COGS)</p>
                                    <p class="text-xl font-black text-[#050316] mt-1">
                                        Rp {{ number_format($menu->cost ?? 0, 0, ',', '.') }}
                                    </p>
                                    <p class="text-[10px] text-[#050316]/40 font-medium mt-0.5">Biaya bahan baku per porsi</p>
                                </div>
                                <div class="w-8 h-8 rounded-lg bg-[#dddbff]/50 flex items-center justify-center text-[#443dff]">
                                    <iconify-icon icon="solar:cart-large-2-linear" class="text-base"></iconify-icon>
                                </div>
                            </div>
                        </div>

                        {{-- Laba Bersih --}}
                        @php
                            $profit = ($menu->price ?? 0) - ($menu->cost ?? 0);
                            $margin = $menu->price > 0 ? round(($profit / $menu->price) * 100) : 0;
                        @endphp
                        <div class="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs font-extrabold text-emerald-700/70 uppercase tracking-wide">Laba Bersih</p>
                                    <p class="text-xl font-black text-emerald-700 mt-1">
                                        +Rp {{ number_format($profit, 0, ',', '.') }}
                                    </p>
                                    <p class="text-[10px] text-emerald-600 font-bold mt-0.5">
                                        <iconify-icon icon="solar:arrow-right-up-linear" class="text-xs"></iconify-icon>
                                        {{ $menu->profitGrowth ?? '—' }} vs bulan lalu
                                    </p>
                                </div>
                                <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <iconify-icon icon="solar:graph-up-linear" class="text-base"></iconify-icon>
                                </div>
                            </div>
                        </div>

                        {{-- Margin --}}
                        <div class="bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-xs font-extrabold text-[#2f27ce]/70 uppercase tracking-wide">Margin Profit</p>
                                    <p class="text-xl font-black text-[#050316] mt-1">{{ $margin }}%</p>
                                    <p class="text-[10px] text-[#050316]/40 font-medium mt-0.5">
                                        @if($margin >= 60) Efisiensi biaya sangat baik
                                        @elseif($margin >= 40) Efisiensi biaya baik
                                        @else Perlu evaluasi biaya
                                        @endif
                                    </p>
                                </div>
                                <div class="w-8 h-8 rounded-lg bg-[#dddbff]/50 flex items-center justify-center text-[#443dff]">
                                    <iconify-icon icon="solar:pie-chart-2-linear" class="text-base"></iconify-icon>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        {{-- Tabs --}}
        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

            {{-- Tab Nav --}}
            <div class="flex border-b border-[#dddbff] px-6 gap-1 overflow-x-auto" id="tab-nav">
                @foreach([
                    ['id' => 'performa',   'label' => 'Ringkasan Performa',  'icon' => 'solar:chart-2-linear'],
                    ['id' => 'bahan',      'label' => 'Bahan Baku',          'icon' => 'solar:box-linear'],
                    ['id' => 'pesanan',    'label' => 'Ulasan Pesanan',       'icon' => 'solar:star-linear'],
                    ['id' => 'riwayat',    'label' => 'Riwayat Perubahan',    'icon' => 'solar:clock-circle-linear'],
                ] as $tab)
                    <button onclick="switchTab('{{ $tab['id'] }}')"
                        id="tab-btn-{{ $tab['id'] }}"
                        class="tab-btn flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-bold whitespace-nowrap border-b-2 transition-all
                            {{ $loop->first
                                ? 'border-[#443dff] text-[#443dff]'
                                : 'border-transparent text-[#050316]/40 hover:text-[#2f27ce] hover:border-[#dddbff]' }}">
                        <iconify-icon icon="{{ $tab['icon'] }}" class="text-base"></iconify-icon>
                        {{ $tab['label'] }}
                    </button>
                @endforeach
            </div>

            {{-- Tab: Ringkasan Performa --}}
            <div id="tab-performa" class="tab-panel p-6">
                <div class="flex flex-col lg:flex-row gap-5">

                    {{-- Chart --}}
                    <div class="flex-1 bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-5">
                        <div class="flex items-start justify-between mb-1">
                            <div>
                                <h3 class="text-sm font-extrabold text-[#050316]">Tren Penjualan Mingguan</h3>
                                <p class="text-xs text-[#050316]/50 font-medium mt-0.5">Volume penjualan per hari (7 hari terakhir)</p>
                            </div>
                            <a href="{{ route('reports.index') }}"
                                class="text-[11px] font-extrabold text-[#443dff] border border-[#dddbff] px-3 py-1.5 rounded-lg hover:bg-[#dddbff]/40 transition-colors">
                                Detail Laporan
                            </a>
                        </div>
                        <div class="mt-4" style="height: 220px; position: relative;">
                            <canvas id="salesChart" role="img" aria-label="Tren penjualan mingguan">Data tren penjualan 7 hari terakhir.</canvas>
                        </div>
                        <div class="flex items-center gap-4 mt-3">
                            <span class="flex items-center gap-1.5 text-xs font-semibold text-[#050316]/60">
                                <span class="w-3 h-3 rounded-full bg-[#443dff] inline-block"></span>
                                Unit Terjual
                            </span>
                            @if(isset($salesGrowth))
                                <span class="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                    <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon>
                                    +{{ $salesGrowth }}% Pertumbuhan Mingguan
                                </span>
                            @endif
                        </div>
                    </div>

                    {{-- Right Column --}}
                    <div class="lg:w-72 space-y-4">

                        {{-- Status Bahan Baku --}}
                        <div class="bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-5">
                            <h3 class="text-sm font-extrabold text-[#050316] flex items-center gap-2 mb-4">
                                <iconify-icon icon="solar:box-bold-duotone" class="text-[#443dff] text-base"></iconify-icon>
                                Status Bahan Baku
                            </h3>
                            <div class="space-y-3">
                                @forelse($menu->ingredients ?? [] as $ingredient)
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-7 h-7 rounded-lg bg-[#dddbff]/40 flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon="solar:box-minimalistic-linear" class="text-[#443dff] text-xs"></iconify-icon>
                                            </div>
                                            <span class="text-xs font-semibold text-[#050316]">{{ $ingredient->name }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs font-black text-[#050316]">{{ $ingredient->pivot->qty }} {{ $ingredient->unit }}</span>
                                            @if($ingredient->stock <= $ingredient->min_stock)
                                                <span class="text-[9px] font-extrabold bg-rose-100 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded-md">Menipis</span>
                                            @else
                                                <span class="text-[9px] font-extrabold bg-emerald-100 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-md">Aman</span>
                                            @endif
                                        </div>
                                    </div>
                                @empty
                                    <p class="text-xs text-[#050316]/40 font-medium text-center py-2">Belum ada data bahan baku.</p>
                                @endforelse
                            </div>
                            <button class="w-full mt-4 py-2 text-xs font-extrabold text-[#443dff] border border-[#dddbff] rounded-lg hover:bg-[#dddbff]/40 transition-colors">
                                Buat Pesanan Pembelian
                            </button>
                        </div>

                        {{-- Promo Aktif --}}
                        @if(isset($activePromo) && $activePromo)
                            <div class="bg-gradient-to-br from-[#dddbff]/30 to-[#fbfbfe] border border-[#dddbff] rounded-xl p-4">
                                <div class="flex items-start gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-[#dddbff]/60 flex items-center justify-center flex-shrink-0">
                                        <iconify-icon icon="solar:tag-price-bold-duotone" class="text-[#443dff] text-sm"></iconify-icon>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs font-extrabold text-[#050316]">Promo Aktif</p>
                                        <p class="text-[11px] text-[#050316]/60 font-medium mt-0.5 leading-relaxed">{{ $activePromo->description }}</p>
                                        <a href="#" class="text-[11px] font-bold text-[#443dff] hover:text-[#2f27ce] mt-1 inline-block">
                                            Lihat Pengaturan Promo
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endif

                    </div>
                </div>
            </div>

            {{-- Tab: Bahan Baku --}}
            <div id="tab-bahan" class="tab-panel p-6 hidden">
                <div class="bg-[#fbfbfe] border border-[#dddbff] rounded-xl overflow-hidden">
                    <div class="px-5 py-4 border-b border-[#dddbff] flex items-center justify-between">
                        <h3 class="text-sm font-extrabold text-[#050316]">Komposisi Resep</h3>
                        <a href="{{ route('recipes.edit', $menu->id) }}"
                            class="text-[11px] font-extrabold text-[#443dff] border border-[#dddbff] px-3 py-1.5 rounded-lg hover:bg-[#dddbff]/40 transition-colors">
                            Edit Resep
                        </a>
                    </div>
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gradient-to-r from-[#fbfbfe] to-[#dddbff]/20 border-b border-[#dddbff]">
                                <th class="text-left px-5 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">Bahan</th>
                                <th class="text-left px-5 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">Jumlah</th>
                                <th class="text-left px-5 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">Stok</th>
                                <th class="text-left px-5 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#dddbff]/50">
                            @forelse($menu->ingredients ?? [] as $ingredient)
                                <tr class="hover:bg-gradient-to-r hover:from-[#dddbff]/10 hover:to-transparent transition-colors">
                                    <td class="px-5 py-3.5">
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-7 h-7 rounded-lg bg-[#dddbff]/40 flex items-center justify-center">
                                                <iconify-icon icon="solar:box-minimalistic-linear" class="text-[#443dff] text-xs"></iconify-icon>
                                            </div>
                                            <span class="text-sm font-semibold text-[#050316]">{{ $ingredient->name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3.5 text-sm font-bold text-[#050316]">
                                        {{ $ingredient->pivot->qty }} {{ $ingredient->unit }}
                                    </td>
                                    <td class="px-5 py-3.5 text-sm font-bold text-[#050316]">
                                        {{ $ingredient->stock }} {{ $ingredient->unit }}
                                    </td>
                                    <td class="px-5 py-3.5">
                                        @if($ingredient->stock <= $ingredient->min_stock)
                                            <span class="text-[10px] font-extrabold bg-rose-100 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md">Menipis</span>
                                        @else
                                            <span class="text-[10px] font-extrabold bg-emerald-100 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md">Aman</span>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="px-5 py-10 text-center text-sm text-[#050316]/40 font-medium">
                                        Belum ada bahan baku terdaftar untuk menu ini.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            {{-- Tab: Ulasan Pesanan --}}
            <div id="tab-pesanan" class="tab-panel p-6 hidden">
                <div class="space-y-3">
                    @forelse($menu->reviews ?? [] as $review)
                        <div class="bg-[#fbfbfe] border border-[#dddbff] rounded-xl p-4">
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#443dff] to-[#2f27ce] flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                                        {{ strtoupper(substr($review->customer_name ?? 'A', 0, 1)) }}
                                    </div>
                                    <span class="text-sm font-bold text-[#050316]">{{ $review->customer_name ?? 'Pelanggan' }}</span>
                                </div>
                                <span class="text-[11px] text-[#050316]/40 font-medium flex-shrink-0">{{ $review->created_at->diffForHumans() }}</span>
                            </div>
                            <p class="text-sm text-[#050316]/70 font-medium mt-2 leading-relaxed">{{ $review->comment }}</p>
                        </div>
                    @empty
                        <div class="text-center py-12 text-[#050316]/40">
                            <iconify-icon icon="solar:star-bold-duotone" class="text-4xl text-[#dddbff]"></iconify-icon>
                            <p class="mt-2 text-sm font-bold">Belum ada ulasan untuk menu ini.</p>
                        </div>
                    @endforelse
                </div>
            </div>

            {{-- Tab: Riwayat Perubahan --}}
            <div id="tab-riwayat" class="tab-panel p-6 hidden">
                <div class="space-y-3">
                    @forelse($menu->logs ?? [] as $log)
                        <div class="flex gap-4">
                            <div class="flex flex-col items-center">
                                <div class="w-8 h-8 rounded-full bg-[#dddbff]/50 border border-[#dddbff] flex items-center justify-center text-[#443dff] flex-shrink-0">
                                    <iconify-icon icon="solar:clock-circle-linear" class="text-sm"></iconify-icon>
                                </div>
                                <div class="w-px flex-1 bg-[#dddbff] mt-1"></div>
                            </div>
                            <div class="pb-4 flex-1">
                                <p class="text-sm font-semibold text-[#050316]">{{ $log->description }}</p>
                                <p class="text-[11px] text-[#050316]/40 font-medium mt-0.5">
                                    {{ $log->created_at->translatedFormat('d F Y, H:i') }} — {{ $log->user->name ?? 'System' }}
                                </p>
                            </div>
                        </div>
                    @empty
                        <div class="text-center py-12 text-[#050316]/40">
                            <iconify-icon icon="solar:history-bold-duotone" class="text-4xl text-[#dddbff]"></iconify-icon>
                            <p class="mt-2 text-sm font-bold">Belum ada riwayat perubahan.</p>
                        </div>
                    @endforelse
                </div>
            </div>

        </div>
    </div>
</div>

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
    function switchTab(id) {
        document.querySelectorAll('.tab-panel').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-[#443dff]', 'text-[#443dff]');
            btn.classList.add('border-transparent', 'text-[#050316]/40');
        });
        document.getElementById('tab-' + id).classList.remove('hidden');
        const activeBtn = document.getElementById('tab-btn-' + id);
        activeBtn.classList.add('border-[#443dff]', 'text-[#443dff]');
        activeBtn.classList.remove('border-transparent', 'text-[#050316]/40');
    }

    const salesData = @json($salesChartData ?? [40, 35, 55, 50, 70, 95, 88]);
    const labels    = @json($salesChartLabels ?? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']);

    new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Unit Terjual',
                data: salesData,
                borderColor: '#443dff',
                backgroundColor: 'rgba(68, 61, 255, 0.08)',
                borderWidth: 2,
                pointBackgroundColor: '#443dff',
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#050316',
                    titleColor: '#fff',
                    bodyColor: 'rgba(255,255,255,0.7)',
                    padding: 10,
                    cornerRadius: 8,
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11, weight: '600' }, color: 'rgba(5,3,22,0.4)' }
                },
                y: {
                    grid: { color: 'rgba(221,219,255,0.5)', drawBorder: false },
                    ticks: { font: { size: 11 }, color: 'rgba(5,3,22,0.4)' },
                    beginAtZero: true,
                }
            }
        }
    });
</script>
@endpush
@endsection