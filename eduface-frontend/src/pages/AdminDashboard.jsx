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
import { People, CheckCircle, TrendingUp, Warning } from '@mui/icons-material';
import StatsCard from '../components/StatsCard';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Line as ChartLine } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, ChartLegend);

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0,
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

      const studentsRes = await api.get('/students');
      const totalStudents = studentsRes.data?.length || 0;

      const today = new Date().toISOString().split('T')[0];
      const attendanceRes = await api.get('/attendance', {
        params: { date: today },
      });

      const todayAttendance = attendanceRes.data || [];
      const presentToday = todayAttendance.filter(
        (a) => a.status === 'present'
      ).length;
      const absentToday = todayAttendance.filter(
        (a) => a.status === 'absent'
      ).length;

      const attendanceRate = totalStudents
        ? Math.round((presentToday / totalStudents) * 100)
        : 0;

      setStats({
        totalStudents,
        presentToday,
        absentToday,
        attendanceRate,
      });

      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: 'Average Attendance %',
            data: [85, 88, 82, 90, 87],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Admin Dashboard
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<People sx={{ fontSize: 32 }} />}
              label="Total Students"
              value={stats.totalStudents}
              color="#4CAF50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<CheckCircle sx={{ fontSize: 32 }} />}
              label="Present Today"
              value={stats.presentToday}
              color="#2196F3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<Warning sx={{ fontSize: 32 }} />}
              label="Absent Today"
              value={stats.absentToday}
              color="#FF9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              icon={<TrendingUp sx={{ fontSize: 32 }} />}
              label="Attendance Rate"
              value={`${stats.attendanceRate}%`}
              color="#9C27B0"
            />
          </Grid>
        </Grid>

        {chartData && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Weekly Attendance Trend
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

        <Grid container spacing={3} sx={{ mt: 2 }}>
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
              <CardContent sx={{ textAlign: 'center' }}>
                <People sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Manage Students
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View, add, or edit student information
                </Typography>
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
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  View Reports
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Generate and download attendance reports
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
