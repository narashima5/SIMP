import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Mock Progress Reports
const initialReports = [
  {
    id: 'rep_mock_404',
    studentName: 'Aravind Swamy',
    weekNumber: 1,
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    tasksCompleted: 'Completed scaffolding the REST API using TypeScript. Defined MongoDB collection schemas for User, Student, and Organizations.',
    challengesFaced: 'Had initial typescript transpilation issues with NodeNext modules.',
    hoursLogged: 40,
    status: 'approved' as 'pending' | 'approved' | 'rejected',
    comments: 'Superb initial project setup. Excellent database schema design and file structuring.',
  },
  {
    id: 'rep_mock_405',
    studentName: 'Aravind Swamy',
    weekNumber: 2,
    startDate: '2026-06-22',
    endDate: '2026-06-26',
    tasksCompleted: 'Implementing routing controllers and bootstrapping express middlewares. Design protected route controls.',
    challengesFaced: 'Configuring auth context inside nested React routes.',
    hoursLogged: 36,
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    comments: '',
  },
];

export const ProgressReport: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState(initialReports);

  // Student: Add Report Form State
  const [open, setOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    weekNumber: '',
    startDate: '',
    endDate: '',
    tasksCompleted: '',
    challengesFaced: '',
    hoursLogged: '',
  });

  // Coordinator: Review Form State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof initialReports[0] | null>(null);
  const [evalComment, setEvalComment] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addedReport = {
      id: `rep_mock_${Date.now()}`,
      studentName: user?.name || 'Aravind Swamy',
      weekNumber: parseInt(newReport.weekNumber) || 1,
      startDate: newReport.startDate || new Date().toISOString().split('T')[0],
      endDate: newReport.endDate || new Date().toISOString().split('T')[0],
      tasksCompleted: newReport.tasksCompleted,
      challengesFaced: newReport.challengesFaced,
      hoursLogged: parseInt(newReport.hoursLogged) || 0,
      status: 'pending' as const,
      comments: '',
    };

    setReports([addedReport, ...reports]);
    setNewReport({ weekNumber: '', startDate: '', endDate: '', tasksCompleted: '', challengesFaced: '', hoursLogged: '' });
    handleClose();
  };

  // Coordinator: Evaluation
  const handleReviewOpen = (report: typeof initialReports[0]) => {
    setSelectedReport(report);
    setEvalComment(report.comments || '');
    setReviewOpen(true);
  };

  const handleReviewClose = () => {
    setSelectedReport(null);
    setReviewOpen(false);
  };

  const handleEvaluate = (status: 'approved' | 'rejected') => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, status, comments: evalComment } : r
      )
    );
    handleReviewClose();
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return <Chip label="APPROVED" size="small" sx={{ bgcolor: 'var(--success-glow)', color: 'var(--success)', border: '1px solid var(--success)', fontWeight: 600 }} />;
      case 'rejected':
        return <Chip label="REJECTED" size="small" sx={{ bgcolor: 'var(--danger-glow)', color: 'var(--danger)', border: '1px solid var(--danger)', fontWeight: 600 }} />;
      default:
        return <Chip label="PENDING REVIEW" size="small" sx={{ bgcolor: 'var(--warning-glow)', color: 'var(--warning)', border: '1px solid var(--warning)', fontWeight: 600 }} />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - var(--header-height))', color: 'var(--text-primary)' }}>
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', mb: 1 }}>
            Weekly Progress Reports
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {user?.role === 'coordinator'
              ? 'Evaluate, grade, and feedback on assigned student weekly log sheets.'
              : 'Submit weekly reports details including tasks completed, hours worked, and roadblocks.'}
          </Typography>
        </Box>

        {user?.role === 'student' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important',
              color: '#fff !important',
              fontWeight: 600,
            }}
          >
            Submit Report
          </Button>
        )}
      </Box>

      {/* Reports Table */}
      <TableContainer component={Paper} sx={{ background: 'rgba(19,27,46,0.5) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
        <Table>
          <TableHead>
            <TableRow>
              {user?.role === 'coordinator' && <TableCell>Student</TableCell>}
              <TableCell>Week</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Hours Logged</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.01)' } }}>
                {user?.role === 'coordinator' && <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{report.studentName}</TableCell>}
                <TableCell sx={{ color: '#fff' }}>Week {report.weekNumber}</TableCell>
                <TableCell>{report.startDate} to {report.endDate}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'var(--primary)' }}>{report.hoursLogged} Hours</TableCell>
                <TableCell>{getStatusChip(report.status)}</TableCell>
                <TableCell align="right">
                  {user?.role === 'coordinator' ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleReviewOpen(report)}
                      sx={{ color: 'var(--primary) !important', borderColor: 'var(--primary) !important' }}
                    >
                      {report.status === 'pending' ? 'Review & Evaluate' : 'Edit Evaluation'}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedReport(report);
                        setReviewOpen(true);
                      }}
                      sx={{ color: 'var(--text-secondary) !important', borderColor: 'var(--border-color) !important' }}
                    >
                      View Report
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Submitting Report (Student Only) */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddReportSubmit}>
          <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Submit Weekly Report</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Week Number"
                  name="weekNumber"
                  type="number"
                  value={newReport.weekNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={newReport.startDate}
                  onChange={handleInputChange}
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={newReport.endDate}
                  onChange={handleInputChange}
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Hours Logged"
                  name="hoursLogged"
                  type="number"
                  value={newReport.hoursLogged}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Tasks Accomplished"
                  name="tasksCompleted"
                  value={newReport.tasksCompleted}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Key Challenges & Roadblocks"
                  name="challengesFaced"
                  value={newReport.challengesFaced}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ background: 'var(--primary) !important', color: '#fff !important' }}>
              Submit Logsheet
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for Reviewing Report (Coordinator / Student View Mode) */}
      <Dialog open={reviewOpen} onClose={handleReviewClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          {user?.role === 'coordinator' ? 'Evaluate Progress Report' : 'Progress Report Details'}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                Week {selectedReport.weekNumber} Report ({selectedReport.startDate} to {selectedReport.endDate})
              </Typography>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Tasks Completed</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
                  {selectedReport.tasksCompleted}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Challenges Faced</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
                  {selectedReport.challengesFaced || 'None reported.'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Hours Logged</Typography>
                <Typography variant="body2" sx={{ color: 'var(--primary)', fontWeight: 700, mt: 0.5 }}>
                  {selectedReport.hoursLogged} Hours
                </Typography>
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

              {user?.role === 'coordinator' ? (
                <>
                  <Typography variant="subtitle2" sx={{ color: '#fff' }}>Coordinator Review</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Evaluation Remarks / Comments"
                    value={evalComment}
                    onChange={(e) => setEvalComment(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </>
              ) : (
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Coordinator Comments</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5, fontStyle: 'italic' }}>
                    {selectedReport.comments || 'No evaluation remarks submitted yet.'}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleReviewClose} sx={{ color: 'var(--text-secondary)' }}>
            Close
          </Button>
          {user?.role === 'coordinator' && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => handleEvaluate('rejected')}
                sx={{ color: 'var(--danger) !important', borderColor: 'var(--danger) !important' }}
              >
                Reject Logsheet
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={() => handleEvaluate('approved')}
                sx={{ background: 'var(--success) !important', color: '#fff !important' }}
              >
                Approve Logsheet
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ProgressReport;
