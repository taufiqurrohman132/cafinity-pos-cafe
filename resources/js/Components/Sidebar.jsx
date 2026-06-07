import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';


export default function Sidebar() {
    const location = useLocation();
    const currentUrl = location.pathname;
    const { user, logout } = useAuth();

    const [accessOpen, setAccessOpen] = useState(
        currentUrl.includes('/users') || currentUrl.includes('/user-management') || currentUrl.includes('/roles')
    );
    const [targetsOpen, setTargetsOpen] = useState(
        currentUrl.includes('/targets-goals')
    );

    const can = (permission) => user?.permissions?.includes(permission);

    const dashboardRoute = () => {
        if (user?.role === 'owner') return '/owner/dashboard';
        if (user?.role === 'admin') return '/admin/dashboard';
        if (user?.role === 'cashier') return '/cashier/dashboard';
        return '/dashboard';
    };

    const base = 'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200';
    const active = 'bg-gradient-to-r from-brand-light/70 to-brand-light/10 text-brand-primary font-extrabold shadow-sm';
    const inactive = 'text-brand-dark/70 font-medium hover:bg-brand-light/30 hover:text-brand-primary';

    const isDashboardActive = () => {
        return currentUrl === '/dashboard' ||
            currentUrl.startsWith('/owner/dashboard') ||
            currentUrl.startsWith('/admin/dashboard') ||
            currentUrl.startsWith('/cashier/dashboard');
    };

    const isActive = (path) => currentUrl.startsWith(path);
    const cls = (path) => `${base} ${isActive(path) ? active : inactive}`;

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className="w-[260px] bg-brand-bg border-r border-brand-light flex flex-col justify-between h-screen z-20">
            <div>
                {/* Logo */}
                <div className="px-6 py-6 border-b border-brand-light">
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary tracking-tight">
                        Cafinity POS
                    </h1>
                </div>

                <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">

                    <Link to={dashboardRoute()} className={`${base} ${isDashboardActive() ? active : inactive}`}>
                        <iconify-icon icon="solar:home-2-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Dashboard</span>
                    </Link>

                    {/* POS */}
                    <Link to="/pos" className={cls('/pos')}>
                        <iconify-icon icon="solar:card-2-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Point of Sale</span>
                    </Link>

                    {/* Transactions */}
                    <Link to="/transactions" className={cls('/transactions')}>
                        <iconify-icon icon="solar:clock-circle-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Transactions</span>
                    </Link>

                    {/* Kitchen Queue */}
                    <Link to="/kitchen-orders" className={cls('/kitchen-orders')}>
                        <iconify-icon icon="solar:chef-hat-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Kitchen Queue</span>
                    </Link>

                    {/* Owner & Admin */}
                    {can('manage-menu') && <>
                        <Link to="/menus" className={cls('/menus')}>
                            <iconify-icon icon="solar:clipboard-list-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Menu Catalog</span>
                        </Link>

                        <Link to="/promotions" className={cls('/promotions')}>
                            <iconify-icon icon="solar:tag-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Promosi & Bundling</span>
                        </Link>

                        <Link to="/recipe-costing" className={cls('/recipe-costing')}>
                            <iconify-icon icon="solar:calculator-minimalistic-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Recipe Costing</span>
                        </Link>

                        <Link to="/inventories" className={cls('/inventories')}>
                            <iconify-icon icon="solar:box-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Inventory</span>
                        </Link>

                        <Link to="/purchase-orders" className={cls('/purchase-orders')}>
                            <iconify-icon icon="solar:clipboard-list-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Purchase Order</span>
                        </Link>

                        <Link to="/suppliers" className={cls('/suppliers')}>
                            <iconify-icon icon="solar:shop-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Supplier</span>
                        </Link>

                        <Link to="/reports" className={cls('/reports')}>
                            <iconify-icon icon="solar:chart-2-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Reports</span>
                        </Link>
                    </>}

                    {/* Owner Only */}
                    {can('manage-users') && <>
                        {/* Targets & Goals Dropdown */}
                        <div>
                            <button
                                onClick={() => setTargetsOpen(!targetsOpen)}
                                className={`${base} w-full ${isActive('/targets-goals') ? active : inactive}`}
                            >
                                <iconify-icon icon="solar:target-linear" class="text-[20px]"></iconify-icon>
                                <span className="text-[13px] flex-1 text-left">Targets & Goals</span>
                                <iconify-icon
                                    icon="solar:alt-arrow-down-linear"
                                    class={`text-[14px] transition-transform duration-200 ${targetsOpen ? 'rotate-180' : ''}`}
                                >
                                </iconify-icon>
                            </button>

                            {targetsOpen && (
                                <div className="mt-1 ml-4 pl-3 border-l border-brand-light space-y-0.5">
                                    <Link to="/targets-goals" className={`${base} ${currentUrl.split('?')[0] === '/targets-goals' ? active : inactive} py-2`}>
                                        <iconify-icon icon="solar:chart-square-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Ringkasan Target</span>
                                    </Link>
                                    <Link to="/targets-goals/aov" className={`${base} ${currentUrl.split('?')[0] === '/targets-goals/aov' ? active : inactive} py-2`}>
                                        <iconify-icon icon="solar:graph-up-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Analisis AOV</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Access Management Dropdown */}
                        <div>
                            <button
                                onClick={() => setAccessOpen(!accessOpen)}
                                className={`${base} w-full ${isActive('/users') || isActive('/user-management') || isActive('/roles') ? active : inactive}`}>
                                <iconify-icon icon="solar:shield-keyhole-linear" class="text-[20px]"></iconify-icon>
                                <span className="text-[13px] flex-1 text-left">Access Management</span>
                                <iconify-icon
                                    icon="solar:alt-arrow-down-linear"
                                    class={`text-[14px] transition-transform duration-200 ${accessOpen ? 'rotate-180' : ''}`}>
                                </iconify-icon>
                            </button>

                            {accessOpen && (
                                <div className="mt-1 ml-4 pl-3 border-l border-brand-light space-y-0.5">
                                    <Link to="/users" className={cls('/users')}>
                                        <iconify-icon icon="solar:users-group-rounded-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">User Directory</span>
                                    </Link>
                                    <Link to="/user-management/role-permission" className={cls('/user-management/role-permission')}>
                                        <iconify-icon icon="solar:shield-user-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Roles & Permissions</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* <Link to="/system-status" className={cls('/system-status')}>
                            <iconify-icon icon="solar:server-square-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">System Status</span>
                        </Link> */}
                    </>}

                    {/* Settings */}
                    <Link to="/settings" className={cls('/settings')}>
                        <iconify-icon icon="solar:settings-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Settings</span>
                    </Link>

                </nav>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-brand-light bg-brand-bg">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 active:scale-[0.98] transition-all duration-200">
                    <iconify-icon icon="solar:logout-3-linear" class="text-[20px]"></iconify-icon>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}