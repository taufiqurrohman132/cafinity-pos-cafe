import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function SidebarLink({ to, icon, label, isActive, onClick, isCollapsed, activeClass, inactiveClass, suffix }) {
    const isLinkActive = typeof isActive === 'function' ? isActive() : isActive;
    
    const className = `flex items-center ${
        isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
    } rounded-xl transition-all duration-200 ${
        isLinkActive ? activeClass : inactiveClass
    } relative group`;

    const content = (
        <>
            <iconify-icon icon={icon} class="text-[20px] flex-shrink-0"></iconify-icon>
            {!isCollapsed && <span className="text-[13px] whitespace-nowrap flex-1 text-left">{label}</span>}
            {!isCollapsed && suffix}
            {isCollapsed && (
                <div className="absolute left-20 bg-[#0E0E0E] border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-200 pointer-events-none z-50 shadow-lg">
                    {label}
                </div>
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={className} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={`${className} w-full text-left`}>
            {content}
        </button>
    );
}

export default function Sidebar() {
    const location = useLocation();
    const currentUrl = location.pathname;
    const { user, logout } = useAuth();

    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true';
    });

    const [accessOpen, setAccessOpen] = useState(
        currentUrl.includes('/users') || currentUrl.includes('/user-management') || currentUrl.includes('/roles')
    );
    const [targetsOpen, setTargetsOpen] = useState(
        currentUrl.includes('/targets-goals')
    );

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const next = !prev;
            localStorage.setItem('sidebar-collapsed', String(next));
            return next;
        });
    };

    const handleDropdownClick = (isOpen, setOpen) => {
        if (isCollapsed) {
            setIsCollapsed(false);
            localStorage.setItem('sidebar-collapsed', 'false');
            setOpen(true);
        } else {
            setOpen(!isOpen);
        }
    };

    const can = (permission) => user?.permissions?.includes(permission);

    const dashboardRoute = () => {
        if (user?.role === 'owner') return '/owner/dashboard';
        if (user?.role === 'admin') return '/admin/dashboard';
        if (user?.role === 'cashier') return '/cashier/dashboard';
        return '/dashboard';
    };

    const active = 'bg-gradient-to-r from-[#BFFF00] to-[#BFFF00]/30 text-black font-extrabold shadow-sm shadow-[#BFFF00]/20';
    const inactive = 'text-white/70 font-medium hover:bg-[#BFFF00]/10 hover:text-[#BFFF00]';

    const activeSub = 'text-[#BFFF00] bg-[#BFFF00]/10 font-bold shadow-sm';
    const inactiveSub = 'text-white/65 font-medium hover:text-[#BFFF00] hover:bg-[#BFFF00]/5';

    const isDashboardActive = () => {
        return currentUrl === '/dashboard' ||
            currentUrl.startsWith('/owner/dashboard') ||
            currentUrl.startsWith('/admin/dashboard') ||
            currentUrl.startsWith('/cashier/dashboard');
    };

    const isActive = (path) => currentUrl.startsWith(path);
    const clsSub = (path) => `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${currentUrl.split('?')[0] === path ? activeSub : inactiveSub}`;

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className={`relative ${isCollapsed ? 'w-[80px]' : 'w-[260px]'} bg-[#0E0E0E] md:border-r-0 border-r border-white/10 flex flex-col justify-between h-screen z-20 transition-all duration-300 ease-in-out`}>
            {/* Toggle Collapse Button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#0E0E0E] border border-white/10 flex items-center justify-center text-white/70 shadow-md hover:text-[#BFFF00] hover:border-[#BFFF00]/50 transition-all z-50 cursor-pointer"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <iconify-icon icon={isCollapsed ? 'solar:alt-arrow-right-linear' : 'solar:alt-arrow-left-linear'} class="text-xs"></iconify-icon>
            </button>

            <div>
                {/* Logo */}
                <div className={`py-6 border-b border-white/10 flex items-center relative overflow-hidden transition-all duration-300 ${isCollapsed ? 'px-4 justify-center' : 'px-6'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#BFFF00] flex items-center justify-center text-black font-extrabold text-xl hover:bg-[#C8FF5E] hover:scale-105 transition-all shadow-md shadow-[#BFFF00]/10 flex-shrink-0">
                            C
                        </div>
                        {!isCollapsed && (
                            <h1 className="text-xl font-black text-white tracking-tight whitespace-nowrap">
                                afinity <span className="text-[#BFFF00]">POS</span>
                            </h1>
                        )}
                    </div>
                </div>

                <nav className={`space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
                    <SidebarLink
                        to={dashboardRoute()}
                        icon="solar:home-2-linear"
                        label="Dashboard"
                        isActive={isDashboardActive}
                        isCollapsed={isCollapsed}
                        activeClass={active}
                        inactiveClass={inactive}
                    />

                    {/* POS */}
                    <SidebarLink
                        to="/pos"
                        icon="solar:card-2-linear"
                        label="Point of Sale"
                        isActive={isActive('/pos')}
                        isCollapsed={isCollapsed}
                        activeClass={active}
                        inactiveClass={inactive}
                    />

                    {/* Transactions */}
                    <SidebarLink
                        to="/transactions"
                        icon="solar:clock-circle-linear"
                        label="Transactions"
                        isActive={isActive('/transactions')}
                        isCollapsed={isCollapsed}
                        activeClass={active}
                        inactiveClass={inactive}
                    />

                    {/* Kitchen Queue */}
                    <SidebarLink
                        to="/kitchen-orders"
                        icon="solar:chef-hat-linear"
                        label="Kitchen Queue"
                        isActive={isActive('/kitchen-orders')}
                        isCollapsed={isCollapsed}
                        activeClass={active}
                        inactiveClass={inactive}
                    />

                    {/* Owner & Admin */}
                    {can('manage-menu') && <>
                        <SidebarLink
                            to="/menus"
                            icon="solar:clipboard-list-linear"
                            label="Menu Catalog"
                            isActive={isActive('/menus')}
                            isCollapsed={isCollapsed}
                            activeClass={active}
                            inactiveClass={inactive}
                        />

                        <SidebarLink
                            to="/promotions"
                            icon="solar:tag-linear"
                            label="Promosi & Bundling"
                            isActive={isActive('/promotions')}
                            isCollapsed={isCollapsed}
                            activeClass={active}
                            inactiveClass={inactive}
                        />

                        <SidebarLink
                            to="/recipe-costing"
                            icon="solar:calculator-minimalistic-linear"
                            label="Recipe Costing"
                            isActive={isActive('/recipe-costing')}
                            isCollapsed={isCollapsed}
                            activeClass={active}
                            inactiveClass={inactive}
                        />

                        <SidebarLink
                            to="/inventories"
                            icon="solar:box-linear"
                            label="Inventory"
                            isActive={isActive('/inventories')}
                            isCollapsed={isCollapsed}
                            activeClass={active}
                            inactiveClass={inactive}
                        />

                        <SidebarLink
                            to="/purchase-orders"
                            icon="solar:clipboard-list-linear"
                            label="Purchase Order"
                            isActive={isActive('/purchase-orders')}
                            isCollapsed={isCollapsed}
                            activeClass={active}
                            inactiveClass={inactive}
                        />

                        <SidebarLink
                            to="/suppliers"
                            icon="solar:shop-linear"
                            label="Supplier"
                            isActive={isActive('/suppliers')}
                            isCollapsed={isCollapsed}
                            activeClass={active}
                            inactiveClass={inactive}
                        />

                        <SidebarLink
                            to="/reports"
                            icon="solar:chart-2-linear"
                            label="Reports"
                            isActive={isActive('/reports')}
                            isCollapsed={isCollapsed}
                            activeClass={active}
                            inactiveClass={inactive}
                        />
                    </>}

                    {/* Owner Only */}
                    {can('manage-users') && <>
                        {/* Targets & Goals Dropdown */}
                        <div>
                            <SidebarLink
                                icon="solar:target-linear"
                                label="Targets & Goals"
                                isActive={isActive('/targets-goals')}
                                onClick={() => handleDropdownClick(targetsOpen, setTargetsOpen)}
                                isCollapsed={isCollapsed}
                                activeClass={active}
                                inactiveClass={inactive}
                                suffix={
                                    <iconify-icon
                                        icon="solar:alt-arrow-down-linear"
                                        class={`text-[14px] transition-transform duration-200 ${targetsOpen ? 'rotate-180' : ''}`}
                                    />
                                }
                            />

                            {!isCollapsed && targetsOpen && (
                                <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-0.5">
                                    <Link to="/targets-goals" className={clsSub('/targets-goals')}>
                                        <iconify-icon icon="solar:chart-square-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Ringkasan Target</span>
                                    </Link>
                                    <Link to="/targets-goals/aov" className={clsSub('/targets-goals/aov')}>
                                        <iconify-icon icon="solar:graph-up-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Analisis AOV</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Access Management Dropdown */}
                        <div>
                            <SidebarLink
                                icon="solar:shield-keyhole-linear"
                                label="Access Management"
                                isActive={isActive('/users') || isActive('/user-management') || isActive('/roles')}
                                onClick={() => handleDropdownClick(accessOpen, setAccessOpen)}
                                isCollapsed={isCollapsed}
                                activeClass={active}
                                inactiveClass={inactive}
                                suffix={
                                    <iconify-icon
                                        icon="solar:alt-arrow-down-linear"
                                        class={`text-[14px] transition-transform duration-200 ${accessOpen ? 'rotate-180' : ''}`}
                                    />
                                }
                            />

                            {!isCollapsed && accessOpen && (
                                <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-0.5">
                                    <Link to="/users" className={clsSub('/users')}>
                                        <iconify-icon icon="solar:users-group-rounded-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">User Directory</span>
                                    </Link>
                                    <Link to="/user-management/role-permission" className={clsSub('/user-management/role-permission')}>
                                        <iconify-icon icon="solar:shield-user-linear" class="text-[18px]"></iconify-icon>
                                        <span className="text-[13px]">Roles & Permissions</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>}

                    {/* Settings */}
                    <SidebarLink
                        to="/settings"
                        icon="solar:settings-linear"
                        label="Settings"
                        isActive={isActive('/settings')}
                        isCollapsed={isCollapsed}
                        activeClass={active}
                        inactiveClass={inactive}
                    />
                </nav>
            </div>

            {/* Logout */}
            <div className={`border-t border-white/10 bg-[#0E0E0E] transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-2.5'} rounded-xl text-[13px] font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98] transition-all duration-200 relative group`}
                >
                    <iconify-icon icon="solar:logout-3-linear" class="text-[20px]"></iconify-icon>
                    {!isCollapsed && <span>Sign Out</span>}
                    {isCollapsed && (
                        <div className="absolute left-20 bg-[#0E0E0E] border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-200 pointer-events-none z-50 shadow-lg">
                            Sign Out
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}