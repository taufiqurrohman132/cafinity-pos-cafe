@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="space-y-6">

        {{-- HEADER --}}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Katalog Menu</h1>
                <p class="text-gray-500 mt-1">Kelola item menu, harga jual, dan pantau margin keuntungan Anda.</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="hidden sm:block text-right">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Menu</p>
                    <p class="text-2xl font-bold text-green-600">42</p>
                </div>
                <button class="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition shadow-sm whitespace-nowrap">
                    <iconify-icon icon="mdi:plus" class="text-base"></iconify-icon>
                    Tambah Menu
                </button>
            </div>
        </div>

        {{-- TOOLBAR --}}
        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

            {{-- Search + Filter --}}
            <div class="flex items-center gap-3 flex-1">
                <div class="relative flex-1 max-w-xs">
                    <iconify-icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                    <input type="text" placeholder="Cari menu..."
                        class="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 transition">
                </div>
                <button class="flex items-center gap-2 h-10 px-4 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                    <iconify-icon icon="mdi:filter-outline" class="text-base"></iconify-icon>
                    Filter
                </button>
            </div>

            {{-- View Toggle + Category Tabs --}}
            <div class="flex items-center gap-3 overflow-x-auto">

                {{-- View Toggle --}}
                <div class="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-xl shrink-0">
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                        <iconify-icon icon="mdi:view-grid-outline" class="text-lg"></iconify-icon>
                    </button>
                    <button class="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-700 shadow-sm">
                        <iconify-icon icon="mdi:view-list-outline" class="text-lg"></iconify-icon>
                    </button>
                </div>

                {{-- Category Tabs --}}
                <div class="flex items-center gap-2 shrink-0">
                    @foreach (['Semua', 'Kopi', 'Non-Kopi', 'Makanan', 'Snack'] as $tab)
                        <button @class([
                            'px-3 py-1.5 text-xs font-semibold rounded-full transition whitespace-nowrap',
                            'bg-green-600 text-white shadow-sm' => $tab === 'Semua',
                            'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50' => $tab !== 'Semua',
                        ])>{{ $tab }}</button>
                    @endforeach
                </div>

            </div>
        </div>

        {{-- TABLE CARD --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[700px]">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-6 py-3 text-xs font-medium text-gray-400 w-16">Foto</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-400">Nama Menu</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-400">Kategori</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-400">Harga Jual</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-400">HPP</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-400">Margin</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-400">Status</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-400 text-right w-20">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 text-sm">

                        @php
                            $menus = [
                                ['nama' => 'Signature Espresso', 'kategori' => 'Kopi',     'icon' => 'mdi:coffee-outline',       'harga' => 'Rp 28.000', 'hpp' => 'Rp 7.200',  'margin' => '74%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=E'],
                                ['nama' => 'Matcha Latte Ice',   'kategori' => 'Non-Kopi', 'icon' => 'mdi:leaf-outline',          'harga' => 'Rp 32.000', 'hpp' => 'Rp 11.500', 'margin' => '64%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=M'],
                                ['nama' => 'Caramel Macchiato',  'kategori' => 'Kopi',     'icon' => 'mdi:coffee-outline',       'harga' => 'Rp 35.000', 'hpp' => 'Rp 12.800', 'margin' => '63%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=C'],
                                ['nama' => 'Beef Lasagna',       'kategori' => 'Makanan',  'icon' => 'mdi:food-outline',          'harga' => 'Rp 45.000', 'hpp' => 'Rp 22.000', 'margin' => '51%', 'status' => 'Habis',    'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=B'],
                                ['nama' => 'Croissant Almond',   'kategori' => 'Snack',    'icon' => 'mdi:food-croissant',        'harga' => 'Rp 24.000', 'hpp' => 'Rp 9.800',  'margin' => '59%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=C'],
                                ['nama' => 'Red Velvet Latte',   'kategori' => 'Non-Kopi', 'icon' => 'mdi:cup-outline',           'harga' => 'Rp 30.000', 'hpp' => 'Rp 10.200', 'margin' => '66%', 'status' => 'Tersedia', 'img' => 'https://placehold.co/100x100/e2e8f0/64748b?text=R'],
                            ];
                        @endphp

                        @foreach ($menus as $menu)
                            <tr class="hover:bg-gray-50 transition group">

                                {{-- Foto --}}
                                <td class="px-6 py-4">
                                    <img src="{{ $menu['img'] }}" alt="{{ $menu['nama'] }}"
                                        class="w-9 h-9 rounded-xl object-cover border border-gray-100 shadow-sm">
                                </td>

                                {{-- Nama --}}
                                <td class="px-6 py-4 font-semibold text-gray-900">{{ $menu['nama'] }}</td>

                                {{-- Kategori --}}
                                <td class="px-6 py-4">
                                    <span class="flex items-center gap-1.5 text-gray-500">
                                        <iconify-icon icon="{{ $menu['icon'] }}" class="text-green-500 text-sm"></iconify-icon>
                                        {{ $menu['kategori'] }}
                                    </span>
                                </td>

                                {{-- Harga --}}
                                <td class="px-6 py-4 font-semibold text-gray-900">{{ $menu['harga'] }}</td>

                                {{-- HPP --}}
                                <td class="px-6 py-4 text-gray-400">{{ $menu['hpp'] }}</td>

                                {{-- Margin --}}
                                <td class="px-6 py-4 font-bold text-green-600">
                                    <span class="flex items-center gap-1">
                                        {{ $menu['margin'] }}
                                        <iconify-icon icon="mdi:trending-up" class="text-xs"></iconify-icon>
                                    </span>
                                </td>

                                {{-- Status --}}
                                <td class="px-6 py-4">
                                    @if ($menu['status'] === 'Tersedia')
                                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">Tersedia</span>
                                    @else
                                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Habis</span>
                                    @endif
                                </td>

                                {{-- Aksi --}}
                                <td class="px-6 py-4 text-right">
                                    <button class="opacity-0 group-hover:opacity-100 transition p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                        <iconify-icon icon="mdi:pencil-outline" class="text-base"></iconify-icon>
                                    </button>
                                </td>

                            </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>

            {{-- PAGINATION --}}
            <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p class="text-xs text-gray-400">
                    Menampilkan <span class="font-bold text-gray-700">6</span> dari <span class="font-bold text-gray-700">42</span> menu
                </p>
                <div class="flex items-center gap-2">
                    <button disabled class="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-xl cursor-not-allowed">
                        Sebelumnya
                    </button>
                    <button class="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                        Berikutnya
                    </button>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection