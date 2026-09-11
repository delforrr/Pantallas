import { Box } from "@mui/material";
import {
  TableSkeleton,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const PresupuestoProveedorScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Presupuestos de proveedores</SectionLabel>
    <TableSkeleton rows={5} cols={5} />
  </Box>
);

export default PresupuestoProveedorScreen;
