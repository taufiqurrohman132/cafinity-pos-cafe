@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <div class="max-w-3xl mx-auto space-y-6">

        {{-- Header --}}
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Invoice</h1>
                <p class="text-sm text-gray-400 mt-1">#{{ $transaction->id }} • {{ optional($transaction->created_at)->format('d M Y, H:i') }}</p>
            </div>

            <div class="flex items-center gap-3">
                <a href="{{ route('transactions.show', $transaction->id) }}" class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition shadow-sm inline-flex items-center gap-2">
                    <iconify-icon icon="solar:arrow-left-linear"></iconify-icon>
                    Kembali
                </a>

                <form method="POST" action="{{ route('transactions.print', $transaction->id) }}">
                    @csrf
                    <button type="submit" class="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition shadow-sm inline-flex items-center gap-2">
                        <iconify-icon icon="solar:printer-minimalistic-bold"></iconify-icon>
                        Cetak
                    </button>
                </form>
            </div>
        </div>

        {{-- Invoice Card --}}
        <div id="invoice-print" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-xs text-gray-400 font-medium">Kasir</p>
                        <p class="text-base font-semibold text-gray-900 mt-1">{{ $transaction->cashier?->name ?? '-' }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400 font-medium">Metode</p>
                        <p class="text-base font-semibold text-gray-900 mt-1">{{ $transaction->payment_method ?? '-' }}</p>
                    </div>
                </div>
            </div>

            <div class="px-6 py-5">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-100">
                                <th class="text-left py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Item</th>
                                <th class="text-left py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Qty</th>
                                <th class="text-left py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                                <th class="text-right py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subtotal</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-50">
                            @forelse($transaction->items as $item)
                                <tr>
                                    <td class="py-4 pr-3 text-[13px] text-gray-800 font-medium">
                                        {{ $item->menu?->name ?? 'Menu' }}
                                        @if(!empty($item->notes))
                                            <div class="text-[12px] text-gray-500 font-medium mt-1">
                                                {{ $item->notes }}
                                            </div>
                                        @endif
                                    </td>
                                    <td class="py-4 text-[13px] text-gray-600">{{ $item->qty }}</td>
                                    <td class="py-4 text-[13px] text-gray-600">Rp {{ number_format($item->price ?? 0, 0, ',', '.') }}</td>
                                    <td class="py-4 text-[13px] font-bold text-gray-900 text-right">
                                        Rp {{ number_format($item->subtotal ?? 0, 0, ',', '.') }}
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="py-6 text-center text-gray-400">Tidak ada item.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 space-y-2 text-sm">
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
                        <span class="text-gray-900 font-bold">Rp {{ number_format($transaction->total_amount ?? 0, 0, ',', '.') }}</span>
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

            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <p class="text-xs text-gray-500">
                    Status: <span class="font-semibold text-gray-800">{{ ucfirst($transaction->status ?? '-') }}</span>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
