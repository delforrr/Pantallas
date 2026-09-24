import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const PresupuestoProveedorScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Presupuestos de proveedores</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default PresupuestoProveedorScreen;
