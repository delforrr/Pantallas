import { useState } from 'react';
import { Alert, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useApp } from '../../context/AppContext';
import { autenticarCliente, registrarCliente } from './mockData';
import ingredientesPatternRed from '../../components/cliente/ingredientes-pattern-red.svg';

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
    <Box component="main" sx={{ py: 1, backgroundImage: `url("${ingredientesPatternRed}")`, backgroundSize: 340 }}>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, mx: 'auto', p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 5, bgcolor: 'background.paper', boxSizing: 'border-box' }}>
          <Typography component="h1" sx={{ fontFamily: 'Kristi, cursive', fontSize: { xs: 44, sm: 54 }, color: 'primary.main', lineHeight: 1.1 }}>{registro ? 'Sumate a la familia' : 'Qué bueno verte'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, lineHeight: 1.4 }}>{registro ? 'Creá tu cuenta para armar tu carrito y seguir tus pedidos.' : motivo}</Typography>
          <Stack component="form" onSubmit={enviar} spacing={1.5} sx={{ '& .MuiInputBase-root': { fontSize: 14 } }}>
            {registro && <TextField size="small" required fullWidth label="Nombre y apellido" autoComplete="name" value={nombre} onChange={(event) => setNombre(event.target.value)} slotProps={{ htmlInput: { maxLength: 100 } }} />}
            <TextField size="small" required fullWidth label="Correo electrónico" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextField size="small" required fullWidth label="Contraseña" type={visible ? 'text' : 'password'} autoComplete={registro ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} helperText={registro ? 'Usá al menos 6 caracteres.' : undefined} slotProps={{ htmlInput: { minLength: registro ? 6 : 1 }, input: { endAdornment: <InputAdornment position="end"><IconButton aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible((value) => !value)} edge="end">{visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></InputAdornment> } }} />
            {registro && <TextField size="small" required fullWidth label="Confirmar contraseña" type={visible ? 'text' : 'password'} autoComplete="new-password" value={confirmacion} onChange={(event) => setConfirmacion(event.target.value)} />}
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ py: 1 }}>{registro ? 'Crear mi cuenta' : 'Iniciar sesión'}</Button>
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
            <Typography variant="caption" color="text.secondary">{registro ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}</Typography>
            <Button onClick={cambiarModo}>{registro ? 'Iniciar sesión' : 'Registrarme'}</Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center', fontSize: 11 }}>Demo en memoria. {registro ? 'La cuenta estará disponible hasta recargar la página.' : 'cliente@mail.com / 1234.'}</Typography>
        </Paper>
    </Box>
  );
}
