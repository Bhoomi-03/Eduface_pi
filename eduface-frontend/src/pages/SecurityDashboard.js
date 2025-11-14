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
  Dialog,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import WarningIcon from '@mui/icons-material/Warning';
import apiClient from '../utils/api';
import { THEME_COLORS, API_ENDPOINTS } from '../utils/constants';

const SecurityDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doorStatus, setDoorStatus] = useState('locked');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [doorAction, setDoorAction] = useState('open');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Mock alerts data
  const mockAlerts = [
    {
      _id: 1,
      type: 'unauthorized_entry',
      description: 'Unknown face detected at entrance',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: 'high',
      location: 'Main Gate',
    },
    {
      _id: 2,
      type: 'door_forced',
      description: 'Door opened forcefully',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      severity: 'critical',
      location: 'Back Door',
    },
    {
      _id: 3,
      type: 'suspicious_activity',
      description: 'Multiple failed access attempts',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      severity: 'high',
      location: 'Lab Block',
    },
  ];

  // Stats
  const stats = [
    { label: 'Total Alerts Today', value: '12', color: THEME_COLORS.PRIMARY },
    { label: 'Unauthorized Access', value: '3', color: '#f44336' },
    { label: 'System Events', value: '9', color: '#ff9800' },
    { label: 'Door Status', value: 'Locked', color: THEME_COLORS.SECONDARY },
  ];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(API_ENDPOINTS.ALERTS);
      console.log('[SecurityDashboard] Fetched alerts:', response.data);
      const files = response.data || [];
      // Transform file names into alert objects
      const formattedAlerts = files.map((file, idx) => ({
        _id: idx + 1,
        type: 'unauthorized_entry',
        description: `Alert log: ${file.file || file}`,
        timestamp: file.time ? new Date(file.time).toISOString() : new Date().toISOString(),
        severity: 'high',
        location: 'Unauthorized Access Log',
      }));
      setAlerts(formattedAlerts.length > 0 ? formattedAlerts : mockAlerts);
    } catch (err) {
      console.error('[SecurityDashboard] Failed to fetch alerts:', err);
      setError(`Failed to fetch alerts: ${err.response?.data?.message || err.message}`);
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  const handleDoorAction = async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.DOOR, { action: doorAction });
      setDoorStatus(doorAction === 'open' ? 'opened' : 'locked');
      setSuccess(`Door ${doorAction}ed successfully`);
      setOpenConfirm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${doorAction} door`);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: THEME_COLORS.PRIMARY }}>
        Security Dashboard
      </Typography>

      {/* Door Control Alert */}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Alerts Today
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: THEME_COLORS.PRIMARY }}>
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Unauthorized Access
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                3
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                System Events
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                9
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, backgroundColor: doorStatus === 'locked' ? '#e8f5e9' : '#fff3e0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Door Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {doorStatus === 'locked' ? (
                  <LockIcon sx={{ color: THEME_COLORS.SECONDARY }} />
                ) : (
                  <LockOpenIcon sx={{ color: '#ff9800' }} />
                )}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {doorStatus === 'locked' ? 'Locked' : 'Unlocked'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Door Control Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2, borderTop: `4px solid ${THEME_COLORS.SECONDARY}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🔐 Door Control
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Current Status: <strong>{doorStatus === 'locked' ? 'Locked' : 'Unlocked'}</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<LockOpenIcon />}
                  onClick={() => {
                    setDoorAction('open');
                    setOpenConfirm(true);
                  }}
                  disabled={doorStatus === 'opened'}
                  sx={{
                    backgroundColor: THEME_COLORS.SECONDARY,
                    flex: 1,
                    '&:disabled': { backgroundColor: '#ccc' },
                  }}
                >
                  Unlock Door
                </Button>
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={() => {
                    setDoorAction('close');
                    setOpenConfirm(true);
                  }}
                  disabled={doorStatus === 'locked'}
                  sx={{
                    backgroundColor: '#f44336',
                    flex: 1,
                    '&:disabled': { backgroundColor: '#ccc' },
                  }}
                >
                  Lock Door
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2, borderTop: `4px solid #4CAF50` }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📊 System Health
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Camera Feed</Typography>
                  <Chip label="Online" color="success" size="small" />
                </Box>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Door Lock</Typography>
                  <Chip label="Operational" color="success" size="small" />
                </Box>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Network</Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts Section */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <WarningIcon sx={{ color: '#f44336' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Security Alerts
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: THEME_COLORS.PRIMARY }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Severity</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts && alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <TableRow key={alert._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {alert.type ? alert.type.replace(/_/g, ' ').toUpperCase() : 'ALERT'}
                          </Typography>
                        </TableCell>
                        <TableCell>{alert.description || '-'}</TableCell>
                        <TableCell>{alert.location || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={alert.severity ? alert.severity.toUpperCase() : 'MEDIUM'}
                            color={getSeverityColor(alert.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{alert.timestamp ? formatTime(alert.timestamp) : '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No alerts at this time
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

      {/* Door Action Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Confirm Action
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Are you sure you want to <strong>{doorAction}</strong> the door?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleDoorAction}
              sx={{ backgroundColor: THEME_COLORS.SECONDARY }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default SecurityDashboard;
