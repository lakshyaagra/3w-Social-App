import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitial } from '../utils/avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="default"
      sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Container maxWidth="sm" disableGutters>
        <Toolbar sx={{ px: 2 }}>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, cursor: 'pointer', color: 'text.primary', fontWeight: 700 }}
            onClick={() => navigate('/')}
          >
            Social
          </Typography>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, color: 'primary.contrastText' }}>
                {getInitial(user.username)}
              </Avatar>
              <Button size="small" onClick={handleLogout} color="inherit">
                Log out
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={() => navigate('/login')} color="inherit">
                Log in
              </Button>
              <Button size="small" variant="contained" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
