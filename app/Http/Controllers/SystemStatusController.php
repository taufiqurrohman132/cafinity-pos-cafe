<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SystemStatusController extends Controller
{
    //
    public function index()
    {
        $status = [
            'php'      => PHP_VERSION,
            'laravel'  => app()->version(),
            'database' => DB::connection()->getPdo() ? 'Connected' : 'Disconnected',
            'cache'    => cache()->has('test') ? 'OK' : 'OK',
        ];
        return view('system-status.index', compact('status'));
    }

    public function cacheClear()
    {
        Artisan::call('cache:clear');
        return back()->with('success', 'Cache berhasil dibersihkan.');
    }

    public function optimize()
    {
        Artisan::call('optimize');
        return back()->with('success', 'Aplikasi berhasil dioptimasi.');
    }
}
