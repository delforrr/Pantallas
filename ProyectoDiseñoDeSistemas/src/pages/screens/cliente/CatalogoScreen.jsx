import React from 'react';
import { Box, Grid, Typography, Chip, Button, Skeleton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SkeletonCard, SkeletonRow, SectionLabel } from '../../../components/SkeletonComponents';

export const CatalogoScreen = () => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {['Todos', 'Fideos', 'Rellenos', 'Salsas', 'Especiales'].map((c) => (
        <Chip key={c} label={c} clickable
          sx={{ bgcolor: c === 'Todos' ? 'action.selected' : 'background.paper',
            color: c === 'Todos' ? 'primary.main' : 'text.secondary',
            border: `1px solid`, borderColor: c === 'Todos' ? 'primary.main' : 'divider' }} />
      ))}
      <Button startIcon={<FilterListIcon />} size="small"
        sx={{ ml: 'auto', color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
        Filtros
      </Button>
    </Box>
    <SectionLabel>Productos destacados</SectionLabel>
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {[220, 200, 210, 190, 215, 200].map((h, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <SkeletonCard height={h} />
        </Grid>
      ))}
    </Grid>
    <SectionLabel>Más vendidos esta semana</SectionLabel>
    <Grid container spacing={2}>
      {[160, 155, 160].map((h, i) => (
        <Grid item xs={12} sm={4} key={i}><SkeletonCard height={h} /></Grid>
      ))}
    </Grid>
  </Box>
);
export default CatalogoScreen;
