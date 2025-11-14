import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { authAtom } from '../context/authAtom';
import { STORAGE_KEYS, THEME_COLORS } from '../utils/constants';

const Navbar = ({ drawerOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAtom(authAtom);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);

    // Update Jotai state
    setAuth({
      isAuthenticated: false,
      token: null,
      role: null,
      userId: null,
      userName: null,
    });

    handleMenuClose();
    navigate('/signin', { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: THEME_COLORS.PRIMARY,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mr: 'auto',
            cursor: 'pointer',
            letterSpacing: 1,
          }}
          onClick={() => navigate('/')}
        >
          🎓 EduFace
        </Typography>

        {auth.isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {auth.userName}
            </Typography>
            <Avatar
              onClick={handleMenuOpen}
              sx={{
                cursor: 'pointer',
                backgroundColor: THEME_COLORS.SECONDARY,
                width: 40,
                height: 40,
              }}
            >
              {auth.userName?.charAt(0).toUpperCase()}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="caption">{auth.role?.toUpperCase()}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
