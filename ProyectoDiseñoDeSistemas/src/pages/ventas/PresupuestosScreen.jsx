import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PrintIcon from '@mui/icons-material/Print';

import { INITIAL_PRESUPUESTOS, INITIAL_CLIENTES } from './mockData';
import { DetalleItemsVentasTable, ComprobanteDocumentWrapper } from '../../components/ventas';


export const PresupuestosScreen = () => {
  const [presupuestos, setPresupuestos] = useState(INITIAL_PRESUPUESTOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State Normalizado
  const initialFormState = {
    nroPresupuesto: '',
    idCliente: 1,
    tipoPedido: 'Evento / Cena de Gala (150 personas)',
    fechaEmision: '2026-09-24',
    validezHasta: '2026-10-01',
    descuentoPorcentaje: 0,
    observaciones: '',
    estado: 'Pendiente',
    items: [
      { idDetallePresupuestoCliente: 1, idProductoCompuesto: 101, productoNombre: 'Sorrentinos Jamón y Queso (Caja 1kg)', cantidad: 10, precioUnitario: 4500, subtotal: 45000 },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filtrado
  const filteredPresupuestos = useMemo(() => {
    return presupuestos.filter((item) => {
      const matchSearch =
        item.nroPresupuesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipoPedido.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado =
        estadoFilter === 'TODOS' || item.estado.toUpperCase() === estadoFilter.toUpperCase();

      return matchSearch && matchEstado;
    });
  }, [presupuestos, searchTerm, estadoFilter]);

  // Cálculos automáticos del formulario
  const subtotalForm = useMemo(() => {
    return (formData.items || []).reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  }, [formData.items]);

  const totalForm = useMemo(() => {
    const desc = (subtotalForm * (formData.descuentoPorcentaje || 0)) / 100;
    return subtotalForm - desc;
  }, [subtotalForm, formData.descuentoPorcentaje]);

  const adelanto50Form = useMemo(() => {
    return totalForm * 0.5;
  }, [totalForm]);

  // Handlers
  const handleOpenNewForm = () => {
    setIsEditing(false);
    const nextNum = presupuestos.length + 1;
    const generatedNro = `PRE-2026-00${nextNum}`;
    setFormData({ ...initialFormState, nroPresupuesto: generatedNro });
    setOpenForm(true);
  };

  const handleOpenEditForm = (item) => {
    setIsEditing(true);
    setSelectedPresupuesto(item);
    setFormData({ ...item });
    setOpenForm(true);
  };

  const handleOpenDetail = (item) => {
    setSelectedPresupuesto(item);
    setOpenDetail(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedPresupuesto(item);
    setOpenDelete(true);
  };

  const handleSave = () => {
    const clienteObj = INITIAL_CLIENTES.find((c) => c.idCliente === formData.idCliente);
    const payload = {
      ...formData,
      clienteNombre: clienteObj ? clienteObj.razonSocial : 'Cliente General',
      subtotal: subtotalForm,
      montoDescuento: (subtotalForm * (formData.descuentoPorcentaje || 0)) / 100,
      total: totalForm,
      adelanto50Requerido: adelanto50Form,
    };

    if (isEditing) {
      setPresupuestos((prev) =>
        prev.map((p) => (p.idPresupuestoCliente === selectedPresupuesto.idPresupuestoCliente ? { ...payload, idPresupuestoCliente: selectedPresupuesto.idPresupuestoCliente } : p))
      );
    } else {
      const newId = presupuestos.length > 0 ? Math.max(...presupuestos.map((p) => p.idPresupuestoCliente)) + 1 : 1;
      setPresupuestos((prev) => [...prev, { ...payload, idPresupuestoCliente: newId }]);
    }
    setOpenForm(false);
  };

  const handleConvertirAPedido = (presupuesto) => {
    setPresupuestos((prev) =>
      prev.map((p) => (p.idPresupuestoCliente === presupuesto.idPresupuestoCliente ? { ...p, estado: 'Aceptado' } : p))
    );
    alert(`¡Presupuesto ${presupuesto.nroPresupuesto} ACEPTADO! Se ha generado la Orden de Pedido correspondiente con un adelanto del 50% ($${(presupuesto.total * 0.5).toLocaleString()}).`);
  };

  const handleDeleteConfirm = () => {
    setPresupuestos((prev) => prev.filter((p) => p.idPresupuestoCliente !== selectedPresupuesto.idPresupuestoCliente));
    setOpenDelete(false);
  };

  const getStatusChip = (estado) => {
    switch (estado) {
      case 'Aceptado':
        return <Chip label="Aceptado" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'Pendiente':
        return <Chip label="Pendiente" color="warning" size="small" sx={{ fontWeight: 700 }} />;
      case 'Expirado':
        return <Chip label="Expirado" color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={estado} size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionOutlinedIcon color="primary" fontSize="large" />
            Presupuestos a Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cotización de banquetes, eventos especiales (48hs anticipación) y acuerdos semanales con calculador de 50% seña.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewForm}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 2.5 }}
        >
          Nuevo Presupuesto
        </Button>
      </Box>

      {/* Buscador y Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '14px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por Nro Presupuesto, Cliente o Evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select value={estadoFilter} label="Filtrar por Estado" onChange={(e) => setEstadoFilter(e.target.value)}>
                <MenuItem value="TODOS">Todos los Estados</MenuItem>
                <MenuItem value="PENDIENTE">Pendientes</MenuItem>
                <MenuItem value="ACEPTADO">Aceptados</MenuItem>
                <MenuItem value="EXPIRADO">Expirados</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Presupuestos Normalizada con Scroll Horizontal */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflowX: 'auto', width: '100%' }}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nro Presupuesto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo de Pedido</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Emisión</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Validez Hasta</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal ($)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Descuento (%)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Total ($)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Adelanto 50% ($)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPresupuestos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron presupuestos cargados.
                </TableCell>
              </TableRow>
            ) : (
              filteredPresupuestos.map((item) => (
                <TableRow key={item.idPresupuestoCliente} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {item.nroPresupuesto}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.clienteNombre}</TableCell>
                  <TableCell><Chip label={item.tipoPedido} size="small" variant="outlined" /></TableCell>
                  <TableCell>{item.fechaEmision}</TableCell>
                  <TableCell><Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>{item.validezHasta}</Typography></TableCell>
                  <TableCell align="right">${(item.subtotal || item.total).toLocaleString()}</TableCell>
                  <TableCell align="right">{item.descuentoPorcentaje || 0}%</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#009246' }}>
                    ${item.total.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                    ${(item.total * 0.5).toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusChip(item.estado)}</TableCell>
                  <TableCell align="center">
                    {item.estado === 'Pendiente' && (
                      <Tooltip title="Aceptar y Convertir a Pedido">
                        <IconButton size="small" color="success" onClick={() => handleConvertirAPedido(item)}>
                          <ShoppingCartCheckoutIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Ver Cotización">
                      <IconButton size="small" color="info" onClick={() => handleOpenDetail(item)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEditForm(item)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleOpenDelete(item)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Formulario Estructurado de Presupuesto estilo Voucher / Comprobante */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {isEditing ? `Editar Presupuesto ${formData.nroPresupuesto}` : 'Formulario de Presupuesto / Cotización'}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenForm(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh', overflowY: 'auto', p: { xs: 1.5, sm: 2.5 } }}>
          <ComprobanteDocumentWrapper
            tipoDocTitle="Presupuesto"
            nroDocumento={formData.nroPresupuesto || 'PRE-2026-0001'}
            headerGrid={
              <Grid container spacing={0}>
                {/* Fila 1: Cliente & Fecha Emisión */}
                <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Cliente:</Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                    <InputLabel>Cliente Solicitante</InputLabel>
                    <Select
                      value={formData.idCliente}
                      label="Cliente Solicitante"
                      onChange={(e) => setFormData({ ...formData, idCliente: e.target.value })}
                    >
                      {INITIAL_CLIENTES.map((c) => (
                        <MenuItem key={c.idCliente} value={c.idCliente}>
                          {c.razonSocial} ({c.cuit})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={5} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Fecha de Emisión:</Typography>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    InputLabelProps={{ shrink: true }}
                    value={formData.fechaEmision || ''}
                    onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
                  />
                </Grid>

                {/* Fila 2: Tipo de Pedido & Validez */}
                <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' } }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Tipo de Pedido / Evento:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    placeholder="Ej. Evento Especial (Cena 150 personas)"
                    value={formData.tipoPedido || ''}
                    onChange={(e) => setFormData({ ...formData, tipoPedido: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={5} sx={{ p: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Validez Hasta:</Typography>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    InputLabelProps={{ shrink: true }}
                    value={formData.validezHasta || ''}
                    onChange={(e) => setFormData({ ...formData, validezHasta: e.target.value })}
                  />
                </Grid>
              </Grid>
            }
            itemsTitle="Por favor suministrar lo siguiente"
            itemsTable={
              <DetalleItemsVentasTable
                items={formData.items || []}
                onChangeItems={(newItems) => setFormData({ ...formData, items: newItems })}
              />
            }
            footerGrid={
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Descuento Aplicado (%):</Typography>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    value={formData.descuentoPorcentaje}
                    onChange={(e) => setFormData({ ...formData, descuentoPorcentaje: parseFloat(e.target.value) || 0 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Adelanto 50% Seña Requerida:</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ed6c02', mt: 0.5 }}>
                    $ {adelanto50Form.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            }
            observacionesInput={
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Observaciones / Condición de entrega:</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  sx={{ mt: 0.5 }}
                  placeholder="Detalles de preparación, lugar o logística del evento..."
                  value={formData.observaciones || ''}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </Box>
            }
            totalLabel="Valor total cotizado:"
            totalAmount={totalForm}
            extraTotals={
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Subtotal: ${subtotalForm.toLocaleString()}</Typography>
                {formData.descuentoPorcentaje > 0 && (
                  <Typography variant="caption" color="error" display="block">Descuento ({formData.descuentoPorcentaje}%): -${((subtotalForm * formData.descuentoPorcentaje) / 100).toLocaleString()}</Typography>
                )}
              </Box>
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenForm(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} sx={{ px: 3, fontWeight: 700 }}>
            Guardar Presupuesto
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Vista Previa Documento Cotización */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Cotización Oficial #{selectedPresupuesto?.nroPresupuesto}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2.5 } }}>
          {selectedPresupuesto && (
            <ComprobanteDocumentWrapper
              tipoDocTitle="Presupuesto"
              nroDocumento={selectedPresupuesto.nroPresupuesto}
              headerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>CLIENTE:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{selectedPresupuesto.clienteNombre}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>FECHA EMISIÓN:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPresupuesto.fechaEmision}</Typography>
                  </Grid>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>TIPO DE EVENTO / PEDIDO:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPresupuesto.tipoPedido}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>VALIDEZ HASTA:</Typography>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>{selectedPresupuesto.validezHasta}</Typography>
                  </Grid>
                </Grid>
              }
              itemsTitle="Por favor suministrar lo siguiente"
              itemsTable={<DetalleItemsVentasTable items={selectedPresupuesto.items || []} readOnly />}
              footerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>DESCUENTO APLICADO:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedPresupuesto.descuentoPorcentaje || 0}%</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>SEÑA 50% REQUERIDA:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ed6c02' }}>${(selectedPresupuesto.total * 0.5).toLocaleString()}</Typography>
                  </Grid>
                </Grid>
              }
              observacionesInput={
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>OBSERVACIONES:</Typography>
                  <Typography variant="body2">{selectedPresupuesto.observaciones || 'Sin observaciones adicionales.'}</Typography>
                </Box>
              }
              totalLabel="Valor total cotizado:"
              totalAmount={selectedPresupuesto.total}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button startIcon={<PrintIcon />} onClick={() => window.print()} color="inherit">Imprimir Cotización</Button>
          <Button variant="contained" onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Confirmación Eliminación */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar Presupuesto?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseas eliminar el presupuesto <strong>{selectedPresupuesto?.nroPresupuesto}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PresupuestosScreen;
