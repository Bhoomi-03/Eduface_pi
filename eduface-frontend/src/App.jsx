import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminReports from './pages/AdminReports';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyAttendance from './pages/FacultyAttendance';
import FacultyReports from './pages/FacultyReports';
import SecurityDashboard from './pages/SecurityDashboard';
import SecurityDoor from './pages/SecurityDoor';
import SecurityAlerts from './pages/SecurityAlerts';

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#f5f5f5',
                  }}
                >
                  <Navbar />
                  <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="students" element={<AdminStudents />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/*"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#f5f5f5',
                  }}
                >
                  <Navbar />
                  <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                    <Routes>
                      <Route path="dashboard" element={<FacultyDashboard />} />
                      <Route path="attendance" element={<FacultyAttendance />} />
                      <Route path="reports" element={<FacultyReports />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
            </ProtectedRoute>
          }
        />

        {/* Security Routes */}
        <Route
          path="/security/*"
          element={
            <ProtectedRoute allowedRoles={['security']}>
              <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#f5f5f5',
                  }}
                >
                  <Navbar />
                  <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                    <Routes>
                      <Route path="dashboard" element={<SecurityDashboard />} />
                      <Route path="door" element={<SecurityDoor />} />
                      <Route path="alerts" element={<SecurityAlerts />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
            </ProtectedRoute>
          }
        />

        {/* Catch-all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
