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
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import {
  INITIAL_FACTURAS,
  INITIAL_REMITOS,
  INITIAL_COMPROBANTES_PAGO,
  INITIAL_PROVEEDORES,
  INITIAL_ORDENES_COMPRA,
} from './mockData';

export const FacturasRemitosScreen = () => {
  const [currentTab, setCurrentTab] = useState(0);

  // Estados de datos en memoria
  const [facturas, setFacturas] = useState(INITIAL_FACTURAS);
  const [remitos, setRemitos] = useState(INITIAL_REMITOS);
  const [pagos, setPagos] = useState(INITIAL_COMPROBANTES_PAGO);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openNewFactura, setOpenNewFactura] = useState(false);
  const [openNewRemito, setOpenNewRemito] = useState(false);
  const [openPagarFactura, setOpenPagarFactura] = useState(false);

  // Selecciones
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailType, setDetailType] = useState('factura'); // 'factura', 'remito', 'pago'

  // Forms
  const [facturaForm, setFacturaForm] = useState({
    id: '',
    ordenCompraId: 'OC-2026-0102',
    proveedorId: 2,
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    condicionPago: 'Contado Contra Entrega',
    netoGravado: 809917,
    iva21: 170083,
    total: 980000,
    estado: 'Pendiente de Pago',
  });

  const [remitoForm, setRemitoForm] = useState({
    id: '',
    ordenCompraId: 'OC-2026-0102',
    proveedorId: 2,
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaEntregaReal: new Date().toISOString().split('T')[0],
    recepcionista: 'Juan Borlini (Jefe de Planta)',
    estado: 'Recibido Conforme',
    observaciones: 'Control visual y de peso verificado al ingresar a depósito.',
  });

  const [pagoForm, setPagoForm] = useState({
    medioPago: 'Transferencia Bancaria',
    banco: 'Banco de la Provincia de Buenos Aires',
    nroTransaccion: 'TRX-894102',
    observaciones: 'Liquidación de compra de insumos de producción.',
  });

  // Filtrado de Facturas
  const filteredFacturas = useMemo(() => {
    return facturas.filter((f) => {
      const match =
        f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.ordenCompraId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'TODOS' || f.estado === statusFilter;
      return match && matchStatus;
    });
  }, [facturas, searchTerm, statusFilter]);

  // Filtrado de Remitos
  const filteredRemitos = useMemo(() => {
    return remitos.filter((r) => {
      const match =
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ordenCompraId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'TODOS' || r.estado === statusFilter;
      return match && matchStatus;
    });
  }, [remitos, searchTerm, statusFilter]);

  // Filtrado de Pagos
  const filteredPagos = useMemo(() => {
    return pagos.filter((p) => {
      const match =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.facturaId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'TODOS' || p.estado === statusFilter;
      return match && matchStatus;
    });
  }, [pagos, searchTerm, statusFilter]);

  // Handlers para detalles
  const handleOpenDetail = (item, type) => {
    setSelectedItem(item);
    setDetailType(type);
    setOpenDetail(true);
  };

  // Crear Factura
  const handleSaveFactura = (e) => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find((p) => p.id === Number(facturaForm.proveedorId));
    const neto = Number(facturaForm.netoGravado);
    const iva = Math.round(neto * 0.21);
    const total = neto + iva;

    const newFactura = {
      id: facturaForm.id || `FC-A-000${facturas.length + 1}-0000${Math.floor(1000 + Math.random() * 9000)}`,
      ordenCompraId: facturaForm.ordenCompraId,
      proveedorId: prov?.id || 1,
      proveedorNombre: prov?.razonSocial || 'Proveedor S.A.',
      cuit: prov?.cuit || '30-00000000-0',
      fechaEmision: facturaForm.fechaEmision,
      fechaVencimiento: facturaForm.fechaVencimiento || '2026-04-15',
      condicionPago: facturaForm.condicionPago,
      netoGravado: neto,
      iva21: iva,
      total,
      estado: facturaForm.estado,
      comprobantePagoId: null,
    };

    setFacturas((prev) => [newFactura, ...prev]);
    setOpenNewFactura(false);
  };

  // Crear Remito
  const handleSaveRemito = (e) => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find((p) => p.id === Number(remitoForm.proveedorId));
    const newRemito = {
      id: remitoForm.id || `REM-000${remitos.length + 1}-0000${Math.floor(1000 + Math.random() * 9000)}`,
      ordenCompraId: remitoForm.ordenCompraId,
      proveedorId: prov?.id || 1,
      proveedorNombre: prov?.razonSocial || 'Proveedor S.A.',
      fechaEmision: remitoForm.fechaEmision,
      fechaEntregaReal: remitoForm.fechaEntregaReal,
      recepcionista: remitoForm.recepcionista,
      estado: remitoForm.estado,
      observaciones: remitoForm.observaciones,
      items: [
        { materiaPrima: 'Insumos verificados según orden de compra', cantidadRecibida: 1, unidad: 'Lote', conforme: true },
      ],
    };

    setRemitos((prev) => [newRemito, ...prev]);
    setOpenNewRemito(false);
  };

  // Registrar Pago a Factura
  const handleOpenPagar = (factura) => {
    setSelectedItem(factura);
    setOpenPagarFactura(true);
  };

  const handleConfirmarPago = () => {
    if (!selectedItem) return;

    const nextPagoId = `OP-2026-00${pagos.length + 50}`;
    const newPago = {
      id: nextPagoId,
      facturaId: selectedItem.id,
      proveedorId: selectedItem.proveedorId,
      proveedorNombre: selectedItem.proveedorNombre,
      fechaEmision: new Date().toISOString().split('T')[0],
      medioPago: pagoForm.medioPago,
      nroTransaccion: pagoForm.nroTransaccion,
      banco: pagoForm.banco,
      total: selectedItem.total,
      estado: 'Conciliado',
      observaciones: pagoForm.observaciones,
    };

    // Actualizar factura a Pagada
    setFacturas((prev) =>
      prev.map((f) =>
        f.id === selectedItem.id
          ? { ...f, estado: 'Pagada', comprobantePagoId: nextPagoId }
          : f
      )
    );

    // Agregar comprobante de pago
    setPagos((prev) => [newPago, ...prev]);
    setOpenPagarFactura(false);
  };

  return (
    <Box>
      {/* Pestañas Superiores */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          mb: 3,
          bgcolor: 'transparent',
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(e, val) => {
            setCurrentTab(val);
            setStatusFilter('TODOS');
            setSearchTerm('');
          }}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              minHeight: 48,
            },
          }}
        >
          <Tab icon={<ReceiptLongIcon />} iconPosition="start" label={`Facturas Proveedores (${facturas.length})`} />
          <Tab icon={<LocalShippingIcon />} iconPosition="start" label={`Remitos de Entrega (${remitos.length})`} />
          <Tab icon={<PaymentIcon />} iconPosition="start" label={`Comprobantes de Pago (${pagos.length})`} />
        </Tabs>
      </Paper>

      {/* Contenido Pestaña 0: Facturas */}
      {currentTab === 0 && (
        <Box>
          {/* Métricas de Facturación */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={4}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Total Facturado
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                  ${facturas.reduce((a, b) => a + (b.estado !== 'Anulada' ? b.total : 0), 0).toLocaleString('es-AR')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Pendiente de Cancelación
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: 'warning.main' }}>
                  ${facturas.filter((f) => f.estado === 'Pendiente de Pago').reduce((a, b) => a + b.total, 0).toLocaleString('es-AR')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Facturas Pagadas
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: 'success.main' }}>
                  {facturas.filter((f) => f.estado === 'Pagada').length} de {facturas.length} comprobantes
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Filtros y Acción */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, minWidth: 260 }}>
              <TextField
                size="small"
                placeholder="Buscar por Nº Factura, Proveedor o OC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: '100%', sm: 300 }, bgcolor: 'background.paper' }}
              />
              <FormControl size="small" sx={{ minWidth: 180, bgcolor: 'background.paper' }}>
                <InputLabel>Estado de Pago</InputLabel>
                <Select value={statusFilter} label="Estado de Pago" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="Pendiente de Pago">Pendiente de Pago</MenuItem>
                  <MenuItem value="Pagada">Pagada</MenuItem>
                  <MenuItem value="Anulada">Anulada</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewFactura(true)}
            >
              Registrar Factura
            </Button>
          </Box>

          {/* Tabla de Facturas */}
          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Nº Comprobante</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Proveedor & CUIT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Orden Compra</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Emisión / Vto</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Neto / IVA</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFacturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      <Typography variant="body2">No se encontraron facturas</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFacturas.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                        {row.id}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.proveedorNombre}</Typography>
                        <Typography variant="caption" color="text.secondary">CUIT: {row.cuit}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={row.ordenCompraId} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>Emisión: {row.fechaEmision}</Typography>
                        <Typography variant="caption" color="text.secondary">Vence: {row.fechaVencimiento}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'block' }}>Neto: ${row.netoGravado.toLocaleString('es-AR')}</Typography>
                        <Typography variant="caption" color="text.secondary">IVA (21%): ${row.iva21.toLocaleString('es-AR')}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>
                        ${row.total.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.estado}
                          size="small"
                          color={row.estado === 'Pagada' ? 'success' : row.estado === 'Pendiente de Pago' ? 'warning' : 'error'}
                          sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver factura completa">
                          <IconButton size="small" onClick={() => handleOpenDetail(row, 'factura')} sx={{ color: 'text.secondary' }}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {row.estado === 'Pendiente de Pago' && (
                          <Tooltip title="Registrar pago al proveedor">
                            <IconButton size="small" onClick={() => handleOpenPagar(row)} sx={{ color: 'success.main' }}>
                              <PaymentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Contenido Pestaña 1: Remitos de Entrega */}
      {currentTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, minWidth: 260 }}>
              <TextField
                size="small"
                placeholder="Buscar por Nº Remito, Proveedor o Recepcionista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: '100%', sm: 300 }, bgcolor: 'background.paper' }}
              />
              <FormControl size="small" sx={{ minWidth: 180, bgcolor: 'background.paper' }}>
                <InputLabel>Estado de Recepción</InputLabel>
                <Select value={statusFilter} label="Estado de Recepción" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="Recibido Conforme">Recibido Conforme</MenuItem>
                  <MenuItem value="Con Observaciones">Con Observaciones</MenuItem>
                  <MenuItem value="Rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewRemito(true)}
            >
              Registrar Remito de Entrega
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Nº Remito</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Proveedor</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Orden Compra</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha Recepción</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Recepcionista (Planta)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado de Carga</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRemitos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      <Typography variant="body2">No se encontraron remitos</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRemitos.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                        {row.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.proveedorNombre}</TableCell>
                      <TableCell>
                        <Chip label={row.ordenCompraId} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
                      </TableCell>
                      <TableCell>{row.fechaEntregaReal}</TableCell>
                      <TableCell>{row.recepcionista}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.estado}
                          size="small"
                          color={row.estado === 'Recibido Conforme' ? 'success' : row.estado === 'Con Observaciones' ? 'warning' : 'error'}
                          sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalle de remito y mercadería">
                          <IconButton size="small" onClick={() => handleOpenDetail(row, 'remito')} sx={{ color: 'text.secondary' }}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Contenido Pestaña 2: Comprobantes de Pago a Proveedores */}
      {currentTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, minWidth: 260 }}>
              <TextField
                size="small"
                placeholder="Buscar por Nº Pago, Proveedor o Factura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: '100%', sm: 300 }, bgcolor: 'background.paper' }}
              />
            </Box>
          </Box>

          <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Nº Orden de Pago</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Proveedor</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Factura Cancelada</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha Pago</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Medio de Pago</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Abonado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPagos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      <Typography variant="body2">No se encontraron comprobantes de pago</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPagos.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                        {row.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.proveedorNombre}</TableCell>
                      <TableCell>
                        <Chip label={row.facturaId} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
                      </TableCell>
                      <TableCell>{row.fechaEmision}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.medioPago}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.nroTransaccion}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'success.main' }}>
                        ${row.total.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        <Chip label={row.estado} size="small" color="success" sx={{ fontWeight: 600, fontSize: '0.72rem' }} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver recibo de pago">
                          <IconButton size="small" onClick={() => handleOpenDetail(row, 'pago')} sx={{ color: 'text.secondary' }}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Modal Dialog: Registrar Factura */}
      <Dialog open={openNewFactura} onClose={() => setOpenNewFactura(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <form onSubmit={handleSaveFactura}>
          <DialogTitle sx={{ fontWeight: 700 }}>Registrar Factura de Compra de Proveedor</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nº de Factura Oficial"
                  placeholder="FC-A-0001-0000XXXX"
                  value={facturaForm.id}
                  onChange={(e) => setFacturaForm({ ...facturaForm, id: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Proveedor Emisor</InputLabel>
                  <Select
                    value={facturaForm.proveedorId}
                    label="Proveedor Emisor"
                    onChange={(e) => setFacturaForm({ ...facturaForm, proveedorId: e.target.value })}
                  >
                    {INITIAL_PROVEEDORES.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.razonSocial}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Orden de Compra Vinculada</InputLabel>
                  <Select
                    value={facturaForm.ordenCompraId}
                    label="Orden de Compra Vinculada"
                    onChange={(e) => setFacturaForm({ ...facturaForm, ordenCompraId: e.target.value })}
                  >
                    {INITIAL_ORDENES_COMPRA.map((o) => (
                      <MenuItem key={o.id} value={o.id}>{o.id} - {o.proveedorNombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Emisión"
                  type="date"
                  value={facturaForm.fechaEmision}
                  onChange={(e) => setFacturaForm({ ...facturaForm, fechaEmision: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Vencimiento"
                  type="date"
                  value={facturaForm.fechaVencimiento}
                  onChange={(e) => setFacturaForm({ ...facturaForm, fechaVencimiento: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Neto Gravado ($)"
                  type="number"
                  value={facturaForm.netoGravado}
                  onChange={(e) => setFacturaForm({ ...facturaForm, netoGravado: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Condición Comercial"
                  value={facturaForm.condicionPago}
                  onChange={(e) => setFacturaForm({ ...facturaForm, condicionPago: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenNewFactura(false)} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">Guardar Factura</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Dialog: Registrar Remito */}
      <Dialog open={openNewRemito} onClose={() => setOpenNewRemito(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <form onSubmit={handleSaveRemito}>
          <DialogTitle sx={{ fontWeight: 700 }}>Registrar Remito de Mercadería Recibida</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nº de Remito del Transportista"
                  placeholder="REM-0001-0000XXXX"
                  value={remitoForm.id}
                  onChange={(e) => setRemitoForm({ ...remitoForm, id: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Proveedor</InputLabel>
                  <Select
                    value={remitoForm.proveedorId}
                    label="Proveedor"
                    onChange={(e) => setRemitoForm({ ...remitoForm, proveedorId: e.target.value })}
                  >
                    {INITIAL_PROVEEDORES.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.razonSocial}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Orden de Compra</InputLabel>
                  <Select
                    value={remitoForm.ordenCompraId}
                    label="Orden de Compra"
                    onChange={(e) => setRemitoForm({ ...remitoForm, ordenCompraId: e.target.value })}
                  >
                    {INITIAL_ORDENES_COMPRA.map((o) => (
                      <MenuItem key={o.id} value={o.id}>{o.id} - {o.proveedorNombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Recepcionista Responsable (Planta)"
                  value={remitoForm.recepcionista}
                  onChange={(e) => setRemitoForm({ ...remitoForm, recepcionista: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha de Entrega Real"
                  type="date"
                  value={remitoForm.fechaEntregaReal}
                  onChange={(e) => setRemitoForm({ ...remitoForm, fechaEntregaReal: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado de Conformidad</InputLabel>
                  <Select
                    value={remitoForm.estado}
                    label="Estado de Conformidad"
                    onChange={(e) => setRemitoForm({ ...remitoForm, estado: e.target.value })}
                  >
                    <MenuItem value="Recibido Conforme">Recibido Conforme (Ingresa al Stock)</MenuItem>
                    <MenuItem value="Con Observaciones">Con Observaciones (Faltante / Envase dañado)</MenuItem>
                    <MenuItem value="Rechazado">Rechazado (Pérdida de frío / Vencido)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Observaciones de Descarga y Bromatología"
                  value={remitoForm.observaciones}
                  onChange={(e) => setRemitoForm({ ...remitoForm, observaciones: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenNewRemito(false)} color="inherit">Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">Guardar Remito</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Dialog: Registrar Pago a Factura */}
      <Dialog open={openPagarFactura} onClose={() => setOpenPagarFactura(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Registrar Orden de Pago Proveedor
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '10px' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Factura a Pagar: {selectedItem.id}</Typography>
                <Typography variant="body2" color="text.secondary">Proveedor: {selectedItem.proveedorNombre}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main', mt: 1 }}>
                  Monto a Pagar: ${selectedItem.total.toLocaleString('es-AR')}
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Medio de Pago</InputLabel>
                <Select
                  value={pagoForm.medioPago}
                  label="Medio de Pago"
                  onChange={(e) => setPagoForm({ ...pagoForm, medioPago: e.target.value })}
                >
                  <MenuItem value="Transferencia Bancaria">Transferencia Bancaria (BAPRO)</MenuItem>
                  <MenuItem value="Débito Automático">Débito Automático</MenuItem>
                  <MenuItem value="Efectivo">Efectivo contra Recibo de Mostrador</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="Nº Comprobante / Transacción Bancaria"
                value={pagoForm.nroTransaccion}
                onChange={(e) => setPagoForm({ ...pagoForm, nroTransaccion: e.target.value })}
                required
              />

              <TextField
                fullWidth
                size="small"
                label="Banco u Origen de Fondos"
                value={pagoForm.banco}
                onChange={(e) => setPagoForm({ ...pagoForm, banco: e.target.value })}
              />

              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label="Notas y Conciliación"
                value={pagoForm.observaciones}
                onChange={(e) => setPagoForm({ ...pagoForm, observaciones: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenPagarFactura(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmarPago} variant="contained" color="success">Confirmar y Emitir Pago</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Ver Detalle General */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {detailType === 'factura' && `Detalle de Factura ${selectedItem?.id}`}
          {detailType === 'remito' && `Detalle de Remito ${selectedItem?.id}`}
          {detailType === 'pago' && `Comprobante de Pago ${selectedItem?.id}`}
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Proveedor</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedItem.proveedorNombre}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Fecha</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedItem.fechaEmision || selectedItem.fechaEntregaReal}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Estado</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip label={selectedItem.estado} size="small" color="primary" />
                </Box>
              </Grid>

              {detailType === 'factura' && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Neto Gravado</Typography>
                    <Typography variant="body2">${selectedItem.netoGravado?.toLocaleString('es-AR')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">IVA (21%)</Typography>
                    <Typography variant="body2">${selectedItem.iva21?.toLocaleString('es-AR')}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Monto Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ${selectedItem.total?.toLocaleString('es-AR')}
                    </Typography>
                  </Grid>
                </>
              )}

              {detailType === 'remito' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Recepcionista</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedItem.recepcionista}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Observaciones</Typography>
                    <Typography variant="body2">{selectedItem.observaciones}</Typography>
                  </Grid>
                </>
              )}

              {detailType === 'pago' && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Medio de Pago</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedItem.medioPago}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Nº Transacción</Typography>
                    <Typography variant="body2">{selectedItem.nroTransaccion}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Total Pagado</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>
                      ${selectedItem.total?.toLocaleString('es-AR')}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained" color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacturasRemitosScreen;
