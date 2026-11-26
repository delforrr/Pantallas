import { Box, Button, Stack } from '@mui/material';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';
import ClienteCarritoMenu from './ClienteCarritoMenu';
import { clientStore } from '../../pages/cliente/mockData';

export default function ClienteNavigation({ onInicio, onProductos, sobreVerde = false }) {
  const { currentPage, navigate } = useApp();
  const irAlInicio = () => {
    clientStore.setCatalogoModo('inicio');
    navigate('catalogo');
  };
  const irAProductos = () => {
    if (clientStore.getState().catalogoModo === 'inicio') clientStore.setCatalogoModo('productos');
    navigate('catalogo');
  };
  return (
    <Box role="navigation" aria-label="Navegación del portal" sx={{ px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', bgcolor: sobreVerde ? 'primary.main' : 'background.paper', borderBottom: '9px solid transparent', backgroundImage: 'linear-gradient(to bottom, #009246 0% 33.333%, #ffffff 33.333% 66.666%, #CE2B37 66.666% 100%)', backgroundSize: '100% 9px', backgroundPosition: 'left bottom', backgroundRepeat: 'no-repeat', backgroundOrigin: 'border-box' }}>
      <Button onClick={onInicio || irAlInicio} sx={{ fontFamily: 'Kristi, cursive', color: sobreVerde ? '#fff' : 'primary.main', fontSize: 46, textTransform: 'none', lineHeight: 1, ...(sobreVerde && { bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }) }}>PastaFab</Button>
      <Stack direction="row" sx={{ width: { xs: '100%', sm: 'auto' }, flexWrap: { xs: 'nowrap', sm: 'wrap' }, gap: { xs: 0.5, sm: 1.5 }, alignItems: 'center', justifyContent: 'space-between', '& > .MuiButton-root': { px: { xs: 1, sm: 2 } }, '& > .MuiIconButton-root': { flexShrink: 0 } }}>
        <Button onClick={onProductos || irAProductos} variant={currentPage === 'catalogo' ? (sobreVerde ? 'outlined' : 'contained') : 'text'} color="primary" sx={{ textTransform: 'none', ...(sobreVerde && { color: '#fff', bgcolor: 'primary.main', borderColor: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'primary.dark' } }) }}>Productos</Button>
        <ClienteCarritoMenu sobreVerde={sobreVerde} />
        <ClientePerfilMenu sobreVerde={sobreVerde} />
      </Stack>
    </Box>
  );
}
