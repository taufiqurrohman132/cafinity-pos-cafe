@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-gray-50">
        <div class="grid grid-cols-1 xl:grid-cols-12">

            {{-- ======================== MAIN CONTENT ======================== --}}
            <div class="xl:col-span-9 p-4 md:p-6 space-y-6">

                {{-- HEADER --}}
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Laporan Bisnis</h1>
                        <p class="text-gray-500 mt-1">Pantau performa dan pertumbuhan cafe Anda secara real-time.</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                            <iconify-icon icon="mdi:calendar-outline" class="text-base"></iconify-icon>
                            7 Hari Terakhir
                        </button>
                        <button class="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                            Filter
                        </button>
                        <button class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition shadow-sm">
                            <iconify-icon icon="mdi:download-outline" class="text-base"></iconify-icon>
                            Ekspor Laporan
                        </button>
                    </div>
                </div>

                {{-- STAT CARDS --}}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    @php
                        $stats = [
                            ['icon' => 'mdi:currency-usd',  'label' => 'Total Pendapatan',    'value' => 'Rp 40.500.000', 'trend' => '+12.5%', 'up' => true,  'icon_bg' => 'bg-green-100',  'icon_color' => 'text-green-600'],
                            ['icon' => 'mdi:chart-line',    'label' => 'Estimasi Laba Bersih', 'value' => 'Rp 12.450.000', 'trend' => '+8.2%',  'up' => true,  'icon_bg' => 'bg-emerald-100','icon_color' => 'text-emerald-600'],
                            ['icon' => 'mdi:cart-outline',  'label' => 'Total Pesanan',        'value' => '1.248',          'trend' => '-2.4%',  'up' => false, 'icon_bg' => 'bg-blue-100',   'icon_color' => 'text-blue-600'],
                            ['icon' => 'mdi:clock-outline', 'label' => 'Rata-rata Transaksi',  'value' => 'Rp 32.450',      'trend' => '+5.1%',  'up' => true,  'icon_bg' => 'bg-pink-100',   'icon_color' => 'text-pink-600'],
                        ];
                    @endphp

                    @foreach ($stats as $stat)
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-11 h-11 rounded-xl {{ $stat['icon_bg'] }} {{ $stat['icon_color'] }} flex items-center justify-center text-xl">
                                    <iconify-icon icon="{{ $stat['icon'] }}"></iconify-icon>
                                </div>
                                <span class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                                    {{ $stat['up'] ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500' }}">
                                    <iconify-icon icon="{{ $stat['up'] ? 'mdi:trending-up' : 'mdi:trending-down' }}"></iconify-icon>
                                    {{ $stat['trend'] }}
                                </span>
                            </div>
                            <p class="text-xs text-gray-400">{{ $stat['label'] }}</p>
                            <h2 class="text-xl font-bold text-gray-900 mt-1">{{ $stat['value'] }}</h2>
                        </div>
                    @endforeach

                </div>

                {{-- CHART + DONUT --}}
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {{-- LINE CHART --}}
                    <div class="xl:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-gray-900">Tren Pendapatan & Laba</h3>
                                <p class="text-xs text-gray-400 mt-0.5">Visualisasi harian dalam 7 hari terakhir.</p>
                            </div>
                            <span class="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> LIVE
                            </span>
                        </div>

                        <div class="h-56 relative">
                            <div class="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none">
                                <div class="border-b border-dashed border-gray-100 pb-1">Rp 10M</div>
                                <div class="border-b border-dashed border-gray-100 pb-1">Rp 7.5M</div>
                                <div class="border-b border-dashed border-gray-100 pb-1">Rp 5M</div>
                                <div class="border-b border-dashed border-gray-100 pb-1">Rp 2.5M</div>
                                <div>Rp 0M</div>
                            </div>
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="greenGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stop-color="#22c55e" />
                                        <stop offset="100%" stop-color="#22c55e" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M20 160 C80 170,100 175,150 130 S250 145,300 105 S400 30,500 45"
                                    fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" />
                                <path d="M20 160 C80 170,100 175,150 130 S250 145,300 105 S400 30,500 45 L500 220 L20 220 Z"
                                    fill="url(#greenGradient)" opacity="0.12" />
                                <path d="M20 195 C80 198,100 200,150 178 S250 185,300 160 S400 130,500 138"
                                    fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
                            </svg>
                        </div>

                        <div class="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                            <div class="flex items-center gap-1.5">
                                <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div> Pendapatan
                            </div>
                            <div class="flex items-center gap-1.5">
                                <div class="w-2.5 h-2.5 rounded-full bg-orange-400"></div> Laba Bersih
                            </div>
                        </div>
                    </div>

                    {{-- DONUT --}}
                    <div class="xl:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-bold text-gray-900">Komposisi Penjualan</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Berdasarkan kategori produk utama.</p>

                        <div class="flex justify-center my-6">
                            <div class="w-40 h-40 rounded-full border-[14px] border-green-500 relative rotate-[20deg]">
                                <div class="absolute inset-0 rounded-full border-[14px] border-transparent border-r-orange-400"></div>
                                <div class="absolute inset-0 rounded-full border-[14px] border-transparent border-b-sky-400"></div>
                                <div class="absolute inset-0 rounded-full border-[14px] border-transparent border-l-yellow-400"></div>
                                <div class="absolute inset-5 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            @foreach ([['bg-green-500','Coffee','45%'],['bg-orange-400','Non-Coffee','25%'],['bg-sky-400','Main Course','20%'],['bg-yellow-400','Snacks','10%']] as [$color, $label, $pct])
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2 text-xs text-gray-600">
                                        <div class="w-2.5 h-2.5 rounded-full {{ $color }}"></div>
                                        {{ $label }}
                                    </div>
                                    <span class="text-xs font-bold text-gray-900">{{ $pct }}</span>
                                </div>
                            @endforeach
                        </div>
                    </div>

                </div>

                {{-- PRODUK TERLARIS --}}
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h3 class="font-bold text-gray-900">Produk Terlaris</h3>
                            <p class="text-xs text-gray-400 mt-0.5">Item dengan volume penjualan dan profitabilitas tertinggi.</p>
                        </div>
                        <button class="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition">
                            Lihat Semua Menu <iconify-icon icon="mdi:chevron-right"></iconify-icon>
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[600px]">
                            <thead>
                                <tr class="text-xs font-medium text-gray-400 border-b border-gray-100">
                                    <th class="pb-3">Nama Menu</th>
                                    <th class="pb-3">Kategori</th>
                                    <th class="pb-3">Qty Terjual</th>
                                    <th class="pb-3">Total Pendapatan</th>
                                    <th class="pb-3 text-right">Estimasi Margin</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-gray-50">
                                @php
                                    $menus = [
                                        ['Es Kopi Susu Gula Aren', 'Coffee',      '145', 'Rp 3.625.000', '65%'],
                                        ['Caffe Latte Hot',         'Coffee',      '98',  'Rp 2.744.000', '60%'],
                                        ['Nasi Goreng Spesial',     'Main Course', '76',  'Rp 2.660.000', '45%'],
                                        ['Croissant Butter',        'Snacks',      '62',  'Rp 1.550.000', '55%'],
                                        ['Matcha Latte Ice',        'Non-Coffee',  '58',  'Rp 1.450.000', '58%'],
                                    ];
                                @endphp
                                @foreach ($menus as [$name, $cat, $qty, $income, $margin])
                                    <tr class="hover:bg-gray-50 transition">
                                        <td class="py-3 font-semibold text-gray-900">{{ $name }}</td>
                                        <td class="py-3">
                                            <span class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{{ $cat }}</span>
                                        </td>
                                        <td class="py-3 text-gray-600">{{ $qty }}</td>
                                        <td class="py-3 font-semibold text-gray-900">{{ $income }}</td>
                                        <td class="py-3 text-right font-bold text-green-600">{{ $margin }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                {{-- BOTTOM: BAR + TARGET --}}
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {{-- BAR CHART --}}
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-bold text-gray-900">Performa Jam Sibuk</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Volume transaksi berdasarkan waktu operasional.</p>

                        <div class="flex items-end justify-between gap-2 mt-6 h-40">
                            @foreach ([45, 80, 120, 65, 95, 160, 110] as $bar)
                                <div class="flex-1 bg-green-500 hover:bg-green-600 rounded-t-md transition-all"
                                    style="height: {{ ($bar / 160) * 100 }}%"></div>
                            @endforeach
                        </div>
                        <div class="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
                            <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span>
                        </div>
                    </div>

                    {{-- TARGET --}}
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-bold text-gray-900">Target Penjualan Bulanan</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Progress pencapaian target bulan Oktober 2024.</p>

                        <div class="flex justify-center my-5">
                            <div class="relative w-40 h-40">
                                <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                    <circle cx="100" cy="100" r="80" stroke="#e5e7eb" stroke-width="14" fill="none" />
                                    <circle cx="100" cy="100" r="80" stroke="#22c55e" stroke-width="14" fill="none"
                                        stroke-linecap="round" stroke-dasharray="502" stroke-dashoffset="125" />
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <h2 class="text-3xl font-bold text-gray-900">75%</h2>
                                    <p class="text-[10px] font-bold text-gray-400 tracking-wider">TERCAPAI</p>
                                </div>
                            </div>
                        </div>

                        <div class="text-center">
                            <p class="text-sm font-bold text-gray-900">Rp 150.000.000 <span class="text-gray-400 font-normal">/ Rp 200.000.000</span></p>
                            <p class="text-xs text-gray-400 mt-1">Butuh Rp 50.000.000 lagi untuk mencapai target!</p>
                            <button class="w-full mt-4 py-2.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                Lihat Rincian Target
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {{-- ======================== SIDEBAR ======================== --}}
            <div class="xl:col-span-3 border-l border-gray-100 bg-white p-4 md:p-6 space-y-6">

                {{-- INSIGHT --}}
                <div class="bg-green-50 border border-green-100 rounded-2xl p-5">
                    <p class="text-xs text-gray-700 leading-relaxed">
                        "Pesanan Kopi Susu naik
                        <span class="text-green-600 font-bold">15%</span>
                        di hari Jumat malam. Pastikan stok biji kopi House Blend tersedia cukup untuk akhir pekan ini."
                    </p>
                    <button class="mt-3 text-xs font-semibold text-green-600 hover:text-green-700 transition">
                        Lihat Analisis Detail →
                    </button>
                </div>

                {{-- LAPORAN TERBARU --}}
                <div>
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Laporan Terbaru</h3>
                    <div class="space-y-3">
                        @foreach ([
                            ['Bulanan - September',    '01 OKT 2024'],
                            ['Stok Opname - Minggu 4', '29 SEP 2024'],
                            ['Efisiensi HPP Menu',     '25 SEP 2024'],
                        ] as [$title, $date])
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                    <iconify-icon icon="mdi:file-document-outline"></iconify-icon>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-800">{{ $title }}</p>
                                    <p class="text-[10px] text-gray-400 mt-0.5">{{ $date }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- AKSI CEPAT --}}
                <div>
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aksi Cepat</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button class="h-24 rounded-2xl border border-gray-100 hover:bg-gray-50 transition flex flex-col items-center justify-center gap-2">
                            <iconify-icon icon="mdi:share-variant-outline" class="text-2xl text-gray-500"></iconify-icon>
                            <span class="text-xs font-bold text-gray-600">BAGIKAN</span>
                        </button>
                        <button class="h-24 rounded-2xl border border-gray-100 hover:bg-gray-50 transition flex flex-col items-center justify-center gap-2">
                            <iconify-icon icon="mdi:printer-outline" class="text-2xl text-gray-500"></iconify-icon>
                            <span class="text-xs font-bold text-gray-600">CETAK</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>

        {{-- FOOTER --}}
        <div class="border-t border-gray-100 bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <p class="text-[10px] text-gray-400">© 2024 Smart Cafe POS v2.4.0</p>
            <div class="flex items-center gap-4 text-[10px] text-gray-400">
                <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span> System Online
                </span>
                <span>Support ID: #POS-8821</span>
            </div>
        </div>

    </div>
@endsection