import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

/** Generic skeleton card for placeholder content */
const SkeletonCard = ({ height = 180, sx = {} }) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '16px',
      overflow: 'hidden',
      ...sx,
    }}
  >
    <Skeleton variant="rectangular" height={height} animation="wave"
      sx={{ bgcolor: 'action.hover', transform: 'none' }} />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" sx={{ bgcolor: 'action.selected' }} />
      <Skeleton variant="text" width="40%" sx={{ bgcolor: 'action.hover' }} />
    </Box>
  </Box>
);

const SkeletonRow = ({ width = '100%' }) => (
  <Skeleton variant="text" height={48} width={width}
    sx={{ bgcolor: 'action.hover', borderRadius: '8px', transform: 'none', mb: 1 }} />
);

const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    sx={{ color: 'text.secondary', fontSize: '0.68rem', letterSpacing: '0.12em', mb: 1, display: 'block' }}
  >
    {children}
  </Typography>
);

export { SkeletonCard, SkeletonRow, SectionLabel };
