import { Alert, Autocomplete, Box, Button, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SaveOutlinedIcon from '@mui/icons-material/Save';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CATALOGO_PRODUCTOS_VENTAS, INITIAL_CLIENTES } from './mockData';

const moneda = valor => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(valor);
const panel = { p: 1.5, borderRadius: '14px', minWidth: 0 };

export default function PresupuestoFormScreen({ datos, onChange, onCancel, onSubmit, isEditing, subtotal, total, adelanto, error }) {
  const errorRef = useRef(null);
  const [pagina, setPagina] = useState(0);
  const paginas = Math.max(1, Math.ceil(datos.items.length / 2));
  const paginaActual = Math.min(pagina, paginas - 1);
  const inicio = paginaActual * 2;
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  const cambiar = cambios => onChange({ ...datos, ...cambios });
  const cambiarItem = (index, cambios) => cambiar({
    items: datos.items.map((item, i) => {
      if (i !== index) return item;
      const nuevo = { ...item, ...cambios };
      return { ...nuevo, subtotal: (Number(nuevo.cantidad) || 0) * (Number(nuevo.precioUnitario) || 0) };
    }),
  });
  const agregarItem = () => {
    setPagina(Math.floor(datos.items.length / 2));
    cambiar({ items: [...datos.items, {
      idProductoCompuesto: null, productoNombre: '', cantidad: 10, precioUnitario: 0, subtotal: 0,
    }] });
  };

  return (
    <Box component="form" onSubmit={event => { event.preventDefault(); onSubmit(); }} sx={{ display: 'grid', gap: 1.5, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Tooltip title="Volver a presupuestos"><IconButton aria-label="Volver a presupuestos" onClick={onCancel}><ArrowBackIcon /></IconButton></Tooltip>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, flex: 1 }}>{isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'}</Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary">{datos.nroPresupuesto}</Typography>
          <Typography variant="caption" color="text.secondary">Emisión: {datos.fechaEmision.split('-').reverse().join('/')}</Typography>
        </Box>
        <Button color="inherit" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />}>{isEditing ? 'Guardar cambios' : 'Guardar presupuesto'}</Button>
      </Box>

      {error && <Alert ref={errorRef} severity="error" role="alert" tabIndex={-1}>{error}</Alert>}

      <Paper variant="outlined" sx={panel}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) 220px' }, gap: 1.5 }}>
          <Autocomplete
            options={INITIAL_CLIENTES}
            value={INITIAL_CLIENTES.find(cliente => cliente.idCliente === datos.idCliente) || null}
            getOptionLabel={cliente => cliente.razonSocial}
            isOptionEqualToValue={(a, b) => a.idCliente === b.idCliente}
            onChange={(_, cliente) => cambiar({ idCliente: cliente?.idCliente ?? '' })}
            renderInput={params => <TextField {...params} label="Cliente" required autoFocus size="small" />}
          />
          <TextField label="Válido hasta" type="date" required size="small" value={datos.validezHasta} onChange={event => cambiar({ validezHasta: event.target.value })} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: datos.fechaEmision } }} />
        </Box>
      </Paper>

      <Paper variant="outlined" sx={panel}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700 }}>Productos ({datos.items.length})</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarItem}>Agregar producto</Button>
        </Box>
        <Box sx={{ display: 'grid', gap: 1 }}>
          {!datos.items.length && <Typography color="text.secondary" variant="body2">Agregá un producto para armar el presupuesto.</Typography>}
          {datos.items.slice(inicio, inicio + 2).map((item, posicion) => {
            const index = inicio + posicion;
            return (
            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr) 44px', md: 'minmax(0, 1fr) 110px 150px 130px 44px' }, gap: 1, alignItems: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Autocomplete
                sx={{ minWidth: 0, gridColumn: { xs: '1 / -1', md: 'auto' } }}
                options={CATALOGO_PRODUCTOS_VENTAS}
                value={CATALOGO_PRODUCTOS_VENTAS.find(producto => producto.idProductoCompuesto === item.idProductoCompuesto) || null}
                getOptionLabel={producto => producto.nombre}
                isOptionEqualToValue={(a, b) => a.idProductoCompuesto === b.idProductoCompuesto}
                onChange={(_, producto) => cambiarItem(index, {
                  idProductoCompuesto: producto?.idProductoCompuesto ?? null,
                  productoNombre: producto?.nombre ?? '',
                  precioUnitario: producto?.precioUnitario ?? 0,
                })}
                renderInput={params => <TextField {...params} label={`Producto ${index + 1}`} size="small" required />}
              />
              <TextField label="Cantidad" type="number" size="small" required value={item.cantidad} onChange={event => cambiarItem(index, { cantidad: event.target.value })} slotProps={{ htmlInput: { min: 10, step: 1, 'aria-label': `Cantidad del producto ${index + 1}` } }} />
              <TextField label="Precio unitario ($)" type="number" size="small" required value={item.precioUnitario} onChange={event => cambiarItem(index, { precioUnitario: event.target.value })} slotProps={{ htmlInput: { min: 0, step: '0.01', 'aria-label': `Precio del producto ${index + 1}` } }} />
              <Box sx={{ textAlign: { xs: 'left', md: 'right' }, gridColumn: { xs: '1 / 3', md: 'auto' }, gridRow: { xs: 3, md: 'auto' }, overflowWrap: 'anywhere' }}>
                <Typography variant="caption" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{moneda(item.subtotal)}</Typography>
              </Box>
              <Tooltip title="Quitar producto"><IconButton color="error" aria-label={`Quitar producto ${index + 1}`} onClick={() => cambiar({ items: datos.items.filter((_, i) => i !== index) })} sx={{ gridColumn: { xs: 3, md: 'auto' }, gridRow: { xs: '2 / 4', md: 'auto' } }}><DeleteOutlineIcon /></IconButton></Tooltip>
            </Box>
          ); })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Cantidad mínima: 10 por producto.</Typography>
          {paginas > 1 && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">{inicio + 1}–{Math.min(inicio + 2, datos.items.length)} de {datos.items.length}</Typography>
            <IconButton aria-label="Productos anteriores" disabled={paginaActual === 0} onClick={() => setPagina(paginaActual - 1)}><ChevronLeftIcon /></IconButton>
            <IconButton aria-label="Productos siguientes" disabled={paginaActual === paginas - 1} onClick={() => setPagina(paginaActual + 1)}><ChevronRightIcon /></IconButton>
          </Box>}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ ...panel, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'minmax(0, 1fr) 110px repeat(3, minmax(100px, auto))' }, alignItems: 'center', gap: 1.5 }}>
          <TextField fullWidth size="small" label="Observaciones" value={datos.observaciones || ''} onChange={event => cambiar({ observaciones: event.target.value })} sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }} />
          <TextField label="Descuento (%)" type="number" size="small" required value={datos.descuentoPorcentaje} onChange={event => cambiar({ descuentoPorcentaje: event.target.value })} slotProps={{ htmlInput: { min: 0, max: 100, step: '0.01' } }} />
          <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">Subtotal</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{moneda(subtotal)}</Typography></Box>
          <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">Total</Typography><Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{moneda(total)}</Typography></Box>
          <Box sx={{ textAlign: 'right' }}><Typography variant="caption" color="text.secondary">Seña (50%)</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{moneda(adelanto)}</Typography></Box>
      </Paper>
    </Box>
  );
}
