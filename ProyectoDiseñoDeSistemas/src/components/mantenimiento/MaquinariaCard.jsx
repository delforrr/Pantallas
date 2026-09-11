import { Box, Skeleton } from '@mui/material';

export const MaquinariaCard = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '14px',
      p: 2.5,
      display: 'flex',
      gap: 2,
    }}
  >
    <Skeleton
      variant="rounded"
      width={56}
      height={56}
      sx={{
        bgcolor: 'action.selected',
        borderRadius: '12px',
        flexShrink: 0,
      }}
    />
    <Box sx={{ flex: 1 }}>
      <Skeleton
        width="60%"
        height={20}
        sx={{ bgcolor: 'action.hover', mb: 0.5 }}
      />
      <Skeleton
        width="40%"
        height={15}
        sx={{ bgcolor: 'action.hover', mb: 1 }}
      />
      <Skeleton
        variant="rounded"
        height={6}
        sx={{ bgcolor: 'success.main', opacity: 0.3, borderRadius: '3px' }}
      />
    </Box>
  </Box>
);

export default MaquinariaCard;
