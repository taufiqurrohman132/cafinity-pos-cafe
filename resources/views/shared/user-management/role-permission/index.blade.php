@extends('layouts.app')

@section('content')
  
    <div class="min-h-screen bg-[#fbfbfe] font-inter text-[#050316]">
        <div class="flex">

            {{-- ======================== MAIN CONTENT ======================== --}}
            <div class="flex-1 p-6 space-y-6" x-data="rolesPage()">

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

                {{-- HEADER --}}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1
                            class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#050316] to-[#2f27ce] tracking-tight">
                            Roles & Permissions
                        </h1>
                        <p class="text-sm text-[#2f27ce]/70 font-medium mt-1">
                            Kelola hak akses pengguna berdasarkan tanggung jawab kerja mereka.
                        </p>
                    </div>
                    @can('manage-roles')
                        <a href="{{ route('roles.create') }}"
                            class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/30 transition-all active:scale-[0.98] duration-150 whitespace-nowrap">
                            <iconify-icon icon="solar:add-circle-linear" class="text-lg"></iconify-icon>
                            + Buat Peran Baru
                        </a>
                    @endcan
                </div>

                {{-- BODY: 2 KOLOM --}}
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {{-- ===== DAFTAR PERAN ===== --}}
                    <div class="xl:col-span-4 space-y-3">
                        <div class="flex items-center justify-between mb-1">
                            <h2 class="text-sm font-black text-[#050316]">Daftar Peran</h2>
                            <span class="text-xs font-bold text-white bg-[#443dff] rounded-full px-2.5 py-0.5">
                                {{ $roles->count() }}
                            </span>
                        </div>

                        @foreach ($roles as $role)
                            @php
                                $dotColors = [
                                    'owner' => 'bg-[#443dff]',
                                    'admin' => 'bg-[#3b82f6]',
                                    'cashier' => 'bg-[#f59e0b]',
                                    'kitchen' => 'bg-[#10b981]',
                                    'inventory' => 'bg-[#8b5cf6]',
                                ];
                                $dot = $dotColors[$role->slug ?? $role->name] ?? 'bg-[#6b7280]';
                            @endphp
                            <div @click="selectRole({{ $role->id }})"
                                :class="selectedRole === {{ $role->id }} ?
                                    'border-[#2f27ce] bg-white shadow-md shadow-[#2f27ce]/10 ring-1 ring-[#2f27ce]' :
                                    'border-[#dddbff] bg-white hover:border-[#443dff]/50 hover:shadow-sm'"
                                class="rounded-2xl border p-4 cursor-pointer transition-all duration-150 group">
                                <div class="flex items-start justify-between gap-2">
                                    <div class="flex items-center gap-2.5 flex-1 min-w-0">
                                        <div class="w-2.5 h-2.5 rounded-full {{ $dot }} flex-shrink-0 mt-0.5">
                                        </div>
                                        <div class="min-w-0">
                                            <p class="font-bold text-[#050316] text-sm truncate">{{ $role->name }}</p>
                                            <p class="text-[11px] font-semibold text-[#2f27ce]/60 mt-0.5">
                                                {{ $role->users_count ?? $role->users->count() }} Users
                                            </p>
                                        </div>
                                    </div>
                                    @can('manage-roles')
                                        <div
                                            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            <a href="{{ route('roles.edit', $role->id) }}"
                                                class="p-1.5 text-[#2f27ce]/50 hover:text-[#443dff] hover:bg-[#dddbff]/50 rounded-lg transition-all"
                                                @click.stop>
                                                <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon>
                                            </a>
                                            <form method="POST" action="{{ route('roles.destroy', $role->id) }}"
                                                onsubmit="return confirm('Hapus peran {{ $role->name }}?')" @click.stop>
                                                @csrf @method('DELETE')
                                                <button type="submit"
                                                    class="p-1.5 text-[#ef4444]/50 hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-all">
                                                    <iconify-icon icon="solar:trash-bin-trash-linear"
                                                        class="text-sm"></iconify-icon>
                                                </button>
                                            </form>
                                        </div>
                                    @endcan
                                </div>
                                <p class="text-xs text-[#050316]/60 font-medium mt-2 ml-5 line-clamp-2">
                                    {{ $role->description }}</p>
                                <p class="text-[10px] font-bold text-[#2f27ce]/40 mt-2 ml-5">
                                    Update: {{ $role->updated_at->diffForHumans() }}
                                </p>
                            </div>
                        @endforeach
                    </div>

                    {{-- ===== DETAIL PERAN + MATRIX ===== --}}
                    <div class="xl:col-span-8 space-y-5">

                        {{-- Jika belum pilih role --}}
                        <div x-show="selectedRole === null"
                            class="bg-white rounded-2xl border border-[#dddbff] p-12 flex flex-col items-center justify-center text-center">
                            <div
                                class="w-16 h-16 rounded-2xl bg-[#dddbff]/30 flex items-center justify-center text-[#2f27ce]/30 text-4xl mb-4">
                                <iconify-icon icon="solar:shield-keyhole-linear"></iconify-icon>
                            </div>
                            <p class="font-bold text-[#050316]">Pilih peran untuk melihat detail</p>
                            <p class="text-sm text-[#2f27ce]/50 mt-1">Klik salah satu peran di sebelah kiri.</p>
                        </div>

                        {{-- Detail tiap role --}}
                        @foreach ($roles as $role)
                            <div x-show="selectedRole === {{ $role->id }}" x-cloak class="space-y-5">

                                {{-- Header detail --}}
                                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                                    <div class="flex items-start justify-between gap-4">
                                        <div class="flex items-center gap-4">
                                            <div
                                                class="w-12 h-12 rounded-xl bg-[#dddbff]/40 flex items-center justify-center text-[#2f27ce] text-2xl">
                                                <iconify-icon icon="solar:shield-user-linear"></iconify-icon>
                                            </div>
                                            <div>
                                                <h2 class="text-lg font-extrabold text-[#050316]">{{ $role->name }}
                                                </h2>
                                                <p class="text-sm text-[#2f27ce]/60 font-medium mt-0.5">
                                                    {{ $role->description }}</p>
                                            </div>
                                        </div>
                                        @can('manage-roles')
                                            <div class="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    class="flex items-center gap-1.5 px-3 py-2 border border-[#dddbff] bg-white text-[#2f27ce] text-xs font-bold hover:bg-[#dddbff] rounded-xl transition-all active:scale-[0.98]">
                                                    <iconify-icon icon="solar:copy-linear" class="text-sm"></iconify-icon>
                                                    Duplikat
                                                </button>
                                                <a href="{{ route('roles.edit', $role->id) }}"
                                                    class="flex items-center gap-1.5 px-3 py-2 border border-[#dddbff] bg-white text-[#2f27ce] text-xs font-bold hover:bg-[#dddbff] rounded-xl transition-all active:scale-[0.98]">
                                                    <iconify-icon icon="solar:pen-linear" class="text-sm"></iconify-icon>
                                                    Edit Detail
                                                </a>
                                            </div>
                                        @endcan
                                    </div>

                                    {{-- Preset Cepat --}}
                                    <div class="mt-4 pt-4 border-t border-[#dddbff] flex items-center gap-3 flex-wrap">
                                        <p class="text-[10px] font-black text-[#2f27ce]/50 uppercase tracking-widest">
                                            Preset Cepat:</p>
                                        <button
                                            class="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddbff] bg-[#fbfbfe] text-[#050316] text-xs font-bold hover:bg-[#dddbff] rounded-lg transition-all active:scale-[0.98]">
                                            <iconify-icon icon="solar:lock-keyhole-linear"
                                                class="text-sm"></iconify-icon>
                                            Read-Only
                                        </button>
                                        <button
                                            class="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddbff] bg-[#fbfbfe] text-[#050316] text-xs font-bold hover:bg-[#dddbff] rounded-lg transition-all active:scale-[0.98]">
                                            <iconify-icon icon="solar:lock-unlocked-linear"
                                                class="text-sm"></iconify-icon>
                                            Full Access
                                        </button>
                                        <button
                                            class="flex items-center gap-1.5 px-3 py-1.5 border border-[#dddbff] bg-[#fbfbfe] text-[#050316] text-xs font-bold hover:bg-[#dddbff] rounded-lg transition-all active:scale-[0.98]">
                                            <iconify-icon icon="solar:monitor-smartphone-linear"
                                                class="text-sm"></iconify-icon>
                                            POS-Only Access
                                        </button>
                                    </div>
                                </div>

                                {{-- Permission Matrix --}}
                                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm overflow-hidden">
                                    <form method="POST"
                                        action="{{ route('user-management.role-permission.permissions.update', $role->id) }}">
                                        @csrf @method('PUT')

                                        <div class="overflow-x-auto">
                                            <table class="w-full min-w-[560px]">
                                                <thead>
                                                    <tr class="border-b border-[#dddbff] bg-[#fbfbfe]/60">
                                                        <th
                                                            class="px-5 py-4 text-xs font-black text-[#050316] text-left">
                                                            Modul Sistem</th>
                                                        <th class="px-3 py-4 text-center">
                                                            <div class="flex flex-col items-center gap-1">
                                                                <iconify-icon icon="solar:eye-linear"
                                                                    class="text-[#2f27ce]/60 text-base"></iconify-icon>
                                                                <span
                                                                    class="text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-wider">View</span>
                                                            </div>
                                                        </th>
                                                        <th class="px-3 py-4 text-center">
                                                            <div class="flex flex-col items-center gap-1">
                                                                <iconify-icon icon="solar:add-circle-linear"
                                                                    class="text-[#2f27ce]/60 text-base"></iconify-icon>
                                                                <span
                                                                    class="text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-wider">Create</span>
                                                            </div>
                                                        </th>
                                                        <th class="px-3 py-4 text-center">
                                                            <div class="flex flex-col items-center gap-1">
                                                                <iconify-icon icon="solar:pen-linear"
                                                                    class="text-[#2f27ce]/60 text-base"></iconify-icon>
                                                                <span
                                                                    class="text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-wider">Edit</span>
                                                            </div>
                                                        </th>
                                                        <th class="px-3 py-4 text-center">
                                                            <div class="flex flex-col items-center gap-1">
                                                                <iconify-icon icon="solar:trash-bin-trash-linear"
                                                                    class="text-[#2f27ce]/60 text-base"></iconify-icon>
                                                                <span
                                                                    class="text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-wider">Delete</span>
                                                            </div>
                                                        </th>
                                                        <th class="px-3 py-4 text-center">
                                                            <div class="flex flex-col items-center gap-1">
                                                                <iconify-icon icon="solar:upload-square-linear"
                                                                    class="text-[#2f27ce]/60 text-base"></iconify-icon>
                                                                <span
                                                                    class="text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-wider">Export</span>
                                                            </div>
                                                        </th>
                                                        <th class="px-3 py-4 text-center">
                                                            <div class="flex flex-col items-center gap-1">
                                                                <iconify-icon icon="solar:check-square-linear"
                                                                    class="text-[#2f27ce]/60 text-base"></iconify-icon>
                                                                <span
                                                                    class="text-[10px] font-black text-[#2f27ce]/60 uppercase tracking-wider">All</span>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-[#dddbff]/50">
                                                    @php
                                                        $modules = [
                                                            'dashboard' => 'Dashboard',
                                                            'pos' => 'Point of Sales (POS)',
                                                            'transactions' => 'Transactions',
                                                            'menus' => 'Menu Catalog',
                                                            'recipe-costing' => 'Recipe Costing',
                                                            'inventories' => 'Inventory',
                                                            'reports' => 'Reports',
                                                            'users' => 'User Management',
                                                        ];
                                                        $actions = ['view', 'create', 'edit', 'delete', 'export'];
                                                        $rolePerms = $role->permissions->pluck('name')->toArray();
                                                    @endphp

                                                    @foreach ($modules as $key => $label)
                                                        <tr
                                                            class="hover:bg-[#dddbff]/10 transition-colors duration-100 group">
                                                            <td class="px-5 py-4 text-sm font-semibold text-[#050316]">
                                                                {{ $label }}</td>

                                                            @foreach ($actions as $action)
                                                                @php
                                                                    $permName = $key . '.' . $action;
                                                                    $checked = in_array($permName, $rolePerms);
                                                                @endphp
                                                                <td class="px-3 py-4 text-center">
                                                                    <label
                                                                        class="relative inline-flex items-center cursor-pointer">
                                                                        <input type="checkbox" name="permissions[]"
                                                                            value="{{ $permName }}"
                                                                            {{ $checked ? 'checked' : '' }}
                                                                            class="sr-only peer"
                                                                            onchange="this.form.submit()">
                                                                        <div
                                                                            class="w-10 h-6 bg-[#dddbff]/60 peer-checked:bg-[#443dff] rounded-full transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 shadow-inner">
                                                                        </div>
                                                                    </label>
                                                                </td>
                                                            @endforeach

                                                            {{-- Toggle ALL --}}
                                                            <td class="px-3 py-4 text-center">
                                                                @php
                                                                    $allChecked = collect($actions)->every(
                                                                        fn($a) => in_array(
                                                                            $key . '.' . $a,
                                                                            $rolePerms,
                                                                        ),
                                                                    );
                                                                @endphp
                                                                <button type="button"
                                                                    onclick="toggleRowAll(this, '{{ $key }}')"
                                                                    class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150 mx-auto
                                                            {{ $allChecked ? 'border-[#443dff] bg-[#443dff] text-white' : 'border-[#dddbff] text-transparent hover:border-[#443dff]' }}">
                                                                    <iconify-icon icon="solar:check-read-linear"
                                                                        class="text-xs"></iconify-icon>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                </tbody>
                                            </table>
                                        </div>

                                        <div
                                            class="px-5 py-4 border-t border-[#dddbff] bg-[#fbfbfe]/50 flex justify-end">
                                            <button type="submit"
                                                class="flex items-center gap-2 bg-gradient-to-r from-[#2f27ce] to-[#443dff] hover:from-[#050316] hover:to-[#2f27ce] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2f27ce]/20 transition-all active:scale-[0.98]">
                                                <iconify-icon icon="solar:diskette-linear"
                                                    class="text-lg"></iconify-icon>
                                                Simpan Perubahan
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {{-- Riwayat Perubahan --}}
                                <div class="bg-white rounded-2xl border border-[#dddbff] shadow-sm p-5">
                                    <div class="flex items-center gap-2 mb-4">
                                        <iconify-icon icon="solar:history-linear"
                                            class="text-[#2f27ce] text-lg"></iconify-icon>
                                        <h3 class="font-extrabold text-[#050316]">Riwayat Perubahan Terakhir</h3>
                                    </div>

                                    {{-- @php
                                    $logs = \App\Models\AuditLog::with('user')
                                        ->where('subject_type', 'role')
                                        ->where('subject_id', $role->id)
                                        ->latest()->take(3)->get();
                                @endphp --}}
                                    @php $logs = collect(); @endphp

                                    @if ($logs->isEmpty())
                                        <p class="text-sm text-[#2f27ce]/40 text-center py-4">Belum ada riwayat
                                            perubahan.</p>
                                    @else
                                        <div class="space-y-3">
                                            @foreach ($logs as $log)
                                                <div
                                                    class="flex items-start gap-3 py-3 border-b border-[#dddbff]/50 last:border-0">
                                                    <div
                                                        class="w-7 h-7 rounded-full bg-[#dddbff]/40 flex items-center justify-center text-[#2f27ce] flex-shrink-0 mt-0.5">
                                                        <iconify-icon icon="solar:shield-user-linear"
                                                            class="text-sm"></iconify-icon>
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <p class="text-sm text-[#050316]">
                                                            <span
                                                                class="font-bold">{{ $log->user?->name ?? 'System' }}</span>
                                                            {{ $log->action }}
                                                        </p>
                                                        <p class="text-[11px] text-[#2f27ce]/50 font-medium mt-0.5">
                                                            {{ $log->created_at->format('d M Y, H:i') }}
                                                        </p>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    @endif
                                </div>

                            </div>
                        @endforeach

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        function rolesPage() {
            return {
                selectedRole: {{ $roles->first()?->id ?? 'null' }},
                selectRole(id) {
                    this.selectedRole = id;
                }
            }
        }

        function toggleRowAll(btn, moduleKey) {
            const form = btn.closest('form');
            const boxes = form.querySelectorAll(`input[type="checkbox"][value^="${moduleKey}."]`);
            const allOn = [...boxes].every(b => b.checked);
            boxes.forEach(b => b.checked = !allOn);

            const isNowOn = !allOn;
            btn.classList.toggle('border-[#443dff]', isNowOn);
            btn.classList.toggle('bg-[#443dff]', isNowOn);
            btn.classList.toggle('text-white', isNowOn);
            btn.classList.toggle('border-[#dddbff]', !isNowOn);
            btn.classList.toggle('text-transparent', !isNowOn);
        }

        // Ganti DOMContentLoaded dengan turbo:load agar jalan setiap navigasi Turbo
        document.addEventListener('turbo:load', () => {
            // inisialisasi apapun yang perlu dijalankan ulang taruh di sini
        });
    </script>
@endpush
