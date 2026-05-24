<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\BundleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Dashboard\AdminDashboardController;
use App\Http\Controllers\Dashboard\CashierDashboardController;
use App\Http\Controllers\Dashboard\OwnerDashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\KitchenOrderController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\SystemStatusController;
use App\Http\Controllers\TargetController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', function () {
        return redirect()->route(auth()->user()->dashboardRoute());
    })->name('dashboard');

    Route::get('/owner/dashboard', [OwnerDashboardController::class, 'index'])
        ->middleware('role:owner')
        ->name('owner.dashboard');

    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
        ->middleware('role:admin')
        ->name('admin.dashboard');

    Route::get('/cashier/dashboard', [CashierDashboardController::class, 'index'])
        ->middleware('role:cashier')
        ->name('cashier.dashboard');

    // detail-antrean (owner)
    Route::get('/detail-antrean', [OwnerDashboardController::class, 'detailAntrean'])
        ->name('detail.antrean');



    /*
    |--------------------------------------------------------------------------
    | PROFILE
    | View: resources/views/profile/edit.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/',     [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/',   [ProfileController::class, 'update'])->name('update');
        Route::delete('/',  [ProfileController::class, 'destroy'])->name('destroy');
    });



    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    | View: resources/views/shared/notification/index.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/',             [NotificationController::class, 'index'])->name('index');
        Route::post('/read-all',    [NotificationController::class, 'readAll'])->name('read-all');
        Route::post('/{id}/read',   [NotificationController::class, 'read'])->name('read');
    });



    /*
    |--------------------------------------------------------------------------
    | SEARCH
    | Views: resources/views/shared/search/index.blade.php
    |         resources/views/shared/search/results.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('search')->name('search.')->group(function () {
        Route::get('/',         [SearchController::class, 'index'])->name('index');
        Route::get('/results',  [SearchController::class, 'results'])->name('results');
    });



    /*
    |--------------------------------------------------------------------------
    | SETTINGS
    | View: resources/views/shared/settings/index.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/',             [SettingController::class, 'index'])->name('index');
        Route::put('/general',      [SettingController::class, 'general'])->name('general');
        Route::put('/security',     [SettingController::class, 'security'])->name('security');
        Route::put('/appearance',   [SettingController::class, 'appearance'])->name('appearance');
    });



    /*
    |--------------------------------------------------------------------------
    | POS
    | View: resources/views/shared/pos/index.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('pos')->name('pos.')->group(function () {
        Route::get('/',                 [TransactionController::class, 'pos'])->name('index');
        Route::post('/checkout',        [TransactionController::class, 'checkout'])->name('checkout');
        Route::post('/hold',            [TransactionController::class, 'hold'])->name('hold');
        Route::post('/resume/{id}',     [TransactionController::class, 'resume'])->name('resume');
        Route::post('/cancel/{id}',     [TransactionController::class, 'cancel'])->name('cancel');
    });



    /*
    |--------------------------------------------------------------------------
    | TRANSACTIONS
    | Views: resources/views/shared/transaction/index.blade.php
    |         resources/views/shared/transaction/show.blade.php
    |         resources/views/shared/transaction/invoice.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/',                 [TransactionController::class, 'history'])->name('index');
        Route::get('/{id}',             [TransactionController::class, 'show'])->name('show');
        Route::get('/{id}/invoice',     [TransactionController::class, 'invoice'])->name('invoice');
        Route::post('/{id}/print',      [TransactionController::class, 'print'])->name('print');
        Route::post('/{id}/refund',     [TransactionController::class, 'refund'])->name('refund');
    });



    /*
    |--------------------------------------------------------------------------
    | MENUS
    | Views: resources/views/shared/menu-management/index.blade.php
    |         resources/views/shared/menu-management/create.blade.php
    |         resources/views/shared/menu-management/edit.blade.php
    |         resources/views/shared/menu-management/show.blade.php
    |         resources/views/shared/menu-management/detail.blade.php
    |--------------------------------------------------------------------------
    */

    Route::resource('menus', MenuController::class);

    Route::prefix('menus')->name('menus.')->group(function () {
        Route::post('/{id}/toggle-status',  [MenuController::class, 'toggleStatus'])->name('toggle-status');
        Route::post('/{id}/upload-image',   [MenuController::class, 'uploadImage'])->name('upload-image');
    });



    /*
    |--------------------------------------------------------------------------
    | MENU CATEGORIES
    | Views: resources/views/shared/menu-management/categories.blade.php
    |         resources/views/shared/menu-management/category-create.blade.php
    |         resources/views/shared/menu-management/category-edit.blade.php
    |         resources/views/shared/menu-management/category-show.blade.php
    |--------------------------------------------------------------------------
    */

    Route::resource('categories', CategoryController::class);



    /*
    |--------------------------------------------------------------------------
    | RECIPE COSTING
    | Views: resources/views/shared/recipe-costiong/index.blade.php  ← typo folder asli dipertahankan
    |         resources/views/shared/recipe-costiong/show.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('recipe-costing')->name('recipe.')->group(function () {
        Route::get('/',         [RecipeController::class, 'index'])->name('index');
        Route::post('/',        [RecipeController::class, 'store'])->name('store');
        Route::get('/{id}',     [RecipeController::class, 'show'])->name('show');
        Route::put('/{id}',     [RecipeController::class, 'update'])->name('update');
        Route::delete('/{id}',  [RecipeController::class, 'destroy'])->name('destroy');
    });



    /*
    |--------------------------------------------------------------------------
    | INVENTORIES
    | Views: resources/views/shared/inventory/index.blade.php
    |         resources/views/shared/inventory/create.blade.php
    |         resources/views/shared/inventory/edit.blade.php
    |         resources/views/shared/inventory/show.blade.php
    |         resources/views/shared/inventory/low-stock.blade.php
    |--------------------------------------------------------------------------
    */

    Route::resource('inventories', InventoryController::class);

    Route::prefix('inventories')->name('inventories.')->group(function () {
        Route::get('/low-stock/list',   [InventoryController::class, 'lowStock'])->name('low-stock');
        Route::post('/{id}/restock',    [InventoryController::class, 'restock'])->name('restock');
    });



    /*
    |--------------------------------------------------------------------------
    | SUPPLIERS
    | Views: resources/views/shared/supplier/index.blade.php
    |         resources/views/shared/supplier/create.blade.php
    |         resources/views/shared/supplier/edit.blade.php
    |         resources/views/shared/supplier/show.blade.php
    |--------------------------------------------------------------------------
    */

    Route::resource('suppliers', SupplierController::class);



    /*
    |--------------------------------------------------------------------------
    | PURCHASE ORDERS
    | Views: resources/views/shared/purchase-order/index.blade.php
    |         resources/views/shared/purchase-order/create.blade.php
    |         resources/views/shared/purchase-order/edit.blade.php
    |         resources/views/shared/purchase-order/show.blade.php
    |--------------------------------------------------------------------------
    */

    Route::resource('purchase-orders', PurchaseOrderController::class);

    Route::prefix('purchase-orders')->name('purchase-orders.')->group(function () {
        Route::post('/{id}/approve',    [PurchaseOrderController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject',     [PurchaseOrderController::class, 'reject'])->name('reject');
        Route::post('/{id}/receive',    [PurchaseOrderController::class, 'receive'])->name('receive');
    });



    /*
    |--------------------------------------------------------------------------
    | KITCHEN ORDERS
    | Views: resources/views/shared/kitchen-order/index.blade.php
    |         resources/views/shared/kitchen-order/show.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('kitchen-orders')->name('kitchen-orders.')->group(function () {
        Route::get('/',                 [KitchenOrderController::class, 'index'])->name('index');
        Route::get('/{id}',             [KitchenOrderController::class, 'show'])->name('show');
        Route::post('/{id}/prepare',    [KitchenOrderController::class, 'prepare'])->name('prepare');
        Route::post('/{id}/ready',      [KitchenOrderController::class, 'ready'])->name('ready');
        Route::post('/{id}/complete',   [KitchenOrderController::class, 'complete'])->name('complete');
    });



    /*
    |--------------------------------------------------------------------------
    | PROMOTIONS & BUNDLES
    | View: resources/views/shared/promotion/index.blade.php
    |--------------------------------------------------------------------------
    */

    Route::resource('promotions', PromotionController::class);
    Route::resource('bundles', BundleController::class);



    /*
    |--------------------------------------------------------------------------
    | REPORTS
    | Views: resources/views/shared/reports/sales.blade.php
    |         resources/views/shared/reports/daily.blade.php
    |         resources/views/shared/reports/monthly.blade.php
    |         resources/views/shared/reports/profit-loss.blade.php
    |         resources/views/shared/reports/targets-goals.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/',                 [ReportController::class, 'index'])->name('index');
        Route::get('/sales',            [ReportController::class, 'sales'])->name('sales');
        Route::get('/inventory',        [ReportController::class, 'inventory'])->name('inventory');
        Route::get('/daily',            [ReportController::class, 'daily'])->name('daily');
        Route::get('/monthly',          [ReportController::class, 'monthly'])->name('monthly');
        Route::get('/profit-loss',      [ReportController::class, 'profitLoss'])->name('profit-loss');
        Route::get('/export/pdf',       [ReportController::class, 'exportPdf'])->name('export.pdf');
        Route::get('/export/excel',     [ReportController::class, 'exportExcel'])->name('export.excel');
    });



    /*
    |--------------------------------------------------------------------------
    | ANALYTICS
    | View: resources/views/shared/reports-analytics/index.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/',                     [AnalyticsController::class, 'index'])->name('index');
        Route::get('/aov',                  [AnalyticsController::class, 'aov'])->name('aov');
        Route::get('/revenue',              [AnalyticsController::class, 'revenue'])->name('revenue');
        Route::get('/profit',               [AnalyticsController::class, 'profit'])->name('profit');
        Route::get('/best-selling-menu',    [AnalyticsController::class, 'bestSellingMenu'])->name('best-selling-menu');
    });



    /*
    |--------------------------------------------------------------------------
    | TARGETS & GOALS
    | View: resources/views/shared/targets-goals/index.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('targets-goals')->name('targets-goals.')->group(function () {
        Route::get('/',        [TargetController::class, 'index'])->name('index');
        Route::post('/',       [TargetController::class, 'store'])->name('store');
        Route::put('/{id}',    [TargetController::class, 'update'])->name('update');
        Route::delete('/{id}', [TargetController::class, 'destroy'])->name('destroy');
    });



    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT
    | Views: resources/views/shared/user-management/index.blade.php
    |         resources/views/shared/user-management/create.blade.php
    |         resources/views/shared/user-management/edit.blade.php
    |         resources/views/shared/user-management/show.blade.php
    |--------------------------------------------------------------------------
    */

    Route::resource('users', UserController::class);

    Route::prefix('users')->name('users.')->group(function () {
        Route::post('/{id}/reset-password',     [UserController::class, 'resetPassword'])->name('reset-password');
        Route::post('/{id}/toggle-status',      [UserController::class, 'toggleStatus'])->name('toggle-status');
    });



    /*
    |--------------------------------------------------------------------------
    | SYSTEM STATUS
    | View: resources/views/shared/system-status/index.blade.php
    |--------------------------------------------------------------------------
    */

    Route::prefix('system-status')->name('system-status.')->group(function () {
        Route::get('/',             [SystemStatusController::class, 'index'])->name('index');
        Route::post('/cache-clear', [SystemStatusController::class, 'cacheClear'])->name('cache-clear');
        Route::post('/optimize',    [SystemStatusController::class, 'optimize'])->name('optimize');
    });
});



/*
|--------------------------------------------------------------------------
| DEV LOGIN (LOCAL ONLY)
|--------------------------------------------------------------------------
*/

if (app()->environment('local')) {
    Route::get('/dev-login/{role}', function ($role) {
        $user = App\Models\User::where('role', $role)->first();
        if (!$user) abort(404, 'Role tidak ditemukan');
        Auth::login($user);
        return redirect('/' . $role . '/dashboard');
    });
}



/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
