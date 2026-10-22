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
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmailIcon from '@mui/icons-material/Email';

import { INITIAL_CLIENTES, INITIAL_COMPROBANTES_VENTA, calcularEstadoMoroso } from './mockData';
import { ClienteMorosoAlert } from '../../components/ventas';

export const ClientesScreen = () => {
  const [clientes, setClientes] = useState(INITIAL_CLIENTES);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('TODOS');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State Normalizado
  const initialFormState = {
    cuit: '',
    razonSocial: '',
    responsable: '',
    telefono: '',
    email: '',
    calle: '',
    altura: '',
    localidad: 'Trenque Lauquen',
    provincia: 'Buenos Aires',
    tipoIva: 'Responsable Inscripto',
    tipoCliente: 'Mayorista (Restaurante / Semanal)',
    aceptaCredito: false,
    limiteCredito: 0,
    creditoUsado: 0,
    estado: 'Activo',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filtrado de Clientes con campo moroso calculado
  const filteredClientes = useMemo(() => {
    return clientes.filter((item) => {
      const morosidad = calcularEstadoMoroso(item, INITIAL_COMPROBANTES_VENTA);

      const matchSearch =
        item.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cuit.includes(searchTerm) ||
        item.responsable.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo =
        tipoFilter === 'TODOS' ||
        (tipoFilter === 'MAYORISTA' && item.tipoCliente.includes('Mayorista')) ||
        (tipoFilter === 'MINORISTA' && item.tipoCliente.includes('Minorista')) ||
        (tipoFilter === 'INSTITUCION' && item.tipoCliente.includes('Institución'));

      const matchEstado =
        estadoFilter === 'TODOS' ||
        (estadoFilter === 'ACTIVO' && item.estado === 'Activo' && !morosidad.esMoroso) ||
        (estadoFilter === 'MOROSO' && morosidad.esMoroso) ||
        (estadoFilter === 'INACTIVO' && item.estado === 'Inactivo');

      return matchSearch && matchTipo && matchEstado;
    });
  }, [clientes, searchTerm, tipoFilter, estadoFilter]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = clientes.length;
    const mayoristas = clientes.filter((c) => c.tipoCliente.includes('Mayorista')).length;
    const morosos = clientes.filter((c) => calcularEstadoMoroso(c, INITIAL_COMPROBANTES_VENTA).esMoroso).length;
    const creditoOtorgado = clientes.reduce((acc, c) => acc + (c.aceptaCredito ? c.limiteCredito : 0), 0);
    return { total, mayoristas, morosos, creditoOtorgado };
  }, [clientes]);

  // Handlers
  const handleOpenNewForm = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setOpenForm(true);
  };

  const handleOpenEditForm = (cliente) => {
    setIsEditing(true);
    setSelectedCliente(cliente);
    setFormData({ ...cliente });
    setOpenForm(true);
  };

  const handleOpenDetail = (cliente) => {
    setSelectedCliente(cliente);
    setOpenDetail(true);
  };

  const handleOpenDelete = (cliente) => {
    setSelectedCliente(cliente);
    setOpenDelete(true);
  };

  const handleSave = () => {
    if (!formData.razonSocial || !formData.cuit) return;

    if (isEditing) {
      setClientes((prev) =>
        prev.map((c) => (c.idCliente === selectedCliente.idCliente ? { ...formData, idCliente: selectedCliente.idCliente } : c))
      );
    } else {
      const newId = clientes.length > 0 ? Math.max(...clientes.map((c) => c.idCliente)) + 1 : 1;
      setClientes((prev) => [...prev, { ...formData, idCliente: newId }]);
    }
    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setClientes((prev) => prev.filter((c) => c.idCliente !== selectedCliente.idCliente));
    setOpenDelete(false);
  };

  const getStatusChip = (cliente) => {
    const morosidad = calcularEstadoMoroso(cliente, INITIAL_COMPROBANTES_VENTA);
    if (morosidad.esMoroso) {
      return (
        <Chip
          label={`Moroso (${morosidad.diasAtraso > 0 ? `${morosidad.diasAtraso}d` : 'Crédito Excedido'})`}
          color="error"
          size="small"
          icon={<WarningAmberIcon />}
          sx={{ fontWeight: 700 }}
        />
      );
    }
    if (cliente.estado === 'Activo') {
      return <Chip label="Activo" color="success" size="small" sx={{ fontWeight: 600 }} />;
    }
    return <Chip label="Inactivo" color="default" size="small" />;
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" fontSize="large" />
            Administración de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión normalizada de clientes y control de morosidad.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewForm}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 2.5 }}
        >
          Nuevo Cliente
        </Button>
      </Box>


      {/* Métricas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #009246' }} elevation={1}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Total Clientes
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#009246', mt: 0.5 }}>
              {stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #1976d2' }} elevation={1}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Clientes Mayoristas
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2', mt: 0.5 }}>
              {stats.mayoristas}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #ed6c02' }} elevation={1}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Crédito Autorizado Total
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ed6c02', mt: 0.5 }}>
              ${stats.creditoOtorgado.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #ce2b37' }} elevation={1}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Clientes Morosos
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ce2b37', mt: 0.5 }}>
              {stats.morosos}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Buscador y Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '14px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por Razón Social, CUIT o Responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Cliente</InputLabel>
              <Select value={tipoFilter} label="Tipo de Cliente" onChange={(e) => setTipoFilter(e.target.value)}>
                <MenuItem value="TODOS">Todos los tipos</MenuItem>
                <MenuItem value="MAYORISTA">Mayoristas</MenuItem>
                <MenuItem value="MINORISTA">Minoristas / Mostrador</MenuItem>
                <MenuItem value="INSTITUCION">Instituciones</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado Morosidad</InputLabel>
              <Select value={estadoFilter} label="Estado Morosidad" onChange={(e) => setEstadoFilter(e.target.value)}>
                <MenuItem value="TODOS">Todos</MenuItem>
                <MenuItem value="ACTIVO">Al Día</MenuItem>
                <MenuItem value="MOROSO">Morosos</MenuItem>
                <MenuItem value="INACTIVO">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1.5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleButtonGroup size="small" value={viewMode} exclusive onChange={(_, next) => next && setViewMode(next)}>
              <ToggleButton value="table"><ViewListIcon /></ToggleButton>
              <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Clientes (8 Columnas Esenciales Normalizadas) */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', width: '100%', overflowX: 'hidden' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Razón Social</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CUIT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Responsable</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tipo de Cliente</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No se encontraron clientes que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.idCliente} hover>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      #{cliente.idCliente}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {cliente.razonSocial}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {cliente.cuit}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{cliente.responsable}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{cliente.telefono}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={cliente.tipoCliente} size="small" color="primary" variant="outlined" sx={{ fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>
                      {getStatusChip(cliente)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver Ficha Completa">
                        <IconButton size="small" color="info" onClick={() => handleOpenDetail(cliente)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar Cliente">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEditForm(cliente)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => handleOpenDelete(cliente)}>
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
      ) : (
        <Grid container spacing={2}>
          {filteredClientes.map((cliente) => (
            <Grid item xs={12} sm={6} md={4} key={cliente.idCliente}>
              <Card elevation={2} sx={{ borderRadius: '14px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: 'primary.main' }}>
                      {cliente.razonSocial}
                    </Typography>
                    {getStatusChip(cliente)}
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                    ID: #{cliente.idCliente} • CUIT: {cliente.cuit} • {cliente.tipoIva}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <StorefrontIcon fontSize="small" color="action" />
                    <Typography variant="body2">{cliente.tipoCliente}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{cliente.telefono} ({cliente.responsable})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PlaceIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {cliente.calle} {cliente.altura}, {cliente.localidad}
                    </Typography>
                  </Box>

                  {cliente.aceptaCredito && (
                    <Paper variant="outlined" sx={{ p: 1, borderRadius: '8px' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CreditCardIcon fontSize="inherit" color="warning" /> Límite Crédito:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                        ${cliente.limiteCredito.toLocaleString()} (Usado: ${cliente.creditoUsado.toLocaleString()})
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
                <Box sx={{ p: 1.5, pt: 0, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button size="small" startIcon={<VisibilityOutlinedIcon />} onClick={() => handleOpenDetail(cliente)}>Detalles</Button>
                  <Button size="small" color="primary" startIcon={<EditOutlinedIcon />} onClick={() => handleOpenEditForm(cliente)}>Editar</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal Formulario Cliente */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {isEditing ? `Editar Cliente ID #${selectedCliente?.idCliente}` : 'Registrar Nuevo Cliente'}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenForm(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '75vh', overflowY: 'auto', p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Sección 1: Datos Identificatorios & Fiscales */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <StorefrontIcon fontSize="small" /> 1. Datos Identificatorios & Fiscales
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Razón Social / Nombre Comercial"
                    fullWidth
                    required
                    size="small"
                    value={formData.razonSocial}
                    onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="CUIT / CUIL / DNI"
                    fullWidth
                    required
                    size="small"
                    value={formData.cuit}
                    onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Condición frente al IVA</InputLabel>
                    <Select
                      value={formData.tipoIva}
                      label="Condición frente al IVA"
                      onChange={(e) => setFormData({ ...formData, tipoIva: e.target.value })}
                    >
                      <MenuItem value="Responsable Inscripto">Responsable Inscripto</MenuItem>
                      <MenuItem value="Monotributo">Monotributo</MenuItem>
                      <MenuItem value="Consumidor Final">Consumidor Final</MenuItem>
                      <MenuItem value="Exento">Exento</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo de Cliente</InputLabel>
                    <Select
                      value={formData.tipoCliente}
                      label="Tipo de Cliente"
                      onChange={(e) => setFormData({ ...formData, tipoCliente: e.target.value })}
                    >
                      <MenuItem value="Mayorista (Restaurante / Semanal)">Mayorista (Restaurante / Semanal)</MenuItem>
                      <MenuItem value="Mayorista (Supermercado / Fijo Semanal)">Mayorista (Supermercado / Fijo Semanal)</MenuItem>
                      <MenuItem value="Mayorista (Hotel & Eventos)">Mayorista (Hotel & Eventos)</MenuItem>
                      <MenuItem value="Minorista / Frecuente">Minorista / Frecuente</MenuItem>
                      <MenuItem value="Minorista (Mostrador)">Minorista (Mostrador)</MenuItem>
                      <MenuItem value="Institución Caritativa (Donaciones)">Institución Caritativa (Donaciones)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Sección 2: Contacto & Domicilio */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <PlaceIcon fontSize="small" /> 2. Contacto & Domicilio de Entrega
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Persona de Contacto / Responsable"
                    fullWidth
                    size="small"
                    value={formData.responsable}
                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono de Contacto"
                    fullWidth
                    size="small"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Correo Electrónico"
                    fullWidth
                    type="email"
                    size="small"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Calle"
                    fullWidth
                    size="small"
                    value={formData.calle}
                    onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Altura / Número"
                    fullWidth
                    size="small"
                    value={formData.altura}
                    onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Localidad"
                    fullWidth
                    size="small"
                    value={formData.localidad}
                    onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Sección 3: Condición Comercial & Crédito */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <CreditCardIcon fontSize="small" /> 3. Condición Comercial & Cuenta Corriente
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.aceptaCredito}
                      onChange={(e) => setFormData({ ...formData, aceptaCredito: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Habilitar Venta con Pago Mensual / Cuenta Corriente (Requiere Aprobación)
                    </Typography>
                  }
                />
                {formData.aceptaCredito && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Límite de Crédito Autorizado ($)"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.limiteCredito}
                        onChange={(e) => setFormData({ ...formData, limiteCredito: parseFloat(e.target.value) || 0 })}
                      />
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenForm(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} sx={{ px: 3, fontWeight: 700 }}>
            {isEditing ? 'Guardar Cambios' : 'Guardar Cliente'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Detalle / Ficha Completa del Cliente */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Ficha del Cliente #{selectedCliente?.idCliente}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedCliente && (() => {
            const morosidad = calcularEstadoMoroso(selectedCliente, INITIAL_COMPROBANTES_VENTA);
            const porcentajeCredito = selectedCliente.limiteCredito > 0 
              ? Math.min(Math.round((selectedCliente.creditoUsado / selectedCliente.limiteCredito) * 100), 100) 
              : 0;
            
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Encabezado Principal */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {selectedCliente.razonSocial}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.5 }}>
                        CUIT: {selectedCliente.cuit} • Condición IVA: {selectedCliente.tipoIva}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip label={selectedCliente.tipoCliente} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                      {getStatusChip(selectedCliente)}
                    </Box>
                  </Box>
                </Paper>

                {/* Alerta si es moroso */}
                {morosidad.esMoroso && (
                  <ClienteMorosoAlert cliente={selectedCliente} comprobantesVenta={INITIAL_COMPROBANTES_VENTA} />
                )}

                <Grid container spacing={3}>
                  {/* Sección 1: Datos de Contacto y Domicilio */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', height: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" /> Datos de Contacto & Domicilio
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PersonIcon color="action" fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Contacto / Responsable</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCliente.responsable || 'No especificado'}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PhoneIcon color="action" fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Teléfono</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCliente.telefono || 'No especificado'}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <EmailIcon color="action" fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Correo Electrónico</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedCliente.email || 'No especificado'}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <PlaceIcon color="action" fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Domicilio</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedCliente.calle} {selectedCliente.altura}, {selectedCliente.localidad} ({selectedCliente.provincia})
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Sección 2: Información Comercial & Cuenta Corriente */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '12px', height: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCardIcon fontSize="small" /> Cuenta Corriente & Crédito
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Habilitado Venta Crédito:</Typography>
                          <Chip 
                            label={selectedCliente.aceptaCredito ? "Habilitado" : "Solo Contado"} 
                            color={selectedCliente.aceptaCredito ? "success" : "default"} 
                            size="small" 
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        {selectedCliente.aceptaCredito ? (
                          <>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">Límite Autorizado:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  ${selectedCliente.limiteCredito.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">Crédito Consumido:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: selectedCliente.creditoUsado > selectedCliente.limiteCredito ? 'error.main' : 'warning.main' }}>
                                  ${selectedCliente.creditoUsado.toLocaleString()} ({porcentajeCredito}%)
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={porcentajeCredito} 
                                color={selectedCliente.creditoUsado > selectedCliente.limiteCredito ? 'error' : porcentajeCredito > 80 ? 'warning' : 'primary'}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>

                            <Divider />

                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">Estado de Morosidad:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: morosidad.esMoroso ? 'error.main' : 'success.main', mt: 0.5 }}>
                                {morosidad.razon}
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <Paper elevation={0} sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f5f5f5', textAlign: 'center', borderRadius: '8px' }}>
                            <Typography variant="body2" color="text.secondary">
                              Este cliente realiza compras únicamente al contado. No posee línea de crédito abierta ni saldo de cuenta corriente.
                            </Typography>
                          </Paper>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            );
          })()}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained" color="primary" sx={{ px: 3, fontWeight: 700, borderRadius: '8px' }}>
            Cerrar Ficha
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Confirmación Eliminación */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar Cliente?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseas eliminar a <strong>{selectedCliente?.razonSocial}</strong> (ID #{selectedCliente?.idCliente})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientesScreen;
