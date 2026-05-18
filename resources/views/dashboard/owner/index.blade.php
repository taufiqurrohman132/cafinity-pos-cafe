@extends('layouts.app')

@section('content')
    <div class="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">

        {{-- Top Header --}}
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
                    class="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2">
                    <span>➕</span> Buka POS
                </a>
            </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- Main Content (Left) --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- Stats Grid --}}
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

                {{-- Main Chart --}}
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-lg font-bold">Ringkasan Penjualan</h3>
                            <p class="text-xs text-gray-400">Tren pendapatan hari ini, {{ $todayLabel }}</p>
                        </div>
                        <span
                            class="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE
                        </span>
                    </div>
                    <div class="h-52 md:h-64 w-full flex items-end justify-between gap-2 px-2">
                        @forelse ($salesChart['values'] as $index => $point)
                            <div class="flex-1 flex flex-col items-center gap-1">
                                <span class="text-[9px] text-gray-400 font-medium">
                                    {{ $point['amount'] > 0 ? 'Rp ' . number_format($point['amount'], 0, ',', '.') : '' }}
                                </span>
                                <div class="w-full bg-green-500 rounded-t-md transition-all hover:bg-green-600 min-h-[4px]"
                                    style="height: {{ max($point['height'], 4) }}%"></div>
                                <span class="text-[10px] text-gray-400">{{ $salesChart['labels'][$index] ?? '' }}</span>
                            </div>
                        @empty
                            <p class="w-full text-center text-gray-400 italic text-sm py-16">Belum ada penjualan hari ini</p>
                        @endforelse
                    </div>
                </div>

                {{-- Row: Menu Terlaris & Jam Sibuk --}}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div class="flex justify-between mb-4">
                            <h3 class="font-bold">Menu Terlaris</h3>
                            <a href="{{ route('menus.index') }}" class="text-xs text-green-600 font-semibold">Lihat Katalog</a>
                        </div>
                        <div class="space-y-4">
                            @forelse ($bestSellingMenus as $menu)
                                <div class="flex items-center justify-between">
                                    <div class="flex flex-wrap items-center gap-3">
                                        <div
                                            class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                            {{ $menu['emoji'] }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold">{{ $menu['name'] }}</p>
                                            <p class="text-xs text-gray-400">{{ $menu['category'] }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-bold">{{ $menu['sold'] }}</p>
                                        <p
                                            class="text-xs {{ $menu['trend_type'] === 'up' ? 'text-green-500' : 'text-red-500' }}">
                                            {{ $menu['trend'] }} vs kemarin
                                        </p>
                                    </div>
                                </div>
                            @empty
                                <p class="text-sm text-gray-400 italic">Belum ada data penjualan menu hari ini.</p>
                            @endforelse
                        </div>
                    </div>

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
                            class="text-xs border px-3 py-1 rounded-lg hover:bg-gray-50">Detail HPP</a>
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

            {{-- Sidebar (Right) --}}
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
                            <div
                                class="p-3 bg-red-50/50 rounded-xl border border-red-100 flex justify-between items-center">
                                <div>
                                    <p class="text-xs font-bold">{{ $item->name }}</p>
                                    <p class="text-[10px] text-red-400">
                                        Sisa {{ $item->stock }} {{ $item->unit }}
                                        (min {{ $item->min_stock }})
                                    </p>
                                </div>
                                <a href="{{ route('inventories.index') }}"
                                    class="text-[10px] font-bold text-gray-400 hover:text-gray-600 underline">Pesan</a>
                            </div>
                        @empty
                            <p class="text-xs text-gray-400 italic">Semua stok dalam kondisi aman.</p>
                        @endforelse
                    </div>
                    <a href="{{ route('inventories.index') }}"
                        class="block w-full mt-4 py-2 text-xs font-bold text-gray-500 border rounded-xl hover:bg-gray-100 text-center">
                        Manajemen Inventaris
                    </a>
                </div>

                {{-- Antrean Dapur --}}
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <iconify-icon icon="material-symbols-light:fork-spoon-rounded"
                                class="w-4 h-4 text-green-500"></iconify-icon>
                            <h3 class="text-sm font-bold">Antrean Dapur</h3>
                        </div>
                        <span class="text-[10px] text-gray-400 italic">Live Tracking</span>
                    </div>
                    <div class="space-y-4">
                        @forelse ($kitchenQueue as $order)
                            <div
                                class="flex gap-3 items-start border-l-2 {{ $order['status'] === 'preparing' ? 'border-orange-400' : ($order['status'] === 'ready' ? 'border-green-500' : 'border-gray-300') }} pl-3">
                                <div class="flex-1">
                                    <p class="text-xs font-bold">{{ $order['id'] }}</p>
                                    <p class="text-[10px] text-gray-400">{{ $order['items'] }}</p>
                                </div>
                                <div class="flex items-center gap-1">
                                    <iconify-icon icon="material-symbols-light:av-timer"
                                        class="w-4 h-4 text-gray-600"></iconify-icon>
                                    <span class="text-[10px] text-gray-400">{{ $order['time_ago'] }}</span>
                                </div>
                            </div>
                        @empty
                            <p class="text-xs text-gray-400 italic">Tidak ada pesanan di dapur saat ini.</p>
                        @endforelse
                    </div>
                </div>

                {{-- Promo Banner --}}
                <div class="bg-green-50 p-5 rounded-2xl border border-green-100 relative overflow-hidden">
                    <div class="relative z-10">
                        <p class="text-[10px] font-bold text-green-600 mb-1">PROMO AKHIR PEKAN?</p>
                        <p class="text-[10px] text-green-800 leading-relaxed mb-3">
                            Buat paket bundling menu terlaris untuk meningkatkan penjualan akhir pekan.
                        </p>
                        <a href="{{ route('bundles.index') }}"
                            class="inline-block text-[10px] font-extrabold text-green-600 border border-green-400 rounded-full px-3 py-1 transition-all duration-200 hover:bg-green-200">
                            Buat Sekarang →
                        </a>
                    </div>
                    <span class="absolute -right-2 -bottom-2 text-4xl opacity-10">🎁</span>
                </div>
            </div>
        </div>
    </div>
@endsection
