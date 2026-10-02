import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
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
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
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
 * PresupuestoEventoModal - Cotizador para eventos especiales.
 * Cumple con la regla de 48hs mínimas de anticipación, 10% OFF y seña del 50%.
 * Todos los apartados ocupan el ancho completo (100% width) con diseño uniforme.
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
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(4px)' } },
        paper: {
          sx: {
            borderRadius: '16px',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Cabecera del Modal */}
      <DialogTitle
        sx={{
          py: 1.8,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F9FAFB'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CelebrationIcon color="primary" sx={{ fontSize: 26 }} />
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

      <DialogContent
        dividers
        sx={{
          px: { xs: 2, sm: 3 },
          pt: '24px !important',
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Banner de fecha / 48hs */}
        {!fechaValidaInfo.esValida && (
          <Alert severity="warning" sx={{ py: 0.8, borderRadius: '10px', fontSize: '0.82rem' }}>
            {fechaValidaInfo.mensaje}
          </Alert>
        )}

        {/* ─────────────────────────────────────────────────────────────
            1. DETALLES DEL EVENTO (ANCHO COMPLETO 100%)
           ───────────────────────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '14px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EventAvailableIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '0.02em' }}>
              1. DETALLES DEL EVENTO & COMENSALES
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              label="Nombre / Motivo del Evento"
              size="small"
              fullWidth
              value={nombreEvento}
              onChange={(e) => setNombreEvento(e.target.value)}
            />
            <TextField
              label="Fecha y Hora de Entrega (Mín. 48 hs)"
              type="datetime-local"
              size="small"
              fullWidth
              value={fechaEvento}
              slotProps={{
                htmlInput: { min: minInputDate },
                inputLabel: { shrink: true },
              }}
              onChange={(e) => setFechaEvento(e.target.value)}
              error={!fechaValidaInfo.esValida}
            />
            <TextField
              label="Teléfono de Contacto"
              size="small"
              fullWidth
              value={telefonoContacto}
              onChange={(e) => setTelefonoContacto(e.target.value)}
            />
            <TextField
              label="Lugar / Dirección de Entrega"
              size="small"
              fullWidth
              value={direccionEntrega}
              onChange={(e) => setDireccionEntrega(e.target.value)}
            />
          </Box>

          {/* Selector de Comensales y Recomendación */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              pt: 1.5,
              borderTop: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Cantidad de comensales:
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
                    sx={{ fontSize: '0.75rem', height: 26, fontWeight: 700 }}
                  />
                ))}
              </Box>
            </Box>

            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.75rem' }}>
              Sugerencia ({comensales} personas): ~{recomendacionComensales.kilosPastas} kg pasta y {recomendacionComensales.potesSalsa} potes salsa.
            </Typography>
          </Box>
        </Paper>

        {/* ─────────────────────────────────────────────────────────────
            2. SELECCIÓN DE MENÚ (ANCHO COMPLETO 100%)
           ───────────────────────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '14px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantMenuIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '0.02em' }}>
                2. SELECCIÓN DE MENÚ PARA EL EVENTO
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {resumenCalculado.itemsDetallados.length} variedades seleccionadas
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} variant="fullWidth">
              <Tab label="Pastas Artesanales" sx={{ fontSize: '0.82rem', fontWeight: 700, py: 1 }} />
              <Tab label="Salsas Caseras" sx={{ fontSize: '0.82rem', fontWeight: 700, py: 1 }} />
              <Tab label="Packs Promocionales" sx={{ fontSize: '0.82rem', fontWeight: 700, py: 1 }} />
            </Tabs>
          </Box>

          {/* Grilla de productos en 2 columnas para aprovechar el ancho completo */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
              maxHeight: 220,
              overflowY: 'auto',
              pr: 0.5,
            }}
          >
            {productosPorCategoria.map((prod) => {
              const qty = selectedItems[prod.idProducto] || 0;
              return (
                <Box
                  key={prod.idProducto}
                  sx={{
                    p: 1.2,
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: qty > 0 ? 'primary.main' : 'divider',
                    bgcolor: qty > 0 ? 'action.selected' : 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flex: 1, minWidth: 0, mr: 1 }}>
                    <Avatar src={prod.imagen} variant="rounded" sx={{ width: 40, height: 40, flexShrink: 0 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.nombre}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
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
                      sx={{ p: 0.4 }}
                    >
                      <RemoveIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                    <Typography sx={{ minWidth: 22, textAlign: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      {qty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateItemQty(prod.idProducto, 1)}
                      sx={{ p: 0.4 }}
                    >
                      <AddIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* ─────────────────────────────────────────────────────────────
            3. RESUMEN Y CONDICIONES (OCUPA EL 100% DEL ANCHO Y MISMO ESTILO)
           ───────────────────────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '14px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '0.02em', mb: 2 }}>
            3. RESUMEN FINANCIERO & CONDICIONES DE CONTRATACIÓN
          </Typography>

          {/* Banner Financiero en 3 Columnas Uniformes a lo Ancho */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 2.5,
            }}
          >
            {/* Columna 1: Subtotal y Descuento */}
            <Box
              sx={{
                p: 2,
                borderRadius: '10px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#F9FAFB'),
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                Subtotal ({resumenCalculado.itemsDetallados.length} variedades):
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${resumenCalculado.subtotal.toLocaleString('es-AR')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, mt: 0.5, display: 'block' }}>
                Bonificación Evento (10%): -${resumenCalculado.descuento.toLocaleString('es-AR')}
              </Typography>
            </Box>

            {/* Columna 2: Total Presupuestado */}
            <Box
              sx={{
                p: 2,
                borderRadius: '10px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#F9FAFB'),
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                Total del Pedido:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                ${resumenCalculado.total.toLocaleString('es-AR')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                Precio final con IVA incluido
              </Typography>
            </Box>

            {/* Columna 3: Seña 50% Obligatoria */}
            <Box
              sx={{
                p: 2,
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: 'primary.main',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.12)' : 'rgba(0, 146, 70, 0.08)',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block', mb: 0.5 }}>
                SEÑA OBLIGATORIA (50%):
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>
                ${resumenCalculado.señaExigida.toLocaleString('es-AR')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontSize: '0.72rem' }}>
                Saldo de ${resumenCalculado.saldoPendiente.toLocaleString('es-AR')} contra entrega
              </Typography>
            </Box>
          </Box>

          {/* Modalidad de Entrega a lo Ancho */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Modalidad de Entrega:
            </Typography>
            <RadioGroup row value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
              <FormControlLabel
                value="reparto"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Reparto Propio Refrigerado</Typography>}
              />
              <FormControlLabel
                value="retiro"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Retiro en Fábrica</Typography>}
              />
            </RadioGroup>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Política de Cancelación a Ancho Completo */}
          <Alert
            severity="warning"
            icon={<WarningAmberIcon sx={{ fontSize: 18 }} />}
            sx={{
              py: 1,
              px: 2,
              borderRadius: '10px',
              fontSize: '0.78rem',
              lineHeight: 1.4,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <strong>Política de Cancelación:</strong> En caso de cancelación del pedido, el cliente pierde la seña del 50% y la mercadería elaborada se almacena en fábrica según los protocolos de elaboración especial.
          </Alert>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ py: 1.8, px: 3, borderTop: '1px solid', borderColor: 'divider', gap: 1.5 }}>
        <Button onClick={onClose} size="medium" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={handleConfirmarEvento}
          disabled={!fechaValidaInfo.esValida || resumenCalculado.itemsDetallados.length === 0}
          sx={{ fontWeight: 800, borderRadius: '10px', px: 3 }}
        >
          Confirmar Presupuesto y Enviar al Carrito (${resumenCalculado.total.toLocaleString('es-AR')})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PresupuestoEventoModal;
