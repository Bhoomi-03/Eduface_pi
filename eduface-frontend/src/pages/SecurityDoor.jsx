import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
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
  TextField,
} from '@mui/material';
import { Lock, LockOpen, History } from '@mui/icons-material';
import api from '../utils/api';

function SecurityDoor() {
  const [doorStatus, setDoorStatus] = useState('locked');
  const [actionLog, setActionLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    fetchDoorStatus();
  }, []);

  const fetchDoorStatus = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch door status
      const statusRes = await api.get('/door/status');
      setDoorStatus(statusRes.data?.status || 'locked');

      // Fetch action log
      const logRes = await api.get('/door/log');
      setActionLog(logRes.data || []);
    } catch (err) {
      console.error('[SecurityDoor] Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load door status');
    } finally {
      setLoading(false);
    }
  };

  const handleDoorAction = (action) => {
    setPendingAction(action);
    setOpenDialog(true);
  };

  const executeAction = async () => {
    try {
      setError('');
      setSuccess('');

      await api.post('/door/open', {
        action: pendingAction,
        reason: actionReason,
      });

      setSuccess(`Door ${pendingAction} successfully`);
      setOpenDialog(false);
      setActionReason('');
      setPendingAction(null);
      
      // Refresh status
      setTimeout(fetchDoorStatus, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to execute action');
    }
  };

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
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Door Control System
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {/* Door Status Card */}
        <Card sx={{ mb: 4, bgcolor: doorStatus === 'locked' ? '#f3e5f5' : '#e8f5e9' }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <Box sx={{ mb: 3 }}>
              {doorStatus === 'locked' ? (
                <Lock sx={{ fontSize: 80, color: '#9C27B0' }} />
              ) : (
                <LockOpen sx={{ fontSize: 80, color: '#4CAF50' }} />
              )}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Door Status: <span style={{ color: doorStatus === 'locked' ? '#9C27B0' : '#4CAF50' }}>
                {doorStatus?.toUpperCase()}
              </span>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              Last update: {new Date().toLocaleString()}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: '#4CAF50' }}
                  startIcon={<LockOpen />}
                  onClick={() => handleDoorAction('unlock')}
                  disabled={doorStatus === 'unlocked'}
                >
                  Unlock Door
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: '#9C27B0' }}
                  startIcon={<Lock />}
                  onClick={() => handleDoorAction('lock')}
                  disabled={doorStatus === 'locked'}
                >
                  Lock Door
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Log */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <History />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Actions
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead sx={{ bgcolor: '#2E3B55' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Timestamp
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Action
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Performed By
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      Reason
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actionLog.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                        <Typography color="textSecondary">No actions recorded yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    actionLog.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 1,
                              borderRadius: 1,
                              bgcolor:
                                log.action === 'unlock' ? '#4CAF50' : '#9C27B0',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.875rem',
                            }}
                          >
                            {log.action?.toUpperCase()}
                          </Box>
                        </TableCell>
                        <TableCell>{log.performedBy || 'System'}</TableCell>
                        <TableCell>{log.reason || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Action Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#2E3B55', color: 'white', fontWeight: 'bold' }}>
            Confirm {pendingAction?.toUpperCase()} Action
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to {pendingAction} the door?
            </Typography>
            <TextField
              fullWidth
              label="Reason for Action"
              placeholder="e.g., Authorized visitor, Maintenance, etc."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              sx={{
                bgcolor:
                  pendingAction === 'unlock' ? '#4CAF50' : '#9C27B0',
              }}
              onClick={executeAction}
            >
              Confirm {pendingAction?.toUpperCase()}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default SecurityDoor;
