import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
  Grid,
  Snackbar,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { clientStore } from '../../pages/cliente/mockData';

export const NuevoMetodoPagoForm = ({ onSuccess }) => {
  const [tipoMetodo, setTipoMetodo] = useState('debito');

  // Campos Débito
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [titularTarjeta, setTitularTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [bancoEmisor, setBancoEmisor] = useState('');

  // Campos Mercado Pago
  const [aliasCvu, setAliasCvu] = useState('');
  const [titularMp, setTitularMp] = useState('');

  // Campos Cuenta DNI
  const [dniTitular, setDniTitular] = useState('');
  const [celularDni, setCelularDni] = useState('');

  // Estados de feedback y error
  const [errorText, setErrorText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleTipoChange = (e) => {
    setTipoMetodo(e.target.value);
    setErrorText('');
  };

  const resetForm = () => {
    setNumeroTarjeta('');
    setTitularTarjeta('');
    setVencimiento('');
    setBancoEmisor('');
    setAliasCvu('');
    setTitularMp('');
    setDniTitular('');
    setCelularDni('');
    setErrorText('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tipoMetodo === 'debito') {
      const cleanNum = numeroTarjeta.replace(/\s+/g, '');
      if (cleanNum.length < 16) {
        setErrorText('El número de tarjeta de débito debe contener 16 dígitos.');
        return;
      }
      if (!titularTarjeta.trim()) {
        setErrorText('Ingrese el nombre y apellido del titular tal como figura en la tarjeta.');
        return;
      }
      if (!vencimiento.trim() || !vencimiento.includes('/')) {
        setErrorText('Ingrese una fecha de vencimiento válida (MM/AA).');
        return;
      }

      const ultimos4 = cleanNum.slice(-4);
      const banco = bancoEmisor.trim() || 'Banco Emisor';

      clientStore.addPaymentMethod({
        tipo: 'debito',
        nombre: `Tarjeta de Débito (${banco})`,
        detalle: `Terminada en •••• ${ultimos4} | ${titularTarjeta.trim().toUpperCase()} | Vto: ${vencimiento}`,
        badge: 'Débito Autorizado',
      });

      setSuccessMessage('Tarjeta de débito vinculada exitosamente.');
    } else if (tipoMetodo === 'mercadopago') {
      if (!aliasCvu.trim()) {
        setErrorText('Ingrese el CVU o Alias de la cuenta de Mercado Pago.');
        return;
      }
      if (!titularMp.trim()) {
        setErrorText('Ingrese el titular registrado en la cuenta de Mercado Pago.');
        return;
      }

      clientStore.addPaymentMethod({
        tipo: 'mercadopago',
        nombre: 'Mercado Pago (Transferencia / QR)',
        detalle: `Alias/CVU: ${aliasCvu.trim()} | Titular: ${titularMp.trim()}`,
        badge: 'Billetera Digital',
      });

      setSuccessMessage('Cuenta de Mercado Pago vinculada exitosamente.');
    } else if (tipoMetodo === 'cuentadni') {
      const cleanDni = dniTitular.replace(/\D/g, '');
      if (cleanDni.length < 7 || cleanDni.length > 8) {
        setErrorText('Ingrese un número de DNI válido (7 u 8 dígitos).');
        return;
      }
      if (!celularDni.trim()) {
        setErrorText('Ingrese el teléfono celular asociado a Cuenta DNI.');
        return;
      }

      clientStore.addPaymentMethod({
        tipo: 'cuentadni',
        nombre: 'Cuenta DNI (Banco Provincia)',
        detalle: `DNI Titular: ${cleanDni} | Cel: ${celularDni.trim()} | Promociones activas`,
        badge: 'Billetera Digital',
      });

      setSuccessMessage('Cuenta DNI vinculada exitosamente.');
    }

    setSnackbarOpen(true);
    resetForm();
    if (onSuccess) onSuccess();
  };

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        p: { xs: 2.5, sm: 3 },
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <AddCircleOutlineIcon color="primary" sx={{ fontSize: 26 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Vincular Nuevo Medio de Pago
        </Typography>
      </Box>

      {/* ALERTA DESTACADA: POLÍTICA ESTRICTA PASTAFAB */}
      <Alert
        severity="warning"
        icon={<BlockOutlinedIcon sx={{ fontSize: 22 }} />}
        sx={{
          mb: 3,
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'warning.light',
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
          Política estricta PastaFab
        </AlertTitle>
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          Únicamente se aceptan <strong>Efectivo, Débito y Billeteras Virtuales</strong>.
          <br />
          <strong>No se aceptan Cheques ni Tarjetas de Crédito</strong> bajo ninguna circunstancia.
        </Typography>
      </Alert>

      {errorText && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px' }}>
          {errorText}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Selector de Tipo */}
        <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
          <InputLabel id="tipo-medio-pago-label">Tipo de Medio de Pago *</InputLabel>
          <Select
            labelId="tipo-medio-pago-label"
            value={tipoMetodo}
            label="Tipo de Medio de Pago *"
            onChange={handleTipoChange}
          >
            <MenuItem value="debito">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCardIcon fontSize="small" color="primary" />
                <span>Tarjeta de Débito (Visa / Mastercard Débito)</span>
              </Box>
            </MenuItem>
            <MenuItem value="mercadopago">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletIcon fontSize="small" color="info" />
                <span>Mercado Pago (Alias / CVU)</span>
              </Box>
            </MenuItem>
            <MenuItem value="cuentadni">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneAndroidIcon fontSize="small" color="success" />
                <span>Cuenta DNI (Banco Provincia)</span>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Campos Condicionales para Débito */}
        {tipoMetodo === 'debito' && (
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Número de Tarjeta de Débito (16 dígitos) *"
                placeholder="4500 0000 0000 4412"
                value={numeroTarjeta}
                onChange={(e) => {
                  setNumeroTarjeta(e.target.value);
                  setErrorText('');
                }}
                inputProps={{ maxLength: 19 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Nombre y Apellido del Titular *"
                placeholder="MARIA GARCIA"
                value={titularTarjeta}
                onChange={(e) => {
                  setTitularTarjeta(e.target.value);
                  setErrorText('');
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Vencimiento (MM/AA) *"
                placeholder="09/28"
                value={vencimiento}
                onChange={(e) => {
                  setVencimiento(e.target.value);
                  setErrorText('');
                }}
                inputProps={{ maxLength: 5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Banco Emisor"
                placeholder="Ej. Banco Provincia"
                value={bancoEmisor}
                onChange={(e) => setBancoEmisor(e.target.value)}
              />
            </Grid>
          </Grid>
        )}

        {/* Campos Condicionales para Mercado Pago */}
        {tipoMetodo === 'mercadopago' && (
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="CVU o Alias de Mercado Pago *"
                placeholder="pastafab.cliente.mp"
                value={aliasCvu}
                onChange={(e) => {
                  setAliasCvu(e.target.value);
                  setErrorText('');
                }}
                helperText="Puede ingresar tanto un Alias como un CVU de 22 dígitos."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Nombre del Titular de la Cuenta MP *"
                placeholder="María García"
                value={titularMp}
                onChange={(e) => {
                  setTitularMp(e.target.value);
                  setErrorText('');
                }}
              />
            </Grid>
          </Grid>
        )}

        {/* Campos Condicionales para Cuenta DNI */}
        {tipoMetodo === 'cuentadni' && (
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="DNI del Titular *"
                placeholder="28912455"
                value={dniTitular}
                onChange={(e) => {
                  setDniTitular(e.target.value);
                  setErrorText('');
                }}
                inputProps={{ maxLength: 8 }}
                helperText="DNI del titular registrado en Cuenta DNI."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Celular Vinculado *"
                placeholder="2392-439901"
                value={celularDni}
                onChange={(e) => {
                  setCelularDni(e.target.value);
                  setErrorText('');
                }}
                helperText="Número para envío de cobro o QR."
              />
            </Grid>
          </Grid>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="medium"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            py: 1.2,
            borderRadius: '10px',
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          Guardar Medio de Pago
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={successMessage}
        action={
          <CheckCircleOutlineIcon color="inherit" sx={{ fontSize: 20, mr: 1 }} />
        }
      />
    </Paper>
  );
};

NuevoMetodoPagoForm.propTypes = {
  onSuccess: PropTypes.func,
};

export default NuevoMetodoPagoForm;
