import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  Chip,
  Alert,
  Paper,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { CATALOGO_CLIENTE, clientStore, INITIAL_CLIENT_PROFILE } from '../../pages/cliente/mockData';

const formatToInputDate = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * PresupuestoEventoModal - Cotizador compacto y eficiente para pedidos de eventos especiales.
 * Cumple estrictamente con la regla de 48hs mínimas de anticipación y seña del 50%.
 */
export const PresupuestoEventoModal = ({ open, onClose, onConfirmed }) => {
  const [minDateObj] = useState(() => new Date(Date.now() + 48 * 60 * 60 * 1000));
  const minInputDate = useMemo(() => formatToInputDate(minDateObj), [minDateObj]);

  const [fechaEvento, setFechaEvento] = useState(() => {
    const d = new Date(Date.now() + 72 * 60 * 60 * 1000);
    d.setHours(20, 0, 0, 0);
    return formatToInputDate(d);
  });

  const [comensales, setComensales] = useState(25);
  const [selectedItems, setSelectedItems] = useState({
    101: 5, // 5kg Sorrentinos
    102: 4, // 4kg Ravioles
    201: 5, // 5 potes Tuco
    203: 4, // 4 potes Cuatro Quesos
  });
  const [activeTab, setActiveTab] = useState(0);
  const [modalidad, setModalidad] = useState('reparto');
  const [nombreEvento, setNombreEvento] = useState('Cena Familiar / Agasajo');
  const [telefonoContacto, setTelefonoContacto] = useState(INITIAL_CLIENT_PROFILE.telefono);
  const [direccionEntrega, setDireccionEntrega] = useState(INITIAL_CLIENT_PROFILE.direccion);

  const fechaValidaInfo = useMemo(() => {
    if (!fechaEvento) return { esValida: false, mensaje: 'Seleccioná la fecha y hora.' };
    const fechaSeleccionada = new Date(fechaEvento).getTime();
    if (isNaN(fechaSeleccionada)) return { esValida: false, mensaje: 'Fecha inválida.' };
    if (fechaSeleccionada < minDateObj.getTime()) {
      const minFormatted = `${minDateObj.toLocaleDateString('es-AR')} a las ${minDateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
      return {
        esValida: false,
        mensaje: `Anticipación mínima obligatoria: 48 horas. Primera fecha disponible: ${minFormatted}.`,
      };
    }
    return { esValida: true, mensaje: null };
  }, [fechaEvento, minDateObj]);

  const recomendacionComensales = useMemo(() => {
    const kilosPastas = Number((comensales * 0.35).toFixed(1));
    const potesSalsa = Math.ceil(comensales / 3);
    return { kilosPastas, potesSalsa };
  }, [comensales]);

  const handleUpdateItemQty = (idProducto, delta) => {
    setSelectedItems((prev) => {
      const current = prev[idProducto] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[idProducto];
        return copy;
      }
      return { ...prev, [idProducto]: next };
    });
  };

  const productosPorCategoria = useMemo(() => {
    if (activeTab === 0) {
      return CATALOGO_CLIENTE.filter((p) => p.categoria.includes('Pastas'));
    }
    if (activeTab === 1) {
      return CATALOGO_CLIENTE.filter((p) => p.categoria.includes('Salsas'));
    }
    return CATALOGO_CLIENTE.filter((p) => p.categoria.includes('Packs'));
  }, [activeTab]);

  const resumenCalculado = useMemo(() => {
    let subtotal = 0;
    const itemsDetallados = [];

    for (const [idStr, cant] of Object.entries(selectedItems)) {
      if (cant > 0) {
        const prod = CATALOGO_CLIENTE.find((p) => p.idProducto === Number(idStr));
        if (prod) {
          const lineaSubtotal = prod.precio * cant;
          subtotal += lineaSubtotal;
          itemsDetallados.push({
            idProducto: prod.idProducto,
            nombre: prod.nombre,
            cantidad: cant,
            precioUnitario: prod.precio,
            subtotal: lineaSubtotal,
            unidad: prod.unidad,
            imagen: prod.imagen,
            categoria: prod.categoria,
          });
        }
      }
    }

    const descuento = Math.round(subtotal * 0.1); // 10% descuento eventos
    const total = subtotal - descuento;
    const señaExigida = Math.round(total * 0.5); // 50% seña
    const saldoPendiente = total - señaExigida;

    return { subtotal, descuento, total, señaExigida, saldoPendiente, itemsDetallados };
  }, [selectedItems]);

  const handleConfirmarEvento = () => {
    if (!fechaValidaInfo.esValida || resumenCalculado.itemsDetallados.length === 0) return;

    for (const item of resumenCalculado.itemsDetallados) {
      clientStore.addToCart(item, item.cantidad);
    }

    if (onConfirmed) {
      onConfirmed({
        nombreEvento,
        fechaEvento,
        modalidad,
        direccionEntrega,
        telefonoContacto,
        resumen: resumenCalculado,
      });
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        },
      }}
    >
      {/* Cabecera Compacta */}
      <DialogTitle
        sx={{
          py: 1.5,
          px: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F9FAFB'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CelebrationIcon color="primary" sx={{ fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Cotizador de Pedidos para Eventos y Fiestas
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Anticipación mínima 48 hs • 10% Descuento por volumen • Seña requerida 50%
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Banner de fecha / 48hs */}
        {!fechaValidaInfo.esValida && (
          <Alert severity="warning" sx={{ mb: 2, py: 0.5, borderRadius: '10px', fontSize: '0.8rem' }}>
            {fechaValidaInfo.mensaje}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* COLUMNA IZQUIERDA: Configuración y Selección de Menú */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1.5 }}>
                1. DETALLES DEL EVENTO
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre / Motivo"
                    size="small"
                    fullWidth
                    value={nombreEvento}
                    onChange={(e) => setNombreEvento(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha y Hora de Entrega"
                    type="datetime-local"
                    size="small"
                    fullWidth
                    value={fechaEvento}
                    min={minInputDate}
                    onChange={(e) => setFechaEvento(e.target.value)}
                    error={!fechaValidaInfo.esValida}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono de Contacto"
                    size="small"
                    fullWidth
                    value={telefonoContacto}
                    onChange={(e) => setTelefonoContacto(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lugar / Dirección de Entrega"
                    size="small"
                    fullWidth
                    value={direccionEntrega}
                    onChange={(e) => setDireccionEntrega(e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Selector Rápido de Comensales */}
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Comensales estimados:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                  {[15, 25, 50, 80].map((num) => (
                    <Chip
                      key={num}
                      label={`${num} pers.`}
                      size="small"
                      clickable
                      onClick={() => setComensales(num)}
                      color={comensales === num ? 'primary' : 'default'}
                      variant={comensales === num ? 'filled' : 'outlined'}
                      sx={{ fontSize: '0.72rem', height: 24, fontWeight: 700 }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 0.8, fontSize: '0.72rem' }}>
                Sugerencia ({comensales} personas): ~{recomendacionComensales.kilosPastas} kg de pasta y {recomendacionComensales.potesSalsa} potes de salsa.
              </Typography>
            </Paper>

            {/* Selector de Menú */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
                <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} variant="fullWidth" sx={{ minHeight: 34 }}>
                  <Tab label="Pastas" sx={{ fontSize: '0.78rem', fontWeight: 700, minHeight: 34, py: 0.5 }} />
                  <Tab label="Salsas" sx={{ fontSize: '0.78rem', fontWeight: 700, minHeight: 34, py: 0.5 }} />
                  <Tab label="Packs" sx={{ fontSize: '0.78rem', fontWeight: 700, minHeight: 34, py: 0.5 }} />
                </Tabs>
              </Box>

              {/* Lista scrolleable compacta */}
              <Box sx={{ maxHeight: 220, overflowY: 'auto', pr: 0.5 }}>
                {productosPorCategoria.map((prod) => {
                  const qty = selectedItems[prod.idProducto] || 0;
                  return (
                    <Box
                      key={prod.idProducto}
                      sx={{
                        p: 1,
                        mb: 0.8,
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: qty > 0 ? 'primary.main' : 'divider',
                        bgcolor: qty > 0 ? 'action.selected' : 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, mr: 1 }}>
                        <Avatar src={prod.imagen} variant="rounded" sx={{ width: 34, height: 34, flexShrink: 0 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.nombre}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            ${prod.precio.toLocaleString('es-AR')} • {prod.unidad}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Selector de cantidad */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateItemQty(prod.idProducto, -1)}
                          disabled={qty === 0}
                          sx={{ p: 0.3 }}
                        >
                          <RemoveIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography sx={{ minWidth: 20, textAlign: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
                          {qty}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateItemQty(prod.idProducto, 1)}
                          sx={{ p: 0.3 }}
                        >
                          <AddIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>

          {/* COLUMNA DERECHA: Resumen Financiero y Confirmación */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#F9FAFB'),
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1.5 }}>
                2. RESUMEN Y CONDICIONES
              </Typography>

              {/* Desglose de totales */}
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Subtotal ({resumenCalculado.itemsDetallados.length} variedades):
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    ${resumenCalculado.subtotal.toLocaleString('es-AR')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                    Descuento Volumen (10%):
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                    -${resumenCalculado.descuento.toLocaleString('es-AR')}
                  </Typography>
                </Box>
                <Divider sx={{ my: 0.8 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Total Presupuesto:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    ${resumenCalculado.total.toLocaleString('es-AR')}
                  </Typography>
                </Box>
              </Box>

              {/* Tarjeta de Seña 50% Obligatoria */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.12)' : 'rgba(0, 146, 70, 0.08)',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    SEÑA EXIGIDA (50%):
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                    ${resumenCalculado.señaExigida.toLocaleString('es-AR')}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem' }}>
                  Saldo de ${resumenCalculado.saldoPendiente.toLocaleString('es-AR')} a liquidar contra entrega con remito y factura.
                </Typography>
              </Box>

              {/* Modalidad de entrega */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Modalidad de Entrega:
                </Typography>
                <RadioGroup row value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                  <FormControlLabel
                    value="reparto"
                    control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Reparto Propio</Typography>}
                  />
                  <FormControlLabel
                    value="retiro"
                    control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Retiro en Planta</Typography>}
                  />
                </RadioGroup>
              </Box>

              {/* Advertencia obligatoria de cancelación */}
              <Alert
                severity="warning"
                icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                sx={{
                  py: 0.5,
                  px: 1,
                  borderRadius: '8px',
                  fontSize: '0.68rem',
                  lineHeight: 1.25,
                  mt: 'auto',
                }}
              >
                <strong>Política de Cancelación:</strong> En caso de cancelación, el cliente pierde la seña del 50% y la mercadería producida se almacena.
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ py: 1.2, px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} size="small" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={handleConfirmarEvento}
          disabled={!fechaValidaInfo.esValida || resumenCalculado.itemsDetallados.length === 0}
          sx={{ fontWeight: 700, borderRadius: '8px', px: 2 }}
        >
          Confirmar y Enviar al Carrito (${resumenCalculado.total.toLocaleString('es-AR')})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PresupuestoEventoModal;
