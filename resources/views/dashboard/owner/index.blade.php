@extends('layouts.app')

@section('content')
    <div class="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen relative">

        {{-- ====== TOP HEADER ====== --}}
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Dashboard Owner</h1>
                <p class="text-gray-500 mt-1">
                    Selamat datang kembali, {{ $user->name }}.
                    Berikut ringkasan performa cafe Anda hari ini.
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <span class="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
                    🕒 Terakhir Update: {{ $lastUpdated }}
                </span>
                <a href="{{ route('pos.index') }}"
                    class="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm">
                    <span>➕</span> Buka POS
                </a>
            </div>
        </div>

        {{-- ====== STAT CARDS ====== --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <x-stat-card title="Pendapatan Hari Ini" :value="$stats['revenue']['value']"
                :trend="$stats['revenue']['trend']" :trend-type="$stats['revenue']['trend_type']"
                icon="heroicon-o-currency-dollar" icon-bg="bg-green-100" icon-color="text-green-600" />

            <x-stat-card title="Estimasi Laba Bersih" :value="$stats['profit']['value']"
                :trend="$stats['profit']['trend']" :trend-type="$stats['profit']['trend_type']"
                icon="heroicon-o-chart-pie" icon-bg="bg-emerald-100" icon-color="text-emerald-600" />

            <x-stat-card title="Total Pesanan" :value="$stats['orders']['value']"
                :trend="$stats['orders']['trend']" :trend-type="$stats['orders']['trend_type']"
                icon="heroicon-o-shopping-bag" icon-bg="bg-blue-100" icon-color="text-blue-600" />

            <x-stat-card title="Rata-rata Tiket" :value="$stats['avg_ticket']['value']"
                :trend="$stats['avg_ticket']['trend']" :trend-type="$stats['avg_ticket']['trend_type']"
                icon="heroicon-o-users" icon-bg="bg-pink-100" icon-color="text-pink-600" />
        </div>

        {{-- ====== MAIN GRID ====== --}}
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- ===== LEFT CONTENT ===== --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- Sales Chart --}}
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                        <div>
                            <h3 class="text-lg font-bold">Ringkasan Penjualan</h3>
                            <p class="text-xs text-gray-400">Tren pendapatan hari ini, {{ $todayLabel }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span
                                class="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                                <span
                                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                LIVE
                            </span>
                        </div>
                    </div>

                    {{-- Period Filter Pills --}}
                    <div class="flex items-center gap-2 mb-4">
                        <button
                            class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition
                            bg-gray-900 text-white border-gray-900">Hari Ini</button>
                        <button
                            class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition
                            bg-white text-gray-600 border-gray-200 hover:bg-gray-50">7 Hari</button>
                        <button
                            class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition
                            bg-white text-gray-600 border-gray-200 hover:bg-gray-50">30 Hari</button>
                        <button
                            class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition
                            bg-white text-gray-600 border-gray-200 hover:bg-gray-50">Bulan Ini</button>
                    </div>

                        <div class="h-52 md:h-64 w-full flex items-end justify-between gap-2 px-2">
                        @forelse ($salesChart['values'] as $index => $point)
                            <div class="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="Rp
                              {{ number_format($point['amount'], 0, ',', '.') }}">
                                @php
                                    $tooltip = $point['amount'] > 0
                                        ? 'Rp ' . number_format($point['amount'], 0, ',', '.')
                                        : 'Rp 0';
                                @endphp
                                <span class="text-[9px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition">{{ $tooltip }}</span>
                                <div class="w-full bg-green-500 rounded-t-md transition-all hover:bg-green-600 min-h-[4px]"
                                    style="height: {{ max($point['height'], 4) }}%"></div>
                                <span
                                    class="text-[10px] text-gray-400">{{ $salesChart['labels'][$index] ?? '' }}</span>
                            </div>
                        @empty
                            <p class="w-full text-center text-gray-400 italic text-sm py-16">Belum ada penjualan hari
                                ini</p>
                        @endforelse
                        </div>
                    <div class="flex gap-4 mt-4 text-[10px] font-medium justify-center">
                        <span class="flex items-center gap-1"><span
                                class="w-2 h-2 rounded-full bg-green-500"></span> Pendapatan</span>
                    </div>
                </div>

                {{-- Menu Terlaris & Jam Sibuk --}}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {{-- Menu Terlaris --}}
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div class="flex justify-between mb-4">
                            <h3 class="font-bold">Menu Terlaris</h3>
                            <a href="{{ route('menus.index') }}"
                                class="text-xs text-green-600 font-semibold hover:underline">Lihat Katalog</a>
                        </div>
                        <div class="space-y-4">
                            @forelse ($bestSellingMenus as $menu)
                                <div class="flex items-center justify-between">
                                    <div class="flex flex-wrap items-center gap-3">
                                        <div
                                            class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                            {{ $menu['emoji'] }}</div>
                                        <div>
                                            <p class="text-sm font-bold">{{ $menu['name'] }}</p>
                                            <p class="text-xs text-gray-400">{{ $menu['category'] }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-bold">{{ $menu['sold'] }}</p>
                                        <p
                                            class="text-xs {{ $menu['trend_type'] === 'up' ? 'text-green-500' : 'text-red-500' }}">
                                            {{ $menu['trend'] }} vs kemarin</p>
                                    </div>
                                </div>
                            @empty
                                <p class="text-sm text-gray-400 italic">Belum ada data penjualan menu hari ini.</p>
                            @endforelse
                        </div>
                    </div>

                    {{-- Jam Sibuk --}}
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 class="font-bold mb-4">Jam Sibuk</h3>
                        <div class="flex items-end justify-between h-40 pt-4 gap-2">
                            @foreach ($busyHours as $slot)
                                <div class="flex-1 flex flex-col items-center gap-1">
                                    <div class="w-full bg-green-500 rounded-t-md transition-all hover:bg-green-600 min-h-[4px]"
                                        style="height: {{ max($slot['height'], 4) }}%"
                                        title="{{ $slot['count'] }} transaksi"></div>
                                </div>
                            @endforeach
                        </div>
                        <div class="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
                            @foreach ($busyHours as $slot)
                                <span>{{ $slot['label'] }}</span>
                            @endforeach
                        </div>
                    </div>
                </div>

                {{-- Analisis Profitabilitas --}}
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between mb-4">
                        <h3 class="font-bold">Analisis Profitabilitas</h3>
                        <a href="{{ route('recipe.index') }}"
                            class="text-xs border px-3 py-1 rounded-lg hover:bg-gray-50 transition">Detail HPP</a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[700px]">
                            <thead>
                                <tr class="text-xs text-gray-400 border-b">
                                    <th class="pb-3 font-medium">Nama Menu</th>
                                    <th class="pb-3 font-medium">Harga Jual</th>
                                    <th class="pb-3 font-medium">Estimasi HPP</th>
                                    <th class="pb-3 font-medium">Profit / Item</th>
                                    <th class="pb-3 font-medium text-right">Margin (%)</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                @forelse ($profitability as $row)
                                    <tr class="border-b last:border-0">
                                        <td class="py-3 font-medium">{{ $row['name'] }}</td>
                                        <td class="py-3 text-gray-600">{{ $row['price'] }}</td>
                                        <td class="py-3 text-gray-600">{{ $row['hpp'] }}</td>
                                        <td class="py-3 text-green-600 font-bold">{{ $row['profit'] }}</td>
                                        <td class="py-3 text-right font-bold">{{ $row['margin'] }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="py-6 text-center text-gray-400 italic">
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
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold uppercase tracking-wider text-gray-400">Goal Hari Ini</h3>
                        <span class="text-green-600 font-bold">{{ $dailyGoal['progress'] }}%</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                        <div class="bg-green-500 h-full transition-all"
                            style="width: {{ $dailyGoal['progress'] }}%"></div>
                    </div>
                    <p class="text-[10px] text-gray-400">
                        @if ($dailyGoal['progress'] >= 100)
                            Target <span class="font-bold text-gray-700">{{ $dailyGoal['target'] }}</span> tercapai!
                        @else
                            Tinggal <span class="font-bold text-gray-700">{{ $dailyGoal['remaining'] }}</span>
                            lagi untuk mencapai target {{ $dailyGoal['target'] }}
                            @if ($dailyGoal['label'])
                                ({{ $dailyGoal['label'] }})
                            @endif
                        @endif
                    </p>

                    @if (empty($currentTarget) || $dailyGoal['progress'] < 100)
                        <button type="button" onclick="document.getElementById('goal-modal').showModal()"
                            class="w-full mt-3 py-2.5 text-xs font-bold text-green-600 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition flex items-center justify-center gap-1">
                            <iconify-icon icon="solar:target-linear" class="text-sm"></iconify-icon>
                            {{ $currentTarget ? 'Ubah Target' : 'Set Target Hari Ini' }}
                        </button>
                    @else
                        <a href="{{ route('targets-goals.index') }}"
                            class="block mt-3 w-full py-2.5 text-xs font-bold text-green-600 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition text-center">
                            Lihat Detail Target →
                        </a>
                    @endif
                </div>

                {{-- Alert Stok Rendah --}}
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <x-heroicon-o-cube class="w-4 h-4 text-green-500" />
                            <h3 class="text-sm font-bold">Alert Stok Rendah</h3>
                        </div>
                        <span class="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {{ $lowStockItems->count() }} Item
                        </span>
                    </div>
                    <div class="space-y-3">
                        @forelse ($lowStockItems as $item)
                            <a href="{{ route('inventories.show', $item->id) }}"
                                class="block p-3 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition group">
                                <div class="flex justify-between items-center gap-2">
                                    <div>
                                        <p
                                            class="text-xs font-bold group-hover:text-green-700 transition-colors">{{ $item->name }}</p>
                                        <p class="text-[10px] text-red-400">
                                            Sisa {{ $item->stock }} {{ $item->unit }} (min {{ $item->min_stock }})
                                        </p>
                                    </div>
                                    <span class="text-[10px] font-bold text-green-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                        Detail →
                                    </span>
                                </div>
                            </a>
                        @empty
                            <p class="text-xs text-gray-400 italic">Semua stok dalam kondisi aman.</p>
                        @endforelse
                    </div>
                    <a href="{{ $lowStockItems->isNotEmpty() ? route('inventories.show', $lowStockItems->first()->id) : route('inventories.index') }}"
                        class="block w-full mt-4 py-2 text-xs font-bold text-gray-500 border rounded-xl hover:bg-gray-100 text-center">
                        Manajemen Inventaris
                    </a>
                </div>

                {{-- Antrean Dapur --}}
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-sm font-bold">Antrean Dapur</h3>
                        <div class="flex items-center gap-1">
                            <span class="text-[10px] text-gray-400 italic">Live Tracking</span>
                            <a href="{{ route('detail.antrean') }}"
                                class="text-[10px] text-green-600 font-semibold hover:underline ml-1">Lihat semua →</a>
                        </div>
                    </div>
                    <div class="space-y-3">
                        @forelse ($kitchenQueue as $order)
                            <a href="{{ route('detail.antrean') }}"
                                class="block p-3 rounded-xl border border-gray-100 hover:bg-green-50 hover:border-green-200 transition group relative">
                                @if ($order['status'] === 'preparing')
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l-xl"></div>
                                @elseif ($order['status'] === 'ready')
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl"></div>
                                @else
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-l-xl"></div>
                                @endif
                                <div class="flex justify-between items-start gap-3 pl-2">
                                    <div class="flex-1 min-w-0">
                                        <p
                                            class="text-xs font-bold group-hover:text-green-700 transition-colors truncate">
                                            {{ $order['id'] }} —
                                            <span class="font-normal text-gray-400">{{ $order['items'] }}</span>
                                        </p>
                                        <div class="flex items-center gap-1 mt-1">
                                            <iconify-icon icon="material-symbols-light:av-timer"
                                                class="w-3 h-3 text-gray-400"></iconify-icon>
                                            <span class="text-[10px] text-gray-400">{{ $order['time_ago'] }}</span>
                                            @if ($order['status'] === 'preparing')
                                                <span
                                                    class="text-[9px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full ml-1">Sedang
                                                    Dimasak</span>
                                            @elseif ($order['status'] === 'ready')
                                                <span
                                                    class="text-[9px] font-bold bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full ml-1">Siap
                                                    Diambil</span>
                                            @else
                                                <span
                                                    class="text-[9px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full ml-1">Menunggu</span>
                                            @endif
                                        </div>
                                    </div>
                                    <span
                                        class="text-green-600 text-sm opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                        →
                                    </span>
                                </div>
                            </a>
                        @empty
                            <p class="text-xs text-gray-400 italic">Tidak ada pesanan di dapur saat ini.</p>
                        @endforelse
                    </div>
                </div>

                {{-- Promo Banner --}}
                <a href="{{ route('bundles.index') }}"
                    class="block bg-green-50 p-5 rounded-2xl border border-green-100 relative overflow-hidden hover:bg-green-100 transition group">
                    <div class="relative z-10">
                        <p class="text-[10px] font-bold text-green-600 mb-1">PROMO AKHIR PEKAN?</p>
                        <p class="text-[10px] text-green-800 leading-relaxed mb-3">
                            Buat paket bundling menu terlaris untuk meningkatkan penjualan akhir pekan.
                        </p>
                        <span
                            class="inline-block text-[10px] font-extrabold text-green-600 border border-green-400 rounded-full px-3 py-1 transition-all duration-200 group-hover:bg-green-200">Buat
                            Sekarang →</span>
                    </div>
                    <span class="absolute -right-2 -bottom-2 text-4xl opacity-10 group-hover:opacity-20 transition">
                        🎁</span>
                </a>

            </div>
        </div>
    </div>

    {{-- ====== SET TARGET MODAL ====== --}}
    <dialog id="goal-modal" class="backdrop:bg-black/40 backdrop:rounded-none">
        <div
            class="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-slide-in mx-4 sm:mx-auto my-auto border border-gray-100">
            <div class="flex items-center justify-between mb-5">
                <div>
                    <h2 class="text-lg font-bold text-gray-900">Set Target Harian</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Tentukan target pendapatan untuk hari ini (
                        {{ $today->translatedFormat('d F Y') }})
                    </p>
                </div>
                <button type="button" onclick="document.getElementById('goal-modal').close()"
                    class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                    <iconify-icon icon="solar:close-circle-linear" class="text-xl"></iconify-icon>
                </button>
            </div>

            <form method="POST" action="{{ route('targets-goals.store') }}" class="space-y-4">
                @csrf
                <input type="hidden" name="type" value="revenue">
                <input type="hidden" name="period" value="daily">
                <input type="hidden" name="start_date" value="{{ $today->format('Y-m-d') }}">
                <input type="hidden" name="end_date" value="{{ $today->format('Y-m-d') }}">

                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1.5">Label Target <span
                            class="text-red-500">*</span></label>
                    <input type="text" name="label" placeholder="cth: Target Harian Shift Pagi" required
                        class="w-full h-10 rounded-xl border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value="{{ $currentTarget?->label ?? 'Target Pendapatan Harian' }}">
                    <p class="text-[10px] text-gray-400 mt-1">Gunakan label yang jelas (misal: Target Hari Sabtu).</p>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1.5">Target Pendapatan (Rp) <span
                            class="text-red-500">*</span></label>
                    <div class="relative">
                        <span
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">Rp</span>
                        <input type="number" name="target_value" min="1" step="1000" required
                            placeholder="14.000.000"
                            class="w-full h-10 rounded-xl border border-gray-200 text-sm pl-12 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value="{{ $currentTarget?->target_value ?? '' }}">
                    </div>
                    <p class="text-[10px] text-gray-400 mt-1">Target minimal pendapatan untuk mencapainya hari ini.</p>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-600 mb-1.5">Pendapatan Saat Ini (Rp)</label>
                    <div class="relative">
                        <span
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">Rp</span>
                        <input type="number" name="current_value" min="0" step="1000"
                            placeholder="Terserah — dihitung otomatis"
                            class="w-full h-10 rounded-xl border border-gray-200 text-sm pl-12 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value="{{ $currentTarget?->current_value ?? $dailyGoal['remaining'] ?? 0 }}">
                    </div>
                    <p class="text-[10px] text-gray-400 mt-1">Opsional. Nilai ini diperbarui otomatis dari data
                        penjualan.</p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1.5">Awal Periode</label>
                        <input type="date" name="start_date"
                            value="{{ $currentTarget?->start_date ?? $today->format('Y-m-d') }}"
                            class="w-full h-10 rounded-xl border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 [color-scheme:dark]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-600 mb-1.5">Akhir Periode</label>
                        <input type="date" name="end_date"
                            value="{{ $currentTarget?->end_date ?? $today->format('Y-m-d') }}"
                            class="w-full h-10 rounded-xl border border-gray-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 [color-scheme:dark]">
                    </div>
                </div>

                @if ($currentTarget)
                    <input type="hidden" name="_method" value="PUT">
                @endif

                <div class="flex items-center gap-2 pt-2">
                    <button type="submit"
                        class="flex-1 h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2">
                        <iconify-icon icon="solar:star-bold" class="text-base"></iconify-icon>
                        Simpan Target
                    </button>
                    <button type="button" onclick="document.getElementById('goal-modal').close()"
                        class="h-11 px-5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </dialog>

@endsection
