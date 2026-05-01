import React from 'react';
import { Box, Grid, Typography, Chip, Button, Skeleton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SkeletonCard, SkeletonRow, SectionLabel } from '../../../components/SkeletonComponents';

export const CarritoScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <SectionLabel>Ítems en tu carrito</SectionLabel>
        {[1,2,3].map((i) => (
          <Box key={i} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            borderRadius: '12px', p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="rounded" width={72} height={72} sx={{ bgcolor: 'action.hover', borderRadius: '10px', flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="55%" height={20} sx={{ bgcolor: 'action.hover' }} />
              <Skeleton width="35%" height={16} sx={{ bgcolor: 'action.hover', mt: 0.5 }} />
            </Box>
            <Skeleton width={80} height={36} sx={{ bgcolor: 'action.selected', borderRadius: '8px' }} />
          </Box>
        ))}
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
          borderRadius: '16px', p: 3 }}>
          <SectionLabel>Resumen del pedido</SectionLabel>
          {['Subtotal','Descuento','Envío','Total'].map((l) => (
            <Box key={l} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Skeleton width={80} height={18} sx={{ bgcolor: 'action.hover' }} />
              <Skeleton width={60} height={18} sx={{ bgcolor: 'action.hover' }} />
            </Box>
          ))}
          <Skeleton variant="rounded" height={44} sx={{ bgcolor: 'action.selected', borderRadius: '10px', mt: 2 }} />
        </Box>
      </Grid>
    </Grid>
  </Box>
);
export default CarritoScreen;
