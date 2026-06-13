import React, { createContext, useContext, useState } from 'react';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
    const [modalState, setModalState] = useState(null);

    const confirm = (options = {}) => {
        return new Promise((resolve) => {
            setModalState({
                title: options.title || 'Konfirmasi',
                message: options.message || 'Tindakan ini tidak dapat dibatalkan.',
                isDanger: options.isDanger !== false, // Default to danger/delete style
                confirmText: options.confirmText || 'Hapus',
                cancelText: options.cancelText || 'Batal',
                resolve,
            });
        });
    };

    const handleConfirm = () => {
        if (modalState) {
            modalState.resolve(true);
            setModalState(null);
        }
    };

    const handleCancel = () => {
        if (modalState) {
            modalState.resolve(false);
            setModalState(null);
        }
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {modalState && (
                <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in-bottom">
                        {modalState.isDanger ? (
                            <div className="px-6 py-5 border-b border-red-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-xl text-red-500"></iconify-icon>
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-brand-dark">{modalState.title}</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">{modalState.message}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="px-6 py-5 border-b border-brand-light flex items-center justify-between">
                                <h2 className="text-lg font-bold text-brand-dark">{modalState.title}</h2>
                                <button 
                                    onClick={handleCancel}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    <iconify-icon icon="solar:close-linear" class="text-lg"></iconify-icon>
                                </button>
                            </div>
                        )}

                        {!modalState.isDanger && (
                            <div className="px-6 py-5">
                                <p className="text-sm text-gray-600 leading-relaxed">{modalState.message}</p>
                            </div>
                        )}

                        <div className="px-6 py-4 border-t border-brand-light flex items-center justify-end gap-3 bg-gray-50/50">
                            <button 
                                onClick={handleCancel}
                                className="px-4 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                            >
                                {modalState.cancelText}
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className={`px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-[0.97] ${
                                    modalState.isDanger 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-brand-primary hover:bg-brand-secondary'
                                }`}
                            >
                                {modalState.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context.confirm;
};
