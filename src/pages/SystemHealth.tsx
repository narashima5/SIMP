import React from 'react';
import {
  Box, Typography, Grid, Card, Chip, LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import ApiIcon from '@mui/icons-material/Api';
import SpeedIcon from '@mui/icons-material/Speed';

const services = [
  { name: 'REST API Server', description: 'Express.js / Node.js — Primary backend', status: 'operational', uptime: '99.97%', responseMs: 12 },
  { name: 'MongoDB Atlas', description: 'Primary database cluster (M10 tier)', status: 'operational', uptime: '99.99%', responseMs: 5 },
  { name: 'File Storage (S3)', description: 'AWS S3 — Documents & uploads bucket', status: 'degraded', uptime: '98.4%', responseMs: 210 },
  { name: 'Auth Service (JWT)', description: 'Token issuance & refresh middleware', status: 'operational', uptime: '100%', responseMs: 3 },
  { name: 'Email Notifications', description: 'SendGrid transactional email relay', status: 'operational', uptime: '99.8%', responseMs: 45 },
  { name: 'CDN / Static Assets', description: 'Cloudflare edge caching layer', status: 'operational', uptime: '99.99%', responseMs: 8 },
];

const resources = [
  { label: 'CPU Usage', value: 18, color: 'var(--success)', detail: '18% of 4 vCPU' },
  { label: 'Memory', value: 42, color: 'var(--primary)', detail: '1.68 GB / 4 GB' },
  { label: 'Disk I/O', value: 11, color: 'var(--accent)', detail: '110 MB/s peak' },
  { label: 'DB Connections', value: 25, color: 'var(--secondary)', detail: '5 / 20 pools' },
  { label: 'Network Egress', value: 34, color: '#f59e0b', detail: '3.4 GB / 10 GB' },
  { label: 'Storage Used', value: 62, color: '#ef4444', detail: '62 GB / 100 GB' },
];

const recentEvents = [
  { time: '19:31', type: 'info', msg: 'MongoDB: Replica set election completed successfully.' },
  { time: '18:55', type: 'warn', msg: 'S3: PUT request latency elevated — 210ms avg (threshold: 150ms).' },
  { time: '17:20', type: 'info', msg: 'Auth: 214 JWT tokens refreshed in last hour.' },
  { time: '16:44', type: 'info', msg: 'API: Peak load 312 req/min — all within SLA.' },
  { time: '15:10', type: 'info', msg: 'Scheduled DB backup completed. Size: 4.2 GB.' },
  { time: '14:00', type: 'warn', msg: 'Email: Bounce rate increased to 2.3% (threshold: 2%).' },
];

const statusIcon = (s: string) => {
  if (s === 'operational') return <CheckCircleIcon sx={{ color: 'var(--success)', fontSize: 18 }} />;
  if (s === 'degraded') return <WarningAmberIcon sx={{ color: 'var(--warning)', fontSize: 18 }} />;
  return <ErrorIcon sx={{ color: 'var(--danger)', fontSize: 18 }} />;
};

const serviceIcon: Record<string, React.ReactNode> = {
  'REST API Server': <ApiIcon />,
  'MongoDB Atlas': <StorageIcon />,
  'File Storage (S3)': <CloudIcon />,
  'Auth Service (JWT)': <LockIcon />,
  'Email Notifications': <EmailIcon />,
  'CDN / Static Assets': <SpeedIcon />,
};

const SystemHealth: React.FC = () => {
  const allOperational = services.every((s) => s.status === 'operational');
  const degraded = services.filter((s) => s.status === 'degraded').length;

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Platform Infrastructure Health
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Real-time status of all SIMP platform services, resource utilisation and recent system events.
        </Typography>
      </Box>

      {/* Overall status banner */}
      <Card sx={{
        mb: 4, p: 2.5,
        background: allOperational ? 'rgba(16,185,129,0.08) !important' : 'rgba(245,158,11,0.08) !important',
        border: `1px solid ${allOperational ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
        borderRadius: 'var(--border-radius-md)',
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        {allOperational
          ? <CheckCircleIcon sx={{ color: 'var(--success)', fontSize: 28 }} />
          : <WarningAmberIcon sx={{ color: 'var(--warning)', fontSize: 28 }} />}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: allOperational ? 'var(--success)' : 'var(--warning)' }}>
            {allOperational ? 'All Systems Operational' : `${degraded} Service${degraded > 1 ? 's' : ''} Degraded`}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
            Last checked: just now · Next check in 60 seconds
          </Typography>
        </Box>
      </Card>

      <Grid container spacing={3}>
        {/* Services */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>Service Status</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            {services.map((svc) => (
              <Card key={svc.name} className="glass-panel" sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: 'var(--text-muted)', display: 'flex' }}>{serviceIcon[svc.name]}</Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>{svc.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{svc.description}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>Uptime: <strong style={{ color: 'var(--success)' }}>{svc.uptime}</strong></Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{svc.responseMs}ms</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {statusIcon(svc.status)}
                      <Chip label={svc.status.toUpperCase()} size="small"
                        sx={{
                          fontSize: '0.6rem', fontWeight: 700,
                          bgcolor: svc.status === 'operational' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: svc.status === 'operational' ? 'var(--success)' : 'var(--warning)',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Event log */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>Recent System Events</Typography>
          <Card className="glass-panel" sx={{ p: 0, overflow: 'hidden' }}>
            {recentEvents.map((ev, i) => (
              <Box key={i} sx={{
                px: 2.5, py: 1.5, borderBottom: i < recentEvents.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                display: 'flex', gap: 2, alignItems: 'flex-start',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
              }}>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', flexShrink: 0, mt: 0.2 }}>{ev.time}</Typography>
                {ev.type === 'warn'
                  ? <WarningAmberIcon sx={{ color: 'var(--warning)', fontSize: 15, mt: 0.2, flexShrink: 0 }} />
                  : <CheckCircleIcon sx={{ color: 'var(--success)', fontSize: 15, mt: 0.2, flexShrink: 0 }} />}
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ev.msg}</Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Resource utilisation */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>Resource Utilisation</Typography>
          <Card className="glass-panel" sx={{ p: 3, mb: 3 }}>
            {resources.map((r, i) => (
              <Box key={r.label} sx={{ mb: i < resources.length - 1 ? 2.5 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.label}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: r.color, fontWeight: 700 }}>{r.value}%</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', ml: 1 }}>{r.detail}</Typography>
                  </Box>
                </Box>
                <LinearProgress variant="determinate" value={r.value}
                  sx={{ height: 7, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)',
                    '& .MuiLinearProgress-bar': { background: r.color, borderRadius: 4 } }}
                />
              </Box>
            ))}
          </Card>

          {/* Quick stats */}
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 2 }}>Platform Metrics (24h)</Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Total Requests', value: '47,312' },
              { label: 'Avg Response', value: '14ms' },
              { label: 'Error Rate', value: '0.08%' },
              { label: 'Active Sessions', value: '23' },
            ].map((m) => (
              <Grid size={6} key={m.label}>
                <Card className="glass-panel" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--primary)' }}>{m.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{m.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemHealth;
