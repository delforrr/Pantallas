import { RecordIcon } from './ModuleUI';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { DEFAULT_INSUMOS_CATALOG } from './catalog';
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Autocomplete, useMediaQuery } from '@mui/material';
import { money, itemTotal } from '../../pages/compras/logic';
export function DetalleItemsTable({
  items = [],
  onChange,
  onImportPresupuesto,
  presupuestoDisponible = false,
  readOnly = false,
  unitReadOnly = true,
  priceReadOnly = false,
  catalog = DEFAULT_INSUMOS_CATALOG
}) {
  const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const change = (index, field, value) => onChange(items.map((item, i) => {
    if (i !== index) return item;
    const next = {
      ...item,
      [field]: value
    };
    if (field === 'materiaPrima') next.unidad = catalog.find(c => c.nombre === value)?.unidad || '';
    next.subtotal = Math.round(Number(next.cantidad || 0) * Number(next.precioUnitario || 0) * 100) / 100;
    return next;
  }));
  const material = (item, index) => readOnly ? item.materiaPrima : <Autocomplete options={catalog.map(c => c.nombre)} value={item.materiaPrima || null} onChange={(_, value) => change(index, 'materiaPrima', value || '')} renderInput={params => <TextField {...params} required label={`Insumo ${index + 1}`} />} sx={{
    minWidth: {
      sm: 300
    }
  }} />;
  const quantity = (item, index) => readOnly ? item.cantidad : <TextField fullWidth required type="number" label="Cantidad" value={item.cantidad ?? ''} onChange={e => change(index, 'cantidad', e.target.value)} slotProps={{
    htmlInput: {
      min: 0.001,
      step: 'any',
      inputMode: 'decimal',
      'aria-label': `Cantidad del insumo ${index + 1}`
    }
  }} />;
  const unit = (item, index) => readOnly ? item.unidad : <TextField fullWidth label="Unidad" value={item.unidad || ''} slotProps={{
    input: {
      readOnly: unitReadOnly
    },
    htmlInput: {
      'aria-label': `Unidad del insumo ${index + 1}`
    }
  }} onChange={e => change(index, 'unidad', e.target.value)} />;
  const price = (item, index) => readOnly ? money(item.precioUnitario) : <TextField fullWidth required type="number" label="Precio unitario ($)" value={item.precioUnitario ?? ''} onChange={e => change(index, 'precioUnitario', e.target.value)} slotProps={{
    input: {
      readOnly: priceReadOnly
    },
    htmlInput: {
      min: 0.01,
      step: '0.01',
      inputMode: 'decimal',
      'aria-label': `Precio unitario del insumo ${index + 1}`
    }
  }} />;
  const amount = item => money(itemTotal([item]));
  const remove = index => !readOnly && <RecordIcon label={`Quitar insumo ${index + 1}`} color="error" onClick={() => onChange(items.filter((_, i) => i !== index))}><DeleteOutlineIcon /></RecordIcon>;
  return <Stack sx={{
    gap: 2
  }}>
    {!items.length && <Typography color="text.secondary">Todavía no hay insumos. Agregá el primero para completar el detalle.</Typography>}
    {mobile ? items.map((item, index) => <Paper component="fieldset" variant="outlined" key={item.id ?? index} sx={{
      m: 0,
      p: 2,
      minWidth: 0,
      borderRadius: 2
    }}><Typography component="legend" variant="subtitle2">Insumo {index + 1}</Typography><Stack sx={{
        gap: 2
      }}>{material(item, index)}{quantity(item, index)}{unit(item, index)}{price(item, index)}<Typography>Importe: {amount(item)}</Typography>{remove(index)}</Stack></Paper>) : <TableContainer component={Paper} variant="outlined" tabIndex={0} aria-label="Detalle de insumos"><Table sx={{
        minWidth: 880,
        '& .MuiTableCell-root': { px: 1.5, py: 1.5, verticalAlign: 'top' }
      }}><TableHead><TableRow>{['Materia prima', 'Cantidad', 'Unidad', 'Precio unitario', 'Importe', ...(!readOnly ? ['Acciones'] : [])].map(title => <TableCell key={title} sx={{
              fontWeight: 700
            }}>{title}</TableCell>)}</TableRow></TableHead><TableBody>{items.map((item, index) => <TableRow key={item.id ?? index}><TableCell>{material(item, index)}</TableCell><TableCell sx={{
              minWidth: 100
            }}>{quantity(item, index)}</TableCell><TableCell sx={{
              minWidth: 90
            }}>{unit(item, index)}</TableCell><TableCell sx={{
              minWidth: 140
            }}>{price(item, index)}</TableCell><TableCell align="right" sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{amount(item)}</TableCell>{!readOnly && <TableCell>{remove(index)}</TableCell>}</TableRow>)}</TableBody></Table></TableContainer>}
    <Box sx={{
      display: 'flex',
      gap: 1,
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }}>
      {!readOnly && <Button variant="outlined" onClick={() => onChange([...items, {
        id: Math.max(0, ...items.map(i => Number(i.id) || 0)) + 1,
        materiaPrima: '',
        unidad: '',
        cantidad: '',
        precioUnitario: '',
        subtotal: 0
      }])}>Agregar insumo</Button>}
      {!readOnly && presupuestoDisponible && onImportPresupuesto && <Button variant="outlined" onClick={onImportPresupuesto}>Restaurar detalle del presupuesto</Button>}
      <Typography role="status" sx={{
        ...{
          overflowWrap: 'anywhere'
        },
        fontWeight: 700
      }}>Total: {money(itemTotal(items))}</Typography>
    </Box>
  </Stack>;
}
