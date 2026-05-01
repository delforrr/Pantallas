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

export const PedidosScreen = () => (
  <Box>
    <StatsRow />
    <ActionBar />
    <SectionLabel>Gestión de pedidos</SectionLabel>
    <TableSkeleton rows={7} cols={6} />
  </Box>
);
export default PedidosScreen;
