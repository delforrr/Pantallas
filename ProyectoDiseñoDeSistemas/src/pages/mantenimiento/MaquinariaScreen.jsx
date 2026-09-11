import { Box, Grid } from "@mui/material";
import { StatsRow, ActionBar } from "../../components/shared";
import { MaquinariaCard } from "../../components/mantenimiento";

export const MaquinariaScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <Grid container spacing={2.5}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} key={i}>
          <MaquinariaCard />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default MaquinariaScreen;
