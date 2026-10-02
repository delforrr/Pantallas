import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GrassIcon from '@mui/icons-material/Grass';
import EggAltIcon from '@mui/icons-material/EggAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useApp } from '../../context/AppContext';
import {
  useClientStore,
  CATEGORIAS_PRODUCTOS,
  CATALOGO_CLIENTE,
} from './mockData';
import { ProductoCard, PresupuestoEventoModal } from '../../components/cliente';

/**
 * CatalogoScreen - Experiencia gastronómica para el cliente PastaFab ERP.
 * Vista Inicial: Hero artesanal + Carousel full-height con especialidades destacadas y botón 'Ver todos los productos'.
 * Vista Catálogo Completo: Filtros por categoría, buscador en memoria y grilla uniforme de productos.
 */
export const CatalogoScreen = () => {
  const store = useClientStore();
  const { navigate } = useApp();

  const [vistaCompleta, setVistaCompleta] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [modalEventoOpen, setModalEventoOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const categoryCounts = useMemo(() => {
    const counts = { Todos: CATALOGO_CLIENTE.length };
    CATEGORIAS_PRODUCTOS.forEach((cat) => {
      if (cat !== 'Todos') {
        counts[cat] = CATALOGO_CLIENTE.filter((p) => p.categoria === cat).length;
      }
    });
    return counts;
  }, []);

  const productosDestacados = useMemo(() => {
    return CATALOGO_CLIENTE.filter((p) => p.destacado);
  }, []);

  // Productos filtrados para la vista de catálogo completa
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

      const matchesDestacado = !soloDestacados || producto.destacado;

      return matchesSearch && matchesCategory && matchesDestacado;
    });
  }, [searchTerm, selectedCategory, soloDestacados]);

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
    setSoloDestacados(false);
  };

  // Controles de Carrusel (muestra 3 ítems simultáneos en desktop)
  const itemsPorVista = 3;
  const maxIndex = Math.max(0, productosDestacados.length - itemsPorVista);

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <Box sx={{ pb: 6, minHeight: 'calc(100vh - 100px)' }}>
      {/* ─────────────────────────────────────────────────────────────
          1. VISTA INICIAL (HERO + CAROUSEL DESTACADOS A PANTALLA COMPLETA)
         ───────────────────────────────────────────────────────────── */}
      {!vistaCompleta ? (
        <Fade in timeout={400}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'calc(100vh - 120px)',
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            {/* HERO COMPACTO GASTRONÓMICO */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(46,204,113,0.15) 0%, rgba(25,25,25,0.95) 50%, rgba(231,76,60,0.12) 100%)'
                    : 'linear-gradient(135deg, rgba(0,146,70,0.08) 0%, #FFFFFF 55%, rgba(206,43,55,0.06) 100%)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 8px 24px rgba(0,0,0,0.45)'
                    : '0 8px 24px rgba(0,146,70,0.07)',
              }}
            >
              <Grid container spacing={2.5} alignItems="center">
                <Grid item xs={12} md={8}>
                  {/* Badges de calidad con iconos SVG (cero emojis) */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip
                      icon={<GrassIcon sx={{ fontSize: 14 }} />}
                      label="Sémola Candeal Pura"
                      size="small"
                      sx={{ fontWeight: 700, fontSize: '0.72rem', bgcolor: 'background.paper', borderColor: 'divider' }}
                      variant="outlined"
                    />
                    <Chip
                      icon={<EggAltIcon sx={{ fontSize: 14 }} />}
                      label="6 Huevos de Campo por Kilo"
                      size="small"
                      sx={{ fontWeight: 700, fontSize: '0.72rem', bgcolor: 'background.paper', borderColor: 'divider' }}
                      variant="outlined"
                    />
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                      label="Elaboración Diaria Artesanal"
                      size="small"
                      sx={{ fontWeight: 700, fontSize: '0.72rem', bgcolor: 'background.paper', borderColor: 'divider' }}
                      variant="outlined"
                    />
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: 'text.primary',
                      fontSize: { xs: '1.45rem', sm: '1.85rem', md: '2.1rem' },
                      mb: 0.8,
                    }}
                  >
                    Fábrica de Pastas Caseras & Salsas Especiales
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      maxWidth: 620,
                      lineHeight: 1.5,
                      fontSize: { xs: '0.85rem', sm: '0.92rem' },
                    }}
                  >
                    Elaboramos pastas frescas artesanales con recetas tradicionales italianas. Ventas por mayor para restaurantes,
                    pedidos fijos semanales y cotizaciones especiales para eventos con 48 hs de anticipación.
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      startIcon={<CelebrationIcon />}
                      onClick={() => setModalEventoOpen(true)}
                      sx={{
                        fontWeight: 700,
                        borderRadius: '10px',
                        px: 2.5,
                        py: 1,
                        boxShadow: '0 4px 14px rgba(231,76,60,0.3)',
                      }}
                    >
                      Cotizar Evento (48hs)
                    </Button>

                    {cartSummary.totalItems > 0 && (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate('carrito')}
                        sx={{
                          fontWeight: 700,
                          borderRadius: '10px',
                          bgcolor: 'background.paper',
                        }}
                      >
                        Ver Carrito ({cartSummary.totalItems} u. • ${cartSummary.totalPrice.toLocaleString('es-AR')})
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* SECCIÓN CAROUSEL CON PRODUCTOS DESTACADOS */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: '#F39C12', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.15rem' }}>
                    Especialidades Destacadas de la Fábrica
                  </Typography>
                </Box>

                {/* Flechas de navegación del Carrusel */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {carouselIndex + 1} - {Math.min(carouselIndex + itemsPorVista, productosDestacados.length)} de {productosDestacados.length}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handlePrevCarousel}
                    sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleNextCarousel}
                    sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Grilla uniforme del Carrusel */}
              <Grid container spacing={2.5}>
                {productosDestacados.slice(carouselIndex, carouselIndex + itemsPorVista).map((producto) => (
                  <Grid item xs={12} sm={6} md={4} key={producto.idProducto}>
                    <ProductoCard
                      producto={producto}
                      onAddToCartFeedback={handleProductAdded}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* BOTÓN PROMINENTE PARA VER TODO EL CATÁLOGO */}
            <Box sx={{ textAlign: 'center', pt: 1, pb: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<RestaurantMenuIcon />}
                endIcon={<ArrowDownwardIcon />}
                onClick={() => setVistaCompleta(true)}
                sx={{
                  py: 1.5,
                  px: 4.5,
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  letterSpacing: '0.02em',
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}45`,
                  transition: 'all 0.25s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => `0 8px 26px ${theme.palette.primary.main}60`,
                  },
                }}
              >
                Ver Todos los Productos ({CATALOGO_CLIENTE.length} variedades)
              </Button>
            </Box>
          </Box>
        </Fade>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            2. VISTA DE CATÁLOGO COMPLETO (BÚSQUEDA + FILTROS + GRILLA)
           ───────────────────────────────────────────────────────────── */
        <Fade in timeout={350}>
          <Box>
            {/* Barra superior de retorno a la vista destacada */}
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
                Volver a Especialidades Destacadas
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

            {/* BARRA DE BÚSQUEDA Y FILTROS */}
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

                <Chip
                  icon={<StarIcon sx={{ fontSize: '15px !important' }} />}
                  label="Solo Destacados"
                  clickable
                  onClick={() => setSoloDestacados((prev) => !prev)}
                  color={soloDestacados ? 'warning' : 'default'}
                  variant={soloDestacados ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 700, borderRadius: '10px', height: 38 }}
                />
              </Box>

              {/* Chips de categorías */}
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 0.5, alignItems: 'center' }}>
                {CATEGORIAS_PRODUCTOS.map((categoria) => {
                  const isSelected = selectedCategory === categoria;
                  const count = categoryCounts[categoria] || 0;
                  return (
                    <Chip
                      key={categoria}
                      label={`${categoria} (${count})`}
                      clickable
                      onClick={() => setSelectedCategory(categoria)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: isSelected ? 700 : 500,
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* GRILLA DE PRODUCTOS (uniforme, todas las tarjetas con idéntico tamaño) */}
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
              <Grid container spacing={2.5}>
                {filteredProducts.map((producto) => (
                  <Grid item xs={12} sm={6} md={4} key={producto.idProducto}>
                    <ProductoCard
                      producto={producto}
                      onAddToCartFeedback={handleProductAdded}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      )}

      {/* MODAL DE COTIZACIÓN DE EVENTOS ESPECIALES (48HS + SEÑA 50%) */}
      <PresupuestoEventoModal
        open={modalEventoOpen}
        onClose={() => setModalEventoOpen(false)}
        onConfirmed={handleEventoConfirmed}
      />

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
