import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, role, userId, userName } = response.data;

      login(token, role, userId, userName);
      const redirectPath = location.state?.from?.pathname || '/admin/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2E3B55 0%, #4CAF50 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#2E3B55', mb: 1 }}
            >
              EduFace
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSignIn}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              placeholder="your@email.com"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              placeholder="••••••••"
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, bgcolor: '#2E3B55', py: 1.5 }}
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link
                href="/signup"
                sx={{
                  color: '#4CAF50',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary" display="block">
              Demo Credentials:
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Admin: admin@eduface.com / Admin123
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

export default SignInPage;
