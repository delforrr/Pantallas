import { Box, MenuItem, TextField } from '@mui/material';
import { INITIAL_PEDIDOS, MEDIOS_DE_PAGO } from './mockData';
import { BuscadorDocumento, CamposDocumento, ClienteDocumento, FormularioDocumento, ImporteDocumento, ProductosDocumento } from '../../components/ventas/DocumentoFormUI';

export default function ComprobanteVentaFormScreen({ datos, clientes, onCreateCliente, onChange, onSave, onCancel, error }) {
  const cliente = clientes.find(c => c.idCliente === datos.idCliente);
  const pedidos = INITIAL_PEDIDOS.filter(p => p.idCliente === datos.idCliente && !p.esCanje && !p.esDonacion);
  const pedido = pedidos.find(p => p.idComprobantePedidoCliente === datos.idComprobantePedidoCliente);
  const cambiar = cambios => onChange({ ...datos, ...cambios });
  const total = Number(datos.total) || 0;
  return <FormularioDocumento title="Nuevo comprobante de venta" maxWidth={1000} onCancel={onCancel} onSave={onSave} action="Emitir comprobante" canSave={Boolean(cliente && total > 0)} error={error}>
    <CamposDocumento columns={4}>
      <Box sx={{ gridColumn: 'span 2' }}>
        <ClienteDocumento clientes={clientes} value={datos.idCliente} onCreate={onCreateCliente} onChange={c => cambiar({ idCliente: c?.idCliente ?? '', tipoIva: c?.tipoIva || '', idComprobantePedidoCliente: '', total: 0 })} />
      </Box>
      <TextField select size="small" required disabled={!cliente} label="Tipo de comprobante" value={datos.tipoComprobante} onChange={event => cambiar({ tipoComprobante: event.target.value })}>
        <MenuItem value="Factura A">Factura A</MenuItem><MenuItem value="Factura B">Factura B</MenuItem><MenuItem value="Recibo Venta">Recibo de venta</MenuItem>
      </TextField>
      <TextField select size="small" required disabled={!cliente} label="Medio de pago" value={datos.medioPago || ''} onChange={event => cambiar({ medioPago: event.target.value })}>
        {MEDIOS_DE_PAGO.map(medio => <MenuItem key={medio.idMedioDePagoCliente} value={medio.descripcion}>{medio.descripcion}</MenuItem>)}
      </TextField>
    </CamposDocumento>
    <CamposDocumento columns={3}>
      <Box sx={{ gridColumn: 'span 2' }}>
      <BuscadorDocumento disabled={!cliente} options={pedidos} value={pedido || null} getOptionLabel={p => `${p.nroPedido} · ${p.clienteNombre}`}
        isOptionEqualToValue={(a, b) => a.idComprobantePedidoCliente === b.idComprobantePedidoCliente}
        onChange={(_, p) => cambiar({ idComprobantePedidoCliente: p?.idComprobantePedidoCliente ?? '', total: p?.total ?? 0 })}
        renderInput={params => <TextField {...params} label="Pedido asociado (opcional)" placeholder="Escribí el número de pedido" size="small" />} />
      </Box>
      {!pedido ? <TextField disabled={!cliente} size="small" required type="number" label="Importe total de venta directa ($)" value={datos.total} onChange={event => cambiar({ total: event.target.value })} slotProps={{ htmlInput: { min: 0.01, step: '0.01' } }} />
        : <TextField size="small" label="Condición de IVA del cliente" value={cliente?.tipoIva || ''} slotProps={{ input: { readOnly: true } }} />}
    </CamposDocumento>
    {pedido && <ProductosDocumento items={pedido.items || []} readOnly />}
    <CamposDocumento columns={3}>
      <ImporteDocumento label="Importe neto" amount={total / 1.21} />
      <ImporteDocumento label="IVA (21%)" amount={total - total / 1.21} />
      <ImporteDocumento label="Total" amount={total} primary />
    </CamposDocumento>
  </FormularioDocumento>;
}
