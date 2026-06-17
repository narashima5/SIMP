import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
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
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import RateReviewIcon from '@mui/icons-material/RateReview';

interface Intern {
  id: string;
  name: string;
  role: string;
  university: string;
  startDate: string;
  evaluationStatus: 'completed' | 'pending';
}

interface JobPosting {
  id: string;
  title: string;
  slots: number;
  applicants: number;
  status: 'active' | 'closed';
}

export const OrganizationDashboard: React.FC = () => {
  const { user } = useAuth();

  const [interns, setInterns] = useState<Intern[]>([
    { id: 'int_01', name: 'Aravind Swamy', role: 'Frontend Engineer Intern', university: 'CSE Dept, University Tech', startDate: '2026-05-15', evaluationStatus: 'pending' },
    { id: 'int_02', name: 'Sandhya Rao', role: 'Data Science Intern', university: 'Maths Dept, Science College', startDate: '2026-05-20', evaluationStatus: 'completed' },
  ]);

  const [postings] = useState<JobPosting[]>([
    { id: 'job_01', title: 'React Frontend Developer Intern', slots: 3, applicants: 14, status: 'active' },
    { id: 'job_02', title: 'Node.js Backend Developer Intern', slots: 2, applicants: 9, status: 'active' },
    { id: 'job_03', title: 'UI/UX Design Intern', slots: 1, applicants: 15, status: 'closed' },
  ]);

  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [technicalRating, setTechnicalRating] = useState<number | null>(4);
  const [commsRating, setCommsRating] = useState<number | null>(4);
  const [perfRating, setPerfRating] = useState<number | null>(4);
  const [qualitativeFeedback, setQualitativeFeedback] = useState('');

  const handleOpenEvaluation = (intern: Intern) => {
    setSelectedIntern(intern);
    setTechnicalRating(4);
    setCommsRating(4);
    setPerfRating(4);
    setQualitativeFeedback('');
  };

  const handleCloseEvaluation = () => {
    setSelectedIntern(null);
  };

  const handleSubmitEvaluation = () => {
    if (!selectedIntern) return;

    // Simulate updating the intern's evaluation status to completed
    setInterns(
      interns.map((int) =>
        int.id === selectedIntern.id ? { ...int, evaluationStatus: 'completed' } : int
      )
    );
    handleCloseEvaluation();
  };

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Organization Portal
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          {user?.name} &bull; {user?.details?.title} &bull; <strong>{user?.details?.organizationName}</strong>
        </Typography>
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
                  {interns.length} Students
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
                  Job Openings Listed
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {postings.filter((p) => p.status === 'active').length} Active
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
                  Appraisals Pending
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: interns.some(i => i.evaluationStatus === 'pending') ? 'var(--warning)' : 'inherit' }}>
                  {interns.filter((i) => i.evaluationStatus === 'pending').length} Actions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Two sections layout: Intern List and Active Job Postings */}
      <Grid container spacing={4}>
        {/* Intern Roster */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Active Intern Roster
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Intern</TableCell>
                  <TableCell>Designation / Role</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Evaluation</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interns.map((intern) => (
                  <TableRow key={intern.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {intern.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                        {intern.university}
                      </Typography>
                    </TableCell>
                    <TableCell>{intern.role}</TableCell>
                    <TableCell>{intern.startDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={intern.evaluationStatus.toUpperCase()}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          backgroundColor:
                            intern.evaluationStatus === 'completed'
                              ? 'var(--success-glow)'
                              : 'var(--warning-glow)',
                          color:
                            intern.evaluationStatus === 'completed'
                              ? 'var(--success)'
                              : 'var(--warning)',
                          border: `1px solid ${
                            intern.evaluationStatus === 'completed'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(245, 158, 11, 0.2)'
                          }`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {intern.evaluationStatus === 'pending' ? (
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
                          Evaluate
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          disabled
                          sx={{
                            fontSize: '0.75rem',
                            borderColor: 'var(--border-color) !important',
                            color: 'var(--text-muted) !important',
                          }}
                        >
                          Submitted
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Job Listings Panel */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
            Your Job Postings
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {postings.map((job) => (
              <Card key={job.id} sx={{ background: 'var(--bg-secondary) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                <CardContent sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.5 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                      Slots: {job.slots} &bull; Applicants: <strong>{job.applicants}</strong>
                    </Typography>
                  </Box>
                  <Chip
                    label={job.status.toUpperCase()}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      backgroundColor: job.status === 'active' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(255,255,255,0.03)',
                      color: job.status === 'active' ? 'var(--accent)' : 'var(--text-muted)',
                      border: `1px solid ${job.status === 'active' ? 'rgba(20, 184, 166, 0.2)' : 'var(--border-color)'}`,
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>

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
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3.5 }}>
            Please rate <strong>{selectedIntern?.name}</strong>'s performance during their placement as a <strong>{selectedIntern?.role}</strong>.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Technical Skillset</Typography>
              <Rating
                value={technicalRating}
                onChange={(_, newValue) => setTechnicalRating(newValue)}
                sx={{ color: 'var(--primary)' }}
              />
            </Grid>
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Communication & Collaboration</Typography>
              <Rating
                value={commsRating}
                onChange={(_, newValue) => setCommsRating(newValue)}
                sx={{ color: 'var(--secondary)' }}
              />
            </Grid>
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Overall Professionalism</Typography>
              <Rating
                value={perfRating}
                onChange={(_, newValue) => setPerfRating(newValue)}
                sx={{ color: 'var(--accent)' }}
              />
            </Grid>
          </Grid>

          <TextField
            label="Qualitative Performance Review"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={qualitativeFeedback}
            onChange={(e) => setQualitativeFeedback(e.target.value)}
            placeholder="Summarize the intern's strengths, areas of growth, and overall project contributions..."
            required
            slotProps={{
              input: { className: 'glass-input' },
              inputLabel: { style: { color: 'var(--text-secondary)' } },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid var(--border-color)' }}>
          <Button onClick={handleCloseEvaluation} sx={{ color: 'var(--text-secondary)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEvaluation}
            variant="contained"
            disabled={!qualitativeFeedback.trim()}
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
    </Box>
  );
};
export default OrganizationDashboard;
