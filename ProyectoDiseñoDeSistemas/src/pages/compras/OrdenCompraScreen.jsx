import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const OrdenCompraScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <SectionLabel>Órdenes de compra</SectionLabel>
    <TableSkeleton rows={6} cols={6} />
  </Box>
);

export default OrdenCompraScreen;
