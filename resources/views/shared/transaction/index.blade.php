@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <div class="max-w-6xl mx-auto space-y-6">

        {{-- Header --}}
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
                <p class="text-sm text-gray-400 mt-1">Kelola dan tinjau semua aktivitas penjualan hari ini.</p>
            </div>
            <div class="flex items-center gap-3">
                <button class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition shadow-sm">
                    <iconify-icon icon="solar:download-linear"></iconify-icon>
                    Ekspor Laporan
                </button>

                {{-- Date Filter --}}
                <form method="GET" action="{{ route('transactions.index') }}" id="date-form">
                    @foreach(request()->except('date', 'page') as $key => $val)
                        <input type="hidden" name="{{ $key }}" value="{{ $val }}">
                    @endforeach
                    <div class="relative">
                        <input type="date" name="date" value="{{ request('date') }}"
                            onchange="document.getElementById('date-form').submit()"
                            class="appearance-none pl-10 pr-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300 transition [color-scheme:dark]">
                        <iconify-icon icon="solar:calendar-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-white text-base pointer-events-none"></iconify-icon>
                    </div>
                </form>
            </div>
        </div>

        {{-- Stat Cards --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <iconify-icon icon="solar:card-linear" class="text-xl"></iconify-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-400 font-medium">Total Penjualan</p>
                    <p class="text-xl font-bold text-gray-900 leading-tight">Rp 4.250.000</p>
                </div>
                <span class="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg flex-shrink-0">+12.5%</span>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <iconify-icon icon="solar:cart-large-2-linear" class="text-xl"></iconify-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-400 font-medium">Jumlah Transaksi</p>
                    <p class="text-xl font-bold text-gray-900 leading-tight">48</p>
                </div>
                <span class="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg flex-shrink-0">+5.2%</span>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <iconify-icon icon="solar:wallet-linear" class="text-xl"></iconify-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-400 font-medium">Rata-rata Pesanan</p>
                    <p class="text-xl font-bold text-gray-900 leading-tight">Rp 88.540</p>
                </div>
                <span class="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg flex-shrink-0">2.1%</span>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <iconify-icon icon="solar:restart-circle-linear" class="text-xl"></iconify-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-400 font-medium">Refund / Batal</p>
                    <p class="text-xl font-bold text-gray-900 leading-tight">2</p>
                </div>
                <span class="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg flex-shrink-0">+0.5%</span>
            </div>
        </div>

        {{-- Table Card --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {{-- Table Header --}}
            <form method="GET" action="{{ route('transactions.index') }}" id="filter-form">

                {{-- Preserve date if set --}}
                @if(request('date'))
                    <input type="hidden" name="date" value="{{ request('date') }}">
                @endif

                <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-bold text-gray-900">Daftar Transaksi</h2>

                    <div class="flex flex-wrap items-center gap-2">

                        {{-- Search --}}
                        <div class="relative">
                            <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]"></iconify-icon>
                            <input type="text" name="search" value="{{ request('search') }}"
                                placeholder="Cari ID Invoice..."
                                class="w-[200px] h-[38px] bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition">
                        </div>

                        {{-- Filter Status --}}
                        <select name="status" onchange="document.getElementById('filter-form').submit()"
                            class="h-[38px] bg-gray-50 border border-gray-200 rounded-xl px-3 text-[13px] text-gray-600 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition cursor-pointer">
                            <option value="">Semua Status</option>
                            <option value="completed" {{ request('status') === 'completed' ? 'selected' : '' }}>Selesai</option>
                            <option value="pending"   {{ request('status') === 'pending'   ? 'selected' : '' }}>Pending</option>
                            <option value="cancelled" {{ request('status') === 'cancelled' ? 'selected' : '' }}>Dibatalkan</option>
                            <option value="refunded"  {{ request('status') === 'refunded'  ? 'selected' : '' }}>Refund</option>
                        </select>

                        {{-- Filter Metode --}}
                        <select name="method" onchange="document.getElementById('filter-form').submit()"
                            class="h-[38px] bg-gray-50 border border-gray-200 rounded-xl px-3 text-[13px] text-gray-600 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition cursor-pointer">
                            <option value="">Semua Metode</option>
                            <option value="cash"     {{ request('method') === 'cash'     ? 'selected' : '' }}>Cash</option>
                            <option value="qris"     {{ request('method') === 'qris'     ? 'selected' : '' }}>QRIS</option>
                            <option value="transfer" {{ request('method') === 'transfer' ? 'selected' : '' }}>Transfer</option>
                            <option value="debit"    {{ request('method') === 'debit'    ? 'selected' : '' }}>Debit</option>
                        </select>

                        {{-- Search Button --}}
                        <button type="submit"
                            class="h-[38px] px-4 bg-emerald-500 text-white rounded-xl text-[13px] font-semibold hover:bg-emerald-600 transition">
                            Cari
                        </button>

                        {{-- Reset --}}
                        @if(request()->hasAny(['search', 'status', 'method', 'date']))
                            <a href="{{ route('transactions.index') }}"
                                class="h-[38px] px-3 bg-gray-100 text-gray-500 rounded-xl text-[13px] font-semibold hover:bg-gray-200 transition flex items-center gap-1">
                                <iconify-icon icon="solar:close-circle-linear"></iconify-icon>
                                Reset
                            </a>
                        @endif

                    </div>
                </div>
            </form>

            {{-- Active Filter Badges --}}
            @if(request()->hasAny(['search', 'status', 'method', 'date']))
            <div class="flex flex-wrap gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100">
                @if(request('search'))
                    <span class="inline-flex items-center gap-1 text-[12px] font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                        <iconify-icon icon="solar:magnifer-linear" class="text-gray-400"></iconify-icon>
                        {{ request('search') }}
                    </span>
                @endif
                @if(request('status'))
                    <span class="inline-flex items-center gap-1 text-[12px] font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                        <iconify-icon icon="solar:tag-linear" class="text-gray-400"></iconify-icon>
                        Status: {{ ucfirst(request('status')) }}
                    </span>
                @endif
                @if(request('method'))
                    <span class="inline-flex items-center gap-1 text-[12px] font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                        <iconify-icon icon="solar:wallet-linear" class="text-gray-400"></iconify-icon>
                        Metode: {{ ucfirst(request('method')) }}
                    </span>
                @endif
                @if(request('date'))
                    <span class="inline-flex items-center gap-1 text-[12px] font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                        <iconify-icon icon="solar:calendar-linear" class="text-gray-400"></iconify-icon>
                        {{ \Carbon\Carbon::parse(request('date'))->translatedFormat('d F Y') }}
                    </span>
                @endif
            </div>
            @endif

            {{-- Table --}}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-100">
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID Invoice</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Waktu</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kasir</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Item</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Tagihan</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Metode</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">

                        @forelse($transactions as $trx)
                        <tr class="hover:bg-gray-50/60 transition group">
                            <td class="px-6 py-4 text-[13px] font-semibold text-gray-800">
                                {{ $trx->id }}
                            </td>
                            <td class="px-6 py-4 text-[13px] text-gray-500">
                                {{ $trx->created_at->format('H:i') }}
                            </td>
                            <td class="px-6 py-4 text-[13px] text-gray-700 font-medium">
                                {{ $trx->cashier->name ?? '-' }}
                            </td>
                            <td class="px-6 py-4 text-[13px] text-gray-500">
                                {{ $trx->items->sum('qty') }} pcs
                            </td>
                            <td class="px-6 py-4 text-[13px] font-bold text-gray-900">
                                Rp {{ number_format($trx->total_amount, 0, ',', '.') }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-[12px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                                    {{ strtoupper($trx->payment_method) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                @if($trx->status === 'completed')
                                    <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                                        <iconify-icon icon="solar:check-circle-linear" class="text-[13px]"></iconify-icon>
                                        Selesai
                                    </span>
                                @elseif($trx->status === 'pending')
                                    <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                                        <iconify-icon icon="solar:clock-circle-linear" class="text-[13px]"></iconify-icon>
                                        Pending
                                    </span>
                                @elseif($trx->status === 'refunded')
                                    <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                                        <iconify-icon icon="solar:restart-circle-linear" class="text-[13px]"></iconify-icon>
                                        Refund
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                                        <iconify-icon icon="solar:close-circle-linear" class="text-[13px]"></iconify-icon>
                                        Dibatalkan
                                    </span>
                                @endif
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="7" class="px-6 py-16 text-center">
                                <div class="flex flex-col items-center gap-2 text-gray-400">
                                    <iconify-icon icon="solar:inbox-linear" class="text-4xl"></iconify-icon>
                                    <p class="text-sm font-medium">Tidak ada transaksi ditemukan</p>
                                    @if(request()->hasAny(['search', 'status', 'method', 'date']))
                                        <a href="{{ route('transactions.index') }}" class="text-xs text-emerald-500 hover:underline">Reset filter</a>
                                    @endif
                                </div>
                            </td>
                        </tr>
                        @endforelse

                    </tbody>
                </table>
            </div>

            {{-- Pagination --}}
            <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <span class="text-[13px] text-gray-400">
                    Menampilkan {{ $transactions->firstItem() ?? 0 }}–{{ $transactions->lastItem() ?? 0 }}
                    dari {{ $transactions->total() }} transaksi
                </span>
                <div class="flex items-center gap-2">
                    @if($transactions->onFirstPage())
                        <button class="px-4 py-2 text-[13px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed" disabled>
                            Sebelumnya
                        </button>
                    @else
                        <a href="{{ $transactions->previousPageUrl() }}"
                           class="px-4 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                            Sebelumnya
                        </a>
                    @endif

                    @if($transactions->hasMorePages())
                        <a href="{{ $transactions->nextPageUrl() }}"
                           class="px-4 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                            Selanjutnya
                        </a>
                    @else
                        <button class="px-4 py-2 text-[13px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed" disabled>
                            Selanjutnya
                        </button>
                    @endif
                </div>
            </div>

        </div>
    </div>
</div>
@endsection