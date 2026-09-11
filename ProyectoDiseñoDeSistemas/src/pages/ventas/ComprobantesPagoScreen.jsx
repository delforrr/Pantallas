import { Box } from "@mui/material";
import {
  TableSkeleton,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const ComprobantesPagoScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Comprobantes de pago</SectionLabel>
    <TableSkeleton rows={5} cols={5} />
  </Box>
);

export default ComprobantesPagoScreen;
