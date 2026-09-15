import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const STATUS_COLOR_MAP = {
  Operativa: 'success',
  'En Mantenimiento': 'warning',
  'En Reparación': 'error',
  'Fuera de Servicio': 'default',
};

export const MaquinariaCard = ({
  maquinaria,
  onEdit,
  onDelete,
  onNewOrder,
  onViewDetail,
}) => {
  if (!maquinaria) return null;

  const usagePercent = Math.min(100, Math.round((maquinaria.horasUso / 1000) * 100));

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: maquinaria.alerta48hs ? 'error.main' : 'divider',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 6px 20px rgba(0,0,0,0.6)'
              : '0 6px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Alerta de dominio de parada mayor a 48 hs */}
      {maquinaria.alerta48hs && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
            p: 1,
            bgcolor: 'error.main',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <WarningAmberIcon fontSize="small" />
          <span>ALERTA DOMINIO: Avería mecánica &gt; 24hs (Riesgo parada de planta)</span>
        </Box>
      )}

      {/* Header de Tarjeta */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor:
                maquinaria.estado === 'Operativa'
                  ? 'action.hover'
                  : maquinaria.estado === 'En Mantenimiento'
                  ? 'warning.light'
                  : 'error.light',
              color:
                maquinaria.estado === 'Operativa'
                  ? 'primary.main'
                  : maquinaria.estado === 'En Mantenimiento'
                  ? 'warning.dark'
                  : 'error.dark',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PrecisionManufacturingIcon />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.secondary' }}>
              {maquinaria.codigo}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {maquinaria.nombre}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={maquinaria.estado}
          size="small"
          color={STATUS_COLOR_MAP[maquinaria.estado] || 'default'}
          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
        />
      </Box>

      {/* Datos Técnicos */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Marca / Modelo:</strong> {maquinaria.marca} ({maquinaria.modelo})
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Línea de Producción:</strong> {maquinaria.linea}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          <strong>Ubicación:</strong> {maquinaria.ubicacion}
        </Typography>

        {/* Indicador de Horas de Uso */}
        <Box sx={{ mt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: '0.85rem', color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Horas de Operación
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {maquinaria.horasUso} hs / 1.000 hs
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={usagePercent}
            color={usagePercent > 80 ? 'warning' : 'primary'}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      </Box>

      {/* Calendario de Mantenimiento */}
      <Box
        sx={{
          p: 1.2,
          borderRadius: '10px',
          bgcolor: 'action.hover',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
            Último Servicio
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {maquinaria.ultimoMantenimiento}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
            Próximo Preventivo
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarMonthIcon sx={{ fontSize: '0.85rem', color: 'primary.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {maquinaria.proximoMantenimiento}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Acciones de Tarjeta */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<BuildCircleIcon />}
          onClick={() => onNewOrder(maquinaria)}
          sx={{ borderRadius: '8px', fontSize: '0.75rem', py: 0.5, px: 1.5 }}
        >
          Crear Orden
        </Button>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Ficha técnica completa">
            <IconButton size="small" onClick={() => onViewDetail(maquinaria)} sx={{ color: 'text.secondary' }}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar maquinaria">
            <IconButton size="small" onClick={() => onEdit(maquinaria)} sx={{ color: 'primary.main' }}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar maquinaria">
            <IconButton size="small" onClick={() => onDelete(maquinaria)} sx={{ color: 'error.main' }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default MaquinariaCard;
