import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SendIcon from '@mui/icons-material/Send';

interface LogSubmission {
  id: string;
  week: number;
  hours: number;
  tasks: string;
  challenges: string;
  submittedAt: string;
  status: 'approved' | 'pending' | 'rejected';
  feedback?: string;
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogSubmission[]>([
    {
      id: 'log_01',
      week: 1,
      hours: 40,
      tasks: 'Setting up the React local development environment and building dashboard mocks.',
      challenges: 'Adapting to MUI styling APIs.',
      submittedAt: '2026-06-05',
      status: 'approved',
      feedback: 'Good start. Excellent layouts.',
    },
    {
      id: 'log_02',
      week: 2,
      hours: 40,
      tasks: 'Integrated AuthContext and state management for role switching.',
      challenges: 'State syncing across tabs.',
      submittedAt: '2026-06-12',
      status: 'pending',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [week, setWeek] = useState(3);
  const [hours, setHours] = useState(40);
  const [tasks, setTasks] = useState('');
  const [challenges, setChallenges] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: LogSubmission = {
      id: `log_${Date.now()}`,
      week,
      hours,
      tasks,
      challenges,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setLogs([newLog, ...logs]);
    setWeek(week + 1);
    setTasks('');
    setChallenges('');
    handleClose();
  };

  const totalHours = logs.reduce((acc, log) => acc + (log.status === 'approved' ? log.hours : 0), 0);
  const weeksCompleted = logs.filter((l) => l.status === 'approved').length;

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
            Welcome back, {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Student ID: {user?.details?.studentId} &bull; {user?.details?.department}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
            color: '#fff',
            py: 1.2,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, var(--primary-hover) 0%, var(--secondary) 100%)',
            },
          }}
        >
          Submit Log Sheet
        </Button>
      </Box>

      {/* Progress metrics */}
      <Card sx={{ mb: 4, background: 'rgba(19, 27, 46, 0.4) !important', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--border-color)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Overall Internship Progress
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
              {Math.min(Math.round((weeksCompleted / 16) * 100), 100)}% ({weeksCompleted} of 16 weeks approved)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min((weeksCompleted / 16) * 100, 100)}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Grid of stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--primary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <WorkIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Active Internship
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  TechCorp Solutions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--secondary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
                <HourglassEmptyIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Total Hours Approved
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {totalHours} / 640 hrs
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--accent) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                <AssignmentTurnedInIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Final Evaluation Status
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--warning)' }}>
                  Awaiting Submission
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logs Table */}
      <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
        Weekly Log Submission History
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Week</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Tasks Performed</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Feedback / Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'var(--text-muted)' }}>
                  No log sheets submitted yet. Click "Submit Log Sheet" to get started.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600, color: 'var(--text-primary) !important' }}>Week {log.week}</TableCell>
                  <TableCell>{log.submittedAt}</TableCell>
                  <TableCell>{log.hours} hrs</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.tasks}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.status.toUpperCase()}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        backgroundColor:
                          log.status === 'approved'
                            ? 'var(--success-glow)'
                            : log.status === 'rejected'
                            ? 'var(--danger-glow)'
                            : 'var(--warning-glow)',
                        color:
                          log.status === 'approved'
                            ? 'var(--success)'
                            : log.status === 'rejected'
                            ? 'var(--danger)'
                            : 'var(--warning)',
                        border: `1px solid ${
                          log.status === 'approved'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : log.status === 'rejected'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)'
                        }`,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: log.feedback ? 'var(--text-secondary)' : 'var(--text-muted)', fontStyle: log.feedback ? 'normal' : 'italic' }}>
                    {log.feedback || 'No feedback yet'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submission Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-lg)',
              width: '100%',
              maxWidth: '500px',
            },
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, borderBottom: '1px solid var(--border-color)', pb: 2 }}>
            Submit Weekly Log Sheet
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Grid container spacing={2.5}>
              <Grid size={6}>
                <TextField
                  label="Week Number"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={week}
                  onChange={(e) => setWeek(parseInt(e.target.value) || 0)}
                  required
                  slotProps={{
                    input: { className: 'glass-input' },
                    inputLabel: { style: { color: 'var(--text-secondary)' } },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Hours Completed"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  required
                  slotProps={{
                    input: { className: 'glass-input' },
                    inputLabel: { style: { color: 'var(--text-secondary)' } },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Key Tasks Accomplished"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder="Describe your major contributions and learnings this week..."
                  required
                  slotProps={{
                    input: { className: 'glass-input' },
                    inputLabel: { style: { color: 'var(--text-secondary)' } },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Challenges Faced & Solutions"
                  multiline
                  rows={2}
                  fullWidth
                  variant="outlined"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="Any technical or organizational bottlenecks, and how you addressed them..."
                  slotProps={{
                    input: { className: 'glass-input' },
                    inputLabel: { style: { color: 'var(--text-secondary)' } },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid var(--border-color)', pt: 2 }}>
            <Button onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'var(--primary)',
                color: '#fff',
                '&:hover': { background: 'var(--primary-hover)' },
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default StudentDashboard;
