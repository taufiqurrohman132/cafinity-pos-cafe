@extends('layouts.app')

@section('content')
    
    <div class="min-h-screen bg-[#fbfbfe] font-inter text-[#050316]">
        <div class="flex">



            {{-- ======================== MAIN CONTENT ======================== --}}
            <div class="flex-1 p-6 space-y-6">

                {{-- FLASH MESSAGE --}}
                @if (session('success'))
                    <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 4000)"
                        class="flex items-center gap-3 bg-white border border-[#dddbff] shadow-lg shadow-[#2f27ce]/5 rounded-2xl px-5 py-3">
                        <div
                            class="w-7 h-7 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] flex-shrink-0">
                            <iconify-icon icon="solar:check-circle-bold" class="text-base"></iconify-icon>
                        </div>
                        <p class="text-[13px] font-bold text-[#050316]">{{ session('success') }}</p>
                        <button @click="show = false" class="ml-auto text-[#2f27ce]/40 hover:text-[#2f27ce]">
                            <iconify-icon icon="solar:close-circle-linear"></iconify-icon>
                        </button>
                    </div>
                @endif

                @if (session('error'))
                    <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 4000)"
                        class="flex items-center gap-3 bg-white border border-red-200 shadow-lg rounded-2xl px-5 py-3">
                        <div
                            class="w-7 h-7 rounded-full bg-[#fef2f2] flex items-center justify-center text-[#ef4444] flex-shrink-0">
                            <iconify-icon icon="solar:close-circle-bold" class="text-base"></iconify-icon>
                        </div>
                        <p class="text-[13px] font-bold text-[#050316]">{{ session('error') }}</p>
                        <button @click="show = false" class="ml-auto text-[#2f27ce]/40 hover:text-[#2f27ce]">
                            <iconify-icon icon="solar:close-circle-linear"></iconify-icon>
                        </button>
                    </div>
                @endif

                {{-- HEADER --}}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1
                            class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Manajemen Pengguna
                        </h1>
                        <p class="text-sm text-[#2f27ce]/70 font-medium mt-1">
                            Kelola akun, peran, dan izin akses staf kafe Anda.
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        @role('owner')
                            <a href="{{ route('users.index', array_merge(request()->query(), ['export' => 'csv'])) }}"
                                class="flex items-center gap-2 px-4 py-2.5 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                                <iconify-icon icon="solar:download-square-linear" class="text-lg"></iconify-icon>
                                Export CSV
                            </a>
                            <a href="{{ route('users.create') }}"
                                class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98] duration-150 whitespace-nowrap">
                                <iconify-icon icon="solar:user-plus-rounded-linear" class="text-lg"></iconify-icon>
                                Tambah Pengguna
                            </a>
                        @endrole
                    </div>
                </div>

                {{-- STAT CARDS --}}
                @php
                    $totalKasir = \App\Models\User::where('role', 'cashier')->where('status', 'active')->count();
                    $totalAdmin = \App\Models\User::where('role', 'admin')->where('status', 'active')->count();
                    $totalUser = \App\Models\User::count();
                    $totalActive = \App\Models\User::where('status', 'active')->count();
                    $totalPending = \App\Models\User::where('status', 'pending')->count();
                @endphp

                <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">

                    <div
                        class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 hover:shadow-md transition-shadow duration-150 cursor-default">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs text-[#2f27ce]/70 font-medium">Total Pengguna</p>
                                <h2 class="text-2xl font-black text-[#443dff] mt-1">{{ $totalUser }}</h2>
                                <div
                                    class="flex items-center gap-1 mt-2 text-[#10b981] text-[11px] font-bold px-2 py-1 bg-[#ecfdf5] rounded-md inline-flex">
                                    <iconify-icon icon="solar:arrow-right-up-linear"></iconify-icon>
                                    +12% bulan ini
                                </div>
                            </div>
                            <div
                                class="w-10 h-10 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:users-group-two-rounded-linear"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 hover:shadow-md transition-shadow duration-150 cursor-default">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs text-[#2f27ce]/70 font-medium">Kasir Aktif</p>
                                <h2 class="text-2xl font-black text-[#443dff] mt-1">{{ $totalKasir }}</h2>
                                <div
                                    class="flex items-center gap-1 mt-2 text-[#10b981] text-[11px] font-bold px-2 py-1 bg-[#ecfdf5] rounded-md inline-flex">
                                    <iconify-icon icon="solar:check-circle-linear"></iconify-icon>
                                    Aktif bertugas
                                </div>
                            </div>
                            <div
                                class="w-10 h-10 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:users-group-rounded-linear"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 hover:shadow-md transition-shadow duration-150 cursor-default">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs text-[#2f27ce]/70 font-medium">Admin Sistem</p>
                                <h2 class="text-2xl font-black text-[#443dff] mt-1">{{ $totalAdmin }}</h2>
                                <div
                                    class="flex items-center gap-1 mt-2 text-[#443dff] text-[11px] font-bold px-2 py-1 bg-[#dddbff]/50 rounded-md inline-flex">
                                    <iconify-icon icon="solar:shield-check-linear"></iconify-icon>
                                    Pengguna aktif
                                </div>
                            </div>
                            <div
                                class="w-10 h-10 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:shield-keyhole-linear"></iconify-icon>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5 hover:shadow-md transition-shadow duration-150 cursor-default">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-xs text-[#2f27ce]/70 font-medium">Menunggu Akses</p>
                                <h2 class="text-2xl font-black text-[#443dff] mt-1">{{ $totalPending }}</h2>
                                <div
                                    class="flex items-center gap-1 mt-2 text-[#f59e0b] text-[11px] font-bold px-2 py-1 bg-[#fef3c7] rounded-md inline-flex">
                                    <iconify-icon icon="solar:info-circle-linear"></iconify-icon>
                                    Perlu persetujuan
                                </div>
                            </div>
                            <div
                                class="w-10 h-10 rounded-xl bg-[#dddbff]/50 flex items-center justify-center text-[#2f27ce] text-xl flex-shrink-0">
                                <iconify-icon icon="solar:clock-circle-linear"></iconify-icon>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- TABLE CARD --}}
                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">

                    {{-- TOOLBAR --}}
                    <form method="GET" action="{{ route('users.index') }}">
                        <div
                            class="px-5 py-4 border-b border-[#dddbff] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#fbfbfe]/50">
                            <div class="relative flex-1 max-w-sm">
                                <iconify-icon icon="solar:magnifer-linear"
                                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 text-lg"></iconify-icon>
                                <input type="text" name="search" value="{{ request('search') }}"
                                    placeholder="Cari nama, email, atau ID staf..."
                                    class="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl pl-11 pr-4 py-2.5 text-[13px] font-semibold text-[#050316] placeholder-[#2f27ce]/40 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all shadow-sm">
                            </div>
                            <div class="flex flex-wrap items-center gap-2">
                                <select name="role"
                                    class="h-11 px-4 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl cursor-pointer outline-none">
                                    <option value="">Semua Peran</option>
                                    <option value="owner" {{ request('role') === 'owner' ? 'selected' : '' }}>Owner
                                    </option>
                                    <option value="admin" {{ request('role') === 'admin' ? 'selected' : '' }}>Admin
                                    </option>
                                    <option value="cashier" {{ request('role') === 'cashier' ? 'selected' : '' }}>Kasir
                                    </option>
                                </select>

                                <select name="status"
                                    class="h-11 px-4 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl cursor-pointer outline-none">
                                    <option value="">Semua Status</option>
                                    <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>
                                        Active</option>
                                    <option value="inactive"
                                        {{ request('status') === 'inactive' ? 'selected' : '' }}>Inactive</option>
                                    <option value="pending"
                                        {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
                                    <option value="deactivated"
                                        {{ request('status') === 'deactivated' ? 'selected' : '' }}>Deactivated
                                    </option>
                                </select>

                                <button type="submit"
                                    class="flex items-center gap-2 h-11 px-4 bg-[#2f27ce] text-white text-sm font-bold hover:bg-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                                    <iconify-icon icon="solar:filter-linear" class="text-lg"></iconify-icon>
                                    Filter
                                </button>

                                <a href="{{ route('users.index') }}"
                                    class="h-11 px-4 flex items-center border border-transparent bg-[#fbfbfe] text-[#2f27ce]/70 text-sm font-bold hover:bg-[#dddbff] hover:text-[#050316] transition-all rounded-xl active:scale-[0.98] duration-150">
                                    Reset
                                </a>
                            </div>
                        </div>
                    </form>

                    {{-- TABLE --}}
                    @php
                        $roleStyles = [
                            'owner' => 'bg-[#443dff] text-white',
                            'admin' => 'bg-[#dddbff]/60 text-[#2f27ce]',
                            'cashier' => 'bg-[#dddbff]/60 text-[#2f27ce]',
                        ];
                        $roleLabels = [
                            'owner' => 'Owner',
                            'admin' => 'Admin',
                            'cashier' => 'Kasir',
                        ];
                        $statusStyles = [
                            'active' => [
                                'bg' => 'bg-[#ecfdf5]',
                                'dot' => 'bg-[#10b981]',
                                'text' => 'text-[#10b981]',
                                'label' => 'Aktif',
                            ],
                            'inactive' => [
                                'bg' => 'bg-[#f3f4f6]',
                                'dot' => 'bg-[#6b7280]',
                                'text' => 'text-[#6b7280]',
                                'label' => 'Non-aktif',
                            ],
                            'pending' => [
                                'bg' => 'bg-[#fef3c7]',
                                'dot' => 'bg-[#f59e0b]',
                                'text' => 'text-[#f59e0b]',
                                'label' => 'Pending',
                            ],
                            'deactivated' => [
                                'bg' => 'bg-[#fef2f2]',
                                'dot' => 'bg-[#ef4444]',
                                'text' => 'text-[#ef4444]',
                                'label' => 'Dinonaktifkan',
                            ],
                        ];
                    @endphp

                    <div class="overflow-x-auto">
                        <table class="w-full text-left min-w-[640px]">
                            <thead>
                                <tr class="border-b border-[#dddbff] bg-[#fbfbfe]/60">
                                    <th class="px-5 py-4 w-10">
                                        <input type="checkbox"
                                            class="w-4 h-4 rounded border-[#dddbff] text-[#443dff] focus:ring-[#dddbff]/50 focus:ring-2 cursor-pointer">
                                    </th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70 uppercase tracking-wider">
                                        Nama & Email</th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70 uppercase tracking-wider">
                                        Peran</th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70 uppercase tracking-wider">
                                        Status</th>
                                    <th class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70 uppercase tracking-wider">
                                        Aktivitas Terakhir</th>
                                    <th
                                        class="px-5 py-4 text-xs font-bold text-[#2f27ce]/70 uppercase tracking-wider text-right">
                                        Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#dddbff]/50 text-sm bg-white">

                                @forelse ($users as $user)
                                    <tr class="hover:bg-[#dddbff]/10 transition-colors duration-150 group">

                                        <td class="px-5 py-4">
                                            <input type="checkbox" value="{{ $user->id }}"
                                                class="w-4 h-4 rounded border-[#dddbff] text-[#443dff] focus:ring-[#dddbff]/50 focus:ring-2 cursor-pointer">
                                        </td>

                                        {{-- Nama & Email --}}
                                        <td class="px-5 py-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] flex items-center justify-center text-white font-black text-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-150 shadow-sm">
                                                    {{ strtoupper(substr($user->name, 0, 2)) }}
                                                </div>
                                                <div>
                                                    <p class="font-bold text-[#050316]">{{ $user->name }}</p>
                                                    <p class="text-xs text-[#2f27ce]/60 font-medium">
                                                        {{ $user->email }}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {{-- Peran --}}
                                        <td class="px-5 py-4">
                                            <span
                                                class="px-3 py-1.5 rounded-lg text-xs font-bold {{ $roleStyles[$user->role] ?? 'bg-gray-100 text-gray-600' }}">
                                                {{ $roleLabels[$user->role] ?? ucfirst($user->role) }}
                                            </span>
                                        </td>

                                        {{-- Status --}}
                                        <td class="px-5 py-4">
                                            @php $s = $statusStyles[$user->status] ?? $statusStyles['inactive']; @endphp
                                            <span
                                                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg {{ $s['bg'] }} {{ $s['text'] }} text-xs font-bold">
                                                <span class="w-1.5 h-1.5 rounded-full {{ $s['dot'] }}"></span>
                                                {{ $s['label'] }}
                                            </span>
                                        </td>

                                        {{-- Aktivitas Terakhir --}}
                                        <td class="px-5 py-4 font-medium text-[#2f27ce]/60 text-sm">
                                            {{ $user->updated_at->diffForHumans() }}
                                        </td>

                                        {{-- Aksi --}}
                                        <td class="px-5 py-4 text-right">
                                            <div x-data="{ open: false }" class="relative inline-block">
                                                <button @click="open = !open" @click.outside="open = false"
                                                    class="p-2 text-[#2f27ce]/50 hover:text-[#443dff] hover:bg-[#dddbff]/50 rounded-xl transition-all duration-150 active:scale-[0.95]">
                                                    <iconify-icon icon="solar:menu-dots-bold"
                                                        class="text-lg"></iconify-icon>
                                                </button>

                                                <div x-show="open" x-transition
                                                    class="absolute right-0 mt-1 w-48 bg-white border border-[#dddbff] rounded-xl shadow-xl z-20 overflow-hidden">

                                                    <a href="{{ route('users.show', $user->id) }}"
                                                        class="flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30 transition-colors">
                                                        <iconify-icon icon="solar:eye-linear"
                                                            class="text-[#2f27ce]"></iconify-icon>
                                                        Lihat Detail
                                                    </a>

                                                    @can('manage-users')
                                                        <a href="{{ route('users.edit', $user->id) }}"
                                                            class="flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30 transition-colors">
                                                            <iconify-icon icon="solar:pen-linear"
                                                                class="text-[#2f27ce]"></iconify-icon>
                                                            Edit Pengguna
                                                        </a>

                                                        <form method="POST"
                                                            action="{{ route('users.toggle-status', $user->id) }}">
                                                            @csrf
                                                            <button type="submit"
                                                                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30 transition-colors">
                                                                <iconify-icon icon="solar:shield-warning-linear"
                                                                    class="text-[#f59e0b]"></iconify-icon>
                                                                {{ $user->status === 'active' ? 'Nonaktifkan' : 'Aktifkan' }}
                                                            </button>
                                                        </form>

                                                        <form method="POST"
                                                            action="{{ route('users.reset-password', $user->id) }}">
                                                            @csrf
                                                            <button type="submit"
                                                                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#050316] font-semibold hover:bg-[#dddbff]/30 transition-colors">
                                                                <iconify-icon icon="solar:key-linear"
                                                                    class="text-[#2f27ce]"></iconify-icon>
                                                                Reset Password
                                                            </button>
                                                        </form>

                                                        @if ($user->id !== auth()->id())
                                                            <form method="POST"
                                                                action="{{ route('users.destroy', $user->id) }}"
                                                                onsubmit="return confirm('Hapus pengguna {{ $user->name }}?')">
                                                                @csrf
                                                                @method('DELETE')
                                                                <button type="submit"
                                                                    class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#ef4444] font-semibold hover:bg-[#fef2f2] transition-colors border-t border-[#dddbff]">
                                                                    <iconify-icon icon="solar:trash-bin-trash-linear"
                                                                        class="text-[#ef4444]"></iconify-icon>
                                                                    Hapus
                                                                </button>
                                                            </form>
                                                        @endif
                                                    @endcan
                                                </div>
                                            </div>
                                        </td>

                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="px-5 py-16 text-center">
                                            <div class="flex flex-col items-center gap-3">
                                                <div
                                                    class="w-14 h-14 rounded-2xl bg-[#dddbff]/30 flex items-center justify-center text-[#2f27ce]/30 text-3xl">
                                                    <iconify-icon
                                                        icon="solar:users-group-rounded-linear"></iconify-icon>
                                                </div>
                                                <p class="font-bold text-[#050316]">Tidak ada pengguna ditemukan</p>
                                                <p class="text-sm text-[#2f27ce]/50">Coba ubah filter atau tambah
                                                    pengguna baru.</p>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse

                            </tbody>
                        </table>
                    </div>

                    {{-- PAGINATION --}}
                    <div
                        class="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-[#dddbff] bg-[#fbfbfe]/50 gap-4">
                        <p class="text-xs font-medium text-[#2f27ce]/70">
                            Menampilkan
                            <span class="font-bold text-[#050316]">{{ $users->firstItem() ?? 0 }}</span>–<span
                                class="font-bold text-[#050316]">{{ $users->lastItem() ?? 0 }}</span>
                            dari <span class="font-bold text-[#050316]">{{ $users->total() }}</span> pengguna
                        </p>
                        <div class="flex items-center gap-1.5">
                            @if ($users->onFirstPage())
                                <span
                                    class="px-3 py-2 text-xs font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed">Previous</span>
                            @else
                                <a href="{{ $users->previousPageUrl() }}"
                                    class="px-3 py-2 text-xs font-bold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-all">Previous</a>
                            @endif

                            @foreach ($users->getUrlRange(1, $users->lastPage()) as $page => $url)
                                <a href="{{ $url }}" @class([
                                    'w-9 h-9 flex items-center justify-center text-sm font-bold rounded-xl transition-all duration-150 active:scale-[0.95]',
                                    'bg-gradient-to-r from-[#2f27ce] to-[#443dff] text-white shadow-md shadow-[#2f27ce]/20' =>
                                        $page == $users->currentPage(),
                                    'bg-white border border-[#dddbff] text-[#2f27ce] hover:bg-[#dddbff]' =>
                                        $page != $users->currentPage(),
                                ])>{{ $page }}</a>
                            @endforeach

                            @if ($users->hasMorePages())
                                <a href="{{ $users->nextPageUrl() }}"
                                    class="px-4 py-2 text-xs font-bold text-[#2f27ce] bg-white border border-[#dddbff] rounded-xl hover:bg-[#dddbff] transition-all">Next</a>
                            @else
                                <span
                                    class="px-4 py-2 text-xs font-bold text-[#2f27ce]/40 bg-[#fbfbfe] border border-[#dddbff] rounded-xl cursor-not-allowed">Next</span>
                            @endif
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
@endsection
