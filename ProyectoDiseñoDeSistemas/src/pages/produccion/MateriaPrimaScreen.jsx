import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const MateriaPrimaScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Materias primas e insumos</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default MateriaPrimaScreen;
