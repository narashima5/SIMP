import React from 'react';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Grid, Container } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface RoleOption {
  role: UserRole;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    login(role);
    navigate('/');
  };

  const roles: RoleOption[] = [
    {
      role: 'student',
      title: 'Student Portal',
      desc: 'Submit daily/weekly logs, search internships, track applications.',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: '#6366f1',
    },
    {
      role: 'coordinator',
      title: 'Coordinator Portal',
      desc: 'Approve logs, manage student allocations, verify company listings.',
      icon: <SupervisorAccountIcon sx={{ fontSize: 40 }} />,
      color: '#a855f7',
    },
    {
      role: 'organization',
      title: 'Organization Portal',
      desc: 'Post opportunities, interview candidates, submit final evaluations.',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: '#14b8a6',
    },
    {
      role: 'admin',
      title: 'Admin Console',
      desc: 'Manage roles, view system-wide logs, run platform audits.',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #131b2e 0%, #0b0f19 100%)',
        padding: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Background Blurs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" className="anim-slide-up" style={{ zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #f8fafc 30%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            SIMP
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              mb: 2,
            }}
          >
            Smart Internship Management Platform
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-secondary)', maxW: '600px', mx: 'auto' }}>
            Select your role to login automatically. The system simulates full workspace environments for testing.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {roles.map((item) => (
            <Grid size={{ xs: 12, sm: 6 }} key={item.role}>
              <Card
                onClick={() => handleRoleSelect(item.role)}
                sx={{
                  background: 'rgba(19, 27, 46, 0.6)',
                  backdropFilter: 'var(--glass-blur)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-lg)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    background: 'rgba(30, 41, 66, 0.8)',
                    borderColor: item.color,
                    boxShadow: `0 12px 30px rgba(0, 0, 0, 0.3), 0 0 15px ${item.color}25`,
                  },
                }}
              >
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: 'var(--border-radius-md)',
                      background: `rgba(255, 255, 255, 0.03)`,
                      color: item.color,
                      alignSelf: 'flex-start',
                      mb: 2.5,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      flexGrow: 1,
                    }}
                  >
                    {item.desc}
                  </Typography>

                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', color: item.color, fontWeight: 600, fontSize: '0.875rem' }}>
                    <LockOpenIcon sx={{ fontSize: 18, mr: 1 }} />
                    Quick Login &rarr;
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
export default Login;
