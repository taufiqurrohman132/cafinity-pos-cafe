<aside class="w-[260px] bg-[#edf7ef] border-r border-gray-200 flex flex-col justify-between">

    <div>

        {{-- Logo --}}
        <div class="px-6 py-6 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-green-600">
                Smart Cafe POS
            </h1>
        </div>

        {{-- Menu --}}
        <div class="sticky">
            
            <nav class="p-4 space-y-1">
    
                <a href="#"
                   class="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-100 text-green-700 font-medium">
                    Dashboard
                </a>
    
                <a href="#"
                   class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-gray-600 transition">
                    Point of Sale
                </a>
    
                <a href="#"
                   class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-gray-600 transition">
                    Transactions
                </a>
    
                <a href="#"
                   class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-gray-600 transition">
                    Inventory
                </a>
    
                <a href="#"
                   class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-gray-600 transition">
                    Reports
                </a>
    
            </nav>
        </div>

    </div>

    {{-- Logout --}}
    <div class="p-4 border-t border-gray-200">

        <button class="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition">
            Sign Out
        </button>

    </div>

</aside>