import { useState, useMemo } from 'react';
import {
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApp } from '../../context/AppContext';
import {
  useClientStore,
  clientStore,
  CATEGORIAS_PRODUCTOS,
  CATALOGO_CLIENTE,
} from './mockData';
import ClienteLanding from '../../components/cliente/ClienteLanding';
import { ProductoCard, PresupuestoEventoModal } from '../../components/cliente';

/**
 * CatalogoScreen - Portal Cliente PastaFab ERP.
 * Vista 1: Portada italiana y carrusel de especialidades con compra en memoria.
 * Vista 2 (Catálogo Completo): Grilla CSS uniforme (1fr por columna) con buscador y filtros por categoría.
 */
export const CatalogoScreen = () => {
  const store = useClientStore();
  const { navigate } = useApp();

  const [vistaCompleta, setVistaCompleta] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [modalEventoOpen, setModalEventoOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Estado del carrusel de especialidades
  const [carouselCantidad, setCarouselCantidad] = useState(1);
  const [carouselAgregado, setCarouselAgregado] = useState(false);

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

  const currentFeaturedProduct = useMemo(() => {
    if (productosDestacados.length === 0) return null;
    return productosDestacados[carouselIndex % productosDestacados.length];
  }, [productosDestacados, carouselIndex]);

  // Manejador del carrusel
  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % productosDestacados.length);
    setCarouselCantidad(1);
    setCarouselAgregado(false);
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + productosDestacados.length) % productosDestacados.length);
    setCarouselCantidad(1);
    setCarouselAgregado(false);
  };

  const handleAddCarouselItem = () => {
    if (!currentFeaturedProduct) return;
    clientStore.addToCart(currentFeaturedProduct, carouselCantidad);
    setCarouselAgregado(true);
    setSnackbar({
      open: true,
      message: `¡Agregaste ${carouselCantidad} ${currentFeaturedProduct.unidad} de "${currentFeaturedProduct.nombre}" al carrito!`,
      severity: 'success',
    });
    setTimeout(() => {
      setCarouselAgregado(false);
      setCarouselCantidad(1);
    }, 1800);
  };

  const handleAddSignatureDish = () => {
    const signature = CATALOGO_CLIENTE.find((p) => p.idProducto === 100) || CATALOGO_CLIENTE[0];
    clientStore.addToCart(signature, 1);
    setSnackbar({
      open: true,
      message: `¡Agregaste 1 ${signature.unidad} de "${signature.nombre}" al carrito!`,
      severity: 'success',
    });
  };

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

  return (
    <Box sx={{ pb: vistaCompleta ? 3 : 0, width: '100%' }}>
      {/* ─────────────────────────────────────────────────────────────
          1. PORTADA ITALIANA Y ESPECIALIDADES DESTACADAS
         ───────────────────────────────────────────────────────────── */}
      {!vistaCompleta ? (
        <ClienteLanding
          cartSummary={cartSummary}
          onCatalogo={() => setVistaCompleta(true)}
          onEvento={() => setModalEventoOpen(true)}
          onAbout={() => setAboutModalOpen(true)}
          onContact={() => setContactModalOpen(true)}
          onSocial={handleSocialClick}
          producto={currentFeaturedProduct}
          cantidad={carouselCantidad}
          agregado={carouselAgregado}
          onPrev={handlePrevSlide}
          onNext={handleNextSlide}
          onCantidad={setCarouselCantidad}
          onAdd={handleAddCarouselItem}
          onSignature={handleAddSignatureDish}
        />
      ) : (
        /* ─────────────────────────────────────────────────────────────
            2. VISTA DE CATÁLOGO COMPLETO (GRILLA CSS UNIFORME 1fr)
           ───────────────────────────────────────────────────────────── */
        <Fade in timeout={300}>
          <Box>
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

              {/* Categorías */}
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
        </Fade>
      )}

      {/* MODAL DE COTIZACIÓN DE EVENTOS ESPECIALES (48HS + SEÑA 50%) */}
      <PresupuestoEventoModal
        open={modalEventoOpen}
        onClose={() => setModalEventoOpen(false)}
        onConfirmed={handleEventoConfirmed}
      />

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
