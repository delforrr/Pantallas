import { Box, Skeleton } from '@mui/material';

export const CarritoItem = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '12px',
      p: 2,
      mb: 2,
      display: 'flex',
      gap: 2,
      alignItems: 'center',
    }}
  >
    <Skeleton
      variant="rounded"
      width={72}
      height={72}
      sx={{ bgcolor: 'action.hover', borderRadius: '10px', flexShrink: 0 }}
    />
    <Box sx={{ flex: 1 }}>
      <Skeleton width="55%" height={20} sx={{ bgcolor: 'action.hover' }} />
      <Skeleton width="35%" height={16} sx={{ bgcolor: 'action.hover', mt: 0.5 }} />
    </Box>
    <Skeleton
      width={80}
      height={36}
      sx={{ bgcolor: 'action.selected', borderRadius: '8px' }}
    />
  </Box>
);

export default CarritoItem;
