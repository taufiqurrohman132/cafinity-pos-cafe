@extends('layouts.app')

@section('content')
    <div class="min-h-screen bg-[#fbfbfe] font-inter text-[#050316] p-4 md:p-6">
        <div class="max-w-2xl mx-auto space-y-6">

            {{-- HEADER --}}
            <div class="flex items-center gap-4">
                <a href="{{ route('users.index') }}"
                    class="w-10 h-10 rounded-xl border border-[#dddbff] bg-white flex items-center justify-center text-[#2f27ce] hover:bg-[#dddbff] transition-all">
                    <iconify-icon icon="solar:alt-arrow-left-linear" class="text-lg"></iconify-icon>
                </a>
                <div>
                    <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                        Tambah Pengguna
                    </h1>
                    <p class="text-xs text-[#2f27ce]/70 font-medium mt-0.5">Buat akun baru untuk personel cafe.</p>
                </div>
            </div>

            {{-- FORM CARD --}}
            <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-6 space-y-5">

                <form method="POST" action="{{ route('users.store') }}" class="space-y-5">
                    @csrf

                    {{-- Nama --}}
                    <div>
                        <label class="block text-xs font-bold text-[#050316] mb-1.5">Nama Lengkap <span class="text-[#ef4444]">*</span></label>
                        <input type="text" name="name" value="{{ old('name') }}"
                            placeholder="Contoh: Budi Santoso"
                            class="w-full h-11 bg-[#fbfbfe] border @error('name') border-[#ef4444] @else border-[#dddbff] @enderror rounded-xl px-4 text-sm font-semibold text-[#050316] placeholder-[#2f27ce]/40 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                        @error('name')
                            <p class="text-xs text-[#ef4444] font-semibold mt-1.5">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- Email --}}
                    <div>
                        <label class="block text-xs font-bold text-[#050316] mb-1.5">Email <span class="text-[#ef4444]">*</span></label>
                        <input type="email" name="email" value="{{ old('email') }}"
                            placeholder="contoh@smartcafe.id"
                            class="w-full h-11 bg-[#fbfbfe] border @error('email') border-[#ef4444] @else border-[#dddbff] @enderror rounded-xl px-4 text-sm font-semibold text-[#050316] placeholder-[#2f27ce]/40 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                        @error('email')
                            <p class="text-xs text-[#ef4444] font-semibold mt-1.5">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- Role & Status --}}
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-[#050316] mb-1.5">Role <span class="text-[#ef4444]">*</span></label>
                            <select name="role"
                                class="w-full h-11 bg-[#fbfbfe] border @error('role') border-[#ef4444] @else border-[#dddbff] @enderror rounded-xl px-4 text-sm font-semibold text-[#050316] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer">
                                <option value="">Pilih Role</option>
                                <option value="owner"   {{ old('role') === 'owner'   ? 'selected' : '' }}>Owner</option>
                                <option value="admin"   {{ old('role') === 'admin'   ? 'selected' : '' }}>Admin</option>
                                <option value="cashier" {{ old('role') === 'cashier' ? 'selected' : '' }}>Kasir</option>
                            </select>
                            @error('role')
                                <p class="text-xs text-[#ef4444] font-semibold mt-1.5">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-[#050316] mb-1.5">Status</label>
                            <select name="status"
                                class="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-4 text-sm font-semibold text-[#050316] outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all cursor-pointer">
                                <option value="active"      {{ old('status', 'active') === 'active'      ? 'selected' : '' }}>Active</option>
                                <option value="pending"     {{ old('status') === 'pending'               ? 'selected' : '' }}>Pending</option>
                                <option value="inactive"    {{ old('status') === 'inactive'              ? 'selected' : '' }}>Inactive</option>
                                <option value="deactivated" {{ old('status') === 'deactivated'           ? 'selected' : '' }}>Deactivated</option>
                            </select>
                        </div>
                    </div>

                    {{-- Password --}}
                    <div x-data="{ show: false }">
                        <label class="block text-xs font-bold text-[#050316] mb-1.5">Password <span class="text-[#ef4444]">*</span></label>
                        <div class="relative">
                            <input :type="show ? 'text' : 'password'" name="password"
                                placeholder="Minimal 8 karakter"
                                class="w-full h-11 bg-[#fbfbfe] border @error('password') border-[#ef4444] @else border-[#dddbff] @enderror rounded-xl px-4 pr-11 text-sm font-semibold text-[#050316] placeholder-[#2f27ce]/40 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                            <button type="button" @click="show = !show"
                                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 hover:text-[#443dff] transition-colors">
                                <iconify-icon :icon="show ? 'solar:eye-closed-linear' : 'solar:eye-linear'" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                        @error('password')
                            <p class="text-xs text-[#ef4444] font-semibold mt-1.5">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- Konfirmasi Password --}}
                    <div x-data="{ show: false }">
                        <label class="block text-xs font-bold text-[#050316] mb-1.5">Konfirmasi Password <span class="text-[#ef4444]">*</span></label>
                        <div class="relative">
                            <input :type="show ? 'text' : 'password'" name="password_confirmation"
                                placeholder="Ulangi password"
                                class="w-full h-11 bg-[#fbfbfe] border border-[#dddbff] rounded-xl px-4 pr-11 text-sm font-semibold text-[#050316] placeholder-[#2f27ce]/40 outline-none focus:ring-4 focus:ring-[#dddbff]/50 focus:border-[#443dff] transition-all">
                            <button type="button" @click="show = !show"
                                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2f27ce]/50 hover:text-[#443dff] transition-colors">
                                <iconify-icon :icon="show ? 'solar:eye-closed-linear' : 'solar:eye-linear'" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    </div>

                    {{-- Divider --}}
                    <div class="border-t border-[#dddbff]"></div>

                    {{-- Actions --}}
                    <div class="flex items-center justify-end gap-3">
                        <a href="{{ route('users.index') }}"
                            class="px-5 py-2.5 border border-[#dddbff] bg-white text-[#2f27ce] text-sm font-bold hover:bg-[#dddbff] transition-all rounded-xl active:scale-[0.98]">
                            Batal
                        </a>
                        <button type="submit"
                            class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98]">
                            <iconify-icon icon="solar:user-plus-rounded-linear" class="text-lg"></iconify-icon>
                            Simpan Pengguna
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </div>
@endsection