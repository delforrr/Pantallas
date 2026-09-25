import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Grid,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

import { RECETAS_INICIALES, MATERIAS_PRIMAS_INICIALES, PRODUCTOS_FABRICABLES } from './mockData';

const CATEGORIAS = ['Todas', 'Pastas Rellenas', 'Pastas Simples'];

export const RecetasScreen = () => {
  const [recetas, setRecetas] = useState(RECETAS_INICIALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Modal Ver Detalle de Insumos y Pasos
  const [viewingReceta, setViewingReceta] = useState(null);

  // Modal Alta / Edición
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReceta, setEditingReceta] = useState(null);
  const [formState, setFormState] = useState({
    nombreProducto: '',
    codigoProducto: '',
    categoria: 'Pastas Rellenas',
    rendimientoBase: 10,
    tiempoElaboracionMin: 60,
    pasos: [],
    ingredientes: [],
  });

  // Paso en construcción dentro del modal
  const [nuevoPasoText, setNuevoPasoText] = useState('');

  // Ingrediente en construcción dentro del modal
  const [selectedMPId, setSelectedMPId] = useState('');
  const [cantidadMP, setCantidadMP] = useState('');

  // Diálogo confirmación eliminación
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Notificación Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filtrado reactivo en memoria
  const filteredRecetas = useMemo(() => {
    return recetas.filter((r) => {
      const matchesCategory =
        selectedCategory === 'Todas' || r.categoria === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        r.nombreProducto.toLowerCase().includes(term) ||
        r.codigoProducto?.toLowerCase().includes(term) ||
        r.ingredientes.some((ing) => ing.nombre.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [recetas, searchTerm, selectedCategory]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = recetas.length;
    const rellenas = recetas.filter((r) => r.categoria === 'Pastas Rellenas').length;
    const simples = recetas.filter((r) => r.categoria === 'Pastas Simples').length;
    return { total, rellenas, simples };
  }, [recetas]);

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingReceta(null);
    setFormState({
      nombreProducto: '',
      codigoProducto: '',
      categoria: 'Pastas Rellenas',
      rendimientoBase: 10,
      tiempoElaboracionMin: 60,
      pasos: [
        'Pesar y tamizar los ingredientes secos en tolva de carga.',
        'Incorporar líquidos/huevos y amasar durante 12-15 minutos.',
        'Laminar la masa en sobadora hasta el espesor uniforme deseado.',
        'Conformar el producto en la línea de producción correspondiente.',
        'Control de calidad y envasado en cajas térmicas de 1 kg.',
      ],
      ingredientes: [],
    });
    setNuevoPasoText('');
    setSelectedMPId('');
    setCantidadMP('');
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (receta) => {
    setEditingReceta(receta);
    setFormState({
      nombreProducto: receta.nombreProducto,
      codigoProducto: receta.codigoProducto,
      categoria: receta.categoria,
      rendimientoBase: receta.rendimientoBase,
      tiempoElaboracionMin: receta.tiempoElaboracionMin,
      pasos: Array.isArray(receta.pasos)
        ? [...receta.pasos]
        : typeof receta.pasos === 'string'
        ? receta.pasos.split('\n').filter(Boolean)
        : [
            'Pesar y tamizar ingredientes.',
            'Amasar hasta lograr masa homogénea.',
            'Laminar en sobadora.',
            'Moldear y envasar.',
          ],
      ingredientes: [...receta.ingredientes],
    });
    setNuevoPasoText('');
    setSelectedMPId('');
    setCantidadMP('');
    setModalOpen(true);
  };

  // Agregar paso al formulario
  const handleAddPaso = () => {
    if (!nuevoPasoText.trim()) return;
    setFormState((prev) => ({
      ...prev,
      pasos: [...(prev.pasos || []), nuevoPasoText.trim()],
    }));
    setNuevoPasoText('');
  };

  // Quitar paso del formulario
  const handleRemovePaso = (index) => {
    setFormState((prev) => ({
      ...prev,
      pasos: (prev.pasos || []).filter((_, i) => i !== index),
    }));
  };

  // Agregar ingrediente al formulario
  const handleAddIngrediente = () => {
    if (!selectedMPId || !cantidadMP || Number(cantidadMP) <= 0) return;
    const mp = MATERIAS_PRIMAS_INICIALES.find((m) => m.id === selectedMPId);
    if (!mp) return;

    const existsIndex = formState.ingredientes.findIndex((i) => i.materiaPrimaId === selectedMPId);
    if (existsIndex >= 0) {
      const updated = [...formState.ingredientes];
      updated[existsIndex].cantidad = Number(cantidadMP);
      setFormState({ ...formState, ingredientes: updated });
    } else {
      setFormState({
        ...formState,
        ingredientes: [
          ...formState.ingredientes,
          {
            materiaPrimaId: mp.id,
            nombre: mp.nombre,
            cantidad: Number(cantidadMP),
            unidad: mp.unidad,
          },
        ],
      });
    }

    setSelectedMPId('');
    setCantidadMP('');
  };

  // Quitar ingrediente
  const handleRemoveIngrediente = (mpId) => {
    setFormState({
      ...formState,
      ingredientes: formState.ingredientes.filter((i) => i.materiaPrimaId !== mpId),
    });
  };

  // Guardar receta (Crear o Actualizar)
  const handleSave = () => {
    if (!formState.nombreProducto.trim()) {
      setSnackbar({ open: true, message: 'Ingresa el nombre del producto', severity: 'warning' });
      return;
    }
    if (formState.ingredientes.length === 0) {
      setSnackbar({
        open: true,
        message: 'Debes añadir al menos una materia prima a la receta',
        severity: 'warning',
      });
      return;
    }

    if (editingReceta) {
      setRecetas((prev) =>
        prev.map((r) =>
          r.id === editingReceta.id
            ? {
                ...r,
                ...formState,
                pasos: formState.pasos || [],
              }
            : r
        )
      );
      setSnackbar({ open: true, message: 'Receta actualizada exitosamente', severity: 'success' });
    } else {
      const newReceta = {
        id: `REC-00${recetas.length + 1}`,
        idReceta: recetas.length + 1,
        ...formState,
        pasos: formState.pasos || [],
      };
      setRecetas((prev) => [newReceta, ...prev]);
      setSnackbar({ open: true, message: 'Nueva receta creada exitosamente', severity: 'success' });
    }

    setModalOpen(false);
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    setRecetas((prev) => prev.filter((r) => r.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    setSnackbar({ open: true, message: 'Receta eliminada del catálogo', severity: 'info' });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* Barra de Búsqueda, Filtros con Chips y Acción Principal */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Buscar por producto, código o ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: { xs: '1 1 100%', sm: 1 }, minWidth: { xs: '100%', sm: 200 }, bgcolor: 'background.paper' }}
          />

          <TextField
            select
            size="small"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, minWidth: { xs: '100%', sm: 150 }, bgcolor: 'background.paper' }}
          >
            {CATEGORIAS.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {/* Badges / Chips discretos de resumen */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: { sm: 1 }, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={`Total: ${stats.total}`}
              sx={{
                fontWeight: 600,
                fontSize: '0.8rem',
                bgcolor: 'action.selected',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              label={`Rellenas: ${stats.rellenas}`}
              sx={{ fontWeight: 600, fontSize: '0.8rem' }}
            />
            <Chip
              size="small"
              variant="outlined"
              label={`Simples: ${stats.simples}`}
              sx={{ fontWeight: 600, fontSize: '0.8rem' }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '10px',
            px: 2.5,
            py: 1,
            width: { xs: '100%', md: 'auto' },
            whiteSpace: 'nowrap',
          }}
        >
          Nueva Receta
        </Button>
      </Box>

      {/* Tabla de Recetas */}
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          overflowX: 'auto',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Table sx={{ width: '100%', minWidth: 700 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Lote Base</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Insumos</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Pasos de Elaboración</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecetas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No se encontraron recetas con los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecetas.map((receta) => (
                <TableRow
                  key={receta.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {receta.codigoProducto || receta.id}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {receta.nombreProducto}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={receta.categoria}
                      color={receta.categoria === 'Pastas Rellenas' ? 'primary' : 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {receta.rendimientoBase} kg
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                      onClick={() => setViewingReceta(receta)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: 'primary.main',
                      }}
                    >
                      {receta.ingredientes?.length || 0} insumos
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={<FormatListNumberedIcon sx={{ fontSize: '0.9rem !important' }} />}
                      label={`${Array.isArray(receta.pasos) ? receta.pasos.length : (receta.pasos || 0)} pasos`}
                      onClick={() => setViewingReceta(receta)}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' },
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="Editar receta">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(receta)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar receta">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteConfirmId(receta.id)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Ver Detalle de Insumos y Pasos de la Receta */}
      <Dialog
        open={Boolean(viewingReceta)}
        onClose={() => setViewingReceta(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatListNumberedIcon color="primary" />
          Ficha Técnica de Receta: {viewingReceta?.nombreProducto}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Código: <strong>{viewingReceta?.codigoProducto || viewingReceta?.id}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Lote Base: <strong>{viewingReceta?.rendimientoBase} kg</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Categoría: <strong>{viewingReceta?.categoria}</strong>
            </Typography>
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Materias Primas Requeridas ({viewingReceta?.ingredientes?.length || 0}):
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px', mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Materia Prima / Insumo</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Cantidad Requerida
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Unidad
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewingReceta?.ingredientes.map((ing, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontWeight: 500 }}>{ing.nombre}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {ing.cantidad}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary' }}>
                      {ing.unidad}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pasos de Elaboración */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormatListNumberedIcon color="primary" fontSize="small" />
            Pasos de Elaboración ({Array.isArray(viewingReceta?.pasos) ? viewingReceta.pasos.length : (viewingReceta?.pasos ? 1 : 0)}):
          </Typography>
          {(!viewingReceta?.pasos || (Array.isArray(viewingReceta.pasos) && viewingReceta.pasos.length === 0)) ? (
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: '10px' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Esta receta aún no cuenta con pasos de elaboración registrados.
              </Typography>
            </Paper>
          ) : (
            <List disablePadding sx={{ bgcolor: 'background.paper', borderRadius: '10px', border: '1px solid', borderColor: 'divider' }}>
              {(Array.isArray(viewingReceta.pasos) ? viewingReceta.pasos : [viewingReceta.pasos]).map((paso, idx, arr) => (
                <ListItem
                  key={idx}
                  sx={{
                    py: 1.2,
                    px: 2,
                    borderBottom: idx < arr.length - 1 ? '1px dashed' : 'none',
                    borderColor: 'divider',
                    alignItems: 'flex-start',
                  }}
                >
                  <Chip
                    size="small"
                    color="primary"
                    label={`Paso ${idx + 1}`}
                    sx={{ mr: 1.5, mt: 0.2, fontWeight: 700, fontSize: '0.75rem', height: 24 }}
                  />
                  <ListItemText
                    primary={paso}
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setViewingReceta(null)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog para Crear / Editar Receta */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingReceta ? `Editar Receta (${editingReceta.codigoProducto})` : 'Nueva Receta de Producto'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Selección de Producto Tabulado con Buscador */}
            <Grid item xs={12} sm={8}>
              <Autocomplete
                options={PRODUCTOS_FABRICABLES}
                getOptionLabel={(option) =>
                  typeof option === 'string'
                    ? option
                    : `${option.nombre} (${option.codigo})`
                }
                value={
                  PRODUCTOS_FABRICABLES.find(
                    (p) => p.nombre === formState.nombreProducto
                  ) ||
                  (formState.nombreProducto
                    ? {
                        nombre: formState.nombreProducto,
                        codigo: formState.codigoProducto,
                        categoria: formState.categoria,
                      }
                    : null)
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setFormState((prev) => ({
                      ...prev,
                      nombreProducto: newValue.nombre,
                      codigoProducto: newValue.codigo,
                      categoria: newValue.categoria || prev.categoria,
                    }));
                  } else {
                    setFormState((prev) => ({
                      ...prev,
                      nombreProducto: '',
                      codigoProducto: '',
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Producto"
                    placeholder="Escribe para buscar el producto..."
                    required
                    helperText="Selecciona un producto del catálogo"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Código Producto"
                value={formState.codigoProducto}
                disabled
                helperText="Asignado automáticamente del catálogo"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Categoría"
                value={formState.categoria}
                disabled
                helperText="Determinada por el producto"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Rendimiento Base (kg)"
                value={formState.rendimientoBase}
                onChange={(e) =>
                  setFormState({ ...formState, rendimientoBase: Number(e.target.value) })
                }
                helperText="Cantidad de kilos producidos por lote"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Tiempo Elaboración (min)"
                value={formState.tiempoElaboracionMin}
                onChange={(e) =>
                  setFormState({ ...formState, tiempoElaboracionMin: Number(e.target.value) })
                }
                helperText="Minutos estimados por lote"
              />
            </Grid>

            {/* Sección de Ingredientes / Materia Prima */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                Materias Primas e Insumos de la Receta
              </Typography>

              {/* Selector para agregar insumo */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '10px',
                  bgcolor: 'action.hover',
                  mb: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Autocomplete
                  options={MATERIAS_PRIMAS_INICIALES}
                  getOptionLabel={(option) =>
                    typeof option === 'string'
                      ? option
                      : `${option.nombre} (${option.tipo} - en ${option.unidad})`
                  }
                  value={
                    MATERIAS_PRIMAS_INICIALES.find((mp) => mp.id === selectedMPId) || null
                  }
                  onChange={(event, newValue) => {
                    setSelectedMPId(newValue ? newValue.id : '');
                  }}
                  sx={{ minWidth: 260, flex: 2 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Materia Prima / Insumo"
                      placeholder="Escribe para buscar insumo..."
                    />
                  )}
                />

                <TextField
                  size="small"
                  type="number"
                  label={
                    selectedMPId
                      ? `Cantidad (${MATERIAS_PRIMAS_INICIALES.find((m) => m.id === selectedMPId)?.unidad || ''})`
                      : 'Cantidad'
                  }
                  value={cantidadMP}
                  onChange={(e) => setCantidadMP(e.target.value)}
                  placeholder="0.0"
                  inputProps={{ step: '0.1' }}
                  sx={{ minWidth: 140, flex: 1 }}
                />

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddIngrediente}
                  disabled={!selectedMPId || !cantidadMP || Number(cantidadMP) <= 0}
                  sx={{ textTransform: 'none', fontWeight: 600, height: 40 }}
                >
                  Agregar Insumo
                </Button>
              </Box>

              {/* Lista de ingredientes agregados */}
              {formState.ingredientes.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '10px' }}>
                  Aún no agregaste insumos para esta receta. Usa el selector arriba para cargarlos.
                </Alert>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{ borderRadius: '10px', overflow: 'hidden' }}
                >
                  {formState.ingredientes.map((ing, idx) => (
                    <Box
                      key={ing.materiaPrimaId}
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom:
                          idx < formState.ingredientes.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {ing.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Proporción: {ing.cantidad} {ing.unidad} (por lote de {formState.rendimientoBase} kg)
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {ing.cantidad} {ing.unidad}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveIngrediente(ing.materiaPrimaId)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              )}
            </Grid>

            {/* Sección de Pasos de Elaboración */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormatListNumberedIcon color="primary" fontSize="small" />
                Pasos de Elaboración del Producto ({formState.pasos?.length || 0})
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                Indica la secuencia de preparación o instrucciones técnicas para elaborar el lote base de la receta.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nuevo Paso de Elaboración"
                  placeholder="Ej: Mezclar harina y semolín en amasadora durante 10 minutos..."
                  value={nuevoPasoText}
                  onChange={(e) => setNuevoPasoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPaso();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddPaso}
                  disabled={!nuevoPasoText.trim()}
                  sx={{ textTransform: 'none', fontWeight: 600, height: 40, whiteSpace: 'nowrap' }}
                >
                  Agregar Paso
                </Button>
              </Box>

              {/* Lista de pasos agregados */}
              {(!formState.pasos || formState.pasos.length === 0) ? (
                <Alert severity="info" sx={{ borderRadius: '10px' }}>
                  Aún no se han configurado pasos de elaboración para esta receta. Agrega al menos un paso.
                </Alert>
              ) : (
                <Paper variant="outlined" sx={{ borderRadius: '10px', overflow: 'hidden' }}>
                  <List disablePadding>
                    {formState.pasos.map((paso, idx) => (
                      <ListItem
                        key={idx}
                        divider={idx < formState.pasos.length - 1}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleRemovePaso(idx)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{ py: 1, px: 2 }}
                      >
                        <Chip
                          size="small"
                          color="primary"
                          label={`Paso ${idx + 1}`}
                          sx={{ mr: 1.5, fontWeight: 700, fontSize: '0.75rem', height: 24 }}
                        />
                        <ListItemText
                          primary={paso}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setModalOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {editingReceta ? 'Guardar Cambios' : 'Crear Receta'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación de Borrado */}
      <Dialog
        open={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{ sx: { borderRadius: '14px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar receta?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Esta acción eliminará la fórmula y lista de insumos de este producto. Podrás volver a darla de alta más tarde si es necesario.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteConfirmId(null)}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de retroalimentación */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecetasScreen;
