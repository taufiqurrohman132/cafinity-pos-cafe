@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <div class="max-w-6xl mx-auto space-y-6">

        {{-- Header --}}
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Katalog Menu</h1>
                <p class="text-sm text-gray-400 mt-1">Kelola item menu, harga jual, dan pantau margin keuntungan Anda.</p>
            </div>
            <div class="flex items-center gap-4 sm:text-right">
                <div class="hidden sm:block">
                    <p class="text-xs text-gray-400 font-medium">Total Menu</p>
                    <p class="text-2xl font-bold text-emerald-500">42</p>
                </div>
                <button class="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition shadow-sm whitespace-nowrap">
                    <iconify-icon icon="solar:add-circle-linear" class="text-lg"></iconify-icon>
                    Tambah Menu
                </button>
            </div>
        </div>

        {{-- Toolbar: Search, Filter, View Toggle, & Tabs --}}
        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div class="flex items-center gap-3 flex-1">
                {{-- Search --}}
                <div class="relative flex-1 max-w-md">
                    <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]"></iconify-icon>
                    <input type="text" placeholder="Cari menu..."
                        class="w-full h-[42px] bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition">
                </div>
                {{-- Filter Button --}}
                <button class="flex items-center gap-2 h-[42px] px-4 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition">
                    <iconify-icon icon="solar:filter-linear" class="text-base"></iconify-icon>
                    Filter
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="text-xs text-gray-400></iconify-icon>
                </button>
            </div>

            <div class="flex items-center gap-4 self-end md:self-auto overflow-x-auto max-w-full no-scrollbar">
                {{-- View Grid/List Toggles --}}
                <div class="flex items-center bg-gray-50 border border-gray-200 p-1 rounded-xl shrink-0">
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600">
                        <iconify-icon icon="solar:widget-2-linear" class="text-lg"></iconify-icon>
                    </button>
                    <button class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm">
                        <iconify-icon icon="solar:list-linear" class="text-lg"></iconify-icon>
                    </button>
                </div>

                {{-- Category Badges --}}
                <div class="flex items-center gap-2 shrink-0">
                    <button class="px-4 py-2 text-[13px] font-medium rounded-full bg-emerald-500 text-white shadow-sm transition">Semua</button>
                    <button class="px-4 py-2 text-[13px] font-medium rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Kopi</button>
                    <button class="px-4 py-2 text-[13px] font-medium rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Non-Kopi</button>
                    <button class="px-4 py-2 text-[13px] font-medium rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Makanan</button>
                    <button class="px-4 py-2 text-[13px] font-medium rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Snack</button>
                </div>
            </div>
        </div>

        {{-- Table Card --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-gray-100 bg-gray-50/50">
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider w-20">Foto</th>
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Nama Menu</th>
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Harga Jual</th>
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">HPP</th>
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Margin</th>
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider text-right w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">

                        @php
                        $menus = [
                            ['nama' => 'Signature Espresso', 'kategori' => 'Kopi', 'icon' => 'solar:cup-hot-linear', 'harga' => 'Rp 28.000', 'hpp' => 'Rp 7.200', 'margin' => '74%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=Espresso'],
                            ['nama' => 'Matcha Latte Ice', 'kategori' => 'Non-Kopi', 'icon' => 'solar:ice-cream-linear', 'harga' => 'Rp 32.000', 'hpp' => 'Rp 11.500', 'margin' => '64%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=Matcha'],
                            ['nama' => 'Caramel Macchiato', 'kategori' => 'Kopi', 'icon' => 'solar:cup-hot-linear', 'harga' => 'Rp 35.000', 'hpp' => 'Rp 12.800', 'margin' => '63%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=Caramel'],
                            ['nama' => 'Beef Lasagna', 'kategori' => 'Makanan', 'icon' => 'solar:plate-linear', 'harga' => 'Rp 45.000', 'hpp' => 'Rp 22.000', 'margin' => '51%', 'status' => 'Habis', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=Lasagna'],
                            ['nama' => 'Croissant Almond', 'kategori' => 'Snack', 'icon' => 'solar:donut-linear', 'harga' => 'Rp 24.000', 'hpp' => 'Rp 9.800', 'margin' => '59%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=Croissant'],
                            ['nama' => 'Red Velvet Latte', 'kategori' => 'Non-Kopi', 'icon' => 'solar:ice-cream-linear', 'harga' => 'Rp 30.000', 'hpp' => 'Rp 10.200', 'margin' => '66%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=Red+Velvet'],
                        ];
                        @endphp

                        @foreach($menus as $menu)
                        <tr class="hover:bg-gray-50/60 transition group">
                            {{-- Foto --}}
                            <td class="px-6 py-4">
                                <img src="{{ $menu['img'] }}" alt="{{ $menu['nama'] }}" class="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm">
                            </td>

                            {{-- Nama Menu --}}
                            <td class="px-6 py-4 text-[14px] font-bold text-gray-800">
                                {{ $menu['nama'] }}
                            </td>

                            {{-- Kategori --}}
                            <td class="px-6 py-4 text-[13px] text-gray-500">
                                <span class="flex items-center gap-1.5">
                                    <iconify-icon icon="{{ $menu['icon'] }}" class="text-amber-500 text-sm"></iconify-icon>
                                    {{ $menu['kategori'] }}
                                </span>
                            </td>

                            {{-- Harga Jual --}}
                            <td class="px-6 py-4 text-[13px] font-semibold text-gray-700">
                                {{ $menu['harga'] }}
                            </td>

                            {{-- HPP --}}
                            <td class="px-6 py-4 text-[13px] text-gray-400">
                                {{ $menu['hpp'] }}
                            </td>

                            {{-- Margin --}}
                            <td class="px-6 py-4 text-[13px] font-bold text-emerald-500">
                                <span class="flex items-center gap-1">
                                    {{ $menu['margin'] }}
                                    <iconify-icon icon="solar:arrow-right-up-linear" class="text-xs"></iconify-icon>
                                </span>
                            </td>

                            {{-- Status --}}
                            <td class="px-6 py-4">
                                @if($menu['status'] === 'Tersedia')
                                    <span class="inline-flex items-center text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                        Tersedia
                                    </span>
                                @else
                                    <span class="inline-flex items-center text-[12px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                                        Habis
                                    </span>
                                @endif
                            </td>

                            {{-- Aksi --}}
                            <td class="px-6 py-4 text-right">
                                <button class="opacity-0 group-hover:opacity-100 transition p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <iconify-icon icon="solar:pen-linear" class="text-base"></iconify-icon>
                                </button>
                            </td>
                        </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>

            {{-- Pagination --}}
            <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <span class="text-[13px] text-gray-400">Menampilkan <strong>6</strong> dari <strong>42</strong> menu</span>
                <div class="flex items-center gap-2">
                    <button class="px-4 py-2 text-[13px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition cursor-not-allowed" disabled>
                        Sebelumnya
                    </button>
                    <button class="px-4 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                        Berikutnya
                    </button>
                </div>
            </div>

        </div>

    </div>
</div>
@endsection