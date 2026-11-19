import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const dinero = (valor) => `$${Number(valor || 0).toLocaleString('es-AR')}`;

export const ConfirmarPedidoModal = ({
  open,
  onClose,
  onConfirm,
  items = [],
  detalles = [],
  subtotal = 0,
  descuento = 0,
  envio = 0,
  total = 0,
  confirmLabel = 'Confirmar Pedido',
}) => {
  const totalItems = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="confirmar-pedido-dialog-title"
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(4px)' } },
        paper: { sx: { borderRadius: '16px', p: 1 } },
      }}
    >
      <DialogTitle
        id="confirmar-pedido-dialog-title"
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, pb: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ReceiptLongOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Resumen de tu pedido
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Revisá los productos antes de confirmar
            </Typography>
          </Box>
        </Box>
        <IconButton aria-label="Cerrar modal" onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, pt: '20px !important', pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Productos
          </Typography>
          <Chip
            icon={<ShoppingBagOutlinedIcon />}
            label={`${totalItems} ${totalItems === 1 ? 'unidad' : 'unidades'}`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            overflow: 'hidden',
            mb: 2.5,
          }}
        >
          {items.map((item, index) => {
            const precioUnitario = item.precioUnitario ?? item.precio ?? 0;
            const subtotalItem = item.subtotal ?? precioUnitario * (item.cantidad || 0);

            return (
              <Box
                key={item.idProducto ?? `${item.nombre}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderBottom: index < items.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                    {item.nombre}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.cantidad}{item.unidad ? ` ${item.unidad}` : ''} × {dinero(precioUnitario)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {dinero(subtotalItem)}
                </Typography>
              </Box>
            );
          })}
        </Paper>

        {detalles.length > 0 && (
          <Box
            sx={{
              bgcolor: 'action.hover',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              p: 2,
              mb: 2.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {detalles.map(({ label, value }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {label}:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', maxWidth: 300 }}>
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: { xs: '100%', sm: 320 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {dinero(subtotal)}
              </Typography>
            </Box>

            {descuento > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="body2" sx={{ color: 'success.main' }}>
                  Descuento
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  −{dinero(descuento)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Envío
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: envio === 0 ? 'success.main' : 'text.primary' }}>
                {envio === 0 ? 'Sin cargo' : dinero(envio)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {dinero(total)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, pt: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', borderRadius: '8px' }}>
          Volver al carrito
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          onClick={onConfirm}
          sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700, px: 2.5 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmarPedidoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      idProducto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      nombre: PropTypes.string,
      cantidad: PropTypes.number,
      unidad: PropTypes.string,
      precio: PropTypes.number,
      precioUnitario: PropTypes.number,
      subtotal: PropTypes.number,
    })
  ),
  detalles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  subtotal: PropTypes.number,
  descuento: PropTypes.number,
  envio: PropTypes.number,
  total: PropTypes.number,
  confirmLabel: PropTypes.string,
};

export default ConfirmarPedidoModal;
