<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Smart Cafe POS' }}</title>

    <style>
        @keyframes slide-in {
            from {
                opacity: 0;
                transform: translateX(100%);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
        }
    </style>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

<body class="bg-[#f6f7f8] text-gray-900 overflow-hidden">

    {{-- Flash Toasts --}}
    @if (session('success') || session('error') || session('info') || session('warning'))
        <div id="flash-toasts"
            class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            @if (session('success'))
                <div data-dismiss
                    class="pointer-events-auto flex items-center gap-3 bg-white border border-green-200 rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-sm animate-slide-in">
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <iconify-icon icon="solar:check-circle-bold" class="text-green-600 text-lg"></iconify-icon>
                    </div>
                    <p class="flex-1 text-sm font-semibold text-green-700">{{ session('success') }}</p>
                    <button class="text-gray-400 hover:text-gray-600 flex-shrink-0" onclick="this.closest('[data-dismiss]').remove()">
                        <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                    </button>
                </div>
            @endif
            @if (session('error'))
                <div data-dismiss
                    class="pointer-events-auto flex items-center gap-3 bg-white border border-red-200 rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-sm animate-slide-in">
                    <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <iconify-icon icon="solar:close-circle-bold" class="text-red-600 text-lg"></iconify-icon>
                    </div>
                    <p class="flex-1 text-sm font-semibold text-red-700">{{ session('error') }}</p>
                    <button class="text-gray-400 hover:text-gray-600 flex-shrink-0" onclick="this.closest('[data-dismiss]').remove()">
                        <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                    </button>
                </div>
            @endif
            @if (session('info'))
                <div data-dismiss
                    class="pointer-events-auto flex items-center gap-3 bg-white border border-blue-200 rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-sm animate-slide-in">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <iconify-icon icon="solar:info-circle-bold" class="text-blue-600 text-lg"></iconify-icon>
                    </div>
                    <p class="flex-1 text-sm font-semibold text-blue-700">{{ session('info') }}</p>
                    <button class="text-gray-400 hover:text-gray-600 flex-shrink-0" onclick="this.closest('[data-dismiss]').remove()">
                        <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                    </button>
                </div>
            @endif
            @if (session('warning'))
                <div data-dismiss
                    class="pointer-events-auto flex items-center gap-3 bg-white border border-amber-200 rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-sm animate-slide-in">
                    <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <iconify-icon icon="solar:warning-circle-bold" class="text-amber-600 text-lg"></iconify-icon>
                    </div>
                    <p class="flex-1 text-sm font-semibold text-amber-700">{{ session('warning') }}</p>
                    <button class="text-gray-400 hover:text-gray-600 flex-shrink-0" onclick="this.closest('[data-dismiss]').remove()">
                        <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                    </button>
                </div>
            @endif
        </div>

        <script>
            // Auto-remove toasts after 4 seconds
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    document.querySelectorAll('[data-dismiss]').forEach(el => el.remove());
                }, 4000);
            });
        </script>
    @endif

    <div class="h-screen flex">

        {{-- Sidebar --}}
        @include('layouts.sidebar')

        {{-- Main Content --}}
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

            {{-- Navbar --}}
            @include('layouts.navbar')

            {{-- Page Content --}}
            <main class="flex-1 overflow-y-auto">
                @yield('content')
            </main>

        </div>

    </div>

</body>

</html>
