import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import StudentDashboard from '@/pages/StudentDashboard';
import CoordinatorDashboard from '@/pages/CoordinatorDashboard';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import InternshipListing from '@/pages/InternshipListing';
import ApplicationDetails from '@/pages/ApplicationDetails';
import ProgressReport from '@/pages/ProgressReport';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Box, Card, CardContent, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Route wrapper to handle redirect if user is already logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Dynamic Dashboard Router based on current user role
const RoleDashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'student':
      return <StudentDashboard />;
    case 'coordinator':
      return <CoordinatorDashboard />;
    case 'organization':
      return <OrganizationDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Mock page component for subroutes
const MockPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <Card sx={{ maxWidth: 500, width: '100%', background: 'rgba(19, 27, 46, 0.4) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center', p: 4 }}>
        <CardContent>
          <InfoIcon sx={{ fontSize: 56, color: 'var(--primary)', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 1.5 }}>
            {title} Page
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This section is part of the development setup layout for the Smart Internship Management Platform. In a production environment, this page will render live databases and forms matching your credentials.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes Wrapper */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Main home dashboard renders dynamically based on role */}
          <Route index element={<RoleDashboardRouter />} />

          {/* Student Specific Subroutes */}
          <Route
            path="logs"
            element={
              <ProtectedRoute allowedRoles={['student', 'coordinator']}>
                <ProgressReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="search"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <InternshipListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MockPage title="Student Profile & Settings" />
              </ProtectedRoute>
            }
          />

          {/* Coordinator Specific Subroutes */}
          <Route
            path="approve-logs"
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <ProgressReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="roster"
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <MockPage title="Student Academic Roster" />
              </ProtectedRoute>
            }
          />
          <Route
            path="partners"
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <MockPage title="Corporate Partner Listings" />
              </ProtectedRoute>
            }
          />

          {/* Organization Specific Subroutes */}
          <Route
            path="interns"
            element={
              <ProtectedRoute allowedRoles={['organization']}>
                <MockPage title="Placed Student Interns" />
              </ProtectedRoute>
            }
          />
          <Route
            path="postings"
            element={
              <ProtectedRoute allowedRoles={['organization']}>
                <InternshipListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="evaluations"
            element={
              <ProtectedRoute allowedRoles={['organization', 'coordinator']}>
                <MockPage title="Intern Performance Appraisals" />
              </ProtectedRoute>
            }
          />

          {/* Shared Application View */}
          <Route
            path="applications/:id"
            element={
              <ProtectedRoute allowedRoles={['student', 'coordinator', 'organization']}>
                <ApplicationDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Specific Subroutes */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MockPage title="User Accounts Registry" />
              </ProtectedRoute>
            }
          />
          <Route
            path="system"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MockPage title="Platform Infrastructure Health" />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MockPage title="Platform Security Audits" />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
