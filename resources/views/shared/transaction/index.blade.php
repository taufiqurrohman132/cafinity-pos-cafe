@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#fbfbfe] p-6 md:p-8">
        <div class="max-w-6xl mx-auto space-y-6">

            {{-- Header --}}
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1
                        class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#000000] to-[#2f27ce] tracking-tight">
                        Riwayat Transaksi</h1>
                    <p class="text-sm text-[#2f27ce] font-medium mt-1">Kelola dan tinjau semua aktivitas penjualan hari ini.
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <a href="{{ route('transactions.export', request()->query()) }}"
                        class="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#dddbff] rounded-xl text-sm font-bold text-[#2f27ce] hover:bg-[#dddbff]/50 hover:text-[#050316] transition-all shadow-sm">
                        <iconify-icon icon="solar:download-linear" class="text-lg"></iconify-icon>
                        Ekspor Laporan
                    </a>

                    {{-- Date Filter --}}
                    <form method="GET" action="{{ route('transactions.index') }}" id="date-form">
                        @foreach (request()->except('date', 'page') as $key => $val)
                            <input type="hidden" name="{{ $key }}" value="{{ $val }}">
                        @endforeach
                        <div class="relative">
                            <input type="date" name="date" value="{{ request('date') }}"
                                onchange="document.getElementById('date-form').submit()"
                                class="appearance-none pl-10 pr-4 py-2.5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white rounded-xl text-sm font-bold cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#dddbff] focus:border-[#2f27ce] transition-all shadow-lg shadow-[#443dff]/30 [color-scheme:dark]">
                            <iconify-icon icon="solar:calendar-linear"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-white text-base pointer-events-none"></iconify-icon>
                        </div>
                    </form>
                </div>
            </div>

            {{-- Stat Cards --}}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4 group hover:shadow-lg hover:shadow-[#443dff]/10 hover:border-[#443dff] transition-all">
                    <div
                        class="w-11 h-11 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#443dff] flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#443dff] group-hover:to-[#2f27ce] group-hover:text-white transition-all">
                        <iconify-icon icon="solar:card-linear" class="text-xl"></iconify-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-[#2f27ce] font-extrabold uppercase tracking-wide">Total Penjualan</p>
                        <p class="text-xl font-black text-[#050316] leading-tight">
                            Rp {{ number_format($totalRevenue, 0, ',', '.') }}
                        </p>
                    </div>
                    <span
                        class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg flex-shrink-0">+12.5%</span>
                </div>
                <div
                    class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4 group hover:shadow-lg hover:shadow-[#443dff]/10 hover:border-[#443dff] transition-all">
                    <div
                        class="w-11 h-11 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#443dff] flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#443dff] group-hover:to-[#2f27ce] group-hover:text-white transition-all">
                        <iconify-icon icon="solar:cart-large-2-linear" class="text-xl"></iconify-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-[#2f27ce] font-extrabold uppercase tracking-wide">Jumlah Transaksi</p>
                        <p class="text-xl font-black text-[#050316] leading-tight">
                            {{ $totalTransactions }}
                        </p>
                    </div>
                    <span
                        class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg flex-shrink-0">+5.2%</span>
                </div>
                <div
                    class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4 group hover:shadow-lg hover:shadow-[#443dff]/10 hover:border-[#443dff] transition-all">
                    <div
                        class="w-11 h-11 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#443dff] flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#443dff] group-hover:to-[#2f27ce] group-hover:text-white transition-all">
                        <iconify-icon icon="solar:wallet-linear" class="text-xl"></iconify-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-[#2f27ce] font-extrabold uppercase tracking-wide">Rata-rata Pesanan</p>
                        <p class="text-xl font-black text-[#050316] leading-tight">
                            Rp {{ number_format($avgOrder, 0, ',', '.') }}
                        </p>
                    </div>
                    <span
                        class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg flex-shrink-0">2.1%</span>
                </div>
                <div
                    class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 flex items-center gap-4 group hover:shadow-lg hover:shadow-[#443dff]/10 hover:border-[#443dff] transition-all">
                    <div
                        class="w-11 h-11 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#443dff] flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#443dff] group-hover:to-[#2f27ce] group-hover:text-white transition-all">
                        <iconify-icon icon="solar:restart-circle-linear" class="text-xl"></iconify-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-[#2f27ce] font-extrabold uppercase tracking-wide">Refund / Batal</p>
                        <p class="text-xl font-black text-[#050316] leading-tight">
                            {{ $totalRefundCancel }}
                        </p>
                    </div>
                    <span
                        class="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-lg flex-shrink-0">+0.5%</span>
                </div>
            </div>

            {{-- Table Card --}}
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                {{-- Table Header --}}
                <form method="GET" action="{{ route('transactions.index') }}" id="filter-form">

                    @if (request('date'))
                        <input type="hidden" name="date" value="{{ request('date') }}">
                    @endif

                    <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#dddbff]/50">
                        <h2 class="text-base font-extrabold text-[#050316]">Daftar Transaksi</h2>

                        <div class="flex flex-wrap items-center gap-2">

                            {{-- Search --}}
                            <div class="relative">
                                <iconify-icon icon="solar:magnifer-linear"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-[#2f27ce]/70 text-[15px]"></iconify-icon>
                                <input type="text" name="search" value="{{ request('search') }}"
                                    placeholder="Cari ID Invoice..."
                                    class="w-[200px] h-[38px] bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-9 pr-4 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/50 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                            </div>

                            {{-- Filter Status --}}
                            <select name="status" onchange="document.getElementById('filter-form').submit()"
                                class="h-[38px] bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-3 text-[13px] font-bold text-[#2f27ce] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer">
                                <option value="">Semua Status</option>
                                <option value="completed" {{ request('status') === 'completed' ? 'selected' : '' }}>Selesai
                                </option>
                                <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending
                                </option>
                                <option value="cancelled" {{ request('status') === 'cancelled' ? 'selected' : '' }}>
                                    Dibatalkan</option>
                                <option value="refunded" {{ request('status') === 'refunded' ? 'selected' : '' }}>Refund
                                </option>
                            </select>

                            {{-- Filter Metode --}}
                            <select name="method" onchange="document.getElementById('filter-form').submit()"
                                class="h-[38px] bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-3 text-[13px] font-bold text-[#2f27ce] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer">
                                <option value="">Semua Metode</option>
                                <option value="cash" {{ request('method') === 'cash' ? 'selected' : '' }}>Cash
                                </option>
                                <option value="qris" {{ request('method') === 'qris' ? 'selected' : '' }}>QRIS
                                </option>
                                <option value="transfer" {{ request('method') === 'transfer' ? 'selected' : '' }}>Transfer
                                </option>
                                <option value="debit" {{ request('method') === 'debit' ? 'selected' : '' }}>Debit
                                </option>
                            </select>

                            {{-- Search Button --}}
                            <button type="submit"
                                class="h-[38px] px-5 bg-gradient-to-r from-[#443dff] to-[#2f27ce] text-white rounded-xl text-[13px] font-extrabold hover:from-[#2f27ce] hover:to-[#050316] shadow-lg shadow-[#443dff]/40 transition-all active:scale-95">
                                Cari
                            </button>

                            {{-- Reset --}}
                            @if (request()->hasAny(['search', 'status', 'method', 'date']))
                                <a href="{{ route('transactions.index') }}"
                                    class="h-[38px] px-3 bg-[#dddbff]/30 text-[#2f27ce] rounded-xl text-[13px] font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all flex items-center gap-1 border border-transparent hover:border-[#dddbff]">
                                    <iconify-icon icon="solar:close-circle-bold" class="text-[16px]"></iconify-icon>
                                    Reset
                                </a>
                            @endif

                        </div>
                    </div>
                </form>

                {{-- Active Filter Badges --}}
                @if (request()->hasAny(['search', 'status', 'method', 'date']))
                    <div
                        class="flex flex-wrap gap-2 px-6 py-3 bg-gradient-to-r from-[#dddbff]/10 to-[#fbfbfe] border-b border-[#dddbff]/50">
                        @if (request('search'))
                            <span
                                class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                <iconify-icon icon="solar:magnifer-linear" class="text-[#443dff]"></iconify-icon>
                                {{ request('search') }}
                            </span>
                        @endif
                        @if (request('status'))
                            <span
                                class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                <iconify-icon icon="solar:tag-linear" class="text-[#443dff]"></iconify-icon>
                                Status: {{ ucfirst(request('status')) }}
                            </span>
                        @endif
                        @if (request('method'))
                            <span
                                class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                <iconify-icon icon="solar:wallet-linear" class="text-[#443dff]"></iconify-icon>
                                Metode: {{ ucfirst(request('method')) }}
                            </span>
                        @endif
                        @if (request('date'))
                            <span
                                class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#050316] bg-white border border-[#dddbff] px-2.5 py-1 rounded-lg shadow-sm">
                                <iconify-icon icon="solar:calendar-linear" class="text-[#443dff]"></iconify-icon>
                                {{ \Carbon\Carbon::parse(request('date'))->translatedFormat('d F Y') }}
                            </span>
                        @endif
                    </div>
                @endif

                {{-- Table --}}
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-[#dddbff] bg-gradient-to-r from-[#fbfbfe] to-[#dddbff]/20">
                                <th
                                    class="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    ID Invoice</th>
                                <th
                                    class="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Waktu</th>
                                <th
                                    class="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Kasir</th>
                                <th
                                    class="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Item</th>
                                <th
                                    class="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Total Tagihan</th>
                                <th
                                    class="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Metode</th>
                                <th
                                    class="text-left px-6 py-3 text-[11px] font-extrabold text-[#2f27ce] uppercase tracking-wider">
                                    Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#dddbff]/50">

                            @forelse($transactions as $trx)
                                <tr
                                    class="hover:bg-gradient-to-r hover:from-[#dddbff]/10 hover:to-transparent transition-colors group">
                                    <td class="px-6 py-4 text-[13px] font-extrabold text-[#050316]">
                                        {{ $trx->id }}
                                    </td>
                                    <td class="px-6 py-4 text-[13px] font-medium text-[#2f27ce]">
                                        {{ $trx->created_at->format('H:i') }}
                                    </td>
                                    <td class="px-6 py-4 text-[13px] text-[#050316] font-semibold">
                                        {{ $trx->cashier->name ?? '-' }}
                                    </td>
                                    <td class="px-6 py-4 text-[13px] font-medium text-[#2f27ce]">
                                        <span
                                            class="bg-gradient-to-r from-[#dddbff]/40 to-[#dddbff]/20 px-2 py-1 rounded-md">{{ $trx->items->sum('qty') }}
                                            pcs</span>
                                    </td>
                                    <td
                                        class="px-6 py-4 text-[14px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#443dff] to-[#2f27ce]">
                                        Rp {{ number_format($trx->total_amount, 0, ',', '.') }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="text-[11px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-[#dddbff]/50 to-[#dddbff]/20 border border-[#dddbff] px-2.5 py-1 rounded-lg">
                                            {{ strtoupper($trx->payment_method) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        @if ($trx->status === 'completed')
                                            <span
                                                class="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                                <iconify-icon icon="solar:check-circle-bold"
                                                    class="text-[13px]"></iconify-icon>
                                                Selesai
                                            </span>
                                        @elseif($trx->status === 'pending')
                                            <span
                                                class="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                                <iconify-icon icon="solar:clock-circle-bold"
                                                    class="text-[13px]"></iconify-icon>
                                                Pending
                                            </span>
                                        @elseif($trx->status === 'refunded')
                                            <span
                                                class="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-[#dddbff] to-[#dddbff]/50 border border-[#dddbff] px-2.5 py-1 rounded-full">
                                                <iconify-icon icon="solar:restart-circle-bold"
                                                    class="text-[13px]"></iconify-icon>
                                                Refund
                                            </span>
                                        @else
                                            <span
                                                class="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                                                <iconify-icon icon="solar:close-circle-bold"
                                                    class="text-[13px]"></iconify-icon>
                                                Dibatalkan
                                            </span>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="7" class="px-6 py-16 text-center">
                                        <div class="flex flex-col items-center gap-3 text-[#2f27ce]">
                                            <div
                                                class="w-16 h-16 rounded-full bg-gradient-to-br from-[#dddbff]/50 to-[#dddbff]/20 flex items-center justify-center">
                                                <iconify-icon icon="solar:inbox-line-duotone"
                                                    class="text-4xl text-[#443dff]"></iconify-icon>
                                            </div>
                                            <p class="text-sm font-bold text-[#050316]">Tidak ada transaksi ditemukan</p>
                                            @if (request()->hasAny(['search', 'status', 'method', 'date']))
                                                <a href="{{ route('transactions.index') }}"
                                                    class="text-xs font-bold text-[#443dff] hover:text-[#2f27ce] hover:underline transition-colors">Reset
                                                    semua filter</a>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @endforelse

                        </tbody>
                    </table>
                </div>

                {{-- Pagination --}}
                <div
                    class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#dddbff]/50 bg-gradient-to-r from-[#fbfbfe] to-[#dddbff]/10">
                    <span class="text-[12px] font-medium text-[#2f27ce]">
                        Menampilkan <span
                            class="font-bold text-[#050316]">{{ $transactions->firstItem() ?? 0 }}</span>–<span
                            class="font-bold text-[#050316]">{{ $transactions->lastItem() ?? 0 }}</span>
                        dari <span class="font-bold text-[#050316]">{{ $transactions->total() }}</span> transaksi
                    </span>
                    <div class="flex items-center gap-2">
                        @if ($transactions->onFirstPage())
                            <button
                                class="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed"
                                disabled>
                                &larr; Sebelumnya
                            </button>
                        @else
                            <a href="{{ $transactions->previousPageUrl() }}"
                                class="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-white to-[#dddbff]/30 border border-[#dddbff] rounded-xl hover:from-[#dddbff] hover:to-[#dddbff]/50 hover:text-[#050316] transition-all shadow-sm">
                                &larr; Sebelumnya
                            </a>
                        @endif

                        @if ($transactions->hasMorePages())
                            <a href="{{ $transactions->nextPageUrl() }}"
                                class="px-4 py-2 text-[12px] font-extrabold text-[#2f27ce] bg-gradient-to-r from-white to-[#dddbff]/30 border border-[#dddbff] rounded-xl hover:from-[#dddbff] hover:to-[#dddbff]/50 hover:text-[#050316] transition-all shadow-sm">
                                Selanjutnya &rarr;
                            </a>
                        @else
                            <button
                                class="px-4 py-2 text-[12px] font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed"
                                disabled>
                                Selanjutnya &rarr;
                            </button>
                        @endif
                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
