import { Badge, Box, Button, IconButton, Tooltip } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';

export default function ClienteCatalogoHeader({ cartSummary, onInicio, onProductos, productosActivo = false, sobreVerde = false }) {
  const { user, navigate } = useApp();
  const navStyle = { color: sobreVerde ? 'primary.contrastText' : 'primary.main', fontSize: { xs: 11, lg: 12 }, fontWeight: 700, borderRadius: 8, minWidth: 0, minHeight: 44, px: { xs: 1.2, lg: 1.8 }, whiteSpace: 'nowrap', '&:hover': { bgcolor: sobreVerde ? 'primary.dark' : 'action.hover' } };
  const activeStyle = { bgcolor: sobreVerde ? 'primary.contrastText' : 'primary.main', color: sobreVerde ? 'primary.main' : 'primary.contrastText', '&:hover': { bgcolor: sobreVerde ? 'background.paper' : 'primary.dark' } };

  return (
    <Box component="header" sx={{ position: 'relative', width: '100%', minWidth: 0 }}>
      {sobreVerde && (
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, mx: { xs: 'auto', md: 0 }, position: { xs: 'relative', md: 'absolute' }, left: { md: '17%' }, top: { md: '50%' }, transform: { md: 'translateY(-50%)' }, color: 'primary.contrastText', fontFamily: 'Kristi, cursive', fontSize: 46, fontWeight: 400, lineHeight: 1, px: 0, py: 0.5 }}>
          PastaFab
        </Box>
      )}
    <Box role="navigation" aria-label="Navegación del cliente" sx={{ position: 'relative', zIndex: 3, ml: { md: '34%' }, mr: { md: '21%' }, bgcolor: 'transparent', minHeight: { xs: 56, md: 66, lg: 76 }, px: { xs: 1.5, sm: 2, md: 0 }, pt: { xs: 2, md: 1 }, pb: { xs: 0.8, md: 1 }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'space-evenly', md: 'space-between' }, flexWrap: { xs: 'nowrap', md: 'wrap' }, gap: { xs: 0.5, sm: 1 } }}>
      <Button aria-current={!productosActivo ? 'page' : undefined} sx={{ ...navStyle, ...(!productosActivo && activeStyle) }} onClick={onInicio}>Inicio</Button>
      <Button aria-current={productosActivo ? 'page' : undefined} sx={{ ...navStyle, ...(productosActivo && activeStyle) }} onClick={onProductos}>Productos</Button>
      <Button sx={navStyle} onClick={() => navigate('pedidos_cliente')}>Mis pedidos</Button>
      <Tooltip title={user ? `Ver carrito · $${cartSummary.totalPrice.toLocaleString('es-AR')}` : 'Ingresá para ver tu carrito'}>
        <IconButton aria-label={user ? `Carrito, ${cartSummary.totalItems} ítems` : 'Carrito'} onClick={() => navigate('carrito')} sx={{ color: sobreVerde ? 'primary.contrastText' : 'primary.main', '&:hover': { bgcolor: sobreVerde ? 'primary.dark' : 'action.hover' } }}>
          <Badge badgeContent={user ? cartSummary.totalItems : 0} showZero={Boolean(user)} sx={{ '& .MuiBadge-badge': { bgcolor: 'background.default', color: 'primary.main' } }}><ShoppingBagOutlinedIcon fontSize="small" /></Badge>
        </IconButton>
      </Tooltip>
      <ClientePerfilMenu sobreVerde={sobreVerde} />
    </Box>
    </Box>
  );
}
