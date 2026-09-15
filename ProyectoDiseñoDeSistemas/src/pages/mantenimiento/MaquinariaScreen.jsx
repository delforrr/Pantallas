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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import BuildIcon from '@mui/icons-material/Build';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { INITIAL_MAQUINARIAS, INITIAL_TECNICOS } from './mockData';
import { MaquinariaCard } from '../../components/mantenimiento';

const STATUS_COLOR_MAP = {
  Operativa: 'success',
  'En Mantenimiento': 'warning',
  'En Reparación': 'error',
  'Fuera de Servicio': 'default',
};

export const MaquinariaScreen = () => {
  const [maquinarias, setMaquinarias] = useState(INITIAL_MAQUINARIAS);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [lineaFilter, setLineaFilter] = useState('TODAS');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openQuickOrder, setOpenQuickOrder] = useState(false);

  // Selecciones
  const [selectedMaq, setSelectedMaq] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form de Maquinaria
  const initialFormState = {
    codigo: '',
    nombre: '',
    marca: '',
    modelo: '',
    linea: 'Elaboración de Masas',
    capacidad: '',
    estado: 'Operativa',
    ultimoMantenimiento: new Date().toISOString().split('T')[0],
    proximoMantenimiento: '',
    horasUso: 0,
    alerta48hs: false,
    ubicacion: 'Nave 1 - Sector Producción',
    responsable: 'Carlos Vignolo',
    observaciones: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Form de Orden Rápida
  const [quickOrderForm, setQuickOrderForm] = useState({
    tipo: 'Preventivo',
    tecnico: 'Carlos Vignolo',
    prioridad: 'Media',
    tarea: '',
  });

  // Filtrado
  const filteredMaquinarias = useMemo(() => {
    return maquinarias.filter((m) => {
      const matchSearch =
        m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.linea.toLowerCase().includes(searchTerm.toLowerCase());

      const matchLinea = lineaFilter === 'TODAS' || m.linea === lineaFilter;
      const matchEstado = estadoFilter === 'TODOS' || m.estado === estadoFilter;

      return matchSearch && matchLinea && matchEstado;
    });
  }, [maquinarias, searchTerm, lineaFilter, estadoFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = maquinarias.length;
    const operativas = maquinarias.filter((m) => m.estado === 'Operativa').length;
    const enMantenimiento = maquinarias.filter((m) => m.estado === 'En Mantenimiento').length;
    const paradas = maquinarias.filter(
      (m) => m.estado === 'En Reparación' || m.estado === 'Fuera de Servicio'
    ).length;
    return { total, operativas, enMantenimiento, paradas };
  }, [maquinarias]);

  // Handlers
  const handleOpenCreate = () => {
    setIsEditing(false);
    const nextCode = `MAQ-00${maquinarias.length + 1}`;
    setFormData({ ...initialFormState, codigo: nextCode });
    setOpenForm(true);
  };

  const handleOpenEdit = (maq) => {
    setIsEditing(true);
    setSelectedMaq(maq);
    setFormData({ ...maq });
    setOpenForm(true);
  };

  const handleOpenDetail = (maq) => {
    setSelectedMaq(maq);
    setOpenDetail(true);
  };

  const handleOpenDelete = (maq) => {
    setSelectedMaq(maq);
    setOpenDelete(true);
  };

  const handleOpenQuickOrder = (maq) => {
    setSelectedMaq(maq);
    setQuickOrderForm({
      tipo: maq.estado === 'En Reparación' ? 'Correctivo' : 'Preventivo',
      tecnico: maq.responsable || 'Carlos Vignolo',
      prioridad: maq.estado === 'En Reparación' ? 'Alta' : 'Media',
      tarea: `Mantenimiento sobre equipo ${maq.codigo} - ${maq.nombre}`,
    });
    setOpenQuickOrder(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (isEditing && selectedMaq) {
      setMaquinarias((prev) =>
        prev.map((m) => (m.id === selectedMaq.id ? { ...formData, id: m.id } : m))
      );
    } else {
      const newMaq = {
        ...formData,
        id: Date.now(),
      };
      setMaquinarias((prev) => [newMaq, ...prev]);
    }
    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setMaquinarias((prev) => prev.filter((m) => m.id !== selectedMaq.id));
    setOpenDelete(false);
    setSelectedMaq(null);
  };

  const handleConfirmQuickOrder = () => {
    // Si la máquina estaba operativa, la pasa a en mantenimiento
    if (selectedMaq) {
      setMaquinarias((prev) =>
        prev.map((m) =>
          m.id === selectedMaq.id
            ? { ...m, estado: quickOrderForm.tipo === 'Correctivo' ? 'En Reparación' : 'En Mantenimiento' }
            : m
        )
      );
    }
    setOpenQuickOrder(false);
  };

  return (
    <Box>
      {/* Tarjetas de Métricas de Maquinaria */}
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
              <PrecisionManufacturingIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Equipos
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
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'success.main', color: 'white', display: 'flex' }}>
              <CheckCircleOutlineIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                En Operación Normal
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.operativas}
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
              <BuildIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                En Mantenimiento
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.enMantenimiento}
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
                Paradas / En Reparación
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.paradas}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Barra de Filtros, Visualización y Acción */}
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
            placeholder="Buscar por Nombre, Código o Marca..."
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

          <FormControl size="small" sx={{ minWidth: 170, bgcolor: 'background.paper' }}>
            <InputLabel id="linea-filter-label">Línea de Producción</InputLabel>
            <Select
              labelId="linea-filter-label"
              value={lineaFilter}
              label="Línea de Producción"
              onChange={(e) => setLineaFilter(e.target.value)}
            >
              <MenuItem value="TODAS">Todas las Líneas</MenuItem>
              <MenuItem value="Elaboración de Masas">Elaboración de Masas</MenuItem>
              <MenuItem value="Armado y Relleno">Armado y Relleno</MenuItem>
              <MenuItem value="Corte y Fraccionado">Corte y Fraccionado</MenuItem>
              <MenuItem value="Envasado y Empaque">Envasado y Empaque</MenuItem>
              <MenuItem value="Cocina de Salsas">Cocina de Salsas</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
            <InputLabel id="estado-filter-label">Estado Operativo</InputLabel>
            <Select
              labelId="estado-filter-label"
              value={estadoFilter}
              label="Estado Operativo"
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="Operativa">Operativa</MenuItem>
              <MenuItem value="En Mantenimiento">En Mantenimiento</MenuItem>
              <MenuItem value="En Reparación">En Reparación</MenuItem>
              <MenuItem value="Fuera de Servicio">Fuera de Servicio</MenuItem>
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
            <ToggleButton value="grid" aria-label="vista cuadricula">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table" aria-label="vista tabla">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Nueva Maquinaria
          </Button>
        </Box>
      </Box>

      {/* Vista de Cuadrícula (Cards) */}
      {viewMode === 'grid' && (
        <Grid container spacing={2.5}>
          {filteredMaquinarias.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  No se encontraron maquinarias para los filtros seleccionados
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredMaquinarias.map((maq) => (
              <Grid item xs={12} sm={6} lg={4} key={maq.id}>
                <MaquinariaCard
                  maquinaria={maq}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onNewOrder={handleOpenQuickOrder}
                  onViewDetail={handleOpenDetail}
                />
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Vista de Tabla Alternativa */}
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
          <Table sx={{ minWidth: 720 }}>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Maquinaria & Marca</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Línea de Producción</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Horas de Uso</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Último Mantenimiento</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Próximo Preventivo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMaquinarias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    <Typography variant="body2">No se encontraron maquinarias</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaquinarias.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                      {row.codigo}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {row.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.marca} ({row.modelo})
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{row.linea}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.horasUso} hs</TableCell>
                    <TableCell>{row.ultimoMantenimiento}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {row.proximoMantenimiento}
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
                      <Tooltip title="Ficha técnica">
                        <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: 'text.secondary' }}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Crear Orden de Mantenimiento">
                        <IconButton size="small" onClick={() => handleOpenQuickOrder(row)} sx={{ color: 'primary.main' }}>
                          <BuildIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
      )}

      {/* Modal Dialog: Alta / Edición de Maquinaria */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <form onSubmit={handleSaveForm}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {isEditing ? `Editar Maquinaria ${selectedMaq?.codigo}` : 'Registrar Nueva Maquinaria'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Código de Equipo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nombre de la Máquina"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Marca Fabricante"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Modelo Industrial"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Línea de Producción</InputLabel>
                  <Select
                    value={formData.linea}
                    label="Línea de Producción"
                    onChange={(e) => setFormData({ ...formData, linea: e.target.value })}
                  >
                    <MenuItem value="Elaboración de Masas">Elaboración de Masas</MenuItem>
                    <MenuItem value="Armado y Relleno">Armado y Relleno</MenuItem>
                    <MenuItem value="Corte y Fraccionado">Corte y Fraccionado</MenuItem>
                    <MenuItem value="Envasado y Empaque">Envasado y Empaque</MenuItem>
                    <MenuItem value="Cocina de Salsas">Cocina de Salsas</MenuItem>
                    <MenuItem value="Secado y Curado">Secado y Curado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado Operativo</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado Operativo"
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <MenuItem value="Operativa">Operativa</MenuItem>
                    <MenuItem value="En Mantenimiento">En Mantenimiento</MenuItem>
                    <MenuItem value="En Reparación">En Reparación</MenuItem>
                    <MenuItem value="Fuera de Servicio">Fuera de Servicio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Capacidad Nominal"
                  placeholder="Ej: 50 kg por bachada, 120 kg/h"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ubicación Física en Planta"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Horas de Operación Acumuladas"
                  type="number"
                  value={formData.horasUso}
                  onChange={(e) => setFormData({ ...formData, horasUso: Number(e.target.value) })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Último Mantenimiento"
                  type="date"
                  value={formData.ultimoMantenimiento}
                  onChange={(e) => setFormData({ ...formData, ultimoMantenimiento: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Próximo Mantenimiento"
                  type="date"
                  value={formData.proximoMantenimiento}
                  onChange={(e) => setFormData({ ...formData, proximoMantenimiento: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Observaciones Técnicas y Recomendaciones"
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
              {isEditing ? 'Guardar Cambios' : 'Registrar Equipo'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Dialog: Ficha Técnica Completa */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Ficha de Equipo #{selectedMaq?.codigo}</span>
          <Chip label={selectedMaq?.estado} size="small" color={STATUS_COLOR_MAP[selectedMaq?.estado] || 'default'} />
        </DialogTitle>
        <DialogContent dividers>
          {selectedMaq && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedMaq.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMaq.marca} - Modelo: {selectedMaq.modelo}
                </Typography>
              </Box>

              <Divider />

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Línea de Producción</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedMaq.linea}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Ubicación en Planta</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedMaq.ubicacion}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Capacidad de Trabajo</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedMaq.capacidad}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Horas de Operación</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedMaq.horasUso} horas</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Última Revisión</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedMaq.ultimoMantenimiento}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Próximo Preventivo</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {selectedMaq.proximoMantenimiento}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Técnico Responsable Habitual</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedMaq.responsable}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Observaciones de Mantenimiento</Typography>
                  <Typography variant="body2">{selectedMaq.observaciones}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              setOpenDetail(false);
              handleOpenQuickOrder(selectedMaq);
            }}
            variant="contained"
            color="primary"
            startIcon={<BuildIcon />}
          >
            Crear Orden de Mantenimiento
          </Button>
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Crear Orden Rápida para esta máquina */}
      <Dialog
        open={openQuickOrder}
        onClose={() => setOpenQuickOrder(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Generar Orden de Mantenimiento para {selectedMaq?.codigo}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Equipo seleccionado: <strong>{selectedMaq?.nombre}</strong> ({selectedMaq?.ubicacion})
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de Mantenimiento</InputLabel>
                  <Select
                    value={quickOrderForm.tipo}
                    label="Tipo de Mantenimiento"
                    onChange={(e) => setQuickOrderForm({ ...quickOrderForm, tipo: e.target.value })}
                  >
                    <MenuItem value="Preventivo">Preventivo (Limpieza/Lubricación)</MenuItem>
                    <MenuItem value="Correctivo">Correctivo (Reparación de Avería)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Prioridad</InputLabel>
                  <Select
                    value={quickOrderForm.prioridad}
                    label="Prioridad"
                    onChange={(e) => setQuickOrderForm({ ...quickOrderForm, prioridad: e.target.value })}
                  >
                    <MenuItem value="Baja">Baja</MenuItem>
                    <MenuItem value="Media">Media</MenuItem>
                    <MenuItem value="Alta">Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Técnico Responsable Asignado</InputLabel>
                  <Select
                    value={quickOrderForm.tecnico}
                    label="Técnico Responsable Asignado"
                    onChange={(e) => setQuickOrderForm({ ...quickOrderForm, tecnico: e.target.value })}
                  >
                    {INITIAL_TECNICOS.map((t) => (
                      <MenuItem key={t.id} value={t.nombre}>
                        {t.nombre} ({t.especialidad} - Turno {t.turno})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="Descripción de la Tarea / Síntoma de Falla"
                  value={quickOrderForm.tarea}
                  onChange={(e) => setQuickOrderForm({ ...quickOrderForm, tarea: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenQuickOrder(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmQuickOrder} variant="contained" color="primary">
            Emitir Orden
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Confirmar Eliminación */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmar Baja de Equipo</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Está seguro de que desea eliminar la máquina <strong>{selectedMaq?.codigo} - {selectedMaq?.nombre}</strong> del inventario de planta?
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

export default MaquinariaScreen;
