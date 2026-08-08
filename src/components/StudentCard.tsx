import React from 'react';
import { Card, CardContent, Typography, Box, Button, LinearProgress } from '@mui/material';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import StatusBadge from './StatusBadge';

export interface StudentData {
  _id: string;
  name: string;
  studentId: string;
  department: string;
  phone: string;
  cgpa: number;
  skills: string[];
  bio?: string;
  placementStatus: 'unplaced' | 'applied' | 'placed' | 'completed';
  currentInternship?: {
    _id?: string;
    title: string;
    organization?: any;
  } | any;
}

interface StudentCardProps {
  student: StudentData;
  approvedWeeksCount?: number;
  totalHoursApproved?: number;
  onEvaluate?: (studentId: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  approvedWeeksCount = 0,
  totalHoursApproved = 0,
  onEvaluate,
}) => {
  const currentJob = student.currentInternship
    ? typeof student.currentInternship === 'object'
      ? student.currentInternship.title
      : 'Active Role'
    : null;

  return (
    <Card
      sx={{
        background: 'rgba(19, 27, 46, 0.5) !important',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-md)',
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'var(--primary)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              {student.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
              ID: {student.studentId}
            </Typography>
          </Box>
          <StatusBadge status={student.placementStatus} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {student.department} &bull; CGPA: <strong>{student.cgpa}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContactPhoneIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {student.phone}
            </Typography>
          </Box>
          {currentJob && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon sx={{ fontSize: 16, color: 'var(--primary)' }} />
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                {currentJob}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Progress meter */}
        {(student.placementStatus === 'placed' || student.placementStatus === 'completed') && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                Internship Completion Progress
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 600 }}>
                {approvedWeeksCount} / 16 Weeks ({totalHoursApproved} hrs)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((approvedWeeksCount / 16) * 100, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                },
              }}
            />
          </Box>
        )}

        {onEvaluate && (student.placementStatus === 'placed' || student.placementStatus === 'completed') && (
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={() => onEvaluate(student._id)}
            sx={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important',
              color: '#fff !important',
              fontWeight: 600,
            }}
          >
            Manage & Evaluate
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCard;
