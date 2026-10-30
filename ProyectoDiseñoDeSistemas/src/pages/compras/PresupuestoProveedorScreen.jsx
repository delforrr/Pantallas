import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ComprobanteDetalle from '../../components/compras/ComprobanteDetalle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useState } from 'react';
import { Alert, Grid, Stack, TextField, MenuItem, Typography } from '@mui/material';
import { FormSection, FormDialog, ListToolbar, ModuleSurface, RecordsView, StatusChip, RecordIcon, SummaryCards } from '../../components/compras/ModuleUI';
import { DocumentoUploader } from '../../components/compras/DocumentoUploader';
import { DetalleItemsTable } from '../../components/compras/DetalleItemsTable';
import OrdenCompraForm from '../../components/compras/OrdenCompraForm';
import { INITIAL_PRESUPUESTOS, INITIAL_PROVEEDORES, INITIAL_ORDENES_COMPRA } from './mockData';
import { itemTotal, money, nextId, today, validBudget, validItems } from './logic';
export default function PresupuestoProveedorScreen() {
  const [presupuestos, setPresupuestos] = useState(INITIAL_PRESUPUESTOS);
  const [ordenes, setOrdenes] = useState(INITIAL_ORDENES_COMPRA);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('TODOS');
  const [form, setForm] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [budgetForOrder, setBudgetForOrder] = useState(null);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const effectiveStatus = p => p.validezHasta < today() && !['Rechazado'].includes(p.estado) ? 'Vencido' : p.estado;
  const rows = presupuestos.filter(p => `${p.id} ${p.proveedorNombre} ${p.cuit}`.toLowerCase().includes(search.toLowerCase()) && (status === 'TODOS' || effectiveStatus(p) === status));
  const selected = presupuestos.find(p => p.id === detailId);
  const clear = () => {
    setSearch('');
    setStatus('TODOS');
  };
  const openForm = p => {
    setError('');
    setForm(p ? {
      ...p,
      items: p.items.map(i => ({
        ...i
      }))
    } : {
      proveedorId: '',
      fechaEmision: today(),
      validezHasta: '',
      estado: 'Pendiente',
      items: [],
      observaciones: '',
      documentoUrl: ''
    });
  };
  const save = event => {
    event.preventDefault();
    const provider = INITIAL_PROVEEDORES.find(p => p.id === Number(form.proveedorId));
    if (!provider || !validItems(form.items)) {
      setError('Seleccioná un proveedor y completá insumos, cantidades y precios positivos sin repetir el mismo insumo.');
      event.currentTarget.querySelector('input')?.focus();
      return;
    }
    if (!form.validezHasta || form.validezHasta < form.fechaEmision) {
      setError('La vigencia no puede ser anterior a la emisión.');
      return;
    }
    const saved = {
      ...form,
      proveedorId: provider.id,
      proveedorNombre: provider.razonSocial,
      cuit: provider.cuit,
      id: form.id || nextId(presupuestos, `PP-${today().slice(0, 4)}-`),
      items: form.items.map(i => ({
        ...i,
        cantidad: Number(i.cantidad),
        precioUnitario: Number(i.precioUnitario),
        subtotal: itemTotal([i])
      })),
      total: itemTotal(form.items)
    };
    setPresupuestos(previous => form.id ? previous.map(p => p.id === form.id ? saved : p) : [saved, ...previous]);
    setForm(null);
    setNotice(`Presupuesto ${saved.id} guardado.`);
  };
  const changeStatus = (p, value) => {
    if (value === 'Aprobado' && p.validezHasta < today()) {
      setNotice('No se puede aceptar un presupuesto vencido.');
      return;
    }
    setPresupuestos(previous => previous.map(item => item.id === p.id ? {
      ...item,
      estado: value
    } : item));
  };
  const actions = (p, showDetail = true) => {
    const edit = <RecordIcon onClick={() => { setDetailId(null); openForm(p); }} label="Editar" color="primary"><EditOutlinedIcon /></RecordIcon>;
    const remove = <RecordIcon onClick={() => { setDetailId(null); setDeleting(p); }} label="Eliminar" color="error"><DeleteOutlineIcon /></RecordIcon>;
    return <>{showDetail && <RecordIcon onClick={() => setDetailId(p.id)} label="Ver detalle" color="default"><VisibilityOutlinedIcon /></RecordIcon>}{effectiveStatus(p) === 'Pendiente' && <><RecordIcon label="Aceptar presupuesto" color="success" onClick={() => changeStatus(p, 'Aprobado')}><CheckCircleOutlinedIcon /></RecordIcon><RecordIcon label="Rechazar presupuesto" color="error" onClick={() => changeStatus(p, 'Rechazado')}><HighlightOffIcon /></RecordIcon></>}{validBudget(p) && <RecordIcon label="Crear orden" color="primary" onClick={() => { setDetailId(null); setBudgetForOrder(p); }}><AddIcon /></RecordIcon>}{edit}{remove}</>;
  };
  return <ModuleSurface><Stack sx={{
      gap: 2
    }}>
    {notice && <Alert severity="info" onClose={() => setNotice('')}>{notice}</Alert>}
    <SummaryCards items={[{ label: 'Presupuestos', value: presupuestos.length }, { label: 'Pendientes', value: presupuestos.filter(p => effectiveStatus(p) === 'Pendiente').length, color: 'warning.main' }, { label: 'Aceptados', value: presupuestos.filter(p => effectiveStatus(p) === 'Aprobado').length, color: 'success.main' }, { label: 'Monto aceptado', value: money(presupuestos.filter(p => effectiveStatus(p) === 'Aprobado').reduce((sum,p) => sum + p.total,0)) }]} />
    <RecordsView toolbar={<ListToolbar search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={['Pendiente', 'Aprobado', 'Rechazado', 'Vencido']} createLabel="Nuevo presupuesto" onCreate={() => openForm()} />} rows={rows} cardTitle={p => p.id} empty={presupuestos.length ? 'No hay resultados para estos filtros.' : 'Todavía no hay presupuestos registrados.'} onClear={search || status !== 'TODOS' ? clear : undefined} columns={[{
        label: 'Presupuesto',
        render: p => p.id
      }, {
        label: 'Proveedor',
        render: p => p.proveedorNombre
      }, {
        label: 'Emisión',
        render: p => p.fechaEmision
      }, {
        label: 'Vigente hasta',
        render: p => p.validezHasta
      }, {
        label: 'Total',
        numeric: true,
        render: p => money(p.total)
      }, {
        label: 'Estado',
        render: p => <StatusChip value={effectiveStatus(p)} />
      }]} actions={actions} />
    </Stack>
    <FormDialog open={Boolean(form)} onClose={() => setForm(null)} title={form?.id ? `Editar ${form.id}` : 'Nuevo presupuesto de proveedor'} onSubmit={save} action={form?.id ? 'Guardar cambios' : 'Registrar presupuesto'} maxWidth="lg">{form && <>
      <FormSection number={1} title="Proveedor y vigencia"><Grid container spacing={2}><Grid size={{ xs: 12, sm: 12, md: 6 }}><TextField fullWidth autoFocus required select label="Proveedor" value={form.proveedorId} onChange={e => setForm({
          ...form,
          proveedorId: e.target.value
        })}>{INITIAL_PROVEEDORES.map(p => <MenuItem key={p.id} value={p.id} sx={{
            whiteSpace: 'normal'
          }}>{p.razonSocial}</MenuItem>)}</TextField></Grid>
      <Grid size={{
            xs: 12,
            sm: 6,
            md: 3
          }}><TextField fullWidth required type="date" label="Fecha de emisión" value={form.fechaEmision} onChange={e => setForm({
              ...form,
              fechaEmision: e.target.value
            })} slotProps={{
              inputLabel: {
                shrink: true
              }
            }} /></Grid><Grid size={{
            xs: 12,
            sm: 6,
            md: 3
          }}><TextField fullWidth required type="date" label="Vigente hasta" value={form.validezHasta} onChange={e => setForm({
              ...form,
              validezHasta: e.target.value
            })} slotProps={{
              inputLabel: {
                shrink: true
              }
            }} error={Boolean(error) && form.validezHasta < form.fechaEmision} helperText={error && form.validezHasta < form.fechaEmision ? 'Debe ser igual o posterior a la emisión.' : ''} /></Grid></Grid>
      </FormSection><FormSection number={2} title="Insumos e importes"><DetalleItemsTable items={form.items} onChange={items => setForm({
          ...form,
          items
        })} unitReadOnly />
      </FormSection><FormSection number={3} title="Observaciones y adjunto"><TextField multiline minRows={2} label="Observaciones del presupuesto" value={form.observaciones || ''} onChange={e => setForm({
          ...form,
          observaciones: e.target.value
        })} />
      <DocumentoUploader label="Presupuesto adjunto" value={form.documentoUrl} onChange={documentoUrl => setForm({
          ...form,
          documentoUrl
        })} /></FormSection>{error && <Alert severity="error">{error}</Alert>}
    </>}</FormDialog>
    <FormDialog open={Boolean(selected)} onClose={() => setDetailId(null)} title="Detalle del presupuesto" maxWidth="lg" footerActions={selected && actions(selected, false)}>{selected && <>
      <ComprobanteDetalle tipo="Presupuesto de proveedor" numero={selected.id} estado={effectiveStatus(selected)} emisor={selected.proveedorNombre} items={selected.items} total={selected.total} observaciones={selected.observaciones} fields={[
        { label: 'Cliente', value: 'PastaFab' }, { label: 'CUIT del proveedor', value: selected.cuit }, { label: 'Fecha de emisión', value: selected.fechaEmision }, { label: 'Válido hasta', value: selected.validezHasta },
      ]} />
      {selected.documentoUrl && <DocumentoUploader label="Documento del proveedor" value={selected.documentoUrl} readOnly />}
    </>}</FormDialog>
    {budgetForOrder && <OrdenCompraForm key={budgetForOrder.id} open budget={budgetForOrder} presupuestos={presupuestos} proveedores={INITIAL_PROVEEDORES} ordenes={ordenes} onClose={() => setBudgetForOrder(null)} onSave={order => {
      setOrdenes(previous => [order, ...previous]);
      setBudgetForOrder(null);
      setDetailId(null);
      setCreated(order);
    }} />}
    <FormDialog open={Boolean(created)} onClose={() => setCreated(null)} title="Orden de compra emitida" maxWidth="lg">{created && <ComprobanteDetalle tipo="Orden de compra" numero={created.id} estado={created.estado} items={created.items} total={created.total} observaciones={created.observaciones || created.motivo} fields={[
      { label: 'Proveedor', value: created.proveedorNombre }, { label: 'Presupuesto de referencia', value: created.presupuestoId }, { label: 'Fecha de emisión', value: created.fechaEmision }, { label: 'Entrega estimada', value: created.fechaEntregaEstimada }, { label: 'Condición de pago', value: created.formaPago },
    ]} />}</FormDialog>
    <FormDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Eliminar presupuesto" action="Eliminar presupuesto" onSubmit={event => {
      event.preventDefault();
      setPresupuestos(previous => previous.filter(p => p.id !== deleting.id));
      setDeleting(null);
    }}><Typography>¿Eliminar {deleting?.id} de {deleting?.proveedorNombre}, por {money(deleting?.total)}? Esta acción no puede deshacerse.</Typography></FormDialog>
  </ModuleSurface>;
}
