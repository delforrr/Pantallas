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
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { INITIAL_ORDENES_COMPRA, INITIAL_PROVEEDORES, INITIAL_PRESUPUESTOS } from './mockData';

const STATUS_COLOR_MAP = {
  Cumplida: 'success',
  Enviada: 'info',
  'Recibida Parcial': 'warning',
  Pendiente: 'default',
  Cancelada: 'error',
};

export const OrdenCompraScreen = () => {
  const [ordenes, setOrdenes] = useState(INITIAL_ORDENES_COMPRA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialFormState = {
    proveedorId: 1,
    presupuestoId: 'PP-2026-001',
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaEntregaEstimada: '',
    formaPago: 'Transferencia Bancaria a 30 días',
    estado: 'Pendiente',
    observaciones: '',
    itemMateriaPrima: 'Harina 0000 Especial Pastas (bolsa 50kg)',
    itemCantidad: 80,
    itemPrecioUnitario: 32000,
    itemUnidad: 'Bolsas',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filtrado
  const filteredOrdenes = useMemo(() => {
    return ordenes.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.presupuestoId && o.presupuestoId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'TODOS' || o.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [ordenes, searchTerm, statusFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = ordenes.length;
    const enviadas = ordenes.filter((o) => o.estado === 'Enviada').length;
    const cumplidas = ordenes.filter((o) => o.estado === 'Cumplida').length;
    const pendientes = ordenes.filter((o) => o.estado === 'Pendiente' || o.estado === 'Recibida Parcial').length;
    return { total, enviadas, cumplidas, pendientes };
  }, [ordenes]);

  // Acciones
  const handleOpenDetail = (orden) => {
    setSelectedOrden(orden);
    setOpenDetail(true);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setOpenForm(true);
  };

  const handleOpenEdit = (orden) => {
    setIsEditing(true);
    setSelectedOrden(orden);
    setFormData({
      proveedorId: orden.proveedorId,
      presupuestoId: orden.presupuestoId || '',
      fechaEmision: orden.fechaEmision,
      fechaEntregaEstimada: orden.fechaEntregaEstimada,
      formaPago: orden.formaPago,
      estado: orden.estado,
      observaciones: orden.observaciones,
      itemMateriaPrima: orden.items[0]?.materiaPrima || '',
      itemCantidad: orden.items[0]?.cantidad || 1,
      itemPrecioUnitario: orden.items[0]?.precioUnitario || 0,
      itemUnidad: orden.items[0]?.unidad || 'Unidades',
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (orden) => {
    setSelectedOrden(orden);
    setOpenDelete(true);
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
    );
    if (selectedOrden?.id === id) {
      setSelectedOrden((prev) => ({ ...prev, estado: nuevoEstado }));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find((p) => p.id === Number(formData.proveedorId));
    const subtotal = Number(formData.itemCantidad) * Number(formData.itemPrecioUnitario);

    const items = [
      {
        id: 1,
        materiaPrima: formData.itemMateriaPrima,
        unidad: formData.itemUnidad,
        cantidad: Number(formData.itemCantidad),
        precioUnitario: Number(formData.itemPrecioUnitario),
        subtotal,
      },
    ];

    if (isEditing && selectedOrden) {
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id === selectedOrden.id
            ? {
                ...o,
                proveedorId: prov?.id || 1,
                proveedorNombre: prov?.razonSocial || 'Proveedor',
                presupuestoId: formData.presupuestoId || null,
                fechaEmision: formData.fechaEmision,
                fechaEntregaEstimada: formData.fechaEntregaEstimada,
                formaPago: formData.formaPago,
                estado: formData.estado,
                observaciones: formData.observaciones,
                items,
                total: subtotal,
              }
            : o
        )
      );
    } else {
      const nextNum = 100 + ordenes.length + 1;
      const newOrden = {
        id: `OC-2026-0${nextNum}`,
        proveedorId: prov?.id || 1,
        proveedorNombre: prov?.razonSocial || 'Proveedor',
        presupuestoId: formData.presupuestoId || null,
        fechaEmision: formData.fechaEmision,
        fechaEntregaEstimada: formData.fechaEntregaEstimada || '2026-03-25',
        formaPago: formData.formaPago,
        estado: formData.estado,
        observaciones: formData.observaciones,
        items,
        total: subtotal,
      };
      setOrdenes((prev) => [newOrden, ...prev]);
    }
    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setOrdenes((prev) => prev.filter((o) => o.id !== selectedOrden.id));
    setOpenDelete(false);
    setSelectedOrden(null);
  };

  return (
    <Box>
      {/* Tarjetas de Métricas Rápidas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
              <ShoppingCartIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Órdenes
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.total}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'info.main', color: 'white', display: 'flex' }}>
              <LocalShippingIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                En Tránsito / Enviadas
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.enviadas}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'success.main', color: 'white', display: 'flex' }}>
              <AssignmentTurnedInIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Cumplidas / En Planta
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.cumplidas}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'warning.main', color: 'white', display: 'flex' }}>
              <WarningAmberIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Pendientes / Parciales
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.pendientes}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Barra de Filtros y Acción */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, minWidth: 260 }}>
          <TextField
            size="small"
            placeholder="Buscar por Nº Orden, Proveedor o Presupuesto..."
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

          <FormControl size="small" sx={{ minWidth: 170, bgcolor: 'background.paper' }}>
            <InputLabel id="orden-status-filter-label">Estado de Orden</InputLabel>
            <Select
              labelId="orden-status-filter-label"
              value={statusFilter}
              label="Estado de Orden"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los Estados</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Enviada">Enviada</MenuItem>
              <MenuItem value="Recibida Parcial">Recibida Parcial</MenuItem>
              <MenuItem value="Cumplida">Cumplida</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Nueva Orden de Compra
        </Button>
      </Box>

      {/* Tabla de Órdenes de Compra */}
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 720 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nº Orden</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Proveedor</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Presupuesto Vinculado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Emisión / Entrega</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Condición Pago</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrdenes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  <Typography variant="body2">No se encontraron órdenes de compra</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrdenes.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                    {row.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.proveedorNombre}</TableCell>
                  <TableCell>
                    {row.presupuestoId ? (
                      <Chip label={row.presupuestoId} size="small" variant="outlined" color="primary" sx={{ fontFamily: 'monospace' }} />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Compra Directa Local
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                      Emisión: {row.fechaEmision}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Entrega: {row.fechaEntregaEstimada}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{row.formaPago}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>${row.total.toLocaleString('es-AR')}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.estado}
                      size="small"
                      color={STATUS_COLOR_MAP[row.estado] || 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver desglose y materias primas">
                      <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: 'text.secondary' }}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {row.estado === 'Pendiente' && (
                      <Tooltip title="Marcar como Enviada al Proveedor">
                        <IconButton
                          size="small"
                          onClick={() => handleCambiarEstado(row.id, 'Enviada')}
                          sx={{ color: 'info.main' }}
                        >
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(row.estado === 'Enviada' || row.estado === 'Recibida Parcial') && (
                      <Tooltip title="Conformar recepción total (Cumplida)">
                        <IconButton
                          size="small"
                          onClick={() => handleCambiarEstado(row.id, 'Cumplida')}
                          sx={{ color: 'success.main' }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Editar orden">
                      <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'primary.main' }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar orden">
                      <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
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

      {/* Modal Dialog: Detalle de Orden de Compra */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Orden de Compra #{selectedOrden?.id}</span>
          <Chip label={selectedOrden?.estado} size="small" color={STATUS_COLOR_MAP[selectedOrden?.estado] || 'default'} />
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrden && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Proveedor Asignado</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {selectedOrden.proveedorNombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Presupuesto Base: {selectedOrden.presupuestoId || 'Compra Directa Inmediata'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Condición de Pago Acordada</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedOrden.formaPago}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fecha de Entrega Estimada: {selectedOrden.fechaEntregaEstimada}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  DETALLE DE INSUMOS SOLICITADOS
                </Typography>
              </Divider>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Materia Prima / Insumo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Precio Unit.</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrden.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 600 }}>{item.materiaPrima}</TableCell>
                        <TableCell>{item.cantidad} {item.unidad}</TableCell>
                        <TableCell>${item.precioUnitario.toLocaleString('es-AR')}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          ${item.subtotal.toLocaleString('es-AR')}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell colSpan={3} sx={{ fontWeight: 700, textAlign: 'right' }}>
                        MONTO TOTAL DE LA ORDEN:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1rem' }}>
                        ${selectedOrden.total.toLocaleString('es-AR')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedOrden.observaciones && (
                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: '8px' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    Notas de Logística / Recepción:
                  </Typography>
                  <Typography variant="body2">{selectedOrden.observaciones}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {selectedOrden?.estado === 'Pendiente' && (
            <Button
              onClick={() => handleCambiarEstado(selectedOrden.id, 'Enviada')}
              variant="contained"
              color="info"
              startIcon={<SendIcon />}
            >
              Enviar al Proveedor
            </Button>
          )}
          {selectedOrden?.estado === 'Enviada' && (
            <Button
              onClick={() => handleCambiarEstado(selectedOrden.id, 'Cumplida')}
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              Marcar como Cumplida
            </Button>
          )}
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Alta / Edición de Orden de Compra */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <form onSubmit={handleSaveForm}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {isEditing ? `Editar Orden de Compra ${selectedOrden?.id}` : 'Crear Nueva Orden de Compra'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Proveedor</InputLabel>
                  <Select
                    value={formData.proveedorId}
                    label="Proveedor"
                    onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                  >
                    {INITIAL_PROVEEDORES.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.razonSocial}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Presupuesto Aprobado de Referencia</InputLabel>
                  <Select
                    value={formData.presupuestoId}
                    label="Presupuesto Aprobado de Referencia"
                    onChange={(e) => setFormData({ ...formData, presupuestoId: e.target.value })}
                  >
                    <MenuItem value="">Sin presupuesto (Compra Directa Faltante)</MenuItem>
                    {INITIAL_PRESUPUESTOS.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.id} - {p.proveedorNombre} (${p.total.toLocaleString('es-AR')})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha de Emisión"
                  type="date"
                  value={formData.fechaEmision}
                  onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Estimada de Entrega"
                  type="date"
                  value={formData.fechaEntregaEstimada}
                  onChange={(e) => setFormData({ ...formData, fechaEntregaEstimada: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado de la Orden</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado de la Orden"
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="Enviada">Enviada</MenuItem>
                    <MenuItem value="Recibida Parcial">Recibida Parcial</MenuItem>
                    <MenuItem value="Cumplida">Cumplida</MenuItem>
                    <MenuItem value="Cancelada">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Forma de Pago Acordada"
                  placeholder="Ej: Transferencia 30 días, Contado contra entrega, Cuenta Corriente..."
                  value={formData.formaPago}
                  onChange={(e) => setFormData({ ...formData, formaPago: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    MATERIA PRIMA / INSUMO A ORDENAR
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Materia Prima o Insumo"
                  value={formData.itemMateriaPrima}
                  onChange={(e) => setFormData({ ...formData, itemMateriaPrima: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cantidad"
                  type="number"
                  value={formData.itemCantidad}
                  onChange={(e) => setFormData({ ...formData, itemCantidad: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Unidad"
                  value={formData.itemUnidad}
                  onChange={(e) => setFormData({ ...formData, itemUnidad: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Precio Unitario ($)"
                  type="number"
                  value={formData.itemPrecioUnitario}
                  onChange={(e) => setFormData({ ...formData, itemPrecioUnitario: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Instrucciones de Recepción y Control"
                  placeholder="Verificar temperatura en frío, estibar en depósito de secos, etc."
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenForm(false)} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Guardar Cambios' : 'Emitir Orden de Compra'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Dialog: Confirmar Cancelación/Eliminación */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancelar Orden de Compra</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Confirma que desea cancelar o eliminar la orden <strong>{selectedOrden?.id}</strong> a{' '}
            <strong>{selectedOrden?.proveedorNombre}</strong> por valor de $
            {selectedOrden?.total?.toLocaleString('es-AR')}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            Volver
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Confirmar Baja
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdenCompraScreen;
