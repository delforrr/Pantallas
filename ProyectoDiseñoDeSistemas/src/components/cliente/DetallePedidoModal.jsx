import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const TRACKING_STEPS = [
  'Solicitado / Recibido',
  'En Elaboración / Producción',
  'Listo / En Reparto',
  'Entregado al Cliente',
];

export const DetallePedidoModal = ({ open, onClose, pedido }) => {
  if (!pedido) return null;

  const isCancelado = pedido.estadoPedido === 'Cancelado' || pedido.trackingStep === -1;
  const activeStep = isCancelado ? 0 : Math.max(0, Math.min(pedido.trackingStep ?? 0, 3));

  const formatCurrency = (val) => {
    return typeof val === 'number'
      ? `$ ${val.toLocaleString('es-AR')}`
      : '$ 0';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="detalle-pedido-dialog-title"
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(4px)' } },
        paper: {
          sx: {
            borderRadius: '16px',
            boxShadow: 24,
          },
        },
      }}
    >
      <DialogTitle
        id="detalle-pedido-dialog-title"
        sx={{
          m: 0,
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ReceiptLongOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Detalle y Seguimiento de Pedido
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {pedido.nroPedido} &bull; {pedido.tipoPedido}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="Cerrar modal"
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, pt: '24px !important', pb: 3 }}>
        {/* Alerta si está cancelado */}
        {isCancelado ? (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Pedido Cancelado
            </Typography>
            <Typography variant="body2">
              {pedido.motivoCancelacion ||
                'Este pedido ha sido cancelado. Ante cualquier duda sobre reintegros o reservas, contacte a atención al cliente.'}
            </Typography>
          </Alert>
        ) : (
          /* Stepper de Seguimiento en Tiempo Real */
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalShippingOutlinedIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Estado de Seguimiento (Tracking)
              </Typography>
            </Box>
            <Stepper activeStep={activeStep} alternativeLabel>
              {TRACKING_STEPS.map((label, index) => (
                <Step key={label} completed={index < activeStep || activeStep === 3}>
                  <StepLabel>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: index === activeStep ? 700 : 500,
                        color: index === activeStep ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        )}

        {/* Metadatos Generales y de Entrega */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>
                Datos de Entrega y Logística
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {pedido.modalidadEntrega || 'Retiro en Fábrica'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {pedido.domicilioEntrega || 'Local Comercial PastaFab'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Entrega Estimada:</strong> {pedido.fechaEntregaEstimada || 'A confirmar'}
                </Typography>
              </Box>

              {pedido.telefonoContacto && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <PhoneOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Contacto: {pedido.telefonoContacto}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>
                Datos Comerciales y Pago
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Fecha de Emisión:</strong> {pedido.fechaEmision}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="body2">
                  <strong>Estado del Pedido:</strong>
                </Typography>
                <Chip
                  label={pedido.estadoPedido}
                  size="small"
                  color={
                    pedido.estadoPedido === 'Entregado'
                      ? 'success'
                      : pedido.estadoPedido === 'En Producción'
                      ? 'info'
                      : pedido.estadoPedido === 'Cancelado'
                      ? 'error'
                      : 'warning'
                  }
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="body2">
                  <strong>Medio de Pago:</strong>
                </Typography>
                <Chip
                  label={pedido.medioPago || 'Efectivo'}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={pedido.estadoPago}
                  size="small"
                  color={
                    pedido.estadoPago === 'Pagado'
                      ? 'success'
                      : pedido.estadoPago.includes('Seña')
                      ? 'warning'
                      : 'default'
                  }
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Tabla con el desglose de productos */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Desglose de Productos
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <Table size="small" aria-label="tabla de productos del pedido">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Cantidad
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Precio Unit.
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedido.items && pedido.items.length > 0 ? (
                pedido.items.map((item, index) => (
                  <TableRow key={item.idProducto || index} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{item.cantidad}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {formatCurrency(item.precioUnitario)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {formatCurrency(item.subtotal)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 2, color: 'text.secondary' }}>
                    No hay productos detallados en este pedido.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Resumen Financiero y Comprobantes Emitidos */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <DescriptionOutlinedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Comprobantes Emitidos
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Nro. de Remito Oficial:</strong>{' '}
                <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.primary' }}>
                  {pedido.nroRemito || 'Pendiente de emisión'}
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Comprobante de Venta / Factura:</strong>{' '}
                <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.primary' }}>
                  {pedido.nroFactura || 'En proceso de facturación'}
                </Box>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                Los comprobantes fiscales y remitos se entregan junto con la mercadería o se envían digitalmente.
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Resumen Financiero
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Subtotal:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(pedido.subtotal)}
                </Typography>
              </Box>
              {pedido.descuento > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    Descuento Aplicado:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                    - {formatCurrency(pedido.descuento)}
                  </Typography>
                </Box>
              )}
              {pedido.señaAbonada > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Seña Abonada (50%):
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(pedido.señaAbonada)}
                  </Typography>
                </Box>
              )}
              {typeof pedido.saldoPendiente === 'number' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Saldo Pendiente al Recibir:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: pedido.saldoPendiente > 0 ? 'warning.main' : 'text.primary',
                    }}
                  >
                    {formatCurrency(pedido.saldoPendiente)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Total Final:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(pedido.total)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          px: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="contained" onClick={onClose} sx={{ borderRadius: '10px', px: 3 }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DetallePedidoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
};

export default DetallePedidoModal;
