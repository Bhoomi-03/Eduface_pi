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
} from '@mui/material';
import { People, CheckCircle, TrendingUp, Event } from '@mui/icons-material';
import StatsCard from '../components/StatsCard';
import { Line as ChartLine } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, ChartLegend);

function FacultyDashboard() {
  const { userName } = useAuth();
  const [stats, setStats] = useState({
    totalClasses: 0,
    attendanceRate: 0,
    totalStudents: 0,
    recentCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch students count
      const studentsRes = await api.get('/students');
      const totalStudents = studentsRes.data?.length || 0;

      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0];
      const attendanceRes = await api.get('/attendance', {
        params: { date: today },
      });

      const todayAttendance = attendanceRes.data || [];
      const presentToday = todayAttendance.filter(
        (a) => a.status === 'present'
      ).length;

      const attendanceRate = totalStudents
        ? Math.round((presentToday / totalStudents) * 100)
        : 0;

      setStats({
        totalClasses: 5, // Mock data
        attendanceRate,
        totalStudents,
        recentCount: presentToday,
      });

      // Mock chart data
      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: 'Daily Attendance %',
            data: [80, 85, 82, 88, 90],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      });
    } catch (err) {
      console.error('[FacultyDashboard] Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
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
          Welcome back, {userName || 'Faculty'}!
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Here's your classroom attendance overview
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Event sx={{ fontSize: 32 }} />}
              label="Total Classes"
              value={stats.totalClasses}
              color="#4CAF50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<People sx={{ fontSize: 32 }} />}
              label="Total Students"
              value={stats.totalStudents}
              color="#2196F3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<CheckCircle sx={{ fontSize: 32 }} />}
              label="Present Today"
              value={stats.recentCount}
              color="#FF9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<TrendingUp sx={{ fontSize: 32 }} />}
              label="Attendance %"
              value={`${stats.attendanceRate}%`}
              color="#9C27B0"
            />
          </Grid>
        </Grid>

        {/* Chart */}
        {chartData && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                This Week's Attendance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ChartLine
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Quick Info */}
        <Card sx={{ bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Tips
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Use the Attendance section to mark attendance and view student details
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Generate reports to track attendance trends over time
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • All attendance records are automatically synced with the face recognition system
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default FacultyDashboard;
