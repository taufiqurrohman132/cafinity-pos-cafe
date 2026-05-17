@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#f5f7f9]">
        <div class="grid grid-cols-1 xl:grid-cols-12">

            {{-- MAIN CONTENT --}}
            <div class="xl:col-span-9 p-5 md:p-7">

                {{-- HEADER --}}
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">
                            Manajemen Inventaris
                        </h1>
                        <p class="text-gray-500 mt-1 text-[15px]">
                            Lacak dan kelola stok bahan baku operasional kafe Anda secara real-time.
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <button
                            class="h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium text-gray-700">

                            <iconify-icon icon="mdi:filter-outline" class="text-lg"></iconify-icon>

                            Filter
                        </button>

                        <button
                            class="h-11 px-6 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] transition text-white font-semibold flex items-center gap-2 shadow-sm">

                            <iconify-icon icon="mdi:plus" class="text-lg"></iconify-icon>

                            Tambah Bahan
                        </button>
                    </div>
                </div>

                {{-- TOP STATS --}}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">

                    {{-- CARD --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-gray-500 text-sm">
                                    Total Nilai Inventaris
                                </p>

                                <h2 class="text-4xl font-bold text-gray-900 mt-4">
                                    Rp 12.450.000
                                </h2>

                                <div class="flex items-center gap-2 mt-5 text-green-500 text-sm font-semibold">
                                    <iconify-icon icon="mdi:arrow-top-right"></iconify-icon>
                                    +2.4% dari bulan lalu
                                </div>
                            </div>

                            <div
                                class="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-2xl">

                                <iconify-icon icon="solar:box-outline"></iconify-icon>

                            </div>
                        </div>
                    </div>

                    {{-- CARD --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-gray-500 text-sm">
                                    Peringatan Stok Rendah
                                </p>

                                <h2 class="text-4xl font-bold text-gray-900 mt-4">
                                    3 Item
                                </h2>

                                <div class="flex items-center gap-2 mt-5 text-red-500 text-sm font-semibold">
                                    <iconify-icon icon="mdi:arrow-bottom-right"></iconify-icon>
                                    Perlu segera dipesan
                                </div>
                            </div>

                            <div
                                class="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-2xl">

                                <iconify-icon icon="mdi:alert-outline"></iconify-icon>

                            </div>
                        </div>
                    </div>

                    {{-- CARD --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-gray-500 text-sm">
                                    Saran Restock
                                </p>

                                <h2 class="text-4xl font-bold text-gray-900 mt-4">
                                    5 Item
                                </h2>

                                <div class="text-gray-400 text-sm mt-5">
                                    Berdasarkan tren penjualan
                                </div>
                            </div>

                            <div class="text-gray-400 text-2xl">
                                <iconify-icon icon="mdi:chevron-right"></iconify-icon>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- TABLE --}}
                <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                    {{-- HEADER TABLE --}}
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                            <h3 class="text-2xl font-bold text-gray-900">
                                Daftar Bahan Baku
                            </h3>

                            <div class="relative">
                                <iconify-icon icon="mdi:magnify"
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></iconify-icon>

                                <input type="text" placeholder="Cari bahan..."
                                    class="w-full lg:w-[280px] h-11 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                            </div>

                        </div>
                    </div>

                    {{-- TABLE --}}
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[900px]">

                            <thead class="bg-[#fafafa] border-b border-gray-200">
                                <tr class="text-left text-sm text-gray-500">
                                    <th class="px-6 py-4 font-semibold">Nama Bahan</th>
                                    <th class="px-6 py-4 font-semibold">Kategori</th>
                                    <th class="px-6 py-4 font-semibold">Stok Saat Ini</th>
                                    <th class="px-6 py-4 font-semibold">Satuan</th>
                                    <th class="px-6 py-4 font-semibold">Biaya Rata-rata</th>
                                    <th class="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                @php
                                    $items = [
                                        [
                                            'icon' => 'S',
                                            'name' => 'Susu UHT Full Cream',
                                            'category' => 'Dairy',
                                            'stock' => '42 / 40',
                                            'percent' => 105,
                                            'unit' => 'Liter',
                                            'price' => 'Rp 18.500',
                                            'status' => 'Aman',
                                            'statusColor' => 'green',
                                        ],
                                        [
                                            'icon' => 'B',
                                            'name' => 'Biji Kopi Arabica (House Blend)',
                                            'category' => 'Coffee Beans',
                                            'stock' => '8.5 / 20',
                                            'percent' => 43,
                                            'unit' => 'Kg',
                                            'price' => 'Rp 240.000',
                                            'status' => 'Menipis',
                                            'statusColor' => 'yellow',
                                        ],
                                        [
                                            'icon' => 'S',
                                            'name' => 'Sirup Vanilla Premium',
                                            'category' => 'Syrups',
                                            'stock' => '3 / 10',
                                            'percent' => 30,
                                            'unit' => 'Botol',
                                            'price' => 'Rp 85.000',
                                            'status' => 'Kritis',
                                            'statusColor' => 'orange',
                                        ],
                                        [
                                            'icon' => 'B',
                                            'name' => 'Bubuk Cokelat Dark',
                                            'category' => 'Powders',
                                            'stock' => '12 / 10',
                                            'percent' => 120,
                                            'unit' => 'Kg',
                                            'price' => 'Rp 125.000',
                                            'status' => 'Aman',
                                            'statusColor' => 'green',
                                        ],
                                        [
                                            'icon' => 'P',
                                            'name' => 'Paper Cup 12oz',
                                            'category' => 'Packaging',
                                            'stock' => '150 / 400',
                                            'percent' => 38,
                                            'unit' => 'Pcs',
                                            'price' => 'Rp 1.200',
                                            'status' => 'Menipis',
                                            'statusColor' => 'yellow',
                                        ],
                                        [
                                            'icon' => 'G',
                                            'name' => 'Gula Cair (Fructose)',
                                            'category' => 'Sweeteners',
                                            'stock' => '0 / 4',
                                            'percent' => 0,
                                            'unit' => 'Jerigen',
                                            'price' => 'Rp 110.000',
                                            'status' => 'Habis',
                                            'statusColor' => 'red',
                                        ],
                                    ];
                                @endphp

                                @foreach ($items as $item)
                                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition">

                                        {{-- NAMA --}}
                                        <td class="px-6 py-5">
                                            <div class="flex items-center gap-4">

                                                <div
                                                    class="w-10 h-10 rounded-xl bg-green-100 text-green-600 font-bold flex items-center justify-center">

                                                    {{ $item['icon'] }}

                                                </div>

                                                <div>
                                                    <h4 class="font-semibold text-gray-900">
                                                        {{ $item['name'] }}
                                                    </h4>
                                                </div>

                                            </div>
                                        </td>

                                        {{-- KATEGORI --}}
                                        <td class="px-6 py-5">
                                            <span
                                                class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                {{ $item['category'] }}
                                            </span>
                                        </td>

                                        {{-- STOK --}}
                                        <td class="px-6 py-5">
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between text-sm">
                                                    <span class="font-semibold text-gray-800">
                                                        {{ $item['stock'] }}
                                                    </span>

                                                    <span class="text-gray-500">
                                                        {{ $item['percent'] }}%
                                                    </span>
                                                </div>

                                                <div class="w-[120px] h-2 rounded-full bg-green-100 overflow-hidden">
                                                    <div class="h-full bg-green-500 rounded-full"
                                                        style="width: {{ min($item['percent'], 100) }}%">
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {{-- SATUAN --}}
                                        <td class="px-6 py-5 text-gray-700 font-medium">
                                            {{ $item['unit'] }}
                                        </td>

                                        {{-- BIAYA --}}
                                        <td class="px-6 py-5 text-gray-900 font-semibold">
                                            {{ $item['price'] }}
                                        </td>

                                        {{-- STATUS --}}
                                        <td class="px-6 py-5">

                                            @if ($item['statusColor'] == 'green')
                                                <span
                                                    class="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                                                    {{ $item['status'] }}
                                                </span>
                                            @elseif($item['statusColor'] == 'yellow')
                                                <span
                                                    class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                                    {{ $item['status'] }}
                                                </span>
                                            @elseif($item['statusColor'] == 'orange')
                                                <span
                                                    class="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                                                    {{ $item['status'] }}
                                                </span>
                                            @else
                                                <span
                                                    class="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                                                    {{ $item['status'] }}
                                                </span>
                                            @endif

                                        </td>

                                    </tr>
                                @endforeach

                            </tbody>

                        </table>
                    </div>

                    {{-- FOOTER --}}
                    <div
                        class="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-sm text-gray-500">

                        <p>
                            Menampilkan 6 dari 48 jenis bahan baku
                        </p>

                        <div class="flex items-center gap-6">

                            <button class="hover:text-green-600 transition">
                                Unduh Laporan Stok (PDF)
                            </button>

                            <button class="hover:text-green-600 transition">
                                Cetak Label Inventaris
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {{-- SIDEBAR --}}
            <div class="xl:col-span-3 border-l border-gray-200 bg-white p-5 md:p-6">

                {{-- QUICK ACTION --}}
                <div class="mb-8">
                    <h3 class="text-sm font-bold text-gray-500 uppercase mb-4">
                        AKSI CEPAT
                    </h3>

                    <div class="space-y-3">

                        <button
                            class="w-full bg-[#22c55e] hover:bg-[#16a34a] transition rounded-xl p-4 text-left text-white flex items-start gap-3">

                            <div class="text-2xl">
                                <iconify-icon icon="mdi:refresh"></iconify-icon>
                            </div>

                            <div>
                                <h4 class="font-bold">
                                    Penyesuaian Stok
                                </h4>

                                <p class="text-xs text-green-100 mt-1">
                                    Input stok masuk/keluar manual
                                </p>
                            </div>

                        </button>

                        <button
                            class="w-full border border-gray-200 rounded-xl p-4 text-left flex items-start gap-3 hover:bg-gray-50 transition">

                            <div
                                class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl">

                                <iconify-icon icon="mdi:clipboard-check-outline"></iconify-icon>

                            </div>

                            <div>
                                <h4 class="font-bold text-gray-800">
                                    Stock Opname
                                </h4>

                                <p class="text-xs text-gray-400 mt-1">
                                    Audit fisik vs sistem mingguan
                                </p>
                            </div>

                        </button>

                    </div>
                </div>

                {{-- LOG --}}
                <div class="mb-8">

                    <div class="flex items-center justify-between mb-5">
                        <h3 class="text-sm font-bold text-gray-500 uppercase">
                            LOG AKTIVITAS
                        </h3>

                        <button class="text-green-600 text-sm font-semibold">
                            Semua
                        </button>
                    </div>

                    <div class="space-y-5">

                        <div>
                            <div class="flex justify-between gap-3">
                                <h4 class="font-bold text-gray-800 text-sm">
                                    Penyesuaian Stok
                                </h4>

                                <span class="text-xs text-gray-400">
                                    10 menit lalu
                                </span>
                            </div>

                            <p class="text-sm text-gray-500 mt-1">
                                Susu UHT: +12L oleh Budi (Admin)
                            </p>
                        </div>

                        <div>
                            <div class="flex justify-between gap-3">
                                <h4 class="font-bold text-gray-800 text-sm">
                                    Pengurangan Otomatis
                                </h4>

                                <span class="text-xs text-gray-400">
                                    15 menit lalu
                                </span>
                            </div>

                            <p class="text-sm text-gray-500 mt-1">
                                Paper Cup: -1 Pcs oleh Santi (Kasir)
                            </p>
                        </div>

                        <div>
                            <div class="flex justify-between gap-3">
                                <h4 class="font-bold text-gray-800 text-sm">
                                    Low Stock Alert
                                </h4>

                                <span class="text-xs text-gray-400">
                                    1 jam lalu
                                </span>
                            </div>

                            <p class="text-sm text-gray-500 mt-1">
                                Biji Kopi Arabica: 8.5 Kg tersisa
                            </p>
                        </div>

                    </div>

                </div>

                {{-- TIPS --}}
                <div class="bg-green-50 border border-green-100 rounded-2xl p-5">

                    <div class="flex items-start gap-4">

                        <div
                            class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">

                            <iconify-icon icon="mdi:alert-outline"></iconify-icon>

                        </div>

                        <div>
                            <h4 class="font-bold text-gray-800 mb-2">
                                Tips Efisiensi
                            </h4>

                            <p class="text-sm leading-relaxed text-gray-600">
                                Biji Kopi Arabica hampir mencapai titik kritis.
                                Pastikan order ke supplier dilakukan sebelum pukul 15:00 hari ini.
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>

        {{-- FOOTER --}}
        <div
            class="h-14 border-t border-gray-200 bg-white flex flex-col lg:flex-row items-center justify-between px-6 text-sm text-gray-500">

            <p>
                © 2024 Smart Cafe POS v2.4.0
            </p>

            <div class="flex items-center gap-6">

                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                    System Online
                </div>

                <p>
                    Support ID: #POS-8821
                </p>

            </div>
        </div>
    </div>
@endsection