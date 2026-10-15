import { useState } from 'react';
import { Card, CardMedia, CardContent, Box, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { clientStore, MINIMO_MAYORISTA, PRODUCT_IMAGES } from '../../pages/cliente/mockData';

export const ProductoCard = ({ producto, onAddToCartFeedback, modoMayorista = false, cantidadMayorista = 0, onAgregarMayorista }) => {
  const [cantidadMinorista, setCantidad] = useState(1);
  const [cantidadParaMayorista, setCantidadParaMayorista] = useState(MINIMO_MAYORISTA);
  const cantidad = modoMayorista ? cantidadParaMayorista : cantidadMinorista;
  const minimo = modoMayorista ? MINIMO_MAYORISTA : 1;
  const disponible = producto.stock - (modoMayorista ? cantidadMayorista : 0);
  const sinStock = disponible < minimo;
  const cambiarCantidad = (delta) => {
    if (modoMayorista) setCantidadParaMayorista((n) => Math.max(minimo, Math.min(disponible, n + delta)));
    else setCantidad((n) => Math.max(1, Math.min(producto.stock, n + delta)));
  };
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  const handleAddToCart = () => {
    if (sinStock || agregadoAnim) return;
    if (modoMayorista) {
      onAgregarMayorista(producto, cantidad);
      return;
    }
    clientStore.addToCart(producto, cantidad);
    setAgregadoAnim(true);
    onAddToCartFeedback?.(producto, cantidad);
    setTimeout(() => {
      setAgregadoAnim(false);
      setCantidad(1);
    }, 1800);
  };

  return (
    <Card component="article" elevation={0} sx={{ height: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', borderRadius: '10px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 5px 18px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 28px rgba(0,0,0,0.1)' } }}>
      <Box sx={{ p: { xs: 1, sm: 2 }, pb: 0, bgcolor: 'background.paper' }}>
        <CardMedia component="img" image={producto.imagen} alt={producto.nombre} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = PRODUCT_IMAGES[100]; }} sx={{ width: '100%', height: { xs: 140, sm: 200, lg: 220 }, objectFit: 'contain', borderRadius: '6px' }} />
      </Box>
      <CardContent sx={{ p: { xs: 1.25, sm: 2.5 }, display: 'flex', flexDirection: 'column', flex: 1, '&:last-child': { pb: { xs: 1.5, sm: 2.5 } } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
          <Typography component="h2" variant="h6" sx={{ flex: '1 1 140px', minWidth: 0, overflowWrap: 'anywhere', fontWeight: 700, fontSize: { xs: '0.85rem', sm: '1.05rem' }, lineHeight: 1.4 }}>{producto.nombre}</Typography>
          <Typography sx={{ color: 'secondary.main', fontSize: { xs: '1rem', sm: '1.15rem' }, fontWeight: 800, whiteSpace: 'nowrap' }}>${producto.precio.toLocaleString('es-AR')}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1.5 }}>{producto.variedad}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>{producto.unidad} · {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}{modoMayorista && ` · Mínimo ${minimo} por producto`}</Typography>
        {producto.maridajeSugerido && <Typography variant="caption" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>Ideal con {producto.maridajeSugerido}</Typography>}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap', mt: 'auto', pt: 1.5 }}>
          <Box role="group" aria-label={`Cantidad de ${producto.nombre}`} sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 20 }}>
            <IconButton size="small" aria-label={`Reducir cantidad de ${producto.nombre}`} onClick={() => cambiarCantidad(-1)} disabled={cantidad <= minimo || agregadoAnim || sinStock}><RemoveIcon fontSize="small" /></IconButton>
            <Typography aria-live="polite" sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{cantidad}</Typography>
            <IconButton size="small" aria-label={`Aumentar cantidad de ${producto.nombre}`} onClick={() => cambiarCantidad(1)} disabled={cantidad >= disponible || agregadoAnim || sinStock}><AddIcon fontSize="small" /></IconButton>
          </Box>
          <Button variant="contained" color="secondary" onClick={handleAddToCart} disabled={sinStock || agregadoAnim} startIcon={agregadoAnim ? <CheckCircleIcon /> : undefined} aria-label={`Agregar ${cantidad} de ${producto.nombre} al carrito${modoMayorista ? ' mayorista' : ''}`} sx={{ borderRadius: 20, width: { xs: '100%', sm: 'auto' }, minWidth: 0, px: { xs: 0.75, sm: 2.5 }, py: 1.2, fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 700, letterSpacing: '0.04em', boxShadow: '0 0 0 6px rgba(206,43,55,0.07)', ml: 'auto' }}>
            {sinStock ? (modoMayorista ? 'Stock menor al mínimo' : 'Sin stock') : agregadoAnim ? '¡Agregado!' : 'Agregar al carrito'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductoCard;
