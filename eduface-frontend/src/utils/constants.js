// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Role Constants
export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  SECURITY: 'security',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'eduface_token',
  ROLE: 'eduface_role',
  USER_ID: 'eduface_user_id',
  USER_NAME: 'eduface_user_name',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  STUDENTS: '/students',
  ATTENDANCE: '/attendance',
  DOOR: '/door/open',
  ALERTS: '/alerts',
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#2E3B55', // Navy Blue
  SECONDARY: '#4CAF50', // Green
  SUCCESS: '#4CAF50',
  ERROR: '#f44336',
  WARNING: '#ff9800',
  INFO: '#2196f3',
  BACKGROUND: '#f5f5f5',
  SURFACE: '#ffffff',
};
