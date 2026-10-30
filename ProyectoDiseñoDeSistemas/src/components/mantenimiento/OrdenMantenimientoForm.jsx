import OrdenMantenimientoDetalle from './OrdenMantenimientoDetalle';
import { useState } from 'react';
import { Alert, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { FormSection, FormDialog } from './ModuleUI';
import { createMaintenanceOrder } from '../../pages/mantenimiento/logic';
export default function OrdenMantenimientoForm({
  open,
  onClose,
  initialMachine,
  maquinarias,
  tecnicos,
  ordenes,
  onSave
}) {
  const [tipo, setTipo] = useState('Preventivo');
  const [empleadoId, setEmpleadoId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');
  const machine = maquinarias.find(m => m.id === initialMachine);
  const save = event => {
    event.preventDefault();
    const technician = tecnicos.find(t => t.id === Number(empleadoId));
    if (!machine || !technician || !descripcion.trim()) {
      setError('Seleccioná un técnico y describí el trabajo previsto.');
      event.currentTarget.querySelector('input, textarea')?.focus();
      return;
    }
    const order = createMaintenanceOrder(ordenes, maquinarias, tecnicos, {
      maquinariaId: machine.id,
      empleadoId: technician.id,
      tipo,
      descripcion
    });
    setCreated(order);
    onSave(order);
    setDescripcion('');
    setEmpleadoId('');
    setError('');
  };
  return <><FormDialog open={open} onClose={onClose} title="Crear orden de mantenimiento" onSubmit={save} action="Crear orden">
    <FormSection number={1} title="Equipo y trabajo previsto"><Typography>{machine?.codigo} · {machine?.nombre}</Typography>
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Tipo de mantenimiento" value={tipo} onChange={e => setTipo(e.target.value)}>{['Preventivo', 'Correctivo'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></Grid><Grid size={{ xs: 12, sm: 6 }}>
    <TextField fullWidth autoFocus required select label="Técnico responsable" value={empleadoId} onChange={e => setEmpleadoId(e.target.value)} error={Boolean(error) && !empleadoId}>{tecnicos.map(t => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}</TextField>
    </Grid></Grid><TextField required multiline minRows={3} label="Trabajo previsto / fallo observado" value={descripcion} onChange={e => setDescripcion(e.target.value)} error={Boolean(error) && !descripcion.trim()} helperText="Mencioná los repuestos en este texto si corresponde." />
    </FormSection>{error && <Alert severity="error">{error}</Alert>}
  </FormDialog><FormDialog open={Boolean(created)} onClose={() => setCreated(null)} title="Orden de mantenimiento emitida">{created && <OrdenMantenimientoDetalle orden={created} />}</FormDialog></>;
}
