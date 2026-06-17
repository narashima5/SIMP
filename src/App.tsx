import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import StudentDashboard from '@/pages/StudentDashboard';
import CoordinatorDashboard from '@/pages/CoordinatorDashboard';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { Box, Card, CardContent, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

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
            This section is part of the development setup layout for the Smart Internship Management Platform. In a production environment, this page will render live databases and forms matching your coordinator or user credentials.
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
        {/* Public Route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
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

          {/* Student Subroutes */}
          <Route path="logs" element={<MockPage title="Student Weekly Logsheets" />} />
          <Route path="search" element={<MockPage title="Internship Search & Listings" />} />
          <Route path="profile" element={<MockPage title="Student Profile & Settings" />} />

          {/* Coordinator Subroutes */}
          <Route path="approve-logs" element={<CoordinatorDashboard />} /> {/* Reuse pending logs view */}
          <Route path="roster" element={<MockPage title="Student Academic Roster" />} />
          <Route path="partners" element={<MockPage title="Corporate Partner Listings" />} />

          {/* Organization Subroutes */}
          <Route path="interns" element={<MockPage title="Placed Student Interns" />} />
          <Route path="postings" element={<MockPage title="Active Vacancy Postings" />} />
          <Route path="evaluations" element={<MockPage title="Intern Performance Appraisals" />} />

          {/* Admin Subroutes */}
          <Route path="users" element={<MockPage title="User Accounts Registry" />} />
          <Route path="system" element={<MockPage title="Platform Infrastructure Health" />} />
          <Route path="audit" element={<MockPage title="Platform Security Audits" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
