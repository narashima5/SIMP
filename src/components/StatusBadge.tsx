import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = (val: string) => {
    const s = val.toLowerCase();
    switch (s) {
      case 'approved':
      case 'accepted':
      case 'placed':
      case 'completed':
        return {
          bg: 'var(--success-glow)',
          color: 'var(--success)',
          border: 'rgba(16, 185, 129, 0.2)',
        };
      case 'rejected':
      case 'withdrawn':
      case 'closed':
        return {
          bg: 'var(--danger-glow)',
          color: 'var(--danger)',
          border: 'rgba(239, 68, 68, 0.2)',
        };
      case 'pending':
      case 'shortlisted':
      case 'applied':
        return {
          bg: 'var(--warning-glow)',
          color: 'var(--warning)',
          border: 'rgba(245, 158, 11, 0.2)',
        };
      case 'unplaced':
      case 'open':
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-secondary)',
          border: 'var(--border-color)',
        };
    }
  };

  const styles = getStyles(status);

  return (
    <Chip
      label={status.toUpperCase()}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: '0.7rem',
        backgroundColor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
      }}
    />
  );
};

export default StatusBadge;
