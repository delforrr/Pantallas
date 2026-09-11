import { Box } from "@mui/material";
import {
  TableSkeleton,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const FacturasRemitosScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Facturas y remitos</SectionLabel>
    <TableSkeleton rows={6} cols={6} />
  </Box>
);

export default FacturasRemitosScreen;
