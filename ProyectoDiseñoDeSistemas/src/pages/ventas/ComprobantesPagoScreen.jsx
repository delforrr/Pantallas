import CobroFormScreen from './CobroFormScreen';
import { emisionActual } from './documentoHelpers';
import { useState, useMemo } from 'react';
import { RecordIcon } from '../../components/shared/ModuleUI';
import { Box, Paper, Typography, Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';

import PaidIcon from '@mui/icons-material/Paid';
import PrintIcon from '@mui/icons-material/Print';
import PaymentsIcon from '@mui/icons-material/Payments';

import { INITIAL_COMPROBANTES_PAGO, INITIAL_CLIENTES, INITIAL_PEDIDOS, MEDIOS_DE_PAGO } from './mockData';
import { ComprobanteDocumentWrapper, DetalleItemsVentasTable } from '../../components/ventas';

export const ComprobantesPagoScreen = () => {
  const [pagos, setPagos] = useState(INITIAL_COMPROBANTES_PAGO);
  const [clientesList, setClientesList] = useState(INITIAL_CLIENTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [medioFilter, setMedioFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedPago, setSelectedPago] = useState(null);

  // Form State Normalizado
  const initialFormState = {
    nroComprobantePago: '',
    idCliente: 1,
    idComprobantePedidoCliente: 1,
    idMedioDePagoCliente: 1,
    montoAbonado: 15000,
    concepto: 'Pago Total Venta Mostrador',
    nroTransaccion: 'EF-CAJA-05',
    observaciones: 'Pago en efectivo recibido en caja.',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filtrado
  const filteredPagos = useMemo(() => {
    return pagos.filter((item) => {
      const matchSearch =
        item.nroComprobantePago.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.concepto.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMedio =
        medioFilter === 'TODOS' || item.medioPago.toUpperCase().includes(medioFilter.toUpperCase());

      return matchSearch && matchMedio;
    });
  }, [pagos, searchTerm, medioFilter]);

  // Total Cobrado
  const totalCobrado = useMemo(() => {
    return filteredPagos.reduce((acc, p) => acc + (p.montoAbonado || 0), 0);
  }, [filteredPagos]);

  // Handlers
  const handleOpenNewForm = () => {
    const nextNum = pagos.length + 105;
    const generatedNro = `PAG-2026-00${nextNum}`;
    setFormError('');
    setFormData({ ...initialFormState, ...emisionActual(), nroComprobantePago: generatedNro, idCliente: '', idComprobantePedidoCliente: '', montoAbonado: 0, concepto: '', observaciones: '' });
    setOpenForm(true);
  };

  const handleOpenDetail = (item) => {
    setSelectedPago(item);
    setOpenDetail(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedPago(item);
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
    const pedidoObj = INITIAL_PEDIDOS.find((p) => p.idComprobantePedidoCliente === formData.idComprobantePedidoCliente);
    const medioObj = MEDIOS_DE_PAGO.find((m) => m.idMedioDePagoCliente === formData.idMedioDePagoCliente);
    if (!clienteObj || !medioObj || !formData.concepto.trim() || !Number.isFinite(Number(formData.montoAbonado)) || Number(formData.montoAbonado) <= 0) {
      setFormError('Completá el cliente, el medio de pago, el concepto y un monto mayor a cero.');
      return;
    }
    if (formData.idComprobantePedidoCliente && (!pedidoObj || pedidoObj.idCliente !== formData.idCliente)) {
      setFormError('El pedido debe corresponder al cliente seleccionado.');
      return;
    }

    const payload = {
      ...formData,
      clienteNombre: clienteObj ? clienteObj.razonSocial : 'Cliente General',
      nroPedido: pedidoObj ? pedidoObj.nroPedido : 'VENTA-DIRECTA',
      medioPago: medioObj ? medioObj.descripcion : 'Efectivo',
      ...emisionActual(),
      montoAbonado: parseFloat(formData.montoAbonado) || 0,
    };

    const newId = pagos.length > 0 ? Math.max(...pagos.map((p) => p.idComprobantePagoCliente)) + 1 : 1;
    setPagos((prev) => [...prev, { ...payload, idComprobantePagoCliente: newId }]);
    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setPagos((prev) => prev.filter((p) => p.idComprobantePagoCliente !== selectedPago.idComprobantePagoCliente));
    setOpenDelete(false);
  };

  if (openForm) return <CobroFormScreen datos={formData} clientes={clientesList} onCreateCliente={handleCreateCliente}
    onChange={datos => { setFormData(datos); setFormError(''); }} onSave={handleSave} onCancel={() => setOpenForm(false)} error={formError}  />;

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaidIcon color="primary" fontSize="large" />
            Comprobantes de Pago (Recibos de Cobro)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registro y recepción de cobros a clientes por medios autorizados.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewForm}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 2.5 }}
        >
          Registrar Cobro
        </Button>
      </Box>

      {/* Muestrario de Total Cobrado */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #009246' }} elevation={1}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Total Cobrado Filtrado
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#009246', mt: 0.5 }}>
              ${totalCobrado.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Paper sx={{ p: 2, borderRadius: '14px' }} elevation={1}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PaymentsIcon fontSize="inherit" color="info" /> Medios de Pago Habilitados:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {MEDIOS_DE_PAGO.map((m) => (
                <Chip key={m.idMedioDePagoCliente} label={m.descripcion} color="primary" size="small" variant="outlined" />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Buscador y Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '14px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por Nro Recibo, Cliente o Concepto..."
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
              <InputLabel>Filtrar por Medio de Pago</InputLabel>
              <Select value={medioFilter} label="Filtrar por Medio de Pago" onChange={(e) => setMedioFilter(e.target.value)}>
                <MenuItem value="TODOS">Todos los Medios</MenuItem>
                {MEDIOS_DE_PAGO.map((m) => (
                  <MenuItem key={m.idMedioDePagoCliente} value={m.descripcion.toUpperCase()}>{m.descripcion}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Cobros Normalizada con Scroll Horizontal */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflowX: 'auto', width: '100%' }}>
        <Table sx={{ minWidth: 1400 }}>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nro Recibo Pago</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Pedido Asociado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Factura Imputada</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Medio de Pago</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Emisión</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Hora Emisión</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Concepto Cobro</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nro Transacción / Posnet</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Monto Abonado ($)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPagos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron recibos de pago.
                </TableCell>
              </TableRow>
            ) : (
              filteredPagos.map((item) => (
                <TableRow key={item.idComprobantePagoCliente} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {item.nroComprobantePago}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.clienteNombre}</TableCell>
                  <TableCell><Chip label={item.nroPedido || 'Venta Directa'} size="small" variant="outlined" /></TableCell>
                  <TableCell><Chip label={item.nroFactura || 'Sin Factura'} size="small" color="default" /></TableCell>
                  <TableCell><Chip label={item.medioPago} color="info" size="small" variant="outlined" /></TableCell>
                  <TableCell>{item.fechaEmision}</TableCell>
                  <TableCell>{item.horaEmision || '12:00'}hs</TableCell>
                  <TableCell>{item.concepto}</TableCell>
                  <TableCell>{item.nroTransaccion}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#009246' }}>
                    ${item.montoAbonado.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <RecordIcon label="Ver Recibo Oficial" color="default" onClick={() => handleOpenDetail(item)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </RecordIcon>
                    <RecordIcon label="Anular Recibo" color="error" onClick={() => handleOpenDelete(item)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </RecordIcon>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Vista Previa Documento Recibo */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Recibo de Pago #{selectedPago?.nroComprobantePago}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2.5 } }}>
          {selectedPago && (
            <ComprobanteDocumentWrapper
              tipoDocTitle="Recibo de Pago"
              nroDocumento={selectedPago.nroComprobantePago}
              headerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>CLIENTE PAGADOR:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{selectedPago.clienteNombre}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>FECHA EMISIÓN:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPago.fechaEmision}</Typography>
                  </Grid>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>MEDIO DE PAGO:</Typography>
                    <Chip label={selectedPago.medioPago} color="info" size="small" sx={{ fontWeight: 700, ml: 1 }} />
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>TRANSACCIÓN / TICKET:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedPago.nroTransaccion || '-'}</Typography>
                  </Grid>
                </Grid>
              }
              itemsTitle="Por favor suministrar lo siguiente"
              itemsTable={
                <DetalleItemsVentasTable
                  items={[
                    { idProductoCompuesto: 101, productoNombre: selectedPago.concepto, cantidad: 1, precioUnitario: selectedPago.montoAbonado, subtotal: selectedPago.montoAbonado }
                  ]}
                  readOnly
                />
              }
              footerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>PEDIDO IMPUTADO:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{selectedPago.nroPedido || 'Venta Directa'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ p: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>FACTURA ASOCIADA:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPago.nroFactura || 'Sin Factura Vinculada'}</Typography>
                  </Grid>
                </Grid>
              }
              observacionesInput={
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>OBSERVACIONES:</Typography>
                  <Typography variant="body2">{selectedPago.observaciones || 'Pago registrado conforme.'}</Typography>
                </Box>
              }
              totalLabel="Monto total abonado:"
              totalAmount={selectedPago.montoAbonado}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button startIcon={<PrintIcon />} onClick={() => window.print()}>Imprimir Recibo</Button>
          <Button variant="contained" onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Confirmación Eliminación */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>¿Anular Recibo de Pago?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseas anular el recibo <strong>{selectedPago?.nroComprobantePago}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Anular Recibo</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComprobantesPagoScreen;
