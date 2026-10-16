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
    <Box sx={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', bgcolor: '#ded0a8', px: { xs: 1.5, md: 5 }, pt: { xs: 1.5, md: 2.5 }, fontFamily: '"Montserrat", sans-serif',
      '@media (max-width: 899px) and (max-height: 700px)': {
        p: 1,
        '& > section': { minHeight: 0 },
        '& [role="navigation"]': { py: 0.5 },
        '& [data-landing-photo]': { py: 0.5 },
        '& [data-landing-photo] img': { maxWidth: 'min(100px, 18dvh)' },
        '& [data-landing-content]': { px: 2, pt: 0, pb: 1 },
        '& h1': { fontSize: 52 },
        '& [data-landing-subtitle]': { fontSize: 18, mt: 0.5 },
        '& [data-landing-tradicion]': { fontSize: 9, mt: 1, py: 0.25, letterSpacing: '0.12em' },
        '& [data-landing-sabor]': { fontSize: 30, mt: 1 },
        '& [data-landing-description]': { fontSize: 11, lineHeight: 1.4, mt: 0.5, mb: 1 },
        '& [data-landing-pedido]': { fontSize: 12, mt: 1, mb: 0.5, py: 0.75, minHeight: 36 },
        '& [data-landing-mayorista]': { fontSize: 9, mt: 0.5 },
        '& [data-landing-links]': { pt: 1, pb: 1, gap: 0.5 },
        '& [data-landing-links] > p': { fontSize: 9 },
      },
      '@media (max-width: 899px) and (max-height: 500px) and (orientation: landscape)': {
        '& > section': { display: 'grid', gridTemplateColumns: '38% 62%', gridTemplateRows: '48px minmax(0, 1fr)' },
        '& [role="navigation"]': { gridColumn: '1 / -1' },
        '& [data-landing-photo]': { gridColumn: 1, gridRow: 2, alignItems: 'center', py: 1, background: olive },
        '& [data-landing-photo] img': { maxWidth: 'min(200px, 50dvh)', width: '85%' },
        '& [data-landing-content]': { gridColumn: 2, gridRow: 2, justifyContent: 'center', px: 2, py: 0 },
        '& h1': { fontSize: 44 },
        '& [data-landing-subtitle]': { fontSize: 14, mt: 0.25 },
        '& [data-landing-tradicion]': { fontSize: 8, mt: 0.5 },
        '& [data-landing-sabor]': { fontSize: 24, mt: 0.5 },
        '& [data-landing-description]': { fontSize: 10, lineHeight: 1.3, mt: 0.25, mb: 0.5 },
        '& [data-landing-pedido]': { fontSize: 11, mt: 0.5, py: 0.5, minHeight: 32 },
        '& [data-landing-mayorista]': { fontSize: 8, mt: 0, minHeight: 24 },
      },
    }}>
      <Box component="section" aria-label="Bienvenidos a PastaFab" sx={{ position: 'relative', isolation: 'isolate', containerType: 'size', '--art-width': 'max(100cqw, calc(100cqh * 2629 / 1527))', '--art-height': 'calc(var(--art-width) * 1527 / 2629)', bgcolor: '#fff', color: olive, boxShadow: '8px 12px 22px #51482d40', flex: 1, minHeight: 0, overflow: 'hidden', backgroundImage: { xs: 'none', md: 'url(/assets/landing-template-card.jpg)' }, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Preserve the illustration; replace all template text with live content. */}
        <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', zIndex: -1, left: 'calc(50% - var(--art-width) * 0.015)', right: 'calc(50% - var(--art-width) * 0.37)', top: 'calc(50% - var(--art-height) * 0.33)', bottom: 0, bgcolor: '#fff' }} />
        <Box component="img" src={pastaPrincipal} alt="Pastas con espárragos, arvejas y salsa cremosa" sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: 'calc(50% - var(--art-width) * 0.422)', top: 'calc(50% - var(--art-height) * 0.312)', width: 'calc(var(--art-width) * 0.41)', height: 'auto', aspectRatio: '1', objectFit: 'cover', borderRadius: '50%', border: `4px solid ${tomato}` }} />
        <Box role="navigation" aria-label="Navegación del cliente" sx={{ position: 'relative', ml: { md: '25.8%' }, bgcolor: '#fff', minHeight: { md: 84, lg: 100 }, px: { xs: 1, lg: 3 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: 1 }}>
          <Button sx={{ ...navStyle, bgcolor: olive, color: '#fff', '&:hover': { bgcolor: '#325018' } }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
          <Button sx={navStyle} onClick={onCatalogo}>Productos</Button>
          <Tooltip title={`Ver carrito · $${cartSummary.totalPrice.toLocaleString('es-AR')}`}>
            <IconButton aria-label={`Carrito, ${cartSummary.totalItems} ítems`} onClick={() => navigate('carrito')} sx={{ color: olive }}><Badge badgeContent={cartSummary.totalItems} showZero sx={{ '& .MuiBadge-badge': { bgcolor: 'background.default', color: 'primary.main' } }}><ShoppingBagOutlinedIcon /></Badge></IconButton>
          </Tooltip>
          <ClientePerfilMenu />
        </Box>
        <Box data-landing-photo sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', py: { xs: 1.5, sm: 2 }, background: `linear-gradient(90deg, ${olive} 50%, #fff 50%)` }}>
          <Box component="img" src={pastaPrincipal} alt="Pastas con espárragos, arvejas y salsa cremosa" sx={{ width: '60%', maxWidth: { xs: 'min(180px, 20dvh)', sm: 'min(260px, 24dvh)' }, aspectRatio: '1', objectFit: 'cover', borderRadius: '50%', border: `3px solid ${tomato}` }} />
        </Box>
        <Box data-landing-content sx={{ position: { md: 'absolute' }, top: { md: '54.05%' }, transform: { md: 'translateY(-50%)' }, ml: { md: '49%' }, width: { md: '38%' }, display: { xs: 'flex', md: 'block' }, flexDirection: 'column', textAlign: 'center', px: { xs: 3, md: 1.5 }, pt: { xs: 1, md: 0 }, pb: { xs: 2, md: 0 } }}>
          <Typography component="h1" sx={{ order: 0, fontFamily: script, fontSize: { xs: 72, sm: 90, md: 84, lg: 134 }, lineHeight: 1.05, fontWeight: 400 }}>PastaFab</Typography>
          <Typography data-landing-subtitle sx={{ order: 1, fontFamily: '"Montserrat", sans-serif', fontSize: { xs: 23, md: 24, lg: 31 }, fontWeight: 700, color: '#fff', WebkitTextStroke: `1px ${tomato}`, letterSpacing: '0.025em', lineHeight: 1.3, mt: 1 }}>PASTAS ARTESANALES</Typography>
          <Typography data-landing-tradicion sx={{ order: 3, mt: 2, py: 0.5, bgcolor: '#eee3d7', color: '#5f574c', fontSize: { xs: 12, lg: 15 }, letterSpacing: '0.28em', clipPath: 'polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)' }}>HECHAS CON TRADICIÓN</Typography>
          <Typography data-landing-sabor sx={{ order: 3, fontFamily: script, fontSize: { xs: 43, md: 38, lg: 54 }, lineHeight: 1.2, mt: 2.5 }}>El sabor de lo nuestro</Typography>
          <Typography data-landing-description sx={{ order: 3, fontFamily: '"Montserrat", sans-serif', color: '#777467', fontSize: { xs: 13, lg: 14 }, lineHeight: 1.6, mt: 1, mb: 2.5 }}>Recetas de familia, ingredientes frescos y la pasión de siempre. Elegí tus pastas favoritas y llevá un pedacito de Italia a tu mesa.</Typography>
          <Button data-landing-pedido variant="contained" endIcon={<ArrowForwardIcon />} onClick={onCatalogo} sx={{ order: 2, alignSelf: 'center', mt: { xs: 2, md: 0 }, mb: { xs: 1, md: 0 }, bgcolor: tomato, color: '#fff', borderRadius: 20, py: 1.3, width: '90%', fontSize: 14, boxShadow: 'none', '&:hover': { bgcolor: '#a52e00' } }}>Hacer un pedido</Button>
          <Button data-landing-mayorista size="small" onClick={onEvento} sx={{ order: 3, color: olive, mt: 1.2, fontSize: 11, textTransform: 'none' }}>¿Pedido mayorista? Cotizá tus productos</Button>
        </Box>
      </Box>

      <Stack data-landing-links direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, flexShrink: 0, py: 1.5, color: olive }}>
        <Typography sx={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 700 }}>FRESCAS CADA DÍA · HECHAS A MANO</Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          <Button onClick={onAbout} size="small" sx={{ color: olive, textTransform: 'none' }}>Nosotros</Button>
          <Button onClick={onContact} size="small" sx={{ color: olive, textTransform: 'none' }}>Contacto</Button>
          {[[InstagramIcon, 'Instagram'], [FacebookIcon, 'Facebook'], [WhatsAppIcon, 'WhatsApp']].map(([Icon, name]) => <IconButton key={name} size="small" aria-label={name} onClick={() => onSocial(name)} sx={{ color: olive }}><Icon fontSize="small" /></IconButton>)}
        </Stack>
      </Stack>


    </Box>
  );
}
