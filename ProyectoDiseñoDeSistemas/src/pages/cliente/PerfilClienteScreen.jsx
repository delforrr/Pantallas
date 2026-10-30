import { useState } from 'react';
import { Alert, Avatar, Box, Button, Chip, Divider, Grid, MenuItem, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useApp } from '../../context/AppContext';
import { clientStore, useClientStore } from './mockData';

const formularioPerfil = (cliente, user) => ({
  nombre: cliente.nombre || user.name,
  email: user.email,
  documentoTipo: cliente.documentoTipo || (cliente.cuit ? 'CUIT' : 'DNI'),
  documentoNumero: cliente.documentoNumero || cliente.cuit || cliente.dni || '',
  telefono: cliente.telefono || '',
  direccion: cliente.direccion || '',
  localidad: cliente.localidad || '',
  provincia: cliente.provincia || '',
  codigoPostal: cliente.codigoPostal || '',
  referencias: cliente.referencias || '',
});

export default function PerfilClienteScreen() {
  const { user, updateProfile } = useApp();
  const { cliente } = useClientStore();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(() => formularioPerfil(cliente, user));
  const [errores, setErrores] = useState({});
  const [guardado, setGuardado] = useState(false);
  const datos = formularioPerfil(cliente, user);
  const completo = ['documentoNumero', 'telefono', 'direccion', 'localidad', 'provincia'].every((campo) => datos[campo].trim());

  const editar = () => { setForm(formularioPerfil(cliente, user)); setErrores({}); setEditando(true); setGuardado(false); };
  const cancelar = () => { setForm(formularioPerfil(cliente, user)); setErrores({}); setEditando(false); };
  const cambiar = (campo) => (event) => {
    setForm((actual) => ({ ...actual, [campo]: event.target.value }));
    setErrores((actual) => ({ ...actual, [campo]: undefined }));
  };
  const guardar = (event) => {
    event.preventDefault();
    const resultado = clientStore.actualizarPerfilCliente(form);
    if (resultado.errores) { setErrores(resultado.errores); return; }
    updateProfile(resultado.profile);
    setEditando(false);
    setGuardado(true);
  };
  const campo = (nombre, etiqueta, opciones = {}) => (
    <Grid size={{ xs: 12, sm: opciones.ancho || 6 }} key={nombre}>
      {editando ? (
        <TextField fullWidth size="small" label={etiqueta} value={form[nombre]} onChange={cambiar(nombre)} error={Boolean(errores[nombre])} helperText={errores[nombre] || opciones.ayuda} required={nombre === 'nombre'} multiline={nombre === 'referencias'} minRows={nombre === 'referencias' ? 2 : undefined} autoComplete={opciones.autoComplete} type={opciones.tipo || 'text'} slotProps={{ htmlInput: { maxLength: nombre === 'referencias' ? 300 : 120 } }} />
      ) : (
        <Box sx={{ py: 0.5 }}>
          <Typography variant="caption" color="text.secondary">{etiqueta}</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: datos[nombre] ? 600 : 400, color: datos[nombre] ? 'text.primary' : 'text.secondary', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{datos[nombre] || 'Sin completar'}</Typography>
        </Box>
      )}
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 1100, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box><Typography component="h1" variant="h5" fontWeight={700}>Mi perfil</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>Tus datos de contacto y entrega, siempre a mano.</Typography></Box>
        {!editando && <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={editar}>Editar mis datos</Button>}
      </Stack>
      {!completo && <Alert severity="info" sx={{ mb: 3 }}>Podés completar tus datos después de registrarte. Agregá tu documento, teléfono y dirección para facilitar tus entregas.</Alert>}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center', borderRadius: '14px' }}>
          <Avatar sx={{ width: 76, height: 76, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 26 }}>{user.avatar}</Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{user.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, overflowWrap: 'anywhere' }}>{user.email}</Typography>
          <Chip label={completo ? 'Datos completos' : 'Datos por completar'} color={completo ? 'success' : 'warning'} variant="outlined" size="small" sx={{ mt: 2 }} />
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">Usamos estos datos como referencia para tus próximos pedidos.</Typography>
        </Paper>
        <Paper component="form" noValidate onSubmit={guardar} elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: '14px' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}><PersonOutlineIcon color="primary" /><Typography variant="h6" fontWeight={700}>Datos personales</Typography></Stack>
          <Grid container spacing={2.5}>
            {campo('nombre', 'Nombre y apellido', { autoComplete: 'name' })}
            <Grid size={{ xs: 12, sm: 6 }}>{editando ? <TextField fullWidth size="small" label="Correo electrónico" value={user.email} slotProps={{ input: { readOnly: true } }} helperText="Es el correo con el que creaste tu cuenta." /> : <Box sx={{ py: 0.5 }}><Typography variant="caption" color="text.secondary">Correo electrónico</Typography><Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 600, overflowWrap: 'anywhere' }}>{user.email}</Typography></Box>}</Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {editando ? <Stack direction="row" spacing={1}><TextField select size="small" label="Tipo" value={form.documentoTipo} onChange={cambiar('documentoTipo')} sx={{ minWidth: 100 }}><MenuItem value="DNI">DNI</MenuItem><MenuItem value="CUIT">CUIT</MenuItem></TextField><TextField fullWidth size="small" label="Número de documento" value={form.documentoNumero} onChange={cambiar('documentoNumero')} error={Boolean(errores.documentoNumero)} helperText={errores.documentoNumero} slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }} /></Stack> : <Box sx={{ py: 0.5 }}><Typography variant="caption" color="text.secondary">{datos.documentoTipo}</Typography><Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: datos.documentoNumero ? 600 : 400, color: datos.documentoNumero ? 'text.primary' : 'text.secondary' }}>{datos.documentoNumero || 'Sin completar'}</Typography></Box>}
            </Grid>
            {campo('telefono', 'Teléfono', { autoComplete: 'tel', tipo: 'tel' })}
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}><PlaceOutlinedIcon color="primary" /><Typography variant="h6" fontWeight={700}>Dirección de entrega</Typography></Stack>
          <Grid container spacing={2.5}>
            {campo('direccion', 'Calle, número, piso y departamento', { ancho: 12, autoComplete: 'street-address' })}
            {campo('localidad', 'Localidad', { autoComplete: 'address-level2' })}
            {campo('provincia', 'Provincia', { autoComplete: 'address-level1' })}
            {campo('codigoPostal', 'Código postal', { autoComplete: 'postal-code' })}
            {campo('referencias', 'Referencias para la entrega', { ancho: 12, ayuda: 'Opcional. Por ejemplo: timbre, entrecalles o indicaciones.' })}
          </Grid>
          {editando && <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}><Button onClick={cancelar} color="inherit">Cancelar</Button><Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />}>Guardar cambios</Button></Stack>}
        </Paper>
      </Box>
      <Snackbar open={guardado} autoHideDuration={3500} onClose={() => setGuardado(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert severity="success" variant="filled" onClose={() => setGuardado(false)}>Tus datos se guardaron correctamente.</Alert></Snackbar>
    </Box>
  );
}
