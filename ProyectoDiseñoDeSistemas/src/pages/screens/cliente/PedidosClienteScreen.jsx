import React from 'react';
import { Box, Grid, Typography, Chip, Button, Skeleton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SkeletonCard, SkeletonRow, SectionLabel } from '../../../components/SkeletonComponents';

export const PedidosClienteScreen = () => (
  <Box>
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {['Todos','Pendientes','En Producción','Entregados','Cancelados'].map((s) => (
        <Chip key={s} label={s} size="small" clickable
          sx={{ bgcolor: 'background.paper', color: 'text.secondary', border: '1px solid', borderColor: 'divider' }} />
      ))}
    </Box>
    <SectionLabel>Historial de pedidos</SectionLabel>
    {[1,2,3,4].map((i) => (
      <Box key={i} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
        borderRadius: '12px', p: 2.5, mb: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Skeleton variant="circular" width={44} height={44} sx={{ bgcolor: 'action.hover', flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="40%" height={20} sx={{ bgcolor: 'action.hover' }} />
          <Skeleton width="25%" height={15} sx={{ bgcolor: 'action.hover', mt: 0.5 }} />
        </Box>
        <Skeleton width={90} height={28} sx={{ bgcolor: 'success.main', opacity: 0.2, borderRadius: '8px' }} />
        <Skeleton width={70} height={20} sx={{ bgcolor: 'action.hover' }} />
      </Box>
    ))}
  </Box>
);
export default PedidosClienteScreen;
