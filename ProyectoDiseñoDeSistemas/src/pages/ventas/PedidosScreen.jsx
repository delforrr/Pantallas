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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';


import { INITIAL_PEDIDOS, INITIAL_CLIENTES, INITIAL_PRESUPUESTOS, INITIAL_COMPROBANTES_VENTA, MEDIOS_DE_PAGO, calcularEstadoMoroso } from './mockData';
import { DetalleItemsVentasTable, ClienteMorosoAlert, ComprobanteDocumentWrapper } from '../../components/ventas';


export const PedidosScreen = () => {
  const [pedidos, setPedidos] = useState(INITIAL_PEDIDOS);
  const [clientesList, setClientesList] = useState(INITIAL_CLIENTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegistrarPago, setOpenRegistrarPago] = useState(false);
  const [openQuickClienteModal, setOpenQuickClienteModal] = useState(false);

  // Selecciones
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Registrar Pago Form
  const [montoPago, setMontoPago] = useState(0);
  const [idMedioDePagoCliente, setIdMedioDePagoCliente] = useState(1);

  // State para rápido nuevo cliente
  const initialQuickClienteData = {
    razonSocial: '',
    cuit: '',
    responsable: '',
    telefono: '',
    email: '',
    calle: '',
    altura: '',
    localidad: 'Trenque Lauquen',
    tipoIva: 'Responsable Inscripto',
    tipoCliente: 'Mayorista (Restaurante / Semanal)',
    aceptaCredito: false,
    limiteCredito: 0,
    creditoUsado: 0,
    estado: 'Activo',
  };
  const [quickClienteData, setQuickClienteData] = useState(initialQuickClienteData);

  // Form State Inicial Pedido
  const initialFormState = {
    nroPedido: '',
    idPresupuestoCliente: '',
    idCliente: 1,
    tipoPedido: 'Venta Mostrador / Local',
    diaEntregaHabitual: 'Lunes',
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
    return clientesList.find((c) => c.idCliente === formData.idCliente);
  }, [clientesList, formData.idCliente]);

  const morosidadCalculada = useMemo(() => {
    return calcularEstadoMoroso(selectedClienteForm, INITIAL_COMPROBANTES_VENTA);
  }, [selectedClienteForm]);

  // Handler para cargar datos desde un Presupuesto Existente
  const handleSelectPresupuesto = (idPresupuesto) => {
    if (!idPresupuesto) {
      setFormData((prev) => ({ ...prev, idPresupuestoCliente: '' }));
      return;
    }

    const presupuesto = INITIAL_PRESUPUESTOS.find((p) => p.idPresupuestoCliente === Number(idPresupuesto));
    if (!presupuesto) return;

    const clienteObj = clientesList.find((c) => c.idCliente === presupuesto.idCliente);

    const mappedItems = (presupuesto.items || []).map((item, idx) => ({
      idDetallePedidoCliente: idx + 1,
      idProductoCompuesto: item.idProductoCompuesto,
      productoNombre: item.productoNombre,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal,
    }));

    let tipoPedidoMapped = 'Evento Especial (Cena 48hs)';
    if (presupuesto.tipoPedido.toLowerCase().includes('semanal')) {
      tipoPedidoMapped = 'Mayorista Semanal Fijo';
    }

    setFormData((prev) => ({
      ...prev,
      idPresupuestoCliente: presupuesto.idPresupuestoCliente,
      idCliente: presupuesto.idCliente,
      tipoPedido: tipoPedidoMapped,
      telefonoPedido: clienteObj?.telefono || prev.telefonoPedido,
      calleEntrega: clienteObj?.calle || prev.calleEntrega,
      alturaEntrega: clienteObj?.altura || prev.alturaEntrega,
      localidadEntrega: clienteObj?.localidad || prev.localidadEntrega,
      descuentoAplicado: presupuesto.descuentoPorcentaje || 0,
      señaExigida: presupuesto.adelanto50Requerido || 0,
      señaPagada: presupuesto.adelanto50Requerido || 0,
      estadoPago: presupuesto.adelanto50Requerido > 0 ? 'Seña 50% Pagada' : 'Pendiente',
      observaciones: `Generado a partir del Presupuesto ${presupuesto.nroPresupuesto} (${presupuesto.tipoPedido}). ${presupuesto.observaciones || ''}`,
      items: mappedItems,
    }));
  };

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

  // Crear Cliente Rápido desde Formulario de Pedidos
  const handleSaveQuickCliente = () => {
    if (!quickClienteData.razonSocial || !quickClienteData.cuit) return;
    const newId = clientesList.length > 0 ? Math.max(...clientesList.map((c) => c.idCliente)) + 1 : 1;
    const newCliente = { ...quickClienteData, idCliente: newId };
    
    setClientesList((prev) => [...prev, newCliente]);
    setFormData((prev) => ({
      ...prev,
      idCliente: newId,
      telefonoPedido: newCliente.telefono || prev.telefonoPedido,
      calleEntrega: newCliente.calle || prev.calleEntrega,
      alturaEntrega: newCliente.altura || prev.alturaEntrega,
      localidadEntrega: newCliente.localidad || prev.localidadEntrega,
    }));
    setOpenQuickClienteModal(false);
  };

  const handleSave = () => {
    const clienteObj = clientesList.find((c) => c.idCliente === formData.idCliente);
    
    // Regla TP: Bloqueo de cliente moroso para ventas a crédito
    if (morosidadCalculada.esMoroso && formData.estadoPago.includes('Cuenta Corriente')) {
      alert(`¡VENTA A CRÉDITO BLOQUEADA! El cliente ${clienteObj?.razonSocial} ha sido detectado como MOROSO (${morosidadCalculada.razon}). Solo se permite pago de contado o en efectivo.`);
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

      {/* Tabla de Pedidos */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflowX: 'auto', width: '100%' }}>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nro Pedido</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo de Pedido</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Domicilio Entrega</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Entrega</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Total ($)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado Pago</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado Pedido</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
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
                  <TableCell>{pedido.calleEntrega ? `${pedido.calleEntrega} ${pedido.alturaEntrega || ''}` : 'Retiro en Local'}</TableCell>
                  <TableCell>{pedido.fechaEntregaEstimada} {pedido.horaEntregaEstimada ? `(${pedido.horaEntregaEstimada}hs)` : ''}</TableCell>
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

      {/* Modal Formulario Estructurado de Pedidos estilo Voucher / Comprobante */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBagOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {isEditing ? `Editar Pedido ${formData.nroPedido}` : formData.esCanje ? 'Registrar Canje por Reclamo ($0)' : formData.esDonacion ? 'Registrar Donación ($0)' : 'Formulario de Pedido de Venta'}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenForm(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh', overflowY: 'auto', p: { xs: 1.5, sm: 2.5 } }}>
          {/* Alerta de morosidad */}
          {morosidadCalculada.esMoroso && (
            <Box sx={{ mb: 2 }}>
              <ClienteMorosoAlert cliente={selectedClienteForm} comprobantesVenta={INITIAL_COMPROBANTES_VENTA} />
            </Box>
          )}

          {/* Selector Opcional de Presupuesto */}
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: '8px',
              borderColor: (theme) => formData.idPresupuestoCliente ? theme.palette.primary.main : theme.palette.divider,
              bgcolor: (theme) =>
                formData.idPresupuestoCliente
                  ? theme.palette.mode === 'dark' ? 'rgba(0,146,70,0.12)' : '#f0fbf4'
                  : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fafafa',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DescriptionOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Cargar Datos desde Presupuesto de Origen (Opcional)
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Seleccionar Presupuesto de Origen</InputLabel>
              <Select
                value={formData.idPresupuestoCliente || ''}
                label="Seleccionar Presupuesto de Origen"
                onChange={(e) => handleSelectPresupuesto(e.target.value)}
              >
                <MenuItem value="">
                  <em>-- Ninguno (Creación manual desde cero) --</em>
                </MenuItem>
                {INITIAL_PRESUPUESTOS.map((p) => (
                  <MenuItem key={p.idPresupuestoCliente} value={p.idPresupuestoCliente}>
                    {p.nroPresupuesto} - {p.clienteNombre} ({p.tipoPedido} - Total: ${p.total.toLocaleString()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* CONTENEDOR DOCUMENTO VOUCHER ESTILO REFERENCIA */}
          <ComprobanteDocumentWrapper
            tipoDocTitle={formData.esCanje ? 'Canje Reclamo' : formData.esDonacion ? 'Donación' : 'Pedido de Venta'}
            nroDocumento={formData.nroPedido || 'PED-2026-0001'}
            headerGrid={
              <Grid container spacing={0} sx={{ borderCollapse: 'collapse' }}>
                {/* Fila 1: Cliente & Fecha */}
                <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Cliente:</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                    <FormControl fullWidth size="small" disabled={Boolean(formData.idPresupuestoCliente)}>
                      <InputLabel>Seleccionar Cliente</InputLabel>
                      <Select
                        value={formData.idCliente}
                        label="Seleccionar Cliente"
                        disabled={Boolean(formData.idPresupuestoCliente)}
                        onChange={(e) => {
                          const c = clientesList.find((item) => item.idCliente === e.target.value);
                          setFormData({
                            ...formData,
                            idCliente: e.target.value,
                            telefonoPedido: c?.telefono || formData.telefonoPedido,
                            calleEntrega: c?.calle || formData.calleEntrega,
                            alturaEntrega: c?.altura || formData.alturaEntrega,
                            localidadEntrega: c?.localidad || formData.localidadEntrega,
                          });
                        }}
                      >
                        {clientesList.map((c) => (
                          <MenuItem key={c.idCliente} value={c.idCliente}>
                            {c.razonSocial} ({c.cuit})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      disabled={Boolean(formData.idPresupuestoCliente)}
                      startIcon={<PersonAddIcon />}
                      onClick={() => {
                        setQuickClienteData(initialQuickClienteData);
                        setOpenQuickClienteModal(true);
                      }}
                      sx={{ whiteSpace: 'nowrap', fontWeight: 700, height: 40, px: 1, flexShrink: 0 }}
                    >
                      + Cliente
                    </Button>
                  </Box>
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

                {/* Fila 2: Dirección & Teléfono */}
                <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Dirección de Entrega:</Typography>
                  <Grid container spacing={1} sx={{ mt: 0.2 }}>
                    <Grid item xs={7}>
                      <TextField size="small" placeholder="Calle" fullWidth value={formData.calleEntrega || ''} onChange={(e) => setFormData({ ...formData, calleEntrega: e.target.value })} />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField size="small" placeholder="Altura / Nro" fullWidth value={formData.alturaEntrega || ''} onChange={(e) => setFormData({ ...formData, alturaEntrega: e.target.value })} />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={5} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Teléfono:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    placeholder="Ej. (02392) 43-9901"
                    value={formData.telefonoPedido || ''}
                    onChange={(e) => setFormData({ ...formData, telefonoPedido: e.target.value })}
                  />
                </Grid>

                {/* Fila 3: Para Despachar a & Hora / Vencimiento */}
                <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' } }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Para despachar a / Destino:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    value={formData.domicilioEntrega || ''}
                    onChange={(e) => setFormData({ ...formData, domicilioEntrega: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} md={5} sx={{ p: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Hora de Entrega:</Typography>
                  <TextField
                    type="time"
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    InputLabelProps={{ shrink: true }}
                    value={formData.horaEntregaEstimada || ''}
                    onChange={(e) => setFormData({ ...formData, horaEntregaEstimada: e.target.value })}
                  />
                </Grid>
              </Grid>
            }
            itemsTitle="Por favor suministrar lo siguiente"
            itemsTable={
              <DetalleItemsVentasTable
                items={formData.items || []}
                onChangeItems={(newItems) => setFormData({ ...formData, items: newItems })}
                esCanjeOReclamo={formData.esCanje || formData.esDonacion}
              />
            }
            footerGrid={
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Fecha de despacho:</Typography>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    InputLabelProps={{ shrink: true }}
                    value={formData.fechaEntregaEstimada || ''}
                    onChange={(e) => setFormData({ ...formData, fechaEntregaEstimada: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Vendedor:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    value={formData.vendedor || ''}
                    onChange={(e) => setFormData({ ...formData, vendedor: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Forma de pago:</Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                    <Select value={formData.estadoPago} onChange={(e) => setFormData({ ...formData, estadoPago: e.target.value })}>
                      <MenuItem value="Pendiente">Pendiente</MenuItem>
                      <MenuItem value="Pendiente Cuenta Corriente">Cuenta Corriente</MenuItem>
                      <MenuItem value="Seña 50% Pagada">Seña 50% Pagada</MenuItem>
                      <MenuItem value="Saldado 100%">Contado / Saldado 100%</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            }
            observacionesInput={
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Observaciones:</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  sx={{ mt: 0.5 }}
                  placeholder="Notas adicionales para despacho o facturación..."
                  value={formData.observaciones || ''}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </Box>
            }
            totalLabel="Valor total del pedido:"
            totalAmount={totalForm}
            extraTotals={
              formData.descuentoAplicado > 0 ? (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Subtotal: ${subtotalForm.toLocaleString()}</Typography>
                  <Typography variant="caption" color="error" display="block">Desc. ({formData.descuentoAplicado}%): -${((subtotalForm * formData.descuentoAplicado) / 100).toLocaleString()}</Typography>
                </Box>
              ) : null
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenForm(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} sx={{ px: 3, fontWeight: 700 }}>
            {isEditing ? 'Guardar Cambios' : 'Guardar Pedido'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Alta Rápida de Nuevo Cliente desde Pedidos */}
      <Dialog open={openQuickClienteModal} onClose={() => setOpenQuickClienteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Crear Nuevo Cliente Rápido</Typography>
          </Box>
          <IconButton onClick={() => setOpenQuickClienteModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <TextField
                label="Razón Social / Nombre"
                fullWidth
                required
                size="small"
                value={quickClienteData.razonSocial}
                onChange={(e) => setQuickClienteData({ ...quickClienteData, razonSocial: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="CUIT / DNI"
                fullWidth
                required
                size="small"
                value={quickClienteData.cuit}
                onChange={(e) => setQuickClienteData({ ...quickClienteData, cuit: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Persona de Contacto"
                fullWidth
                size="small"
                value={quickClienteData.responsable}
                onChange={(e) => setQuickClienteData({ ...quickClienteData, responsable: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                fullWidth
                size="small"
                value={quickClienteData.telefono}
                onChange={(e) => setQuickClienteData({ ...quickClienteData, telefono: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Cliente</InputLabel>
                <Select
                  value={quickClienteData.tipoCliente}
                  label="Tipo de Cliente"
                  onChange={(e) => setQuickClienteData({ ...quickClienteData, tipoCliente: e.target.value })}
                >
                  <MenuItem value="Mayorista (Restaurante / Semanal)">Mayorista (Restaurante / Semanal)</MenuItem>
                  <MenuItem value="Mayorista (Supermercado / Fijo Semanal)">Mayorista (Supermercado)</MenuItem>
                  <MenuItem value="Minorista / Frecuente">Minorista / Frecuente</MenuItem>
                  <MenuItem value="Minorista (Mostrador)">Minorista (Mostrador)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Localidad"
                fullWidth
                size="small"
                value={quickClienteData.localidad}
                onChange={(e) => setQuickClienteData({ ...quickClienteData, localidad: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenQuickClienteModal(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSaveQuickCliente} sx={{ fontWeight: 700 }}>
            Guardar y Seleccionar
          </Button>
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

      {/* Modal Vista Previa Documento Pedido */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Vista Previa Comprobante Pedido #{selectedPedido?.nroPedido}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2.5 } }}>
          {selectedPedido && (
            <ComprobanteDocumentWrapper
              tipoDocTitle="Pedido"
              nroDocumento={selectedPedido.nroPedido}
              headerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>CLIENTE:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{selectedPedido.clienteNombre}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>FECHA EMISIÓN:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPedido.fechaEmision}</Typography>
                  </Grid>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>DIRECCIÓN:</Typography>
                    <Typography variant="body2">{selectedPedido.calleEntrega ? `${selectedPedido.calleEntrega} ${selectedPedido.alturaEntrega || ''}, ${selectedPedido.localidadEntrega || 'Trenque Lauquen'}` : 'Retiro en Local'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>TELÉFONO:</Typography>
                    <Typography variant="body2">{selectedPedido.telefonoPedido || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>PARA DESPACHAR A:</Typography>
                    <Typography variant="body2">{selectedPedido.domicilioEntrega || selectedPedido.calleEntrega || 'Retiro en Local'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>HORA:</Typography>
                    <Typography variant="body2">{selectedPedido.horaEntregaEstimada ? `${selectedPedido.horaEntregaEstimada}hs` : '-'}</Typography>
                  </Grid>
                </Grid>
              }
              itemsTitle="Por favor suministrar lo siguiente"
              itemsTable={
                <DetalleItemsVentasTable items={selectedPedido.items || []} readOnly esCanjeOReclamo={selectedPedido.esCanje} />
              }
              footerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>FECHA DE DESPACHO:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedPedido.fechaEntregaEstimada || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>VENDEDOR:</Typography>
                    <Typography variant="body2">{selectedPedido.vendedor || 'Atención en Mostrador'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>FORMA DE PAGO:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{selectedPedido.estadoPago}</Typography>
                  </Grid>
                </Grid>
              }
              observacionesInput={
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>OBSERVACIONES:</Typography>
                  <Typography variant="body2">{selectedPedido.observaciones || 'Sin observaciones.'}</Typography>
                </Box>
              }
              totalLabel="Valor total del pedido:"
              totalAmount={selectedPedido.total}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => window.print()}>Imprimir Comprobante</Button>
          <Button variant="outlined" onClick={() => setOpenDetail(false)}>Cerrar</Button>
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
