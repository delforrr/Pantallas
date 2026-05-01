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
  ActionBar,
} from "../../../components/shared/adminHelpers";

export const ComprobantesVentaScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Comprobantes de venta</SectionLabel>
    <TableSkeleton rows={6} cols={6} />
  </Box>
);
export default ComprobantesVentaScreen;
