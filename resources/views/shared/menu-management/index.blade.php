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
                    {{-- Ganti href jadi onclick --}}
                    <button onclick="document.getElementById('menu-create-modal').showModal()"
                        class="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                        <iconify-icon icon="solar:add-circle-bold" class="text-lg"></iconify-icon>
                        Tambah Menu
                    </button>


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
                {{-- View Toggle --}}
                <div class="flex items-center bg-[#fbfbfe] border border-[#dddbff] p-1 rounded-xl shrink-0">
                    <button id="btn-grid" onclick="setView('grid')"
                        class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[#2f27ce]/50 hover:text-[#2f27ce]">
                        <iconify-icon icon="solar:widget-linear" class="text-lg"></iconify-icon>
                    </button>
                    <button id="btn-list" onclick="setView('list')"
                        class="w-8 h-8 rounded-lg bg-white border border-[#dddbff] flex items-center justify-center text-[#050316] shadow-sm">
                        <iconify-icon icon="solar:list-bold" class="text-lg"></iconify-icon>
                    </button>
                </div>

            </div>

            {{-- TABLE CARD --}}
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">
                <div class="overflow-x-auto" id="view-table">
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
                                    $hpp = $menu->recipe ? $menu->recipe->total_hpp : 0;
                                    $margin = $menu->recipe ? $menu->recipe->margin : 0;
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
                                            <button onclick="document.getElementById('menu-create-modal').showModal()"
                                                class="bg-gradient-to-r text-xs from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-2 py-1 rounded-md font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98]">
                                                <iconify-icon icon="solar:add-circle-bold" class="text-xs"></iconify-icon>
                                                Tambah Menu Pertama
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                {{-- GRID VIEW --}}
                <div id="view-grid"
                    class="hidden p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    @forelse($menus as $menu)
                        @php
                            $hpp = $menu->recipe ? $menu->recipe->total_hpp : 0;
                            $margin = $menu->recipe ? $menu->recipe->margin : 0;
                        @endphp
                        <div class="group bg-[#fbfbfe] border border-[#dddbff] rounded-2xl overflow-hidden hover:border-[#443dff] hover:shadow-md transition-all cursor-pointer"
                            onclick="window.location='{{ route('menus.show', $menu->id) }}'">

                            {{-- Foto --}}
                            <div class="relative aspect-square overflow-hidden bg-[#dddbff]/20">
                                <img src="{{ $menu->image ? Storage::url($menu->image) : 'https://placehold.co/200x200/dddbff/2f27ce?text=Menu' }}"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                {{-- Status badge --}}
                                <div class="absolute top-2 right-2">
                                    <form method="POST" action="{{ route('menus.toggle-status', $menu->id) }}"
                                        onclick="event.stopPropagation()">
                                        @csrf
                                        <button type="submit"
                                            class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border transition-all
                            {{ $menu->is_active
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200' }}">
                                            {{ $menu->is_active ? 'Tersedia' : 'Habis' }}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {{-- Info --}}
                            <div class="p-3">
                                <p class="font-extrabold text-[#050316] text-[12px] truncate">{{ $menu->name }}</p>
                                <p class="text-[11px] text-[#2f27ce]/60 font-medium mt-0.5">
                                    {{ $menu->category?->name ?? '-' }}</p>
                                <p class="text-[13px] font-black text-[#443dff] mt-1.5">Rp
                                    {{ number_format($menu->price, 0, ',', '.') }}</p>

                                @if ($hpp > 0)
                                    <span
                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border mt-1
                        {{ $margin >= 60 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ($margin >= 40 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200') }}">
                                        Margin {{ $margin }}%
                                    </span>
                                @endif

                                {{-- Aksi --}}
                                <div class="flex items-center gap-1 mt-2 pt-2 border-t border-[#dddbff]/50 opacity-0 group-hover:opacity-100 transition-all"
                                    onclick="event.stopPropagation()">
                                    <a href="{{ route('menus.edit', $menu->id) }}"
                                        class="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-bold text-[#2f27ce] hover:text-[#443dff] hover:bg-[#dddbff]/50 rounded-lg transition-all">
                                        <iconify-icon icon="solar:pen-new-square-linear" class="text-sm"></iconify-icon>
                                        Edit
                                    </a>
                                    <form method="POST" action="{{ route('menus.destroy', $menu->id) }}"
                                        onsubmit="return confirm('Hapus menu {{ addslashes($menu->name) }}?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                            class="flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-bold text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                            <iconify-icon icon="solar:trash-bin-trash-bold"
                                                class="text-sm"></iconify-icon>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    @empty
                        {{-- empty state sama seperti table --}}
                        <div class="col-span-full py-16 text-center">
                            <div
                                class="w-16 h-16 rounded-full bg-[#dddbff]/50 flex items-center justify-center mb-3 mx-auto">
                                <iconify-icon icon="solar:plate-bold-duotone"
                                    class="text-4xl text-[#443dff]"></iconify-icon>
                            </div>
                            <p class="text-sm font-bold text-[#050316]">Tidak ada menu ditemukan.</p>
                        </div>
                    @endforelse
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
                        {{-- Page numbers --}}
                        @php
                            $current = $menus->currentPage();
                            $last = $menus->lastPage();
                            $window = 2; // tampilkan 2 halaman di kiri & kanan current

                            $pages = collect();

                            // Selalu tampilkan halaman 1
                            $pages->push(1);

                            // Ellipsis kiri kalau current jauh dari awal
                            if ($current - $window > 2) {
                                $pages->push('...');
                            }

                            // Window sekitar current
                            for ($i = max(2, $current - $window); $i <= min($last - 1, $current + $window); $i++) {
                                $pages->push($i);
                            }

                            // Ellipsis kanan kalau current jauh dari akhir
                            if ($current + $window < $last - 1) {
                                $pages->push('...');
                            }

                            // Selalu tampilkan halaman terakhir (kalau lebih dari 1)
                            if ($last > 1) {
                                $pages->push($last);
                            }
                        @endphp

                        @foreach ($pages as $page)
                            @if ($page === '...')
                                <span
                                    class="w-9 h-9 flex items-center justify-center text-[12px] font-bold text-[#2f27ce]/40">…</span>
                            @else
                                <a href="{{ $menus->url($page) }}"
                                    class="w-9 h-9 flex items-center justify-center text-[12px] font-extrabold rounded-xl border transition-colors shadow-sm {{ $page === $current
                                        ? 'bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white border-[#443dff] shadow-[#443dff]/30'
                                        : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff] hover:text-[#050316]' }}">
                                    {{ $page }}
                                </a>
                            @endif
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

    {{-- Di bawah div utama, sebelum @endsection --}}
    <x-modal.create-menu :categories="$categories" />
@endsection

@push('scripts')
    <script>
        function setView(mode) {
            const table = document.getElementById('view-table');
            const grid = document.getElementById('view-grid');
            const btnList = document.getElementById('btn-list');
            const btnGrid = document.getElementById('btn-grid');

            const activeClass = ['bg-white', 'border', 'border-[#dddbff]', 'text-[#050316]', 'shadow-sm'];
            const inactiveClass = ['text-[#2f27ce]/50'];

            if (mode === 'grid') {
                table.classList.add('hidden');
                grid.classList.remove('hidden');
                btnGrid.classList.add(...activeClass);
                btnGrid.classList.remove(...inactiveClass);
                btnList.classList.remove(...activeClass);
                btnList.classList.add(...inactiveClass);
            } else {
                grid.classList.add('hidden');
                table.classList.remove('hidden');
                btnList.classList.add(...activeClass);
                btnList.classList.remove(...inactiveClass);
                btnGrid.classList.remove(...activeClass);
                btnGrid.classList.add(...inactiveClass);
            }

            localStorage.setItem('menu-view', mode);
        }

        // Restore preference saat load
        document.addEventListener('DOMContentLoaded', () => {
            const saved = localStorage.getItem('menu-view');
            if (saved === 'grid') setView('grid');
        });
    </script>
@endpush
