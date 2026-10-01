import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  useClientStore,
  clientStore,
  CATEGORIAS_PRODUCTOS,
  CATALOGO_CLIENTE,
} from './mockData';
import { ProductoCard, PresupuestoEventoModal } from '../../components/cliente';

/**
 * CatalogoScreen - Catálogo gastronómico de Pastas y Salsas para el cliente (Slice 1).
 * Incluye Hero Banner, cotizador de eventos especiales con anticipación 48hs y seña 50%,
 * filtros reactivos en memoria y tarjetas gastronómicas con agregados directos al carrito.
 */
export const CatalogoScreen = () => {
  const store = useClientStore();
  const { navigate } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [modalEventoOpen, setModalEventoOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Cálculo de totales en el carrito actual para feedback visual en el hero banner
  const cartSummary = useMemo(() => {
    const totalItems = store.cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrice = store.cart.reduce((acc, item) => acc + item.subtotal, 0);
    return { totalItems, totalPrice };
  }, [store.cart]);

  // Conteo de productos por categoría para los badges de los filtros
  const categoryCounts = useMemo(() => {
    const counts = { Todos: CATALOGO_CLIENTE.length };
    CATEGORIAS_PRODUCTOS.forEach((cat) => {
      if (cat !== 'Todos') {
        counts[cat] = CATALOGO_CLIENTE.filter((p) => p.categoria === cat).length;
      }
    });
    return counts;
  }, []);

  // Filtrado de productos en memoria
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

  // Manejador al agregar producto desde ProductoCard
  const handleProductAdded = (producto, cantidad) => {
    setSnackbar({
      open: true,
      message: `¡Agregaste ${cantidad} ${producto.unidad} de "${producto.nombre}" al carrito!`,
      severity: 'success',
    });
  };

  // Manejador al confirmar evento desde PresupuestoEventoModal
  const handleEventoConfirmed = (resumenEvento) => {
    // Aseguramos sincronización con clientStore
    clientStore.getState();
    setSnackbar({
      open: true,
      message: `¡Presupuesto para "${resumenEvento.nombreEvento}" cargado en el carrito! (${resumenEvento.itemsList.length} variedades con 10% OFF y seña del 50%).`,
      severity: 'success',
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSoloDestacados(false);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* 1. HERO BANNER GASTRONÓMICO ARTESANAL */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: '24px',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(46,204,113,0.14) 0%, rgba(20,20,20,0.95) 50%, rgba(231,76,60,0.12) 100%)'
              : 'linear-gradient(135deg, rgba(0,146,70,0.08) 0%, #FFFFFF 55%, rgba(206,43,55,0.06) 100%)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 10px 30px rgba(0,0,0,0.5)'
              : '0 10px 30px rgba(0,146,70,0.08)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            {/* Badges de calidad artesanal */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
              <Chip
                label="🌾 Sémola Candeal Pura"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Chip
                label="🥚 6 Huevos de Campo por Kilo"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Chip
                label="⏱ Elaboración Diaria en Fábrica"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </Box>

            {/* Titular y bajada */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 900,
                color: 'text.primary',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                mb: 1.25,
              }}
            >
              Pastas Frescas & Salsas Caseras{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                PastaFab
              </Box>
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 650, mb: 2.5, lineHeight: 1.6 }}
            >
              Tradición italiana en cada amasado. Seleccioná nuestras pastas simples, rellenas y
              gourmet con salsas artesanales listas para retirar o recibir con cadena de frío
              garantizada.
            </Typography>

            {/* Botón Destacado: Cotizador de Eventos Especiales 48hs */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CelebrationIcon />}
                onClick={() => setModalEventoOpen(true)}
                sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.01em',
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}40`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}50`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Cotizar Evento Especial (48hs)
              </Button>

              {cartSummary.totalItems > 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate('carrito')}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: '12px',
                    fontWeight: 700,
                    bgcolor: 'background.paper',
                  }}
                >
                  Ver Carrito ({cartSummary.totalItems} u. • $
                  {cartSummary.totalPrice.toLocaleString('es-AR')})
                </Button>
              )}
            </Box>
          </Grid>

          {/* Banner lateral derecho: Beneficios rápidos */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '18px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
                🎉 Beneficios para Fiestas & Agasajos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800 }}>•</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>10% de descuento automático</strong> por volumen en combos y eventos.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800 }}>•</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Seña obligatoria del 50%</strong> con saldo contra entrega.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800 }}>•</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Mínimo 48 horas</strong> de antelación para asegurar frescura de fábrica.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. BARRA DE BÚSQUEDA Y FILTROS POR CATEGORÍA */}
      <Box sx={{ mb: 3.5 }}>
        {/* Barra de búsqueda con SearchIcon */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
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
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          {/* Toggle de Solo Destacados */}
          <Chip
            icon={<StarIcon sx={{ fontSize: '16px !important', color: soloDestacados ? '#fff' : '#F39C12' }} />}
            label="Solo Destacados"
            clickable
            color={soloDestacados ? 'primary' : 'default'}
            variant={soloDestacados ? 'filled' : 'outlined'}
            onClick={() => setSoloDestacados((prev) => !prev)}
            sx={{
              height: 40,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 1,
              bgcolor: soloDestacados ? 'primary.main' : 'background.paper',
              borderColor: soloDestacados ? 'primary.main' : 'divider',
            }}
          />

          {(searchTerm || selectedCategory !== 'Todos' || soloDestacados) && (
            <Button
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={handleClearFilters}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Restablecer
            </Button>
          )}
        </Box>

        {/* Chips de Categorías estilizados */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.25,
            overflowX: 'auto',
            pb: 0.5,
            '::-webkit-scrollbar': { height: '4px' },
          }}
        >
          {CATEGORIAS_PRODUCTOS.map((categoria) => {
            const isSelected = selectedCategory === categoria;
            const count = categoryCounts[categoria] || 0;

            return (
              <Chip
                key={categoria}
                label={`${categoria} (${count})`}
                clickable
                onClick={() => setSelectedCategory(categoria)}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  py: 2.2,
                  px: 1,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  bgcolor: isSelected ? 'primary.main' : 'background.paper',
                  color: isSelected ? '#FFFFFF' : 'text.primary',
                  border: '1px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  boxShadow: isSelected
                    ? (theme) => `0 4px 12px ${theme.palette.primary.main}35`
                    : 'none',
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* 3. CONTADOR DE RESULTADOS */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Mostrando{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>
            {filteredProducts.length}
          </Box>{' '}
          {filteredProducts.length === 1 ? 'producto artesanal' : 'productos artesanales'}
          {selectedCategory !== 'Todos' && ` en "${selectedCategory}"`}
          {searchTerm && ` para "${searchTerm}"`}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Precios con IVA incluido • Venta directa de fábrica
        </Typography>
      </Box>

      {/* 4. GRILLA RESPONSIVA DE PRODUCTOS (Grid container spacing={2.5}) */}
      {filteredProducts.length === 0 ? (
        /* Estado vacío si no se encuentran productos */
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            borderRadius: '20px',
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <SearchOffIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            No encontramos pastas o salsas que coincidan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mb: 3 }}>
            No hay productos para la combinación de filtros aplicada. Probá buscando con otros
            términos o revisando todas las categorías.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RestartAltIcon />}
            onClick={handleClearFilters}
            sx={{ borderRadius: '10px', fontWeight: 700 }}
          >
            Limpiar filtros y ver todo el catálogo
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filteredProducts.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.idProducto}>
              <ProductoCard producto={producto} onAddToCart={handleProductAdded} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 5. MODAL DE COTIZADOR DE EVENTOS ESPECIALES */}
      <PresupuestoEventoModal
        open={modalEventoOpen}
        onClose={() => setModalEventoOpen(false)}
        onConfirmed={handleEventoConfirmed}
      />

      {/* 6. SNACKBAR DE CONFIRMACIÓN */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
