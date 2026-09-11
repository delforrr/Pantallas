import { Box, Skeleton } from '@mui/material';
import { SectionLabel } from '../shared';

export const ResumenPedido = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '16px',
      p: 3,
    }}
  >
    <SectionLabel>Resumen del pedido</SectionLabel>
    {['Subtotal', 'Descuento', 'Envío', 'Total'].map((l) => (
      <Box
        key={l}
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}
      >
        <Skeleton width={80} height={18} sx={{ bgcolor: 'action.hover' }} />
        <Skeleton width={60} height={18} sx={{ bgcolor: 'action.hover' }} />
      </Box>
    ))}
    <Skeleton
      variant="rounded"
      height={44}
      sx={{ bgcolor: 'action.selected', borderRadius: '10px', mt: 2 }}
    />
  </Box>
);

export default ResumenPedido;
