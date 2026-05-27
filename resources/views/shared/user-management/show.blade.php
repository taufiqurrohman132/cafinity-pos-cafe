@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#fbfbfe] font-inter text-[#050316] p-4 md:p-6">
        <div class="max-w-3xl mx-auto space-y-6">

            {{-- HEADER --}}
            <div class="flex items-center gap-4">
                <a href="{{ route('users.index') }}"
                    class="w-10 h-10 rounded-xl border border-[#dddbff] bg-white flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff] transition-all">
                    <iconify-icon icon="solar:alt-arrow-left-linear" class="text-lg"></iconify-icon>
                </a>
                <div>
                    <h1
                        class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                        Detail Pengguna
                    </h1>
                    <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5">Informasi lengkap akun personel.</p>
                </div>
            </div>

            {{-- FLASH --}}
            @if (session('success'))
                <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 4000)"
                    class="flex items-center gap-3 bg-white border border-[#dddbff] shadow-lg rounded-2xl px-5 py-3">
                    <div class="w-7 h-7 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
                        <iconify-icon icon="solar:check-circle-bold"></iconify-icon>
                    </div>
                    <p class="text-[13px] font-bold text-[#050316]">{{ session('success') }}</p>
                    <button @click="show = false" class="ml-auto text-[#2f27ce]/40 hover:text-[#2f27ce]">
                        <iconify-icon icon="solar:close-circle-linear"></iconify-icon>
                    </button>
                </div>
            @endif

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                {{-- KIRI: PROFIL --}}
                <div class="md:col-span-1 space-y-4">

                    {{-- Avatar Card --}}
                    <div
                        class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 flex flex-col items-center text-center gap-3">
                        <div
                            class="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2f27ce] to-[#443dff] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#2f27ce]/20">
                            {{ strtoupper(substr($user->name, 0, 2)) }}
                        </div>
                        <div>
                            <p class="font-extrabold text-[#050316] text-lg">{{ $user->name }}</p>
                            <p class="text-xs text-[#2f27ce]/70 font-medium">{{ $user->email }}</p>
                        </div>

                        {{-- Role Badge --}}
                        @php
                            $roleStyles = [
                                'owner' => 'bg-[#443dff] text-white',
                                'admin' => 'bg-[#dddbff]/50 text-[#2f27ce]',
                                'cashier' => 'bg-[#dddbff]/50 text-[#2f27ce]',
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
                                    'label' => 'Active',
                                ],
                                'inactive' => [
                                    'bg' => 'bg-[#f3f4f6]',
                                    'dot' => 'bg-[#6b7280]',
                                    'text' => 'text-[#6b7280]',
                                    'label' => 'Inactive',
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
                                    'label' => 'Deactivated',
                                ],
                            ];
                            $s = $statusStyles[$user->status] ?? $statusStyles['inactive'];
                        @endphp

                        <span
                            class="px-3 py-1.5 rounded-lg text-xs font-bold {{ $roleStyles[$user->role] ?? 'bg-gray-100 text-gray-600' }}">
                            {{ $roleLabels[$user->role] ?? ucfirst($user->role) }}
                        </span>

                        <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md {{ $s['bg'] }} {{ $s['text'] }} text-xs font-bold">
                            <span class="w-1.5 h-1.5 rounded-full {{ $s['dot'] }}"></span>
                            {{ $s['label'] }}
                        </span>
                    </div>

                    {{-- Quick Actions --}}

                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-4 space-y-2">
                        <p class="text-xs font-bold text-[#2f27ce]/70 uppercase tracking-widest mb-3">Aksi Cepat</p>

                        {{-- Semua role bisa lihat profil --}}
                        <a href="{{ route('profile.edit') }}"
                            class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-bold text-[#050316] hover:bg-[#dddbff]/30 rounded-xl transition-colors">
                            <iconify-icon icon="solar:eye-linear" class="text-[#2f27ce] text-base"></iconify-icon>
                            Lihat Profil
                        </a>

                        {{-- Hanya yang punya permission manage-users --}}
                        @can('manage-users')
                            <a href="{{ route('users.edit', $user->id) }}"
                                class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-bold text-[#050316] hover:bg-[#dddbff]/30 rounded-xl transition-colors">
                                <iconify-icon icon="solar:pen-linear" class="text-[#2f27ce] text-base"></iconify-icon>
                                Edit Pengguna
                            </a>

                            <form method="POST" action="{{ route('users.toggle-status', $user->id) }}">
                                @csrf
                                <button type="submit"
                                    class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-bold text-[#050316] hover:bg-[#dddbff]/30 rounded-xl transition-colors">
                                    <iconify-icon icon="solar:shield-warning-linear"
                                        class="text-[#f59e0b] text-base"></iconify-icon>
                                    {{ $user->status === 'active' ? 'Nonaktifkan' : 'Aktifkan' }}
                                </button>
                            </form>

                            <form method="POST" action="{{ route('users.reset-password', $user->id) }}">
                                @csrf
                                <button type="submit"
                                    class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-bold text-[#050316] hover:bg-[#dddbff]/30 rounded-xl transition-colors">
                                    <iconify-icon icon="solar:key-linear" class="text-[#2f27ce] text-base"></iconify-icon>
                                    Reset Password
                                </button>
                            </form>

                            @if ($user->id !== auth()->id())
                                <form method="POST" action="{{ route('users.destroy', $user->id) }}"
                                    onsubmit="return confirm('Hapus pengguna {{ $user->name }}?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit"
                                        class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-bold text-[#ef4444] hover:bg-[#fef2f2] rounded-xl transition-colors border-t border-[#dddbff] mt-1 pt-3">
                                        <iconify-icon icon="solar:trash-bin-trash-linear" class="text-base"></iconify-icon>
                                        Hapus Pengguna
                                    </button>
                                </form>
                            @endif
                        @endcan

                    </div>

                </div>

                {{-- KANAN: INFO + PERMISSIONS --}}
                <div class="md:col-span-2 space-y-4">

                    {{-- Info Detail --}}
                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <h3 class="font-extrabold text-[#050316] mb-4">Informasi Akun</h3>
                        <div class="space-y-3">

                            <div class="flex items-center justify-between py-2.5 border-b border-[#dddbff]/50">
                                <p class="text-xs font-bold text-[#2f27ce]/70">ID Pengguna</p>
                                <p class="text-sm font-bold text-[#050316]">#{{ str_pad($user->id, 4, '0', STR_PAD_LEFT) }}
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-2.5 border-b border-[#dddbff]/50">
                                <p class="text-xs font-bold text-[#2f27ce]/70">Nama</p>
                                <p class="text-sm font-bold text-[#050316]">{{ $user->name }}</p>
                            </div>

                            <div class="flex items-center justify-between py-2.5 border-b border-[#dddbff]/50">
                                <p class="text-xs font-bold text-[#2f27ce]/70">Email</p>
                                <p class="text-sm font-bold text-[#050316]">{{ $user->email }}</p>
                            </div>

                            <div class="flex items-center justify-between py-2.5 border-b border-[#dddbff]/50">
                                <p class="text-xs font-bold text-[#2f27ce]/70">Role</p>
                                <p class="text-sm font-bold text-[#050316]">
                                    {{ $roleLabels[$user->role] ?? ucfirst($user->role) }}</p>
                            </div>

                            <div class="flex items-center justify-between py-2.5 border-b border-[#dddbff]/50">
                                <p class="text-xs font-bold text-[#2f27ce]/70">Status</p>
                                <span
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md {{ $s['bg'] }} {{ $s['text'] }} text-xs font-bold">
                                    <span class="w-1.5 h-1.5 rounded-full {{ $s['dot'] }}"></span>
                                    {{ $s['label'] }}
                                </span>
                            </div>

                            <div class="flex items-center justify-between py-2.5 border-b border-[#dddbff]/50">
                                <p class="text-xs font-bold text-[#2f27ce]/70">Bergabung</p>
                                <p class="text-sm font-bold text-[#050316]">{{ $user->created_at->format('d M Y, H:i') }}
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-2.5">
                                <p class="text-xs font-bold text-[#2f27ce]/70">Terakhir Diperbarui</p>
                                <p class="text-sm font-bold text-[#050316]">{{ $user->updated_at->diffForHumans() }}</p>
                            </div>

                        </div>
                    </div>

                    {{-- Permissions --}}
                    <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6">
                        <h3 class="font-extrabold text-[#050316] mb-1">Hak Akses (Permissions)</h3>
                        <p class="text-xs text-[#2f27ce]/70 font-medium mb-4">Berdasarkan role yang ditetapkan.</p>

                        @php
                            $allPermissions = [
                                'manage-users' => [
                                    'label' => 'Kelola Pengguna',
                                    'icon' => 'solar:users-group-rounded-linear',
                                ],
                                'manage-menu' => ['label' => 'Kelola Menu', 'icon' => 'solar:hamburger-linear'],
                                'manage-orders' => ['label' => 'Kelola Pesanan', 'icon' => 'solar:bag-linear'],
                                'view-reports' => ['label' => 'Lihat Laporan', 'icon' => 'solar:chart-linear'],
                                'manage-settings' => [
                                    'label' => 'Kelola Pengaturan',
                                    'icon' => 'solar:settings-linear',
                                ],
                            ];
                            $userPerms = $user->getAllPermissions()->pluck('name')->toArray();
                        @endphp

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            @foreach ($allPermissions as $key => $perm)
                                @php $hasAccess = in_array($key, $userPerms); @endphp
                                <div
                                    class="flex items-center gap-3 p-3 rounded-xl border {{ $hasAccess ? 'border-[#10b981]/20 bg-[#ecfdf5]' : 'border-[#dddbff] bg-[#fbfbfe]' }}">
                                    <div
                                        class="w-8 h-8 rounded-lg {{ $hasAccess ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#dddbff]/30 text-[#2f27ce]/30' }} flex items-center justify-center flex-shrink-0">
                                        <iconify-icon icon="{{ $perm['icon'] }}" class="text-base"></iconify-icon>
                                    </div>
                                    <p class="text-xs font-bold {{ $hasAccess ? 'text-[#050316]' : 'text-[#2f27ce]/40' }}">
                                        {{ $perm['label'] }}
                                    </p>
                                    <div class="ml-auto">
                                        @if ($hasAccess)
                                            <iconify-icon icon="solar:check-circle-bold"
                                                class="text-[#10b981] text-base"></iconify-icon>
                                        @else
                                            <iconify-icon icon="solar:close-circle-linear"
                                                class="text-[#2f27ce]/20 text-base"></iconify-icon>
                                        @endif
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
@endsection
