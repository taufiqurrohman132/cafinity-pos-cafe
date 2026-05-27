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
        success: { border: 'border-green-200', icon: 'solar:check-circle-bold',   iconColor: 'text-green-600', bg: 'bg-green-100', text: 'text-green-700' },
        error:   { border: 'border-red-200',   icon: 'solar:close-circle-bold',   iconColor: 'text-red-600',   bg: 'bg-red-100',   text: 'text-red-700' },
        info:    { border: 'border-blue-200',  icon: 'solar:info-circle-bold',    iconColor: 'text-blue-600',  bg: 'bg-blue-100',  text: 'text-blue-700' },
        warning: { border: 'border-amber-200', icon: 'solar:warning-circle-bold', iconColor: 'text-amber-600', bg: 'bg-amber-100', text: 'text-amber-700' },
    };

    if (!toasts.length) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast, i) => {
                const c = config[toast.type];
                return (
                    <div key={i} className={`pointer-events-auto flex items-center gap-3 bg-white border ${c.border} rounded-xl px-4 py-3 shadow-lg min-w-[280px] max-w-sm animate-slide-in`}>
                        <div className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center flex-shrink-0`}>
                            <iconify-icon icon={c.icon} class={`${c.iconColor} text-lg`}></iconify-icon>
                        </div>
                        <p className={`flex-1 text-sm font-semibold ${c.text}`}>{toast.message}</p>
                        <button onClick={() => setToasts(t => t.filter((_, j) => j !== i))}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                            <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}