import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E8A020',
      light: '#F5C063',
      dark: '#B57A10',
      contrastText: '#1A1200',
    },
    secondary: {
      main: '#C0392B',
      light: '#E74C3C',
      dark: '#922B21',
      contrastText: '#fff',
    },
    background: {
      default: '#0F0A00',
      paper: '#1C1408',
    },
    surface: {
      main: '#211A08',
      card: '#2A2210',
    },
    text: {
      primary: '#F5ECD7',
      secondary: '#B8A882',
      disabled: '#6B5F44',
    },
    divider: 'rgba(232, 160, 32, 0.12)',
    success: {
      main: '#27AE60',
      light: '#2ECC71',
    },
    warning: {
      main: '#F39C12',
    },
    error: {
      main: '#E74C3C',
    },
    info: {
      main: '#2980B9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, color: '#B8A882' },
    body1: { fontSize: '0.925rem' },
    body2: { fontSize: '0.825rem', color: '#B8A882' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.02em' },
    caption: { color: '#6B5F44', fontSize: '0.75rem' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0F0A00 0%, #1A1000 50%, #0F0A00 100%)',
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#1C1408',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#E8A020',
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: '#F5C063',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #1A1205 0%, #120D02 100%)',
          borderRight: '1px solid rgba(232, 160, 32, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 18, 5, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(232, 160, 32, 0.12)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          margin: '2px 8px',
          padding: '8px 12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(232, 160, 32, 0.08)',
            transform: 'translateX(2px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(90deg, rgba(232,160,32,0.2) 0%, rgba(232,160,32,0.05) 100%)',
            borderLeft: '3px solid #E8A020',
            '&:hover': {
              background: 'linear-gradient(90deg, rgba(232,160,32,0.28) 0%, rgba(232,160,32,0.08) 100%)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 24px',
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #E8A020, #B57A10)',
          boxShadow: '0 4px 15px rgba(232, 160, 32, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #F5C063, #E8A020)',
            boxShadow: '0 6px 20px rgba(232, 160, 32, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(42, 34, 16, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(232, 160, 32, 0.1)',
          borderRadius: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': {
              borderColor: 'rgba(232, 160, 32, 0.25)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(232, 160, 32, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E8A020',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(232, 160, 32, 0.12)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(26, 18, 5, 0.95)',
          border: '1px solid rgba(232, 160, 32, 0.2)',
          backdropFilter: 'blur(8px)',
          fontSize: '0.78rem',
        },
      },
    },
  },
});

export default theme;
