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
          sx={{ background: c === 'Todos' ? 'rgba(232,160,32,0.2)' : 'rgba(42,34,16,0.7)',
            color: c === 'Todos' ? '#E8A020' : '#B8A882',
            border: `1px solid ${c === 'Todos' ? 'rgba(232,160,32,0.4)' : 'rgba(232,160,32,0.1)'}` }} />
      ))}
      <Button startIcon={<FilterListIcon />} size="small"
        sx={{ ml: 'auto', color: '#B8A882', border: '1px solid rgba(232,160,32,0.15)', borderRadius: '8px' }}>
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
