import { Box } from "@mui/material";
import {
  TableSkeleton,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const ProveedoresScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Directorio de proveedores</SectionLabel>
    <TableSkeleton rows={7} cols={5} />
  </Box>
);

export default ProveedoresScreen;
