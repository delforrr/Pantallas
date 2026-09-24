import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const RecetasScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Recetas de productos</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default RecetasScreen;
