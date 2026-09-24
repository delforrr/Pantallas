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
  Snackbar,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { PRODUCTOS_INICIALES, RECETAS_INICIALES } from './mockData';
import { useApp } from '../../context/AppContext';

const CATEGORIAS = ['Todas', 'Pastas Rellenas', 'Pastas Simples', 'Otros'];
const ESTADOS = ['Todos', 'Activo', 'Inactivo'];

export const ProductosCompuestosScreen = () => {
  const { navigate } = useApp();

  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [selectedEstado, setSelectedEstado] = useState('Todos');

  // Modal Ver Detalle de Producto
  const [viewingProducto, setViewingProducto] = useState(null);

  // Modal Ver Receta de un Producto
  const [recetaModalProducto, setRecetaModalProducto] = useState(null);

  // Modal Alta / Edición
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [formState, setFormState] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Pastas Rellenas',
    recetaId: 'REC-001',
    presentacion: 'Caja x 1 kg',
    precioVenta: 5000,
    unidadMedida: 'kg',
    vidaUtil: '48 hs fresco / 90 días freezer',
    estado: 'Activo',
    descripcion: '',
  });

  // Diálogo confirmación eliminación
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Notificación Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Estadísticas para badges de resumen en barra de herramientas
  const stats = useMemo(() => {
    const total = productos.length;
    const activos = productos.filter((p) => p.estado === 'Activo').length;
    const rellenas = productos.filter((p) => p.categoria === 'Pastas Rellenas').length;
    const simples = productos.filter((p) => p.categoria === 'Pastas Simples').length;
    const otros = productos.filter((p) => p.categoria === 'Otros').length;
    return { total, activos, rellenas, simples, otros };
  }, [productos]);

  // Filtrado reactivo en memoria
  const filteredProductos = useMemo(() => {
    return productos.filter((p) => {
      const matchCat = selectedCategoria === 'Todas' || p.categoria === selectedCategoria;
      const matchEst = selectedEstado === 'Todos' || p.estado === selectedEstado;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        p.nombre.toLowerCase().includes(term) ||
        p.codigo.toLowerCase().includes(term) ||
        (p.recetaNombre && p.recetaNombre.toLowerCase().includes(term)) ||
        (p.presentacion && p.presentacion.toLowerCase().includes(term));
      return matchCat && matchEst && matchSearch;
    });
  }, [productos, searchTerm, selectedCategoria, selectedEstado]);

  // Abrir modal de receta
  const handleOpenRecetaModal = (prod) => {
    setRecetaModalProducto(prod);
  };

  // Navegar a la sección de Recetas
  const handleIrAApartadoRecetas = () => {
    setRecetaModalProducto(null);
    navigate('recetas');
  };

  // Abrir modal para crear
  const handleOpenCreate = () => {
    const maxNum = productos.reduce((max, p) => {
      const match = (p.codigo || '').match(/PRD-(\d+)/i);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const nextNum = maxNum + 1;
    const nextCode = `PRD-${String(nextNum).padStart(3, '0')}`;

    setEditingProducto(null);
    setFormState({
      codigo: nextCode,
      nombre: '',
      categoria: 'Pastas Rellenas',
      presentacion: 'Caja x 1 kg',
      precioVenta: 5500,
      unidadMedida: 'kg',
      vidaUtil: '48 hs fresco / 90 días freezer',
      estado: 'Activo',
      descripcion: '',
    });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (prod) => {
    setEditingProducto(prod);
    setFormState({
      codigo: prod.codigo,
      nombre: prod.nombre,
      categoria: prod.categoria,
      presentacion: prod.presentacion || 'Caja x 1 kg',
      precioVenta: prod.precioVenta || 0,
      unidadMedida: prod.unidadMedida || 'kg',
      vidaUtil: prod.vidaUtil || '48 hs fresco',
      estado: prod.estado || 'Activo',
      descripcion: prod.descripcion || '',
    });
    setModalOpen(true);
  };

  // Guardar alta o modificación
  const handleSave = () => {
    if (!formState.nombre.trim() || !formState.codigo.trim()) {
      setSnackbar({ open: true, message: 'El código y el nombre son obligatorios.', severity: 'error' });
      return;
    }

    const esOtros = formState.categoria === 'Otros';

    if (editingProducto) {
      const recetaIdFinal = esOtros ? null : editingProducto.recetaId;
      const recetaNombreFinal = esOtros
        ? 'No requiere (Producto listo / reventa)'
        : editingProducto.recetaNombre || 'Sin receta asignada';

      setProductos((prev) =>
        prev.map((p) =>
          p.id === editingProducto.id
            ? {
                ...p,
                ...formState,
                recetaId: recetaIdFinal,
                recetaNombre: recetaNombreFinal,
                precioVenta: Number(formState.precioVenta) || 0,
              }
            : p
        )
      );
      setSnackbar({ open: true, message: `Producto "${formState.nombre}" actualizado con éxito.`, severity: 'success' });
    } else {
      const nuevo = {
        id: formState.codigo,
        ...formState,
        recetaId: null,
        recetaNombre: esOtros ? 'No requiere (Producto listo / reventa)' : 'Sin receta asignada',
        precioVenta: Number(formState.precioVenta) || 0,
        stockActual: 0,
      };
      setProductos((prev) => [nuevo, ...prev]);
      setSnackbar({ open: true, message: `Producto "${formState.nombre}" creado exitosamente.`, severity: 'success' });
    }
    setModalOpen(false);
  };

  // Confirmar eliminación
  const handleDelete = () => {
    setProductos((prev) => prev.filter((p) => p.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    setSnackbar({ open: true, message: 'Producto eliminado correctamente del sistema.', severity: 'info' });
  };

  // Datos de la receta activa en el modal
  const recetaActiva = useMemo(() => {
    if (!recetaModalProducto || !recetaModalProducto.recetaId) return null;
    return RECETAS_INICIALES.find((r) => r.id === recetaModalProducto.recetaId) || null;
  }, [recetaModalProducto]);

  return (
    <Box>
      {/* ── Barra de Búsqueda, Filtros y Resumen con Chips ── */}
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
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flex: 1, minWidth: 280, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Buscar por código, nombre, receta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: '100%', sm: 220 }, bgcolor: 'background.paper' }}
          />

          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
            <InputLabel id="filtro-categoria-label">Categoría</InputLabel>
            <Select
              labelId="filtro-categoria-label"
              value={selectedCategoria}
              label="Categoría"
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              {CATEGORIAS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130, bgcolor: 'background.paper' }}>
            <InputLabel id="filtro-estado-label">Estado</InputLabel>
            <Select
              labelId="filtro-estado-label"
              value={selectedEstado}
              label="Estado"
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              {ESTADOS.map((est) => (
                <MenuItem key={est} value={est}>
                  {est}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Badges / Chips discretos de resumen con colores diferenciados y sobrios */}
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
              color="success"
              icon={<CheckCircleIcon sx={{ fontSize: '0.85rem !important' }} />}
              label={`Activos: ${stats.activos}`}
              sx={{ fontWeight: 600, fontSize: '0.8rem' }}
            />
            <Chip
              size="small"
              variant="outlined"
              color="default"
              label={`Rellenas: ${stats.rellenas}`}
              sx={{ fontWeight: 600, fontSize: '0.8rem' }}
            />
            <Chip
              size="small"
              variant="outlined"
              color="default"
              label={`Simples: ${stats.simples}`}
              sx={{ fontWeight: 600, fontSize: '0.8rem' }}
            />
            <Chip
              size="small"
              variant="outlined"
              color="default"
              label={`Otros: ${stats.otros}`}
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
            whiteSpace: 'nowrap',
          }}
        >
          Nuevo Producto
        </Button>
      </Box>

      {/* ── Tabla Principal de Productos ─────────────────────── */}
      {filteredProductos.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '14px',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CategoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            No se encontraron productos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Intentá ajustando los filtros o creá un nuevo producto para la fábrica.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{
            borderRadius: '14px',
            border: '1px solid',
            borderColor: 'divider',
            overflowX: 'auto',
            width: '100%',
          }}
        >
          <Table sx={{ width: '100%' }} size="medium">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 95, whiteSpace: 'nowrap' }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 130, whiteSpace: 'nowrap' }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 140, whiteSpace: 'nowrap' }}>Receta</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 110, whiteSpace: 'nowrap' }}>Presentación</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 110, whiteSpace: 'nowrap' }}>Precio Sugerido</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 105, whiteSpace: 'nowrap' }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, width: 125, minWidth: 125, whiteSpace: 'nowrap' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProductos.map((prod) => (
                <TableRow key={prod.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {prod.codigo}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {prod.nombre}
                    </Typography>
                    {prod.descripcion && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', maxWidth: 280 }} noWrap>
                        {prod.descripcion}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                    <Chip
                      label={prod.categoria}
                      size="small"
                      color="default"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                    {prod.categoria === 'Otros' ? (
                      <Chip
                        size="small"
                        label="No requiere"
                        variant="outlined"
                        color="default"
                        sx={{ fontSize: '0.72rem', opacity: 0.7 }}
                      />
                    ) : prod.recetaId ? (
                      <Tooltip title={`Ver receta vinculada (${prod.recetaId}) o cambiarla`}>
                        <Chip
                          icon={<MenuBookIcon style={{ fontSize: 14 }} />}
                          label={prod.recetaId}
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenRecetaModal(prod)}
                          sx={{ fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Asignar una receta de producción">
                        <Chip
                          icon={<AddIcon style={{ fontSize: 14 }} />}
                          label="Asignar"
                          size="small"
                          variant="outlined"
                          color="warning"
                          onClick={() => handleOpenRecetaModal(prod)}
                          sx={{ fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                    <Typography variant="body2">{prod.presentacion}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      ${prod.precioVenta?.toLocaleString('es-AR')}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                    {prod.estado === 'Activo' ? (
                      <Chip
                        icon={<CheckCircleIcon style={{ fontSize: 16 }} />}
                        label="Activo"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    ) : (
                      <Chip
                        icon={<CancelIcon style={{ fontSize: 16 }} />}
                        label="Inactivo"
                        size="small"
                        color="default"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap', width: 125, minWidth: 125, py: 1.5 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.2, flexWrap: 'nowrap' }}>
                      <Tooltip title="Ver Detalle del Producto">
                        <IconButton
                          size="small"
                          onClick={() => setViewingProducto(prod)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar Producto">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(prod)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar Producto">
                        <IconButton
                          size="small"
                          color="default"
                          onClick={() => setDeleteConfirmId(prod.id)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Modal: Ver Receta del Producto ───────────────────── */}
      <Dialog
        open={Boolean(recetaModalProducto)}
        onClose={() => setRecetaModalProducto(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        {recetaModalProducto && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon color="primary" />
              Receta de Producción: {recetaModalProducto.nombre}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2.5 }}>
              {recetaActiva ? (
                <Box>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: '10px', bgcolor: 'action.hover', mb: 2 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                          CÓDIGO: {recetaActiva.id}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.3 }}>
                          {recetaActiva.nombreProducto}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={recetaActiva.categoria}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1.5, color: 'text.secondary' }}>
                      <Typography variant="caption">
                        Lote base: <strong>{recetaActiva.rendimientoBase} kg</strong>
                      </Typography>
                      <Typography variant="caption">
                        Tiempo estimado: <strong>~{recetaActiva.tiempoElaboracionMin} min</strong>
                      </Typography>
                    </Box>
                  </Paper>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Materias Primas Requeridas ({recetaActiva.ingredientes?.length || 0}):
                  </Typography>
                  <List dense disablePadding sx={{ bgcolor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
                    {recetaActiva.ingredientes?.map((ing, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          py: 0.8,
                          px: 2,
                          borderBottom: idx < recetaActiva.ingredientes.length - 1 ? '1px dashed' : 'none',
                          borderColor: 'divider',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <ListItemText
                          primary={ing.nombre}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {ing.cantidad} {ing.unidad}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: '10px' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Este producto no tiene una receta de elaboración asociada actualmente.
                  </Typography>
                </Paper>
              )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<OpenInNewIcon />}
                onClick={handleIrAApartadoRecetas}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Cambiar en Recetas
              </Button>
              <Button
                onClick={() => setRecetaModalProducto(null)}
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Modal: Alta / Edición de Producto ────────────────── */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingProducto ? `Editar Producto: ${editingProducto.nombre}` : 'Nuevo Producto'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Código"
                fullWidth
                size="small"
                value={formState.codigo}
                disabled
                helperText="Asignado automáticamente"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre del Producto"
                fullWidth
                size="small"
                value={formState.nombre}
                onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                placeholder="Ej. Raviolones de Pollo y Verdura"
                required
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Categoría"
                fullWidth
                size="small"
                value={formState.categoria}
                onChange={(e) => setFormState({ ...formState, categoria: e.target.value })}
              >
                <MenuItem value="Pastas Rellenas">Pastas Rellenas</MenuItem>
                <MenuItem value="Pastas Simples">Pastas Simples</MenuItem>
                <MenuItem value="Otros">Otros (No requiere receta)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Presentación"
                fullWidth
                size="small"
                value={formState.presentacion}
                onChange={(e) => setFormState({ ...formState, presentacion: e.target.value })}
                placeholder="Ej. Caja x 1 kg"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio Sugerido ($)"
                type="number"
                fullWidth
                size="small"
                value={formState.precioVenta}
                onChange={(e) => setFormState({ ...formState, precioVenta: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Estado"
                fullWidth
                size="small"
                value={formState.estado}
                onChange={(e) => setFormState({ ...formState, estado: e.target.value })}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Vida Útil / Conservación"
                fullWidth
                size="small"
                value={formState.vidaUtil}
                onChange={(e) => setFormState({ ...formState, vidaUtil: e.target.value })}
                placeholder="Ej. 48 hs refrigerado / 90 días freezer"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                size="small"
                value={formState.descripcion}
                onChange={(e) => setFormState({ ...formState, descripcion: e.target.value })}
                placeholder="Breve descripción o notas del producto"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalOpen(false)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 3 }}
          >
            {editingProducto ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Detalle de Producto ───────────────────────── */}
      <Dialog
        open={Boolean(viewingProducto)}
        onClose={() => setViewingProducto(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        {viewingProducto && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {viewingProducto.codigo}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {viewingProducto.nombre}
                </Typography>
              </Box>
              {viewingProducto.estado === 'Activo' ? (
                <Chip
                  icon={<CheckCircleIcon style={{ fontSize: 16 }} />}
                  label="Activo"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              ) : (
                <Chip
                  icon={<CancelIcon style={{ fontSize: 16 }} />}
                  label="Inactivo"
                  size="small"
                  color="default"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Categoría
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {viewingProducto.categoria}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Presentación
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {viewingProducto.presentacion}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoneyIcon fontSize="inherit" /> Precio de Venta
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.2 }}>
                      ${viewingProducto.precioVenta?.toLocaleString('es-AR')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Inventory2OutlinedIcon fontSize="inherit" /> Stock en Almacén
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.2 }}>
                      {viewingProducto.stockActual} {viewingProducto.unidadMedida}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <MenuBookIcon fontSize="small" color="primary" /> Receta de Producción Asociada
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {viewingProducto.recetaNombre || 'Sin receta vinculada'}
                      </Typography>
                      {viewingProducto.recetaId && (
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<OpenInNewIcon fontSize="small" />}
                          onClick={() => {
                            setViewingProducto(null);
                            handleOpenRecetaModal(viewingProducto);
                          }}
                          sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                        >
                          Ver / Cambiar
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Conservación y Vida Útil:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.2 }}>
                    {viewingProducto.vidaUtil}
                  </Typography>
                </Grid>

                {viewingProducto.descripcion && (
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Descripción:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.2, color: 'text.primary' }}>
                      {viewingProducto.descripcion}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setViewingProducto(null)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Cerrar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => {
                  const prod = viewingProducto;
                  setViewingProducto(null);
                  handleOpenEdit(prod);
                }}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
              >
                Editar Producto
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Modal Confirmación Eliminación ───────────────────── */}
      <Dialog
        open={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseás eliminar este producto? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmId(null)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar Notificaciones ─────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductosCompuestosScreen;
