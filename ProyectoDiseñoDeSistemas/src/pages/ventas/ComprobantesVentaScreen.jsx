import { Box } from "@mui/material";
import {
  TableSkeleton,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const ComprobantesVentaScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Comprobantes de venta</SectionLabel>
    <TableSkeleton rows={6} cols={6} />
  </Box>
);

export default ComprobantesVentaScreen;
