import AddIcon from '@mui/icons-material/Add';
import FichaMaquinariaDetalle from '../../components/mantenimiento/FichaMaquinariaDetalle';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useState } from 'react';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { FormSection, FormDialog, ListToolbar, ModuleSurface, RecordsView, StatusChip, RecordIcon, SummaryCards } from '../../components/mantenimiento/ModuleUI';
import { INITIAL_MAQUINARIAS, INITIAL_ORDENES_MANTENIMIENTO, INITIAL_TECNICOS } from './mockData';
import OrdenMantenimientoForm from '../../components/mantenimiento/OrdenMantenimientoForm';
import { nextMachineCode } from './logic';
const states = ['Operativa', 'En Mantenimiento', 'En Reparación', 'Fuera de Servicio'];
const blank = {
  nombre: '',
  horasUso: '',
  observaciones: ''
};
export default function MaquinariaScreen() {
  const [maquinarias, setMaquinarias] = useState(INITIAL_MAQUINARIAS);
  const [ordenes, setOrdenes] = useState(INITIAL_ORDENES_MANTENIMIENTO);
  const [quickMachine, setQuickMachine] = useState(null);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('TODOS');
  const [form, setForm] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const rows = maquinarias.filter(m => `${m.codigo} ${m.nombre}`.toLowerCase().includes(search.toLowerCase()) && (status === 'TODOS' || m.estado === status));
  const clear = () => {
    setSearch('');
    setStatus('TODOS');
  };
  const newOrder = machine => {
    setSelected(null);
    setQuickMachine(machine);
  };
  const save = event => {
    event.preventDefault();
    if (!form.nombre.trim() || form.horasUso === '' || !Number.isFinite(Number(form.horasUso)) || Number(form.horasUso) < 0) {
      setError('Ingresá la descripción y horas de operación mayores o iguales a cero.');
      event.currentTarget.querySelector('input')?.focus();
      return;
    }
    setMaquinarias(previous => form.id ? previous.map(m => m.id === form.id ? {
      ...form,
      nombre: form.nombre.trim(),
      horasUso: Number(form.horasUso)
    } : m) : [...previous, {
      ...form,
      nombre: form.nombre.trim(),
      horasUso: Number(form.horasUso),
      estado: 'Operativa',
      id: Math.max(0, ...previous.map(m => m.id)) + 1,
      codigo: nextMachineCode(previous)
    }]);
    setForm(null);
  };
  return <ModuleSurface>
    {notice && <Alert severity="success" onClose={() => setNotice('')} sx={{
      mb: 2
    }}>{notice}</Alert>}
    <SummaryCards items={[{ label: 'Equipos registrados', value: maquinarias.length }, { label: 'Operativos', value: maquinarias.filter(m => m.estado === 'Operativa').length, color: 'success.main' }, { label: 'En mantenimiento', value: maquinarias.filter(m => m.estado === 'En Mantenimiento').length, color: 'warning.main' }, { label: 'En reparación / fuera de servicio', value: maquinarias.filter(m => ['En Reparación','Fuera de Servicio'].includes(m.estado)).length, color: 'error.main' }]} />
    <RecordsView toolbar={<ListToolbar search={search} onSearch={setSearch} status={status} onStatus={setStatus} statuses={states} createLabel="Nueva maquinaria" onCreate={() => {
      setError('');
      setForm({
        ...blank
      });
    }} />} rows={rows} cardTitle={m => m.codigo} empty={maquinarias.length ? 'No hay resultados para estos filtros.' : 'Todavía no hay maquinarias registradas.'} onClear={search || status !== 'TODOS' ? clear : undefined} columns={[{
      label: 'Código',
      render: m => m.codigo
    }, {
      label: 'Descripción',
      render: m => m.nombre
    }, {
      label: 'Estado operativo',
      render: m => <StatusChip value={m.estado} />
    }, {
      label: 'Horas de operación',
      numeric: true,
      render: m => `${m.horasUso} h`
    }]} actions={m => <><RecordIcon onClick={() => setSelected(m)} label="Ver detalle" color="default"><VisibilityOutlinedIcon /></RecordIcon><RecordIcon label="Crear orden" color="primary" onClick={() => newOrder(m)}><AddIcon /></RecordIcon><RecordIcon onClick={() => {
        setError('');
        setForm({
          ...m
        });
      }} label="Editar" color="primary"><EditOutlinedIcon /></RecordIcon><RecordIcon onClick={() => setDeleting(m)} label="Eliminar" color="error"><DeleteOutlineIcon /></RecordIcon></>} />
    <OrdenMantenimientoForm open={Boolean(quickMachine)} onClose={() => setQuickMachine(null)} maquinarias={maquinarias} tecnicos={INITIAL_TECNICOS} initialMachine={quickMachine?.id} ordenes={ordenes} onSave={order => {
      setOrdenes(previous => [order, ...previous]);
      setSelected(null);
      setQuickMachine(null);
      setNotice(`Orden ${order.id} creada como pendiente.`);
    }} />
    <FormDialog open={Boolean(form)} onClose={() => setForm(null)} title={form?.id ? `Editar ${form.codigo}` : 'Nueva maquinaria'} onSubmit={save} action={form?.id ? 'Guardar cambios' : 'Crear maquinaria'}>
      {form && <><FormSection number={1} title="Identificación y operación"><Typography variant="body2" color="text.secondary">Código: {form.codigo || `${nextMachineCode(maquinarias)} · generado al guardar`}</Typography><Grid container spacing={2}><Grid size={{ xs: 12, sm: 8 }}><TextField fullWidth autoFocus required label="Descripción" value={form.nombre} onChange={e => setForm({
          ...form,
          nombre: e.target.value
        })} error={Boolean(error) && !form.nombre.trim()} helperText={error && !form.nombre.trim() ? 'Ingresá la descripción de la máquina.' : ''} /></Grid>
      <Grid size={{
            xs: 12,
            sm: 4
          }}><TextField fullWidth required type="number" label="Horas de operación" value={form.horasUso} onChange={e => setForm({
              ...form,
              horasUso: e.target.value
            })} slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
                inputMode: 'numeric'
              }
            }} error={Boolean(error) && (form.horasUso === '' || Number(form.horasUso) < 0)} helperText="Horas acumuladas registradas." /></Grid></Grid>
      <TextField label="Observaciones técnicas" multiline minRows={3} value={form.observaciones} onChange={e => setForm({
          ...form,
          observaciones: e.target.value
        })} /></FormSection>{error && <Alert severity="error">{error}</Alert>}</>}
    </FormDialog>
    <FormDialog open={Boolean(selected)} onClose={() => setSelected(null)} title="Ficha de maquinaria">{selected && <><FichaMaquinariaDetalle maquinaria={selected} /><Button variant="contained" onClick={() => newOrder(selected)}>Crear orden de mantenimiento</Button></>}</FormDialog>
    <FormDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Eliminar maquinaria" onSubmit={event => {
      event.preventDefault();
      setMaquinarias(previous => previous.filter(m => m.id !== deleting.id));
      setDeleting(null);
    }} action="Eliminar maquinaria"><Typography>¿Eliminar {deleting?.codigo} · {deleting?.nombre}? Esta acción no puede deshacerse.</Typography></FormDialog>
  </ModuleSurface>;
}
