import { useState } from 'react';
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useApp } from '../context/AppContext';

export default function AdminLoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const ingresar = (event) => {
    event.preventDefault();
    setError('');
    if (email.trim().toLowerCase() !== 'admin@pastafab.com' || password !== 'admin') {
      setError('El correo o la contraseña de administración son incorrectos.');
      return;
    }
    login('admin');
  };

  return (
    <Box component="main" sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2, position: 'relative', overflow: 'hidden' }}>
      <Box aria-hidden="true" sx={{ position: 'absolute', top: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: (theme) => `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <Box component="section" aria-label="Acceso de administración" sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 5 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '24px', boxShadow: 12, position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '18px', bgcolor: 'primary.main', color: 'primary.contrastText', mb: 2 }}><AdminPanelSettingsIcon sx={{ fontSize: 32 }} /></Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>PastaFab</Typography>
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>Panel de administración</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Ingresá con tu cuenta de administrador.</Typography>
        </Box>
        <Box component="form" onSubmit={ingresar} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField required fullWidth type="email" label="Correo de administración" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" /></InputAdornment> } }} />
          <TextField required fullWidth label="Contraseña" type={showPass ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPass((value) => !value)} edge="end">{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
          {error && <Alert severity="error">{error}</Alert>}
          <Button fullWidth variant="contained" type="submit" startIcon={<AdminPanelSettingsIcon />} sx={{ py: 1.4 }}>Ingresar al panel</Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>Demo: admin@pastafab.com / admin</Typography>
      </Box>
    </Box>
  );
}
