<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Smart Cafe POS' }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

<body class="bg-[#f6f7f8] text-gray-900">

<div class="min-h-screen flex">

    {{-- Sidebar --}}
    @include('layouts.sidebar')

    {{-- Main Content --}}
    <div class="flex-1 flex flex-col min-w-0">

        {{-- Navbar --}}
        @include('layouts.navbar')

        {{-- Page Content --}}
        <main class="flex-1 p-6 overflow-y-auto">
            @yield('content')
        </main>

    </div>

</div>

</body>
</html>