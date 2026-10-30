import { useState } from 'react';
import { Grid, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { FormDialog } from './ModuleUI';
import { addAddressOption, selectAddressOption } from '../../pages/compras/addressCatalog';

export default function DomicilioProveedorFields({ value, onChange, catalog, onCatalogChange, legacyNoNumber }) {
  const [adding, setAdding] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const labels = { provincia: 'Provincia', localidad: 'Localidad', calle: 'Calle' };
  const options = {
    provincia: catalog.provincias,
    localidad: catalog.localidades.filter(l => l.provincia === value.provincia).map(l => l.nombre),
    calle: catalog.calles.filter(c => c.provincia === value.provincia && c.localidad === value.localidad).map(c => c.nombre)
  };
  const add = event => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const next = addAddressOption(catalog, adding, name, value);
      onCatalogChange(next);
      onChange(selectAddressOption(value, adding, name.trim()));
      setAdding(null);
    } catch (reason) {
      setError(reason.message);
    }
  };
  return <>
    <Grid container spacing={2}>
      {Object.keys(labels).map(type => {
        const disabled = type === 'localidad' && !value.provincia || type === 'calle' && !value.localidad;
        const helper = disabled ? `Elegí primero ${type === 'localidad' ? 'una provincia' : 'una localidad'}.` : undefined;
        return <Grid key={type} size={{ xs: 12, sm: 6 }}><Stack direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
          <TextField fullWidth select size="small" label={labels[type]} value={value[type] || ''} disabled={disabled} onChange={event => onChange(selectAddressOption(value, type, event.target.value))} helperText={helper} autoComplete="off" sx={{ minWidth: 0 }}>
            <MenuItem value="">Sin seleccionar</MenuItem>
            {[...options[type]].sort((a, b) => a.localeCompare(b, 'es')).map(option => <MenuItem key={option} value={option} sx={{ whiteSpace: 'normal' }}>{option}</MenuItem>)}
          </TextField>
          <Tooltip title={helper || `Agregar ${type}`} arrow><span><IconButton aria-label={`Agregar ${type}`} disabled={disabled} onClick={() => { setAdding(type); setName(''); setError(''); }} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}><AddIcon /></IconButton></span></Tooltip>
        </Stack></Grid>;
      })}
      <Grid size={{ xs: 12, sm: 6 }}><Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth size="small" label="Altura" type="number" value={value.altura} onChange={event => onChange({ ...value, altura: event.target.value })} autoComplete="off" slotProps={{ htmlInput: { min: 0, step: 1, inputMode: 'numeric' } }} helperText={legacyNoNumber && value.altura === '' ? 'Sin número registrado.' : undefined} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth size="small" label="Piso" type="number" value={value.piso ?? ''} onChange={event => onChange({ ...value, piso: event.target.value })} autoComplete="off" slotProps={{ htmlInput: { step: 1 } }} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth size="small" label="Depto" value={value.depto ?? ''} onChange={event => onChange({ ...value, depto: event.target.value })} autoComplete="off" /></Grid>
      </Grid></Grid>
    </Grid>
    <FormDialog open={Boolean(adding)} onClose={() => setAdding(null)} title={`Agregar ${adding || ''}`} onSubmit={add} action="Agregar" maxWidth="sm">
      {adding !== 'provincia' && <Typography variant="body2" color="text.secondary">{value.provincia}{adding === 'calle' ? ` · ${value.localidad}` : ''}</Typography>}
      <TextField autoFocus fullWidth required label={`Nombre de ${adding === 'calle' ? 'la calle' : adding === 'localidad' ? 'la localidad' : 'la provincia'}`} value={name} onChange={event => { setName(event.target.value); setError(''); }} error={Boolean(error)} helperText={error || undefined} />
    </FormDialog>
  </>;
}
