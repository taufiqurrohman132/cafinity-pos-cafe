<?php

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
use App\Http\Controllers\RolePermissionController;
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

    // ── OWNER ONLY ─────────────────────────────────────────
    Route::middleware('role:owner')->group(function () {
        Route::get('/owner/dashboard', [OwnerDashboardController::class, 'index'])->name('owner.dashboard');
        Route::get('/dashboard/owner/sales-chart', [OwnerDashboardController::class, 'salesChartData'])->name('owner.sales-chart');
        Route::resource('users', UserController::class);
        Route::prefix('users')->name('users.')->group(function () {
            Route::post('/{id}/reset-password', [UserController::class, 'resetPassword'])->name('reset-password');
            Route::post('/{id}/toggle-status',  [UserController::class, 'toggleStatus'])->name('toggle-status');
        });

        // Role & Permission
        Route::prefix('user-management')->name('user-management.')->group(function () {
            Route::prefix('role-permission')->name('role-permission.')->group(function () {
                Route::get('/', [RolePermissionController::class, 'index'])->name('index');
                Route::post('/', [RolePermissionController::class, 'store'])->name('store');
                Route::put('/{id}', [RolePermissionController::class, 'update'])->name('update');
                Route::delete('/{id}', [RolePermissionController::class, 'destroy'])->name('destroy');
                Route::put('/{id}/permissions', [RolePermissionController::class, 'updatePermissions'])->name('permissions.update');
            });
        });
        Route::prefix('system-status')->name('system-status.')->group(function () {
            Route::get('/',             [SystemStatusController::class, 'index'])->name('index');
            Route::post('/cache-clear', [SystemStatusController::class, 'cacheClear'])->name('cache-clear');
            Route::post('/optimize',    [SystemStatusController::class, 'optimize'])->name('optimize');
        });
        Route::prefix('targets-goals')->name('targets-goals.')->group(function () {
            Route::get('/',        [TargetController::class, 'index'])->name('index');
            Route::post('/',       [TargetController::class, 'store'])->name('store');
            Route::put('/{id}',    [TargetController::class, 'update'])->name('update');
            Route::delete('/{id}', [TargetController::class, 'destroy'])->name('destroy');
            Route::get('/aov',     [TargetController::class, 'aov'])->name('aov');
        });
    });

    // ── OWNER & ADMIN ───────────────────────────────────────
    Route::middleware('role:owner|admin')->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::resource('menus', MenuController::class);
        Route::prefix('menus')->name('menus.')->group(function () {
            Route::post('/{id}/toggle-status', [MenuController::class, 'toggleStatus'])->name('toggle-status');
            Route::post('/{id}/upload-image',  [MenuController::class, 'uploadImage'])->name('upload-image');
        });
        Route::resource('categories', CategoryController::class);
        Route::resource('suppliers', SupplierController::class);
        Route::resource('inventories', InventoryController::class);
        Route::prefix('inventories')->name('inventories.')->group(function () {
            Route::get('/low-stock/list', [InventoryController::class, 'lowStock'])->name('low-stock');
            Route::post('/{id}/restock',  [InventoryController::class, 'restock'])->name('restock');
        });
        Route::resource('purchase-orders', PurchaseOrderController::class);
        Route::prefix('purchase-orders')->name('purchase-orders.')->group(function () {
            Route::post('/{id}/approve', [PurchaseOrderController::class, 'approve'])->name('approve');
            Route::post('/{id}/reject',  [PurchaseOrderController::class, 'reject'])->name('reject');
            Route::post('/{id}/receive', [PurchaseOrderController::class, 'receive'])->name('receive');
        });
        Route::resource('promotions', PromotionController::class);
        Route::resource('bundles', BundleController::class);
        Route::prefix('recipe-costing')->name('recipe.')->group(function () {
            Route::get('/',        [RecipeController::class, 'index'])->name('index');
            Route::post('/',       [RecipeController::class, 'store'])->name('store');
            Route::get('/create',  [RecipeController::class, 'create'])->name('create');
            Route::get('/{id}',    [RecipeController::class, 'show'])->name('show');
            Route::put('/{id}',    [RecipeController::class, 'update'])->name('update');
            Route::delete('/{id}', [RecipeController::class, 'destroy'])->name('destroy');
        });
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/',                   [ReportController::class, 'index'])->name('index');
            Route::get('/sales',              [ReportController::class, 'sales'])->name('sales');
            Route::get('/inventory',          [ReportController::class, 'inventory'])->name('inventory');
            Route::get('/daily',              [ReportController::class, 'daily'])->name('daily');
            Route::get('/monthly',            [ReportController::class, 'monthly'])->name('monthly');
            Route::get('/profit-loss',        [ReportController::class, 'profitLoss'])->name('profit-loss');
            Route::get('/export/pdf',         [ReportController::class, 'exportPdf'])->name('export.pdf');
            Route::get('/export/excel',       [ReportController::class, 'exportExcel'])->name('export.excel');
            Route::get('/analytics/revenue',      [ReportController::class, 'revenue'])->name('analytics.revenue');
            Route::get('/analytics/profit',       [ReportController::class, 'profit'])->name('analytics.profit');
            Route::get('/analytics/best-selling', [ReportController::class, 'bestSellingMenu'])->name('analytics.best-selling');
        });
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/',           [SettingController::class, 'index'])->name('index');
            Route::put('/general',    [SettingController::class, 'general'])->name('general');
            Route::put('/security',   [SettingController::class, 'security'])->name('security');
            Route::put('/appearance', [SettingController::class, 'appearance'])->name('appearance');
        });
    });

    // ── SEMUA ROLE (owner, admin, cashier) ──────────────────
    Route::get('/cashier/dashboard', [CashierDashboardController::class, 'index'])
        ->middleware('role:cashier')
        ->name('cashier.dashboard');

    Route::prefix('pos')->name('pos.')->group(function () {
        Route::get('/',             [TransactionController::class, 'pos'])->name('index');
        Route::post('/checkout',    [TransactionController::class, 'checkout'])->name('checkout');
        Route::post('/hold',        [TransactionController::class, 'hold'])->name('hold');
        Route::post('/resume/{id}', [TransactionController::class, 'resume'])->name('resume');
        Route::post('/cancel/{id}', [TransactionController::class, 'cancel'])->name('cancel');
    });

    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/',             [TransactionController::class, 'history'])->name('index');
        Route::get('/export',       [TransactionController::class, 'export'])->name('export');
        Route::get('/{id}',         [TransactionController::class, 'show'])->name('show');
        Route::get('/{id}/invoice', [TransactionController::class, 'invoice'])->name('invoice');
        Route::post('/{id}/print',  [TransactionController::class, 'print'])->name('print');
        Route::post('/{id}/refund', [TransactionController::class, 'refund'])->name('refund');
    });

    Route::prefix('kitchen-orders')->name('kitchen-orders.')->group(function () {
        Route::get('/',              [KitchenOrderController::class, 'index'])->name('index');
        Route::get('/{id}',          [KitchenOrderController::class, 'show'])->name('show');
        Route::post('/{id}/prepare', [KitchenOrderController::class, 'prepare'])->name('prepare');
        Route::post('/{id}/ready',   [KitchenOrderController::class, 'ready'])->name('ready');
        Route::post('/{id}/complete', [KitchenOrderController::class, 'complete'])->name('complete');
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::post('/read-all', [NotificationController::class, 'readAll'])->name('read-all');
        Route::post('/{id}/read', [NotificationController::class, 'read'])->name('read');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('search')->name('search.')->group(function () {
        Route::get('/',        [SearchController::class, 'index'])->name('index');
        Route::get('/results', [SearchController::class, 'results'])->name('results');
    });

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/',    [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/',  [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
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
