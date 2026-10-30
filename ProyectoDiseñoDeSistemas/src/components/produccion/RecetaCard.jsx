import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export const RecetaCard = ({ receta, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const getCategoryColor = (cat) => {
    if (cat === 'Pastas Rellenas') return 'primary';
    return 'default';
  };

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 6px 20px rgba(0,0,0,0.4)'
              : '0 6px 20px rgba(0,0,0,0.08)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header con código, categoría y acciones */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {receta.codigoProducto || receta.id}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.2 }}>
              {receta.nombreProducto}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Editar receta">
              <IconButton size="small" onClick={() => onEdit(receta)} sx={{ color: 'text.secondary' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar receta">
              <IconButton size="small" onClick={() => onDelete(receta.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Badges de Información */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            size="small"
            label={receta.categoria}
            color={getCategoryColor(receta.categoria)}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            size="small"
            icon={<ScaleIcon style={{ fontSize: 16 }} />}
            label={`Lote base: ${receta.rendimientoBase} kg`}
            variant="outlined"
          />
          <Chip
            size="small"
            icon={<AccessTimeIcon style={{ fontSize: 16 }} />}
            label={`~${receta.tiempoElaboracionMin} min`}
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {/* Resumen de materias primas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <RestaurantMenuIcon fontSize="small" color="primary" />
            Ingredientes requeridos ({receta.ingredientes?.length || 0})
          </Typography>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
          >
            {expanded ? 'Ocultar' : 'Ver detalle'}
          </Button>
        </Box>

        {/* Vista colapsada: chips rápidos */}
        {!expanded && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {receta.ingredientes?.slice(0, 3).map((ing, idx) => (
              <Chip
                key={idx}
                size="small"
                variant="outlined"
                label={`${ing.nombre.split(' ')[0]}: ${ing.cantidad} ${ing.unidad}`}
                sx={{ fontSize: '0.72rem', bgcolor: 'action.hover' }}
              />
            ))}
            {(receta.ingredientes?.length || 0) > 3 && (
              <Chip
                size="small"
                label={`+${receta.ingredientes.length - 3} más`}
                sx={{ fontSize: '0.72rem', bgcolor: 'action.selected' }}
              />
            )}
          </Box>
        )}

        {/* Lista completa desplegable */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List dense disablePadding sx={{ bgcolor: 'action.hover', borderRadius: '8px', p: 1, mt: 1 }}>
            {receta.ingredientes?.map((ing, idx) => (
              <ListItem
                key={idx}
                disableGutters
                sx={{
                  py: 0.5,
                  px: 1,
                  borderBottom: idx < receta.ingredientes.length - 1 ? '1px dashed' : 'none',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <ListItemText
                  primary={ing.nombre}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', pl: 1 }}>
                  {ing.cantidad} {ing.unidad}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default RecetaCard;
