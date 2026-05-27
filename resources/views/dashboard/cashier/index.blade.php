@extends('layouts.app')

@section('content')
    <div class="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- Main Content (Left) --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- Header Section --}}
                <div class="flex flex-col gap-1">
                    <h1 class="text-2xl font-bold text-gray-900">Dashboard Kasir</h1>
                    <p class="text-sm text-gray-500">Pantau performa harian dan kelola transaksi dengan cepat.</p>
                </div>

                {{-- Welcome Banner --}}
                <div class="relative bg-emerald-500 rounded-3xl p-8 text-white overflow-hidden shadow-sm">
                    <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div class="space-y-1">
                            <h2 class="text-2xl font-bold">Selamat Datang, Budi!</h2>
                            <p class="text-emerald-50 text-sm">Shift pagi Anda telah berjalan selama 4 jam. Siap untuk
                                melayani pelanggan berikutnya?</p>
                        </div>
                        <button
                            class="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap text-sm">
                            <iconify-icon icon="solar:play-circle-bold" class="text-lg"></iconify-icon>
                            BUKA POS SEKARANG
                        </button>
                    </div>
                </div>

                {{-- Stats Cards --}}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {{-- Total Transaksi --}}
                    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <div
                                class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <iconify-icon icon="solar:bill-list-bold" class="text-xl"></iconify-icon>
                            </div>
                            <span
                                class="text-[10px] font-semibold px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">Hari
                                Ini</span>
                        </div>
                        <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Transaksi</p>
                        <h3 class="text-2xl font-bold text-gray-800 mt-1">42 Pesanan</h3>
                        <div class="flex items-center gap-1 mt-3 text-[10px] text-gray-400">
                            <iconify-icon icon="solar:info-circle-linear"></iconify-icon>
                            <span>8 pesanan lebih banyak dari kemarin</span>
                        </div>
                    </div>

                    {{-- Total Uang Tunai --}}
                    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <iconify-icon icon="solar:wallet-bold" class="text-xl"></iconify-icon>
                            </div>
                            <span
                                class="text-[10px] font-semibold px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">Hari
                                Ini</span>
                        </div>
                        <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Uang Tunai</p>
                        <h3 class="text-2xl font-bold text-gray-800 mt-1">Rp 2.450.000</h3>
                        <div class="flex items-center gap-1 mt-3 text-[10px] text-gray-400">
                            <iconify-icon icon="solar:info-circle-linear"></iconify-icon>
                            <span>Termasuk saldo awal shift</span>
                        </div>
                    </div>

                    {{-- Waktu Rata-Rata --}}
                    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                <iconify-icon icon="solar:clock-circle-bold" class="text-xl"></iconify-icon>
                            </div>
                            <span
                                class="text-[10px] font-semibold px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">Hari
                                Ini</span>
                        </div>
                        <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">Waktu Rata-Rata</p>
                        <h3 class="text-2xl font-bold text-gray-800 mt-1">4.5 Menit</h3>
                        <div class="flex items-center gap-1 mt-3 text-[10px] text-gray-400">
                            <iconify-icon icon="solar:info-circle-linear"></iconify-icon>
                            <span>Kecepatan layanan per pelanggan</span>
                        </div>
                    </div>
                </div>

                {{-- Table Transaksi --}}
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-6 flex justify-between items-center">
                        <h3 class="font-bold text-gray-800">Transaksi Terakhir</h3>
                        <a href="#" class="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            Lihat Semua <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
                        </a>
                    </div>

                    <div class="overflow-x-auto text-sm">
                        <table class="w-full text-left">
                            <thead class="bg-gray-50 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                                <tr>
                                    <th class="px-6 py-3">ID Transaksi</th>
                                    <th class="px-6 py-3">Waktu</th>
                                    <th class="px-6 py-3">Pesanan</th>
                                    <th class="px-6 py-3">Total</th>
                                    <th class="px-6 py-3">Status</th>
                                    <th class="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                @foreach ([1, 2, 3, 4, 5] as $item)
                                    <tr class="hover:bg-gray-50/50 transition">
                                        <td class="px-6 py-4 font-semibold text-gray-600">TRX-9901</td>
                                        <td class="px-6 py-4 text-gray-500">14:20</td>
                                        <td class="px-6 py-4 text-gray-700">2x Cappuccino, 1x Croissant</td>
                                        <td class="px-6 py-4 font-bold text-gray-800">Rp 85.000</td>
                                        <td class="px-6 py-4">
                                            <span
                                                class="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">Success</span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex justify-center gap-3 text-gray-400">
                                                <button class="hover:text-emerald-500"><iconify-icon
                                                        icon="solar:printer-minimalistic-linear"
                                                        class="text-lg"></iconify-icon></button>
                                                <button class="hover:text-blue-500"><iconify-icon
                                                        icon="solar:restart-linear" class="text-lg"></iconify-icon></button>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {{-- Sidebar --}}
            <div class="xl:col-span-3 space-y-6">
                {{-- Profile --}}
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-gray-200 border-2 border-emerald-500 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Budi+Santoso&background=random" alt="User">
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm">Budi Santoso</h4>
                        <p class="text-[11px] text-gray-400">Cashier • Shift Pagi</p>
                    </div>
                </div>

                {{-- Shift Info --}}
                <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Informasi Shift</h4>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Mulai Shift</span>
                            <span class="font-bold text-gray-800">08:00 AM</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Durasi</span>
                            <span class="font-bold text-gray-800">06j 20m</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Saldo Awal</span>
                            <span class="font-bold text-gray-800">Rp 500.000</span>
                        </div>
                    </div>
                    <button
                        class="w-full border border-gray-100 py-2.5 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50">
                        Lihat Laporan Shift
                    </button>
                </div>

                {{-- Stok --}}
                <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Stok Menipis</h4>
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5"></div>
                            <div>
                                <h5 class="text-sm font-bold text-gray-700">Susu Full Cream <span
                                        class="ml-1 text-[8px] bg-gray-100 px-1 py-0.5 rounded text-gray-400 uppercase">Penting</span>
                                </h5>
                                <p class="text-[11px] text-gray-400">Sisa 2 Karton (Min. 5)</p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5"></div>
                            <div>
                                <h5 class="text-sm font-bold text-gray-700">Biji Kopi Arabika</h5>
                                <p class="text-[11px] text-gray-400">Sisa 1.5 Kg (Min. 3)</p>
                            </div>
                        </div>
                    </div>
                    <button class="text-emerald-600 font-bold text-[11px] mt-6 hover:underline">Kelola Inventaris</button>
                </div>

                {{-- Memo --}}
                <div class="bg-red-50 p-6 rounded-3xl border border-red-100">
                    <h4 class="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">Internal Memo</h4>
                    <p class="text-xs text-gray-600 italic leading-relaxed">
                        "Promosi BOGO untuk menu Croissant berlaku hingga jam 4 sore hari ini. Pastikan informasikan ke
                        pelanggan!"
                    </p>
                    <p class="text-[10px] text-gray-400 mt-4 font-bold">— Admin Cafe</p>
                </div>
            </div>
        </div>
    </div>
@endsection
