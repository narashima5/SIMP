import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import HomeIcon from '@mui/icons-material/Home';

export const NotFound: React.FC = () => {
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
          background: 'rgba(19, 27, 46, 0.4) !important',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center',
          p: 4,
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <CardContent>
          <WarningIcon sx={{ fontSize: 64, color: 'var(--primary)', mb: 2 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              mb: 1.5,
              color: '#fff'
            }}
          >
            404 - Page Not Found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              mb: 4
            }}
          >
            The page you are looking for does not exist or has been moved to a different URL path.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important',
              color: '#fff !important',
              fontWeight: 700,
              px: 3,
              py: 1,
            }}
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFound;
