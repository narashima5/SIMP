import React, { useState } from 'react';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Card, Typography, Grid, Container, Button, TextField, Alert, CircularProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';

interface RoleOption {
  role: UserRole;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

export const Login: React.FC = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sandboxLoading, setSandboxLoading] = useState<UserRole | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSandboxLogin = async (role: UserRole) => {
    setError(null);
    setSandboxLoading(role);
    try {
      await switchRole(role);
      navigate('/');
    } catch (err: any) {
      setError(`Sandbox login for ${role} failed: ${err.message || 'Check database connection.'}`);
    } finally {
      setSandboxLoading(null);
    }
  };

  const roles: RoleOption[] = [
    {
      role: 'student',
      title: 'Student Portal',
      desc: 'Submit weekly logs, search internships, track applications.',
      icon: <SchoolIcon sx={{ fontSize: 24 }} />,
      color: '#6366f1',
    },
    {
      role: 'coordinator',
      title: 'Coordinator Portal',
      desc: 'Approve logs, manage allocations, verify listings.',
      icon: <SupervisorAccountIcon sx={{ fontSize: 24 }} />,
      color: '#a855f7',
    },
    {
      role: 'organization',
      title: 'Organization Portal',
      desc: 'Post opportunities, interview, submit evaluations.',
      icon: <BusinessIcon sx={{ fontSize: 24 }} />,
      color: '#14b8a6',
    },
    {
      role: 'admin',
      title: 'Admin Console',
      desc: 'Manage roles, view system logs, run audits.',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 24 }} />,
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
      {/* Background Blurs */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.12)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.12)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" className="anim-slide-up" style={{ zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #f8fafc 30%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            SIMP
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              mb: 1,
            }}
          >
            Smart Internship Management Platform
          </Typography>
        </Box>

        <Card
          sx={{
            background: 'rgba(19, 27, 46, 0.7)',
            backdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-lg)',
            p: 4,
            boxShadow: 'var(--shadow-lg)',
            mb: 4
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontFamily: 'var(--font-display)' }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 'var(--border-radius-sm)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{ input: { className: 'glass-input' } }}
              sx={{
                mb: 2.5,
                '& label': { color: 'var(--text-muted)' },
                '& input': { color: '#fff' }
              }}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address'
                }
              })}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{ input: { className: 'glass-input' } }}
              sx={{
                mb: 3,
                '& label': { color: 'var(--text-muted)' },
                '& input': { color: '#fff' }
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important',
                color: '#fff !important',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 'var(--border-radius-sm)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                },
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              onClick={() => navigate('/register')}
              sx={{ color: 'var(--text-secondary) !important', textTransform: 'none', fontWeight: 500 }}
            >
              Don't have an account? <span style={{ color: 'var(--primary)', marginLeft: '4px', fontWeight: 600 }}>Register &rarr;</span>
            </Button>
          </Box>
        </Card>

        {/* Sandbox quick testing panel */}
        <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
          Development Sandbox: Quick Role Login
        </Typography>

        <Grid container spacing={2}>
          {roles.map((item) => (
            <Grid size={6} key={item.role}>
              <Card
                onClick={() => sandboxLoading === null && handleSandboxLogin(item.role)}
                sx={{
                  background: 'rgba(19, 27, 46, 0.5)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: sandboxLoading === null ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': sandboxLoading === null ? {
                    transform: 'translateY(-3px)',
                    background: 'rgba(30, 41, 66, 0.7)',
                    borderColor: item.color,
                    boxShadow: `0 8px 20px rgba(0, 0, 0, 0.2), 0 0 10px ${item.color}15`,
                  } : {},
                }}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {sandboxLoading === item.role ? (
                    <CircularProgress size={24} sx={{ color: item.color }} />
                  ) : (
                    <Box sx={{ color: item.color, display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {item.title.split(' ')[0]}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>
                      Quick Access &rarr;
                    </Typography>
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
