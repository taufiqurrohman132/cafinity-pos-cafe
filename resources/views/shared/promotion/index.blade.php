@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#F6F8F4] p-4 md:p-8">

        <div class="max-w-7xl mx-auto space-y-8">

            {{-- Header --}}
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Promosi & Bundling
                    </h1>

                    <p class="text-sm text-gray-500 mt-1">
                        Kelola kampanye pemasaran dan tingkatkan penjualan dengan penawaran menarik.
                    </p>
                </div>

                <button
                    class="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition shadow-sm">

                    <iconify-icon icon="solar:add-circle-bold" class="text-xl"></iconify-icon>

                    Buat Promo Baru
                </button>

            </div>

            {{-- Stats --}}
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                @php
                    $stats = [
                        [
                            'label' => 'Total Redemptions',
                            'value' => '981',
                            'trend' => '+12% bulan ini',
                            'icon' => 'solar:users-group-rounded-linear',
                        ],
                        [
                            'label' => 'Estimasi Revenue',
                            'value' => 'Rp 22.75M',
                            'trend' => '+8.4% vs Mar',
                            'icon' => 'solar:chart-2-linear',
                        ],
                        [
                            'label' => 'Kampanye Aktif',
                            'value' => '4',
                            'trend' => '2 akan berakhir',
                            'icon' => 'solar:tag-linear',
                        ],
                        [
                            'label' => 'Efisiensi Promo',
                            'value' => '18.5%',
                            'trend' => '+1.2% peningkatan',
                            'icon' => 'solar:calculator-minimalistic-linear',
                        ],
                    ];
                @endphp

                @foreach ($stats as $s)
                    <div class="bg-white p-6 rounded-3xl border border-[#ECEEE7] shadow-sm">

                        <div class="flex items-start justify-between mb-5">

                            <div class="space-y-2">
                                <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    {{ $s['label'] }}
                                </p>

                                <h3 class="text-2xl font-bold tracking-tight text-gray-900">
                                    {{ $s['value'] }}
                                </h3>
                            </div>

                            <div
                                class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                <iconify-icon icon="{{ $s['icon'] }}" class="text-[28px]"></iconify-icon>
                            </div>

                        </div>

                        <div class="flex items-center gap-2 text-[11px] font-semibold text-emerald-600">
                            <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon>
                            {{ $s['trend'] }}
                        </div>

                    </div>
                @endforeach

            </div>

            {{-- Highlight Promo --}}
            <div class="space-y-4">

                <div class="flex items-center gap-2 text-emerald-600">
                    <iconify-icon icon="solar:graph-up-bold" class="text-lg"></iconify-icon>
                    <h2 class="font-bold">Sorotan Minggu Ini</h2>
                </div>

                <div
                    class="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-[36px] p-8 relative overflow-hidden">

                    {{-- Decorative --}}
                    <div class="absolute -top-20 -right-20 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-40"></div>

                    <div class="relative z-10 max-w-3xl">

                        <div class="flex items-center justify-between flex-wrap gap-4 mb-8">

                            <div
                                class="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">
                                <iconify-icon icon="solar:box-minimalistic-bold"></iconify-icon>
                                Bundel Spesial
                            </div>

                            <span class="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                                Kampanye Utama
                            </span>

                        </div>

                        <h2 class="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                            Weekend Bundle
                        </h2>

                        <p class="text-gray-500 mt-4 leading-relaxed max-w-2xl">
                            Dapatkan diskon 10% untuk setiap pembelian kombinasi 1 Croissant dan 1 Kopi varian apapun di
                            akhir pekan.
                        </p>

                        {{-- Stats --}}
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">

                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Diskon
                                </p>

                                <p class="text-xl font-bold text-emerald-500 mt-2">
                                    Diskon 10%
                                </p>
                            </div>

                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Total Pendapatan
                                </p>

                                <p class="text-xl font-bold text-gray-800 mt-2">
                                    Rp 4.260.000
                                </p>
                            </div>

                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Penebusan
                                </p>

                                <p class="text-xl font-bold text-gray-800 mt-2">
                                    142 <span class="text-sm text-gray-400 font-medium">Kali</span>
                                </p>
                            </div>

                        </div>

                        <div class="flex flex-wrap gap-3">

                            <button
                                class="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition">
                                Kelola Bundel
                            </button>

                            <button
                                class="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-50 transition">
                                Lihat Analitik
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            @php
                $campaigns = [
                    [
                        'name' => 'Weekend Bundle',
                        'sub' => 'Croissant + Kopi',
                        'disc' => '10%',
                        'date' => '01 Mei 2024 - 31 Mei 2024',
                        'red' => 142,
                        'rev' => 'Rp 4.260.000',
                        'status' => 'Aktif',
                        'color' => 'emerald',
                        'progress' => 'w-3/5',
                    ],
                    [
                        'name' => 'Happy Hour Sore',
                        'sub' => 'Semua Non-Coffee',
                        'disc' => 'Rp 5.000',
                        'date' => '05 Mei 2024 - 12 Mei 2024',
                        'red' => 89,
                        'rev' => 'Rp 2.150.000',
                        'status' => 'Aktif',
                        'color' => 'emerald',
                        'progress' => 'w-2/5',
                    ],
                    [
                        'name' => 'Promo Pelajar',
                        'sub' => 'Menu Snack',
                        'disc' => '15%',
                        'date' => '10 Mei 2024 - 20 Mei 2024',
                        'red' => 210,
                        'rev' => 'Rp 3.840.000',
                        'status' => 'Terjadwal',
                        'color' => 'gray',
                        'progress' => 'w-4/5',
                    ],
                    [
                        'name' => 'Ramadhan Kareem',
                        'sub' => 'Minimal Rp 50k',
                        'disc' => 'Free Kurma',
                        'date' => '01 Apr 2024 - 30 Apr 2024',
                        'red' => 540,
                        'rev' => 'Rp 12.500.000',
                        'status' => 'Selesai',
                        'color' => 'rose',
                        'progress' => 'w-full',
                    ],
                    [
                        'name' => 'Flash Sale Espresso',
                        'sub' => 'Espresso Single',
                        'disc' => '20%',
                        'date' => '15 Mei 2024 - 15 Mei 2024',
                        'red' => 0,
                        'rev' => 'Rp 0',
                        'status' => 'Terjadwal',
                        'color' => 'gray',
                        'progress' => 'w-0',
                    ],
                ];
            @endphp

            {{-- Campaign Table --}}
            <div class="bg-white rounded-[32px] border border-[#ECEEE7] shadow-sm overflow-hidden">

                <div
                    class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F1F3EE]">

                    <div>
                        <h3 class="text-lg font-bold text-gray-800">
                            Daftar Kampanye
                        </h3>

                        <p class="text-xs text-gray-400 mt-1">
                            Semua promosi yang terdaftar dalam sistem.
                        </p>
                    </div>

                    {{-- Filter --}}
                    <div class="flex p-1 bg-[#F7F8F5] rounded-2xl border border-[#ECEEE7]">

                        <button class="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold text-gray-800">
                            Semua
                        </button>

                        <button class="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-700">
                            Aktif
                        </button>

                        <button class="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-700">
                            Terjadwal
                        </button>

                    </div>

                </div>

                {{-- Table --}}
                <div class="overflow-x-auto">

                    <table class="w-full text-left border-collapse">

                        <thead
                            class="bg-[#FAFBF8] text-[10px] uppercase tracking-widest text-gray-400 border-b border-[#F1F3EE]">

                            <tr>
                                <th class="px-6 py-4">Nama Promo</th>
                                <th class="px-6 py-4">Potongan</th>
                                <th class="px-6 py-4">Periode</th>
                                <th class="px-6 py-4">Penebusan</th>
                                <th class="px-6 py-4">Revenue</th>
                                <th class="px-6 py-4">Status</th>
                                <th class="px-6 py-4 text-center">Aksi</th>
                            </tr>

                        </thead>

                        <tbody class="divide-y divide-[#F1F3EE] text-sm">

                            @foreach ($campaigns as $c)
                                @php
                                    $statusClass = match ($c['color']) {
                                        'emerald' => 'bg-emerald-100 text-emerald-600',
                                        'rose' => 'bg-rose-100 text-rose-600',
                                        default => 'bg-gray-100 text-gray-600',
                                    };
                                @endphp

                                <tr class="hover:bg-[#FAFBF8] transition">

                                    <td class="px-6 py-5">
                                        <p class="font-bold text-gray-800">
                                            {{ $c['name'] }}
                                        </p>

                                        <p class="text-[11px] text-gray-400 mt-1">
                                            {{ $c['sub'] }}
                                        </p>
                                    </td>

                                    <td class="px-6 py-5 font-bold text-emerald-500">
                                        {{ $c['disc'] }}
                                    </td>

                                    <td class="px-6 py-5 text-xs text-gray-500">
                                        {{ $c['date'] }}
                                    </td>

                                    <td class="px-6 py-5">
                                        <div class="flex items-center gap-3">

                                            <span class="font-bold text-gray-700 w-8">
                                                {{ $c['red'] }}
                                            </span>

                                            <div
                                                class="hidden sm:block w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div class="{{ $c['progress'] }} h-full bg-emerald-400"></div>
                                            </div>

                                        </div>
                                    </td>

                                    <td class="px-6 py-5 font-bold text-gray-800">
                                        {{ $c['rev'] }}
                                    </td>

                                    <td class="px-6 py-5">

                                        <span class="px-3 py-1 rounded-full text-[10px] font-bold {{ $statusClass }}">
                                            {{ $c['status'] }}
                                        </span>

                                    </td>

                                    <td class="px-6 py-5 text-center">

                                        <button class="text-gray-400 hover:text-gray-700">
                                            <iconify-icon icon="solar:menu-dots-bold" class="text-xl"></iconify-icon>
                                        </button>

                                    </td>

                                </tr>
                            @endforeach

                        </tbody>

                    </table>

                </div>

            </div>

            {{-- Insight Card --}}
            <div
                class="bg-gradient-to-br from-emerald-50 to-white rounded-[32px] border border-emerald-100 p-8 overflow-hidden relative">

                <div class="absolute right-0 top-0 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-40"></div>

                <div class="relative z-10">

                    <p class="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3">
                        Promo Insight
                    </p>

                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                        Promo bundling meningkatkan penjualan hingga 24%
                    </h3>

                    <p class="text-gray-500 mt-3 max-w-xl">
                        Berdasarkan performa promosi selama 30 hari terakhir.
                    </p>

                </div>

            </div>

        </div>
    </div>
@endsection
