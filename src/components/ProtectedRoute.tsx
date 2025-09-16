import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Added requiredRole to enforce role-based access for sensitive routes like government dashboard
  // NOTE: Keeping default behavior intact if requiredRole is not provided
  requiredRole?: 'government' | 'local';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login with return path
  if (!currentUser) {
    return <Navigate to={`/login`} state={{ from: location }} replace />;
  }

  // If a role is required, ensure it matches the signed-in user's role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect mismatch users to a safe default
    return <Navigate to={userRole === 'local' ? '/local-dashboard' : '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
