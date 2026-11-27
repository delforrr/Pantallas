import { Box, MenuItem, TextField } from '@mui/material';
import { INITIAL_PEDIDOS, MEDIOS_DE_PAGO } from './mockData';
import { BuscadorDocumento, CamposDocumento, ClienteDocumento, FormularioDocumento, ImporteDocumento } from '../../components/ventas/DocumentoFormUI';

export default function CobroFormScreen({ datos, clientes, onCreateCliente, onChange, onSave, onCancel, error }) {
  const cliente = clientes.find(c => c.idCliente === datos.idCliente);
  const pedidos = INITIAL_PEDIDOS.filter(p => p.idCliente === datos.idCliente && !p.esCanje && !p.esDonacion);
  const pedido = pedidos.find(p => p.idComprobantePedidoCliente === datos.idComprobantePedidoCliente);
  const cambiar = cambios => onChange({ ...datos, ...cambios });
  return <FormularioDocumento title="Registrar cobro" maxWidth={1000} onCancel={onCancel} onSave={onSave} action="Guardar recibo" canSave={Boolean(cliente && Number(datos.montoAbonado) > 0)} error={error}>
    <CamposDocumento columns={4}>
      <Box sx={{ gridColumn: 'span 2' }}>
      <ClienteDocumento clientes={clientes} value={datos.idCliente} onCreate={onCreateCliente} onChange={c => cambiar({ idCliente: c?.idCliente ?? '', idComprobantePedidoCliente: '', montoAbonado: 0 })} />
      </Box>
      <Box sx={{ gridColumn: 'span 2' }}>
      <BuscadorDocumento disabled={!cliente} options={pedidos} value={pedido || null} getOptionLabel={p => `${p.nroPedido} · ${p.clienteNombre}`}
        isOptionEqualToValue={(a, b) => a.idComprobantePedidoCliente === b.idComprobantePedidoCliente}
        onChange={(_, p) => cambiar({ idComprobantePedidoCliente: p?.idComprobantePedidoCliente ?? '', montoAbonado: p ? Math.max(0, p.total - (p.señaPagada || 0)) : 0 })}
        renderInput={params => <TextField {...params} label="Pedido asociado (opcional)" placeholder="Escribí el número de pedido" size="small" />} />
      </Box>
    </CamposDocumento>
    <CamposDocumento columns={3}>
      <TextField select disabled={!cliente} label="Medio de pago" size="small" required value={datos.idMedioDePagoCliente} onChange={event => cambiar({ idMedioDePagoCliente: event.target.value })}>
        {MEDIOS_DE_PAGO.map(medio => <MenuItem key={medio.idMedioDePagoCliente} value={medio.idMedioDePagoCliente}>{medio.descripcion}</MenuItem>)}
      </TextField>
      <TextField disabled={!cliente} type="number" label="Monto abonado ($)" size="small" required value={datos.montoAbonado} onChange={event => cambiar({ montoAbonado: event.target.value })} slotProps={{ htmlInput: { min: 0.01, step: '0.01' } }} />
      <TextField size="small" disabled={!cliente} label="Concepto" required value={datos.concepto || ''} onChange={event => cambiar({ concepto: event.target.value })} />
    </CamposDocumento>
    <CamposDocumento columns={pedido ? 4 : 3}>
      <Box sx={{ gridColumn: 'span 2' }}><TextField fullWidth size="small" disabled={!cliente} label="Observaciones" value={datos.observaciones || ''} onChange={event => cambiar({ observaciones: event.target.value })} /></Box>
      {pedido && <ImporteDocumento label="Saldo del pedido" amount={Math.max(0, pedido.total - (pedido.señaPagada || 0))} />}
      <ImporteDocumento label="Total a registrar" amount={Number(datos.montoAbonado) || 0} primary />
    </CamposDocumento>
  </FormularioDocumento>;
}
