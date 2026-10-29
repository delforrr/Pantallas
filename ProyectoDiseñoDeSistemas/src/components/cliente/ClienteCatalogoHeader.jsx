import { Badge, Box, Button, IconButton, Tooltip } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';

export default function ClienteCatalogoHeader({ cartSummary, onInicio, onProductos, productosActivo = false, sobreVerde = false }) {
  const { navigate } = useApp();
  const navStyle = { color: sobreVerde ? 'primary.contrastText' : 'primary.main', fontSize: { xs: 11, lg: 12 }, fontWeight: 700, borderRadius: 8, px: { xs: 1.2, lg: 1.8 }, whiteSpace: 'nowrap', '&:hover': { bgcolor: sobreVerde ? 'primary.dark' : 'action.hover' } };
  const activeStyle = { bgcolor: sobreVerde ? 'primary.contrastText' : 'primary.main', color: sobreVerde ? 'primary.main' : 'primary.contrastText', '&:hover': { bgcolor: sobreVerde ? 'background.paper' : 'primary.dark' } };

  return (
    <Box role="navigation" aria-label="Navegación del cliente" sx={{ position: 'relative', zIndex: 3, ml: { md: '40%' }, mr: { md: '13%' }, bgcolor: 'transparent', minHeight: { xs: 56, md: 66, lg: 76 }, px: { xs: 1.5, sm: 2, lg: 2.5 }, py: { xs: 0.8, md: 1 }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'space-evenly' }, flexWrap: 'wrap', gap: 1 }}>
      <Button aria-current={!productosActivo ? 'page' : undefined} sx={{ ...navStyle, ...(!productosActivo && activeStyle) }} onClick={onInicio}>Inicio</Button>
      <Button aria-current={productosActivo ? 'page' : undefined} sx={{ ...navStyle, ...(productosActivo && activeStyle) }} onClick={onProductos}>Productos</Button>
      <Tooltip title={`Ver carrito · $${cartSummary.totalPrice.toLocaleString('es-AR')}`}>
        <IconButton aria-label={`Carrito, ${cartSummary.totalItems} ítems`} onClick={() => navigate('carrito')} sx={{ color: sobreVerde ? 'primary.contrastText' : 'primary.main', '&:hover': { bgcolor: sobreVerde ? 'primary.dark' : 'action.hover' } }}>
          <Badge badgeContent={cartSummary.totalItems} showZero sx={{ '& .MuiBadge-badge': { bgcolor: 'background.default', color: 'primary.main' } }}><ShoppingBagOutlinedIcon fontSize="small" /></Badge>
        </IconButton>
      </Tooltip>
      <ClientePerfilMenu sobreVerde={sobreVerde} />
    </Box>
  );
}
