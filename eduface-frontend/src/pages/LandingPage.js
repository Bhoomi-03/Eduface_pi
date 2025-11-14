import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { authAtom } from '../context/authAtom';
import { THEME_COLORS } from '../utils/constants';

const LandingPage = () => {
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);

  // If already authenticated, redirect based on role
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(`/${auth.role}`, { replace: true });
    }
  }, [auth.isAuthenticated, auth.role, navigate]);

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Recognition',
      description: 'Advanced facial recognition for accurate student identification',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Door Access',
      description: 'IoT-integrated door control with unauthorized access logging',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Attendance',
      description: 'Automated attendance tracking with detailed analytics',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: THEME_COLORS.BACKGROUND }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: THEME_COLORS.PRIMARY }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mr: 'auto',
              letterSpacing: 1,
            }}
          >
            🎓 EduFace
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/signin')}
            sx={{ mr: 1, fontWeight: 'bold' }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/signup')}
            sx={{
              backgroundColor: THEME_COLORS.SECONDARY,
              '&:hover': { backgroundColor: '#45a049' },
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: THEME_COLORS.PRIMARY,
              mb: 2,
            }}
          >
            Welcome to EduFace
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            An intelligent attendance system combining AI facial recognition with IoT door
            control for modern educational institutions
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                backgroundColor: THEME_COLORS.SECONDARY,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#45a049' },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signin')}
              sx={{
                borderColor: THEME_COLORS.PRIMARY,
                color: THEME_COLORS.PRIMARY,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 6,
              color: THEME_COLORS.PRIMARY,
            }}
          >
            Key Features
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    boxShadow: 2,
                    transition: 'transform 0.3s, boxShadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ color: THEME_COLORS.SECONDARY, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            backgroundColor: THEME_COLORS.PRIMARY,
            color: 'white',
            borderRadius: 2,
            mb: 6,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Ready to Modernize Your Institution?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Join thousands of schools already using EduFace
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              backgroundColor: THEME_COLORS.SECONDARY,
              '&:hover': { backgroundColor: '#45a049' },
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Start Free Trial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
