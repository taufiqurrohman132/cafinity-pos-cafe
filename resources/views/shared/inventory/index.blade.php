@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-[#fbfbfe]">
    <div class="grid grid-cols-1 xl:grid-cols-12">

        {{-- ======================== MAIN CONTENT ======================== --}}
        <div class="xl:col-span-9 p-4 md:p-6 space-y-6">

            {{-- HEADER --}}
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-[#050316]">Manajemen Inventaris</h1>
                    <p class="text-gray-500 mt-1">Lacak dan kelola stok bahan baku operasional kafe Anda secara real-time.</p>
                </div>
                <div class="flex flex-wrap items-center gap-3">

                    {{-- Filter dropdown --}}
                    <form method="GET" action="{{ route('inventories.index') }}" class="flex items-center gap-2">
                        @if(request('search'))
                            <input type="hidden" name="search" value="{{ request('search') }}">
                        @endif
                        <select name="status" onchange="this.form.submit()"
                            class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-[#dddbff] rounded-xl hover:bg-[#fbfbfe] transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#dddbff]">
                            <option value="">Semua Status</option>
                            <option value="safe"  {{ request('status') == 'safe'  ? 'selected' : '' }}>Aman</option>
                            <option value="low"   {{ request('status') == 'low'   ? 'selected' : '' }}>Stok Rendah</option>
                            <option value="empty" {{ request('status') == 'empty' ? 'selected' : '' }}>Habis</option>
                        </select>
                    </form>

                    <a href="{{ route('inventories.create') }}"
                        class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#2f27ce] hover:bg-[#443dff] rounded-xl transition shadow-sm">
                        <iconify-icon icon="mdi:plus" class="text-base"></iconify-icon>
                        Tambah Bahan
                    </a>
                </div>
            </div>

            {{-- STAT CARDS --}}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">

                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Total Nilai Inventaris</p>
                            <h2 class="text-2xl font-bold text-[#050316] mt-3">
                                Rp {{ number_format($totalValue, 0, ',', '.') }}
                            </h2>
                            <div class="flex items-center gap-1 mt-3 text-green-500 text-xs font-semibold">
                                <iconify-icon icon="mdi:arrow-top-right"></iconify-icon>
                                Nilai stok keseluruhan
                            </div>
                        </div>
                        <div class="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                            <iconify-icon icon="solar:box-outline"></iconify-icon>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Peringatan Stok Rendah</p>
                            <h2 class="text-2xl font-bold text-[#050316] mt-3">
                                {{ $lowStockCount }} Item
                            </h2>
                            <div class="flex items-center gap-1 mt-3 text-red-500 text-xs font-semibold">
                                <iconify-icon icon="mdi:arrow-bottom-right"></iconify-icon>
                                Perlu segera dipesan
                            </div>
                        </div>
                        <div class="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 text-xl flex-shrink-0">
                            <iconify-icon icon="mdi:alert-outline"></iconify-icon>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm text-gray-500">Saran Restock</p>
                            <h2 class="text-2xl font-bold text-[#050316] mt-3">
                                {{ $restockCount }} Item
                            </h2>
                            <p class="text-xs text-gray-400 mt-3">Berdasarkan batas minimum stok</p>
                        </div>
                        <div class="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                            <iconify-icon icon="mdi:chart-line"></iconify-icon>
                        </div>
                    </div>
                </div>

            </div>

            {{-- TABLE CARD --}}
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                {{-- TABLE HEADER --}}
                <div class="px-6 py-5 border-b border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h3 class="font-bold text-[#050316]">Daftar Bahan Baku</h3>
                    <form method="GET" action="{{ route('inventories.index') }}">
                        @if(request('status'))
                            <input type="hidden" name="status" value="{{ request('status') }}">
                        @endif
                        <div class="relative">
                            <iconify-icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                            <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari bahan..."
                                class="w-full lg:w-64 h-10 pl-9 pr-4 text-sm bg-[#fbfbfe] border border-[#dddbff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dddbff]" />
                        </div>
                    </form>
                </div>

                {{-- TABLE --}}
                <div class="overflow-x-auto">
                    <table class="w-full text-left min-w-[800px]">
                        <thead>
                            <tr class="text-xs font-medium text-gray-400 bg-[#fbfbfe] border-b border-[#dddbff]">
                                <th class="px-6 py-3">Nama Bahan</th>
                                <th class="px-6 py-3">Kategori</th>
                                <th class="px-6 py-3">Stok Saat Ini</th>
                                <th class="px-6 py-3">Satuan</th>
                                <th class="px-6 py-3">Harga/Satuan</th>
                                <th class="px-6 py-3">Status</th>
                                <th class="px-6 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-[#dddbff]">
                            @forelse ($inventories as $item)
                                @php
                                    $percent = $item->min_stock > 0
                                        ? min(100, round(($item->stock / $item->min_stock) * 100))
                                        : 100;

                                    $color = match(true) {
                                        $item->stock == 0               => 'red',
                                        $item->stock <= $item->min_stock => 'orange',
                                        $percent <= 75                  => 'yellow',
                                        default                         => 'blue',
                                    };

                                    $status = match($color) {
                                        'red'    => 'Habis',
                                        'orange' => 'Kritis',
                                        'yellow' => 'Menipis',
                                        default  => 'Aman',
                                    };

                                    $statusStyles = [
                                        'blue'   => 'bg-[#dddbff] text-[#2f27ce]',
                                        'yellow' => 'bg-yellow-100 text-yellow-700',
                                        'orange' => 'bg-orange-100 text-orange-600',
                                        'red'    => 'bg-red-100 text-red-600',
                                    ];

                                    $barStyles = [
                                        'blue'   => 'bg-[#2f27ce]',
                                        'yellow' => 'bg-yellow-400',
                                        'orange' => 'bg-orange-400',
                                        'red'    => 'bg-red-400',
                                    ];
                                @endphp

                                <tr class="hover:bg-[#fbfbfe] transition">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-9 h-9 rounded-xl bg-[#dddbff] text-[#2f27ce] font-bold text-sm flex items-center justify-center flex-shrink-0">
                                                {{ strtoupper(substr($item->name, 0, 1)) }}
                                            </div>
                                            <p class="font-semibold text-[#050316]">{{ $item->name }}</p>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="px-2.5 py-1 rounded-full bg-[#fbfbfe] border border-[#dddbff] text-gray-600 text-xs font-medium">
                                            {{ $item->category?->name ?? '-' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="space-y-1.5">
                                            <div class="flex items-center justify-between text-xs">
                                                <span class="font-semibold text-[#050316]">{{ $item->stock }} / {{ $item->min_stock }}</span>
                                                <span class="text-gray-400">{{ $percent }}%</span>
                                            </div>
                                            <div class="w-28 h-1.5 rounded-full bg-[#dddbff] overflow-hidden">
                                                <div class="h-full rounded-full {{ $barStyles[$color] }}" style="width: {{ $percent }}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-gray-600">{{ $item->unit }}</td>
                                    <td class="px-6 py-4 font-semibold text-[#050316]">
                                        Rp {{ number_format($item->price_per_unit, 0, ',', '.') }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold {{ $statusStyles[$color] }}">
                                            {{ $status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-2">
                                            <a href="{{ route('inventories.show', $item->id) }}"
                                                class="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition"
                                                title="Detail">
                                                <iconify-icon icon="mdi:eye-outline" class="text-base"></iconify-icon>
                                            </a>
                                            <a href="{{ route('inventories.edit', $item->id) }}"
                                                class="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-[#2f27ce] hover:border-[#2f27ce] transition"
                                                title="Edit">
                                                <iconify-icon icon="mdi:pencil-outline" class="text-base"></iconify-icon>
                                            </a>
                                            <form method="POST" action="{{ route('inventories.destroy', $item->id) }}"
                                                onsubmit="return confirm('Hapus {{ $item->name }}?')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit"
                                                    class="w-8 h-8 rounded-lg bg-[#fbfbfe] border border-[#dddbff] flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-300 transition"
                                                    title="Hapus">
                                                    <iconify-icon icon="mdi:trash-can-outline" class="text-base"></iconify-icon>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="7" class="px-6 py-10 text-center text-gray-400 text-sm">
                                        <div class="flex flex-col items-center gap-2">
                                            <iconify-icon icon="solar:box-outline" class="text-4xl text-[#dddbff]"></iconify-icon>
                                            <p>Belum ada data inventaris.</p>
                                            <a href="{{ route('inventories.create') }}" class="text-[#2f27ce] font-semibold hover:underline text-xs">
                                                + Tambah bahan pertama
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                {{-- TABLE FOOTER --}}
                <div class="px-6 py-4 border-t border-[#dddbff] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <p class="text-xs text-gray-400">
                        Menampilkan {{ $inventories->firstItem() ?? 0 }}–{{ $inventories->lastItem() ?? 0 }}
                        dari {{ $inventories->total() }} jenis bahan baku
                    </p>
                    <div class="flex items-center gap-4">
                        <a href="{{ route('reports.inventory') }}"
                            class="text-xs font-semibold text-gray-500 hover:text-[#2f27ce] transition">
                            Unduh Laporan Stok
                        </a>
                        <div>
                            {{ $inventories->withQueryString()->links() }}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {{-- ======================== SIDEBAR ======================== --}}
        <div class="xl:col-span-3 border-l border-[#dddbff] bg-white p-4 md:p-6 space-y-6">

            {{-- AKSI CEPAT --}}
            <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aksi Cepat</h3>
                <div class="space-y-3">

                    <a href="{{ route('inventories.create') }}"
                        class="w-full bg-[#2f27ce] hover:bg-[#443dff] transition rounded-xl p-4 text-left text-white flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-[#443dff] flex items-center justify-center text-lg flex-shrink-0">
                            <iconify-icon icon="mdi:plus"></iconify-icon>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold">Tambah Bahan Baru</h4>
                            <p class="text-xs text-[#dddbff] mt-0.5">Input item inventaris baru</p>
                        </div>
                    </a>

                    <a href="{{ route('inventories.low-stock') }}"
                        class="w-full border border-[#dddbff] rounded-xl p-4 text-left flex items-center gap-3 hover:bg-[#fbfbfe] transition">
                        <div class="w-9 h-9 rounded-xl bg-[#dddbff] flex items-center justify-center text-[#2f27ce] text-lg flex-shrink-0">
                            <iconify-icon icon="mdi:alert-outline"></iconify-icon>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-[#050316]">Stok Menipis</h4>
                            <p class="text-xs text-gray-400 mt-0.5">Lihat semua item kritis</p>
                        </div>
                    </a>

                </div>
            </div>

            {{-- LOG AKTIVITAS --}}
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Log Aktivitas</h3>
                    <a href="{{ route('inventories.index') }}" class="text-xs font-semibold text-[#2f27ce] hover:text-[#443dff]">Semua</a>
                </div>

                <div class="space-y-4" id="logs">
                    @forelse ($recentLogs as $log)
                        <div class="border-l-2 border-[#2f27ce] pl-3">
                            <div class="flex justify-between items-start gap-2">
                                <p class="text-xs font-bold text-[#050316]">
                                    {{ ucfirst($log->type) }} — {{ $log->inventory?->name }}
                                </p>
                                <span class="text-[10px] text-gray-400 whitespace-nowrap">
                                    {{ $log->created_at->diffForHumans() }}
                                </span>
                            </div>
                            <p class="text-xs text-gray-500 mt-0.5">
                                {{ $log->notes ?? '-' }} oleh {{ $log->user?->name ?? 'Sistem' }}
                            </p>
                        </div>
                    @empty
                        <p class="text-xs text-gray-400 italic">Belum ada aktivitas.</p>
                    @endforelse
                </div>
            </div>

            {{-- TIPS --}}
            <div class="bg-[#dddbff] border border-[#dddbff] rounded-2xl p-5">
                <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#fbfbfe] flex items-center justify-center text-[#2f27ce] text-lg flex-shrink-0">
                        <iconify-icon icon="mdi:lightbulb-outline"></iconify-icon>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-[#050316] mb-1">Tips Efisiensi</h4>
                        @if ($criticalItem)
                            <p class="text-xs text-gray-600 leading-relaxed">
                                <strong>{{ $criticalItem->name }}</strong> hampir habis
                                (sisa {{ $criticalItem->stock }} {{ $criticalItem->unit }}).
                                Segera lakukan restock sebelum kehabisan.
                            </p>
                            <a href="{{ route('inventories.show', $criticalItem->id) }}"
                                class="inline-block mt-2 text-xs font-semibold text-[#2f27ce] hover:underline">
                                Lihat Detail →
                            </a>
                        @else
                            <p class="text-xs text-gray-600 leading-relaxed">
                                Semua stok dalam kondisi aman. Pantau terus secara berkala.
                            </p>
                        @endif
                    </div>
                </div>
            </div>

        </div>

    </div>

    {{-- FOOTER --}}
    <div class="border-t border-[#dddbff] bg-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <p class="text-[10px] text-gray-400">© 2024 Smart Cafe POS v2.4.0</p>
        <div class="flex items-center gap-4 text-[10px] text-gray-400">
            <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-[#2f27ce]"></span> System Online
            </span>
            <span>Support ID: #POS-8821</span>
        </div>
    </div>

</div>
@endsection