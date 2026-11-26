import { useState } from 'react';
import {
  Badge,
  Box,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { useApp } from '../../context/AppContext';
import { clientStore, useClientStore } from '../../pages/cliente/mockData';

export default function ClienteCarritoMenu({ sobreVerde = false }) {
  const { navigate, currentPage, user } = useApp();
  const { cart, mayoristaItems, carritoModo } = useClientStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const esCliente = user?.role === 'cliente';
  const cantidadHabitual = esCliente ? cart.length : 0;
  const cantidadMayorista = esCliente ? Object.keys(mayoristaItems).length : 0;
  const cantidadTotal = cantidadHabitual + cantidadMayorista;
  const activo = currentPage === 'carrito';
  const menuId = 'cliente-carrito-menu';

  const abrirMenu = (event) => setAnchorEl(event.currentTarget);
  const cerrarMenu = () => setAnchorEl(null);
  const irAlCarrito = (modo) => {
    clientStore.setCarritoModo(modo);
    cerrarMenu();
    navigate('carrito');
  };

  return (
    <>
      <Tooltip title={esCliente ? `Carrito · ${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'} en total` : 'Ingresá para ver tu carrito'}>
        <IconButton
          aria-label={`Carrito, ${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'} en total`}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={abrirMenu}
          sx={{
            flexShrink: 0,
            color: activo ? 'primary.contrastText' : sobreVerde ? '#fff' : 'primary.main',
            bgcolor: activo ? 'primary.main' : 'transparent',
            '&:hover': {
              bgcolor: activo ? 'primary.dark' : sobreVerde ? 'rgba(255,255,255,0.15)' : 'action.hover',
            },
          }}
        >
          <Badge
            badgeContent={cantidadTotal}
            showZero={esCliente}
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                fontWeight: 700,
                fontSize: '0.64rem',
                height: 17,
                minWidth: 17,
                px: '4px',
                top: 0,
                right: 0,
                transform: 'translate(42%, -70%)',
              },
            }}
          >
            <ShoppingBagOutlinedIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={cerrarMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: { 'aria-label': 'Elegí un carrito' },
          paper: {
            sx: {
              mt: 1,
              minWidth: 270,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 28px #51482d26',
            },
          },
        }}
      >
        <Box sx={{ px: 2, pt: 1.25, pb: 0.75 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, lineHeight: 1.4 }}>
            Mis carritos
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {cantidadTotal} {cantidadTotal === 1 ? 'producto en total' : 'productos en total'}
          </Typography>
        </Box>

        <MenuItem
          selected={activo && carritoModo === 'habitual'}
          onClick={() => irAlCarrito('habitual')}
          sx={{ py: 1.25 }}
        >
          <ListItemIcon>
            <ShoppingBagOutlinedIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Carrito minorista"
            secondary="Compra habitual"
            slotProps={{
              primary: { sx: { fontWeight: 700, fontSize: '0.875rem' } },
              secondary: { sx: { fontSize: '0.75rem' } },
            }}
          />
          <Chip
            label={cantidadHabitual}
            size="small"
            color={cantidadHabitual > 0 ? 'primary' : 'default'}
            sx={{ ml: 1.5, fontWeight: 700, minWidth: 28 }}
          />
        </MenuItem>

        <MenuItem
          selected={activo && carritoModo === 'mayorista'}
          onClick={() => irAlCarrito('mayorista')}
          sx={{ py: 1.25 }}
        >
          <ListItemIcon>
            <StorefrontOutlinedIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Carrito mayorista"
            secondary="Eventos y pedidos semanales"
            slotProps={{
              primary: { sx: { fontWeight: 700, fontSize: '0.875rem' } },
              secondary: { sx: { fontSize: '0.75rem' } },
            }}
          />
          <Chip
            label={cantidadMayorista}
            size="small"
            color={cantidadMayorista > 0 ? 'secondary' : 'default'}
            sx={{ ml: 1.5, fontWeight: 700, minWidth: 28 }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
