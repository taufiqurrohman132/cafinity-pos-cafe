import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize state from local storage or session storage
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            
            // Validate session and refresh user info
            client.get('/auth/me')
                .then((response) => {
                    const freshUser = response.data;
                    setUser(freshUser);
                    // Refresh storage location if needed, here we assume keeping current location
                    if (localStorage.getItem('user')) {
                        localStorage.setItem('user', JSON.stringify(freshUser));
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(freshUser));
                    }
                })
                .catch(() => {
                    // Failures (e.g., token invalid/expired) are handled by Axios response interceptor (redirects)
                    logoutState();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password, remember = false) => {
        setLoading(true);
        try {
            // Ensure CSRF cookie is set for Sanctum
            await client.get('/sanctum/csrf-cookie');
            const response = await client.post('/auth/login', { email, password });
            const { token: receivedToken, user: receivedUser } = response.data;

            if (remember) {
                localStorage.setItem('token', receivedToken);
                localStorage.setItem('user', JSON.stringify(receivedUser));
            } else {
                sessionStorage.setItem('token', receivedToken);
                sessionStorage.setItem('user', JSON.stringify(receivedUser));
            }

            setToken(receivedToken);
            setUser(receivedUser);
            setLoading(false);
            return receivedUser;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logoutState = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const logout = async () => {
        setLoading(true);
        try {
            await client.post('/auth/logout');
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            logoutState();
            setLoading(false);
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
