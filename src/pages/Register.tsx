import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Grid, Container, TextField, Button, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'coordinator' | 'organization' | 'admin'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Student specifics
    studentId: '',
    department: '',
    cgpa: '',
    // Coordinator specifics
    employeeId: '',
    designation: '',
    // Organization specifics
    companyName: '',
    industry: '',
    website: '',
  });

  const [registered, setRegistered] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API registration call
    setRegistered(true);
    setTimeout(() => {
      navigate('/login');
    }, 2500);
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
          {registered ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--accent)', mb: 2 }}>
                Registration Successful!
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                Your account for <strong>{formData.name}</strong> as <strong>{role}</strong> has been created. Redirecting to login...
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', mb: 1 }}>
                  Create Account
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  Join the Smart Internship Management Platform
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    slotProps={{ input: { className: 'glass-input' } }}
                    sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    slotProps={{ input: { className: 'glass-input' } }}
                    sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    slotProps={{ input: { className: 'glass-input' } }}
                    sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                  />
                </Grid>
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

                {/* Role Specific Forms */}
                {role === 'student' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Student Roll/ID"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        required
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                      />
                    </Grid>
                  </>
                )}

                {role === 'coordinator' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        required
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                      />
                    </Grid>
                  </>
                )}

                {role === 'organization' && (
                  <>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Industry Type"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Company Website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        slotProps={{ input: { className: 'glass-input' } }}
                        sx={{ '& label': { color: 'var(--text-muted)' }, '& input': { color: '#fff' } }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<LockOutlinedIcon />}
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
                Sign Up
              </Button>
            </form>
          )}
        </Card>
      </Container>
    </Box>
  );
};
export default Register;
