import { useState, useMemo } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

import {
  INITIAL_ORDENES_COMPRA,
  INITIAL_PROVEEDORES,
  INITIAL_PRESUPUESTOS,
} from "./mockData";
import { DetalleItemsTable } from "../../components/compras";

const STATUS_COLOR_MAP = {
  Cumplida: "success",
  Enviada: "info",
  "Recibida Parcial": "warning",
  Pendiente: "warning",
  Cancelada: "error",
};

export const OrdenCompraScreen = () => {
  const [ordenes, setOrdenes] = useState(INITIAL_ORDENES_COMPRA);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [viewMode, setViewMode] = useState("table");

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialFormState = {
    proveedorId: 1,
    presupuestoId: "PP-2026-001",
    fechaEmision: new Date().toISOString().split("T")[0],
    fechaEntregaEstimada: "",
    formaPago: "Transferencia Bancaria a 30 días",
    estado: "Pendiente",
    observaciones: "",
    items: [
      {
        id: 1,
        materiaPrima: "Harina 0000 Especial Pastas (bolsa 50kg)",
        unidad: "Bolsas",
        cantidad: 80,
        precioUnitario: 32000,
        subtotal: 2560000,
      },
    ],
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filtrado
  const filteredOrdenes = useMemo(() => {
    return ordenes.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.presupuestoId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "TODOS" || o.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [ordenes, searchTerm, statusFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = ordenes.length;
    const enviadas = ordenes.filter((o) => o.estado === "Enviada").length;
    const cumplidas = ordenes.filter((o) => o.estado === "Cumplida").length;
    const pendientes = ordenes.filter(
      (o) => o.estado === "Pendiente" || o.estado === "Recibida Parcial",
    ).length;
    return { total, enviadas, cumplidas, pendientes };
  }, [ordenes]);

  // Acciones
  const handleOpenDetail = (orden) => {
    setSelectedOrden(orden);
    setOpenDetail(true);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    // Cargar ítems del presupuesto inicial por defecto si existe
    const defaultPresupuesto = INITIAL_PRESUPUESTOS.find(
      (p) => p.id === "PP-2026-001",
    );
    setFormData({
      ...initialFormState,
      items: defaultPresupuesto?.items
        ? defaultPresupuesto.items.map((it, idx) => ({ ...it, id: idx + 1 }))
        : [...initialFormState.items],
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (orden) => {
    setIsEditing(true);
    setSelectedOrden(orden);
    setFormData({
      proveedorId: orden.proveedorId,
      presupuestoId: orden.presupuestoId || "",
      fechaEmision: orden.fechaEmision,
      fechaEntregaEstimada: orden.fechaEntregaEstimada,
      formaPago: orden.formaPago,
      estado: orden.estado,
      observaciones: orden.observaciones || "",
      items:
        orden.items && orden.items.length > 0
          ? orden.items.map((it, idx) => ({ ...it, id: it.id || idx + 1 }))
          : [...initialFormState.items],
    });
    setOpenForm(true);
  };

  const handleImportarPresupuesto = () => {
    if (!formData.presupuestoId) return;
    const p = INITIAL_PRESUPUESTOS.find(
      (item) => item.id === formData.presupuestoId,
    );
    if (p?.items?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        proveedorId: p.proveedorId || prev.proveedorId,
        items: p.items.map((it, idx) => ({ ...it, id: idx + 1 })),
      }));
    }
  };

  const handleOpenDelete = (orden) => {
    setSelectedOrden(orden);
    setOpenDelete(true);
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o)),
    );
    if (selectedOrden?.id === id) {
      setSelectedOrden((prev) => ({ ...prev, estado: nuevoEstado }));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.items || formData.items.length === 0) {
      alert("Debe incluir al menos un insumo en la orden de compra.");
      return;
    }
    const prov = INITIAL_PROVEEDORES.find(
      (p) => p.id === Number(formData.proveedorId),
    );
    const total = formData.items.reduce(
      (acc, it) => acc + (Number(it.subtotal) || 0),
      0,
    );

    if (isEditing && selectedOrden) {
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id === selectedOrden.id
            ? {
                ...o,
                proveedorId: prov?.id || 1,
                proveedorNombre: prov?.razonSocial || "Proveedor",
                presupuestoId: formData.presupuestoId || null,
                fechaEmision: formData.fechaEmision,
                fechaEntregaEstimada: formData.fechaEntregaEstimada,
                formaPago: formData.formaPago,
                estado: formData.estado,
                observaciones: formData.observaciones,
                items: formData.items,
                total,
              }
            : o,
        ),
      );
    } else {
      const nextNum = 100 + ordenes.length + 1;
      const newOrden = {
        id: `OC-2026-0${nextNum}`,
        proveedorId: prov?.id || 1,
        proveedorNombre: prov?.razonSocial || "Proveedor",
        presupuestoId: formData.presupuestoId || null,
        fechaEmision: formData.fechaEmision,
        fechaEntregaEstimada: formData.fechaEntregaEstimada || "2026-03-25",
        formaPago: formData.formaPago,
        estado: formData.estado,
        observaciones: formData.observaciones,
        items: formData.items,
        total,
      };
      setOrdenes((prev) => [newOrden, ...prev]);
    }
    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setOrdenes((prev) => prev.filter((o) => o.id !== selectedOrden.id));
    setOpenDelete(false);
    setSelectedOrden(null);
  };

  return (
    <Box>
      {/* Tarjetas de Métricas Rápidas - Responsivas con igual ancho apiladas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <ShoppingCartIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Total Órdenes
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
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              bgcolor: "info.main",
              color: "white",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <LocalShippingIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              En Tránsito / Enviadas
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "info.main" }}
            >
              {stats.enviadas}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              bgcolor: "success.main",
              color: "white",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <AssignmentTurnedInIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Cumplidas / En Planta
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {stats.cumplidas}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              bgcolor: "warning.main",
              color: "white",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <WarningAmberIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Pendientes / Parciales
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              {stats.pendientes}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Barra de Filtros y Acción */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            flex: 1,
            minWidth: 260,
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar por Nº Orden, Proveedor o Presupuesto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: 300 },
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
                borderRadius: "10px",
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 220, md: 240 },
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
                borderRadius: "10px",
              },
            }}
          >
            <InputLabel id="orden-status-filter-label">
              Estado de Orden
            </InputLabel>
            <Select
              labelId="orden-status-filter-label"
              value={statusFilter}
              label="Estado de Orden"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los Estados</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Enviada">Enviada</MenuItem>
              <MenuItem value="Recibida Parcial">Recibida Parcial</MenuItem>
              <MenuItem value="Cumplida">Cumplida</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => val && setViewMode(val)}
            size="small"
            sx={{ bgcolor: "background.paper" }}
          >
            <ToggleButton value="table" aria-label="vista tabla">
              <Tooltip title="Vista Tabla">
                <ViewListIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="grid" aria-label="vista cuadrícula">
              <Tooltip title="Vista Cuadrícula / Móvil">
                <ViewModuleIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ whiteSpace: "nowrap" }}
          >
            Nueva Orden de Compra
          </Button>
        </Box>
      </Box>

      {/* Vista de Cuadrícula / Tarjetas Responsiva */}
      {viewMode === "grid" &&
        (filteredOrdenes.length === 0 ? (
          <Paper
            elevation={1}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No se encontraron órdenes de compra con los filtros aplicados.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2.5,
              alignItems: "stretch",
            }}
          >
            {filteredOrdenes.map((orden) => (
              <Paper
                key={orden.id}
                elevation={1}
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {/* Cabecera de la Tarjeta */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Chip
                    label={orden.id}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 800, fontFamily: "monospace" }}
                  />
                  <Chip
                    label={orden.estado}
                    size="small"
                    color={STATUS_COLOR_MAP[orden.estado] || "default"}
                    sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                  />
                </Box>

                {/* Proveedor y Presupuesto Referencia */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    lineHeight: 1.3,
                    mb: 0.5,
                  }}
                >
                  {orden.proveedorNombre}
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  {orden.presupuestoId ? (
                    <Chip
                      label={`Ref: ${orden.presupuestoId}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: "monospace", fontSize: "0.72rem" }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Compra Directa Local
                    </Typography>
                  )}
                </Box>

                {/* Resumen de Insumos */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    bgcolor: "action.hover",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700, display: "block" }}
                  >
                    MATERIA PRIMA SOLICITADA:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.3 }}>
                    {orden.items[0]?.materiaPrima || "Insumos varios"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cantidad: {orden.items[0]?.cantidad}{" "}
                    {orden.items[0]?.unidad} · Unit: $
                    {orden.items[0]?.precioUnitario?.toLocaleString("es-AR")}
                  </Typography>
                </Paper>

                {/* Monto Total */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    bgcolor: "primary.50",
                    border: "1px dashed",
                    borderColor: "primary.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "text.secondary" }}
                  >
                    TOTAL DE LA ORDEN
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "primary.main" }}
                  >
                    ${orden.total.toLocaleString("es-AR")}
                  </Typography>
                </Box>

                {/* Fechas y Condiciones */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <CalendarMonthOutlinedIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Emisión: {orden.fechaEmision} · Entrega:{" "}
                      <strong>{orden.fechaEntregaEstimada}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <PaymentOutlinedIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Pago: <strong>{orden.formaPago}</strong>
                    </Typography>
                  </Box>
                </Box>

                {/* Acciones al Pie fijadas abajo */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {orden.estado === "Pendiente" && (
                      <Tooltip title="Marcar como Enviada al Proveedor">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCambiarEstado(orden.id, "Enviada")
                          }
                          sx={{ color: "info.main", bgcolor: "info.50" }}
                        >
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(orden.estado === "Enviada" ||
                      orden.estado === "Recibida Parcial") && (
                      <Tooltip title="Conformar recepción total (Cumplida)">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCambiarEstado(orden.id, "Cumplida")
                          }
                          sx={{ color: "success.main", bgcolor: "success.50" }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Ver desglose y materias primas">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetail(orden)}
                        sx={{ color: "text.secondary" }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar orden">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(orden)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar orden">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDelete(orden)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        ))}

      {/* Vista Tabla Estándar */}
      {viewMode === "table" && (
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 720 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Nº Orden</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Proveedor</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Presupuesto Vinculado
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Emisión / Entrega
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrdenes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 6, color: "text.secondary" }}
                  >
                    <Typography variant="body2">
                      No se encontraron órdenes de compra
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrdenes.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: "primary.main",
                      }}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {row.proveedorNombre}
                    </TableCell>
                    <TableCell>
                      {row.presupuestoId ? (
                        <Chip
                          label={row.presupuestoId}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ fontFamily: "monospace" }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Compra Directa Local
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", fontWeight: 600 }}
                      >
                        Emisión: {row.fechaEmision}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Entrega: {row.fechaEntregaEstimada}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      ${row.total.toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.estado}
                        size="small"
                        color={STATUS_COLOR_MAP[row.estado] || "default"}
                        sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver desglose y materias primas">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(row)}
                          sx={{ color: "text.secondary" }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {row.estado === "Pendiente" && (
                        <Tooltip title="Marcar como Enviada al Proveedor">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCambiarEstado(row.id, "Enviada")
                            }
                            sx={{ color: "info.main" }}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {(row.estado === "Enviada" ||
                        row.estado === "Recibida Parcial") && (
                        <Tooltip title="Conformar recepción total (Cumplida)">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCambiarEstado(row.id, "Cumplida")
                            }
                            sx={{ color: "success.main" }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Editar orden">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(row)}
                          sx={{ color: "primary.main" }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancelar orden">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDelete(row)}
                          sx={{ color: "error.main" }}
                        >
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

      {/* Modal Dialog: Detalle de Orden de Compra - UI Estilizada y Prolija */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(15, 23, 42, 0.45)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 24px 60px rgba(0,0,0,0.6)"
                : "0 24px 60px rgba(15, 23, 42, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
              }}
            >
              <ShoppingCartIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Orden de Compra #{selectedOrden?.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Proveedor: {selectedOrden?.proveedorNombre}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={selectedOrden?.estado}
              size="small"
              color={STATUS_COLOR_MAP[selectedOrden?.estado] || "default"}
              sx={{ fontWeight: 700 }}
            />
            <IconButton onClick={() => setOpenDetail(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3.5,
            pt: "24px !important",
            pb: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {selectedOrden && (
            <>
              {/* Información de Emisión */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <BusinessIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Condiciones Comerciales y Logística
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Proveedor Asignado
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {selectedOrden.proveedorNombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Presupuesto Base:{" "}
                      {selectedOrden.presupuestoId ||
                        "Compra Directa Inmediata"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Emisión:{" "}
                      <strong>{selectedOrden.fechaEmision}</strong>
                    </Typography>
                    <br />
                    <Typography variant="body2" color="text.secondary">
                      Fecha Estimada de Entrega:{" "}
                      <strong>{selectedOrden.fechaEntregaEstimada}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Desglose de Insumos */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <ShoppingCartOutlinedIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, textTransform: "uppercase" }}
                  >
                    Insumos Solicitados para Producción
                  </Typography>
                </Box>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ borderRadius: "10px" }}
                >
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "action.hover" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>
                          Materia Prima / Insumo
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          Precio Unitario
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Subtotal
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrden.items.map((item, idx) => (
                        <TableRow key={item.id ?? `${item.materiaPrima}-${idx}`}>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {item.materiaPrima}
                          </TableCell>
                          <TableCell>
                            {item.cantidad} {item.unidad}
                          </TableCell>
                          <TableCell>
                            ${item.precioUnitario.toLocaleString("es-AR")}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            ${item.subtotal.toLocaleString("es-AR")}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ bgcolor: "action.hover" }}>
                        <TableCell
                          colSpan={3}
                          sx={{ fontWeight: 700, textAlign: "right" }}
                        >
                          TOTAL DE LA ORDEN:
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 800,
                            color: "primary.main",
                            fontSize: "1.1rem",
                          }}
                        >
                          ${selectedOrden.total.toLocaleString("es-AR")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "action.hover",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {selectedOrden?.estado === "Pendiente" && (
            <Button
              onClick={() => handleCambiarEstado(selectedOrden.id, "Enviada")}
              variant="contained"
              color="info"
              startIcon={<SendIcon />}
            >
              Enviar al Proveedor
            </Button>
          )}
          {(selectedOrden?.estado === "Enviada" ||
            selectedOrden?.estado === "Recibida Parcial") && (
            <Button
              onClick={() => handleCambiarEstado(selectedOrden.id, "Cumplida")}
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              Marcar como Cumplida
            </Button>
          )}
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Alta / Edición de Orden de Compra */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(15, 23, 42, 0.45)",
            },
          },
        }}
        PaperProps={{
          component: "form",
          onSubmit: handleSaveForm,
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
              }}
            >
              <ShoppingCartIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                {isEditing
                  ? `Editar Orden · ${selectedOrden?.id}`
                  : "Crear Nueva Orden de Compra"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Emisión contractual para abastecimiento y control de ingresos a
                planta
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setOpenForm(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 3.5,
            pt: "24px !important",
            pb: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            overflowY: "auto",
          }}
        >
          {/* 1. Proveedor y Presupuesto */}
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: "14px", bgcolor: "background.paper" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <BusinessIcon fontSize="small" sx={{ color: "primary.main" }} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                1. Proveedor y Presupuesto de Referencia
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="orden-proveedor-label">Proveedor</InputLabel>
                  <Select
                    labelId="orden-proveedor-label"
                    value={formData.proveedorId}
                    label="Proveedor"
                    onChange={(e) =>
                      setFormData({ ...formData, proveedorId: e.target.value })
                    }
                  >
                    {INITIAL_PROVEEDORES.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.razonSocial}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="orden-presupuesto-label">
                    Presupuesto Aprobado de Referencia
                  </InputLabel>
                  <Select
                    labelId="orden-presupuesto-label"
                    value={formData.presupuestoId}
                    label="Presupuesto Aprobado de Referencia"
                    onChange={(e) => {
                      const val = e.target.value;
                      const p = INITIAL_PRESUPUESTOS.find(
                        (item) => item.id === val,
                      );
                      if (p?.items && p.items.length > 0) {
                        setFormData((prev) => ({
                          ...prev,
                          presupuestoId: val,
                          proveedorId: p.proveedorId || prev.proveedorId,
                          items: p.items.map((it, idx) => ({
                            ...it,
                            id: idx + 1,
                          })),
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          presupuestoId: val,
                        }));
                      }
                    }}
                  >
                    <MenuItem value="">
                      Sin presupuesto (Compra Directa)
                    </MenuItem>
                    {INITIAL_PRESUPUESTOS.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.id} - {p.proveedorNombre} ($
                        {p.total.toLocaleString("es-AR")})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* 2. Plazos y Estado de Entrega */}
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: "14px", bgcolor: "background.paper" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <EventNoteIcon fontSize="small" sx={{ color: "primary.main" }} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                2. Plazos y Estado de Entrega
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Fecha de Emisión"
                  value={formData.fechaEmision}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaEmision: e.target.value })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Fecha Estimada de Entrega"
                  value={formData.fechaEntregaEstimada}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaEntregaEstimada: e.target.value,
                    })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          {/* 3. Detalle de Insumos Solicitados */}
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: "14px", bgcolor: "background.paper" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ShoppingCartOutlinedIcon
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  3. Detalle de Insumos Solicitados
                </Typography>
              </Box>
              <Chip
                size="small"
                label={`${formData.items?.length || 0} ${formData.items?.length === 1 ? "insumo" : "insumos"}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Box>

            <DetalleItemsTable
              items={formData.items || []}
              onChange={(newItems) =>
                setFormData((prev) => ({ ...prev, items: newItems }))
              }
              presupuestoDisponible={Boolean(formData.presupuestoId)}
              onImportPresupuesto={handleImportarPresupuesto}
              unitReadOnly
              priceReadOnly
            />
          </Paper>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3.5,
            py: 2,
            bgcolor: "action.hover",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setOpenForm(false)}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 3, fontWeight: 700 }}
          >
            {isEditing ? "Guardar Cambios" : "Emitir Orden de Compra"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Confirmar Cancelación/Eliminación */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(15, 23, 42, 0.45)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "error.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningAmberIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Cancelar Orden de Compra
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: "24px !important", pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Confirma que desea cancelar o eliminar la orden{" "}
            <strong>{selectedOrden?.id}</strong> a{" "}
            <strong>{selectedOrden?.proveedorNombre}</strong> por valor de{" "}
            <strong>${selectedOrden?.total?.toLocaleString("es-AR")}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            Volver
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ fontWeight: 700 }}
          >
            Confirmar Baja
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdenCompraScreen;
