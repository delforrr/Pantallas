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
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VerifiedIcon from '@mui/icons-material/Verified';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

import { INITIAL_PRESUPUESTOS, INITIAL_PROVEEDORES } from './mockData';

const STATUS_COLOR_MAP = {
  Aprobado: 'success',
  Pendiente: 'warning',
  Rechazado: 'error',
  Vencido: 'default',
};

export const PresupuestoProveedorScreen = () => {
  const [presupuestos, setPresupuestos] = useState(INITIAL_PRESUPUESTOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [tipoFilter, setTipoFilter] = useState('TODOS');

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialFormState = {
    proveedorId: 1,
    fechaEmision: new Date().toISOString().split('T')[0],
    validezHasta: '',
    tipoCompra: 'Semestral (Marzo - Temporada Baja)',
    estado: 'Pendiente',
    calificacion: 'Alta',
    condicionPago: '30 días Fecha Factura',
    observaciones: '',
    itemMateriaPrima: 'Harina 0000 Especial Pastas (bolsa 50kg)',
    itemCantidad: 40,
    itemPrecioUnitario: 32000,
    itemUnidad: 'Bolsas',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filtrado
  const filteredPresupuestos = useMemo(() => {
    return presupuestos.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cuit.includes(searchTerm);

      const matchesStatus = statusFilter === 'TODOS' || p.estado === statusFilter;
      const matchesTipo = tipoFilter === 'TODOS' || p.tipoCompra.includes(tipoFilter);

      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [presupuestos, searchTerm, statusFilter, tipoFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = presupuestos.length;
    const pendientes = presupuestos.filter((p) => p.estado === 'Pendiente').length;
    const aprobados = presupuestos.filter((p) => p.estado === 'Aprobado').length;
    const montoAprobado = presupuestos
      .filter((p) => p.estado === 'Aprobado')
      .reduce((acc, curr) => acc + curr.total, 0);

    return { total, pendientes, aprobados, montoAprobado };
  }, [presupuestos]);

  // Acciones
  const handleOpenDetail = (item) => {
    setSelectedPresupuesto(item);
    setOpenDetail(true);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setOpenForm(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setSelectedPresupuesto(item);
    setFormData({
      proveedorId: item.proveedorId,
      fechaEmision: item.fechaEmision,
      validezHasta: item.validezHasta,
      tipoCompra: item.tipoCompra,
      estado: item.estado,
      calificacion: item.calificacion,
      condicionPago: item.condicionPago,
      observaciones: item.observaciones,
      itemMateriaPrima: item.items[0]?.materiaPrima || '',
      itemCantidad: item.items[0]?.cantidad || 1,
      itemPrecioUnitario: item.items[0]?.precioUnitario || 0,
      itemUnidad: item.items[0]?.unidad || 'Unidades',
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedPresupuesto(item);
    setOpenDelete(true);
  };

  const handleAprobarPresupuesto = (id) => {
    setPresupuestos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: 'Aprobado' } : p))
    );
    if (selectedPresupuesto?.id === id) {
      setSelectedPresupuesto((prev) => ({ ...prev, estado: 'Aprobado' }));
    }
  };

  const handleRechazarPresupuesto = (id) => {
    setPresupuestos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: 'Rechazado' } : p))
    );
    if (selectedPresupuesto?.id === id) {
      setSelectedPresupuesto((prev) => ({ ...prev, estado: 'Rechazado' }));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find((p) => p.id === Number(formData.proveedorId));
    const subtotalItem = Number(formData.itemCantidad) * Number(formData.itemPrecioUnitario);

    const items = [
      {
        id: 1,
        materiaPrima: formData.itemMateriaPrima,
        unidad: formData.itemUnidad,
        cantidad: Number(formData.itemCantidad),
        precioUnitario: Number(formData.itemPrecioUnitario),
        subtotal: subtotalItem,
      },
    ];

    if (isEditing && selectedPresupuesto) {
      setPresupuestos((prev) =>
        prev.map((p) =>
          p.id === selectedPresupuesto.id
            ? {
                ...p,
                proveedorId: prov?.id || 1,
                proveedorNombre: prov?.razonSocial || 'Proveedor',
                cuit: prov?.cuit || '',
                fechaEmision: formData.fechaEmision,
                validezHasta: formData.validezHasta,
                tipoCompra: formData.tipoCompra,
                estado: formData.estado,
                calificacion: formData.calificacion,
                condicionPago: formData.condicionPago,
                observaciones: formData.observaciones,
                items,
                total: subtotalItem,
              }
            : p
        )
      );
    } else {
      const nextNum = presupuestos.length + 1;
      const newPresupuesto = {
        id: `PP-2026-00${nextNum}`,
        proveedorId: prov?.id || 1,
        proveedorNombre: prov?.razonSocial || 'Proveedor',
        cuit: prov?.cuit || '',
        fechaEmision: formData.fechaEmision,
        validezHasta: formData.validezHasta || '2026-03-31',
        tipoCompra: formData.tipoCompra,
        estado: formData.estado,
        calificacion: formData.calificacion,
        condicionPago: formData.condicionPago,
        observaciones: formData.observaciones,
        items,
        total: subtotalItem,
      };
      setPresupuestos((prev) => [newPresupuesto, ...prev]);
    }

    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setPresupuestos((prev) => prev.filter((p) => p.id !== selectedPresupuesto.id));
    setOpenDelete(false);
    setSelectedPresupuesto(null);
  };

  return (
    <Box>
      {/* Banner Informativo del Dominio */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
        <strong>Proceso de Cotización:</strong> Las compras de materias primas principales (Harina, Levadura, Descartables)
        se evalúan semestralmente en marzo y diciembre comparando proveedores por <strong>precio y calidad</strong>.
        Los insumos frescos se cotizan semanalmente con proveedores locales.
      </Alert>

      {/* Tarjetas de Métricas */}
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
              <RequestQuoteIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Presupuestos
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
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'warning.main', color: 'white', display: 'flex' }}>
              <HourglassEmptyIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Pendientes de Decisión
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.pendientes}
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
              <VerifiedIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Presupuestos Aprobados
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.aprobados}
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
              <PriceCheckIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Compromiso Aprobado
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${stats.montoAprobado.toLocaleString('es-AR')}
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
            placeholder="Buscar por ID, Proveedor o CUIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: '100%', sm: 280 }, bgcolor: 'background.paper' }}
          />

          <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
            <InputLabel id="estado-pres-label">Estado</InputLabel>
            <Select
              labelId="estado-pres-label"
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los Estados</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Aprobado">Aprobado</MenuItem>
              <MenuItem value="Rechazado">Rechazado</MenuItem>
              <MenuItem value="Vencido">Vencido</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180, bgcolor: 'background.paper' }}>
            <InputLabel id="tipo-pres-label">Modalidad de Compra</InputLabel>
            <Select
              labelId="tipo-pres-label"
              value={tipoFilter}
              label="Modalidad de Compra"
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todas las Modalidades</MenuItem>
              <MenuItem value="Semestral">Semestral (Marzo/Diciembre)</MenuItem>
              <MenuItem value="Locales">Insumos Locales / Frescos</MenuItem>
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
          Cargar Presupuesto
        </Button>
      </Box>

      {/* Tabla de Presupuestos */}
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
        <Table sx={{ minWidth: 750 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Nº Presupuesto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Proveedor & CUIT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo de Compra</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Validez Hasta</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Cotizado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Calidad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPresupuestos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  <Typography variant="body2">No se encontraron cotizaciones</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPresupuestos.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}>
                    {row.id}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {row.proveedorNombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      CUIT: {row.cuit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                      {row.tipoCompra}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pago: {row.condicionPago}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.validezHasta}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    ${row.total.toLocaleString('es-AR')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.calificacion}
                      color={row.calificacion === 'Excelente' ? 'success' : row.calificacion === 'Alta' ? 'info' : 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.estado}
                      size="small"
                      color={STATUS_COLOR_MAP[row.estado] || 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver desglose de cotización">
                      <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: 'text.secondary' }}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {row.estado === 'Pendiente' && (
                      <>
                        <Tooltip title="Aprobar para compra">
                          <IconButton
                            size="small"
                            onClick={() => handleAprobarPresupuesto(row.id)}
                            sx={{ color: 'success.main' }}
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar presupuesto">
                          <IconButton
                            size="small"
                            onClick={() => handleRechazarPresupuesto(row.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <HighlightOffIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'primary.main' }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
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

      {/* Modal Dialog: Detalle Completo de Presupuesto */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Detalle de Cotización #{selectedPresupuesto?.id}</span>
          <Chip
            label={selectedPresupuesto?.estado}
            size="small"
            color={STATUS_COLOR_MAP[selectedPresupuesto?.estado] || 'default'}
          />
        </DialogTitle>
        <DialogContent dividers>
          {selectedPresupuesto && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Proveedor</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {selectedPresupuesto.proveedorNombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    CUIT: {selectedPresupuesto.cuit}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Condición Comercial</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedPresupuesto.tipoCompra}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Forma de Pago: {selectedPresupuesto.condicionPago}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Fecha de Emisión</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPresupuesto.fechaEmision}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Validez de Oferta</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPresupuesto.validezHasta}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Evaluación de Calidad del Proveedor</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {selectedPresupuesto.calificacion}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  DETALLE DE MATERIAS PRIMAS COTIZADAS
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
                    {selectedPresupuesto.items.map((item, idx) => (
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
                        TOTAL COTIZADO:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1rem' }}>
                        ${selectedPresupuesto.total.toLocaleString('es-AR')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedPresupuesto.observaciones && (
                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: '8px' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    Observaciones Técnicas / Dominio:
                  </Typography>
                  <Typography variant="body2">{selectedPresupuesto.observaciones}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {selectedPresupuesto?.estado === 'Pendiente' && (
            <>
              <Button
                onClick={() => handleRechazarPresupuesto(selectedPresupuesto.id)}
                color="error"
                variant="outlined"
              >
                Rechazar
              </Button>
              <Button
                onClick={() => handleAprobarPresupuesto(selectedPresupuesto.id)}
                color="success"
                variant="contained"
              >
                Aprobar Presupuesto
              </Button>
            </>
          )}
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Alta / Edición de Presupuesto */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <form onSubmit={handleSaveForm}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {isEditing ? `Editar Cotización ${selectedPresupuesto?.id}` : 'Registrar Cotización de Proveedor'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Proveedor Emisor</InputLabel>
                  <Select
                    value={formData.proveedorId}
                    label="Proveedor Emisor"
                    onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                  >
                    {INITIAL_PROVEEDORES.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.razonSocial} ({p.categoria})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Compra</InputLabel>
                  <Select
                    value={formData.tipoCompra}
                    label="Tipo de Compra"
                    onChange={(e) => setFormData({ ...formData, tipoCompra: e.target.value })}
                  >
                    <MenuItem value="Semestral (Marzo - Temporada Baja)">Semestral (Marzo - Temporada Baja)</MenuItem>
                    <MenuItem value="Semestral (Diciembre - Temporada Baja)">Semestral (Diciembre - Temporada Baja)</MenuItem>
                    <MenuItem value="Insumos Locales / Reposición">Insumos Locales / Reposición</MenuItem>
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
                  label="Validez de Oferta Hasta"
                  type="date"
                  value={formData.validezHasta}
                  onChange={(e) => setFormData({ ...formData, validezHasta: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Calidad Evaluada</InputLabel>
                  <Select
                    value={formData.calificacion}
                    label="Calidad Evaluada"
                    onChange={(e) => setFormData({ ...formData, calificacion: e.target.value })}
                  >
                    <MenuItem value="Excelente">Excelente</MenuItem>
                    <MenuItem value="Alta">Alta</MenuItem>
                    <MenuItem value="Media">Media</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Condición de Pago Acordada"
                  placeholder="Ej: Contado contra entrega, 30 días FF..."
                  value={formData.condicionPago}
                  onChange={(e) => setFormData({ ...formData, condicionPago: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado Inicial</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado Inicial"
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="Aprobado">Aprobado</MenuItem>
                    <MenuItem value="Rechazado">Rechazado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    MATERIA PRIMA COTIZADA (DETALLE DE PRESUPUESTO PROVEEDOR)
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
                  placeholder="Bolsas, Kg, etc."
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
                  label="Observaciones y Justificación de Compra"
                  placeholder="Fundamentación de precio o estacionalidad según requerimientos..."
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
              {isEditing ? 'Guardar Cambios' : 'Registrar Cotización'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Dialog: Confirmar Eliminación */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Eliminar Presupuesto</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Confirma que desea eliminar el presupuesto <strong>{selectedPresupuesto?.id}</strong> de{' '}
            <strong>{selectedPresupuesto?.proveedorNombre}</strong> por $
            {selectedPresupuesto?.total?.toLocaleString('es-AR')}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PresupuestoProveedorScreen;
