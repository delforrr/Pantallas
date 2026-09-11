import { Box } from "@mui/material";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
  SectionLabel,
} from "../../components/shared";

export const ClientesScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Listado de clientes</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);

export default ClientesScreen;
