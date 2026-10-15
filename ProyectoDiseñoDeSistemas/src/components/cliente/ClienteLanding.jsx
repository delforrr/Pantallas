import { Box, Typography, Button, IconButton, Badge, Stack, Paper, Tooltip } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useApp } from '../../context/AppContext';

// Colors belong to this restaurant illustration, independently of the ERP theme.
const olive = '#416522';
const tomato = '#c93600';
const script = '"Kristi", "Brush Script MT", cursive';

export default function ClienteLanding({ cartSummary, onCatalogo, onEvento, onAbout, onContact, onSocial, producto, cantidad, agregado, onPrev, onNext, onCantidad, onAdd, onSignature }) {
  const { navigate } = useApp();
  const navStyle = { color: olive, fontSize: { xs: 11, lg: 13 }, fontWeight: 700, borderRadius: 8, px: { xs: 1.2, lg: 2 }, whiteSpace: 'nowrap' };
  return (
    <Box sx={{ bgcolor: '#ded0a8', p: { xs: 1.5, sm: 3, lg: 5 }, fontFamily: '"Montserrat", sans-serif' }}>
      <Box component="section" aria-label="Bienvenidos a PastaFab" sx={{ position: 'relative', isolation: 'isolate', bgcolor: '#fff', color: olive, boxShadow: '8px 12px 22px #51482d40', minHeight: { xs: 740, sm: 820, md: 540, lg: 610 }, aspectRatio: { md: '2629 / 1527' }, overflow: 'hidden', backgroundImage: { xs: 'none', md: 'url(/assets/landing-template-card.jpg)' }, backgroundSize: '100% 100%' }}>
        {/* Preserve the illustration; replace all template text with live content. */}
        <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', zIndex: -1, left: '48.5%', right: '13%', top: '17%', bottom: 0, bgcolor: '#fff' }} />
        <Box role="navigation" aria-label="Navegación del cliente" sx={{ position: 'relative', ml: { md: '25.8%' }, bgcolor: '#fff', minHeight: { md: 84, lg: 100 }, px: { xs: 1, lg: 3 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: 1 }}>
          <Button sx={{ ...navStyle, bgcolor: olive, color: '#fff', '&:hover': { bgcolor: '#325018' } }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
          <Button sx={navStyle} onClick={onCatalogo}>Productos</Button>
          <Button sx={navStyle} onClick={() => navigate('pedidos_cliente')}>Mis pedidos</Button>
          <Button sx={navStyle} onClick={() => navigate('medios_pago')}>Medios de pago</Button>
          <Tooltip title={`Ver carrito · $${cartSummary.totalPrice.toLocaleString('es-AR')}`}>
            <IconButton aria-label={`Carrito, ${cartSummary.totalItems} unidades`} onClick={() => navigate('carrito')} sx={{ color: olive }}><Badge badgeContent={cartSummary.totalItems} color="secondary"><ShoppingBagOutlinedIcon /></Badge></IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', py: 3, background: `linear-gradient(90deg, ${olive} 50%, #fff 50%)` }}>
          <Box component="img" src="/assets/pasta-dish.png" alt="Penne con tomates frescos y hierbas" sx={{ width: '75%', maxWidth: 340, aspectRatio: '1', objectFit: 'contain' }} />
        </Box>
        <Box sx={{ ml: { md: '49%' }, width: { md: '38%' }, textAlign: 'center', px: { xs: 3, md: 1.5 }, pt: { xs: 1, md: 1, lg: 2 }, pb: 4 }}>
          <Typography component="h1" sx={{ fontFamily: script, fontSize: { xs: 90, sm: 110, md: 84, lg: 134 }, lineHeight: 1.05, fontWeight: 400 }}>PastaFab</Typography>
          <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontSize: { xs: 23, md: 24, lg: 31 }, fontWeight: 700, color: '#fff', WebkitTextStroke: `1px ${tomato}`, letterSpacing: '0.025em', lineHeight: 1.3, mt: 1 }}>PASTAS ARTESANALES</Typography>
          <Typography sx={{ mt: 2, py: 0.5, bgcolor: '#eee3d7', color: '#5f574c', fontSize: { xs: 12, lg: 15 }, letterSpacing: '0.28em', clipPath: 'polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)' }}>HECHAS CON TRADICIÓN</Typography>
          <Typography sx={{ fontFamily: script, fontSize: { xs: 43, md: 38, lg: 54 }, lineHeight: 1.2, mt: 2.5 }}>El sabor de lo nuestro</Typography>
          <Typography sx={{ fontFamily: '"Montserrat", sans-serif', color: '#777467', fontSize: { xs: 13, lg: 14 }, lineHeight: 1.6, mt: 1, mb: 2.5 }}>Recetas de familia, ingredientes frescos y la pasión de siempre. Elegí tus pastas favoritas y llevá un pedacito de Italia a tu mesa.</Typography>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onCatalogo} sx={{ bgcolor: tomato, color: '#fff', borderRadius: 20, py: 1.3, width: '90%', fontSize: 14, boxShadow: 'none', '&:hover': { bgcolor: '#a52e00' } }}>Hacer un pedido</Button>
          <Button size="small" onClick={onEvento} sx={{ color: olive, mt: 1.2, fontSize: 11, textTransform: 'none' }}>¿Tenés un evento? Pedí tu presupuesto</Button>
        </Box>
      </Box>

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, pt: 2.5, pb: 3, color: olive }}>
        <Typography sx={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 700 }}>FRESCAS CADA DÍA · HECHAS A MANO</Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          <Button onClick={onAbout} size="small" sx={{ color: olive, textTransform: 'none' }}>Nosotros</Button>
          <Button onClick={onContact} size="small" sx={{ color: olive, textTransform: 'none' }}>Contacto</Button>
          {[[InstagramIcon, 'Instagram'], [FacebookIcon, 'Facebook'], [WhatsAppIcon, 'WhatsApp']].map(([Icon, name]) => <IconButton key={name} size="small" aria-label={name} onClick={() => onSocial(name)} sx={{ color: olive }}><Icon fontSize="small" /></IconButton>)}
        </Stack>
      </Stack>

      {producto && <Paper component="section" aria-label="Especialidades destacadas" elevation={0} sx={{ borderRadius: 2, p: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ flex: '1 1 190px' }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: '0.15em' }}>De nuestra cocina</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Especialidades destacadas</Typography>
          <Button onClick={onSignature} size="small" sx={{ mt: 1 }}>Agregar el plato de la casa</Button>
        </Box>
        <Box component="img" src={producto.imagen} alt={producto.nombre} sx={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} />
        <Box sx={{ flex: '1 1 220px' }}>
          <Typography sx={{ fontWeight: 700 }}>{producto.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">{producto.variedad}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Maridaje: {producto.maridajeSugerido}</Typography>
          <Typography color="primary" sx={{ fontWeight: 700, mt: 1 }}>${producto.precio.toLocaleString('es-AR')} / {producto.unidad} · Stock: {producto.stock}</Typography>
        </Box>
        <Stack spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <IconButton aria-label="Especialidad anterior" onClick={onPrev}><ChevronLeftIcon /></IconButton>
            <IconButton aria-label="Reducir cantidad" disabled={cantidad <= 1 || agregado} onClick={() => onCantidad((n) => Math.max(1, n - 1))}><RemoveIcon fontSize="small" /></IconButton>
            <Typography sx={{ minWidth: 26, textAlign: 'center' }}>{cantidad}</Typography>
            <IconButton aria-label="Aumentar cantidad" disabled={cantidad >= producto.stock || agregado} onClick={() => onCantidad((n) => Math.min(producto.stock, n + 1))}><AddIcon fontSize="small" /></IconButton>
            <IconButton aria-label="Siguiente especialidad" onClick={onNext}><ChevronRightIcon /></IconButton>
          </Stack>
          <Button variant="contained" disabled={agregado || producto.stock < 1} onClick={onAdd}>{agregado ? '¡Agregado!' : `Agregar · $${(producto.precio * cantidad).toLocaleString('es-AR')}`}</Button>
        </Stack>
      </Paper>}
    </Box>
  );
}
