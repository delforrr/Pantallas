import ComprobanteDetalle from '../../components/compras/ComprobanteDetalle';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useState } from 'react';
import { Alert, Stack, Typography } from '@mui/material';
import { FormDialog, ListToolbar, ModuleSurface, RecordsView, StatusChip, RecordIcon, SummaryCards } from '../../components/compras/ModuleUI';
import OrdenCompraForm from '../../components/compras/OrdenCompraForm';
import RecepcionForm from '../../components/compras/RecepcionForm';
import { INITIAL_PROVEEDORES, INITIAL_PRESUPUESTOS, INITIAL_FACTURAS, initialReceptionState } from './mockData';
import { money } from './logic';
export default function OrdenCompraScreen() {
  const [data, setData] = useState(initialReceptionState);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('TODOS');
  const [form, setForm] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [receiving, setReceiving] = useState(null);
  const [notice, setNotice] = useState('');
  const {
    ordenes,
    remitos
  } = data;
  const rows = ordenes.filter(o => `${o.id} ${o.proveedorNombre} ${o.presupuestoId || ''}`.toLowerCase().includes(search.toLowerCase()) && (status === 'TODOS' || o.estado === status));
  const selected = ordenes.find(o => o.id === detailId);
  const clear = () => {
    setSearch('');
    setStatus('TODOS');
  };
  const actions = (o, showDetail = true) => {
    const edit = <RecordIcon onClick={() => { setDetailId(null); setForm(o); }} label="Editar" color="primary"><EditOutlinedIcon /></RecordIcon>;
    const remove = <RecordIcon onClick={() => { setDetailId(null); setDeleting(o); }} label="Eliminar" color="error"><DeleteOutlineIcon /></RecordIcon>;
    return <>{showDetail && <RecordIcon onClick={() => setDetailId(o.id)} label="Ver detalle" color="default"><VisibilityOutlinedIcon /></RecordIcon>}{o.estado === 'Pendiente' && <RecordIcon label="Enviar al proveedor" color="primary" onClick={() => setData(previous => ({
      ...previous,
      ordenes: previous.ordenes.map(order => order.id === o.id ? { ...order, estado: 'Enviada' } : order)
    }))}><SendOutlinedIcon /></RecordIcon>}{['Enviada', 'Recibida Parcial'].includes(o.estado) && <RecordIcon label="Recibir mercadería" color="primary" onClick={() => { setDetailId(null); setReceiving(o.id); }}><Inventory2OutlinedIcon /></RecordIcon>}{edit}{remove}</>;
  };
  return <ModuleSurface><Stack sx={{
      gap: 2
    }}>
    {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}
    <SummaryCards items={[{ label: 'Órdenes de compra', value: ordenes.length }, { label: 'Pendientes', value: ordenes.filter(o => ['Pendiente','Recibida Parcial'].includes(o.estado)).length, color: 'warning.main' }, { label: 'Enviadas', value: ordenes.filter(o => o.estado === 'Enviada').length, color: 'info.main' }, { label: 'Cumplidas', value: ordenes.filter(o => o.estado === 'Cumplida').length, color: 'success.main' }]} />
    <RecordsView toolbar={<ListToolbar search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={['Pendiente', 'Enviada', 'Recibida Parcial', 'Cumplida', 'Cancelada']} onCreate={() => setForm({})} createLabel="Nueva orden de compra" />} rows={rows} cardTitle={o => o.id} empty={ordenes.length ? 'No hay resultados para estos filtros.' : 'Todavía no hay órdenes de compra.'} onClear={search || status !== 'TODOS' ? clear : undefined} columns={[{
        label: 'Orden',
        render: o => o.id
      }, {
        label: 'Proveedor',
        render: o => o.proveedorNombre
      }, {
        label: 'Origen',
        render: o => o.presupuestoId || 'Reposición puntual local'
      }, {
        label: 'Entrega estimada',
        render: o => o.fechaEntregaEstimada
      }, {
        label: 'Total',
        numeric: true,
        render: o => money(o.total)
      }, {
        label: 'Estado',
        render: o => <StatusChip value={o.estado} />
      }]} actions={actions} />
    </Stack>
    {form && <OrdenCompraForm key={form.id || 'new'} open initial={form.id ? form : undefined} presupuestos={INITIAL_PRESUPUESTOS} proveedores={INITIAL_PROVEEDORES} ordenes={ordenes} onClose={() => setForm(null)} onSave={order => {
      setData(previous => ({
        ...previous,
        ordenes: form.id ? previous.ordenes.map(o => o.id === order.id ? order : o) : [order, ...previous.ordenes]
      }));
      setForm(null);
      setNotice(`Orden ${order.id} guardada.`);
    }} />}
    {receiving && <RecepcionForm key={receiving} state={data} initialOrder={receiving} onClose={() => setReceiving(null)} onReceive={(next, receipt) => {
      setData(next);
      setReceiving(null);
      setNotice(`Remito ${receipt.id} confirmado. Stock y saldo de la orden actualizados.`);
    }} />}
    <FormDialog open={Boolean(selected)} onClose={() => setDetailId(null)} title="Detalle de orden de compra" footerActions={selected && actions(selected, false)} maxWidth="lg">{selected && <>
      <ComprobanteDetalle tipo="Orden de compra" numero={selected.id} estado={selected.estado} items={selected.items} total={selected.total} observaciones={selected.observaciones || selected.motivo} fields={[
        { label: 'Proveedor', value: selected.proveedorNombre }, { label: 'CUIT', value: INITIAL_PROVEEDORES.find(p => p.id === selected.proveedorId)?.cuit },
        { label: 'Fecha de emisión', value: selected.fechaEmision }, { label: 'Entrega estimada', value: selected.fechaEntregaEstimada },
        { label: 'Presupuesto de referencia', value: selected.presupuestoId || 'Compra directa local' }, { label: 'Condición de pago', value: selected.formaPago },
      ]}>
        <Typography variant="body2">Remitos: {remitos.filter(r => r.ordenCompraId === selected.id).map(r => r.id).join(', ') || 'Sin recepciones'}</Typography>
        <Typography variant="body2">Facturas: {INITIAL_FACTURAS.filter(f => f.ordenCompraId === selected.id).map(f => f.id).join(', ') || 'Sin facturas asociadas'}</Typography>
      </ComprobanteDetalle>
    </>}</FormDialog>
    <FormDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Eliminar orden de compra" action="Eliminar orden" onSubmit={event => {
      event.preventDefault();
      setData(previous => ({
        ...previous,
        ordenes: previous.ordenes.filter(o => o.id !== deleting.id)
      }));
      setDeleting(null);
    }}><Typography>¿Eliminar {deleting?.id} de {deleting?.proveedorNombre}, por {money(deleting?.total)}? Esta acción no puede deshacerse.</Typography></FormDialog>
  </ModuleSurface>;
}
