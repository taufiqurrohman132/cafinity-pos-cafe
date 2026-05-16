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


/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
// SEMUA REUTE
});

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD PER ROLE
    |--------------------------------------------------------------------------
    */

    Route::get('/owner/dashboard', [
        OwnerDashboardController::class,
        'index'
    ])//->middleware('role:owner')
      ->name('owner.dashboard');


    Route::get('/admin/dashboard', [
        AdminDashboardController::class,
        'index'
    ])//->middleware('role:admin')
      ->name('admin.dashboard');


    Route::get('/cashier/dashboard', [
        CashierDashboardController::class,
        'index'
    ])//->middleware('role:cashier')
      ->name('cashier.dashboard');



    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */

    Route::prefix('profile')
        ->name('profile.')
        ->group(function () {

            Route::get('/', [
                ProfileController::class,
                'edit'
            ])->name('edit');

            Route::patch('/', [
                ProfileController::class,
                'update'
            ])->name('update');

            Route::delete('/', [
                ProfileController::class,
                'destroy'
            ])->name('destroy');
        });



    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    Route::prefix('notifications')
        ->middleware('permission:view notifications')
        ->name('notifications.')
        ->group(function () {

            Route::get('/', [
                NotificationController::class,
                'index'
            ])->name('index');

            Route::post('/read-all', [
                NotificationController::class,
                'readAll'
            ])->name('read-all');

            Route::post('/{id}/read', [
                NotificationController::class,
                'read'
            ])->name('read');
        });



    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    Route::prefix('search')
        ->middleware('permission:use search')
        ->name('search.')
        ->group(function () {

            Route::get('/', [
                SearchController::class,
                'index'
            ])->name('index');

            Route::get('/results', [
                SearchController::class,
                'results'
            ])->name('results');
        });



    /*
    |--------------------------------------------------------------------------
    | SETTINGS
    |--------------------------------------------------------------------------
    */

    Route::prefix('settings')
        ->middleware('permission:manage settings')
        ->name('settings.')
        ->group(function () {

            Route::get('/', [
                SettingController::class,
                'index'
            ])->name('index');

            Route::put('/general', [
                SettingController::class,
                'general'
            ])->name('general');

            Route::put('/security', [
                SettingController::class,
                'security'
            ])->name('security');

            Route::put('/appearance', [
                SettingController::class,
                'appearance'
            ])->name('appearance');
        });



    /*
    |--------------------------------------------------------------------------
    | POS
    |--------------------------------------------------------------------------
    */

    Route::prefix('pos')
        // ->middleware('permission:access pos')
        ->name('pos.')
        ->group(function () {

            Route::get('/', [
                TransactionController::class,
                'pos'
            ])->name('index');

            Route::post('/checkout', [
                TransactionController::class,
                'checkout'
            ])->name('checkout');

            Route::post('/hold', [
                TransactionController::class,
                'hold'
            ])->name('hold');

            Route::post('/resume/{id}', [
                TransactionController::class,
                'resume'
            ])->name('resume');

            Route::post('/cancel/{id}', [
                TransactionController::class,
                'cancel'
            ])->name('cancel');
        });



    /*
    |--------------------------------------------------------------------------
    | TRANSACTIONS
    |--------------------------------------------------------------------------
    */

    Route::prefix('transactions')
        // ->middleware('permission:view transactions')
        ->name('transactions.')
        ->group(function () {

            Route::get('/', [
                TransactionController::class,
                'history'
            ])->name('index');

            Route::get('/{id}', [
                TransactionController::class,
                'show'
            ])->name('show');

            Route::get('/{id}/invoice', [
                TransactionController::class,
                'invoice'
            ])->name('invoice');

            Route::post('/{id}/print', [
                TransactionController::class,
                'print'
            ])->name('print');

            Route::post('/{id}/refund', [
                TransactionController::class,
                'refund'
            ])->name('refund');
        });



    /*
    |--------------------------------------------------------------------------
    | MENUS
    |--------------------------------------------------------------------------
    */

    Route::resource('menus', MenuController::class)
        // ->middleware('permission:manage menus')
        ;

    Route::prefix('menus')
        // ->middleware('permission:manage menus')
        ->name('menus.')
        ->group(function () {

            Route::post('/{id}/toggle-status', [
                MenuController::class,
                'toggleStatus'
            ])->name('toggle-status');

            Route::post('/{id}/upload-image', [
                MenuController::class,
                'uploadImage'
            ])->name('upload-image');
        });



    /*
    |--------------------------------------------------------------------------
    | MENU CATEGORIES
    |--------------------------------------------------------------------------
    */

    Route::resource('categories', CategoryController::class)
        // ->middleware('permission:manage menus')
        ;



    /*
    |--------------------------------------------------------------------------
    | RECIPE COSTING
    |--------------------------------------------------------------------------
    */

    Route::prefix('recipe-costing')
        ->middleware('permission:manage recipes')
        ->name('recipe.')
        ->group(function () {

            Route::get('/', [
                RecipeController::class,
                'index'
            ])->name('index');

            Route::post('/', [
                RecipeController::class,
                'store'
            ])->name('store');

            Route::get('/{id}', [
                RecipeController::class,
                'show'
            ])->name('show');

            Route::put('/{id}', [
                RecipeController::class,
                'update'
            ])->name('update');

            Route::delete('/{id}', [
                RecipeController::class,
                'destroy'
            ])->name('destroy');
        });



    /*
    |--------------------------------------------------------------------------
    | INVENTORIES
    |--------------------------------------------------------------------------
    */

    Route::resource('inventories', InventoryController::class)
        // ->middleware('permission:manage inventory')
        ;

    Route::prefix('inventories')
        // ->middleware('permission:manage inventory')
        ->name('inventories.')
        ->group(function () {

            Route::get('/low-stock/list', [
                InventoryController::class,
                'lowStock'
            ])->name('low-stock');

            Route::post('/{id}/restock', [
                InventoryController::class,
                'restock'
            ])->name('restock');
        });



    /*
    |--------------------------------------------------------------------------
    | SUPPLIERS
    |--------------------------------------------------------------------------
    */

    // Route::resource('suppliers', SupplierController::class)
    //     ->middleware('permission:manage suppliers');



    /*
    |--------------------------------------------------------------------------
    | PURCHASE ORDERS
    |--------------------------------------------------------------------------
    */

    Route::resource('purchase-orders', PurchaseOrderController::class)
        ->middleware('permission:manage purchase orders');

    Route::prefix('purchase-orders')
        ->middleware('permission:manage purchase orders')
        ->name('purchase-orders.')
        ->group(function () {

            Route::post('/{id}/approve', [
                PurchaseOrderController::class,
                'approve'
            ])->name('approve');

            Route::post('/{id}/reject', [
                PurchaseOrderController::class,
                'reject'
            ])->name('reject');

            Route::post('/{id}/receive', [
                PurchaseOrderController::class,
                'receive'
            ])->name('receive');
        });



    /*
    |--------------------------------------------------------------------------
    | KITCHEN ORDERS
    |--------------------------------------------------------------------------
    */

    Route::prefix('kitchen-orders')
        ->middleware('permission:manage kitchen')
        ->name('kitchen-orders.')
        ->group(function () {

            Route::get('/', [
                KitchenOrderController::class,
                'index'
            ])->name('index');

            Route::get('/{id}', [
                KitchenOrderController::class,
                'show'
            ])->name('show');

            Route::post('/{id}/prepare', [
                KitchenOrderController::class,
                'prepare'
            ])->name('prepare');

            Route::post('/{id}/ready', [
                KitchenOrderController::class,
                'ready'
            ])->name('ready');

            Route::post('/{id}/complete', [
                KitchenOrderController::class,
                'complete'
            ])->name('complete');
        });



    /*
    |--------------------------------------------------------------------------
    | PROMOTIONS
    |--------------------------------------------------------------------------
    */

    Route::resource('promotions', PromotionController::class)
        ->middleware('permission:manage promotions');



    /*
    |--------------------------------------------------------------------------
    | BUNDLES
    |--------------------------------------------------------------------------
    */

    Route::resource('bundles', BundleController::class)
        ->middleware('permission:manage promotions');



    /*
    |--------------------------------------------------------------------------
    | REPORTS
    |--------------------------------------------------------------------------
    */

    Route::prefix('reports')
        // ->middleware('permission:view reports')
        ->name('reports.')
        ->group(function () {

            Route::get('/', [
                ReportController::class,
                'index'
            ])->name('index');

            Route::get('/sales', [
                ReportController::class,
                'sales'
            ])->name('sales');

            Route::get('/inventory', [
                ReportController::class,
                'inventory'
            ])->name('inventory');

            Route::get('/daily', [
                ReportController::class,
                'daily'
            ])->name('daily');

            Route::get('/monthly', [
                ReportController::class,
                'monthly'
            ])->name('monthly');

            Route::get('/profit-loss', [
                ReportController::class,
                'profitLoss'
            ])->name('profit-loss');

            Route::get('/export/pdf', [
                ReportController::class,
                'exportPdf'
            ])->name('export.pdf');

            Route::get('/export/excel', [
                ReportController::class,
                'exportExcel'
            ])->name('export.excel');
        });



    /*
    |--------------------------------------------------------------------------
    | ANALYTICS
    |--------------------------------------------------------------------------
    */

    Route::prefix('analytics')
        ->middleware('permission:view analytics')
        ->name('analytics.')
        ->group(function () {

            Route::get('/', [
                AnalyticsController::class,
                'index'
            ])->name('index');

            Route::get('/aov', [
                AnalyticsController::class,
                'aov'
            ])->name('aov');

            Route::get('/revenue', [
                AnalyticsController::class,
                'revenue'
            ])->name('revenue');

            Route::get('/profit', [
                AnalyticsController::class,
                'profit'
            ])->name('profit');

            Route::get('/best-selling-menu', [
                AnalyticsController::class,
                'bestSellingMenu'
            ])->name('best-selling-menu');
        });



    /*
    |--------------------------------------------------------------------------
    | TARGETS & GOALS
    |--------------------------------------------------------------------------
    */

    Route::prefix('targets-goals')
        ->middleware('permission:manage targets')
        ->name('targets-goals.')
        ->group(function () {

            Route::get('/', [
                ReportController::class,
                'targetsGoals'
            ])->name('index');

            Route::post('/', [
                ReportController::class,
                'storeTarget'
            ])->name('store');

            Route::put('/{id}', [
                ReportController::class,
                'updateTarget'
            ])->name('update');

            Route::delete('/{id}', [
                ReportController::class,
                'destroyTarget'
            ])->name('destroy');
        });



    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::resource('users', UserController::class)
        // ->middleware('permission:manage users')
        ;

    Route::prefix('users')
        // ->middleware('permission:manage users')
        ->name('users.')
        ->group(function () {

            Route::post('/{id}/reset-password', [
                UserController::class,
                'resetPassword'
            ])->name('reset-password');

            Route::post('/{id}/toggle-status', [
                UserController::class,
                'toggleStatus'
            ])->name('toggle-status');
        });



    /*
    |--------------------------------------------------------------------------
    | SYSTEM STATUS
    |--------------------------------------------------------------------------
    */

    Route::prefix('system-status')
        ->middleware('permission:view system status')
        ->name('system-status.')
        ->group(function () {

            Route::get('/', [
                SystemStatusController::class,
                'index'
            ])->name('index');

            Route::post('/cache-clear', [
                SystemStatusController::class,
                'cacheClear'
            ])->name('cache-clear');

            Route::post('/optimize', [
                SystemStatusController::class,
                'optimize'
            ])->name('optimize');
        });



/*
|--------------------------------------------------------------------------
| DEV LOGIN (LOCAL ONLY)
|--------------------------------------------------------------------------
*/

if (app()->environment('local')) {

    Route::get('/dev-login/{role}', function ($role) {

        $user = App\Models\User::where('role', $role)->first();

        if (!$user) {
            abort(404, 'Role tidak ditemukan');
        }

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
