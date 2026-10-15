import { Box, Button, Stack } from '@mui/material';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';

export default function ClienteNavigation({ onInicio, onProductos }) {
  const { currentPage, navigate } = useApp();
  return (
    <Box role="navigation" aria-label="Navegación del portal" sx={{ px: { xs: 2, md: 4 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Button onClick={onInicio || (() => navigate('catalogo'))} sx={{ fontFamily: 'Kristi, cursive', color: 'primary.main', fontSize: 46, textTransform: 'none', lineHeight: 1 }}>PastaFab</Button>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {[[ 'catalogo', 'Productos' ], [ 'carrito', 'Carrito' ]].map(([page, label]) => <Button key={page} onClick={page === 'catalogo' && onProductos ? onProductos : () => navigate(page)} variant={currentPage === page ? 'contained' : 'text'} color="primary" sx={{ textTransform: 'none', px: 2 }}>{label}</Button>)}
        <ClientePerfilMenu />
      </Stack>
    </Box>
  );
}
