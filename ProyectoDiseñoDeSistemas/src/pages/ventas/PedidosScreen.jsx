import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const PedidosScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Gestión de pedidos</SectionLabel>
    <TableSkeleton rows={7} cols={6} />
  </Box>
);

export default PedidosScreen;
