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
                <button class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition shadow-sm">
                    <iconify-icon icon="solar:calendar-linear"></iconify-icon>
                    Pilih Tanggal
                </button>
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
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 class="text-base font-bold text-gray-900">Daftar Transaksi</h2>
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <iconify-icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]"></iconify-icon>
                        <input type="text" placeholder="Cari ID Invoice..."
                            class="w-[220px] h-[38px] bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition">
                    </div>
                    <button class="w-[38px] h-[38px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                        <iconify-icon icon="solar:filter-linear" class="text-[16px]"></iconify-icon>
                    </button>
                </div>
            </div>

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

                        @php
                        $transactions = [
                            ['id' => 'INV-2024-001', 'time' => '10:45 AM', 'kasir' => 'Rina S.', 'items' => '4 pcs', 'total' => 'Rp 155.000', 'metode' => 'Tunai', 'status' => 'Selesai'],
                            ['id' => 'INV-2024-002', 'time' => '11:12 AM', 'kasir' => 'Budi H.', 'items' => '2 pcs', 'total' => 'Rp 82.000', 'metode' => 'QRIS', 'status' => 'Selesai'],
                            ['id' => 'INV-2024-003', 'time' => '11:30 AM', 'kasir' => 'Rina S.', 'items' => '5 pcs', 'total' => 'Rp 210.000', 'metode' => 'Debit', 'status' => 'Pending'],
                            ['id' => 'INV-2024-004', 'time' => '12:05 PM', 'kasir' => 'Budi H.', 'items' => '1 pcs', 'total' => 'Rp 45.000', 'metode' => 'Tunai', 'status' => 'Selesai'],
                            ['id' => 'INV-2024-005', 'time' => '12:45 PM', 'kasir' => 'Rina S.', 'items' => '8 pcs', 'total' => 'Rp 320.000', 'metode' => 'QRIS', 'status' => 'Dibatalkan'],
                            ['id' => 'INV-2024-006', 'time' => '01:20 PM', 'kasir' => 'Alex M.', 'items' => '3 pcs', 'total' => 'Rp 125.000', 'metode' => 'Tunai', 'status' => 'Selesai'],
                            ['id' => 'INV-2024-007', 'time' => '01:55 PM', 'kasir' => 'Budi H.', 'items' => '2 pcs', 'total' => 'Rp 67.000', 'metode' => 'Debit', 'status' => 'Selesai'],
                        ];
                        @endphp

                        @foreach($transactions as $trx)
                        <tr class="hover:bg-gray-50/60 transition group">

                            <td class="px-6 py-4 text-[13px] font-semibold text-gray-800">
                                {{ $trx['id'] }}
                            </td>

                            <td class="px-6 py-4 text-[13px] text-gray-500">
                                {{ $trx['time'] }}
                            </td>

                            <td class="px-6 py-4 text-[13px] text-gray-700 font-medium">
                                {{ $trx['kasir'] }}
                            </td>

                            <td class="px-6 py-4 text-[13px] text-gray-500">
                                {{ $trx['items'] }}
                            </td>

                            <td class="px-6 py-4 text-[13px] font-bold text-gray-900">
                                {{ $trx['total'] }}
                            </td>

                            <td class="px-6 py-4">
                                <span class="text-[12px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                                    {{ $trx['metode'] }}
                                </span>
                            </td>

                            <td class="px-6 py-4">
                                @if($trx['status'] === 'Selesai')
                                    <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                                        <iconify-icon icon="solar:check-circle-linear" class="text-[13px]"></iconify-icon>
                                        Selesai
                                    </span>
                                @elseif($trx['status'] === 'Pending')
                                    <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                                        <iconify-icon icon="solar:clock-circle-linear" class="text-[13px]"></iconify-icon>
                                        Pending
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                                        <iconify-icon icon="solar:close-circle-linear" class="text-[13px]"></iconify-icon>
                                        Dibatalkan
                                    </span>
                                @endif
                            </td>

                        </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>

            {{-- Pagination --}}
            <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <span class="text-[13px] text-gray-400">Menampilkan 7 dari 128 transaksi</span>
                <div class="flex items-center gap-2">
                    <button class="px-4 py-2 text-[13px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition cursor-not-allowed" disabled>
                        Sebelumnya
                    </button>
                    <button class="px-4 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                        Selanjutnya
                    </button>
                </div>
            </div>

        </div>

    </div>
</div>
@endsection