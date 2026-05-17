{{-- resources/views/resep/index.blade.php --}}
@extends('layouts.app')

@section('content')
    @php
        $resepList = [
            [
                'nama'      => 'Creamy Hazelnut Latte',
                'kategori'  => 'COFFEE',
                'hpp'       => 'Rp12.500',
                'harga'     => 'Rp35.000',
                'margin'    => '64.2%',
                'active'    => true,
                'badge'     => 'LOWEST',
            ],
            [
                'nama'      => 'Classic Beef Burger',
                'kategori'  => 'MAIN COURSE',
                'hpp'       => 'Rp28.000',
                'harga'     => 'Rp55.000',
                'margin'    => '49.1%',
                'active'    => false,
                'badge'     => null,
            ],
            [
                'nama'      => 'Matcha Zen Smoothie',
                'kategori'  => 'NON-COFFEE',
                'hpp'       => 'Rp18.200',
                'harga'     => 'Rp38.000',
                'margin'    => '52.1%',
                'active'    => false,
                'badge'     => null,
            ],
        ];

        $bahanBaku = [
            ['nama' => 'Espresso Roast (Arabica)', 'id' => 11, 'qty' => '18 g',   'harga' => 'Rp 350', 'subtotal' => 'Rp 6.300'],
            ['nama' => 'Fresh Milk',               'id' => 12, 'qty' => '200 ml', 'harga' => 'Rp 20',  'subtotal' => 'Rp 4.000'],
            ['nama' => 'Hazelnut Syrup',            'id' => 13, 'qty' => '15 ml', 'harga' => 'Rp 120', 'subtotal' => 'Rp 1.800'],
            ['nama' => 'Paper Cup & Lid',           'id' => 14, 'qty' => '1 pcs', 'harga' => 'Rp 400', 'subtotal' => 'Rp 400'],
        ];
    @endphp

    <div class="flex h-screen bg-gray-50 overflow-hidden">

        {{-- ======================== SIDEBAR KIRI ======================== --}}
        <div class="w-80 min-w-[280px] bg-white border-r border-gray-100 flex flex-col">
            {{-- Header Sidebar --}}
            <div class="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-900">Katalog Resep</h2>
                <button class="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg transition">
                    +
                </button>
            </div>

            {{-- Search --}}
            <div class="px-4 pt-4">
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input type="text" placeholder="Cari resep menu..."
                        class="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200" />
                </div>
            </div>

            {{-- List Resep --}}
            <div class="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Terakhir Diupdate</p>

                @foreach ($resepList as $resep)
                    <div @class([
                        'p-4 rounded-xl cursor-pointer transition group',
                        'bg-green-50 border border-green-200' => $resep['active'],
                        'hover:bg-gray-50 border border-transparent' => !$resep['active'],
                    ])>
                        <div class="flex justify-between items-start mb-1">
                            <p @class([
                                'text-sm font-bold',
                                'text-gray-900' => $resep['active'],
                                'text-gray-700' => !$resep['active'],
                            ])>{{ $resep['nama'] }}</p>
                            <span @class([
                                'text-[10px] font-bold px-2 py-0.5 rounded-full',
                                'bg-green-100 text-green-700' => $resep['active'],
                                'text-gray-400' => !$resep['active'],
                            ])>{{ $resep['margin'] }}</span>
                        </div>
                        <p class="text-[10px] font-semibold text-gray-400 mb-2">{{ $resep['kategori'] }}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] text-gray-500">HPP: {{ $resep['hpp'] }}</span>
                            <span class="text-xs font-bold text-gray-700">{{ $resep['harga'] }}</span>
                        </div>
                    </div>
                @endforeach
            </div>

            {{-- Footer Sidebar --}}
            <div class="p-4 border-t border-gray-100 text-[10px] text-gray-400 text-center">
                © 2024 Smart Cafe POS v2.4.0
            </div>
        </div>

        {{-- ======================== KONTEN UTAMA ======================== --}}
        <div class="flex-1 overflow-y-auto flex flex-col">

            {{-- Top Bar --}}
            <div class="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div>
                    <div class="flex items-center gap-3 mb-1">
                        <h1 class="text-2xl font-bold text-gray-900">Creamy Hazelnut Latte</h1>
                        <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Coffee</span>
                    </div>
                    <p class="text-xs text-gray-400 flex items-center gap-1">
                        <span>ℹ️</span> Terakhir disinkronisasi dengan harga inventory: 2 jam yang lalu
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <button class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                        💾 Simpan Perubahan
                    </button>
                    <button class="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition">
                        Edit Menu
                    </button>
                </div>
            </div>

            <div class="p-8 space-y-6">

                {{-- ===== STAT CARDS ===== --}}
                <div class="grid grid-cols-3 gap-6">
                    {{-- Total HPP --}}
                    <div class="bg-green-50 border border-green-100 rounded-2xl p-5">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total HPP</p>
                        <div class="flex items-center gap-3">
                            <p class="text-2xl font-bold text-gray-900">Rp 12.500</p>
                            <span class="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">LOWEST</span>
                        </div>
                    </div>

                    {{-- Harga Jual --}}
                    <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Harga Jual</p>
                        <p class="text-2xl font-bold text-gray-900">Rp 35.000</p>
                    </div>

                    {{-- Margin Kotor --}}
                    <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Margin Kotor</p>
                        <div class="flex items-center gap-2">
                            <p class="text-2xl font-bold text-gray-900">64.2%</p>
                            <span class="text-green-500 text-lg">↗</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-6">

                    {{-- ===== MAIN LEFT CONTENT ===== --}}
                    <div class="col-span-8 space-y-6">

                        {{-- Komposisi Bahan Baku --}}
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div class="flex justify-between items-center mb-5">
                                <h3 class="font-bold text-gray-900">Komposisi Bahan Baku</h3>
                                <button class="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition">
                                    + Tambah Bahan
                                </button>
                            </div>

                            {{-- Table --}}
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                        <th class="pb-3 text-left font-medium">Nama Bahan</th>
                                        <th class="pb-3 text-left font-medium">Kuantitas</th>
                                        <th class="pb-3 text-left font-medium">Harga Satuan</th>
                                        <th class="pb-3 text-left font-medium">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50">
                                    @foreach ($bahanBaku as $bahan)
                                        <tr class="hover:bg-gray-50 transition">
                                            <td class="py-4">
                                                <p class="font-medium text-gray-800">{{ $bahan['nama'] }}</p>
                                                <p class="text-[10px] text-gray-400">ID: {{ $bahan['id'] }}</p>
                                            </td>
                                            <td class="py-4 text-gray-600">{{ $bahan['qty'] }}</td>
                                            <td class="py-4 text-gray-600">{{ $bahan['harga'] }}</td>
                                            <td class="py-4 font-bold text-gray-900">{{ $bahan['subtotal'] }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                                <tfoot>
                                    <tr class="border-t-2 border-gray-200">
                                        <td colspan="3" class="pt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Total Kalkulasi Biaya
                                        </td>
                                        <td class="pt-4 font-bold text-gray-900 text-base">Rp 12.500</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {{-- Struktur Harga vs Biaya --}}
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 class="font-bold text-gray-900 mb-4">Struktur Harga vs Biaya</h3>

                            {{-- Progress Bar --}}
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                    <span class="text-xs text-gray-500">Cost of Goods Sold (HPP)</span>
                                </div>
                                <span class="text-xs font-bold text-gray-700">35.7%</span>
                            </div>
                            <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-5">
                                <div class="bg-green-500 h-full rounded-full" style="width: 35.7%"></div>
                            </div>

                            {{-- Bottom Cards --}}
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Laba Per Porsi</p>
                                    <p class="text-xl font-bold text-green-600">Rp 22.500</p>
                                </div>
                                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rekomendasi Harga</p>
                                    <div class="flex items-center gap-2">
                                        <p class="text-xl font-bold text-gray-900">Rp 37.500</p>
                                        <span class="text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">Optimal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- ===== SIDEBAR KANAN ===== --}}
                    <div class="col-span-4 space-y-5">

                        {{-- Simulator What-If --}}
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div class="flex items-center gap-2 mb-4">
                                <span class="text-orange-500">📊</span>
                                <h3 class="text-sm font-bold text-orange-500">Simulator "What-If"</h3>
                            </div>

                            <div class="flex justify-between items-center mb-2">
                                <p class="text-xs text-gray-600">Kenaikan Biaya Bahan Baku (%)</p>
                                <span class="text-xs font-bold text-green-600">+0%</span>
                            </div>

                            {{-- Slider --}}
                            <input type="range" min="0" max="50" value="0"
                                class="w-full accent-green-500 mb-2" />
                            <p class="text-[10px] text-gray-400 italic mb-4">*Simulasikan kenaikan harga pasar global pada resep ini.</p>

                            <div class="space-y-2 border-t border-gray-100 pt-4">
                                <div class="flex justify-between">
                                    <span class="text-xs text-gray-500">Proyeksi HPP Baru</span>
                                    <span class="text-xs font-bold text-gray-900">Rp 12.500</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-xs text-gray-500">Proyeksi Margin</span>
                                    <span class="text-xs font-bold text-gray-900">64.3%</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Impact on Profit</span>
                                    <span class="text-xs font-bold text-red-500">↘ -0.1%</span>
                                </div>
                            </div>

                            <button class="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                🔄 Reset Simulasi
                            </button>
                        </div>

                        {{-- Opsi Strategis --}}
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 class="text-sm font-bold text-gray-900 mb-3">Opsi Strategis</h3>
                            <div class="space-y-2">
                                @foreach ([
                                    'Update Harga Inventory Global',
                                    'Cetak Laporan Profitabilitas',
                                    'Bandingkan dengan Resep Lain',
                                ] as $opsi)
                                    <button class="w-full flex justify-between items-center py-3 px-4 text-xs font-semibold text-gray-700 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition">
                                        {{ $opsi }}
                                        <span class="text-gray-400">›</span>
                                    </button>
                                @endforeach
                            </div>
                        </div>

                        {{-- Peringatan Margin --}}
                        <div class="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="text-red-500 text-sm">⚠️</span>
                                <h3 class="text-xs font-bold text-red-500 uppercase tracking-wider">Peringatan Margin</h3>
                            </div>
                            <p class="text-xs text-gray-600 leading-relaxed mb-3">
                                Margin pada <span class="font-bold">Creamy Hazelnut Latte</span> mendekati batas minimum 40%.
                                Pertimbangkan untuk menaikkan harga jual jika biaya bahan baku naik lebih dari Rp2.000.
                            </p>
                            <a href="#" class="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1">
                                Analisis Strategi Harga →
                            </a>
                        </div>
                    </div>

                </div>{{-- end grid --}}
            </div>{{-- end p-8 --}}

            {{-- Footer --}}
            <div class="mt-auto px-8 py-4 border-t border-gray-100 bg-white flex justify-between items-center text-[10px] text-gray-400">
                <span>© 2024 Smart Cafe POS v2.4.0</span>
                <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1.5">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span> System Online
                    </span>
                    <span>Support ID: #POS-8821</span>
                </div>
            </div>

        </div>{{-- end main content --}}
    </div>{{-- end flex --}}
@endsection