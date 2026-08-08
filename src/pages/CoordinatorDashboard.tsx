import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { coordinatorService } from '@/services/coordinator';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StudentCard from '@/components/StudentCard';
import type { StudentData } from '@/components/StudentCard';
import ApplicationTable from '@/components/ApplicationTable';
import type { ApplicationData } from '@/components/ApplicationTable';
import LoadingSpinner from '@/components/LoadingSpinner';

interface WeeklyReportData {
  _id: string;
  student: {
    _id: string;
    name: string;
    studentId: string;
  };
  weekNumber: number;
  startDate: string;
  endDate: string;
  tasksCompleted: string;
  challengesFaced: string;
  hoursLogged: number;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // API Data states
  const [students, setStudents] = useState<StudentData[]>([]);
  const [reports, setReports] = useState<WeeklyReportData[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog actions
  const [selectedReport, setSelectedReport] = useState<WeeklyReportData | null>(null);
  const [reportAction, setReportAction] = useState<'approved' | 'rejected' | null>(null);
  const [reportFeedback, setReportFeedback] = useState('');

  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);
  const [appFeedback, setAppFeedback] = useState('');

  const [evaluationStudentId, setEvaluationStudentId] = useState<string | null>(null);
  const [evaluationComments, setEvaluationComments] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, appsRes, reportsRes] = await Promise.all([
        coordinatorService.getDashboard(),
        coordinatorService.getApplications(),
        coordinatorService.getReports(),
      ]);

      setStudents(dashRes.data.students || []);
      setApplications(appsRes.data || []);
      setReports(reportsRes.data.reports || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve coordinator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Weekly Report Handlers
  const handleOpenReportReview = (report: WeeklyReportData, action: 'approved' | 'rejected') => {
    setSelectedReport(report);
    setReportAction(action);
    setReportFeedback('');
  };

  const handleConfirmReportReview = async () => {
    if (!selectedReport || !reportAction) return;
    try {
      await coordinatorService.evaluateReport({
        reportId: selectedReport._id,
        status: reportAction,
        comments: reportFeedback,
      });
      setSelectedReport(null);
      setReportAction(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to review weekly report');
    }
  };

  // Application Handlers
  const handleApproveApp = async (id: string) => {
    try {
      await coordinatorService.approveApplication(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve application');
    }
  };

  const handleOpenRejectApp = (id: string) => {
    const app = applications.find((a) => a._id === id);
    if (app) {
      setSelectedApp(app);
      setAppFeedback('');
    }
  };

  const handleConfirmRejectApp = async () => {
    if (!selectedApp) return;
    try {
      await coordinatorService.rejectApplication(selectedApp._id, appFeedback);
      setSelectedApp(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reject application');
    }
  };

  // Final Student Evaluation Handlers
  const handleOpenEvaluation = (studentId: string) => {
    setEvaluationStudentId(studentId);
    setEvaluationComments('');
  };

  const handleConfirmEvaluation = async () => {
    if (!evaluationStudentId) return;
    try {
      await coordinatorService.submitFinalEvaluation(evaluationStudentId, evaluationComments);
      setEvaluationStudentId(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit final evaluation');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Count helper functions
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const pendingApps = applications.filter((a) => a.status === 'pending');

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Coordinator Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Welcome back, Coordinator &bull; {user?.email}
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Grid of stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--primary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex' }}>
                <PeopleIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Assigned Students
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {students.length} Students
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--secondary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex' }}>
                <PendingActionsIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Pending Weekly Logs
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: pendingReports.length > 0 ? 'var(--warning)' : 'inherit' }}>
                  {pendingReports.length} Awaiting
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--accent) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex' }}>
                <AssignmentIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Pending Applications
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: pendingApps.length > 0 ? 'var(--warning)' : 'inherit' }}>
                  {pendingApps.length} Pending
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'var(--border-color)', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} textColor="inherit" indicatorColor="primary">
          <Tab label={`Students Roster (${students.length})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Weekly Logs (${pendingReports.length})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Applications (${pendingApps.length})`} sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {students.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 4, textAlignment: 'center', color: 'var(--text-muted)' }}>
                No students currently assigned to you.
              </Paper>
            </Grid>
          ) : (
            students.map((student) => {
              // Calculate approved weeks
              const approvedCount = reports.filter((r) => r.student?._id === student._id && r.status === 'approved').length;
              const totalHours = reports.filter((r) => r.student?._id === student._id && r.status === 'approved').reduce((acc, curr) => acc + curr.hoursLogged, 0);

              return (
                <Grid size={{ xs: 12, sm: 6 }} key={student._id}>
                  <StudentCard
                    student={student}
                    approvedWeeksCount={approvedCount}
                    totalHoursApproved={totalHours}
                    onEvaluate={handleOpenEvaluation}
                  />
                </Grid>
              );
            })
          )}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {pendingReports.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'var(--success)', mb: 2, opacity: 0.8 }} />
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Excellent! No weekly logs awaiting your approval.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            pendingReports.map((report) => (
              <Grid size={{ xs: 12 }} key={report._id}>
                <Card sx={{ background: 'var(--bg-secondary) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {report.student?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                          Week {report.weekNumber} &bull; {report.hoursLogged} hours logged &bull; Timeline: {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Approve Log">
                          <IconButton onClick={() => handleOpenReportReview(report, 'approved')} sx={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)', '&:hover': { background: 'rgba(16, 185, 129, 0.15)' } }}>
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Log">
                          <IconButton onClick={() => handleOpenReportReview(report, 'rejected')} sx={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', '&:hover': { background: 'rgba(239, 68, 68, 0.15)' } }}>
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ background: 'rgba(0,0,0,0.15)', p: 2, borderRadius: 'var(--border-radius-sm)' }}>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5, fontWeight: 600 }}>
                        TASKS COMPLETED
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-primary)', mb: 1.5 }}>
                        {report.tasksCompleted}
                      </Typography>
                      {report.challengesFaced && (
                        <>
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5, fontWeight: 600 }}>
                            CHALLENGES FACED
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                            {report.challengesFaced}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {tabValue === 2 && (
        <Box>
          <ApplicationTable
            applications={applications}
            onApprove={handleApproveApp}
            onReject={handleOpenRejectApp}
            isCoordinator={true}
          />
        </Box>
      )}

      {/* Weekly Report Review Dialog */}
      <Dialog
        open={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
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
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          {reportAction === 'approved' ? 'Approve Log Sheet' : 'Reject Log Sheet'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
            Adding feedback for <strong>{selectedReport?.student?.name}</strong> (Week {selectedReport?.weekNumber}).
          </Typography>
          <TextField
            label="Feedback Notes"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={reportFeedback}
            onChange={(e) => setReportFeedback(e.target.value)}
            placeholder={reportAction === 'approved' ? 'Well done, keep it up...' : 'Please specify what corrections or explanations are needed...'}
            slotProps={{
              input: { className: 'glass-input' },
              inputLabel: { style: { color: 'var(--text-secondary)' } },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button onClick={() => setSelectedReport(null)} sx={{ color: 'var(--text-secondary)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReportReview}
            variant="contained"
            color={reportAction === 'approved' ? 'success' : 'error'}
            sx={{
              backgroundColor: reportAction === 'approved' ? 'var(--success) !important' : 'var(--danger) !important',
              color: '#fff !important',
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Application Rejection Dialog */}
      <Dialog
        open={selectedApp !== null}
        onClose={() => setSelectedApp(null)}
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
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          Reject Internship Application
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
            Reject application for student <strong>{selectedApp?.student?.name}</strong> applying to <strong>{selectedApp?.internship?.title}</strong>.
          </Typography>
          <TextField
            label="Rejection Reason / Feedback"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={appFeedback}
            onChange={(e) => setAppFeedback(e.target.value)}
            required
            placeholder="Explain why this application is not suitable..."
            slotProps={{
              input: { className: 'glass-input' },
              inputLabel: { style: { color: 'var(--text-secondary)' } },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button onClick={() => setSelectedApp(null)} sx={{ color: 'var(--text-secondary)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRejectApp}
            variant="contained"
            color="error"
            disabled={!appFeedback.trim()}
            sx={{
              backgroundColor: 'var(--danger) !important',
              color: '#fff !important',
            }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Evaluation Dialog */}
      <Dialog
        open={evaluationStudentId !== null}
        onClose={() => setEvaluationStudentId(null)}
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
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          Submit Student Final Evaluation
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
            Evaluate overall student performance and compile the final grade. Submitting this final evaluation will mark the student's internship as <strong>Completed</strong>.
          </Typography>
          <TextField
            label="Evaluation Comments & Grades"
            multiline
            rows={5}
            fullWidth
            variant="outlined"
            value={evaluationComments}
            onChange={(e) => setEvaluationComments(e.target.value)}
            required
            placeholder="Type comprehensive remarks covering attendance, technical output, teamwork, etc..."
            slotProps={{
              input: { className: 'glass-input' },
              inputLabel: { style: { color: 'var(--text-secondary)' } },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button onClick={() => setEvaluationStudentId(null)} sx={{ color: 'var(--text-secondary)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEvaluation}
            variant="contained"
            disabled={!evaluationComments.trim()}
            sx={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important',
              color: '#fff !important',
            }}
          >
            Submit Final Evaluation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoordinatorDashboard;
