import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const MateriaPrimaScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <SectionLabel>Inventario de materia prima</SectionLabel>
    <TableSkeleton rows={7} cols={5} />
  </Box>
);

export default MateriaPrimaScreen;
