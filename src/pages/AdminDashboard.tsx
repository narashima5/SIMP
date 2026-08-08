import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/services/admin';
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
  Tabs,
  Tab,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import StorageIcon from '@mui/icons-material/Storage';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';

interface UserAccount {
  id: string;
  email: string;
  role: 'student' | 'coordinator' | 'organization' | 'admin';
  isActive: boolean;
  name: string;
  createdAt: string;
}

interface InternshipListing {
  _id: string;
  title: string;
  status: 'draft' | 'open' | 'filled' | 'closed';
  openingsCount: number;
  applicantsCount: number;
  location: string;
  organization?: {
    name: string;
  };
}

interface SystemApplication {
  _id: string;
  student: {
    name: string;
  };
  internship: {
    title: string;
    organization?: {
      name: string;
    };
  };
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedDate: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // States
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    totalStudents: 0,
    placedStudents: 0,
    completedStudents: 0,
    totalCoordinators: 0,
    totalOrgs: 0,
    totalInternships: 0,
    totalApplications: 0,
    placementRate: '0%',
  });
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [internships, setInternships] = useState<InternshipListing[]>([]);
  const [applications, setApplications] = useState<SystemApplication[]>([]);

  // Search/Filters
  const [searchEmail, setSearchEmail] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const reportsRes = await adminService.getReports();
      if (reportsRes.success) {
        setReports(reportsRes.data);
      }

      const usersRes = await adminService.getUsers();
      if (usersRes.success) {
        setUsers(usersRes.data || []);
      }

      const internshipsRes = await adminService.getInternships();
      if (internshipsRes.success) {
        setInternships(internshipsRes.data || []);
      }

      const applicationsRes = await adminService.getApplications();
      if (applicationsRes.success) {
        setApplications(applicationsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Toggle activation status
  const handleToggleUserStatus = async (id: string) => {
    try {
      const res = await adminService.deactivateUser(id);
      if (res.success) {
        setUsers(
          users.map((u) =>
            u.id === id ? { ...u, isActive: !u.isActive } : u
          )
        );
      }
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  // Moderate internship
  const handleModerateInternship = async (id: string, newStatus: 'open' | 'closed') => {
    try {
      const res = await adminService.moderateInternship(id, newStatus);
      if (res.success) {
        setInternships(
          internships.map((internship) =>
            internship._id === id ? { ...internship, status: newStatus } : internship
          )
        );
      }
    } catch (err) {
      console.error('Failed to moderate internship', err);
    }
  };

  // Filtered Users list
  const filteredUsers = users.filter((u) => {
    const matchesEmail = u.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesEmail && matchesRole;
  });

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Admin Console
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Welcome back, {user?.name} &bull; Monitoring platform operations and user roles.
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
                  Total Platform Accounts
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {users.length} Users
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
                  Internship Placements
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {reports.placedStudents} Placed ({reports.placementRate})
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
                  Organizations & Listings
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--success)' }}>
                  {reports.totalOrgs} Orgs &bull; {reports.totalInternships} Jobs
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main layout with registry and health sidebar */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              borderBottom: '1px solid var(--border-color)',
              '& .MuiTabs-indicator': { backgroundColor: 'var(--primary)' },
              '& .MuiTab-root': { color: 'var(--text-secondary)', fontWeight: 600 },
              '& .MuiTab-root.Mui-selected': { color: 'var(--primary)' },
            }}
          >
            <Tab label="User Registry" />
            <Tab label="Internships Manager" />
            <Tab label="Applications Log" />
          </Tabs>

          {/* User Registry Panel */}
          {tabValue === 0 && (
            <Box className="anim-fade-in">
              <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                  label="Search by Email"
                  size="small"
                  variant="outlined"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="e.g. user@simp.org"
                  sx={{ flexGrow: 1 }}
                  slotProps={{
                    input: { className: 'glass-input' },
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel style={{ color: 'var(--text-secondary)' }}>Filter Role</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Filter Role"
                    sx={{
                      '& .MuiSelect-select': { color: 'var(--text-primary)' },
                    }}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="coordinator">Coordinator</MenuItem>
                    <MenuItem value="organization">Organization</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Owner</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Platform Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Controls</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((acc) => (
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
                            label={acc.isActive ? 'ACTIVE' : 'SUSPENDED'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              backgroundColor: acc.isActive ? 'var(--success-glow)' : 'var(--danger-glow)',
                              color: acc.isActive ? 'var(--success)' : 'var(--danger)',
                              border: `1px solid ${acc.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            color={acc.isActive ? 'error' : 'success'}
                            onClick={() => handleToggleUserStatus(acc.id)}
                            disabled={acc.email === user?.email} // Protect logged in admin
                            sx={{
                              py: 0.5,
                              px: 1.5,
                              fontSize: '0.75rem',
                              '&:hover': {
                                backgroundColor: acc.isActive ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                              },
                            }}
                          >
                            {acc.isActive ? 'Suspend' : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Internships Manager Panel */}
          {tabValue === 1 && (
            <Box className="anim-fade-in">
              <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Internship Title</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Moderation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {internships.map((job) => (
                      <TableRow key={job._id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{job.title}</TableCell>
                        <TableCell>{job.organization?.name || 'N/A'}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          <Chip
                            label={job.status.toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              backgroundColor: job.status === 'open' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: job.status === 'open' ? 'var(--success)' : 'var(--danger)',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {job.status === 'open' ? (
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleModerateInternship(job._id, 'closed')}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Close
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              color="success"
                              onClick={() => handleModerateInternship(job._id, 'open')}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Applications Log Panel */}
          {tabValue === 2 && (
            <Box className="anim-fade-in">
              <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Internship Title</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Applied Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app._id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{app.student?.name}</TableCell>
                        <TableCell>{app.internship?.title}</TableCell>
                        <TableCell>{app.internship?.organization?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={app.status.toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              backgroundColor:
                                app.status === 'accepted'
                                  ? 'rgba(16, 185, 129, 0.1)'
                                  : app.status === 'rejected'
                                  ? 'rgba(239, 68, 68, 0.1)'
                                  : 'rgba(245, 158, 11, 0.1)',
                              color:
                                app.status === 'accepted'
                                  ? 'var(--success)'
                                  : app.status === 'rejected'
                                  ? 'var(--danger)'
                                  : 'var(--warning)',
                            }}
                          />
                        </TableCell>
                        <TableCell>{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>

        {/* Telemetry Health Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Infrastructure Health
          </Typography>

          <Card sx={{ background: 'var(--bg-secondary) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Database Pools</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>5 / 20 connected</Typography>
                </Box>
                <LinearProgress variant="determinate" value={25} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: 'var(--accent)' } }} />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Memory Usage</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>1.6 GB / 4.0 GB</Typography>
                </Box>
                <LinearProgress variant="determinate" value={40} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: 'var(--primary)' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Network Latency</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>9 ms</Typography>
                </Box>
                <LinearProgress variant="determinate" value={8} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { backgroundColor: 'var(--success)' } }} />
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
