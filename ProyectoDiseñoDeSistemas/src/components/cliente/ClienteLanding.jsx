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
  const navStyle = {
    color: olive,
    fontSize: { xs: 11, sm: 12, lg: 13 },
    fontWeight: 700,
    borderRadius: 8,
    px: { xs: 1, sm: 1.5, lg: 2 },
    whiteSpace: 'nowrap',
  };

  return (
    <Box
      sx={{
        bgcolor: '#ded0a8',
        height: '100vh',
        maxHeight: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      <Box
        component="section"
        aria-label="Bienvenidos a PastaFab"
        sx={{
          position: 'relative',
          isolation: 'isolate',
          bgcolor: '#fff',
          color: olive,
          boxShadow: '8px 12px 22px #51482d40',
          flex: 1,
          minHeight: 0,
          width: '100%',
          aspectRatio: { md: '2629 / 1527' },
          maxHeight: { xs: 'calc(100vh - 60px)', md: 'calc(100vh - 68px)', lg: 'calc(100vh - 76px)' },
          maxWidth: { md: 'calc((100vh - 76px) * (2629 / 1527))', xs: '100%' },
          mx: 'auto',
          borderRadius: { xs: 2.5, md: 3 },
          overflow: 'hidden',
          backgroundImage: { xs: 'none', md: 'url(/assets/landing-template-card.jpg)' },
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'space-between', md: 'initial' },
        }}
      >
        {/* Desktop-only template patches and hero image */}
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            zIndex: -1,
            left: '48.5%',
            right: '13%',
            top: '17%',
            bottom: 0,
            bgcolor: '#fff',
          }}
        />
        <Box
          component="img"
          src={pastaPrincipal}
          alt="Pastas con espárragos, arvejas y salsa cremosa"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            left: '7.8%',
            top: '18.8%',
            width: '41%',
            height: '70.5%',
            objectFit: 'cover',
            borderRadius: '50%',
            border: `4px solid ${tomato}`,
          }}
        />

        {/* Barra superior de navegación */}
        <Box
          role="navigation"
          aria-label="Navegación del cliente"
          sx={{
            position: 'relative',
            ml: { md: '25.8%' },
            bgcolor: '#fff',
            minHeight: { xs: 44, md: 54, lg: 66 },
            px: { xs: 1.5, sm: 2, md: 3, lg: 5 },
            py: { xs: 0.5, md: 0.8 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            borderBottom: { xs: '1px solid #f2ebe1', md: 'none' },
            zIndex: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 1, md: 2, lg: 3 }}
            alignItems="center"
            sx={{ flex: 1, justifyContent: { xs: 'flex-start', md: 'center' } }}
          >
            <Button
              sx={{
                ...navStyle,
                bgcolor: olive,
                color: '#fff',
                px: { xs: 1.2, sm: 1.8, md: 2.2 },
                py: { xs: 0.4, md: 0.6 },
                borderRadius: 20,
                '&:hover': { bgcolor: '#325018' },
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Inicio
            </Button>
            <Button
              sx={{
                ...navStyle,
                color: olive,
                px: { xs: 1.2, sm: 1.8, md: 2.2 },
                py: { xs: 0.4, md: 0.6 },
                borderRadius: 20,
                '&:hover': { bgcolor: 'rgba(65, 101, 34, 0.08)' },
              }}
              onClick={onCatalogo}
            >
              Productos
            </Button>
            <Button
              sx={{
                ...navStyle,
                color: olive,
                px: { xs: 0.8, sm: 1.5, md: 2.2 },
                py: { xs: 0.4, md: 0.6 },
                borderRadius: 20,
                '&:hover': { bgcolor: 'rgba(65, 101, 34, 0.08)' },
              }}
              onClick={onAbout}
            >
              Nosotros
            </Button>
            <Button
              sx={{
                ...navStyle,
                color: olive,
                px: { xs: 0.8, sm: 1.5, md: 2.2 },
                py: { xs: 0.4, md: 0.6 },
                borderRadius: 20,
                '&:hover': { bgcolor: 'rgba(65, 101, 34, 0.08)' },
              }}
              onClick={onContact}
            >
              Contacto
            </Button>
          </Stack>
          <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">
            <Tooltip title={`Ver carrito · $${cartSummary.totalPrice.toLocaleString('es-AR')}`}>
              <IconButton
                aria-label={`Carrito, ${cartSummary.totalItems} ítems`}
                onClick={() => navigate('carrito')}
                sx={{
                  color: olive,
                  p: { xs: 0.8, md: 1 },
                  '&:hover': { bgcolor: 'rgba(65, 101, 34, 0.08)' },
                }}
              >
                <Badge
                  badgeContent={cartSummary.totalItems}
                  showZero
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: 'background.default',
                      color: 'primary.main',
                      fontWeight: 700,
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
            <ClientePerfilMenu />
          </Stack>
        </Box>

        {/* Imagen destacada en mobile (centrada, armoniosa y con anillo sutil) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            alignItems: 'center',
            py: { xs: 0.8, sm: 1.2 },
            position: 'relative',
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              width: 'clamp(120px, 20vh, 160px)',
              height: 'clamp(120px, 20vh, 160px)',
              borderRadius: '50%',
              bgcolor: '#f7f1e8',
              border: `1.5px dashed ${olive}35`,
              zIndex: 0,
            }}
          />
          <Box
            component="img"
            src={pastaPrincipal}
            alt="Pastas artesanales PastaFab"
            sx={{
              width: 'clamp(105px, 18vh, 145px)',
              height: 'clamp(105px, 18vh, 145px)',
              objectFit: 'cover',
              borderRadius: '50%',
              border: `3px solid ${tomato}`,
              boxShadow: '0 6px 20px rgba(65, 101, 34, 0.2)',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Columna de contenidos y llamadas a la acción */}
        <Box
          sx={{
            position: { md: 'absolute' },
            top: { md: '53.5%' },
            transform: { md: 'translateY(-50%)' },
            ml: { md: '49%' },
            width: { md: '38%', xs: '100%' },
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 1.5 },
            pt: { xs: 0, md: 0 },
            pb: { xs: 1.2, sm: 1.5, md: 0 },
            flex: { xs: 1, md: 'none' },
            justifyContent: { xs: 'space-evenly', md: 'initial' },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: script,
              fontSize: { xs: 'clamp(36px, 5.5vh, 48px)', sm: 54, md: 'clamp(42px, 4.8vw, 68px)', lg: 'clamp(52px, 6vh, 88px)' },
              lineHeight: 1,
              fontWeight: 400,
              color: olive,
            }}
          >
            PastaFab
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              fontSize: { xs: 13, sm: 15, md: 'clamp(14px, 1.5vw, 20px)' },
              fontWeight: 800,
              color: { xs: tomato, md: '#fff' },
              WebkitTextStroke: { xs: 'none', md: `1px ${tomato}` },
              letterSpacing: '0.06em',
              lineHeight: 1.2,
              mt: { xs: 0.2, md: 0.4 },
            }}
          >
            PASTAS ARTESANALES
          </Typography>

          <Typography
            sx={{
              mt: { xs: 0.3, md: 0.8 },
              py: { xs: 0.2, md: 0.3 },
              px: { xs: 1.5, md: 1 },
              bgcolor: '#eee3d7',
              color: '#5f574c',
              fontSize: { xs: 8.5, sm: 9.5, lg: 12 },
              fontWeight: 700,
              letterSpacing: { xs: '0.18em', md: '0.24em' },
              borderRadius: { xs: 1, md: 0 },
              clipPath: { xs: 'none', md: 'polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)' },
              width: 'fit-content',
            }}
          >
            HECHAS CON TRADICIÓN
          </Typography>

          <Typography
            sx={{
              fontFamily: script,
              fontSize: { xs: 'clamp(20px, 3vh, 26px)', sm: 28, md: 'clamp(22px, 2.5vw, 36px)', lg: 'clamp(28px, 3.4vh, 44px)' },
              lineHeight: 1.1,
              mt: { xs: 0.3, md: 0.8 },
              color: olive,
            }}
          >
            El sabor de lo nuestro
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              color: '#777467',
              fontSize: { xs: 'clamp(10px, 1.3vh, 11.5px)', sm: 11.5, md: 'clamp(10px, 1.1vh, 12px)' },
              lineHeight: { xs: 1.35, md: 1.4 },
              mt: { xs: 0.2, md: 0.4 },
              mb: { xs: 0.6, md: 1.2 },
              maxWidth: { xs: 320, md: '100%' },
            }}
          >
            Recetas de familia, ingredientes frescos y la pasión de siempre. Llevá un pedacito de Italia a tu mesa.
          </Typography>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            onClick={onCatalogo}
            sx={{
              alignSelf: 'center',
              bgcolor: tomato,
              color: '#fff',
              borderRadius: 20,
              py: { xs: 0.65, md: 0.9 },
              width: { xs: '92%', sm: '80%', md: '90%' },
              fontSize: { xs: 12.5, md: 13.5 },
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(201, 54, 0, 0.3)',
              '&:hover': { bgcolor: '#a52e00', boxShadow: '0 6px 18px rgba(201, 54, 0, 0.4)' },
            }}
          >
            Hacer un pedido
          </Button>

          <Button
            size="small"
            onClick={onEvento}
            sx={{
              color: olive,
              mt: { xs: 0.3, md: 0.4 },
              fontSize: { xs: 10, md: 11 },
              fontWeight: 600,
              textTransform: 'none',
              py: 0.2,
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            ¿Pedido mayorista? Cotizá tus productos
          </Button>
        </Box>
      </Box>

      {/* Barra inferior responsive */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 0.3, sm: 1 },
          pt: { xs: 0.4, md: 0.8 },
          pb: { xs: 0.4, md: 0.6 },
          px: 1,
          color: olive,
          minHeight: { xs: 36, md: 34 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 8.5, sm: 10, md: 11 },
            letterSpacing: '0.12em',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            opacity: { xs: 0.9, sm: 1 },
          }}
        >
          FRESCAS CADA DÍA · HECHAS A MANO
        </Typography>
        <Stack direction="row" alignItems="center" gap={{ xs: 0.5, md: 1 }}>
          {[[InstagramIcon, 'Instagram'], [FacebookIcon, 'Facebook'], [WhatsAppIcon, 'WhatsApp']].map(([Icon, name]) => (
            <IconButton key={name} size="small" aria-label={name} onClick={() => onSocial(name)} sx={{ color: olive, p: 0.4 }}>
              <Icon sx={{ fontSize: { xs: 15, md: 18 } }} />
            </IconButton>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
