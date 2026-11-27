import { useEffect, useRef, useState } from 'react';
import { Alert, Autocomplete, Box, Button, IconButton, InputAdornment, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { CATALOGO_PRODUCTOS_VENTAS } from '../../pages/ventas/mockData';
import NuevoClientePresupuestoDialog from '../../pages/ventas/NuevoClientePresupuestoDialog';

const moneda = valor => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(valor);

export function FormularioDocumento({ title, onCancel, onSave, action = 'Guardar', canSave = true, error, maxWidth, children }) {
  const errorRef = useRef(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  return <Box component="form" onSubmit={event => { event.preventDefault(); if (canSave) onSave(); }} sx={{ display: 'grid', gap: 1.5, minWidth: 0, width: '100%', ...(maxWidth ? { maxWidth, mx: 'auto' } : {}) }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Tooltip title="Volver al listado"><IconButton aria-label="Volver al listado" onClick={onCancel}><ArrowBackIcon /></IconButton></Tooltip>
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, flex: 1 }}>{title}</Typography>
      <Button color="inherit" onClick={onCancel}>Cancelar</Button>
      {canSave && <Button type="submit" variant="contained" startIcon={<SaveIcon />}>{action}</Button>}
    </Box>
    {error && <Alert ref={errorRef} severity="error" tabIndex={-1}>{error}</Alert>}
    {children}
  </Box>;
}

export function CamposDocumento({ children, columns = 2 }) {
  return <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '14px', minWidth: 0 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: `repeat(${Math.min(columns, 2)}, minmax(0, 1fr))`, lg: `repeat(${columns}, minmax(0, 1fr))` }, gap: 1.5 }}>{children}</Box>
  </Paper>;
}

export function BuscadorDocumento({ onInputChange, listarAlEntrar = false, ...props }) {
  const [mostrarResultados, setMostrarResultados] = useState(false);
  return <Autocomplete {...props} forcePopupIcon={false} open={!props.disabled && mostrarResultados} openOnFocus={listarAlEntrar}
    onOpen={() => { if (listarAlEntrar) setMostrarResultados(true); }}
    onInputChange={(event, texto, motivo) => {
      setMostrarResultados(['input', 'clear'].includes(motivo) && (Boolean(texto.trim()) || listarAlEntrar));
      onInputChange?.(event, texto, motivo);
    }} onClose={() => setMostrarResultados(false)} noOptionsText="No se encontraron coincidencias" />;
}

export function ClienteDocumento({ clientes, value, onChange, onCreate, onIrAClientes, disabled = false }) {
  const [nuevo, setNuevo] = useState(false);
  const seleccionado = clientes.find(cliente => cliente.idCliente === value) || null;
  const agregar = onIrAClientes || (() => setNuevo(true));
  const etiqueta = 'Agregar cliente';
  return <Box sx={{ minWidth: 0 }}>
    <BuscadorDocumento disabled={disabled} sx={{ width: '100%' }} options={clientes} value={seleccionado}
      getOptionLabel={cliente => cliente.razonSocial} isOptionEqualToValue={(a, b) => a.idCliente === b.idCliente}
      onChange={(_, cliente) => onChange(cliente)} renderInput={params => <TextField {...params}
        label="Cliente" placeholder="Escribí para buscar un cliente" size="small" required autoFocus
        slotProps={{ ...params.slotProps, input: { ...params.slotProps?.input, endAdornment: <>
          {!seleccionado && !disabled && (onCreate || onIrAClientes) && <InputAdornment position="end">
            <Tooltip title={etiqueta}><IconButton size="small" aria-label={etiqueta} onMouseDown={event => event.preventDefault()} onClick={agregar} sx={{ p: 0.25 }}><AddIcon fontSize="small" /></IconButton></Tooltip>
          </InputAdornment>}
          {params.slotProps?.input?.endAdornment}
        </> } }} />} />
    {!onIrAClientes && nuevo && <NuevoClientePresupuestoDialog clientes={clientes} onClose={() => setNuevo(false)} onCreate={onCreate} />}
  </Box>;
}

export function CantidadProducto({ cantidad, producto, onChange, minimo = 10 }) {
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState('');
  const inputRef = useRef(null);
  const valida = Number.isInteger(Number(borrador)) && Number(borrador) >= minimo;
  const guardar = () => { if (valida) onChange(Number(borrador)); setEditando(false); };
  return editando ? <TextField variant="standard" type="number" size="small" autoFocus inputRef={inputRef}
    value={borrador} onChange={event => setBorrador(event.target.value)} onBlur={guardar}
    onKeyDown={event => {
      if (event.key === 'Enter') { event.preventDefault(); if (valida) guardar(); else inputRef.current?.reportValidity(); }
      if (event.key === 'Escape') { event.preventDefault(); setEditando(false); }
    }} slotProps={{ input: { disableUnderline: true }, htmlInput: { min: minimo, step: 1, required: true, 'aria-label': `Cantidad de ${producto}` } }} />
    : <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}>
      <Typography variant="body2">{cantidad}</Typography>
      <Tooltip title="Editar cantidad"><IconButton aria-label={`Editar cantidad de ${producto}`} onClick={() => { setBorrador(String(cantidad)); setEditando(true); }}><EditOutlinedIcon sx={{ fontSize: 16 }} /></IconButton></Tooltip>
    </Box>;
}

