import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Stack,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const ESTADO_OP_COLORS = {
  Planificada: 'default',
  'En Proceso': 'primary',
  Finalizada: 'success',
  Cancelada: 'default',
};

export const OrdenProduccionCard = ({
  orden,
  onViewDetail,
  onCambiarEstado,
  onGenerarSolicitudCompra,
  onEdit,
}) => {
  if (!orden) return null;

  const esFaltante = orden.estadoInsumos === 'Faltante';

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 410,
        minHeight: 410,
        maxHeight: 410,
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 6px 20px rgba(0,0,0,0.4)'
              : '0 6px 20px rgba(0,0,0,0.08)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          '&:last-child': { pb: 2.5 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* Slot 1: Header (OP, Pedido, Título a 2 líneas fijas, Estado) */}
        <Box sx={{ height: 62, minHeight: 62, maxHeight: 62, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, mr: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5, flexWrap: 'nowrap' }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.02em' }}>
                {orden.numero}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                •
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, bgcolor: 'action.hover', px: 0.8, py: 0.2, borderRadius: '6px' }}>
                NP: {orden.notaPedidoId}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.02rem',
                lineHeight: 1.25,
                mt: 0.3,
                height: 42,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {orden.items && orden.items.length > 0
                ? orden.items.length === 1
                  ? orden.items[0].productoNombre
                  : `${orden.items[0].productoNombre} (+${orden.items.length - 1} más)`
                : orden.productoNombre}
            </Typography>
          </Box>
          <Chip
            size="small"
            icon={
              orden.estado === 'Finalizada' ? (
                <CheckCircleIcon style={{ fontSize: 16 }} />
              ) : orden.estado === 'Cancelada' ? (
                <CancelIcon style={{ fontSize: 16 }} />
              ) : undefined
            }
            label={orden.estado}
            color={ESTADO_OP_COLORS[orden.estado] || 'default'}
            variant={orden.estado === 'Finalizada' || orden.estado === 'Cancelada' ? 'outlined' : 'filled'}
            sx={{ fontWeight: 600, fontSize: '0.74rem', flexShrink: 0 }}
          />
        </Box>

        {/* Slot 2: Volumen en Kg y Chips de productos */}
        <Box sx={{ height: 56, minHeight: 56, maxHeight: 56, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
              {orden.cantidadKilos}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              kg en total ({orden.items?.length || 1} {orden.items?.length === 1 ? 'producto' : 'productos'})
            </Typography>
          </Box>
          <Box sx={{ height: 24, display: 'flex', flexWrap: 'nowrap', gap: 0.5, alignItems: 'center', overflow: 'hidden' }}>
            {orden.items && orden.items.length > 1 ? (
              orden.items.slice(0, 2).map((it, idx) => (
                <Chip
                  key={idx}
                  size="small"
                  variant="outlined"
                  label={`${it.productoNombre.split(' ')[0]}: ${it.cantidadKilos}kg`}
                  sx={{ fontSize: '0.7rem', height: 22, flexShrink: 0 }}
                />
              ))
            ) : (
              <Chip
                size="small"
                variant="outlined"
                label={`Receta: ${orden.items?.[0]?.categoria || 'Pastas'}`}
                sx={{ fontSize: '0.7rem', height: 22, opacity: 0.7, flexShrink: 0 }}
              />
            )}
            {orden.items && orden.items.length > 2 && (
              <Chip
                size="small"
                label={`+${orden.items.length - 2}`}
                sx={{ fontSize: '0.7rem', height: 22, bgcolor: 'action.selected', flexShrink: 0 }}
              />
            )}
          </Box>
        </Box>

        {/* Slot 3: Estado de Insumos */}
        <Box sx={{ height: 40, minHeight: 40, maxHeight: 40, mb: 1.5, display: 'flex', alignItems: 'center' }}>
          {esFaltante ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(237, 108, 2, 0.12)' : '#FFF8E1'),
                color: 'warning.dark',
                px: 1.2,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                boxSizing: 'border-box',
                height: 40,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, overflow: 'hidden' }}>
                <WarningAmberIcon fontSize="small" color="warning" sx={{ flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }} noWrap>
                  Falta insumo ({orden.proveedorSugerido?.split(' ')?.[0] || 'Local'})
                </Typography>
              </Box>
              {orden.solicitudCompraGenerada ? (
                <Chip size="small" color="info" label="OC Solicitada" sx={{ fontSize: '0.68rem', height: 20, flexShrink: 0 }} />
              ) : (
                <Tooltip title="Generar Solicitud de Compra a Proveedor Local">
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => onGenerarSolicitudCompra && onGenerarSolicitudCompra(orden)}
                    sx={{ p: 0.3, flexShrink: 0 }}
                  >
                    <ShoppingCartCheckoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.12)' : '#E8F5E9'),
                color: 'success.dark',
                px: 1.2,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                height: 40,
                boxSizing: 'border-box',
              }}
            >
              <CheckCircleIcon fontSize="small" color="success" sx={{ flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }} noWrap>
                Insumos disponibles en almacén
              </Typography>
            </Box>
          )}
        </Box>

        {/* Slot 4: Información de Planificación */}
        <Stack spacing={0.5} sx={{ height: 88, minHeight: 88, maxHeight: 88, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <CalendarMonthIcon fontSize="inherit" sx={{ fontSize: 16, flexShrink: 0 }} />
            <Typography variant="caption" noWrap>
              {orden.fechaInicio && orden.fechaFin && orden.fechaInicio !== orden.fechaFin
                ? `Inicio: ${orden.fechaInicio} • Fin: ${orden.fechaFin}`
                : `Fecha: ${orden.fechaInicio || orden.fechaProgramada}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <AccessTimeIcon fontSize="inherit" sx={{ fontSize: 16, flexShrink: 0 }} />
            <Typography variant="caption" noWrap>{orden.turno}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <PersonIcon fontSize="inherit" sx={{ fontSize: 16, flexShrink: 0 }} />
            <Typography variant="caption" noWrap>{orden.responsable}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <PrecisionManufacturingIcon fontSize="inherit" sx={{ fontSize: 16, flexShrink: 0 }} />
            <Typography variant="caption" noWrap title={orden.maquinariaProduccion?.map((m) => `${m.codigo}: ${m.descripcion}`).join(' • ') || orden.maquinaNombre}>
              Máquinas ({orden.maquinariaProduccion?.length || 1}): <strong>{orden.maquinariaProduccion && orden.maquinariaProduccion.length > 0 ? orden.maquinariaProduccion.map((m) => m.codigo || m.descripcion).join(', ') : orden.maquinaNombre || 'Sin asignar'}</strong>
            </Typography>
          </Box>
        </Stack>

        {/* Slot 5: Divider y Botones de acción anclados al fondo */}
        <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, height: 36, minHeight: 36 }}>
            <Button
              size="small"
              variant="text"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => onViewDetail(orden)}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
            >
              Nota Insumos
            </Button>

            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {onEdit && orden.estado === 'Planificada' && (
                <Tooltip title="Editar Orden">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(orden)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {orden.estado === 'Planificada' && (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => onCambiarEstado(orden.id, 'En Proceso')}
                  sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
                >
                  Iniciar
                </Button>
              )}
              {orden.estado === 'En Proceso' && (
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<DoneAllIcon />}
                  onClick={() => onCambiarEstado(orden.id, 'Finalizada')}
                  sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
                >
                  Finalizar
                </Button>
              )}
              {orden.estado === 'Planificada' && (
                <Tooltip title="Cancelar Orden">
                  <IconButton
                    size="small"
                    color="default"
                    onClick={() => onCambiarEstado(orden.id, 'Cancelada')}
                    sx={{ color: 'text.secondary' }}
                  >
                    <BlockIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrdenProduccionCard;
