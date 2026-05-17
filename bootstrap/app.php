<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ASLI
        // $middleware->alias([
        //     'role' => \App\Http\Middleware\RoleMiddleware::class,
        // ]);

        // TAMBAHKAN BARIS INI:
        // Ini akan menjalankan auto-login di setiap request halaman web sebelum dicek oleh middleware auth
        $middleware->web(append: [
            \App\Http\Middleware\DevAutoLogin::class,
        ]);

        // 2. TAMBAHKAN BARIS INI (Daftarkan alias untuk middleware role kamu):
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class, // <-- Arahkan ke class middleware Role milikmu
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
