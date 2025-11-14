import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Security,
  Person,
  BarChart,
  Speed,
  Lock,
  Smartphone,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else if (role === 'security') navigate('/security/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const features = [
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Face Recognition',
      description: 'Advanced AI-powered face recognition for accurate attendance',
    },
    {
      icon: <BarChart sx={{ fontSize: 40 }} />,
      title: 'Smart Analytics',
      description: 'Real-time attendance analytics and reporting',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Fast & Reliable',
      description: 'Lightning-fast recognition with 99.9% accuracy',
    },
    {
      icon: <Lock sx={{ fontSize: 40 }} />,
      title: 'Secure Access',
      description: 'Role-based access control and secure authentication',
    },
    {
      icon: <Smartphone sx={{ fontSize: 40 }} />,
      title: 'Multi-Device',
      description: 'Access from any device - desktop, tablet, or mobile',
    },
    {
      icon: <Person sx={{ fontSize: 40 }} />,
      title: 'User Management',
      description: 'Easy student and faculty management system',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#2E3B55' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bold' }}>
            EduFace
          </Typography>
          <Button color="inherit" onClick={() => navigate('/signin')}>
            Sign In
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2, bgcolor: '#4CAF50' }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E3B55 0%, #4CAF50 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to EduFace
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Smart Face Recognition Attendance System for Educational Institutions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: '#2E3B55' }}
              onClick={() => navigate('/signin')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            Why Choose EduFace?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    textAlign: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box sx={{ color: '#4CAF50', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E3B55 0%, #1a252f 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Transform Your Attendance System?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of institutions using AI-powered face recognition for seamless attendance
            tracking.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: '#4CAF50' }}
            onClick={() => navigate('/signup')}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#1a1a1a',
          color: 'white',
          py: 4,
          textAlign: 'center',
          mt: 'auto',
        }}
      >
        <Typography variant="body2">
          © 2024 EduFace. All rights reserved. | Privacy Policy | Terms of Service
        </Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;
