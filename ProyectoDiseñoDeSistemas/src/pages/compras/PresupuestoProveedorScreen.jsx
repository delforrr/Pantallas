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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VerifiedIcon from "@mui/icons-material/Verified";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

import {
  INITIAL_PRESUPUESTOS,
  INITIAL_PROVEEDORES,
  MOCK_DOC_PRESUPUESTO,
} from "./mockData";
import { DocumentoUploader } from "../../components/compras";

const STATUS_COLOR_MAP = {
  Aprobado: "success",
  Pendiente: "warning",
  Rechazado: "error",
  Vencido: "default",
};

const INITIAL_FORM_STATE = {
  proveedorId: 1,
  fechaEmision: "2026-03-15",
  validezHasta: "2026-04-04",
  tipoCompra: "Semestral (Marzo - Temporada Baja)",
  estado: "Pendiente",
  condicionPago: "30 días Fecha Factura",
  total: 3500000,
  observaciones: "",
  documentoUrl: "",
  items: [],
};

export const PresupuestoProveedorScreen = () => {
  const [presupuestos, setPresupuestos] = useState(INITIAL_PRESUPUESTOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [tipoFilter] = useState("TODOS");
  const [viewMode, setViewMode] = useState("table");

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Filtrado
  const filteredPresupuestos = useMemo(() => {
    return presupuestos.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cuit.includes(searchTerm);

      const matchesStatus =
        statusFilter === "TODOS" || p.estado === statusFilter;
      const matchesTipo =
        tipoFilter === "TODOS" || p.tipoCompra.includes(tipoFilter);

      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [presupuestos, searchTerm, statusFilter, tipoFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = presupuestos.length;
    const pendientes = presupuestos.filter(
      (p) => p.estado === "Pendiente",
    ).length;
    const aprobados = presupuestos.filter(
      (p) => p.estado === "Aprobado",
    ).length;
    const montoAprobado = presupuestos
      .filter((p) => p.estado === "Aprobado")
      .reduce((acc, curr) => acc + curr.total, 0);

    return { total, pendientes, aprobados, montoAprobado };
  }, [presupuestos]);

  // Acciones
  const handleOpenDetail = (item) => {
    setSelectedPresupuesto(item);
    setOpenDetail(true);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(INITIAL_FORM_STATE);
    setOpenForm(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setSelectedPresupuesto(item);
    setFormData({
      proveedorId: item.proveedorId,
      fechaEmision: item.fechaEmision,
      validezHasta: item.validezHasta,
      tipoCompra: item.tipoCompra,
      estado: item.estado,
      condicionPago: item.condicionPago || "30 días Fecha Factura",
      total: item.total || 0,
      observaciones: item.observaciones || "",
      documentoUrl: item.documentoUrl || MOCK_DOC_PRESUPUESTO,
      items: item.items || [],
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedPresupuesto(item);
    setOpenDelete(true);
  };

  const handleAprobarPresupuesto = (id) => {
    setPresupuestos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: "Aprobado" } : p)),
    );
    if (selectedPresupuesto?.id === id) {
      setSelectedPresupuesto((prev) => ({ ...prev, estado: "Aprobado" }));
    }
  };

  const handleRechazarPresupuesto = (id) => {
    setPresupuestos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: "Rechazado" } : p)),
    );
    if (selectedPresupuesto?.id === id) {
      setSelectedPresupuesto((prev) => ({ ...prev, estado: "Rechazado" }));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find(
      (p) => p.id === Number(formData.proveedorId),
    );
    const totalMonto = Number(formData.total) || 0;

    if (isEditing && selectedPresupuesto) {
      setPresupuestos((prev) =>
        prev.map((p) =>
          p.id === selectedPresupuesto.id
            ? {
                ...p,
                proveedorId: prov?.id || 1,
                proveedorNombre: prov?.razonSocial || "Proveedor",
                cuit: prov?.cuit || "",
                fechaEmision: formData.fechaEmision,
                validezHasta: formData.validezHasta,
                tipoCompra: formData.tipoCompra,
                estado: formData.estado,
                condicionPago: formData.condicionPago,
                observaciones: formData.observaciones,
                total: totalMonto,
                documentoUrl:
                  formData.documentoUrl ||
                  p.documentoUrl ||
                  MOCK_DOC_PRESUPUESTO,
              }
            : p,
        ),
      );
    } else {
      const nextNum = presupuestos.length + 1;
      const newPresupuesto = {
        id: `PP-2026-00${nextNum}`,
        proveedorId: prov?.id || 1,
        proveedorNombre: prov?.razonSocial || "Proveedor",
        cuit: prov?.cuit || "",
        fechaEmision: formData.fechaEmision,
        validezHasta: formData.validezHasta || "2026-03-31",
        tipoCompra: formData.tipoCompra,
        estado: formData.estado,
        condicionPago: formData.condicionPago,
        observaciones: formData.observaciones,
        items: [],
        total: totalMonto,
        documentoUrl: formData.documentoUrl || MOCK_DOC_PRESUPUESTO,
      };
      setPresupuestos((prev) => [newPresupuesto, ...prev]);
    }

    setOpenForm(false);
  };

  const handleDeleteConfirm = () => {
    setPresupuestos((prev) =>
      prev.filter((p) => p.id !== selectedPresupuesto.id),
    );
    setOpenDelete(false);
    setSelectedPresupuesto(null);
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
            <RequestQuoteIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Total Presupuestos
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
              bgcolor: "warning.main",
              color: "white",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <HourglassEmptyIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Pendientes de Decisión
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              {stats.pendientes}
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
            <VerifiedIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Presupuestos Aprobados
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {stats.aprobados}
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
            <PriceCheckIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Compromiso Aprobado
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ${stats.montoAprobado.toLocaleString("es-AR")}
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
            placeholder="Buscar por ID, Proveedor o CUIT..."
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
              minWidth: { xs: "100%", sm: 280 },
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
            <InputLabel id="estado-pres-label">Estado</InputLabel>
            <Select
              labelId="estado-pres-label"
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los Estados</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Aprobado">Aprobado</MenuItem>
              <MenuItem value="Rechazado">Rechazado</MenuItem>
              <MenuItem value="Vencido">Vencido</MenuItem>
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
            <ToggleButton value="grid" aria-label="vista tarjetas">
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
            Cargar Presupuesto
          </Button>
        </Box>
      </Box>

      {/* Vista de Cuadrícula / Tarjetas Responsiva */}
      {viewMode === "grid" &&
        (filteredPresupuestos.length === 0 ? (
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
              No se encontraron cotizaciones con los filtros aplicados.
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
            {filteredPresupuestos.map((item) => (
              <Paper
                key={item.id}
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
                    label={item.id}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 800, fontFamily: "monospace" }}
                  />
                  <Chip
                    label={item.estado}
                    size="small"
                    color={STATUS_COLOR_MAP[item.estado] || "default"}
                    sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                  />
                </Box>

                {/* Proveedor y CUIT */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    lineHeight: 1.3,
                    mb: 0.5,
                  }}
                >
                  {item.proveedorNombre}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1.5 }}
                >
                  CUIT: {item.cuit}
                </Typography>

                {/* Modalidad */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={
                      item.tipoCompra.includes("Semestral")
                        ? "Semestral"
                        : "Local"
                    }
                    sx={{ fontSize: "0.72rem", fontWeight: 600 }}
                  />
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
                    MATERIA PRIMA PRINCIPAL:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.3 }}>
                    {item.items[0]?.materiaPrima || "Insumo varios"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cantidad: {item.items[0]?.cantidad} {item.items[0]?.unidad}{" "}
                    · Unit: $
                    {item.items[0]?.precioUnitario?.toLocaleString("es-AR")}
                  </Typography>
                </Paper>

                {/* Monto Total Cotizado */}
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
                    TOTAL COTIZADO
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "primary.main" }}
                  >
                    ${item.total.toLocaleString("es-AR")}
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
                      Validez: <strong>{item.validezHasta}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <PaymentOutlinedIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Pago: <strong>{item.condicionPago}</strong>
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
                    {item.estado === "Pendiente" && (
                      <>
                        <Tooltip title="Aprobar presupuesto">
                          <IconButton
                            size="small"
                            onClick={() => handleAprobarPresupuesto(item.id)}
                            sx={{
                              color: "success.main",
                              bgcolor: "success.50",
                            }}
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar presupuesto">
                          <IconButton
                            size="small"
                            onClick={() => handleRechazarPresupuesto(item.id)}
                            sx={{ color: "error.main", bgcolor: "error.50" }}
                          >
                            <HighlightOffIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Ver detalle completo">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetail(item)}
                        sx={{ color: "text.secondary" }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(item)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDelete(item)}
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
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Nº Presupuesto</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Proveedor & CUIT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tipo de Compra</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Validez Hasta</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Cotizado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPresupuestos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 6, color: "text.secondary" }}
                  >
                    <Typography variant="body2">
                      No se encontraron cotizaciones
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPresupuestos.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontFamily: "monospace",
                      }}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {row.proveedorNombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        CUIT: {row.cuit}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, display: "block" }}
                      >
                        {row.tipoCompra}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pago: {row.condicionPago}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.validezHasta}</TableCell>
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
                      <Tooltip title="Ver desglose de cotización">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(row)}
                          sx={{ color: "text.secondary" }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {row.estado === "Pendiente" && (
                        <>
                          <Tooltip title="Aprobar para compra">
                            <IconButton
                              size="small"
                              onClick={() => handleAprobarPresupuesto(row.id)}
                              sx={{ color: "success.main" }}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rechazar presupuesto">
                            <IconButton
                              size="small"
                              onClick={() => handleRechazarPresupuesto(row.id)}
                              sx={{ color: "error.main" }}
                            >
                              <HighlightOffIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(row)}
                          sx={{ color: "primary.main" }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
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

      {/* Modal Dialog: Detalle Completo de Presupuesto - UI Estilizada y Prolija */}
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
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
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
              <RequestQuoteIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Cotización #{selectedPresupuesto?.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedPresupuesto?.proveedorNombre} · CUIT:{" "}
                {selectedPresupuesto?.cuit}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={selectedPresupuesto?.estado}
              size="small"
              color={STATUS_COLOR_MAP[selectedPresupuesto?.estado] || "default"}
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
            pb: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {selectedPresupuesto && (
            <>
              {/* Sección 1: Información Comercial */}
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
                    sx={{ fontWeight: 700, textTransform: "uppercase" }}
                  >
                    Condiciones Comerciales y Evaluación
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Emisión
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedPresupuesto.fechaEmision}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Validez de Oferta
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedPresupuesto.validezHasta}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Sección 2: Comprobante Oficial Adjunto */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  bgcolor: "background.paper",
                }}
              >
                <DocumentoUploader
                  label="Comprobante / Cotización Oficial Adjunta"
                  value={
                    selectedPresupuesto.documentoUrl || MOCK_DOC_PRESUPUESTO
                  }
                  readOnly
                />
              </Paper>

              {/* Sección 3: Desglose de Insumos (si existen cargados históricamente) */}
              {selectedPresupuesto.items &&
                selectedPresupuesto.items.length > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <ShoppingCartOutlinedIcon
                        fontSize="small"
                        sx={{ color: "primary.main" }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, textTransform: "uppercase" }}
                      >
                        Materias Primas Cotizadas (Histórico)
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
                            <TableCell sx={{ fontWeight: 700 }}>
                              Cantidad
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              Precio Unitario
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                              Subtotal
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedPresupuesto.items.map((item) => (
                            <TableRow key={item.id}>
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
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}

              {/* Resumen de Monto Total */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: "14px",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(0, 146, 70, 0.12)"
                      : "rgba(0, 146, 70, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Monto Total Cotizado:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "primary.main" }}
                >
                  ${selectedPresupuesto.total.toLocaleString("es-AR")}
                </Typography>
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
          {selectedPresupuesto?.estado === "Pendiente" && (
            <>
              <Button
                onClick={() =>
                  handleRechazarPresupuesto(selectedPresupuesto.id)
                }
                color="error"
                variant="outlined"
              >
                Rechazar Oferta
              </Button>
              <Button
                onClick={() => handleAprobarPresupuesto(selectedPresupuesto.id)}
                color="success"
                variant="contained"
              >
                Aprobar Cotización
              </Button>
            </>
          )}
          <Button onClick={() => setOpenDetail(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Alta / Edición de Presupuesto */}
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
              <RequestQuoteIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                {isEditing
                  ? `Editar Cotización · ${selectedPresupuesto?.id}`
                  : "Registrar Cotización de Proveedor"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Carga comparativa semestral (marzo/diciembre) o reposición
                rápida de materias primas
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
          {/* Sección 1: Proveedor y Modalidad Comercial */}
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
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                1. Proveedor y Modalidad Comercial
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="prov-emisor-label">
                    Proveedor Emisor
                  </InputLabel>
                  <Select
                    labelId="prov-emisor-label"
                    value={formData.proveedorId}
                    label="Proveedor Emisor"
                    onChange={(e) =>
                      setFormData({ ...formData, proveedorId: e.target.value })
                    }
                  >
                    {INITIAL_PROVEEDORES.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.razonSocial} ({p.categoria})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Sección 2: Vigencia, Plazos y Calidad */}
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
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                2. Vigencia, Importe y Condiciones
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
                  label="Validez de Oferta Hasta"
                  value={formData.validezHasta}
                  onChange={(e) =>
                    setFormData({ ...formData, validezHasta: e.target.value })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Monto Total Cotizado"
                  value={formData.total}
                  onChange={(e) =>
                    setFormData({ ...formData, total: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Sección 3: Carga de Comprobante / Presupuesto del Proveedor */}
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: "14px", bgcolor: "background.paper" }}
          >
            <DocumentoUploader
              label="Comprobante / Presupuesto Oficial del Proveedor"
              value={formData.documentoUrl}
              onChange={(newUrl) =>
                setFormData((prev) => ({ ...prev, documentoUrl: newUrl }))
              }
              helperText="Cargue la foto o escaneo del presupuesto emitido por el proveedor."
              mockPlaceholder={MOCK_DOC_PRESUPUESTO}
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
            {isEditing ? "Guardar Cambios" : "Registrar Cotización"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Confirmar Eliminación */}
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
            Eliminar Cotización
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: "24px !important", pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Confirma que desea eliminar la cotización{" "}
            <strong>{selectedPresupuesto?.id}</strong> de{" "}
            <strong>{selectedPresupuesto?.proveedorNombre}</strong> por valor de{" "}
            <strong>
              ${selectedPresupuesto?.total?.toLocaleString("es-AR")}
            </strong>? Esta acción no se puede deshacer.
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
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ fontWeight: 700 }}
          >
            Eliminar Definitivamente
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PresupuestoProveedorScreen;
