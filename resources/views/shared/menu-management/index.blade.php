@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#fbfbfe] p-4 md:p-6">
        <div class="space-y-6 max-w-7xl mx-auto">

            {{-- HEADER --}}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1
                        class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                        Katalog Menu</h1>
                    <p class="text-[#2f27ce] font-medium text-sm mt-1">Kelola item menu, harga jual, dan pantau margin
                        keuntungan Anda.</p>
                </div>
                <div class="flex items-center gap-3">
                    <div class="hidden sm:block text-right mr-2">
                        <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-wider">Total Menu</p>
                        <p class="text-2xl font-black text-[#443dff] leading-none mt-0.5">{{ $totalMenus }}</p>
                    </div>
                    <a href="{{ route('menus.create') }}"
                        class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl text-sm font-extrabold transition-all shadow-lg shadow-[#443dff]/30 active:scale-[0.98] whitespace-nowrap">
                        <iconify-icon icon="solar:add-circle-bold" class="text-lg"></iconify-icon>
                        Tambah Menu
                    </a>
                </div>
            </div>

            {{-- TOOLBAR --}}
            <div
                class="bg-white p-4 rounded-2xl border border-[#dddbff] shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">

                <form method="GET" action="{{ route('menus.index') }}" id="filter-form"
                    class="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">

                    <div class="flex items-center gap-3 flex-1">
                        <div class="relative flex-1 max-w-xs">
                            <iconify-icon icon="solar:magnifer-linear"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-[#2f27ce]/70 text-[15px]"></iconify-icon>
                            <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari menu..."
                                class="w-full h-10 bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-9 pr-4 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/50 focus:outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                        </div>

                        <select name="status" onchange="document.getElementById('filter-form').submit()"
                            class="h-10 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-3 text-[13px] font-bold text-[#2f27ce] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer">
                            <option value="">Semua Status</option>
                            <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Tersedia</option>
                            <option value="inactive" {{ request('status') === 'inactive' ? 'selected' : '' }}>Habis</option>
                        </select>

                        <button type="submit"
                            class="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white rounded-xl text-[13px] font-extrabold hover:from-[#2f27ce] hover:to-[#050316] transition-all shadow-md shadow-[#443dff]/30 active:scale-95">
                            Cari
                        </button>

                        @if (request()->hasAny(['search', 'status', 'category']))
                            <a href="{{ route('menus.index') }}"
                                class="h-10 px-3 bg-[#dddbff]/30 text-[#2f27ce] rounded-xl text-[13px] font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all flex items-center border border-transparent hover:border-[#dddbff]">
                                Reset
                            </a>
                        @endif
                    </div>

                    {{-- Category Tabs --}}
                    <div class="flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-hide">
                        <a href="{{ route('menus.index', array_merge(request()->except(['category', 'page']))) }}"
                            class="px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all whitespace-nowrap
                            {{ !request('category') ? 'bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white shadow-md' : 'bg-white border border-[#dddbff] text-[#2f27ce] hover:bg-[#dddbff]/50 hover:text-[#050316]' }}">
                            Semua
                        </a>
                        @foreach ($categories as $cat)
                            <a href="{{ route('menus.index', array_merge(request()->except(['category', 'page']), ['category' => $cat->id])) }}"
                                class="px-3 py-1.5 text-[11px] font-extrabold rounded-full transition-all whitespace-nowrap
                                {{ request('category') == $cat->id ? 'bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white shadow-md' : 'bg-white border border-[#dddbff] text-[#2f27ce] hover:bg-[#dddbff]/50 hover:text-[#050316]' }}">
                                {{ $cat->name }}
                            </a>
                        @endforeach
                    </div>

                </form>

                {{-- View Toggle --}}
                <div class="flex items-center gap-3 border-l border-[#dddbff] pl-4">
                    <div class="flex items-center bg-[#fbfbfe] border border-[#dddbff] p-1 rounded-xl shrink-0">
                        <button
                            class="w-8 h-8 rounded-lg flex items-center justify-center text-[#2f27ce]/50 hover:text-[#2f27ce] transition-colors">
                            <iconify-icon icon="solar:widget-linear" class="text-lg"></iconify-icon>
                        </button>
                        <button
                            class="w-8 h-8 rounded-lg bg-white border border-[#dddbff] flex items-center justify-center text-[#050316] shadow-sm">
                            <iconify-icon icon="solar:list-bold" class="text-lg"></iconify-icon>
                        </button>
                    </div>
                </div>

            </div>

            {{-- TABLE CARD --}}
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left min-w-[700px]">
                        <thead>
                            <tr class="bg-[#fbfbfe]/50 border-b border-[#dddbff]">
                                <th
                                    class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider w-16">
                                    Foto</th>
                                <th class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Nama Menu</th>
                                <th class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Kategori</th>
                                <th class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Harga Jual</th>
                                <th class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">HPP
                                </th>
                                <th class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Margin</th>
                                <th class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Status</th>
                                {{-- Kolom aksi: edit & delete --}}
                                <th
                                    class="px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider text-right w-28">
                                    Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#dddbff]/50">

                            @forelse($menus as $menu)
                                @php
                                    $hpp = $menu->recipe ? $menu->recipe->cost ?? 0 : 0;
                                    $margin =
                                        $menu->price > 0 ? round((($menu->price - $hpp) / $menu->price) * 100) : 0;
                                @endphp
                                <tr class="hover:bg-[#dddbff]/10 transition-colors group cursor-pointer"
                                    onclick="window.location='{{ route('menus.show', $menu->id) }}'">

                                    {{-- Foto --}}
                                    <td class="px-6 py-4" onclick="event.stopPropagation()">
                                        <a href="{{ route('menus.show', $menu->id) }}">
                                            <img src="{{ $menu->image ? Storage::url($menu->image) : 'https://placehold.co/100x100/dddbff/2f27ce?text=Menu' }}"
                                                class="w-10 h-10 rounded-xl object-cover border border-[#dddbff] shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        </a>
                                    </td>

                                    {{-- Nama Menu --}}
                                    <td class="px-6 py-4">
                                        <a href="{{ route('menus.show', $menu->id) }}"
                                            class="font-extrabold text-[#050316] text-[13px] hover:text-[#443dff] transition-colors group-hover:text-[#443dff]">
                                            {{ $menu->name }}
                                        </a>
                                        @if ($menu->description)
                                            <p
                                                class="text-[11px] text-[#2f27ce]/50 font-medium mt-0.5 truncate max-w-[180px]">
                                                {{ $menu->description }}</p>
                                        @endif
                                    </td>

                                    {{-- Kategori --}}
                                    <td class="px-6 py-4">
                                        <span class="flex items-center gap-1.5 text-[12px] font-bold text-[#2f27ce]">
                                            <iconify-icon icon="solar:tag-linear"
                                                class="text-[#443dff] text-sm"></iconify-icon>
                                            {{ $menu->category?->name ?? '-' }}
                                        </span>
                                    </td>

                                    {{-- Harga Jual --}}
                                    <td class="px-6 py-4 font-black text-[#443dff] text-[13px]">
                                        Rp {{ number_format($menu->price, 0, ',', '.') }}
                                    </td>

                                    {{-- HPP --}}
                                    <td class="px-6 py-4 text-[13px] font-bold text-[#050316]/60">
                                        @if ($hpp > 0)
                                            Rp {{ number_format($hpp, 0, ',', '.') }}
                                        @else
                                            <span class="text-[#2f27ce]/30 italic text-[11px]">Belum diset</span>
                                        @endif
                                    </td>

                                    {{-- Margin --}}
                                    <td class="px-6 py-4">
                                        @if ($hpp > 0)
                                            <span
                                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border
                                                {{ $margin >= 60 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ($margin >= 40 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200') }}">
                                                {{ $margin }}%
                                            </span>
                                        @else
                                            <span class="text-[#2f27ce]/30 italic text-[11px]">-</span>
                                        @endif
                                    </td>

                                    {{-- Status --}}
                                    <td class="px-6 py-4">
                                        @if ($menu->is_active)
                                            <span
                                                class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">Tersedia</span>
                                        @else
                                            <span
                                                class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">Habis</span>
                                        @endif
                                    </td>

                                    {{-- Aksi: Edit & Delete --}}
                                    <td class="px-6 py-4 text-right" onclick="event.stopPropagation()">
                                        <div
                                            class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">

                                            {{-- Lihat Detail --}}
                                            <a href="{{ route('menus.show', $menu->id) }}" title="Lihat Detail"
                                                class="p-2 text-[#2f27ce] hover:text-[#443dff] rounded-xl hover:bg-[#dddbff]/50 inline-flex active:scale-95 transition-all">
                                                <iconify-icon icon="solar:eye-bold" class="text-[18px]"></iconify-icon>
                                            </a>

                                            {{-- Edit --}}
                                            <a href="{{ route('menus.edit', $menu->id) }}" title="Edit Menu"
                                                class="p-2 text-[#2f27ce] hover:text-[#443dff] rounded-xl hover:bg-[#dddbff]/50 inline-flex active:scale-95 transition-all">
                                                <iconify-icon icon="solar:pen-new-square-linear"
                                                    class="text-[18px]"></iconify-icon>
                                            </a>

                                            {{-- Delete --}}
                                            <form method="POST" action="{{ route('menus.destroy', $menu->id) }}"
                                                onsubmit="return confirm('Hapus menu {{ addslashes($menu->name) }}? Tindakan ini tidak bisa dibatalkan.')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" title="Hapus Menu"
                                                    class="p-2 text-rose-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 inline-flex active:scale-95 transition-all">
                                                    <iconify-icon icon="solar:trash-bin-trash-bold"
                                                        class="text-[18px]"></iconify-icon>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="8" class="px-6 py-16 text-center text-[#2f27ce]">
                                        <div class="flex flex-col items-center justify-center">
                                            <div
                                                class="w-16 h-16 rounded-full bg-[#dddbff]/50 flex items-center justify-center mb-3">
                                                <iconify-icon icon="solar:plate-bold-duotone"
                                                    class="text-4xl text-[#443dff] block mx-auto"></iconify-icon>
                                            </div>
                                            <p class="text-sm font-bold text-[#050316]">Tidak ada menu ditemukan.</p>
                                            <a href="{{ route('menus.create') }}"
                                                class="mt-4 px-5 py-2 bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white text-xs font-extrabold rounded-xl shadow-md hover:from-[#2f27ce] hover:to-[#050316] transition-all">
                                                + Tambah Menu Pertama
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                {{-- PAGINATION --}}
                <div
                    class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#dddbff]/50 bg-[#fbfbfe]/30">
                    <p class="text-[12px] font-medium text-[#2f27ce]">
                        Menampilkan <span class="font-bold text-[#050316]">{{ $menus->count() }}</span>
                        dari <span class="font-bold text-[#050316]">{{ $menus->total() }}</span> menu
                    </p>
                    <div class="flex items-center gap-2">
                        @if ($menus->onFirstPage())
                            <button disabled
                                class="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed">Sebelumnya</button>
                        @else
                            <a href="{{ $menus->previousPageUrl() }}"
                                class="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm">Sebelumnya</a>
                        @endif

                        {{-- Page numbers --}}
                        @foreach ($menus->getUrlRange(1, $menus->lastPage()) as $page => $url)
                            <a href="{{ $url }}"
                                class="w-9 h-9 flex items-center justify-center text-[12px] font-extrabold rounded-xl border transition-colors shadow-sm
                                {{ $page === $menus->currentPage()
                                    ? 'bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white border-[#443dff] shadow-[#443dff]/30'
                                    : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff] hover:text-[#050316]' }}">
                                {{ $page }}
                            </a>
                        @endforeach

                        @if ($menus->hasMorePages())
                            <a href="{{ $menus->nextPageUrl() }}"
                                class="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors shadow-sm">Berikutnya</a>
                        @else
                            <button disabled
                                class="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed">Berikutnya</button>
                        @endif
                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
