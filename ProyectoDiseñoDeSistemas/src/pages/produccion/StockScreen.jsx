import { Box, Grid } from "@mui/material";
import {
  StatsRow,
  SectionLabel,
  TableSkeleton,
} from "../../components/shared";
import { AlertaStock } from "../../components/produccion";

export const StockScreen = () => (
  <Box>
    <StatsRow />
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <SectionLabel>Stock por producto</SectionLabel>
        <TableSkeleton rows={8} cols={5} />
      </Grid>
      <Grid item xs={12} md={4}>
        <SectionLabel>Alertas de stock</SectionLabel>
        {[1, 2, 3].map((i) => (
          <AlertaStock key={i} />
        ))}
      </Grid>
    </Grid>
  </Box>
);

export default StockScreen;
