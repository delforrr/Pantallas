import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { INITIAL_CIERRE_CAJA } from './mockData';

export const CierreCajaScreen = () => {
  const [cajaState, setCajaState] = useState(INITIAL_CIERRE_CAJA);
  const [arqueoInput, setArqueoInput] = useState(cajaState.arqueoEfectivoFisico);
  const [observacionesInput, setObservacionesInput] = useState(cajaState.observaciones);

  // Modal Detalle Cierre Pasado
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedCierre, setSelectedCierre] = useState(null);

  // Arqueo esperado de Efectivo Físico = FondoInicial + TotalIngresosEfectivo
  const efectivoEsperadoEnCaja = useMemo(() => {
    return (cajaState.fondoInicial || 0) + (cajaState.totalIngresosEfectivo || 0);
  }, [cajaState.fondoInicial, cajaState.totalIngresosEfectivo]);

  // Diferencia en tiempo real
  const diferenciaCalculada = useMemo(() => {
    const contado = parseFloat(arqueoInput) || 0;
    return contado - efectivoEsperadoEnCaja;
  }, [arqueoInput, efectivoEsperadoEnCaja]);

  const handleCerrarCaja = () => {
    if (cajaState.estadoCaja === 'Cerrada') {
      alert('La caja del día de hoy ya se encuentra CERRADA.');
      return;
    }

    const confirm = window.confirm(
      `¿Confirmar el cierre de caja diario? Diferencia calculada: $${diferenciaCalculada.toLocaleString()}`
    );
    if (!confirm) return;

    const nuevoRegistroHistorial = {
      idCierreCaja: Date.now(),
      fecha: cajaState.fecha,
      responsable: cajaState.responsable,
      fondoInicial: cajaState.fondoInicial,
      totalEfectivo: cajaState.totalIngresosEfectivo,
      totalDebito: cajaState.totalIngresosDebito,
      totalMP: cajaState.totalIngresosMercadoPago,
      totalCuentaDNI: cajaState.totalIngresosCuentaDNI,
      totalVentasDia: cajaState.totalVentasDia,
      arqueoEfectivo: parseFloat(arqueoInput) || 0,
      diferencia: diferenciaCalculada,
      estado: diferenciaCalculada === 0 ? 'Cerrada y Cuadrada' : 'Cerrada con Inconsistencia',
    };

    setCajaState((prev) => ({
      ...prev,
      estadoCaja: 'Cerrada',
      arqueoEfectivoFisico: parseFloat(arqueoInput) || 0,
      diferenciaCaja: diferenciaCalculada,
      observaciones: observacionesInput,
      historialCierres: [nuevoRegistroHistorial, ...prev.historialCierres],
    }));
  };

  const handleReabrirCaja = () => {
    setCajaState((prev) => ({ ...prev, estadoCaja: 'Abierta' }));
  };

  const handleOpenDetailModal = (item) => {
    setSelectedCierre(item);
    setOpenDetail(true);
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PointOfSaleIcon color="primary" fontSize="large" />
            Control y Cierre Diario de Caja
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consolidación diaria de cobros por medios de pago y arqueo físico de efectivo.
          </Typography>
        </Box>
        <Chip
          icon={cajaState.estadoCaja === 'Abierta' ? <LockOpenIcon /> : <LockIcon />}
          label={`Estado Caja: ${cajaState.estadoCaja.toUpperCase()}`}
          color={cajaState.estadoCaja === 'Abierta' ? 'success' : 'error'}
          sx={{ fontWeight: 800, fontSize: '0.95rem', py: 2, px: 1, borderRadius: '12px' }}
        />
      </Box>

      {/* Grid de Métricas de Cobros del Día por Medio de Pago */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #009246' }} elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <AttachMoneyIcon color="success" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Cobrado en Efectivo
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#009246' }}>
              ${cajaState.totalIngresosEfectivo.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">Fondo Inicial: ${cajaState.fondoInicial.toLocaleString()}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #1976d2' }} elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CreditCardIcon color="primary" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Tarjeta Débito
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1976d2' }}>
              ${cajaState.totalIngresosDebito.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">Posnet Procesado</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #0288d1' }} elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <QrCode2Icon color="info" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                MercadoPago (QR)
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0288d1' }}>
              ${cajaState.totalIngresosMercadoPago.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">Cobros Digitales</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '14px', borderLeft: '5px solid #9c27b0' }} elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <PhoneIphoneIcon color="secondary" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Cuenta DNI
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#9c27b0' }}>
              ${cajaState.totalIngresosCuentaDNI.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">Transferencias App</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Panel Interactivo de Arqueo de Efectivo Físico y Cierre */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PointOfSaleIcon color="primary" /> Formulario de Arqueo y Cierre Diario ({cajaState.fecha})
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Cálculo Teórico en Caja de Efectivo:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Fondo de Caja Inicial:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${cajaState.fondoInicial.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">(+) Cobros Efectivo del Día:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${cajaState.totalIngresosEfectivo.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Efectivo Teórico Esperado:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#009246' }}>
                  ${efectivoEsperadoEnCaja.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Recuento / Arqueo Físico en Cajón:</Typography>
              <TextField
                label="Ingresar Efectivo Físico Contado ($)"
                type="number"
                fullWidth
                size="small"
                disabled={cajaState.estadoCaja === 'Cerrada'}
                value={arqueoInput}
                onChange={(e) => setArqueoInput(e.target.value)}
                sx={{ mb: 1.5 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: '8px', bgcolor: diferenciaCalculada === 0 ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: diferenciaCalculada === 0 ? 'success.main' : 'error.main' }}>
                  Diferencia de Arqueo:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: diferenciaCalculada === 0 ? 'success.main' : 'error.main' }}>
                  {diferenciaCalculada === 0 ? '$0 (Cuadrada PERFECTA)' : `$${diferenciaCalculada.toLocaleString()}`}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Observaciones del Cierre de Caja"
              fullWidth
              multiline
              rows={2}
              size="small"
              disabled={cajaState.estadoCaja === 'Cerrada'}
              value={observacionesInput}
              onChange={(e) => setObservacionesInput(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {cajaState.estadoCaja === 'Cerrada' ? (
              <Button variant="outlined" color="warning" onClick={handleReabrirCaja} startIcon={<LockOpenIcon />}>
                Reabrir Caja del Día
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<LockIcon />}
                onClick={handleCerrarCaja}
                sx={{ borderRadius: '10px', fontWeight: 800, px: 3 }}
              >
                Realizar Cierre de Caja Diaria
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Historial de Cierres de Caja */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" /> Historial de Cierres Anteriores
        </Typography>

        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Fecha Cierre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Responsable</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Efectivo ($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Débito ($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>MercadoPago ($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Cuenta DNI ($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total Día ($)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Ver Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cajaState.historialCierres.map((row) => (
                <TableRow key={row.idCierreCaja} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{row.fecha}</TableCell>
                  <TableCell>{row.responsable}</TableCell>
                  <TableCell align="right">${row.totalEfectivo.toLocaleString()}</TableCell>
                  <TableCell align="right">${row.totalDebito.toLocaleString()}</TableCell>
                  <TableCell align="right">${row.totalMP.toLocaleString()}</TableCell>
                  <TableCell align="right">${row.totalCuentaDNI.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#009246' }}>
                    ${row.totalVentasDia.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={row.diferencia === 0 ? <CheckCircleOutlineIcon /> : <WarningAmberIcon />}
                      label={row.estado}
                      color={row.diferencia === 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Resumen Cierre">
                      <IconButton size="small" color="info" onClick={() => handleOpenDetailModal(row)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal Detalle Cierre */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Resumen Cierre ({selectedCierre?.fecha})
          <IconButton onClick={() => setOpenDetail(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCierre && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2">Responsable: <strong>{selectedCierre.responsable}</strong></Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px' }}>
                <Typography variant="caption" color="text.secondary" display="block">Fondo Inicial: ${selectedCierre.fondoInicial.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">Total Efectivo: ${selectedCierre.totalEfectivo.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">Total Débito: ${selectedCierre.totalDebito.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">Total MP: ${selectedCierre.totalMP.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">Total Cuenta DNI: ${selectedCierre.totalCuentaDNI.toLocaleString()}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#009246' }}>
                  Total Ventas Consolidadas: ${selectedCierre.totalVentasDia.toLocaleString()}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CierreCajaScreen;
