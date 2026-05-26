@extends('layouts.app')

@section('content')
    <div class="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen relative">

        {{-- ====== TOP HEADER ====== --}}
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
            <div>
                <h1
                    class="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                    Dashboard Owner</h1>
                <p class="text-[#2f27ce] mt-1 text-sm font-medium">
                    Selamat datang kembali, <span class="font-extrabold text-[#050316]">{{ $user->name }}</span>.
                    Berikut ringkasan performa cafe Anda hari ini.
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <div
                    class="text-[13px] text-[#2f27ce] bg-white px-4 py-2.5 rounded-xl border border-[#dddbff] shadow-sm flex items-center gap-2 font-medium">
                    <iconify-icon icon="material-symbols:avg-time-outline" class="text-lg text-[#443dff]"></iconify-icon>
                    <span>Terakhir Update: <span class="font-bold text-[#050316]">{{ $lastUpdated }}</span></span>
                </div>
                <a href="{{ route('pos.index') }}"
                    class="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                    <iconify-icon icon="solar:card-2-bold" class="text-[18px]"></iconify-icon> Buka POS
                </a>
            </div>
        </div>

        {{-- ====== STAT CARDS ====== --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {{-- Catatan: Jika komponen x-stat-card ini ada di file terpisah, Anda mungkin perlu menyesuaikan desain di dalam komponennya juga. Namun saya sudah menyesuaikan props warnanya di sini. --}}
            <x-stat-card title="Pendapatan Hari Ini" :value="$stats['revenue']['value']" :trend="$stats['revenue']['trend']" :trend-type="$stats['revenue']['trend_type']"
                icon="heroicon-o-currency-dollar" icon-bg="bg-[#dddbff]" icon-color="text-[#443dff]" />

            <x-stat-card title="Estimasi Laba Bersih" :value="$stats['profit']['value']" :trend="$stats['profit']['trend']" :trend-type="$stats['profit']['trend_type']"
                icon="heroicon-o-chart-pie" icon-bg="bg-emerald-100" icon-color="text-emerald-600" />

            <x-stat-card title="Total Pesanan" :value="$stats['orders']['value']" :trend="$stats['orders']['trend']" :trend-type="$stats['orders']['trend_type']"
                icon="heroicon-o-shopping-bag" icon-bg="bg-[#dddbff]" icon-color="text-[#443dff]" />

            <x-stat-card title="Rata-rata Tiket" :value="$stats['avg_ticket']['value']" :trend="$stats['avg_ticket']['trend']" :trend-type="$stats['avg_ticket']['trend_type']"
                icon="heroicon-o-users" icon-bg="bg-[#dddbff]" icon-color="text-[#2f27ce]" />
        </div>

        {{-- ====== MAIN GRID ====== --}}
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- ===== LEFT CONTENT ===== --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- Sales Chart --}}
                {{-- Sales Chart --}}
                <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm" x-data="salesChart()"
                    x-init="init()">

                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                        <div>
                            <h3 class="text-lg font-extrabold text-[#050316] tracking-tight">Ringkasan Penjualan</h3>
                            <p class="text-xs text-[#2f27ce] font-medium" x-text="periodLabel"></p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span
                                class="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full shadow-sm">
                                <span
                                    class="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                                LIVE
                            </span>
                        </div>
                    </div>

                    {{-- Period Filter Pills --}}
                    <div class="flex items-center gap-2 mb-6">
                        <template x-for="pill in pills" :key="pill.value">
                            <button @click="setPeriod(pill.value)"
                                :class="activePeriod === pill.value ?
                                    'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm' :
                                    'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50 hover:text-[#050316]'"
                                class="px-4 py-1.5 text-xs font-bold rounded-lg border transition-all" x-text="pill.label">
                            </button>
                        </template>
                    </div>

                    {{-- Chart Bars --}}
                    <div class="h-52 md:h-64 w-full flex items-end justify-between gap-2 px-2 relative">
                        <div x-show="loading"
                            class="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                            <iconify-icon icon="svg-spinners:ring-resize" class="text-3xl text-[#443dff]"></iconify-icon>
                        </div>
                        <template x-for="(point, index) in chartData.values" :key="index">
                            <div class="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                                <span
                                    class="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-[#050316] px-2 py-0.5 rounded-md mb-1 shadow-md"
                                    x-text="'Rp ' + point.amount.toLocaleString('id-ID')"></span>
                                <div class="w-full bg-[#443dff] rounded-t-md transition-all duration-300 group-hover:bg-[#2f27ce] min-h-[4px] shadow-sm"
                                    :style="'height: ' + Math.max(point.height, 4) + '%'"></div>
                                <span
                                    class="text-[10px] font-bold text-[#2f27ce]/50 group-hover:text-[#050316] transition-colors"
                                    x-text="chartData.labels[index]"></span>
                            </div>
                        </template>
                        <p x-show="!loading && chartData.values.length === 0"
                            class="w-full text-center text-[#2f27ce] italic text-sm py-16">
                            Belum ada penjualan
                        </p>
                    </div>

                    <div class="flex gap-4 mt-6 text-xs font-bold text-[#2f27ce] justify-center">
                        <span class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#443dff] shadow-sm"></span> Pendapatan
                        </span>
                    </div>
                </div>

                {{-- Alpine Script --}}
                <script>
                    function salesChart() {
                        return {
                            activePeriod: 'today',
                            loading: false,
                            chartData: {
                                labels: @json($salesChart['labels']),
                                values: @json($salesChart['values']),
                            },
                            pills: [{
                                    label: 'Hari Ini',
                                    value: 'today'
                                },
                                {
                                    label: '7 Hari',
                                    value: '7days'
                                },
                                {
                                    label: '30 Hari',
                                    value: '30days'
                                },
                                {
                                    label: 'Bulan Ini',
                                    value: 'month'
                                },
                            ],
                            get periodLabel() {
                                const map = {
                                    today: 'Tren pendapatan hari ini',
                                    '7days': 'Tren pendapatan 7 hari terakhir',
                                    '30days': 'Tren pendapatan 30 hari terakhir',
                                    month: 'Tren pendapatan bulan ini',
                                };
                                return map[this.activePeriod] ?? '';
                            },
                            init() {},
                            async setPeriod(period) {
                                if (this.activePeriod === period) return;
                                this.activePeriod = period;
                                if (period === 'today') {
                                    this.chartData = {
                                        labels: @json($salesChart['labels']),
                                        values: @json($salesChart['values']),
                                    };
                                    return;
                                }
                                this.loading = true;
                                try {
                                    const res = await fetch(`{{ route('owner.sales-chart') }}?period=${period}`, {
                                        headers: {
                                            'X-Requested-With': 'XMLHttpRequest'
                                        }
                                    });
                                    this.chartData = await res.json();
                                } catch (e) {
                                    console.error(e);
                                } finally {
                                    this.loading = false;
                                }
                            }
                        }
                    }
                </script>

                {{-- Menu Terlaris & Jam Sibuk --}}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {{-- Menu Terlaris --}}
                    <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                        <div class="flex justify-between items-center mb-5">
                            <h3 class="font-extrabold text-[#050316] tracking-tight">Menu Terlaris</h3>
                            <a href="{{ route('menus.index') }}"
                                class="text-xs text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline transition-colors">Lihat
                                Katalog</a>
                        </div>
                        <div class="space-y-4">
                            @forelse ($bestSellingMenus as $menu)
                                <div
                                    class="flex items-center justify-between p-2.5 hover:bg-[#dddbff]/20 rounded-xl transition-colors">
                                    <div class="flex flex-wrap items-center gap-3">
                                        <div
                                            class="w-12 h-12 bg-[#dddbff]/30 border border-[#dddbff] rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                            {{ $menu['emoji'] }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-extrabold text-[#050316]">{{ $menu['name'] }}</p>
                                            <p class="text-xs font-medium text-[#2f27ce]">{{ $menu['category'] }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-extrabold text-[#050316]">{{ $menu['sold'] }}</p>
                                        <p
                                            class="text-[10px] font-bold {{ $menu['trend_type'] === 'up' ? 'text-emerald-500' : 'text-rose-500' }}">
                                            {{ $menu['trend'] }} vs kemarin
                                        </p>
                                    </div>
                                </div>
                            @empty
                                <p class="text-sm text-[#2f27ce] italic text-center py-4">Belum ada data penjualan menu hari
                                    ini.</p>
                            @endforelse
                        </div>
                    </div>

                    {{-- Jam Sibuk --}}
                    <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                        <h3 class="font-extrabold text-[#050316] tracking-tight mb-5">Jam Sibuk</h3>
                        <div class="flex items-end justify-between h-40 pt-4 gap-2">
                            @foreach ($busyHours as $slot)
                                <div class="flex-1 flex flex-col items-center gap-1 group">
                                    <div class="w-full bg-[#dddbff] rounded-t-md transition-all duration-300 group-hover:bg-[#443dff] min-h-[4px] shadow-sm"
                                        style="height: {{ max($slot['height'], 4) }}%"
                                        title="{{ $slot['count'] }} transaksi"></div>
                                </div>
                            @endforeach
                        </div>
                        <div class="flex justify-between mt-3 text-[10px] text-[#2f27ce] font-extrabold">
                            @foreach ($busyHours as $slot)
                                <span>{{ $slot['label'] }}</span>
                            @endforeach
                        </div>
                    </div>
                </div>

                {{-- Analisis Profitabilitas --}}
                <div class="bg-white p-6 rounded-2xl border border-[#dddbff] shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <h3 class="font-extrabold text-[#050316] tracking-tight">Analisis Profitabilitas</h3>
                        <a href="{{ route('recipe.index') }}"
                            class="text-xs font-bold border border-[#dddbff] text-[#2f27ce] px-4 py-1.5 rounded-lg hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm">Detail
                            HPP</a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[700px]">
                            <thead>
                                <tr class="text-xs text-[#2f27ce] border-b border-[#dddbff] uppercase tracking-wider">
                                    <th class="pb-3 font-extrabold">Nama Menu</th>
                                    <th class="pb-3 font-extrabold">Harga Jual</th>
                                    <th class="pb-3 font-extrabold">Estimasi HPP</th>
                                    <th class="pb-3 font-extrabold">Profit / Item</th>
                                    <th class="pb-3 font-extrabold text-right">Margin (%)</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                @forelse ($profitability as $row)
                                    <tr
                                        class="border-b border-[#dddbff]/50 last:border-0 hover:bg-[#dddbff]/10 transition-colors">
                                        <td class="py-4 font-bold text-[#050316]">{{ $row['name'] }}</td>
                                        <td class="py-4 font-medium text-[#050316]/70">{{ $row['price'] }}</td>
                                        <td class="py-4 font-medium text-[#050316]/70">{{ $row['hpp'] }}</td>
                                        <td class="py-4 text-emerald-600 font-extrabold">{{ $row['profit'] }}</td>
                                        <td class="py-4 text-right font-extrabold text-[#050316]">{{ $row['margin'] }}
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="py-8 text-center text-[#2f27ce] italic">
                                            Tambahkan menu dan resep untuk melihat analisis profit.
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {{-- ===== RIGHT SIDEBAR ===== --}}
            <div class="xl:col-span-3 space-y-6">

                {{-- Goal Hari Ini --}}
                <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm relative overflow-hidden">
                    <div
                        class="absolute top-0 right-0 w-24 h-24 bg-[#dddbff] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none">
                    </div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-[11px] font-extrabold uppercase tracking-widest text-[#2f27ce]">Goal Hari Ini
                            </h3>
                            <span class="text-[#443dff] font-extrabold text-sm">{{ $dailyGoal['progress'] }}%</span>
                        </div>
                        <div class="w-full bg-[#dddbff]/50 h-2.5 rounded-full overflow-hidden mb-3 shadow-inner">
                            <div class="bg-[#443dff] h-full transition-all duration-500 ease-out"
                                style="width: {{ $dailyGoal['progress'] }}%"></div>
                        </div>
                        <p class="text-[11px] font-medium text-[#2f27ce] leading-relaxed">
                            @if ($dailyGoal['progress'] >= 100)
                                Target <span class="font-extrabold text-[#050316]">{{ $dailyGoal['target'] }}</span>
                                tercapai! 🎉
                            @else
                                Tinggal <span class="font-extrabold text-[#050316]">{{ $dailyGoal['remaining'] }}</span>
                                lagi untuk mencapai target {{ $dailyGoal['target'] }}
                                @if ($dailyGoal['label'])
                                    <span class="block mt-0.5 text-[#2f27ce]/70 italic">({{ $dailyGoal['label'] }})</span>
                                @endif
                            @endif
                        </p>

                        @if (empty($currentTarget) || $dailyGoal['progress'] < 100)
                            <button type="button" onclick="document.getElementById('goal-modal').showModal()"
                                class="w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] bg-[#dddbff]/30 rounded-xl border border-[#dddbff] hover:bg-[#dddbff] hover:text-[#050316] hover:border-[#443dff] transition-all flex items-center justify-center gap-1.5 shadow-sm">
                                <iconify-icon icon="solar:target-linear" class="text-sm text-[#443dff]"></iconify-icon>
                                {{ $currentTarget ? 'Ubah Target' : 'Set Target Hari Ini' }}
                            </button>
                        @else
                            <a href="{{ route('targets-goals.index') }}"
                                class="block mt-4 w-full py-2.5 text-xs font-bold text-[#fbfbfe] bg-[#443dff] rounded-xl hover:bg-[#2f27ce] transition-colors text-center">
                                Lihat Detail Target &rarr;
                            </a>
                        @endif
                    </div>
                </div>

                {{-- Alert Stok Rendah (Pertahankan warna merah semantik) --}}
                <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <div class="flex items-center gap-2">
                            <iconify-icon icon="solar:box-minimalistic-bold-duotone"
                                class="text-lg text-rose-500"></iconify-icon>
                            <h3 class="text-sm font-extrabold text-[#050316]">Alert Stok Rendah</h3>
                        </div>
                        <span
                            class="bg-rose-100 text-rose-700 text-[10px] px-2.5 py-1 rounded-md font-extrabold border border-rose-200">
                            {{ $lowStockItems->count() }} Item
                        </span>
                    </div>
                    <div class="space-y-3">
                        @forelse ($lowStockItems as $item)
                            <a href="{{ route('inventories.show', $item->id) }}"
                                class="block p-3 bg-rose-50/80 rounded-xl border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all group">
                                <div class="flex justify-between items-center gap-2">
                                    <div>
                                        <p
                                            class="text-xs font-bold text-[#050316] group-hover:text-rose-900 transition-colors">
                                            {{ $item->name }}</p>
                                        <p class="text-[10px] font-medium text-rose-500 mt-0.5">
                                            Sisa <span class="font-bold">{{ $item->stock }} {{ $item->unit }}</span>
                                            (min {{ $item->min_stock }})
                                        </p>
                                    </div>
                                    <span
                                        class="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0 bg-white px-2 py-1 rounded-lg shadow-sm border border-rose-100">
                                        Detail &rarr;
                                    </span>
                                </div>
                            </a>
                        @empty
                            <p class="text-xs text-[#2f27ce] italic text-center py-2">Semua stok dalam kondisi aman.</p>
                        @endforelse
                    </div>
                    <a href="{{ $lowStockItems->isNotEmpty() ? route('inventories.show', $lowStockItems->first()->id) : route('inventories.index') }}"
                        class="block w-full mt-4 py-2.5 text-xs font-extrabold text-[#2f27ce] border border-[#dddbff] bg-[#fbfbfe] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] text-center transition-colors">
                        Manajemen Inventaris
                    </a>
                </div>

                {{-- Antrean Dapur --}}
                <div class="bg-white p-5 rounded-2xl border border-[#dddbff] shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <h3 class="text-sm font-extrabold text-[#050316]">Antrean Dapur</h3>
                        <div class="flex items-center gap-1.5">
                            <span
                                class="flex items-center gap-1 text-[10px] font-bold text-[#2f27ce] bg-[#dddbff]/50 px-2 py-0.5 rounded-md"><span
                                    class="w-1.5 h-1.5 bg-[#443dff] rounded-full animate-pulse"></span> Live</span>
                            <a href="{{ route('kitchen-orders.index') }}"
                                class="text-[10px] text-[#443dff] font-extrabold hover:text-[#2f27ce] hover:underline ml-1">Lihat
                                semua &rarr;</a>
                        </div>
                    </div>
                    <div class="space-y-3">
                        @forelse ($kitchenQueue as $order)
                            <a href="{{ route('detail.antrean') }}"
                                class="block p-3 rounded-xl border border-[#dddbff] hover:bg-[#dddbff]/20 hover:border-[#443dff] hover:shadow-sm transition-all group relative overflow-hidden">
                                @if ($order['status'] === 'preparing')
                                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                                @elseif ($order['status'] === 'ready')
                                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                                @else
                                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#dddbff]"></div>
                                @endif
                                <div class="flex justify-between items-start gap-3 pl-3">
                                    <div class="flex-1 min-w-0">
                                        <p
                                            class="text-xs font-extrabold text-[#050316] group-hover:text-[#443dff] transition-colors truncate">
                                            {{ $order['id'] }} <span class="font-normal text-[#2f27ce]/50 mx-1">—</span>
                                            <span class="font-medium text-[#2f27ce]">{{ $order['items'] }}</span>
                                        </p>
                                        <div class="flex items-center gap-2 mt-1.5">
                                            <span class="flex items-center gap-0.5 text-[10px] font-bold text-[#2f27ce]">
                                                <iconify-icon icon="solar:clock-circle-bold-duotone"
                                                    class="text-[14px]"></iconify-icon>
                                                {{ $order['time_ago'] }}
                                            </span>
                                            @if ($order['status'] === 'preparing')
                                                <span
                                                    class="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">Sedang
                                                    Dimasak</span>
                                            @elseif ($order['status'] === 'ready')
                                                <span
                                                    class="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">Siap
                                                    Diambil</span>
                                            @else
                                                <span
                                                    class="text-[9px] font-bold bg-[#dddbff] text-[#2f27ce] px-2 py-0.5 rounded-md border border-[#dddbff]">Menunggu</span>
                                            @endif
                                        </div>
                                    </div>
                                    <span
                                        class="text-[#443dff] text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 translate-x-2 group-hover:translate-x-0 transform duration-200">
                                        &rarr;
                                    </span>
                                </div>
                            </a>
                        @empty
                            <p class="text-xs text-[#2f27ce] italic text-center py-2">Tidak ada pesanan di dapur saat ini.
                            </p>
                        @endforelse
                    </div>
                </div>

                {{-- Promo Banner --}}
                <a href="{{ route('bundles.index') }}"
                    class="block bg-gradient-to-br from-[#050316] via-[#2f27ce] to-[#443dff] p-6 rounded-2xl border border-[#2f27ce] relative overflow-hidden hover:shadow-lg hover:shadow-[#443dff]/30 transition-all duration-300 group">
                    <div
                        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay">
                    </div>
                    <div class="relative z-10">
                        <p class="text-[10px] font-extrabold text-[#dddbff] mb-1.5 tracking-widest">✨ PROMO AKHIR PEKAN?
                        </p>
                        <p class="text-xs font-medium text-white leading-relaxed mb-4 pr-6">
                            Buat paket bundling menu terlaris untuk meningkatkan penjualan akhir pekan Anda.
                        </p>
                        <span
                            class="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#050316] bg-[#fbfbfe] rounded-lg px-4 py-2 transition-all duration-300 group-hover:bg-[#dddbff] shadow-sm">
                            Buat Sekarang <span
                                class="group-hover:translate-x-1 transition-transform text-[#443dff]">&rarr;</span>
                        </span>
                    </div>
                    <span
                        class="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 transform">
                        🎁
                    </span>
                </a>

            </div>
        </div>
    </div>

    {{-- ====== SET TARGET MODAL ====== --}}
    <x-modal.target :current-target="$currentTarget" :estimasi="$dailyGoal['progress'] ?? 74.2" />

@endsection
