import { Box } from "@mui/material";
import {
  TableSkeleton,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const ProductosCompuestosScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Productos compuestos</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default ProductosCompuestosScreen;
