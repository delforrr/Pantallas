import { useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, Alert, TextField, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useApp } from '../../context/AppContext';
import { useClientStore, clientStore, MINIMO_MAYORISTA, DIAS_ENTREGA_SEMANAL, CATALOGO_CLIENTE, calcularPresupuestoMayorista } from '../../pages/cliente/mockData';
import PresupuestoMayorista from './PresupuestoMayorista';

export default function CarritoMayorista() {
  const { mayoristaItems, mayoristaEntrega } = useClientStore();
  const { navigate } = useApp();
  const [cotizado, setCotizado] = useState(false);
  const presupuesto = { ...calcularPresupuestoMayorista(mayoristaItems), tipoMayorista: mayoristaEntrega.tipo, diaEntregaSemanal: mayoristaEntrega.tipo === 'semanal' ? mayoristaEntrega.dia : undefined };
  const entregaValida = mayoristaEntrega.tipo === 'evento' || DIAS_ENTREGA_SEMANAL.includes(mayoristaEntrega.dia);
  const volverAProductos = () => { clientStore.setCatalogoModo('mayorista'); navigate('catalogo'); };
  if (cotizado && presupuesto.valido && entregaValida) return <PresupuestoMayorista presupuesto={presupuesto} onEditar={() => setCotizado(false)} onAceptar={() => { if (clientStore.createWholesaleOrder()) navigate('pedidos_cliente'); }} />;
  return <Paper component="section" sx={{ p: { xs: 2, md: 3 }, borderRadius: '14px' }}>
    <Typography variant="h5" sx={{ mb: 2 }}>Tu carrito mayorista</Typography>
    <Alert severity="info" sx={{ mb: 3 }}>Mínimo {MINIMO_MAYORISTA} unidades por producto. Al cotizar podés revisar el descuento del 10% y aceptar el presupuesto para enviarlo a aprobación de la tienda.</Alert>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
      <TextField select fullWidth label="Tipo de pedido mayorista" value={mayoristaEntrega.tipo} onChange={(event) => clientStore.setWholesaleDelivery({ tipo: event.target.value })}>
        <MenuItem value="evento">Para un evento</MenuItem><MenuItem value="semanal">Pedido semanal</MenuItem>
      </TextField>
      {mayoristaEntrega.tipo === 'semanal' && <TextField select required fullWidth label="Día de entrega semanal" value={mayoristaEntrega.dia} onChange={(event) => clientStore.setWholesaleDelivery({ ...mayoristaEntrega, dia: event.target.value })} helperText="Elegí el día en que querés recibir la mercadería cada semana.">
        {DIAS_ENTREGA_SEMANAL.map((dia) => <MenuItem key={dia} value={dia}>{dia}</MenuItem>)}
      </TextField>}
    </Box>
    {!presupuesto.items.length && <Typography sx={{ py: 3, textAlign: 'center' }}>Todavía no agregaste productos mayoristas.</Typography>}
    {presupuesto.items.map((item) => <Box key={item.idProducto} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ flex: '1 1 240px' }}><Typography sx={{ fontWeight: 700 }}>{item.nombre}</Typography><Typography variant="body2" color="text.secondary">${item.precioUnitario.toLocaleString('es-AR')} por {item.unidad} · Mínimo {MINIMO_MAYORISTA}</Typography></Box>
      <Box role="group" aria-label={`Cantidad de ${item.nombre}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton aria-label={`Reducir cantidad de ${item.nombre}`} disabled={item.cantidad <= MINIMO_MAYORISTA} onClick={() => clientStore.setWholesaleQuantity(item.idProducto, item.cantidad - 1)}><RemoveIcon fontSize="small" /></IconButton>
        <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.cantidad}</Typography>
        <IconButton aria-label={`Aumentar cantidad de ${item.nombre}`} disabled={item.cantidad >= CATALOGO_CLIENTE.find((p) => p.idProducto === item.idProducto).stock} onClick={() => clientStore.setWholesaleQuantity(item.idProducto, item.cantidad + 1)}><AddIcon fontSize="small" /></IconButton>
      </Box>
      <Typography sx={{ fontWeight: 700 }}>${item.subtotal.toLocaleString('es-AR')}</Typography>
      <Button color="secondary" onClick={() => clientStore.setWholesaleQuantity(item.idProducto, 0)} aria-label={`Quitar ${item.nombre} del carrito mayorista`}>Quitar</Button>
    </Box>)}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mt: 3 }}>
      <Button variant="outlined" onClick={volverAProductos}>Seguir eligiendo productos</Button>
      <Button variant="contained" color="secondary" disabled={!presupuesto.valido || !entregaValida} onClick={() => setCotizado(true)}>Cotizar pedido mayorista</Button>
    </Box>
  </Paper>;
}
