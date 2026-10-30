import { Box, Paper, Typography, IconButton, Avatar, Chip, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { clientStore } from '../../pages/cliente/mockData';

export const CarritoItem = ({ item }) => {
  if (!item) return null;

  const handleIncrement = () => {
    clientStore.updateCartQuantity(item.idProducto, item.cantidad + 1);
  };

  const handleDecrement = () => {
    if (item.cantidad > 1) {
      clientStore.updateCartQuantity(item.idProducto, item.cantidad - 1);
    }
  };

  const handleRemove = () => {
    clientStore.removeFromCart(item.idProducto);
  };

  const subtotal = item.subtotal ?? (item.precio * item.cantidad);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        p: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
      }}
    >
      {/* Icono / Avatar e Información Principal del Producto */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: { xs: '100%', sm: 220 } }}>
        <Avatar
          variant="rounded"
          src={item.imagen}
          alt={item.nombre}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '10px',
            border: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            bgcolor: 'action.hover',
          }}
        />

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}
          >
            {item.nombre}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label={item.categoria}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.72rem',
                fontWeight: 500,
                bgcolor: 'action.selected',
                color: 'text.secondary',
              }}
            />
            {item.unidad && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                • {item.unidad}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              • ${Number(item.precio).toLocaleString('es-AR')} c/u
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Controles de Cantidad (- / +), Subtotal y Botón de Eliminación */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          width: { xs: '100%', sm: 'auto' },
          gap: { xs: 2, sm: 3 },
          flexShrink: 0,
        }}
      >
        {/* Controles Incremento y Decremento */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            bgcolor: '#fff',
            p: 0.25,
          }}
        >
          {item.cantidad > 1 && <Tooltip title="Disminuir cantidad">
            <IconButton
              size="small"
              onClick={handleDecrement}
              sx={{
                p: 0.5,
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              aria-label="Disminuir cantidad"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>}

          <Typography
            sx={{
              minWidth: 32,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'text.primary',
              userSelect: 'none',
            }}
          >
            {item.cantidad}
          </Typography>

          <Tooltip title="Aumentar cantidad">
            <IconButton
              size="small"
              onClick={handleIncrement}
              sx={{
                p: 0.5,
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              aria-label="Aumentar cantidad"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Subtotal del Ítem */}
        <Box sx={{ textAlign: 'right', minWidth: 90 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Subtotal
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '-0.01em',
            }}
          >
            ${Number(subtotal).toLocaleString('es-AR')}
          </Typography>
        </Box>

        {/* Botón de Eliminación */}
        <Tooltip title="Eliminar del carrito">
          <IconButton
            onClick={handleRemove}
            sx={{
              color: 'error.main',
              p: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
            aria-label="Eliminar del carrito"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default CarritoItem;
