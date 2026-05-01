import React from "react";
import { Box, Grid, Typography, Chip, Button, Skeleton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  SkeletonCard,
  SkeletonRow,
  SectionLabel,
} from "../../../components/SkeletonComponents";
import { StatsRow, ActionBar } from "../../../components/shared/adminHelpers";

export const MaquinariaScreen = () => (
  <Box>
    <StatsRow count={3} />
    <ActionBar />
    <Grid container spacing={2.5}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} key={i}>
          <Box
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "14px",
              p: 2.5,
              display: "flex",
              gap: 2,
            }}
          >
            <Skeleton
              variant="rounded"
              width={56}
              height={56}
              sx={{
                bgcolor: "action.selected",
                borderRadius: "12px",
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                width="60%"
                height={20}
                sx={{ bgcolor: "action.hover", mb: 0.5 }}
              />
              <Skeleton
                width="40%"
                height={15}
                sx={{ bgcolor: "action.hover", mb: 1 }}
              />
              <Skeleton
                variant="rounded"
                height={6}
                sx={{ bgcolor: "success.main", opacity: 0.3, borderRadius: "3px" }}
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);
export default MaquinariaScreen;
