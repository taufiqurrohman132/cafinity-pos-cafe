@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <div class="max-w-5xl mx-auto space-y-6">
        {{-- Header --}}
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Detail Transaksi</h1>
                <p class="text-sm text-gray-400 mt-1">Invoice #{{ $transaction->id }}</p>
            </div>

            <div class="flex items-center gap-3">
                <form method="POST" action="{{ route('transactions.print', $transaction->id) }}">
                    @csrf
                    <button type="submit" class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition shadow-sm">
                        <iconify-icon icon="solar:printer-minimalistic-bold"></iconify-icon>
                        Cetak
                    </button>
                </form>

                <form method="POST" action="{{ route('transactions.refund', $transaction->id) }}">
                    @csrf
                    <button type="submit" class="px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition shadow-sm"
                        onclick="return confirm('Yakin refund transaksi ini?')">
                        <iconify-icon icon="solar:refresh-circle-broken-bold"></iconify-icon>
                        Refund
                    </button>
                </form>
            </div>
        </div>

        {{-- Summary --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p class="text-xs text-gray-400 font-medium">Kasir</p>
                <p class="text-base font-semibold text-gray-900 mt-1">{{ $transaction->cashier?->name ?? '-' }}</p>

                <div class="mt-4">
                    <p class="text-xs text-gray-400 font-medium">Waktu</p>
                    <p class="text-base font-semibold text-gray-900 mt-1">{{ optional($transaction->created_at)->format('d M Y, H:i') ?? '-' }}</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p class="text-xs text-gray-400 font-medium">Status</p>
                <div class="mt-2">
                    @if($transaction->status === 'completed')
                        <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                            <iconify-icon icon="solar:check-circle-linear" class="text-[13px]"></iconify-icon>
                            Selesai
                        </span>
                    @elseif($transaction->status === 'pending')
                        <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                            <iconify-icon icon="solar:clock-circle-linear" class="text-[13px]"></iconify-icon>
                            Pending
                        </span>
                    @else
                        <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                            <iconify-icon icon="solar:close-circle-linear" class="text-[13px]"></iconify-icon>
                            {{ ucfirst($transaction->status) }}
                        </span>
                    @endif
                </div>

                <div class="mt-4">
                    <p class="text-xs text-gray-400 font-medium">Metode Pembayaran</p>
                    <p class="text-base font-semibold text-gray-900 mt-1">{{ $transaction->payment_method ?? '-' }}</p>
                </div>
            </div>
        </div>

        {{-- Items --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h2 class="text-base font-bold text-gray-900">Item Transaksi</h2>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-100">
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Menu</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Qty</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subtotal</th>
                            <th class="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Catatan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($transaction->items as $item)
                            <tr class="hover:bg-gray-50/60 transition group">
                                <td class="px-6 py-4 text-[13px] text-gray-800 font-medium">
                                    {{ $item->menu?->name ?? 'Menu' }}
                                </td>
                                <td class="px-6 py-4 text-[13px] text-gray-600">
                                    {{ $item->qty }}
                                </td>
                                <td class="px-6 py-4 text-[13px] text-gray-600">
                                    Rp {{ number_format($item->price ?? 0, 0, ',', '.') }}
                                </td>
                                <td class="px-6 py-4 text-[13px] font-bold text-gray-900">
                                    Rp {{ number_format($item->subtotal ?? 0, 0, ',', '.') }}
                                </td>
                                <td class="px-6 py-4 text-[13px] text-gray-600">
                                    {{ $item->notes ?? '-' }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-6 text-center text-gray-400">
                                    Tidak ada item.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Totals --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
                <h2 class="text-base font-bold text-gray-900">Ringkasan</h2>

                <div class="mt-4 space-y-2 text-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">Diskon</span>
                        <span class="font-semibold text-gray-900">Rp {{ number_format($transaction->discount ?? 0, 0, ',', '.') }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">Pajak</span>
                        <span class="font-semibold text-gray-900">Rp {{ number_format($transaction->tax ?? 0, 0, ',', '.') }}</span>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span class="text-gray-800 font-semibold">Total</span>
                        <span class="text-gray-900 font-bold">
                            Rp {{ number_format($transaction->total_amount ?? 0, 0, ',', '.') }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">Dibayar</span>
                        <span class="font-semibold text-gray-900">Rp {{ number_format($transaction->paid_amount ?? 0, 0, ',', '.') }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">Kembalian</span>
                        <span class="font-semibold text-gray-900">Rp {{ number_format($transaction->change_amount ?? 0, 0, ',', '.') }}</span>
                    </div>
                </div>

                @if(!empty($transaction->notes))
                    <div class="mt-4">
                        <p class="text-xs text-gray-400 font-medium">Notes</p>
                        <p class="text-sm font-medium text-gray-800 mt-1">{{ $transaction->notes }}</p>
                    </div>
                @endif
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 class="text-base font-bold text-gray-900">Kitchen Order</h2>

                <div class="mt-4 space-y-2">
                    <p class="text-xs text-gray-400 font-medium">Status</p>
                    <p class="text-sm font-semibold text-gray-800">
                        {{ $transaction->kitchenOrder?->status ?? '-' }}
                    </p>
                </div>

                <div class="mt-4">
                    <p class="text-xs text-gray-400 font-medium">Items</p>

                    <div class="mt-2 space-y-2">
                        @forelse($transaction->kitchenOrder?->items ?? [] as $kItem)
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-700">{{ $kItem->menu?->name ?? 'Menu' }}</span>
                                <span class="font-semibold text-gray-900">x{{ $kItem->qty }}</span>
                            </div>
                        @empty
                            <p class="text-sm text-gray-400">Belum ada data.</p>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
