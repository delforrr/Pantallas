import { Box, Skeleton } from '@mui/material';

export const RecetaCard = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '14px',
      overflow: 'hidden',
    }}
  >
    <Skeleton
      height={130}
      sx={{ bgcolor: 'action.hover', transform: 'none' }}
    />
    <Box sx={{ p: 2 }}>
      <Skeleton
        width="60%"
        height={20}
        sx={{ bgcolor: 'action.hover', mb: 0.5 }}
      />
      <Skeleton
        width="40%"
        height={15}
        sx={{ bgcolor: 'action.hover' }}
      />
    </Box>
  </Box>
);

export default RecetaCard;
