import { Box } from "@mui/material";
import {
  TableSkeleton,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const PresupuestosScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Presupuestos generados</SectionLabel>
    <TableSkeleton rows={5} cols={5} />
  </Box>
);

export default PresupuestosScreen;
