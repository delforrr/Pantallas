import { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { clientStore } from '../../pages/cliente/mockData';

const CATEGORY_COLOR_MAP = {
  'Pastas Frescas': { bg: 'rgba(0, 146, 70, 0.1)', color: '#009246', border: 'rgba(0, 146, 70, 0.3)' },
  'Pastas Rellenas': { bg: 'rgba(41, 128, 185, 0.1)', color: '#2980B9', border: 'rgba(41, 128, 185, 0.3)' },
  'Pastas Gourmet': { bg: 'rgba(142, 68, 173, 0.1)', color: '#8E44AD', border: 'rgba(142, 68, 173, 0.3)' },
  'Salsas Caseras': { bg: 'rgba(206, 43, 55, 0.1)', color: '#CE2B37', border: 'rgba(206, 43, 55, 0.3)' },
  'Packs y Combos': { bg: 'rgba(243, 156, 18, 0.12)', color: '#D35400', border: 'rgba(243, 156, 18, 0.35)' },
};

/**
 * ProductoCard - Tarjeta gastronómica interactiva para el catálogo de clientes.
 * Presenta detalles de rinde, cocción, maridaje, selector numérico y botón de agregado.
 */
export const ProductoCard = ({ producto, onAddToCart }) => {
  const [cantidad, setCantidad] = useState(1);
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  const catStyle = CATEGORY_COLOR_MAP[producto.categoria] || {
    bg: 'action.hover',
    color: 'text.primary',
    border: 'divider',
  };

  const handleIncrement = () => {
    setCantidad((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCantidad((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    clientStore.addToCart(producto, cantidad);
    setAgregadoAnim(true);
    if (onAddToCart) {
      onAddToCart(producto, cantidad);
    }
    setTimeout(() => {
      setAgregadoAnim(false);
      setCantidad(1);
    }, 1500);
  };

  const precioTotal = (producto.precio || 0) * cantidad;

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 12px 28px rgba(0,0,0,0.6)'
              : '0 12px 28px rgba(0,146,70,0.12)',
          borderColor: 'primary.light',
        },
      }}
    >
      {/* Cabecera / Banner visual del producto con icono temático */}
      <Box
        sx={{
          height: 130,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(46,204,113,0.15) 0%, rgba(231,76,60,0.1) 100%)'
              : 'linear-gradient(135deg, rgba(0,146,70,0.07) 0%, rgba(206,43,55,0.05) 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Badges superiores: Categoría y Destacado */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 12,
            right: 12,
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
              fontSize: '0.72rem',
              bgcolor: catStyle.bg,
              color: catStyle.color,
              border: `1px solid ${catStyle.border}`,
              backdropFilter: 'blur(4px)',
            }}
          />

          {producto.destacado && (
            <Tooltip title="Producto estrella de elaboración propia">
              <Chip
                icon={<StarIcon sx={{ fontSize: '15px !important', color: '#F39C12' }} />}
                label="Destacado"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(243,156,18,0.2)' : '#FEF9E7',
                  color: '#B7950B',
                  border: '1px solid rgba(243,156,18,0.4)',
                }}
              />
            </Tooltip>
          )}
        </Box>

        {/* Icono temático grande */}
        <Typography
          role="img"
          aria-label={producto.nombre}
          sx={{
            fontSize: '3.6rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.15))',
            transform: 'scale(1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.15) rotate(4deg)',
            },
          }}
        >
          {producto.icono || '🍝'}
        </Typography>

        {/* Badge inferior de disponibilidad */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 12,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              bgcolor: 'background.paper',
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            Stock: {producto.stock} {producto.unidad}
          </Typography>
        </Box>
      </Box>

      {/* Cuerpo de la tarjeta con especificaciones gastronómicas */}
      <CardContent
        sx={{
          p: 2.25,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 2.25 },
        }}
      >
        {/* Título del producto */}
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 700,
            lineHeight: 1.25,
            mb: 0.75,
            minHeight: '2.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {producto.nombre}
        </Typography>

        {/* Variedad / Ingredientes */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.825rem',
            mb: 1.5,
            flexGrow: 1,
            minHeight: '2.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {producto.variedad}
        </Typography>

        {/* Chips de especificaciones: Cocción y Porciones */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
          {producto.tiempoCoccion && (
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: '15px !important' }} />}
              label={producto.tiempoCoccion}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'text.secondary',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            />
          )}
          {producto.rinde && (
            <Chip
              icon={<PeopleIcon sx={{ fontSize: '15px !important' }} />}
              label={producto.rinde}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'text.secondary',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            />
          )}
        </Box>

        {/* Sugerencia de maridaje con salsas en tipografía caption destacada */}
        {producto.maridajeSugerido && (
          <Box
            sx={{
              p: 1.2,
              mb: 2,
              borderRadius: '10px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(46, 204, 113, 0.06)'
                  : 'rgba(0, 146, 70, 0.05)',
              border: '1px dashed',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(46, 204, 113, 0.3)'
                  : 'rgba(0, 146, 70, 0.25)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <RestaurantMenuIcon
              fontSize="small"
              sx={{
                color: 'primary.main',
                fontSize: '18px',
                mt: 0.15,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontSize: '0.68rem',
                }}
              >
                Maridaje Sugerido
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  lineHeight: 1.25,
                  display: 'block',
                }}
              >
                {producto.maridajeSugerido}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Separador, Precio y Selector Numérico */}
        <Box
          sx={{
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          {/* Precio formateado en ARS */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
              Precio ({producto.unidad})
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                lineHeight: 1.1,
              }}
            >
              ${producto.precio?.toLocaleString('es-AR')}
            </Typography>
          </Box>

          {/* Selector numérico interactivo de cantidad (- y +) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'action.hover',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              p: 0.25,
            }}
          >
            <Tooltip title="Disminuir">
              <span>
                <IconButton
                  size="small"
                  onClick={handleDecrement}
                  disabled={cantidad <= 1}
                  sx={{
                    width: 28,
                    height: 28,
                    color: 'text.primary',
                    '&.Mui-disabled': { color: 'text.disabled' },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>

            <Typography
              sx={{
                px: 1.2,
                minWidth: 24,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'text.primary',
                userSelect: 'none',
              }}
            >
              {cantidad}
            </Typography>

            <Tooltip title="Aumentar">
              <IconButton
                size="small"
                onClick={handleIncrement}
                disabled={cantidad >= producto.stock}
                sx={{
                  width: 28,
                  height: 28,
                  color: 'text.primary',
                }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Botón 'Agregar' con icono AddShoppingCartIcon y animación de feedback */}
        <Button
          variant="contained"
          color={agregadoAnim ? 'success' : 'primary'}
          fullWidth
          startIcon={agregadoAnim ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
          onClick={handleAddToCart}
          sx={{
            mt: 1.5,
            py: 1,
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.02em',
            boxShadow: (theme) =>
              agregadoAnim
                ? `0 4px 12px ${theme.palette.success.main}40`
                : `0 4px 14px ${theme.palette.primary.main}30`,
            transition: 'all 0.2s ease',
          }}
        >
          {agregadoAnim
            ? '¡Agregado al Carrito!'
            : `Agregar • $${precioTotal.toLocaleString('es-AR')}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductoCard;
