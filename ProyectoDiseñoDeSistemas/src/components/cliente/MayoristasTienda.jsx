import { useState } from 'react';
import { Paper, Box, Typography, Button, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useClientStore, clientStore } from '../../pages/cliente/mockData';
import { DetallePresupuestoMayorista } from './PresupuestoMayorista';
import { useApp } from '../../context/AppContext';

export default function MayoristasTienda() {
  const { pedidos } = useClientStore();
  const { user } = useApp();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const mayoristas = pedidos.filter((pedido) => pedido.requiereAprobacion);
  if (user?.role !== 'admin' || !mayoristas.length) return null;
  return <Paper component="section" sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Pedidos mayoristas del portal cliente</Typography>
    {mayoristas.map((pedido) => <Box key={pedido.nroPedido} sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography sx={{ fontWeight: 700 }}>{pedido.nroPedido} · ${pedido.total.toLocaleString('es-AR')}</Typography>
      <Chip label={pedido.estadoPedido === 'Cancelado' ? 'Cancelado' : pedido.aprobacionTienda === 'Pendiente' ? 'Pendiente de aprobación' : 'Aceptado'} color={pedido.estadoPedido === 'Cancelado' ? 'error' : pedido.aprobacionTienda === 'Pendiente' ? 'warning' : 'success'} />
      <Button onClick={() => setPedidoSeleccionado(pedido)}>Revisar presupuesto</Button>
    </Box>)}
    <Dialog open={Boolean(pedidoSeleccionado)} onClose={() => setPedidoSeleccionado(null)} fullWidth maxWidth="md">
      <DialogTitle>Revisión de pedido mayorista · {pedidoSeleccionado?.nroPedido}</DialogTitle>
      <DialogContent>{pedidoSeleccionado && <><Alert severity="info" sx={{ mb: 2 }}>El cliente aceptó este presupuesto. La aceptación de la tienda habilita la producción; el pago continúa pendiente.</Alert><DetallePresupuestoMayorista pedido={pedidoSeleccionado} /></>}</DialogContent>
      <DialogActions><Button onClick={() => setPedidoSeleccionado(null)}>Cerrar</Button>{pedidoSeleccionado?.estadoPedido === 'Pendiente' && pedidoSeleccionado?.aprobacionTienda === 'Pendiente' && <Button variant="contained" onClick={() => { clientStore.acceptWholesaleOrder(pedidoSeleccionado.nroPedido); setPedidoSeleccionado(null); }}>Aceptar pedido mayorista</Button>}</DialogActions>
    </Dialog>
  </Paper>;
}
