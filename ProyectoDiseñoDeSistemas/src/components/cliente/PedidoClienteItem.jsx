import { Box, Skeleton } from '@mui/material';

export const PedidoClienteItem = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '12px',
      p: 2.5,
      mb: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
    }}
  >
    <Skeleton
      variant="circular"
      width={44}
      height={44}
      sx={{ bgcolor: 'action.hover', flexShrink: 0 }}
    />
    <Box sx={{ flex: 1 }}>
      <Skeleton width="40%" height={20} sx={{ bgcolor: 'action.hover' }} />
      <Skeleton width="25%" height={15} sx={{ bgcolor: 'action.hover', mt: 0.5 }} />
    </Box>
    <Skeleton
      width={90}
      height={28}
      sx={{ bgcolor: 'success.main', opacity: 0.2, borderRadius: '8px' }}
    />
    <Skeleton width={70} height={20} sx={{ bgcolor: 'action.hover' }} />
  </Box>
);

export default PedidoClienteItem;
