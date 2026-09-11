import { Box, Grid } from "@mui/material";
import { ActionBar } from "../../components/shared";
import { RecetaCard } from "../../components/produccion";

export const RecetasScreen = () => (
  <Box>
    <ActionBar />
    <Grid container spacing={2.5}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <RecetaCard />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default RecetasScreen;
