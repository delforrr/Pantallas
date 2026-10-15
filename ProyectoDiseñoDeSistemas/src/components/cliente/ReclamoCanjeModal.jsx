import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { clientStore } from "../../pages/cliente/mockData";

export const ReclamoCanjeModal = ({ open, onClose, pedido, onSuccess }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [motivoFalla, setMotivoFalla] = useState("");
  const [errorValidation, setErrorValidation] = useState("");

  if (!pedido) return null;

  const primerItemNombre = pedido.items?.[0]?.nombre || "";
  const productoEfectivo = productoSeleccionado || primerItemNombre;

  const maxCantidad = (() => {
    const item = pedido.items?.find((i) => i.nombre === productoEfectivo);
    return item ? item.cantidad : 10;
  })();

  const handleClose = () => {
    setProductoSeleccionado("");
    setCantidad(1);
    setMotivoFalla("");
    setErrorValidation("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productoEfectivo) {
      setErrorValidation("Por favor seleccione el producto afectado.");
      return;
    }

    if (!motivoFalla.trim()) {
      setErrorValidation(
        "Por favor describa el motivo de la falla o defecto detectado.",
      );
      return;
    }

    if (cantidad <= 0 || cantidad > maxCantidad) {
      setErrorValidation(`La cantidad debe ser entre 1 y ${maxCantidad}.`);
      return;
    }

    // Call store to create exchange claim order ($0 and express dispatch)
    const nuevoCanje = clientStore.createExchangeClaim({
      nroPedidoOriginal: pedido.nroPedido,
      productoAfectado: productoEfectivo,
      descripcionFalla: motivoFalla.trim(),
      cantidad: Number(cantidad),
    });

    if (onSuccess) {
      onSuccess(nuevoCanje);
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="reclamo-canje-dialog-title"
      slotProps={{
        backdrop: { sx: { backdropFilter: "blur(4px)" } },
        paper: {
          sx: {
            borderRadius: "16px",
            boxShadow: 24,
          },
        },
      }}
    >
      <DialogTitle
        id="reclamo-canje-dialog-title"
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ChangeCircleOutlinedIcon color="primary" sx={{ fontSize: 30 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Solicitud de Canje sin Costo
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              Garantía de Calidad &bull; Pedido Ref: {pedido.nroPedido}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="Cerrar modal"
          onClick={handleClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent
          dividers
          sx={{ px: { xs: 2.5, sm: 3 }, pt: "24px !important", pb: 2.5 }}
        >
          {errorValidation && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
              {errorValidation}
            </Alert>
          )}

          {/* Selector de producto afectado */}
          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <InputLabel id="producto-afectado-label">
              Producto Afectado *
            </InputLabel>
            <Select
              labelId="producto-afectado-label"
              value={productoEfectivo}
              label="Producto Afectado *"
              onChange={(e) => {
                setProductoSeleccionado(e.target.value);
                setErrorValidation("");
              }}
            >
              {pedido.items && pedido.items.length > 0 ? (
                pedido.items.map((item) => (
                  <MenuItem
                    key={item.idProducto || item.nombre}
                    value={item.nombre}
                  >
                    {item.nombre} (Comprados: {item.cantidad})
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="Producto del pedido">
                  Producto general del pedido
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Cantidad a reponer */}
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Cantidad a Reponer *"
            value={cantidad}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 1;
              setCantidad(Math.min(Math.max(1, val), maxCantidad));
              setErrorValidation("");
            }}
            slotProps={{
              htmlInput: { min: 1, max: maxCantidad },
            }}
            helperText={`Cantidad máxima elegible según el pedido entregado: ${maxCantidad} unidad(es)`}
            sx={{ mb: 2.5 }}
          />

          {/* Motivo o falla detectada */}
          <TextField
            fullWidth
            required
            multiline
            rows={3}
            size="small"
            label="Detalle del Motivo / Falla Detectada *"
            placeholder="Describa el inconveniente detectado (ej. masa quebradiza, problema de relleno, ruptura envasado al vacío...)"
            value={motivoFalla}
            onChange={(e) => {
              setMotivoFalla(e.target.value);
              setErrorValidation("");
            }}
            helperText="Esta descripción es remitida al área de Control de Calidad y Producción."
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            px: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            color="inherit"
            sx={{ borderRadius: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<ChangeCircleOutlinedIcon />}
            sx={{ borderRadius: "10px", px: 2.5, fontWeight: 700 }}
          >
            Confirmar Canje ($0)
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

ReclamoCanjeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedido: PropTypes.shape({
    nroPedido: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        idProducto: PropTypes.number,
        nombre: PropTypes.string,
        cantidad: PropTypes.number,
      }),
    ),
  }),
  onSuccess: PropTypes.func,
};

export default ReclamoCanjeModal;
