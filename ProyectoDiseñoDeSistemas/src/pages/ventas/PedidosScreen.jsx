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
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import { INITIAL_PEDIDOS, INITIAL_CLIENTES, INITIAL_COMPROBANTES_VENTA, MEDIOS_DE_PAGO, calcularEstadoMoroso } from './mockData';
import { DetalleItemsVentasTable, ClienteMorosoAlert } from '../../components/ventas';

export const PedidosScreen = () => {
  const [pedidos, setPedidos] = useState(INITIAL_PEDIDOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegistrarPago, setOpenRegistrarPago] = useState(false);

  // Selecciones
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Registrar Pago Form
  const [montoPago, setMontoPago] = useState(0);
  const [idMedioDePagoCliente, setIdMedioDePagoCliente] = useState(1);

  // Form State Inicial
  const initialFormState = {
    nroPedido: '',
    idCliente: 1,
    tipoPedido: 'Venta Mostrador / Local',
    domicilioEntrega: 'Retiro en Local Comercial',
    telefonoPedido: '(02392) 43-9901',
    fechaEmision: '2026-09-24',
    fechaEntregaEstimada: '2026-09-25',
    horaEntregaEstimada: '12:00',
    idEmpleado: 101,
    vendedor: 'Juan Borlini',
    estadoPedido: 'Pendiente',
    señaExigida: 0,
    señaPagada: 0,
    estadoPago: 'Pendiente',
    esCanje: false,
    esDonacion: false,
    descuentoAplicado: 0,
    observaciones: '',
    items: [
      { idDetallePedidoCliente: 1, idProductoCompuesto: 101, productoNombre: 'Sorrentinos Jamón y Queso (Caja 1kg)', cantidad: 2, precioUnitario: 4500, subtotal: 9000 },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  // Cliente Seleccionado en Formulario para validar morosidad calculada
  const selectedClienteForm = useMemo(() => {
    return INITIAL_CLIENTES.find((c) => c.idCliente === formData.idCliente);
  }, [formData.idCliente]);

  const morosidadCalculada = useMemo(() => {
    return calcularEstadoMoroso(selectedClienteForm, INITIAL_COMPROBANTES_VENTA);
  }, [selectedClienteForm]);

  // Filtrado
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((item) => {
      const matchSearch =
        item.nroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipoPedido.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo =
        tipoFilter === 'TODOS' ||
        (tipoFilter === 'CANJE' && item.esCanje) ||
        (tipoFilter === 'DONACION' && item.esDonacion) ||
        (tipoFilter === 'EVENTO' && item.tipoPedido.includes('Evento')) ||
        (tipoFilter === 'SEMANAL' && item.tipoPedido.includes('Semanal'));

      const matchEstado =
        estadoFilter === 'TODOS' || item.estadoPedido.toUpperCase() === estadoFilter.toUpperCase();

      return matchSearch && matchTipo && matchEstado;
    });
  }, [pedidos, searchTerm, tipoFilter, estadoFilter]);

  // Cálculos de Totales del Formulario
  const subtotalForm = useMemo(() => {
    if (formData.esCanje || formData.esDonacion) return 0;
    return (formData.items || []).reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  }, [formData.items, formData.esCanje, formData.esDonacion]);

  const totalForm = useMemo(() => {
    if (formData.esCanje || formData.esDonacion) return 0;
    const desc = (subtotalForm * (formData.descuentoAplicado || 0)) / 100;
    return subtotalForm - desc;
  }, [subtotalForm, formData.descuentoAplicado, formData.esCanje, formData.esDonacion]);

  // Handlers
  const handleOpenNewForm = (tipoEspecial = 'REGULAR') => {
    setIsEditing(false);
    const nextNum = pedidos.length + 1;
    const generatedNro = `PED-2026-00${nextNum}`;

    if (tipoEspecial === 'CANJE') {
      setFormData({
        ...initialFormState,
        nroPedido: generatedNro,
        tipoPedido: 'Canje por Reclamo (Mal Estado)',
        esCanje: true,
        descuentoAplicado: 100,
        observaciones: 'Canje sin costo por reposición de producto en mal estado (Regla TP: Orden $0).',
        items: [{ idDetallePedidoCliente: 1, idProductoCompuesto: 101, productoNombre: 'Sorrentinos Jamón y Queso (Caja 1kg)', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
      });
    } else if (tipoEspecial === 'DONACION') {
      setFormData({
        ...initialFormState,
        nroPedido: generatedNro,
        tipoPedido: 'Donación Institucional ($0)',
        esDonacion: true,
        descuentoAplicado: 100,
        observaciones: 'Donación documentada de alimentos a institución de caridad.',
        items: [{ idDetallePedidoCliente: 1, idProductoCompuesto: 104, productoNombre: 'Ñoquis de Papa Artesanales (Kg)', cantidad: 5, precioUnitario: 0, subtotal: 0 }],
      });
    } else {
      setFormData({ ...initialFormState, nroPedido: generatedNro });
    }
    setOpenForm(true);
  };

  const handleOpenEditForm = (item) => {
    setIsEditing(true);
    setSelectedPedido(item);
    setFormData({ ...item });
    setOpenForm(true);
  };

  const handleOpenDetail = (item) => {
    setSelectedPedido(item);
    setOpenDetail(true);
  };

  const handleOpenRegistrarPagoModal = (item) => {
    setSelectedPedido(item);
    setMontoPago(item.total - item.señaPagada);
    setOpenRegistrarPago(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedPedido(item);
    setOpenDelete(true);
  };

  const handleSave = () => {
    const clienteObj = INITIAL_CLIENTES.find((c) => c.idCliente === formData.idCliente);
    
    // Regla TP: Bloqueo de cliente moroso para ventas a crédito
    if (morosidadCalculada.esMoroso && formData.estadoPago.includes('Cuenta Corriente')) {
      alert(`¡VENTA A CRÉDITO BLOQUEADA! El cliente ${clienteObj.razonSocial} ha sido detectado como MOROSO (${morosidadCalculada.razon}). Solo se permite pago de contado o en efectivo.`);
      return;
    }

    const payload = {
      ...formData,
      clienteNombre: clienteObj ? clienteObj.razonSocial : 'Cliente General',
      subtotal: subtotalForm,
      total: totalForm,
      señaExigida: formData.tipoPedido.includes('Evento') ? totalForm * 0.5 : 0,
      estadoPago: (formData.esCanje || formData.esDonacion) ? 'Canje / Donación $0' : formData.estadoPago,
    };

    if (isEditing) {
      setPedidos((prev) =>
        prev.map((p) => (p.idComprobantePedidoCliente === selectedPedido.idComprobantePedidoCliente ? { ...payload, idComprobantePedidoCliente: selectedPedido.idComprobantePedidoCliente } : p))
      );
    } else {
      const newId = pedidos.length > 0 ? Math.max(...pedidos.map((p) => p.idComprobantePedidoCliente)) + 1 : 1;
      setPedidos((prev) => [...prev, { ...payload, idComprobantePedidoCliente: newId }]);
    }
    setOpenForm(false);
  };

  const handleRegistrarPagoConfirm = () => {
    setPedidos((prev) =>
      prev.map((p) => {
        if (p.idComprobantePedidoCliente === selectedPedido.idComprobantePedidoCliente) {
          const nuevaSeña = p.señaPagada + parseFloat(montoPago || 0);
          const nuevoEstadoPago = nuevaSeña >= p.total ? 'Saldado 100%' : `Seña $${nuevaSeña} Pagada`;
          return {
            ...p,
            señaPagada: nuevaSeña,
            estadoPago: nuevoEstadoPago,
          };
        }
        return p;
      })
    );
    setOpenRegistrarPago(false);
  };

  const handleDeleteConfirm = () => {
    setPedidos((prev) => prev.filter((p) => p.idComprobantePedidoCliente !== selectedPedido.idComprobantePedidoCliente));
    setOpenDelete(false);
  };

  const getStatusChip = (estado) => {
    switch (estado) {
      case 'Finalizado':
        return <Chip label="Finalizado" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'En Preparación':
        return <Chip label="En Preparación" color="info" size="small" sx={{ fontWeight: 700 }} />;
      case 'Pendiente':
        return <Chip label="Pendiente" color="warning" size="small" sx={{ fontWeight: 700 }} />;
      case 'Cancelado':
        return <Chip label="Cancelado" color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={estado} size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBagOutlinedIcon color="primary" fontSize="large" />
            Pedidos de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administración de órdenes de pedido de clientes (ComprobanteDePedidoCliente).
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="warning" startIcon={<ChangeCircleIcon />} onClick={() => handleOpenNewForm('CANJE')}>
            Registrar Canje ($0)
          </Button>
          <Button variant="outlined" color="secondary" startIcon={<VolunteerActivismIcon />} onClick={() => handleOpenNewForm('DONACION')}>
            Donación ($0)
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenNewForm('REGULAR')}>
            Nuevo Pedido
          </Button>
        </Box>
      </Box>

      {/* Buscador y Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '14px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por Nro Pedido, Cliente o Domicilio..."
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
          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Pedido</InputLabel>
              <Select value={tipoFilter} label="Tipo de Pedido" onChange={(e) => setTipoFilter(e.target.value)}>
                <MenuItem value="TODOS">Todos los Tipos</MenuItem>
                <MenuItem value="SEMANAL">Semanales / Mayoristas</MenuItem>
                <MenuItem value="EVENTO">Eventos Especiales (48hs)</MenuItem>
                <MenuItem value="CANJE">Canje por Mal Estado ($0)</MenuItem>
                <MenuItem value="DONACION">Donaciones ($0)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado del Pedido</InputLabel>
              <Select value={estadoFilter} label="Estado del Pedido" onChange={(e) => setEstadoFilter(e.target.value)}>
                <MenuItem value="TODOS">Todos los Estados</MenuItem>
                <MenuItem value="PENDIENTE">Pendientes</MenuItem>
                <MenuItem value="EN PREPARACIÓN">En Preparación</MenuItem>
                <MenuItem value="FINALIZADO">Finalizados</MenuItem>
                <MenuItem value="CANCELADO">Cancelados</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Pedidos limpia con columnas 100% normalizadas y scroll horizontal */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflowX: 'auto', width: '100%' }}>
        <Table sx={{ minWidth: 1400 }}>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nro Pedido</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo de Pedido</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Calle Entrega</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Altura</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Localidad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Entrega</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Hora Entrega</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Total ($)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado Pago</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado Pedido</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron pedidos registrados.
                </TableCell>
              </TableRow>
            ) : (
              filteredPedidos.map((pedido) => (
                <TableRow key={pedido.idComprobantePedidoCliente} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {pedido.nroPedido}
                    {pedido.esCanje && <Chip label="CANJE $0" color="warning" size="small" sx={{ ml: 1, fontWeight: 800 }} />}
                    {pedido.esDonacion && <Chip label="DONACIÓN" color="secondary" size="small" sx={{ ml: 1, fontWeight: 800 }} />}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{pedido.clienteNombre}</TableCell>
                  <TableCell><Chip label={pedido.tipoPedido} size="small" variant="outlined" /></TableCell>
                  <TableCell>{pedido.calleEntrega || 'Av. Villegas'}</TableCell>
                  <TableCell>{pedido.alturaEntrega || '450'}</TableCell>
                  <TableCell>{pedido.localidadEntrega || 'Trenque Lauquen'}</TableCell>
                  <TableCell>{pedido.fechaEntregaEstimada}</TableCell>
                  <TableCell>{pedido.horaEntregaEstimada}hs</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: pedido.total === 0 ? 'text.secondary' : '#009246' }}>
                    ${pedido.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={pedido.estadoPago} variant="outlined" size="small" color={pedido.estadoPago.includes('Saldado') ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>{getStatusChip(pedido.estadoPedido)}</TableCell>
                  <TableCell align="center">
                    {pedido.total > 0 && pedido.señaPagada < pedido.total && (
                      <Tooltip title="Registrar Pago / Seña">
                        <IconButton size="small" color="success" onClick={() => handleOpenRegistrarPagoModal(pedido)}>
                          <PriceCheckIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Ver Detalle">
                      <IconButton size="small" color="info" onClick={() => handleOpenDetail(pedido)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar Pedido">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEditForm(pedido)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleOpenDelete(pedido)}>
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

      {/* Modal Formulario Normalizado */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isEditing ? `Editar Pedido ${formData.nroPedido}` : formData.esCanje ? 'Registrar Canje por Producto en Mal Estado ($0)' : formData.esDonacion ? 'Registrar Donación Institucional ($0)' : 'Nuevo Pedido de Cliente'}
          <IconButton onClick={() => setOpenForm(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {morosidadCalculada.esMoroso && (
            <ClienteMorosoAlert cliente={selectedClienteForm} comprobantesVenta={INITIAL_COMPROBANTES_VENTA} />
          )}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField label="Nro de Pedido" fullWidth size="small" disabled value={formData.nroPedido} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth size="small">
                <InputLabel>Cliente Solicitante</InputLabel>
                <Select
                  value={formData.idCliente}
                  label="Cliente Solicitante"
                  onChange={(e) => setFormData({ ...formData, idCliente: e.target.value })}
                >
                  {INITIAL_CLIENTES.map((c) => (
                    <MenuItem key={c.idCliente} value={c.idCliente}>
                      {c.razonSocial}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Pedido</InputLabel>
                <Select value={formData.tipoPedido} label="Tipo de Pedido" onChange={(e) => setFormData({ ...formData, tipoPedido: e.target.value })}>
                  <MenuItem value="Venta Mostrador / Local">Venta Mostrador / Local</MenuItem>
                  <MenuItem value="Mayorista Semanal Fijo">Mayorista Semanal Fijo (Con Descuento)</MenuItem>
                  <MenuItem value="Evento Especial (Cena 48hs)">Evento Especial (Requiere 48hs y 50% seña)</MenuItem>
                  <MenuItem value="Canje por Reclamo (Mal Estado)">Canje por Reclamo (Valor $0)</MenuItem>
                  <MenuItem value="Donación Institucional ($0)">Donación Institucional ($0)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono de Contacto" fullWidth size="small" value={formData.telefonoPedido} onChange={(e) => setFormData({ ...formData, telefonoPedido: e.target.value })} />
            </Grid>

            {/* Domicilio Entrega Normalizado */}
            <Grid item xs={12} sm={5}>
              <TextField label="Calle de Entrega" fullWidth size="small" value={formData.calleEntrega || ''} onChange={(e) => setFormData({ ...formData, calleEntrega: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Altura / Nro" fullWidth size="small" value={formData.alturaEntrega || ''} onChange={(e) => setFormData({ ...formData, alturaEntrega: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Localidad" fullWidth size="small" value={formData.localidadEntrega || ''} onChange={(e) => setFormData({ ...formData, localidadEntrega: e.target.value })} />
            </Grid>

            {/* Fechas de Entrega Normalizadas */}
            <Grid item xs={12} sm={6}>
              <TextField label="Fecha Entrega Estimada" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={formData.fechaEntregaEstimada || ''} onChange={(e) => setFormData({ ...formData, fechaEntregaEstimada: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Hora Entrega Estimada" type="time" fullWidth size="small" InputLabelProps={{ shrink: true }} value={formData.horaEntregaEstimada || ''} onChange={(e) => setFormData({ ...formData, horaEntregaEstimada: e.target.value })} />
            </Grid>
          </Grid>

          <DetalleItemsVentasTable
            items={formData.items || []}
            onChangeItems={(newItems) => setFormData({ ...formData, items: newItems })}
            esCanjeOReclamo={formData.esCanje || formData.esDonacion}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenForm(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Guardar Pedido</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Registrar Pago / Seña */}
      <Dialog open={openRegistrarPago} onClose={() => setOpenRegistrarPago(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Registrar Pago / Seña</DialogTitle>
        <DialogContent dividers>
          {selectedPedido && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2">
                Pedido: <strong>{selectedPedido.nroPedido}</strong>
              </Typography>
              <TextField label="Monto a Cobrar ($)" type="number" fullWidth size="small" value={montoPago} onChange={(e) => setMontoPago(e.target.value)} />
              <FormControl fullWidth size="small">
                <InputLabel>Medio de Pago</InputLabel>
                <Select value={idMedioDePagoCliente} label="Medio de Pago" onChange={(e) => setIdMedioDePagoCliente(e.target.value)}>
                  {MEDIOS_DE_PAGO.map((m) => (
                    <MenuItem key={m.idMedioDePagoCliente} value={m.idMedioDePagoCliente}>{m.descripcion}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegistrarPago(false)}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={handleRegistrarPagoConfirm}>Confirmar Pago</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Detalle Pedido */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Detalle de Pedido #{selectedPedido?.nroPedido}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPedido && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {selectedPedido.clienteNombre}
              </Typography>
              <DetalleItemsVentasTable items={selectedPedido.items || []} readOnly esCanjeOReclamo={selectedPedido.esCanje} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Confirmación Eliminación */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar Pedido?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseas eliminar el pedido <strong>{selectedPedido?.nroPedido}</strong>?
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

export default PedidosScreen;
