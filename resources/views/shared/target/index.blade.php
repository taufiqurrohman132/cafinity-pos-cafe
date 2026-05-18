@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">

    {{-- HEADER --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Target & Performa</h1>
            <p class="text-gray-500 mt-1">Pantau pencapaian KPI harian dan riwayat pertumbuhan outlet Anda.</p>
        </div>
        <div class="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            <button class="px-5 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg transition">Harian</button>
            <button class="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-lg transition">Bulanan</button>
        </div>
    </div>

    {{-- TARGET BANNER --}}
    <div class="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
        <div class="flex flex-col lg:flex-row lg:items-center gap-6">

            {{-- Left: Target Info --}}
            <div class="lg:w-64 flex-shrink-0">
                <p class="text-xs font-bold text-green-600 flex items-center gap-2 mb-2">
                    <iconify-icon icon="mdi:target" class="text-sm"></iconify-icon>
                    Target Hari Ini
                </p>
                <h2 class="text-3xl font-bold text-gray-900">Rp 14.000.000</h2>
                <p class="text-xs text-gray-400 mt-1">Status pembaruan terakhir: 10 menit yang lalu</p>
                <div class="flex items-center gap-3 mt-4">
                    <button class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition">
                        <iconify-icon icon="mdi:pencil-outline" class="text-sm"></iconify-icon>
                        Ubah Target
                    </button>
                    <button class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                        Lihat Detail AOV
                    </button>
                </div>
            </div>

            {{-- Right: Progress --}}
            <div class="flex-1 space-y-3">
                <div class="flex items-end justify-between">
                    <div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tercapai</p>
                        <p class="text-2xl font-bold text-green-600 mt-0.5">Rp 1.550.000</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</p>
                        <p class="text-2xl font-bold text-gray-900 mt-0.5">11%</p>
                    </div>
                </div>

                {{-- Progress Bar --}}
                <div class="w-full bg-green-100 h-3 rounded-full overflow-hidden">
                    <div class="bg-green-500 h-full rounded-full transition-all" style="width: 11%"></div>
                </div>

                <div class="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>Mulai: 08:00 WIB</span>
                    <span>Sisa Waktu Operasional: 14 Jam</span>
                    <span>Target: Rp 14.000.000</span>
                </div>
            </div>

        </div>
    </div>

    {{-- STAT CARDS --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        @php
            $stats = [
                [
                    'label'   => 'Sisa Target',
                    'value'   => 'Rp 12.450.000',
                    'sub'     => 'Perlu dicapai hari ini',
                    'trend'   => null,
                    'icon'    => 'mdi:wallet-outline',
                    'iconbg'  => 'bg-green-100',
                    'iconclr' => 'text-green-600',
                ],
                [
                    'label'   => 'Estimasi Penutupan',
                    'value'   => 'Rp 13.200.000',
                    'sub'     => 'Berdasarkan tren saat ini',
                    'trend'   => ['val' => '↘ 5.7%', 'color' => 'text-red-500'],
                    'icon'    => 'mdi:trending-up',
                    'iconbg'  => 'bg-green-100',
                    'iconclr' => 'text-green-600',
                ],
                [
                    'label'   => 'Rata-rata Harian',
                    'value'   => 'Rp 12.800.000',
                    'sub'     => 'Bulan Mei 2024',
                    'trend'   => ['val' => '↗ 12.3%', 'color' => 'text-green-500'],
                    'icon'    => 'mdi:chart-bar',
                    'iconbg'  => 'bg-blue-100',
                    'iconclr' => 'text-blue-500',
                ],
                [
                    'label'   => 'Update Terakhir',
                    'value'   => '10:45 WIB',
                    'sub'     => 'Sinkronisasi otomatis aktif',
                    'trend'   => null,
                    'icon'    => 'mdi:calendar-clock-outline',
                    'iconbg'  => 'bg-purple-100',
                    'iconclr' => 'text-purple-500',
                ],
            ];
        @endphp

        @foreach ($stats as $stat)
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div class="flex justify-between items-start mb-3">
                    <p class="text-xs text-gray-400">{{ $stat['label'] }}</p>
                    <div class="w-9 h-9 rounded-xl {{ $stat['iconbg'] }} {{ $stat['iconclr'] }} flex items-center justify-center text-lg flex-shrink-0">
                        <iconify-icon icon="{{ $stat['icon'] }}"></iconify-icon>
                    </div>
                </div>
                <p class="text-xl font-bold text-gray-900 leading-tight">{{ $stat['value'] }}</p>
                <div class="mt-1 flex items-center gap-1">
                    @if ($stat['trend'])
                        <span class="text-xs font-semibold {{ $stat['trend']['color'] }}">{{ $stat['trend']['val'] }}</span>
                        <span class="text-[10px] text-gray-400">{{ $stat['sub'] }}</span>
                    @else
                        <span class="text-[10px] text-gray-400">{{ $stat['sub'] }}</span>
                    @endif
                </div>
            </div>
        @endforeach

    </div>

    {{-- CHART + SIDEBAR --}}
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {{-- Chart --}}
        <div class="xl:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="font-bold text-gray-900">Riwayat Pencapaian (30 Hari Terakhir)</h3>
                    <p class="text-xs text-gray-400 mt-0.5">Perbandingan antara target harian vs realisasi penjualan</p>
                </div>
                <span class="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span> Penjualan Real
                </span>
            </div>

            {{-- Chart Area --}}
            <div class="relative h-64">
                {{-- Y labels --}}
                <div class="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none">
                    <span>Rp 16jt</span>
                    <span>Rp 12jt</span>
                    <span>Rp 8jt</span>
                    <span>Rp 4jt</span>
                    <span>Rp 0jt</span>
                </div>

                {{-- Grid --}}
                <div class="absolute inset-y-0 left-12 right-0 flex flex-col justify-between pointer-events-none">
                    @foreach (range(0,4) as $i)
                        <div class="border-t {{ $i === 1 ? 'border-dashed border-gray-300' : 'border-gray-100' }} w-full"></div>
                    @endforeach
                </div>

                {{-- SVG --}}
                <svg class="absolute inset-y-0 left-12 right-0 w-[calc(100%-3rem)] h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="targetGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.3"/>
                            <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                    {{-- Target dashed line --}}
                    <line x1="0" y1="75" x2="600" y2="75" stroke="#9ca3af" stroke-width="1.5" stroke-dasharray="6,4"/>
                    {{-- Sales line --}}
                    <path d="M0 160 C40 155,60 140,100 130 S160 110,200 105 S260 100,300 95 S340 90,380 115 S440 140,480 160 S540 200,600 230"
                        fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M0 160 C40 155,60 140,100 130 S160 110,200 105 S260 100,300 95 S340 90,380 115 S440 140,480 160 S540 200,600 230 L600 240 L0 240 Z"
                        fill="url(#targetGradient)"/>
                </svg>
            </div>

            {{-- X labels --}}
            <div class="flex justify-between mt-2 pl-12 text-[10px] text-gray-400 font-medium">
                <span>01 Mei</span><span>02 Mei</span><span>03 Mei</span><span>04 Mei</span><span>05 Mei</span><span>06 Mei</span><span>07 Mei</span><span>08 Mei</span>
            </div>

            {{-- Legend --}}
            <div class="flex items-center gap-5 mt-4 text-xs text-gray-500">
                <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span> Pencapaian Riil
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="w-6 border-t-2 border-dashed border-gray-400"></span> Target Penjualan
                </div>
            </div>
        </div>

        {{-- Right Sidebar --}}
        <div class="xl:col-span-4 space-y-5">

            {{-- Wawasan Performa --}}
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                <h3 class="font-bold text-gray-900 flex items-center gap-2">
                    <iconify-icon icon="mdi:trending-up" class="text-green-500"></iconify-icon>
                    Wawasan Performa
                </h3>

                {{-- Jam Sibuk --}}
                <div class="space-y-2">
                    <p class="text-sm font-bold text-gray-800">Jam Sibuk Diprediksi</p>
                    <p class="text-xs text-gray-500 leading-relaxed">
                        Pukul 12:00 - 14:00 biasanya menyumbang 35% dari total target harian Anda.
                    </p>
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Promo Aktif</span>
                        <span class="text-xs text-gray-400">"Weekend Bundle"</span>
                    </div>
                </div>

                <div class="border-t border-gray-100"></div>

                {{-- Pencapaian Staf --}}
                <div class="space-y-3">
                    <p class="text-sm font-bold text-gray-800">Pencapaian Staf</p>
                    @php
                        $staf = [
                            ['nama' => 'Rizky (Barista)', 'nilai' => 'Rp 450k', 'pct' => 90],
                            ['nama' => 'Siti (Server)',   'nilai' => 'Rp 320k', 'pct' => 65],
                            ['nama' => 'Andi (Barista)',  'nilai' => 'Rp 210k', 'pct' => 42],
                        ];
                    @endphp
                    @foreach ($staf as $s)
                        <div class="space-y-1.5">
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-600">{{ $s['nama'] }}</span>
                                <span class="text-xs font-bold text-gray-900">{{ $s['nilai'] }}</span>
                            </div>
                            <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div class="bg-green-500 h-full rounded-full" style="width: {{ $s['pct'] }}%"></div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <button class="w-full flex items-center justify-center gap-1 py-2.5 text-xs font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    Lihat Laporan Lengkap
                    <iconify-icon icon="mdi:chevron-right" class="text-sm"></iconify-icon>
                </button>
            </div>

            {{-- Metode Pembayaran --}}
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <iconify-icon icon="mdi:credit-card-outline" class="text-xl"></iconify-icon>
                </div>
                <div>
                    <p class="text-sm font-bold text-gray-800">Metode Pembayaran Terpopuler</p>
                    <p class="text-xs text-gray-400 mt-0.5">QRIS (45%), Cash (30%), EDC (25%)</p>
                </div>
            </div>

        </div>
    </div>

    {{-- FOOTER --}}
    <div class="border-t border-gray-100 bg-white rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p class="text-[10px] text-gray-400">© 2024 SmartCafe Dashboard</p>
        <div class="flex items-center gap-4 text-[10px] text-gray-400">
            <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-green-500"></span> System Online: v2.4.12
            </span>
            <a href="#" class="hover:text-gray-600 transition">Support</a>
            <a href="#" class="hover:text-gray-600 transition">Privacy Policy</a>
        </div>
    </div>

</div>
@endsection