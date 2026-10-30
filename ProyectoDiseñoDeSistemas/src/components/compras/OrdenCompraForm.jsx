import { useState } from 'react';
import { Alert, Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { FormSection, FormDialog } from './ModuleUI';
import { DetalleItemsTable } from './DetalleItemsTable';
import { itemTotal, nextId, today, validBudget, validItems } from '../../pages/compras/logic';
export default function OrdenCompraForm({
  open,
  onClose,
  initial,
  budget,
  presupuestos,
  proveedores,
  ordenes,
  onSave
}) {
  const [form, setForm] = useState(() => initial ? {
    ...initial,
    modalidad: initial.presupuestoId ? 'presupuesto' : 'directa',
    motivo: initial.motivo || '',
    formaPago: initial.formaPago || '',
    items: initial.items.map(i => ({
      ...i
    }))
  } : {
    modalidad: budget ? 'presupuesto' : '',
    presupuestoId: budget?.id || '',
    proveedorId: budget?.proveedorId || '',
    fechaEmision: today(),
    fechaEntregaEstimada: '',
    formaPago: '',
    motivo: '',
    observaciones: '',
    items: budget?.items.map(i => ({
      ...i
    })) || []
  });
  const [error, setError] = useState('');
  const eligible = presupuestos.filter(p => validBudget(p));
  const source = presupuestos.find(p => p.id === form.presupuestoId);
  const chooseBudget = value => {
    const selected = presupuestos.find(p => p.id === value);
    setForm(previous => ({
      ...previous,
      presupuestoId: value,
      proveedorId: selected?.proveedorId || '',
      items: selected?.items.map(i => ({
        ...i
      })) || []
    }));
  };
  const save = event => {
    event.preventDefault();
    if (!proveedores.some(p => p.id === Number(form.proveedorId))) {
      setError('Seleccioná un proveedor registrado.');
      return;
    }
    if (form.modalidad === 'presupuesto' && (!validBudget(source) || source.proveedorId !== Number(form.proveedorId))) {
      setError('Seleccioná un presupuesto aceptado y vigente del proveedor.');
      return;
    }
    if (!form.modalidad || form.modalidad === 'directa' && !form.motivo.trim()) {
      setError('Indicá el motivo de la reposición puntual de insumos menores a proveedor local.');
      return;
    }
    if (!validItems(form.items)) {
      setError('Completá insumos, cantidades y precios positivos. No repitas el mismo insumo.');
      event.currentTarget.querySelector('[aria-invalid="true"], input')?.focus();
      return;
    }
    if (!form.formaPago.trim()) {
      setError('Indicá la condición de pago acordada.');
      return;
    }
    const provider = proveedores.find(p => p.id === Number(form.proveedorId));
    onSave({
      ...form,
      id: initial?.id || nextId(ordenes, `OC-${today().slice(0, 4)}-`),
      presupuestoId: form.modalidad === 'presupuesto' ? form.presupuestoId : null,
      proveedorId: provider.id,
      proveedorNombre: provider.razonSocial,
      estado: initial?.estado || 'Pendiente',
      total: itemTotal(form.items),
      items: form.items.map(i => ({
        ...i,
        cantidad: Number(i.cantidad),
        precioUnitario: Number(i.precioUnitario),
        subtotal: itemTotal([i])
      }))
    });
  };
  return <FormDialog open={open} onClose={onClose} title={initial ? `Editar ${initial.id}` : 'Nueva orden de compra'} onSubmit={save} action={initial ? 'Guardar cambios' : 'Crear orden'} maxWidth="lg">
    <FormSection number={1} title="Origen, proveedor y condiciones"><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
    <TextField autoFocus required select label="Origen de la compra" value={form.modalidad} onChange={e => setForm({
      ...form,
      modalidad: e.target.value,
      presupuestoId: '',
      proveedorId: '',
      items: []
    })} disabled={Boolean(initial)}><MenuItem value="presupuesto">Desde presupuesto aceptado</MenuItem><MenuItem value="directa">Reposición puntual a proveedor local</MenuItem></TextField>
    {form.modalidad === 'presupuesto' && <><TextField required select label="Presupuesto aceptado y vigente" value={form.presupuestoId} onChange={e => chooseBudget(e.target.value)} error={Boolean(error) && !validBudget(source)} helperText={!eligible.length ? 'No hay presupuestos aceptados vigentes. Registrá y aceptá uno antes de continuar.' : 'Se trasladan proveedor e insumos del presupuesto.'}>{eligible.map(p => <MenuItem key={p.id} value={p.id} sx={{
          whiteSpace: 'normal'
        }}>{p.id} · {p.proveedorNombre}</MenuItem>)}{initial && source && !validBudget(source) && <MenuItem value={source.id}>{source.id} · Fuera de vigencia</MenuItem>}</TextField><Typography variant="body2" sx={{ gridColumn: '1 / -1' }}>Proveedor: {source?.proveedorNombre || 'Seleccioná un presupuesto'}</Typography></>}
    {form.modalidad === 'directa' && <><TextField required select label="Proveedor local" value={form.proveedorId} onChange={e => setForm({
        ...form,
        proveedorId: e.target.value
      })}>{proveedores.map(p => <MenuItem key={p.id} value={p.id} sx={{
          whiteSpace: 'normal'
        }}>{p.razonSocial} · {p.localidad}</MenuItem>)}</TextField><TextField sx={{ gridColumn: '1 / -1' }} required label="Motivo de reposición puntual" multiline minRows={2} value={form.motivo} onChange={e => setForm({
        ...form,
        motivo: e.target.value
      })} helperText="El encargado identifica la compra como reposición de insumos menores a proveedor local." /></>}
    </Box><Grid container spacing={2}><Grid size={{
        xs: 12,
        sm: 6
      }}><TextField fullWidth required type="date" label="Fecha de emisión" value={form.fechaEmision} onChange={e => setForm({
          ...form,
          fechaEmision: e.target.value
        })} slotProps={{
          inputLabel: {
            shrink: true
          }
        }} /></Grid><Grid size={{
        xs: 12,
        sm: 6
      }}><TextField fullWidth required type="date" label="Entrega estimada" value={form.fechaEntregaEstimada} onChange={e => setForm({
          ...form,
          fechaEntregaEstimada: e.target.value
        })} slotProps={{
          inputLabel: {
            shrink: true
          }
        }} /></Grid></Grid>
    <TextField sx={{ width: { xs: '100%', sm: '50%' } }} required label="Condición de pago acordada" value={form.formaPago} onChange={e => setForm({
      ...form,
      formaPago: e.target.value
    })} helperText="Por ejemplo: transferencia a 30 días fecha factura. No se calculan vencimientos." />
    </FormSection><FormSection number={2} title="Insumos e importes"><DetalleItemsTable items={form.items} onChange={items => setForm({
      ...form,
      items
    })} unitReadOnly />
    <TextField multiline minRows={2} label="Observaciones de la orden" value={form.observaciones || ''} onChange={e => setForm({
      ...form,
      observaciones: e.target.value
    })} />
    </FormSection>{error && <Alert severity="error" tabIndex={-1}>{error}</Alert>}
  </FormDialog>;
}
