import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useClientStore, clientStore } from "../../pages/cliente/mockData";
import { useApp } from "../../context/AppContext";

export const ResumenPedido = ({ onOrderSuccess }) => {
  const { cart, cliente } = useClientStore();
  const { navigate } = useApp();

  const [modalidadEntrega, setModalidadEntrega] = useState("Retiro en Fábrica");
  const [medioPago, setMedioPago] = useState("Efectivo en Mostrador");
  const [direccionEntrega, setDireccionEntrega] = useState(
    cliente?.direccion || "",
  );
  const [observaciones, setObservaciones] = useState("");

  // Cálculos financieros para venta habitual minorista
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.subtotal ?? item.precio * item.cantidad),
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Costos de envío según modalidad
  const costoEnvio = modalidadEntrega === "Delivery" ? 1800 : 0;
  const total = Math.max(0, subtotal + costoEnvio);
  const faltanDatosEntrega = modalidadEntrega === "Delivery" && (!direccionEntrega.trim() || !cliente?.telefono?.trim());

  const handleConfirmOrder = () => {
    if (cart.length === 0 || faltanDatosEntrega) return;

    const orderData = {
      tipoPedido: "Venta Mostrador",
      modalidadEntrega,
      domicilioEntrega:
        modalidadEntrega === "Retiro en Fábrica"
          ? "Retiro en Fábrica"
          : direccionEntrega.trim(),
      telefonoContacto: cliente?.telefono || "",
      medioPago,
      observaciones: observaciones.trim() || undefined,
      estadoPago: "Pagado",
      señaExigida: 0,
      señaAbonada: total,
      saldoPendiente: 0,
      subtotal,
      descuento: 0,
      envio: costoEnvio,
      total,
      items: cart.map((item) => ({
        idProducto: item.idProducto,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.subtotal ?? item.precio * item.cantidad,
      })),
      fechaEntregaEstimada:
        modalidadEntrega === "Retiro en Fábrica"
          ? "Listo para retirar en 30-45 minutos"
          : "Entrega estimada en el transcurso del día",
    };

    const nuevoPedido = clientStore.createOrder(orderData);
    if (onOrderSuccess) {
      onOrderSuccess(nuevoPedido);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "16px",
        p: 3,
        position: "sticky",
        top: 24,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 2,
          letterSpacing: "-0.01em",
        }}
      >
        Resumen y Checkout
      </Typography>

      {/* Modalidad de Compra Habitual */}
      <Box
        sx={{
          mb: 2.5,
          p: 1.5,
          bgcolor: "action.hover",
          borderRadius: "10px",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", display: "block" }}
          >
            Modalidad de pedido
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
            Venta Mostrador (Minorista)
          </Typography>
        </Box>
        <Chip
          label="Compra habitual"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, fontSize: "0.72rem" }}
        />
      </Box>

      {/* Selector de Modalidad de Entrega */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="modalidad-entrega-label">
          Modalidad de Entrega
        </InputLabel>
        <Select
          labelId="modalidad-entrega-label"
          id="modalidad-entrega-select"
          value={modalidadEntrega}
          label="Modalidad de Entrega"
          onChange={(e) => setModalidadEntrega(e.target.value)}
        >
          <MenuItem value="Retiro en Fábrica">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StorefrontOutlinedIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
              Retiro en Fábrica
            </Box>
          </MenuItem>
          <MenuItem value="Delivery">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalShippingOutlinedIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
              Delivery
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {/* Domicilio de Entrega (si no es retiro en fábrica) */}
      {modalidadEntrega !== "Retiro en Fábrica" && (
        <TextField
          fullWidth
          size="small"
          label="Domicilio de Entrega"
          value={direccionEntrega}
          onChange={(e) => setDireccionEntrega(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="Ej: Av. Villegas 450, Trenque Lauquen"
        />
      )}

      {/* Selector de Medio de Pago */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="medio-pago-label">Medio de Pago</InputLabel>
        <Select
          labelId="medio-pago-label"
          id="medio-pago-select"
          value={medioPago}
          label="Medio de Pago"
          onChange={(e) => setMedioPago(e.target.value)}
        >
          <MenuItem value="Efectivo en Mostrador">
            Efectivo en Mostrador
          </MenuItem>
          <MenuItem value="Tarjeta de Débito Visa/Mastercard">
            Tarjeta de Débito Visa/Mastercard
          </MenuItem>
          <MenuItem value="Mercado Pago (Transferencia / QR)">
            Mercado Pago (Transferencia / QR)
          </MenuItem>
          <MenuItem value="Billetera Virtual">Billetera Virtual</MenuItem>
          <MenuItem value="Cuenta Corriente" disabled={!cliente?.aceptaCredito}>
            Cuenta Corriente{" "}
            {cliente?.aceptaCredito ? "(Habilitada)" : "(No Habilitada)"}
          </MenuItem>
        </Select>
      </FormControl>

      {/* Campo Opcional de Observaciones */}
      <TextField
        fullWidth
        multiline
        rows={2}
        size="small"
        label="Observaciones o notas para cocina"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        placeholder="Ej: Empaquetar salsas por separado, horario de entrega preferido..."
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Desglose Financiero */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal ({totalItems} {totalItems === 1 ? "ítem" : "ítems"})
          </Typography>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            ${subtotal.toLocaleString("es-AR")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
          <Typography variant="body2" color="text.secondary">
            Envío ({modalidadEntrega === "Retiro en Fábrica" ? "Retiro" : "Entrega"})
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            color={costoEnvio === 0 ? "success.main" : "text.primary"}
          >
            {costoEnvio === 0
              ? "Sin cargo ($0)"
              : `$${costoEnvio.toLocaleString("es-AR")}`}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Total General
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            ${total.toLocaleString("es-AR")}
          </Typography>
        </Box>
      </Box>

      {/* Botón de Acción Confirmar Pedido */}
      {faltanDatosEntrega && <Alert severity="info" sx={{ mb: 2 }}>Completá tu dirección de entrega y tu teléfono para recibir el pedido.<Button size="small" onClick={() => navigate('mi_perfil')}>Completar mi perfil</Button></Alert>}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={cart.length === 0 || faltanDatosEntrega}
        onClick={handleConfirmOrder}
        startIcon={<CheckCircleIcon />}
        sx={{
          py: 1.5,
          borderRadius: "10px",
          fontWeight: 700,
          fontSize: "0.98rem",
          textTransform: "none",
          boxShadow: (theme) => `0 4px 14px ${theme.palette.primary.main}35`,
        }}
      >
        Confirmar y Realizar Pedido
      </Button>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          color: "text.secondary",
          mt: 1.5,
          fontSize: "0.74rem",
        }}
      >
        Al confirmar, se emitirá automáticamente tu pedido minorista.
      </Typography>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          color: "text.secondary",
          mt: 1.5,
          fontSize: "0.74rem",
        }}
      >
        ¿Buscás pedidos mayoristas semanales o de eventos? Ingresá desde la portada a <strong>Pedido Mayorista</strong> (mínimo 10 unidades).
      </Typography>
    </Paper>
  );
};

export default ResumenPedido;
