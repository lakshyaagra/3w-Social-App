import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} color="default" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ maxWidth: 640, width: '100%', mx: 'auto' }}>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer', color: 'primary.main' }}
          onClick={() => navigate('/')}
        >
          Commons
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main', fontSize: 14 }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {user.username}
            </Typography>
            <Button size="small" onClick={handleLogout} color="inherit">
              Log out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button size="small" variant="contained" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
