import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const FacturasRemitosScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Facturas y remitos de compra</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default FacturasRemitosScreen;
