import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Search, Edit, Info } from '@mui/icons-material';
import api from '../utils/api';

function FacultyAttendance() {
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all students
      const studentsRes = await api.get('/students');
      setStudents(studentsRes.data || []);

      // Fetch attendance for selected date
      const attendanceRes = await api.get('/attendance', {
        params: { date: selectedDate },
      });

      const attendanceData = attendanceRes.data || [];
      const map = {};
      attendanceData.forEach((record) => {
        if (record.student_id) {
          map[record.student_id] = record;
        }
      });
      setAttendanceMap(map);
    } catch (err) {
      console.error('[FacultyAttendance] Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAttendance = (student) => {
    const existing = attendanceMap[student.id];
    setEditingAttendance({
      student_id: student.id,
      student_name: student.name,
      date: selectedDate,
      status: existing?.status || 'present',
      time: existing?.time || new Date().toLocaleTimeString(),
    });
    setOpenDialog(true);
  };

  const handleSaveAttendance = async () => {
    try {
      if (attendanceMap[editingAttendance.student_id]) {
        // Update existing
        await api.put(
          `/attendance/${attendanceMap[editingAttendance.student_id].id}`,
          {
            status: editingAttendance.status,
            time: editingAttendance.time,
          }
        );
      } else {
        // Create new
        await api.post('/attendance', {
          student_id: editingAttendance.student_id,
          date: editingAttendance.date,
          status: editingAttendance.status,
          time: editingAttendance.time,
        });
      }
      setError('');
      fetchData();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save attendance');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mark Attendance
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            placeholder="Search by name or USN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Attendance Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#2E3B55' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>USN</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="textSecondary">No students found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const attendance = attendanceMap[student.id];
                  return (
                    <TableRow
                      key={student.id}
                      sx={{
                        bgcolor:
                          attendance?.status === 'present'
                            ? 'rgba(76, 175, 80, 0.1)'
                            : attendance?.status === 'absent'
                            ? 'rgba(244, 67, 54, 0.1)'
                            : 'transparent',
                        '&:hover': {
                          bgcolor: '#f5f5f5',
                        },
                      }}
                    >
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.usn}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            bgcolor:
                              attendance?.status === 'present'
                                ? '#4CAF50'
                                : attendance?.status === 'absent'
                                ? '#F44336'
                                : '#9E9E9E',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {attendance?.status?.toUpperCase() || 'UNMARKED'}
                        </Box>
                      </TableCell>
                      <TableCell>{attendance?.time || '-'}</TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleEditAttendance(student)}
                        >
                          Mark
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Attendance Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#2E3B55', color: 'white', fontWeight: 'bold' }}>
            Mark Attendance - {editingAttendance?.student_name}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={editingAttendance?.status || 'present'}
                onChange={(e) =>
                  setEditingAttendance((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                label="Status"
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Time"
              type="time"
              value={editingAttendance?.time || ''}
              onChange={(e) =>
                setEditingAttendance((prev) => ({
                  ...prev,
                  time: e.target.value,
                }))
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#4CAF50' }}
              onClick={handleSaveAttendance}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default FacultyAttendance;
