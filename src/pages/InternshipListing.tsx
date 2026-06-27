import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Mock listings representing initial data for testing
const initialInternships = [
  {
    id: 'intern_mock_505',
    title: 'Full Stack React Developer Intern',
    company: 'TechCorp Solutions',
    description: 'We are looking for a Node.js & React developer to join our core product team.',
    skillsRequired: ['React.js', 'Node.js', 'Express', 'Mongoose', 'API Design'],
    durationWeeks: 12,
    location: 'Remote',
    stipend: 25000,
    status: 'open',
  },
  {
    id: 'intern_mock_506',
    title: 'UI/UX Design Trainee',
    company: 'TechCorp Labs',
    description: 'Collaborate with product designers to design interactive dashboards.',
    skillsRequired: ['Figma', 'Aesthetic Principles', 'Prototyping', 'CSS3'],
    durationWeeks: 8,
    location: 'Onsite (Bangalore)',
    stipend: 15000,
    status: 'open',
  },
  {
    id: 'intern_mock_507',
    title: 'Data Science Intern',
    company: 'FinAnalytics Inc',
    description: 'Build predictive machine learning algorithms on financial tabular data.',
    skillsRequired: ['Python', 'Pandas', 'Scikit-Learn', 'SQL'],
    durationWeeks: 16,
    location: 'Hybrid (Hyderabad)',
    stipend: 30000,
    status: 'filled',
  },
];

export const InternshipListing: React.FC = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState(initialInternships);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  
  // Modal state for posting a new internship
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    durationWeeks: '',
    stipend: '',
    location: 'Remote',
    skills: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = newPost.skills.split(',').map((s) => s.trim()).filter((s) => s);
    const addedItem = {
      id: `intern_mock_${Date.now()}`,
      title: newPost.title,
      company: user?.details?.organizationName || 'TechCorp Labs',
      description: newPost.description,
      skillsRequired: skillsArray.length > 0 ? skillsArray : ['Node.js'],
      durationWeeks: parseInt(newPost.durationWeeks) || 12,
      location: newPost.location,
      stipend: parseInt(newPost.stipend) || 0,
      status: 'open' as const,
    };

    setInternships([addedItem, ...internships]);
    setNewPost({ title: '', description: '', durationWeeks: '', stipend: '', location: 'Remote', skills: '' });
    handleClose();
  };

  // Filtering
  const filteredListings = internships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skillsRequired.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      locationFilter === 'All' ||
      (locationFilter === 'Remote' && item.location.toLowerCase() === 'remote') ||
      (locationFilter === 'Onsite' && item.location.toLowerCase().includes('onsite')) ||
      (locationFilter === 'Hybrid' && item.location.toLowerCase().includes('hybrid'));

    return matchesSearch && matchesLocation;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - var(--header-height))', color: 'var(--text-primary)' }}>
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', mb: 1 }}>
            Internship Opportunities
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {user?.role === 'organization'
              ? 'Manage and post opportunities for prospective students.'
              : 'Browse active roles, filter results, and apply directly.'}
          </Typography>
        </Box>

        {user?.role === 'organization' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important',
              color: '#fff !important',
              fontWeight: 600,
            }}
          >
            Post Internship
          </Button>
        )}
      </Box>

      {/* Filter Bar */}
      <Card sx={{ p: 2, mb: 4, background: 'rgba(19,27,46,0.4) !important', border: '1px solid var(--border-color)' }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'var(--text-muted)' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& input': { color: '#fff' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <FormControl fullWidth size="small">
              <Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                sx={{
                  color: '#fff',
                  border: '1px solid var(--border-color)',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
              >
                <MenuItem value="All">All Locations</MenuItem>
                <MenuItem value="Remote">Remote Only</MenuItem>
                <MenuItem value="Onsite">Onsite Only</MenuItem>
                <MenuItem value="Hybrid">Hybrid Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Grid listing */}
      <Grid container spacing={3}>
        {filteredListings.map((item) => (
          <Grid size={{ xs: 12, md: 6 }} key={item.id}>
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
                    <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                      {item.company}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.status.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: item.status === 'open' ? 'var(--success-glow)' : 'var(--border-color)',
                      color: item.status === 'open' ? 'var(--success)' : 'var(--text-muted)',
                      border: `1px solid ${item.status === 'open' ? 'var(--success)' : 'var(--border-color)'}`,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3, lineClamp: 2 }}>
                  {item.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                      {item.location}
                    </Typography>
                  </Grid>
                  <Grid size={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                      {item.durationWeeks} Weeks
                    </Typography>
                  </Grid>
                  <Grid size={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentsIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                      ₹{item.stipend.toLocaleString()}/month
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {item.skillsRequired.map((skill) => (
                    <Chip key={skill} label={skill} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }} />
                  ))}
                </Box>
              </CardContent>

              <Box sx={{ p: 3, pt: 0, borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'flex-end' }}>
                {user?.role === 'student' && item.status === 'open' ? (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: 'var(--primary) !important',
                      color: '#fff !important',
                      fontWeight: 600,
                    }}
                  >
                    Quick Apply
                  </Button>
                ) : (
                  <Button variant="outlined" size="small" sx={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                    View Posting
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Posting Internship (Organization Only) */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreatePost}>
          <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Post Internship Opportunity</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Internship Title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Role Description & Scope"
                  name="description"
                  value={newPost.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Duration (Weeks)"
                  name="durationWeeks"
                  type="number"
                  value={newPost.durationWeeks}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Stipend (Monthly ₹)"
                  name="stipend"
                  type="number"
                  value={newPost.stipend}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <Select name="location" value={newPost.location} onChange={handleInputChange as any}>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Onsite (Bangalore)">Onsite (Bangalore)</MenuItem>
                    <MenuItem value="Onsite (Hyderabad)">Onsite (Hyderabad)</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Skills Required (Comma separated)"
                  name="skills"
                  value={newPost.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. React, Python, Figma"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ background: 'var(--primary) !important', color: '#fff !important' }}>
              Publish
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
export default InternshipListing;
