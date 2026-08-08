import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studentService } from '@/services/student';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Divider,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import StatusBadge from '@/components/StatusBadge';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LogSubmission {
  _id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  hoursLogged: number;
  tasksCompleted: string;
  challengesFaced: string;
  status: 'approved' | 'pending' | 'rejected';
  comments?: string;
}

interface ApplicationData {
  _id: string;
  internship: {
    _id: string;
    title: string;
    organization: {
      name: string;
    };
  };
  status: string;
  appliedDate: string;
}

export const StudentDashboard: React.FC = () => {
  useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<LogSubmission[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Log submission / editing modal state
  const [open, setOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<LogSubmission | null>(null);
  const [week, setWeek] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hours, setHours] = useState(40);
  const [tasks, setTasks] = useState('');
  const [challenges, setChallenges] = useState('');

  // Withdraw application confirmation dialog state
  const [withdrawId, setWithdrawId] = useState<string | null>(null);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Document upload state
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, reportsRes, appsRes, docsRes] = await Promise.all([
        studentService.getProfile(),
        studentService.getReports(),
        studentService.getApplications(),
        studentService.getDocuments(),
      ]);

      setProfile(profileRes.data);
      setLogs(reportsRes.data);
      setApplications(appsRes.data);
      setDocuments(docsRes.data);
      
      // Auto-suggest next week number
      if (reportsRes.data && reportsRes.data.length > 0) {
        const maxWeek = Math.max(...reportsRes.data.map((l: any) => l.weekNumber));
        setWeek(maxWeek + 1);
      } else {
        setWeek(1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpen = () => {
    setEditingLog(null);
    setTasks('');
    setChallenges('');
    setStartDate('');
    setEndDate('');
    setHours(40);
    setOpen(true);
  };

  const handleOpenEdit = (log: LogSubmission) => {
    setEditingLog(log);
    setWeek(log.weekNumber);
    setStartDate(log.startDate ? new Date(log.startDate).toISOString().split('T')[0] : '');
    setEndDate(log.endDate ? new Date(log.endDate).toISOString().split('T')[0] : '');
    setHours(log.hoursLogged);
    setTasks(log.tasksCompleted);
    setChallenges(log.challengesFaced);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingLog(null);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLog) {
        await studentService.updateLogsheet(editingLog._id, {
          startDate,
          endDate,
          tasksCompleted: tasks,
          challengesFaced: challenges,
          hoursLogged: hours,
        });
      } else {
        await studentService.submitLogsheet({
          weekNumber: week,
          startDate,
          endDate,
          tasksCompleted: tasks,
          challengesFaced: challenges,
          hoursLogged: hours,
        });
      }
      handleClose();
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit log sheet');
    }
  };

  const handleWithdrawClick = (id: string) => {
    setWithdrawId(id);
    setWithdrawOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    if (!withdrawId) return;
    try {
      await studentService.withdrawApplication(withdrawId);
      setWithdrawOpen(false);
      setWithdrawId(null);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to withdraw application');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      setUploading(category);
      await studentService.uploadDocument(formData);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const approvedLogs = logs.filter((l) => l.status === 'approved');
  const totalHours = approvedLogs.reduce((acc, log) => acc + log.hoursLogged, 0);
  const weeksCompleted = approvedLogs.length;

  const getDocStatus = (category: string) => {
    const doc = documents.find((d) => d.category === category);
    return doc ? { uploaded: true, url: doc.url, originalName: doc.originalName } : { uploaded: false };
  };

  const resumeStatus = getDocStatus('resume');
  const offerLetterStatus = getDocStatus('offer_letter');
  const completionStatus = getDocStatus('completion_certificate');

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
            Welcome back, {profile?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Student ID: {profile?.studentId} &bull; {profile?.department}
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {profile?.assignedCoordinator && (
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mt: 0.5 }}>
              Faculty Coordinator: {profile.assignedCoordinator.name} ({profile.assignedCoordinator.department})
            </Typography>
          )}
        </Box>
        {profile?.placementStatus === 'placed' && (
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
        )}
      </Box>

      {/* Progress metrics */}
      {(profile?.placementStatus === 'placed' || profile?.placementStatus === 'completed') && (
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
      )}

      {/* Grid of stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--primary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex' }}>
                <WorkIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Active Internship
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {profile?.currentInternship?.title || 'No Active Internship'}
                </Typography>
                {profile?.currentInternship?.organization && (
                  <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                    {profile.currentInternship.organization.name}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--secondary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex' }}>
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
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex' }}>
                <AssignmentTurnedInIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Final Evaluation Status
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: profile?.placementStatus === 'completed' ? 'var(--success)' : 'var(--warning)' }}>
                  {profile?.placementStatus === 'completed' ? 'Completed & Evaluated' : 'Awaiting Final Review'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Grid Content */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Document uploads */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Documents & Submissions
          </Typography>
          <Card className="glass-panel" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {/* Resume */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFileIcon sx={{ fontSize: 18, color: 'var(--primary)' }} /> Resume / CV
                </Typography>
                {resumeStatus.uploaded ? (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: 'var(--border-radius-sm)' }}>
                    <Typography variant="caption" sx={{ color: 'var(--success)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                      ✓ {resumeStatus.originalName}
                    </Typography>
                    <Button component="a" href={resumeStatus.url} target="_blank" size="small" variant="text" sx={{ color: 'var(--primary)', fontWeight: 600 }}>
                      View
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading === 'resume'}
                    sx={{ borderStyle: 'dashed', py: 1.5 }}
                  >
                    {uploading === 'resume' ? 'Uploading...' : 'Upload Resume'}
                    <input type="file" hidden accept=".pdf,.docx,.jpg,.png" onChange={(e) => handleFileUpload(e, 'resume')} />
                  </Button>
                )}
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

              {/* Offer Letter */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFileIcon sx={{ fontSize: 18, color: 'var(--secondary)' }} /> Offer Letter
                </Typography>
                {offerLetterStatus.uploaded ? (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: 'var(--border-radius-sm)' }}>
                    <Typography variant="caption" sx={{ color: 'var(--success)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                      ✓ {offerLetterStatus.originalName}
                    </Typography>
                    <Button component="a" href={offerLetterStatus.url} target="_blank" size="small" variant="text" sx={{ color: 'var(--primary)', fontWeight: 600 }}>
                      View
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading === 'offer_letter'}
                    sx={{ borderStyle: 'dashed', py: 1.5 }}
                  >
                    {uploading === 'offer_letter' ? 'Uploading...' : 'Upload Offer Letter'}
                    <input type="file" hidden accept=".pdf,.docx,.jpg,.png" onChange={(e) => handleFileUpload(e, 'offer_letter')} />
                  </Button>
                )}
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

              {/* Completion Certificate */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFileIcon sx={{ fontSize: 18, color: 'var(--accent)' }} /> Completion Certificate
                </Typography>
                {completionStatus.uploaded ? (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: 'var(--border-radius-sm)' }}>
                    <Typography variant="caption" sx={{ color: 'var(--success)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                      ✓ {completionStatus.originalName}
                    </Typography>
                    <Button component="a" href={completionStatus.url} target="_blank" size="small" variant="text" sx={{ color: 'var(--primary)', fontWeight: 600 }}>
                      View
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading === 'completion_certificate'}
                    sx={{ borderStyle: 'dashed', py: 1.5 }}
                  >
                    {uploading === 'completion_certificate' ? 'Uploading...' : 'Upload Certificate'}
                    <input type="file" hidden accept=".pdf,.docx,.jpg,.png" onChange={(e) => handleFileUpload(e, 'completion_certificate')} />
                  </Button>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Applications Status */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Active Internship Applications
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'var(--text-muted)' }}>
                      No active applications. Browse internships to apply.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app._id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.01)' } }}>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.internship?.title}</TableCell>
                      <TableCell>{app.internship?.organization?.name || 'Recruiting Partner'}</TableCell>
                      <TableCell>{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell align="right">
                        {app.status === 'pending' || app.status === 'shortlisted' ? (
                          <Button size="small" color="error" onClick={() => handleWithdrawClick(app._id)} sx={{ fontWeight: 600 }}>
                            Withdraw
                          </Button>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                            Finalized
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Logs Table */}
      {profile?.placementStatus === 'placed' || profile?.placementStatus === 'completed' ? (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Weekly Log Submission History
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Week</TableCell>
                  <TableCell>Timeline</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Tasks Performed</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Feedback / Comments</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'var(--text-muted)' }}>
                      No log sheets submitted yet. Click "Submit Log Sheet" to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log._id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--text-primary) !important' }}>Week {log.weekNumber}</TableCell>
                      <TableCell>
                        {log.startDate ? new Date(log.startDate).toLocaleDateString() : ''} - {log.endDate ? new Date(log.endDate).toLocaleDateString() : ''}
                      </TableCell>
                      <TableCell>{log.hoursLogged} hrs</TableCell>
                      <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.tasksCompleted}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={log.status} />
                      </TableCell>
                      <TableCell sx={{ color: log.comments ? 'var(--text-secondary)' : 'var(--text-muted)', fontStyle: log.comments ? 'normal' : 'italic' }}>
                        {log.comments || 'No feedback yet'}
                      </TableCell>
                      <TableCell align="right">
                        {log.status === 'pending' || log.status === 'rejected' ? (
                          <Button size="small" onClick={() => handleOpenEdit(log)} sx={{ fontWeight: 600 }}>
                            Edit
                          </Button>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                            Approved
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : null}

      {/* Submission / Edit Modal */}
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
              maxWidth: '550px',
            },
          },
        }}
      >
        <form onSubmit={handleLogSubmit}>
          <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, borderBottom: '1px solid var(--border-color)', pb: 2 }}>
            {editingLog ? `Edit Log Sheet - Week ${week}` : 'Submit Weekly Log Sheet'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Week Number"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={week}
                  disabled={!!editingLog}
                  onChange={(e) => setWeek(parseInt(e.target.value) || 0)}
                  required
                  slotProps={{
                    input: { className: 'glass-input' },
                    inputLabel: { style: { color: 'var(--text-secondary)' } },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
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
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  slotProps={{
                    input: { className: 'glass-input' },
                    inputLabel: { shrink: true, style: { color: 'var(--text-secondary)' } },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  slotProps={{
                    input: { className: 'glass-input' },
                    inputLabel: { shrink: true, style: { color: 'var(--text-secondary)' } },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12 }}>
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

      {/* Confirmation withdrawal Dialog */}
      <ConfirmationDialog
        open={withdrawOpen}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        onConfirm={handleWithdrawConfirm}
        onCancel={() => setWithdrawOpen(false)}
      />
    </Box>
  );
};

export default StudentDashboard;
