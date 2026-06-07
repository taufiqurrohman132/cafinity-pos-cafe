import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardRedirect = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    switch (user?.role) {
        case 'owner':
            return <Navigate to="/owner/dashboard" replace />;
        case 'admin':
            return <Navigate to="/admin/dashboard" replace />;
        case 'cashier':
            return <Navigate to="/cashier/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default DashboardRedirect;
