import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box, Typography, Grid, Card, Chip, Button, TextField, InputAdornment,
  FormControl, Select, MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import { mockAdminUsers } from '@/services/mockData';

type User = typeof mockAdminUsers[0];

const roleConfig: Record<string, { color: string; bg: string }> = {
  student:      { color: 'var(--primary)',   bg: 'rgba(99,102,241,0.1)' },
  coordinator:  { color: 'var(--secondary)', bg: 'rgba(168,85,247,0.1)' },
  organization: { color: 'var(--accent)',    bg: 'rgba(20,184,166,0.1)' },
  admin:        { color: 'var(--warning)',   bg: 'rgba(245,158,11,0.1)' },
};

const UserRegistry: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(mockAdminUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  const roleCounts = mockAdminUsers.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          User Accounts Registry
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Manage all platform accounts — view roles, activation status, and suspend users.
        </Typography>
      </Box>

      {/* Role breakdown */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { role: 'student', label: 'Students' },
          { role: 'coordinator', label: 'Coordinators' },
          { role: 'organization', label: 'Organizations' },
          { role: 'admin', label: 'Admins' },
        ].map(({ role, label }) => {
          const cfg = roleConfig[role];
          return (
            <Grid size={{ xs: 6, sm: 3 }} key={role}>
              <Card className="glass-panel" sx={{ p: 2.5, textAlign: 'center', cursor: 'pointer', borderLeft: `3px solid ${cfg.color} !important`,
                transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
                onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, color: cfg.color }}>{roleCounts[role] ?? 0}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{label}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3, background: 'rgba(19,27,46,0.4) !important', border: '1px solid var(--border-color)' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField fullWidth size="small" placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'var(--text-muted)' }} /></InputAdornment>, className: 'glass-input' } }}
              sx={{ '& input': { color: '#fff' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <FormControl fullWidth size="small">
              <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
                sx={{ color: '#fff', border: '1px solid var(--border-color)', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="coordinator">Coordinator</MenuItem>
                <MenuItem value="organization">Organization</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Member Since</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((u) => {
              const cfg = roleConfig[u.role];
              const isSelf = u.email === currentUser?.email;
              return (
                <TableRow key={u._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700, bgcolor: cfg.bg, color: cfg.color }}>
                        {u.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{u.email}</TableCell>
                  <TableCell>
                    <Chip label={u.role.toUpperCase()} size="small"
                      sx={{ fontSize: '0.63rem', fontWeight: 700, bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{u.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? 'ACTIVE' : 'SUSPENDED'} size="small"
                      sx={{
                        fontSize: '0.63rem', fontWeight: 700,
                        bgcolor: u.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: u.isActive ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${u.isActive ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined" size="small"
                      disabled={isSelf}
                      color={u.isActive ? 'error' : 'success'}
                      onClick={() => toggleStatus(u._id)}
                      startIcon={u.isActive ? <PersonOffIcon sx={{ fontSize: 14 }} /> : <PersonIcon sx={{ fontSize: 14 }} />}
                      sx={{ fontSize: '0.72rem', py: 0.4, px: 1.2 }}
                    >
                      {isSelf ? 'You' : u.isActive ? 'Suspend' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserRegistry;
