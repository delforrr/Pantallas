import { Box, Checkbox, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import { INITIAL_PRESUPUESTOS, INITIAL_COMPROBANTES_VENTA, CATALOGO_PRODUCTOS_VENTAS, DIAS_ENTREGA_SEMANAL, calcularEstadoMoroso } from './mockData';
import { ClienteMorosoAlert } from '../../components/ventas';
import { BuscadorDocumento, CamposDocumento, ClienteDocumento, FormularioDocumento, ImporteDocumento, ProductosDocumento } from '../../components/ventas/DocumentoFormUI';

export default function PedidoFormScreen({ datos, clientes, onChange, onCreateCliente, onIrAClientes, onSelectPresupuesto, onSave, onCancel, isEditing, subtotal, total, error }) {
  const cliente = clientes.find(c => c.idCliente === datos.idCliente);
  const mayorista = ['Mayorista', 'Semanal'].includes(datos.tipoPedido);
  const sinCargo = datos.esCanje || datos.esDonacion || datos.tipoPedido === 'Donación';
  const cambiar = cambios => onChange({ ...datos, ...cambios });
  const dias = (datos.diaEntregaHabitual || '').split(',').map(d => d.trim()).filter(Boolean);
  const presupuestosCliente = INITIAL_PRESUPUESTOS.filter(p => p.idCliente === datos.idCliente &&
    (datos.tipoPedido === 'Semanal' ? p.tipoPedido.toLowerCase().includes('semanal') : !p.tipoPedido.toLowerCase().includes('semanal')));
  const sinBase = !cliente || !datos.tipoPedido;
  const conEnvio = datos.conEnvio ?? Boolean(datos.domicilioEntrega && datos.domicilioEntrega !== 'Retiro en Local Comercial');
  const armarDomicilio = (calle, altura, localidad) => [
    [calle, altura].filter(Boolean).join(' '),
    localidad,
  ].filter(Boolean).join(', ') || 'Retiro en Local Comercial';
  const actualizarDireccion = cambios => cambiar({
    ...cambios,
    domicilioEntrega: armarDomicilio(
      cambios.calleEntrega ?? datos.calleEntrega,
      cambios.alturaEntrega ?? datos.alturaEntrega,
      cambios.localidadEntrega ?? datos.localidadEntrega,
    ),
  });
  return <FormularioDocumento title={isEditing ? 'Editar pedido' : datos.esCanje ? 'Nuevo canje' : datos.esDonacion ? 'Nueva donación' : 'Nuevo pedido'}
    onCancel={onCancel} onSave={onSave} action={isEditing ? 'Guardar cambios' : 'Guardar pedido'} canSave={!sinBase && datos.items.length > 0} error={error} maxWidth={1000}>
    {cliente && calcularEstadoMoroso(cliente, INITIAL_COMPROBANTES_VENTA).esMoroso && <ClienteMorosoAlert cliente={cliente} comprobantesVenta={INITIAL_COMPROBANTES_VENTA} />}
    <CamposDocumento columns={mayorista ? 5 : 4}>
      <Box sx={{ gridColumn: 'span 2' }}>
        <ClienteDocumento clientes={clientes} value={datos.idCliente} onCreate={onIrAClientes ? undefined : onCreateCliente} onIrAClientes={onIrAClientes}
          onChange={c => cambiar({ idCliente: c?.idCliente ?? '', idPresupuestoCliente: '', telefonoPedido: c?.telefono || '', calleEntrega: c?.calle || '', alturaEntrega: c?.altura || '', localidadEntrega: c?.localidad || '',
            domicilioEntrega: conEnvio && c?.calle ? armarDomicilio(c.calle, c.altura, c.localidad) : 'Retiro en Local Comercial' })} />
      </Box>
      <TextField select size="small" label="Tipo de pedido" value={datos.tipoPedido} disabled={!cliente} onChange={event => {
        const tipo = event.target.value;
        const min = ['Mayorista', 'Semanal'].includes(tipo) ? 10 : 1;
        const esDonacion = tipo === 'Donación';
        const esSinCargo = esDonacion || datos.esCanje;
        const items = datos.items.map(item => {
          if (esDonacion) return { ...item, precioUnitario: 0, subtotal: 0 };
          if (datos.tipoPedido === 'Donación') {
            const precio = CATALOGO_PRODUCTOS_VENTAS.find(p => p.idProductoCompuesto === item.idProductoCompuesto)?.precioUnitario ?? item.precioUnitario;
            return { ...item, precioUnitario: precio, subtotal: Number(item.cantidad) * precio };
          }
          const cantidad = Math.max(min, Number(item.cantidad));
          return { ...item, cantidad, subtotal: cantidad * item.precioUnitario };
        });
        cambiar({ tipoPedido: tipo, esDonacion, esCanje: esDonacion ? false : datos.esCanje, idPresupuestoCliente: '',
          diaEntregaHabitual: tipo === 'Semanal' ? datos.diaEntregaHabitual || 'Lunes' : '',
          descuentoAplicado: esSinCargo ? 100 : min === 10 ? 10 : 0, items });
      }}><MenuItem value="Minorista">Minorista</MenuItem><MenuItem value="Mayorista">Evento (Mayorista)</MenuItem><MenuItem value="Semanal">Semanal</MenuItem><MenuItem value="Donación">Donación (sin costo)</MenuItem></TextField>
      {mayorista && <BuscadorDocumento disabled={sinBase} options={presupuestosCliente} value={presupuestosCliente.find(p => p.idPresupuestoCliente === datos.idPresupuestoCliente) || null}
        getOptionLabel={p => `${p.nroPresupuesto} · ${p.clienteNombre}`} isOptionEqualToValue={(a, b) => a.idPresupuestoCliente === b.idPresupuestoCliente}
        onChange={(_, presupuesto) => onSelectPresupuesto(presupuesto?.idPresupuestoCliente ?? '')}
        renderInput={params => <TextField {...params} label="Presupuesto de origen" size="small" />} />}
      <FormControlLabel sx={{ m: 0, mr: 2, justifySelf: 'end', whiteSpace: 'nowrap' }} label="Con envío"
        control={<Checkbox size="small" checked={conEnvio} disabled={sinBase} onChange={event => cambiar({
          conEnvio: event.target.checked,
          domicilioEntrega: event.target.checked
            ? armarDomicilio(datos.calleEntrega, datos.alturaEntrega, datos.localidadEntrega)
            : 'Retiro en Local Comercial',
        })} />} />
    </CamposDocumento>
    <CamposDocumento columns={(conEnvio ? 6 : 5) + (datos.tipoPedido === 'Semanal' ? 1 : 0)}>
      {conEnvio ? (
        <>
          <TextField size="small" label="Localidad" disabled={sinBase} value={datos.localidadEntrega || ''} onChange={event => actualizarDireccion({ localidadEntrega: event.target.value })} />
          <TextField size="small" label="Calle" disabled={sinBase} value={datos.calleEntrega || ''} onChange={event => actualizarDireccion({ calleEntrega: event.target.value })} />
          <TextField size="small" label="Altura" disabled={sinBase} value={datos.alturaEntrega || ''} onChange={event => actualizarDireccion({ alturaEntrega: event.target.value })} />
        </>
      ) : (
        <Box sx={{ gridColumn: 'span 2' }}>
          <TextField fullWidth size="small" label="Dirección de entrega o retiro" disabled value="Retiro en Local Comercial" />
        </Box>
      )}
      <TextField size="small" label="Teléfono" type="tel" disabled={sinBase} value={datos.telefonoPedido || ''} onChange={event => cambiar({ telefonoPedido: event.target.value })} />
      <TextField size="small" label="Fecha de entrega" type="date" required disabled={sinBase} value={datos.fechaEntregaEstimada || ''} onChange={event => cambiar({ fechaEntregaEstimada: event.target.value })} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: datos.fechaEmision } }} />
      <TextField size="small" label="Hora de entrega" type="time" required disabled={sinBase} value={datos.horaEntregaEstimada || ''} onChange={event => cambiar({ horaEntregaEstimada: event.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
      {datos.tipoPedido === 'Semanal' && <TextField select size="small" label="Días de entrega" value={dias} disabled={sinBase} onChange={event => cambiar({ diaEntregaHabitual: event.target.value.join(', ') })} slotProps={{ select: { multiple: true, renderValue: seleccion => seleccion.join(', ') } }}>
        {DIAS_ENTREGA_SEMANAL.map(dia => <MenuItem key={dia} value={dia}>{dia}</MenuItem>)}
      </TextField>}
    </CamposDocumento>
    <ProductosDocumento items={datos.items} onChange={items => cambiar({ items })} disabled={sinBase} minimo={mayorista ? 10 : 1} sinCargo={sinCargo} />
    <CamposDocumento columns={5}>
      <Box sx={{ gridColumn: 'span 2' }}>
        <TextField fullWidth label="Observaciones" size="small" disabled={sinBase} value={datos.observaciones || ''} onChange={event => cambiar({ observaciones: event.target.value })} />
      </Box>
      <ImporteDocumento label="Subtotal" amount={subtotal} />
      <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">{sinCargo ? 'Sin cargo' : mayorista ? 'Mayorista (10%)' : 'Descuento'}</Typography><Typography variant="body2">{sinCargo ? 'Canje o donación' : `${datos.descuentoAplicado || 0}%`}</Typography></Box>
      <ImporteDocumento label="Total" amount={total} primary />
    </CamposDocumento>
  </FormularioDocumento>;
}
