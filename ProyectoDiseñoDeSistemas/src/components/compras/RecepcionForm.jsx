import { useState } from 'react';
import { Alert, Box, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { FormSection, FormDialog } from './ModuleUI';
import { DocumentoUploader } from './DocumentoUploader';
import { pendingItems, receivePurchase, today } from '../../pages/compras/logic';
export default function RecepcionForm({
  state,
  initialOrder,
  onClose,
  onReceive
}) {
  const [form, setForm] = useState({
    id: '',
    ordenCompraId: initialOrder || '',
    fechaEmision: today(),
    fechaEntregaReal: today(),
    observaciones: '',
    documentoUrl: '',
    quantities: {}
  });
  const [error, setError] = useState('');
  const order = state.ordenes.find(o => o.id === form.ordenCompraId);
  const pending = order ? pendingItems(order, state.remitos) : [];
  const save = event => {
    event.preventDefault();
    try {
      const receipt = {
        ...form,
        items: pending.map(i => ({
          materiaPrima: i.materiaPrima,
          unidad: i.unidad,
          cantidadRecibida: form.quantities[`${i.materiaPrima}|${i.unidad}`] ?? 0
        }))
      };
      const next = receivePurchase(state, receipt);
      onReceive(next, next.remitos[0]);
    } catch (reason) {
      setError(reason.message);
      event.currentTarget.querySelector('[aria-invalid="true"], input')?.focus();
    }
  };
  return <FormDialog open onClose={onClose} title="Confirmar recepción de mercadería" onSubmit={save} action="Confirmar recepción">
    <FormSection number={1} title="Orden y documento de recepción"><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
    <TextField autoFocus required select label="Orden de compra con saldo" value={form.ordenCompraId} onChange={e => setForm({
      ...form,
      ordenCompraId: e.target.value,
      quantities: {}
    })}>{state.ordenes.filter(o => ['Enviada', 'Recibida Parcial'].includes(o.estado) && pendingItems(o, state.remitos).some(i => i.pendiente > 0)).map(o => <MenuItem key={o.id} value={o.id} sx={{
        whiteSpace: 'normal'
      }}>{o.id} · {o.proveedorNombre}</MenuItem>)}</TextField>
    {!state.ordenes.some(o => ['Enviada', 'Recibida Parcial'].includes(o.estado)) && <Alert severity="info">No hay órdenes enviadas con saldo pendiente.</Alert>}
    <TextField required label="Número de remito del proveedor" value={form.id} onChange={e => setForm({
      ...form,
      id: e.target.value
    })} error={Boolean(error) && state.remitos.some(r => r.id.trim().toLowerCase() === form.id.trim().toLowerCase())} helperText={error && state.remitos.some(r => r.id.trim().toLowerCase() === form.id.trim().toLowerCase()) ? 'El remito ya fue registrado.' : 'No se admite registrar el mismo remito dos veces.'} />
    <TextField required type="date" label="Fecha de recepción" value={form.fechaEntregaReal} onChange={e => setForm({
      ...form,
      fechaEntregaReal: e.target.value
    })} slotProps={{
      inputLabel: {
        shrink: true
      }
    }} />
    {order && <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>Proveedor: {order.proveedorNombre}</Typography>}</Box>
    </FormSection>{pending.length > 0 && <FormSection number={2} title="Cantidades aceptadas">
    {pending.map(i => {
      const key = `${i.materiaPrima}|${i.unidad}`;
      const amount = form.quantities[key] ?? '';
      const invalid = amount !== '' && (!Number.isFinite(Number(amount)) || Number(amount) < 0 || Number(amount) > i.pendiente);
      return <Paper key={key} variant="outlined" sx={{
        p: 2,
        minWidth: 0
      }}><Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, alignItems: { sm: 'center' } }}><Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontWeight: 700 }}>{i.materiaPrima}</Typography><Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, m: 0, mt: 1 }}>{[['Pedido', i.cantidad], ['Recibido', i.recibida], ['Saldo', i.pendiente]].map(([label, value]) => <Box key={label}><Typography component="dt" variant="caption" color="text.secondary">{label}</Typography><Typography component="dd" variant="body2" sx={{ m: 0, fontWeight: 600 }}>{value} {i.unidad}</Typography></Box>)}</Box></Box><TextField sx={{ width: { xs: '100%', sm: 200 }, flexShrink: 0 }} type="number" label={`Aceptado ahora (${i.unidad})`} value={amount} disabled={!i.pendiente} onChange={e => setForm({
            ...form,
            quantities: {
              ...form.quantities,
              [key]: e.target.value
            }
          })} slotProps={{
            htmlInput: {
              min: 0,
              max: i.pendiente,
              step: 'any',
      inputMode: 'decimal',
              'aria-label': `Cantidad aceptada de ${i.materiaPrima}`
            }
          }} error={invalid} helperText={invalid ? `Ingresá una cantidad entre 0 y ${i.pendiente}.` : `Saldo tras confirmar: ${Math.max(0, i.pendiente - (Number(amount) || 0))} ${i.unidad}`} /></Stack></Paper>;
    })}
    </FormSection>}<FormSection number={pending.length ? 3 : 2} title="Observaciones y adjunto"><TextField multiline minRows={2} label="Observaciones de recepción" value={form.observaciones} onChange={e => setForm({
      ...form,
      observaciones: e.target.value
    })} />
    <DocumentoUploader label="Remito adjunto" value={form.documentoUrl} onChange={documentoUrl => setForm({
      ...form,
      documentoUrl
    })} />
    </FormSection>
    {error && <Alert severity="error">{error}</Alert>}
  </FormDialog>;
}
