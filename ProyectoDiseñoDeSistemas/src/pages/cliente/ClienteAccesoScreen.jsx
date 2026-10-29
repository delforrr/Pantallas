import { useState } from 'react';
import { Alert, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useApp } from '../../context/AppContext';
import { autenticarCliente, registrarCliente } from './mockData';
import pastaPrincipal from '../../components/cliente/pasta-principal.png';
import ingredientesPattern from '../../components/cliente/ingredientes-pattern.svg';
import ingredientesPatternRed from '../../components/cliente/ingredientes-pattern-red.svg';

export default function ClienteAccesoScreen() {
  const { currentPage, navigate, login } = useApp();
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
    <Box component="main" sx={{ minHeight: '100dvh', bgcolor: '#fff', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' } }}>
      <Box component="section" aria-label="PastaFab, pastas hechas con tradición" sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'primary.main', color: 'primary.contrastText', p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, backgroundImage: `url("${ingredientesPattern}")`, backgroundSize: { xs: 280, md: 400 } }}>
        <Typography sx={{ fontFamily: 'Kristi, cursive', fontSize: { xs: 54, md: 76 }, lineHeight: 1, bgcolor: 'primary.main', px: 2 }}>PastaFab</Typography>
        <Box component="img" src={pastaPrincipal} alt="Pastas artesanales con vegetales y salsa cremosa" sx={{ display: { xs: 'none', md: 'block' }, width: 'min(80%, 420px)', aspectRatio: '1', objectFit: 'cover', borderRadius: '50%', border: '5px solid', borderColor: 'secondary.main', my: 2, boxShadow: '0 16px 40px #0003' }} />
        <Box sx={{ textAlign: 'center', bgcolor: 'primary.main', p: 1.5, borderRadius: 3 }}>
          <Typography sx={{ fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>DE NUESTRA COCINA A TU MESA</Typography>
          <Typography sx={{ fontFamily: 'Kristi, cursive', fontSize: { xs: 34, md: 48 }, lineHeight: 1.3, mt: 1 }}>Los buenos momentos se comparten.</Typography>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', p: { xs: 2.5, sm: 4, md: 5 }, backgroundImage: `url("${ingredientesPatternRed}")`, backgroundSize: 340 }}>
        <Box sx={{ alignSelf: 'flex-start', bgcolor: '#fff', borderRadius: 8 }}><Button startIcon={<ArrowBackIcon />} onClick={() => navigate('catalogo')}>Volver al catálogo</Button></Box>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, mx: 'auto', my: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 5, bgcolor: '#fff', boxSizing: 'border-box' }}>
          <Typography sx={{ color: 'secondary.main', fontSize: 10, letterSpacing: '0.2em', fontWeight: 800, mb: 1 }}>TU LUGAR EN NUESTRA MESA</Typography>
          <Typography component="h1" sx={{ fontFamily: 'Kristi, cursive', fontSize: { xs: 54, sm: 64 }, color: 'primary.main', lineHeight: 1.15 }}>{registro ? 'Sumate a la familia' : 'Qué bueno verte'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.7 }}>{registro ? 'Creá tu cuenta para armar tu carrito y seguir tus pedidos.' : motivo}</Typography>
          <Stack component="form" onSubmit={enviar} spacing={2}>
            {registro && <TextField required fullWidth label="Nombre y apellido" autoComplete="name" value={nombre} onChange={(event) => setNombre(event.target.value)} slotProps={{ htmlInput: { maxLength: 100 } }} />}
            <TextField required fullWidth label="Correo electrónico" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField required fullWidth label="Contraseña" type={visible ? 'text' : 'password'} autoComplete={registro ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} helperText={registro ? 'Usá al menos 6 caracteres.' : undefined} slotProps={{ htmlInput: { minLength: registro ? 6 : 1 }, input: { endAdornment: <InputAdornment position="end"><IconButton aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible((value) => !value)} edge="end">{visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></InputAdornment> } }} />
            {registro && <TextField required fullWidth label="Confirmar contraseña" type={visible ? 'text' : 'password'} autoComplete="new-password" value={confirmacion} onChange={(event) => setConfirmacion(event.target.value)} />}
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ py: 1.5 }}>{registro ? 'Crear mi cuenta' : 'Iniciar sesión'}</Button>
          </Stack>
          <Box sx={{ textAlign: 'center', mt: 2.5 }}>
            <Typography variant="body2" color="text.secondary">{registro ? '¿Ya tenés una cuenta?' : '¿Todavía no tenés cuenta?'}</Typography>
            <Button onClick={cambiarModo}>{registro ? 'Iniciar sesión' : 'Registrarme'}</Button>
          </Box>
          <Alert severity="info" icon={false} sx={{ mt: 2, fontSize: 12 }}>Demo en memoria. {registro ? 'La cuenta creada estará disponible hasta recargar la página.' : 'Probá con cliente@mail.com / 1234.'}</Alert>
        </Paper>
        <Box sx={{ textAlign: 'center', mt: 2, bgcolor: '#fff', borderRadius: 3, alignSelf: 'center', px: 2 }}><Button size="small" onClick={() => navigate('admin_login')} sx={{ color: 'text.secondary' }}>Acceso administración</Button></Box>
      </Box>
    </Box>
  );
}
