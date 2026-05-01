import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, InputAdornment,
  IconButton, Chip, Divider, CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useApp } from '../context/AppContext';

const DEMO_CREDENTIALS = {
  cliente: { user: 'cliente@mail.com', pass: '1234' },
  admin: { user: 'admin@pastafab.com', pass: 'admin' },
};

const LoginPage = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (roleOverride) => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (roleOverride) {
        login(roleOverride);
        return;
      }
      if (email === DEMO_CREDENTIALS.admin.user && password === DEMO_CREDENTIALS.admin.pass) {
        login('admin');
      } else if (email === DEMO_CREDENTIALS.cliente.user && password === DEMO_CREDENTIALS.cliente.pass) {
        login('cliente');
      } else {
        setError('Credenciales incorrectas. Usá los accesos rápidos abajo.');
      }
    }, 700);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: (theme) => `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', left: '-8%',
        width: 400, height: 400, borderRadius: '50%',
        background: (theme) => `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          mx: 2,
          p: { xs: 3, sm: 5 },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '24px',
          boxShadow: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo / Brand */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72, height: 72,
            borderRadius: '20px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            mb: 2,
            boxShadow: 4,
          }}>
            <Typography sx={{ fontSize: 32 }}>🍝</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            PastaFab
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Sistema de Gestión Integral
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(null); }}>
          <TextField
            fullWidth
            label="Correo electrónico"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type={showPass ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass((p) => !p)} edge="end" size="small">
                    {showPass ? <VisibilityOff sx={{ color: 'text.secondary' }} /> : <Visibility sx={{ color: 'text.secondary' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1, pl: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 2, mb: 3, py: 1.4, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Iniciar Sesión'}
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
            Acceso rápido (demo)
          </Typography>
        </Divider>

        {/* Quick Access */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<StorefrontIcon />}
            onClick={() => handleLogin('cliente')}
            disabled={loading}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              py: 1.2,
              flexDirection: 'column',
              gap: 0.5,
              '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
            }}
          >
            <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Ingresar como
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Cliente</Typography>
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => handleLogin('admin')}
            disabled={loading}
            sx={{
              borderColor: 'secondary.main',
              color: 'secondary.main',
              py: 1.2,
              flexDirection: 'column',
              gap: 0.5,
              '&:hover': { borderColor: 'secondary.main', bgcolor: 'action.hover' },
            }}
          >
            <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Ingresar como
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Admin</Typography>
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Chip
            label="Demo: admin@pastafab.com / admin"
            size="small"
            sx={{ bgcolor: 'action.hover', color: 'text.secondary', fontSize: '0.7rem' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
