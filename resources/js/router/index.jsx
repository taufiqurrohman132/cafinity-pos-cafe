import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../Components/ProtectedRoute';
import PageLoader from '../Components/PageLoader';
import AppLayout from '../Layouts/AppLayout';

// Auth Pages
import Login from '../Pages/Auth/Login';

// Dashboard Pages
import DashboardRedirect from '../Pages/Dashboard/DashboardRedirect';
import OwnerDashboard from '../Pages/Dashboard/Owner/Index';
import AdminDashboard from '../Pages/Dashboard/Admin/Index';
import CashierDashboard from '../Pages/Dashboard/Cashier/Index';

// Feature Pages
import POS from '../Pages/POS/Index';
import TransactionsIndex from '../Pages/Transactions/Index';
import TransactionsShow from '../Pages/Transactions/Show';
import TransactionsInvoice from '../Pages/Transactions/Invoice';
import KitchenOrdersIndex from '../Pages/KitchenOrders/Index';

import MenusIndex from '../Pages/Menus/Index';
import MenusShow from '../Pages/Menus/Show';
import PromotionsIndex from '../Pages/Promotions/Index';
import RecipeIndex from '../Pages/Recipe/Index';

import InventoriesIndex from '../Pages/Inventories/Index';
import InventoriesCreate from '../Pages/Inventories/Create';
import InventoriesShow from '../Pages/Inventories/Show';
import InventoriesEdit from '../Pages/Inventories/Edit';
import InventoriesLowStock from '../Pages/Inventories/LowStock';

import PurchaseOrderIndex from '../Pages/PurchaseOrder/Index';
import PurchaseOrderCreate from '../Pages/PurchaseOrder/Create';
import PurchaseOrderShow from '../Pages/PurchaseOrder/Show';
import PurchaseOrderEdit from '../Pages/PurchaseOrder/Edit';

import SupplierIndex from '../Pages/Supplier/Index';
import SupplierCreate from '../Pages/Supplier/Create';
import SupplierShow from '../Pages/Supplier/Show';
import SupplierEdit from '../Pages/Supplier/Edit';

import ReportsIndex from '../Pages/Reports/Index';
import TargetsGoalsIndex from '../Pages/TargetsGoals/Index';
import TargetsGoalsAov from '../Pages/TargetsGoals/Aov';

import UsersIndex from '../Pages/UserManagement/Userdirectory/Index';
import RolePermissionIndex from '../Pages/UserManagement/RolePermission/Index';
import SettingsIndex from '../Pages/Settings/Index';
import NotificationsIndex from '../Pages/Notifications/Index';

// Skeletons
import UsersSkeleton from '../Components/Skeletons/UsersSkeleton';
import RolePermissionSkeleton from '../Components/Skeletons/RolePermissionSkeleton';
import SupplierSkeleton from '../Components/Skeletons/SupplierSkeleton';
import SupplierFormSkeleton from '../Components/Skeletons/SupplierFormSkeleton';
import SupplierDetailSkeleton from '../Components/Skeletons/SupplierDetailSkeleton';
import TransactionsDetailSkeleton from '../Components/Skeletons/TransactionsDetailSkeleton';
import TransactionsInvoiceSkeleton from '../Components/Skeletons/TransactionsInvoiceSkeleton';
import TargetsGoalsSkeleton from '../Components/Skeletons/TargetsGoalsSkeleton';
import NotificationsSkeleton from '../Components/Skeletons/NotificationsSkeleton';
import InventoriesLowStockSkeleton from '../Components/Skeletons/InventoriesLowStockSkeleton';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public - tanpa AppLayout */}
            <Route path="/login" element={<Login />} />

            {/* Semua yang butuh sidebar - pakai AppLayout sebagai parent */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/cashier/dashboard" element={<CashierDashboard />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/transactions" element={<TransactionsIndex />} />
                <Route path="/transactions/:id" element={<PageLoader component={TransactionsShow} apiPath="/transactions/:id" skeleton={TransactionsDetailSkeleton} />} />
                <Route path="/transactions/:id/invoice" element={<PageLoader component={TransactionsInvoice} apiPath="/transactions/:id/invoice" skeleton={TransactionsInvoiceSkeleton} />} />
                <Route path="/kitchen-orders" element={<KitchenOrdersIndex />} />
                <Route path="/menus" element={<MenusIndex />} />
                <Route path="/menus/:id" element={<MenusShow />} />
                <Route path="/promotions" element={<PromotionsIndex />} />
                <Route path="/recipe-costing" element={<RecipeIndex />} />
                <Route path="/inventories" element={<InventoriesIndex />} />
                <Route path="/inventories/create" element={<InventoriesCreate />} />
                <Route path="/inventories/:id" element={<InventoriesShow />} />
                <Route path="/inventories/:id/edit" element={<InventoriesEdit />} />
                <Route path="/inventories/low-stock/list" element={<PageLoader component={InventoriesLowStock} apiPath="/inventories/low-stock/list" skeleton={InventoriesLowStockSkeleton} />} />
                <Route path="/purchase-orders" element={<PurchaseOrderIndex />} />
                <Route path="/purchase-orders/create" element={<PurchaseOrderCreate />} />
                <Route path="/purchase-orders/:id" element={<PurchaseOrderShow />} />
                <Route path="/purchase-orders/:id/edit" element={<PurchaseOrderEdit />} />
                <Route path="/suppliers" element={<PageLoader component={SupplierIndex} apiPath="/suppliers" skeleton={SupplierSkeleton} />} />
                <Route path="/suppliers/create" element={<SupplierCreate />} />
                <Route path="/suppliers/:id" element={<PageLoader component={SupplierShow} apiPath="/suppliers/:id" skeleton={SupplierDetailSkeleton} />} />
                <Route path="/suppliers/:id/edit" element={<SupplierEdit />} />
                <Route path="/reports" element={<ReportsIndex />} />
                <Route path="/targets-goals" element={<PageLoader component={TargetsGoalsIndex} apiPath="/targets-goals" skeleton={TargetsGoalsSkeleton} />} />
                <Route path="/targets-goals/aov" element={<PageLoader component={TargetsGoalsAov} apiPath="/targets-goals/aov" skeleton={TargetsGoalsSkeleton} />} />
                <Route path="/users" element={<PageLoader component={UsersIndex} apiPath="/users" skeleton={UsersSkeleton} />} />
                <Route path="/user-management/role-permission" element={<PageLoader component={RolePermissionIndex} apiPath="/user-management/role-permission" skeleton={RolePermissionSkeleton} />} />
                <Route path="/settings" element={<SettingsIndex />} />
                <Route path="/notifications" element={<PageLoader component={NotificationsIndex} apiPath="/notifications" skeleton={NotificationsSkeleton} />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;
