import { gruposEstados } from './estados';
import { useState } from 'react';
import { Alert, MenuItem, TextField } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import { FormDialog, ListToolbar, ModuleSurface, RecordIcon, RecordsView, StatusChip } from '../../components/compras/ModuleUI';
import { useApp } from '../../context/AppContext';
import { catalogosBase, nombreCatalogo, nombreDuplicado, opciones } from './catalogos';

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
  const [grupo, filtrarGrupo] = useState('materia_prima');
  const [estado, filtrarEstado] = useState('TODOS');
  const [busqueda, buscar] = useState('');
  const [borrador, editar] = useState(null);
  const [error, mostrarError] = useState('');
  const [mensaje, avisar] = useState('');
  const cargos = [...new Set([
    ...catalogosBase.empleados.filter(e => e.area === borrador?.area).map(e => e.cargo),
    borrador?.cargo,
  ].filter(Boolean))];
  const estadoRegistro = r => r.inactivo ? 'Inactivo' : 'Activo';
  const visibles = registros.filter(r => (!soloNombre || r.padre === grupo) && (estado === 'TODOS' || estadoRegistro(r) === estado) && r.nombre.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')));
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
            () => abrir({ nombre: '', padre: padres ? '' : undefined, ...(empleados && { area: 'Producción', cargo: '' }) })}>
          {soloNombre && <TextField select label="Entidad o documento" value={grupo}
            onChange={e => filtrarGrupo(e.target.value)}>
            {Object.entries(gruposEstados).map(([id, [nombre]]) => <MenuItem key={id} value={id}>{nombre}</MenuItem>)}
          </TextField>}
        </ListToolbar>}
        columns={[
          { label: 'Nombre', render: r => r.nombre },
          ...(padres ? [{ label: etiquetaPadre, render: r => nombrePadre(r.padre) }] : []),
          ...(empleados ? [{ label: 'Área', render: r => r.area }, { label: 'Cargo', render: r => r.cargo }] : []),
          { label: 'Estado', render: r => <StatusChip value={soloNombre ? r.valor : estadoRegistro(r)} /> },
        ]}
        actions={r => <>
          <RecordIcon label={`Editar ${r.nombre}`} color="primary" onClick={() => abrir(r)}><EditOutlinedIcon /></RecordIcon>
          {!soloNombre && <RecordIcon label={`${r.inactivo ? 'Reactivar' : 'Desactivar'} ${r.nombre}`}
            onClick={() => guardar({ ...r, inactivo: !r.inactivo }, r.inactivo ? 'Registro reactivado.' : 'Registro desactivado.')}>
            {r.inactivo ? <RestoreOutlinedIcon /> : <BlockOutlinedIcon />}
          </RecordIcon>}
        </>}
      />
      <FormDialog open={Boolean(borrador)} onClose={(_, motivo) => { if (motivo !== 'backdropClick') editar(null); }}
        title={`${borrador?.id ? 'Editar' : 'Crear'} ${entidad}`} maxWidth="xs" onSubmit={enviar}
        action={borrador?.id ? 'Guardar cambios' : `Crear ${entidad}`}
        submitDisabled={Boolean(borrador && (padres && !borrador.padre || empleados && !borrador.cargo.trim()))}>
        {borrador && <>
          <TextField autoFocus fullWidth name="nombre" label="Nombre" value={borrador.nombre}
            error={Boolean(error)} helperText={error}
            onChange={e => { mostrarError(''); editar({ ...borrador, nombre: e.target.value }); }} />
          {empleados && <>
            <TextField select label="Área" value={borrador.area} disabled={Boolean(borrador.id)}
              onChange={e => editar({ ...borrador, area: e.target.value, cargo: '' })}>
              {['Producción', 'Mantenimiento', 'Ventas'].map(area => <MenuItem key={area} value={area}>{area}</MenuItem>)}
            </TextField>
            <TextField select label="Cargo" value={borrador.cargo} required
              onChange={e => editar({ ...borrador, cargo: e.target.value })}>
              {cargos.map(cargo => <MenuItem key={cargo} value={cargo}>{cargo}</MenuItem>)}
            </TextField>
          </>}
          {padres && <TextField select fullWidth label={etiquetaPadre} value={borrador.padre}
            disabled={Boolean(borrador.id)} onChange={e => editar({ ...borrador, padre: e.target.value })}>
            {opciones(borrador.id ? padres : padresActivos, borrador.padre).map(r => <MenuItem key={r.id} value={r.id}>{nombrePadre(r.id)}</MenuItem>)}
          </TextField>}
        </>}
      </FormDialog>
    </ModuleSurface>
  );
}
