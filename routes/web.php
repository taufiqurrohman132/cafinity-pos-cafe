<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::view('/owner/dashboard', 'dashboard.owner.index')
    ->name('owner.dashboard');

Route::view('/admin/dashboard', 'dashboard.admin.index')
    ->name('admin.dashboard');

Route::view('/cashier/dashboard', 'dashboard.cashier.index')
    ->name('cashier.dashboard');

require __DIR__ . '/auth.php';
