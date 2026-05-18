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
                        <p class="text-2xl font-bold text-green-600">{{ $totalMenus }}</p>
                    </div>
                    <button
                        class="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition shadow-sm whitespace-nowrap">
                        <iconify-icon icon="mdi:plus" class="text-base"></iconify-icon>
                        Tambah Menu
                    </button>
                </div>
            </div>

            {{-- TOOLBAR --}}
            <div
                class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

                {{-- Toolbar: Form search & filter --}}
                <form method="GET" action="{{ route('menus.index') }}" id="filter-form"
                    class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

                    <div class="flex items-center gap-3 flex-1">
                        <div class="relative flex-1 max-w-xs">
                            <iconify-icon icon="mdi:magnify"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                            <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari menu..."
                                class="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 transition">
                        </div>

                        {{-- Filter Status --}}
                        <select name="status" onchange="document.getElementById('filter-form').submit()"
                            class="h-10 bg-gray-50 border border-gray-100 rounded-xl px-3 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-green-200 cursor-pointer">
                            <option value="">Semua Status</option>
                            <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Tersedia
                            </option>
                            <option value="inactive" {{ request('status') === 'inactive' ? 'selected' : '' }}>Habis</option>
                        </select>

                        <button type="submit"
                            class="flex items-center gap-2 h-10 px-4 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                            Cari
                        </button>

                        @if (request()->hasAny(['search', 'status', 'category']))
                            <a href="{{ route('menus.index') }}"
                                class="h-10 px-3 bg-gray-100 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-200 transition flex items-center">
                                Reset
                            </a>
                        @endif
                    </div>

                    {{-- Category Tabs --}}
                    <div class="flex items-center gap-2 overflow-x-auto shrink-0">
                        <a href="{{ route('menus.index', array_merge(request()->except(['category', 'page']))) }}"
                            class="px-3 py-1.5 text-xs font-semibold rounded-full transition whitespace-nowrap
                  {{ !request('category') ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50' }}">
                            Semua
                        </a>
                        @foreach ($categories as $cat)
                            <a href="{{ route('menus.index', array_merge(request()->except(['category', 'page']), ['category' => $cat->id])) }}"
                                class="px-3 py-1.5 text-xs font-semibold rounded-full transition whitespace-nowrap
                      {{ request('category') == $cat->id ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50' }}">
                                {{ $cat->name }}
                            </a>
                        @endforeach
                    </div>

                </form>

                {{-- View Toggle + Category Tabs --}}
                <div class="flex items-center gap-3 overflow-x-auto">

                    {{-- View Toggle --}}
                    <div class="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-xl shrink-0">
                        <button
                            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                            <iconify-icon icon="mdi:view-grid-outline" class="text-lg"></iconify-icon>
                        </button>
                        <button
                            class="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-700 shadow-sm">
                            <iconify-icon icon="mdi:view-list-outline" class="text-lg"></iconify-icon>
                        </button>
                    </div>

                    {{-- Category Tabs --}}
                    <div class="flex items-center gap-2 overflow-x-auto shrink-0">
                        <a href="{{ route('menus.index', array_merge(request()->except(['category', 'page']))) }}"
                            class="px-3 py-1.5 text-xs font-semibold rounded-full transition whitespace-nowrap
                  {{ !request('category') ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50' }}">
                            Semua
                        </a>
                        @foreach ($categories as $cat)
                            <a href="{{ route('menus.index', array_merge(request()->except(['category', 'page']), ['category' => $cat->id])) }}"
                                class="px-3 py-1.5 text-xs font-semibold rounded-full transition whitespace-nowrap
                      {{ request('category') == $cat->id ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50' }}">
                                {{ $cat->name }}
                            </a>
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
                        {{-- Table body -- ganti @php hardcoded dengan: --}}
                        @forelse($menus as $menu)
                            <tr class="hover:bg-gray-50 transition group">
                                <td class="px-6 py-4">
                                    <img src="{{ $menu->image ? Storage::url($menu->image) : 'https://placehold.co/100x100/e2e8f0/64748b?text=Menu' }}"
                                        class="w-9 h-9 rounded-xl object-cover border border-gray-100 shadow-sm">
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900">{{ $menu->name }}</td>
                                <td class="px-6 py-4">
                                    <span class="flex items-center gap-1.5 text-gray-500">
                                        <iconify-icon icon="mdi:tag-outline" class="text-green-500 text-sm"></iconify-icon>
                                        {{ $menu->category?->name ?? '-' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 font-semibold text-gray-900">
                                    Rp {{ number_format($menu->price, 0, ',', '.') }}
                                </td>
                                <td class="px-6 py-4 text-gray-400">-</td>{{-- HPP belum ada di model --}}
                                <td class="px-6 py-4 text-gray-400">-</td>{{-- Margin belum ada di model --}}
                                <td class="px-6 py-4">
                                    @if ($menu->is_active)
                                        <span
                                            class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">Tersedia</span>
                                    @else
                                        <span
                                            class="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Habis</span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="{{ route('menus.edit', $menu->id) }}"
                                        class="opacity-0 group-hover:opacity-100 transition p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 inline-flex">
                                        <iconify-icon icon="mdi:pencil-outline" class="text-base"></iconify-icon>
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="px-6 py-16 text-center text-gray-400">
                                    <iconify-icon icon="mdi:food-off-outline"
                                        class="text-4xl block mx-auto mb-2"></iconify-icon>
                                    Tidak ada menu ditemukan.
                                </td>
                            </tr>
                        @endforelse
                    </table>
                </div>

                <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p class="text-xs text-gray-400">
                        Menampilkan <span class="font-bold text-gray-700">{{ $menus->count() }}</span>
                        dari <span class="font-bold text-gray-700">{{ $menus->total() }}</span> menu
                    </p>
                    <div class="flex items-center gap-2">
                        @if ($menus->onFirstPage())
                            <button disabled
                                class="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-xl cursor-not-allowed">Sebelumnya</button>
                        @else
                            <a href="{{ $menus->previousPageUrl() }}"
                                class="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition">Sebelumnya</a>
                        @endif

                        @if ($menus->hasMorePages())
                            <a href="{{ $menus->nextPageUrl() }}"
                                class="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition">Berikutnya</a>
                        @else
                            <button disabled
                                class="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-xl cursor-not-allowed">Berikutnya</button>
                        @endif
                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
