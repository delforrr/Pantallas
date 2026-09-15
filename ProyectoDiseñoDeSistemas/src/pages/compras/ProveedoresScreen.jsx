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
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import GrassIcon from '@mui/icons-material/Grass';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { INITIAL_PROVEEDORES } from './mockData';

export const ProveedoresScreen = () => {
  const [proveedores, setProveedores] = useState(INITIAL_PROVEEDORES);
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'grid'
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
            <StorefrontIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Total Proveedores
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
          <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'success.main', color: 'white', display: 'flex', flexShrink: 0 }}>
            <CheckCircleOutlineIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Proveedores Activos
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
              {stats.activos}
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
            <LocalShippingOutlinedIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Semestrales (Harina/Levadura)
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {stats.principales}
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
            <GrassIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Insumos Locales / Frescos
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {stats.locales}
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
            Nuevo Proveedor
          </Button>
        </Box>
      </Box>

      {/* Vista de Cuadrícula (Cards) para Dispositivos Móviles y Escritorio */}
      {viewMode === 'grid' && (
        <Box sx={{ mb: 2 }}>
          {filteredProveedores.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron proveedores para los filtros seleccionados
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
              {filteredProveedores.map((prov) => (
                <Paper
                  key={prov.id}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: '12px',
                          bgcolor: 'action.hover',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <BusinessIcon />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 800,
                            lineHeight: 1.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={prov.razonSocial}
                        >
                          {prov.razonSocial}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.secondary', display: 'block' }}>
                          CUIT: {prov.cuit}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={prov.estado}
                      size="small"
                      color={prov.estado === 'Activo' ? 'success' : 'default'}
                      sx={{ fontWeight: 700, fontSize: '0.72rem', flexShrink: 0, ml: 1 }}
                    />
                  </Box>

                  {/* Body */}
                  <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {prov.contacto} ({prov.telefono})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {prov.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {prov.localidad}, {prov.provincia}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<StarIcon sx={{ fontSize: '14px !important' }} />}
                        label={`Calidad: ${prov.calificacion}`}
                        size="small"
                        color={prov.calificacion === 'Excelente' ? 'success' : 'info'}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                      />
                      <Chip
                        label={prov.categoria.includes('Semestral') ? 'Semestral' : 'Local / Fresco'}
                        size="small"
                        color={prov.categoria.includes('Semestral') ? 'primary' : 'warning'}
                        sx={{ fontSize: '0.7rem', height: 22 }}
                      />
                    </Box>

                    <Paper variant="outlined" sx={{ p: 1.2, borderRadius: '10px', bgcolor: 'action.hover', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                        Insumos Principales:
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        {prov.insumosPrincipales}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Actions Footer */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenDetail(prov)}
                      sx={{ borderRadius: '8px', fontSize: '0.74rem' }}
                    >
                      Ficha Fiscal
                    </Button>

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Editar proveedor">
                        <IconButton size="small" onClick={() => handleOpenEdit(prov)} sx={{ color: 'primary.main' }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar proveedor">
                        <IconButton size="small" onClick={() => handleOpenDelete(prov)} sx={{ color: 'error.main' }}>
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

      {/* Tabla de Proveedores */}
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
                <TableCell sx={{ fontWeight: 700 }}>CUIT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Razón Social</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Categoría de Compra</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contacto & Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ubicación</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Calificación</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProveedores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    <Typography variant="body2">No se encontraron proveedores para la búsqueda</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProveedores.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>
                      {row.cuit}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {row.razonSocial}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.insumosPrincipales}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.categoria}
                        size="small"
                        color={row.categoria.includes('Semestral') ? 'primary' : 'default'}
                        variant={row.categoria.includes('Semestral') ? 'filled' : 'outlined'}
                        sx={{ fontSize: '0.72rem', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.contacto}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.telefono} • {row.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.localidad}, {row.provincia}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.calificacion}
                        size="small"
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
      )}

      {/* Modal Dialog: Alta / Edición de Proveedor - UI Estilizada y Prolija */}
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
                <StorefrontIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {isEditing ? `Editar Proveedor · ${selectedProveedor?.razonSocial}` : 'Registrar Nuevo Proveedor'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Alta fiscal, condiciones de entrega y categoría de suministro de insumos
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setOpenForm(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Sección 1: Datos Fiscales */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BusinessIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  1. Datos Fiscales y Razón Social
                </Typography>
              </Box>
              <Grid container spacing={2}>
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
                    placeholder="Ej: Molino Harinero Central S.A."
                    value={formData.razonSocial}
                    onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
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
              </Grid>
            </Paper>

            {/* Sección 2: Contacto Comercial */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PhoneIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  2. Contacto Comercial y Comunicación
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Persona de Contacto"
                    placeholder="Ej: Marcelo Gómez"
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Teléfono"
                    placeholder="Ej: (02392) 42-8819"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="ventas@molinoharinas.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Sección 3: Domicilio e Insumos */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PlaceIcon fontSize="small" sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  3. Domicilio Fiscal e Insumos Suministrados
                </Typography>
              </Box>
              <Grid container spacing={2}>
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

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Insumos Principales Suministrados"
                    placeholder="Ej: Harina 0000 Especial, Levadura fresca, Huevos campo"
                    value={formData.insumosPrincipales}
                    onChange={(e) => setFormData({ ...formData, insumosPrincipales: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado Operativo</InputLabel>
                    <Select
                      value={formData.estado}
                      label="Estado Operativo"
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    >
                      <MenuItem value="Activo">Activo</MenuItem>
                      <MenuItem value="Inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
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
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BusinessIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Ficha del Proveedor #{selectedProveedor?.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CUIT: {selectedProveedor?.cuit}
              </Typography>
            </Box>
          </Box>
          <Chip label={selectedProveedor?.estado} size="small" color={selectedProveedor?.estado === 'Activo' ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedProveedor && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {selectedProveedor.razonSocial}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categoría: <strong>{selectedProveedor.categoria}</strong>
                </Typography>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Contacto Comercial</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedProveedor.contacto}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Teléfono</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedProveedor.telefono}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Correo Electrónico</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedProveedor.email}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Domicilio Fiscal Registrado</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {selectedProveedor.calle} {selectedProveedor.altura}, {selectedProveedor.localidad}, {selectedProveedor.provincia}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Insumos y Materias Primas Provistas</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {selectedProveedor.insumosPrincipales}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Calificación de Calidad</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={selectedProveedor.calificacion} size="small" color="info" sx={{ fontWeight: 700 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Estado en Sistema</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={selectedProveedor.estado} size="small" color={selectedProveedor.estado === 'Activo' ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
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
        PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ p: 2.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'error.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningAmberIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Confirmar Baja de Proveedor
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Está seguro de que desea dar de baja al proveedor{' '}
            <strong>{selectedProveedor?.razonSocial}</strong> (CUIT {selectedProveedor?.cuit})?
            Esta acción se reflejará en memoria inmediatamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ fontWeight: 700 }}>
            Eliminar Proveedor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProveedoresScreen;
