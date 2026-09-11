import { Box, Grid } from '@mui/material';
import { SectionLabel } from '../../components/shared';
import { CarritoItem, ResumenPedido } from '../../components/cliente';

export const CarritoScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <SectionLabel>Ítems en tu carrito</SectionLabel>
        {[1, 2, 3].map((i) => (
          <CarritoItem key={i} />
        ))}
      </Grid>
      <Grid item xs={12} md={4}>
        <ResumenPedido />
      </Grid>
    </Grid>
  </Box>
);

export default CarritoScreen;
