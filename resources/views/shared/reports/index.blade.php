@extends('layouts.app')

@section('content')
    
    {{-- isi halaman --}}
    <div class="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">

        {{-- ====== TOP HEADER ====== --}}
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
            <div>
                <h1
                    class="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                    Laporan Bisnis</h1>
                <p class="text-[#2f27ce] mt-1 text-sm font-medium">
                    Pantau performa dan pertumbuhan cafe Anda secara real-time.
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                {{-- Filter Period --}}
                <div class="flex items-center gap-2 bg-white border border-[#dddbff] rounded-xl px-3 shadow-sm">
                    <iconify-icon icon="solar:calendar-bold-duotone" class="text-[#443dff] text-lg"></iconify-icon>
                    <select id="period-filter" ... onchange="window.location='{{ route('reports.index') }}?days='+this.value">
                        <option value="7" {{ ($days ?? 7) == 7 ? 'selected' : '' }}>7 Hari Terakhir</option>
                        <option value="30" {{ ($days ?? 7) == 30 ? 'selected' : '' }}>30 Hari Terakhir</option>
                        <option value="90" {{ ($days ?? 7) == 90 ? 'selected' : '' }}>3 Bulan Terakhir</option>
                    </select>
                </div>
                <button onclick="document.getElementById('filter-modal').showModal()"
                    class="text-sm font-bold text-[#2f27ce] bg-white border border-[#dddbff] px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#dddbff]/40 transition-all flex items-center gap-2">
                    <iconify-icon icon="solar:filter-bold-duotone" class="text-[#443dff]"></iconify-icon>
                    Filter
                    @if (request()->hasAny(['start_date', 'end_date', 'kasir_id', 'kategori_id', 'payment_method']))
                        <span class="w-2 h-2 bg-[#443dff] rounded-full"></span>
                    @endif
                </button>
                <a href="{{ route('reports.export.excel') }}"
                    class="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                    <iconify-icon icon="solar:export-bold" class="text-[18px]"></iconify-icon>
                    Ekspor Laporan
                </a>
            </div>
        </div>

        {{-- ====== STAT CARDS ====== --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <x-stat-card title="Total Pendapatan" :value="'Rp ' . number_format($totalRevenue, 0, ',', '.')" :trend="($revenueTrend >= 0 ? '+' : '') . $revenueTrend . '%'" :trend-type="$revenueTrendType"
                icon="heroicon-o-currency-dollar" icon-bg="bg-[#dddbff]" icon-color="text-[#443dff]" />

            <x-stat-card title="Estimasi Laba Bersih" :value="'Rp ' . number_format($totalProfit, 0, ',', '.')" :trend="($profitTrend >= 0 ? '+' : '') . $profitTrend . '%'" :trend-type="$profitTrendType"
                icon="heroicon-o-chart-pie" icon-bg="bg-emerald-100" icon-color="text-emerald-600" />

            <x-stat-card title="Total Pesanan" :value="number_format($totalOrders, 0, ',', '.')" :trend="($ordersTrend >= 0 ? '+' : '') . $ordersTrend . '%'" :trend-type="$ordersTrendType"
                icon="heroicon-o-shopping-bag" icon-bg="bg-[#dddbff]" icon-color="text-[#443dff]" />

            <x-stat-card title="Rata-rata Transaksi" :value="'Rp ' . number_format($avgTransaction, 0, ',', '.')" :trend="($avgTrend >= 0 ? '+' : '') . $avgTrend . '%'" :trend-type="$avgTrendType"
                icon="heroicon-o-receipt-percent" icon-bg="bg-[#dddbff]" icon-color="text-[#2f27ce]" />
        </div>

        {{-- ====== MAIN GRID ====== --}}
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- ===== LEFT CONTENT ===== --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- Tren Pendapatan & Komposisi Penjualan --}}
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {{-- Line Chart --}}
                    <div class="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                        <div class="flex justify-between items-center mb-1">
                            <div>
                                <h3 class="text-base font-extrabold text-[#050316] tracking-tight">Tren Pendapatan & Laba
                                </h3>
                                <p class="text-xs text-[#2f27ce] font-medium mt-0.5">Visualisasi harian dalam 7 hari
                                    terakhir.</p>
                            </div>
                            <span
                                class="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                                <span class="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                                Live Data
                            </span>
                        </div>
                        <div class="mt-5 h-48 relative" id="revenue-chart-wrap">
                            <canvas id="revenueChart"></canvas>
                        </div>
                        <div class="flex gap-5 mt-4 text-xs font-bold text-[#2f27ce] justify-center">
                            <span class="flex items-center gap-2"><span
                                    class="w-2.5 h-2.5 rounded-full bg-[#443dff]"></span> Pendapatan</span>
                            <span class="flex items-center gap-2"><span
                                    class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Laba Bersih</span>
                        </div>
                    </div>

                    {{-- Donut Chart --}}
                    {{-- Donut Chart --}}
                    <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col">
                        <div class="mb-4">
                            <h3 class="text-base font-extrabold text-[#050316] tracking-tight">Komposisi Penjualan</h3>
                            <p class="text-xs text-[#2f27ce] font-medium mt-0.5">Berdasarkan kategori produk utama.</p>
                        </div>
                        <div class="flex-1 flex items-center justify-center">
                            <div class="relative w-36 h-36">
                                <canvas id="donutChart"></canvas>
                            </div>
                        </div>
                        <div class="mt-5 space-y-2">
                            @foreach ($donutLabels as $i => $label)
                                <div class="flex items-center justify-between text-xs">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style="background-color: {{ $donutBg[$i] ?? '#dddbff' }}"></span>
                                        <span class="font-medium text-[#050316]">{{ $label }}</span>
                                    </div>
                                    <span class="font-extrabold text-[#050316]">{{ $donutData[$i] ?? 0 }}%</span>
                                </div>
                            @endforeach

                            @if (empty($donutLabels))
                                <p class="text-xs text-[#2f27ce] italic text-center py-2">Belum ada data penjualan.</p>
                            @endif
                        </div>
                    </div>
                </div>

                {{-- Produk Terlaris --}}
                <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <div>
                            <h3 class="text-base font-extrabold text-[#050316] tracking-tight">Produk Terlaris</h3>
                            <p class="text-xs text-[#2f27ce] font-medium mt-0.5">Item dengan volume penjualan dan
                                profitabilitas tertinggi.</p>
                        </div>
                        <a href="{{ route('menus.index') }}"
                            class="text-xs text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline flex items-center gap-1 transition-colors">
                            Lihat Semua Menu
                            <iconify-icon icon="solar:arrow-right-bold"></iconify-icon>
                        </a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[600px]">
                            <thead>
                                <tr class="text-xs text-[#2f27ce] border-b border-[#dddbff] uppercase tracking-wider">
                                    <th class="pb-3 font-extrabold">Nama Menu</th>
                                    <th class="pb-3 font-extrabold">Kategori</th>
                                    <th class="pb-3 font-extrabold text-center">Qty Terjual</th>
                                    <th class="pb-3 font-extrabold text-right">Total Pendapatan</th>
                                    <th class="pb-3 font-extrabold text-right">Estimasi Margin</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                @php
                                    $categoryColors = [
                                        'Coffee' => 'bg-[#dddbff] text-[#2f27ce]',
                                        'Non-Coffee' => 'bg-emerald-100 text-emerald-700',
                                        'Main Course' => 'bg-amber-100 text-amber-700',
                                        'Snacks' => 'bg-rose-100 text-rose-600',
                                    ];
                                @endphp

                                @forelse ($bestMenus as $menu)
                                    <tr
                                        class="border-b border-[#dddbff]/50 last:border-0 hover:bg-[#dddbff]/10 transition-colors">
                                        <td class="py-4 font-bold text-[#050316]">{{ $menu['name'] }}</td>
                                        <td class="py-4">
                                            <span
                                                class="text-xs font-bold px-2.5 py-1 rounded-lg {{ $categoryColors[$menu['category']] ?? 'bg-[#dddbff] text-[#2f27ce]' }}">
                                                {{ $menu['category'] }}
                                            </span>
                                        </td>
                                        <td class="py-4 text-center font-bold text-[#050316]">
                                            {{ number_format($menu['qty'], 0, ',', '.') }}</td>
                                        <td class="py-4 text-right font-bold text-[#050316]">Rp
                                            {{ number_format($menu['revenue'], 0, ',', '.') }}</td>
                                        <td class="py-4 text-right font-extrabold text-emerald-600">{{ $menu['margin'] }}%
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="py-8 text-center text-[#2f27ce] italic text-sm">
                                            Belum ada data penjualan dalam {{ $days }} hari terakhir.
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>

                {{-- Performa Jam Sibuk & Target Bulanan --}}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {{-- Jam Sibuk --}}
                    {{-- Jam Sibuk --}}
                    <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                        <h3 class="text-base font-extrabold text-[#050316] tracking-tight mb-1">Performa Jam Sibuk</h3>
                        <p class="text-xs text-[#2f27ce] font-medium mb-5">Volume transaksi berdasarkan waktu operasional.
                        </p>
                        <div class="flex items-end justify-between h-40 gap-2">
                            @forelse ($busySlots as $slot)
                                <div class="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                                    title="{{ $slot['count'] }} transaksi">
                                    <span
                                        class="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-[#050316] px-1.5 py-0.5 rounded-md mb-1">
                                        {{ $slot['count'] }}
                                    </span>
                                    <div class="w-full bg-[#dddbff] group-hover:bg-[#443dff] rounded-t-lg transition-all duration-300 min-h-[4px]"
                                        style="height: {{ $slot['height'] }}%"></div>
                                </div>
                            @empty
                                <p class="w-full text-center text-xs text-[#2f27ce] italic">Belum ada data transaksi.</p>
                            @endforelse
                        </div>
                        <div class="flex justify-between mt-3">
                            @foreach ($busySlots as $slot)
                                <span class="text-[10px] font-extrabold text-[#2f27ce]">{{ $slot['label'] }}</span>
                            @endforeach
                        </div>
                    </div>

                    {{-- Target Bulanan --}}
                    {{-- Target Bulanan --}}
                    <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 class="text-base font-extrabold text-[#050316] tracking-tight mb-1">Target Penjualan
                                Bulanan</h3>
                            <p class="text-xs text-[#2f27ce] font-medium mb-6">Progress pencapaian target bulan
                                {{ now()->translatedFormat('F Y') }}.</p>
                        </div>

                        @if ($targetRevenue > 0)
                            <div class="flex flex-col items-center gap-4">
                                {{-- Circular Progress --}}
                                <div class="relative w-36 h-36">
                                    <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#dddbff"
                                            stroke-width="3" />
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#443dff"
                                            stroke-width="3" stroke-dasharray="{{ $targetProgress }}, 100"
                                            stroke-linecap="round" />
                                    </svg>
                                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                                        <span class="text-2xl font-extrabold text-[#050316]">{{ $targetProgress }}%</span>
                                        <span
                                            class="text-[10px] font-bold text-[#2f27ce] uppercase tracking-wide">Tercapai</span>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <p class="text-sm font-extrabold text-[#050316]">
                                        Rp {{ number_format($currentRevenue, 0, ',', '.') }} / Rp
                                        {{ number_format($targetRevenue, 0, ',', '.') }}
                                    </p>
                                    <p class="text-xs font-medium text-[#2f27ce] mt-1">
                                        @if ($targetProgress >= 100)
                                            🎉 Target bulan ini tercapai!
                                        @else
                                            Butuh <span class="font-extrabold text-[#050316]">Rp
                                                {{ number_format($targetRemaining, 0, ',', '.') }}</span> lagi untuk
                                            mencapai target!
                                        @endif
                                    </p>
                                </div>
                            </div>
                        @else
                            {{-- Belum ada target --}}
                            <div class="flex flex-col items-center justify-center gap-3 py-6">
                                <div
                                    class="w-14 h-14 rounded-2xl bg-[#dddbff]/50 border border-[#dddbff] flex items-center justify-center">
                                    <iconify-icon icon="solar:target-bold-duotone"
                                        class="text-2xl text-[#443dff]"></iconify-icon>
                                </div>
                                <p class="text-xs font-medium text-[#2f27ce] text-center">
                                    Belum ada target bulanan yang ditetapkan.
                                </p>
                            </div>
                        @endif

                        <a href="{{ route('targets-goals.index') }}"
                            class="mt-5 block w-full py-2.5 text-xs font-extrabold text-center text-[#2f27ce] border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
                            {{ $targetRevenue > 0 ? 'Lihat Rincian Target' : 'Set Target Bulanan' }}
                        </a>
                    </div>
                </div>
            </div>

            {{-- ===== RIGHT SIDEBAR ===== --}}
            <div class="xl:col-span-3 space-y-6">

                {{-- AI Insight --}}
                <div
                    class="bg-gradient-to-br from-[#443dff]/10 to-[#dddbff]/40 p-5 rounded-2xl border border-[#dddbff] shadow-sm relative overflow-hidden">
                    <div
                        class="absolute top-0 right-0 w-24 h-24 bg-[#443dff]/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none">
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center gap-2 mb-3">
                            <iconify-icon icon="solar:stars-bold-duotone" class="text-[#443dff] text-xl"></iconify-icon>
                            <span class="text-xs font-extrabold text-[#443dff] uppercase tracking-widest">Insight AI Hari
                                Ini</span>
                        </div>
                        <p class="text-sm font-medium text-[#050316] leading-relaxed mb-3">
                            "Pesanan <span class="font-extrabold">Kopi Susu</span> naik <span
                                class="font-extrabold text-[#443dff]">15%</span> di hari Jumat malam. Pastikan stok biji
                            kopi House Blend tersedia cukup untuk akhir pekan ini."
                        </p>
                        <a href="{{ route('reports.analytics.aov') }}"
                            class="text-xs font-extrabold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors flex items-center gap-1">
                            Lihat Analisis Detail
                            <iconify-icon icon="solar:arrow-right-bold" class="text-[12px]"></iconify-icon>
                        </a>
                    </div>
                </div>

                {{-- Laporan Terbaru --}}
                {{-- Laporan Terbaru --}}
                <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                    <h3 class="text-sm font-extrabold text-[#050316] mb-4">Laporan Terbaru</h3>
                    <div class="space-y-3">
                        @forelse ($recentReports as $report)
                            <a href="{{ route($report['route']) }}"
                                class="flex items-center gap-3 p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/20 hover:border-[#443dff] transition-all group">
                                <div
                                    class="w-9 h-9 bg-[#dddbff]/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="solar:document-bold-duotone"
                                        class="text-[#443dff] text-base"></iconify-icon>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p
                                        class="text-xs font-bold text-[#050316] truncate group-hover:text-[#443dff] transition-colors">
                                        {{ $report['label'] }}
                                    </p>
                                    <p class="text-[10px] font-medium text-[#2f27ce] mt-0.5">{{ $report['date'] }}</p>
                                </div>
                                <iconify-icon icon="solar:arrow-right-bold"
                                    class="text-[#dddbff] group-hover:text-[#443dff] transition-colors text-sm flex-shrink-0"></iconify-icon>
                            </a>
                        @empty
                            <div class="flex flex-col items-center gap-2 py-4">
                                <iconify-icon icon="solar:document-bold-duotone"
                                    class="text-[#dddbff] text-3xl"></iconify-icon>
                                <p class="text-xs text-[#2f27ce] italic text-center">Belum ada laporan tersimpan.</p>
                            </div>
                        @endforelse
                    </div>
                </div>

                {{-- Aksi Cepat --}}
                <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                    <h3 class="text-sm font-extrabold text-[#050316] mb-4">Aksi Cepat</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="window.location='{{ route('reports.export.excel') }}'"
                            class="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/30 hover:border-[#443dff] transition-all group">
                            <iconify-icon icon="solar:share-bold-duotone"
                                class="text-[#443dff] text-2xl group-hover:scale-110 transition-transform"></iconify-icon>
                            <span class="text-[11px] font-extrabold text-[#050316]">Bagikan</span>
                        </button>
                        <button onclick="window.print()"
                            class="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/30 hover:border-[#443dff] transition-all group">
                            <iconify-icon icon="solar:printer-bold-duotone"
                                class="text-[#443dff] text-2xl group-hover:scale-110 transition-transform"></iconify-icon>
                            <span class="text-[11px] font-extrabold text-[#050316]">Cetak</span>
                        </button>
                    </div>
                </div>

                {{-- Quick Nav Reports --}}
                <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                    <h3 class="text-sm font-extrabold text-[#050316] mb-4">Navigasi Laporan</h3>
                    <div class="space-y-2">
                        @php
                            $navItems = [
                                [
                                    'label' => 'Laporan Penjualan',
                                    'icon' => 'solar:chart-2-bold-duotone',
                                    'route' => 'reports.sales',
                                ],
                                [
                                    'label' => 'Laporan Harian',
                                    'icon' => 'solar:calendar-mark-bold-duotone',
                                    'route' => 'reports.daily',
                                ],
                                [
                                    'label' => 'Laporan Bulanan',
                                    'icon' => 'solar:calendar-bold-duotone',
                                    'route' => 'reports.monthly',
                                ],
                                [
                                    'label' => 'Laba & Rugi',
                                    'icon' => 'solar:graph-up-bold-duotone',
                                    'route' => 'reports.profit-loss',
                                ],
                                [
                                    'label' => 'Laporan Inventaris',
                                    'icon' => 'solar:box-bold-duotone',
                                    'route' => 'reports.inventory',
                                ],
                            ];
                        @endphp
                        @foreach ($navItems as $item)
                            <a href="{{ route($item['route']) }}"
                                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#dddbff]/30 hover:text-[#443dff] transition-all group">
                                <iconify-icon icon="{{ $item['icon'] }}"
                                    class="text-[#443dff] text-lg flex-shrink-0"></iconify-icon>
                                <span
                                    class="text-xs font-bold text-[#050316] group-hover:text-[#443dff] transition-colors">{{ $item['label'] }}</span>
                                <iconify-icon icon="solar:arrow-right-bold"
                                    class="text-[#dddbff] group-hover:text-[#443dff] transition-colors text-xs ml-auto"></iconify-icon>
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>

    <x-modal.filter-report :kasir="$filterKasir" :kategori="$filterKategori" :payments="$filterPayments" :days="$days" />

    @push('scripts')
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {

                // ── Revenue Line Chart ──────────────────────────────────────────────
                const revenueCtx = document.getElementById('revenueChart');
                if (revenueCtx) {
                    new Chart(revenueCtx, {
                        type: 'line',
                        data: {
                            labels: @json($chartLabels),
                            datasets: [{
                                    label: 'Pendapatan',
                                    data: @json($chartRevenue),
                                    borderColor: '#443dff',
                                    backgroundColor: 'rgba(68,61,255,0.08)',
                                    borderWidth: 2.5,
                                    fill: true,
                                    tension: 0.4,
                                    pointBackgroundColor: '#443dff',
                                    pointRadius: 3,
                                    pointHoverRadius: 5,
                                },
                                {
                                    label: 'Laba Bersih',
                                    data: @json($chartProfit),
                                    borderColor: '#34d399',
                                    backgroundColor: 'rgba(52,211,153,0.06)',
                                    borderWidth: 2.5,
                                    fill: true,
                                    tension: 0.4,
                                    pointBackgroundColor: '#34d399',
                                    pointRadius: 3,
                                    pointHoverRadius: 5,
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    callbacks: {
                                        label: ctx => 'Rp ' + ctx.parsed.y.toLocaleString('id-ID')
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: {
                                        display: false
                                    },
                                    ticks: {
                                        color: '#2f27ce',
                                        font: {
                                            weight: 'bold',
                                            size: 11
                                        }
                                    }
                                },
                                y: {
                                    grid: {
                                        color: '#dddbff',
                                        lineWidth: 0.8
                                    },
                                    ticks: {
                                        color: '#2f27ce',
                                        font: {
                                            size: 10
                                        },
                                        callback: val => 'Rp ' + (val / 1000000).toFixed(1) + 'M'
                                    }
                                }
                            }
                        }
                    });
                }

                // ── Donut Chart (masih hardcode, next step) ──────────────────────────
                // ── Donut Chart dari DB ──────────────────────────────────────────────
                const donutCtx = document.getElementById('donutChart');
                if (donutCtx) {
                    new Chart(donutCtx, {
                        type: 'doughnut',
                        data: {
                            labels: @json($donutLabels),
                            datasets: [{
                                data: @json($donutData),
                                backgroundColor: @json($donutBg),
                                borderWidth: 0,
                                hoverOffset: 6,
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '72%',
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    callbacks: {
                                        label: ctx => ctx.label + ': ' + ctx.parsed + '%'
                                    }
                                }
                            }
                        }
                    });
                }
            });
        </script>
    @endpush
@endsection
