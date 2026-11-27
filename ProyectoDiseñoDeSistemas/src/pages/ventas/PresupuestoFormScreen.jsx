import { Alert, Autocomplete, Box, Button, Divider, IconButton, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SaveOutlinedIcon from '@mui/icons-material/Save';
import { CATALOGO_PRODUCTOS_VENTAS, INITIAL_CLIENTES } from './mockData';

const moneda = valor => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(valor);
const panel = { p: { xs: 2, md: 2.5 }, borderRadius: '14px', minWidth: 0 };

export default function PresupuestoFormScreen({ datos, onChange, onCancel, onSubmit, isEditing, subtotal, total, adelanto, error }) {
  const errorRef = useRef(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  const cambiar = cambios => onChange({ ...datos, ...cambios });
  const cambiarItem = (index, cambios) => cambiar({
    items: datos.items.map((item, i) => {
      if (i !== index) return item;
      const nuevo = { ...item, ...cambios };
      return { ...nuevo, subtotal: (Number(nuevo.cantidad) || 0) * (Number(nuevo.precioUnitario) || 0) };
    }),
  });
  const agregarItem = () => cambiar({ items: [...datos.items, {
    idProductoCompuesto: null, productoNombre: '', cantidad: 10, precioUnitario: 0, subtotal: 0,
  }] });

  return (
    <Box component="form" onSubmit={event => { event.preventDefault(); onSubmit(); }} sx={{ display: 'grid', gap: 2.5, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Tooltip title="Volver a presupuestos"><IconButton aria-label="Volver a presupuestos" onClick={onCancel}><ArrowBackIcon /></IconButton></Tooltip>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, flex: 1 }}>{isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'}</Typography>
        <Typography variant="body2" color="text.secondary">{datos.nroPresupuesto}</Typography>
      </Box>

      {error && <Alert ref={errorRef} severity="error" role="alert" tabIndex={-1}>{error}</Alert>}

      <Paper variant="outlined" sx={panel}>
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Datos del presupuesto</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'minmax(0, 2fr) repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          <Autocomplete
            options={INITIAL_CLIENTES}
            value={INITIAL_CLIENTES.find(cliente => cliente.idCliente === datos.idCliente) || null}
            getOptionLabel={cliente => cliente.razonSocial}
            isOptionEqualToValue={(a, b) => a.idCliente === b.idCliente}
            onChange={(_, cliente) => cambiar({ idCliente: cliente?.idCliente ?? '' })}
            renderInput={params => <TextField {...params} label="Cliente" required autoFocus size="small" />}
          />
          <TextField select label="Tipo de pedido" required size="small" value={datos.tipoPedido} onChange={event => cambiar({ tipoPedido: event.target.value })}>
            <MenuItem value="Evento (Mayorista)">Evento (Mayorista)</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            {datos.tipoPedido && !['Evento (Mayorista)', 'Semanal'].includes(datos.tipoPedido) && <MenuItem value={datos.tipoPedido}>{datos.tipoPedido}</MenuItem>}
          </TextField>
          <TextField label="Fecha de emisión" type="date" required size="small" value={datos.fechaEmision} onChange={event => cambiar({ fechaEmision: event.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Válido hasta" type="date" required size="small" value={datos.validezHasta} onChange={event => cambiar({ validezHasta: event.target.value })} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: datos.fechaEmision } }} />
        </Box>
      </Paper>

      <Paper variant="outlined" sx={panel}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
          <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700 }}>Productos ({datos.items.length})</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarItem}>Agregar producto</Button>
        </Box>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {!datos.items.length && <Typography color="text.secondary" variant="body2">Agregá un producto para armar el presupuesto.</Typography>}
          {datos.items.map((item, index) => (
            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr) 44px', md: 'minmax(0, 1fr) 110px 150px 130px 44px' }, gap: 1.5, alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
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
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>Cantidad mínima: 10 por producto.</Typography>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(280px, 1fr)' }, gap: 2.5 }}>
        <Paper variant="outlined" sx={panel}>
          <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Observaciones</Typography>
          <TextField fullWidth multiline minRows={3} label="Condiciones de entrega o notas" value={datos.observaciones || ''} onChange={event => cambiar({ observaciones: event.target.value })} />
        </Paper>
        <Paper variant="outlined" sx={{ ...panel, display: 'grid', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}><Typography variant="body2" color="text.secondary">Subtotal</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{moneda(subtotal)}</Typography></Box>
          <TextField label="Descuento (%)" type="number" size="small" required value={datos.descuentoPorcentaje} onChange={event => cambiar({ descuentoPorcentaje: event.target.value })} slotProps={{ htmlInput: { min: 0, max: 100, step: '0.01' } }} />
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}><Typography sx={{ fontWeight: 700 }}>Total</Typography><Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{moneda(total)}</Typography></Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}><Typography variant="body2" color="text.secondary">Seña requerida (50%)</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{moneda(adelanto)}</Typography></Box>
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1.5, pb: 1, '& .MuiButton-root': { flex: { xs: 1, sm: '0 0 auto' } } }}>
        <Button variant="outlined" color="inherit" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />}>{isEditing ? 'Guardar cambios' : 'Guardar presupuesto'}</Button>
      </Box>
    </Box>
  );
}
