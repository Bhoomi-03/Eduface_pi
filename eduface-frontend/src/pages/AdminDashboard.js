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
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../utils/api';
import { THEME_COLORS, API_ENDPOINTS } from '../utils/constants';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    parent_number: '',
    section: '',
    department: '',
    sem: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock stats
  const stats = [
    { label: 'Total Students', value: '237', color: THEME_COLORS.PRIMARY },
    { label: 'Present Today', value: '198', color: THEME_COLORS.SECONDARY },
    { label: 'Absent', value: '39', color: '#ff9800' },
    { label: 'Unauthorized Access', value: '3', color: '#f44336' },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(API_ENDPOINTS.STUDENTS);
      console.log('[AdminDashboard] Fetched students:', response.data);
      setStudents(response.data || []);
      if (!response.data || response.data.length === 0) {
        setError('No students found in database');
      }
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch students:', err);
      setError(`Failed to fetch students: ${err.response?.data?.message || err.message}`);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setFormData({ name: '', usn: '', parent_number: '', section: '', department: '', sem: '' });
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleEditClick = (student) => {
    setFormData(student);
    setEditingId(student.id);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiClient.delete(`${API_ENDPOINTS.STUDENTS}/${id}`);
        setSuccess('Student deleted successfully');
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.usn || !formData.parent_number) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`${API_ENDPOINTS.STUDENTS}/${editingId}`, formData);
        setSuccess('Student updated successfully');
      } else {
        await apiClient.post(API_ENDPOINTS.STUDENTS, formData);
        setSuccess('Student added successfully');
      }
      setOpenDialog(false);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: THEME_COLORS.PRIMARY }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stat.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold', color: stat.color, fontSize: '2.5rem' }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Students Section */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Students
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ backgroundColor: THEME_COLORS.SECONDARY }}
            >
              Add Student
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: THEME_COLORS.PRIMARY }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>USN</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Parent Contact</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Section</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sem</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students && students.length > 0 ? (
                    students.map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.usn}</TableCell>
                        <TableCell>{student.parent_number}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>{student.sem}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(student)}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => handleDeleteClick(student.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No students found
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

      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            {editingId ? 'Edit Student' : 'Add New Student'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="USN"
            value={formData.usn}
            onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Parent Contact"
            value={formData.parent_number}
            onChange={(e) => setFormData({ ...formData, parent_number: e.target.value })}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Semester"
            type="number"
            value={formData.sem}
            onChange={(e) => setFormData({ ...formData, sem: e.target.value })}
            margin="normal"
          />

          <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ backgroundColor: THEME_COLORS.SECONDARY }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
