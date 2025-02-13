import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    const location = useLocation();

    // Redirect to login if not authenticated or no current user
    if (!currentUser || !isAuthenticated) {
        return <Navigate to="/client-login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
