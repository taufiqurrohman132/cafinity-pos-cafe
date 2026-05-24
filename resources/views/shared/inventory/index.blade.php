@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#fbfbfe]">
        <div class="grid grid-cols-1 xl:grid-cols-12">

            {{-- ======================== MAIN CONTENT ======================== --}}
            <div class="xl:col-span-9 p-4 md:p-6 space-y-6">

                {{-- HEADER --}}
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-[#050316]">Manajemen Inventaris</h1>
                        <p class="text-gray-500 mt-1">Lacak dan kelola stok bahan baku operasional kafe Anda secara real-time.</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition">
                            <iconify-icon icon="mdi:filter-outline" class="text-base"></iconify-icon>
                            Filter
                        </button>
                        <button class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] hover:bg-[#443dff] rounded-xl transition shadow-sm">
                            <iconify-icon icon="mdi:plus" class="text-base"></iconify-icon>
                            Tambah Bahan
                        </button>
                    </div>
                </div>

                {{-- STAT CARDS --}}
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500">Total Nilai Inventaris</p>
                                <h2 class="text-2xl font-bold text-[#050316] mt-3">Rp 12.450.000</h2>
                                <div class="flex items-center gap-1 mt-3 text-green-500 text-xs font-semibold">
                                    <iconify-icon icon="mdi:arrow-top-right"></iconify-icon>
                                    +2.4% dari bulan lalu
                                </div>
                            </div>
                            <div class="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:box-outline"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500">Peringatan Stok Rendah</p>
                                <h2 class="text-2xl font-bold text-[#050316] mt-3">3 Item</h2>
                                <div class="flex items-center gap-1 mt-3 text-red-500 text-xs font-semibold">
                                    <iconify-icon icon="mdi:arrow-bottom-right"></iconify-icon>
                                    Perlu segera dipesan
                                </div>
                            </div>
                            <div class="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 text-xl flex-shrink-0">
                                <iconify-icon icon="mdi:alert-outline"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500">Saran Restock</p>
                                <h2 class="text-2xl font-bold text-[#050316] mt-3">5 Item</h2>
                                <p class="text-xs text-gray-400 mt-3">Berdasarkan tren penjualan</p>
                            </div>
                            <div class="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="mdi:chart-line"></iconify-icon>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- TABLE CARD --}}
                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                    {{-- TABLE HEADER --}}
                    <div class="px-6 py-5 border-b border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <h3 class="font-bold text-[#050316]">Daftar Bahan Baku</h3>
                        <div class="relative">
                            <iconify-icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                            <input type="text" placeholder="Cari bahan..."
                                class="w-full lg:w-64 h-10 pl-9 pr-4 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dddbff]" />
                        </div>
                    </div>

                    {{-- TABLE --}}
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[800px]">
                            <thead>
                                <tr class="text-xs font-medium text-gray-400 bg-[#fbfbfe] border-b border-[#dddbff]">
                                    <th class="px-6 py-3">Nama Bahan</th>
                                    <th class="px-6 py-3">Kategori</th>
                                    <th class="px-6 py-3">Stok Saat Ini</th>
                                    <th class="px-6 py-3">Satuan</th>
                                    <th class="px-6 py-3">Biaya Rata-rata</th>
                                    <th class="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-[#dddbff]">

                                @php
                                    $items = [
                                        ['icon' => 'S', 'name' => 'Susu UHT Full Cream',           'category' => 'Dairy',       'stock' => '42 / 40',  'percent' => 105, 'unit' => 'Liter',   'price' => 'Rp 18.500',  'status' => 'Aman',    'color' => 'blue'],
                                        ['icon' => 'B', 'name' => 'Biji Kopi Arabica (House Blend)','category' => 'Coffee Beans', 'stock' => '8.5 / 20', 'percent' => 43,  'unit' => 'Kg',      'price' => 'Rp 240.000', 'status' => 'Menipis', 'color' => 'yellow'],
                                        ['icon' => 'S', 'name' => 'Sirup Vanilla Premium',        'category' => 'Syrups',      'stock' => '3 / 10',   'percent' => 30,  'unit' => 'Botol',   'price' => 'Rp 85.000',  'status' => 'Kritis',  'color' => 'orange'],
                                        ['icon' => 'B', 'name' => 'Bubuk Cokelat Dark',            'category' => 'Powders',     'stock' => '12 / 10',  'percent' => 100, 'unit' => 'Kg',      'price' => 'Rp 125.000', 'status' => 'Aman',    'color' => 'blue'],
                                        ['icon' => 'P', 'name' => 'Paper Cup 12oz',                'category' => 'Packaging',   'stock' => '150 / 400','percent' => 38,  'unit' => 'Pcs',     'price' => 'Rp 1.200',   'status' => 'Menipis', 'color' => 'yellow'],
                                        ['icon' => 'G', 'name' => 'Gula Cair (Fructose)',          'category' => 'Sweeteners',  'stock' => '0 / 4',    'percent' => 0,   'unit' => 'Jerigen', 'price' => 'Rp 110.000', 'status' => 'Habis',   'color' => 'red'],
                                    ];

                                    $statusStyles = [
                                        'blue'   => 'bg-[#dddbff] text-[#2f27ce]',
                                        'yellow' => 'bg-yellow-100 text-yellow-700',
                                        'orange' => 'bg-orange-100 text-orange-600',
                                        'red'    => 'bg-red-100 text-red-600',
                                    ];

                                    $barStyles = [
                                        'blue'   => 'bg-[#2f27ce]',
                                        'yellow' => 'bg-yellow-400',
                                        'orange' => 'bg-orange-400',
                                        'red'    => 'bg-red-400',
                                    ];
                                @endphp

                                @foreach ($items as $item)
                                    <tr class="hover:bg-[#fbfbfe] transition">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-9 h-9 rounded-xl bg-[#dddbff] text-[#2f27ce] font-bold text-sm flex items-center justify-center flex-shrink-0">
                                                    {{ $item['icon'] }}
                                                </div>
                                                <p class="font-semibold text-[#050316]">{{ $item['name'] }}</p>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class="px-2.5 py-1 rounded-full bg-[#fbfbfe] border border-[#dddbff] text-gray-600 text-xs font-medium">
                                                {{ $item['category'] }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="space-y-1.5">
                                                <div class="flex items-center justify-between text-xs">
                                                    <span class="font-semibold text-[#050316]">{{ $item['stock'] }}</span>
                                                    <span class="text-gray-400">{{ min($item['percent'], 100) }}%</span>
                                                </div>
                                                <div class="w-28 h-1.5 rounded-full bg-[#dddbff] overflow-hidden">
                                                    <div class="h-full rounded-full {{ $barStyles[$item['color']] }}"
                                                        style="width: {{ min($item['percent'], 100) }}%"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-gray-600">{{ $item['unit'] }}</td>
                                        <td class="px-6 py-4 font-semibold text-[#050316]">{{ $item['price'] }}</td>
                                        <td class="px-6 py-4">
                                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold {{ $statusStyles[$item['color']] }}">
                                                {{ $item['status'] }}
                                            </span>
                                        </td>
                                    </tr>
                                @endforeach

                            </tbody>
                        </table>
                    </div>

                    {{-- TABLE FOOTER --}}
                    <div class="px-6 py-4 border-t border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <p class="text-xs text-gray-400">Menampilkan 6 dari 48 jenis bahan baku</p>
                        <div class="flex items-center gap-4">
                            <button class="text-xs font-semibold text-gray-500 hover:text-[#2f27ce] transition">Unduh Laporan Stok (PDF)</button>
                            <button class="text-xs font-semibold text-gray-500 hover:text-[#2f27ce] transition">Cetak Label Inventaris</button>
                        </div>
                    </div>

                </div>
            </div>

            {{-- ======================== SIDEBAR ======================== --}}
            <div class="xl:col-span-3 border-l border-[#dddbff] bg-white p-4 md:p-6 space-y-6">

                {{-- AKSI CEPAT --}}
                <div>
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aksi Cepat</h3>
                    <div class="space-y-3">

                        <button class="w-full bg-[#2f27ce] hover:bg-[#443dff] transition rounded-xl p-4 text-left text-white flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-[#443dff] flex items-center justify-center text-lg flex-shrink-0">
                                <iconify-icon icon="mdi:refresh"></iconify-icon>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold">Penyesuaian Stok</h4>
                                <p class="text-xs text-[#dddbff] mt-0.5">Input stok masuk/keluar manual</p>
                            </div>
                        </button>

                        <button class="w-full border border-[#dddbff] rounded-xl p-4 text-left flex items-center gap-3 hover:bg-[#fbfbfe] transition">
                            <div class="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center text-[#2f27ce] text-lg flex-shrink-0">
                                <iconify-icon icon="mdi:clipboard-check-outline"></iconify-icon>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-[#050316]">Stock Opname</h4>
                                <p class="text-xs text-gray-400 mt-0.5">Audit fisik vs sistem mingguan</p>
                            </div>
                        </button>

                    </div>
                </div>

                {{-- LOG AKTIVITAS --}}
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Log Aktivitas</h3>
                        <button class="text-xs font-semibold text-[#2f27ce] hover:text-[#443dff]">Semua</button>
                    </div>

                    <div class="space-y-4">
                        @php
                            $logs = [
                                ['title' => 'Penyesuaian Stok',    'desc' => 'Susu UHT: +12L oleh Budi (Admin)',       'time' => '10 menit lalu'],
                                ['title' => 'Pengurangan Otomatis', 'desc' => 'Paper Cup: -1 Pcs oleh Santi (Kasir)',   'time' => '15 menit lalu'],
                                ['title' => 'Low Stock Alert',      'desc' => 'Biji Kopi Arabica: 8.5 Kg tersisa',      'time' => '1 jam lalu'],
                            ];
                        @endphp

                        @foreach ($logs as $log)
                            <div class="border-l-2 border-[#2f27ce] pl-3">
                                <div class="flex justify-between items-start gap-2">
                                    <p class="text-xs font-bold text-[#050316]">{{ $log['title'] }}</p>
                                    <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ $log['time'] }}</span>
                                </div>
                                <p class="text-xs text-gray-500 mt-0.5">{{ $log['desc'] }}</p>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- TIPS --}}
                <div class="bg-[#dddbff] border border-[#dddbff] rounded-2xl p-5">
                    <div class="flex items-start gap-3">
                        <div class="w-9 h-9 rounded-xl bg-[#fbfbfe] flex items-center justify-center text-[#2f27ce] text-lg flex-shrink-0">
                            <iconify-icon icon="mdi:lightbulb-outline"></iconify-icon>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-[#050316] mb-1">Tips Efisiensi</h4>
                            <p class="text-xs text-gray-600 leading-relaxed">
                                Biji Kopi Arabica hampir mencapai titik kritis.
                                Pastikan order ke supplier dilakukan sebelum pukul 15:00 hari ini.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        {{-- FOOTER --}}
        <div class="border-t border-[#dddbff] bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <p class="text-[10px] text-gray-400">© 2024 Smart Cafe POS v2.4.0</p>
            <div class="flex items-center gap-4 text-[10px] text-gray-400">
                <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-[#2f27ce]"></span> System Online
                </span>
                <span>Support ID: #POS-8821</span>
            </div>
        </div>

    </div>
@endsection