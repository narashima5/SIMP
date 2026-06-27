import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  Divider,
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// Mock Application data for testing
const mockApplication = {
  id: 'app_mock_303',
  status: 'pending' as 'pending' | 'shortlisted' | 'accepted' | 'rejected',
  appliedDate: '2026-06-20',
  coverLetter: 'I have been building full-stack web applications for over a year and have solid experience in Node.js and Mongoose. I am keen to work with TechCorp Solutions and apply my engineering background to deliver scalable products.',
  student: {
    name: 'Aravind Swamy',
    studentId: '2023CS8042',
    department: 'Computer Science & Engineering',
    cgpa: 8.9,
    phone: '+91 9876543210',
    email: 'aravind.s@student.edu',
    skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'Express.js', 'Git'],
    resumeUrl: 'https://example.com/resumes/aravind_swamy.pdf',
  },
  internship: {
    id: 'intern_mock_505',
    title: 'Full Stack React Developer Intern',
    company: 'TechCorp Solutions',
    location: 'Remote',
    stipend: 25000,
    durationWeeks: 12,
  },
};

export const ApplicationDetails: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState(mockApplication);
  const [feedback, setFeedback] = useState('');

  const handleStatusChange = (newStatus: 'shortlisted' | 'accepted' | 'rejected') => {
    setApp((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'var(--warning)';
      case 'shortlisted': return 'var(--primary)';
      case 'accepted': return 'var(--success)';
      case 'rejected': return 'var(--danger)';
      default: return '#fff';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - var(--header-height))', color: 'var(--text-primary)' }}>
      {/* Back button */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ color: 'var(--text-secondary) !important', '&:hover': { color: 'var(--text-primary) !important' } }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: Applicant details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 4, mb: 4, background: 'rgba(19, 27, 46, 0.6) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'var(--primary)', fontSize: '2rem' }}>
                {app.student.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  {app.student.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <SchoolIcon sx={{ fontSize: 16 }} />
                  {app.student.department} &bull; ID: {app.student.studentId}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'var(--font-display)' }}>
              Professional Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {app.student.skills.map((skill) => (
                <Chip key={skill} label={skill} sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-secondary)' }} />
              ))}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'var(--font-display)' }}>
              Cover Letter
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)', lineHeight: 1.7, mb: 4 }}>
              {app.coverLetter}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'var(--font-display)' }}>
              Supporting Documents
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              href={app.student.resumeUrl}
              target="_blank"
              sx={{
                color: 'var(--primary) !important',
                borderColor: 'var(--primary) !important',
                background: 'rgba(99, 102, 241, 0.05)',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Download Student Resume
            </Button>
          </Card>
        </Grid>

        {/* Right Side: Application Status & Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, mb: 4, background: 'rgba(19, 27, 46, 0.6) !important', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
            <Typography variant="subtitle2" sx={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, mb: 1 }}>
              Application For
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
              {app.internship.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
              {app.internship.company}
            </Typography>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                Status
              </Typography>
              <Chip
                label={app.status.toUpperCase()}
                sx={{
                  bgcolor: `${getStatusColor(app.status)}15`,
                  color: getStatusColor(app.status),
                  border: `1px solid ${getStatusColor(app.status)}`,
                  fontWeight: 700,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                Applied Date:
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                {app.appliedDate}
              </Typography>
            </Box>

            {/* Coordinator & Org Action Controls */}
            {user?.role !== 'student' && app.status === 'pending' && (
              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                  Review Actions
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Provide comments/feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  sx={{ mb: 1 }}
                />
                
                {user?.role === 'coordinator' ? (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleStatusChange('shortlisted')}
                      sx={{ background: 'var(--primary) !important', color: '#fff !important' }}
                    >
                      Verify & Approve
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<HighlightOffIcon />}
                      onClick={() => handleStatusChange('rejected')}
                      sx={{ color: 'var(--danger) !important', borderColor: 'var(--danger) !important', '&:hover': { background: 'rgba(239, 68, 68, 0.05)' } }}
                    >
                      Reject Application
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleStatusChange('accepted')}
                      sx={{ background: 'var(--success) !important', color: '#fff !important' }}
                    >
                      Select Candidate
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<HighlightOffIcon />}
                      onClick={() => handleStatusChange('rejected')}
                      sx={{ color: 'var(--danger) !important', borderColor: 'var(--danger) !important', '&:hover': { background: 'rgba(239, 68, 68, 0.05)' } }}
                    >
                      Decline Candidate
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ApplicationDetails;
