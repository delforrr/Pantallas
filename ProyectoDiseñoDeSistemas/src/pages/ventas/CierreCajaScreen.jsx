import { Box, Grid } from "@mui/material";
import { TableSkeleton, SectionLabel } from "../../components/shared";
import { ResumenCaja } from "../../components/ventas";

export const CierreCajaScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <ResumenCaja />
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionLabel>Movimientos del turno</SectionLabel>
        <TableSkeleton rows={6} cols={4} />
      </Grid>
    </Grid>
  </Box>
);

export default CierreCajaScreen;
