import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const OrdenProduccionScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Órdenes de producción</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default OrdenProduccionScreen;
