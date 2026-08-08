import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import StatusBadge from './StatusBadge';

export interface ApplicationData {
  _id: string;
  student: {
    _id: string;
    name: string;
    studentId: string;
    department: string;
  } | any;
  internship: {
    _id: string;
    title: string;
    organization?: any;
  } | any;
  status: string;
  appliedDate: string | Date;
  coverLetter?: string;
  feedback?: string;
}

interface ApplicationTableProps {
  applications: ApplicationData[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isCoordinator?: boolean;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onApprove,
  onReject,
  isCoordinator = false,
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student / ID</TableCell>
            <TableCell>Internship Title</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Status</TableCell>
            {isCoordinator && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isCoordinator ? 6 : 5} align="center" sx={{ py: 6, color: 'var(--text-muted)' }}>
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => {
              const studentName = typeof app.student === 'object' ? app.student.name : 'Unknown';
              const studentId = typeof app.student === 'object' ? app.student.studentId : '';
              const jobTitle = typeof app.internship === 'object' ? app.internship.title : 'Unknown Role';
              
              let companyName = 'Unknown Company';
              if (typeof app.internship === 'object' && app.internship.organization) {
                companyName = typeof app.internship.organization === 'object'
                  ? app.internship.organization.name
                  : app.internship.organization;
              }

              const formattedDate = new Date(app.appliedDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <TableRow key={app._id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.01)' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {studentName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      {studentId}
                    </Typography>
                  </TableCell>
                  <TableCell>{jobTitle}</TableCell>
                  <TableCell>{companyName}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  {isCoordinator && (
                    <TableCell align="right">
                      {app.status === 'pending' ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => onApprove && onApprove(app._id)}
                            startIcon={<CheckIcon />}
                            sx={{ color: '#fff !important', fontWeight: 600 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => onReject && onReject(app._id)}
                            startIcon={<CloseIcon />}
                            sx={{ fontWeight: 600 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Reviewed
                        </Typography>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApplicationTable;
