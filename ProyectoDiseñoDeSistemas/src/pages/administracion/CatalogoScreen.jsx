import { ListToolbar, ModuleSurface, RecordsView } from '../../components/compras/ModuleUI';
import { useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField, useMediaQuery,
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
  const empleados = tipo === 'empleados';
  const [estado, filtrarEstado] = useState('TODOS');
  const [busqueda, buscar] = useState('');
  const [borrador, editar] = useState(null);
  const [error, mostrarError] = useState('');
  const [mensaje, avisar] = useState('');
  const movil = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const estadoRegistro = r => r.inactivo ? 'Inactivo' : 'Activo';
  const visibles = registros.filter(r => (estado === 'TODOS' || estadoRegistro(r) === estado) && r.nombre.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')));
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
    const registro = { ...borrador, nombre: borrador.nombre.trim(), ...(empleados && { cargo: borrador.cargo.trim() }) };
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
    <ModuleSurface>
      {mensaje && <Alert severity="success" onClose={() => avisar('')} sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && !borrador && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <RecordsView rows={visibles} cardTitle={r => r.nombre} empty="No se encontraron registros."
        toolbar={<ListToolbar search={busqueda} onSearch={buscar} status={estado} onStatus={filtrarEstado}
          searchPlaceholder="Nombre" showStatus={!soloNombre} statuses={['Activo', 'Inactivo']}
          createLabel={`Crear ${entidad}`} onCreate={soloNombre ? undefined :
            () => abrir({ nombre: '', padre: padres ? '' : undefined, ...(empleados && { area: 'Producción', cargo: '' }) })} />}
        columns={[
          { label: 'Nombre', render: r => r.nombre },
          ...(padres ? [{ label: etiquetaPadre, render: r => nombrePadre(r.padre) }] : []),
          ...(empleados ? [{ label: 'Área', render: r => r.area }, { label: 'Cargo', render: r => r.cargo }] : []),
          { label: 'Estado', render: r => <Chip size="small" label={estadoRegistro(r)} color={r.inactivo ? 'default' : 'success'} /> },
        ]}
        actions={r => <>
          <Button aria-label={`Editar ${r.nombre}`} onClick={() => abrir(r)}>Editar</Button>
          {!soloNombre && <Button aria-label={`${r.inactivo ? 'Reactivar' : 'Desactivar'} ${r.nombre}`}
            onClick={() => guardar({ ...r, inactivo: !r.inactivo }, r.inactivo ? 'Registro reactivado.' : 'Registro desactivado.')}>
            {r.inactivo ? 'Reactivar' : 'Desactivar'}
          </Button>}
        </>}
      />
      <Dialog open={Boolean(borrador)} onClose={(_, motivo) => { if (motivo !== 'backdropClick') editar(null); }}
        fullWidth maxWidth="xs" fullScreen={movil} aria-labelledby="titulo-catalogo">
        {borrador && <Box component="form" onSubmit={enviar}>
          <DialogTitle id="titulo-catalogo">{borrador.id ? 'Editar' : 'Crear'} {entidad}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField autoFocus fullWidth name="nombre" label="Nombre" value={borrador.nombre}
                error={Boolean(error)} helperText={error}
                onChange={e => { mostrarError(''); editar({ ...borrador, nombre: e.target.value }); }} />
              {empleados && <>
                <TextField select label="Área" value={borrador.area} disabled={Boolean(borrador.id)}
                  onChange={e => editar({ ...borrador, area: e.target.value })}>
                  {['Producción', 'Mantenimiento'].map(area => <MenuItem key={area} value={area}>{area}</MenuItem>)}
                </TextField>
                <TextField label="Cargo" value={borrador.cargo} required
                  onChange={e => editar({ ...borrador, cargo: e.target.value })} />
              </>}
              {padres && <TextField select fullWidth label={etiquetaPadre} value={borrador.padre}
                disabled={Boolean(borrador.id)} onChange={e => editar({ ...borrador, padre: e.target.value })}>
                {opciones(borrador.id ? padres : padresActivos, borrador.padre).map(r => <MenuItem key={r.id} value={r.id}>{nombrePadre(r.id)}</MenuItem>)}
              </TextField>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => editar(null)}>Cancelar</Button>
            <Button variant="contained" type="submit" disabled={Boolean(padres && !borrador.padre || empleados && !borrador.cargo.trim())}>
              {borrador.id ? 'Guardar cambios' : `Crear ${entidad}`}
            </Button>
          </DialogActions>
        </Box>}
      </Dialog>
    </ModuleSurface>
  );
}
