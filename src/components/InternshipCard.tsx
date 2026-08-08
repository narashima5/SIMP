import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StatusBadge from './StatusBadge';

export interface InternshipData {
  _id: string;
  title: string;
  organization: {
    _id?: string;
    name: string;
    industry?: string;
  } | string;
  description: string;
  skillsRequired: string[];
  durationWeeks: number;
  location: string;
  stipend: number;
  status: string;
  applicantsCount: number;
}

interface InternshipCardProps {
  internship: InternshipData;
  onApply?: (id: string) => void;
  onView?: (id: string) => void;
  isStudent?: boolean;
  hasApplied?: boolean;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  onApply,
  onView,
  isStudent = false,
  hasApplied = false,
}) => {
  const orgName = typeof internship.organization === 'object' ? internship.organization.name : 'Unknown Organization';

  return (
    <Card
      sx={{
        background: 'rgba(19, 27, 46, 0.6) !important',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-md)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'var(--primary)',
          boxShadow: 'var(--shadow-lg)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
              {internship.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {orgName}
            </Typography>
          </Box>
          <StatusBadge status={internship.status} />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'var(--text-secondary)',
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {internship.description}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
              {internship.location}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
              {internship.durationWeeks} Weeks
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentsIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              ₹{internship.stipend?.toLocaleString()}/month
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {internship.skillsRequired?.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          ))}
        </Box>
      </CardContent>

      <Box sx={{ p: 3, pt: 0, borderTop: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {onView && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => onView(internship._id)}
            sx={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)', fontWeight: 600 }}
          >
            Details
          </Button>
        )}
        {isStudent && internship.status === 'open' && (
          <Button
            variant="contained"
            size="small"
            onClick={() => onApply && onApply(internship._id)}
            disabled={hasApplied}
            sx={{
              background: hasApplied ? 'rgba(255,255,255,0.05) !important' : 'var(--primary) !important',
              color: hasApplied ? 'var(--text-muted) !important' : '#fff !important',
              fontWeight: 600,
            }}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default InternshipCard;
