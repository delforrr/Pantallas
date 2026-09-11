import { Box, Skeleton } from '@mui/material';

export const NuevoMetodoPagoForm = () => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: '14px',
      p: 3,
    }}
  >
    {['Número de tarjeta', 'Vencimiento', 'CVV', 'Titular'].map((f) => (
      <Skeleton
        key={f}
        height={48}
        sx={{
          bgcolor: 'action.hover',
          borderRadius: '10px',
          mb: 1.5,
          transform: 'none',
        }}
      />
    ))}
    <Skeleton
      height={44}
      sx={{
        bgcolor: 'action.selected',
        borderRadius: '10px',
        transform: 'none',
      }}
    />
  </Box>
);

export default NuevoMetodoPagoForm;
