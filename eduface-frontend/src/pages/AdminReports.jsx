import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { SaveAlt, GetApp } from '@mui/icons-material';
import { exportToCSV, exportToExcel } from '../utils/exports';
import api from '../utils/api';

function AdminReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    section: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const generateReport = async (format) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Fetch attendance data with filters
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.department) params.append('department', filters.department);

      const response = await api.get(`/attendance?${params.toString()}`);
      const attendanceData = response.data || [];

      if (attendanceData.length === 0) {
        setError('No attendance records found for the selected filters');
        return;
      }

      // Prepare data for export
      const exportData = attendanceData.map((record) => ({
        'Student Name': record.student?.name || 'N/A',
        'USN': record.student?.usn || 'N/A',
        'Date': new Date(record.date).toLocaleDateString(),
        'Time': record.time || '-',
        'Status': record.status || '-',
        'Department': record.student?.department || 'N/A',
      }));

      if (format === 'csv') {
        exportToCSV(exportData, 'attendance_report');
      } else if (format === 'excel') {
        exportToExcel(exportData, 'attendance_report');
      }

      setSuccess(`Report exported successfully as ${format.toUpperCase()}`);
    } catch (err) {
      console.error('[AdminReports] Error generating report:', err);
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Attendance Reports
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Filter Options
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  placeholder="e.g., CSE"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Section"
                  name="section"
                  value={filters.section}
                  onChange={handleFilterChange}
                  placeholder="e.g., A"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Export Buttons */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <SaveAlt sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Export as CSV
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Download attendance report as CSV file
                </Typography>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#4CAF50' }}
                  startIcon={<SaveAlt />}
                  onClick={() => generateReport('csv')}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Export CSV'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <GetApp sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Export as Excel
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Download attendance report as Excel file
                </Typography>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#2196F3' }}
                  startIcon={<GetApp />}
                  onClick={() => generateReport('excel')}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Export Excel'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Info Box */}
        <Card sx={{ mt: 4, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              💡 <strong>Tip:</strong> Leave date fields empty to include all records. You can filter by
              date range, department, or section to generate customized reports.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default AdminReports;
