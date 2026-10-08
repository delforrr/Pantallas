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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import { useClientStore, clientStore } from "../../pages/cliente/mockData";

export const ResumenPedido = ({ onOrderSuccess }) => {
  const { cart, cliente } = useClientStore();

  const [tipoPedido, setTipoPedido] = useState("Venta Mostrador / Local");
  const [modalidadEntrega, setModalidadEntrega] = useState("Retiro en Fábrica");
  const [medioPago, setMedioPago] = useState("Efectivo en Mostrador");
  const [direccionEntrega, setDireccionEntrega] = useState(
    cliente?.direccion || "Av. Villegas 450",
  );
  const [observaciones, setObservaciones] = useState("");

  // Cálculos financieros
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.subtotal ?? item.precio * item.cantidad),
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const isFijoSemanal = tipoPedido === "Pedido Fijo Semanal";
  const isEventoEspecial = tipoPedido === "Evento Especial";

  // Descuento automático del 10% si es Pedido Fijo Semanal
  const descuento = isFijoSemanal ? Math.round(subtotal * 0.1) : 0;

  // Costos de envío según modalidad
  const costoEnvio = modalidadEntrega === "Delivery" ? 1800 : 0;

  const total = Math.max(0, subtotal - descuento + costoEnvio);

  // Desglose de seña para eventos especiales (50% obligatorio)
  const seña = isEventoEspecial ? Math.round(total * 0.5) : 0;
  const saldoContraEntrega = isEventoEspecial ? total - seña : 0;

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;

    const orderData = {
      tipoPedido,
      modalidadEntrega,
      domicilioEntrega:
        modalidadEntrega === "Retiro en Fábrica"
          ? "Retiro en Fábrica"
          : direccionEntrega || cliente?.direccion || "Av. Villegas 450",
      telefonoContacto: cliente?.telefono || "(02392) 43-9901",
      medioPago,
      observaciones: observaciones.trim() || undefined,
      estadoPago: isEventoEspecial ? "Seña 50% Abonada" : "Pagado",
      señaExigida: isEventoEspecial ? seña : 0,
      señaAbonada: isEventoEspecial ? seña : total,
      saldoPendiente: isEventoEspecial ? saldoContraEntrega : 0,
      subtotal,
      descuento,
      envio: costoEnvio,
      total,
      items: cart.map((item) => ({
        idProducto: item.idProducto,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.subtotal ?? item.precio * item.cantidad,
      })),
      fechaEntregaEstimada: isEventoEspecial
        ? "En 48hs hábiles"
        : modalidadEntrega === "Retiro en Fábrica"
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
          mb: 2.5,
          letterSpacing: "-0.01em",
        }}
      >
        Resumen y Checkout
      </Typography>

      {/* Selector de Tipo de Pedido */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="tipo-pedido-label">Tipo de Pedido</InputLabel>
        <Select
          labelId="tipo-pedido-label"
          id="tipo-pedido-select"
          value={tipoPedido}
          label="Tipo de Pedido"
          onChange={(e) => setTipoPedido(e.target.value)}
        >
          <MenuItem value="Venta Mostrador">Venta Mostrador</MenuItem>
          <MenuItem value="Pedido Fijo Semanal">Pedido Fijo Semanal</MenuItem>
          <MenuItem value="Evento Especial / Fiestas">Evento Especial</MenuItem>
        </Select>
      </FormControl>

      {/* Badge informativo de Pedido Fijo Semanal */}
      {isFijoSemanal && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            p: 1.25,
            bgcolor: "action.hover",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "success.light",
          }}
        >
          <DiscountOutlinedIcon sx={{ color: "success.main", fontSize: 20 }} />
          <Typography
            variant="caption"
            sx={{ color: "success.dark", fontWeight: 600 }}
          >
            ¡10% de descuento mayorista aplicado automáticamente a tu orden
            semanal!
          </Typography>
        </Box>
      )}

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
          <MenuItem value="Delivery Minorista (PedidosYa / Rappi)">
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

        {descuento > 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}
          >
            <Typography
              variant="body2"
              sx={{ color: "success.main", fontWeight: 500 }}
            >
              Descuento Semanal (10%)
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "success.main", fontWeight: 600 }}
            >
              -${descuento.toLocaleString("es-AR")}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
          <Typography variant="body2" color="text.secondary">
            Envío (
            {modalidadEntrega === "Retiro en Fábrica" ? "Retiro" : "Entrega"})
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

      {/* Si es Evento Especial: Desglose destacado con Chip/Alerta de Seña 50% y Saldo */}
      {isEventoEspecial && (
        <Box
          sx={{
            mb: 2.5,
            p: 2,
            bgcolor: "action.hover",
            borderRadius: "12px",
            border: "1px dashed",
            borderColor: "primary.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Chip
              label="Seña 50% a abonar hoy"
              color="primary"
              size="small"
              sx={{ fontWeight: 700, fontSize: "0.75rem" }}
            />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              ${seña.toLocaleString("es-AR")}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.82rem", mt: 0.5 }}
          >
            <strong>Saldo contra entrega con remito y factura:</strong> $
            {saldoContraEntrega.toLocaleString("es-AR")}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mt: 0.5,
              fontStyle: "italic",
              lineHeight: 1.3,
            }}
          >
            * Cancelación con mínimo 48hs de anticipación.
          </Typography>
        </Box>
      )}

      {/* Botón de Acción Confirmar Pedido */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={cart.length === 0}
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
        Al confirmar, se emitirá automáticamente tu pedido.
      </Typography>
    </Paper>
  );
};

export default ResumenPedido;
