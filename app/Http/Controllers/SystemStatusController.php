<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class SystemStatusController extends Controller
{
    public function index(): View
    {
        try {
            DB::connection()->getPdo();
            $database = 'Connected';
        } catch (\Throwable) {
            $database = 'Disconnected';
        }

        $status = [
            'php'      => PHP_VERSION,
            'laravel'  => app()->version(),
            'database' => $database,
            'cache'    => 'OK',
        ];

        return view('shared.system-status.index', compact('status'));
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
