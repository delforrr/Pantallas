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
  CardMedia,
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GrassIcon from '@mui/icons-material/Grass';
import EggAltIcon from '@mui/icons-material/EggAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useApp } from '../../context/AppContext';
import {
  useClientStore,
  clientStore,
  CATEGORIAS_PRODUCTOS,
  CATALOGO_CLIENTE,
} from './mockData';
import { ProductoCard, PresupuestoEventoModal } from '../../components/cliente';

/**
 * CatalogoScreen - Portal Cliente PastaFab ERP.
 * Vista 1 (Landing): Hero de 70% welcome + 30% carousel a pantalla completa con botón "Ver todos los productos".
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
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Estado para la tarjeta del carrusel en el 30%
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
          1. LANDING: 70% WELCOME HERO + 30% CAROUSEL (ALTO COMPLETO)
         ───────────────────────────────────────────────────────────── */}
      {!vistaCompleta ? (
        <Fade in timeout={350}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2.5,
              width: '100%',
              height: { xs: 'auto', md: 'calc(100vh - 185px)' },
              maxHeight: { md: 'calc(100vh - 185px)' },
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* HERO WELCOME (70% WIDTH) */}
            <Paper
              elevation={0}
              sx={{
                width: { xs: '100%', md: '70%' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: { xs: 2.5, sm: 3, md: 3 },
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(46,204,113,0.12) 0%, rgba(26,26,26,0.96) 55%, rgba(231,76,60,0.10) 100%)'
                    : 'linear-gradient(135deg, rgba(0,146,70,0.07) 0%, #FFFFFF 55%, rgba(206,43,55,0.05) 100%)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 10px 30px rgba(0,0,0,0.5)'
                    : '0 10px 30px rgba(0,146,70,0.06)',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {/* Barra superior de badges y acceso al carrito */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<GrassIcon sx={{ fontSize: '14px !important' }} />}
                    label="Sémola Candeal 100% Pura"
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.72rem', bgcolor: 'background.paper', borderColor: 'divider' }}
                    variant="outlined"
                  />
                  <Chip
                    icon={<EggAltIcon sx={{ fontSize: '14px !important' }} />}
                    label="6 Huevos de Campo por Kilo"
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.72rem', bgcolor: 'background.paper', borderColor: 'divider' }}
                    variant="outlined"
                  />
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
                    label="Elaboración Matutina Diaria"
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.72rem', bgcolor: 'background.paper', borderColor: 'divider' }}
                    variant="outlined"
                  />
                </Box>

                {cartSummary.totalItems > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => navigate('carrito')}
                    sx={{
                      fontWeight: 700,
                      borderRadius: '10px',
                      bgcolor: 'background.paper',
                    }}
                  >
                    Carrito ({cartSummary.totalItems} u. • ${cartSummary.totalPrice.toLocaleString('es-AR')})
                  </Button>
                )}
              </Box>

              {/* Contenido principal del Hero */}
              <Box sx={{ my: 'auto', py: { xs: 1, md: 2 } }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    fontSize: '0.82rem',
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  PASTAS FRESCAS ARTESANALES & SALSAS TRADICIONALES
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    color: 'text.primary',
                    fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.8rem' },
                    lineHeight: 1.15,
                    mb: 1.5,
                  }}
                >
                  La pasión de la pasta hecha en casa, todos los días.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 680,
                    lineHeight: 1.5,
                    fontSize: { xs: '0.9rem', md: '0.98rem' },
                    mb: 2,
                  }}
                >
                  Elaboramos pastas frescas con recetas familiares italianas. Atendemos pedidos familiares,
                  suministro regular para restaurantes gastronómicos y cotizaciones especiales para eventos
                  con 48 hs de anticipación y seña del 50%.
                </Typography>

                {/* 3 Pilares Gastronómicos */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FFFFFF'),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <VerifiedIcon color="primary" sx={{ fontSize: 18 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Amasado Diario
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.3, display: 'block' }}>
                      Frescura garantizada, sin conservantes químicos ni colorantes artificiales.
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FFFFFF'),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <RestaurantMenuIcon sx={{ color: '#E74C3C', fontSize: 18 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Salsas Caseras
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.3, display: 'block' }}>
                      Vendidas por separado, listas para servir y maridar a la perfección.
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FFFFFF'),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LocalOfferIcon sx={{ color: '#F39C12', fontSize: 18 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Eventos (48hs)
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.3, display: 'block' }}>
                      10% de descuento por volumen, entrega programada y 50% de seña.
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              {/* Botonera de Acción */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<RestaurantMenuIcon />}
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => setVistaCompleta(true)}
                  sx={{
                    py: 1.5,
                    px: 3.5,
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    letterSpacing: '0.02em',
                    boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}40`,
                    transition: 'all 0.25s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}60`,
                    },
                  }}
                >
                  Ver Todos los Productos ({CATALOGO_CLIENTE.length} variedades)
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<CelebrationIcon />}
                  onClick={() => setModalEventoOpen(true)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    boxShadow: '0 4px 14px rgba(231,76,60,0.3)',
                  }}
                >
                  Cotizar Evento (48hs)
                </Button>
              </Box>
            </Paper>

            {/* CAROUSEL CON PRODUCTOS DESTACADOS (30% WIDTH) */}
            <Paper
              elevation={0}
              sx={{
                width: { xs: '100%', md: '30%' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
                p: { xs: 2, md: 2.25 },
                bgcolor: 'background.paper',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 10px 30px rgba(0,0,0,0.45)'
                    : '0 10px 30px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {/* Cabecera del Carrusel */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: '#F39C12', fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.95rem' }}>
                    Especialidad Destacada
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mr: 0.5 }}>
                    {carouselIndex + 1}/{productosDestacados.length}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handlePrevSlide}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleNextSlide}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Contenido del Producto en el Carrusel */}
              {currentFeaturedProduct && (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Imagen Stock con Badges (Agrandada verticalmente) */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: { xs: 200, sm: 240, md: 275 },
                      borderRadius: '14px',
                      overflow: 'hidden',
                      mb: 1.2,
                      flexShrink: 0,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={currentFeaturedProduct.imagen}
                      alt={currentFeaturedProduct.nombre}
                      sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        right: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Chip
                        label={currentFeaturedProduct.categoria}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          bgcolor: 'background.paper',
                          backdropFilter: 'blur(4px)',
                        }}
                      />
                      <Chip
                        icon={<StarIcon sx={{ fontSize: 13, color: '#F39C12 !important' }} />}
                        label="Top Ventas"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          bgcolor: 'background.paper',
                          color: '#B7950B',
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        borderRadius: '6px',
                        px: 0.8,
                        py: 0.2,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#58D68D', fontWeight: 700, fontSize: '0.68rem' }}>
                        Stock: {currentFeaturedProduct.stock} disp.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Textos del Producto */}
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.4, color: 'text.primary', fontSize: '1rem' }}>
                    {currentFeaturedProduct.nombre}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: 30,
                    }}
                  >
                    {currentFeaturedProduct.variedad}
                  </Typography>

                  {/* Chips de porciones y cocción */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      icon={<PeopleIcon sx={{ fontSize: '13px !important' }} />}
                      label={currentFeaturedProduct.rinde}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.68rem', height: 22, borderColor: 'divider' }}
                    />
                    <Chip
                      icon={<AccessTimeIcon sx={{ fontSize: '13px !important' }} />}
                      label={currentFeaturedProduct.tiempoCoccion}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.68rem', height: 22, borderColor: 'divider' }}
                    />
                  </Box>

                  {/* Maridaje Sugerido */}
                  <Box
                    sx={{
                      p: 0.8,
                      borderRadius: '8px',
                      border: '1px dashed',
                      borderColor: 'divider',
                      bgcolor: 'action.hover',
                      mb: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                    }}
                  >
                    <RestaurantMenuIcon sx={{ fontSize: 15, color: 'secondary.main', flexShrink: 0 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.68rem',
                        fontStyle: 'italic',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Maridaje: {currentFeaturedProduct.maridajeSugerido}
                    </Typography>
                  </Box>

                  {/* Selector y Botón Agregar (anclado al fondo del carrusel) */}
                  <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
                          Precio ({currentFeaturedProduct.unidad})
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                          ${currentFeaturedProduct.precio.toLocaleString('es-AR')}
                        </Typography>
                      </Box>

                      {/* Contador de unidades */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '8px',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => setCarouselCantidad((p) => Math.max(1, p - 1))}
                          disabled={carouselCantidad <= 1 || carouselAgregado}
                          sx={{ p: 0.3 }}
                        >
                          <RemoveIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography sx={{ px: 1, fontSize: '0.8rem', fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
                          {carouselCantidad}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setCarouselCantidad((p) => Math.min(currentFeaturedProduct.stock, p + 1))}
                          disabled={carouselCantidad >= currentFeaturedProduct.stock || carouselAgregado}
                          sx={{ p: 0.3 }}
                        >
                          <AddIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      color={carouselAgregado ? 'success' : 'primary'}
                      fullWidth
                      size="small"
                      startIcon={carouselAgregado ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
                      onClick={handleAddCarouselItem}
                      disabled={currentFeaturedProduct.stock === 0}
                      sx={{
                        py: 0.9,
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                      }}
                    >
                      {carouselAgregado
                        ? `¡Agregado (${carouselCantidad})!`
                        : `Agregar • $${(currentFeaturedProduct.precio * carouselCantidad).toLocaleString('es-AR')}`}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Indicadores de bolitas / dots del Carrusel */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.8, mt: 1.5 }}>
                {productosDestacados.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => {
                      setCarouselIndex(idx);
                      setCarouselCantidad(1);
                      setCarouselAgregado(false);
                    }}
                    sx={{
                      width: carouselIndex === idx ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: carouselIndex === idx ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        </Fade>
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
