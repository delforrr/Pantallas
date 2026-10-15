import { Box, Button, Stack } from '@mui/material';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';

export default function ClienteNavigation({ onInicio, onProductos, sobreVerde = false }) {
  const { currentPage, navigate } = useApp();
  return (
    <Box role="navigation" aria-label="Navegación del portal" sx={{ px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', bgcolor: sobreVerde ? 'transparent' : 'background.paper', borderBottom: '1px solid', borderColor: sobreVerde ? 'rgba(255,255,255,0.3)' : 'divider' }}>
      <Button onClick={onInicio || (() => navigate('catalogo'))} sx={{ fontFamily: 'Kristi, cursive', color: sobreVerde ? '#fff' : 'primary.main', fontSize: 46, textTransform: 'none', lineHeight: 1 }}>PastaFab</Button>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {[[ 'catalogo', 'Productos' ], [ 'carrito', 'Carrito' ]].map(([page, label]) => <Button key={page} onClick={page === 'catalogo' && onProductos ? onProductos : () => navigate(page)} variant={currentPage === page ? (sobreVerde ? 'outlined' : 'contained') : 'text'} color="primary" sx={{ textTransform: 'none', px: 2, ...(sobreVerde && { color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.12)' } }) }}>{label}</Button>)}
        <ClientePerfilMenu sobreVerde={sobreVerde} />
      </Stack>
    </Box>
  );
}
