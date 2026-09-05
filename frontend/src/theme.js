import { createTheme } from "@mui/material/styles";

// Design tokens matched to TaskPlanet's Social page: near-black navy
// surfaces, a bright blue accent for active/interactive elements, and
// a warm gold reserved for the like/star accent.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4C8DFF", // bright blue — active tabs, icons, links
      light: "#7FADFF",
      dark: "#2F6FE0",
      contrastText: "#0A0E1A",
    },
    secondary: {
      main: "#F0B93D", // gold — likes/star accents
      contrastText: "#0A0E1A",
    },
    background: {
      default: "#0A0E1A", // near-black navy
      paper: "#121729", // card surface, one step lighter
    },
    text: {
      primary: "#E7E9F0",
      secondary: "#8B93A8",
    },
    divider: "#232B45",
    error: { main: "#E5484D" },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 20, boxShadow: "none" },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },
  },
});

export default theme;
