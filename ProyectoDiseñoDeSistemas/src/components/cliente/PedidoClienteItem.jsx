import PropTypes from 'prop-types';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Alert,
  Stack,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';

export const PedidoClienteItem = ({
  pedido,
  onVerDetalle,
  onSolicitarCanje,
  onCancelarPedido,
}) => {
  if (!pedido) return null;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'warning';
      case 'En Producción':
        return 'info';
      case 'Listo para Entrega':
        return 'primary';
      case 'Entregado':
        return 'success';
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPagoColor = (estadoPago) => {
    if (!estadoPago) return 'default';
    if (estadoPago === 'Pagado') return 'success';
    if (estadoPago.includes('Seña') && !estadoPago.includes('Retenida')) return 'warning';
    if (estadoPago.includes('Retenida')) return 'error';
    if (estadoPago.includes('Canje')) return 'info';
    return 'default';
  };

  const formatCurrency = (val) => {
    return typeof val === 'number'
      ? `$ ${val.toLocaleString('es-AR')}`
      : '$ 0';
  };

  const esEvento = pedido.tipoPedido?.includes('Evento');
  const esCancelado = pedido.estadoPedido === 'Cancelado';
  const puedeCancelar = pedido.estadoPedido === 'Pendiente' || pedido.estadoPedido === 'En Producción';
  const puedeCanjear = pedido.estadoPedido === 'Entregado';

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '14px',
        p: 2.5,
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          borderColor: 'primary.light',
        },
      }}
    >
      {/* Cabecera: Nro de pedido, Fecha, Chips de Tipo y Estado */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {pedido.nroPedido}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {pedido.fechaEmision}
            </Typography>
          </Box>

          <Chip
            label={pedido.tipoPedido}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={pedido.estadoPedido}
            size="small"
            color={getEstadoColor(pedido.estadoPedido)}
            sx={{ fontWeight: 700 }}
          />

          <Chip
            icon={<PaymentOutlinedIcon sx={{ fontSize: '14px !important' }} />}
            label={pedido.estadoPago}
            size="small"
            color={getPagoColor(pedido.estadoPago)}
            variant={pedido.estadoPago === 'Pagado' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Advertencia si es evento cancelado con seña retenida */}
      {esCancelado && (
        <Alert
          severity={esEvento ? 'warning' : 'error'}
          sx={{ mb: 2, borderRadius: '10px', py: 0.5 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {pedido.motivoCancelacion ||
              (esEvento
                ? 'Evento cancelado: Se aplica la retención normativa del 50% de la seña abonada.'
                : 'Pedido cancelado')}
          </Typography>
        </Alert>
      )}

      {/* Resumen de ítems incluidos y logística */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          my: 1.5,
          bgcolor: 'action.hover',
          p: 1.5,
          borderRadius: '10px',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>
            Ítems del Pedido ({pedido.items ? pedido.items.length : 0}):
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.75, mt: 0.5 }}>
            {pedido.items && pedido.items.length > 0 ? (
              pedido.items.map((it, idx) => (
                <Chip
                  key={it.idProducto || idx}
                  label={`${it.cantidad}x ${it.nombre}`}
                  size="small"
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    fontSize: '0.75rem',
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sin ítems desglosados
              </Typography>
            )}
          </Stack>

          {/* Modalidad y fecha estimada */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                {pedido.modalidadEntrega || 'Retiro en Fábrica'} &bull; Estimado: {pedido.fechaEntregaEstimada || 'A coordinar'}
              </Typography>
            </Box>
            {pedido.nroRemito && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                Remito: {pedido.nroRemito}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Monto Total */}
        <Box sx={{ textAlign: { xs: 'left', md: 'right' }, minWidth: 140 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
            Importe Total
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}>
            {formatCurrency(pedido.total)}
          </Typography>
          {pedido.saldoPendiente > 0 && (
            <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600, display: 'block' }}>
              Saldo al recibir: {formatCurrency(pedido.saldoPendiente)}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Botones de Acción */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => onVerDetalle && onVerDetalle(pedido)}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Ver Seguimiento y Detalle
          </Button>

          {puedeCanjear && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<ChangeCircleOutlinedIcon />}
              onClick={() => onSolicitarCanje && onSolicitarCanje(pedido)}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Solicitar Canje
            </Button>
          )}
        </Box>

        {puedeCancelar && (
          <Button
            variant="text"
            color="error"
            size="small"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => onCancelarPedido && onCancelarPedido(pedido)}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar Pedido
          </Button>
        )}
      </Box>
    </Paper>
  );
};

PedidoClienteItem.propTypes = {
  pedido: PropTypes.shape({
    idComprobantePedidoCliente: PropTypes.number,
    nroPedido: PropTypes.string,
    tipoPedido: PropTypes.string,
    fechaEmision: PropTypes.string,
    fechaEntregaEstimada: PropTypes.string,
    modalidadEntrega: PropTypes.string,
    domicilioEntrega: PropTypes.string,
    telefonoContacto: PropTypes.string,
    estadoPedido: PropTypes.string,
    estadoPago: PropTypes.string,
    medioPago: PropTypes.string,
    trackingStep: PropTypes.number,
    señaExigida: PropTypes.number,
    señaAbonada: PropTypes.number,
    saldoPendiente: PropTypes.number,
    subtotal: PropTypes.number,
    descuento: PropTypes.number,
    envio: PropTypes.number,
    total: PropTypes.number,
    motivoCancelacion: PropTypes.string,
    nroRemito: PropTypes.string,
    nroFactura: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        idProducto: PropTypes.number,
        nombre: PropTypes.string,
        cantidad: PropTypes.number,
        precioUnitario: PropTypes.number,
        subtotal: PropTypes.number,
      })
    ),
  }),
  onVerDetalle: PropTypes.func,
  onSolicitarCanje: PropTypes.func,
  onCancelarPedido: PropTypes.func,
};

export default PedidoClienteItem;
