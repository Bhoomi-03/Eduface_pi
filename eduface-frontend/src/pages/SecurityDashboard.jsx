import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { Security, WarningAmber, Apartment, CheckCircle } from '@mui/icons-material';
import StatsCard from '../components/StatsCard';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

function SecurityDashboard() {
  const { userName } = useAuth();
  const [stats, setStats] = useState({
    unauthorizedCount: 0,
    alertCount: 0,
    doorStatus: 'locked',
    lastAlert: 'No recent alerts',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cameraUrl] = useState('http://raspberrypi:8081/?action=stream');

  useEffect(() => {
    fetchDashboardData();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');

      // Fetch alerts
      const alertsRes = await api.get('/alerts');
      const alerts = alertsRes.data || [];
      const today = new Date().toISOString().split('T')[0];
      const todayAlerts = alerts.filter((a) => a.date === today);
      const unauthorizedCount = todayAlerts.filter(
        (a) => a.type === 'unauthorized'
      ).length;

      const lastAlert = todayAlerts.length > 0
        ? new Date(todayAlerts[0].timestamp).toLocaleTimeString()
        : 'No recent alerts';

      setStats({
        unauthorizedCount,
        alertCount: todayAlerts.length,
        doorStatus: 'locked', // Mock data
        lastAlert,
      });

      setLoading(false);
    } catch (err) {
      console.error('[SecurityDashboard] Error fetching data:', err);
      if (loading) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setLoading(false);
      }
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Security Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Welcome, {userName}. Monitor facility access in real-time.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Security sx={{ fontSize: 32 }} />}
              label="Unauthorized Today"
              value={stats.unauthorizedCount}
              color="#F44336"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<WarningAmber sx={{ fontSize: 32 }} />}
              label="Total Alerts"
              value={stats.alertCount}
              color="#FF9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Apartment sx={{ fontSize: 32 }} />}
              label="Door Status"
              value={stats.doorStatus?.toUpperCase() || 'LOCKED'}
              color="#2196F3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<CheckCircle sx={{ fontSize: 32 }} />}
              label="Last Alert"
              value={stats.lastAlert}
              color="#4CAF50"
            />
          </Grid>
        </Grid>

        {/* Camera Feed */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Live Camera Feed
            </Typography>
            <Box
              sx={{
                bgcolor: '#000',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                paddingBottom: '75%', // 4:3 aspect ratio
              }}
            >
              <img
                src={cameraUrl}
                alt="Live Camera Feed"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={() => (
                  <Box sx={{ p: 4, textAlign: 'center', color: '#fff' }}>
                    Camera feed unavailable. Please check MJPEG streamer on Pi.
                  </Box>
                )}
              />
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              🔴 Live stream from entrance camera (updates every 5 seconds)
            </Typography>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Apartment sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Door Control
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Lock/unlock and control access
                </Typography>
                <Button variant="contained" sx={{ bgcolor: '#2196F3' }} fullWidth>
                  Go to Control Panel
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <WarningAmber sx={{ fontSize: 48, color: '#F44336', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  View Alerts
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Review unauthorized access attempts
                </Typography>
                <Button variant="contained" sx={{ bgcolor: '#F44336' }} fullWidth>
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default SecurityDashboard;
