import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const MaquinariaScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Administración de maquinaria</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default MaquinariaScreen;
