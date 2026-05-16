@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto space-y-6">
        
        {{-- Header Section --}}
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Pusat Notifikasi</h1>
                <p class="text-sm text-gray-500">Pantau aktivitas operasional, ulasan pelanggan, dan status sistem secara real-time.</p>
            </div>
            <div class="flex items-center gap-3">
                <button class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                    <iconify-icon icon="solar:filter-linear"></iconify-icon> Filter Lanjutan
                </button>
                <button class="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition">
                    Tandai Semua Dibaca
                </button>
            </div>
        </div>

        {{-- Stat Summary Cards --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            @foreach([
                ['label' => 'Belum Dibaca', 'count' => '12', 'color' => 'emerald'],
                ['label' => 'Urgensi Tinggi', 'count' => '3', 'color' => 'rose'],
                ['label' => 'Ulasan Baru', 'count' => '5', 'color' => 'amber'],
                ['label' => 'Gagal Bayar', 'count' => '1', 'color' => 'orange']
            ] as $stat)
            <div class="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                <span class="text-sm font-medium text-gray-500">{{ $stat['label'] }}</span>
                <span class="text-lg font-bold text-{{ $stat['color'] }}-600 bg-{{ $stat['color'] }}-50 px-3 py-0.5 rounded-lg border border-{{ $stat['color'] }}-100">{{ $stat['count'] }}</span>
            </div>
            @endforeach
        </div>

        {{-- Tabs --}}
        <div class="flex flex-wrap items-center justify-between border-b border-gray-200 gap-4">
            <div class="flex gap-8">
                <a href="#" class="pb-4 text-sm font-bold text-emerald-600 border-b-2 border-emerald-500">Semua Notifikasi</a>
                <a href="#" class="pb-4 text-sm font-semibold text-gray-400 hover:text-gray-600">Operasional & Stok</a>
                <a href="#" class="pb-4 text-sm font-semibold text-gray-400 hover:text-gray-600">Ulasan Pelanggan</a>
                <a href="#" class="pb-4 text-sm font-semibold text-gray-400 hover:text-gray-600">Pembayaran</a>
            </div>
            <span class="pb-4 text-xs text-gray-400 font-medium">Menampilkan 5 dari 48 notifikasi terbaru</span>
        </div>

        {{-- Notification List --}}
        <div class="space-y-4">
            
            {{-- Item 1: Stok Menipis --}}
            <div class="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 border border-gray-100 shadow-sm flex gap-4">
                <div class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                    <iconify-icon icon="solar:box-linear" class="text-xl"></iconify-icon>
                </div>
                <div class="flex-1 space-y-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-sm font-bold text-gray-800">Stok Menipis: Biji Kopi Arabika <span class="ml-2 text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase">Urgent</span></h4>
                            <p class="text-sm text-gray-500 mt-1">Sisa stok tinggal 12 unit lagi. Segera lakukan pemesanan ulang untuk menghindari kekosongan stok.</p>
                        </div>
                        <span class="text-xs text-gray-400 whitespace-nowrap">5 menit yang lalu</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <button class="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 transition">
                            Buat Pesanan Pembelian <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
                        </button>
                        <div class="flex gap-4 text-gray-400">
                            <button class="hover:text-emerald-500"><iconify-icon icon="solar:check-read-linear" class="text-lg"></iconify-icon></button>
                            <button class="hover:text-rose-500"><iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-lg"></iconify-icon></button>
                            <button class="hover:text-gray-600"><iconify-icon icon="solar:menu-dots-bold" class="text-lg"></iconify-icon></button>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Item 2: Ulasan --}}
            <div class="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 border border-gray-100 shadow-sm flex gap-4">
                <img src="https://ui-avatars.com/api/?name=User&background=random" class="w-10 h-10 rounded-full flex-shrink-0">
                <div class="flex-1 space-y-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-sm font-bold text-gray-800">Ulasan Baru Diterima <span class="ml-2 text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Penting</span></h4>
                            <p class="text-sm text-gray-500 mt-1">4.8★ — "Pelayanan sangat cepat dan ramah, Matcha Latte-nya juara!"</p>
                        </div>
                        <span class="text-xs text-gray-400 whitespace-nowrap">1 jam yang lalu</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <button class="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 transition">
                            Balas Ulasan <iconify-icon icon="solar:chat-round-dots-linear"></iconify-icon>
                        </button>
                        <div class="flex gap-4 text-gray-400">
                            <button class="hover:text-emerald-500"><iconify-icon icon="solar:check-read-linear" class="text-lg"></iconify-icon></button>
                            <button class="hover:text-rose-500"><iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-lg"></iconify-icon></button>
                            <button class="hover:text-gray-600"><iconify-icon icon="solar:menu-dots-bold" class="text-lg"></iconify-icon></button>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Item 3: Gagal Bayar --}}
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 opacity-80">
                <div class="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 flex-shrink-0">
                    <iconify-icon icon="solar:danger-circle-linear" class="text-xl"></iconify-icon>
                </div>
                <div class="flex-1 space-y-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-sm font-bold text-gray-800">Pembayaran Gagal: TRX-9909 <span class="ml-2 text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase">Urgent</span></h4>
                            <p class="text-sm text-gray-500 mt-1">Transaksi senilai Rp 45.000 gagal diproses karena kendala jaringan bank. Silakan verifikasi status.</p>
                        </div>
                        <span class="text-xs text-gray-400 whitespace-nowrap">2 jam yang lalu</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <button class="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 transition">
                            Lihat Detail Transaksi <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
                        </button>
                        <div class="flex gap-4 text-gray-400">
                            <button class="hover:text-emerald-500"><iconify-icon icon="solar:check-read-linear" class="text-lg"></iconify-icon></button>
                            <button class="hover:text-rose-500"><iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-lg"></iconify-icon></button>
                            <button class="hover:text-gray-600"><iconify-icon icon="solar:menu-dots-bold" class="text-lg"></iconify-icon></button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {{-- Load More --}}
        <div class="flex justify-center pt-4">
            <button class="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                Muat Lebih Banyak <iconify-icon icon="solar:alt-arrow-down-linear"></iconify-icon>
            </button>
        </div>

        {{-- Bottom Cards (Tips & Sync) --}}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div class="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <iconify-icon icon="solar:cup-hot-linear" class="text-2xl"></iconify-icon>
                </div>
                <div>
                    <h5 class="text-sm font-bold text-gray-800">Tips Efisiensi</h5>
                    <p class="text-xs text-gray-500 mt-1 leading-relaxed">Aktifkan notifikasi mobile untuk mendapatkan peringatan stok kritis secara instan di manapun Anda berada.</p>
                </div>
            </div>
            <div class="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <iconify-icon icon="solar:refresh-circle-linear" class="text-2xl"></iconify-icon>
                </div>
                <div>
                    <h5 class="text-sm font-bold text-gray-800">Sinkronisasi Data</h5>
                    <p class="text-xs text-gray-500 mt-1 leading-relaxed">Sistem melakukan sinkronisasi dengan inventory pusat setiap 15 menit. Terakhir diperbarui: 14:30 WIB.</p>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection