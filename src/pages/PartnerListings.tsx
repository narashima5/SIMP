import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button,
  TextField, InputAdornment, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const mockPartners = [
  {
    _id: 'org_001',
    name: 'InnovateTech Solutions Pvt. Ltd.',
    industry: 'Software Development',
    location: 'Bangalore, Karnataka',
    website: 'https://innovatetech.example.com',
    activeListings: 3,
    totalPlacements: 12,
    currentInterns: 3,
    contactPerson: 'Ranjith Mohan',
    contactEmail: 'hr@innovatetech.example.com',
    partnerSince: '2023',
    status: 'active',
    domains: ['Full Stack', 'Cloud', 'Mobile'],
    description: 'A leading software product company specialising in enterprise SaaS solutions. Known for strong mentorship culture and good stipends.',
  },
  {
    _id: 'org_002',
    name: 'DataStream Analytics',
    industry: 'Data & Analytics',
    location: 'Remote / Chennai',
    website: 'https://datastream.example.com',
    activeListings: 2,
    totalPlacements: 7,
    currentInterns: 2,
    contactPerson: 'Ananya Krishnamurthy',
    contactEmail: 'recruit@datastream.example.com',
    partnerSince: '2023',
    status: 'active',
    domains: ['Data Engineering', 'BI', 'Cloud'],
    description: 'A data-first company building analytics platforms for the retail and logistics sectors. Strong Python/Spark tech stack.',
  },
  {
    _id: 'org_003',
    name: 'NeuralWorks AI',
    industry: 'Artificial Intelligence',
    location: 'Hyderabad, Telangana',
    website: 'https://neuralworks.example.com',
    activeListings: 1,
    totalPlacements: 5,
    currentInterns: 1,
    contactPerson: 'Dr. Karan Bhatia',
    contactEmail: 'talent@neuralworks.example.com',
    partnerSince: '2024',
    status: 'active',
    domains: ['ML', 'Computer Vision', 'NLP'],
    description: 'An AI research-driven startup working on production ML systems. Ideal for students with strong Python and ML fundamentals.',
  },
  {
    _id: 'org_004',
    name: 'FinEdge Technologies',
    industry: 'FinTech',
    location: 'Mumbai, Maharashtra',
    website: 'https://finedge.example.com',
    activeListings: 1,
    totalPlacements: 4,
    currentInterns: 1,
    contactPerson: 'Sneha Patel',
    contactEmail: 'hr@finedge.example.com',
    partnerSince: '2024',
    status: 'active',
    domains: ['Backend', 'Product', 'Finance'],
    description: 'FinTech startup transforming lending and payment infrastructure for SMEs. High-growth environment with cross-functional exposure.',
  },
  {
    _id: 'org_005',
    name: 'SecureNet Dynamics',
    industry: 'Cybersecurity',
    location: 'Chennai, Tamil Nadu',
    website: 'https://securenet.example.com',
    activeListings: 1,
    totalPlacements: 3,
    currentInterns: 1,
    contactPerson: 'Vikash Rao',
    contactEmail: 'jobs@securenet.example.com',
    partnerSince: '2024',
    status: 'new',
    domains: ['Security', 'Networking', 'Pen Testing'],
    description: 'A cybersecurity operations company offering internships in SOC, threat intelligence, and penetration testing.',
  },
  {
    _id: 'org_006',
    name: 'CreativeNest Studios',
    industry: 'Design & Media',
    location: 'Bangalore, Karnataka',
    website: 'https://creativenest.example.com',
    activeListings: 0,
    totalPlacements: 2,
    currentInterns: 0,
    contactPerson: 'Meena Iyer',
    contactEmail: 'intern@creativenest.example.com',
    partnerSince: '2024',
    status: 'inactive',
    domains: ['UI/UX', 'Brand Design', 'Motion'],
    description: 'A boutique design studio crafting digital experiences for startups and enterprises. Great for UI/UX and product design students.',
  },
];

const PartnerListings: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof mockPartners[0] | null>(null);

  const filtered = mockPartners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === 'active' ? 'var(--success)' : s === 'new' ? 'var(--primary)' : 'var(--text-muted)';
  const statusBg = (s: string) =>
    s === 'active' ? 'rgba(16,185,129,0.1)' : s === 'new' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)';

  return (
    <Box className="anim-fade-in" sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)', mb: 0.5 }}>
          Corporate Partner Listings
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          Registered partner organisations offering internship placements for your students.
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Partners', value: mockPartners.length, icon: <BusinessIcon />, color: 'var(--primary)' },
          { label: 'Active Listings', value: mockPartners.reduce((a, p) => a + p.activeListings, 0), icon: <WorkIcon />, color: 'var(--accent)' },
          { label: 'Total Placements', value: mockPartners.reduce((a, p) => a + p.totalPlacements, 0), icon: <GroupsIcon />, color: 'var(--success)' },
        ].map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Card className="glass-panel" sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 'var(--border-radius-md)', bgcolor: `${stat.color}18`, color: stat.color }}>{stat.icon}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{stat.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <TextField
        fullWidth size="small" placeholder="Search by name, industry, or location..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'var(--text-muted)' }} /></InputAdornment>, className: 'glass-input' } }}
        sx={{ mb: 3, '& input': { color: '#fff' } }}
      />

      {/* Cards grid */}
      <Grid container spacing={3}>
        {filtered.map((partner) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={partner._id}>
            <Card
              className="glass-panel"
              onClick={() => setSelected(partner)}
              sx={{ p: 0, cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-3px)', borderColor: 'var(--primary) !important', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' } }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 'var(--border-radius-sm)', bgcolor: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BusinessIcon sx={{ color: 'var(--primary)', fontSize: 22 }} />
                  </Box>
                  <Chip label={partner.status.toUpperCase()} size="small"
                    sx={{ fontSize: '0.63rem', fontWeight: 700, bgcolor: statusBg(partner.status), color: statusColor(partner.status), border: `1px solid ${statusColor(partner.status)}30` }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.3, lineHeight: 1.3 }}>{partner.name}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 1.5 }}>
                  {partner.industry} · {partner.location}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {partner.domains.map((d) => (
                    <Chip key={d} label={d} size="small"
                      sx={{ fontSize: '0.65rem', bgcolor: 'rgba(20,184,166,0.08)', color: 'var(--accent)', border: '1px solid rgba(20,184,166,0.2)' }}
                    />
                  ))}
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
                <Grid container spacing={1}>
                  {[
                    { label: 'Active Listings', value: partner.activeListings },
                    { label: 'Total Placed', value: partner.totalPlacements },
                    { label: 'Current Interns', value: partner.currentInterns },
                  ].map((s) => (
                    <Grid size={4} key={s.label} sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{s.label}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)' } } }}
      >
        {selected && (
          <>
            <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{selected.name}</DialogTitle>
            <DialogContent>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mb: 2 }}>
                {selected.industry} · {selected.location} · Partner since {selected.partnerSince}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2.5, lineHeight: 1.7 }}>{selected.description}</Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600, display: 'block', mb: 1 }}>CONTACT DETAILS</Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selected.contactPerson}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--primary)' }}>{selected.contactEmail}</Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setSelected(null)} sx={{ color: 'var(--text-secondary)' }}>Close</Button>
              <Button variant="outlined" startIcon={<OpenInNewIcon />}
                sx={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                href={selected.website} target="_blank"
              >Visit Website</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PartnerListings;
