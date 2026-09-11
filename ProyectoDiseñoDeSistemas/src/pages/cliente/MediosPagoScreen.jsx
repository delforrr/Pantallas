import { Box, Grid, Skeleton } from '@mui/material';
import { SectionLabel } from '../../components/shared';
import { MetodoPagoItem, NuevoMetodoPagoForm } from '../../components/cliente';

export const MediosPagoScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <SectionLabel>Métodos de pago guardados</SectionLabel>
        {[1, 2].map((i) => (
          <MetodoPagoItem key={i} />
        ))}
        <Skeleton
          variant="rounded"
          height={44}
          sx={{ bgcolor: 'action.selected', borderRadius: '10px', mt: 1 }}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <SectionLabel>Agregar nuevo método</SectionLabel>
        <NuevoMetodoPagoForm />
      </Grid>
    </Grid>
  </Box>
);

export default MediosPagoScreen;
