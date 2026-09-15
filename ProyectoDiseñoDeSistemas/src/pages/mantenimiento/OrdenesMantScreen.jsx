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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import {
  INITIAL_ORDENES_MANTENIMIENTO,
  INITIAL_MAQUINARIAS,
  INITIAL_TECNICOS,
} from './mockData';

const STATUS_COLOR_MAP = {
  Finalizada: 'success',
  'En Proceso': 'info',
  Pendiente: 'warning',
  Cancelada: 'error',
};

const PRIORITY_COLOR_MAP = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'default',
};

export const OrdenesMantScreen = () => {
  const [ordenes, setOrdenes] = useState(INITIAL_ORDENES_MANTENIMIENTO);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [tipoFilter, setTipoFilter] = useState('TODOS');
  const [prioridadFilter, setPrioridadFilter] = useState('TODAS');

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialFormState = {
    maquinariaId: 1,
    tipo: 'Preventivo',
    prioridad: 'Media',
    empleadoId: 1,
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaInicio: '',
    fechaFin: '',
    estado: 'Pendiente',
    tareaRealizada: '',
    repuestoCodigo: '',
    repuestoDescripcion: '',
    repuestoCantidad: '',
    observaciones: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filtrado
  const filteredOrdenes = useMemo(() => {
    return ordenes.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.maquinariaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.maquinariaCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.tecnicoNombre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'TODOS' || o.estado === statusFilter;
      const matchTipo = tipoFilter === 'TODOS' || o.tipo === tipoFilter;
      const matchPrioridad = prioridadFilter === 'TODAS' || o.prioridad === prioridadFilter;

      return matchSearch && matchStatus && matchTipo && matchPrioridad;
    });
  }, [ordenes, searchTerm, statusFilter, tipoFilter, prioridadFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = ordenes.length;
    const preventivos = ordenes.filter((o) => o.tipo === 'Preventivo').length;
    const correctivos = ordenes.filter((o) => o.tipo === 'Correctivo').length;
    const enProceso = ordenes.filter((o) => o.estado === 'En Proceso').length;
    return { total, preventivos, correctivos, enProceso };
  }, [ordenes]);

  // Handlers
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
      maquinariaId: orden.maquinariaId,
      tipo: orden.tipo,
      prioridad: orden.prioridad,
      empleadoId: orden.empleadoId,
      fechaEmision: orden.fechaEmision,
      fechaInicio: orden.fechaInicio || '',
      fechaFin: orden.fechaFin || '',
      estado: orden.estado,
      tareaRealizada: orden.tareaRealizada || '',
      repuestoCodigo: orden.repuestos[0]?.codigo || '',
      repuestoDescripcion: orden.repuestos[0]?.descripcion || '',
      repuestoCantidad: orden.repuestos[0]?.cantidad || '',
      observaciones: orden.observaciones || '',
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (orden) => {
    setSelectedOrden(orden);
    setOpenDelete(true);
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setOrdenes((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        if (nuevoEstado === 'En Proceso' && !o.fechaInicio) {
          return { ...o, estado: nuevoEstado, fechaInicio: nowStr };
        }
        if (nuevoEstado === 'Finalizada') {
          return { ...o, estado: nuevoEstado, fechaFin: nowStr };
        }
        return { ...o, estado: nuevoEstado };
      })
    );

    if (selectedOrden?.id === id) {
      setSelectedOrden((prev) => ({ ...prev, estado: nuevoEstado }));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const maq = INITIAL_MAQUINARIAS.find((m) => m.id === Number(formData.maquinariaId));
    const tec = INITIAL_TECNICOS.find((t) => t.id === Number(formData.empleadoId));

    const repuestos = formData.repuestoDescripcion
      ? [
          {
            id: 1,
            codigo: formData.repuestoCodigo || 'REP-GEN',
            descripcion: formData.repuestoDescripcion,
            cantidad: formData.repuestoCantidad || '1 unidad',
          },
        ]
      : [];

    if (isEditing && selectedOrden) {
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id === selectedOrden.id
            ? {
                ...o,
                maquinariaId: maq?.id || 1,
                maquinariaCodigo: maq?.codigo || 'MAQ-001',
                maquinariaNombre: maq?.nombre || 'Maquinaria',
                tipo: formData.tipo,
                prioridad: formData.prioridad,
                empleadoId: tec?.id || 1,
                tecnicoNombre: tec?.nombre || 'Carlos Vignolo',
                fechaEmision: formData.fechaEmision,
                fechaInicio: formData.fechaInicio || null,
                fechaFin: formData.fechaFin || null,
                estado: formData.estado,
                tareaRealizada: formData.tareaRealizada,
                repuestos,
                observaciones: formData.observaciones,
              }
            : o
        )
      );
    } else {
      const nextNum = ordenes.length + 40;
      const newOrden = {
        id: `OM-2026-00${nextNum}`,
        maquinariaId: maq?.id || 1,
        maquinariaCodigo: maq?.codigo || 'MAQ-001',
        maquinariaNombre: maq?.nombre || 'Maquinaria',
        tipo: formData.tipo,
        prioridad: formData.prioridad,
        empleadoId: tec?.id || 1,
        tecnicoNombre: tec?.nombre || 'Carlos Vignolo',
        fechaEmision: formData.fechaEmision,
        fechaInicio: formData.fechaInicio || null,
        fechaFin: formData.fechaFin || null,
        estado: formData.estado,
        tareaRealizada: formData.tareaRealizada,
        repuestos,
        observaciones: formData.observaciones,
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
              <AssignmentIcon />
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
              <EngineeringIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                En Ejecución Ahora
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.enProceso}
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
              <BuildCircleIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Mantenimientos Preventivos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.preventivos}
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
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'error.main', color: 'white', display: 'flex' }}>
              <WarningAmberIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Correctivos / Averías
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.correctivos}
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
            placeholder="Buscar por ID, Máquina o Técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: '100%', sm: 260 }, bgcolor: 'background.paper' }}
          />

          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
            <InputLabel id="tipo-filter-label">Tipo</InputLabel>
            <Select
              labelId="tipo-filter-label"
              value={tipoFilter}
              label="Tipo"
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los Tipos</MenuItem>
              <MenuItem value="Preventivo">Preventivo</MenuItem>
              <MenuItem value="Correctivo">Correctivo</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
            <InputLabel id="estado-filter-label">Estado</InputLabel>
            <Select
              labelId="estado-filter-label"
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los Estados</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En Proceso">En Proceso</MenuItem>
              <MenuItem value="Finalizada">Finalizada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'background.paper' }}>
            <InputLabel id="prioridad-filter-label">Prioridad</InputLabel>
            <Select
              labelId="prioridad-filter-label"
              value={prioridadFilter}
              label="Prioridad"
              onChange={(e) => setPrioridadFilter(e.target.value)}
            >
              <MenuItem value="TODAS">Todas</MenuItem>
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
              <MenuItem value="Baja">Baja</MenuItem>
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
          Nueva Orden de Mantenimiento
        </Button>
      </Box>

      {/* Tabla de Órdenes de Mantenimiento */}
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
              <TableCell sx={{ fontWeight: 700 }}>Nº Orden</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Maquinaria Afectada</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tipo de Mant.</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Prioridad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Técnico Responsable</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fechas (Emisión / Inicio)</TableCell>
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
                  <Typography variant="body2">No se encontraron órdenes de mantenimiento</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrdenes.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                    {row.id}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {row.maquinariaNombre}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      {row.maquinariaCodigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.tipo}
                      size="small"
                      color={row.tipo === 'Preventivo' ? 'success' : 'error'}
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.prioridad}
                      size="small"
                      color={PRIORITY_COLOR_MAP[row.prioridad] || 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.tecnicoNombre}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                      Emisión: {row.fechaEmision}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Inicio: {row.fechaInicio || 'No iniciado'}
                    </Typography>
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
                    <Tooltip title="Ver orden y repuestos">
                      <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: 'text.secondary' }}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {row.estado === 'Pendiente' && (
                      <Tooltip title="Iniciar trabajo de mantenimiento">
                        <IconButton
                          size="small"
                          onClick={() => handleCambiarEstado(row.id, 'En Proceso')}
                          sx={{ color: 'info.main' }}
                        >
                          <PlayArrowIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {row.estado === 'En Proceso' && (
                      <Tooltip title="Concluir y firmar orden">
                        <IconButton
                          size="small"
                          onClick={() => handleCambiarEstado(row.id, 'Finalizada')}
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
                    <Tooltip title="Eliminar orden">
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

      {/* Modal Dialog: Detalle de Orden */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Detalle de Orden de Mantenimiento #{selectedOrden?.id}</span>
          <Chip label={selectedOrden?.estado} size="small" color={STATUS_COLOR_MAP[selectedOrden?.estado] || 'default'} />
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrden && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Maquinaria Intervenida</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {selectedOrden.maquinariaNombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Código: {selectedOrden.maquinariaCodigo}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Técnico Asignado (Planta)</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {selectedOrden.tecnicoNombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prioridad: {selectedOrden.prioridad} • Tipo: {selectedOrden.tipo}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Fecha de Emisión</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrden.fechaEmision}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Fecha de Inicio</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOrden.fechaInicio || 'Pendiente'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Fecha de Culminación</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: selectedOrden.fechaFin ? 'success.main' : 'text.secondary' }}>
                    {selectedOrden.fechaFin || 'En curso / Pendiente'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  DIAGNÓSTICO Y TAREAS REALIZADAS (DETALLE DE ORDEN DE MANTENIMIENTO)
                </Typography>
              </Divider>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: 'action.hover' }}>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {selectedOrden.tareaRealizada || 'Sin especificaciones detalladas.'}
                </Typography>
              </Paper>

              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  REPUESTOS Y PIEZAS UTILIZADAS
                </Typography>
              </Divider>

              {selectedOrden.repuestos && selectedOrden.repuestos.length > 0 ? (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Código de Pieza</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Descripción del Repuesto</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrden.repuestos.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.codigo}</TableCell>
                          <TableCell>{r.descripcion}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>{r.cantidad}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No se requirió cambio de piezas o repuestos en esta orden.
                </Typography>
              )}

              {selectedOrden.observaciones && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    Observaciones Finales / Recomendaciones al Operario:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrden.observaciones}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {selectedOrden?.estado === 'Pendiente' && (
            <Button
              onClick={() => handleCambiarEstado(selectedOrden.id, 'En Proceso')}
              variant="contained"
              color="info"
              startIcon={<PlayArrowIcon />}
            >
              Iniciar Trabajo
            </Button>
          )}
          {selectedOrden?.estado === 'En Proceso' && (
            <Button
              onClick={() => handleCambiarEstado(selectedOrden.id, 'Finalizada')}
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              Concluir y Firmar Orden
            </Button>
          )}
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Alta / Edición de Orden */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <form onSubmit={handleSaveForm}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {isEditing ? `Editar Orden de Mantenimiento ${selectedOrden?.id}` : 'Generar Orden de Mantenimiento'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Maquinaria Afectada</InputLabel>
                  <Select
                    value={formData.maquinariaId}
                    label="Maquinaria Afectada"
                    onChange={(e) => setFormData({ ...formData, maquinariaId: e.target.value })}
                  >
                    {INITIAL_MAQUINARIAS.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.codigo} - {m.nombre} ({m.estado})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Técnico Responsable</InputLabel>
                  <Select
                    value={formData.empleadoId}
                    label="Técnico Responsable"
                    onChange={(e) => setFormData({ ...formData, empleadoId: e.target.value })}
                  >
                    {INITIAL_TECNICOS.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.nombre} ({t.especialidad})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Mantenimiento</InputLabel>
                  <Select
                    value={formData.tipo}
                    label="Tipo de Mantenimiento"
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <MenuItem value="Preventivo">Preventivo (Programado / Fin Jornada)</MenuItem>
                    <MenuItem value="Correctivo">Correctivo (Reparación de Falla)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Prioridad de Intervención</InputLabel>
                  <Select
                    value={formData.prioridad}
                    label="Prioridad de Intervención"
                    onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                  >
                    <MenuItem value="Alta">Alta (Avería que frena producción)</MenuItem>
                    <MenuItem value="Media">Media</MenuItem>
                    <MenuItem value="Baja">Baja</MenuItem>
                  </Select>
                </FormControl>
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
                    <MenuItem value="En Proceso">En Proceso</MenuItem>
                    <MenuItem value="Finalizada">Finalizada</MenuItem>
                    <MenuItem value="Cancelada">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Emisión"
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
                  label="Fecha y Hora Inicio"
                  value={formData.fechaInicio}
                  placeholder="AAAA-MM-DD HH:MM"
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha y Hora Fin"
                  value={formData.fechaFin}
                  placeholder="AAAA-MM-DD HH:MM"
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Descripción de la Tarea / Fallo Observado"
                  placeholder="Detalle la rutina de lubricación o causa raíz de avería según diagrama de dominio..."
                  value={formData.tareaRealizada}
                  onChange={(e) => setFormData({ ...formData, tareaRealizada: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    REPUESTO UTILIZADO (OPCIONAL)
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Código Repuesto"
                  placeholder="Ej: SKF-6204, CORR-8M"
                  value={formData.repuestoCodigo}
                  onChange={(e) => setFormData({ ...formData, repuestoCodigo: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Descripción del Repuesto / Insumo"
                  placeholder="Ej: Rulemán blindado, grasa alimenticia"
                  value={formData.repuestoDescripcion}
                  onChange={(e) => setFormData({ ...formData, repuestoDescripcion: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cantidad"
                  placeholder="Ej: 2 unidades, 500 gr"
                  value={formData.repuestoCantidad}
                  onChange={(e) => setFormData({ ...formData, repuestoCantidad: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Observaciones y Recomendaciones Técnicas"
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
              {isEditing ? 'Guardar Cambios' : 'Emitir Orden'}
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
        <DialogTitle sx={{ fontWeight: 700 }}>Eliminar Orden</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Confirma que desea eliminar la orden de mantenimiento <strong>{selectedOrden?.id}</strong> sobre{' '}
            <strong>{selectedOrden?.maquinariaNombre}</strong>?
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

export default OrdenesMantScreen;
