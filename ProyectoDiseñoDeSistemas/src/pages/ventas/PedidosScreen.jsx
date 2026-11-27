import PedidoFormScreen from './PedidoFormScreen';
import { emisionActual, validarProductos } from './documentoHelpers';
import { nombreCatalogo, opciones } from '../administracion/catalogos';
import { useApp, useNombreEstado } from '../../context/AppContext';
import { RecordIcon } from '../../components/shared/ModuleUI';
import { useState, useMemo } from 'react';
import { Box, Paper, Typography, Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';

import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import { INITIAL_PEDIDOS, INITIAL_CLIENTES, INITIAL_PRESUPUESTOS, MEDIOS_DE_PAGO, INITIAL_COMPROBANTES_VENTA, calcularEstadoMoroso } from './mockData';
import { DetalleItemsVentasTable, ComprobanteDocumentWrapper } from '../../components/ventas';

export const PedidosScreen = () => {
  const nombreEstado = useNombreEstado();
  const { catalogos } = useApp();
  const vendedores = catalogos.empleados.filter(e => e.area === 'Ventas');
  const vendedorInicial = opciones(vendedores)[0];
  const [pedidos, setPedidos] = useState(INITIAL_PEDIDOS);
  const [clientesList, setClientesList] = useState(INITIAL_CLIENTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegistrarPago, setOpenRegistrarPago] = useState(false);

  // Selecciones
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Registrar Pago Form
  const [montoPago, setMontoPago] = useState(0);
  const [idMedioDePagoCliente, setIdMedioDePagoCliente] = useState(1);

  // Form State Inicial Pedido
  const initialFormState = {
    nroPedido: '',
    idPresupuestoCliente: '',
    idCliente: 1,
    tipoPedido: 'Minorista',
    diaEntregaHabitual: 'Lunes',
    domicilioEntrega: 'Retiro en Local Comercial',
    telefonoPedido: '(02392) 43-9901',
    fechaEmision: '2026-09-24',
    fechaEntregaEstimada: '2026-09-25',
    horaEntregaEstimada: '12:00',
    idEmpleado: vendedorInicial?.id ?? '',
    vendedor: vendedorInicial?.nombre ?? '',
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

    let tipoPedidoMapped = 'Mayorista';
    if (presupuesto.tipoPedido.toLowerCase().includes('semanal')) {
      tipoPedidoMapped = 'Semanal';
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
      descuentoAplicado: 10,
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
        tipoPedido: 'Minorista',
        esCanje: true,
        descuentoAplicado: 100,
        observaciones: 'Canje sin costo por reposición de producto en mal estado (Regla TP: Orden $0).',
        items: [{ idDetallePedidoCliente: 1, idProductoCompuesto: 101, productoNombre: 'Sorrentinos Jamón y Queso (Caja 1kg)', cantidad: 1, precioUnitario: 0, subtotal: 0 }],
      });
    } else if (tipoEspecial === 'DONACION') {
      setFormData({
        ...initialFormState,
        nroPedido: generatedNro,
        tipoPedido: 'Donación',
        esDonacion: true,
        descuentoAplicado: 100,
        observaciones: 'Donación documentada de alimentos a institución de caridad.',
        items: [{ idDetallePedidoCliente: 1, idProductoCompuesto: 104, productoNombre: 'Ñoquis de Papa Artesanales (Kg)', cantidad: 5, precioUnitario: 0, subtotal: 0 }],
      });
    } else {
      setFormData({ ...initialFormState, nroPedido: generatedNro });
    }
    setFormData(prev => ({ ...prev, ...emisionActual(), idCliente: '', telefonoPedido: '', items: [], fechaEntregaEstimada: emisionActual().fechaEmision }));
    setFormError('');
    setOpenForm(true);
  };

  const handleOpenEditForm = (item) => {
    setIsEditing(true);
    setSelectedPedido(item);
    setFormData({ ...item, items: item.items.map(i => ({ ...i })), descuentoAplicado: item.esCanje || item.esDonacion ? 100 : ['Mayorista', 'Semanal'].includes(item.tipoPedido) ? 10 : item.descuentoAplicado || 0 });
    setFormError('');
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

  const handleCreateCliente = datos => {
    const cliente = { ...datos, idCliente: Math.max(0, ...clientesList.map(c => c.idCliente)) + 1,
      estado: 'Activo', aceptaCredito: false, limiteCredito: 0, creditoUsado: 0,
      calle: '', altura: '', localidad: '', provincia: '' };
    setClientesList(prev => [...prev, cliente]);
    setFormData(prev => ({ ...prev, idCliente: cliente.idCliente, tipoIva: cliente.tipoIva,
      telefonoPedido: cliente.telefono || '' }));
    setFormError('');
  };

  const handleSave = () => {
    const clienteObj = clientesList.find((c) => c.idCliente === formData.idCliente);
    const minimo = ['Mayorista', 'Semanal'].includes(formData.tipoPedido) ? 10 : 1;
    if (!clienteObj || !validarProductos(formData.items, minimo) || !formData.idEmpleado) {
      setFormError(`Seleccioná un cliente, un vendedor y productos con cantidad mínima de ${minimo}.`);
      return;
    }
    if (!formData.fechaEntregaEstimada || formData.fechaEntregaEstimada < formData.fechaEmision || !formData.horaEntregaEstimada || formData.tipoPedido === 'Semanal' && !formData.diaEntregaHabitual) {
      setFormError('Completá la fecha y hora de entrega y los días del pedido semanal.');
      return;
    }

    const morosidadCalculada = calcularEstadoMoroso(clienteObj, INITIAL_COMPROBANTES_VENTA);
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
      señaExigida: formData.tipoPedido === 'Mayorista' ? totalForm * 0.5 : 0,
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
        return <Chip label={nombreEstado('Finalizado')} color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'En Preparación':
        return <Chip label={nombreEstado('En Preparación')} color="info" size="small" sx={{ fontWeight: 700 }} />;
      case 'Pendiente':
        return <Chip label={nombreEstado('Pendiente')} color="warning" size="small" sx={{ fontWeight: 700 }} />;
      case 'Cancelado':
        return <Chip label={nombreEstado('Cancelado')} color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={nombreEstado(estado)} size="small" />;
    }
  };

  if (openForm) return <PedidoFormScreen datos={formData} clientes={clientesList} onCreateCliente={handleCreateCliente}
    onChange={datos => { setFormData(datos); setFormError(''); }} onSave={handleSave} onCancel={() => setOpenForm(false)} error={formError} isEditing={isEditing} subtotal={subtotalForm} total={totalForm} onSelectPresupuesto={handleSelectPresupuesto} />;

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
                <MenuItem value="PENDIENTE">{nombreEstado('Pendiente')}</MenuItem>
                <MenuItem value="EN PREPARACIÓN">{nombreEstado('En Preparación')}</MenuItem>
                <MenuItem value="FINALIZADO">{nombreEstado('Finalizado')}</MenuItem>
                <MenuItem value="CANCELADO">{nombreEstado('Cancelado')}</MenuItem>
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
                      <RecordIcon label="Registrar Pago / Seña" color="success" onClick={() => handleOpenRegistrarPagoModal(pedido)}>
                        <PriceCheckIcon fontSize="small" />
                      </RecordIcon>
                    )}
                    <RecordIcon label="Ver Detalle" color="default" onClick={() => handleOpenDetail(pedido)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </RecordIcon>
                    <RecordIcon label="Editar Pedido" color="primary" onClick={() => handleOpenEditForm(pedido)}>
                      <EditOutlinedIcon fontSize="small" />
                    </RecordIcon>
                    <RecordIcon label="Eliminar" color="error" onClick={() => handleOpenDelete(pedido)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </RecordIcon>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
                    <Typography variant="body2">{nombreCatalogo(vendedores, selectedPedido.idEmpleado) || selectedPedido.vendedor || 'Atención en Mostrador'}</Typography>
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
