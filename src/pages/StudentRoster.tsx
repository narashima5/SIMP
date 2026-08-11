import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box, Typography, Grid, Card, CardContent, TextField, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, LinearProgress, InputAdornment, FormControl, Select, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { mockCoordinatorDashboard, mockCoordinatorReports } from '@/services/mockData';

type Student = typeof mockCoordinatorDashboard.students[0];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  placed:       { label: 'Placed',     color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  completed:    { label: 'Completed',  color: '#60a5fa',        bg: 'rgba(96,165,250,0.1)' },
  searching:    { label: 'Searching',  color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  not_started:  { label: 'Not Started',color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)' },
};

const StudentRoster: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const students = mockCoordinatorDashboard.students;

  const getApprovedWeeks = (studentId: string) =>
    mockCoordinatorReports.filter((r) => r.student?.name && r.status === 'approved').length;

  const getHoursLogged = (studentId: string) =>
    mockCoordinatorReports
      .filter((r) => r.student?.name && r.status === 'approved')
      .reduce((acc, r) => acc + r.hoursLogged, 0);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.placementStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const placedCount = students.filter((s) => s.placementStatus === 'placed').length;
  const completedCount = students.filter((s) => s.placementStatus === 'completed').length;

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Student Academic Roster
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          View and track all assigned students' placement progress and internship status.
        </Typography>
      </Box>

      {/* Stats row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Assigned', value: students.length, color: 'var(--primary)' },
          { label: 'Currently Placed', value: placedCount, color: 'var(--success)' },
          { label: 'Completed', value: completedCount, color: '#60a5fa' },
          { label: 'Seeking Placement', value: students.length - placedCount - completedCount, color: 'var(--warning)' },
        ].map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Card className="glass-panel" sx={{ p: 2.5, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{stat.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3, background: 'rgba(19,27,46,0.4) !important', border: '1px solid var(--border-color)' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField
              fullWidth size="small"
              placeholder="Search by name or student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'var(--text-muted)' }} /></InputAdornment>,
                  className: 'glass-input',
                },
              }}
              sx={{ '& input': { color: '#fff' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <FormControl fullWidth size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ color: '#fff', border: '1px solid var(--border-color)', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="placed">Placed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="searching">Searching</MenuItem>
                <MenuItem value="not_started">Not Started</MenuItem>
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
              <TableCell>Student</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Placement Status</TableCell>
              <TableCell>Current Internship</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((student) => {
              const cfg = statusConfig[student.placementStatus] ?? statusConfig.not_started;
              const weeks = student.placementStatus === 'placed' ? 5 : student.placementStatus === 'completed' ? 16 : 0;
              const pct = Math.round((weeks / 16) * 100);
              return (
                <TableRow key={student._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <PersonIcon sx={{ fontSize: 18, color: 'var(--primary)' }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{student.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{student.studentId}</TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{student.department}</TableCell>
                  <TableCell>
                    <Chip label={cfg.label} size="small"
                      sx={{ fontWeight: 600, fontSize: '0.68rem', bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {student.currentInternship
                      ? <Box>
                          <Typography variant="caption" sx={{ color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>{student.currentInternship.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{student.currentInternship.organization?.name}</Typography>
                        </Box>
                      : <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not placed yet</Typography>
                    }
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>{weeks}/16 wks</Typography>
                    <LinearProgress
                      variant="determinate" value={pct}
                      sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)',
                        '& .MuiLinearProgress-bar': { background: pct === 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--secondary))' } }}
                    />
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

export default StudentRoster;
