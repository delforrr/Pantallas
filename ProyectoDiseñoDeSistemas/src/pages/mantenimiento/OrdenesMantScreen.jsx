import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import CheckIcon from '@mui/icons-material/Check';
import OrdenMantenimientoDetalle from '../../components/mantenimiento/OrdenMantenimientoDetalle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useState } from 'react';
import { Alert, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { FormSection, FormDialog, ListToolbar, ModuleSurface, RecordsView, StatusChip, RecordIcon, SummaryCards } from '../../components/mantenimiento/ModuleUI';
import { INITIAL_MAQUINARIAS, INITIAL_ORDENES_MANTENIMIENTO, INITIAL_TECNICOS } from './mockData';
import { localNow, transitionOrder, createMaintenanceOrder } from './logic';
const states = ['Pendiente', 'En Proceso', 'Finalizada', 'Cancelada'];
const machineStates = ['Operativa', 'En Mantenimiento', 'En Reparación', 'Fuera de Servicio'];
export default function OrdenesMantScreen() {
  const [data, setData] = useState({
    ordenes: INITIAL_ORDENES_MANTENIMIENTO,
    maquinarias: INITIAL_MAQUINARIAS
  });
  const {
    ordenes,
    maquinarias
  } = data;
  const tecnicos = INITIAL_TECNICOS;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('TODOS');
  const [type, setType] = useState('TODOS');
  const blank = () => ({
    maquinariaId: '',
    empleadoId: '',
    tipo: 'Preventivo',
    fechaEmision: localNow().slice(0, 10),
    descripcion: ''
  });
  const [form, setForm] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [closing, setClosing] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const selected = ordenes.find(o => o.id === detailId);
  const rows = ordenes.filter(o => `${o.id} ${o.maquinariaNombre} ${o.tecnicoNombre}`.toLowerCase().includes(search.toLowerCase()) && (status === 'TODOS' || status === o.estado) && (type === 'TODOS' || type === o.tipo));
  const closeForm = () => setForm(null);
  const update = (key, value) => setData(previous => ({
    ...previous,
    [key]: typeof value === 'function' ? value(previous[key]) : value
  }));
  const clear = () => {
    setSearch('');
    setStatus('TODOS');
    setType('TODOS');
  };
  const save = event => {
    event.preventDefault();
    const machine = maquinarias.find(m => m.id === Number(form.maquinariaId));
    const technician = tecnicos.find(t => t.id === Number(form.empleadoId));
    if (!machine || !technician || !form.descripcion.trim()) {
      setError('Seleccioná una máquina, un técnico y describí el trabajo previsto.');
      event.currentTarget.querySelector('[aria-invalid="true"], input, textarea')?.focus();
      return;
    }
    const saved = {
      ...form,
      maquinariaId: machine.id,
      maquinariaNombre: machine.nombre,
      maquinariaCodigo: machine.codigo,
      empleadoId: technician.id,
      tecnicoNombre: technician.nombre,
      descripcion: form.descripcion.trim()
    };
    update('ordenes', previous => form.id ? previous.map(o => o.id === form.id ? {
      ...o,
      ...saved
    } : o) : [createMaintenanceOrder(previous, maquinarias, tecnicos, saved), ...previous]);
    setNotice(form.id ? 'Orden actualizada.' : 'Orden pendiente creada. La máquina conserva su estado operativo.');
    closeForm();
  };
  const change = (order, target, result) => {
    try {
      const next = transitionOrder(data, order.id, target, result);
      setData(next);
      setError('');
      setNotice(target === 'Finalizada' ? 'Mantenimiento finalizado. Estado de máquina actualizado.' : 'Mantenimiento iniciado.');
      return true;
    } catch (reason) {
      setError(reason.message);
      return false;
    }
  };
  const actions = (o, showDetail = true) => {
    const edit = <RecordIcon onClick={() => {
      setDetailId(null);
      setError('');
      setForm({
        ...o,
        descripcion: o.descripcion || o.tareaRealizada || ''
      });
    }} label="Editar" color="primary"><EditOutlinedIcon /></RecordIcon>;
    const remove = <RecordIcon onClick={() => { setDetailId(null); setDeleting(o); }} label="Eliminar" color="error"><DeleteOutlineIcon /></RecordIcon>;
    return <>{showDetail && <RecordIcon onClick={() => setDetailId(o.id)} label="Ver detalle" color="default"><VisibilityOutlinedIcon /></RecordIcon>}{o.estado === 'Pendiente' && <RecordIcon label="Iniciar mantenimiento" color="primary" onClick={() => change(o, 'En Proceso')}><PlayArrowOutlinedIcon /></RecordIcon>}{o.estado === 'En Proceso' && <RecordIcon label="Finalizar mantenimiento" color="success" onClick={() => {
      setDetailId(null);
      setError('');
      setClosing({
        id: o.id,
        tareaRealizada: '',
        estadoMaquina: ''
      });
    }}><CheckIcon /></RecordIcon>}{edit}{remove}</>;
  };
  return <ModuleSurface>
    <Stack sx={{
      gap: 2
    }}>{notice && <Alert onClose={() => setNotice('')} severity="success">{notice}</Alert>}{error && !form && !closing && <Alert severity="error">{error}</Alert>}
    <SummaryCards items={[{ label: 'Órdenes de mantenimiento', value: ordenes.length }, { label: 'Preventivos', value: ordenes.filter(o => o.tipo === 'Preventivo').length }, { label: 'Correctivos', value: ordenes.filter(o => o.tipo === 'Correctivo').length, color: 'warning.main' }, { label: 'En proceso', value: ordenes.filter(o => o.estado === 'En Proceso').length, color: 'info.main' }]} />
    <RecordsView toolbar={<ListToolbar filterActive={type !== "TODOS"} onClear={clear} search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={states} createLabel="Nueva orden" onCreate={() => {
        setError('');
        setForm(blank());
      }}><TextField select label="Tipo" value={type} onChange={e => setType(e.target.value)} sx={{
          minWidth: {
            sm: 150
          }
        }}><MenuItem value="TODOS">Todos los tipos</MenuItem>{['Preventivo', 'Correctivo'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></ListToolbar>} rows={rows} cardTitle={o => o.id} empty={ordenes.length ? 'No hay resultados para estos filtros.' : 'Todavía no hay órdenes de mantenimiento.'} onClear={search || status !== 'TODOS' || type !== 'TODOS' ? clear : undefined} columns={[{
        label: 'Orden',
        render: o => o.id
      }, {
        label: 'Máquina',
        render: o => `${o.maquinariaCodigo} · ${o.maquinariaNombre}`
      }, {
        label: 'Tipo',
        render: o => o.tipo
      }, {
        label: 'Técnico',
        render: o => o.tecnicoNombre
      }, {
        label: 'Emisión',
        render: o => o.fechaEmision
      }, {
        label: 'Estado',
        render: o => <StatusChip value={o.estado} />
      }]} actions={actions} />
    </Stack>
    <FormDialog open={Boolean(form)} onClose={closeForm} title={form?.id ? `Editar ${form.id}` : 'Nueva orden de mantenimiento'} status={form?.estado === 'Finalizada' ? 'Finalizada' : undefined} onSubmit={save} action={form?.id ? 'Guardar cambios' : 'Crear orden'}>
      {form && <><FormSection number={1} title="Planificación del mantenimiento"><Grid container spacing={2}>
      <Grid size={{
            xs: 12,
            sm: 6
          }}><TextField autoFocus fullWidth required select label="Maquinaria" value={form.maquinariaId} onChange={e => setForm({
              ...form,
              maquinariaId: e.target.value
            })} disabled={Boolean(form.id) && form.estado !== 'Pendiente'} error={Boolean(error) && !form.maquinariaId} helperText={!maquinarias.length ? 'Registrá una maquinaria antes de crear una orden.' : ''}>{maquinarias.map(m => <MenuItem key={m.id} value={m.id} sx={{
                whiteSpace: 'normal'
              }}>{m.codigo} · {m.nombre}</MenuItem>)}</TextField></Grid>
      <Grid size={{
            xs: 12,
            sm: 6
          }}><TextField fullWidth required select label="Técnico responsable" value={form.empleadoId} onChange={e => setForm({
              ...form,
              empleadoId: e.target.value
            })} error={Boolean(error) && !form.empleadoId}>{tecnicos.map(t => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}</TextField></Grid>
      <Grid size={{
            xs: 12,
            sm: 6
          }}><TextField fullWidth select label="Tipo de mantenimiento" value={form.tipo} disabled={Boolean(form.id) && form.estado !== 'Pendiente'} onChange={e => setForm({
              ...form,
              tipo: e.target.value
            })}>{['Preventivo', 'Correctivo'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid>
      <Grid size={{
            xs: 12,
            sm: 6
          }}><TextField fullWidth required type="date" label="Fecha de emisión" value={form.fechaEmision} onChange={e => setForm({
              ...form,
              fechaEmision: e.target.value
            })} slotProps={{
              inputLabel: {
                shrink: true
              }
            }} /></Grid></Grid>
      <TextField required multiline minRows={3} label="Trabajo previsto / fallo observado" value={form.descripcion} onChange={e => setForm({
          ...form,
          descripcion: e.target.value
        })} error={Boolean(error) && !form.descripcion.trim()} helperText={error && !form.descripcion.trim() ? 'Describí el trabajo antes de emitir la orden.' : 'Incluí las observaciones y los repuestos previstos, si corresponde.'} /></FormSection>{error && <Alert severity="error">{error}</Alert>}</>}
    </FormDialog>
    <FormDialog open={Boolean(selected)} onClose={() => setDetailId(null)} title="Detalle de mantenimiento" footerActions={selected && actions(selected, false)}>{selected && <><OrdenMantenimientoDetalle orden={selected} /></>}</FormDialog>
    <FormDialog open={Boolean(closing)} onClose={() => setClosing(null)} title={`Finalizar ${closing?.id || 'mantenimiento'}`} action="Finalizar mantenimiento" onSubmit={event => {
      event.preventDefault();
      if (change(ordenes.find(o => o.id === closing.id), 'Finalizada', {
        tareaRealizada: closing.tareaRealizada,
        estadoMaquina: closing.estadoMaquina
      })) setClosing(null);
    }}>
      {closing && <><FormSection number={1} title="Trabajo realizado y estado resultante"><TextField autoFocus required multiline minRows={3} label="Trabajo realizado y observaciones" value={closing.tareaRealizada} onChange={e => setClosing({
          ...closing,
          tareaRealizada: e.target.value
        })} helperText="Incluí los repuestos utilizados en este texto, si corresponde." error={Boolean(error) && !closing.tareaRealizada.trim()} /><TextField sx={{ width: { xs: '100%', sm: '50%' } }} required select label="Estado resultante de la máquina" value={closing.estadoMaquina} onChange={e => setClosing({
          ...closing,
          estadoMaquina: e.target.value
        })} error={Boolean(error) && !closing.estadoMaquina}>{machineStates.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField></FormSection>{error && <Alert severity="error">{error}</Alert>}</>}
    </FormDialog>
    <FormDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Eliminar orden" action="Eliminar orden" onSubmit={event => {
      event.preventDefault();
      update('ordenes', previous => previous.filter(o => o.id !== deleting.id));
      setDeleting(null);
    }}><Typography>¿Eliminar {deleting?.id}, de {deleting?.maquinariaNombre}? Esta acción no puede deshacerse.</Typography></FormDialog>
  </ModuleSurface>;
}
