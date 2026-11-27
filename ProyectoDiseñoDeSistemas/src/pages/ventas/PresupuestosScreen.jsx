import { useNombreEstado } from '../../context/AppContext';
import { RecordIcon } from '../../components/shared/ModuleUI';
import { useState, useMemo } from 'react';
import {
  Box,
  Alert,
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
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PrintIcon from '@mui/icons-material/Print';

import { INITIAL_PRESUPUESTOS, INITIAL_CLIENTES } from './mockData';
import PresupuestoFormScreen from './PresupuestoFormScreen';
import { DetalleItemsVentasTable, ComprobanteDocumentWrapper } from '../../components/ventas';


const DESCUENTO_MAYORISTA = 10;

export const PresupuestosScreen = () => {
  const nombreEstado = useNombreEstado();
  const [presupuestos, setPresupuestos] = useState(INITIAL_PRESUPUESTOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [presupuestoParaPedido, setPresupuestoParaPedido] = useState(null);
  const [tipoNuevoPedido, setTipoNuevoPedido] = useState('Evento (Mayorista)');

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
    descuentoPorcentaje: DESCUENTO_MAYORISTA,
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
    const desc = (subtotalForm * DESCUENTO_MAYORISTA) / 100;
    return subtotalForm - desc;
  }, [subtotalForm]);

  const adelanto50Form = useMemo(() => {
    return totalForm * 0.5;
  }, [totalForm]);

  // Handlers
  const handleOpenNewForm = () => {
    setIsEditing(false);
    setFormError('');
    setSavedMessage('');
    const nextNum = Math.max(0, ...presupuestos.map(p => Number(p.nroPresupuesto.split('-').at(-1)) || 0)) + 1;
    const generatedNro = `PRE-2026-00${nextNum}`;
    const hoy = new Date();
    const vencimiento = new Date(hoy);
    vencimiento.setDate(vencimiento.getDate() + 7);
    const fechaLocal = fecha => new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    setFormData({ ...initialFormState, tipoPedido: 'Mayorista', nroPresupuesto: generatedNro, fechaEmision: fechaLocal(hoy), validezHasta: fechaLocal(vencimiento), items: [] });
    setOpenForm(true);
  };

  const handleOpenEditForm = (item) => {
    setFormError('');
    setSavedMessage('');
    setIsEditing(true);
    setSelectedPresupuesto(item);
    setFormData({ ...item, descuentoPorcentaje: DESCUENTO_MAYORISTA, items: item.items.map(producto => ({ ...producto })) });
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
    if (!clienteObj || !formData.fechaEmision || !formData.validezHasta || formData.validezHasta < formData.fechaEmision) {
      setFormError('Seleccioná un cliente y fechas válidas. La validez debe ser igual o posterior a la emisión.');
      return;
    }
    if (!formData.items.length || formData.items.some(item => !item.idProductoCompuesto || !Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) < 10 || !Number.isFinite(Number(item.precioUnitario)) || Number(item.precioUnitario) < 0)) {
      setFormError('Agregá al menos un producto con una cantidad mínima de 10 y un precio válido.');
      return;
    }
    const payload = {
      ...formData,
      descuentoPorcentaje: DESCUENTO_MAYORISTA,
      items: formData.items.map(item => ({ ...item, cantidad: Number(item.cantidad), precioUnitario: Number(item.precioUnitario) })),
      clienteNombre: clienteObj ? clienteObj.razonSocial : 'Cliente General',
      subtotal: subtotalForm,
      montoDescuento: (subtotalForm * DESCUENTO_MAYORISTA) / 100,
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
    setSavedMessage(isEditing ? 'Presupuesto actualizado.' : 'Presupuesto creado.');
    setOpenForm(false);
  };

  const handleConvertirAPedido = (presupuesto) => {
    setTipoNuevoPedido('Evento (Mayorista)');
    setPresupuestoParaPedido(presupuesto);
  };

  const confirmarPedido = () => {
    setPresupuestos(prev => prev.map(p => p.idPresupuestoCliente === presupuestoParaPedido.idPresupuestoCliente
      ? { ...p, estado: 'Aceptado', tipoPedido: tipoNuevoPedido } : p));
    setSavedMessage(`Presupuesto ${presupuestoParaPedido.nroPresupuesto} aceptado para pedido ${tipoNuevoPedido === 'Semanal' ? 'semanal' : 'de evento'}.`);
    setPresupuestoParaPedido(null);
  };

  const handleDeleteConfirm = () => {
    setPresupuestos((prev) => prev.filter((p) => p.idPresupuestoCliente !== selectedPresupuesto.idPresupuestoCliente));
    setOpenDelete(false);
  };

  const getStatusChip = (estado) => {
    switch (estado) {
      case 'Aceptado':
        return <Chip label={nombreEstado('Aceptado')} color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'Pendiente':
        return <Chip label={nombreEstado('Pendiente')} color="warning" size="small" sx={{ fontWeight: 700 }} />;
      case 'Expirado':
        return <Chip label={nombreEstado('Expirado')} color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={nombreEstado(estado)} size="small" />;
    }
  };

  if (openForm) {
    return <PresupuestoFormScreen datos={formData} isEditing={isEditing}
      onChange={datos => { setFormData(datos); setFormError(''); }}
      onCancel={() => setOpenForm(false)} onSubmit={handleSave}
      subtotal={subtotalForm} descuento={DESCUENTO_MAYORISTA} total={totalForm} adelanto={adelanto50Form} error={formError} />;
  }

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

      {savedMessage && <Alert severity="success" onClose={() => setSavedMessage('')} sx={{ mb: 2 }}>{savedMessage}</Alert>}

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
                <MenuItem value="PENDIENTE">{nombreEstado('Pendiente')}</MenuItem>
                <MenuItem value="ACEPTADO">{nombreEstado('Aceptado')}</MenuItem>
                <MenuItem value="EXPIRADO">{nombreEstado('Expirado')}</MenuItem>
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
                      <RecordIcon label="Aceptar y Convertir a Pedido" color="success" onClick={() => handleConvertirAPedido(item)}>
                        <ShoppingCartCheckoutIcon fontSize="small" />
                      </RecordIcon>
                    )}
                    <RecordIcon label="Ver Cotización" color="default" onClick={() => handleOpenDetail(item)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </RecordIcon>
                    <RecordIcon label="Editar" color="primary" onClick={() => handleOpenEditForm(item)}>
                      <EditOutlinedIcon fontSize="small" />
                    </RecordIcon>
                    <RecordIcon label="Eliminar" color="error" onClick={() => handleOpenDelete(item)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </RecordIcon>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(presupuestoParaPedido)} onClose={() => setPresupuestoParaPedido(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Generar pedido</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{presupuestoParaPedido?.nroPresupuesto}</Typography>
          <TextField select fullWidth label="Tipo de pedido" value={tipoNuevoPedido} onChange={event => setTipoNuevoPedido(event.target.value)}>
            <MenuItem value="Evento (Mayorista)">Evento</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setPresupuestoParaPedido(null)}>Cancelar</Button>
          <Button variant="contained" onClick={confirmarPedido}>Generar pedido</Button>
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
