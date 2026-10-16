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
  Tabs,
  Tab,
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
import PersonIcon from '@mui/icons-material/Person';

import {
  ORDENES_PRODUCCION_INICIALES,
  NOTAS_PEDIDO_MP_INICIALES,
  RECETAS_INICIALES,
  MATERIAS_PRIMAS_INICIALES,
  EMPLEADOS,
  MAQUINARIAS,
  verificarDisponibilidadMultiplesProductos,
} from './mockData';
import { OrdenProduccionCard } from '../../components/produccion';

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
  const [notasPedido] = useState(NOTAS_PEDIDO_MP_INICIALES);
  const [materiasPrimas] = useState(MATERIAS_PRIMAS_INICIALES);
  const [recetas] = useState(RECETAS_INICIALES);

  // Selector de entidad normalizada (0: Órdenes de Producción, 1: Notas de Pedido de Materia Prima)
  const [tabIndex, setTabIndex] = useState(0);

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

  // Formulario de orden (cabecera con atributos del diagrama UML)
  const [formFechaInicio, setFormFechaInicio] = useState(getMananaFecha());
  const [formFechaFin, setFormFechaFin] = useState(getMananaFecha());
  const [formTurno, setFormTurno] = useState('Mañana (06:00 - 14:00)');
  const [formIdEmpleado, setFormIdEmpleado] = useState(1);
  const [formResponsable, setFormResponsable] = useState('Juan Carlos Pérez (Jefe de Cuadra)');
  const [formMaquinasIds, setFormMaquinasIds] = useState([1, 3, 4]);
  const [formObservaciones, setFormObservaciones] = useState('');

  // Productos cargados en la orden (DetalleOrdenDeProduccion)
  const [formItems, setFormItems] = useState([
    {
      idProducto: 1,
      idTipoDeProducto: 1,
      idVariedad: 1,
      cantidadPlanificada: 40,
      cantidadProducida: 0,
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
          (o.empleadoNombre || o.responsable || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (o.maquinaNombre && o.maquinaNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
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

  // Manejo de productos en la orden (DetalleOrdenDeProduccion)
  const handleAddItem = () => {
    if (!selectedRecetaToAdd || !cantidadKilosToAdd || Number(cantidadKilosToAdd) <= 0) return;

    setFormItems((prev) => {
      const existeIndex = prev.findIndex((it) => it.recetaId === selectedRecetaToAdd.id);
      if (existeIndex >= 0) {
        const nuevo = [...prev];
        nuevo[existeIndex].cantidadKilos =
          Number(nuevo[existeIndex].cantidadKilos) + Number(cantidadKilosToAdd);
        nuevo[existeIndex].cantidadPlanificada = nuevo[existeIndex].cantidadKilos;
        return nuevo;
      }
      return [
        ...prev,
        {
          idProducto: selectedRecetaToAdd.idProducto || 1,
          idTipoDeProducto: selectedRecetaToAdd.idTipoDeProducto || 1,
          idVariedad: selectedRecetaToAdd.idVariedad || 1,
          cantidadPlanificada: Number(cantidadKilosToAdd),
          cantidadProducida: 0,
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
    const newId = editingOrdenId || (ordenes.length + 1);
    const codigoNP = `NP-2026-${String(newId).padStart(3, '0')}`;
    const codigoOP = editingOrdenId
      ? (ordenes.find((o) => o.idOrdenProduccion === editingOrdenId)?.numero || `OP #${100 + editingOrdenId - 1}`)
      : `OP #${100 + ordenes.length}`;

    setNotaPedidoData({
      idNotaPedidoMP: newId,
      codigoNotaPedido: codigoNP,
      numeroNP: codigoNP,
      idOrdenProduccion: newId,
      numeroOrden: codigoOP,
      ordenNumero: codigoOP,
      fechaEmision: formFechaInicio || new Date().toISOString().split('T')[0],
      fecha: formFechaInicio || new Date().toISOString().split('T')[0],
      turno: formTurno,
      responsable: formResponsable,
      items: formItems,
      ...resultado,
      insumos: resultado.insumos || [],
    });
    setOpenNotaPedidoDialog(true);
  };

  // Ver la Nota de Pedido de una orden ya guardada
  const handleVerNotaPedidoDeOrden = (orden) => {
    const itemsOrden =
      orden.items && orden.items.length > 0
        ? orden.items
        : orden.detallesOrdenProduccion && orden.detallesOrdenProduccion.length > 0
        ? orden.detallesOrdenProduccion
        : [
            {
              recetaId: orden.productoId || recetas[0]?.id,
              productoNombre: orden.productoNombre,
              categoria: 'Pastas',
              cantidadKilos: orden.cantidadKilos || 40,
            },
          ];

    const resultado = verificarDisponibilidadMultiplesProductos(itemsOrden, recetas, materiasPrimas);
    let insumosFinal = resultado.insumos && resultado.insumos.length > 0 ? resultado.insumos : [];

    // Fallback si resultado no calculó insumos pero la orden tiene notaPedidoMateriaPrima.detalles
    if (insumosFinal.length === 0 && orden.notaPedidoMateriaPrima?.detalles?.length > 0) {
      insumosFinal = orden.notaPedidoMateriaPrima.detalles.map((d, idx) => {
        const mp = materiasPrimas.find(
          (m) => m.idMateriaPrima === d.idMateriaPrima || m.nombre?.toLowerCase() === (d.materiaPrimaNombre || d.nombre)?.toLowerCase()
        );
        const cant = d.cantidadRequerida ?? d.cantidad ?? 0;
        const stock = mp ? mp.stockActual : (orden.estadoInsumos === 'Faltante' ? 2 : cant + 10);
        const falta = Math.max(0, Number((cant - stock).toFixed(2)));
        return {
          idMateriaPrima: d.idMateriaPrima || mp?.idMateriaPrima || idx + 1,
          nombre: d.materiaPrimaNombre || d.nombre || mp?.nombre || `Materia Prima #${idx + 1}`,
          tipo: mp?.tipo || 'Materia Prima',
          cantidadRequerida: cant,
          stockActual: stock,
          unidad: d.unidad || mp?.unidad || 'kg',
          esFaltante: falta > 0 || orden.estadoInsumos === 'Faltante',
          faltante: falta,
          proveedorSugerido: mp?.proveedorSugerido || 'Proveedor Local Sugerido',
        };
      });
    }

    const idNP = orden.notaPedidoMateriaPrima?.idNotaPedidoMP || orden.idOrdenProduccion || 1;
    const codNP = orden.notaPedidoId || orden.numeroNP || `NP-2026-${String(idNP).padStart(3, '0')}`;
    const idOP = orden.idOrdenProduccion || 1;
    const numOP = orden.numero || orden.ordenNumero || `OP #${100 + idOP - 1}`;
    const fechaEm = orden.notaPedidoMateriaPrima?.fechaEmision || orden.fechaEmision || orden.fechaProgramada || '2026-09-14';

    setNotaPedidoData({
      idNotaPedidoMP: idNP,
      codigoNotaPedido: codNP,
      numeroNP: codNP,
      idOrdenProduccion: idOP,
      numeroOrden: numOP,
      ordenNumero: numOP,
      fechaEmision: fechaEm,
      fecha: orden.fechaProgramada || fechaEm,
      turno: orden.turno,
      responsable: orden.responsable,
      items: itemsOrden,
      ...resultado,
      insumos: insumosFinal,
      hayFaltante: insumosFinal.some((i) => i.esFaltante) || orden.estadoInsumos === 'Faltante',
      totalKilos: resultado.totalKilos || orden.cantidadKilos || 40,
    });
    setOpenNotaPedidoDialog(true);
  };

  // Apertura de modales de nueva y edición
  const handleOpenNew = () => {
    setEditingOrdenId(null);
    setFormItems([
      {
        idProducto: recetas[0]?.idProducto || 1,
        idTipoDeProducto: recetas[0]?.idTipoDeProducto || 1,
        idVariedad: recetas[0]?.idVariedad || 1,
        cantidadPlanificada: 40,
        cantidadProducida: 0,
        recetaId: recetas[0]?.id || 'REC-001',
        productoNombre: recetas[0]?.nombreProducto || 'Ravioles de Ricota y Parmesano',
        categoria: recetas[0]?.categoria || 'Pastas Rellenas',
        cantidadKilos: 40,
      },
    ]);
    setSelectedRecetaToAdd(recetas[1] || recetas[0] || null);
    setCantidadKilosToAdd(20);
    setFormFechaInicio(getMananaFecha());
    setFormFechaFin(getMananaFecha());
    setFormTurno('Mañana (06:00 - 14:00)');
    setFormIdEmpleado(1);
    setFormResponsable('Juan Carlos Pérez (Jefe de Cuadra)');
    setFormMaquinasIds([1, 3, 4]);
    setFormObservaciones('');
    setOpenNewDialog(true);
  };

  const handleOpenEdit = (orden) => {
    if (orden.estado !== 'Planificada') return;
    setEditingOrdenId(orden.id);
    const itemsOrden =
      orden.items && orden.items.length > 0
        ? orden.items.map((it) => ({
            ...it,
            idProducto: it.idProducto || 1,
            idTipoDeProducto: it.idTipoDeProducto || 1,
            idVariedad: it.idVariedad || 1,
            cantidadPlanificada: it.cantidadPlanificada || it.cantidadKilos || 40,
            cantidadProducida: it.cantidadProducida || 0,
          }))
        : [
            {
              idProducto: orden.idProducto || 1,
              idTipoDeProducto: orden.idTipoDeProducto || 1,
              idVariedad: orden.idVariedad || 1,
              cantidadPlanificada: orden.cantidadKilos || 40,
              cantidadProducida: 0,
              recetaId: orden.productoId || recetas[0]?.id,
              productoNombre: orden.productoNombre,
              categoria: 'Pastas',
              cantidadKilos: orden.cantidadKilos || 40,
            },
          ];
    setFormItems(itemsOrden);
    setSelectedRecetaToAdd(recetas[0] || null);
    setCantidadKilosToAdd(20);
    setFormFechaInicio(orden.fechaInicio || orden.fechaProgramada);
    setFormFechaFin(orden.fechaFin || orden.fechaProgramada);
    setFormTurno(orden.turno);
    setFormIdEmpleado(orden.idEmpleado || 1);
    setFormResponsable(orden.responsable);
    const idsMaquinas =
      orden.maquinariaProduccion && orden.maquinariaProduccion.length > 0
        ? orden.maquinariaProduccion.map((m) => m.idMaquinaria)
        : orden.maquinasIds && orden.maquinasIds.length > 0
        ? orden.maquinasIds
        : [1, 3, 4];
    setFormMaquinasIds(idsMaquinas);
    setFormObservaciones(orden.observaciones || '');
    setOpenDetailDialog(false);
    setOpenNewDialog(true);
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    setOrdenes((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const actualizado = { ...o, estado: nuevoEstado };
        if (nuevoEstado === 'Finalizada') {
          const itemsFinalizados = (o.items || []).map((it) => ({
            ...it,
            cantidadProducida: it.cantidadPlanificada || it.cantidadKilos,
          }));
          actualizado.items = itemsFinalizados;
          actualizado.detallesOrdenProduccion = itemsFinalizados;
        }
        return actualizado;
      })
    );
    setSnackbar({
      open: true,
      message: `Orden actualizada a estado "${nuevoEstado}"`,
      severity: 'success',
    });
  };

  const handleGenerarSolicitudCompra = (orden) => {
    const numericPart = parseInt(String(orden.id).replace(/\D/g, ''), 10) || 101;
    const nuevoIdOC = `OC-LOC-${100 + ((numericPart * 37) % 900)}`;
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

    const empleadoObj = EMPLEADOS.find((e) => e.idEmpleado === formIdEmpleado) || EMPLEADOS[0];
    const maquinasSeleccionadas = MAQUINARIAS.filter((m) => formMaquinasIds.includes(m.idMaquinaria));
    const maquinasParaOrden = maquinasSeleccionadas.length > 0 ? maquinasSeleccionadas : [MAQUINARIAS[0], MAQUINARIAS[2], MAQUINARIAS[3]];
    const fechaHoy = new Date().toISOString().split('T')[0];
    const ordenIdNum = editingOrdenId ? (ordenes.find((o) => o.id === editingOrdenId)?.idOrdenProduccion || 1) : ordenes.length + 1;

    const maquinariaProduccionCalculada = maquinasParaOrden.map((m) => ({
      idOrdenProduccion: ordenIdNum,
      idMaquinaria: m.idMaquinaria,
      codigo: m.codigo,
      descripcion: m.descripcion,
      tipo: m.tipo,
    }));
    const maquinasCodigos = maquinasParaOrden.map((m) => m.codigo).join(', ');
    const maquinasResumen = `${maquinasCodigos} (${maquinasParaOrden.map((m) => m.descripcion.split(' ')[0]).join(', ')})`;

    const detallesCalculados = formItems.map((it) => ({
      idOrdenProduccion: ordenIdNum,
      idProducto: it.idProducto || 1,
      idTipoDeProducto: it.idTipoDeProducto || 1,
      idVariedad: it.idVariedad || 1,
      cantidadPlanificada: Number(it.cantidadKilos || it.cantidadPlanificada),
      cantidadProducida: Number(it.cantidadProducida || 0),
      recetaId: it.recetaId,
      productoNombre: it.productoNombre,
      categoria: it.categoria,
      cantidadKilos: Number(it.cantidadKilos || it.cantidadPlanificada),
    }));

    const notaPedidoCalculada = {
      idNotaPedidoMP: ordenIdNum,
      fechaEmision: fechaHoy,
      idOrdenProduccion: ordenIdNum,
      detalles: calculo.insumos.map((ins, idx) => ({
        idNotaPedidoMP: ordenIdNum,
        idMateriaPrima: ins.idMateriaPrima || idx + 1,
        materiaPrimaNombre: ins.nombre,
        cantidad: ins.cantidadRequerida,
        unidad: ins.unidad,
      })),
    };

    if (editingOrdenId) {
      setOrdenes((prev) =>
        prev.map((o) => {
          if (o.id !== editingOrdenId) return o;
          return {
            ...o,
            fechaEmision: o.fechaEmision || fechaHoy,
            fechaInicio: formFechaInicio,
            fechaFin: formFechaFin,
            fechaProgramada: formFechaInicio,
            items: detallesCalculados,
            detallesOrdenProduccion: detallesCalculados,
            notaPedidoMateriaPrima: notaPedidoCalculada,
            productoNombre: resumenNombre,
            cantidadKilos: totalKilos,
            idEmpleado: empleadoObj.idEmpleado,
            empleadoNombre: `${empleadoObj.nombre} (${empleadoObj.cargo})`,
            responsable: `${empleadoObj.nombre} (${empleadoObj.cargo})`,
            turno: formTurno,
            maquinariaProduccion: maquinariaProduccionCalculada,
            maquinasIds: maquinasParaOrden.map((m) => m.idMaquinaria),
            maquinaId: maquinasCodigos,
            maquinaNombre: maquinasResumen,
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
      idOrdenProduccion: ordenIdNum,
      numero: nuevoNumero,
      fechaEmision: fechaHoy,
      fechaInicio: formFechaInicio,
      fechaFin: formFechaFin,
      fechaProgramada: formFechaInicio,
      items: detallesCalculados,
      detallesOrdenProduccion: detallesCalculados,
      productoNombre: resumenNombre,
      cantidadKilos: totalKilos,
      idEmpleado: empleadoObj.idEmpleado,
      empleadoNombre: `${empleadoObj.nombre} (${empleadoObj.cargo})`,
      responsable: `${empleadoObj.nombre} (${empleadoObj.cargo})`,
      turno: formTurno,
      maquinariaProduccion: maquinariaProduccionCalculada,
      maquinasIds: maquinasParaOrden.map((m) => m.idMaquinaria),
      maquinaId: maquinasCodigos,
      maquinaNombre: maquinasResumen,
      estado: 'Planificada',
      estadoInsumos: calculo.hayFaltante ? 'Faltante' : 'Completo',
      notaPedidoId: nuevaNP,
      notaPedidoMateriaPrima: notaPedidoCalculada,
      solicitudCompraGenerada: calculo.hayFaltante,
      ordenCompraLocalId: calculo.hayFaltante ? `OC-LOC-${100 + ((ordenIdNum * 43) % 900)}` : null,
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
        : `Orden ${nuevoNumero} creada con ${formItems.length} productos (${totalKilos} kg) y materia prima completa.`,
      severity: calculo.hayFaltante ? 'warning' : 'success',
    });
  };

  const handleOpenDetail = (orden) => {
    setSelectedOrden(orden);
    setOpenDetailDialog(true);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* ── Selector de Entidades Normalizadas: Órdenes de Producción vs Notas de Pedido de Materia Prima ── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            icon={<PrecisionManufacturingIcon fontSize="small" />}
            iconPosition="start"
            label={`Órdenes de Producción (${ordenes.length})`}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          />
          <Tab
            icon={<AssignmentIcon fontSize="small" />}
            iconPosition="start"
            label={`Notas de Pedido de Materia Prima (${notasPedido.length})`}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <>
          {/* ── Barra de Búsqueda, Filtros con Chips de Resumen y Acciones ─── */}
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
            sx={{ flex: { xs: '1 1 100%', sm: 1 }, minWidth: { xs: '100%', sm: 200 }, bgcolor: 'background.paper' }}
          />

          <FormControl size="small" sx={{ flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 auto' }, minWidth: { xs: 'calc(50% - 6px)', sm: 140 }, bgcolor: 'background.paper' }}>
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

          <FormControl size="small" sx={{ flex: { xs: '1 1 calc(50% - 6px)', sm: '0 0 auto' }, minWidth: { xs: 'calc(50% - 6px)', sm: 140 }, bgcolor: 'background.paper' }}>
            <InputLabel id="filtro-insumos-label">Materia Prima</InputLabel>
            <Select
              labelId="filtro-insumos-label"
              value={filtroInsumos}
              label="Materia Prima"
              onChange={(e) => setFiltroInsumos(e.target.value)}
            >
              <MenuItem value="TODOS">Todas las materias primas</MenuItem>
              <MenuItem value="Completo">Materia prima completa</MenuItem>
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

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'space-between', md: 'flex-end' }, mt: { xs: 1, md: 0 } }}>
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
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 700,
              width: { xs: 'auto', md: 'auto' },
              flex: { xs: 1, md: 'none' },
            }}
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
          sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflowX: 'auto', width: '100%', maxWidth: '100%' }}
        >
          <Table sx={{ width: '100%', minWidth: 920 }}>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>N° Orden (OP)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nota de Pedido MP</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Productos y Volumen Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha Prog. / Turno</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Máquinas Asignadas</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Empleado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Materia Prima</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado OP</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, width: 170, whiteSpace: 'nowrap' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenesFiltradas.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {row.numero}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {row.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Ver Nota de Pedido de Materia Prima asociada">
                      <Chip
                        icon={<AssignmentIcon style={{ fontSize: 14 }} />}
                        label={row.notaPedidoId}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleVerNotaPedidoDeOrden(row)}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      />
                    </Tooltip>
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
                  <TableCell sx={{ minWidth: 170 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <PrecisionManufacturingIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.maquinariaProduccion?.length || 1} {row.maquinariaProduccion?.length === 1 ? 'máquina' : 'máquinas'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 220 }}>
                        {(row.maquinariaProduccion && row.maquinariaProduccion.length > 0
                          ? row.maquinariaProduccion
                          : [{ codigo: row.maquinaId || 'MAQ', descripcion: row.maquinaNombre || 'Máquina' }]
                        ).map((m, idx) => (
                          <Tooltip key={idx} title={`${m.descripcion || m.codigo}${m.tipo ? ` (${m.tipo})` : ''}`}>
                            <Chip
                              size="small"
                              label={m.codigo || m.descripcion}
                              sx={{ fontSize: '0.68rem', height: 20, fontWeight: 600 }}
                              variant="outlined"
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.empleadoNombre || row.responsable}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Legajo #{row.idEmpleado || 1}
                    </Typography>
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
                      <Tooltip title="Ver Detalle y Nota de Materia Prima">
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
        </>
      )}

      {/* ── Vista de Notas de Pedido de Materia Prima (tabIndex === 1) ── */}
      {tabIndex === 1 && (
        <Box>
          <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Notas de Pedido de Materia Prima
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Entidad normalizada de requerimientos de materia prima emitida por Cuadra hacia Almacén y Compras.
              </Typography>
            </Box>
            <Chip
              icon={<AssignmentIcon fontSize="small" />}
              label={`${notasPedido.length} notas emitidas`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={1}
            sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflowX: 'auto', width: '100%' }}
          >
            <Table sx={{ width: '100%', minWidth: 850 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>N° Nota Pedido</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Orden de Producción</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha Emisión</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Turno de Cuadra</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Empleado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Materia Prima Solicitada</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Disponibilidad Stock</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, width: 180 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notasPedido.map((np) => {
                  const ordenAsociada = ordenes.find(
                    (o) => o.idOrdenProduccion === np.idOrdenProduccion || o.notaPedidoId === np.numeroNP
                  );

                  return (
                    <TableRow key={np.idNotaPedidoMP} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          icon={<AssignmentIcon style={{ fontSize: 14 }} />}
                          label={np.numeroNP}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {np.ordenNumero}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ref: OP-00{np.idOrdenProduccion}
                        </Typography>
                      </TableCell>
                      <TableCell>{np.fechaEmision}</TableCell>
                      <TableCell>{np.turno}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{np.empleadoNombre || np.responsable}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Legajo #{np.idEmpleado || 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {np.detalles.length} materia{np.detalles.length !== 1 ? 's' : ''} prima{np.detalles.length !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {np.detalles.map((d) => d.materiaPrimaNombre).join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip
                          icon={
                            np.estadoInsumos === 'Completo' ? (
                              <CheckCircleIcon style={{ fontSize: 15 }} />
                            ) : (
                              <WarningAmberIcon style={{ fontSize: 15 }} />
                            )
                          }
                          label={np.estadoInsumos === 'Completo' ? 'Materia Prima Completa' : 'Con Faltante'}
                          size="small"
                          color={np.estadoInsumos === 'Completo' ? 'success' : 'warning'}
                          variant={np.estadoInsumos === 'Completo' ? 'outlined' : 'filled'}
                          sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityOutlinedIcon />}
                          onClick={() => {
                            if (ordenAsociada) {
                              handleVerNotaPedidoDeOrden(ordenAsociada);
                            } else {
                              const insumos = (np.detalles || []).map((d, idx) => {
                                const mp = materiasPrimas.find(
                                  (m) => m.idMateriaPrima === d.idMateriaPrima || m.nombre?.toLowerCase() === (d.materiaPrimaNombre || d.nombre)?.toLowerCase()
                                );
                                const cant = d.cantidadRequerida ?? d.cantidad ?? 0;
                                const stock = mp ? mp.stockActual : (np.estadoInsumos === 'Faltante' ? 2 : cant + 10);
                                const falta = Math.max(0, Number((cant - stock).toFixed(2)));
                                return {
                                  idMateriaPrima: d.idMateriaPrima || mp?.idMateriaPrima || (idx + 1),
                                  nombre: d.materiaPrimaNombre || d.nombre || mp?.nombre || `Materia Prima #${idx + 1}`,
                                  tipo: mp?.tipo || 'Materia Prima',
                                  cantidadRequerida: cant,
                                  stockActual: stock,
                                  unidad: d.unidad || mp?.unidad || 'kg',
                                  esFaltante: falta > 0 || np.estadoInsumos === 'Faltante',
                                  faltante: falta,
                                  proveedorSugerido: mp?.proveedorSugerido || 'Proveedor Local Sugerido',
                                };
                              });

                              setNotaPedidoData({
                                idNotaPedidoMP: np.idNotaPedidoMP,
                                codigoNotaPedido: np.numeroNP,
                                numeroNP: np.numeroNP,
                                idOrdenProduccion: np.idOrdenProduccion,
                                numeroOrden: np.ordenNumero,
                                ordenNumero: np.ordenNumero,
                                fechaEmision: np.fechaEmision,
                                fecha: np.fechaEmision,
                                turno: np.turno,
                                responsable: np.responsable,
                                insumos,
                                hayFaltante: np.estadoInsumos === 'Faltante' || insumos.some((i) => i.esFaltante),
                                faltantes: insumos.filter((i) => i.esFaltante),
                                items: [{ productoNombre: 'Producción Programada', cantidadKilos: 50 }],
                                totalKilos: 50,
                              });
                              setOpenNotaPedidoDialog(true);
                            }
                          }}
                          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
                        >
                          Ver Materia Prima
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Fecha de Inicio (FechaInicio)"
                type="date"
                value={formFechaInicio}
                onChange={(e) => setFormFechaInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Fecha de Fin (FechaFin)"
                type="date"
                value={formFechaFin}
                onChange={(e) => setFormFechaFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
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
              <FormControl fullWidth size="small">
                <InputLabel id="select-empleado-label">Empleado Asignado (IdEmpleado)</InputLabel>
                <Select
                  labelId="select-empleado-label"
                  value={formIdEmpleado}
                  label="Empleado Asignado (IdEmpleado)"
                  onChange={(e) => {
                    const idEmp = Number(e.target.value);
                    setFormIdEmpleado(idEmp);
                    const emp = EMPLEADOS.find((em) => em.idEmpleado === idEmp);
                    if (emp) setFormResponsable(`${emp.nombre} (${emp.cargo})`);
                  }}
                >
                  {EMPLEADOS.map((emp) => (
                    <MenuItem key={emp.idEmpleado} value={emp.idEmpleado}>
                      Legajo #{emp.idEmpleado}: {emp.nombre} — {emp.cargo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size="small"
                options={MAQUINARIAS}
                getOptionLabel={(option) => `${option.codigo} - ${option.descripcion} (${option.tipo})`}
                value={MAQUINARIAS.filter((m) => formMaquinasIds.includes(m.idMaquinaria))}
                onChange={(_, newValues) => {
                  setFormMaquinasIds(newValues.map((v) => v.idMaquinaria));
                }}
                isOptionEqualToValue={(option, val) => option.idMaquinaria === val.idMaquinaria}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    return (
                      <Chip
                        {...tagProps}
                        key={option.idMaquinaria}
                        label={option.codigo}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Máquinas Asignadas a la Orden (MaquinariaProduccion)"
                    placeholder="Elegir máquinas de la línea..."
                    helperText="Asociación a nivel orden de producción (UML MaquinariaProduccion N:M)"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
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

      {/* ── Modal: Nota de Pedido de Materia Prima (NotaPedidoMateriaPrima) ── */}
      <Dialog
        open={openNotaPedidoDialog}
        onClose={() => setOpenNotaPedidoDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        {notaPedidoData && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="primary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Nota de Pedido de Materia Prima: {notaPedidoData.codigoNotaPedido || notaPedidoData.numeroNP}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Entidad de Dominio: <strong>NotaPedidoMateriaPrima</strong> (IdNotaPedidoMP: #{notaPedidoData.idNotaPedidoMP}) • {notaPedidoData.turno}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              {/* Tarjetas de Identificación de Dominio */}
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      ID NOTA PEDIDO (IdNotaPedidoMP)
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.3 }}>
                      #{notaPedidoData.idNotaPedidoMP} ({notaPedidoData.codigoNotaPedido || notaPedidoData.numeroNP})
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      ORDEN DE PRODUCCIÓN (IdOrdenProduccion)
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.3 }}>
                      #{notaPedidoData.idOrdenProduccion} ({notaPedidoData.numeroOrden || notaPedidoData.ordenNumero})
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '10px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      FECHA DE EMISIÓN (FechaEmision)
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.3 }}>
                      {notaPedidoData.fechaEmision || notaPedidoData.fecha}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Resumen de productos que originan esta nota de pedido */}
              {notaPedidoData.items && notaPedidoData.items.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    PRODUCTOS A ELABORAR INCLUIDOS EN ESTA NOTA:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.8 }}>
                    {notaPedidoData.items.map((it, idx) => (
                      <Chip
                        key={idx}
                        label={`${it.productoNombre}: ${it.cantidadKilos || it.cantidadPlanificada} kg`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    ))}
                    {notaPedidoData.totalKilos && (
                      <Chip
                        label={`Total: ${notaPedidoData.totalKilos} kg`}
                        color="primary"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Alerta de faltante */}
              {notaPedidoData.hayFaltante ? (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: '10px' }}>
                  <AlertTitle sx={{ fontWeight: 700 }}>Faltante de Materia Prima en Almacén</AlertTitle>
                  Se detectaron materias primas con stock insuficiente para cubrir la totalidad del lote.
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>
                  ¡Stock disponible verificado! Todas las materias primas requeridas se encuentran en almacén
                  para el inicio de la jornada.
                </Alert>
              )}

              {/* Tabla consolidada de Materias Primas */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Detalles del Pedido de Materia Prima (DetalleNotaPedidoMateriaPrima)
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px', maxHeight: 280, overflowY: 'auto' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: 80 }}>Id MP</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Materia Prima (Nombre)</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Stock Actual</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(!notaPedidoData.insumos || notaPedidoData.insumos.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          No hay materia prima registrada para esta nota de pedido.
                        </TableCell>
                      </TableRow>
                    ) : (
                      notaPedidoData.insumos.map((ins, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            #{ins.idMateriaPrima || idx + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{ins.nombre || ins.materiaPrimaNombre}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{ins.tipo || 'Materia Prima'}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {ins.cantidadRequerida ?? ins.cantidad} {ins.unidad || 'kg'}
                          </TableCell>
                          <TableCell align="right" sx={{ color: ins.esFaltante ? 'error.main' : 'text.secondary', fontWeight: 600 }}>
                            {ins.stockActual ?? 0} {ins.unidad || 'kg'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setOpenNotaPedidoDialog(false)} color="inherit" sx={{ fontWeight: 600 }}>
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setOpenNotaPedidoDialog(false);
                  setSnackbar({
                    open: true,
                    message: `Nota de pedido ${notaPedidoData.codigoNotaPedido || notaPedidoData.numeroNP} verificada y vinculada a la orden.`,
                    severity: 'success',
                  });
                }}
                variant="contained"
                color="primary"
                startIcon={<CheckCircleIcon />}
                sx={{ fontWeight: 600 }}
              >
                Aceptar y Confirmar Materia Prima
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
                  Nota de Pedido de Materia Prima: <strong>{selectedOrden.notaPedidoId}</strong>
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
                      CRONOGRAMA DE CUADRA (OrdenDeProduccion)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Inicio: <strong>{selectedOrden.fechaInicio || selectedOrden.fechaProgramada}</strong> | Fin: <strong>{selectedOrden.fechaFin || selectedOrden.fechaProgramada}</strong> (Emisión: {selectedOrden.fechaEmision})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">{selectedOrden.turno}</Typography>
                    </Box>
                    <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                        <PrecisionManufacturingIcon fontSize="small" color="primary" />
                        MÁQUINAS ASIGNADAS A LA ORDEN (MaquinariaProduccion N:M):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        {selectedOrden.maquinariaProduccion && selectedOrden.maquinariaProduccion.length > 0 ? (
                          selectedOrden.maquinariaProduccion.map((m, idx) => (
                            <Chip
                              key={idx}
                              icon={<PrecisionManufacturingIcon style={{ fontSize: 14 }} />}
                              label={`${m.codigo ? m.codigo + ' - ' : ''}${m.descripcion}${m.tipo ? ` [${m.tipo}]` : ''}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {selectedOrden.maquinaNombre || 'Sin máquinas asignadas'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 1 }}>
                      <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">
                        Empleado Asignado (IdEmpleado #{selectedOrden.idEmpleado || 1}): <strong>{selectedOrden.empleadoNombre || selectedOrden.responsable}</strong>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Lista de Productos Cargados en la Orden (DetalleOrdenDeProduccion) */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Detalle de la Orden de Producción (DetalleOrdenDeProduccion)
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '10px' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Producto Fabricable</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Categoría / Tipo</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Cant. Planificada</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Cant. Producida</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrden.items && selectedOrden.items.length > 0 ? (
                        selectedOrden.items.map((it, idx) => {
                          const cantPlan = it.cantidadPlanificada || it.cantidadKilos;
                          const cantProd = it.cantidadProducida || (selectedOrden.estado === 'Finalizada' ? cantPlan : (selectedOrden.estado === 'En Proceso' ? Math.round(cantPlan * 0.5) : 0));
                          return (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontWeight: 600 }}>{it.productoNombre}</TableCell>
                              <TableCell sx={{ color: 'text.secondary' }}>{it.categoria || 'Pastas'}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {cantPlan} kg
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: cantProd >= cantPlan ? 'success.main' : 'text.secondary' }}>
                                {cantProd} kg
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  label={cantProd >= cantPlan ? 'Completado' : (selectedOrden.estado === 'En Proceso' ? 'En Elaboración' : 'Pendiente')}
                                  color={cantProd >= cantPlan ? 'success' : (selectedOrden.estado === 'En Proceso' ? 'primary' : 'default')}
                                  variant="outlined"
                                  sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>{selectedOrden.productoNombre}</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>Pastas</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {selectedOrden.cantidadKilos} kg
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            {selectedOrden.estado === 'Finalizada' ? selectedOrden.cantidadKilos : 0} kg
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={selectedOrden.estado} color={ESTADO_OP_COLORS[selectedOrden.estado]} variant="outlined" />
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
                      : 'Atención: Materia prima con faltante en almacén'}
                  </AlertTitle>
                  Proveedor local sugerido:{' '}
                  <strong>{selectedOrden.proveedorSugerido || 'Quinta Don Pedro (Local)'}</strong>
                  {selectedOrden.solicitudCompraGenerada &&
                    ' — El departamento de compras gestionó la reposición para la jornada.'}
                </Alert>
              )}

              {/* Botón para ver la Nota de Pedido de Materia Prima */}
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
