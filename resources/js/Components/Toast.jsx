import { useEffect, useState } from 'react';

export default function Toast({ flash }) {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const newToasts = [];
        if (flash?.success) newToasts.push({ type: 'success', message: flash.success });
        if (flash?.error)   newToasts.push({ type: 'error',   message: flash.error });
        if (flash?.info)    newToasts.push({ type: 'info',    message: flash.info });
        if (flash?.warning) newToasts.push({ type: 'warning', message: flash.warning });

        if (newToasts.length) {
            setToasts(newToasts);
            setTimeout(() => setToasts([]), 4000);
        }
    }, [flash]);

    const config = {
        success: { border: 'border-emerald-200', icon: 'solar:check-circle-linear',   iconColor: 'text-emerald-500 text-lg', bg: 'bg-emerald-50' },
        error:   { border: 'border-red-200',   icon: 'solar:close-circle-linear',   iconColor: 'text-red-500 text-lg',   bg: 'bg-red-50' },
        info:    { border: 'border-blue-200',  icon: 'solar:info-circle-linear',    iconColor: 'text-blue-500 text-lg',  bg: 'bg-blue-50' },
        warning: { border: 'border-amber-200', icon: 'solar:danger-triangle-linear', iconColor: 'text-amber-500 text-lg', bg: 'bg-amber-50' },
    };

    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast, i) => {
                const c = config[toast.type] || config.success;
                return (
                    <div key={i} className={`pointer-events-auto flex items-start gap-3 bg-white border ${c.border} rounded-2xl shadow-lg p-4 animate-slide-in-bottom`}>
                        <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                            <iconify-icon icon={c.icon} class={c.iconColor}></iconify-icon>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-brand-dark">{toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Gagal' : toast.type === 'warning' ? 'Peringatan' : 'Informasi'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{toast.message}</p>
                        </div>
                        <button onClick={() => setToasts(t => t.filter((_, j) => j !== i))}
                            className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                            <iconify-icon icon="solar:close-linear"></iconify-icon>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}