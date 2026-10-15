import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import { useApp } from '../../context/AppContext';
import { getTheme } from '../../theme';
import ClienteNavigation from './ClienteNavigation';
import ingredientesPattern from './ingredientes-pattern.svg';

// A theme scoped to the customer storefront; the shared ERP theme stays frozen.
const clienteTheme = createTheme(getTheme('light'), {
  palette: {
    primary: { main: '#416522', light: '#6d8a48', dark: '#304c18', contrastText: '#ffffff' },
    secondary: { main: '#c93600', light: '#df5928', dark: '#a52e00', contrastText: '#ffffff' },
    background: { default: '#ded0a8', paper: '#fffefa' },
    text: { primary: '#313827', secondary: '#727362' },
    divider: '#e8e2d3',
    action: { hover: 'rgba(65,101,34,0.05)', selected: 'rgba(65,101,34,0.1)' },
  },
  typography: {
    fontFamily: 'Montserrat, Inter, sans-serif',
    h5: { fontFamily: 'Georgia, serif', color: '#416522', fontWeight: 700 },
    h6: { color: '#416522' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 30 }, contained: { boxShadow: 'none' }, containedPrimary: { backgroundColor: '#416522' }, containedSecondary: { backgroundColor: '#c93600' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' }, rounded: { borderRadius: 14 } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiDialog: { styleOverrides: { paper: { backgroundColor: '#fffefa', borderRadius: 20 } } },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: 'Georgia, serif', color: '#416522' } } },
  },
});

export default function ClientePortalLayout({ children }) {
  const { currentPage } = useApp();
  return (
    <ThemeProvider theme={clienteTheme}>
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {currentPage !== 'catalogo' && <Box sx={{ mx: { xs: 1.5, md: 5 }, mt: { xs: 1.5, md: 4 }, boxShadow: '6px 8px 22px #51482d20' }}><ClienteNavigation /></Box>}
      <Box sx={{ flex: 1, mx: currentPage === 'catalogo' ? 0 : { xs: 1.5, md: 5 }, mb: 2, p: currentPage === 'catalogo' ? 0 : { xs: 2, md: 4 }, bgcolor: currentPage === 'catalogo' ? 'transparent' : 'background.paper', borderTop: currentPage === 'catalogo' ? 0 : '4px solid', borderColor: 'primary.main', boxShadow: currentPage === 'catalogo' ? 'none' : '6px 8px 22px #51482d20' }}>
        {currentPage !== 'catalogo' && <Box sx={{ position: 'relative', overflow: 'hidden', pb: 3, mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, bgcolor: 'primary.main', maskImage: `url("${ingredientesPattern}")`, maskSize: '240px 240px', maskRepeat: 'repeat', maskPosition: 'right center', opacity: 0.3 }} />
          <Box sx={{ position: 'relative', width: 'fit-content', maxWidth: { xs: 'calc(100% - 36px)', sm: '100%' }, pr: 3, bgcolor: 'background.paper' }}>
          <Typography sx={{ color: 'primary.main', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>PASTAS FRESCAS · HECHAS CON TRADICIÓN</Typography>
          <Typography sx={{ fontFamily: 'Kristi, cursive', color: 'primary.main', fontSize: { xs: 48, md: 64 }, lineHeight: 1.2, mt: 1 }}>{currentPage === 'carrito' ? 'Tu próxima mesa' : currentPage === 'pedidos_cliente' ? 'De nuestra cocina a tu mesa' : 'Todo listo para disfrutar'}</Typography>
          </Box>
        </Box>}
        {children}
      </Box>
      <Box component="footer" sx={{ mt: 'auto', py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, color: 'text.secondary' }}>
        <Typography variant="caption" sx={{ color: 'primary.main' }}>PastaFab · Pastas artesanales</Typography>
      </Box>
    </Box>
    </ThemeProvider>
  );
}
