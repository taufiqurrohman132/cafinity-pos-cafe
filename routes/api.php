<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\PurchaseOrderController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\BundleController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TargetController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\KitchenOrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/sales-chart', [DashboardController::class, 'salesChart']);

    // Profile
    Route::put('/profile', [UserController::class, 'updateProfile']);

    // Menus & Categories
    Route::post('/menus/{id}/toggle-status', [MenuController::class, 'toggleStatus']);
    Route::post('/menus/{id}/upload-image', [MenuController::class, 'uploadImage']);
    Route::apiResource('menus', MenuController::class);
    Route::apiResource('categories', CategoryController::class);

    // Inventories
    Route::get('/inventories/low-stock/list', [InventoryController::class, 'lowStock']);
    Route::post('/inventories/{id}/restock', [InventoryController::class, 'restock']);
    Route::post('/inventories/{id}/adjust', [InventoryController::class, 'adjust']);
    Route::get('/inventories/create', [InventoryController::class, 'create']);
    Route::get('/inventories/{id}/edit', [InventoryController::class, 'edit']);
    Route::apiResource('inventories', InventoryController::class);

    // Suppliers & Purchase Orders
    Route::get('/suppliers/{id}/edit', [SupplierController::class, 'edit']);
    Route::apiResource('suppliers', SupplierController::class);
    Route::post('/purchase-orders/{id}/approve', [PurchaseOrderController::class, 'approve']);
    Route::post('/purchase-orders/{id}/reject', [PurchaseOrderController::class, 'reject']);
    Route::post('/purchase-orders/{id}/receive', [PurchaseOrderController::class, 'receive']);
    Route::apiResource('purchase-orders', PurchaseOrderController::class);

    // Promotions & Bundles
    Route::apiResource('promotions', PromotionController::class);
    Route::apiResource('bundles', BundleController::class);

    // Recipe Costing
    Route::get('/recipe-costing', [RecipeController::class, 'index']);
    Route::post('/recipe-costing', [RecipeController::class, 'store']);
    Route::get('/recipe-costing/{id}', [RecipeController::class, 'show']);
    Route::put('/recipe-costing/{id}', [RecipeController::class, 'update']);
    Route::delete('/recipe-costing/{id}', [RecipeController::class, 'destroy']);

    // Reports
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/sales', [ReportController::class, 'sales']);
    Route::get('/reports/inventory', [ReportController::class, 'inventory']);
    Route::get('/reports/daily', [ReportController::class, 'daily']);
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);
    Route::get('/reports/profit-loss', [ReportController::class, 'profitLoss']);
    Route::get('/reports/export/pdf', [ReportController::class, 'exportPdf']);
    Route::get('/reports/export/excel', [ReportController::class, 'exportExcel']);
    Route::get('/reports/analytics/revenue', [ReportController::class, 'revenue']);
    Route::get('/reports/analytics/profit', [ReportController::class, 'profit']);
    Route::get('/reports/analytics/best-selling', [ReportController::class, 'bestSellingMenu']);

    // Targets & Goals
    Route::get('/targets-goals/aov', [TargetController::class, 'aov']);
    Route::apiResource('targets-goals', TargetController::class);

    // POS & Transactions
    Route::get('/pos', [TransactionController::class, 'pos']);
    Route::post('/pos/checkout', [TransactionController::class, 'checkout']);
    Route::post('/pos/hold', [TransactionController::class, 'hold']);
    Route::post('/pos/resume/{id}', [TransactionController::class, 'resume']);
    Route::post('/pos/cancel/{id}', [TransactionController::class, 'cancel']);

    Route::get('/transactions/export', [TransactionController::class, 'export']);
    Route::get('/transactions/{id}/invoice', [TransactionController::class, 'invoice']);
    Route::post('/transactions/{id}/print', [TransactionController::class, 'print']);
    Route::post('/transactions/{id}/refund', [TransactionController::class, 'refund']);
    Route::apiResource('transactions', TransactionController::class);

    // Kitchen Orders
    Route::post('/kitchen-orders/{id}/prepare', [KitchenOrderController::class, 'prepare'])->name('kitchen-orders.prepare');
    Route::post('/kitchen-orders/{id}/ready', [KitchenOrderController::class, 'ready'])->name('kitchen-orders.ready');
    Route::post('/kitchen-orders/{id}/complete', [KitchenOrderController::class, 'complete'])->name('kitchen-orders.complete');
    Route::post('/kitchen-orders/{id}/back', [KitchenOrderController::class, 'back'])->name('kitchen-orders.back');
    Route::apiResource('kitchen-orders', KitchenOrderController::class);

    // Users
    Route::post('/users/{id}/reset-password', [UserController::class, 'resetPassword']);
    Route::post('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::apiResource('users', UserController::class);

    // Role Permissions
    Route::get('/user-management/role-permission', [RolePermissionController::class, 'index']);
    Route::post('/user-management/role-permission', [RolePermissionController::class, 'store']);
    Route::put('/user-management/role-permission/{id}', [RolePermissionController::class, 'update']);
    Route::delete('/user-management/role-permission/{id}', [RolePermissionController::class, 'destroy']);
    Route::put('/user-management/role-permission/{id}/permissions', [RolePermissionController::class, 'updatePermissions']);

    // Notifications
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'read']);
    Route::apiResource('notifications', NotificationController::class);

    // Search
    Route::get('/search', [SearchController::class, 'index']);
    Route::get('/search/results', [SearchController::class, 'results']);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings/general', [SettingController::class, 'general']);
    Route::put('/settings/security', [SettingController::class, 'security']);
    Route::put('/settings/appearance', [SettingController::class, 'appearance']);
});
