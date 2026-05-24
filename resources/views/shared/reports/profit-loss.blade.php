@extends('layouts.app')

@section('content')
<div class="min-h-screen font-inter bg-[#fbfbfe] text-[#050316]">
    <div class="p-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                Laporan Laba Rugi
            </h1>
            <a href="{{ route('reports.export.excel') }}" class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98] duration-150">
                <iconify-icon icon="solar:download-square-linear" class="text-lg"></iconify-icon>
                Ekspor Excel
            </a>
        </div>

        <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
            <div class="space-y-6">
                <!-- Summary Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="bg-[#ecfdf5] rounded-xl p-4 border border-[#bbf7d0]/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-medium text-[#10b981]">Total Pendapatan</p>
                                <p class="text-2xl font-bold text-[#050316] mt-1">Rp {{ number_format($revenue, 0, ',', '.') }}</p>
                            </div>
                            <div class="flex h-10 w-10 items-center justify-center bg-[#10b981]/10 rounded-lg">
                                <iconify-icon icon="solar:wad-of-money-linear" class="text-[#10b981]"></iconify-icon>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-[#fef2f2] rounded-xl p-4 border border-[#fecaca]/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-medium text-[#ef4444]">Total Transaksi</p>
                                <p class="text-2xl font-bold text-[#050316] mt-1">{{ number_format($transactions) }}</p>
                            </div>
                            <div class="flex h-10 w-10 items-center justify-center bg-[#ef4444]/10 rounded-lg">
                                <iconify-icon icon="solar:shopping-bag-linear" class="text-[#ef4444]"></iconify-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Metrics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl p-4 border border-[#dddbff]/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-medium text-[#2f27ce]/70">Rata-rata Transaksi</p>
                                <p class="text-lg font-bold text-[#050316] mt-1">
                                    Rp {{ $transactions > 0 ? number_format($revenue / $transactions, 0, ',', '.') : '0' }}
                                </p>
                            </div>
                            <div class="flex h-8 w-8 items-center justify-center bg-[#2f27ce]/10 rounded-lg">
                                <iconify-icon icon="solar:receipt-2-linear" class="text-[#2f27ce]"></iconify-icon>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border border-[#dddbff]/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-medium text-[#2f27ce]/70">Estimasi Laba Bersih</p>
                                <p class="text-lg font-bold text-[#050316] mt-1">
                                    Rp {{ $transactions > 0 ? number_format(($revenue * 0.3), 0, ',', '.') : '0' }}
                                </p>
                            </div>
                            <div class="flex h-8 w-8 items-center justify-center bg-[#2f27ce]/10 rounded-lg">
                                <iconify-icon icon="solar:chart-square-linear" class="text-[#2f27ce]"></iconify-icon>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border border-[#dddbff]/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-medium text-[#2f27ce]/70">Margin Laba</p>
                                <p class="text-lg font-bold text-[#050316] mt-1">30%</p>
                            </div>
                            <div class="flex h-8 w-8 items-center justify-center bg-[#2f27ce]/10 rounded-lg">
                                <iconify-icon icon="solar:percent-linear" class="text-[#2f27ce]"></iconify-icon>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border border-[#dddbff]/50">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs font-medium text-[#2f27ce]/70">Biaya Operasional</p>
                                <p class="text-lg font-bold text-[#050316] mt-1">
                                    Rp {{ $transactions > 0 ? number_format(($revenue * 0.7), 0, ',', '.') : '0' }}
                                </p>
                            </div>
                            <div class="flex h-8 w-8 items-center justify-center bg-[#2f27ce]/10 rounded-lg">
                                <iconify-icon icon="solar:settings-2-linear" class="text-[#2f27ce]"></iconify-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Transactions -->
                @php
                    $recentTransactions = \App\Models\Transaction::where('status', 'completed')
                        ->with('cashier')
                        ->latest()
                        ->take(10)
                        ->get();
                @endphp
                <div>
                    <h2 class="text-xl font-bold text-[#050316] mb-4">Transaksi Terbaru</h2>
                    @if($recentTransactions->isEmpty())
                        <p class="text-center py-8 text-[#2f27ce]/50">Belum ada transaksi yang tercatat.</p>
                    @else
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="text-xs font-bold text-[#2f27ce]/70 border-b border-[#dddbff]">
                                        <th class="pb-3">#</th>
                                        <th class="pb-3">Kasir</th>
                                        <th class="pb-3">Total</th>
                                        <th class="pb-3">Status</th>
                                        <th class="pb-3">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#dddbff]/50">
                                    @foreach($recentTransactions as $index => $transaction)
                                        <tr class="hover:bg-[#dddbff]/30 transition-colors duration-150">
                                            <td class="py-3 text-sm font-medium text-[#050316]">{{ $index + 1 }}</td>
                                            <td class="py-3 text-sm text-[#050316]">{{ $transaction->cashier?->name ?? '-' }}</td>
                                            <td class="py-3 text-sm font-medium text-[#050316]">Rp {{ number_format($transaction->total_amount, 0, ',', '.') }}</td>
                                            <td class="py-3">
                                                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold
                                                    {{ $transaction->status == 'completed' ? 'bg-[#ecfdf5] text-[#10b981]' : 'bg-[#fef2f2] text-[#ef4444]' }}">
                                                    {{ ucfirst($transaction->status) }}
                                                </span>
                                            </td>
                                            <td class="py-3 text-sm text-[#050316]">{{ $transaction->created_at->format('d M Y H:i') }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection