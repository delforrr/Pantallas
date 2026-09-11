import { Box, Skeleton } from '@mui/material';

export const OrdenProduccionCard = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '14px',
      p: 2.5,
    }}
  >
    <Skeleton
      width="70%"
      height={22}
      sx={{ bgcolor: 'action.hover', mb: 1 }}
    />
    <Skeleton
      width="50%"
      height={16}
      sx={{ bgcolor: 'action.hover', mb: 1.5 }}
    />
    <Skeleton
      variant="rounded"
      height={8}
      sx={{ bgcolor: 'action.selected', borderRadius: '4px' }}
    />
  </Box>
);

export default OrdenProduccionCard;
