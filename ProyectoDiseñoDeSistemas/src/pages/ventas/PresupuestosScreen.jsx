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
import { DetalleItemsVentasTable } from '../../components/ventas';

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

  // Form State
  const initialFormState = {
    nroPresupuesto: '',
    clienteId: 1,
    tipoPedido: 'Evento / Cena de Gala (150 personas)',
    fechaEmision: '2026-09-24',
    validezHasta: '2026-10-01',
    descuentoPorcentaje: 0,
    observaciones: '',
    estado: 'Pendiente',
    items: [
      { productoId: 101, productoNombre: 'Sorrentinos Jamón y Queso (Caja 1kg)', cantidad: 10, precioUnitario: 4500, subtotal: 45000 },
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
    const clienteObj = INITIAL_CLIENTES.find((c) => c.id === formData.clienteId);
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
        prev.map((p) => (p.id === selectedPresupuesto.id ? { ...payload, id: selectedPresupuesto.id } : p))
      );
    } else {
      const newId = presupuestos.length > 0 ? Math.max(...presupuestos.map((p) => p.id)) + 1 : 1;
      setPresupuestos((prev) => [...prev, { ...payload, id: newId }]);
    }
    setOpenForm(false);
  };

  const handleConvertirAPedido = (presupuesto) => {
    setPresupuestos((prev) =>
      prev.map((p) => (p.id === presupuesto.id ? { ...p, estado: 'Aceptado' } : p))
    );
    alert(`¡Presupuesto ${presupuesto.nroPresupuesto} ACEPTADO! Se ha generado la Orden de Pedido correspondiente con un adelanto del 50% ($${(presupuesto.total * 0.5).toLocaleString()}).`);
  };

  const handleDeleteConfirm = () => {
    setPresupuestos((prev) => prev.filter((p) => p.id !== selectedPresupuesto.id));
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
              <Select
                value={estadoFilter}
                label="Filtrar por Estado"
                onChange={(e) => setEstadoFilter(e.target.value)}
              >
                <MenuItem value="TODOS">Todos los Estados</MenuItem>
                <MenuItem value="PENDIENTE">Pendientes</MenuItem>
                <MenuItem value="ACEPTADO">Aceptados</MenuItem>
                <MenuItem value="EXPIRADO">Expirados</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Presupuestos */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nro Presupuesto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo de Pedido / Evento</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Emisión / Validez</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Total ($)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Adelanto 50% ($)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPresupuestos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron presupuestos cargados.
                </TableCell>
              </TableRow>
            ) : (
              filteredPresupuestos.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {item.nroPresupuesto}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.clienteNombre}</TableCell>
                  <TableCell>{item.tipoPedido}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.fechaEmision}</Typography>
                    <Typography variant="caption" color="text.secondary">Vence: {item.validezHasta}</Typography>
                  </TableCell>
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

      {/* Modal Formulario (Alta / Edición) */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? `Editar Presupuesto ${formData.nroPresupuesto}` : 'Nuevo Presupuesto para Cliente'}
          <IconButton onClick={() => setOpenForm(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nro de Presupuesto"
                fullWidth
                size="small"
                disabled
                value={formData.nroPresupuesto}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth size="small">
                <InputLabel>Cliente Solicitante</InputLabel>
                <Select
                  value={formData.clienteId}
                  label="Cliente Solicitante"
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                >
                  {INITIAL_CLIENTES.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.razonSocial} ({c.tipoCliente})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Tipo de Pedido / Evento"
                fullWidth
                size="small"
                placeholder="Ej. Evento Especial (150 personas)"
                value={formData.tipoPedido}
                onChange={(e) => setFormData({ ...formData, tipoPedido: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Fecha Emisión"
                type="date"
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.fechaEmision}
                onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Validez Hasta"
                type="date"
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.validezHasta}
                onChange={(e) => setFormData({ ...formData, validezHasta: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Tabla de Productos */}
          <DetalleItemsVentasTable
            items={formData.items || []}
            onChangeItems={(newItems) => setFormData({ ...formData, items: newItems })}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Observaciones / Requisitos de entrega"
                fullWidth
                multiline
                rows={2}
                size="small"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,146,70,0.08)' : '#f4fbf7' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${subtotalForm.toLocaleString()}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Descuento (%):</Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: '90px' }}
                    value={formData.descuentoPorcentaje}
                    onChange={(e) => setFormData({ ...formData, descuentoPorcentaje: parseFloat(e.target.value) || 0 })}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Cotizado:</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#009246' }}>
                    ${totalForm.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(237,108,2,0.1)', p: 1, borderRadius: '6px' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                    Seña del 50% Requerida (TP):
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#ed6c02' }}>
                    ${adelanto50Form.toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenForm(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>
            Guardar Presupuesto
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Detalle Cotización / Impresión */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Cotización Oficial #{selectedPresupuesto?.nroPresupuesto}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPresupuesto && (
            <Box sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#009246' }}>FÁBRICA DE PASTAS ERPSISTEMAS</Typography>
                  <Typography variant="caption" display="block">Av. Villegas 450, Trenque Lauquen</Typography>
                  <Typography variant="caption" display="block">CUIT: 30-71928441-0</Typography>
                </Box>
                <Box align="right">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedPresupuesto.nroPresupuesto}</Typography>
                  <Typography variant="body2">Emisión: {selectedPresupuesto.fechaEmision}</Typography>
                  <Typography variant="body2" color="error">Vence: {selectedPresupuesto.validezHasta}</Typography>
                </Box>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: '10px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Cliente Cotizado:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPresupuesto.clienteNombre}</Typography>
                <Typography variant="caption" color="text.secondary">Evento / Tipo: {selectedPresupuesto.tipoPedido}</Typography>
              </Paper>

              <DetalleItemsVentasTable items={selectedPresupuesto.items || []} readOnly />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', minWidth: '280px' }}>
                  <Typography variant="body2" display="flex" justifyContent="space-between">
                    Subtotal: <span>${selectedPresupuesto.subtotal.toLocaleString()}</span>
                  </Typography>
                  {selectedPresupuesto.descuentoPorcentaje > 0 && (
                    <Typography variant="body2" color="success.main" display="flex" justifyContent="space-between">
                      Descuento ({selectedPresupuesto.descuentoPorcentaje}%): <span>-${selectedPresupuesto.montoDescuento.toLocaleString()}</span>
                    </Typography>
                  )}
                  <Typography variant="h6" display="flex" justifyContent="space-between" sx={{ fontWeight: 800, mt: 1, color: '#009246' }}>
                    Total Cotizado: <span>${selectedPresupuesto.total.toLocaleString()}</span>
                  </Typography>
                  <Typography variant="subtitle2" display="flex" justifyContent="space-between" sx={{ color: '#ed6c02', fontWeight: 700, mt: 1 }}>
                    Seña 50% Obligatoria: <span>${(selectedPresupuesto.total * 0.5).toLocaleString()}</span>
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<PrintIcon />} onClick={() => window.print()} color="inherit">Imprimir / Exportar PDF</Button>
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
