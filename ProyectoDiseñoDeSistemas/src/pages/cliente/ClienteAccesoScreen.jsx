import { useState } from 'react';
import { Alert, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useApp } from '../../context/AppContext';
import { autenticarCliente, registrarCliente } from './mockData';
import ingredientesPatternRed from '../../components/cliente/ingredientes-pattern-red.svg';
import ingredientesPattern from '../../components/cliente/ingredientes-pattern.svg';

export default function ClienteAccesoScreen() {
  const { currentPage, login } = useApp();
  const [registro, setRegistro] = useState(currentPage === 'registrarse');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const destino = ['carrito', 'pedidos_cliente', 'medios_pago'].includes(currentPage) ? currentPage : 'catalogo';
  const motivo = destino === 'carrito' ? 'Ingresá para ver tu carrito y continuar con tu compra.' : destino === 'pedidos_cliente' ? 'Ingresá para consultar y seguir tus pedidos.' : 'Ingresá para comprar y compartir tus sabores favoritos.';

  const enviar = (event) => {
    event.preventDefault();
    setError('');
    if (registro && !nombre.trim()) return setError('Ingresá tu nombre y apellido.');
    if (registro && password !== confirmacion) return setError('Las contraseñas no coinciden.');
    const resultado = registro ? registrarCliente({ name: nombre.trim(), email, password }) : autenticarCliente(email, password);
    if (resultado.error) return setError(resultado.error);
    login('cliente', resultado.profile, destino);
  };

  const cambiarModo = () => { setRegistro((value) => !value); setError(''); setPassword(''); setConfirmacion(''); };

  return (
    <Box component="main" sx={{ flex: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '48% 52%' }, minWidth: 0 }}>
      <Box component="section" aria-label="Pastas frescas artesanales" sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', minHeight: 0, overflow: 'hidden', bgcolor: 'primary.main' }}>
        <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: `url("${ingredientesPattern}")`, backgroundSize: 380 }} />
        <Box sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: { md: 36, lg: 48 }, right: 32, color: '#fff' }}>
          <Typography sx={{ fontSize: 10, letterSpacing: '0.22em', fontWeight: 700, mb: 1.5 }}>INGREDIENTES SIMPLES. SABORES DE SIEMPRE.</Typography>
          <Typography sx={{ fontFamily: 'Kristi, cursive', fontSize: { md: 56, lg: 68 }, lineHeight: 1.05 }}>Hechas con tiempo.<br />Disfrutadas en familia.</Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: 'secondary.main', mt: 3 }} />
        </Box>
      </Box>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: { xs: 2.5, sm: 5, lg: 8 }, py: { xs: 2, md: 3 }, overflow: 'hidden' }}>
        <Box aria-hidden="true" sx={{ position: 'absolute', right: -70, top: 0, bottom: 0, width: 160, opacity: 0.32, backgroundImage: `url("${ingredientesPatternRed}")`, backgroundSize: 300, pointerEvents: 'none' }} />
        <Paper elevation={0} sx={{ position: 'relative', width: '100%', maxWidth: 400, bgcolor: 'background.paper', borderRadius: 0 }}>
          <Typography sx={{ color: 'secondary.main', fontSize: 10, letterSpacing: '0.18em', fontWeight: 800, mb: 1.5 }}>TU LUGAR EN NUESTRA MESA</Typography>
          <Typography component="h1" sx={{ fontFamily: 'Kristi, cursive', fontSize: { xs: 48, md: registro ? 54 : 66 }, color: 'primary.main', lineHeight: 1.05 }}>{registro ? 'Sumate a la familia' : 'Qué bueno verte'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: registro ? 2 : 3, lineHeight: 1.6 }}>{registro ? 'Creá tu cuenta para armar tu carrito y seguir tus pedidos.' : motivo}</Typography>
          <Stack component="form" onSubmit={enviar} spacing={1.5} sx={{ '& .MuiInputBase-root': { fontSize: 14 } }}>
            {registro && <TextField size="small" required fullWidth label="Nombre y apellido" autoComplete="name" value={nombre} onChange={(event) => setNombre(event.target.value)} slotProps={{ htmlInput: { maxLength: 100 } }} />}
            <TextField size="small" required fullWidth label="Correo electrónico" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField size="small" required fullWidth label="Contraseña" type={visible ? 'text' : 'password'} autoComplete={registro ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} helperText={registro ? 'Usá al menos 6 caracteres.' : undefined} slotProps={{ htmlInput: { minLength: registro ? 6 : 1 }, input: { endAdornment: <InputAdornment position="end"><IconButton aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible((value) => !value)} edge="end">{visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></InputAdornment> } }} />
            {registro && <TextField size="small" required fullWidth label="Confirmar contraseña" type={visible ? 'text' : 'password'} autoComplete="new-password" value={confirmacion} onChange={(event) => setConfirmacion(event.target.value)} />}
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ py: 1.4, mt: 0.5 }}>{registro ? 'Crear mi cuenta' : 'Iniciar sesión'}</Button>
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 2 }}>
            <Typography variant="caption" color="text.secondary">{registro ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}</Typography>
            <Button onClick={cambiarModo}>{registro ? 'Iniciar sesión' : 'Registrarme'}</Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block', textAlign: 'center', fontSize: 11 }}>Demo en memoria. {registro ? 'La cuenta estará disponible hasta recargar la página.' : 'cliente@mail.com / 1234.'}</Typography>
        </Paper>
        <Typography variant="caption" sx={{ position: 'relative', mt: { xs: 3, md: 4 }, color: 'primary.main', fontSize: 10, letterSpacing: '0.08em' }}>PASTAFAB · PASTAS HECHAS CON TRADICIÓN</Typography>
      </Box>
    </Box>
  );
}
