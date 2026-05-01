import React from 'react';
import { Box, Grid, Skeleton } from '@mui/material';

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <Box sx={{ background: 'rgba(42,34,16,0.5)', border: '1px solid rgba(232,160,32,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', gap: 2, px: 2.5, py: 1.5, borderBottom: '1px solid rgba(232,160,32,0.08)', background: 'rgba(232,160,32,0.04)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width={`${100 / cols}%`} height={18} sx={{ background: 'rgba(232,160,32,0.1)' }} />
      ))}
    </Box>
    {Array.from({ length: rows }).map((_, r) => (
      <Box key={r} sx={{ display: 'flex', gap: 2, px: 2.5, py: 1.2, borderBottom: '1px solid rgba(232,160,32,0.05)' }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} width={`${100 / cols}%`} height={18} sx={{ background: 'rgba(232,160,32,0.06)' }} />
        ))}
      </Box>
    ))}
  </Box>
);

export const StatsRow = ({ count = 4 }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Grid item xs={6} sm={3} key={i}>
        <Box sx={{ background: 'rgba(42,34,16,0.6)', border: '1px solid rgba(232,160,32,0.12)',
          borderRadius: '14px', p: 2.5 }}>
          <Skeleton width="40%" height={14} sx={{ background: 'rgba(232,160,32,0.07)', mb: 1 }} />
          <Skeleton width="60%" height={28} sx={{ background: 'rgba(232,160,32,0.1)' }} />
        </Box>
      </Grid>
    ))}
  </Grid>
);

export const ActionBar = () => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
    <Skeleton width={180} height={40} sx={{ background: 'rgba(232,160,32,0.07)', borderRadius: '10px', transform: 'none' }} />
    <Skeleton width={120} height={40} sx={{ background: 'rgba(232,160,32,0.07)', borderRadius: '10px', transform: 'none' }} />
    <Box sx={{ flex: 1 }} />
    <Skeleton width={140} height={40} sx={{ background: 'rgba(232,160,32,0.15)', borderRadius: '10px', transform: 'none' }} />
  </Box>
);

