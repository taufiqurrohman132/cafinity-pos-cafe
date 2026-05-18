@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-gray-50 p-4 md:p-6">
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {{-- ======================== MAIN CONTENT ======================== --}}
            <div class="xl:col-span-9 space-y-6">

                {{-- HEADER --}}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Daftar Pengguna</h1>
                        <p class="text-gray-500 mt-1">Kelola hak akses dan peran personel cafe Anda.</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button
                            class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                            <iconify-icon icon="mdi:download-outline" class="text-base"></iconify-icon>
                            Export CSV
                        </button>
                        <button
                            class="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition shadow-sm whitespace-nowrap">
                            <iconify-icon icon="mdi:account-plus-outline" class="text-base"></iconify-icon>
                            Tambah Pengguna
                        </button>
                    </div>
                </div>

                {{-- STAT CARDS --}}
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500">Kasir Aktif</p>
                                <h2 class="text-2xl font-bold text-gray-900 mt-3">24</h2>
                                <div class="flex items-center gap-1 mt-3 text-green-500 text-xs font-semibold">
                                    <iconify-icon icon="mdi:arrow-top-right"></iconify-icon>
                                    +2 dari bulan lalu
                                </div>
                            </div>
                            <div
                                class="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl flex-shrink-0">
                                <iconify-icon icon="mdi:account-group-outline"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500">Admin Sistem</p>
                                <h2 class="text-2xl font-bold text-gray-900 mt-3">18</h2>
                                <div class="flex items-center gap-1 mt-3 text-green-500 text-xs font-semibold">
                                    <iconify-icon icon="mdi:check-circle-outline"></iconify-icon>
                                    Pengguna aktif saat ini
                                </div>
                            </div>
                            <div
                                class="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 text-xl flex-shrink-0">
                                <iconify-icon icon="mdi:check-circle-outline"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-sm text-gray-500">Rata-rata Shift</p>
                                <h2 class="text-2xl font-bold text-gray-900 mt-3">4.3 j</h2>
                                <div class="flex items-center gap-1 mt-3 text-yellow-500 text-xs font-semibold">
                                    <iconify-icon icon="mdi:arrow-bottom-right"></iconify-icon>
                                    
                                </div>
                            </div>
                            <div
                                class="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 text-xl flex-shrink-0">
                                <iconify-icon icon="mdi:clock-outline"></iconify-icon>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- TABLE CARD --}}
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {{-- TOOLBAR --}}
                    <div
                        class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div class="relative flex-1 max-w-sm">
                            <iconify-icon icon="mdi:magnify"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                            <input type="text" placeholder="Nama, email, atau ID..."
                                class="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 transition">
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                class="flex items-center gap-2 h-10 px-4 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                                <iconify-icon icon="mdi:filter-outline" class="text-base"></iconify-icon>
                                Filter Role
                            </button>
                            <button
                                class="flex items-center gap-2 h-10 px-4 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                                <iconify-icon icon="mdi:shield-check-outline" class="text-base"></iconify-icon>
                                Status
                            </button>
                            <button
                                class="h-10 px-4 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                                Reset
                            </button>
                        </div>
                    </div>

                    {{-- TABLE --}}
                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[640px]">
                            <thead>
                                <tr class="border-b border-gray-100">
                                    <th class="px-5 py-3 w-10">
                                        <input type="checkbox"
                                            class="rounded border-gray-300 text-green-600 focus:ring-green-200">
                                    </th>
                                    <th class="px-5 py-3 text-xs font-medium text-gray-400">Nama Pengguna</th>
                                    <th class="px-5 py-3 text-xs font-medium text-gray-400">Role</th>
                                    <th class="px-5 py-3 text-xs font-medium text-gray-400">Aktif Terakhir</th>
                                    <th class="px-5 py-3 text-xs font-medium text-gray-400">Status</th>
                                    <th class="px-5 py-3 text-xs font-medium text-gray-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50 text-sm">

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
                                        'Owner' => 'bg-green-600 text-white',
                                        'Admin' => 'bg-gray-100 text-gray-700',
                                        'Kasir' => 'bg-gray-100 text-gray-700',
                                    ];

                                    $statusStyles = [
                                        'Active' => ['dot' => 'bg-green-500', 'text' => 'text-green-600'],
                                        'Pending' => ['dot' => 'bg-yellow-400', 'text' => 'text-yellow-600'],
                                        'Deactivated' => ['dot' => 'bg-red-500', 'text' => 'text-red-500'],
                                    ];
                                @endphp

                                @foreach ($users as $user)
                                    <tr class="hover:bg-gray-50 transition group">

                                        {{-- Checkbox --}}
                                        <td class="px-5 py-4">
                                            <input type="checkbox"
                                                class="rounded border-gray-300 text-green-600 focus:ring-green-200">
                                        </td>

                                        {{-- Nama --}}
                                        <td class="px-5 py-4">
                                            <div class="flex items-center gap-3">
                                                <img src="{{ $user['avatar'] }}" alt="{{ $user['nama'] }}"
                                                    class="w-9 h-9 rounded-full object-cover border border-gray-100 flex-shrink-0">
                                                <div>
                                                    <p class="font-semibold text-gray-900">{{ $user['nama'] }}</p>
                                                    <p class="text-[10px] text-gray-400">{{ $user['email'] }}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {{-- Role --}}
                                        <td class="px-5 py-4">
                                            <span
                                                class="px-2.5 py-1 rounded-full text-xs font-semibold {{ $roleStyles[$user['role']] }}">
                                                {{ $user['role'] }}
                                            </span>
                                        </td>

                                        {{-- Aktif Terakhir --}}
                                        <td class="px-5 py-4 text-gray-500">{{ $user['aktif'] }}</td>

                                        {{-- Status --}}
                                        <td class="px-5 py-4">
                                            <span
                                                class="flex items-center gap-1.5 {{ $statusStyles[$user['status']]['text'] }} font-semibold">
                                                <span
                                                    class="w-2 h-2 rounded-full {{ $statusStyles[$user['status']]['dot'] }}"></span>
                                                {{ $user['status'] }}
                                            </span>
                                        </td>

                                        {{-- Aksi --}}
                                        <td class="px-5 py-4 text-right">
                                            <button
                                                class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition">
                                                <iconify-icon icon="mdi:dots-vertical" class="text-base"></iconify-icon>
                                            </button>
                                        </td>

                                    </tr>
                                @endforeach

                            </tbody>
                        </table>
                    </div>

                    {{-- PAGINATION --}}
                    <div class="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                        <p class="text-xs text-gray-400">
                            Menampilkan <span class="font-bold text-gray-700">5</span> dari <span
                                class="font-bold text-gray-700">24</span> pengguna
                        </p>
                        <div class="flex items-center gap-1.5">
                            <button
                                class="px-3 py-1.5 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed"
                                disabled>
                                Previous
                            </button>
                            @foreach ([1, 2, 3] as $page)
                                <button @class([
                                    'w-8 h-8 text-xs font-bold rounded-lg transition',
                                    'bg-green-600 text-white shadow-sm' => $page === 1,
                                    'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50' =>
                                        $page !== 1,
                                ])>{{ $page }}</button>
                            @endforeach
                            <button
                                class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                                Next
                            </button>
                        </div>
                    </div>

                </div>

                {{-- TOAST --}}
                <div class="flex justify-center">
                    <div
                        class="inline-flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3">
                        <div
                            class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <iconify-icon icon="mdi:check-circle-outline" class="text-sm"></iconify-icon>
                        </div>
                        <p class="text-sm font-medium text-gray-700">Tampilan simulasi: 5 Pengguna berhasil dimuat.</p>
                    </div>
                </div>

            </div>

            {{-- ======================== SIDEBAR ======================== --}}
            <div class="xl:col-span-3 space-y-6">

                {{-- RINGKASAN TIM --}}
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 class="font-bold text-gray-900">Ringkasan Tim</h3>
                    <p class="text-xs text-gray-400 mt-0.5 mb-4">Status personel saat ini.</p>

                    <div class="space-y-3">

                        <div class="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pengguna</p>
                                <p class="text-2xl font-bold text-gray-900 mt-1">24</p>
                            </div>
                            <iconify-icon icon="mdi:account-group-outline" class="text-2xl text-green-600"></iconify-icon>
                        </div>

                        <div class="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Aktif</p>
                                <p class="text-2xl font-bold text-gray-900 mt-1">18</p>
                            </div>
                            <iconify-icon icon="mdi:check-circle-outline" class="text-2xl text-gray-400"></iconify-icon>
                        </div>

                        <div class="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Menunggu Undangan
                                </p>
                                <p class="text-2xl font-bold text-gray-900 mt-1">4</p>
                            </div>
                            <iconify-icon icon="mdi:clock-outline" class="text-2xl text-gray-400"></iconify-icon>
                        </div>

                    </div>
                </div>

                {{-- AKTIVITAS TERAKHIR --}}
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 class="font-bold text-gray-900 mb-4">Aktivitas Terakhir</h3>

                    <div class="space-y-4">
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
                            <div class="flex items-start gap-3">
                                <span class="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                                <div>
                                    <p class="text-xs font-bold text-gray-800">{{ $log['nama'] }}</p>
                                    <p class="text-xs text-gray-500">{{ $log['aksi'] }}</p>
                                    <p class="text-[10px] font-bold text-gray-400 mt-0.5">{{ $log['waktu'] }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <button class="mt-4 text-xs font-semibold text-green-600 hover:text-green-700 transition">
                        Lihat Semua Audit Log →
                    </button>
                </div>

            </div>

        </div>
    </div>
@endsection
