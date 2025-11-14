import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import { authAtom } from '../context/authAtom';
import { THEME_COLORS } from '../utils/constants';

const DRAWER_WIDTH = 280;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAtomValue(authAtom);

  // Menu items per role
  const getMenuItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        path: `/${auth.role}`,
        roles: ['admin', 'faculty', 'security'],
      },
    ];

    if (auth.role === 'admin') {
      return [
        ...baseItems,
        {
          label: 'Students',
          icon: <PeopleIcon />,
          path: '/admin/students',
          roles: ['admin'],
        },
        {
          label: 'Attendance',
          icon: <AssignmentIcon />,
          path: '/admin/attendance',
          roles: ['admin'],
        },
      ];
    }

    if (auth.role === 'faculty') {
      return [
        ...baseItems,
        {
          label: 'Mark Attendance',
          icon: <AssignmentIcon />,
          path: '/faculty/mark-attendance',
          roles: ['faculty'],
        },
        {
          label: 'View Reports',
          icon: <AssignmentIcon />,
          path: '/faculty/reports',
          roles: ['faculty'],
        },
      ];
    }

    if (auth.role === 'security') {
      return [
        ...baseItems,
        {
          label: 'Door Control',
          icon: <SecurityIcon />,
          path: '/security/door',
          roles: ['security'],
        },
        {
          label: 'Unauthorized Access',
          icon: <WarningIcon />,
          path: '/security/alerts',
          roles: ['security'],
        },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          position: 'fixed',
          top: '64px',
          left: 0,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 1.5,
            backgroundColor: THEME_COLORS.PRIMARY,
            borderRadius: 1,
            color: 'white',
          }}
        >
          <DashboardIcon />
          <Box>
            <Box sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              {auth.role?.toUpperCase()}
            </Box>
            <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>{auth.userName}</Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                ml: 1,
                mr: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: THEME_COLORS.SECONDARY,
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
