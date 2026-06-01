import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Sidebar() {
    const { url, props } = usePage();
    const { auth, ziggy } = props;
    const currentUrl = url;
    const user = auth?.user;

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
    const active = 'bg-gradient-to-r from-[#dddbff]/70 to-[#dddbff]/10 text-[#2f27ce] font-extrabold shadow-sm';
    const inactive = 'text-[#050316]/70 font-medium hover:bg-[#dddbff]/30 hover:text-[#2f27ce]';

    const isDashboardActive = () => {
        return currentUrl === '/dashboard' ||
            currentUrl.startsWith('/owner/dashboard') ||
            currentUrl.startsWith('/admin/dashboard') ||
            currentUrl.startsWith('/cashier/dashboard');
    };

    const isActive = (path) => currentUrl.startsWith(path);
    const cls = (path) => `${base} ${isActive(path) ? active : inactive}`;

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <aside className="w-[260px] bg-[#fbfbfe] border-r border-[#dddbff] flex flex-col justify-between h-screen z-20">
            <div>
                {/* Logo */}
                <div className="px-6 py-6 border-b border-[#dddbff]">
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2f27ce] to-[#443dff] tracking-tight">
                        Cafinity POS
                    </h1>
                </div>

                <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">

                    <Link href={dashboardRoute()} className={`${base} ${isDashboardActive() ? active : inactive}`}>
                        <iconify-icon icon="solar:home-2-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Dashboard</span>
                    </Link>

                    {/* POS */}
                    <Link href="/pos" className={cls('/pos')}>
                        <iconify-icon icon="solar:card-2-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Point of Sale</span>
                    </Link>

                    {/* Transactions */}
                    <Link href="/transactions" className={cls('/transactions')}>
                        <iconify-icon icon="solar:clock-circle-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Transactions</span>
                    </Link>

                    {/* Kitchen Queue */}
                    <Link href="/kitchen-orders" className={cls('/kitchen-orders')}>
                        <iconify-icon icon="solar:chef-hat-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Kitchen Queue</span>
                    </Link>

                    {/* Owner & Admin */}
                    {can('manage-menu') && <>
                        <Link href="/menus" className={cls('/menus')}>
                            <iconify-icon icon="solar:clipboard-list-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Menu Catalog</span>
                        </Link>

                        <Link href="/promotions" className={cls('/promotions')}>
                            <iconify-icon icon="solar:tag-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Promosi & Bundling</span>
                        </Link>

                        <Link href="/recipe-costing" className={cls('/recipe-costing')}>
                            <iconify-icon icon="solar:calculator-minimalistic-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Recipe Costing</span>
                        </Link>

                        <Link href="/inventories" className={cls('/inventories')}>
                            <iconify-icon icon="solar:box-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">Inventory</span>
                        </Link>

                        <Link href="/reports" className={cls('/reports')}>
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
                                <div className="mt-1 ml-4 pl-3 border-l border-[#dddbff] space-y-0.5">
                                    <Link href="/targets-goals" className={`${base} ${currentUrl.split('?')[0] === '/targets-goals' ? active : inactive} py-2`}>
                                        <iconify-icon icon="solar:chart-square-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Ringkasan Target</span>
                                    </Link>
                                    <Link href="/targets-goals/aov" className={`${base} ${currentUrl.split('?')[0] === '/targets-goals/aov' ? active : inactive} py-2`}>
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
                                <div className="mt-1 ml-4 pl-3 border-l border-[#dddbff] space-y-0.5">
                                    <Link href="/users" className={cls('/users')}>
                                        <iconify-icon icon="solar:users-group-rounded-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">User Directory</span>
                                    </Link>
                                    <Link href="/user-management/role-permission" className={cls('/user-management/role-permission')}>
                                        <iconify-icon icon="solar:shield-user-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Roles & Permissions</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* <Link href="/system-status" className={cls('/system-status')}>
                            <iconify-icon icon="solar:server-square-linear" class="text-[20px]"></iconify-icon>
                            <span className="text-[13px]">System Status</span>
                        </Link> */}
                    </>}

                    {/* Settings */}
                    {/* <Link href="/settings" className={cls('/settings')}>
                        <iconify-icon icon="solar:settings-linear" class="text-[20px]"></iconify-icon>
                        <span className="text-[13px]">Settings</span>
                    </Link> */}

                </nav>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-[#dddbff] bg-[#fbfbfe]">
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