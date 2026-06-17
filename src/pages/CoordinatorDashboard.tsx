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
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ApartmentIcon from '@mui/icons-material/Apartment';

interface PendingLog {
  id: string;
  studentName: string;
  studentId: string;
  week: number;
  hours: number;
  tasks: string;
  challenges: string;
}

interface StudentProgress {
  id: string;
  name: string;
  studentId: string;
  company: string;
  weeksApproved: number;
  status: 'active' | 'completed' | 'on_hold';
}

export const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock pending logs
  const [pendingLogs, setPendingLogs] = useState<PendingLog[]>([
    {
      id: 'log_02',
      studentName: 'Aravind Swamy',
      studentId: '2023CS8042',
      week: 2,
      hours: 40,
      tasks: 'Integrated AuthContext and state management for role switching.',
      challenges: 'State syncing across tabs.',
    },
    {
      id: 'log_03',
      studentName: 'Nisha Kulkarni',
      studentId: '2023CS8054',
      week: 3,
      hours: 35,
      tasks: 'Created Figma mockups for backend administration interfaces.',
      challenges: 'Client feedback required multiple iterations.',
    },
  ]);

  // Mock student roster
  const [students] = useState<StudentProgress[]>([
    { id: '1', name: 'Aravind Swamy', studentId: '2023CS8042', company: 'TechCorp Solutions', weeksApproved: 1, status: 'active' },
    { id: '2', name: 'Nisha Kulkarni', studentId: '2023CS8054', company: 'DevLabs Inc', weeksApproved: 2, status: 'active' },
    { id: '3', name: 'Rahul Sen', studentId: '2023CS8091', company: 'InnovateX', weeksApproved: 16, status: 'completed' },
    { id: '4', name: 'Aditi Rao', studentId: '2023CS8102', company: 'FutureTech', weeksApproved: 0, status: 'on_hold' },
  ]);

  const [selectedLog, setSelectedLog] = useState<PendingLog | null>(null);
  const [feedback, setFeedback] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleAction = (log: PendingLog, type: 'approve' | 'reject') => {
    setSelectedLog(log);
    setActionType(type);
    setFeedback('');
  };

  const handleConfirmAction = () => {
    if (!selectedLog || !actionType) return;
    
    // Simulate removing the log from the pending queue
    setPendingLogs(pendingLogs.filter((log) => log.id !== selectedLog.id));
    
    // Reset selection
    setSelectedLog(null);
    setActionType(null);
  };

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Coordinator Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          {user?.name} &bull; {user?.details?.title} &bull; {user?.details?.department}
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
                  Assigned Students
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  128 Students
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--secondary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
                <PendingActionsIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Pending Weekly Logs
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: pendingLogs.length > 0 ? 'var(--warning)' : 'inherit' }}>
                  {pendingLogs.length} Awaiting
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--accent) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                <ApartmentIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Active Organizations
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  42 Partners
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Two sections layout: Pending log sheets and Student roster */}
      <Grid container spacing={4}>
        {/* Pending Log sheets queue */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            Pending Weekly Logs
            {pendingLogs.length > 0 && <Chip label={`${pendingLogs.length} Action Needed`} size="small" color="warning" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />}
          </Typography>

          {pendingLogs.length === 0 ? (
            <Card sx={{ background: 'rgba(19, 27, 46, 0.2) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
              <CardContent sx={{ py: 6, textCenter: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'var(--success)', mb: 2, opacity: 0.8 }} />
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  All clear! No pending logs to approve.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pendingLogs.map((log) => (
                <Card key={log.id} sx={{ background: 'var(--bg-secondary) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {log.studentName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                          ID: {log.studentId} &bull; Week {log.week} &bull; {log.hours} hours worked
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Approve Log">
                          <IconButton onClick={() => handleAction(log, 'approve')} sx={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)', '&:hover': { background: 'rgba(16, 185, 129, 0.15)' } }}>
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject & Feedback">
                          <IconButton onClick={() => handleAction(log, 'reject')} sx={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', '&:hover': { background: 'rgba(239, 68, 68, 0.15)' } }}>
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box sx={{ background: 'rgba(0,0,0,0.15)', p: 2, borderRadius: 'var(--border-radius-sm)', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5, fontWeight: 600 }}>
                        TASKS PERFORMED
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-primary)', mb: 1.5 }}>
                        {log.tasks}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5, fontWeight: 600 }}>
                        CHALLENGES ENCOUNTERED
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        {log.challenges}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Student Roster list */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Student Progress Roster
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Assigned Company</TableCell>
                  <TableCell>Weeks Approved</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {student.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                        {student.studentId}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.company}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 45 }}>
                          {student.weeksApproved}/16
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(student.weeksApproved / 16) * 100}
                          sx={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: student.weeksApproved === 16 ? 'var(--success)' : 'var(--primary)',
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.status.replace('_', ' ').toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          backgroundColor:
                            student.status === 'completed'
                              ? 'var(--success-glow)'
                              : student.status === 'on_hold'
                              ? 'var(--danger-glow)'
                              : 'var(--primary-glow)',
                          color:
                            student.status === 'completed'
                              ? 'var(--success)'
                              : student.status === 'on_hold'
                              ? 'var(--danger)'
                              : 'var(--primary)',
                          border: `1px solid ${
                            student.status === 'completed'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : student.status === 'on_hold'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(99, 102, 241, 0.2)'
                          }`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Confirmation & Feedback Dialog */}
      <Dialog
        open={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
        slotProps={{
          paper: {
            sx: {
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-lg)',
              width: '100%',
              maxWidth: '450px',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>
          {actionType === 'approve' ? 'Approve Log Sheet' : 'Reject Log Sheet'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
            Reviewing logsheet for <strong>{selectedLog?.studentName}</strong> (Week {selectedLog?.week}).
          </Typography>
          <TextField
            label="Feedback/Notes (Optional)"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={actionType === 'approve' ? 'Optional comments or notes...' : 'Explain what details are missing or need modification...'}
            slotProps={{
              input: { className: 'glass-input' },
              inputLabel: { style: { color: 'var(--text-secondary)' } },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid var(--border-color)' }}>
          <Button onClick={() => setSelectedLog(null)} sx={{ color: 'var(--text-secondary)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            sx={{
              backgroundColor: actionType === 'approve' ? 'var(--success) !important' : 'var(--danger) !important',
              color: '#fff !important',
            }}
          >
            Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default CoordinatorDashboard;
