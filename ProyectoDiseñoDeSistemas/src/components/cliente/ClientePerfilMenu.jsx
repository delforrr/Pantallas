import { useId, useState } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useApp } from '../../context/AppContext';

export default function ClientePerfilMenu({ sobreVerde = false }) {
  const { user, navigate, logout } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const id = useId();
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);
  const goTo = (page) => { close(); navigate(page); };

  return (
    <>
      <Tooltip title="Mi cuenta">
        <IconButton id={`${id}-button`} aria-label="Mi cuenta" aria-haspopup="menu" aria-controls={open ? `${id}-menu` : undefined} aria-expanded={open ? 'true' : undefined} onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ color: sobreVerde ? '#fff' : 'primary.main', border: '1px solid', borderColor: sobreVerde ? 'rgba(255,255,255,0.6)' : 'divider', bgcolor: sobreVerde ? 'primary.main' : 'background.paper', '&:hover': { bgcolor: sobreVerde ? 'primary.dark' : 'action.hover' } }}>
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
      <Menu id={`${id}-menu`} anchorEl={anchorEl} open={open} onClose={close} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} slotProps={{ list: { 'aria-labelledby': `${id}-button` }, paper: { sx: { mt: 1, minWidth: 230, borderRadius: '14px', border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 28px #51482d26' } } }}>
        <Typography component="li" variant="body2" sx={{ px: 2, py: 1, fontWeight: 700, color: 'primary.main', listStyle: 'none' }}>{user?.name}</Typography>
        <Divider />
        <MenuItem onClick={() => goTo('pedidos_cliente')}><ListItemIcon><ShoppingBagOutlinedIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText>Mis pedidos</ListItemText></MenuItem>
        <MenuItem onClick={() => goTo('medios_pago')}><ListItemIcon><PaymentsOutlinedIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText>Medios de pago</ListItemText></MenuItem>
        <Divider />
        <MenuItem onClick={() => { close(); logout(); }} sx={{ color: 'secondary.main' }}><ListItemIcon><LogoutIcon fontSize="small" color="secondary" /></ListItemIcon><ListItemText>Cerrar sesión</ListItemText></MenuItem>
      </Menu>
    </>
  );
}
