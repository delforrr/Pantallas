import { Box, Button, Stack } from '@mui/material';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';
import { clientStore, useClientStore } from '../../pages/cliente/mockData';

export default function ClienteNavigation({ onInicio, onProductos, sobreVerde = false }) {
  const { currentPage, navigate } = useApp();
  const { cart, mayoristaItems } = useClientStore();
  const cantidadItems = cart.length + Object.keys(mayoristaItems).length;
  const irAlInicio = () => {
    clientStore.setCatalogoModo('inicio');
    navigate('catalogo');
  };
  const irAProductos = () => {
    if (clientStore.getState().catalogoModo === 'inicio') clientStore.setCatalogoModo('productos');
    navigate('catalogo');
  };
  return (
    <Box role="navigation" aria-label="Navegación del portal" sx={{ px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', bgcolor: sobreVerde ? 'primary.main' : 'background.paper', borderBottom: sobreVerde ? '3px solid' : '1px solid', borderColor: sobreVerde ? '#CE2B37' : 'divider' }}>
      <Button onClick={onInicio || irAlInicio} sx={{ fontFamily: 'Kristi, cursive', color: sobreVerde ? '#fff' : 'primary.main', fontSize: 46, textTransform: 'none', lineHeight: 1, ...(sobreVerde && { bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }) }}>PastaFab</Button>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {[[ 'catalogo', 'Productos' ], [ 'carrito', 'Carrito' ]].map(([page, label]) => <Button key={page} aria-label={page === 'carrito' ? `Carrito, ${cantidadItems} ítems` : undefined} onClick={page === 'catalogo' ? (onProductos || irAProductos) : () => navigate(page)} variant={currentPage === page ? (sobreVerde ? 'outlined' : 'contained') : 'text'} color="primary" sx={{ textTransform: 'none', px: 2, ...(sobreVerde && { color: '#fff', bgcolor: 'primary.main', borderColor: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'primary.dark' } }) }}>{label}{page === 'carrito' && <Box component="span" aria-hidden="true" sx={{ ml: 1, minWidth: 22, height: 22, px: 0.75, borderRadius: '50%', bgcolor: 'background.default', color: 'primary.main', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{cantidadItems}</Box>}</Button>)}
        <ClientePerfilMenu sobreVerde={sobreVerde} />
      </Stack>
    </Box>
  );
}
