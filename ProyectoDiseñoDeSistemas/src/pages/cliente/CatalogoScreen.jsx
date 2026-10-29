import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useApp } from '../../context/AppContext';
import {
  useClientStore,
  clientStore,
  MINIMO_MAYORISTA,
  calcularPresupuestoMayorista,
  CATEGORIAS_PRODUCTOS,
  CATALOGO_CLIENTE,
} from './mockData';
import ClienteLanding from '../../components/cliente/ClienteLanding';
import ClienteCatalogoHeader from '../../components/cliente/ClienteCatalogoHeader';
import ingredientesPattern from '../../components/cliente/ingredientes-pattern.svg';
import { ProductoCard } from '../../components/cliente';

/**
 * CatalogoScreen - Portal Cliente PastaFab ERP.
 * Vista 1: Portada italiana con acceso al catálogo y presupuesto de eventos.
 * Vista 2 (Catálogo Completo): Grilla CSS uniforme (1fr por columna) con buscador y filtros por categoría.
 */
export const CatalogoScreen = () => {
  const store = useClientStore();
  const { navigate } = useApp();

  const vistaCompleta = store.catalogoModo !== 'inicio';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const modoMayorista = store.catalogoModo === 'mayorista';
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const cartSummary = useMemo(() => {
    const totalItems = store.cart.length + Object.keys(store.mayoristaItems).length;
    const totalPrice = store.cart.reduce((acc, item) => acc + item.subtotal, 0) + calcularPresupuestoMayorista(store.mayoristaItems).total;
    return { totalItems, totalPrice };
  }, [store.cart, store.mayoristaItems]);

  const handleSocialClick = (network) => {
    if (network === 'WhatsApp') {
      window.open('https://wa.me/5491123456789?text=Hola%20PastaFab!%20Quiero%20hacer%20un%20pedido', '_blank');
    } else {
      setSnackbar({
        open: true,
        message: `Conectando con las redes de PastaFab en ${network}...`,
        severity: 'info',
      });
    }
  };

  // Filtrado para la vista de catálogo completo
  const filteredProducts = useMemo(() => {
    return CATALOGO_CLIENTE.filter((producto) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        producto.nombre.toLowerCase().includes(term) ||
        producto.variedad.toLowerCase().includes(term) ||
        producto.categoria.toLowerCase().includes(term) ||
        (producto.maridajeSugerido && producto.maridajeSugerido.toLowerCase().includes(term));

      const matchesCategory =
        selectedCategory === 'Todos' || producto.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
  };

  return (
    <Box sx={{ pb: vistaCompleta ? 3 : 0, width: '100%' }}>
      {/* ─────────────────────────────────────────────────────────────
          1. PORTADA ITALIANA
         ───────────────────────────────────────────────────────────── */}
      {!vistaCompleta ? (
        <ClienteLanding
          cartSummary={cartSummary}
          onCatalogo={() => { clientStore.setCatalogoModo('productos'); clientStore.setCarritoModo('habitual'); }}
          onEvento={() => { clientStore.setCatalogoModo('mayorista'); clientStore.setCarritoModo('mayorista'); handleClearFilters(); }}
          onAbout={() => setAboutModalOpen(true)}
          onContact={() => setContactModalOpen(true)}
          onSocial={handleSocialClick}
        />
      ) : (
        /* ─────────────────────────────────────────────────────────────
            2. VISTA DE CATÁLOGO COMPLETO (GRILLA CSS UNIFORME 1fr)
           ───────────────────────────────────────────────────────────── */
        <Fade in timeout={300}>
          <Box sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <ClienteCatalogoHeader cartSummary={cartSummary} productosActivo onInicio={() => clientStore.setCatalogoModo('inicio')} onProductos={handleClearFilters} />
            <Box sx={{ maxWidth: 1520, mx: 'auto', p: { xs: 1.5, md: 5 } }}>
            <Box sx={{ py: 3, backgroundImage: `url("${ingredientesPattern}")`, backgroundRepeat: 'repeat', backgroundSize: { xs: '320px', md: '440px' } }}>
            <Box sx={{ bgcolor: 'transparent', px: { xs: 2, md: 4 }, pt: 2, mb: 0 }}>
            <Box sx={{ textAlign: 'center', py: 2, mb: 2, '& > .MuiTypography-root': { bgcolor: 'primary.main', width: 'fit-content', maxWidth: '100%', mx: 'auto', px: 2, py: 0.5, borderRadius: '8px' } }}>
              <Typography sx={{ color: '#fff', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>DE NUESTRA COCINA A TU MESA</Typography>
              <Typography component="h1" sx={{ fontFamily: 'Kristi, cursive', color: '#fff', fontSize: { xs: 58, md: 76 }, lineHeight: 1.2 }}>{modoMayorista ? 'Pedidos mayoristas' : 'Nuestra carta'}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>Pastas artesanales, salsas caseras y sabores para compartir.</Typography>
            </Box>
            {modoMayorista && <Alert severity="info" sx={{ mb: 3 }}>Elegí tus productos: mínimo {MINIMO_MAYORISTA} unidades de cada uno (kg, cajas o envases según su presentación). Agregalos al carrito para revisar el total del pedido. El pedido requiere aprobación de la tienda.</Alert>}
            {/* Búsqueda y filtros */}
            <Box sx={{ pb: 4, bgcolor: 'primary.main', boxShadow: (theme) => `0 0 0 100vmax ${theme.palette.primary.main}`, clipPath: 'inset(0 -100vmax)' }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 0, pb: 2, flexWrap: 'wrap', alignItems: 'center', bgcolor: 'primary.main', boxShadow: (theme) => `0 0 0 100vmax ${theme.palette.primary.main}`, clipPath: 'inset(0 -100vmax)' }}>
                <TextField
                  size="small"
                  placeholder="Buscar por variedad de pasta, salsa o ingredientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm ? (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchTerm('')}>
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                  sx={{
                    flexGrow: 1,
                    minWidth: { xs: '100%', sm: 320 },
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                  }}
                />

              </Box>

              <Tabs value={selectedCategory} onChange={(_, value) => setSelectedCategory(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="Tipos de producto" textColor="secondary" indicatorColor="secondary" sx={{ mb: 0, bgcolor: 'primary.main', boxShadow: (theme) => `0 0 0 100vmax ${theme.palette.primary.main}`, clipPath: 'inset(0 -100vmax)', '& .MuiTabs-flexContainer, & .MuiTabs-list': { justifyContent: { sm: 'center' } }, '& .MuiTabs-indicator': { height: 3, borderRadius: 2, bgcolor: '#CE2B37' }, '& .MuiTabs-scrollButtons': { color: '#fff', bgcolor: 'primary.main' }, '& .MuiTab-root': { bgcolor: 'primary.main', borderRadius: '8px 8px 0 0', color: 'rgba(255,255,255,0.8)', '&.Mui-selected': { color: '#fff' }, textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', px: { xs: 2, md: 3 }, minHeight: 56 } }}>
                {CATEGORIAS_PRODUCTOS.map((categoria) => <Tab key={categoria} value={categoria} label={categoria} />)}
              </Tabs>
            </Box>

            </Box>
            {/* GRILLA UNIFORME CON CSS GRID: Todas las tarjetas tienen idéntico ancho (1fr) y están equitativamente distribuidas */}
            {filteredProducts.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: '16px',
                  border: '1px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  maxWidth: 520,
                  mx: 'auto',
                  my: 4,
                }}
              >
                <SearchOffIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  No se encontraron productos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  No encontramos pastas ni salsas que coincidan con &quot;{searchTerm}&quot;. Probá restableciendo los filtros.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RestartAltIcon />}
                  onClick={handleClearFilters}
                  sx={{ borderRadius: '10px', fontWeight: 700 }}
                >
                  Restablecer Filtros
                </Button>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))',
                  },
                  gap: { xs: 1.5, sm: 3 },
                  width: '100%',
                }}
              >
                {filteredProducts.map((producto) => (
                  <ProductoCard
                    key={`${modoMayorista ? 'mayorista' : 'minorista'}-${producto.idProducto}`}
                    producto={producto}
                    modoMayorista={modoMayorista}
                    cantidadMayorista={store.mayoristaItems[producto.idProducto] || 0}
                    onAgregarMayorista={(producto, cantidad) => clientStore.addWholesaleToCart(producto, cantidad)}
                  />
                ))}
              </Box>
            )}
            </Box>
            </Box>
          </Box>
        </Fade>
      )}

      <Dialog open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>La tradición de PastaFab</DialogTitle>
        <DialogContent><Typography>Elaboramos pastas frescas cada mañana con sémola candeal, huevos de campo y recetas familiares italianas. Completá tu mesa con nuestras salsas caseras, o pedí un presupuesto para tu próximo evento.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setAboutModalOpen(false)}>Cerrar</Button></DialogActions>
      </Dialog>
      <Dialog open={contactModalOpen} onClose={() => setContactModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Estamos para ayudarte</DialogTitle>
        <DialogContent><Typography>Consultanos por productos, pedidos regulares o eventos especiales. Los pedidos mayoristas se cotizan desde los productos y quedan sujetos a la aprobación de la tienda.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setContactModalOpen(false)}>Cerrar</Button><Button variant="contained" onClick={() => handleSocialClick('WhatsApp')}>Consultar por WhatsApp</Button></DialogActions>
      </Dialog>

      {/* SNACKBAR DE CONFIRMACIÓN */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate('carrito')}
              sx={{ fontWeight: 800, textDecoration: 'underline' }}
            >
              Ir al Carrito
            </Button>
          }
          sx={{
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default CatalogoScreen;
