import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box, Typography, Grid, Card, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Rating, Tabs, Tab,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import StarIcon from '@mui/icons-material/Star';

const mockEvaluations = [
  {
    _id: 'eval_001',
    studentName: 'Arjun Mehta',
    studentId: 'CS2022041',
    internshipTitle: 'Full Stack Developer Intern',
    orgName: 'InnovateTech Solutions',
    evaluatorName: 'Ranjith Mohan (HR Manager)',
    rating: 4.5,
    comments: 'Arjun demonstrated exceptional problem-solving ability and delivered the file upload module ahead of schedule. Strong communication and team integration. Recommended for full-time consideration.',
    strengths: ['Technical depth', 'Time management', 'Team player'],
    improvements: ['Documentation habits', 'Error handling coverage'],
    status: 'submitted',
    submittedDate: '2024-08-01',
    internshipPeriod: 'Jun 2024 – Aug 2024',
    markCompleted: true,
  },
  {
    _id: 'eval_002',
    studentName: 'Vikram Iyer',
    studentId: 'CS2022019',
    internshipTitle: 'ML Engineer Intern',
    orgName: 'NeuralWorks AI',
    evaluatorName: 'Dr. Karan Bhatia (Research Lead)',
    rating: 5,
    comments: 'Outstanding performance. Vikram independently researched and implemented a custom CNN that exceeded target accuracy on Week 2. A rare talent.',
    strengths: ['Research mindset', 'Python proficiency', 'Self-driven'],
    improvements: ['Presentation skills'],
    status: 'submitted',
    submittedDate: '2024-08-05',
    internshipPeriod: 'Jun 2024 – Aug 2024',
    markCompleted: true,
  },
  {
    _id: 'eval_003',
    studentName: 'Kavya Sharma',
    studentId: 'CS2022057',
    internshipTitle: 'Cloud Infrastructure Intern',
    orgName: 'DataStream Analytics',
    evaluatorName: 'Ananya Krishnamurthy (DevOps Lead)',
    rating: 0,
    comments: '',
    strengths: [],
    improvements: [],
    status: 'pending',
    submittedDate: '',
    internshipPeriod: 'Jun 2024 – Oct 2024',
    markCompleted: false,
  },
  {
    _id: 'eval_004',
    studentName: 'Preethi Subramaniam',
    studentId: 'CS2022033',
    internshipTitle: 'Backend Developer Intern',
    orgName: 'FinEdge Technologies',
    evaluatorName: 'Sneha Patel (Engineering Manager)',
    rating: 4,
    comments: 'Preethi quickly adapted to the microservices architecture and contributed meaningfully to the payments module. Good work ethic.',
    strengths: ['Fast learner', 'Adaptability', 'Code quality'],
    improvements: ['Proactiveness in asking questions'],
    status: 'submitted',
    submittedDate: '2024-07-28',
    internshipPeriod: 'May 2024 – Jul 2024',
    markCompleted: true,
  },
];

const PerformanceAppraisals: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  const submitted = mockEvaluations.filter((e) => e.status === 'submitted');
  const pending = mockEvaluations.filter((e) => e.status === 'pending');
  const avgRating = submitted.length
    ? (submitted.reduce((a, e) => a + e.rating, 0) / submitted.length).toFixed(1)
    : '–';


  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Intern Performance Appraisals
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          {user?.role === 'coordinator'
            ? 'Review organisation-submitted evaluations for your assigned students.'
            : 'All submitted and pending intern appraisal records for your organisation.'}
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Evaluations', value: mockEvaluations.length, icon: <AssignmentTurnedInIcon />, color: 'var(--primary)' },
          { label: 'Submitted', value: submitted.length, icon: <AssignmentTurnedInIcon />, color: 'var(--success)' },
          { label: 'Pending', value: pending.length, icon: <PendingActionsIcon />, color: 'var(--warning)' },
          { label: 'Avg Rating', value: avgRating + ' / 5', icon: <StarIcon />, color: '#f59e0b' },
        ].map((s) => (
          <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
            <Card className="glass-panel" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 'var(--border-radius-sm)', bgcolor: `${s.color}18`, color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{s.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid var(--border-color)', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" indicatorColor="primary">
          <Tab label={`Submitted (${submitted.length})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Pending (${pending.length})`} sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Content */}
      {tab === 0 && (
        <Grid container spacing={3}>
          {submitted.map((ev) => (
            <Grid size={{ xs: 12, md: 6 }} key={ev._id}>
              <Card className="glass-panel" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{ev.studentName}</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{ev.studentId}</Typography>
                  </Box>
                  <Chip label="SUBMITTED" size="small"
                    sx={{ fontSize: '0.63rem', fontWeight: 700, bgcolor: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 600, display: 'block', mb: 0.3 }}>{ev.internshipTitle}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 1.5 }}>{ev.orgName} · {ev.internshipPeriod}</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating value={ev.rating} precision={0.5} readOnly size="small" sx={{ color: '#f59e0b' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#f59e0b' }}>{ev.rating}/5</Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.7, mb: 2, fontStyle: 'italic', borderLeft: '3px solid var(--border-color)', pl: 1.5 }}>
                  "{ev.comments}"
                </Typography>

                {ev.strengths.length > 0 && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, display: 'block', mb: 0.5 }}>KEY STRENGTHS</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {ev.strengths.map((s) => (
                        <Chip key={s} label={s} size="small"
                          sx={{ fontSize: '0.65rem', bgcolor: 'rgba(16,185,129,0.08)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mt: 1.5 }}>
                  Evaluated by {ev.evaluatorName} · {ev.submittedDate}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tab === 1 && (
        <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Organisation</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.map((ev) => (
                <TableRow key={ev._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.studentName}</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{ev.studentId}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{ev.internshipTitle}</TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{ev.orgName}</TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{ev.internshipPeriod}</TableCell>
                  <TableCell>
                    <Chip label="PENDING" size="small"
                      sx={{ fontSize: '0.63rem', fontWeight: 700, bgcolor: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.25)' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PerformanceAppraisals;
