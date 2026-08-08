import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #131b2e 0%, #0b0f19 100%)',
        padding: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          background: 'rgba(239, 68, 68, 0.05) !important',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center',
          p: 4,
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <CardContent>
          <LockIcon sx={{ fontSize: 64, color: 'var(--danger)', mb: 2 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              mb: 1.5,
              color: '#fff'
            }}
          >
            Access Denied
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              mb: 4
            }}
          >
            You do not have the required permissions to access this page. Please contact the administrator if you believe this is an error, or switch to a different account.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              color: 'var(--text-primary) !important',
              borderColor: 'var(--border-color) !important',
              '&:hover': {
                borderColor: 'var(--text-primary) !important',
                background: 'rgba(255, 255, 255, 0.03)',
              }
            }}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Unauthorized;
