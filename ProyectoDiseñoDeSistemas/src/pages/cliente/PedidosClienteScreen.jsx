import { Box, Chip } from '@mui/material';
import { SectionLabel } from '../../components/shared';
import { PedidoClienteItem } from '../../components/cliente';

export const PedidosClienteScreen = () => (
  <Box>
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {['Todos', 'Pendientes', 'En Producción', 'Entregados', 'Cancelados'].map((s) => (
        <Chip
          key={s}
          label={s}
          size="small"
          clickable
          sx={{
            bgcolor: 'background.paper',
            color: 'text.secondary',
            border: '1px solid',
            borderColor: 'divider',
          }}
        />
      ))}
    </Box>
    <SectionLabel>Historial de pedidos</SectionLabel>
    {[1, 2, 3, 4].map((i) => (
      <PedidoClienteItem key={i} />
    ))}
  </Box>
);

export default PedidosClienteScreen;
