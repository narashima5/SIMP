import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, Chip, TextField, InputAdornment,
  FormControl, Select, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';

const auditEvents = [
  { id: 'a001', timestamp: '2026-08-11T19:31:04', actor: 'admin@simp.org', action: 'USER_LOGIN', target: 'admin@simp.org', role: 'admin', severity: 'info', details: 'Successful login from 192.168.1.42' },
  { id: 'a002', timestamp: '2026-08-11T19:20:12', actor: 'admin@simp.org', action: 'USER_SUSPENDED', target: 'recruit@datastream.com', role: 'admin', severity: 'warn', details: 'Account suspended: violation of posting policy' },
  { id: 'a003', timestamp: '2026-08-11T18:55:30', actor: 'priya@university.edu', action: 'REPORT_APPROVED', target: 'CS2022041 — Week 5 Log', role: 'coordinator', severity: 'info', details: 'Weekly log #log_005 approved with comment' },
  { id: 'a004', timestamp: '2026-08-11T18:44:10', actor: 'arjun@student.edu', action: 'APPLICATION_SUBMITTED', target: 'DataStream Analytics — Cloud Intern', role: 'student', severity: 'info', details: 'Cover letter submitted for internship int_002' },
  { id: 'a005', timestamp: '2026-08-11T18:30:00', actor: 'admin@simp.org', action: 'ROLE_CHANGED', target: 'kavya@student.edu → coordinator', role: 'admin', severity: 'critical', details: 'Role escalation: student → coordinator by admin' },
  { id: 'a006', timestamp: '2026-08-11T17:10:45', actor: 'hr@innovatetech.com', action: 'INTERNSHIP_POSTED', target: 'UI/UX Design Intern', role: 'organization', severity: 'info', details: 'New listing posted, pending coordinator review' },
  { id: 'a007', timestamp: '2026-08-11T16:50:22', actor: 'vikram@student.edu', action: 'USER_LOGIN', target: 'vikram@student.edu', role: 'student', severity: 'info', details: 'Successful login from 10.0.0.5' },
  { id: 'a008', timestamp: '2026-08-11T16:30:11', actor: 'priya@university.edu', action: 'REPORT_REJECTED', target: 'CS2022041 — Week 6 Log', role: 'coordinator', severity: 'warn', details: 'Log rejected: insufficient task details' },
  { id: 'a009', timestamp: '2026-08-11T15:00:00', actor: 'SYSTEM', action: 'BACKUP_COMPLETED', target: 'MongoDB Atlas', role: 'system', severity: 'info', details: 'Scheduled daily backup — 4.2 GB — completed' },
  { id: 'a010', timestamp: '2026-08-11T14:20:33', actor: 'hr@innovatetech.com', action: 'CANDIDATE_SELECTED', target: 'Arjun Mehta — Full Stack Intern', role: 'organization', severity: 'info', details: 'Candidate accepted and placement confirmed' },
  { id: 'a011', timestamp: '2026-08-11T13:45:00', actor: 'admin@simp.org', action: 'BULK_EXPORT', target: 'User registry (CSV)', role: 'admin', severity: 'warn', details: '7 user records exported by admin' },
  { id: 'a012', timestamp: '2026-08-11T12:00:00', actor: 'SYSTEM', action: 'TOKEN_EXPIRED', target: 'suresh@student.edu', role: 'system', severity: 'info', details: 'Refresh token expired — session terminated' },
];

const actionIcon: Record<string, React.ReactNode> = {
  USER_LOGIN:           <LoginIcon sx={{ fontSize: 15 }} />,
  USER_LOGOUT:          <LogoutIcon sx={{ fontSize: 15 }} />,
  USER_SUSPENDED:       <BlockIcon sx={{ fontSize: 15 }} />,
  ROLE_CHANGED:         <ManageAccountsIcon sx={{ fontSize: 15 }} />,
  REPORT_APPROVED:      <CheckIcon sx={{ fontSize: 15 }} />,
  REPORT_REJECTED:      <DeleteIcon sx={{ fontSize: 15 }} />,
  APPLICATION_SUBMITTED:<EditIcon sx={{ fontSize: 15 }} />,
  INTERNSHIP_POSTED:    <VerifiedUserIcon sx={{ fontSize: 15 }} />,
  CANDIDATE_SELECTED:   <VerifiedUserIcon sx={{ fontSize: 15 }} />,
  BACKUP_COMPLETED:     <DownloadIcon sx={{ fontSize: 15 }} />,
  BULK_EXPORT:          <DownloadIcon sx={{ fontSize: 15 }} />,
  TOKEN_EXPIRED:        <LogoutIcon sx={{ fontSize: 15 }} />,
};

