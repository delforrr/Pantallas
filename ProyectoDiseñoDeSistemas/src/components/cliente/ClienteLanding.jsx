import { Box, Typography, Button, IconButton, Badge, Stack, Tooltip } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useApp } from '../../context/AppContext';
import ClientePerfilMenu from './ClientePerfilMenu';
import pastaPrincipal from './pasta-principal.png';
import ingredientesPattern from './ingredientes-pattern.svg';
import ingredientesPatternRed from './ingredientes-pattern-red.svg';

// Colors belong to this restaurant illustration, independently of the ERP theme.
const olive = '#416522';
const tomato = '#c93600';
const script = '"Kristi", "Brush Script MT", cursive';

export default function ClienteLanding({ cartSummary, onCatalogo, onEvento, onAbout, onContact, onSocial }) {
  const { navigate } = useApp();
  const navStyle = { color: olive, fontSize: { xs: 11, lg: 12 }, fontWeight: 700, borderRadius: 8, px: { xs: 1.2, lg: 1.8 }, whiteSpace: 'nowrap' };
  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', fontFamily: '"Montserrat", sans-serif', position: 'relative', overflowX: 'hidden' }}>
      <Box component="section" aria-label="Bienvenidos a PastaFab" sx={{ position: 'relative', bgcolor: '#fff', color: olive, width: '100%', height: { xs: 'auto', md: '100vh' }, minHeight: { xs: '100vh', md: '100vh' }, overflowY: { xs: 'auto', md: 'hidden' }, overflowX: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: { xs: 'space-between', md: 'initial' } }}>
        {/* Parte verde a la izquierda con patrón de ilustraciones de ingredientes */}
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: { md: '26%', lg: '25%' },
            bgcolor: olive,
            backgroundImage: `url("${ingredientesPattern}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: { md: '300px', lg: '340px' },
            zIndex: 0,
          }}
        />

        {/* Franja derecha: fondo blanco con dibujos de ingredientes en color rojo */}
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: { md: '18%', lg: '19%' },
            bgcolor: '#fff',
            backgroundImage: `url("${ingredientesPatternRed}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: { md: '300px', lg: '340px' },
            zIndex: 0,
          }}
        />

        {/* Círculo de pasta sin ninguna imagen de fondo que se superponga (Desktop) */}
        <Box
          component="img"
          src={pastaPrincipal}
          alt="Pastas con espárragos, arvejas y salsa cremosa"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            left: { md: '6%', lg: '7%' },
            top: '50%',
            transform: 'translateY(-50%)',
            height: { md: '64vh', lg: '68vh' },
            maxHeight: { md: 'calc(100vh - 140px)' },
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: '50%',
            border: `5px solid ${tomato}`,
            boxShadow: '0 10px 32px rgba(0,0,0,0.22)',
            zIndex: 2,
          }}
        />

        {/* Navegación superior */}
        <Box
          role="navigation"
          aria-label="Navegación del cliente"
          sx={{
            position: 'relative',
            zIndex: 3,
            ml: { md: '34%' },
            mr: { md: '19%' },
            bgcolor: 'transparent',
            minHeight: { xs: 56, md: 66, lg: 76 },
            px: { xs: 1.5, sm: 2, lg: 2.5 },
            py: { xs: 0.8, md: 1 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'space-evenly' },
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Button sx={{ ...navStyle, bgcolor: olive, color: '#fff', '&:hover': { bgcolor: '#325018' } }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Button>
          <Button sx={navStyle} onClick={onCatalogo}>Productos</Button>
          <Tooltip title={`Ver carrito · $${cartSummary.totalPrice.toLocaleString('es-AR')}`}>
            <IconButton aria-label={`Carrito, ${cartSummary.totalItems} ítems`} onClick={() => navigate('carrito')} sx={{ color: olive }}><Badge badgeContent={cartSummary.totalItems} showZero sx={{ '& .MuiBadge-badge': { bgcolor: 'background.default', color: 'primary.main' } }}><ShoppingBagOutlinedIcon fontSize="small" /></Badge></IconButton>
          </Tooltip>
          <ClientePerfilMenu />
        </Box>

        {/* Versión móvil del plato destacado con fondo dividido verde (izq) y blanco/rojo (der) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            alignItems: 'center',
            py: { xs: 2.2, sm: 2.8 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Mitad izquierda: verde con patrón de ingredientes */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '50%',
              bgcolor: olive,
              backgroundImage: `url("${ingredientesPattern}")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '160px',
              zIndex: 0,
            }}
          />

          {/* Mitad derecha: blanca con patrón de dibujos rojos */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '50%',
              bgcolor: '#fff',
              backgroundImage: `url("${ingredientesPatternRed}")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '160px',
              zIndex: 0,
            }}
          />

          {/* Plato centrado exactamente sobre la unión de ambas mitades */}
          <Box
            component="img"
            src={pastaPrincipal}
            alt="Pastas con espárragos, arvejas y salsa cremosa"
            sx={{
              width: '58%',
              maxWidth: { xs: 190, sm: 250 },
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: '50%',
              border: `4px solid ${tomato}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Contenido / Textos y CTA */}
        <Box
          sx={{
            position: { md: 'absolute' },
            top: { md: '52%' },
            transform: { md: 'translateY(-50%)' },
            ml: { md: '43%', lg: '44%' },
            width: { md: '38%', lg: '36%' },
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            px: { xs: 2.5, sm: 4, md: 1 },
            pt: { xs: 0.5, md: 0 },
            pb: { xs: 3, md: 0 },
            zIndex: 2,
          }}
        >
          <Typography component="h1" sx={{ fontFamily: script, fontSize: { xs: 52, sm: 68, md: 74, lg: 108 }, lineHeight: 1, fontWeight: 400 }}>PastaFab</Typography>
          <Typography sx={{ fontFamily: '"Montserrat", sans-serif', fontSize: { xs: 16, sm: 18, md: 20, lg: 25 }, fontWeight: 800, color: '#fff', WebkitTextStroke: `1px ${tomato}`, letterSpacing: '0.04em', lineHeight: 1.25, mt: 0.5 }}>PASTAS ARTESANALES</Typography>
          <Typography sx={{ mt: { xs: 1, md: 1.5 }, py: 0.4, px: 2, bgcolor: '#eee3d7', color: '#5f574c', fontSize: { xs: 9.5, sm: 11, lg: 13 }, letterSpacing: { xs: '0.18em', md: '0.24em' }, clipPath: 'polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)', alignSelf: 'center' }}>HECHAS CON TRADICIÓN</Typography>
          <Typography sx={{ fontFamily: script, fontSize: { xs: 28, sm: 32, md: 32, lg: 44 }, lineHeight: 1.15, mt: { xs: 1.2, md: 1.8 } }}>El sabor de lo nuestro</Typography>
          <Typography sx={{ fontFamily: '"Montserrat", sans-serif', color: '#777467', fontSize: { xs: 11.5, sm: 12, lg: 12.5 }, lineHeight: 1.45, mt: 0.6, mb: { xs: 1.8, md: 1.8 }, maxWidth: { xs: 340, sm: 440, md: '100%' }, mx: 'auto' }}>Recetas de familia, ingredientes frescos y la pasión de siempre. Elegí tus pastas favoritas y llevá un pedacito de Italia a tu mesa.</Typography>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onCatalogo} sx={{ alignSelf: 'center', mt: { xs: 0.5, md: 0 }, mb: { xs: 0.5, md: 0 }, bgcolor: tomato, color: '#fff', borderRadius: 20, py: { xs: 1.1, md: 1 }, width: { xs: '100%', sm: '85%', md: '88%' }, maxWidth: 360, fontSize: { xs: 13.5, md: 13 }, fontWeight: 700, boxShadow: '0 4px 14px rgba(201, 54, 0, 0.3)', '&:hover': { bgcolor: '#a52e00' } }}>Hacer un pedido</Button>
          <Button size="small" onClick={onEvento} sx={{ color: olive, mt: 0.8, fontSize: { xs: 11, md: 10.5 }, textTransform: 'none' }}>¿Pedido mayorista? Cotizá tus productos</Button>
        </Box>

        {/* Footer responsive */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            position: { xs: 'relative', md: 'absolute' },
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 2 },
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, md: 1 },
            color: olive,
            bgcolor: { xs: '#fcfbf8', md: 'rgba(255,255,255,0.92)' },
            borderTop: '1px solid rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: { xs: 9.5, sm: 11 }, letterSpacing: '0.12em', fontWeight: 700, whiteSpace: 'nowrap' }}>
            FRESCAS CADA DÍA · HECHAS A MANO
          </Typography>
          <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' }, color: olive, fontWeight: 600, whiteSpace: 'nowrap', textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            PastaFab · Pastas artesanales
          </Typography>
          <Stack direction="row" alignItems="center" gap={0.5} sx={{ flexWrap: 'nowrap' }}>
            <Button onClick={onAbout} size="small" sx={{ color: olive, textTransform: 'none', minWidth: 'auto', px: 1, fontSize: 12 }}>Nosotros</Button>
            <Button onClick={onContact} size="small" sx={{ color: olive, textTransform: 'none', minWidth: 'auto', px: 1, fontSize: 12 }}>Contacto</Button>
            {[[InstagramIcon, 'Instagram'], [FacebookIcon, 'Facebook'], [WhatsAppIcon, 'WhatsApp']].map(([Icon, name]) => (
              <IconButton key={name} size="small" aria-label={name} onClick={() => onSocial(name)} sx={{ color: olive, p: 0.5 }}>
                <Icon sx={{ fontSize: 18 }} />
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
