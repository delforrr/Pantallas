import { useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography, useMediaQuery,
} from '@mui/material';
import { useApp } from '../../context/AppContext';
import { nombreCatalogo, nombreDuplicado, opciones } from './catalogos';

export default function CatalogoScreen({ tipo, entidad, padre, etiquetaPadre, soloNombre }) {
  const { catalogos, guardarCatalogo } = useApp();
  const registros = catalogos[tipo];
  const padres = catalogos[padre];
  const nombrePadre = id => {
    const nombre = nombreCatalogo(padres, id);
    if (padre !== 'localidades') return nombre;
    const provincia = padres.find(r => r.id === id)?.padre;
    return provincia ? `${nombre} · ${nombreCatalogo(catalogos.provincias, provincia)}` : nombre;
  };
  const padresActivos = padres?.filter(r => padre !== 'localidades' || opciones(catalogos.provincias).some(p => p.id === r.padre));
  const [busqueda, buscar] = useState('');
  const [borrador, editar] = useState(null);
  const [error, mostrarError] = useState('');
  const [mensaje, avisar] = useState('');
  const movil = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const visibles = registros.filter(r => r.nombre.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')));
  const abrir = registro => { mostrarError(''); editar(registro); };

  function guardar(registro, texto) {
    try {
      guardarCatalogo(tipo, registro);
      editar(null);
      avisar(texto);
    } catch {
      mostrarError('No se pudieron guardar los cambios en el navegador.');
    }
  }

  function enviar(event) {
    event.preventDefault();
    const registro = { ...borrador, nombre: borrador.nombre.trim() };
    const problema = !registro.nombre ? 'Ingresá un nombre.' :
      nombreDuplicado(registros, registro) ? 'Ya existe un registro con este nombre.' : '';
    if (problema) {
      mostrarError(problema);
      event.currentTarget.elements.nombre.focus();
      return;
    }
    guardar({ ...registro, id: registro.id ?? crypto.randomUUID() }, 'Cambios guardados.');
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
        <TextField size="small" label="Buscar por nombre" value={busqueda} onChange={e => buscar(e.target.value)} />
        {!soloNombre && <Button variant="contained" onClick={() => abrir({ nombre: '', padre: padres ? '' : undefined })}>Crear {entidad}</Button>}
      </Stack>
      {mensaje && <Alert severity="success" onClose={() => avisar('')}>{mensaje}</Alert>}
      {error && !borrador && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label={tipo}>
          <TableHead><TableRow>
            <TableCell>Nombre</TableCell>
            {padres && !movil && <TableCell>{etiquetaPadre}</TableCell>}
            {!soloNombre && !movil && <TableCell>Estado</TableCell>}
            <TableCell align="right">Acciones</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {visibles.map(r => (
              <TableRow key={r.id}>
                <TableCell component="th" scope="row" sx={{ overflowWrap: 'anywhere' }}>
                  {r.nombre}
                  {movil && padres && <Typography variant="body2" color="text.secondary">{nombrePadre(r.padre)}</Typography>}
                  {movil && !soloNombre && <Typography variant="body2" color="text.secondary">{r.inactivo ? 'Inactivo' : 'Activo'}</Typography>}
                </TableCell>
                {padres && !movil && <TableCell>{nombrePadre(r.padre)}</TableCell>}
                {!soloNombre && !movil && <TableCell><Chip size="small" label={r.inactivo ? 'Inactivo' : 'Activo'} /></TableCell>}
                <TableCell align="right">
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
                    <Button aria-label={`Editar ${r.nombre}`} onClick={() => abrir(r)}>Editar</Button>
                    {!soloNombre && <Button aria-label={`${r.inactivo ? 'Reactivar' : 'Desactivar'} ${r.nombre}`} onClick={() => guardar({ ...r, inactivo: !r.inactivo }, r.inactivo ? 'Registro reactivado.' : 'Registro desactivado.')}>{r.inactivo ? 'Reactivar' : 'Desactivar'}</Button>}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {!visibles.length && <TableRow><TableCell colSpan={4}>No se encontraron registros.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={Boolean(borrador)} onClose={(_, motivo) => { if (motivo !== 'backdropClick') editar(null); }}
        fullWidth maxWidth="xs" fullScreen={movil} aria-labelledby="titulo-catalogo">
        {borrador && <Box component="form" onSubmit={enviar}>
          <DialogTitle id="titulo-catalogo">{borrador.id ? 'Editar' : 'Crear'} {entidad}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField autoFocus fullWidth name="nombre" label="Nombre" value={borrador.nombre}
                error={Boolean(error)} helperText={error}
                onChange={e => { mostrarError(''); editar({ ...borrador, nombre: e.target.value }); }} />
              {padres && <TextField select fullWidth label={etiquetaPadre} value={borrador.padre}
                disabled={Boolean(borrador.id)} onChange={e => editar({ ...borrador, padre: e.target.value })}>
                {opciones(borrador.id ? padres : padresActivos, borrador.padre).map(r => <MenuItem key={r.id} value={r.id}>{nombrePadre(r.id)}</MenuItem>)}
              </TextField>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => editar(null)}>Cancelar</Button>
            <Button variant="contained" type="submit" disabled={Boolean(padres && !borrador.padre)}>
              {borrador.id ? 'Guardar cambios' : `Crear ${entidad}`}
            </Button>
          </DialogActions>
        </Box>}
      </Dialog>
    </Stack>
  );
}
