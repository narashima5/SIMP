import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { Box, Card, Typography, Grid, Container, TextField, Button, MenuItem, FormControl, Select, InputLabel, Alert, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      studentId: '',
      department: '',
      employeeId: '',
      designation: '',
      companyName: '',
      industry: '',
      website: '',
    }
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setIsSubmitting(true);
    try {
      // Build the registration payload dynamically based on selected role
      const payload: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        role,
      };

      if (role === 'student') {
        payload.studentId = data.studentId;
        payload.department = data.department;
      } else if (role === 'coordinator') {
        payload.employeeId = data.employeeId;
        payload.designation = data.designation;
        payload.department = data.department;
      } else if (role === 'organization') {
        payload.companyName = data.companyName;
        payload.industry = data.industry;
        payload.website = data.website;
      }

      await registerUser(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (e: any) => {
    setRole(e.target.value as UserRole);
  };

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
      {/* Background blurs */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.12)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.12)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" className="anim-slide-up" style={{ zIndex: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/login')}
            sx={{ color: 'var(--text-secondary) !important', '&:hover': { color: 'var(--text-primary) !important' } }}
          >
            Back to Login
          </Button>
        </Box>

        <Card
          sx={{
            background: 'rgba(19, 27, 46, 0.7)',
            backdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-lg)',
            p: { xs: 3, md: 5 },
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--accent)', mb: 2, fontFamily: 'var(--font-display)' }}>
                Registration Successful!
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                Your account has been created successfully. Redirecting to login page...
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', mb: 1 }}>
                  Create Account
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  Join the Smart Internship Management Platform
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 'var(--border-radius-sm)' }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2.5}>
                {/* Full Name */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    slotProps={{ input: { className: 'glass-input' } }}
                    sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                    {...register('name', { required: 'Full name is required' })}
                  />
                </Grid>

                {/* Email */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email Address"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{ input: { className: 'glass-input' } }}
                    sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                </Grid>

                {/* Password */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{ input: { className: 'glass-input' } }}
                    sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                </Grid>

                {/* Role Selector */}
                <Grid size={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'var(--text-muted)' }}>Portal Role</InputLabel>
                    <Select
                      value={role}
                      onChange={handleRoleChange}
                      label="Portal Role"
                      sx={{
                        color: '#fff',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--border-radius-sm)',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      }}
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="coordinator">Faculty Coordinator</MenuItem>
                      <MenuItem value="organization">Recruiting Organization</MenuItem>
                      <MenuItem value="admin">System Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Student specific fields */}
                {role === 'student' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Student Roll/ID"
                        error={!!errors.studentId}
                        helperText={errors.studentId?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('studentId', { required: 'Student Roll ID is required' })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Department"
                        error={!!errors.department}
                        helperText={errors.department?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('department', { required: 'Department is required' })}
                      />
                    </Grid>
                  </>
                )}

                {/* Faculty Coordinator specific fields */}
                {role === 'coordinator' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        error={!!errors.employeeId}
                        helperText={errors.employeeId?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('employeeId', { required: 'Employee ID is required' })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Designation"
                        error={!!errors.designation}
                        helperText={errors.designation?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('designation', { required: 'Designation is required' })}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Department"
                        error={!!errors.department}
                        helperText={errors.department?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('department', { required: 'Department is required' })}
                      />
                    </Grid>
                  </>
                )}

                {/* Recruiting Organization specific fields */}
                {role === 'organization' && (
                  <>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        error={!!errors.companyName}
                        helperText={errors.companyName?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('companyName', { required: 'Company name is required' })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Industry Type"
                        error={!!errors.industry}
                        helperText={errors.industry?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('industry', { required: 'Industry type is required' })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Company Website"
                        error={!!errors.website}
                        helperText={errors.website?.message}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                        {...register('website')}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LockOutlinedIcon />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important',
                  color: '#fff !important',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                  },
                }}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
