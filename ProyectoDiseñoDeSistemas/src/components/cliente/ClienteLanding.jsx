import { Box, Typography, Button, IconButton, Badge, Stack, Tooltip } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';
import pastaPrincipal from './pasta-principal.png';

// Colors belong to this restaurant illustration, independently of the ERP theme.
const olive = '#416522';
const tomato = '#c93600';
const script = '"Kristi", "Brush Script MT", cursive';

export default function ClienteLanding({ cartSummary, onCatalogo, onEvento, onAbout, onContact, onSocial }) {
  const { navigate } = useApp();
  const navStyle = { color: olive, fontSize: { xs: 11, lg: 13 }, fontWeight: 700, borderRadius: 8, px: { xs: 1.2, lg: 2 }, whiteSpace: 'nowrap' };
  return (
    <Box sx={{ bgcolor: '#ded0a8', p: { xs: 1.5, sm: 2.5, lg: 3 }, fontFamily: '"Montserrat", sans-serif' }}>
      <Box component="section" aria-label="Bienvenidos a PastaFab" sx={{ position: 'relative', isolation: 'isolate', bgcolor: '#fff', color: olive, boxShadow: '8px 12px 22px #51482d40', minHeight: { xs: 740, sm: 820, md: 640, lg: 610 }, aspectRatio: { md: '2629 / 1527' }, overflow: 'hidden', backgroundImage: { xs: 'none', md: 'url(/assets/landing-template-card.jpg)' }, backgroundSize: '100% 100%' }}>
        {/* Preserve the illustration; replace all template text with live content. */}
        <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', zIndex: -1, left: '48.5%', right: '13%', top: '17%', bottom: 0, bgcolor: '#fff' }} />
        <Box component="img" src={pastaPrincipal} alt="Pastas con espárragos, arvejas y salsa cremosa" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '7.8%', top: '18.8%', width: '41%', height: '70.5%', objectFit: 'cover', borderRadius: '50%', border: `4px solid ${tomato}` }} />
        <Box role="navigation" aria-label="Navegación del cliente" sx={{ position: 'relative', ml: { md: '25.8%' }, bgcolor: '#fff', minHeight: { md: 84, lg: 100 }, px: { xs: 1, lg: 3 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: 1 }}>
          <Button sx={{ ...navStyle, bgcolor: olive, color: '#fff', '&:hover': { bgcolor: '#325018' } }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
          <Button sx={navStyle} onClick={onCatalogo}>Productos</Button>
          <Tooltip title={`Ver carrito · $${cartSummary.totalPrice.toLocaleString('es-AR')}`}>
            <IconButton aria-label={`Carrito, ${cartSummary.totalItems} ítems`} onClick={() => navigate('carrito')} sx={{ color: olive }}><Badge badgeContent={cartSummary.totalItems} showZero sx={{ '& .MuiBadge-badge': { bgcolor: 'background.default', color: 'primary.main' } }}><ShoppingBagOutlinedIcon /></Badge></IconButton>
          </Tooltip>
          <ClientePerfilMenu />
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', py: { xs: 1.5, sm: 2 }, background: `linear-gradient(90deg, ${olive} 50%, #fff 50%)` }}>
          <Box component="img" src={pastaPrincipal} alt="Pastas con espárragos, arvejas y salsa cremosa" sx={{ width: '60%', maxWidth: { xs: 180, sm: 260 }, aspectRatio: '1', objectFit: 'cover', borderRadius: '50%', border: `3px solid ${tomato}` }} />
        </Box>
        <Box sx={{ position: { md: 'absolute' }, top: { md: '54.05%' }, transform: { md: 'translateY(-50%)' }, ml: { md: '49%' }, width: { md: '38%' }, display: { xs: 'flex', md: 'block' }, flexDirection: 'column', textAlign: 'center', px: { xs: 3, md: 1.5 }, pt: { xs: 1, md: 0 }, pb: { xs: 4, md: 0 } }}>
          <Typography component="h1" sx={{ order: 0, fontFamily: script, fontSize: { xs: 72, sm: 90, md: 84, lg: 134 }, lineHeight: 1.05, fontWeight: 400 }}>PastaFab</Typography>
          <Typography sx={{ order: 1, fontFamily: '"Montserrat", sans-serif', fontSize: { xs: 23, md: 24, lg: 31 }, fontWeight: 700, color: '#fff', WebkitTextStroke: `1px ${tomato}`, letterSpacing: '0.025em', lineHeight: 1.3, mt: 1 }}>PASTAS ARTESANALES</Typography>
          <Typography sx={{ order: 3, mt: 2, py: 0.5, bgcolor: '#eee3d7', color: '#5f574c', fontSize: { xs: 12, lg: 15 }, letterSpacing: '0.28em', clipPath: 'polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)' }}>HECHAS CON TRADICIÓN</Typography>
          <Typography sx={{ order: 3, fontFamily: script, fontSize: { xs: 43, md: 38, lg: 54 }, lineHeight: 1.2, mt: 2.5 }}>El sabor de lo nuestro</Typography>
          <Typography sx={{ order: 3, fontFamily: '"Montserrat", sans-serif', color: '#777467', fontSize: { xs: 13, lg: 14 }, lineHeight: 1.6, mt: 1, mb: 2.5 }}>Recetas de familia, ingredientes frescos y la pasión de siempre. Elegí tus pastas favoritas y llevá un pedacito de Italia a tu mesa.</Typography>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onCatalogo} sx={{ order: 2, alignSelf: 'center', mt: { xs: 2, md: 0 }, mb: { xs: 1, md: 0 }, bgcolor: tomato, color: '#fff', borderRadius: 20, py: 1.3, width: '90%', fontSize: 14, boxShadow: 'none', '&:hover': { bgcolor: '#a52e00' } }}>Hacer un pedido</Button>
          <Button size="small" onClick={onEvento} sx={{ order: 3, color: olive, mt: 1.2, fontSize: 11, textTransform: 'none' }}>¿Pedido mayorista? Cotizá tus productos</Button>
        </Box>
      </Box>

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: 2, pt: 1.5, pb: 1, color: olive, width: '100%' }}>
        <Typography sx={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 700, whiteSpace: 'nowrap' }}>FRESCAS CADA DÍA · HECHAS A MANO</Typography>
        <Typography variant="caption" sx={{ color: olive, fontWeight: 600, whiteSpace: 'nowrap', textAlign: 'center' }}>PastaFab · Pastas artesanales</Typography>
        <Stack direction="row" alignItems="center" gap={1} sx={{ flexWrap: 'nowrap' }}>
          <Button onClick={onAbout} size="small" sx={{ color: olive, textTransform: 'none', minWidth: 'auto', px: 1 }}>Nosotros</Button>
          <Button onClick={onContact} size="small" sx={{ color: olive, textTransform: 'none', minWidth: 'auto', px: 1 }}>Contacto</Button>
          {[[InstagramIcon, 'Instagram'], [FacebookIcon, 'Facebook'], [WhatsAppIcon, 'WhatsApp']].map(([Icon, name]) => <IconButton key={name} size="small" aria-label={name} onClick={() => onSocial(name)} sx={{ color: olive, p: 0.5 }}><Icon fontSize="small" /></IconButton>)}
        </Stack>
      </Stack>


    </Box>
  );
}
