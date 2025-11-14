import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import api from '../utils/api';

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    department: '',
    sem: '',
    section: '',
    parent_number: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/students');
      setStudents(response.data || []);
    } catch (err) {
      console.error('[AdminStudents] Error fetching students:', err);
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        usn: '',
        email: '',
        department: '',
        sem: '',
        section: '',
        parent_number: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = async () => {
    try {
      if (editingStudent) {
        // Update
        await api.put(`/students/${editingStudent.id}`, formData);
      } else {
        // Create
        await api.post('/students', formData);
      }
      setError('');
      fetchStudents();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await api.delete(`/students/${id}`);
      setError('');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Manage Students
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ bgcolor: '#4CAF50' }}
            onClick={() => handleOpenDialog()}
          >
            Add Student
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TextField
          fullWidth
          placeholder="Search by name, USN, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#2E3B55' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>USN</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Section</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                  Actions
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
                filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    sx={{
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.usn}</TableCell>
                    <TableCell>{student.email || '-'}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(student)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Student Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#2E3B55', color: 'white', fontWeight: 'bold' }}>
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="USN"
              value={formData.usn}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, usn: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Department"
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Semester"
              type="number"
              value={formData.sem}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sem: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Section"
              value={formData.section}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, section: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Parent Contact Number"
              value={formData.parent_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parent_number: e.target.value,
                }))
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#4CAF50' }}
              onClick={handleSaveStudent}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default AdminStudents;
