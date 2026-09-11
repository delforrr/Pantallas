import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#2ECC71' : '#009246',
      light: mode === 'dark' ? '#58D68D' : '#28B463',
      dark: mode === 'dark' ? '#1D8348' : '#006430',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#E74C3C' : '#CE2B37',
      light: mode === 'dark' ? '#F1948A' : '#E04751',
      dark: mode === 'dark' ? '#943126' : '#9E212A',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#F9FAFB',
      paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    surface: {
      main: mode === 'dark' ? '#242424' : '#F3F4F6',
      card: mode === 'dark' ? '#2C2C2C' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#F5F5F5' : '#111827',
      secondary: mode === 'dark' ? '#A3A3A3' : '#4B5563',
      disabled: mode === 'dark' ? '#6B7280' : '#9CA3AF',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    success: { main: '#27AE60', light: '#2ECC71' },
    warning: { main: '#F39C12' },
    error: { main: '#E74C3C' },
    info: { main: '#2980B9' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body1: { fontSize: '0.925rem' },
    body2: { fontSize: '0.825rem' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.02em' },
    caption: { fontSize: '0.75rem' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'dark' ? '#121212' : '#F9FAFB',
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': { width: '6px', height: '6px' },
        '*::-webkit-scrollbar-track': { background: mode === 'dark' ? '#1E1E1E' : '#F3F4F6' },
        '*::-webkit-scrollbar-thumb': {
          background: mode === 'dark' ? '#2ECC71' : '#009246',
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: mode === 'dark' ? '#58D68D' : '#28B463',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
          borderRight: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
          boxShadow: mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.05)',
          color: mode === 'dark' ? '#F5F5F5' : '#111827',
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
            backgroundColor: mode === 'dark' ? 'rgba(46, 204, 113, 0.08)' : 'rgba(0, 146, 70, 0.08)',
            transform: 'translateX(2px)',
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'dark' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(0, 146, 70, 0.15)',
            borderLeft: `3px solid ${mode === 'dark' ? '#2ECC71' : '#009246'}`,
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(0, 146, 70, 0.2)',
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
          boxShadow: `0 4px 15px ${mode === 'dark' ? 'rgba(46, 204, 113, 0.35)' : 'rgba(0, 146, 70, 0.35)'}`,
          '&:hover': {
            boxShadow: `0 6px 20px ${mode === 'dark' ? 'rgba(46, 204, 113, 0.5)' : 'rgba(0, 146, 70, 0.5)'}`,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? 'rgba(44, 44, 44, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
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
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#2ECC71' : '#009246',
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
  },
});

export default getTheme;
