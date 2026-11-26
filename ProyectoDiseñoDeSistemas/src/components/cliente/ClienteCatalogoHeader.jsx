import { Box, Button } from '@mui/material';
import ClientePerfilMenu from './ClientePerfilMenu';
import ClienteCarritoMenu from './ClienteCarritoMenu';

export default function ClienteCatalogoHeader({ onInicio, onProductos, productosActivo = false, sobreVerde = false }) {
  const navStyle = { color: sobreVerde ? 'primary.contrastText' : 'primary.main', fontSize: { xs: 11, lg: 12 }, fontWeight: 700, borderRadius: 8, minWidth: 0, minHeight: 44, px: { xs: 1.2, lg: 1.8 }, whiteSpace: 'nowrap', '&:hover': { bgcolor: sobreVerde ? 'primary.dark' : 'action.hover' } };
  const activeStyle = { bgcolor: sobreVerde ? 'primary.contrastText' : 'primary.main', color: sobreVerde ? 'primary.main' : 'primary.contrastText', '&:hover': { bgcolor: sobreVerde ? 'background.paper' : 'primary.dark' } };

  return (
    <Box component="header" sx={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <Box
        component="span"
        sx={{
          display: 'block',
          width: 'fit-content',
          mx: { xs: 'auto', md: 0 },
          position: { xs: 'relative', md: 'absolute' },
          left: { md: sobreVerde ? '17%' : '6%' },
          top: { md: '50%' },
          transform: { md: 'translateY(-50%)' },
          color: sobreVerde ? 'primary.contrastText' : { xs: 'primary.main', md: 'primary.contrastText' },
          fontFamily: 'Kristi, cursive',
          fontSize: { xs: 38, md: 46 },
          fontWeight: 400,
          lineHeight: 1,
          px: { xs: 2, md: 0 },
          pt: { xs: 2, md: 0 },
          pb: { xs: 0.5, md: 0.5 },
        }}
      >
        PastaFab
      </Box>
    <Box role="navigation" aria-label="Navegación del cliente" sx={{ position: 'relative', zIndex: 3, ml: { md: '34%' }, mr: { md: '21%' }, bgcolor: 'transparent', minHeight: { xs: 56, md: 66, lg: 76 }, px: { xs: 1.5, sm: 2, md: 0 }, pt: { xs: 2, md: 1 }, pb: { xs: 0.8, md: 1 }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'space-evenly', md: 'space-between' }, flexWrap: { xs: 'nowrap', md: 'wrap' }, gap: { xs: 0.5, sm: 1 } }}>
      <Button aria-current={!productosActivo ? 'page' : undefined} sx={{ ...navStyle, ...(!productosActivo && activeStyle) }} onClick={onInicio}>Inicio</Button>
      <Button aria-current={productosActivo ? 'page' : undefined} sx={{ ...navStyle, ...(productosActivo && activeStyle) }} onClick={onProductos}>Productos</Button>
      <ClienteCarritoMenu sobreVerde={sobreVerde} />
      <ClientePerfilMenu sobreVerde={sobreVerde} />
    </Box>
    </Box>
  );
}
