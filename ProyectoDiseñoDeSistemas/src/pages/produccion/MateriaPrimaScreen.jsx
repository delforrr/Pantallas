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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';

import { MATERIAS_PRIMAS_INICIALES } from './mockData';

const TIPOS_CATEGORIA = [
  'Todas',
  'Harinas y Cereales',
  'Frescos y Granja',
  'Lácteos',
  'Verduras',
  'Carnes',
  'Condimentos',
  'Packaging',
];

const UNIDADES_MEDIDA = ['kg', 'g', 'docenas', 'unidades', 'litros'];
const ESTADOS = ['Todos', 'Activo', 'Inactivo'];

export const MateriaPrimaScreen = () => {
  const [materiasPrimas, setMateriasPrimas] = useState(MATERIAS_PRIMAS_INICIALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('Todas');
  const [selectedEstado, setSelectedEstado] = useState('Todos');

  // Modal Ver Detalle
  const [viewingMP, setViewingMP] = useState(null);

  // Modal Ajuste / Movimiento de Stock
  const [stockModalMP, setStockModalMP] = useState(null);
  const [stockMovimientoMP, setStockMovimientoMP] = useState({
    tipo: 'Ingreso',
    cantidad: '',
    motivo: '',
  });

  // Modal Alta / Edición
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMP, setEditingMP] = useState(null);
  const [formState, setFormState] = useState({
    codigo: '',
    nombre: '',
    marca: '',
    tipo: 'Harinas y Cereales',
    unidad: 'kg',
    stockActual: 0,
    stockMinimo: 10,
    estado: 'Activo',
    descripcion: '',
  });

  // Diálogo confirmación eliminación
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Notificación Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Abrir modal de ajuste de stock
  const handleOpenStockModal = (mp) => {
    setStockModalMP(mp);
    setStockMovimientoMP({
      tipo: 'Ingreso',
      cantidad: '',
      motivo: '',
    });
  };

  // Guardar ajuste de stock en memoria
  const handleSaveStockAdjustment = () => {
    if (!stockModalMP) return;
    const cant = Number(stockMovimientoMP.cantidad);
    if (isNaN(cant) || (cant <= 0 && stockMovimientoMP.tipo !== 'Ajuste Directo')) {
      setSnackbar({ open: true, message: 'Ingrese una cantidad válida mayor a 0.', severity: 'error' });
      return;
    }
    if (stockMovimientoMP.tipo === 'Ajuste Directo' && (isNaN(cant) || cant < 0)) {
      setSnackbar({ open: true, message: 'El valor de recuento físico debe ser 0 o superior.', severity: 'error' });
      return;
    }

    const currentStock = Number(stockModalMP.stockActual) || 0;
    let nuevoStock = currentStock;

    if (stockMovimientoMP.tipo === 'Ingreso') {
      nuevoStock = currentStock + cant;
    } else if (stockMovimientoMP.tipo === 'Egreso') {
      if (cant > currentStock) {
        setSnackbar({
          open: true,
          message: `No se puede egresar más de las existencias actuales (${currentStock} ${stockModalMP.unidad}).`,
          severity: 'error',
        });
        return;
      }
      nuevoStock = currentStock - cant;
    } else if (stockMovimientoMP.tipo === 'Ajuste Directo') {
      nuevoStock = cant;
    }

    setMateriasPrimas((prev) =>
      prev.map((m) => (m.id === stockModalMP.id ? { ...m, stockActual: nuevoStock } : m))
    );

    setSnackbar({
      open: true,
      message: `Stock de "${stockModalMP.nombre}" actualizado a ${nuevoStock} ${stockModalMP.unidad}.`,
      severity: 'success',
    });
    setStockModalMP(null);
  };

  // Cálculo del stock proyectado para preview en modal
  const proyectedStockMP = useMemo(() => {
    if (!stockModalMP) return 0;
    const current = Number(stockModalMP.stockActual) || 0;
    const cant = Number(stockMovimientoMP.cantidad) || 0;
    if (stockMovimientoMP.tipo === 'Ingreso') return current + cant;
    if (stockMovimientoMP.tipo === 'Egreso') return Math.max(0, current - cant);
    if (stockMovimientoMP.tipo === 'Ajuste Directo') return cant;
    return current;
  }, [stockModalMP, stockMovimientoMP]);

  // Estadísticas discretas de resumen
  const stats = useMemo(() => {
    const total = materiasPrimas.length;
    const bajoStock = materiasPrimas.filter((m) => Number(m.stockActual) <= Number(m.stockMinimo)).length;
    return { total, bajoStock };
  }, [materiasPrimas]);

  // Filtrado reactivo en memoria
  const filteredMateriasPrimas = useMemo(() => {
    return materiasPrimas.filter((mp) => {
      const matchTipo = selectedTipo === 'Todas' || mp.tipo === selectedTipo;
      const matchEstado = selectedEstado === 'Todos' || mp.estado === selectedEstado;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        mp.nombre.toLowerCase().includes(term) ||
        mp.codigo.toLowerCase().includes(term) ||
        (mp.marca && mp.marca.toLowerCase().includes(term)) ||
        mp.tipo.toLowerCase().includes(term);
      return matchTipo && matchEstado && matchSearch;
    });
  }, [materiasPrimas, searchTerm, selectedTipo, selectedEstado]);

  // Abrir modal para crear
  const handleOpenCreate = () => {
    const maxNum = materiasPrimas.reduce((max, m) => {
      const match = (m.codigo || m.id || '').match(/MP-(\d+)/i);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const nextNum = maxNum + 1;
    const nextCode = `MP-${String(nextNum).padStart(3, '0')}`;

    setEditingMP(null);
    setFormState({
      codigo: nextCode,
      nombre: '',
      marca: '',
      tipo: 'Harinas y Cereales',
      unidad: 'kg',
      stockActual: 50,
      stockMinimo: 20,
      estado: 'Activo',
      descripcion: '',
    });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (mp) => {
    setEditingMP(mp);
    setFormState({
      codigo: mp.codigo || mp.id,
      nombre: mp.nombre,
      marca: mp.marca || '',
      tipo: mp.tipo,
      unidad: mp.unidad,
      stockActual: mp.stockActual,
      stockMinimo: mp.stockMinimo,
      estado: mp.estado || 'Activo',
      descripcion: mp.descripcion || '',
    });
    setModalOpen(true);
  };

  // Guardar alta o modificación
  const handleSave = () => {
    if (!formState.nombre.trim() || !formState.codigo.trim()) {
      setSnackbar({ open: true, message: 'El código y el nombre son obligatorios.', severity: 'error' });
      return;
    }

    if (editingMP) {
      setMateriasPrimas((prev) =>
        prev.map((m) =>
          m.id === editingMP.id
            ? {
                ...m,
                ...formState,
                stockActual: Number(formState.stockActual) || 0,
                stockMinimo: Number(formState.stockMinimo) || 0,
              }
            : m
        )
      );
      setSnackbar({ open: true, message: `Materia prima "${formState.nombre}" actualizada con éxito.`, severity: 'success' });
    } else {
      const nuevo = {
        id: formState.codigo,
        ...formState,
        stockActual: Number(formState.stockActual) || 0,
        stockMinimo: Number(formState.stockMinimo) || 0,
      };
      setMateriasPrimas((prev) => [nuevo, ...prev]);
      setSnackbar({ open: true, message: `Materia prima "${formState.nombre}" dada de alta correctamente.`, severity: 'success' });
    }
    setModalOpen(false);
  };

  // Confirmar eliminación
  const handleDelete = () => {
    setMateriasPrimas((prev) => prev.filter((m) => m.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    setSnackbar({ open: true, message: 'Materia prima eliminada del catálogo.', severity: 'info' });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* ── Barra de Búsqueda, Filtros y Resumen con Chips ── */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flex: 1, minWidth: { xs: '100%', md: 280 }, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Buscar por código, nombre, marca o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: { xs: '1 1 100%', sm: 1 }, minWidth: { xs: '100%', sm: 180 }, bgcolor: 'background.paper' }}
          />

          <FormControl size="small" sx={{ flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 auto' }, minWidth: { xs: 'calc(50% - 6px)', sm: 150 }, bgcolor: 'background.paper' }}>
            <InputLabel id="filtro-tipo-label">Categoría</InputLabel>
            <Select
              labelId="filtro-tipo-label"
              value={selectedTipo}
              label="Categoría"
              onChange={(e) => setSelectedTipo(e.target.value)}
            >
              {TIPOS_CATEGORIA.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 auto' }, minWidth: { xs: 'calc(50% - 6px)', sm: 130 }, bgcolor: 'background.paper' }}>
            <InputLabel id="filtro-estado-mp-label">Estado</InputLabel>
            <Select
              labelId="filtro-estado-mp-label"
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

          {/* Badges / Chips discretos de resumen idénticos a Productos y Recetas */}
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
            {stats.bajoStock > 0 && (
              <Chip
                size="small"
                variant="outlined"
                color="default"
                icon={<WarningAmberIcon sx={{ fontSize: '0.85rem !important' }} />}
                label={`Bajo Stock: ${stats.bajoStock}`}
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              />
            )}
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
          Nueva Materia Prima
        </Button>
      </Box>

      {/* ── Tabla Principal de Materias Primas ─────────────────── */}
      {filteredMateriasPrimas.length === 0 ? (
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
            No se encontraron materias primas
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Intentá ajustando los filtros o agregá una nueva materia prima para abastecimiento.
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
            maxWidth: '100%',
          }}
        >
          <Table sx={{ width: '100%', minWidth: 700 }} size="medium">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 95, whiteSpace: 'nowrap' }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Materia Prima</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 140, whiteSpace: 'nowrap' }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 120, whiteSpace: 'nowrap' }}>Stock Actual</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 110, whiteSpace: 'nowrap' }}>Stock Mínimo</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 105, whiteSpace: 'nowrap' }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, width: 145, minWidth: 145, whiteSpace: 'nowrap' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMateriasPrimas.map((mp) => {
                const esBajoStock = Number(mp.stockActual) <= Number(mp.stockMinimo);
                return (
                  <TableRow key={mp.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {mp.codigo || mp.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {mp.nombre}
                      </Typography>
                      {mp.marca && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', maxWidth: 280 }} noWrap>
                          Marca: {mp.marca}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                      <Chip
                        label={mp.tipo}
                        size="small"
                        color="default"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: esBajoStock ? 'error.main' : 'text.primary',
                          }}
                        >
                          {mp.stockActual} {mp.unidad}
                        </Typography>
                        {esBajoStock && (
                          <Tooltip title="Stock en nivel crítico o por debajo del mínimo de seguridad">
                            <WarningAmberIcon color="error" sx={{ fontSize: 16 }} />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {mp.stockMinimo} {mp.unidad}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', py: 1.5 }}>
                      {mp.estado === 'Activo' ? (
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
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', width: 145, minWidth: 145, py: 1.5 }}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.2, flexWrap: 'nowrap' }}>
                        <Tooltip title="Ajustar Stock de Materia Prima">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenStockModal(mp)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                          >
                            <InventoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ver Ficha de Materia Prima">
                          <IconButton
                            size="small"
                            onClick={() => setViewingMP(mp)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar Materia Prima">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEdit(mp)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar del Catálogo">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => setDeleteConfirmId(mp.id)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Modal: Ajustar Stock de Materia Prima ────────────── */}
      <Dialog
        open={Boolean(stockModalMP)}
        onClose={() => setStockModalMP(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        {stockModalMP && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                {stockModalMP.codigo || stockModalMP.id} - Movimiento de Stock
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {stockModalMP.nombre}
              </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Stock Actual:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {stockModalMP.stockActual ?? 0} {stockModalMP.unidad}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Stock Mínimo de Seguridad:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {stockModalMP.stockMinimo ?? 10} {stockModalMP.unidad}
                  </Typography>
                </Box>
              </Paper>

              <TextField
                select
                label="Tipo de Movimiento"
                fullWidth
                size="small"
                value={stockMovimientoMP.tipo}
                onChange={(e) => setStockMovimientoMP({ ...stockMovimientoMP, tipo: e.target.value })}
              >
                <MenuItem value="Ingreso">Ingreso (+ Recepción de Compra / Ajuste a favor)</MenuItem>
                <MenuItem value="Egreso">Egreso (- Consumo / Merma / Rotura de saco)</MenuItem>
                <MenuItem value="Ajuste Directo">Ajuste Directo (= Recuento físico en depósito)</MenuItem>
              </TextField>

              <TextField
                label={
                  stockMovimientoMP.tipo === 'Ajuste Directo'
                    ? `Nuevo Stock Total (${stockModalMP.unidad})`
                    : `Cantidad a ${stockMovimientoMP.tipo === 'Ingreso' ? 'Ingresar' : 'Egresar'} (${stockModalMP.unidad})`
                }
                type="number"
                fullWidth
                size="small"
                value={stockMovimientoMP.cantidad}
                onChange={(e) => setStockMovimientoMP({ ...stockMovimientoMP, cantidad: e.target.value })}
                placeholder="0"
                autoFocus
              />

              <TextField
                label="Motivo u Observación"
                fullWidth
                size="small"
                value={stockMovimientoMP.motivo}
                onChange={(e) => setStockMovimientoMP({ ...stockMovimientoMP, motivo: e.target.value })}
                placeholder="Ej. Recepción de proveedor, merma por humedad, inventario..."
              />

              {/* Previsualización del stock final */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Stock Proyectado:
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: proyectedStockMP <= Number(stockModalMP.stockMinimo) ? 'error.main' : 'primary.main',
                  }}
                >
                  {proyectedStockMP} {stockModalMP.unidad}
                </Typography>
              </Box>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setStockModalMP(null)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveStockAdjustment}
                disabled={stockMovimientoMP.cantidad === ''}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', px: 2.5 }}
              >
                Guardar Ajuste
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Modal: Alta / Edición de Materia Prima ─────────────── */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingMP ? `Editar Materia Prima: ${editingMP.nombre}` : 'Nueva Materia Prima'}
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
            <Grid item xs={12} sm={5}>
              <TextField
                label="Nombre de la Materia Prima"
                fullWidth
                size="small"
                value={formState.nombre}
                onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                placeholder="Ej. Harina de Trigo 0000 Especial"
                required
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Marca Comercial"
                fullWidth
                size="small"
                value={formState.marca}
                onChange={(e) => setFormState({ ...formState, marca: e.target.value })}
                placeholder="Ej. Molino Cañuelas"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Categoría / Tipo"
                fullWidth
                size="small"
                value={formState.tipo}
                onChange={(e) => setFormState({ ...formState, tipo: e.target.value })}
              >
                {TIPOS_CATEGORIA.filter((t) => t !== 'Todas').map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Unidad de Medida"
                fullWidth
                size="small"
                value={formState.unidad}
                onChange={(e) => setFormState({ ...formState, unidad: e.target.value })}
              >
                {UNIDADES_MEDIDA.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={editingMP ? 'Stock Actual en Depósito' : 'Stock Inicial en Depósito'}
                type="number"
                fullWidth
                size="small"
                value={formState.stockActual}
                onChange={(e) => setFormState({ ...formState, stockActual: e.target.value })}
                helperText={editingMP ? 'Modificá las existencias disponibles directamente' : 'Cantidad inicial con la que ingresa al catálogo'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock Mínimo de Seguridad"
                type="number"
                fullWidth
                size="small"
                value={formState.stockMinimo}
                onChange={(e) => setFormState({ ...formState, stockMinimo: e.target.value })}
                helperText="Dispara alerta cuando las existencias caigan por debajo de este valor"
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
            {editingMP ? 'Guardar Cambios' : 'Crear Materia Prima'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Detalle de Materia Prima ──────────────────── */}
      <Dialog
        open={Boolean(viewingMP)}
        onClose={() => setViewingMP(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        {viewingMP && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {viewingMP.codigo || viewingMP.id}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {viewingMP.nombre}
                </Typography>
              </Box>
              {viewingMP.estado === 'Activo' ? (
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
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Categoría / Tipo
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {viewingMP.tipo}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Marca Comercial
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {viewingMP.marca || 'Sin marca especificada'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Unidad de Medida
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {viewingMP.unidad}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.8,
                      borderRadius: '10px',
                      borderColor: Number(viewingMP.stockActual) <= Number(viewingMP.stockMinimo) ? 'error.main' : 'divider',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <InventoryIcon fontSize="inherit" /> Stock Actual
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: Number(viewingMP.stockActual) <= Number(viewingMP.stockMinimo) ? 'error.main' : 'text.primary',
                          mt: 0.2,
                        }}
                      >
                        {viewingMP.stockActual} {viewingMP.unidad}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        const mp = viewingMP;
                        setViewingMP(null);
                        handleOpenStockModal(mp);
                      }}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, borderRadius: '8px' }}
                    >
                      Ajustar
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 1.8, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <WarningAmberIcon fontSize="inherit" /> Stock Mínimo
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.2 }}>
                      {viewingMP.stockMinimo} {viewingMP.unidad}
                    </Typography>
                  </Paper>
                </Grid>

              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={() => setViewingMP(null)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Cerrar
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<InventoryIcon />}
                onClick={() => {
                  const mp = viewingMP;
                  setViewingMP(null);
                  handleOpenStockModal(mp);
                }}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
              >
                Ajustar Stock
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => {
                  const mp = viewingMP;
                  setViewingMP(null);
                  handleOpenEdit(mp);
                }}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
              >
                Editar Materia Prima
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
            ¿Estás seguro de que deseás eliminar esta materia prima del catálogo? Esta acción no se puede deshacer.
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

export default MateriaPrimaScreen;
