import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import apiClient from '../utils/api';
import { THEME_COLORS, API_ENDPOINTS } from '../utils/constants';

const FacultyDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  // Mock attendance data
  const mockAttendance = [
    {
      _id: 1,
      studentName: 'John Doe',
      rollNumber: 'CSE001',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      time: '09:15 AM',
    },
    {
      _id: 2,
      studentName: 'Jane Smith',
      rollNumber: 'CSE002',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      time: '09:18 AM',
    },
    {
      _id: 3,
      studentName: 'Mike Johnson',
      rollNumber: 'CSE003',
      date: new Date().toISOString().split('T')[0],
      status: 'absent',
      time: '-',
    },
  ];

  // Stats
  const stats = [
    { label: 'Total Students', value: '237', color: THEME_COLORS.PRIMARY },
    { label: 'Present Today', value: '234', color: THEME_COLORS.SECONDARY },
    { label: 'Absent', value: '3', color: '#ff9800' },
    { label: 'Attendance %', value: '98.7%', color: '#4CAF50' },
  ];

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ATTENDANCE}?date=${selectedDate}`);
      console.log('[FacultyDashboard] Fetched attendance:', response.data);
      // Transform response to include time formatting
      const formatted = (response.data || []).map(record => ({
        ...record,
        id: record.id || record._id,
        student_id: record.student_id,
        time: record.time ? record.time.substring(0, 5) : '-'
      }));
      setAttendance(formatted);
    } catch (err) {
      console.error('[FacultyDashboard] Failed to fetch attendance:', err);
      setError(`Failed to fetch attendance: ${err.response?.data?.message || err.message}`);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await apiClient.post(`${API_ENDPOINTS.ATTENDANCE}`, {
        student_id: studentId,
        date: selectedDate,
        status,
      });
      fetchAttendance();
    } catch (err) {
      console.error('Failed to mark attendance:', err);
    }
  };

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const attendancePercentage =
    attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: THEME_COLORS.PRIMARY }}>
        Faculty Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: THEME_COLORS.PRIMARY }}>
                {attendance.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Present
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: THEME_COLORS.SECONDARY }}>
                {presentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Absent
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {absentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Attendance %
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                {attendancePercentage}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Section */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Mark Attendance
            </Typography>
            <Box>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: `1px solid ${THEME_COLORS.PRIMARY}`,
                  fontFamily: 'inherit',
                }}
              />
            </Box>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: THEME_COLORS.PRIMARY }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roll Number</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance && attendance.length > 0 ? (
                    attendance.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{record.studentName}</TableCell>
                        <TableCell>{record.rollNumber}</TableCell>
                        <TableCell>
                          <Chip
                            icon={record.status === 'present' ? <CheckCircleIcon /> : <CancelIcon />}
                            label={record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'N/A'}
                            color={record.status === 'present' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{record.time || '-'}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleMarkAttendance(record.student_id, 'present')}
                            color="success"
                            sx={{ mr: 1 }}
                          >
                            Present
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleMarkAttendance(record.student_id, 'absent')}
                            color="error"
                          >
                            Absent
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No attendance records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Historical Data Section */}
      <Card sx={{ boxShadow: 2, mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <HistoryIcon sx={{ color: THEME_COLORS.PRIMARY }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Attendance History (Last 7 Days)
            </Typography>
          </Box>
          <Alert severity="info">
            Historical attendance data will be displayed here showing trends over the last 7 days.
            You can analyze which students have consistent attendance issues.
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FacultyDashboard;
