import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, Chip, Button, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Checkbox, FormControlLabel,
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { mockOrgDashboard } from '@/services/mockData';

type Intern = typeof mockOrgDashboard.activeInterns[0];

const PlacedInterns: React.FC = () => {
  const interns = mockOrgDashboard.activeInterns;
  const [selected, setSelected] = useState<Intern | null>(null);
  const [rating, setRating] = useState<number | null>(4);
  const [comments, setComments] = useState('');
  const [markComplete, setMarkComplete] = useState(false);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());

  const weekProgress: Record<string, number> = {
    [interns[0]?._id]: 5,
    [interns[1]?._id]: 3,
    [interns[2]?._id]: 2,
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted((prev) => new Set(prev).add(selected._id));
    setSelected(null);
    setComments('');
    setRating(4);
    setMarkComplete(false);
  };

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Placed Student Interns
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Manage and appraise all currently active interns placed at your organisation.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Active Interns', value: interns.length, icon: <GroupIcon />, color: 'var(--primary)' },
          { label: 'Appraised', value: submitted.size, icon: <CheckCircleIcon />, color: 'var(--success)' },
          { label: 'Pending Appraisal', value: interns.length - submitted.size, icon: <HourglassEmptyIcon />, color: 'var(--warning)' },
        ].map((s) => (
          <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
            <Card className="glass-panel" sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 'var(--border-radius-md)', bgcolor: `${s.color}18`, color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{s.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Intern Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {interns.map((intern) => {
          const weeks = weekProgress[intern._id] ?? 0;
          const pct = Math.round((weeks / 16) * 100);
          const isAppraised = submitted.has(intern._id);
          return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={intern._id}>
              <Card className="glass-panel" sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.3 }}>{intern.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      CGPA: {intern.cgpa} · {intern.phone}
                    </Typography>
                  </Box>
                  <Chip
                    label={isAppraised ? 'Appraised' : 'Active'}
                    size="small"
                    sx={{
                      fontWeight: 600, fontSize: '0.65rem',
                      bgcolor: isAppraised ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                      color: isAppraised ? 'var(--success)' : 'var(--primary)',
                    }}
                  />
                </Box>

                <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 600, display: 'block', mb: 1 }}>
                  {intern.currentInternship?.title}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {intern.skills?.map((s) => (
                    <Chip key={s} label={s} size="small"
                      sx={{ fontSize: '0.62rem', bgcolor: 'rgba(20,184,166,0.08)', color: 'var(--accent)', border: '1px solid rgba(20,184,166,0.2)' }}
                    />
                  ))}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Internship Progress</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 700 }}>{weeks}/16 weeks</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct}
                    sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, var(--primary), var(--secondary))' } }}
                  />
                </Box>

                <Button
                  fullWidth variant={isAppraised ? 'outlined' : 'contained'}
                  startIcon={<RateReviewIcon />}
                  onClick={() => { setSelected(intern); setComments(''); setRating(4); setMarkComplete(false); }}
                  size="small"
                  sx={{
                    color: isAppraised ? 'var(--text-secondary) !important' : '#fff',
                    borderColor: isAppraised ? 'var(--border-color) !important' : undefined,
                    background: isAppraised ? 'transparent' : 'var(--primary)',
                    '&:hover': { background: isAppraised ? 'rgba(255,255,255,0.03)' : 'var(--primary-hover)' },
                    fontWeight: 600, fontSize: '0.75rem',
                  }}
                >
                  {isAppraised ? 'Re-appraise' : 'Appraise Intern'}
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* All placements summary table */}
      <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
        Placement Summary Table
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Intern Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>CGPA</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interns.map((intern) => {
              const weeks = weekProgress[intern._id] ?? 0;
              return (
                <TableRow key={intern._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{intern.name}</TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{intern.currentInternship?.title}</TableCell>
                  <TableCell sx={{ color: 'var(--warning)', fontWeight: 700 }}>{intern.cgpa}</TableCell>
                  <TableCell sx={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{intern.phone}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{weeks}/16 wks</Typography>
                    <LinearProgress variant="determinate" value={Math.round((weeks / 16) * 100)}
                      sx={{ height: 4, borderRadius: 2, mt: 0.5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: 'var(--primary)' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={submitted.has(intern._id) ? 'Appraised' : 'Active'} size="small"
                      sx={{ fontSize: '0.65rem', fontWeight: 600,
                        bgcolor: submitted.has(intern._id) ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                        color: submitted.has(intern._id) ? 'var(--success)' : 'var(--primary)' }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Appraisal Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)' } } }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Intern Performance Appraisal</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
            Evaluating <strong>{selected?.name}</strong> for <strong>{selected?.currentInternship?.title}</strong>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Performance Rating</Typography>
            <Rating value={rating} onChange={(_, v) => setRating(v)} sx={{ color: 'var(--warning)' }} />
          </Box>
          <TextField label="Appraisal Comments" multiline rows={4} fullWidth value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Summarise the intern's strengths, contributions and areas for improvement..."
            sx={{ mb: 2 }}
            slotProps={{ input: { className: 'glass-input' }, inputLabel: { style: { color: 'var(--text-secondary)' } } }}
          />
          <FormControlLabel
            control={<Checkbox checked={markComplete} onChange={(e) => setMarkComplete(e.target.checked)}
              sx={{ color: 'var(--border-color)', '&.Mui-checked': { color: 'var(--primary)' } }}
            />}
            label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Mark internship as completed</Typography>}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setSelected(null)} sx={{ color: 'var(--text-secondary)' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!comments.trim()}
            sx={{ background: 'var(--primary) !important', color: '#fff !important' }}
          >Submit Appraisal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlacedInterns;
