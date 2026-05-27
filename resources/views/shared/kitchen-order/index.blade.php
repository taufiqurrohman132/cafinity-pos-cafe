@extends('layouts.app')

@section('content')
    <div class="space-y-6 p-4 md:p-6 bg-[#fbfbfe] min-h-screen">

        {{-- ====== TOP HEADER ====== --}}
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
            <div>
                <h1
                    class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                    Antrean Dapur
                </h1>
                <p class="text-[#2f27ce] mt-1 text-sm font-medium">
                    Kelola persiapan makanan dan minuman secara real-time.
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <div
                    class="text-[13px] text-[#2f27ce] bg-white px-4 py-2.5 rounded-xl border border-[#dddbff] shadow-sm flex items-center gap-2 font-medium">
                    <iconify-icon icon="solar:clock-circle-bold-duotone" class="text-lg text-[#443dff]"></iconify-icon>
                    <span>Sekarang: <span class="font-bold text-[#050316]" id="live-clock"></span></span>
                </div>
                <a href="{{ route('pos.index') }}"
                    class="bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#2f27ce]/30 active:scale-[0.98] text-[13px]">
                    <iconify-icon icon="solar:card-2-bold" class="text-[18px]"></iconify-icon>
                    Buka POS
                </a>
            </div>
        </div>

        {{-- ====== STAT CARDS ====== --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:clipboard-list-bold-duotone"
                        class="text-[22px] text-[#443dff]"></iconify-icon>
                </div>
                <div>
                    <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Pesanan Aktif</p>
                    <p class="text-2xl font-extrabold text-[#050316] leading-tight">{{ $stats['active_orders'] }}</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-[#dddbff] flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:stopwatch-bold-duotone" class="text-[22px] text-[#443dff]"></iconify-icon>
                </div>
                <div>
                    <p class="text-[10px] font-extrabold text-[#2f27ce] uppercase tracking-widest">Rata-rata Masak</p>
                    <p class="text-2xl font-extrabold text-[#050316] leading-tight">{{ $stats['avg_cook_time'] }}</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:danger-triangle-bold-duotone"
                        class="text-[22px] text-rose-500"></iconify-icon>
                </div>
                <div>
                    <p class="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">Pesanan Terlambat</p>
                    <p class="text-2xl font-extrabold text-[#050316] leading-tight">{{ $stats['late_orders'] }}</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:check-circle-bold-duotone"
                        class="text-[22px] text-emerald-600"></iconify-icon>
                </div>
                <div>
                    <p class="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">Selesai Hari Ini</p>
                    <p class="text-2xl font-extrabold text-[#050316] leading-tight">{{ $stats['completed_today'] }}</p>
                </div>
            </div>
        </div>

        {{-- ====== FILTER TABS ====== --}}
        <div
            class="bg-white rounded-2xl border border-[#dddbff] shadow-sm px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2 flex-wrap">
                @foreach ([
            'all' => 'Semua',
            'waiting' => 'Menunggu',
            'preparing' => 'Memasak',
            'ready' => 'Siap',
        ] as $key => $label)
                    <a href="{{ route('kitchen-orders.index', ['filter' => $key]) }}"
                        class="px-4 py-1.5 text-xs font-bold rounded-lg border transition-all
                        {{ $filter === $key
                            ? 'bg-[#2f27ce] text-white border-[#2f27ce] shadow-sm'
                            : 'bg-white text-[#2f27ce] border-[#dddbff] hover:bg-[#dddbff]/50 hover:text-[#050316]' }}">
                        {{ $label }}
                    </a>
                @endforeach
            </div>
            <div class="flex items-center gap-2 text-[11px] text-[#2f27ce] font-semibold">
                <span class="w-1.5 h-1.5 bg-[#443dff] rounded-full animate-pulse"></span>
                Diperbarui otomatis setiap 30 detik
            </div>
        </div>

        {{-- ====== ORDER CARDS GRID ====== --}}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            @forelse ($orders as $order)
                @php
                    $isLate =
                        in_array($order->status, ['pending', 'preparing']) &&
                        $order->created_at->diffInMinutes(now()) >= 15;
                @endphp

                <div
                    class="rounded-2xl overflow-hidden flex flex-col shadow-sm border transition-all hover:shadow-md
            {{ $order->status === 'preparing' ? 'bg-gradient-to-b from-[#eeeeff] to-white border-[#c4c0ff]' : '' }}
            {{ $order->status === 'pending' ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200' : '' }}
            {{ $order->status === 'ready' ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200' : '' }}">

                    <div class="p-5 flex flex-col gap-3 flex-1">

                        {{-- Header --}}
                        <div class="flex items-start justify-between gap-2">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-base font-black text-[#050316] tracking-tight">
                                    #KO-{{ str_pad($order->id, 4, '0', STR_PAD_LEFT) }}
                                </span>
                                @if ($isLate)
                                    <span
                                        class="text-[9px] font-extrabold bg-rose-100 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md tracking-wide uppercase">
                                        Terlambat
                                    </span>
                                @endif
                            </div>

                            {{-- Status badge di kanan atas --}}
                            @if ($order->status === 'preparing')
                                <span
                                    class="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#443dff]/10 text-[#443dff] px-2.5 py-1 rounded-lg border border-[#443dff]/20 flex-shrink-0">
                                    <iconify-icon icon="solar:fire-bold-duotone" class="text-[12px]"></iconify-icon>
                                    Sedang Dimasak
                                </span>
                            @elseif ($order->status === 'pending')
                                <span
                                    class="inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200 flex-shrink-0">
                                    <iconify-icon icon="solar:clock-circle-bold-duotone" class="text-[12px]"></iconify-icon>
                                    Menunggu
                                </span>
                            @elseif ($order->status === 'ready')
                                <span
                                    class="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 flex-shrink-0">
                                    <iconify-icon icon="solar:check-circle-bold-duotone" class="text-[12px]"></iconify-icon>
                                    Siap Diambil
                                </span>
                            @endif
                        </div>

                        {{-- Transaksi + waktu --}}
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-xs font-semibold text-[#050316]/50">
                                Transaksi #{{ $order->transaction_id }}
                            </span>
                            <span class="flex items-center gap-1 text-[11px] font-semibold text-[#050316]/40 flex-shrink-0">
                                <iconify-icon icon="solar:clock-circle-bold-duotone" class="text-xs"></iconify-icon>
                                {{ $order->created_at->diffForHumans(null, true) }} lalu
                            </span>
                        </div>

                        {{-- Notes pesanan --}}
                        @if ($order->notes)
                            <div class="flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                <iconify-icon icon="solar:danger-triangle-bold-duotone"
                                    class="text-amber-500 text-sm flex-shrink-0 mt-0.5"></iconify-icon>
                                <p class="text-[11px] font-semibold text-amber-700 italic leading-relaxed">
                                    {{ $order->notes }}</p>
                            </div>
                        @endif

                        {{-- Items List --}}
                        <div class="border-t border-black/5 pt-3 space-y-2.5">
                            @foreach ($order->items as $item)
                                @php
                                    $catName = strtolower($item->menu->category->name ?? '');
                                    $isDrink =
                                        str_contains($catName, 'minum') ||
                                        str_contains($catName, 'drink') ||
                                        str_contains($catName, 'beverage') ||
                                        str_contains($catName, 'juice') ||
                                        str_contains($catName, 'coffee') ||
                                        str_contains($catName, 'tea');
                                @endphp
                                <div class="flex items-start gap-2.5">
                                    <span class="text-xs font-black text-[#443dff]/70 w-7 flex-shrink-0 pt-0.5">
                                        {{ $item->qty }}x
                                    </span>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-semibold text-[#050316] leading-snug">
                                            {{ $item->menu->name ?? '—' }}
                                        </p>
                                        @if ($item->notes)
                                            <p class="text-[10px] text-[#2f27ce]/60 mt-0.5 flex items-center gap-1 italic">
                                                <iconify-icon icon="solar:chat-round-line-linear"
                                                    class="text-[11px] flex-shrink-0"></iconify-icon>
                                                {{ $item->notes }}
                                            </p>
                                        @endif
                                    </div>
                                    @if ($isDrink)
                                        <iconify-icon icon="solar:cup-hot-bold-duotone"
                                            class="text-sky-400 text-sm flex-shrink-0 mt-0.5"></iconify-icon>
                                    @else
                                        <iconify-icon icon="solar:fire-bold-duotone"
                                            class="text-rose-400 text-sm flex-shrink-0 mt-0.5"></iconify-icon>
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    </div>

                    {{-- Action Buttons --}}
                    <div class="px-5 pb-5 flex gap-2.5">

                        @if ($order->status === 'pending')
                            <form method="POST" action="{{ route('kitchen-orders.prepare', $order->id) }}" class="flex-1">
                                @csrf
                                <button type="submit"
                                    class="w-full py-2.5 text-xs font-extrabold bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl transition-all shadow-md shadow-[#2f27ce]/20 active:scale-[0.98]">
                                    Mulai Memasak
                                </button>
                            </form>
                        @elseif ($order->status === 'preparing')
                            <a href="{{ route('kitchen-orders.show', $order->id) }}"
                                class="py-2.5 px-4 text-xs font-extrabold text-[#443dff] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff]/40 transition-colors flex items-center gap-1.5 flex-shrink-0">
                                <iconify-icon icon="solar:eye-bold-duotone" class="text-sm"></iconify-icon>
                                Detail
                            </a>
                            <form method="POST" action="{{ route('kitchen-orders.ready', $order->id) }}" class="flex-1">
                                @csrf
                                <button type="submit"
                                    class="w-full py-2.5 text-xs font-extrabold bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl transition-all shadow-md shadow-[#2f27ce]/20 active:scale-[0.98]">
                                    Siap Diambil
                                </button>
                            </form>
                        @elseif ($order->status === 'ready')
                            <a href="{{ route('kitchen-orders.show', $order->id) }}"
                                class="py-2.5 px-4 text-xs font-extrabold text-[#443dff] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff]/40 transition-colors flex items-center gap-1.5 flex-shrink-0">
                                <iconify-icon icon="solar:eye-bold-duotone" class="text-sm"></iconify-icon>
                                Detail
                            </a>
                            <form method="POST" action="{{ route('kitchen-orders.complete', $order->id) }}"
                                class="flex-1">
                                @csrf
                                <button type="submit"
                                    class="w-full py-2.5 text-xs font-extrabold bg-gradient-to-r from-[#443dff] to-[#2f27ce] hover:from-[#2f27ce] hover:to-[#050316] text-white rounded-xl transition-all shadow-md shadow-[#2f27ce]/20 active:scale-[0.98] flex items-center justify-center gap-2">
                                    <iconify-icon icon="solar:check-circle-bold" class="text-sm"></iconify-icon>
                                    Telah Diambil
                                </button>
                            </form>
                        @endif
                    </div>
                </div>

            @empty
                <div class="col-span-full bg-white rounded-2xl border border-[#dddbff] shadow-sm p-14 text-center">
                    <iconify-icon icon="solar:clipboard-list-bold-duotone" class="text-5xl text-[#dddbff]"></iconify-icon>
                    <p class="mt-3 text-sm font-bold text-[#2f27ce]">Tidak ada pesanan di dapur saat ini.</p>
                    <p class="text-xs text-[#2f27ce]/60 mt-1 font-medium">
                        Pesanan baru akan muncul di sini secara otomatis.
                    </p>
                </div>
            @endforelse
        </div>

        {{-- ====== TIPS BANNER ====== --}}
        <div
            class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div class="flex-1">
                <p class="text-sm font-extrabold text-[#443dff] mb-2 flex items-center gap-2">
                    <iconify-icon icon="solar:fire-bold-duotone" class="text-base"></iconify-icon>
                    Tips Dapur Hari Ini
                </p>
                <p class="text-xs font-medium text-[#2f27ce] leading-relaxed">
                    Ingat untuk menandai item yang sudah selesai secepat mungkin agar pelayan
                    dapat segera mengantarkannya ke pelanggan. Pesanan yang melebihi
                    <span class="font-extrabold text-[#050316]">15 menit</span>
                    akan otomatis ditandai terlambat.
                </p>
            </div>
            <div class="flex flex-wrap gap-3 flex-shrink-0">
                <a href="{{ route('targets-goals.index') }}"
                    class="px-5 py-2.5 text-xs font-extrabold text-[#2f27ce] bg-[#dddbff]/30 border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-colors">
                    Lihat Target Harian
                </a>
                <a href="{{ route('dashboard') }}"
                    class="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] rounded-xl transition-all shadow-sm shadow-[#2f27ce]/20">
                    Laporan Performa
                </a>
            </div>
        </div>

    </div>

    {{-- ====== AUTO REFRESH + LIVE CLOCK ====== --}}
    <script>
        function updateClock() {
            const now = new Date();
            document.getElementById('live-clock').textContent =
                now.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
        }
        updateClock();
        setInterval(updateClock, 1000);

    </script>

@endsection
