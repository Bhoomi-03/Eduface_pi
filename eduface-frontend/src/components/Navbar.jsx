import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { THEME_COLORS } from '../utils/constants';

export default function Navbar() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleLogout() {
    logout();
    navigate('/');
    handleMenuClose();
  }

  const initials = (userName || 'User')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: THEME_COLORS.PRIMARY }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
            EduFace
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            onClick={handleMenuOpen}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: THEME_COLORS.SECONDARY,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {initials}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Typography variant="body2">{userName || 'User'}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
