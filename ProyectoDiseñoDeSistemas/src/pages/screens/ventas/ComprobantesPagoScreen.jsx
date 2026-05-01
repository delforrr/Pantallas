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

export const ComprobantesPagoScreen = () => (
  <Box>
    <ActionBar />
    <SectionLabel>Comprobantes de pago</SectionLabel>
    <TableSkeleton rows={5} cols={5} />
  </Box>
);
export default ComprobantesPagoScreen;
