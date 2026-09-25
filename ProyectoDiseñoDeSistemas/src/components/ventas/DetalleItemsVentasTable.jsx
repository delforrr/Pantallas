import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Autocomplete,
  Typography,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { CATALOGO_PRODUCTOS_VENTAS } from '../../pages/ventas/mockData';

export const DetalleItemsVentasTable = ({
  items = [],
  onChangeItems,
  readOnly = false,
  esCanjeOReclamo = false,
}) => {
  const handleAddItem = () => {
    const defaultProduct = CATALOGO_PRODUCTOS_VENTAS[0];
    const newItem = {
      idProductoCompuesto: defaultProduct.idProductoCompuesto,
      productoNombre: defaultProduct.nombre,
      cantidad: 1,
      precioUnitario: esCanjeOReclamo ? 0 : defaultProduct.precioUnitario,
      subtotal: esCanjeOReclamo ? 0 : defaultProduct.precioUnitario,
    };
    onChangeItems([...items, newItem]);
  };

  const handleRemoveItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChangeItems(updated);
  };

  const handleProductChange = (index, selectedProduct) => {
    if (!selectedProduct) return;
    const updated = [...items];
    const precio = esCanjeOReclamo ? 0 : selectedProduct.precioUnitario;
    updated[index] = {
      ...updated[index],
      idProductoCompuesto: selectedProduct.idProductoCompuesto,
      productoNombre: selectedProduct.nombre,
      precioUnitario: precio,
      subtotal: updated[index].cantidad * precio,
    };
    onChangeItems(updated);
  };

  const handleQuantityChange = (index, val) => {
    const cant = Math.max(1, parseInt(val, 10) || 1);
    const updated = [...items];
    const precio = esCanjeOReclamo ? 0 : updated[index].precioUnitario;
    updated[index] = {
      ...updated[index],
      cantidad: cant,
      subtotal: cant * precio,
    };
    onChangeItems(updated);
  };

  const handlePriceChange = (index, val) => {
    const precio = esCanjeOReclamo ? 0 : Math.max(0, parseFloat(val) || 0);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      precioUnitario: precio,
      subtotal: updated[index].cantidad * precio,
    };
    onChangeItems(updated);
  };

  const totalCalculado = items.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);

  return (
    <Box sx={{ my: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingBagOutlinedIcon color="primary" fontSize="small" />
          Detalle de Productos Solicitados ({items.length})
        </Typography>
        {!readOnly && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Agregar Producto
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px', overflow: 'hidden', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Producto / Presentación</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: '110px' }}>Cantidad</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, width: '140px' }}>Precio Unit. ($)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, width: '140px' }}>Subtotal ($)</TableCell>
              {!readOnly && <TableCell align="center" sx={{ width: '60px' }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 4 : 5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No se han agregado productos al detalle. Haz clic en "Agregar Producto".
                </TableCell>
              </TableRow>
            ) : (
              items.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    {readOnly ? (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.productoNombre}</Typography>
                    ) : (
                      <Autocomplete
                        options={CATALOGO_PRODUCTOS_VENTAS}
                        getOptionLabel={(option) => typeof option === 'string' ? option : `${option.nombre} ($${option.precioUnitario})`}
                        value={CATALOGO_PRODUCTOS_VENTAS.find((p) => p.idProductoCompuesto === row.idProductoCompuesto) || null}
                        onChange={(_, newValue) => handleProductChange(index, newValue)}
                        size="small"
                        renderInput={(params) => <TextField {...params} placeholder="Seleccionar producto..." variant="outlined" />}
                        isOptionEqualToValue={(option, val) => option.idProductoCompuesto === val.idProductoCompuesto}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {readOnly ? (
                      <Typography variant="body2">{row.cantidad}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        size="small"
                        value={row.cantidad}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center' } } }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {readOnly || esCanjeOReclamo ? (
                      <Typography variant="body2">${(row.precioUnitario || 0).toLocaleString()}</Typography>
                    ) : (
                      <TextField
                        type="number"
                        size="small"
                        value={row.precioUnitario}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          },
                          htmlInput: { style: { textAlign: 'right' } },
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${(row.subtotal || 0).toLocaleString()}
                    </Typography>
                  </TableCell>
                  {!readOnly && (
                    <TableCell align="center">
                      <Tooltip title="Quitar ítem">
                        <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
            <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,146,70,0.1)' : '#f0fbf4' }}>
              <TableCell colSpan={3} align="right" sx={{ fontWeight: 700 }}>
                Total Acumulado Detalle:
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#009246' }}>
                ${totalCalculado.toLocaleString()}
              </TableCell>
              {!readOnly && <TableCell />}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

DetalleItemsVentasTable.propTypes = {
  items: PropTypes.array,
  onChangeItems: PropTypes.func,
  readOnly: PropTypes.bool,
  esCanjeOReclamo: PropTypes.bool,
};

export default DetalleItemsVentasTable;
