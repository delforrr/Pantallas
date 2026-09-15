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
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import GrassIcon from '@mui/icons-material/Grass';

import { INITIAL_PROVEEDORES } from './mockData';

export const ProveedoresScreen = () => {
  const [proveedores, setProveedores] = useState(INITIAL_PROVEEDORES);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('TODAS');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialFormState = {
    cuit: '',
    razonSocial: '',
    contacto: '',
    telefono: '',
    email: '',
    calle: '',
    altura: '',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    categoria: 'Insumos Locales / Frescos',
    calificacion: 'Alta',
    insumosPrincipales: '',
    estado: 'Activo',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filtros combinados
  const filteredProveedores = useMemo(() => {
    return proveedores.filter((p) => {
      const matchesSearch =
        p.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cuit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.insumosPrincipales.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoriaFilter === 'TODAS' || p.categoria === categoriaFilter;
      const matchesEst = estadoFilter === 'TODOS' || p.estado === estadoFilter;

      return matchesSearch && matchesCat && matchesEst;
    });
  }, [proveedores, searchTerm, categoriaFilter, estadoFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = proveedores.length;
    const activos = proveedores.filter((p) => p.estado === 'Activo').length;
    const principales = proveedores.filter((p) => p.categoria.includes('Principal')).length;
    const locales = proveedores.filter((p) => p.categoria.includes('Locales')).length;
    return { total, activos, principales, locales };
  }, [proveedores]);

  // Handlers
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setOpenForm(true);
  };

  const handleOpenEdit = (prov) => {
    setIsEditing(true);
    setSelectedProveedor(prov);
    setFormData({ ...prov });
    setOpenForm(true);
  };

  const handleOpenDetail = (prov) => {
    setSelectedProveedor(prov);
    setOpenDetail(true);
  };

  const handleOpenDelete = (prov) => {
    setSelectedProveedor(prov);
    setOpenDelete(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.razonSocial || !formData.cuit) return;

    if (isEditing) {
      setProveedores((prev) =>
        prev.map((p) => (p.id === selectedProveedor.id ? { ...formData, id: p.id } : p))
      );
    } else {
      const newProv = {
        ...formData,
        id: Date.now(),
      };
      setProveedores((prev) => [newProv, ...prev]);
    }
    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setProveedores((prev) => prev.filter((p) => p.id !== selectedProveedor.id));
    setOpenDelete(false);
    setSelectedProveedor(null);
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
            <Box
              sx={{
                p: 1,
                borderRadius: '10px',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
              }}
            >
              <StorefrontIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Proveedores
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
            <Box
              sx={{
                p: 1,
                borderRadius: '10px',
                bgcolor: 'success.main',
                color: 'white',
                display: 'flex',
              }}
            >
              <CheckCircleOutlineIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Proveedores Activos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.activos}
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
            <Box
              sx={{
                p: 1,
                borderRadius: '10px',
                bgcolor: 'info.main',
                color: 'white',
                display: 'flex',
              }}
            >
              <LocalShippingOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Semestrales (Harina/Levadura)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.principales}
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
            <Box
              sx={{
                p: 1,
                borderRadius: '10px',
                bgcolor: 'warning.main',
                color: 'white',
                display: 'flex',
              }}
            >
              <GrassIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Insumos Locales / Frescos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stats.locales}
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
            placeholder="Buscar por Razón Social, CUIT o Insumo..."
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

          <FormControl size="small" sx={{ minWidth: 180, bgcolor: 'background.paper' }}>
            <InputLabel id="categoria-select-label">Categoría</InputLabel>
            <Select
              labelId="categoria-select-label"
              value={categoriaFilter}
              label="Categoría"
              onChange={(e) => setCategoriaFilter(e.target.value)}
            >
              <MenuItem value="TODAS">Todas las Categorías</MenuItem>
              <MenuItem value="Materia Prima Principal (Semestral)">Materia Prima Semestral</MenuItem>
              <MenuItem value="Insumos Locales / Frescos">Insumos Locales / Frescos</MenuItem>
              <MenuItem value="Descartables & Packaging">Descartables & Packaging</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'background.paper' }}>
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              value={estadoFilter}
              label="Estado"
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="Activo">Activos</MenuItem>
              <MenuItem value="Inactivo">Inactivos</MenuItem>
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
          Nuevo Proveedor
        </Button>
      </Box>

      {/* Tabla de Proveedores */}
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
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>CUIT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Razón Social & Contacto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Insumos Principales</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Calidad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProveedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  <Typography variant="body2">No se encontraron proveedores</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProveedores.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {row.cuit}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {row.razonSocial}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.contacto} • {row.telefono}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.categoria.replace(' (Semestral)', '')}
                      color={
                        row.categoria.includes('Principal')
                          ? 'primary'
                          : row.categoria.includes('Locales')
                          ? 'warning'
                          : 'info'
                      }
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="caption" sx={{ color: 'text.primary', display: 'block', noWrap: true }}>
                      {row.insumosPrincipales}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.calificacion}
                      color={
                        row.calificacion === 'Excelente'
                          ? 'success'
                          : row.calificacion === 'Alta'
                          ? 'info'
                          : 'default'
                      }
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.estado}
                      size="small"
                      color={row.estado === 'Activo' ? 'success' : 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver detalles fiscales y de entrega">
                      <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: 'text.secondary' }}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar proveedor">
                      <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'primary.main' }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar proveedor">
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

      {/* Modal Dialog: Alta / Edición de Proveedor */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <form onSubmit={handleSaveForm}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {isEditing ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="CUIT"
                  placeholder="30-XXXXXXXX-X"
                  value={formData.cuit}
                  onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Razón Social"
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Persona de Contacto"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Correo Electrónico"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría de Proveedor</InputLabel>
                  <Select
                    value={formData.categoria}
                    label="Categoría de Proveedor"
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  >
                    <MenuItem value="Materia Prima Principal (Semestral)">Materia Prima Principal (Semestral)</MenuItem>
                    <MenuItem value="Insumos Locales / Frescos">Insumos Locales / Frescos</MenuItem>
                    <MenuItem value="Descartables & Packaging">Descartables & Packaging</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    DOMICILIO FISCAL Y OPERATIVO (DOMINIO)
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Calle"
                  value={formData.calle}
                  onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Altura / Nro"
                  value={formData.altura}
                  onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Localidad"
                  value={formData.localidad}
                  onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Provincia"
                  value={formData.provincia}
                  onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Insumos Principales Suministrados"
                  placeholder="Ej: Harina 0000, Levadura prensada, Huevos frescos..."
                  value={formData.insumosPrincipales}
                  onChange={(e) => setFormData({ ...formData, insumosPrincipales: e.target.value })}
                  helperText="Detalla las materias primas vinculadas a este proveedor según el diagrama del sistema."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Evaluación de Calidad</InputLabel>
                  <Select
                    value={formData.calificacion}
                    label="Evaluación de Calidad"
                    onChange={(e) => setFormData({ ...formData, calificacion: e.target.value })}
                  >
                    <MenuItem value="Excelente">Excelente</MenuItem>
                    <MenuItem value="Alta">Alta</MenuItem>
                    <MenuItem value="Media">Media</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    label="Estado"
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenForm(false)} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Guardar Cambios' : 'Registrar Proveedor'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Dialog: Detalle de Proveedor */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Ficha del Proveedor #{selectedProveedor?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedProveedor && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {selectedProveedor.razonSocial}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CUIT: {selectedProveedor.cuit} • {selectedProveedor.categoria}
                </Typography>
              </Box>

              <Divider />

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Contacto Comercial</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedProveedor.contacto}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Teléfono</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedProveedor.telefono}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Correo Electrónico</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedProveedor.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Domicilio Fiscal Registrado</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedProveedor.calle} {selectedProveedor.altura}, {selectedProveedor.localidad}, {selectedProveedor.provincia}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Insumos y Materias Primas</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedProveedor.insumosPrincipales}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Calificación / Calidad</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={selectedProveedor.calificacion} size="small" color="info" />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Estado de Proveedor</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={selectedProveedor.estado} size="small" color={selectedProveedor.estado === 'Activo' ? 'success' : 'default'} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained" color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Confirmación de Eliminación */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Está seguro de que desea dar de baja al proveedor{' '}
            <strong>{selectedProveedor?.razonSocial}</strong> (CUIT {selectedProveedor?.cuit})?
            Esta acción se reflejará en memoria inmediatamente.
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

export default ProveedoresScreen;
