import React from "react";
import { Box, Grid, Typography, Chip, Button, Skeleton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  SkeletonCard,
  SkeletonRow,
  SectionLabel,
} from "../../../components/SkeletonComponents";
import {
  TableSkeleton,
  StatsRow,
  ActionBar,
} from "../../../components/shared/adminHelpers";

export const ClientesScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Listado de clientes</SectionLabel>
    <TableSkeleton rows={6} cols={5} />
  </Box>
);
export default ClientesScreen;
