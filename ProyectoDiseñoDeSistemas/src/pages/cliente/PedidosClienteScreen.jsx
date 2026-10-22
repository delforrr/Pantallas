import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useClientStore, clientStore } from './mockData';
import {
  PedidoClienteItem,
  DetallePedidoModal,
  ReclamoCanjeModal,
} from '../../components/cliente';

const FILTROS_ESTADO = [
  'Todos',
  'Pendientes',
  'En Producción',
  'Entregados',
  'Eventos Especiales',
  'Cancelados',
];

export const PedidosClienteScreen = () => {
  const store = useClientStore();
  const pedidos = useMemo(() => store.pedidos || [], [store.pedidos]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  // Modales
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);

  const [modalCanjeOpen, setModalCanjeOpen] = useState(false);
  const [pedidoCanje, setPedidoCanje] = useState(null);

  const [dialogCancelOpen, setDialogCancelOpen] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');

  // Snackbars de notificación
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Filtrado y búsqueda
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      // Filtro de chips
      let matchChip = true;
      if (filtroActivo === 'Pendientes') matchChip = p.estadoPedido === 'Pendiente';
      else if (filtroActivo === 'En Producción') matchChip = p.estadoPedido === 'En Producción';
      else if (filtroActivo === 'Entregados') matchChip = p.estadoPedido === 'Entregado';
      else if (filtroActivo === 'Eventos Especiales') matchChip = p.tipoPedido?.includes('Evento');
      else if (filtroActivo === 'Cancelados') matchChip = p.estadoPedido === 'Cancelado';

      if (!matchChip) return false;

      // Filtro de búsqueda
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const nroMatch = p.nroPedido?.toLowerCase().includes(q);
      const itemsMatch = p.items?.some((i) => i.nombre.toLowerCase().includes(q));

      return nroMatch || itemsMatch;
    });
  }, [pedidos, filtroActivo, searchQuery]);

  // Manejo de detalle
  const handleVerDetalle = (pedido) => {
    setPedidoDetalle(pedido);
    setModalDetalleOpen(true);
  };

  // Manejo de canje
  const handleSolicitarCanje = (pedido) => {
    setPedidoCanje(pedido);
    setModalCanjeOpen(true);
  };

  const handleCanjeExitoso = (nuevoCanje) => {
    setSnackbarMsg(`Orden de canje ${nuevoCanje.nroPedido} generada exitosamente a costo $0.`);
    setSnackbarOpen(true);
  };

  // Manejo de cancelación
  const handleAbrirCancelar = (pedido) => {
    setPedidoACancelar(pedido);
    setMotivoCancelacion('');
    setDialogCancelOpen(true);
  };

  const handleConfirmarCancelacion = () => {
    if (!pedidoACancelar) return;

    clientStore.cancelOrder(
      pedidoACancelar.nroPedido,
      motivoCancelacion.trim() || undefined
    );

    const esEvento = pedidoACancelar.tipoPedido?.includes('Evento') && pedidoACancelar.señaAbonada > 0;
    setSnackbarMsg(
      esEvento
        ? `Pedido ${pedidoACancelar.nroPedido} cancelado. Se aplicó la retención de seña del 50%.`
        : `Pedido ${pedidoACancelar.nroPedido} cancelado con éxito.`
    );
    setSnackbarOpen(true);
    setDialogCancelOpen(false);
    setPedidoACancelar(null);
  };

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* Título de la vista */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
          Historial y Seguimiento de Pedidos
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Consulta el estado en tiempo real, tracking de producción, comprobantes y gestión de canjes.
        </Typography>
      </Box>


      {/* Barra de Búsqueda y Filtros de Estado */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <TextField
          placeholder="Buscar por nro de pedido o producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            width: { xs: '100%', sm: 460, md: 520 },
            bgcolor: 'background.paper',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTROS_ESTADO.map((filtro) => {
            const isSelected = filtroActivo === filtro;
            return (
              <Chip
                key={filtro}
                label={filtro}
                clickable
                onClick={() => setFiltroActivo(filtro)}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '8px',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'primary.main' : 'background.paper',
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Lista de Pedidos */}
      {pedidosFiltrados.length > 0 ? (
        pedidosFiltrados.map((pedido) => (
          <PedidoClienteItem
            key={pedido.nroPedido}
            pedido={pedido}
            onVerDetalle={handleVerDetalle}
            onSolicitarCanje={handleSolicitarCanje}
            onCancelarPedido={handleAbrirCancelar}
          />
        ))
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '14px',
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            No se encontraron pedidos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No existen pedidos que coincidan con el filtro seleccionado o término de búsqueda.
          </Typography>
        </Paper>
      )}

      {/* Modal de Detalle y Seguimiento */}
      <DetallePedidoModal
        open={modalDetalleOpen}
        onClose={() => setModalDetalleOpen(false)}
        pedido={pedidoDetalle}
      />

      {/* Modal de Reclamo y Canje */}
      <ReclamoCanjeModal
        open={modalCanjeOpen}
        onClose={() => setModalCanjeOpen(false)}
        pedido={pedidoCanje}
        onSuccess={handleCanjeExitoso}
      />

      {/* Diálogo de Confirmación de Cancelación */}
      <Dialog
        open={dialogCancelOpen}
        onClose={() => setDialogCancelOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(4px)' } },
          paper: { sx: { borderRadius: '16px' } },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <WarningAmberOutlinedIcon color="warning" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ¿Cancelar Pedido {pedidoACancelar?.nroPedido}?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: '20px !important' }}>
          {pedidoACancelar?.tipoPedido?.includes('Evento') && pedidoACancelar?.señaAbonada > 0 ? (
            <Alert severity="warning" sx={{ mb: 2.5, borderRadius: '12px' }}>
              <AlertTitle sx={{ fontWeight: 700 }}>
                Condiciones de Cancelación de Evento (Seña del 50%)
              </AlertTitle>
              <Typography variant="body2">
                Este pedido corresponde a una <strong>reserva de producción para Evento Especial</strong>.
                Al cancelar, se aplica la <strong>retención del 50% abonado ($ {pedidoACancelar?.señaAbonada?.toLocaleString('es-AR')})</strong>
                en concepto de costos de elaboración y reserva de fecha.
              </Typography>
            </Alert>
          ) : (
            <DialogContentText sx={{ mb: 2 }}>
              ¿Está seguro de que desea cancelar este pedido? Esta acción es irreversible y detendrá
              la preparación de la orden en fábrica.
            </DialogContentText>
          )}

          <TextField
            fullWidth
            size="small"
            label="Motivo de la cancelación (Opcional)"
            placeholder="Ingrese el motivo por el cual cancela el pedido..."
            value={motivoCancelacion}
            onChange={(e) => setMotivoCancelacion(e.target.value)}
            multiline
            rows={2}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setDialogCancelOpen(false)} color="inherit">
            Volver
          </Button>
          <Button
            onClick={handleConfirmarCancelacion}
            variant="contained"
            color="error"
            sx={{ borderRadius: '10px', fontWeight: 700 }}
          >
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4500}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        action={<CheckCircleIcon sx={{ fontSize: 20, color: 'success.light', mr: 1 }} />}
      />

    </Box>
  );
};

export default PedidosClienteScreen;
