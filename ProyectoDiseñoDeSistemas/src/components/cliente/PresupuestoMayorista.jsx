import { Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Divider } from '@mui/material';

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
    <ResumenImportesMayorista pedido={pedido} />
  </>;
}

export function ResumenImportesMayorista({ pedido }) {
  return (
    <Box sx={{ maxWidth: 360, ml: 'auto', py: 2 }}>
      <Typography sx={{ display: 'flex', justifyContent: 'space-between' }}>Subtotal <span>{dinero(pedido.subtotal)}</span></Typography>
      <Typography sx={{ display: 'flex', justifyContent: 'space-between', color: 'primary.main', my: 1 }}>Descuento mayorista (10%) <span>−{dinero(pedido.descuento)}</span></Typography>
      <Divider sx={{ my: 1 }} />
      <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>Total <span>{dinero(pedido.total)}</span></Typography>
      <Typography variant="caption" color="text.secondary">Retiro sin cargo. Entrega y pago a coordinar con la tienda.</Typography>
    </Box>
  );
}
