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
              background: "rgba(42,34,16,0.55)",
              border: "1px solid rgba(232,160,32,0.12)",
              borderRadius: "14px",
              p: 2.5,
            }}
          >
            <Skeleton
              width="70%"
              height={22}
              sx={{ background: "rgba(232,160,32,0.1)", mb: 1 }}
            />
            <Skeleton
              width="50%"
              height={16}
              sx={{ background: "rgba(232,160,32,0.07)", mb: 1.5 }}
            />
            <Skeleton
              variant="rounded"
              height={8}
              sx={{ background: "rgba(232,160,32,0.12)", borderRadius: "4px" }}
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
