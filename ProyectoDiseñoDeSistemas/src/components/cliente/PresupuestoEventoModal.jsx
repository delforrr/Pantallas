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
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { CATALOGO_CLIENTE, clientStore, INITIAL_CLIENT_PROFILE } from '../../pages/cliente/mockData';

// Formato compatible con input type="datetime-local": YYYY-MM-DDTHH:mm
const formatToInputDate = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const PresupuestoEventoModal = ({ open, onClose, onConfirmed }) => {
  // Fecha mínima permitida (48hs de anticipación) calculada en inicialización
  const [minDateObj] = useState(() => new Date(Date.now() + 48 * 60 * 60 * 1000));
  const minInputDate = useMemo(() => formatToInputDate(minDateObj), [minDateObj]);

  // Fecha por defecto: 3 días después a las 20:00
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
  const [activeTab, setActiveTab] = useState(0); // 0: Pastas, 1: Salsas, 2: Packs
  const [modalidad, setModalidad] = useState('reparto'); // 'reparto' | 'retiro'
  const [nombreEvento, setNombreEvento] = useState('Cena Familiar / Agasajo');
  const [telefonoContacto, setTelefonoContacto] = useState(INITIAL_CLIENT_PROFILE.telefono);
  const [direccionEntrega, setDireccionEntrega] = useState(INITIAL_CLIENT_PROFILE.direccion);

  // Validación estricta de 48 horas de anticipación
  const fechaValidaInfo = useMemo(() => {
    if (!fechaEvento) {
      return { esValida: false, mensaje: 'Seleccioná la fecha y hora de entrega del evento.' };
    }
    const fechaSeleccionada = new Date(fechaEvento).getTime();
    const minTimestamp = minDateObj.getTime();

    if (isNaN(fechaSeleccionada)) {
      return { esValida: false, mensaje: 'Formato de fecha inválido.' };
    }

    if (fechaSeleccionada < minTimestamp) {
      const minFormatted = `${minDateObj.toLocaleDateString('es-AR')} a las ${minDateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
      return {
        esValida: false,
        mensaje: `REGLA DE NEGOCIO OBLIGATORIA: Los pedidos de eventos requieren un mínimo de 48 horas de anticipación para su elaboración artesanal. Primera fecha disponible: ${minFormatted}.`,
      };
    }

    return { esValida: true, mensaje: null };
  }, [fechaEvento, minDateObj]);

  // Estimador gastronómico según comensales
  const recomendacionComensales = useMemo(() => {
    const kilosPastas = Number((comensales * 0.35).toFixed(1)); // ~350g por plato
    const potesSalsa = Math.ceil(comensales / 3); // ~1 pote cada 3 comensales
    return { kilosPastas, potesSalsa };
  }, [comensales]);

  // Modificar cantidades de ítems
  const handleItemQuantityChange = (idProducto, delta) => {
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

  // Botón para autocompletar menú sugerido según comensales
  const handleAutocompletarSugerido = () => {
    const { kilosPastas, potesSalsa } = recomendacionComensales;
    // Repartir pastas entre Sorrentinos (101) y Ravioles (102)
    const mitadPastas = Math.ceil(kilosPastas / 2);
    const restoPastas = Math.max(0, Math.round(kilosPastas - mitadPastas));
    // Repartir salsas entre Tuco (201) y Cuatro Quesos (203)
    const mitadSalsas = Math.ceil(potesSalsa / 2);
    const restoSalsas = Math.max(0, potesSalsa - mitadSalsas);

    setSelectedItems({
      101: mitadPastas,
      102: restoPastas,
      201: mitadSalsas,
      203: restoSalsas,
    });
  };

  // Cálculo de totales y seña del 50%
  const { subtotal, descuento, total, seña, totalItemsCount, kilosTotales, potesTotales, itemsList } =
    useMemo(() => {
      let sub = 0;
      let count = 0;
      let kg = 0;
      let potes = 0;
      const list = [];

      for (const [idStr, cant] of Object.entries(selectedItems)) {
        if (cant > 0) {
          const id = Number(idStr);
          const prod = CATALOGO_CLIENTE.find((p) => p.idProducto === id);
          if (prod) {
            const itemSub = prod.precio * cant;
            sub += itemSub;
            count += cant;
            if (prod.categoria.includes('Pasta')) {
              kg += cant;
            } else if (prod.categoria.includes('Salsa')) {
              potes += cant;
            }
            list.push({
              producto: prod,
              cantidad: cant,
              subtotal: itemSub,
            });
          }
        }
      }

      // Regla de dominio: Descuento 10% para eventos
      const desc = Math.round(sub * 0.1);
      const tot = sub - desc;
      // Regla de dominio: Seña obligatoria del 50%
      const seniaReq = Math.round(tot * 0.5);

      return {
        subtotal: sub,
        descuento: desc,
        total: tot,
        seña: seniaReq,
        totalItemsCount: count,
        kilosTotales: kg,
        potesTotales: potes,
        itemsList: list,
      };
    }, [selectedItems]);

  // Confirmar y Enviar al Carrito
  const handleConfirmarEvento = () => {
    if (!fechaValidaInfo.esValida || itemsList.length === 0) return;

    // Agregar cada producto seleccionado al store del cliente
    itemsList.forEach(({ producto, cantidad }) => {
      clientStore.addToCart(producto, cantidad);
    });

    if (onConfirmed) {
      onConfirmed({
        nombreEvento,
        telefonoContacto,
        fechaEvento,
        comensales,
        itemsList,
        subtotal,
        descuento,
        total,
        seña,
        modalidad,
        direccionEntrega: modalidad === 'reparto' ? direccionEntrega : 'Retiro en Fábrica',
      });
    }

    onClose();
  };

  // Filtrado de productos por pestaña
  const productosPorCategoria = useMemo(() => {
    if (activeTab === 0) {
      return CATALOGO_CLIENTE.filter(
        (p) =>
          p.categoria === 'Pastas Frescas' ||
          p.categoria === 'Pastas Rellenas' ||
          p.categoria === 'Pastas Gourmet'
      );
    }
    if (activeTab === 1) {
      return CATALOGO_CLIENTE.filter((p) => p.categoria === 'Salsas Caseras');
    }
    return CATALOGO_CLIENTE.filter((p) => p.categoria === 'Packs y Combos');
  }, [activeTab]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        },
      }}
    >
      {/* Cabecera del Modal */}
      <DialogTitle
        sx={{
          p: 2.5,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(46,204,113,0.15) 0%, rgba(231,76,60,0.12) 100%)'
              : 'linear-gradient(135deg, rgba(0,146,70,0.08) 0%, rgba(206,43,55,0.06) 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,146,70,0.3)',
            }}
          >
            <CelebrationIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Cotizador de Eventos Especiales & Fiestas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Planificá agasajos y banquetes con descuento por volumen y elaboración bajo demanda
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* COLUMNA IZQUIERDA: Configuración del Evento & Selección de Menú */}
          <Grid item xs={12} md={7}>
            {/* 1. SECCIÓN FECHA Y HORA CON REGLA ESTRICTA 48HS */}
            <Paper
              elevation={0}
              sx={{
                p: 2.25,
                mb: 2.5,
                borderRadius: '14px',
                border: '1px solid',
                borderColor: fechaValidaInfo.esValida ? 'divider' : 'error.main',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Fecha y Hora del Evento (Mínimo 48 horas obligatorias)
                  </Typography>
                </Box>
                <Chip
                  label="Anticipación 48hs"
                  size="small"
                  color={fechaValidaInfo.esValida ? 'success' : 'error'}
                  sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                />
              </Box>

              <TextField
                type="datetime-local"
                fullWidth
                size="small"
                value={fechaEvento}
                onChange={(e) => setFechaEvento(e.target.value)}
                inputProps={{
                  min: minInputDate,
                }}
                error={!fechaValidaInfo.esValida}
                helperText={
                  fechaValidaInfo.esValida
                    ? '✓ Cumple con el plazo mínimo de elaboración artesanal de 48 horas.'
                    : fechaValidaInfo.mensaje
                }
                sx={{ bgcolor: 'action.hover', borderRadius: '8px' }}
              />
            </Paper>

            {/* 2. SECCIÓN ESTIMADOR DE COMENSALES */}
            <Paper
              elevation={0}
              sx={{
                p: 2.25,
                mb: 2.5,
                borderRadius: '14px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Estimador Inteligente de Comensales
                </Typography>
                <Button
                  size="small"
                  startIcon={<AutoAwesomeIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={handleAutocompletarSugerido}
                  sx={{ borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  Autocompletar Menú
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {[15, 25, 40, 60, 100].map((num) => (
                  <Chip
                    key={num}
                    label={`${num} personas`}
                    clickable
                    color={comensales === num ? 'primary' : 'default'}
                    variant={comensales === num ? 'filled' : 'outlined'}
                    onClick={() => setComensales(num)}
                    sx={{ fontWeight: 600, fontSize: '0.78rem' }}
                  />
                ))}
              </Box>

              {/* Guía de rinde estimado */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,146,70,0.04)',
                  border: '1px dashed',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-around',
                  textAlign: 'center',
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pastas Sugeridas (~350g/plato)
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {recomendacionComensales.kilosPastas} kg de pasta
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
                    Seleccionado: {kilosTotales} kg
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Salsas Sugeridas (1 pote / 3 pers.)
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {recomendacionComensales.potesSalsa} potes (500cc)
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
                    Seleccionado: {potesTotales} potes
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* 3. SELECTOR DE PRODUCTOS DEL CATÁLOGO */}
            <Paper
              elevation={0}
              sx={{
                p: 2.25,
                borderRadius: '14px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  variant="fullWidth"
                  sx={{ minHeight: 38 }}
                >
                  <Tab label="Pastas" sx={{ fontSize: '0.8rem', fontWeight: 700, minHeight: 38 }} />
                  <Tab label="Salsas" sx={{ fontSize: '0.8rem', fontWeight: 700, minHeight: 38 }} />
                  <Tab label="Packs / Combos" sx={{ fontSize: '0.8rem', fontWeight: 700, minHeight: 38 }} />
                </Tabs>
              </Box>

              <Box sx={{ maxHeight: 290, overflowY: 'auto', pr: 0.5 }}>
                {productosPorCategoria.map((prod) => {
                  const qty = selectedItems[prod.idProducto] || 0;
                  return (
                    <Box
                      key={prod.idProducto}
                      sx={{
                        p: 1.25,
                        mb: 1,
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: qty > 0 ? 'primary.light' : 'divider',
                        bgcolor: qty > 0 ? 'action.selected' : 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, mr: 1 }}>
                        <Typography sx={{ fontSize: '1.8rem', lineHeight: 1 }}>{prod.icono}</Typography>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {prod.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${prod.precio.toLocaleString('es-AR')} / {prod.unidad}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Contador de unidades */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'background.paper',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: 'divider',
                          p: 0.2,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleItemQuantityChange(prod.idProducto, -1)}
                          disabled={qty <= 0}
                          sx={{ width: 26, height: 26 }}
                        >
                          <RemoveIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography
                          sx={{
                            px: 1,
                            minWidth: 24,
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {qty}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleItemQuantityChange(prod.idProducto, 1)}
                          sx={{ width: 26, height: 26 }}
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

          {/* COLUMNA DERECHA: Resumen de Cotización, Seña del 50% & Políticas */}
          <Grid item xs={12} md={5}>
            {/* Resumen de la cotización */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 2,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
                Resumen del Presupuesto
              </Typography>

              {/* Lista de productos incluidos */}
              <Box sx={{ maxHeight: 160, overflowY: 'auto', mb: 2, pr: 0.5 }}>
                {itemsList.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
                    No seleccionaste ítems todavía. Usa el catálogo o el autocompletado.
                  </Typography>
                ) : (
                  itemsList.map(({ producto, cantidad, subtotal: itemSub }) => (
                    <Box
                      key={producto.idProducto}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.6,
                        borderBottom: '1px dashed',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, flex: 1, pr: 1 }}>
                        {cantidad}x {producto.nombre}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        ${itemSub.toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>

              {/* Totales y Descuento */}
              <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal Bruto ({totalItemsCount} ítems):
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ${subtotal.toLocaleString('es-AR')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                    Descuento Volumen Eventos (10%):
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>
                    -${descuento.toLocaleString('es-AR')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Total del Pedido:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    ${total.toLocaleString('es-AR')}
                  </Typography>
                </Box>
              </Box>

              {/* SEÑA OBLIGATORIA DEL 50% - HIGHLIGHT DE DOMINIO */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.12)' : '#E8F8F5',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  textAlign: 'center',
                }}
              >
                <Chip
                  label="SEÑA OBLIGATORIA REQUERIDA (50%)"
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 800, fontSize: '0.68rem', mb: 1 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1 }}>
                  ${seña.toLocaleString('es-AR')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                  Monto exigido para iniciar amasado y producción. El saldo de{' '}
                  <strong>${(total - seña).toLocaleString('es-AR')}</strong> se cancela contra entrega.
                </Typography>
              </Paper>
            </Paper>

            {/* BANNER DE ADVERTENCIA DE CANCELACIÓN (REGLA DE NEGOCIO OBLIGATORIA) */}
            <Alert
              severity="warning"
              icon={<WarningAmberIcon />}
              sx={{
                borderRadius: '12px',
                mb: 2,
                fontSize: '0.78rem',
                border: '1px solid rgba(243, 156, 18, 0.4)',
                '& .MuiAlert-message': { fontWeight: 500 },
              }}
            >
              <strong>Política estricta de cancelación:</strong> En caso de cancelación, el cliente
              pierde la seña del 50% y la mercadería producida se almacena.
            </Alert>

            {/* Modalidad de entrega */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '14px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Modalidad de Recepción
              </Typography>
              <RadioGroup row value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                <FormControlLabel
                  value="reparto"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocalShippingIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Reparto Propio
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="retiro"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StorefrontIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Retiro en Planta
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>

              <TextField
                label="Nombre del Evento / Titular"
                size="small"
                fullWidth
                value={nombreEvento}
                onChange={(e) => setNombreEvento(e.target.value)}
                sx={{ mt: 1.5 }}
              />

              <TextField
                label="Teléfono de contacto"
                size="small"
                fullWidth
                value={telefonoContacto}
                onChange={(e) => setTelefonoContacto(e.target.value)}
                sx={{ mt: 1.5 }}
              />

              {modalidad === 'reparto' && (
                <TextField
                  label="Dirección de entrega refrigerada"
                  size="small"
                  fullWidth
                  value={direccionEntrega}
                  onChange={(e) => setDireccionEntrega(e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Botones de acción del Modal */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          Cancelar
        </Button>

        <Tooltip
          title={
            !fechaValidaInfo.esValida
              ? 'Se requiere fecha con al menos 48hs de antelación'
              : itemsList.length === 0
              ? 'Agregá al menos un producto al presupuesto'
              : ''
          }
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              disabled={!fechaValidaInfo.esValida || itemsList.length === 0}
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleConfirmarEvento}
              sx={{
                px: 3,
                py: 1,
                borderRadius: '10px',
                fontWeight: 700,
                boxShadow: (theme) => `0 4px 14px ${theme.palette.primary.main}40`,
              }}
            >
              Confirmar y Enviar al Carrito como Evento
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default PresupuestoEventoModal;
