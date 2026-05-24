@extends('layouts.app')

@section('content')
    <div class="min-h-screen font-inter bg-[#fbfbfe] text-[#050316]">
        <div class="grid grid-cols-1 xl:grid-cols-12">

            {{-- ======================== MAIN CONTENT ======================== --}}
            <div class="xl:col-span-9 p-4 md:p-6 space-y-6">

                {{-- HEADER --}}
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1
                            class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Laporan Bisnis
                        </h1>
                        <p class="text-xs md:text-sm text-[#2f27ce]/70 font-medium mt-1">
                            Pantau performa dan pertumbuhan cafe Anda secara real-time.
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <button
                            class="flex items-center gap-2 px-4 py-2.5 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                            <iconify-icon icon="solar:calendar-linear" class="text-lg"></iconify-icon>
                            7 Hari Terakhir
                        </button>
                        <button
                            class="px-4 py-2.5 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                            Filter
                        </button>
                        <button
                            class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98] duration-150">
                            <iconify-icon icon="solar:download-square-linear" class="text-lg"></iconify-icon>
                            Ekspor Laporan
                        </button>
                    </div>
                </div>

                {{-- STAT CARDS --}}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    @php
                        $stats = [
                            [
                                'icon' => 'solar:wad-of-money-linear',
                                'label' => 'Total Pendapatan',
                                'value' => 'Rp 40.500.000',
                                'trend' => '+12.5%',
                                'up' => true,
                            ],
                            [
                                'icon' => 'solar:chart-square-linear',
                                'label' => 'Estimasi Laba Bersih',
                                'value' => 'Rp 12.450.000',
                                'trend' => '+8.2%',
                                'up' => true,
                            ],
                            [
                                'icon' => 'solar:cart-large-2-linear',
                                'label' => 'Total Pesanan',
                                'value' => '1.248',
                                'trend' => '-2.4%',
                                'up' => false,
                            ],
                            [
                                'icon' => 'solar:clock-circle-linear',
                                'label' => 'Rata-rata Transaksi',
                                'value' => 'Rp 32.450',
                                'trend' => '+5.1%',
                                'up' => true,
                            ],
                        ];
                    @endphp

                    @foreach ($stats as $stat)
                        <div
                            class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 hover:shadow-md transition-shadow duration-150 cursor-default">
                            <div class="flex items-center justify-between mb-4">
                                <div
                                    class="w-11 h-11 rounded-xl bg-[#dddbff]/50 text-[#2f27ce] flex items-center justify-center text-xl">
                                    <iconify-icon icon="{{ $stat['icon'] }}"></iconify-icon>
                                </div>
                                <span
                                    class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                                    {{ $stat['up'] ? 'bg-[#ecfdf5] text-[#10b981]' : 'bg-[#fef2f2] text-[#ef4444]' }}">
                                    <iconify-icon
                                        icon="{{ $stat['up'] ? 'solar:chart-line-up-linear' : 'solar:chart-line-down-linear' }}"></iconify-icon>
                                    {{ $stat['trend'] }}
                                </span>
                            </div>
                            <p class="text-xs md:text-sm text-[#2f27ce]/70 font-medium">{{ $stat['label'] }}</p>
                            <h2 class="text-xl font-extrabold text-[#000000] mt-1">{{ $stat['value'] }}</h2>
                        </div>
                    @endforeach

                </div>

                {{-- CHART + DONUT --}}
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {{-- LINE CHART --}}
                    <div class="xl:col-span-8 bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-extrabold text-[#050316]">Tren Pendapatan & Laba</h3>
                                <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5">Visualisasi harian dalam 7 hari
                                    terakhir.</p>
                            </div>
                            <span
                                class="flex items-center gap-1.5 text-xs font-bold text-[#10b981] bg-[#ecfdf5] px-3 py-1 rounded-full">
                                <span class="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span> LIVE
                            </span>
                        </div>

                        <div class="h-56 relative">
                            <div
                                class="absolute inset-0 flex flex-col justify-between text-[10px] font-medium text-[#2f27ce]/40 pointer-events-none">
                                <div class="border-b border-dashed border-[#dddbff] pb-1">Rp 10M</div>
                                <div class="border-b border-dashed border-[#dddbff] pb-1">Rp 7.5M</div>
                                <div class="border-b border-dashed border-[#dddbff] pb-1">Rp 5M</div>
                                <div class="border-b border-dashed border-[#dddbff] pb-1">Rp 2.5M</div>
                                <div>Rp 0M</div>
                            </div>
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="accentGradient" x1="0" x2="0" y1="0"
                                        y2="1">
                                        <stop offset="0%" stop-color="#443dff" />
                                        <stop offset="100%" stop-color="#443dff" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                                <!-- Revenue Line -->
                                <path d="M20 160 C80 170,100 175,150 130 S250 145,300 105 S400 30,500 45" fill="none"
                                    stroke="#443dff" stroke-width="3" stroke-linecap="round" />
                                <path d="M20 160 C80 170,100 175,150 130 S250 145,300 105 S400 30,500 45 L500 220 L20 220 Z"
                                    fill="url(#accentGradient)" opacity="0.12" />
                                <!-- Profit Line -->
                                <path d="M20 195 C80 198,100 200,150 178 S250 185,300 160 S400 130,500 138" fill="none"
                                    stroke="#2f27ce" stroke-width="3" stroke-linecap="round" stroke-dasharray="6,4" />
                            </svg>
                        </div>

                        <div class="flex items-center justify-center gap-6 mt-4 text-xs font-bold text-[#050316]">
                            <div class="flex items-center gap-1.5">
                                <div class="w-3 h-3 rounded-md bg-[#443dff]"></div> Pendapatan
                            </div>
                            <div class="flex items-center gap-1.5">
                                <div class="w-3 h-3 rounded-md bg-[#2f27ce]"></div> Laba Bersih
                            </div>
                        </div>
                    </div>

                    {{-- DONUT --}}
                    <div class="xl:col-span-4 bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <h3 class="font-extrabold text-[#050316]">Komposisi Penjualan</h3>
                        <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5">Berdasarkan kategori produk utama.</p>

                        <div class="flex justify-center my-6 relative">
                            <!-- Custom Donut using theme colors -->
                            <div class="w-40 h-40 rounded-full border-[14px] border-[#443dff] relative rotate-[20deg]">
                                <div
                                    class="absolute inset-0 rounded-full border-[14px] border-transparent border-r-[#2f27ce]">
                                </div>
                                <div
                                    class="absolute inset-0 rounded-full border-[14px] border-transparent border-b-[#10b981]">
                                </div>
                                <div
                                    class="absolute inset-0 rounded-full border-[14px] border-transparent border-l-[#f59e0b]">
                                </div>
                                <div
                                    class="absolute inset-5 bg-white rounded-full flex items-center justify-center shadow-inner">
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            @foreach ([['bg-[#443dff]', 'Coffee', '45%'], ['bg-[#2f27ce]', 'Non-Coffee', '25%'], ['bg-[#10b981]', 'Main Course', '20%'], ['bg-[#f59e0b]', 'Snacks', '10%']] as [$color, $label, $pct])
                                <div
                                    class="flex items-center justify-between p-2 hover:bg-[#fbfbfe] rounded-lg transition-colors duration-150">
                                    <div class="flex items-center gap-2 text-xs font-semibold text-[#050316]">
                                        <div class="w-2.5 h-2.5 rounded-sm {{ $color }}"></div>
                                        {{ $label }}
                                    </div>
                                    <span class="text-[13px] font-black text-[#443dff]">{{ $pct }}</span>
                                </div>
                            @endforeach
                        </div>
                    </div>

                </div>

                {{-- PRODUK TERLARIS --}}
                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h3 class="font-extrabold text-[#050316]">Produk Terlaris</h3>
                            <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5">Item dengan volume penjualan dan
                                profitabilitas tertinggi.</p>
                        </div>
                        <button
                            class="flex items-center gap-1 text-sm font-bold text-[#443dff] hover:text-[#2f27ce] transition-colors duration-150 active:scale-[0.98]">
                            Lihat Semua Menu <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[600px]">
                            <thead>
                                <tr class="text-xs font-bold text-[#2f27ce]/70 border-b border-[#dddbff]">
                                    <th class="pb-3">Nama Menu</th>
                                    <th class="pb-3">Kategori</th>
                                    <th class="pb-3">Qty Terjual</th>
                                    <th class="pb-3">Total Pendapatan</th>
                                    <th class="pb-3 text-right">Estimasi Margin</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-[#dddbff]/50">
                                @php
                                    $menus = [
                                        ['Es Kopi Susu Gula Aren', 'Coffee', '145', 'Rp 3.625.000', '65%'],
                                        ['Caffe Latte Hot', 'Coffee', '98', 'Rp 2.744.000', '60%'],
                                        ['Nasi Goreng Spesial', 'Main Course', '76', 'Rp 2.660.000', '45%'],
                                        ['Croissant Butter', 'Snacks', '62', 'Rp 1.550.000', '55%'],
                                        ['Matcha Latte Ice', 'Non-Coffee', '58', 'Rp 1.450.000', '58%'],
                                    ];
                                @endphp
                                @foreach ($menus as [$name, $cat, $qty, $income, $margin])
                                    <tr class="hover:bg-[#dddbff]/30 transition-colors duration-150">
                                        <td class="py-3 font-bold text-[#050316]">{{ $name }}</td>
                                        <td class="py-3">
                                            <span
                                                class="px-2.5 py-1 rounded-md bg-[#dddbff]/50 text-[#2f27ce] text-xs font-bold">{{ $cat }}</span>
                                        </td>
                                        <td class="py-3 text-[#050316] font-medium">{{ $qty }}</td>
                                        <td class="py-3 font-black text-[#443dff] text-[14px]">{{ $income }}</td>
                                        <td class="py-3 text-right font-black text-[#10b981]">{{ $margin }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                {{-- BOTTOM: BAR + TARGET --}}
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {{-- BAR CHART --}}
                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <h3 class="font-extrabold text-[#050316]">Performa Jam Sibuk</h3>
                        <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5">Volume transaksi berdasarkan waktu
                            operasional.</p>

                        <div class="flex items-end justify-between gap-3 mt-6 h-40">
                            @foreach ([45, 80, 120, 65, 95, 160, 110] as $bar)
                                <button
                                    class="flex-1 bg-[#dddbff] hover:bg-[#443dff] rounded-t-lg transition-colors duration-150 relative group"
                                    style="height: {{ ($bar / 160) * 100 }}%">
                                    <div
                                        class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#050316] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity duration-150">
                                        {{ $bar }}
                                    </div>
                                </button>
                            @endforeach
                        </div>
                        <div class="flex justify-between mt-3 text-[11px] text-[#2f27ce]/70 font-bold">
                            <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span>
                        </div>
                    </div>

                    {{-- TARGET --}}
                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <h3 class="font-extrabold text-[#050316]">Target Penjualan Bulanan</h3>
                        <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5">Progress pencapaian target bulan Oktober
                            2024.</p>

                        <div class="flex justify-center my-5">
                            <div class="relative w-40 h-40">
                                <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                    <circle cx="100" cy="100" r="80" stroke="#fbfbfe" stroke-width="16"
                                        fill="none" class="drop-shadow-sm" />
                                    <circle cx="100" cy="100" r="80" stroke="#443dff" stroke-width="16"
                                        fill="none" stroke-linecap="round" stroke-dasharray="502"
                                        stroke-dashoffset="125" />
                                </svg>
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <h2 class="text-3xl font-black text-[#443dff]">75%</h2>
                                    <p class="text-[10px] font-bold text-[#2f27ce]/70 tracking-wider">TERCAPAI</p>
                                </div>
                            </div>
                        </div>

                        <div class="text-center">
                            <p class="text-[14px] font-black text-[#443dff]">Rp 150.000.000 <span
                                    class="text-[#2f27ce]/50 font-medium">/ Rp 200.000.000</span></p>
                            <p class="text-xs text-[#2f27ce]/70 font-medium mt-1">Butuh Rp 50.000.000 lagi untuk mencapai
                                target!</p>
                            <button
                                class="w-full mt-4 py-2.5 text-sm font-bold text-[#2f27ce] border border-[#dddbff] rounded-xl bg-white hover:bg-[#dddbff] hover:text-[#050316] transition-all active:scale-[0.98] duration-150">
                                Lihat Rincian Target
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {{-- ======================== SIDEBAR ======================== --}}
            <div class="xl:col-span-3 border-l border-[#dddbff] bg-white p-4 md:p-6 space-y-6">

                {{-- INSIGHT --}}
                <div class="bg-[#dddbff]/30 border border-[#dddbff] rounded-2xl p-5">
                    <p class="text-sm text-[#050316] font-medium leading-relaxed">
                        "Pesanan Kopi Susu naik
                        <span class="text-[#443dff] font-black">15%</span>
                        di hari Jumat malam. Pastikan stok biji kopi House Blend tersedia cukup untuk akhir pekan ini."
                    </p>
                    <button
                        class="mt-4 flex items-center gap-1 text-sm font-bold text-[#443dff] hover:text-[#2f27ce] transition-colors duration-150 active:scale-[0.98]">
                        Lihat Analisis Detail <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
                    </button>
                </div>

                {{-- LAPORAN TERBARU --}}
                <div>
                    <h3 class="text-[11px] font-bold text-[#2f27ce]/70 uppercase tracking-widest mb-4">Laporan Terbaru</h3>
                    <div class="space-y-3">
                        @foreach ([['Bulanan - September', '01 OKT 2024'], ['Stok Opname - Minggu 4', '29 SEP 2024'], ['Efisiensi HPP Menu', '25 SEP 2024']] as [$title, $date])
                            <button
                                class="w-full flex items-center gap-3 p-2 -mx-2 rounded-xl border border-[#dddbff] text-left hover:bg-[#dddbff]/30 hover:border-[#443dff] hover:shadow-sm transition-all duration-150 active:scale-[0.98] group relative">
                                <div
                                    class="w-10 h-10 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] group-hover:bg-[#443dff] group-hover:text-white transition-colors duration-150 flex-shrink-0">
                                    <iconify-icon icon="solar:document-text-linear" class="text-xl"></iconify-icon>
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-[#050316]">{{ $title }}</p>
                                    <p class="text-[11px] text-[#2f27ce]/70 font-medium mt-0.5">{{ $date }}</p>
                                </div>
                            </button>
                        @endforeach
                    </div>
                </div>

                {{-- AKSI CEPAT --}}
                <div>
                    <h3 class="text-[11px] font-bold text-[#2f27ce]/70 uppercase tracking-widest mb-4">Aksi Cepat</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button
                            class="h-24 rounded-2xl border border-[#dddbff] bg-white hover:bg-[#dddbff]/50 hover:border-[#443dff] transition-all flex flex-col items-center justify-center gap-2 active:scale-[0.98] duration-150 group">
                            <iconify-icon icon="solar:share-linear"
                                class="text-2xl text-[#2f27ce] group-hover:text-[#443dff]"></iconify-icon>
                            <span class="text-xs font-bold text-[#050316]">BAGIKAN</span>
                        </button>
                        <button
                            class="h-24 rounded-2xl border border-[#dddbff] bg-white hover:bg-[#dddbff]/50 hover:border-[#443dff] transition-all flex flex-col items-center justify-center gap-2 active:scale-[0.98] duration-150 group">
                            <iconify-icon icon="solar:printer-linear"
                                class="text-2xl text-[#2f27ce] group-hover:text-[#443dff]"></iconify-icon>
                            <span class="text-xs font-bold text-[#050316]">CETAK</span>
                        </button>
                    </div>
                </div>

            </div>

        </div>

        {{-- FOOTER --}}
        <div
            class="border-t border-[#dddbff] bg-[#fbfbfe] px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <p class="text-[11px] font-medium text-[#2f27ce]/70">© 2024 Smart Cafe POS v2.4.0</p>
            <div class="flex items-center gap-4 text-[11px] font-bold text-[#2f27ce]/70">
                <span class="flex items-center gap-1.5 px-2.5 py-1 bg-[#ecfdf5] text-[#10b981] rounded-full">
                    <span class="w-2 h-2 rounded-full bg-[#10b981]"></span> System Online
                </span>
                <span>Support ID: <span class="text-[#443dff]">#POS-8821</span></span>
            </div>
        </div>

    </div>
@endsection
