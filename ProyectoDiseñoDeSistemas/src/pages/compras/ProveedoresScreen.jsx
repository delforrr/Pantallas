import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const ProveedoresScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Listado de proveedores</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default ProveedoresScreen;
