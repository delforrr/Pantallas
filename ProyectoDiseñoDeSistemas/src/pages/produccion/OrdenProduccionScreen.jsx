import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
  Divider,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

import {
  ORDENES_PRODUCCION_INICIALES,
  RECETAS_INICIALES,
  MATERIAS_PRIMAS_INICIALES,
  verificarDisponibilidadMultiplesProductos,
} from './mockData';
import { OrdenProduccionCard } from '../../components/produccion';

const RESPONSABLES_SUGERIDOS = [
  'Juan Carlos Pérez (Jefe de Cuadra)',
  'María Laura Gómez (Maestra Pastera)',
  'Esteban Morales (Operario de Cuadra)',
  'Roberto Benítez (Ayudante de Producción)',
  'Lucía Fernández (Control de Calidad)',
];

const ESTADO_OP_COLORS = {
  Planificada: 'default',
  'En Proceso': 'primary',
  Finalizada: 'success',
  Cancelada: 'default',
};

const ESTADO_PRIORIDAD = {
  'En Proceso': 1,
  Planificada: 2,
  Finalizada: 3,
  Cancelada: 4,
};

// Genera la fecha de mañana en formato YYYY-MM-DD
const getMananaFecha = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export const OrdenProduccionScreen = () => {
  // Estado de datos en memoria
  const [ordenes, setOrdenes] = useState(ORDENES_PRODUCCION_INICIALES);
  const [materiasPrimas] = useState(MATERIAS_PRIMAS_INICIALES);
  const [recetas] = useState(RECETAS_INICIALES);

  // Filtros y vista
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroInsumos, setFiltroInsumos] = useState('TODOS');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modales
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openNotaPedidoDialog, setOpenNotaPedidoDialog] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [editingOrdenId, setEditingOrdenId] = useState(null);

  // Formulario de orden (cabecera)
  const [formFechaProgramada, setFormFechaProgramada] = useState(getMananaFecha());
  const [formTurno, setFormTurno] = useState('Mañana (06:00 - 14:00)');
  const [formResponsable, setFormResponsable] = useState('Juan Carlos Pérez (Jefe de Cuadra)');
  const [formObservaciones, setFormObservaciones] = useState('');

  // Productos cargados en la orden (soporte de múltiples productos)
  const [formItems, setFormItems] = useState([
    {
      recetaId: 'REC-001',
      productoNombre: 'Ravioles de Ricota y Parmesano',
      categoria: 'Pastas Rellenas',
      cantidadKilos: 40,
    },
  ]);

  // Controles para agregar un nuevo producto a la orden
  const [selectedRecetaToAdd, setSelectedRecetaToAdd] = useState(recetas[1] || recetas[0] || null);
  const [cantidadKilosToAdd, setCantidadKilosToAdd] = useState(20);

  // Datos para el modal de Nota de Pedido de Materia Prima
  const [notaPedidoData, setNotaPedidoData] = useState(null);

  // Notificaciones Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Total de kilos acumulados en el formulario
  const totalKilosForm = useMemo(() => {
    return formItems.reduce((acc, it) => acc + (Number(it.cantidadKilos) || 0), 0);
  }, [formItems]);

  // Estadísticas para badges de resumen tipo chips
  const stats = useMemo(() => {
    const total = ordenes.length;
    const totalPlanificadas = ordenes.filter((o) => o.estado === 'Planificada').length;
    const totalEnProceso = ordenes.filter((o) => o.estado === 'En Proceso').length;
    const conFaltante = ordenes.filter((o) => o.estadoInsumos === 'Faltante').length;
    const totalKilos = ordenes
      .filter((o) => o.estado !== 'Cancelada')
      .reduce((sum, o) => sum + (Number(o.cantidadKilos) || 0), 0);

    return { total, totalPlanificadas, totalEnProceso, conFaltante, totalKilos };
  }, [ordenes]);

  // Filtrado y ordenamiento de órdenes
  const ordenesFiltradas = useMemo(() => {
    return ordenes
      .filter((o) => {
        const matchSearch =
          o.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.notaPedidoId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchEstado = filtroEstado === 'TODOS' || o.estado === filtroEstado;
        const matchInsumos = filtroInsumos === 'TODOS' || o.estadoInsumos === filtroInsumos;

        return matchSearch && matchEstado && matchInsumos;
      })
      .sort((a, b) => {
        const prioA = ESTADO_PRIORIDAD[a.estado] || 99;
        const prioB = ESTADO_PRIORIDAD[b.estado] || 99;
        if (prioA !== prioB) return prioA - prioB;
        return b.numero.localeCompare(a.numero, undefined, { numeric: true });
      });
  }, [ordenes, searchTerm, filtroEstado, filtroInsumos]);

  // Manejo de productos en la orden
  const handleAddItem = () => {
    if (!selectedRecetaToAdd || !cantidadKilosToAdd || Number(cantidadKilosToAdd) <= 0) return;

    setFormItems((prev) => {
      const existeIndex = prev.findIndex((it) => it.recetaId === selectedRecetaToAdd.id);
      if (existeIndex >= 0) {
        const nuevo = [...prev];
        nuevo[existeIndex].cantidadKilos =
          Number(nuevo[existeIndex].cantidadKilos) + Number(cantidadKilosToAdd);
        return nuevo;
      }
      return [
        ...prev,
        {
          recetaId: selectedRecetaToAdd.id,
          productoNombre: selectedRecetaToAdd.nombreProducto,
          categoria: selectedRecetaToAdd.categoria,
          cantidadKilos: Number(cantidadKilosToAdd),
        },
      ];
    });

    setCantidadKilosToAdd(20);
    setSnackbar({
      open: true,
      message: `"${selectedRecetaToAdd.nombreProducto}" (${cantidadKilosToAdd} kg) agregado a la orden.`,
      severity: 'info',
    });
  };

  const handleRemoveItem = (index) => {
    setFormItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Genera y abre el modal de Nota de Pedido de Materia Prima consolidada
  const handleGenerarNotaPedidoEnFormulario = () => {
    if (formItems.length === 0) return;
    const resultado = verificarDisponibilidadMultiplesProductos(formItems, recetas, materiasPrimas);
    setNotaPedidoData({
      numeroNP: `NP-2026-${String(ordenes.length + 1).padStart(3, '0')}`,
      fecha: formFechaProgramada,
      turno: formTurno,
      responsable: formResponsable,
      items: formItems,
      ...resultado,
    });
    setOpenNotaPedidoDialog(true);
  };

  // Ver la Nota de Pedido de una orden ya guardada
  const handleVerNotaPedidoDeOrden = (orden) => {
    const itemsOrden =
      orden.items && orden.items.length > 0
        ? orden.items
        : [
            {
              recetaId: orden.productoId || recetas[0]?.id,
              productoNombre: orden.productoNombre,
              categoria: 'Pastas',
              cantidadKilos: orden.cantidadKilos || 40,
            },
          ];

    const resultado = verificarDisponibilidadMultiplesProductos(itemsOrden, recetas, materiasPrimas);
    setNotaPedidoData({
      numeroNP: orden.notaPedidoId,
      fecha: orden.fechaProgramada,
      turno: orden.turno,
      responsable: orden.responsable,
      ordenNumero: orden.numero,
      items: itemsOrden,
      ...resultado,
    });
    setOpenNotaPedidoDialog(true);
  };

  // Apertura de modales de nueva y edición
  const handleOpenNew = () => {
    setEditingOrdenId(null);
    setFormItems([
      {
        recetaId: recetas[0]?.id || 'REC-001',
        productoNombre: recetas[0]?.nombreProducto || 'Ravioles de Ricota y Parmesano',
        categoria: recetas[0]?.categoria || 'Pastas Rellenas',
        cantidadKilos: 40,
      },
    ]);
    setSelectedRecetaToAdd(recetas[1] || recetas[0] || null);
    setCantidadKilosToAdd(20);
    setFormFechaProgramada(getMananaFecha());
    setFormTurno('Mañana (06:00 - 14:00)');
    setFormResponsable('Juan Carlos Pérez (Jefe de Cuadra)');
    setFormObservaciones('');
    setOpenNewDialog(true);
  };

  const handleOpenEdit = (orden) => {
    if (orden.estado !== 'Planificada') return;
    setEditingOrdenId(orden.id);
    const itemsOrden =
      orden.items && orden.items.length > 0
        ? orden.items
        : [
            {
              recetaId: orden.productoId || recetas[0]?.id,
              productoNombre: orden.productoNombre,
              categoria: 'Pastas',
              cantidadKilos: orden.cantidadKilos || 40,
            },
          ];
    setFormItems(itemsOrden);
    setSelectedRecetaToAdd(recetas[0] || null);
    setCantidadKilosToAdd(20);
    setFormFechaProgramada(orden.fechaProgramada);
    setFormTurno(orden.turno);
    setFormResponsable(orden.responsable);
    setFormObservaciones(orden.observaciones || '');
    setOpenDetailDialog(false);
    setOpenNewDialog(true);
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
    );
    setSnackbar({
      open: true,
      message: `Orden actualizada a estado "${nuevoEstado}"`,
      severity: 'success',
    });
  };

  const handleGenerarSolicitudCompra = (orden) => {
    const nuevoIdOC = `OC-LOC-${Math.floor(100 + Math.random() * 900)}`;
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === orden.id
          ? {
              ...o,
              solicitudCompraGenerada: true,
              ordenCompraLocalId: nuevoIdOC,
            }
          : o
      )
    );
    setSnackbar({
      open: true,
      message: `Solicitud de compra ${nuevoIdOC} emitida para proveedor local (${orden.proveedorSugerido || 'Local'})`,
      severity: 'info',
    });
  };

  const handleGuardarOrden = () => {
    if (formItems.length === 0) {
      setSnackbar({
        open: true,
        message: 'Debes agregar al menos un producto a elaborar en la orden.',
        severity: 'warning',
      });
      return;
    }

    const calculo = verificarDisponibilidadMultiplesProductos(formItems, recetas, materiasPrimas);
    const totalKilos = formItems.reduce((acc, it) => acc + Number(it.cantidadKilos), 0);
    const resumenNombre =
      formItems.length === 1
        ? formItems[0].productoNombre
        : `${formItems[0].productoNombre} +${formItems.length - 1} más`;

    if (editingOrdenId) {
      setOrdenes((prev) =>
        prev.map((o) => {
          if (o.id !== editingOrdenId) return o;
          return {
            ...o,
            fechaProgramada: formFechaProgramada,
            items: formItems,
            productoNombre: resumenNombre,
            cantidadKilos: totalKilos,
            responsable: formResponsable,
            turno: formTurno,
            estadoInsumos: calculo.hayFaltante ? 'Faltante' : 'Completo',
            insumosFaltantes: calculo.faltantes,
            proveedorSugerido: calculo.hayFaltante
              ? calculo.faltantes[0]?.proveedorSugerido || 'Proveedor Local'
              : o.proveedorSugerido,
            observaciones: formObservaciones,
          };
        })
      );
      setOpenNewDialog(false);
      setSnackbar({
        open: true,
        message: 'Orden de producción modificada exitosamente.',
        severity: 'success',
      });
      return;
    }

    const nuevoNumero = `OP #${100 + ordenes.length + 1}`;
    const nuevoId = `OP-2026-${String(ordenes.length + 1).padStart(3, '0')}`;
    const nuevaNP = `NP-2026-${String(ordenes.length + 1).padStart(3, '0')}`;

    const nuevaOrden = {
      id: nuevoId,
      numero: nuevoNumero,
      fechaEmision: new Date().toISOString().split('T')[0],
      fechaProgramada: formFechaProgramada,
      items: formItems,
      productoNombre: resumenNombre,
      cantidadKilos: totalKilos,
      responsable: formResponsable,
      turno: formTurno,
      estado: 'Planificada',
      estadoInsumos: calculo.hayFaltante ? 'Faltante' : 'Completo',
      notaPedidoId: nuevaNP,
      solicitudCompraGenerada: calculo.hayFaltante,
      ordenCompraLocalId: calculo.hayFaltante ? `OC-LOC-${Math.floor(100 + Math.random() * 900)}` : null,
      proveedorSugerido: calculo.hayFaltante
        ? calculo.faltantes[0]?.proveedorSugerido || 'Proveedor Local'
        : null,
      insumosFaltantes: calculo.faltantes,
      observaciones: formObservaciones || 'Planificada al cierre de jornada.',
    };

    setOrdenes([nuevaOrden, ...ordenes]);
    setOpenNewDialog(false);
    setFormObservaciones('');
    setSnackbar({
      open: true,
      message: calculo.hayFaltante
        ? `Orden ${nuevoNumero} creada con ${formItems.length} productos (${totalKilos} kg). Alerta de faltante enviada a compras.`
        : `Orden ${nuevoNumero} creada con ${formItems.length} productos (${totalKilos} kg) e insumos completos.`,
      severity: calculo.hayFaltante ? 'warning' : 'success',
    });
  };

  const handleOpenDetail = (orden) => {
    setSelectedOrden(orden);
    setOpenDetailDialog(true);
  };

  return (
    <Box>
      {/* ── Barra de Búsqueda, Filtros con Chips de Resumen y Acciones ─── */}
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
            placeholder="Buscar por N° OP, producto, nota de pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 260, bgcolor: 'background.paper' }}
          />

          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
            <InputLabel id="filtro-estado-label">Estado OP</InputLabel>
            <Select
              labelId="filtro-estado-label"
              value={filtroEstado}
              label="Estado OP"
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los estados</MenuItem>
              <MenuItem value="Planificada">Planificada</MenuItem>
              <MenuItem value="En Proceso">En Proceso</MenuItem>
              <MenuItem value="Finalizada">Finalizada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
            <InputLabel id="filtro-insumos-label">Materia Prima</InputLabel>
            <Select
              labelId="filtro-insumos-label"
              value={filtroInsumos}
              label="Materia Prima"
              onChange={(e) => setFiltroInsumos(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los insumos</MenuItem>
              <MenuItem value="Completo">Insumos completos</MenuItem>
              <MenuItem value="Faltante">Con faltante</MenuItem>
            </Select>
          </FormControl>

          {/* Badges / Chips discretos de resumen con estilo y colores idénticos a Recetas */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: { sm: 1 }, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={`Total: ${stats.total} (${stats.totalKilos} kg)`}
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
              color="default"
              label={`Planificadas: ${stats.totalPlanificadas}`}
              sx={{ fontWeight: 600, fontSize: '0.8rem' }}
            />
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              label={`En Proceso: ${stats.totalEnProceso}`}
              sx={{ fontWeight: 600, fontSize: '0.8rem' }}
            />
            {stats.conFaltante > 0 && (
              <Chip
                size="small"
                variant="outlined"
                color="error"
                label={`Con Faltante: ${stats.conFaltante}`}
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <ToggleButton value="grid" aria-label="vista cuadrícula">
              <Tooltip title="Vista en tarjetas">
                <ViewModuleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="table" aria-label="vista tabla">
              <Tooltip title="Vista en tabla">
                <ViewListIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenNew}
            sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}
          >
            Planificar Producción
          </Button>
        </Box>
      </Box>

      {/* ── Cuerpo: Vista Grilla o Tabla ───────────────────── */}
      {ordenesFiltradas.length === 0 ? (
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
          <PrecisionManufacturingIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            No se encontraron órdenes de producción
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Intentá ajustando los filtros o planificá una nueva orden para la próxima jornada.
          </Typography>
        </Paper>
      ) : viewMode === 'grid' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2.5,
            gridAutoRows: '1fr',
          }}
        >
          {ordenesFiltradas.map((orden) => (
            <OrdenProduccionCard
              key={orden.id}
              orden={orden}
              onViewDetail={handleOpenDetail}
              onCambiarEstado={handleCambiarEstado}
              onGenerarSolicitudCompra={handleGenerarSolicitudCompra}
              onEdit={handleOpenEdit}
            />
          ))}
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
        >
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Orden / Pedido</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Productos y Volumen Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha Prog. / Turno</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Responsable</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Insumos</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado OP</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, width: 170, whiteSpace: 'nowrap' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenesFiltradas.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {row.numero}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {row.notaPedidoId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.items && row.items.length > 0
                        ? row.items.length === 1
                          ? row.items[0].productoNombre
                          : `${row.items[0].productoNombre} (+${row.items.length - 1} más)`
                        : row.productoNombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {row.cantidadKilos} kg ({row.items?.length || 1} productos)
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2">{row.fechaProgramada}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {row.turno}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.responsable}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.estadoInsumos === 'Completo' ? (
                      <Chip
                        icon={<CheckCircleIcon style={{ fontSize: 16 }} />}
                        label="Completos"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    ) : (
                      <Chip
                        icon={<WarningAmberIcon style={{ fontSize: 16 }} />}
                        label={row.solicitudCompraGenerada ? 'OC Solicitada' : 'Faltante'}
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Chip
                      icon={
                        row.estado === 'Finalizada' ? (
                          <CheckCircleIcon style={{ fontSize: 16 }} />
                        ) : row.estado === 'Cancelada' ? (
                          <CancelIcon style={{ fontSize: 16 }} />
                        ) : undefined
                      }
                      label={row.estado}
                      size="small"
                      color={ESTADO_OP_COLORS[row.estado] || 'default'}
                      variant={row.estado === 'Finalizada' || row.estado === 'Cancelada' ? 'outlined' : 'filled'}
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap', width: 170 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, flexWrap: 'nowrap' }}>
                      <Tooltip title="Ver Detalle y Nota de Insumos">
                        <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: 'text.secondary' }}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {row.estado === 'Planificada' && (
                        <Tooltip title="Editar Orden">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEdit(row)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {row.estado === 'Planificada' && (
                        <Tooltip title="Iniciar Elaboración">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleCambiarEstado(row.id, 'En Proceso')}
                          >
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {row.estado === 'En Proceso' && (
                        <Tooltip title="Marcar como Finalizada">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleCambiarEstado(row.id, 'Finalizada')}
                          >
                            <DoneAllIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {row.estado === 'Planificada' && (
                        <Tooltip title="Cancelar Orden">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => handleCambiarEstado(row.id, 'Cancelada')}
                            sx={{ color: 'text.secondary' }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Modal: Planificar / Editar Orden de Producción ──── */}
      <Dialog
        open={openNewDialog}
        onClose={() => setOpenNewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PrecisionManufacturingIcon color="primary" />
          {editingOrdenId
            ? 'Editar Orden de Producción'
            : 'Planificar Orden de Producción (Cierre de Jornada)'}
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Define los productos y cantidades a fabricar para la próxima jornada. Puedes cargar múltiples
            productos y generar su Nota de Pedido de Materia Prima correspondiente.
          </Typography>

          {/* Cabecera de la Orden en 2 columnas cómodas */}
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Fecha de Elaboración"
                type="date"
                value={formFechaProgramada}
                onChange={(e) => setFormFechaProgramada(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="select-turno-label">Turno de Cuadra</InputLabel>
                <Select
                  labelId="select-turno-label"
                  value={formTurno}
                  label="Turno de Cuadra"
                  onChange={(e) => setFormTurno(e.target.value)}
                >
                  <MenuItem value="Mañana (06:00 - 14:00)">Mañana (06:00 - 14:00)</MenuItem>
                  <MenuItem value="Tarde (14:00 - 22:00)">Tarde (14:00 - 22:00)</MenuItem>
                  <MenuItem value="Especial Feriado (08:00 - 13:00)">Especial Feriado (08:00 - 13:00)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                freeSolo
                size="small"
                options={RESPONSABLES_SUGERIDOS}
                value={formResponsable}
                onChange={(_, newValue) => setFormResponsable(newValue || '')}
                onInputChange={(_, newInputValue) => setFormResponsable(newInputValue)}
                slotProps={{
                  popper: {
                    sx: {
                      minWidth: 320,
                      zIndex: 1400,
                      '& .MuiAutocomplete-paper': {
                        minWidth: 320,
                      },
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.85rem',
                        py: 0.8,
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Responsable de Cuadra"
                    placeholder="Escribí o seleccioná responsable..."
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Instrucciones u Observaciones"
                value={formObservaciones}
                onChange={(e) => setFormObservaciones(e.target.value)}
                placeholder="Ej. Prioridad para despacho matutino a primera hora."
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2.5 }} />

          {/* Sección de Productos a Elaborar (Carga Múltiple) */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantMenuIcon fontSize="small" color="primary" />
              Productos a Elaborar en la Orden
            </Typography>

            {/* Fila para agregar producto */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: '10px', bgcolor: 'action.hover' }}>
              <Grid container spacing={1.5} alignItems="center">
                <Grid item xs={12} sm={7}>
                  <Autocomplete
                    size="small"
                    options={recetas}
                    getOptionLabel={(option) =>
                      typeof option === 'string'
                        ? option
                        : `${option.nombreProducto} (${option.categoria})`
                    }
                    value={selectedRecetaToAdd}
                    onChange={(_, newValue) => setSelectedRecetaToAdd(newValue)}
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                    slotProps={{
                      popper: {
                        sx: {
                          minWidth: 340,
                          zIndex: 1400,
                          '& .MuiAutocomplete-paper': {
                            minWidth: 340,
                          },
                          '& .MuiAutocomplete-option': {
                            fontSize: '0.85rem',
                            py: 0.8,
                          },
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Producto a Elaborar (Escribir o Seleccionar)"
                        placeholder="Escribí para buscar producto o receta..."
                      />
                    )}
                    noOptionsText="No se encontraron recetas"
                  />
                </Grid>

                <Grid item xs={7} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cantidad en Kilos"
                    type="number"
                    value={cantidadKilosToAdd}
                    onChange={(e) => setCantidadKilosToAdd(Math.max(1, Number(e.target.value)))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={5} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                    disabled={!selectedRecetaToAdd || !cantidadKilosToAdd || Number(cantidadKilosToAdd) <= 0}
                    sx={{ height: 40, fontWeight: 700 }}
                  >
                    Agregar
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Tabla de Productos Cargados */}
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Producto a Elaborar</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Cantidad (kg)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, width: 80 }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No hay productos cargados en esta orden. Agrega al menos un producto arriba.
                      </TableCell>
                    </TableRow>
                  ) : (
                    formItems.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{item.productoNombre}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{item.categoria}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {item.cantidadKilos} kg
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Eliminar producto">
                            <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {formItems.length > 0 && (
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                        Total Kilos Programados ({formItems.length} {formItems.length === 1 ? 'producto' : 'productos'}):
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'primary.main' }}>
                        {totalKilosForm} kg
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Botón explícito para generar la Nota de Pedido de Materia Prima */}
            <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<AssignmentIcon />}
                disabled={formItems.length === 0}
                onClick={handleGenerarNotaPedidoEnFormulario}
                sx={{
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  borderRadius: '10px',
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                Generar Nota de Pedido de Materia Prima
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenNewDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleGuardarOrden}
            variant="contained"
            color="primary"
            disabled={formItems.length === 0}
            sx={{ fontWeight: 700 }}
          >
            {editingOrdenId ? 'Guardar Cambios' : 'Confirmar y Emitir OP'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal: Nota de Pedido de Materia Prima ─────────── */}
      <Dialog
        open={openNotaPedidoDialog}
        onClose={() => setOpenNotaPedidoDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        {notaPedidoData && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="primary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Nota de Pedido de Materia Prima ({notaPedidoData.numeroNP})
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Fecha programada: {notaPedidoData.fecha} • {notaPedidoData.turno}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={notaPedidoData.hayFaltante ? 'Con Faltante de Insumos' : 'Insumos Completos'}
                color={notaPedidoData.hayFaltante ? 'warning' : 'success'}
                sx={{ fontWeight: 700 }}
              />
            </DialogTitle>

            <DialogContent dividers>
              {/* Resumen de productos que originan esta nota de pedido */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  PRODUCTOS A ELABORAR INCLUIDOS EN ESTA NOTA:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.8 }}>
                  {notaPedidoData.items?.map((it, idx) => (
                    <Chip
                      key={idx}
                      label={`${it.productoNombre}: ${it.cantidadKilos} kg`}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                  <Chip
                    label={`Total: ${notaPedidoData.totalKilos} kg`}
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Box>

              {/* Alerta de faltante */}
              {notaPedidoData.hayFaltante ? (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: '10px' }}>
                  <AlertTitle sx={{ fontWeight: 700 }}>Faltante de Insumos en Almacén</AlertTitle>
                  Se detectaron insumos con stock insuficiente para cubrir la totalidad del lote. Al confirmar la
                  orden se emitirá la <strong>Solicitud de Compra</strong> correspondiente para los insumos chicos/frescos
                  a los proveedores locales sugeridos.
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>
                  ¡Stock disponible verificado! Todos los insumos e ingredientes requeridos se encuentran en almacén
                  para el inicio de la jornada.
                </Alert>
              )}

              {/* Tabla consolidada de Materias Primas */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Detalle Consolidado de Insumos Requeridos
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px', maxHeight: 280, overflowY: 'auto' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Materia Prima / Insumo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Cantidad Requerida</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Stock Actual</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Proveedor Local</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notaPedidoData.insumos?.map((ins, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 500 }}>{ins.nombre}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{ins.tipo}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {ins.cantidadRequerida} {ins.unidad}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'text.secondary' }}>
                          {ins.stockActual} {ins.unidad}
                        </TableCell>
                        <TableCell align="center">
                          {ins.esFaltante ? (
                            <Chip
                              size="small"
                              color="error"
                              label={`Faltan ${ins.faltante} ${ins.unidad}`}
                              sx={{ fontSize: '0.7rem', height: 22, fontWeight: 700 }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              color="success"
                              variant="outlined"
                              label="Disponible"
                              sx={{ fontSize: '0.7rem', height: 22, fontWeight: 600 }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                          {ins.proveedorSugerido}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpenNotaPedidoDialog(false)} color="inherit">
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setOpenNotaPedidoDialog(false);
                  setSnackbar({
                    open: true,
                    message: `Nota de pedido ${notaPedidoData.numeroNP} verificada y vinculada a la orden.`,
                    severity: 'success',
                  });
                }}
                variant="contained"
                color="primary"
                startIcon={<CheckCircleIcon />}
              >
                Aceptar y Confirmar Insumos
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Modal: Detalle de Orden de Producción ─────────── */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        {selectedOrden && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Detalle de {selectedOrden.numero}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Nota de Pedido de Insumos: <strong>{selectedOrden.notaPedidoId}</strong>
                </Typography>
              </Box>
              <Chip
                icon={
                  selectedOrden.estado === 'Finalizada' ? (
                    <CheckCircleIcon style={{ fontSize: 18 }} />
                  ) : selectedOrden.estado === 'Cancelada' ? (
                    <CancelIcon style={{ fontSize: 18 }} />
                  ) : undefined
                }
                label={selectedOrden.estado}
                color={ESTADO_OP_COLORS[selectedOrden.estado] || 'default'}
                variant={selectedOrden.estado === 'Finalizada' || selectedOrden.estado === 'Cancelada' ? 'outlined' : 'filled'}
                sx={{ fontWeight: 700 }}
              />
            </DialogTitle>

            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      VOLUMEN TOTAL A FABRICAR
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
                      {selectedOrden.cantidadKilos} kg
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {selectedOrden.items?.length || 1} {selectedOrden.items?.length === 1 ? 'producto cargado' : 'productos cargados'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      CRONOGRAMA DE CUADRA
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Fecha: <strong>{selectedOrden.fechaProgramada}</strong> (Emisión: {selectedOrden.fechaEmision})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">{selectedOrden.turno}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                      Responsable: {selectedOrden.responsable}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Lista de Productos Cargados en la Orden */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Productos Cargados en esta Orden de Producción
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrden.items && selectedOrden.items.length > 0 ? (
                        selectedOrden.items.map((it, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontWeight: 600 }}>{it.productoNombre}</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{it.categoria || 'Pastas'}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {it.cantidadKilos} kg
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>{selectedOrden.productoNombre}</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>Pastas</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {selectedOrden.cantidadKilos} kg
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Estado de compras en caso de faltantes */}
              {selectedOrden.estadoInsumos === 'Faltante' && (
                <Alert
                  severity="warning"
                  icon={<WarningAmberIcon />}
                  action={
                    !selectedOrden.solicitudCompraGenerada ? (
                      <Button
                        color="inherit"
                        size="small"
                        startIcon={<ShoppingCartCheckoutIcon />}
                        onClick={() => handleGenerarSolicitudCompra(selectedOrden)}
                      >
                        Generar Solicitud OC
                      </Button>
                    ) : null
                  }
                  sx={{ mb: 2, borderRadius: '10px' }}
                >
                  <AlertTitle sx={{ fontWeight: 700 }}>
                    {selectedOrden.solicitudCompraGenerada
                      ? `Solicitud de Compra Emitida (${selectedOrden.ordenCompraLocalId || 'OC-LOC'})`
                      : 'Atención: Insumos con faltante en almacén'}
                  </AlertTitle>
                  Proveedor local sugerido:{' '}
                  <strong>{selectedOrden.proveedorSugerido || 'Quinta Don Pedro (Local)'}</strong>
                  {selectedOrden.solicitudCompraGenerada &&
                    ' — El departamento de compras gestionó la reposición para la jornada.'}
                </Alert>
              )}

              {/* Botón para ver la Nota de Pedido de Insumos */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AssignmentIcon />}
                  onClick={() => handleVerNotaPedidoDeOrden(selectedOrden)}
                  sx={{ fontWeight: 700 }}
                >
                  Ver Nota de Pedido de Materia Prima ({selectedOrden.notaPedidoId})
                </Button>
              </Box>

              {selectedOrden.observaciones && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    OBSERVACIONES:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.3, fontStyle: 'italic' }}>
                    "{selectedOrden.observaciones}"
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpenDetailDialog(false)} color="inherit">
                Cerrar
              </Button>
              {selectedOrden.estado === 'Planificada' && (
                <Button
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenEdit(selectedOrden)}
                >
                  Editar
                </Button>
              )}
              {selectedOrden.estado === 'Planificada' && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => {
                    handleCambiarEstado(selectedOrden.id, 'En Proceso');
                    setOpenDetailDialog(false);
                  }}
                >
                  Iniciar Elaboración
                </Button>
              )}
              {selectedOrden.estado === 'En Proceso' && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DoneAllIcon />}
                  onClick={() => {
                    handleCambiarEstado(selectedOrden.id, 'Finalizada');
                    setOpenDetailDialog(false);
                  }}
                >
                  Finalizar Orden
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Snackbar Notificaciones ────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default OrdenProduccionScreen;
