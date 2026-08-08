import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Something went wrong',
  message = 'There was an issue fetching dashboard data. Please try again.',
  onRetry
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: '400px',
        width: '100%'
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          background: 'rgba(239, 68, 68, 0.03) !important',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--border-radius-md)',
          textAlign: 'center',
          p: 3,
        }}
      >
        <CardContent>
          <WarningIcon sx={{ fontSize: 48, color: 'var(--danger)', mb: 2 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              mb: 1,
              color: '#fff'
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              mb: 3
            }}
          >
            {message}
          </Typography>
          {onRetry && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{
                color: 'var(--text-primary) !important',
                borderColor: 'var(--border-color) !important',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'var(--text-primary) !important',
                  background: 'rgba(255, 255, 255, 0.02)',
                }
              }}
            >
              Retry Action
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorPage;
