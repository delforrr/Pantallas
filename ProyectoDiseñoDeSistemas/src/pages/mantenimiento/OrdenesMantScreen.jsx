import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const OrdenesMantScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <SectionLabel>Órdenes de mantenimiento</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default OrdenesMantScreen;
