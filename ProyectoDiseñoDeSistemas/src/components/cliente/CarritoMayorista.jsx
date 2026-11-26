import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../../context/AppContext';
import {
  useClientStore,
  clientStore,
  MINIMO_MAYORISTA,
  DIAS_ENTREGA_SEMANAL,
  calcularPresupuestoMayorista,
} from '../../pages/cliente/mockData';
import { CarritoMayoristaItem } from './CarritoMayoristaItem';
import { ConfirmarPedidoModal } from './ConfirmarPedidoModal';

export default function CarritoMayorista() {
  const { mayoristaItems, mayoristaEntrega } = useClientStore();
  const { navigate } = useApp();
  const [openConfirmarPedido, setOpenConfirmarPedido] = useState(false);
  const [openVaciarDialog, setOpenVaciarDialog] = useState(false);

  const presupuesto = calcularPresupuestoMayorista(mayoristaItems);
  const totalUnidades = presupuesto.items.reduce((acc, item) => acc + item.cantidad, 0);
  const cumpleMinimo = totalUnidades >= MINIMO_MAYORISTA && presupuesto.valido;
  const tipoLabel = mayoristaEntrega.tipo === 'semanal' ? 'Pedido Semanal' : 'Pedido de Eventos';
  const entregaValida = mayoristaEntrega.tipo === 'evento' || DIAS_ENTREGA_SEMANAL.includes(mayoristaEntrega.dia);
  const estaVacio = presupuesto.items.length === 0;

  const volverAProductos = () => {
    clientStore.setCatalogoModo('mayorista');
    navigate('catalogo');
  };

  const detallesPedido = [
    { label: 'Tipo de pedido', value: tipoLabel },
    ...(mayoristaEntrega.tipo === 'semanal'
      ? [{ label: 'Día de entrega semanal', value: mayoristaEntrega.dia }]
      : []),
    {
      label: 'Modalidad de entrega',
      value: mayoristaEntrega.tipo === 'semanal' ? 'Entrega semanal' : 'A coordinar con la tienda',
    },
    { label: 'Medio de pago', value: 'A coordinar tras la aprobación' },
  ];

  const handleConfirmarPedido = () => {
    setOpenConfirmarPedido(false);
    if (clientStore.createWholesaleOrder()) navigate('pedidos_cliente');
  };

  const handleVaciarCarrito = () => {
    clientStore.clearWholesaleCart();
    setOpenVaciarDialog(false);
  };

  if (estaVacio) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          px: 3,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: '16px',
          border: '1px dashed',
          borderColor: 'divider',
          maxWidth: 680,
          mx: 'auto',
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 52, color: 'text.secondary' }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
          Tu carrito mayorista está vacío
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 460, mb: 3.5, lineHeight: 1.5 }}>
          Todavía no agregaste productos para tu evento o pedido semanal. Recordá que el mínimo es de {MINIMO_MAYORISTA} unidades por producto.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<RestaurantMenuIcon />}
          onClick={volverAProductos}
          sx={{
            borderRadius: '10px',
            px: 4,
            py: 1.4,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: (theme) => `0 4px 14px ${theme.palette.primary.main}40`,
          }}
        >
          Explorar Catálogo Mayorista
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* Columna Izquierda: Lista de Ítems y Botón Vaciar */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 65%' }, width: '100%', minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2.5,
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Ítems en tu carrito mayorista ({totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'})
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Mínimo {MINIMO_MAYORISTA} unidades por producto · Descuento mayorista del 10%
              </Typography>
            </Box>

            <Button
              size="small"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setOpenVaciarDialog(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 1.5,
                border: '1px solid',
                borderColor: 'error.main',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              Vaciar Carrito
            </Button>
          </Box>

          {presupuesto.items.map((item) => (
            <CarritoMayoristaItem key={item.idProducto} item={item} />
          ))}
        </Box>

        {/* Columna Derecha: Resumen y Envío del Pedido */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '0 0 35%' },
            width: { xs: '100%', md: 'auto' },
            minWidth: { md: 320 },
            position: { md: 'sticky' },
            top: { md: 20 },
          }}
        >
          <Paper
            elevation={1}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2, letterSpacing: '-0.01em' }}>
              Resumen y Cotización
            </Typography>

            {/* Modalidad de Compra Mayorista */}
            <Box
              sx={{
                mb: 2.5,
                p: 1.5,
                bgcolor: 'action.hover',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  Modalidad de pedido
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {tipoLabel}
                </Typography>
              </Box>
              <Chip
                label="Compra mayorista"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            </Box>

            {/* Tipo de Pedido Mayorista */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="tipo-pedido-mayorista-label">Tipo de pedido mayorista</InputLabel>
              <Select
                labelId="tipo-pedido-mayorista-label"
                id="tipo-pedido-mayorista-select"
                value={mayoristaEntrega.tipo}
                label="Tipo de pedido mayorista"
                onChange={(event) => clientStore.setWholesaleDelivery({ tipo: event.target.value })}
              >
                <MenuItem value="evento">Para un evento (Mínimo {MINIMO_MAYORISTA} unidades)</MenuItem>
                <MenuItem value="semanal">Pedido semanal (Mínimo {MINIMO_MAYORISTA} unidades · 10% desc.)</MenuItem>
              </Select>
            </FormControl>

            {/* Día de Entrega Semanal */}
            {mayoristaEntrega.tipo === 'semanal' && (
              <TextField
                select
                required
                fullWidth
                size="small"
                label="Día de entrega semanal"
                value={mayoristaEntrega.dia}
                onChange={(event) => clientStore.setWholesaleDelivery({ ...mayoristaEntrega, dia: event.target.value })}
                helperText="Elegí el día en que querés recibir la mercadería cada semana."
                sx={{ mb: 2 }}
              >
                {DIAS_ENTREGA_SEMANAL.map((dia) => (
                  <MenuItem key={dia} value={dia}>{dia}</MenuItem>
                ))}
              </TextField>
            )}

            {!cumpleMinimo && (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: '10px' }}>
                Necesitás al menos {MINIMO_MAYORISTA} unidades por producto para enviar el pedido.
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2, borderRadius: '10px' }}>
              El pedido queda sujeto a la aprobación de la tienda. La entrega y el pago se coordinan después de la aprobación.
            </Alert>

            <Divider sx={{ my: 2 }} />

            {/* Desglose Financiero */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal ({totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'})
                </Typography>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  ${presupuesto.subtotal.toLocaleString('es-AR')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                <Typography variant="body2" color="text.secondary">
                  Descuento mayorista (10%)
                </Typography>
                <Typography variant="body2" fontWeight={600} color="success.main">
                  −${presupuesto.descuento.toLocaleString('es-AR')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                <Typography variant="body2" color="text.secondary">
                  Envío
                </Typography>
                <Typography variant="body2" fontWeight={600} color="success.main">
                  A coordinar
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                  Total General
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  ${presupuesto.total.toLocaleString('es-AR')}
                </Typography>
              </Box>
            </Box>

            {/* Botón de Acción Confirmar Pedido */}
            {mayoristaEntrega.tipo === 'semanal' && !entregaValida && (
              <Typography variant="caption" sx={{ display: 'block', color: 'warning.dark', mb: 1, fontWeight: 600 }}>
                Elegí un día de entrega para enviar el pedido semanal.
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={!cumpleMinimo || !entregaValida}
              onClick={() => setOpenConfirmarPedido(true)}
              startIcon={<CheckCircleIcon />}
              sx={{
                py: 1.5,
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.98rem',
                textTransform: 'none',
                boxShadow: (theme) => `0 4px 14px ${theme.palette.primary.main}35`,
              }}
            >
              Enviar pedido a la tienda
            </Button>

            <Button
              fullWidth
              onClick={volverAProductos}
              sx={{ mt: 1, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
            >
              Seguir eligiendo productos
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
                mt: 1.5,
                fontSize: '0.74rem',
              }}
            >
              Al enviar, la tienda revisará el pedido y confirmará disponibilidad, entrega y forma de pago.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Modal de Confirmación para Vaciar Carrito Mayorista */}
      <Dialog
        open={openVaciarDialog}
        onClose={() => setOpenVaciarDialog(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(4px)' } },
          paper: { sx: { borderRadius: '16px', p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Vaciar todo el carrito mayorista?</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Typography variant="body2" color="text.secondary">
            Esta acción quitará todos los productos del pedido mayorista. Tendrás que volver a agregarlos desde el catálogo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpenVaciarDialog(false)} sx={{ textTransform: 'none', borderRadius: '8px' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleVaciarCarrito}
            sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
          >
            Sí, Vaciar Carrito
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmarPedidoModal
        open={openConfirmarPedido}
        onClose={() => setOpenConfirmarPedido(false)}
        onConfirm={handleConfirmarPedido}
        items={presupuesto.items}
        detalles={detallesPedido}
        subtotal={presupuesto.subtotal}
        descuento={presupuesto.descuento}
        envio={0}
        total={presupuesto.total}
        confirmLabel="Enviar pedido a la tienda"
      />
    </Box>
  );
}
