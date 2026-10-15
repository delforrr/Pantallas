import { Box, Skeleton } from '@mui/material';

export const AlertaStock = () => (
  <Box
    sx={{
      bgcolor: (theme) => `${theme.palette.error.main}1A`,
      border: '1px solid',
      borderColor: (theme) => `${theme.palette.error.main}33`,
      borderRadius: '12px',
      p: 2,
      mb: 1.5,
    }}
  >
    <Skeleton
      width="65%"
      height={18}
      sx={{ bgcolor: (theme) => `${theme.palette.error.main}1F` }}
    />
    <Skeleton
      width="40%"
      height={14}
      sx={{ bgcolor: (theme) => `${theme.palette.error.main}14`, mt: 0.5 }}
    />
  </Box>
);

export default AlertaStock;
