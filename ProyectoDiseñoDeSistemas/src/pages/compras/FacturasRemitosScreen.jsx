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
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import {
  INITIAL_FACTURAS,
  INITIAL_REMITOS,
  INITIAL_COMPROBANTES_PAGO,
  INITIAL_PROVEEDORES,
  INITIAL_ORDENES_COMPRA,
} from "./mockData";

// Generador seguro de sufijo aleatorio para evitar alertas de PRNG inseguro (S2245)
const getSecureRandomSuffix = () => {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return 1000 + (array[0] % 9000);
  }
  return 1000 + (Date.now() % 9000);
};

// Funciones independientes para resolución de colores de estado (evita ternarios anidados S3358)
const getFacturaEstadoColor = (estado) => {
  if (estado === "Pagada") return "success";
  if (estado === "Pendiente de Pago") return "warning";
  return "error";
};

const getRemitoEstadoColor = (estado) => {
  if (estado === "Recibido Conforme") return "success";
  if (estado === "Con Observaciones") return "warning";
  return "error";
};

export const FacturasRemitosScreen = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState("table");

  // Estados de datos en memoria
  const [facturas, setFacturas] = useState(INITIAL_FACTURAS);
  const [remitos, setRemitos] = useState(INITIAL_REMITOS);
  const [pagos, setPagos] = useState(INITIAL_COMPROBANTES_PAGO);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openNewFactura, setOpenNewFactura] = useState(false);
  const [openNewRemito, setOpenNewRemito] = useState(false);
  const [openPagarFactura, setOpenPagarFactura] = useState(false);

  // Selecciones
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailType, setDetailType] = useState("factura"); // 'factura', 'remito', 'pago'

  // Forms
  const [facturaForm, setFacturaForm] = useState({
    id: "",
    ordenCompraId: "OC-2026-0102",
    proveedorId: 2,
    fechaEmision: new Date().toISOString().split("T")[0],
    fechaVencimiento: "",
    condicionPago: "Contado Contra Entrega",
    netoGravado: 809917,
    iva21: 170083,
    total: 980000,
    estado: "Pendiente de Pago",
  });

  const [remitoForm, setRemitoForm] = useState({
    id: "",
    ordenCompraId: "OC-2026-0102",
    proveedorId: 2,
    fechaEmision: new Date().toISOString().split("T")[0],
    fechaEntregaReal: new Date().toISOString().split("T")[0],
    recepcionista: "Juan Borlini (Jefe de Planta)",
    estado: "Recibido Conforme",
    observaciones:
      "Control visual y de peso verificado al ingresar a depósito.",
  });

  const [pagoForm, setPagoForm] = useState({
    medioPago: "Transferencia Bancaria",
    banco: "Banco de la Provincia de Buenos Aires",
    nroTransaccion: "TRX-894102",
    observaciones: "Liquidación de compra de insumos de producción.",
  });

  // Filtrado de Facturas
  const filteredFacturas = useMemo(() => {
    return facturas.filter((f) => {
      const match =
        f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.ordenCompraId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || f.estado === statusFilter;
      return match && matchStatus;
    });
  }, [facturas, searchTerm, statusFilter]);

  // Filtrado de Remitos
  const filteredRemitos = useMemo(() => {
    return remitos.filter((r) => {
      const match =
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ordenCompraId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || r.estado === statusFilter;
      return match && matchStatus;
    });
  }, [remitos, searchTerm, statusFilter]);

  // Filtrado de Pagos
  const filteredPagos = useMemo(() => {
    return pagos.filter((p) => {
      const match =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.facturaId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || p.estado === statusFilter;
      return match && matchStatus;
    });
  }, [pagos, searchTerm, statusFilter]);

  // Handlers para detalles
  const handleOpenDetail = (item, type) => {
    setSelectedItem(item);
    setDetailType(type);
    setOpenDetail(true);
  };

  // Crear Factura
  const handleSaveFactura = (e) => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find(
      (p) => p.id === Number(facturaForm.proveedorId),
    );
    const neto = Number(facturaForm.netoGravado);
    const iva = Math.round(neto * 0.21);
    const total = neto + iva;

    const newFactura = {
      id:
        facturaForm.id ||
        `FC-A-000${facturas.length + 1}-0000${getSecureRandomSuffix()}`,
      ordenCompraId: facturaForm.ordenCompraId,
      proveedorId: prov?.id || 1,
      proveedorNombre: prov?.razonSocial || "Proveedor S.A.",
      cuit: prov?.cuit || "30-00000000-0",
      fechaEmision: facturaForm.fechaEmision,
      fechaVencimiento: facturaForm.fechaVencimiento || "2026-04-15",
      condicionPago: facturaForm.condicionPago,
      netoGravado: neto,
      iva21: iva,
      total,
      estado: facturaForm.estado,
      comprobantePagoId: null,
    };

    setFacturas((prev) => [newFactura, ...prev]);
    setOpenNewFactura(false);
  };

  // Crear Remito
  const handleSaveRemito = (e) => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find(
      (p) => p.id === Number(remitoForm.proveedorId),
    );
    const newRemito = {
      id:
        remitoForm.id ||
        `REM-000${remitos.length + 1}-0000${getSecureRandomSuffix()}`,
      ordenCompraId: remitoForm.ordenCompraId,
      proveedorId: prov?.id || 1,
      proveedorNombre: prov?.razonSocial || "Proveedor S.A.",
      fechaEmision: remitoForm.fechaEmision,
      fechaEntregaReal: remitoForm.fechaEntregaReal,
      recepcionista: remitoForm.recepcionista,
      estado: remitoForm.estado,
      observaciones: remitoForm.observaciones,
      items: [
        {
          materiaPrima: "Insumos verificados según orden de compra",
          cantidadRecibida: 1,
          unidad: "Lote",
          conforme: true,
        },
      ],
    };

    setRemitos((prev) => [newRemito, ...prev]);
    setOpenNewRemito(false);
  };

  // Registrar Pago a Factura
  const handleOpenPagar = (factura) => {
    setSelectedItem(factura);
    setOpenPagarFactura(true);
  };

  const handleConfirmarPago = () => {
    if (!selectedItem) return;

    const nextPagoId = `OP-2026-00${pagos.length + 50}`;
    const newPago = {
      id: nextPagoId,
      facturaId: selectedItem.id,
      proveedorId: selectedItem.proveedorId,
      proveedorNombre: selectedItem.proveedorNombre,
      fechaEmision: new Date().toISOString().split("T")[0],
      medioPago: pagoForm.medioPago,
      nroTransaccion: pagoForm.nroTransaccion,
      banco: pagoForm.banco,
      total: selectedItem.total,
      estado: "Conciliado",
      observaciones: pagoForm.observaciones,
    };

    // Actualizar factura a Pagada
    setFacturas((prev) =>
      prev.map((f) =>
        f.id === selectedItem.id
          ? { ...f, estado: "Pagada", comprobantePagoId: nextPagoId }
          : f,
      ),
    );

    // Agregar comprobante de pago
    setPagos((prev) => [newPago, ...prev]);
    setOpenPagarFactura(false);
  };

  return (
    <Box>
      {/* Pestañas Superiores */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 3,
          bgcolor: "transparent",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(e, val) => {
            setCurrentTab(val);
            setStatusFilter("TODOS");
            setSearchTerm("");
          }}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: "0.9rem",
              textTransform: "none",
              minHeight: 48,
            },
          }}
        >
          <Tab
            icon={<ReceiptLongIcon />}
            iconPosition="start"
            label={`Facturas Proveedores (${facturas.length})`}
          />
          <Tab
            icon={<LocalShippingIcon />}
            iconPosition="start"
            label={`Remitos de Entrega (${remitos.length})`}
          />
          <Tab
            icon={<PaymentIcon />}
            iconPosition="start"
            label={`Comprobantes de Pago (${pagos.length})`}
          />
        </Tabs>
      </Paper>

      {/* ================= CONTENIDO PESTAÑA 0: FACTURAS ================= */}
      {currentTab === 0 && (
        <Box>
          {/* Métricas de Facturación - Responsivas con igual ancho */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
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
                <ReceiptLongIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block" }}
                >
                  Total Facturado
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  $
                  {facturas
                    .reduce(
                      (a, b) => a + (b.estado !== "Anulada" ? b.total : 0),
                      0,
                    )
                    .toLocaleString("es-AR")}
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
                <PriceCheckIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block" }}
                >
                  Pendiente de Pago
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "warning.main" }}
                >
                  $
                  {facturas
                    .filter((f) => f.estado === "Pendiente de Pago")
                    .reduce((a, b) => a + b.total, 0)
                    .toLocaleString("es-AR")}
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
                <PaymentIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block" }}
                >
                  Facturas Canceladas
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {facturas.filter((f) => f.estado === "Pagada").length} de{" "}
                  {facturas.length}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Filtros y Acción */}
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
                placeholder="Buscar por Nº Factura, Proveedor o OC..."
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
                <InputLabel>Estado de Pago</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado de Pago"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="TODOS">Todos los Estados</MenuItem>
                  <MenuItem value="Pendiente de Pago">
                    Pendiente de Pago
                  </MenuItem>
                  <MenuItem value="Pagada">Pagada</MenuItem>
                  <MenuItem value="Anulada">Anulada</MenuItem>
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
                onClick={() => setOpenNewFactura(true)}
              >
                Registrar Factura
              </Button>
            </Box>
          </Box>

          {/* Vista Cuadrícula vs Tabla */}
          {viewMode === "grid" &&
            (filteredFacturas.length === 0 ? (
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
                  No se encontraron facturas
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
                {filteredFacturas.map((row) => (
                  <Paper
                    key={row.id}
                    elevation={1}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        label={row.id}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 800, fontFamily: "monospace" }}
                      />
                      <Chip
                        label={row.estado}
                        size="small"
                        color={getFacturaEstadoColor(row.estado)}
                        sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        lineHeight: 1.3,
                        mb: 0.3,
                      }}
                    >
                      {row.proveedorNombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1.5 }}
                    >
                      CUIT: {row.cuit} · OC:{" "}
                      <strong>{row.ordenCompraId}</strong>
                    </Typography>

                    {/* Desglose de Importes */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "10px",
                        bgcolor: "primary.50",
                        border: "1px dashed",
                        borderColor: "primary.200",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Neto Gravado:
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          ${row.netoGravado.toLocaleString("es-AR")}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          IVA (21%):
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          ${row.iva21.toLocaleString("es-AR")}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          pt: 0.5,
                          borderTop: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                          TOTAL FACTURA:
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, color: "primary.main" }}
                        >
                          ${row.total.toLocaleString("es-AR")}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
                      >
                        <CalendarMonthOutlinedIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Emisión: {row.fechaEmision} · Vence:{" "}
                          <strong>{row.fechaVencimiento}</strong>
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Condición: <strong>{row.condicionPago}</strong>
                      </Typography>
                    </Box>

                    {/* Footer con Acciones */}
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
                      {row.estado === "Pendiente de Pago" ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<PaymentIcon />}
                          onClick={() => handleOpenPagar(row)}
                          sx={{ textTransform: "none", fontWeight: 700 }}
                        >
                          Pagar Factura
                        </Button>
                      ) : (
                        <Typography
                          variant="caption"
                          color="success.main"
                          sx={{ fontWeight: 700 }}
                        >
                          ✓ Pagada #{row.comprobantePagoId || ""}
                        </Typography>
                      )}

                      <Tooltip title="Ver factura completa">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(row, "factura")}
                          sx={{ color: "text.secondary" }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ))}

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
                    <TableCell sx={{ fontWeight: 700 }}>
                      Nº Comprobante
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Proveedor & CUIT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Orden Compra</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Emisión / Vto
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Neto / IVA</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFacturas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        align="center"
                        sx={{ py: 6, color: "text.secondary" }}
                      >
                        <Typography variant="body2">
                          No se encontraron facturas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFacturas.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {row.proveedorNombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            CUIT: {row.cuit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.ordenCompraId}
                            size="small"
                            variant="outlined"
                            sx={{ fontFamily: "monospace" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="caption"
                            sx={{ display: "block", fontWeight: 600 }}
                          >
                            Emisión: {row.fechaEmision}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Vence: {row.fechaVencimiento}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="caption"
                            sx={{ display: "block" }}
                          >
                            Neto: ${row.netoGravado.toLocaleString("es-AR")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            IVA (21%): ${row.iva21.toLocaleString("es-AR")}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, color: "text.primary" }}
                        >
                          ${row.total.toLocaleString("es-AR")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.estado}
                            size="small"
                            color={getFacturaEstadoColor(row.estado)}
                            sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver factura completa">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetail(row, "factura")}
                              sx={{ color: "text.secondary" }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {row.estado === "Pendiente de Pago" && (
                            <Tooltip title="Registrar pago al proveedor">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenPagar(row)}
                                sx={{ color: "success.main" }}
                              >
                                <PaymentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* ================= CONTENIDO PESTAÑA 1: REMITOS DE ENTREGA ================= */}
      {currentTab === 1 && (
        <Box>
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
                placeholder="Buscar por Nº Remito, Proveedor o Recepcionista..."
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
                <InputLabel>Estado de Recepción</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado de Recepción"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="TODOS">Todos los Estados</MenuItem>
                  <MenuItem value="Recibido Conforme">
                    Recibido Conforme
                  </MenuItem>
                  <MenuItem value="Con Observaciones">
                    Con Observaciones
                  </MenuItem>
                  <MenuItem value="Rechazado">Rechazado</MenuItem>
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
                onClick={() => setOpenNewRemito(true)}
              >
                Registrar Remito
              </Button>
            </Box>
          </Box>

          {/* Vista Cuadrícula vs Tabla */}
          {viewMode === "grid" &&
            (filteredRemitos.length === 0 ? (
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
                  No se encontraron remitos
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
                {filteredRemitos.map((row) => (
                  <Paper
                    key={row.id}
                    elevation={1}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        label={row.id}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 800, fontFamily: "monospace" }}
                      />
                      <Chip
                        label={row.estado}
                        size="small"
                        color={getRemitoEstadoColor(row.estado)}
                        sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        lineHeight: 1.3,
                        mb: 0.3,
                      }}
                    >
                      {row.proveedorNombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1.5 }}
                    >
                      Orden de Compra: <strong>{row.ordenCompraId}</strong>
                    </Typography>

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
                        RECEPCIÓN EN PLANTA:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mt: 0.3 }}
                      >
                        {row.recepcionista}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fecha Ingreso: {row.fechaEntregaReal}
                      </Typography>
                    </Paper>

                    {row.observaciones && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.85rem", mb: 2 }}
                      >
                        {row.observaciones}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        mt: "auto",
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Tooltip title="Ver detalle de remito">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(row, "remito")}
                          sx={{ color: "text.secondary" }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ))}

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
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Nº Remito</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Proveedor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Orden Compra</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Fecha Recepción
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Recepcionista (Planta)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Estado de Carga
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRemitos.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{ py: 6, color: "text.secondary" }}
                      >
                        <Typography variant="body2">
                          No se encontraron remitos
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRemitos.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          <Chip
                            label={row.ordenCompraId}
                            size="small"
                            variant="outlined"
                            sx={{ fontFamily: "monospace" }}
                          />
                        </TableCell>
                        <TableCell>{row.fechaEntregaReal}</TableCell>
                        <TableCell>{row.recepcionista}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.estado}
                            size="small"
                            color={getRemitoEstadoColor(row.estado)}
                            sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver detalle de remito y mercadería">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetail(row, "remito")}
                              sx={{ color: "text.secondary" }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
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
        </Box>
      )}

      {/* ================= CONTENIDO PESTAÑA 2: COMPROBANTES DE PAGO ================= */}
      {currentTab === 2 && (
        <Box>
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
                placeholder="Buscar por Nº Pago, Proveedor o Factura..."
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
            </Box>

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
          </Box>

          {/* Vista Cuadrícula vs Tabla */}
          {viewMode === "grid" &&
            (filteredPagos.length === 0 ? (
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
                  No se encontraron comprobantes de pago
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
                {filteredPagos.map((row) => (
                  <Paper
                    key={row.id}
                    elevation={1}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        label={row.id}
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ fontWeight: 800, fontFamily: "monospace" }}
                      />
                      <Chip
                        label={row.estado}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        lineHeight: 1.3,
                        mb: 0.3,
                      }}
                    >
                      {row.proveedorNombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1.5 }}
                    >
                      Factura Cancelada: <strong>{row.facturaId}</strong>
                    </Typography>

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "10px",
                        bgcolor: "success.50",
                        border: "1px dashed",
                        borderColor: "success.200",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: "text.secondary" }}
                      >
                        MONTO TOTAL ABONADO:
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "success.main" }}
                      >
                        ${row.total.toLocaleString("es-AR")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Medio: <strong>{row.medioPago}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Transacción: <strong>{row.nroTransaccion}</strong> (
                        {row.banco})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fecha: <strong>{row.fechaEmision}</strong>
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mt: "auto",
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Tooltip title="Ver recibo de pago">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetail(row, "pago")}
                          sx={{ color: "text.secondary" }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ))}

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
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Nº Orden de Pago
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Proveedor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Factura Cancelada
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha Pago</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Medio de Pago
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Total Abonado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPagos.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        align="center"
                        sx={{ py: 6, color: "text.secondary" }}
                      >
                        <Typography variant="body2">
                          No se encontraron comprobantes de pago
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPagos.map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          <Chip
                            label={row.facturaId}
                            size="small"
                            variant="outlined"
                            sx={{ fontFamily: "monospace" }}
                          />
                        </TableCell>
                        <TableCell>{row.fechaEmision}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {row.medioPago}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.nroTransaccion}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, color: "success.main" }}
                        >
                          ${row.total.toLocaleString("es-AR")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.estado}
                            size="small"
                            color="success"
                            sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver recibo de pago">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDetail(row, "pago")}
                              sx={{ color: "text.secondary" }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
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
        </Box>
      )}

      {/* ================= MODAL: REGISTRAR FACTURA - UI ESTILIZADA ================= */}
      <Dialog
        open={openNewFactura}
        onClose={() => setOpenNewFactura(false)}
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
          component: "form",
          onSubmit: handleSaveFactura,
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 24px 60px rgba(0,0,0,0.6)"
                : "0 24px 60px rgba(15, 23, 42, 0.2)",
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
              <ReceiptLongIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Registrar Factura de Proveedor
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Carga fiscal para imputación a cuenta corriente y liquidación de
                pagos
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setOpenNewFactura(false)} size="small">
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
          {/* Sección 1: Identificación */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: "14px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "divider" : "#e2e8f0",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.04)",
            }}
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
                1. Identificación y Proveedor Emisor
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nº de Factura Oficial"
                  placeholder="FC-A-0001-0000XXXX"
                  value={facturaForm.id}
                  onChange={(e) =>
                    setFacturaForm({ ...facturaForm, id: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="factura-prov-label">
                    Proveedor Emisor
                  </InputLabel>
                  <Select
                    labelId="factura-prov-label"
                    value={facturaForm.proveedorId}
                    label="Proveedor Emisor"
                    onChange={(e) =>
                      setFacturaForm({
                        ...facturaForm,
                        proveedorId: e.target.value,
                      })
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
                  <InputLabel id="factura-oc-label">
                    Orden de Compra Vinculada
                  </InputLabel>
                  <Select
                    labelId="factura-oc-label"
                    value={facturaForm.ordenCompraId}
                    label="Orden de Compra Vinculada"
                    onChange={(e) =>
                      setFacturaForm({
                        ...facturaForm,
                        ordenCompraId: e.target.value,
                      })
                    }
                  >
                    {INITIAL_ORDENES_COMPRA.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.id} - {o.proveedorNombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Sección 2: Fechas y Plazos */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: "14px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "divider" : "#e2e8f0",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.04)",
            }}
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
                2. Fechas de Emisión y Vencimiento
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Fecha de Emisión"
                  value={facturaForm.fechaEmision}
                  onChange={(e) =>
                    setFacturaForm({
                      ...facturaForm,
                      fechaEmision: e.target.value,
                    })
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
                  label="Fecha de Vencimiento"
                  value={facturaForm.fechaVencimiento}
                  onChange={(e) =>
                    setFacturaForm({
                      ...facturaForm,
                      fechaVencimiento: e.target.value,
                    })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Sección 3: Liquidación de Importes e IVA - Rediseño Profesional Anti-Slop */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: "14px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "divider" : "#e2e8f0",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PriceCheckIcon fontSize="small" sx={{ color: "primary.main" }} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                3. Liquidación de Importes e IVA
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
              {/* Columna 1: Base Imponible / Neto Gravado */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label="Neto Gravado"
                    type="number"
                    value={facturaForm.netoGravado}
                    onChange={(e) =>
                      setFacturaForm({
                        ...facturaForm,
                        netoGravado: e.target.value,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    required
                    sx={{ bgcolor: "background.paper" }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, px: 0.5 }}
                  >
                    Base imponible sin impuestos
                  </Typography>
                </Box>
              </Grid>

              {/* Columna 2: IVA 21% Calculado */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.75,
                    borderRadius: "12px",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "action.hover"
                        : "#f8fafc",
                    borderColor: "divider",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      IVA (21% Calculado)
                    </Typography>
                    <Chip
                      label="21% Fiscal"
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontFamily: "monospace",
                      color: "text.primary",
                    }}
                  >
                    $
                    {Math.round(
                      Number(facturaForm.netoGravado || 0) * 0.21,
                    ).toLocaleString("es-AR")}
                  </Typography>
                </Paper>
              </Grid>

              {/* Columna 3: Monto Total a Facturar */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.75,
                    borderRadius: "12px",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(0, 146, 70, 0.15)"
                        : "rgba(0, 146, 70, 0.08)",
                    border: "1px solid",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "primary.dark"
                        : "primary.light",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "primary.main",
                      mb: 0.5,
                    }}
                  >
                    Monto Total a Facturar
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? "primary.light"
                          : "primary.dark",
                      lineHeight: 1.1,
                    }}
                  >
                    $
                    {(
                      Number(facturaForm.netoGravado || 0) +
                      Math.round(Number(facturaForm.netoGravado || 0) * 0.21)
                    ).toLocaleString("es-AR")}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3.5,
            py: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setOpenNewFactura(false)}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              px: 3,
              fontWeight: 700,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { transform: "translateY(-1px)" },
            }}
          >
            Guardar Factura
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= MODAL: REGISTRAR REMITO - UI ESTILIZADA ================= */}
      <Dialog
        open={openNewRemito}
        onClose={() => setOpenNewRemito(false)}
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
          component: "form",
          onSubmit: handleSaveRemito,
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 24px 60px rgba(0,0,0,0.6)"
                : "0 24px 60px rgba(15, 23, 42, 0.2)",
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
              <LocalShippingIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Registrar Remito de Mercadería Recibida
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Conformidad física y bromatológica de materias primas al
                ingresar al almacén
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setOpenNewRemito(false)} size="small">
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
          {/* Sección 1: Datos de Transporte */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: "14px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "divider" : "#e2e8f0",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LocalShippingIcon
                fontSize="small"
                sx={{ color: "primary.main" }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                1. Datos del Transporte y Proveedor
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nº de Remito del Transportista"
                  placeholder="REM-0001-0000XXXX"
                  value={remitoForm.id}
                  onChange={(e) =>
                    setRemitoForm({ ...remitoForm, id: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="remito-prov-label">Proveedor</InputLabel>
                  <Select
                    labelId="remito-prov-label"
                    value={remitoForm.proveedorId}
                    label="Proveedor"
                    onChange={(e) =>
                      setRemitoForm({
                        ...remitoForm,
                        proveedorId: e.target.value,
                      })
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
                  <InputLabel id="remito-oc-label">
                    Orden de Compra Vinculada
                  </InputLabel>
                  <Select
                    labelId="remito-oc-label"
                    value={remitoForm.ordenCompraId}
                    label="Orden de Compra Vinculada"
                    onChange={(e) =>
                      setRemitoForm({
                        ...remitoForm,
                        ordenCompraId: e.target.value,
                      })
                    }
                  >
                    {INITIAL_ORDENES_COMPRA.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.id} - {o.proveedorNombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Recepcionista Responsable (Planta)"
                  value={remitoForm.recepcionista}
                  onChange={(e) =>
                    setRemitoForm({
                      ...remitoForm,
                      recepcionista: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Sección 2: Recepción y Control */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: "14px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "divider" : "#e2e8f0",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AssignmentTurnedInIcon
                fontSize="small"
                sx={{ color: "primary.main" }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                2. Conformidad y Fecha de Descarga
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Fecha de Entrega Real"
                  value={remitoForm.fechaEntregaReal}
                  onChange={(e) =>
                    setRemitoForm({
                      ...remitoForm,
                      fechaEntregaReal: e.target.value,
                    })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="remito-conf-label">
                    Estado de Conformidad
                  </InputLabel>
                  <Select
                    labelId="remito-conf-label"
                    value={remitoForm.estado}
                    label="Estado de Conformidad"
                    onChange={(e) =>
                      setRemitoForm({ ...remitoForm, estado: e.target.value })
                    }
                  >
                    <MenuItem value="Recibido Conforme">
                      Recibido Conforme (Ingresa al Stock)
                    </MenuItem>
                    <MenuItem value="Con Observaciones">
                      Con Observaciones (Faltante / Envase dañado)
                    </MenuItem>
                    <MenuItem value="Rechazado">
                      Rechazado (Pérdida de frío / Vencido)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Observaciones de Descarga y Bromatología"
                  value={remitoForm.observaciones}
                  onChange={(e) =>
                    setRemitoForm({
                      ...remitoForm,
                      observaciones: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3.5,
            py: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setOpenNewRemito(false)}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              px: 3,
              fontWeight: 700,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { transform: "translateY(-1px)" },
            }}
          >
            Guardar Remito
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= MODAL: REGISTRAR PAGO A FACTURA - UI ESTILIZADA ================= */}
      <Dialog
        open={openPagarFactura}
        onClose={() => setOpenPagarFactura(false)}
        maxWidth="sm"
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
                bgcolor: "success.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
              }}
            >
              <PaymentIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                Registrar Orden de Pago Proveedor
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Liquidación de factura mediante transferencia bancaria o caja
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setOpenPagarFactura(false)} size="small">
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
          }}
        >
          {selectedItem && (
            <>
              <Box
                sx={{
                  p: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(46, 204, 113, 0.12)"
                      : "rgba(46, 204, 113, 0.08)",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "success.dark"
                      : "success.light",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Factura a Cancelar: <strong>{selectedItem.id}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proveedor: {selectedItem.proveedorNombre}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "success.main", mt: 1 }}
                >
                  Monto a Abonar: ${selectedItem.total.toLocaleString("es-AR")}
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel id="pago-medio-label">Medio de Pago</InputLabel>
                <Select
                  labelId="pago-medio-label"
                  value={pagoForm.medioPago}
                  label="Medio de Pago"
                  onChange={(e) =>
                    setPagoForm({ ...pagoForm, medioPago: e.target.value })
                  }
                >
                  <MenuItem value="Transferencia Bancaria">
                    Transferencia Bancaria (BAPRO)
                  </MenuItem>
                  <MenuItem value="Débito Automático">
                    Débito Automático
                  </MenuItem>
                  <MenuItem value="Efectivo">
                    Efectivo contra Recibo de Mostrador
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="Nº Comprobante / Transacción Bancaria"
                value={pagoForm.nroTransaccion}
                onChange={(e) =>
                  setPagoForm({ ...pagoForm, nroTransaccion: e.target.value })
                }
                required
              />

              <TextField
                fullWidth
                size="small"
                label="Banco u Origen de Fondos"
                value={pagoForm.banco}
                onChange={(e) =>
                  setPagoForm({ ...pagoForm, banco: e.target.value })
                }
              />

              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label="Notas y Conciliación"
                value={pagoForm.observaciones}
                onChange={(e) =>
                  setPagoForm({ ...pagoForm, observaciones: e.target.value })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3.5,
            py: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setOpenPagarFactura(false)}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarPago}
            variant="contained"
            color="success"
            sx={{
              px: 3,
              fontWeight: 700,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { transform: "translateY(-1px)" },
            }}
          >
            Confirmar y Emitir Pago
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= MODAL: VER DETALLE GENERAL - UI ESTILIZADA ================= */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="sm"
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
              {detailType === "factura" && <ReceiptLongIcon />}
              {detailType === "remito" && <LocalShippingIcon />}
              {detailType === "pago" && <AccountBalanceIcon />}
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                {detailType === "factura" && `Factura ${selectedItem?.id}`}
                {detailType === "remito" && `Remito ${selectedItem?.id}`}
                {detailType === "pago" && `Orden de Pago ${selectedItem?.id}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Proveedor: {selectedItem?.proveedorNombre}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={selectedItem?.estado}
              size="small"
              color="primary"
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
          {selectedItem && (
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "14px" }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    Proveedor
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {selectedItem.proveedorNombre}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedItem.fechaEmision || selectedItem.fechaEntregaReal}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Estado
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedItem.estado}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Grid>

                {detailType === "factura" && (
                  <>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Neto Gravado
                      </Typography>
                      <Typography variant="body2">
                        ${selectedItem.netoGravado?.toLocaleString("es-AR")}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        IVA (21%)
                      </Typography>
                      <Typography variant="body2">
                        ${selectedItem.iva21?.toLocaleString("es-AR")}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        Monto Total
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "primary.main" }}
                      >
                        ${selectedItem.total?.toLocaleString("es-AR")}
                      </Typography>
                    </Grid>
                  </>
                )}

                {detailType === "remito" && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        Recepcionista
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedItem.recepcionista}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        Observaciones
                      </Typography>
                      <Typography variant="body2">
                        {selectedItem.observaciones}
                      </Typography>
                    </Grid>
                  </>
                )}

                {detailType === "pago" && (
                  <>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Medio de Pago
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedItem.medioPago}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Nº Transacción
                      </Typography>
                      <Typography variant="body2">
                        {selectedItem.nroTransaccion}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        Total Pagado
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: "success.main" }}
                      >
                        ${selectedItem.total?.toLocaleString("es-AR")}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={() => setOpenDetail(false)}
            variant="contained"
            color="primary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacturasRemitosScreen;
