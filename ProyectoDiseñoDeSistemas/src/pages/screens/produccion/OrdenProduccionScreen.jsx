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

export const OrdenProduccionScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <SectionLabel>Órdenes activas</SectionLabel>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[1, 2, 3].map((i) => (
        <Grid item xs={12} sm={4} key={i}>
          <Box
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "14px",
              p: 2.5,
            }}
          >
            <Skeleton
              width="70%"
              height={22}
              sx={{ bgcolor: "action.hover", mb: 1 }}
            />
            <Skeleton
              width="50%"
              height={16}
              sx={{ bgcolor: "action.hover", mb: 1.5 }}
            />
            <Skeleton
              variant="rounded"
              height={8}
              sx={{ bgcolor: "action.selected", borderRadius: "4px" }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
    <SectionLabel>Historial de producción</SectionLabel>
    <TableSkeleton rows={4} cols={5} />
  </Box>
);
export default OrdenProduccionScreen;
