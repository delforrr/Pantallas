import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

/** Generic skeleton card for placeholder content */
const SkeletonCard = ({ height = 180, sx = {} }) => (
  <Box
    sx={{
      background: 'rgba(42, 34, 16, 0.5)',
      border: '1px solid rgba(232,160,32,0.1)',
      borderRadius: '16px',
      overflow: 'hidden',
      ...sx,
    }}
  >
    <Skeleton variant="rectangular" height={height} animation="wave"
      sx={{ background: 'rgba(232,160,32,0.06)', transform: 'none' }} />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" sx={{ background: 'rgba(232,160,32,0.08)' }} />
      <Skeleton variant="text" width="40%" sx={{ background: 'rgba(232,160,32,0.06)' }} />
    </Box>
  </Box>
);

const SkeletonRow = ({ width = '100%' }) => (
  <Skeleton variant="text" height={48} width={width}
    sx={{ background: 'rgba(232,160,32,0.06)', borderRadius: '8px', transform: 'none', mb: 1 }} />
);

const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    sx={{ color: '#6B5F44', fontSize: '0.68rem', letterSpacing: '0.12em', mb: 1, display: 'block' }}
  >
    {children}
  </Typography>
);

export { SkeletonCard, SkeletonRow, SectionLabel };
