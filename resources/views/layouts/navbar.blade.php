<header class="h-[72px] bg-white border-b border-gray-200 px-6 flex items-center justify-between">

    {{-- Search --}}
    <div class="w-[360px]">

        <input type="text" placeholder="Search transactions, recipes, or menu..."
            class="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500">

    </div>

    {{-- Right Side --}}
    <div class="flex items-center gap-5">

        <a href="#" class="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium">
            <iconify-icon icon="solar:bell-bing-linear" class="text-xl"></iconify-icon>
        </a>

        <a href="#"
            class="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium">
            <iconify-icon icon="solar:settings-linear" class="text-xl"></iconify-icon>
        </a>

        <div class="flex items-center gap-3 pl-5 border-l">

            <div class="text-right">
                <p class="font-semibold text-sm">{{ auth()->user()->name }}</p>
                <p class="text-xs text-gray-500">{{ ucfirst(auth()->user()->role) }}</p>
            </div>

            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">
                {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
            </div>

        </div>

    </div>

</header>
