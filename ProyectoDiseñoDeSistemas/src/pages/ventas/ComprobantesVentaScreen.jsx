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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';

import { INITIAL_COMPROBANTES_VENTA, INITIAL_CLIENTES, INITIAL_PEDIDOS } from './mockData';

export const ComprobantesVentaScreen = () => {
  const [comprobantes, setComprobantes] = useState(INITIAL_COMPROBANTES_VENTA);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
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
    setFormData({ ...initialFormState, nroComprobante: generatedNro });
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

  const handleSave = () => {
    const clienteObj = INITIAL_CLIENTES.find((c) => c.idCliente === formData.idCliente);
    const pedidoObj = INITIAL_PEDIDOS.find((p) => p.idComprobantePedidoCliente === formData.idComprobantePedidoCliente);

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

      {/* Tabla */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nro Comprobante</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Pedido Asociado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Neto ($)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>IVA 21% ($)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Total ($)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComprobantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
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
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.clienteNombre}</Typography>
                    <Typography variant="caption" color="text.secondary">CUIT: {item.cuitCliente}</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2">{item.nroPedido}</Typography></TableCell>
                  <TableCell align="right">${item.importeNeto.toLocaleString()}</TableCell>
                  <TableCell align="right">${item.importeIva.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#009246' }}>
                    ${item.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={item.estado} color={item.estado.includes('Pagada') ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Comprobante Fiscal">
                      <IconButton size="small" color="info" onClick={() => handleOpenDetail(item)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Anular Comprobante">
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

      {/* Modal Emisión de Comprobante */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Emitir Comprobante de Venta
          <IconButton onClick={() => setOpenForm(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nro Comprobante" fullWidth size="small" disabled value={formData.nroComprobante} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Comprobante</InputLabel>
                <Select value={formData.tipoComprobante} label="Tipo de Comprobante" onChange={(e) => setFormData({ ...formData, tipoComprobante: e.target.value })}>
                  <MenuItem value="Factura A">Factura A (Resp. Inscripto)</MenuItem>
                  <MenuItem value="Factura B">Factura B (Consumidor Final)</MenuItem>
                  <MenuItem value="Recibo Venta">Recibo de Venta Oficial</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Pedido Asociado</InputLabel>
                <Select value={formData.idComprobantePedidoCliente} label="Pedido Asociado" onChange={(e) => setFormData({ ...formData, idComprobantePedidoCliente: e.target.value })}>
                  {INITIAL_PEDIDOS.map((p) => (
                    <MenuItem key={p.idComprobantePedidoCliente} value={p.idComprobantePedidoCliente}>{p.nroPedido} - {p.clienteNombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Cliente Receptor</InputLabel>
                <Select value={formData.idCliente} label="Cliente Receptor" onChange={(e) => setFormData({ ...formData, idCliente: e.target.value })}>
                  {INITIAL_CLIENTES.map((c) => (
                    <MenuItem key={c.idCliente} value={c.idCliente}>{c.razonSocial}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Monto Total a Facturar ($)"
                type="number"
                fullWidth
                size="small"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Condición de Pago" fullWidth size="small" value={formData.condicionPago} onChange={(e) => setFormData({ ...formData, condicionPago: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Emitir Factura</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Vista Previa Factura Fiscal */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Vista Previa Comprobante Fiscal #{selectedComprobante?.nroComprobante}
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedComprobante && (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #009246', pb: 2, mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#009246' }}>PASTAFAB S.A.</Typography>
                  <Typography variant="caption" display="block">Comprobante de Venta Oficial</Typography>
                </Box>
                <Box align="right">
                  <Chip label={selectedComprobante.tipoComprobante} color="primary" sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedComprobante.nroComprobante}</Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Cliente / Razón Social:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedComprobante.clienteNombre}</Typography>
                  <Typography variant="caption" display="block">CUIT: {selectedComprobante.cuitCliente}</Typography>
                </Grid>
                <Grid item xs={6} align="right">
                  <Typography variant="caption" color="text.secondary">Pedido Asociado:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedComprobante.nroPedido}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
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
