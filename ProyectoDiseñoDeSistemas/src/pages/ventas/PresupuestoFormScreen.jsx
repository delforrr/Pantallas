import { Alert, Autocomplete, Box, Button, IconButton, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SaveOutlinedIcon from '@mui/icons-material/Save';
import { CATALOGO_PRODUCTOS_VENTAS } from './mockData';
import NuevoClientePresupuestoDialog from './NuevoClientePresupuestoDialog';

const moneda = valor => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(valor);
const panel = { p: 1.5, borderRadius: '14px', minWidth: 0 };
const tiposProducto = [...new Set(CATALOGO_PRODUCTOS_VENTAS.map(producto => producto.tipoProducto))];

function Buscador({ onInputChange, listarAlEntrar = false, ...props }) {
  const [mostrarResultados, setMostrarResultados] = useState(false);

  return <Autocomplete {...props}
    forcePopupIcon={false}
    open={mostrarResultados}
    openOnFocus={listarAlEntrar}
    onOpen={() => { if (listarAlEntrar) setMostrarResultados(true); }}
    onInputChange={(event, texto, motivo) => {
      setMostrarResultados(['input', 'clear'].includes(motivo) && (Boolean(texto.trim()) || listarAlEntrar));
      onInputChange?.(event, texto, motivo);
    }}
    onClose={() => setMostrarResultados(false)}
    noOptionsText="No se encontraron coincidencias"
  />;
}

export default function PresupuestoFormScreen({ datos, clientes, onCreateCliente, onChange, onCancel, onSubmit, isEditing, subtotal, descuento, total, error }) {
  const errorRef = useRef(null);
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const clienteSeleccionado = clientes.some(cliente => cliente.idCliente === datos.idCliente);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [tipoProducto, setTipoProducto] = useState('TODOS');
  const [subtipoProducto, setSubtipoProducto] = useState('TODOS');
  const productosDelTipo = CATALOGO_PRODUCTOS_VENTAS.filter(producto => tipoProducto === 'TODOS' || producto.tipoProducto === tipoProducto);
  const subtiposProducto = [...new Set(productosDelTipo.map(producto => producto.subTipoProducto))];
  const productosDisponibles = productosDelTipo.filter(producto => subtipoProducto === 'TODOS' || producto.subTipoProducto === subtipoProducto);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  const cambiar = cambios => onChange({ ...datos, ...cambios });
  const cambiarItem = (index, cambios) => cambiar({
    items: datos.items.map((item, i) => {
      if (i !== index) return item;
      const nuevo = { ...item, ...cambios };
      return { ...nuevo, subtotal: (Number(nuevo.cantidad) || 0) * (Number(nuevo.precioUnitario) || 0) };
    }),
  });
  const agregarItem = producto => {
    if (!producto || !clienteSeleccionado) return;
    const existente = datos.items.findIndex(item => item.idProductoCompuesto === producto.idProductoCompuesto);
    if (existente !== -1) {
      cambiarItem(existente, { cantidad: Number(datos.items[existente].cantidad) + 10 });
      return;
    }
    cambiar({ items: [...datos.items, {
      idProductoCompuesto: producto.idProductoCompuesto,
      productoNombre: producto.nombre,
      cantidad: 10,
      precioUnitario: producto.precioUnitario,
      subtotal: 10 * producto.precioUnitario,
    }] });
  };

  return (
    <Box component="form" onSubmit={event => { event.preventDefault(); if (clienteSeleccionado && datos.items.length) onSubmit(); }} sx={{ display: 'grid', gap: 1.5, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Tooltip title="Volver a presupuestos"><IconButton aria-label="Volver a presupuestos" onClick={onCancel}><ArrowBackIcon /></IconButton></Tooltip>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, flex: 1 }}>{isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'}</Typography>
        <Button color="inherit" onClick={onCancel}>Cancelar</Button>
        {clienteSeleccionado && datos.items.length > 0 && <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />}>{isEditing ? 'Guardar cambios' : 'Guardar presupuesto'}</Button>}
      </Box>

      {error && <Alert ref={errorRef} severity="error" role="alert" tabIndex={-1}>{error}</Alert>}

      <Paper variant="outlined" sx={panel}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) 220px' }, gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Buscador
            sx={{ flex: 1, minWidth: 0 }}
            options={clientes}
            value={clientes.find(cliente => cliente.idCliente === datos.idCliente) || null}
            getOptionLabel={cliente => cliente.razonSocial}
            isOptionEqualToValue={(a, b) => a.idCliente === b.idCliente}
            onChange={(_, cliente) => cambiar({ idCliente: cliente?.idCliente ?? '' })}
            renderInput={params => <TextField {...params} label="Cliente" placeholder="Escribí para buscar un cliente" required autoFocus size="small" />}
          />
          {!clienteSeleccionado && <Tooltip title="Agregar cliente"><IconButton aria-label="Agregar cliente" onClick={() => setNuevoCliente(true)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}><AddIcon /></IconButton></Tooltip>}
          </Box>
          <TextField label="Válido hasta" type="date" required size="small" value={datos.validezHasta} onChange={event => cambiar({ validezHasta: event.target.value })} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: datos.fechaEmision } }} />
        </Box>
      </Paper>

      <Paper variant="outlined" sx={panel}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <TextField select size="small" label="Tipo de producto" value={tipoProducto}
            disabled={!clienteSeleccionado}
            onChange={event => { setTipoProducto(event.target.value); setSubtipoProducto('TODOS'); }}
            sx={{ width: { xs: '100%', sm: 170 } }}>
            <MenuItem value="TODOS">Todos los tipos</MenuItem>
            {tiposProducto.map(tipo => <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Subtipo" value={subtipoProducto}
            disabled={!clienteSeleccionado}
            onChange={event => setSubtipoProducto(event.target.value)} sx={{ width: { xs: '100%', sm: 170 } }}>
            <MenuItem value="TODOS">Todos los subtipos</MenuItem>
            {subtiposProducto.map(subtipo => <MenuItem key={subtipo} value={subtipo}>{subtipo}</MenuItem>)}
          </TextField>
          <Buscador
            disabled={!clienteSeleccionado}
            sx={{ width: { xs: '100%', sm: 400 }, minWidth: 0, maxWidth: '100%' }}
            options={productosDisponibles}
            listarAlEntrar={tipoProducto !== 'TODOS' || subtipoProducto !== 'TODOS'}
            value={null}
            inputValue={busquedaProducto}
            getOptionLabel={producto => producto.nombre}
            onInputChange={(_, texto, motivo) => setBusquedaProducto(motivo === 'input' ? texto : '')}
            onChange={(_, producto) => { agregarItem(producto); setBusquedaProducto(''); }}
            renderInput={params => <TextField {...params} label="Buscar producto" placeholder="Escribí el nombre del producto" size="small" />}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1.5, rowGap: 0.25, flexShrink: 0, maxWidth: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            {!clienteSeleccionado && <Typography color="text.secondary" variant="caption">Seleccioná un cliente para cargar productos.</Typography>}
            <Typography variant="caption" color="text.secondary">Cantidad mínima: 10 por producto.</Typography>
          </Box>
          <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700, ml: 'auto', mr: { sm: 4 }, whiteSpace: 'nowrap' }}>Productos ({datos.items.length})</Typography>
        </Box>
        {datos.items.length > 0 && <Box sx={{
          '--columnas-producto': { xs: 'minmax(0, 1fr) 56px 64px 64px 32px', sm: 'minmax(0, 1fr) 90px 120px 120px 32px' },
          '&& .MuiInputBase-root': { minHeight: 32, borderRadius: 1 },
          '& .MuiInputBase-input': { py: 0.5, px: 1, fontSize: '0.8125rem', textAlign: 'center' },
          '&& .MuiIconButton-root': { minHeight: 32, minWidth: 32, p: 0.5, borderRadius: 1 },
        }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--columnas-producto)', gap: 0.5, px: 1, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">Producto</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>Cantidad</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>Precio unitario</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>Subtotal</Typography>
          </Box>
          <Box role="list" aria-label="Productos del presupuesto">
            {datos.items.map((item, index) => (
              <Box key={item.idProductoCompuesto} role="listitem" sx={{ display: 'grid', gridTemplateColumns: 'var(--columnas-producto)', gap: 0.5, alignItems: 'center', px: 1, py: 0.5, minHeight: 40, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                <Typography variant="body2" sx={{ minWidth: 0, fontWeight: 500, overflowWrap: 'anywhere' }}>{item.productoNombre}</Typography>
                <TextField type="number" size="small" required value={item.cantidad} onChange={event => cambiarItem(index, { cantidad: event.target.value })} slotProps={{ htmlInput: { min: 10, step: 1, 'aria-label': `Cantidad del producto ${index + 1}` } }} />
                <Typography variant="body2" sx={{ textAlign: 'right', overflowWrap: 'anywhere' }}>{moneda(item.precioUnitario)}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right', overflowWrap: 'anywhere' }}>{moneda(item.subtotal)}</Typography>
                <Tooltip title="Quitar producto"><IconButton color="error" aria-label={`Quitar producto ${index + 1}`} onClick={() => cambiar({ items: datos.items.filter((_, i) => i !== index) })}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
              </Box>
            ))}
          </Box>
        </Box>}
      </Paper>

      <Paper variant="outlined" sx={{ ...panel, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'minmax(0, 1fr) repeat(3, minmax(110px, auto))' }, alignItems: 'center', gap: 1.5 }}>
          <TextField fullWidth size="small" label="Observaciones" value={datos.observaciones || ''} onChange={event => cambiar({ observaciones: event.target.value })} sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }} />
          <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">Subtotal</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{moneda(subtotal)}</Typography></Box>
          <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">Mayorista ({descuento}%)</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>−{moneda(subtotal * descuento / 100)}</Typography></Box>
          <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">Total</Typography><Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{moneda(total)}</Typography></Box>
      </Paper>
      {nuevoCliente && <NuevoClientePresupuestoDialog clientes={clientes} onClose={() => setNuevoCliente(false)} onCreate={onCreateCliente} />}
    </Box>
  );
}
