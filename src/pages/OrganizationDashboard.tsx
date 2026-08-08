import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { organizationService } from '@/services/organization';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
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
  TextField,
  Rating,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
  IconButton,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface Intern {
  _id: string;
  name: string;
  phone?: string;
  cgpa?: number;
  skills?: string[];
  currentInternship?: {
    _id: string;
    title: string;
  };
  createdAt?: string;
}

interface JobPosting {
  _id: string;
  title: string;
  openingsCount: number;
  applicantsCount: number;
  status: 'draft' | 'open' | 'filled' | 'closed';
  location: string;
}

interface Applicant {
  _id: string;
  student: {
    _id: string;
    name: string;
    cgpa?: number;
    skills?: string[];
    resumeUrl?: string;
    user?: {
      email: string;
    };
  };
  internship: {
    _id: string;
    title: string;
  };
  coverLetter?: string;
  appliedDate: string;
}

export const OrganizationDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPostings: 0,
    totalApplicants: 0,
    selectedStudents: 0,
    pendingApplications: 0,
    activeInternsCount: 0,
  });
  const [interns, setInterns] = useState<Intern[]>([]);
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Feedback states
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [rating, setRating] = useState<number | null>(4);
  const [comments, setComments] = useState('');
  const [markCompleted, setMarkCompleted] = useState(false);

  // Post internship states
  const [openPostModal, setOpenPostModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    durationWeeks: 8,
    location: 'Remote',
    stipend: 0,
    internshipType: 'Full-time',
    openingsCount: 1,
    applicationDeadline: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const statsRes = await organizationService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.data);
        setInterns(statsRes.data.activeInterns || []);
      }

      const postingsRes = await organizationService.getMyInternships();
      if (postingsRes.success) {
        setPostings(postingsRes.data || []);
      }

      const applicantsRes = await organizationService.getApplicants();
      if (applicantsRes.success) {
        setApplicants(applicantsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
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

  // Evaluate candidate actions
  const handleSelectCandidate = async (id: string, selectStatus: 'accepted' | 'rejected') => {
    try {
      const res = await organizationService.selectCandidate(id, selectStatus);
      if (res.success) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to select applicant', err);
    }
  };

  // Submit Feedback Appraisal
  const handleOpenEvaluation = (intern: Intern) => {
    setSelectedIntern(intern);
    setRating(4);
    setComments('');
    setMarkCompleted(false);
  };

  const handleCloseEvaluation = () => {
    setSelectedIntern(null);
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedIntern || !selectedIntern.currentInternship) return;
    try {
      const res = await organizationService.submitFeedback({
        studentId: selectedIntern._id,
        internshipId: selectedIntern.currentInternship._id,
        rating: rating || 4,
        comments,
        markCompleted,
      });

      if (res.success) {
        // Remove evaluated student from active list if marked completed
        if (markCompleted) {
          setInterns(interns.filter((i) => i._id !== selectedIntern._id));
        }
        handleCloseEvaluation();
        loadData();
      }
    } catch (err) {
      console.error('Failed to submit appraisal', err);
    }
  };

  // Post New Internship
  const handlePostInternship = async () => {
    try {
      const skillsArray = newJob.skillsRequired
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const res = await organizationService.createInternship({
        ...newJob,
        skillsRequired: skillsArray,
      });

      if (res.success) {
        setOpenPostModal(false);
        setNewJob({
          title: '',
          description: '',
          skillsRequired: '',
          durationWeeks: 8,
          location: 'Remote',
          stipend: 0,
          internshipType: 'Full-time',
          openingsCount: 1,
          applicationDeadline: '',
        });
        loadData();
      }
    } catch (err) {
      console.error('Failed to post internship', err);
    }
  };

  if (loading && postings.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
            Organization Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name} &bull; Managing postings and applicant evaluations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenPostModal(true)}
          sx={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            '&:hover': { backgroundColor: 'var(--primary-hover)' },
          }}
        >
          Post New Internship
        </Button>
      </Box>

      {/* Grid of stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--primary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <GroupIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Active Placed Interns
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.activeInternsCount} Students
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--secondary) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
                <BusinessCenterIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Total Open Roles
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.totalPostings} Listed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card className="glass-panel" sx={{ borderLeft: '4px solid var(--accent) !important' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 1.5, mr: 2.5, borderRadius: 'var(--border-radius-md)', background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                <DescriptionIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>
                  Coordinators Shortlisted
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stats.pendingApplications > 0 ? 'var(--warning)' : 'inherit' }}>
                  {stats.pendingApplications} Pending Review
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
        <Tab label={`Active Interns (${interns.length})`} />
        <Tab label={`Shortlisted Candidates (${applicants.length})`} />
        <Tab label={`Internship Postings (${postings.length})`} />
      </Tabs>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Box className="anim-fade-in">
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Active Intern Roster
          </Typography>
          {interns.length === 0 ? (
            <Paper className="glass-panel" sx={{ p: 4, textAlign: 'center', borderRadius: 'var(--border-radius-md)' }}>
              <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                No active placed interns registered at this time.
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Intern Details</TableCell>
                    <TableCell>Designation / Role</TableCell>
                    <TableCell>Contact Details</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {interns.map((intern) => (
                    <TableRow key={intern._id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {intern.name}
                        </Typography>
                        {intern.cgpa && (
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                            CGPA: {intern.cgpa}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{intern.currentInternship?.title || 'Intern'}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{intern.phone || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<RateReviewIcon />}
                          onClick={() => handleOpenEvaluation(intern)}
                          sx={{
                            backgroundColor: 'var(--primary)',
                            color: '#fff',
                            py: 0.6,
                            px: 1.5,
                            fontSize: '0.75rem',
                            '&:hover': { backgroundColor: 'var(--primary-hover)' },
                          }}
                        >
                          Appraise
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box className="anim-fade-in">
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Shortlisted Applicants (Faculty Approved)
          </Typography>
          {applicants.length === 0 ? (
            <Paper className="glass-panel" sx={{ p: 4, textAlign: 'center', borderRadius: 'var(--border-radius-md)' }}>
              <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                No candidate approvals waiting. Students must apply and be approved by the coordinator.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {applicants.map((app) => (
                <Grid size={{ xs: 12, md: 6 }} key={app._id}>
                  <Card className="glass-panel" sx={{ p: 1 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {app.student.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                            Applied for: <strong>{app.internship.title}</strong>
                          </Typography>
                        </Box>
                        {app.student.cgpa && (
                          <Chip label={`CGPA: ${app.student.cgpa}`} size="small" color="primary" sx={{ fontWeight: 600 }} />
                        )}
                      </Box>

                      {app.student.skills && app.student.skills.length > 0 && (
                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {app.student.skills.map((s, idx) => (
                            <Chip key={idx} label={s} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                          ))}
                        </Box>
                      )}

                      {app.coverLetter && (
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2.5, fontStyle: 'italic', pl: 1.5, borderLeft: '3px solid var(--border-color)' }}>
                          "{app.coverLetter}"
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {app.student.resumeUrl ? (
                          <Link href={app.student.resumeUrl} target="_blank" rel="noopener noreferrer" sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                            View Resume
                          </Link>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>No Resume Provided</Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton onClick={() => handleSelectCandidate(app._id, 'rejected')} sx={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', '&:hover': { background: 'rgba(239, 68, 68, 0.15)' } }}>
                            <CloseIcon />
                          </IconButton>
                          <IconButton onClick={() => handleSelectCandidate(app._id, 'accepted')} sx={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)', '&:hover': { background: 'rgba(16, 185, 129, 0.15)' } }}>
                            <CheckIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {tabValue === 2 && (
        <Box className="anim-fade-in">
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Your Internship Postings
          </Typography>
          {postings.length === 0 ? (
            <Paper className="glass-panel" sx={{ p: 4, textAlign: 'center', borderRadius: 'var(--border-radius-md)' }}>
              <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                You haven't posted any internships yet. Click "Post New Internship" to start.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {postings.map((job) => (
                <Grid size={{ xs: 12, md: 4 }} key={job._id}>
                  <Card sx={{ background: 'var(--bg-secondary) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {job.title}
                        </Typography>
                        <Chip
                          label={job.status.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            backgroundColor: job.status === 'open' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(255,255,255,0.03)',
                            color: job.status === 'open' ? 'var(--accent)' : 'var(--text-muted)',
                            border: `1px solid ${job.status === 'open' ? 'rgba(20, 184, 166, 0.2)' : 'var(--border-color)'}`,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        Location: {job.location}
                      </Typography>
                      <Box sx={{ pt: 1.5, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                          Openings: <strong>{job.openingsCount}</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                          Total applicants: <strong>{job.applicantsCount}</strong>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Intern Performance Evaluation Dialog */}
      <Dialog
        open={selectedIntern !== null}
        onClose={handleCloseEvaluation}
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
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>
          Intern Performance Appraisal
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
            Please evaluate <strong>{selectedIntern?.name}</strong>'s performance during their placement.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Performance Rating</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              sx={{ color: 'var(--primary)' }}
            />
          </Box>

          <TextField
            label="Qualitative Performance Review / Comments"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Summarize the intern's strengths and project achievements..."
            required
            sx={{ mb: 2 }}
            slotProps={{
              input: { className: 'glass-input' },
              inputLabel: { style: { color: 'var(--text-secondary)' } },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={markCompleted}
                onChange={(e) => setMarkCompleted(e.target.checked)}
                sx={{
                  color: 'var(--border-color)',
                  '&.Mui-checked': { color: 'var(--primary)' },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Mark internship placement as complete
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid var(--border-color)' }}>
          <Button onClick={handleCloseEvaluation} sx={{ color: 'var(--text-secondary)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEvaluation}
            variant="contained"
            disabled={!comments.trim()}
            sx={{
              backgroundColor: 'var(--primary) !important',
              color: '#fff !important',
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.05) !important',
                color: 'rgba(255,255,255,0.2) !important',
              },
            }}
          >
            Submit Appraisal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Post New Internship Modal */}
      <Dialog
        open={openPostModal}
        onClose={() => setOpenPostModal(false)}
        slotProps={{
          paper: {
            sx: {
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-lg)',
              width: '100%',
              maxWidth: '600px',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>
          Post Internship Listing
        </DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Job Title"
            fullWidth
            variant="outlined"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            required
            slotProps={{
              input: { className: 'glass-input' },
            }}
          />

          <TextField
            label="Job Description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            required
            slotProps={{
              input: { className: 'glass-input' },
            }}
          />

          <TextField
            label="Required Skills (Comma-separated)"
            fullWidth
            variant="outlined"
            value={newJob.skillsRequired}
            onChange={(e) => setNewJob({ ...newJob, skillsRequired: e.target.value })}
            placeholder="e.g. React, Node.js, TypeScript"
            slotProps={{
              input: { className: 'glass-input' },
            }}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Duration (Weeks)"
                type="number"
                fullWidth
                variant="outlined"
                value={newJob.durationWeeks}
                onChange={(e) => setNewJob({ ...newJob, durationWeeks: parseInt(e.target.value) || 8 })}
                slotProps={{
                  input: { className: 'glass-input' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Location (Remote / Hybrid / Onsite)"
                fullWidth
                variant="outlined"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                slotProps={{
                  input: { className: 'glass-input' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Stipend (0 for Unpaid)"
                type="number"
                fullWidth
                variant="outlined"
                value={newJob.stipend}
                onChange={(e) => setNewJob({ ...newJob, stipend: parseInt(e.target.value) || 0 })}
                slotProps={{
                  input: { className: 'glass-input' },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Total Openings"
                type="number"
                fullWidth
                variant="outlined"
                value={newJob.openingsCount}
                onChange={(e) => setNewJob({ ...newJob, openingsCount: parseInt(e.target.value) || 1 })}
                slotProps={{
                  input: { className: 'glass-input' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid var(--border-color)' }}>
          <Button onClick={() => setOpenPostModal(false)} sx={{ color: 'var(--text-secondary)' }}>
            Cancel
          </Button>
          <Button
            onClick={handlePostInternship}
            variant="contained"
            disabled={!newJob.title || !newJob.description}
            sx={{
              backgroundColor: 'var(--primary) !important',
              color: '#fff !important',
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.05) !important',
                color: 'rgba(255,255,255,0.2) !important',
              },
            }}
          >
            Submit Listing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizationDashboard;
