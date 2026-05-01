import React from 'react';
import { Box, Grid, Typography, Chip, Button, Skeleton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SkeletonCard, SkeletonRow, SectionLabel } from '../../../components/SkeletonComponents';

export const MediosPagoScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <SectionLabel>Métodos de pago guardados</SectionLabel>
        {[1,2].map((i) => (
          <Box key={i} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            borderRadius: '14px', p: 2.5, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="rounded" width={52} height={36} sx={{ bgcolor: 'action.hover', borderRadius: '8px' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="50%" height={20} sx={{ bgcolor: 'action.hover' }} />
              <Skeleton width="30%" height={15} sx={{ bgcolor: 'action.hover', mt: 0.5 }} />
            </Box>
          </Box>
        ))}
        <Skeleton variant="rounded" height={44} sx={{ bgcolor: 'action.selected', borderRadius: '10px', mt: 1 }} />
      </Grid>
      <Grid item xs={12} md={5}>
        <SectionLabel>Agregar nuevo método</SectionLabel>
        <Box sx={{ bgcolor: 'background.paper', border: '1px dashed', borderColor: 'divider',
          borderRadius: '14px', p: 3 }}>
          {['Número de tarjeta','Vencimiento','CVV','Titular'].map((f) => (
            <Skeleton key={f} height={48} sx={{ bgcolor: 'action.hover', borderRadius: '10px', mb: 1.5, transform: 'none' }} />
          ))}
          <Skeleton height={44} sx={{ bgcolor: 'action.selected', borderRadius: '10px', transform: 'none' }} />
        </Box>
      </Grid>
    </Grid>
  </Box>
);
export default MediosPagoScreen;
