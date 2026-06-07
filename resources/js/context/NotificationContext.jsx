import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

// Premium synthesized audio chime player using Web Audio API (zero dependencies)
const playChime = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        if (type === 'success') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
            osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
            
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.45);
        } else if (type === 'kitchen_order') {
            // High frequency double chime (bell alert)
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(880.00, ctx.currentTime); // A5
            osc1.frequency.setValueAtTime(987.77, ctx.currentTime + 0.1); // B5
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
            osc2.frequency.setValueAtTime(1479.98, ctx.currentTime + 0.1); // F#6
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            
            osc1.start();
            osc2.start();
            osc1.stop(ctx.currentTime + 0.5);
            osc2.stop(ctx.currentTime + 0.5);
        } else if (type === 'warning' || type === 'error') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
            osc.frequency.linearRampToValueAtTime(146.83, ctx.currentTime + 0.3); // D3
            
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        }
    } catch (e) {
        console.error("Gagal memutar chime audio:", e);
    }
};

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState([]);
    
    const seenIdsRef = useRef(new Set());
    const isFirstLoadRef = useRef(true);

    const addToast = (title, body, type = 'success') => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, title, body, type }]);
        
        // Auto remove toast after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        try {
            const res = await client.get('/notifications');
            const newCount = res.data.stats?.unread ?? 0;
            setUnreadCount(newCount);
            
            const list = res.data.notifications?.data ?? [];
            
            // On first load, cache existing unread notification IDs to avoid spamming toasts
            if (isFirstLoadRef.current) {
                list.forEach(n => seenIdsRef.current.add(n.id));
                isFirstLoadRef.current = false;
                return;
            }

            // Check for new notifications
            let newNotifFound = false;
            let chimeType = 'success';

            list.forEach(n => {
                if (!seenIdsRef.current.has(n.id)) {
                    seenIdsRef.current.add(n.id);
                    newNotifFound = true;
                    
                    // Display toast
                    let alertType = 'success';
                    if (n.type === 'stock') {
                        alertType = 'warning';
                        chimeType = 'warning';
                    } else if (n.type === 'payment_failed') {
                        alertType = 'error';
                        chimeType = 'error';
                    }
                    addToast(n.title, n.body, alertType);
                }
            });

            if (newNotifFound) {
                playChime(chimeType);
            }
        } catch (err) {
            console.error("Gagal melakukan sinkronisasi notifikasi:", err);
        }
    };

    // Polling interval
    useEffect(() => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            seenIdsRef.current.clear();
            isFirstLoadRef.current = true;
            return;
        }

        // Fetch immediately
        fetchNotifications();

        // Check every 6 seconds
        const timer = setInterval(() => {
            fetchNotifications();
        }, 6000);

        return () => clearInterval(timer);
    }, [isAuthenticated]);

    // Handle global custom event triggers for local instant page notifications
    useEffect(() => {
        const handleLocalEvent = (e) => {
            const { title, body, type, chime } = e.detail || {};
            addToast(title || 'Notifikasi', body || '', type || 'success');
            if (chime) {
                playChime(chime);
            }
            // Trigger quick fetch
            fetchNotifications();
        };

        window.addEventListener('cafinity-local-notif', handleLocalEvent);
        return () => {
            window.removeEventListener('cafinity-local-notif', handleLocalEvent);
        };
    }, []);

    const value = {
        unreadCount,
        toasts,
        addToast,
        removeToast,
        playChime,
        triggerLocalNotif: (title, body, type = 'success', chime = 'success') => {
            const event = new CustomEvent('cafinity-local-notif', {
                detail: { title, body, type, chime }
            });
            window.dispatchEvent(event);
        },
        refresh: fetchNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
