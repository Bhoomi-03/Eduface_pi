import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search, Image, CheckCircle, Block } from '@mui/icons-material';
import api from '../utils/api';

function SecurityAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
    // Poll for new alerts every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setError('');
      const response = await api.get('/alerts');
      const alertsData = response.data || [];
      
      // Sort by timestamp, most recent first
      alertsData.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setAlerts(alertsData);
      setLoading(false);
    } catch (err) {
      console.error('[SecurityAlerts] Error fetching alerts:', err);
      if (loading) {
        setError(err.response?.data?.message || 'Failed to load alerts');
        setLoading(false);
      }
    }
  };

  const handleApprove = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}`, { status: 'approved' });
      setError('');
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve alert');
    }
  };

  const handleDeny = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}`, { status: 'denied' });
      setError('');
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deny alert');
    }
  };

  const handleViewImage = (alert) => {
    setSelectedAlert(alert);
    setOpenImageDialog(true);
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type?.toLowerCase().includes(searchTerm.toLowerCase())
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
          Security Alerts
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TextField
          fullWidth
          placeholder="Search by person name or alert type..."
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Timestamp
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Type
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Person
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="textSecondary">
                      {alerts.length === 0 ? 'No alerts recorded' : 'No results found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => (
                  <TableRow
                    key={alert.id}
                    sx={{
                      bgcolor:
                        alert.type === 'unauthorized'
                          ? 'rgba(244, 67, 54, 0.1)'
                          : 'transparent',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell>
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.type?.toUpperCase()}
                        color={
                          alert.type === 'unauthorized'
                            ? 'error'
                            : 'primary'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {alert.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.status?.toUpperCase() || 'PENDING'}
                        variant="outlined"
                        size="small"
                        color={
                          alert.status === 'approved'
                            ? 'success'
                            : alert.status === 'denied'
                            ? 'error'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {alert.image_path && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Image />}
                            onClick={() => handleViewImage(alert)}
                          >
                            View
                          </Button>
                        )}
                        {!alert.status || alert.status === 'pending' ? (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ bgcolor: '#4CAF50' }}
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(alert.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ bgcolor: '#F44336' }}
                              startIcon={<Block />}
                              onClick={() => handleDeny(alert.id)}
                            >
                              Deny
                            </Button>
                          </>
                        ) : null}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Image Dialog */}
        <Dialog
          open={openImageDialog}
          onClose={() => setOpenImageDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#2E3B55', color: 'white', fontWeight: 'bold' }}>
            Alert Image - {selectedAlert?.name}
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
            {selectedAlert?.image_path ? (
              <Box
                component="img"
                src={selectedAlert.image_path}
                alt="Alert"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 400,
                  borderRadius: 1,
                }}
              />
            ) : (
              <Typography color="textSecondary">No image available</Typography>
            )}
            <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
              Captured: {new Date(selectedAlert?.timestamp).toLocaleString()}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenImageDialog(false)}>Close</Button>
            {selectedAlert && (!selectedAlert.status || selectedAlert.status === 'pending') && (
              <>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#4CAF50' }}
                  onClick={() => {
                    handleApprove(selectedAlert.id);
                    setOpenImageDialog(false);
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#F44336' }}
                  onClick={() => {
                    handleDeny(selectedAlert.id);
                    setOpenImageDialog(false);
                  }}
                >
                  Deny
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default SecurityAlerts;
