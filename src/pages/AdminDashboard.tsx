import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StorageIcon from '@mui/icons-material/Storage';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'coordinator' | 'organization' | 'admin';
  status: 'active' | 'suspended';
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<UserAccount[]>([
    { id: '1', name: 'Aravind Swamy', email: 'aravind.s@student.edu', role: 'student', status: 'active' },
    { id: '2', name: 'Dr. Priya Ramaswamy', email: 'priya.r@university.edu', role: 'coordinator', status: 'active' },
    { id: '3', name: 'TechCorp Solutions', email: 'hiring@techcorp.com', role: 'organization', status: 'active' },
    { id: '4', name: 'Global Administrator', email: 'admin@simp.org', role: 'admin', status: 'active' },
    { id: '5', name: 'Dev Labs Inc', email: 'disabled@devlabs.com', role: 'organization', status: 'suspended' },
  ]);

  const toggleStatus = (id: string) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === id
          ? { ...acc, status: acc.status === 'active' ? 'suspended' : 'active' }
          : acc
      )
    );
  };

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Admin Console
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          {user?.name} &bull; {user?.details?.title}
        </Typography>
      </Box>

      {/* Grid of stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--primary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <PeopleIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Total Platform Users
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  1,420 Registered
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--secondary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
                <StorageIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  API Server Load
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  18% (Normal)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--accent) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                <VerifiedUserIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  System Health
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--success)' }}>
                  100% Operational
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Two sections layout: System Telemetry and User Management */}
      <Grid container spacing={4}>
        {/* User Management */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Platform Account Registry
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Platform Role</TableCell>
                  <TableCell>Account Status</TableCell>
                  <TableCell align="right">Controls</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-primary) !important' }}>{acc.name}</TableCell>
                    <TableCell>{acc.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={acc.role.toUpperCase()}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          backgroundColor:
                            acc.role === 'admin'
                              ? 'rgba(245, 158, 11, 0.1)'
                              : acc.role === 'coordinator'
                              ? 'rgba(168, 85, 247, 0.1)'
                              : acc.role === 'organization'
                              ? 'rgba(20, 184, 166, 0.1)'
                              : 'rgba(99, 102, 241, 0.1)',
                          color:
                            acc.role === 'admin'
                              ? 'var(--warning)'
                              : acc.role === 'coordinator'
                              ? 'var(--secondary)'
                              : acc.role === 'organization'
                              ? 'var(--accent)'
                              : 'var(--primary)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={acc.status.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          backgroundColor: acc.status === 'active' ? 'var(--success-glow)' : 'var(--danger-glow)',
                          color: acc.status === 'active' ? 'var(--success)' : 'var(--danger)',
                          border: `1px solid ${acc.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        color={acc.status === 'active' ? 'error' : 'success'}
                        onClick={() => toggleStatus(acc.id)}
                        disabled={acc.role === 'admin'} // Protect primary admin account
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          fontSize: '0.75rem',
                          borderColor: acc.role === 'admin' ? 'transparent !important' : 'inherit',
                          '&:hover': {
                            backgroundColor: acc.status === 'active' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                          },
                        }}
                      >
                        {acc.role === 'admin' ? 'System Owner' : acc.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Telemetry and System settings */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Infrastructure Health
          </Typography>

          <Card sx={{ background: 'var(--bg-secondary) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Database Pools</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>4 / 20 connected</Typography>
                </Box>
                <LinearProgress variant="determinate" value={20} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: 'var(--accent)' } }} />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Memory Usage</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>1.4 GB / 4.0 GB</Typography>
                </Box>
                <LinearProgress variant="determinate" value={35} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: 'var(--primary)' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Network Latency</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>12 ms</Typography>
                </Box>
                <LinearProgress variant="determinate" value={10} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: 'var(--success)' } }} />
              </Box>
            </CardContent>
          </Card>

          {/* Quick System Action buttons */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Platform Operations
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ElectricalServicesIcon />}
              sx={{
                py: 1.2,
                color: 'var(--text-primary) !important',
                borderColor: 'var(--border-color) !important',
                '&:hover': {
                  borderColor: 'var(--primary) !important',
                  background: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              Clear Session Caches
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                py: 1.2,
                color: 'var(--text-primary) !important',
                borderColor: 'var(--border-color) !important',
                '&:hover': {
                  borderColor: 'var(--secondary) !important',
                  background: 'rgba(168, 85, 247, 0.05)',
                },
              }}
            >
              Export System Logs (.csv)
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default AdminDashboard;
