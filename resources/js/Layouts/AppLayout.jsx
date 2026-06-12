import { Outlet } from 'react-router-dom';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import { NotificationProvider, useNotifications } from '@/context/NotificationContext';

function LayoutContent() {
    const { toasts, removeToast } = useNotifications();

    const config = {
        success: { border: 'border-emerald-100', icon: 'solar:check-circle-linear',   iconColor: 'text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        error:   { border: 'border-rose-100',   icon: 'solar:close-circle-linear',   iconColor: 'text-rose-600',   bg: 'bg-rose-50',   text: 'text-rose-750' },
        info:    { border: 'border-blue-100',  icon: 'solar:info-circle-linear',    iconColor: 'text-blue-600',  bg: 'bg-blue-50',  text: 'text-blue-750' },
        warning: { border: 'border-amber-100', icon: 'solar:warning-circle-linear', iconColor: 'text-amber-600', bg: 'bg-amber-50', text: 'text-amber-750' },
    };

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
            
            {/* Dynamic Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => {
                    const c = config[toast.type] || config.success;
                    return (
                        <div key={toast.id} className={`pointer-events-auto flex gap-3 bg-white/95 backdrop-blur-md border ${c.border} rounded-2xl p-4 shadow-xl min-w-[320px] max-w-sm border-l-4 ${toast.type === 'error' ? 'border-l-rose-500' : toast.type === 'warning' ? 'border-l-amber-500' : 'border-l-emerald-500'} animate-slide-in relative overflow-hidden`}>
                            <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                                <iconify-icon icon={c.icon} class={`${c.iconColor} text-lg`}></iconify-icon>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] font-black text-brand-dark capitalize tracking-wider">{toast.title}</h5>
                                <p className="text-[11px] text-brand-primary/80 font-bold mt-0.5 leading-relaxed break-words">{toast.body}</p>
                            </div>
                            <button onClick={() => removeToast(toast.id)}
                                className="text-gray-400 hover:text-brand-secondary flex-shrink-0 self-start p-1 hover:bg-brand-light/30 rounded-lg active:scale-95 transition-all">
                                <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function AppLayout() {
    return (
        <NotificationProvider>
            <LayoutContent />
        </NotificationProvider>
    );
}