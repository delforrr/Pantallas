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
          sx={{ background: 'rgba(42,34,16,0.7)', color: '#B8A882', border: '1px solid rgba(232,160,32,0.1)' }} />
      ))}
    </Box>
    <SectionLabel>Historial de pedidos</SectionLabel>
    {[1,2,3,4].map((i) => (
      <Box key={i} sx={{ background: 'rgba(42,34,16,0.5)', border: '1px solid rgba(232,160,32,0.1)',
        borderRadius: '12px', p: 2.5, mb: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Skeleton variant="circular" width={44} height={44} sx={{ background: 'rgba(232,160,32,0.08)', flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="40%" height={20} sx={{ background: 'rgba(232,160,32,0.08)' }} />
          <Skeleton width="25%" height={15} sx={{ background: 'rgba(232,160,32,0.06)', mt: 0.5 }} />
        </Box>
        <Skeleton width={90} height={28} sx={{ background: 'rgba(39,174,96,0.12)', borderRadius: '8px' }} />
        <Skeleton width={70} height={20} sx={{ background: 'rgba(232,160,32,0.08)' }} />
      </Box>
    ))}
  </Box>
);
export default PedidosClienteScreen;
