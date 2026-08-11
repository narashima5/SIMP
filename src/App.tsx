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
import StudentProfile from '@/pages/StudentProfile';
import StudentRoster from '@/pages/StudentRoster';
import PartnerListings from '@/pages/PartnerListings';
import PlacedInterns from '@/pages/PlacedInterns';
import PerformanceAppraisals from '@/pages/PerformanceAppraisals';
import UserRegistry from '@/pages/UserRegistry';
import SystemHealth from '@/pages/SystemHealth';
import AuditLogs from '@/pages/AuditLogs';
import ProtectedRoute from '@/components/ProtectedRoute';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';
import LoadingSpinner from '@/components/LoadingSpinner';

// Route wrapper to handle redirect if user is already logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }
  
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
        <Route path="/unauthorized" element={<Unauthorized />} />

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
                <StudentProfile />
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
                <StudentRoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="partners"
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <PartnerListings />
              </ProtectedRoute>
            }
          />

          {/* Organization Specific Subroutes */}
          <Route
            path="interns"
            element={
              <ProtectedRoute allowedRoles={['organization']}>
                <PlacedInterns />
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
                <PerformanceAppraisals />
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
                <UserRegistry />
              </ProtectedRoute>
            }
          />
          <Route
            path="system"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SystemHealth />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          {/* Fallback within Layout */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
