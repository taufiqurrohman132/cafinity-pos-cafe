@extends('layouts.app')

@section('content')
    <div class="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen relative">

        {{-- ====== TOP HEADER ====== --}}
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
            <div>
                <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Owner</h1>
                <p class="text-slate-500 mt-1">
                    Selamat datang kembali, <span class="font-semibold text-slate-700">{{ $user->name }}</span>.
                    Berikut ringkasan performa cafe Anda hari ini.
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <div class="text-sm text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                    <iconify-icon icon="material-symbols:avg-time-outline" class="text-lg text-indigo-500"></iconify-icon>
                    <span>Terakhir Update: <span class="font-semibold text-slate-700">{{ $lastUpdated }}</span></span>
                </div>
                <a href="{{ route('pos.index') }}"
                    class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 border border-slate-700">
                    <span>➕</span> Buka POS
                </a>
            </div>
        </div>

        {{-- ====== STAT CARDS ====== --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <x-stat-card title="Pendapatan Hari Ini" :value="$stats['revenue']['value']" :trend="$stats['revenue']['trend']" :trend-type="$stats['revenue']['trend_type']"
                icon="heroicon-o-currency-dollar" icon-bg="bg-indigo-100" icon-color="text-indigo-600" />

            <x-stat-card title="Estimasi Laba Bersih" :value="$stats['profit']['value']" :trend="$stats['profit']['trend']" :trend-type="$stats['profit']['trend_type']"
                icon="heroicon-o-chart-pie" icon-bg="bg-emerald-100" icon-color="text-emerald-600" />

            <x-stat-card title="Total Pesanan" :value="$stats['orders']['value']" :trend="$stats['orders']['trend']" :trend-type="$stats['orders']['trend_type']"
                icon="heroicon-o-shopping-bag" icon-bg="bg-sky-100" icon-color="text-sky-600" />

            <x-stat-card title="Rata-rata Tiket" :value="$stats['avg_ticket']['value']" :trend="$stats['avg_ticket']['trend']" :trend-type="$stats['avg_ticket']['trend_type']"
                icon="heroicon-o-users" icon-bg="bg-violet-100" icon-color="text-violet-600" />
        </div>

        {{-- ====== MAIN GRID ====== --}}
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- ===== LEFT CONTENT ===== --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- Sales Chart --}}
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                        <div>
                            <h3 class="text-lg font-extrabold text-slate-900 tracking-tight">Ringkasan Penjualan</h3>
                            <p class="text-xs text-slate-500 font-medium">Tren pendapatan hari ini, {{ $todayLabel }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full shadow-sm">
                                <span class="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                                LIVE
                            </span>
                        </div>
                    </div>

                    {{-- Period Filter Pills --}}
                    <div class="flex items-center gap-2 mb-6">
                        <button class="px-4 py-1.5 text-xs font-bold rounded-lg border transition bg-slate-900 text-white border-slate-900 shadow-sm">Hari Ini</button>
                        <button class="px-4 py-1.5 text-xs font-semibold rounded-lg border transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900">7 Hari</button>
                        <button class="px-4 py-1.5 text-xs font-semibold rounded-lg border transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900">30 Hari</button>
                        <button class="px-4 py-1.5 text-xs font-semibold rounded-lg border transition bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900">Bulan Ini</button>
                    </div>

                    <div class="h-52 md:h-64 w-full flex items-end justify-between gap-2 px-2">
                        @forelse ($salesChart['values'] as $index => $point)
                            <div class="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                                title="Rp {{ number_format($point['amount'], 0, ',', '.') }}">
                                @php
                                    $tooltip = $point['amount'] > 0 
                                        ? 'Rp ' . number_format($point['amount'], 0, ',', '.') 
                                        : 'Rp 0';
                                @endphp
                                <span class="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 px-2 py-0.5 rounded-md mb-1">{{ $tooltip }}</span>
                                <div class="w-full bg-indigo-500 rounded-t-md transition-all duration-300 group-hover:bg-indigo-600 min-h-[4px] shadow-sm group-hover:shadow-md"
                                    style="height: {{ max($point['height'], 4) }}%"></div>
                                <span class="text-[10px] font-medium text-slate-400 group-hover:text-slate-700 transition-colors">{{ $salesChart['labels'][$index] ?? '' }}</span>
                            </div>
                        @empty
                            <p class="w-full text-center text-slate-400 italic text-sm py-16">Belum ada penjualan hari ini</p>
                        @endforelse
                    </div>
                    <div class="flex gap-4 mt-6 text-xs font-semibold text-slate-500 justify-center">
                        <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></span> Pendapatan</span>
                    </div>
                </div>

                {{-- Menu Terlaris & Jam Sibuk --}}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {{-- Menu Terlaris --}}
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="flex justify-between items-center mb-5">
                            <h3 class="font-extrabold text-slate-900 tracking-tight">Menu Terlaris</h3>
                            <a href="{{ route('menus.index') }}" class="text-xs text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-colors">Lihat Katalog</a>
                        </div>
                        <div class="space-y-4">
                            @forelse ($bestSellingMenus as $menu)
                                <div class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                    <div class="flex flex-wrap items-center gap-3">
                                        <div class="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                            {{ $menu['emoji'] }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold text-slate-900">{{ $menu['name'] }}</p>
                                            <p class="text-xs font-medium text-slate-500">{{ $menu['category'] }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-extrabold text-slate-900">{{ $menu['sold'] }}</p>
                                        <p class="text-[10px] font-bold {{ $menu['trend_type'] === 'up' ? 'text-emerald-500' : 'text-rose-500' }}">
                                            {{ $menu['trend'] }} vs kemarin
                                        </p>
                                    </div>
                                </div>
                            @empty
                                <p class="text-sm text-slate-400 italic text-center py-4">Belum ada data penjualan menu hari ini.</p>
                            @endforelse
                        </div>
                    </div>

                    {{-- Jam Sibuk --}}
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 class="font-extrabold text-slate-900 tracking-tight mb-5">Jam Sibuk</h3>
                        <div class="flex items-end justify-between h-40 pt-4 gap-2">
                            @foreach ($busyHours as $slot)
                                <div class="flex-1 flex flex-col items-center gap-1 group">
                                    <div class="w-full bg-violet-400 rounded-t-md transition-all duration-300 group-hover:bg-violet-600 min-h-[4px] shadow-sm"
                                        style="height: {{ max($slot['height'], 4) }}%"
                                        title="{{ $slot['count'] }} transaksi"></div>
                                </div>
                            @endforeach
                        </div>
                        <div class="flex justify-between mt-3 text-[10px] text-slate-400 font-bold">
                            @foreach ($busyHours as $slot)
                                <span>{{ $slot['label'] }}</span>
                            @endforeach
                        </div>
                    </div>
                </div>

                {{-- Analisis Profitabilitas --}}
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <h3 class="font-extrabold text-slate-900 tracking-tight">Analisis Profitabilitas</h3>
                        <a href="{{ route('recipe.index') }}"
                            class="text-xs font-bold border border-slate-200 text-slate-600 px-4 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">Detail HPP</a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[700px]">
                            <thead>
                                <tr class="text-xs text-slate-400 border-b border-slate-200 uppercase tracking-wider">
                                    <th class="pb-3 font-bold">Nama Menu</th>
                                    <th class="pb-3 font-bold">Harga Jual</th>
                                    <th class="pb-3 font-bold">Estimasi HPP</th>
                                    <th class="pb-3 font-bold">Profit / Item</th>
                                    <th class="pb-3 font-bold text-right">Margin (%)</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                @forelse ($profitability as $row)
                                    <tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td class="py-4 font-bold text-slate-800">{{ $row['name'] }}</td>
                                        <td class="py-4 font-medium text-slate-500">{{ $row['price'] }}</td>
                                        <td class="py-4 font-medium text-slate-500">{{ $row['hpp'] }}</td>
                                        <td class="py-4 text-emerald-600 font-extrabold">{{ $row['profit'] }}</td>
                                        <td class="py-4 text-right font-extrabold text-slate-900">{{ $row['margin'] }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="py-8 text-center text-slate-400 italic">
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
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xs font-extrabold uppercase tracking-widest text-slate-500">Goal Hari Ini</h3>
                            <span class="text-indigo-600 font-extrabold text-sm">{{ $dailyGoal['progress'] }}%</span>
                        </div>
                        <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3 shadow-inner">
                            <div class="bg-indigo-600 h-full transition-all duration-500 ease-out" style="width: {{ $dailyGoal['progress'] }}%"></div>
                        </div>
                        <p class="text-[11px] font-medium text-slate-500 leading-relaxed">
                            @if ($dailyGoal['progress'] >= 100)
                                Target <span class="font-bold text-slate-900">{{ $dailyGoal['target'] }}</span> tercapai! 🎉
                            @else
                                Tinggal <span class="font-bold text-slate-900">{{ $dailyGoal['remaining'] }}</span>
                                lagi untuk mencapai target {{ $dailyGoal['target'] }}
                                @if ($dailyGoal['label'])
                                    <span class="block mt-0.5 text-slate-400 italic">({{ $dailyGoal['label'] }})</span>
                                @endif
                            @endif
                        </p>

                        @if (empty($currentTarget) || $dailyGoal['progress'] < 100)
                            <button type="button" onclick="document.getElementById('goal-modal').showModal()"
                                class="w-full mt-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                                <iconify-icon icon="solar:target-linear" class="text-sm text-indigo-500"></iconify-icon>
                                {{ $currentTarget ? 'Ubah Target' : 'Set Target Hari Ini' }}
                            </button>
                        @else
                            <a href="{{ route('targets-goals.index') }}"
                                class="block mt-4 w-full py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors text-center">
                                Lihat Detail Target &rarr;
                            </a>
                        @endif
                    </div>
                </div>

                {{-- Alert Stok Rendah --}}
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <div class="flex items-center gap-2">
                            <x-heroicon-o-cube class="w-4 h-4 text-rose-500" />
                            <h3 class="text-sm font-extrabold text-slate-900">Alert Stok Rendah</h3>
                        </div>
                        <span class="bg-rose-100 text-rose-700 text-[10px] px-2.5 py-1 rounded-full font-extrabold border border-rose-200">
                            {{ $lowStockItems->count() }} Item
                        </span>
                    </div>
                    <div class="space-y-3">
                        @forelse ($lowStockItems as $item)
                            <a href="{{ route('inventories.show', $item->id) }}"
                                class="block p-3 bg-rose-50/80 rounded-xl border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all group">
                                <div class="flex justify-between items-center gap-2">
                                    <div>
                                        <p class="text-xs font-bold text-slate-800 group-hover:text-rose-800 transition-colors">
                                            {{ $item->name }}</p>
                                        <p class="text-[10px] font-medium text-rose-500 mt-0.5">
                                            Sisa <span class="font-bold">{{ $item->stock }} {{ $item->unit }}</span> (min {{ $item->min_stock }})
                                        </p>
                                    </div>
                                    <span class="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0 bg-white px-2 py-1 rounded-lg shadow-sm border border-rose-100">
                                        Detail &rarr;
                                    </span>
                                </div>
                            </a>
                        @empty
                            <p class="text-xs text-slate-400 italic text-center py-2">Semua stok dalam kondisi aman.</p>
                        @endforelse
                    </div>
                    <a href="{{ $lowStockItems->isNotEmpty() ? route('inventories.show', $lowStockItems->first()->id) : route('inventories.index') }}"
                        class="block w-full mt-4 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 text-center transition-colors">
                        Manajemen Inventaris
                    </a>
                </div>

                {{-- Antrean Dapur --}}
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-center mb-5">
                        <h3 class="text-sm font-extrabold text-slate-900">Antrean Dapur</h3>
                        <div class="flex items-center gap-1.5">
                            <span class="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md"><span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></span> Live</span>
                            <a href="{{ route('detail.antrean') }}"
                                class="text-[10px] text-indigo-600 font-bold hover:text-indigo-800 hover:underline ml-1">Lihat semua &rarr;</a>
                        </div>
                    </div>
                    <div class="space-y-3">
                        @forelse ($kitchenQueue as $order)
                            <a href="{{ route('detail.antrean') }}"
                                class="block p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all group relative overflow-hidden">
                                @if ($order['status'] === 'preparing')
                                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                                @elseif ($order['status'] === 'ready')
                                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                                @else
                                    <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-300"></div>
                                @endif
                                <div class="flex justify-between items-start gap-3 pl-3">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs font-extrabold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">
                                            {{ $order['id'] }} <span class="font-normal text-slate-400 mx-1">—</span>
                                            <span class="font-medium text-slate-600">{{ $order['items'] }}</span>
                                        </p>
                                        <div class="flex items-center gap-2 mt-1.5">
                                            <span class="flex items-center gap-0.5 text-[10px] font-medium text-slate-400">
                                                <iconify-icon icon="material-symbols-light:av-timer" class="text-[14px]"></iconify-icon>
                                                {{ $order['time_ago'] }}
                                            </span>
                                            @if ($order['status'] === 'preparing')
                                                <span class="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">Sedang Dimasak</span>
                                            @elseif ($order['status'] === 'ready')
                                                <span class="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">Siap Diambil</span>
                                            @else
                                                <span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">Menunggu</span>
                                            @endif
                                        </div>
                                    </div>
                                    <span class="text-indigo-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 translate-x-2 group-hover:translate-x-0 transform duration-200">
                                        &rarr;
                                    </span>
                                </div>
                            </a>
                        @empty
                            <p class="text-xs text-slate-400 italic text-center py-2">Tidak ada pesanan di dapur saat ini.</p>
                        @endforelse
                    </div>
                </div>

                {{-- Promo Banner (Premium Gradient) --}}
                <a href="{{ route('bundles.index') }}"
                    class="block bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-300 group">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div class="relative z-10">
                        <p class="text-[10px] font-extrabold text-indigo-400 mb-1.5 tracking-widest">✨ PROMO AKHIR PEKAN?</p>
                        <p class="text-xs font-medium text-slate-300 leading-relaxed mb-4 pr-6">
                            Buat paket bundling menu terlaris untuk meningkatkan penjualan akhir pekan Anda.
                        </p>
                        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white rounded-lg px-4 py-2 transition-all duration-300 group-hover:bg-indigo-50 shadow-sm">
                            Buat Sekarang <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </span>
                    </div>
                    <span class="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 transform">
                        🎁
                    </span>
                </a>

            </div>
        </div>
    </div>

    {{-- ====== SET TARGET MODAL ====== --}}
    <dialog id="goal-modal" class="backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm backdrop:rounded-none transition-all">
        <div class="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl mx-4 sm:mx-auto my-auto border border-slate-200">
            <div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div>
                    <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Set Target Harian</h2>
                    <p class="text-xs font-medium text-slate-500 mt-1">Tentukan target pendapatan untuk hari ini ({{ $today->translatedFormat('d F Y') }})</p>
                </div>
                <button type="button" onclick="document.getElementById('goal-modal').close()"
                    class="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-500 transition-colors">
                    <iconify-icon icon="solar:close-circle-linear" class="text-xl"></iconify-icon>
                </button>
            </div>

            <form method="POST" action="{{ route('targets-goals.store') }}" class="space-y-5">
                @csrf
                <input type="hidden" name="type" value="revenue">
                <input type="hidden" name="period" value="daily">
                <input type="hidden" name="start_date" value="{{ $today->format('Y-m-d') }}">
                <input type="hidden" name="end_date" value="{{ $today->format('Y-m-d') }}">

                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Label Target <span class="text-rose-500">*</span></label>
                    <input type="text" name="label" placeholder="cth: Target Harian Shift Pagi" required
                        class="w-full h-11 rounded-xl border border-slate-300 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white"
                        value="{{ $currentTarget?->label ?? 'Target Pendapatan Harian' }}">
                    <p class="text-[10px] font-medium text-slate-400 mt-1.5">Gunakan label yang jelas (misal: Target Hari Sabtu).</p>
                </div>

                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Target Pendapatan (Rp) <span class="text-rose-500">*</span></label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm pointer-events-none">Rp</span>
                        <input type="number" name="target_value" min="1" step="1000" required
                            placeholder="14.000.000"
                            class="w-full h-11 rounded-xl border border-slate-300 text-sm pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white font-semibold"
                            value="{{ $currentTarget?->target_value ?? '' }}">
                    </div>
                    <p class="text-[10px] font-medium text-slate-400 mt-1.5">Target minimal pendapatan untuk mencapainya hari ini.</p>
                </div>

                <div>
                    <label class="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Pendapatan Saat Ini (Rp)</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm pointer-events-none">Rp</span>
                        <input type="number" name="current_value" min="0" step="1000"
                            placeholder="Terserah — dihitung otomatis"
                            class="w-full h-11 rounded-xl border border-slate-300 text-sm pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white font-semibold"
                            value="{{ $currentTarget?->current_value ?? ($dailyGoal['remaining'] ?? 0) }}">
                    </div>
                    <p class="text-[10px] font-medium text-slate-400 mt-1.5">Opsional. Nilai ini diperbarui otomatis dari data penjualan.</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Awal Periode</label>
                        <input type="date" name="start_date"
                            value="{{ $currentTarget?->start_date ?? $today->format('Y-m-d') }}"
                            class="w-full h-11 rounded-xl border border-slate-300 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white">
                    </div>
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">Akhir Periode</label>
                        <input type="date" name="end_date"
                            value="{{ $currentTarget?->end_date ?? $today->format('Y-m-d') }}"
                            class="w-full h-11 rounded-xl border border-slate-300 text-sm px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-slate-50 focus:bg-white">
                    </div>
                </div>

                @if ($currentTarget)
                    <input type="hidden" name="_method" value="PUT">
                @endif

                <div class="flex items-center gap-3 pt-4 border-t border-slate-100 mt-2">
                    <button type="submit"
                        class="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20">
                        <iconify-icon icon="solar:star-bold" class="text-lg"></iconify-icon>
                        Simpan Target
                    </button>
                    <button type="button" onclick="document.getElementById('goal-modal').close()"
                        class="h-12 px-6 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </dialog>

@endsection