import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { authAtom } from '../context/authAtom';
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute Component
 * Verifies token + role before allowing access to protected pages
 * Redirects to /signin if not authenticated or role doesn't match
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useAtomValue(authAtom);

  // Loading state
  if (auth === undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated - redirect to signin
  if (!auth.isAuthenticated || !auth.token) {
    return <Navigate to="/signin" replace />;
  }

  // Role check - if allowedRoles specified, verify user has one of them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(auth.role)) {
      return <Navigate to="/signin" replace />;
    }
  }

  // All checks passed - render children
  return children;
};

export default ProtectedRoute;