export function ProductosDocumento({ items, onChange, disabled = false, minimo = 1, sinCargo = false, readOnly = false }) {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('TODOS');
  const [subtipo, setSubtipo] = useState('TODOS');
  const tipos = [...new Set(CATALOGO_PRODUCTOS_VENTAS.map(p => p.tipoProducto))];
  const delTipo = CATALOGO_PRODUCTOS_VENTAS.filter(p => tipo === 'TODOS' || p.tipoProducto === tipo);
  const subtipos = [...new Set(delTipo.map(p => p.subTipoProducto))];
  const disponibles = delTipo.filter(p => subtipo === 'TODOS' || p.subTipoProducto === subtipo);
  const cambiarCantidad = (index, cantidad) => onChange(items.map((item, i) => i === index ? { ...item, cantidad, subtotal: cantidad * item.precioUnitario } : item));
  const agregar = producto => {
    if (!producto || disabled) return;
    const index = items.findIndex(item => item.idProductoCompuesto === producto.idProductoCompuesto);
    if (index !== -1) { cambiarCantidad(index, Number(items[index].cantidad) + minimo); return; }
    const precio = sinCargo ? 0 : producto.precioUnitario;
    onChange([...items, { idProductoCompuesto: producto.idProductoCompuesto, productoNombre: producto.nombre, cantidad: minimo, precioUnitario: precio, subtotal: minimo * precio }]);
  };
  return <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '14px', minWidth: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: items.length ? 1 : 0 }}>
      {!readOnly && <>
        <TextField select disabled={disabled} label="Tipo de producto" size="small" value={tipo} onChange={event => { setTipo(event.target.value); setSubtipo('TODOS'); }} sx={{ width: { xs: '100%', sm: 170 } }}>
          <MenuItem value="TODOS">Todos los tipos</MenuItem>{tipos.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField select disabled={disabled} label="Subtipo" size="small" value={subtipo} onChange={event => setSubtipo(event.target.value)} sx={{ width: { xs: '100%', sm: 170 } }}>
          <MenuItem value="TODOS">Todos los subtipos</MenuItem>{subtipos.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <BuscadorDocumento disabled={disabled} sx={{ width: { xs: '100%', sm: 400 }, maxWidth: '100%' }} options={disponibles} value={null} inputValue={busqueda}
          listarAlEntrar={tipo !== 'TODOS' || subtipo !== 'TODOS'} getOptionLabel={producto => producto.nombre}
          onInputChange={(_, texto, motivo) => setBusqueda(motivo === 'input' ? texto : '')}
          onChange={(_, producto) => { agregar(producto); setBusqueda(''); }}
          renderInput={params => <TextField {...params} label="Buscar producto" placeholder="Escribí el nombre del producto" size="small" />} />
        <Typography variant="caption" color="text.secondary">{disabled ? 'Seleccioná un cliente para cargar productos.' : `Cantidad mínima: ${minimo} por producto.`}</Typography>
      </>}
      <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700, ml: 'auto', mr: { sm: 4 } }}>Productos ({items.length})</Typography>
    </Box>
    {items.length > 0 && <Box sx={{
      '--columnas-producto': { xs: 'minmax(0, 1fr) 56px 64px 64px 32px', sm: 'minmax(0, 1fr) 90px 120px 120px 32px' },
      '&& .MuiInputBase-root': { minHeight: 32, borderRadius: 1 },
      '& .MuiInputBase-input': { py: 0.5, px: 1, fontSize: '0.8125rem', textAlign: 'center' },
      '&& .MuiIconButton-root': { minHeight: 32, minWidth: 32, p: 0.5, borderRadius: 1 },
    }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'var(--columnas-producto)', gap: 0.5, px: 1, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">Producto</Typography><Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>Cantidad</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>Precio unitario</Typography><Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>Subtotal</Typography>
      </Box>
      <Box role="list" aria-label="Productos del documento">{items.map((item, index) => <Box key={`${item.idProductoCompuesto}-${index}`} role="listitem" sx={{ display: 'grid', gridTemplateColumns: 'var(--columnas-producto)', gap: 0.5, alignItems: 'center', px: 1, py: 0.5, minHeight: 40, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
        <Typography variant="body2" sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>{item.productoNombre}</Typography>
        {readOnly || disabled ? <Typography variant="body2" sx={{ textAlign: 'center' }}>{item.cantidad}</Typography> : <CantidadProducto cantidad={item.cantidad} producto={item.productoNombre} minimo={minimo} onChange={cantidad => cambiarCantidad(index, cantidad)} />}
        <Typography variant="body2" sx={{ textAlign: 'right', overflowWrap: 'anywhere' }}>{moneda(item.precioUnitario)}</Typography><Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right', overflowWrap: 'anywhere' }}>{moneda(item.subtotal)}</Typography>
        {!readOnly && <Tooltip title="Quitar producto"><IconButton disabled={disabled} color="error" aria-label={`Quitar producto ${index + 1}`} onClick={() => onChange(items.filter((_, i) => i !== index))}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>}
      </Box>)}</Box>
    </Box>}
  </Paper>;
}

export function ImporteDocumento({ label, amount, primary = false }) {
  return <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="body2" sx={{ fontWeight: primary ? 800 : 600, color: primary ? 'primary.main' : 'text.primary' }}>{moneda(amount)}</Typography></Box>;
}
