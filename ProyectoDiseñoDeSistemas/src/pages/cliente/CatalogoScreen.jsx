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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApp } from '../../context/AppContext';
import {
  useClientStore,
  CATEGORIAS_PRODUCTOS,
  CATALOGO_CLIENTE,
} from './mockData';
import ClienteLanding from '../../components/cliente/ClienteLanding';
import ClienteNavigation from '../../components/cliente/ClienteNavigation';
import { ProductoCard, PresupuestoEventoModal } from '../../components/cliente';

/**
 * CatalogoScreen - Portal Cliente PastaFab ERP.
 * Vista 1: Portada italiana con acceso al catálogo y presupuesto de eventos.
 * Vista 2 (Catálogo Completo): Grilla CSS uniforme (1fr por columna) con buscador y filtros por categoría.
 */
export const CatalogoScreen = () => {
  const store = useClientStore();
  const { navigate } = useApp();

  const [vistaCompleta, setVistaCompleta] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [modalEventoOpen, setModalEventoOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const cartSummary = useMemo(() => {
    const totalItems = store.cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrice = store.cart.reduce((acc, item) => acc + item.subtotal, 0);
    return { totalItems, totalPrice };
  }, [store.cart]);

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

  const handleProductAdded = (producto, cantidad) => {
    setSnackbar({
      open: true,
      message: `¡Agregaste ${cantidad} ${producto.unidad} de "${producto.nombre}" al carrito!`,
      severity: 'success',
    });
  };

  const handleEventoConfirmed = (resumenEvento) => {
    setSnackbar({
      open: true,
      message: `¡Presupuesto para "${resumenEvento.nombreEvento}" cargado en el carrito! (10% OFF y seña del 50%).`,
      severity: 'success',
    });
  };

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
          onCatalogo={() => setVistaCompleta(true)}
          onEvento={() => setModalEventoOpen(true)}
          onAbout={() => setAboutModalOpen(true)}
          onContact={() => setContactModalOpen(true)}
          onSocial={handleSocialClick}
        />
      ) : (
        /* ─────────────────────────────────────────────────────────────
            2. VISTA DE CATÁLOGO COMPLETO (GRILLA CSS UNIFORME 1fr)
           ───────────────────────────────────────────────────────────── */
        <Fade in timeout={300}>
          <Box sx={{ p: { xs: 1.5, md: 5 }, bgcolor: 'background.default' }}>
            <Box sx={{ maxWidth: 1440, mx: 'auto', bgcolor: 'background.paper', boxShadow: '6px 8px 22px #51482d20' }}>
            <ClienteNavigation onInicio={() => setVistaCompleta(false)} onProductos={handleClearFilters} />
            <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
            <Box sx={{ textAlign: 'center', py: 2, mb: 2 }}>
              <Typography sx={{ color: 'primary.main', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>DE NUESTRA COCINA A TU MESA</Typography>
              <Typography component="h1" sx={{ fontFamily: 'Kristi, cursive', color: 'primary.main', fontSize: { xs: 58, md: 76 }, lineHeight: 1.2 }}>Nuestra carta</Typography>
              <Typography variant="body2" color="text.secondary">Pastas artesanales, salsas caseras y sabores para compartir.</Typography>
            </Box>
            {/* Barra superior de retorno */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                p: 1.5,
                bgcolor: 'background.paper',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => setVistaCompleta(false)}
                variant="outlined"
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: '8px',
                  color: 'text.primary',
                  borderColor: 'divider',
                  textTransform: 'none',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                Volver al inicio
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Mostrando {filteredProducts.length} de {CATALOGO_CLIENTE.length} productos
                </Typography>
                {cartSummary.totalItems > 0 && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => navigate('carrito')}
                    sx={{ fontWeight: 700, borderRadius: '8px' }}
                  >
                    Carrito ({cartSummary.totalItems})
                  </Button>
                )}
              </Box>
            </Box>

            {/* Búsqueda y filtros */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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

              <Tabs value={selectedCategory} onChange={(_, value) => setSelectedCategory(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="Tipos de producto" textColor="secondary" indicatorColor="secondary" sx={{ mb: 4, '& .MuiTabs-flexContainer, & .MuiTabs-list': { justifyContent: { sm: 'center' } }, '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', px: { xs: 2, md: 3 }, minHeight: 56 } }}>
                {CATEGORIAS_PRODUCTOS.map((categoria) => <Tab key={categoria} value={categoria} label={categoria} />)}
              </Tabs>
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
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                  width: '100%',
                }}
              >
                {filteredProducts.map((producto) => (
                  <ProductoCard
                    key={producto.idProducto}
                    producto={producto}
                    onAddToCartFeedback={handleProductAdded}
                  />
                ))}
              </Box>
            )}
            </Box>
            </Box>
          </Box>
        </Fade>
      )}

      {/* MODAL DE COTIZACIÓN DE EVENTOS ESPECIALES (48HS + SEÑA 50%) */}
      {modalEventoOpen && <PresupuestoEventoModal
        open={modalEventoOpen}
        onClose={() => setModalEventoOpen(false)}
        onConfirmed={handleEventoConfirmed}
      />}

      <Dialog open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>La tradición de PastaFab</DialogTitle>
        <DialogContent><Typography>Elaboramos pastas frescas cada mañana con sémola candeal, huevos de campo y recetas familiares italianas. Completá tu mesa con nuestras salsas caseras, o pedí un presupuesto para tu próximo evento.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setAboutModalOpen(false)}>Cerrar</Button></DialogActions>
      </Dialog>
      <Dialog open={contactModalOpen} onClose={() => setContactModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Estamos para ayudarte</DialogTitle>
        <DialogContent><Typography>Consultanos por productos, pedidos regulares o eventos especiales. Los eventos se reservan con 48 horas de anticipación y una seña del 50%.</Typography></DialogContent>
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
