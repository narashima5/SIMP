import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studentService } from '@/services/student';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InternshipCard from '@/components/InternshipCard';
import type { InternshipData } from '@/components/InternshipCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export const InternshipListing: React.FC = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply dialog state
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Fetch open listings
      const listRes = await studentService.getInternships(searchTerm);
      setInternships(listRes.data || []);

      if (user?.role === 'student') {
        const appsRes = await studentService.getApplications();
        const applied = new Set<string>(
          (appsRes.data || []).map((app: any) => 
            typeof app.internship === 'object' ? app.internship._id : app.internship
          )
        );
        setAppliedIds(applied);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load internship listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchTerm]);

  const handleOpenApply = (id: string) => {
    setSelectedInternshipId(id);
    setCoverLetter('I am highly interested in this internship because it matches my technological competencies.');
    setApplyDialogOpen(true);
  };

  const handleCloseApply = () => {
    setApplyDialogOpen(false);
    setSelectedInternshipId(null);
    setCoverLetter('');
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternshipId) return;

    try {
      setSubmitting(true);
      await studentService.applyInternship({
        internshipId: selectedInternshipId,
        coverLetter,
      });
      handleCloseApply();
      fetchListings();
    } catch (err: any) {
      alert(err.message || 'Failed to apply for the internship');
    } finally {
      setSubmitting(false);
    }
  };

  // Local filtering for location
  const filteredListings = internships.filter((item) => {
    if (locationFilter === 'All') return true;
    const loc = item.location.toLowerCase();
    if (locationFilter === 'Remote') return loc === 'remote';
    if (locationFilter === 'Onsite') return loc.includes('onsite') || (!loc.includes('remote') && !loc.includes('hybrid'));
    if (locationFilter === 'Hybrid') return loc.includes('hybrid');
    return true;
  });

  if (loading && internships.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - var(--header-height))', color: 'var(--text-primary)' }}>
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', mb: 1 }}>
            Internship Opportunities
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Browse active roles, filter results, and apply directly.
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
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
                  className: 'glass-input',
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
      {filteredListings.length === 0 ? (
        <Box sx={{ py: 8, textAlignment: 'center' }}>
          <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
            No internship listings found matching your search.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredListings.map((item) => (
            <Grid size={{ xs: 12, md: 6 }} key={item._id}>
              <InternshipCard
                internship={item}
                onApply={handleOpenApply}
                isStudent={user?.role === 'student'}
                hasApplied={appliedIds.has(item._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Apply Dialog with Cover Letter */}
      <Dialog
        open={applyDialogOpen}
        onClose={handleCloseApply}
        slotProps={{
          paper: {
            sx: {
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-lg)',
              width: '100%',
              maxWidth: '500px',
            },
          },
        }}
      >
        <form onSubmit={handleApplySubmit}>
          <DialogTitle sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Apply for Internship
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
              Briefly describe why you are a good fit for this role. Your uploaded profile resume will be attached automatically.
            </Typography>
            <TextField
              label="Cover Letter"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              placeholder="Write a brief cover letter..."
              slotProps={{
                input: { className: 'glass-input' },
                inputLabel: { style: { color: 'var(--text-secondary)' } },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Button onClick={handleCloseApply} sx={{ color: 'var(--text-secondary)' }} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !coverLetter.trim()}
              sx={{
                background: 'var(--primary)',
                color: '#fff',
                '&:hover': { background: 'var(--primary-hover)' },
              }}
            >
              {submitting ? 'Applying...' : 'Submit Application'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default InternshipListing;
