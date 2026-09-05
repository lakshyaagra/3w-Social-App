import { createTheme } from '@mui/material/styles';

// Design tokens for "Commons" — a plain-spoken community feed.
// Ink-navy for structure/text, a warm marigold accent for actions and
// likes, set against a slightly warm (not pure white) paper background.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1F2A44', // ink navy — text, nav, primary buttons
      light: '#3C4A6B',
      dark: '#131B2E',
      contrastText: '#F6F5F2',
    },
    secondary: {
      main: '#D98F27', // marigold — likes, accents, active states
      contrastText: '#1F2A44',
    },
    background: {
      default: '#F6F5F2', // warm paper, not stark white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2A44',
      secondary: '#5B6478',
    },
    divider: '#E4E1D8',
    error: { main: '#B3423A' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none' },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

export default theme;
