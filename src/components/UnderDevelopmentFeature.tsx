import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Accent colour for the left border & icon background */
  color?: string;
  /** e.g. "Q3 2026" */
  eta?: string;
}

/**
 * FeatureCard — a single "coming soon" feature tile.
 * Intentionally compact so 2+ can sit side-by-side.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color = 'var(--primary)',
  eta,
}) => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      background: 'rgba(19, 27, 46, 0.45)',
      border: '1px solid var(--border-color)',
      borderLeft: `3px solid ${color}`,
      borderRadius: 'var(--border-radius-md)',
      p: 2.5,
      transition: 'all 0.25s ease',
      cursor: 'default',
      '&:hover': {
        background: 'rgba(30, 41, 66, 0.6)',
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 24px rgba(0,0,0,0.2), 0 0 12px ${color}18`,
      },
      // animated shimmer on hover
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(120deg, transparent 30%, ${color}08 50%, transparent 70%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 2.8s infinite',
      },
      '@keyframes shimmer': {
        '0%': { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
      },
    }}
  >
    {/* Top row */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: 'var(--border-radius-sm)',
          background: `${color}18`,
          color,
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.1rem',
        }}
      >
        {icon}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
        <Chip
          label="Under Development"
          size="small"
          icon={<ConstructionIcon style={{ fontSize: 13 }} />}
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            height: 22,
            background: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--warning)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            '& .MuiChip-icon': { color: 'var(--warning)', ml: 0.5 },
          }}
        />
        {eta && (
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>
            ETA: {eta}
          </Typography>
        )}
      </Box>
    </Box>

    {/* Title */}
    <Typography
      variant="body2"
      sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 0.5, fontFamily: 'var(--font-display)', fontSize: '0.875rem' }}
    >
      {title}
    </Typography>

    {/* Description */}
    <Typography variant="caption" sx={{ color: 'var(--text-secondary)', lineHeight: 1.5, display: 'block' }}>
      {description}
    </Typography>
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────

interface UnderDevelopmentBannerProps {
  pageName: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
    color?: string;
    eta?: string;
  }>;
}

/**
 * UnderDevelopmentBanner — full section dropped into any page.
 * Shows the page name, a pulsing "Coming Soon" badge, and a 2-column grid of FeatureCards.
 */
const UnderDevelopmentBanner: React.FC<UnderDevelopmentBannerProps> = ({ pageName, features }) => {
  return (
    <Box
      sx={{
        mt: 5,
        mb: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2.5,
          pb: 2,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <RocketLaunchIcon sx={{ color: 'var(--secondary)', fontSize: 20 }} />
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: 'var(--text-muted)',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              display: 'block',
              lineHeight: 1,
              mb: 0.3,
            }}
          >
            {pageName}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              lineHeight: 1.2,
            }}
          >
            Upcoming Features
          </Typography>
        </Box>

        {/* Animated "Soon" pill */}
        <Box
          sx={{
            ml: 'auto',
            px: 1.5,
            py: 0.4,
            borderRadius: 20,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            boxShadow: '0 0 12px rgba(99,102,241,0.35)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { boxShadow: '0 0 8px rgba(99,102,241,0.3)' },
              '50%': { boxShadow: '0 0 18px rgba(99,102,241,0.55)' },
            },
          }}
        >
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
            COMING SOON
          </Typography>
        </Box>
      </Box>

      {/* Feature cards grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {features.map((f, idx) => (
          <FeatureCard key={idx} {...f} />
        ))}
      </Box>
    </Box>
  );
};

export default UnderDevelopmentBanner;
