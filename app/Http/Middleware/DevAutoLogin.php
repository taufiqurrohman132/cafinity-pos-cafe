<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DevAutoLogin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah project sedang berjalan di localhost (local)
        // 2. Cek apakah user saat ini belum login
        if (app()->environment('local') && !Auth::check()) {
            
            // 3. Otomatis loginkan ke ID user tertentu (misal ID: 1)
            // Ganti angka 1 dengan ID Owner/Admin/Cashier yang ada di databasemu
            Auth::loginUsingId(1); 
        }

        return $next($request);
    }
}