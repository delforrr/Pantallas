import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const OrdenCompraScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Órdenes de compra</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default OrdenCompraScreen;
