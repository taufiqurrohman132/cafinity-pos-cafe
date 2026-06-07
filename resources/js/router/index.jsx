import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../Components/ProtectedRoute';
import PageLoader from '../Components/PageLoader';

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

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardRedirect />
                    </ProtectedRoute>
                } 
            />

            {/* Dashboards */}
            <Route 
                path="/owner/dashboard" 
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <OwnerDashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/admin/dashboard" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/cashier/dashboard" 
                element={
                    <ProtectedRoute allowedRoles={['cashier']}>
                        <CashierDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* POS & Transactions */}
            <Route 
                path="/pos" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin', 'cashier']}>
                        <POS />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/transactions" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin', 'cashier']}>
                        <TransactionsIndex />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/transactions/:id" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin', 'cashier']}>
                        <PageLoader component={TransactionsShow} apiPath="/transactions/:id" />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/transactions/:id/invoice" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin', 'cashier']}>
                        <PageLoader component={TransactionsInvoice} apiPath="/transactions/:id/invoice" />
                    </ProtectedRoute>
                } 
            />

            <Route 
                path="/kitchen-orders" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin', 'cashier']}>
                        <KitchenOrdersIndex />
                    </ProtectedRoute>
                } 
            />

            {/* Menu Catalog */}
            <Route 
                path="/menus" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <MenusIndex />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/menus/:id" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={MenusShow} apiPath="/menus/:id" />
                    </ProtectedRoute>
                } 
            />

            {/* Promotions */}
            <Route 
                path="/promotions" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PromotionsIndex />
                    </ProtectedRoute>
                } 
            />

            {/* Recipe Costing */}
            <Route 
                path="/recipe-costing" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={RecipeIndex} apiPath="/recipe-costing" />
                    </ProtectedRoute>
                } 
            />

            {/* Inventories */}
            <Route 
                path="/inventories" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <InventoriesIndex />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/inventories/create" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <InventoriesCreate />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/inventories/:id" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <InventoriesShow />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/inventories/:id/edit" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <InventoriesEdit />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/inventories/low-stock/list" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={InventoriesLowStock} apiPath="/inventories/low-stock/list" />
                    </ProtectedRoute>
                } 
            />

            {/* Purchase Orders */}
            <Route 
                path="/purchase-orders" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PurchaseOrderIndex />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/purchase-orders/create" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PurchaseOrderCreate />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/purchase-orders/:id" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PurchaseOrderShow />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/purchase-orders/:id/edit" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PurchaseOrderEdit />
                    </ProtectedRoute>
                } 
            />

            {/* Suppliers */}
            <Route 
                path="/suppliers" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={SupplierIndex} apiPath="/suppliers" />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/suppliers/create" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={SupplierCreate} apiPath="/suppliers/create" />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/suppliers/:id" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={SupplierShow} apiPath="/suppliers/:id" />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/suppliers/:id/edit" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={SupplierEdit} apiPath="/suppliers/:id/edit" />
                    </ProtectedRoute>
                } 
            />

            {/* Reports */}
            <Route 
                path="/reports" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={ReportsIndex} apiPath="/reports" />
                    </ProtectedRoute>
                } 
            />

            {/* Targets & Goals */}
            <Route 
                path="/targets-goals" 
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <PageLoader component={TargetsGoalsIndex} apiPath="/targets-goals" />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/targets-goals/aov" 
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <PageLoader component={TargetsGoalsAov} apiPath="/targets-goals/aov" />
                    </ProtectedRoute>
                } 
            />

            {/* Access & User Management */}
            <Route 
                path="/users" 
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <PageLoader component={UsersIndex} apiPath="/users" />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/user-management/role-permission" 
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <PageLoader component={RolePermissionIndex} apiPath="/user-management/role-permission" />
                    </ProtectedRoute>
                } 
            />

            {/* Settings */}
            <Route 
                path="/settings" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <PageLoader component={SettingsIndex} apiPath="/settings" />
                    </ProtectedRoute>
                } 
            />

            {/* Notifications */}
            <Route 
                path="/notifications" 
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin', 'cashier']}>
                        <PageLoader component={NotificationsIndex} apiPath="/notifications" />
                    </ProtectedRoute>
                } 
            />

            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;
