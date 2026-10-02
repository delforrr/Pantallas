import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  LinearProgress,
  Alert,
  AlertTitle,
  Snackbar,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useClientStore, clientStore } from './mockData';
import { MetodoPagoItem, NuevoMetodoPagoForm } from '../../components/cliente';

export const MediosPagoScreen = () => {
  const store = useClientStore();
  const mediosPago = store.mediosPago || [];
  const cliente = store.cliente || {};

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleSetDefault = (id) => {
    clientStore.setDefaultPaymentMethod(id);
    setSnackbarMsg('Método de pago predeterminado actualizado.');
    setSnackbarOpen(true);
  };

  const handleDelete = (id) => {
    clientStore.removePaymentMethod(id);
    setSnackbarMsg('Método de pago eliminado.');
    setSnackbarOpen(true);
  };

  const formatCurrency = (val) => {
    return typeof val === 'number'
      ? `$ ${val.toLocaleString('es-AR')}`
      : '$ 0';
  };

  const limiteCredito = cliente.limiteCredito || 350000;
  const creditoUsado = cliente.creditoUsado || 120000;
  const saldoDisponible = cliente.saldoDisponible || (limiteCredito - creditoUsado);
  const porcentajeUso = Math.min(100, Math.round((creditoUsado / limiteCredito) * 100));

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* Título de la pantalla */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
          Medios de Pago y Cuenta Corriente
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Administra tus formas de pago guardadas, saldo comercial habilitado y consulta las normativas de cobro.
        </Typography>
      </Box>

      {/* Banner Explicativo de Normas de Cobro */}
      <Alert
        severity="info"
        icon={<SecurityOutlinedIcon sx={{ fontSize: 24 }} />}
        sx={{
          mb: 3.5,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'info.light',
          bgcolor: 'background.paper',
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
          Políticas y Normas de Cobro PastaFab (Reglas de Negocio Oficiales)
        </AlertTitle>
        <Typography variant="body2" sx={{ mb: 0.75, fontSize: '0.85rem' }}>
          &bull; <strong>Medios Homologados:</strong> Únicamente se reciben Efectivo (mostrador o contra entrega), Débito bancario (Visa/Mastercard Débito) y Billeteras Virtuales oficiales (Mercado Pago y Cuenta DNI).
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.75, fontSize: '0.85rem' }}>
          &bull; <strong>Restricción Absoluta:</strong> No se aceptan bajo ninguna circunstancia <em>Tarjetas de Crédito</em> ni <em>Cheques de terceros o diferidos</em>.
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.75, fontSize: '0.85rem' }}>
          &bull; <strong>Eventos Especiales (48hs):</strong> Requieren el pago anticipado de una seña obligatoria del 50%. En caso de cancelación por parte del cliente, la seña es retenida según normativa.
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          &bull; <strong>Cuenta Corriente Comercial:</strong> Vía de crédito autorizada a 30 días para clientes del rubro gastronómico y mayoristas registrados.
        </Typography>
      </Alert>

      {/* Layout de 2 columnas */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
        {/* Columna Izquierda: Medios Guardados + Widget Cuenta Corriente */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 58%' }, width: '100%', minWidth: 0 }}>
          {/* Métodos de Pago Guardados */}
          <Box sx={{ mb: 3.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PaymentsOutlinedIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Métodos de Pago Registrados ({mediosPago.length})
              </Typography>
            </Box>

            {mediosPago.map((metodo) => (
              <MetodoPagoItem
                key={metodo.idMedioDePago}
                metodo={metodo}
                onSetDefault={handleSetDefault}
                onDelete={handleDelete}
              />
            ))}
          </Box>

          {/* Widget de Cuenta Corriente Comercial */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              p: 3,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <AccountBalanceIcon color="secondary" sx={{ fontSize: 26 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Cuenta Corriente Comercial Habilitada
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Titular: {cliente.razonSocial || 'Trattoria & Ristorante Italia Bella'} &bull; CUIT {cliente.cuit || '30-68912455-2'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                  Límite Otorgado
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {formatCurrency(limiteCredito)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                  Crédito Utilizado
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.main' }}>
                  {formatCurrency(creditoUsado)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                  Saldo Disponible
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>
                  {formatCurrency(saldoDisponible)}
                </Typography>
              </Box>
            </Box>

            {/* Barra de progreso de uso de crédito */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Utilización de Línea de Crédito
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {porcentajeUso}% consumido
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={porcentajeUso}
                color={porcentajeUso > 80 ? 'error' : porcentajeUso > 50 ? 'warning' : 'primary'}
                sx={{ height: 8, borderRadius: '4px' }}
              />
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Ciclo de facturación comercial: mensual con liquidación a 30 días. Los pedidos realizados con Cuenta Corriente impactan automáticamente en el saldo disponible.
            </Typography>
          </Paper>
        </Box>

        {/* Columna Derecha: Vincular Nuevo Medio de Pago */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 42%' }, width: '100%', minWidth: { md: 320 } }}>
          <NuevoMetodoPagoForm
            onSuccess={() => {
              setSnackbarMsg('Nuevo medio de pago añadido a la lista.');
              setSnackbarOpen(true);
            }}
          />
        </Box>
      </Box>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        action={<CheckCircleIcon sx={{ fontSize: 20, color: 'success.light', mr: 1 }} />}
      />
    </Box>
  );
};

export default MediosPagoScreen;
