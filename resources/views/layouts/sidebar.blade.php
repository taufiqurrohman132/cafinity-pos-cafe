<aside class="w-[260px] bg-[#fbfbfe] border-r border-[#dddbff] flex flex-col justify-between h-screen z-20">

    <div>

        {{-- Logo --}}
        <div class="px-6 py-6 border-b border-[#dddbff]">
            <h1
                class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2f27ce] to-[#443dff] tracking-tight">
                Devora POS
            </h1>
        </div>

        @php
            $baseClass = 'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200';
            $activeClass = 'bg-gradient-to-r from-[#dddbff]/70 to-[#dddbff]/10 text-[#2f27ce] font-extrabold shadow-sm';
            $inactiveClass = 'text-[#050316]/70 font-medium hover:bg-[#dddbff]/30 hover:text-[#2f27ce]';
        @endphp

        <nav class="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-hide">

            {{-- Dashboard — semua role --}}
            <a href="{{ route(auth()->user()?->dashboardRoute() ?? 'owner.dashboard') }}"
                class="{{ $baseClass }} {{ request()->routeIs('owner.dashboard', 'admin.dashboard', 'cashier.dashboard') ? $activeClass : $inactiveClass }}">
                <iconify-icon icon="solar:home-2-linear" class="text-[20px]"></iconify-icon>
                <span class="text-[13px]">Dashboard</span>
            </a>

            {{-- POS — semua role --}}
            <a href="{{ route('pos.index') }}"
                class="{{ $baseClass }} {{ request()->routeIs('pos.*') ? $activeClass : $inactiveClass }}">
                <iconify-icon icon="solar:card-2-linear" class="text-[20px]"></iconify-icon>
                <span class="text-[13px]">Point of Sale</span>
            </a>

            {{-- Transactions — semua role --}}
            <a href="{{ route('transactions.index') }}"
                class="{{ $baseClass }} {{ request()->routeIs('transactions.*') ? $activeClass : $inactiveClass }}">
                <iconify-icon icon="solar:clock-circle-linear" class="text-[20px]"></iconify-icon>
                <span class="text-[13px]">Transactions</span>
            </a>

            {{-- Kitchen Queue — semua role --}}
            <a href="{{ route('kitchen-orders.index') }}"
                class="{{ $baseClass }} {{ request()->routeIs('kitchen-orders.*') ? $activeClass : $inactiveClass }}">
                <iconify-icon icon="solar:chef-hat-linear" class="text-[20px]"></iconify-icon>
                <span class="text-[13px]">Kitchen Queue</span>
            </a>

            {{-- ── OWNER & ADMIN ONLY ─────────────────── --}}
            @can('manage-menu')
                {{-- Menu Catalog --}}
                <a href="{{ route('menus.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('menus.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:clipboard-list-linear" class="text-[20px]"></iconify-icon>
                    <span class="text-[13px]">Menu Catalog</span>
                </a>

                {{-- Recipe Costing --}}
                <a href="{{ route('recipe.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('recipe.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:calculator-minimalistic-linear" class="text-[20px]"></iconify-icon>
                    <span class="text-[13px]">Recipe Costing</span>
                </a>

                {{-- Inventory --}}
                <a href="{{ route('inventories.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('inventories.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:box-linear" class="text-[20px]"></iconify-icon>
                    <span class="text-[13px]">Inventory</span>
                </a>

                {{-- Reports --}}
                <a href="{{ route('reports.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('reports.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:chart-2-linear" class="text-[20px]"></iconify-icon>
                    <span class="text-[13px]">Reports</span>
                </a>
            @endcan

            {{-- ── OWNER ONLY ─────────────────────────── --}}
            @can('manage-users')
                {{-- Targets & Goals --}}
                <a href="{{ route('targets-goals.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('targets-goals.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:target-linear" class="text-[20px]"></iconify-icon>
                    <span class="text-[13px]">Targets & Goals</span>
                </a>

                {{-- Users --}}
                {{-- <a href="{{ route('users.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('users.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:users-group-rounded-linear" class="text-[20px]"></iconify-icon>
                    <span class="text-[13px]">Users</span>
                </a> --}}
                {{-- Access Management --}}
                {{-- Access Management --}}
                <div x-data="{ open: {{ request()->routeIs('users.*') || request()->routeIs('roles.*') || request()->routeIs('audit-logs.*') ? 'true' : 'false' }} }">

                    {{-- Parent Item --}}
                    <button @click="open = !open"
                        class="{{ $baseClass }} w-full {{ request()->routeIs('users.*') || request()->routeIs('roles.*') || request()->routeIs('audit-logs.*') ? $activeClass : $inactiveClass }}">
                        <iconify-icon icon="solar:shield-keyhole-linear" class="text-[20px]"></iconify-icon>
                        <span class="text-[13px] flex-1 text-left">Access Management</span>
                        <iconify-icon icon="solar:alt-arrow-down-linear"
                            class="text-[14px] transition-transform duration-200" :class="open ? 'rotate-180' : ''">
                        </iconify-icon>
                    </button>

                    {{-- Sub Menu --}}
                    <div x-show="open" x-collapse class="mt-1 ml-4 pl-3 border-l border-[#dddbff] space-y-0.5">

                        <a href="{{ route('users.index') }}"
                            class="{{ $baseClass }} {{ request()->routeIs('users.*') ? $activeClass : $inactiveClass }}">
                            <iconify-icon icon="solar:users-group-rounded-linear" class="text-[18px]"></iconify-icon>
                            <span class="text-[13px]">User Directory</span>
                        </a>

                        <a href="{{ route('user-management.role-permission.index') }}"
                            class="{{ $baseClass }} {{ request()->routeIs('user-management.role-permission.*') ? $activeClass : $inactiveClass }}">
                            <iconify-icon icon="solar:shield-user-linear" class="text-[18px]"></iconify-icon>
                            <span class="text-[13px]">Roles & Permissions</span>
                        </a>

                        {{-- <a href="{{ route('audit-logs.index') }}"
                            class="{{ $baseClass }} {{ request()->routeIs('audit-logs.*') ? $activeClass : $inactiveClass }}">
                            <iconify-icon icon="solar:document-text-linear" class="text-[18px]"></iconify-icon>
                            <span class="text-[13px]">Audit Logs</span>
                        </a> --}}

                    </div>
                </div>

                {{-- System Status --}}
                <a href="{{ route('system-status.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('system-status.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:server-square-linear" class="text-[20px]"></iconify-icon>
                    <span class="text-[13px]">System Status</span>
                </a>
            @endcan

            {{-- Settings — semua role --}}
            <a href="{{ route('settings.index') }}"
                class="{{ $baseClass }} {{ request()->routeIs('settings.*') ? $activeClass : $inactiveClass }}">
                <iconify-icon icon="solar:settings-linear" class="text-[20px]"></iconify-icon>
                <span class="text-[13px]">Settings</span>
            </a>

        </nav>

    </div>

    {{-- User Info + Logout --}}
    <div class="p-4 border-t border-[#dddbff] bg-[#fbfbfe] space-y-3">

        {{-- Profile Mini --}}
        {{-- <a href="{{ route('profile.edit') }}"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#dddbff]/30 transition-colors cursor-pointer">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#443dff] to-[#2f27ce] flex items-center justify-center text-white font-extrabold text-sm shadow-sm flex-shrink-0">
                {{ strtoupper(substr(auth()->user()->name, 0, 2)) }}
            </div>
            <div class="min-w-0">
                <p class="text-[13px] font-extrabold text-[#050316] truncate">{{ auth()->user()->name }}</p>
                <p class="text-[11px] font-medium text-[#2f27ce]/70 truncate">{{ ucfirst(auth()->user()->role) }}</p>
            </div>
        </a> --}}

        {{-- Logout --}}
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit"
                class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 active:scale-[0.98] transition-all duration-200">
                <iconify-icon icon="solar:logout-3-linear" class="text-[20px]"></iconify-icon>
                <span>Sign Out</span>
            </button>
        </form>

    </div>

</aside>
