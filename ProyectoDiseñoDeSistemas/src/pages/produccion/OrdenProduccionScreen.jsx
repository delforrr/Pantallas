import { Box, Grid } from "@mui/material";
import {
  StatsRow,
  ActionBar,
  SectionLabel,
  TableSkeleton,
} from "../../components/shared";
import { OrdenProduccionCard } from "../../components/produccion";

export const OrdenProduccionScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <SectionLabel>Órdenes activas</SectionLabel>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[1, 2, 3].map((i) => (
        <Grid item xs={12} sm={4} key={i}>
          <OrdenProduccionCard />
        </Grid>
      ))}
    </Grid>
    <SectionLabel>Historial de producción</SectionLabel>
    <TableSkeleton rows={4} cols={5} />
  </Box>
);

export default OrdenProduccionScreen;
