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
} from "../../../components/shared/adminHelpers";

export const StockScreen = () => (
  <Box>
    <StatsRow />
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <SectionLabel>Stock por producto</SectionLabel>
        <TableSkeleton rows={8} cols={5} />
      </Grid>
      <Grid item xs={12} md={4}>
        <SectionLabel>Alertas de stock</SectionLabel>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              background: "rgba(192,57,43,0.1)",
              border: "1px solid rgba(192,57,43,0.2)",
              borderRadius: "12px",
              p: 2,
              mb: 1.5,
            }}
          >
            <Skeleton
              width="65%"
              height={18}
              sx={{ background: "rgba(192,57,43,0.12)" }}
            />
            <Skeleton
              width="40%"
              height={14}
              sx={{ background: "rgba(192,57,43,0.08)", mt: 0.5 }}
            />
          </Box>
        ))}
      </Grid>
    </Grid>
  </Box>
);
export default StockScreen;
