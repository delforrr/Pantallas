import { useState, useMemo } from 'react';
import { FormDialog, FormSection, RecordIcon } from '../../components/shared/ModuleUI';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import NotesIcon from '@mui/icons-material/Notes';

import {
  RECETAS_INICIALES,
  PRODUCTOS_FABRICABLES,
  TIPOS_PRODUCTO,
} from './mockData';

const CATEGORIAS = ['Todas', 'Pastas Rellenas', 'Pastas Simples'];
const TIPOS_CON_PRODUCTOS = TIPOS_PRODUCTO.filter(tipo =>
  PRODUCTOS_FABRICABLES.some(producto => producto.categoria === tipo.tipoProducto)
);

export const RecetasScreen = () => {
  const [recetas, setRecetas] = useState(RECETAS_INICIALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Modal Ver Detalle de Materia Prima y Pasos
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
    pasos: '',
    ingredientes: [],
  });

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
      pasos:
        '1. Pesar y tamizar los ingredientes secos en tolva de carga.\n2. Incorporar líquidos/huevos y amasar durante 12-15 minutos.\n3. Laminar la masa en sobadora hasta el espesor uniforme deseado.\n4. Conformar el producto en la línea de producción correspondiente.\n5. Control de calidad y envasado en cajas térmicas de 1 kg.',
      ingredientes: [],
    });
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
        ? receta.pasos.join('\n')
        : (receta.pasos || ''),
      ingredientes: [...receta.ingredientes],
    });
    setModalOpen(true);
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
                pasos: typeof formState.pasos === 'string' ? formState.pasos.trim() : (formState.pasos || ''),
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
        pasos: typeof formState.pasos === 'string' ? formState.pasos.trim() : (formState.pasos || ''),
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
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Materias Primas</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Instrucciones / Pasos</TableCell>
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
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Tooltip title={receta.nombreProducto}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 190,
                        }}
                      >
                        {receta.nombreProducto}
                      </Typography>
                    </Tooltip>
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
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {receta.ingredientes?.length || 0} materias primas
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        Array.isArray(receta.pasos)
                          ? receta.pasos.join('\n')
                          : (receta.pasos || 'Sin instrucciones registradas')
                      }
                      arrow
                      placement="top-start"
                    >
                      <Box
                        sx={{
                          maxWidth: 240,
                          p: 0.6,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <NotesIcon fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            color: receta.pasos ? 'text.primary' : 'text.disabled',
                            fontStyle: receta.pasos ? 'normal' : 'italic',
                            fontWeight: 500,
                          }}
                        >
                          {typeof receta.pasos === 'string'
                            ? (receta.pasos.split('\n')[0] || 'Sin instrucciones')
                            : (Array.isArray(receta.pasos) && receta.pasos.length > 0
                                ? receta.pasos[0]
                                : 'Sin instrucciones')}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                      <RecordIcon label="Ver receta" color="default" onClick={() => setViewingReceta(receta)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </RecordIcon>
                      <RecordIcon label="Editar receta" color="primary" onClick={() => handleOpenEdit(receta)}>
                        <EditIcon fontSize="small" />
                      </RecordIcon>
                      <RecordIcon label="Eliminar receta" color="error" onClick={() => setDeleteConfirmId(receta.id)}>
                        <DeleteIcon fontSize="small" />
                      </RecordIcon>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Ver Detalle de Materia Prima y Pasos de la Receta */}
      <Dialog
        open={Boolean(viewingReceta)}
        onClose={() => setViewingReceta(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotesIcon color="primary" />
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
                  <TableCell sx={{ fontWeight: 700 }}>Materia Prima</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Cantidad
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

          {/* Instrucciones y Pasos de Elaboración (Texto Libre) */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotesIcon color="primary" fontSize="small" />
            Instrucciones y Pasos de Elaboración:
          </Typography>
          {(!viewingReceta?.pasos || (Array.isArray(viewingReceta.pasos) && viewingReceta.pasos.length === 0)) ? (
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: '10px' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Esta receta aún no cuenta con instrucciones ni pasos de elaboración registrados.
              </Typography>
            </Paper>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: '10px',
                bgcolor: 'background.paper',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                  color: 'text.primary',
                }}
              >
                {Array.isArray(viewingReceta.pasos)
                  ? viewingReceta.pasos.join('\n')
                  : viewingReceta.pasos}
              </Typography>
            </Paper>
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

      <FormDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingReceta ? `Editar ${editingReceta.nombreProducto}` : 'Nueva receta'}
        maxWidth="md"
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
        action={editingReceta ? 'Guardar cambios' : 'Crear receta'}
      >
        <FormSection number={1} title="Producto y rendimiento">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                select
                size="small"
                label="Tipo de producto"
                value={formState.categoria}
                onChange={(event) => setFormState(prev => ({
                  ...prev,
                  categoria: event.target.value,
                  nombreProducto: '',
                  codigoProducto: '',
                }))}
              >
                {TIPOS_CON_PRODUCTOS.map(tipo => (
                  <MenuItem key={tipo.idTipoDeProducto} value={tipo.tipoProducto}>
                    {tipo.tipoProducto}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                select
                size="small"
                label="Producto"
                value={formState.codigoProducto}
                required
                autoFocus
                onChange={(event) => {
                  const producto = PRODUCTOS_FABRICABLES.find(item => item.codigo === event.target.value);
                  setFormState(prev => ({
                    ...prev,
                    nombreProducto: producto?.nombre || '',
                    codigoProducto: producto?.codigo || '',
                  }));
                }}
              >
                {PRODUCTOS_FABRICABLES
                  .filter(producto => producto.categoria === formState.categoria)
                  .map(producto => (
                    <MenuItem key={producto.codigo} value={producto.codigo}>
                      {producto.nombre}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Rendimiento (kg)"
                value={formState.rendimientoBase}
                onChange={(e) => setFormState({ ...formState, rendimientoBase: Number(e.target.value) })}
              />
            </Grid>
            {editingReceta && (
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Tiempo (min)"
                  value={formState.tiempoElaboracionMin}
                  onChange={(e) => setFormState({ ...formState, tiempoElaboracionMin: Number(e.target.value) })}
                />
              </Grid>
            )}
          </Grid>
        </FormSection>
        <FormSection number={2} title="Ingredientes y elaboración">
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              {formState.ingredientes.length === 0 ? (
                <Alert severity="info" sx={{ py: 0 }}>Aún no hay materias primas asociadas.</Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 0.5 }}>
                  {formState.ingredientes.map((ing) => (
                    <Paper key={ing.materiaPrimaId} variant="outlined" sx={{ px: 0.75, py: 0.35, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, minWidth: 0 }}>
                      <Typography variant="caption" noWrap title={ing.nombre} sx={{ minWidth: 0, fontWeight: 600 }}>
                        {ing.nombre}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>{ing.cantidad} {ing.unidad}</Typography>
                        <IconButton size="small" aria-label={`Quitar ${ing.nombre}`} onClick={() => handleRemoveIngrediente(ing.materiaPrimaId)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={5}
                maxRows={5}
                label="Pasos de elaboración"
                placeholder="Describí el procedimiento de elaboración"
                value={formState.pasos}
                onChange={(e) => setFormState((prev) => ({ ...prev, pasos: e.target.value }))}
              />
            </Grid>
          </Grid>
        </FormSection>
      </FormDialog>

      {/* Diálogo de Confirmación de Borrado */}
      <Dialog
        open={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{ sx: { borderRadius: '14px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar receta?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Esta acción eliminará la fórmula y lista de materias primas de este producto. Podrás volver a darla de alta más tarde si es necesario.
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