const severityStyle = (s: string) => {
  if (s === 'critical') return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' };
  if (s === 'warn')     return { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' };
  return { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' };
};

const roleStyle = (r: string) => {
  const map: Record<string, string> = { admin: 'var(--warning)', coordinator: 'var(--secondary)', student: 'var(--primary)', organization: 'var(--accent)', system: 'var(--text-muted)' };
  return map[r] ?? 'var(--text-muted)';
};

const AuditLogs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const filtered = auditEvents.filter((e) => {
    const matchSearch =
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.target.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase());
    const matchSev = !severityFilter || e.severity === severityFilter;
    return matchSearch && matchSev;
  });

  const criticalCount = auditEvents.filter((e) => e.severity === 'critical').length;
  const warnCount = auditEvents.filter((e) => e.severity === 'warn').length;

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Platform Security Audits
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Chronological log of all security-relevant platform events — logins, role changes, data exports, and system actions.
        </Typography>
      </Box>

      {/* Summary chips */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Events (24h)', value: auditEvents.length, color: 'var(--primary)' },
          { label: 'Critical', value: criticalCount, color: '#ef4444' },
          { label: 'Warnings', value: warnCount, color: 'var(--warning)' },
          { label: 'Info', value: auditEvents.length - criticalCount - warnCount, color: 'var(--success)' },
        ].map((s) => (
          <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
            <Card className="glass-panel" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ p: 2, mb: 3, background: 'rgba(19,27,46,0.4) !important', border: '1px solid var(--border-color)' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField fullWidth size="small" placeholder="Search by actor, action, target, or details..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'var(--text-muted)' }} /></InputAdornment>, className: 'glass-input' } }}
              sx={{ '& input': { color: '#fff' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}
                displayEmpty
                sx={{ color: '#fff', border: '1px solid var(--border-color)', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
              >
                <MenuItem value="">All Severities</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="warn">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Timeline */}
      <Card className="glass-panel" sx={{ p: 0, overflow: 'hidden' }}>
        {filtered.map((ev, i) => {
          const sty = severityStyle(ev.severity);
          const ts = new Date(ev.timestamp);
          const timeStr = ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          const dateStr = ts.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          return (
            <Box key={ev.id} sx={{
              px: 3, py: 2,
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              borderLeft: `3px solid ${sty.color}`,
              display: 'flex', gap: 2.5, alignItems: 'flex-start',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
            }}>
              {/* Time */}
              <Box sx={{ flexShrink: 0, textAlign: 'right', minWidth: 52 }}>
                <Typography variant="caption" sx={{ color: 'var(--text-primary)', fontWeight: 600, display: 'block', fontSize: '0.78rem' }}>{timeStr}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{dateStr}</Typography>
              </Box>

              {/* Icon */}
              <Box sx={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', bgcolor: sty.bg, border: `1px solid ${sty.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sty.color, mt: 0.2 }}>
                {actionIcon[ev.action] ?? <VerifiedUserIcon sx={{ fontSize: 15 }} />}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center', mb: 0.5 }}>
                  <Chip label={ev.action.replace(/_/g, ' ')} size="small"
                    sx={{ fontSize: '0.63rem', fontWeight: 700, bgcolor: sty.bg, color: sty.color, border: `1px solid ${sty.border}` }}
                  />
                  <Chip label={ev.role.toUpperCase()} size="small"
                    sx={{ fontSize: '0.6rem', fontWeight: 600, bgcolor: 'rgba(255,255,255,0.04)', color: roleStyle(ev.role) }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: 'var(--text-primary)', fontWeight: 600, display: 'block', mb: 0.2 }}>
                  {ev.actor} → {ev.target}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ev.details}</Typography>
              </Box>
            </Box>
          );
        })}
        {filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>No audit events match your filters.</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default AuditLogs;
