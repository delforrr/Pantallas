import { Box, Skeleton } from '@mui/material';
import { SectionLabel } from '../shared';

export const ResumenCaja = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '16px',
      p: 3,
    }}
  >
    <SectionLabel>Resumen del día</SectionLabel>
    {[
      'Apertura de caja',
      'Total ventas',
      'Total cobrado',
      'Diferencia',
    ].map((l) => (
      <Box
        key={l}
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
      >
        <Skeleton
          width="45%"
          height={20}
          sx={{ bgcolor: 'action.hover' }}
        />
        <Skeleton
          width="30%"
          height={20}
          sx={{ bgcolor: 'action.hover' }}
        />
      </Box>
    ))}
    <Skeleton
      height={44}
      sx={{
        bgcolor: 'success.main',
        opacity: 0.2,
        borderRadius: '10px',
        mt: 2,
        transform: 'none',
      }}
    />
  </Box>
);

export default ResumenCaja;
