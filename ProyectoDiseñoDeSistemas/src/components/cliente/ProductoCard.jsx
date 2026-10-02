import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StarIcon from '@mui/icons-material/Star';
import { clientStore } from '../../pages/cliente/mockData';

/**
 * ProductoCard - Tarjeta gastronómica uniforme (mismo tamaño) sin emojis y con imagen stock real.
 * Diseñada para catálogos y carruseles con altura fija de 490px.
 */
export const ProductoCard = ({ producto, onAddToCartFeedback }) => {
  const [cantidad, setCantidad] = useState(1);
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  const handleIncrement = () => {
    if (cantidad < producto.stock) {
      setCantidad((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    clientStore.addToCart(producto, cantidad);
    setAgregadoAnim(true);
    if (onAddToCartFeedback) {
      onAddToCartFeedback(producto, cantidad);
    }
    setTimeout(() => {
      setAgregadoAnim(false);
      setCantidad(1);
    }, 1800);
  };

  const getCategoryColor = (categoria) => {
    switch (categoria) {
      case 'Pastas Rellenas':
        return { bg: 'rgba(46, 204, 113, 0.15)', text: '#27AE60', border: 'rgba(46, 204, 113, 0.4)' };
      case 'Pastas Gourmet':
        return { bg: 'rgba(155, 89, 182, 0.15)', text: '#8E44AD', border: 'rgba(155, 89, 182, 0.4)' };
      case 'Pastas Frescas':
        return { bg: 'rgba(52, 152, 219, 0.15)', text: '#2980B9', border: 'rgba(52, 152, 219, 0.4)' };
      case 'Salsas Caseras':
        return { bg: 'rgba(231, 76, 60, 0.15)', text: '#C0392B', border: 'rgba(231, 76, 60, 0.4)' };
      default:
        return { bg: 'rgba(243, 156, 18, 0.15)', text: '#D68910', border: 'rgba(243, 156, 18, 0.4)' };
    }
  };

  const catStyle = getCategoryColor(producto.categoria);

  return (
    <Card
      elevation={1}
      sx={{
        height: 490,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.25s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 12px 28px rgba(0,0,0,0.6)'
              : '0 12px 28px rgba(0,0,0,0.1)',
          borderColor: 'primary.main',
        },
      }}
    >
      {/* 1. Header con Imagen Stock de Alta Calidad y Badges */}
      <Box sx={{ position: 'relative', height: 165, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={producto.imagen}
          alt={producto.nombre}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Gradiente sutil para legibilidad de badges */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* Badges superiores */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip
            label={producto.categoria}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              bgcolor: 'background.paper',
              color: catStyle.text,
              border: `1px solid ${catStyle.border}`,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          />

          {producto.destacado && (
            <Chip
              icon={<StarIcon sx={{ fontSize: 14, color: '#F39C12 !important' }} />}
              label="Destacado"
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                bgcolor: 'background.paper',
                color: '#B7950B',
                border: '1px solid rgba(243,156,18,0.5)',
                backdropFilter: 'blur(4px)',
              }}
            />
          )}
        </Box>

        {/* Badge inferior de stock */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 10,
            bgcolor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            borderRadius: '6px',
            px: 1,
            py: 0.25,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: producto.stock > 10 ? '#58D68D' : '#F5B041',
            }}
          >
            {producto.stock > 10 ? `Stock: ${producto.stock} disp.` : `Últimos ${producto.stock} disp.`}
          </Typography>
        </Box>
      </Box>

      {/* 2. Cuerpo del Producto (dimensiones fijas para uniformidad) */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          '&:last-child': { pb: 2 },
        }}
      >
        {/* Título de 2 líneas fijas */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            lineHeight: 1.25,
            height: 44,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: 'text.primary',
            mb: 0.5,
          }}
          title={producto.nombre}
        >
          {producto.nombre}
        </Typography>

        {/* Variedad / Ingredientes de 2 líneas fijas */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            height: 32,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            mb: 1.5,
          }}
          title={producto.variedad}
        >
          {producto.variedad}
        </Typography>

        {/* Chips de Especificaciones (Porciones y Cocción) */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, height: 26, alignItems: 'center' }}>
          <Chip
            icon={<PeopleIcon sx={{ fontSize: '13px !important' }} />}
            label={producto.rinde}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.68rem',
              height: 24,
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          />
          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: '13px !important' }} />}
            label={producto.tiempoCoccion}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.68rem',
              height: 24,
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          />
        </Box>

        {/* Maridaje Sugerido en caja fija */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            p: 0.8,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderRadius: '8px',
            border: '1px dashed',
            borderColor: 'divider',
            height: 36,
            mb: 2,
            overflow: 'hidden',
          }}
        >
          <RestaurantMenuIcon fontSize="small" sx={{ color: 'secondary.main', fontSize: 15, flexShrink: 0 }} />
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
            title={`Maridaje: ${producto.maridajeSugerido}`}
          >
            {producto.maridajeSugerido}
          </Typography>
        </Box>

        {/* 3. Fila de Precio, Selector y Botón de Agregado (anclada al fondo) */}
        <Box
          sx={{
            mt: 'auto',
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
                Precio ({producto.unidad})
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                ${producto.precio.toLocaleString('es-AR')}
              </Typography>
            </Box>

            {/* Selector de cantidad */}
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
                onClick={handleDecrement}
                disabled={cantidad <= 1 || agregadoAnim}
                sx={{ p: 0.4, color: 'text.secondary' }}
              >
                <RemoveIcon sx={{ fontSize: 15 }} />
              </IconButton>
              <Typography sx={{ px: 1, fontSize: '0.82rem', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                {cantidad}
              </Typography>
              <IconButton
                size="small"
                onClick={handleIncrement}
                disabled={cantidad >= producto.stock || agregadoAnim}
                sx={{ p: 0.4, color: 'text.secondary' }}
              >
                <AddIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Botón Agregar al Carrito */}
          <Button
            variant="contained"
            color={agregadoAnim ? 'success' : 'primary'}
            fullWidth
            size="small"
            startIcon={agregadoAnim ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={producto.stock === 0}
            sx={{
              py: 0.85,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.8rem',
              transition: 'all 0.2s',
            }}
          >
            {producto.stock === 0
              ? 'Sin Stock'
              : agregadoAnim
              ? `¡Agregado (${cantidad})!`
              : `Agregar • $${(producto.precio * cantidad).toLocaleString('es-AR')}`}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductoCard;
