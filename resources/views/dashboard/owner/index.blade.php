@extends('layouts.app')

@section('content')
    <div class="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">

        {{-- Top Header --}}
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Dashboard Owner</h1>
                <p class="text-gray-500 mt-1">Selamat datang kembali, Alex. Berikut ringkasan performa cafe Anda hari ini.
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <span class="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">🕒 Terakhir Update: 14:30</span>
                <button
                    class="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2">
                    <span>➕</span> Buka POS
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- Main Content (Left) --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- Stats Grid --}}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {{-- Pendapatan --}}
                    <x-stat-card title="Pendapatan Hari Ini" value="Rp 450.000" trend="+ 12.5%" trend-type="up"
                        {{-- Hijau --}} icon="heroicon-o-currency-dollar" {{-- Gunakan icon library seperti Phosphor atau Heroicons --}} icon-bg="bg-green-100"
                        icon-color="text-green-600" />

                    {{-- Estimasi Laba --}}
                    <x-stat-card title="Estimasi Laba Bersih" value="Rp 210.000" trend="+ 8.2%" trend-type="up"
                        icon="heroicon-o-chart-pie" icon-bg="bg-emerald-100" icon-color="text-emerald-600" />

                    {{-- Total Pesanan --}}
                    <x-stat-card title="Total Pesanan" value="142" trend="- 4.1%" trend-type="down" {{-- Merah --}}
                        icon="heroicon-o-shopping-bag" icon-bg="bg-blue-100" icon-color="text-blue-600" />

                    {{-- Rata-rata Tiket --}}
                    <x-stat-card title="Rata-rata Tiket" value="Rp 87.600" trend="+ 15.3%" trend-type="up"
                        icon="heroicon-o-users" icon-bg="bg-pink-100" icon-color="text-pink-600" />

                </div>

                {{-- Main Chart --}}
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-lg font-bold">Ringkasan Penjualan</h3>
                            <p class="text-xs text-gray-400">Tren pendapatan realtime hari ini, 24 Mei 2024</p>
                        </div>
                        <span
                            class="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE
                        </span>
                    </div>
                    <div class="h-52 md:h-64 w-full bg-slate-50 rounded-xl flex items-end justify-between p-4 relative">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-300 italic">Visualisasi
                            Grafik Garis</div>
                    </div>
                </div>

                {{-- Row: Menu Terlaris & Jam Sibuk --}}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {{-- Menu Terlaris --}}
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div class="flex justify-between mb-4">
                            <h3 class="font-bold">Menu Terlaris</h3>
                            <a href="#" class="text-xs text-green-600 font-semibold">Lihat Katalog</a>
                        </div>
                        <div class="space-y-4">
                            @php
                                $menus = [
                                    [
                                        'name' => 'Es Kopi Susu Gula Aren',
                                        'sold' => '145 Porsi',
                                        'trend' => '+12%',
                                        'img' => '☕',
                                    ],
                                    [
                                        'name' => 'Croissant Almond',
                                        'sold' => '88 Porsi',
                                        'trend' => '+5%',
                                        'img' => '🥐',
                                    ],
                                    [
                                        'name' => 'Matcha Latte Ice',
                                        'sold' => '72 Porsi',
                                        'trend' => '-2%',
                                        'img' => '🍵',
                                    ],
                                ];
                            @endphp
                            @foreach ($menus as $menu)
                                <div class="flex items-center justify-between">
                                    <div class="flex flex-wrap items-center gap-3">
                                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                            {{ $menu['img'] }}</div>
                                        <div>
                                            <p class="text-sm font-bold">{{ $menu['name'] }}</p>
                                            <p class="text-xs text-gray-400">Coffee</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-bold">{{ $menu['sold'] }}</p>
                                        <p class="text-xs text-green-500">{{ $menu['trend'] }} vs kemarin</p>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    {{-- Jam Sibuk (Bar Chart) --}}
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 class="font-bold mb-4">Jam Sibuk</h3>
                        <div class="flex items-end justify-between h-40 pt-4">
                            @foreach ([30, 50, 80, 45, 60, 75] as $height)
                                <div class="w-8 bg-green-500 rounded-t-md transition-all hover:bg-green-600"
                                    style="height: {{ $height }}%"></div>
                            @endforeach
                        </div>
                        <div class="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
                            <span>08:10</span><span>10:12</span><span>12:14</span><span>14:16</span><span>16:18</span><span>18:20</span>
                        </div>
                    </div>
                </div>

                {{-- Analisis Profitabilitas Table --}}
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between mb-4">
                        <h3 class="font-bold">Analisis Profitabilitas</h3>
                        <button class="text-xs border px-3 py-1 rounded-lg hover:bg-gray-50">Detail HPP</button>
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
                                <tr class="border-b last:border-0">
                                    <td class="py-3 font-medium">Es Kopi Susu Gula Aren</td>
                                    <td class="py-3 text-gray-600">Rp 25.000</td>
                                    <td class="py-3 text-gray-600">Rp 8.500</td>
                                    <td class="py-3 text-green-600 font-bold">+Rp 16.500</td>
                                    <td class="py-3 text-right font-bold">66%</td>
                                </tr>
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
                        <span class="text-green-600 font-bold">85%</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                        <div class="bg-green-500 h-full w-[85%]"></div>
                    </div>
                    <p class="text-[10px] text-gray-400">Tinggal <span class="font-bold text-gray-700">Rp 1.550.000</span>
                        lagi untuk mencapai target Rp 14.000.000</p>
                </div>

                {{-- Alert Stok Rendah --}}
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        {{-- Judul dengan Ikon --}}
                        <div class="flex items-center gap-2">
                            <x-heroicon-o-cube class="w-4 h-4 text-green-500" />
                            <h3 class="text-sm font-bold">Alert Stok Rendah</h3>
                        </div>
                        <span class="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">3 Item</span>
                    </div>
                    <div class="space-y-3">
                        <div class="p-3 bg-red-50/50 rounded-xl border border-red-100 flex justify-between items-center">
                            <div>
                                <p class="text-xs font-bold">Biji Kopi Arabika</p>
                                <p class="text-[10px] text-red-400">Sisa 0.8 kg</p>
                            </div>
                            <button
                                class="text-[10px] font-bold text-gray-400 hover:text-gray-600 underline">Pesan</button>
                        </div>
                    </div>
                    <button
                        class="w-full mt-4 py-2 text-xs font-bold text-gray-500 border rounded-xl hover:bg-gray-100">Manajemen
                        Inventaris</button>
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
                        <div class="flex gap-3 items-start border-l-2 border-green-500 pl-3">
                            <div class="flex-1">
                                <p class="text-xs font-bold">#TRX-9903</p>
                                <p class="text-[10px] text-gray-400">2x Nasi Goreng, 1x Matcha Latte</p>
                            </div>
                            <div class="flex items-center gap-1">
                                <iconify-icon icon="material-symbols-light:av-timer"
                                    class="w-4 h-4 text-gray-600"></iconify-icon>
                                <span class="text-[10px] text-gray-400">2m</span>
                            </div>

                        </div>
                    </div>
                </div>

                {{-- Promo Banner --}}
                <div class="bg-green-50 p-5 rounded-2xl border border-green-100 relative overflow-hidden">
                    <div class="relative z-10">
                        <p class="text-[10px] font-bold text-green-600 mb-1">PROMO AKHIR PEKAN?</p>
                        <p class="text-[10px] text-green-800 leading-relaxed mb-3">Buat paket bundling menu terlaris untuk
                            meningkatkan penjualan akhir pekan.</p>
                        <button
                            class="text-[10px] font-extrabold text-green-600 border border-green-400 rounded-full px-3 py-1 transition-all duration-200 hover:bg-green-200 focus:text-white focus:no-underline focus:outline-none">
                            Buat Sekarang →
                        </button>
                    </div>
                    <span class="absolute -right-2 -bottom-2 text-4xl opacity-10">🎁</span>
                </div>
            </div>
        </div>
    </div>
@endsection
