import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { Box, Card, CardContent, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
        <Card sx={{ maxWidth: 500, width: '100%', background: 'rgba(239, 68, 68, 0.05) !important', border: '1px solid var(--danger)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center', p: 4 }}>
          <CardContent>
            <LockIcon sx={{ fontSize: 56, color: 'var(--danger)', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 1.5, color: '#fff' }}>
              Access Denied
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              You do not have the required role permissions ({allowedRoles.join(', ')}) to access this page. Please use the quick role switcher in the header to change roles.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
