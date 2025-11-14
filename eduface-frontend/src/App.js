import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import SecurityDashboard from './pages/SecurityDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { DRAWER_WIDTH } from './components/Sidebar';

// Context & Utils
import { authAtom } from './context/authAtom';
import { THEME_COLORS } from './utils/constants';

// Create Material UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: THEME_COLORS.PRIMARY,
    },
    secondary: {
      main: THEME_COLORS.SECONDARY,
    },
    background: {
      default: THEME_COLORS.BACKGROUND,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Dashboard Layout Component
const DashboardLayout = ({ children }) => {
  const auth = useAtomValue(authAtom);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            width: '100%',
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
            marginLeft: { xs: 0, sm: DRAWER_WIDTH },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

function App() {
  const auth = useAtomValue(authAtom);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/students" element={<AdminDashboard />} />
                    <Route path="/attendance" element={<AdminDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path="/faculty/*"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<FacultyDashboard />} />
                    <Route path="/mark-attendance" element={<FacultyDashboard />} />
                    <Route path="/reports" element={<FacultyDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Security Routes */}
          <Route
            path="/security/*"
            element={
              <ProtectedRoute allowedRoles={['security']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<SecurityDashboard />} />
                    <Route path="/door" element={<SecurityDashboard />} />
                    <Route path="/alerts" element={<SecurityDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
