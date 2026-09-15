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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'grid'
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
            <AssignmentIcon />
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
            <EngineeringIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              En Ejecución Ahora
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
              {stats.enProceso}
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
            <BuildCircleIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Mantenimientos Preventivos
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
              {stats.preventivos}
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
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'error.main', color: 'white', display: 'flex', flexShrink: 0 }}>
            <WarningAmberIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Correctivos / Averías
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
              {stats.correctivos}
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
              <Tooltip title="Vista Cuadrícula">
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
            Nueva Orden
          </Button>
        </Box>
      </Box>

      {/* Vista de Cuadrícula (Cards) para Dispositivos Móviles y Escritorio */}
      {viewMode === 'grid' && (
        <Box sx={{ mb: 2 }}>
          {filteredOrdenes.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron órdenes de mantenimiento para los filtros seleccionados
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
                    width: '100%',
                    bgcolor: 'background.paper',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 8px 24px rgba(0,0,0,0.6)'
                          : '0 8px 24px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'primary.main', display: 'block' }}>
                        {orden.id}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                        {orden.maquinariaNombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {orden.maquinariaCodigo} • {orden.tipo}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
                      <Chip
                        label={orden.estado}
                        size="small"
                        color={STATUS_COLOR_MAP[orden.estado] || 'default'}
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                      <Chip
                        label={`Prioridad ${orden.prioridad}`}
                        size="small"
                        color={PRIORITY_COLOR_MAP[orden.prioridad] || 'default'}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.68rem', height: 20 }}
                      />
                    </Box>
                  </Box>

                  {/* Body */}
                  <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EngineeringIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Técnico: <strong>{orden.tecnicoNombre}</strong>
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Emisión: {orden.fechaEmision} {orden.fechaInicio ? `· Inicio: ${orden.fechaInicio.split(' ')[0]}` : ''}
                      </Typography>
                    </Box>

                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'action.hover', mt: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          color: 'text.secondary',
                          lineHeight: 1.4,
                        }}
                      >
                        {orden.tareaRealizada || 'Sin diagnóstico registrado.'}
                      </Typography>
                    </Paper>

                    {orden.repuestos && orden.repuestos.length > 0 && (
                      <Chip
                        label={`${orden.repuestos.length} repuesto(s) registrado(s)`}
                        size="small"
                        sx={{ alignSelf: 'flex-start', fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>

                  {/* Actions Footer */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
                    {orden.estado === 'Pendiente' ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleCambiarEstado(orden.id, 'En Proceso')}
                        sx={{ borderRadius: '8px', fontSize: '0.74rem' }}
                      >
                        Iniciar
                      </Button>
                    ) : orden.estado === 'En Proceso' ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleCambiarEstado(orden.id, 'Finalizada')}
                        sx={{ borderRadius: '8px', fontSize: '0.74rem' }}
                      >
                        Finalizar
                      </Button>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Completada
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Ver detalle de intervención">
                        <IconButton size="small" onClick={() => handleOpenDetail(orden)} sx={{ color: 'text.secondary' }}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar orden">
                        <IconButton size="small" onClick={() => handleOpenEdit(orden)} sx={{ color: 'primary.main' }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar orden">
                        <IconButton size="small" onClick={() => handleOpenDelete(orden)} sx={{ color: 'error.main' }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Tabla de Órdenes de Mantenimiento */}
      {viewMode === 'table' && (
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
          <Table sx={{ minWidth: 780 }}>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Nro Orden</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Maquinaria</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Prioridad</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Técnico</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha Emisión</TableCell>
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
                      <Typography variant="caption" color="text.secondary">
                        {row.maquinariaCodigo}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{row.tipo}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.prioridad}
                        size="small"
                        color={PRIORITY_COLOR_MAP[row.prioridad] || 'default'}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.tecnicoNombre}</TableCell>
                    <TableCell>{row.fechaEmision}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.estado}
                        size="small"
                        color={STATUS_COLOR_MAP[row.estado] || 'default'}
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver detalle de intervención">
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
      )}

      {/* Modal Dialog: Detalle de Orden - UI Estilizada */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AssignmentIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Orden de Mantenimiento · {selectedOrden?.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Intervención: {selectedOrden?.tipo} — Prioridad {selectedOrden?.prioridad}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={selectedOrden?.estado}
            size="small"
            color={STATUS_COLOR_MAP[selectedOrden?.estado] || 'default'}
            sx={{ fontWeight: 700 }}
          />
        </DialogTitle>
        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {selectedOrden && (
            <>
              {/* Sección Datos de Intervención */}
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Maquinaria Intervenida</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>
                      {selectedOrden.maquinariaNombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Código: {selectedOrden.maquinariaCodigo}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Técnico Responsable</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>
                      {selectedOrden.tecnicoNombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Turno y área de mantenimiento industrial
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Fecha de Emisión</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrden.fechaEmision}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Fecha y Hora Inicio</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedOrden.fechaInicio || 'Pendiente de inicio'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Fecha y Hora Fin</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: selectedOrden.fechaFin ? 'success.main' : 'text.secondary' }}>
                      {selectedOrden.fechaFin || 'En curso / Pendiente'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección Diagnóstico */}
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Diagnóstico y Tareas Realizadas
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px', bgcolor: 'action.hover' }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {selectedOrden.tareaRealizada || 'Sin especificaciones registradas en la orden.'}
                  </Typography>
                </Paper>
              </Paper>

              {/* Sección Repuestos */}
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Repuestos y Piezas Utilizadas
                </Typography>
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
                    No se requirió recambio de piezas ni repuestos para esta orden.
                  </Typography>
                )}
              </Paper>

              {selectedOrden.observaciones && (
                <Box sx={{ px: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    Observaciones Finales / Recomendaciones al Operario:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrden.observaciones}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
          {selectedOrden?.estado === 'Pendiente' && (
            <Button
              onClick={() => handleCambiarEstado(selectedOrden.id, 'En Proceso')}
              variant="contained"
              color="info"
              startIcon={<PlayArrowIcon />}
              sx={{ fontWeight: 700 }}
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
              sx={{ fontWeight: 700 }}
            >
              Concluir y Firmar Orden
            </Button>
          )}
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Alta / Edición de Orden - UI Estilizada */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
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
                <EngineeringIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {isEditing ? `Editar Orden de Mantenimiento · ${selectedOrden?.id}` : 'Generar Nueva Orden de Mantenimiento'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Asignación a técnicos de planta, repuestos y control preventivo/correctivo
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setOpenForm(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Sección 1: Equipo y Técnico */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PrecisionManufacturingIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  1. Maquinaria y Asignación de Técnico
                </Typography>
              </Box>
              <Grid container spacing={2}>
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
                    <InputLabel>Técnico Responsable Asignado</InputLabel>
                    <Select
                      value={formData.empleadoId}
                      label="Técnico Responsable Asignado"
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
              </Grid>
            </Paper>

            {/* Sección 2: Clasificación y Tiempos */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarMonthIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  2. Clasificación, Estado y Fechas
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo de Mantenimiento</InputLabel>
                    <Select
                      value={formData.tipo}
                      label="Tipo de Mantenimiento"
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      <MenuItem value="Preventivo">Preventivo (Programado)</MenuItem>
                      <MenuItem value="Correctivo">Correctivo (Reparación de Falla)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      value={formData.prioridad}
                      label="Prioridad"
                      onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                    >
                      <MenuItem value="Alta">Alta (Avería crítica)</MenuItem>
                      <MenuItem value="Media">Media (Planificada)</MenuItem>
                      <MenuItem value="Baja">Baja (Mantenimiento menor)</MenuItem>
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
              </Grid>
            </Paper>

            {/* Sección 3: Diagnóstico y Repuestos */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BuildCircleIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  3. Diagnóstico y Repuestos Requeridos
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    label="Descripción de la Tarea / Fallo Observado"
                    placeholder="Detalle la rutina o causa raíz según el dominio..."
                    value={formData.tareaRealizada}
                    onChange={(e) => setFormData({ ...formData, tareaRealizada: e.target.value })}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Código de Repuesto (Opcional)"
                    placeholder="Ej: SKF-6204"
                    value={formData.repuestoCodigo}
                    onChange={(e) => setFormData({ ...formData, repuestoCodigo: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Descripción de Repuesto / Insumo"
                    placeholder="Ej: Rulemán blindado, grasa de litio"
                    value={formData.repuestoDescripcion}
                    onChange={(e) => setFormData({ ...formData, repuestoDescripcion: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cantidad"
                    placeholder="Ej: 2 unidades"
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
                    placeholder="Comentarios adicionales para el equipo operativo..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Paper>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          >
            <Button onClick={() => setOpenForm(false)} color="inherit" sx={{ fontWeight: 600 }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{ px: 3, fontWeight: 700 }}
            >
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
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ p: 2.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'error.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningAmberIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Confirmar Baja de Orden
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Confirma que desea eliminar la orden de mantenimiento <strong>{selectedOrden?.id}</strong> sobre{' '}
            <strong>{selectedOrden?.maquinariaNombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ fontWeight: 700 }}>
            Eliminar Orden
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdenesMantScreen;
