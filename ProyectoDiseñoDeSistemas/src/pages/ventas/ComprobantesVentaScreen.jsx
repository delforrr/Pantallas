import ComprobanteVentaFormScreen from './ComprobanteVentaFormScreen';
import { emisionActual } from './documentoHelpers';
import { useNombreEstado } from '../../context/AppContext';
import { RecordIcon } from '../../components/shared/ModuleUI';
import { useState, useMemo } from 'react';
import { Box, Paper, Typography, Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';

import { INITIAL_COMPROBANTES_VENTA, INITIAL_CLIENTES, INITIAL_PEDIDOS, MEDIOS_DE_PAGO } from './mockData';
import { ComprobanteDocumentWrapper, DetalleItemsVentasTable } from '../../components/ventas';

export const ComprobantesVentaScreen = () => {
  const nombreEstado = useNombreEstado();
  const [comprobantes, setComprobantes] = useState(INITIAL_COMPROBANTES_VENTA);
  const [clientesList, setClientesList] = useState(INITIAL_CLIENTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedComprobante, setSelectedComprobante] = useState(null);

  // Form State Normalizado
  const initialFormState = {
    nroComprobante: '',
    idComprobantePedidoCliente: 1,
    idCliente: 2,
    tipoComprobante: 'Factura A',
    fechaEmision: '2026-09-24',
    horaEmision: '10:00',
    tipoIva: 'Responsable Inscripto',
    total: 220000,
    condicionPago: 'Cuenta Corriente (30 días)',
    estado: 'Pendiente de Cobro',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filtrado
  const filteredComprobantes = useMemo(() => {
    return comprobantes.filter((item) => {
      const matchSearch =
        item.nroComprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nroPedido.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo =
        tipoFilter === 'TODOS' || item.tipoComprobante.toUpperCase().includes(tipoFilter.toUpperCase());

      return matchSearch && matchTipo;
    });
  }, [comprobantes, searchTerm, tipoFilter]);

  // Handlers
  const handleOpenNewForm = () => {
    const nextNum = comprobantes.length + 102;
    const generatedNro = `FAC-A-0001-00000${nextNum}`;
    setFormError('');
    setFormData({ ...initialFormState, ...emisionActual(), nroComprobante: generatedNro, idCliente: '', idComprobantePedidoCliente: '', total: 0, medioPago: MEDIOS_DE_PAGO[0]?.descripcion || '' });
    setOpenForm(true);
  };

  const handleOpenDetail = (item) => {
    setSelectedComprobante(item);
    setOpenDetail(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedComprobante(item);
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
    if (!clienteObj || !Number.isFinite(Number(formData.total)) || Number(formData.total) <= 0 || !MEDIOS_DE_PAGO.some(m => m.descripcion === formData.medioPago)) {
      setFormError('Seleccioná un cliente, un medio de pago y un importe mayor a cero.');
      return;
    }
    if (formData.idComprobantePedidoCliente && (!pedidoObj || pedidoObj.idCliente !== formData.idCliente)) {
      setFormError('El pedido debe corresponder al cliente seleccionado.');
      return;
    }

    const totalVal = parseFloat(formData.total) || 0;
    const neto = totalVal / 1.21;
    const iva = totalVal - neto;

    const payload = {
      ...formData,
      clienteNombre: clienteObj ? clienteObj.razonSocial : 'Cliente General',
      cuitCliente: clienteObj ? clienteObj.cuit : '30-00000000-0',
      nroPedido: pedidoObj ? pedidoObj.nroPedido : 'VENTA-DIRECTA',
      importeNeto: parseFloat(neto.toFixed(2)),
      importeIva: parseFloat(iva.toFixed(2)),
      total: totalVal,
    };

    const newId = comprobantes.length > 0 ? Math.max(...comprobantes.map((c) => c.idComprobanteVentaCliente)) + 1 : 1;
    setComprobantes((prev) => [...prev, { ...payload, idComprobanteVentaCliente: newId }]);
    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setComprobantes((prev) => prev.filter((c) => c.idComprobanteVentaCliente !== selectedComprobante.idComprobanteVentaCliente));
    setOpenDelete(false);
  };

  if (openForm) return <ComprobanteVentaFormScreen datos={formData} clientes={clientesList} onCreateCliente={handleCreateCliente}
    onChange={datos => { setFormData(datos); setFormError(''); }} onSave={handleSave} onCancel={() => setOpenForm(false)} error={formError}  />;

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptLongIcon color="primary" fontSize="large" />
            Comprobantes de Venta (Facturación)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Emisión y gestión fiscal de Facturas A, B, C y Recibos Oficiales de Venta vinculados a pedidos.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewForm}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 2.5 }}
        >
          Emitir Factura / Recibo
        </Button>
      </Box>

      {/* Buscador y Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '14px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por Nro Comprobante, Cliente o Nro Pedido..."
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
              <InputLabel>Tipo de Comprobante</InputLabel>
              <Select value={tipoFilter} label="Tipo de Comprobante" onChange={(e) => setTipoFilter(e.target.value)}>
                <MenuItem value="TODOS">Todos los Comprobantes</MenuItem>
                <MenuItem value="FACTURA A">Facturas A</MenuItem>
                <MenuItem value="FACTURA B">Facturas B</MenuItem>
                <MenuItem value="RECIBO">Recibos de Venta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de comprobantes */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflowX: 'auto', width: '100%' }}>
        <Table sx={{
          width: '100%',
          tableLayout: 'fixed',
          '& .MuiTableCell-root': {
            px: 1.5,
            py: 2,
            textAlign: 'center',
            verticalAlign: 'middle',
            overflowWrap: 'anywhere',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            whiteSpace: 'normal',
            overflowWrap: 'normal',
            textWrap: 'balance',
          },
          '& .MuiTableCell-root:last-child': { width: 112 },
          '& .MuiChip-root': { maxWidth: '100%', height: 'auto', minHeight: 24 },
          '& .MuiChip-label': { whiteSpace: 'normal', overflowWrap: 'anywhere', py: 0.5 },
        }}>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nro Comprobante</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo Comprobante</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CUIT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Pedido Asociado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha Emisión</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Total ($)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Condición Pago</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComprobantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron comprobantes emitidos.
                </TableCell>
              </TableRow>
            ) : (
              filteredComprobantes.map((item) => (
                <TableRow key={item.idComprobanteVentaCliente} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {item.nroComprobante}
                  </TableCell>
                  <TableCell><Chip label={item.tipoComprobante} size="small" variant="outlined" /></TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.clienteNombre}</TableCell>
                  <TableCell>{item.cuitCliente}</TableCell>
                  <TableCell><Typography variant="body2">{item.nroPedido}</Typography></TableCell>
                  <TableCell>{item.fechaEmision}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#009246' }}>
                    ${item.total.toLocaleString()}
                  </TableCell>
                  <TableCell><Typography variant="body2">{item.condicionPago}</Typography></TableCell>
                  <TableCell>
                    <Chip label={item.estado === 'Pendiente de Cobro' ? 'Pendiente' : nombreEstado(item.estado)} color={item.estado.includes('Pagada') ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <RecordIcon label="Ver Comprobante Fiscal" color="default" onClick={() => handleOpenDetail(item)}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </RecordIcon>
                    <RecordIcon label="Anular Comprobante" color="error" onClick={() => handleOpenDelete(item)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </RecordIcon>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Vista Previa Documento Factura Fiscal */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Vista Previa Comprobante Fiscal #{selectedComprobante?.nroComprobante}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2.5 } }}>
          {selectedComprobante && (
            <ComprobanteDocumentWrapper
              tipoDocTitle={selectedComprobante.tipoComprobante}
              nroDocumento={selectedComprobante.nroComprobante}
              headerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' }, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>CLIENTE RECEPTOR:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{selectedComprobante.clienteNombre}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary">CUIT: {selectedComprobante.cuitCliente}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>FECHA & HORA:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedComprobante.fechaEmision} ({selectedComprobante.horaEmision}hs)</Typography>
                  </Grid>
                  <Grid item xs={12} md={7} sx={{ p: 1.5, borderRight: { md: '1px solid rgba(128,128,128,0.3)' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>PEDIDO ASOCIADO:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{selectedComprobante.nroPedido}</Typography>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ p: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>CONDICIÓN IVA:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedComprobante.tipoIva}</Typography>
                  </Grid>
                </Grid>
              }
              itemsTitle="Por favor suministrar lo siguiente"
              itemsTable={
                <DetalleItemsVentasTable
                  items={[
                    { idProductoCompuesto: 101, productoNombre: `Items según Pedido ${selectedComprobante.nroPedido}`, cantidad: 1, precioUnitario: selectedComprobante.importeNeto, subtotal: selectedComprobante.importeNeto }
                  ]}
                  readOnly
                />
              }
              footerGrid={
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} sx={{ p: 1.5, borderRight: '1px solid rgba(128,128,128,0.3)', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>CONDICIÓN DE PAGO:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedComprobante.condicionPago}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ p: 1.5, borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>ESTADO FISCAL:</Typography>
                    <Chip label={selectedComprobante.estado === 'Pendiente de Cobro' ? 'Pendiente' : nombreEstado(selectedComprobante.estado)} color={selectedComprobante.estado.includes('Pagada') ? 'success' : 'warning'} size="small" sx={{ fontWeight: 700, ml: 1 }} />
                  </Grid>
                </Grid>
              }
              observacionesInput={
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>DESGLOSE AFIP / FISCAL:</Typography>
                  <Typography variant="caption" display="block">Neto Gravado: ${selectedComprobante.importeNeto.toLocaleString()}</Typography>
                  <Typography variant="caption" display="block">IVA 21%: ${selectedComprobante.importeIva.toLocaleString()}</Typography>
                </Box>
              }
              totalLabel="Valor total del comprobante:"
              totalAmount={selectedComprobante.total}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button startIcon={<PrintIcon />} onClick={() => window.print()}>Imprimir Comprobante</Button>
          <Button variant="contained" onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Confirmación Anulación */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>¿Anular Comprobante de Venta?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseas anular el comprobante <strong>{selectedComprobante?.nroComprobante}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Anular</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComprobantesVentaScreen;
