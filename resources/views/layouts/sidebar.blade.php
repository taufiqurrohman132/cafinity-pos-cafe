<aside class="w-[260px] bg-[#edf7ef] border-r border-gray-200 flex flex-col justify-between">

    <div>

        {{-- Logo --}}
        <div class="px-6 py-6 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-green-600">
                Smart Cafe POS
            </h1>
        </div>

        @php
            $baseClass = 'flex items-center gap-3 px-4 py-3 rounded-xl transition';
            $activeClass = 'bg-green-100 text-green-700 font-medium';
            $inactiveClass = 'text-gray-600 hover:bg-white/70';
        @endphp

        <div class="sticky top-0">
            <nav class="p-4 space-y-1">

                {{-- Dashboard --}}
                <a href="{{ route('owner.dashboard') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('shared.owner.dashboard') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:home-2-linear" class="text-lg"></iconify-icon>
                    <span>Dashboard</span>
                </a>

                {{-- POS --}}
                <a href="{{ route('pos.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('pos.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:card-2-linear" class="text-lg"></iconify-icon>
                    <span>Point of Sale</span>
                </a>

                {{-- Transactions --}}
                <a href="{{ route('transactions.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('transactions.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:clock-circle-linear" class="text-lg"></iconify-icon>
                    <span>Transactions</span>
                </a>

                {{-- Menu Catalog --}}
                <a href="{{ route('menus.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('menu.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="tdesign:menu" class="text-lg"></iconify-icon>
                    <span>Menu Catalog</span>
                </a>

                {{-- Recipe Costing --}}
                <a href="{{ route('recipe.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('recipes.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:calculator-minimalistic-linear" class="text-lg"></iconify-icon>
                    <span>Recipe Costing</span>
                </a>

                {{-- Inventory --}}
                <a href="{{ route('inventories.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('inventories.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:box-linear" class="text-lg"></iconify-icon>
                    <span>Inventory</span>
                </a>

                {{-- Reports --}}
                <a href="{{ route('reports.index') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('reports.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:chart-2-linear" class="text-lg"></iconify-icon>
                    <span>Reports</span>
                </a>

                {{-- Users --}}
                <a href="{{ route('users') }}"
                    class="{{ $baseClass }} {{ request()->routeIs('users.*') ? $activeClass : $inactiveClass }}">
                    <iconify-icon icon="solar:users-group-rounded-linear" class="text-lg"></iconify-icon>
                    <span>Users</span>
                </a>

            </nav>
        </div>
        {{-- Logout --}}
        <div class="p-4 border-t border-gray-200">

            <button class="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition">
                Sign Out
            </button>

        </div>

</aside>
