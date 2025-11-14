import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { THEME_COLORS, ROLES } from '../utils/constants';

const DRAWER_WIDTH = 250;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const common = [{ label: 'Dashboard', icon: <DashboardIcon />, path: `/${role}/dashboard` }];

  let menuItems = common;
  if (role === ROLES.ADMIN) {
    menuItems = [
      ...common,
      { label: 'Students', icon: <PeopleIcon />, path: '/admin/students' },
      { label: 'Reports', icon: <BarChartIcon />, path: '/admin/reports' },
      { label: 'Alerts', icon: <NotificationsIcon />, path: '/admin/alerts' },
    ];
  } else if (role === ROLES.FACULTY) {
    menuItems = [
      ...common,
      { label: 'Attendance', icon: <BarChartIcon />, path: '/faculty/attendance' },
      { label: 'Reports', icon: <BarChartIcon />, path: '/faculty/reports' },
    ];
  } else if (role === ROLES.SECURITY) {
    menuItems = [
      ...common,
      { label: 'Door Control', icon: <LockIcon />, path: '/security/door' },
      { label: 'Alerts', icon: <NotificationsIcon />, path: '/security/alerts' },
    ];
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: THEME_COLORS.PRIMARY,
          color: '#fff',
          mt: '64px',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                button
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: isActive ? THEME_COLORS.SECONDARY : 'transparent',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { backgroundColor: THEME_COLORS.SECONDARY },
                }}
              >
                <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
