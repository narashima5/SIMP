import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Chip, Avatar, Divider, LinearProgress, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const mockProfile = {
  name: 'Arjun Mehta',
  studentId: 'CS2022041',
  department: 'Computer Science & Engineering',
  email: 'arjun.mehta@student.edu',
  phone: '+91 98765 43210',
  cgpa: 8.7,
  semester: '6th Semester',
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Docker', 'Git', 'REST APIs'],
  placementStatus: 'placed',
  currentInternship: { title: 'Full Stack Developer Intern', company: 'InnovateTech Solutions Pvt. Ltd.' },
  assignedCoordinator: 'Dr. Priya Ramachandran',
  weeksCompleted: 5,
  hoursLogged: 196,
  bio: 'Final-year CSE student with a passion for building scalable web applications. Experienced with full-stack development and cloud infrastructure.',
};

const completionItems = [
  { label: 'Basic Profile', done: true },
  { label: 'Resume Uploaded', done: true },
  { label: 'Offer Letter', done: true },
  { label: 'Skills Added', done: true },
  { label: 'Completion Certificate', done: false },
  { label: 'Final Evaluation', done: false },
];

const StudentProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({ phone: mockProfile.phone, bio: mockProfile.bio, skills: mockProfile.skills.join(', ') });
  const [profile, setProfile] = useState(mockProfile);

  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const handleSave = () => {
    setProfile((prev) => ({
      ...prev,
      phone: editData.phone,
      bio: editData.bio,
      skills: editData.skills.split(',').map((s) => s.trim()).filter(Boolean),
    }));
    setEditOpen(false);
  };

  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPct = Math.round((completedCount / completionItems.length) * 100);

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
            My Profile & Settings
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Manage your personal details, skills, and internship preferences.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setEditOpen(true)}
          sx={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#fff', fontWeight: 700 }}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left — Identity Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="glass-panel" sx={{ p: 3, textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 88, height: 88, mx: 'auto', mb: 2,
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                fontSize: '2rem', fontWeight: 800,
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
              {profile.name}
            </Typography>
            <Chip
              label={profile.placementStatus === 'placed' ? 'Currently Placed' : 'Seeking Placement'}
              size="small"
              sx={{
                mb: 2, fontWeight: 600, fontSize: '0.7rem',
                bgcolor: profile.placementStatus === 'placed' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                color: profile.placementStatus === 'placed' ? 'var(--success)' : 'var(--warning)',
                border: `1px solid ${profile.placementStatus === 'placed' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
              }}
            />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
              {[
                { icon: <BadgeIcon sx={{ fontSize: 16 }} />, label: profile.studentId },
                { icon: <SchoolIcon sx={{ fontSize: 16 }} />, label: `${profile.department} · ${profile.semester}` },
                { icon: <EmailIcon sx={{ fontSize: 16 }} />, label: profile.email },
                { icon: <PhoneIcon sx={{ fontSize: 16 }} />, label: profile.phone },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>{item.icon}</Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Profile Completeness */}
          <Card className="glass-panel" sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Profile Completeness
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{completedCount} of {completionItems.length} completed</Typography>
              <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 700 }}>{completionPct}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPct}
              sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', mb: 2, '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, var(--primary), var(--secondary))' } }}
            />
            {completionItems.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: item.done ? 'var(--success)' : 'var(--border-color)' }} />
                <Typography variant="caption" sx={{ color: item.done ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Right — Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Current Internship */}
          <Card className="glass-panel" sx={{ p: 3, mb: 3, borderLeft: '4px solid var(--primary) !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <WorkIcon sx={{ color: 'var(--primary)' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                Current Internship
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{profile.currentInternship.title}</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>{profile.currentInternship.company}</Typography>
            <Grid container spacing={3}>
              {[
                { label: 'Weeks Completed', value: `${profile.weeksCompleted} / 16` },
                { label: 'Hours Logged', value: `${profile.hoursLogged} / 640` },
                { label: 'Assigned Coordinator', value: profile.assignedCoordinator },
              ].map((stat) => (
                <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>{stat.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', mt: 0.3 }}>{stat.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* CGPA & Academics */}
          <Card className="glass-panel" sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <StarIcon sx={{ color: 'var(--warning)' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                Academic Standing
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>CGPA</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--warning)', mt: 0.3 }}>{profile.cgpa}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>Semester</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.3 }}>{profile.semester}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 0.5 }}>CGPA Bar</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(profile.cgpa / 10) * 100}
                  sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, var(--warning), #f97316)' } }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Bio */}
          <Card className="glass-panel" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 1.5 }}>
              Bio
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {profile.bio}
            </Typography>
          </Card>

          {/* Skills */}
          <Card className="glass-panel" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>
              Skills & Technologies
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.75rem',
                    bgcolor: 'rgba(99,102,241,0.1)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }}
                />
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)' } } }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Edit Profile</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Phone Number"
            fullWidth
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            slotProps={{ input: { className: 'glass-input' }, inputLabel: { style: { color: 'var(--text-secondary)' } } }}
          />
          <TextField
            label="Bio"
            multiline
            rows={3}
            fullWidth
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            slotProps={{ input: { className: 'glass-input' }, inputLabel: { style: { color: 'var(--text-secondary)' } } }}
          />
          <TextField
            label="Skills (comma-separated)"
            fullWidth
            value={editData.skills}
            onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
            placeholder="React, Node.js, Python..."
            slotProps={{ input: { className: 'glass-input' }, inputLabel: { style: { color: 'var(--text-secondary)' } } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: 'var(--text-secondary)' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained"
            sx={{ background: 'var(--primary)', color: '#fff', '&:hover': { background: 'var(--primary-hover)' } }}
          >Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentProfile;
