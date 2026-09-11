import { Box, Skeleton } from '@mui/material';

export const MetodoPagoItem = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '14px',
      p: 2.5,
      mb: 2,
      display: 'flex',
      gap: 2,
      alignItems: 'center',
    }}
  >
    <Skeleton
      variant="rounded"
      width={52}
      height={36}
      sx={{ bgcolor: 'action.hover', borderRadius: '8px' }}
    />
    <Box sx={{ flex: 1 }}>
      <Skeleton width="50%" height={20} sx={{ bgcolor: 'action.hover' }} />
      <Skeleton width="30%" height={15} sx={{ bgcolor: 'action.hover', mt: 0.5 }} />
    </Box>
  </Box>
);

export default MetodoPagoItem;
