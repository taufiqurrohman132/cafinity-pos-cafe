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
            // Menu aktif: Gradasi tipis sebagai background, font tebal, warna teks primer
            $activeClass = 'bg-gradient-to-r from-[#dddbff]/70 to-[#dddbff]/10 text-[#2f27ce] font-extrabold shadow-sm';
            // Menu inaktif: Teks lebih kalem, saat di-hover jadi warna primer dan background sekunder
            $inactiveClass = 'text-[#050316]/70 font-medium hover:bg-[#dddbff]/30 hover:text-[#2f27ce]';
        @endphp

        <div class="sticky top-0">
            <nav class="p-4 space-y-1.5 overflow-y-auto scrollbar-hide">

                {{-- Dashboard --}}
                <a href="{{ route(auth()->user()?->dashboardRoute() ?? 'owner.dashboard') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('owner.dashboard', 'admin.dashboard', 'cashier.dashboard') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:home-2-linear"
                        class="text-[20px] {{ request()->routeIs('owner.dashboard', 'admin.dashboard', 'cashier.dashboard') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Dashboard</span>
                </a>

                {{-- POS --}}
                <a href="{{ route('pos.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('pos.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:card-2-linear"
                        class="text-[20px] {{ request()->routeIs('pos.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Point of Sale</span>
                </a>

                {{-- Transactions --}}
                <a href="{{ route('transactions.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('transactions.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:clock-circle-linear"
                        class="text-[20px] {{ request()->routeIs('transactions.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Transactions</span>
                </a>

                {{-- Menu Catalog --}}
                <a href="{{ route('menus.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('menus.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:clipboard-list-linear"
                        class="text-[20px] {{ request()->routeIs('menus.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Menu Catalog</span>
                </a>

                {{-- Recipe Costing --}}
                <a href="{{ route('recipe.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('recipe.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:calculator-minimalistic-linear"
                        class="text-[20px] {{ request()->routeIs('recipe.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Recipe Costing</span>
                </a>

                {{-- Inventory --}}
                <a href="{{ route('inventories.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('inventories.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:box-linear"
                        class="text-[20px] {{ request()->routeIs('inventories.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Inventory</span>
                </a>

                {{-- Kitchen Orders --}}
                <a href="{{ route('kitchen-orders.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('kitchen-orders.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:chef-hat-linear"
                        class="text-[20px] {{ request()->routeIs('kitchen-orders.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Kitchen Queue</span>
                </a>

                {{-- Reports --}}
                <a href="{{ route('reports.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('reports.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:chart-2-linear"
                        class="text-[20px] {{ request()->routeIs('reports.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Reports</span>
                </a>

                {{-- Targets & Goals --}}
                <a href="{{ route('targets-goals.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('targets-goals.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:target-linear"
                        class="text-[20px] {{ request()->routeIs('targets-goals.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Targets & Goals</span>
                </a>

                {{-- Users --}}
                <a href="{{ route('users.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('users.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:users-group-rounded-linear"
                        class="text-[20px] {{ request()->routeIs('users.*') ? 'font-bold' : '' }}"></iconify-icon>
                    <span class="text-[13px]">Users</span>
                </a>

            </nav>
        </div>

    </div>

    {{-- Logout --}}
    <div class="p-4 border-t border-[#dddbff] bg-[#fbfbfe]">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 active:scale-[0.98] transition-all duration-200">
                <iconify-icon icon="solar:logout-3-linear" class="text-[20px]"></iconify-icon>
                <span>Sign Out</span>
            </button>
        </form>
    </div>

</aside>
