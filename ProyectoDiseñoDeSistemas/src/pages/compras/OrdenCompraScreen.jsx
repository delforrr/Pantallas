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
  ToggleButtonGroup,
  ToggleButton,
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
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';

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
  const [viewMode, setViewMode] = useState('table');

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
      {/* Tarjetas de Métricas Rápidas - Responsivas con igual ancho apiladas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
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
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'primary.main', color: 'white', display: 'flex', flexShrink: 0 }}>
            <ShoppingCartIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Total Órdenes
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {stats.total}
            </Typography>
          </Box>
        </Paper>

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
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'info.main', color: 'white', display: 'flex', flexShrink: 0 }}>
            <LocalShippingIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              En Tránsito / Enviadas
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
              {stats.enviadas}
            </Typography>
          </Box>
        </Paper>

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
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'success.main', color: 'white', display: 'flex', flexShrink: 0 }}>
            <AssignmentTurnedInIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Cumplidas / En Planta
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
              {stats.cumplidas}
            </Typography>
          </Box>
        </Paper>

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
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'warning.main', color: 'white', display: 'flex', flexShrink: 0 }}>
            <WarningAmberIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Pendientes / Parciales
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {stats.pendientes}
            </Typography>
          </Box>
        </Paper>
      </Box>

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

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => val && setViewMode(val)}
            size="small"
            sx={{ bgcolor: 'background.paper' }}
          >
            <ToggleButton value="table" aria-label="vista tabla">
              <Tooltip title="Vista Tabla">
                <ViewListIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="grid" aria-label="vista cuadrícula">
              <Tooltip title="Vista Cuadrícula / Móvil">
                <ViewModuleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

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
      </Box>

      {/* Vista de Cuadrícula / Tarjetas Responsiva */}
      {viewMode === 'grid' ? (
        filteredOrdenes.length === 0 ? (
          <Paper
            elevation={1}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No se encontraron órdenes de compra con los filtros aplicados.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 2.5,
              alignItems: 'stretch',
            }}
          >
            {filteredOrdenes.map((orden) => (
              <Paper
                key={orden.id}
                elevation={1}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                {/* Cabecera de la Tarjeta */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip
                    label={orden.id}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 800, fontFamily: 'monospace' }}
                  />
                  <Chip
                    label={orden.estado}
                    size="small"
                    color={STATUS_COLOR_MAP[orden.estado] || 'default'}
                    sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                  />
                </Box>

                {/* Proveedor y Presupuesto Referencia */}
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.3, mb: 0.5 }}>
                  {orden.proveedorNombre}
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  {orden.presupuestoId ? (
                    <Chip
                      label={`Ref: ${orden.presupuestoId}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontSize: '0.72rem' }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Compra Directa Local
                    </Typography>
                  )}
                </Box>

                {/* Resumen de Insumos */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    bgcolor: 'action.hover',
                    mb: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    MATERIA PRIMA SOLICITADA:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.3 }}>
                    {orden.items[0]?.materiaPrima || 'Insumos varios'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cantidad: {orden.items[0]?.cantidad} {orden.items[0]?.unidad} · Unit: ${orden.items[0]?.precioUnitario?.toLocaleString('es-AR')}
                  </Typography>
                </Paper>

                {/* Monto Total */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    bgcolor: 'primary.50',
                    border: '1px dashed',
                    borderColor: 'primary.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    TOTAL DE LA ORDEN
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ${orden.total.toLocaleString('es-AR')}
                  </Typography>
                </Box>

                {/* Fechas y Condiciones */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Emisión: {orden.fechaEmision} · Entrega: <strong>{orden.fechaEntregaEstimada}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <PaymentOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Pago: <strong>{orden.formaPago}</strong>
                    </Typography>
                  </Box>
                </Box>

                {/* Acciones al Pie fijadas abajo */}
                <Box
                  sx={{
                    mt: 'auto',
                    pt: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {orden.estado === 'Pendiente' && (
                      <Tooltip title="Marcar como Enviada al Proveedor">
                        <IconButton
                          size="small"
                          onClick={() => handleCambiarEstado(orden.id, 'Enviada')}
                          sx={{ color: 'info.main', bgcolor: 'info.50' }}
                        >
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(orden.estado === 'Enviada' || orden.estado === 'Recibida Parcial') && (
                      <Tooltip title="Conformar recepción total (Cumplida)">
                        <IconButton
                          size="small"
                          onClick={() => handleCambiarEstado(orden.id, 'Cumplida')}
                          sx={{ color: 'success.main', bgcolor: 'success.50' }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Ver desglose y materias primas">
                      <IconButton size="small" onClick={() => handleOpenDetail(orden)} sx={{ color: 'text.secondary' }}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar orden">
                      <IconButton size="small" onClick={() => handleOpenEdit(orden)} sx={{ color: 'primary.main' }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar orden">
                      <IconButton size="small" onClick={() => handleOpenDelete(orden)} sx={{ color: 'error.main' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )
      ) : (
        /* Vista Tabla Estándar */
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
      )}

      {/* Modal Dialog: Detalle de Orden de Compra - UI Estilizada y Prolija */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 2,
              }}
            >
              <ShoppingCartIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Orden de Compra #{selectedOrden?.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Proveedor: {selectedOrden?.proveedorNombre}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={selectedOrden?.estado}
              size="small"
              color={STATUS_COLOR_MAP[selectedOrden?.estado] || 'default'}
              sx={{ fontWeight: 700 }}
            />
            <IconButton onClick={() => setOpenDetail(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {selectedOrden && (
            <>
              {/* Sección 1: Información de Emisión */}
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BusinessIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Condiciones Comerciales y Logística
                  </Typography>
                </Box>
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
                      Fecha Estimada de Entrega: <strong>{selectedOrden.fechaEntregaEstimada}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Fecha de Emisión</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedOrden.fechaEmision}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Desglose de Insumos */}
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ShoppingCartOutlinedIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Insumos Solicitados para Producción
                  </Typography>
                </Box>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Materia Prima / Insumo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Precio Unitario</TableCell>
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
                          TOTAL DE LA ORDEN:
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>
                          ${selectedOrden.total.toLocaleString('es-AR')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {selectedOrden.observaciones && (
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    Instrucciones de Recepción y Control en Planta:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedOrden.observaciones}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
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
          {(selectedOrden?.estado === 'Enviada' || selectedOrden?.estado === 'Recibida Parcial') && (
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

      {/* Modal Dialog: Alta / Edición de Orden de Compra - UI Estilizada y Prolija */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <form onSubmit={handleSaveForm}>
          <DialogTitle
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'action.hover',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 2,
                }}
              >
                <ShoppingCartIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {isEditing ? `Editar Orden · ${selectedOrden?.id}` : 'Crear Nueva Orden de Compra'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Emisión contractual para abastecimiento y control de ingresos a planta
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setOpenForm(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Sección 1: Proveedor y Presupuesto */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BusinessIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  1. Proveedor y Presupuesto de Referencia
                </Typography>
              </Box>
              <Grid container spacing={2}>
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
              </Grid>
            </Paper>

            {/* Sección 2: Fechas y Logística */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EventNoteIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  2. Plazos y Estado de Entrega
                </Typography>
              </Box>
              <Grid container spacing={2}>
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
              </Grid>
            </Paper>

            {/* Sección 3: Insumos Solicitados */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ShoppingCartOutlinedIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  3. Insumos Solicitados e Instrucciones de Recepción
                </Typography>
              </Box>
              <Grid container spacing={2}>
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
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      SUBTOTAL PREVISTO:
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ${(Number(formData.itemCantidad || 0) * Number(formData.itemPrecioUnitario || 0)).toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    label="Instrucciones de Recepción y Control"
                    placeholder="Verificar temperatura en frío, estibar en depósito de secos, inspección bromatológica..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Paper>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
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
        PaperProps={{
          sx: {
            borderRadius: '18px',
            p: 1,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          <span>Cancelar Orden de Compra</span>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Confirma que desea cancelar o eliminar la orden <strong>{selectedOrden?.id}</strong> a{' '}
            <strong>{selectedOrden?.proveedorNombre}</strong> por valor de{' '}
            <strong>${selectedOrden?.total?.toLocaleString('es-AR')}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5 }}>
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
