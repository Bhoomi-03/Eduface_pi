import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import {
  Container,
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import apiClient from '../utils/api';
import { authAtom } from '../context/authAtom';
import { THEME_COLORS, API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

const SignInPage = () => {
  const navigate = useNavigate();
  const setAuth = useSetAtom(authAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email is invalid');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      const { token, role, userId, userName } = response.data;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);

      // Update Jotai state
      setAuth({
        isAuthenticated: true,
        token,
        role,
        userId,
        userName,
      });

      // Redirect based on role
      const redirectPath = `/${role}`;
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: THEME_COLORS.BACKGROUND,
        py: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            boxShadow: 3,
            borderTop: `4px solid ${THEME_COLORS.PRIMARY}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: THEME_COLORS.PRIMARY,
              mb: 1,
              textAlign: 'center',
            }}
          >
            🎓 Sign In
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Welcome back to EduFace
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              autoComplete="current-password"
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: THEME_COLORS.SECONDARY,
                py: 1.2,
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#45a049' },
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  sx={{
                    color: THEME_COLORS.PRIMARY,
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
              <Link
                href="/"
                sx={{
                  color: THEME_COLORS.PRIMARY,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Back to Home
              </Link>
            </Box>
          </Box>

          {/* Demo Credentials Info */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: '#f0f7ff',
              borderRadius: 1,
              borderLeft: `3px solid ${THEME_COLORS.INFO}`,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
              📝 Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Admin:</strong> admin@eduface.com / password123
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Faculty:</strong> faculty@eduface.com / password123
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Security:</strong> security@eduface.com / password123
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default SignInPage;
