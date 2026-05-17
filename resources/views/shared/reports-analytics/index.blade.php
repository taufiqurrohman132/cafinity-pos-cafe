@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#f5f7f9]">

        <div class="grid grid-cols-1 xl:grid-cols-12">

            {{-- MAIN CONTENT --}}
            <div class="xl:col-span-9 p-5 md:p-7">

                {{-- HEADER --}}
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

                    <div>
                        <h1 class="text-4xl font-bold text-gray-900">
                            Laporan Bisnis
                        </h1>

                        <p class="text-gray-500 text-lg mt-2 leading-relaxed">
                            Pantau performa dan pertumbuhan cafe Anda
                            secara real-time.
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">

                        {{-- RANGE --}}
                        <button
                            class="h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition flex items-center gap-2 text-sm font-semibold text-gray-700">

                            <iconify-icon icon="mdi:calendar-outline" class="text-lg"></iconify-icon>

                            7 Hari Terakhir
                        </button>

                        {{-- FILTER --}}
                        <button
                            class="h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-semibold text-gray-700">

                            Filter
                        </button>

                        {{-- EXPORT --}}
                        <button
                            class="h-11 px-6 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] transition text-white font-semibold flex items-center gap-2 shadow-sm">

                            <iconify-icon icon="mdi:download-outline" class="text-lg"></iconify-icon>

                            Ekspor Laporan
                        </button>

                    </div>

                </div>

                {{-- STATS --}}
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

                    {{-- CARD --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-5">

                        <div class="flex items-center justify-between mb-5">

                            <div
                                class="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">

                                <iconify-icon icon="mdi:currency-usd"></iconify-icon>

                            </div>

                            <span
                                class="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center gap-1">

                                <iconify-icon icon="mdi:trending-up"></iconify-icon>
                                +12.5%

                            </span>

                        </div>

                        <p class="text-gray-500 text-sm">
                            Total Pendapatan
                        </p>

                        <h2 class="text-4xl font-bold text-gray-900 mt-3">
                            Rp 40.500.000
                        </h2>

                    </div>

                    {{-- CARD --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-5">

                        <div class="flex items-center justify-between mb-5">

                            <div
                                class="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">

                                <iconify-icon icon="mdi:chart-line"></iconify-icon>

                            </div>

                            <span
                                class="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center gap-1">

                                <iconify-icon icon="mdi:trending-up"></iconify-icon>
                                +8.2%

                            </span>

                        </div>

                        <p class="text-gray-500 text-sm">
                            Estimasi Laba Bersih
                        </p>

                        <h2 class="text-4xl font-bold text-gray-900 mt-3">
                            Rp 12.450.000
                        </h2>

                    </div>

                    {{-- CARD --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-5">

                        <div class="flex items-center justify-between mb-5">

                            <div
                                class="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">

                                <iconify-icon icon="mdi:cart-outline"></iconify-icon>

                            </div>

                            <span
                                class="px-3 py-1 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center gap-1">

                                <iconify-icon icon="mdi:trending-down"></iconify-icon>
                                -2.4%

                            </span>

                        </div>

                        <p class="text-gray-500 text-sm">
                            Total Pesanan
                        </p>

                        <h2 class="text-4xl font-bold text-gray-900 mt-3">
                            1,248
                        </h2>

                    </div>

                    {{-- CARD --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-5">

                        <div class="flex items-center justify-between mb-5">

                            <div
                                class="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">

                                <iconify-icon icon="mdi:clock-outline"></iconify-icon>

                            </div>

                            <span
                                class="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center gap-1">

                                <iconify-icon icon="mdi:trending-up"></iconify-icon>
                                +5.1%

                            </span>

                        </div>

                        <p class="text-gray-500 text-sm">
                            Rata-rata Transaksi
                        </p>

                        <h2 class="text-4xl font-bold text-gray-900 mt-3">
                            Rp 32.450
                        </h2>

                    </div>

                </div>

                {{-- CHART + PIE --}}
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">

                    {{-- LINE CHART --}}
                    <div class="xl:col-span-8 bg-white rounded-2xl border border-gray-200 p-6">

                        <div class="flex justify-between items-start mb-6">

                            <div>
                                <h3 class="text-2xl font-bold text-gray-900">
                                    Tren Pendapatan & Laba
                                </h3>

                                <p class="text-gray-500 mt-1">
                                    Visualisasi harian dalam 7 hari terakhir.
                                </p>
                            </div>

                            <span
                                class="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">
                                Live Data
                            </span>

                        </div>

                        {{-- CHART MOCKUP --}}
                        <div class="h-[320px] relative">

                            <div class="absolute inset-0 flex flex-col justify-between text-xs text-gray-300">
                                <div class="border-b border-dashed pb-1">Rp 10M</div>
                                <div class="border-b border-dashed pb-1">Rp 7.5M</div>
                                <div class="border-b border-dashed pb-1">Rp 5M</div>
                                <div class="border-b border-dashed pb-1">Rp 2.5M</div>
                                <div>Rp 0M</div>
                            </div>

                            {{-- GREEN LINE --}}
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 600 300"
                                preserveAspectRatio="none">

                                <path d="M20 220 C80 230,100 240,150 180
                                        S250 200,300 150
                                        S400 40,500 60"
                                    fill="none"
                                    stroke="#22c55e"
                                    stroke-width="4"
                                    stroke-linecap="round" />

                                <path d="M20 220 C80 230,100 240,150 180
                                        S250 200,300 150
                                        S400 40,500 60
                                        L500 300 L20 300 Z"
                                    fill="url(#greenGradient)"
                                    opacity="0.15" />

                                <defs>
                                    <linearGradient id="greenGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stop-color="#22c55e" />
                                        <stop offset="100%" stop-color="#22c55e" stop-opacity="0" />
                                    </linearGradient>
                                </defs>

                            </svg>

                            {{-- ORANGE LINE --}}
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 600 300"
                                preserveAspectRatio="none">

                                <path d="M20 270 C80 275,100 280,150 245
                                        S250 255,300 220
                                        S400 180,500 190"
                                    fill="none"
                                    stroke="#f97316"
                                    stroke-width="4"
                                    stroke-linecap="round" />

                            </svg>

                        </div>

                        {{-- LEGEND --}}
                        <div class="flex items-center justify-center gap-6 mt-6 text-sm">

                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                Pendapatan
                            </div>

                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full bg-orange-400"></div>
                                Laba Bersih
                            </div>

                        </div>

                    </div>

                    {{-- DONUT --}}
                    <div class="xl:col-span-4 bg-white rounded-2xl border border-gray-200 p-6">

                        <h3 class="text-2xl font-bold text-gray-900">
                            Komposisi Penjualan
                        </h3>

                        <p class="text-gray-500 mt-1">
                            Berdasarkan kategori produk utama.
                        </p>

                        {{-- DONUT --}}
                        <div class="flex justify-center my-10">

                            <div
                                class="w-52 h-52 rounded-full border-[18px] border-green-500 relative rotate-[20deg]">

                                <div
                                    class="absolute inset-0 rounded-full border-[18px] border-transparent border-r-[#fb923c]">
                                </div>

                                <div
                                    class="absolute inset-0 rounded-full border-[18px] border-transparent border-b-[#60a5fa]">
                                </div>

                                <div
                                    class="absolute inset-0 rounded-full border-[18px] border-transparent border-l-[#facc15]">
                                </div>

                                <div class="absolute inset-7 bg-white rounded-full"></div>

                            </div>

                        </div>

                        {{-- LEGEND --}}
                        <div class="space-y-4">

                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                    Coffee
                                </div>

                                <span class="font-bold">45%</span>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-3 h-3 rounded-full bg-orange-400"></div>
                                    Non-Coffee
                                </div>

                                <span class="font-bold">25%</span>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-3 h-3 rounded-full bg-sky-400"></div>
                                    Main Course
                                </div>

                                <span class="font-bold">20%</span>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    Snacks
                                </div>

                                <span class="font-bold">10%</span>
                            </div>

                        </div>

                    </div>

                </div>

                {{-- TABLE --}}
                <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">

                    <div class="flex justify-between items-center mb-6">

                        <div>
                            <h3 class="text-2xl font-bold text-gray-900">
                                Produk Terlaris
                            </h3>

                            <p class="text-gray-500 mt-1">
                                Item dengan volume penjualan dan profitabilitas tertinggi.
                            </p>
                        </div>

                        <button class="text-green-600 font-semibold flex items-center gap-2">
                            Lihat Semua Menu

                            <iconify-icon icon="mdi:chevron-right"></iconify-icon>
                        </button>

                    </div>

                    <div class="overflow-x-auto">

                        <table class="w-full min-w-[700px]">

                            <thead>
                                <tr class="border-b border-gray-200 text-left text-gray-500 text-sm">
                                    <th class="pb-4 font-semibold">Nama Menu</th>
                                    <th class="pb-4 font-semibold">Kategori</th>
                                    <th class="pb-4 font-semibold">Qty Terjual</th>
                                    <th class="pb-4 font-semibold">Total Pendapatan</th>
                                    <th class="pb-4 font-semibold text-right">Estimasi Margin</th>
                                </tr>
                            </thead>

                            <tbody class="text-sm">

                                @php
                                    $menus = [
                                        [
                                            'name' => 'Es Kopi Susu Gula Aren',
                                            'category' => 'Coffee',
                                            'qty' => '145',
                                            'income' => 'Rp 3.625.000',
                                            'margin' => '65%',
                                        ],
                                        [
                                            'name' => 'Caffe Latte Hot',
                                            'category' => 'Coffee',
                                            'qty' => '98',
                                            'income' => 'Rp 2.744.000',
                                            'margin' => '60%',
                                        ],
                                        [
                                            'name' => 'Nasi Goreng Spesial',
                                            'category' => 'Main Course',
                                            'qty' => '76',
                                            'income' => 'Rp 2.660.000',
                                            'margin' => '45%',
                                        ],
                                        [
                                            'name' => 'Croissant Butter',
                                            'category' => 'Snacks',
                                            'qty' => '62',
                                            'income' => 'Rp 1.550.000',
                                            'margin' => '55%',
                                        ],
                                        [
                                            'name' => 'Matcha Latte Ice',
                                            'category' => 'Non-Coffee',
                                            'qty' => '58',
                                            'income' => 'Rp 1.450.000',
                                            'margin' => '58%',
                                        ],
                                    ];
                                @endphp

                                @foreach ($menus as $menu)
                                    <tr class="border-b border-gray-100">

                                        <td class="py-5 font-semibold text-gray-900">
                                            {{ $menu['name'] }}
                                        </td>

                                        <td class="py-5">
                                            <span
                                                class="px-3 py-1 rounded-full bg-green-100 text-gray-700 text-xs font-medium">
                                                {{ $menu['category'] }}
                                            </span>
                                        </td>

                                        <td class="py-5 font-semibold">
                                            {{ $menu['qty'] }}
                                        </td>

                                        <td class="py-5 font-semibold">
                                            {{ $menu['income'] }}
                                        </td>

                                        <td class="py-5 text-right text-green-600 font-bold">
                                            {{ $menu['margin'] }}
                                        </td>

                                    </tr>
                                @endforeach

                            </tbody>

                        </table>

                    </div>

                </div>

                {{-- BOTTOM --}}
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {{-- BAR CHART --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-6">

                        <h3 class="text-2xl font-bold text-gray-900">
                            Performa Jam Sibuk
                        </h3>

                        <p class="text-gray-500 mt-1">
                            Volume transaksi berdasarkan waktu operasional.
                        </p>

                        <div class="h-[300px] flex items-end justify-between gap-3 mt-10">

                            @foreach ([45, 80, 120, 65, 95, 160, 110] as $bar)
                                <div class="flex-1 bg-[#e48c5e] rounded-t-lg transition-all hover:opacity-90"
                                    style="height: {{ $bar }}px"></div>
                            @endforeach

                        </div>

                        <div class="flex justify-between text-xs text-gray-500 mt-4">
                            <span>08:00</span>
                            <span>10:00</span>
                            <span>12:00</span>
                            <span>14:00</span>
                            <span>16:00</span>
                            <span>18:00</span>
                            <span>20:00</span>
                        </div>

                    </div>

                    {{-- TARGET --}}
                    <div class="bg-white rounded-2xl border border-gray-200 p-6">

                        <h3 class="text-2xl font-bold text-gray-900">
                            Target Penjualan Bulanan
                        </h3>

                        <p class="text-gray-500 mt-1">
                            Progress pencapaian target bulan Oktober 2024.
                        </p>

                        {{-- PROGRESS --}}
                        <div class="flex justify-center my-10">

                            <div class="relative w-56 h-56">

                                <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">

                                    <circle cx="100" cy="100" r="80"
                                        stroke="#e5e7eb"
                                        stroke-width="14"
                                        fill="none" />

                                    <circle cx="100" cy="100" r="80"
                                        stroke="#22c55e"
                                        stroke-width="14"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-dasharray="502"
                                        stroke-dashoffset="125" />

                                </svg>

                                <div class="absolute inset-0 flex flex-col items-center justify-center">

                                    <h2 class="text-5xl font-bold text-gray-900">
                                        75%
                                    </h2>

                                    <p class="text-gray-400 text-sm font-semibold tracking-wider">
                                        TERCAPAI
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div class="text-center">

                            <h4 class="text-3xl font-bold text-gray-900">
                                Rp 150.000.000 / Rp 200.000.000
                            </h4>

                            <p class="text-gray-500 mt-3 italic">
                                Anda butuh Rp 50.000.000 lagi untuk mencapai target!
                            </p>

                            <button
                                class="w-full mt-8 h-12 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition">
                                Lihat Rincian Target
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {{-- SIDEBAR --}}
            <div class="xl:col-span-3 border-l border-gray-200 bg-white p-5 md:p-6">

                {{-- INSIGHT --}}
                <div class="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8">

                    <p class="text-sm text-gray-700 leading-relaxed">
                        "Pesanan Kopi Susu naik
                        <span class="text-green-600 font-bold">15%</span>
                        di hari Jumat malam.
                        Pastikan stok biji kopi House Blend tersedia cukup untuk akhir pekan ini."
                    </p>

                    <button class="mt-5 text-green-600 font-semibold text-sm">
                        Lihat Analisis Detail
                    </button>

                </div>

                {{-- LAPORAN --}}
                <div class="mb-8">

                    <h3 class="text-xl font-bold text-gray-900 mb-5">
                        Laporan Terbaru
                    </h3>

                    <div class="space-y-5">

                        @foreach ([
        ['title' => 'Bulanan - September', 'date' => '01 OKT 2024'],
        ['title' => 'Stok Opname - Minggu 4', 'date' => '29 SEP 2024'],
        ['title' => 'Efisiensi HPP Menu', 'date' => '25 SEP 2024'],
    ] as $report)
                            <div class="flex items-start gap-4">

                                <div
                                    class="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-lg">

                                    <iconify-icon icon="mdi:file-document-outline"></iconify-icon>

                                </div>

                                <div>
                                    <h4 class="font-semibold text-gray-900">
                                        {{ $report['title'] }}
                                    </h4>

                                    <p class="text-xs text-gray-400 mt-1">
                                        {{ $report['date'] }}
                                    </p>
                                </div>

                            </div>
                        @endforeach

                    </div>

                </div>

                {{-- QUICK ACTION --}}
                <div>

                    <h3 class="text-xl font-bold text-gray-900 mb-5">
                        Aksi Cepat
                    </h3>

                    <div class="grid grid-cols-2 gap-4">

                        <button
                            class="h-28 rounded-2xl border border-gray-200 hover:bg-gray-50 transition flex flex-col items-center justify-center gap-3">

                            <iconify-icon icon="mdi:share-variant-outline"
                                class="text-3xl text-gray-600"></iconify-icon>

                            <span class="font-semibold text-sm">
                                BAGIKAN
                            </span>

                        </button>

                        <button
                            class="h-28 rounded-2xl border border-gray-200 hover:bg-gray-50 transition flex flex-col items-center justify-center gap-3">

                            <iconify-icon icon="mdi:printer-outline"
                                class="text-3xl text-gray-600"></iconify-icon>

                            <span class="font-semibold text-sm">
                                CETAK
                            </span>

                        </button>

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