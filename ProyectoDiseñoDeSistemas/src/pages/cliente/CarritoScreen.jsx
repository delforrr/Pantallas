import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useApp } from "../../context/AppContext";
import { useClientStore, clientStore } from "./mockData";
import { CarritoItem, ResumenPedido } from "../../components/cliente";

export const CarritoScreen = () => {
  const { navigate } = useApp();
  const { cart } = useClientStore();

  const [pedidoExitoso, setPedidoExitoso] = useState(null);
  const [openVaciarDialog, setOpenVaciarDialog] = useState(false);

  const handleVaciarCarrito = () => {
    clientStore.clearCart();
    setOpenVaciarDialog(false);
  };

  const handleOrderSuccess = (nuevoPedido) => {
    setPedidoExitoso(nuevoPedido);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Vista cuando el carrito está vacío y no hay diálogo de confirmación abierto
  if (cart.length === 0 && !pedidoExitoso) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, md: 10 },
          px: 3,
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: "16px",
          border: "1px dashed",
          borderColor: "divider",
          maxWidth: 680,
          mx: "auto",
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <ShoppingBagOutlinedIcon
            sx={{ fontSize: 52, color: "text.secondary" }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}
        >
          Tu carrito de compras está vacío
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 460,
            mb: 3.5,
            lineHeight: 1.5,
          }}
        >
          Aún no has agregado pastas o salsas. ¡Te invitamos a explorar nuestro
          catálogo de pastas frescas recién elaboradas!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<RestaurantMenuIcon />}
          onClick={() => navigate("catalogo")}
          sx={{
            borderRadius: "10px",
            px: 4,
            py: 1.4,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: (theme) => `0 4px 14px ${theme.palette.primary.main}40`,
          }}
        >
          Explorar Catálogo de Pastas
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Barra superior de navegación / UX para volver */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
          p: 1.5,
          bgcolor: "background.paper",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("catalogo")}
          variant="outlined"
          size="small"
          sx={{
            fontWeight: 700,
            borderRadius: "8px",
            color: "text.primary",
            borderColor: "divider",
            textTransform: "none",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
          }}
        >
          Volver al Catálogo de Pastas
        </Button>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          Paso 1 de 2: Revisión de Ítems y Configuración del Pedido
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {/* Columna Izquierda: Lista de Ítems y Botón Vaciar */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 65%" },
            width: "100%",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2.5,
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              Ítems en tu carrito ({totalItems}{" "}
              {totalItems === 1 ? "producto" : "productos"})
            </Typography>

            <Button
              size="small"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setOpenVaciarDialog(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                px: 1.5,
                border: "1px solid",
                borderColor: "error.main",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Vaciar Carrito
            </Button>
          </Box>

          {cart.map((item) => (
            <CarritoItem key={item.idProducto} item={item} />
          ))}
        </Box>

        {/* Columna Derecha: Resumen de Pedido y Checkout */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 35%" },
            width: { xs: "100%", md: "auto" },
            minWidth: { md: 320 },
            position: { md: "sticky" },
            top: { md: 20 },
          }}
        >
          <ResumenPedido onOrderSuccess={handleOrderSuccess} />
        </Box>
      </Box>

      {/* Modal Diálogo de Confirmación para Vaciar Carrito */}
      <Dialog
        open={openVaciarDialog}
        onClose={() => setOpenVaciarDialog(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          backdrop: { sx: { backdropFilter: "blur(4px)" } },
          paper: { sx: { borderRadius: "16px", p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          ¿Vaciar todo el carrito?
        </DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          <Typography variant="body2" color="text.secondary">
            Esta acción quitará todos los productos y salsas que seleccionaste.
            Tendrás que volver a agregarlos desde el catálogo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenVaciarDialog(false)}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleVaciarCarrito}
            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 700 }}
          >
            Sí, Vaciar Carrito
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Diálogo de Éxito al Confirmar Pedido */}
      <Dialog
        open={Boolean(pedidoExitoso)}
        onClose={() => setPedidoExitoso(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: { sx: { backdropFilter: "blur(4px)" } },
          paper: { sx: { borderRadius: "16px", p: 1 } },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              bgcolor: "action.hover",
              color: "success.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              border: "2px solid",
              borderColor: "success.main",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            ¡Pedido Confirmado con Éxito!
          </Typography>
          <Chip
            label={pedidoExitoso?.nroPedido}
            color="primary"
            sx={{ mt: 1.5, fontWeight: 700, fontSize: "0.92rem", px: 1 }}
          />
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.secondary", mb: 2.5 }}
          >
            Tu pedido ha ingresado exitosamente en fábrica y el sector de
            elaboración ya cuenta con el detalle.
          </Typography>

          <Box
            sx={{
              bgcolor: "action.hover",
              borderRadius: "12px",
              p: 2.5,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Tipo de Pedido:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {pedidoExitoso?.tipoPedido}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Modalidad de Entrega:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {pedidoExitoso?.modalidadEntrega}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Lugar de Entrega / Retiro:
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ maxWidth: 280, textAlign: "right" }}
              >
                {pedidoExitoso?.domicilioEntrega}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Medio de Pago:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {pedidoExitoso?.medioPago}
              </Typography>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {pedidoExitoso?.señaExigida > 0
                  ? "Seña Abonada (50%):"
                  : "Total Abonado:"}
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="primary.main"
              >
                $
                {(pedidoExitoso?.señaExigida > 0
                  ? pedidoExitoso?.señaAbonada
                  : pedidoExitoso?.total
                )?.toLocaleString("es-AR")}
              </Typography>
            </Box>

            {pedidoExitoso?.saldoPendiente > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Saldo contra entrega:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  ${pedidoExitoso?.saldoPendiente?.toLocaleString("es-AR")}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Comprobantes oficiales:
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {pedidoExitoso?.nroRemito} • {pedidoExitoso?.nroFactura}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 1.5,
            gap: 1.5,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setPedidoExitoso(null);
              navigate("catalogo");
            }}
            sx={{ borderRadius: "10px", textTransform: "none", px: 2.5 }}
          >
            Volver al Catálogo
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setPedidoExitoso(null);
              navigate("pedidos_cliente");
            }}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              fontWeight: 700,
            }}
          >
            Ir a Mis Pedidos
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarritoScreen;
