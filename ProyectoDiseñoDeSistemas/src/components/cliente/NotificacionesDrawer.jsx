import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useApp } from '../../context/AppContext';

const INITIAL_NOTIFICACIONES = [
  {
    id: 1,
    titulo: 'Pedido en Elaboración',
    mensaje: 'Tu pedido #PED-2025-0891 (Sorrentinos y Ravioles) ya ingresó a la sala de amasado artesanal.',
    tiempo: 'Hace 15 min',
    tipo: 'produccion',
    leida: false,
    badge: 'En Producción',
    color: 'info',
    destino: 'pedidos_cliente',
  },
  {
    id: 2,
    titulo: 'Canje Aprobado ($0)',
    mensaje: 'La reposición por reclamo #CANJE-014 fue emitida a costo $0 con remito oficial #R-0089.',
    tiempo: 'Hace 1 hora',
    tipo: 'canje',
    leida: false,
    badge: 'Garantía $0',
    color: 'success',
    destino: 'pedidos_cliente',
  },
  {
    id: 3,
    titulo: 'Especialidad del Día',
    mensaje: 'Ingresó Salsa Cuatro Quesos con nuez y salvia fresca en pote térmico listo para servir.',
    tiempo: 'Hace 3 horas',
    tipo: 'catalogo',
    leida: false,
    badge: 'Catálogo',
    color: 'warning',
    destino: 'catalogo',
  },
  {
    id: 4,
    titulo: 'Recordatorio Pedido Fijo',
    mensaje: 'Tu orden semanal para Trattoria Bella se procesará automáticamente el viernes con 10% OFF.',
    tiempo: 'Ayer',
    tipo: 'fijo',
    leida: true,
    badge: 'Fijo Semanal',
    color: 'primary',
    destino: 'pedidos_cliente',
  },
];

/**
 * NotificacionesDrawer - Drawer lateral interactivo de notificaciones para el cliente.
 * Se vincula automáticamente al botón de notificaciones del AppHeader (#notifications-btn).
 */
export const NotificacionesDrawer = ({ open: controlledOpen, onClose: controlledClose }) => {
  const { navigate } = useApp();
  const [internalOpen, setInternalOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState(INITIAL_NOTIFICACIONES);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleClose = () => {
    if (controlledClose) {
      controlledClose();
    } else {
      setInternalOpen(false);
    }
  };

  // Escuchar clicks automáticos en el botón del AppHeader (#notifications-btn)
  useEffect(() => {
    const btn = document.getElementById('notifications-btn');
    if (!btn) return;

    const handleHeaderClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setInternalOpen(true);
    };

    btn.addEventListener('click', handleHeaderClick);
    return () => btn.removeEventListener('click', handleHeaderClick);
  }, []);

  const noLeidasCount = notificaciones.filter((n) => !n.leida).length;

  const handleMarcarTodasLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const handleLimpiarTodas = () => {
    setNotificaciones([]);
  };

  const handleItemClick = (noti) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === noti.id ? { ...n, leida: true } : n))
    );
    if (noti.destino) {
      navigate(noti.destino);
      handleClose();
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'produccion':
        return <PrecisionManufacturingIcon fontSize="small" color="info" />;
      case 'canje':
        return <CheckCircleOutlineIcon fontSize="small" color="success" />;
      case 'catalogo':
        return <RestaurantMenuIcon fontSize="small" color="warning" />;
      default:
        return <EventAvailableIcon fontSize="small" color="primary" />;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(4px)' } },
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 24,
        },
      }}
    >
      {/* Cabecera del Drawer */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F9FAFB'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <NotificationsActiveIcon color="primary" sx={{ fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
            Notificaciones
          </Typography>
          {noLeidasCount > 0 && (
            <Chip
              label={`${noLeidasCount} nuevas`}
              size="small"
              color="primary"
              sx={{ fontWeight: 700, height: 22, fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Barra de Acciones Rápidas */}
      {notificaciones.length > 0 && (
        <Box
          sx={{
            px: 2.5,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            size="small"
            startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
            onClick={handleMarcarTodasLeidas}
            disabled={noLeidasCount === 0}
            sx={{ fontSize: '0.72rem', textTransform: 'none', fontWeight: 600 }}
          >
            Marcar leídas
          </Button>

          <Tooltip title="Limpiar todas">
            <IconButton size="small" onClick={handleLimpiarTodas} sx={{ color: 'text.secondary' }}>
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Lista de Notificaciones */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5 }}>
        {notificaciones.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            <NotificationsActiveIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.secondary' }}>
              No tienes notificaciones pendientes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Te avisaremos sobre el estado de tus pedidos, promociones y canjes.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notificaciones.map((noti) => (
              <ListItem
                key={noti.id}
                onClick={() => handleItemClick(noti)}
                sx={{
                  mb: 1.2,
                  p: 1.5,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: noti.leida ? 'divider' : 'primary.main',
                  bgcolor: noti.leida ? 'background.paper' : 'action.selected',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(-2px)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, mt: 0.3, alignSelf: 'flex-start' }}>
                  {getIcon(noti.tipo)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: noti.leida ? 600 : 800 }}>
                        {noti.titulo}
                      </Typography>
                      <Chip
                        label={noti.badge}
                        size="small"
                        color={noti.color}
                        variant={noti.leida ? 'outlined' : 'filled'}
                        sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.35, mb: 0.5 }}>
                        {noti.mensaje}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.68rem', fontWeight: 600 }}>
                        {noti.tiempo}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Pie del Drawer */}
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={handleClose}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          Cerrar panel
        </Button>
      </Box>
    </Drawer>
  );
};

export default NotificacionesDrawer;
