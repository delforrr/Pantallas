import { Box, Paper, Typography, Button, Alert, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Divider } from '@mui/material';

const dinero = (valor) => `$${valor.toLocaleString('es-AR')}`;

export function DetallePresupuestoMayorista({ pedido }) {
  return <>
    {pedido.tipoMayorista && <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontWeight: 700 }}>Tipo de pedido: {pedido.tipoMayorista === 'semanal' ? 'Semanal' : 'Para un evento'}</Typography>
      {pedido.diaEntregaSemanal && <Typography color="primary">Entrega semanal: {pedido.diaEntregaSemanal}</Typography>}
    </Box>}
    <TableContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
      <Table size="small" aria-label="Productos del presupuesto mayorista">
        <TableHead><TableRow><TableCell>Producto</TableCell><TableCell align="right">Cantidad</TableCell><TableCell align="right">Precio unitario</TableCell><TableCell align="right">Subtotal</TableCell></TableRow></TableHead>
        <TableBody>{pedido.items.map((item) => <TableRow key={item.idProducto}><TableCell>{item.nombre}</TableCell><TableCell align="right">{item.cantidad} {item.unidad}</TableCell><TableCell align="right">{dinero(item.precioUnitario)}</TableCell><TableCell align="right">{dinero(item.subtotal)}</TableCell></TableRow>)}</TableBody>
      </Table>
    </TableContainer>
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      {pedido.items.map((item) => <Box key={item.idProducto} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{item.nombre}</Typography>
        <Typography variant="body2" color="text.secondary">{item.cantidad} {item.unidad} × {dinero(item.precioUnitario)}</Typography>
        <Typography sx={{ fontWeight: 700, textAlign: 'right', mt: 1 }}>{dinero(item.subtotal)}</Typography>
      </Box>)}
    </Box>
    <Box sx={{ maxWidth: 360, ml: 'auto', py: 2 }}>
      <Typography sx={{ display: 'flex', justifyContent: 'space-between' }}>Subtotal <span>{dinero(pedido.subtotal)}</span></Typography>
      <Typography sx={{ display: 'flex', justifyContent: 'space-between', color: 'primary.main', my: 1 }}>Descuento mayorista (10%) <span>−{dinero(pedido.descuento)}</span></Typography>
      <Divider sx={{ my: 1 }} />
      <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>Total <span>{dinero(pedido.total)}</span></Typography>
      <Typography variant="caption" color="text.secondary">Retiro sin cargo. Entrega y pago a coordinar con la tienda.</Typography>
    </Box>
  </>;
}

export default function PresupuestoMayorista({ presupuesto, onEditar, onAceptar }) {
  return <Paper component="section" sx={{ p: { xs: 2, md: 4 }, borderRadius: '14px' }}>
    <Typography component="h2" variant="h5" sx={{ mb: 1 }}>Tu presupuesto mayorista</Typography>
    <Alert severity="info" sx={{ mb: 3 }}>Al aceptar, tu pedido quedará pendiente de aprobación de la tienda. Todavía no se cobra ni se confirma la producción.</Alert>
    <DetallePresupuestoMayorista pedido={presupuesto} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mt: 2 }}>
      <Button variant="outlined" onClick={onEditar}>Modificar selección</Button>
      <Button variant="contained" color="secondary" onClick={onAceptar}>Aceptar presupuesto y enviar pedido</Button>
    </Box>
  </Paper>;
}
