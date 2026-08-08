import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading dashboard environment...',
  fullscreen = false
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullscreen ? '100vh' : '300px',
        width: '100%',
        background: fullscreen ? 'radial-gradient(circle at 50% 50%, #131b2e 0%, #0b0f19 100%)' : 'transparent',
        p: 3,
        zIndex: 10
      }}
    >
      <CircularProgress
        size={50}
        thickness={4}
        sx={{
          color: 'var(--primary)',
          mb: 2.5
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: 'var(--text-secondary)',
          fontWeight: 500,
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.02em',
          animation: 'pulseGlow 2s infinite'
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
