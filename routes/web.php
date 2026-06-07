<?php

use Illuminate\Support\Facades\Route;

// Wildcard route to handle all web traffic via the React SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
