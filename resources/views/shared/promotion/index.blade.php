@extends('layouts.app')

@section('content')
   
    <div class="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
    
        {{-- BREADCRUMB + ACTIONS --}}
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm">
                <a href="{{ route('menu.index') }}" class="flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold transition">
                    <iconify-icon icon="mdi:chevron-left" class="text-base"></iconify-icon>
                    Kembali ke Menu
                </a>
                <span class="text-gray-300">/</span>
                <span class="text-gray-500 font-medium">Es Kopi Susu Gula Aren</span>
            </div>
            <div class="flex items-center gap-3">
                <button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <iconify-icon icon="mdi:share-variant-outline" class="text-base"></iconify-icon>
                    Bagikan
                </button>
                <button class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition shadow-sm">
                    <iconify-icon icon="mdi:pencil-outline" class="text-base"></iconify-icon>
                    Edit Produk
                </button>
            </div>
        </div>
    
        {{-- PRODUCT HERO --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex flex-col lg:flex-row gap-8">
    
                {{-- Image --}}
                <div class="relative flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090b?w=400&q=80"
                        alt="Es Kopi Susu Gula Aren"
                        class="w-full lg:w-72 h-64 lg:h-80 object-cover rounded-2xl">
                    <span class="absolute top-3 left-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow">
                        Terlaris #1
                    </span>
                </div>
    
                {{-- Info --}}
                <div class="flex-1 space-y-5">
    
                    {{-- Category & SKU --}}
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Kopi & Susu</span>
                        <span class="flex items-center gap-1.5 text-xs text-gray-400">
                            <iconify-icon icon="mdi:barcode-scan" class="text-sm"></iconify-icon>
                            SKU: Kopi-001
                        </span>
                    </div>
    
                    {{-- Title & Desc --}}
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Es Kopi Susu Gula Aren</h1>
                        <p class="text-gray-400 mt-2 leading-relaxed">
                            Perpaduan sempurna antara espresso house blend, susu segar berkualitas, dan gula
                            aren asli yang memberikan cita rasa manis gurih yang otentik.
                        </p>
                    </div>
    
                    {{-- Stat Cards --}}
                    <div class="grid grid-cols-2 gap-4">
    
                        {{-- Harga Jual --}}
                        <div class="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-start">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">Harga Jual</p>
                                <p class="text-2xl font-bold text-gray-900">Rp 25.000</p>
                                <p class="text-[10px] text-gray-400 mt-1">Harga standar outlet</p>
                            </div>
                            <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                <iconify-icon icon="mdi:currency-usd" class="text-lg"></iconify-icon>
                            </div>
                        </div>
    
                        {{-- HPP --}}
                        <div class="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-start">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">HPP (COGS)</p>
                                <p class="text-2xl font-bold text-gray-900">Rp 8.500</p>
                                <p class="text-[10px] text-gray-400 mt-1">Biaya bahan baku per porsi</p>
                            </div>
                            <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                <iconify-icon icon="mdi:cart-outline" class="text-lg"></iconify-icon>
                            </div>
                        </div>
    
                        {{-- Laba Bersih --}}
                        <div class="bg-green-50 border border-green-100 rounded-2xl p-4 flex justify-between items-start">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">Laba Bersih</p>
                                <p class="text-2xl font-bold text-green-600">+Rp 16.500</p>
                                <p class="text-[10px] text-green-500 font-semibold mt-1">12.4% vs bulan lalu</p>
                            </div>
                            <div class="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                <iconify-icon icon="mdi:trending-up" class="text-lg"></iconify-icon>
                            </div>
                        </div>
    
                        {{-- Margin --}}
                        <div class="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-start">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">Margin Profit</p>
                                <p class="text-2xl font-bold text-gray-900">66%</p>
                                <p class="text-[10px] text-gray-400 mt-1">Efisiensi biaya sangat baik</p>
                            </div>
                            <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                <iconify-icon icon="mdi:chart-donut" class="text-lg"></iconify-icon>
                            </div>
                        </div>
    
                    </div>
                </div>
            </div>
        </div>
    
        {{-- TABS --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
            <div class="flex items-center gap-6 overflow-x-auto">
                @foreach (['Ringkasan Performa', 'Bahan Baku', 'Ulasan Pelanggan', 'Riwayat Perubahan'] as $tab)
                    <button @class([
                        'py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition',
                        'border-green-600 text-green-600' => $tab === 'Ringkasan Performa',
                        'border-transparent text-gray-400 hover:text-gray-600' => $tab !== 'Ringkasan Performa',
                    ])>{{ $tab }}</button>
                @endforeach
            </div>
        </div>
    
        {{-- TAB CONTENT --}}
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
    
            {{-- LEFT: Chart --}}
            <div class="xl:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="font-bold text-gray-900">Tren Penjualan Mingguan</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Volume penjualan per hari (7 hari terakhir)</p>
                    </div>
                    <button class="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                        Detail Laporan
                    </button>
                </div>
    
                {{-- Chart --}}
                <div class="relative h-56">
                    {{-- Y-axis labels --}}
                    <div class="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-gray-300 pr-2 pointer-events-none">
                        <span>100</span>
                        <span>75</span>
                        <span>50</span>
                        <span>25</span>
                        <span>0</span>
                    </div>
    
                    {{-- Grid lines --}}
                    <div class="absolute inset-y-0 left-6 right-0 flex flex-col justify-between pointer-events-none">
                        @foreach ([0,1,2,3,4] as $line)
                            <div class="border-t border-dashed border-gray-100 w-full"></div>
                        @endforeach
                    </div>
    
                    {{-- SVG Line Chart --}}
                    <svg class="absolute inset-y-0 left-6 right-0 w-[calc(100%-1.5rem)] h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stop-color="#22c55e" stop-opacity="0.2"/>
                                <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                        <path d="M0 140 C60 150, 80 145, 120 130 S200 120, 240 110 S320 105, 360 80 S440 30, 500 20 L560 30"
                            fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M0 140 C60 150, 80 145, 120 130 S200 120, 240 110 S320 105, 360 80 S440 30, 500 20 L560 30 L560 200 L0 200 Z"
                            fill="url(#salesGradient)"/>
                    </svg>
                </div>
    
                {{-- X-axis --}}
                <div class="flex justify-between mt-2 pl-6 text-[10px] text-gray-400 font-medium">
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                </div>
    
                {{-- Legend --}}
                <div class="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <div class="flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        Unit Terjual
                    </div>
                    <div class="flex items-center gap-1.5 text-green-600 font-semibold">
                        <iconify-icon icon="mdi:trending-up" class="text-sm"></iconify-icon>
                        +15.3% Pertumbuhan Mingguan
                    </div>
                </div>
            </div>
    
            {{-- RIGHT: Sidebar --}}
            <div class="xl:col-span-4 space-y-5">
    
                {{-- Status Bahan Baku --}}
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <iconify-icon icon="mdi:package-variant-closed" class="text-green-500"></iconify-icon>
                        Status Bahan Baku
                    </h3>
    
                    <div class="space-y-3">
                        @php
                            $bahanBaku = [
                                ['nama' => 'Biji Kopi Arabica', 'stok' => '1.2 kg', 'status' => 'Aman',    'color' => 'green'],
                                ['nama' => 'Gula Aren Cair',    'stok' => '0.5 L',  'status' => 'Menipis', 'color' => 'red'],
                                ['nama' => 'Susu UHT',          'stok' => '12 L',   'status' => 'Aman',    'color' => 'green'],
                            ];
                        @endphp
    
                        @foreach ($bahanBaku as $bahan)
                            <div class="flex items-center justify-between py-3 {{ !$loop->last ? 'border-b border-gray-50' : '' }}">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <iconify-icon icon="mdi:package-variant-closed" class="text-sm"></iconify-icon>
                                    </div>
                                    <p class="text-sm font-medium text-gray-800">{{ $bahan['nama'] }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-bold text-gray-900">{{ $bahan['stok'] }}</p>
                                    <span @class([
                                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                                        'bg-green-100 text-green-600' => $bahan['color'] === 'green',
                                        'bg-red-100 text-red-600'     => $bahan['color'] === 'red',
                                    ])>{{ $bahan['status'] }}</span>
                                </div>
                            </div>
                        @endforeach
                    </div>
    
                    <button class="w-full mt-3 py-2.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition">
                        Buat Pesanan Pembelian
                    </button>
                </div>
    
                {{-- Promo Aktif --}}
                <div class="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-green-500 flex-shrink-0 shadow-sm">
                            <iconify-icon icon="mdi:coffee-outline" class="text-lg"></iconify-icon>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-gray-800">Promo Aktif</p>
                            <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">Weekend Bundle: 10% OFF dengan Croissant.</p>
                            <button class="mt-2 text-xs font-semibold text-green-600 hover:text-green-700 transition">
                                Lihat Pengaturan Promo →
                            </button>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    
    </div>
@endsection