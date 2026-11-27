import { useState } from 'react';
import { Alert, Box, TextField, MenuItem } from '@mui/material';
import { FormDialog } from '../../components/shared/ModuleUI';
import { useApp } from '../../context/AppContext';
import { opciones } from '../administracion/catalogos';

export default function NuevoClientePresupuestoDialog({ clientes, onClose, onCreate }) {
  const { catalogos: { iva } } = useApp();
  const [datos, setDatos] = useState({ razonSocial: '', cuit: '', responsable: '', telefono: '', email: '', tipoIva: opciones(iva)[0]?.id ?? '' });
  const [error, setError] = useState('');
  const cambiar = event => { setDatos({ ...datos, [event.target.name]: event.target.value }); setError(''); };

  function guardar(event) {
    event.preventDefault();
    event.stopPropagation();
    const cuit = datos.cuit.replace(/\D/g, '');
    if (!datos.razonSocial.trim() || cuit.length !== 11 || !datos.tipoIva) {
      setError('Completá la razón social, un CUIT de 11 dígitos y la condición de IVA.');
      return;
    }
    if (clientes.some(cliente => cliente.cuit.replace(/\D/g, '') === cuit)) {
      setError('Ya existe un cliente con este CUIT. Buscalo en el campo Cliente.');
      return;
    }
    onCreate(Object.fromEntries(Object.entries(datos).map(([clave, valor]) => [clave, valor.trim()])));
    onClose();
  }

  return (
    <FormDialog open onClose={onClose} title="Agregar cliente" maxWidth="sm" onSubmit={guardar} action="Crear y seleccionar">
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
        <TextField name="razonSocial" label="Razón social" required autoFocus fullWidth size="small" value={datos.razonSocial} onChange={cambiar} />
        <TextField name="cuit" label="CUIT" required fullWidth size="small" value={datos.cuit} onChange={cambiar} placeholder="30-12345678-9" />
        <TextField name="responsable" label="Responsable" fullWidth size="small" value={datos.responsable} onChange={cambiar} />
        <TextField name="telefono" label="Teléfono" type="tel" fullWidth size="small" value={datos.telefono} onChange={cambiar} />
        <TextField name="email" label="Email" type="email" fullWidth size="small" value={datos.email} onChange={cambiar} />
        <TextField select name="tipoIva" label="Condición de IVA" required fullWidth size="small" value={datos.tipoIva} onChange={cambiar}>
          {opciones(iva).map(tipo => <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>)}
        </TextField>
      </Box>
    </FormDialog>
  );
}
