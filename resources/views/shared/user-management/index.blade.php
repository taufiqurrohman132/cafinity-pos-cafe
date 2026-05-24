@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#fbfbfe] font-inter text-[#050316] p-4 md:p-6">
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- ======================== MAIN CONTENT ======================== --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- HEADER --}}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Daftar Pengguna
                        </h1>
                        <p class="text-xs md:text-sm text-[#2f27ce]/70 font-medium mt-1">
                            Kelola hak akses dan peran personel cafe Anda.
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <button
                            class="flex items-center gap-2 px-4 py-2.5 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                            <iconify-icon icon="solar:download-square-linear" class="text-lg"></iconify-icon>
                            Export CSV
                        </button>
                        <button
                            class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98] duration-150 whitespace-nowrap">
                            <iconify-icon icon="solar:user-plus-rounded-linear" class="text-lg"></iconify-icon>
                            Tambah Pengguna
                        </button>
                    </div>
                </div>

                {{-- STAT CARDS --}}
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 hover:shadow-md transition-shadow duration-150 cursor-default">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs md:text-sm text-[#2f27ce]/70 font-medium">Kasir Aktif</p>
                                <h2 class="text-2xl font-black text-[#443dff] mt-2">24</h2>
                                <div class="flex items-center gap-1 mt-3 text-[#10b981] text-xs font-bold px-2 py-1 bg-[#ecfdf5] rounded-md inline-flex">
                                    <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon>
                                    +2 dari bulan lalu
                                </div>
                            </div>
                            <div class="w-11 h-11 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:users-group-rounded-linear"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 hover:shadow-md transition-shadow duration-150 cursor-default">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs md:text-sm text-[#2f27ce]/70 font-medium">Admin Sistem</p>
                                <h2 class="text-2xl font-black text-[#443dff] mt-2">18</h2>
                                <div class="flex items-center gap-1 mt-3 text-[#443dff] text-xs font-bold px-2 py-1 bg-[#dddbff]/50 rounded-md inline-flex">
                                    <iconify-icon icon="solar:shield-check-linear"></iconify-icon>
                                    Pengguna aktif
                                </div>
                            </div>
                            <div class="w-11 h-11 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:shield-keyhole-linear"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 hover:shadow-md transition-shadow duration-150 cursor-default">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs md:text-sm text-[#2f27ce]/70 font-medium">Rata-rata Shift</p>
                                <h2 class="text-2xl font-black text-[#443dff] mt-2">4.3 j</h2>
                                <div class="flex items-center gap-1 mt-3 text-[#f59e0b] text-xs font-bold px-2 py-1 bg-[#fef3c7] rounded-md inline-flex">
                                    <iconify-icon icon="solar:info-circle-linear"></iconify-icon>
                                    Normal
                                </div>
                            </div>
                            <div class="w-11 h-11 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:clock-circle-linear"></iconify-icon>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- TABLE CARD --}}
                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                    {{-- TOOLBAR --}}
                    <div class="px-5 py-4 border-b border-[#dddbff] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#fbfbfe]/50">
                        <div class="relative flex-1 max-w-sm">
                            <iconify-icon icon="solar:magnifer-linear" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg"></iconify-icon>
                            <input type="text" placeholder="Nama, email, atau ID..."
                                class="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-11 pr-4 py-2.5 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/50 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all shadow-sm">
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button class="flex items-center gap-2 h-11 px-4 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                                <iconify-icon icon="solar:filter-linear" class="text-lg"></iconify-icon>
                                Filter Role
                            </button>
                            <button class="flex items-center gap-2 h-11 px-4 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                                <iconify-icon icon="solar:shield-warning-linear" class="text-lg"></iconify-icon>
                                Status
                            </button>
                            <button class="h-11 px-4 border border-transparent bg-[#fbfbfe] text-[#2f27ce]/70 text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                                Reset
                            </button>
                        </div>
                    </div>

                    {{-- TABLE --}}
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[640px]">
                            <thead>
                                <tr class="border-b border-[#dddbff] bg-white">
                                    <th class="px-5 py-4 w-10">
                                        <input type="checkbox" class="w-4 h-4 rounded border-[#dddbff] text-[#443dff] focus:ring-[#dddbff]/50 focus:ring-2 cursor-pointer transition-all">
                                    </th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70">Nama Pengguna</th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70">Role</th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70">Aktif Terakhir</th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70">Status</th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#dddbff]/50 text-sm bg-white">

                                @php
                                    $users = [
                                        [
                                            'nama' => 'Budi Santoso',
                                            'email' => 'budi.s@smartcafe.id',
                                            'avatar' => 'https://i.pravatar.cc/80?img=11',
                                            'role' => 'Owner',
                                            'aktif' => '10 mnt yang lalu',
                                            'status' => 'Active',
                                        ],
                                        [
                                            'nama' => 'Siti Aminah',
                                            'email' => 'siti.a@smartcafe.id',
                                            'avatar' => 'https://i.pravatar.cc/80?img=5',
                                            'role' => 'Admin',
                                            'aktif' => '2 jam yang lalu',
                                            'status' => 'Active',
                                        ],
                                        [
                                            'nama' => 'Rizky Pratama',
                                            'email' => 'rizky.p@smartcafe.id',
                                            'avatar' => 'https://i.pravatar.cc/80?img=12',
                                            'role' => 'Kasir',
                                            'aktif' => 'Kemarin, 18:45',
                                            'status' => 'Active',
                                        ],
                                        [
                                            'nama' => 'Lina Marlina',
                                            'email' => 'lina.m@smartcafe.id',
                                            'avatar' => 'https://i.pravatar.cc/80?img=9',
                                            'role' => 'Kasir',
                                            'aktif' => '3 hari yang lalu',
                                            'status' => 'Pending',
                                        ],
                                        [
                                            'nama' => 'Adi Wijaya',
                                            'email' => 'adi.w@smartcafe.id',
                                            'avatar' => 'https://i.pravatar.cc/80?img=15',
                                            'role' => 'Admin',
                                            'aktif' => '1 minggu yang lalu',
                                            'status' => 'Deactivated',
                                        ],
                                    ];

                                    $roleStyles = [
                                        'Owner' => 'bg-[#443dff] text-white',
                                        'Admin' => 'bg-[#dddbff]/50 text-[#2f27ce]',
                                        'Kasir' => 'bg-[#dddbff]/50 text-[#2f27ce]',
                                    ];

                                    $statusStyles = [
                                        'Active' => ['bg' => 'bg-[#ecfdf5]', 'dot' => 'bg-[#10b981]', 'text' => 'text-[#10b981]'],
                                        'Pending' => ['bg' => 'bg-[#fef3c7]', 'dot' => 'bg-[#f59e0b]', 'text' => 'text-[#f59e0b]'],
                                        'Deactivated' => ['bg' => 'bg-[#fef2f2]', 'dot' => 'bg-[#ef4444]', 'text' => 'text-[#ef4444]'],
                                    ];
                                @endphp

                                @foreach ($users as $user)
                                    <tr class="hover:bg-[#dddbff]/20 transition-colors duration-150 group cursor-pointer">

                                        {{-- Checkbox --}}
                                        <td class="px-5 py-4">
                                            <input type="checkbox" class="w-4 h-4 rounded border-[#dddbff] text-[#443dff] focus:ring-[#dddbff]/50 focus:ring-2 cursor-pointer transition-all">
                                        </td>

                                        {{-- Nama --}}
                                        <td class="px-5 py-4">
                                            <div class="flex items-center gap-3">
                                                <img src="{{ $user['avatar'] }}" alt="{{ $user['nama'] }}"
                                                    class="w-10 h-10 rounded-xl object-cover border border-[#dddbff] shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-150">
                                                <div>
                                                    <p class="font-bold text-[#050316]">{{ $user['nama'] }}</p>
                                                    <p class="text-[11px] md:text-xs text-[#2f27ce]/70 font-medium">{{ $user['email'] }}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {{-- Role --}}
                                        <td class="px-5 py-4">
                                            <span class="px-3 py-1.5 rounded-lg text-xs font-bold {{ $roleStyles[$user['role']] }}">
                                                {{ $user['role'] }}
                                            </span>
                                        </td>

                                        {{-- Aktif Terakhir --}}
                                        <td class="px-5 py-4 font-medium text-[#2f27ce]/70 text-sm">{{ $user['aktif'] }}</td>

                                        {{-- Status --}}
                                        <td class="px-5 py-4">
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md {{ $statusStyles[$user['status']]['bg'] }} {{ $statusStyles[$user['status']]['text'] }} text-xs font-bold">
                                                <span class="w-1.5 h-1.5 rounded-full {{ $statusStyles[$user['status']]['dot'] }}"></span>
                                                {{ $user['status'] }}
                                            </span>
                                        </td>

                                        {{-- Aksi --}}
                                        <td class="px-5 py-4 text-right">
                                            <button class="p-2 text-[#2f27ce]/50 hover:text-[#443dff] hover:bg-[#dddbff]/50 rounded-xl transition-all duration-150 active:scale-[0.95]">
                                                <iconify-icon icon="solar:menu-dots-bold" class="text-lg"></iconify-icon>
                                            </button>
                                        </td>

                                    </tr>
                                @endforeach

                            </tbody>
                        </table>
                    </div>

                    {{-- PAGINATION --}}
                    <div class="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-[#dddbff] bg-[#fbfbfe]/50 gap-4">
                        <p class="text-xs font-medium text-[#2f27ce]/70">
                            Menampilkan <span class="font-bold text-[#050316]">5</span> dari <span class="font-bold text-[#050316]">24</span> pengguna
                        </p>
                        <div class="flex items-center gap-1.5">
                            <button class="px-3 py-2 text-xs font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed transition-all">
                                Previous
                            </button>
                            @foreach ([1, 2, 3] as $page)
                                <button @class([
                                    'w-9 h-9 text-sm font-bold rounded-xl transition-all duration-150 active:scale-[0.95]',
                                    'bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white shadow-md shadow-[#2f27ce]/20' => $page === 1,
                                    'bg-white border border-[#dddbff] text-[#2f27ce] hover:bg-[#dddbff] hover:text-[#050316]' => $page !== 1,
                                ])>{{ $page }}</button>
                            @endforeach
                            <button class="px-4 py-2 text-xs font-bold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff] hover:text-[#050316] transition-all duration-150 active:scale-[0.95]">
                                Next
                            </button>
                        </div>
                    </div>

                </div>

                {{-- TOAST --}}
                <div class="flex justify-center">
                    <div class="inline-flex items-center gap-3 bg-white border border-[#dddbff] shadow-lg shadow-[#2f27ce]/5 rounded-2xl px-5 py-3 animate-bounce">
                        <div class="w-7 h-7 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] flex-shrink-0">
                            <iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
                        </div>
                        <p class="text-[13px] font-bold text-[#050316]">Tampilan simulasi: 5 Pengguna berhasil dimuat.</p>
                    </div>
                </div>

            </div>

            {{-- ======================== SIDEBAR ======================== --}}
            <div class="xl:col-span-3 space-y-6">

                {{-- RINGKASAN TIM --}}
                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                    <h3 class="font-extrabold text-[#050316]">Ringkasan Tim</h3>
                    <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5 mb-5">Status personel saat ini.</p>

                    <div class="space-y-3">

                        <div class="bg-[#dddbff]/30 border border-[#dddbff] rounded-xl p-4 flex items-center justify-between hover:bg-[#dddbff]/50 transition-colors duration-150">
                            <div>
                                <p class="text-[10px] font-bold text-[#2f27ce]/70 uppercase tracking-widest">Total Pengguna</p>
                                <p class="text-2xl font-black text-[#443dff] mt-1">24</p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#443dff] shadow-sm">
                                <iconify-icon icon="solar:users-group-two-rounded-linear" class="text-xl"></iconify-icon>
                            </div>
                        </div>

                        <div class="bg-[#ecfdf5] border border-[#10b981]/20 rounded-xl p-4 flex items-center justify-between hover:bg-[#10b981]/10 transition-colors duration-150">
                            <div>
                                <p class="text-[10px] font-bold text-[#10b981] uppercase tracking-widest">Status Aktif</p>
                                <p class="text-2xl font-black text-[#050316] mt-1">18</p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#10b981] shadow-sm">
                                <iconify-icon icon="solar:check-circle-linear" class="text-xl"></iconify-icon>
                            </div>
                        </div>

                        <div class="bg-[#fef3c7] border border-[#f59e0b]/20 rounded-xl p-4 flex items-center justify-between hover:bg-[#f59e0b]/10 transition-colors duration-150">
                            <div>
                                <p class="text-[10px] font-bold text-[#f59e0b] uppercase tracking-widest">Menunggu Akses</p>
                                <p class="text-2xl font-black text-[#050316] mt-1">4</p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#f59e0b] shadow-sm">
                                <iconify-icon icon="solar:clock-square-linear" class="text-xl"></iconify-icon>
                            </div>
                        </div>

                    </div>
                </div>

                {{-- AKTIVITAS TERAKHIR --}}
                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                    <h3 class="font-extrabold text-[#050316] mb-5">Aktivitas Terakhir</h3>

                    <div class="space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#dddbff] before:to-transparent">
                        @php
                            $logs = [
                                ['nama' => 'Siti Aminah', 'aksi' => 'Mengubah stok Espresso', 'waktu' => '10 MNT AGO'],
                                ['nama' => 'Rizky Pratama', 'aksi' => 'Login ke Terminal 01', 'waktu' => '2 JAM AGO'],
                                ['nama' => 'System', 'aksi' => 'Laporan harian terkirim', 'waktu' => '5 JAM AGO'],
                                [
                                    'nama' => 'Adi Wijaya',
                                    'aksi' => "Menonaktifkan user 'Deni'",
                                    'waktu' => '1 HARI AGO',
                                ],
                            ];
                        @endphp

                        @foreach ($logs as $log)
                            <div class="relative flex items-start gap-4">
                                <div class="w-3 h-3 rounded-full bg-[#443dff] mt-1.5 flex-shrink-0 shadow-[0_0_0_4px_#fbfbfe] z-10"></div>
                                <div class="bg-[#fbfbfe] border border-[#dddbff] p-3 rounded-xl w-full hover:border-[#443dff] transition-colors duration-150 cursor-default">
                                    <p class="text-xs font-bold text-[#050316]">{{ $log['nama'] }}</p>
                                    <p class="text-[13px] text-[#2f27ce]/70 font-medium mt-0.5">{{ $log['aksi'] }}</p>
                                    <p class="text-[10px] font-bold text-[#443dff] mt-1.5 tracking-wider">{{ $log['waktu'] }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <button class="w-full mt-5 py-2.5 flex items-center justify-center gap-1.5 text-sm font-bold text-[#443dff] hover:text-[#2f27ce] bg-[#dddbff]/30 hover:bg-[#dddbff] rounded-xl transition-colors duration-150 active:scale-[0.98]">
                        Lihat Semua Log <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
                    </button>
                </div>

            </div>

        </div>
    </div>
@endsection