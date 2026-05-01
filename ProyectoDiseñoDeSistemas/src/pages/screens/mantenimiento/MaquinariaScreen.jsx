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
              background: "rgba(42,34,16,0.55)",
              border: "1px solid rgba(232,160,32,0.12)",
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
                background: "rgba(232,160,32,0.1)",
                borderRadius: "12px",
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                width="60%"
                height={20}
                sx={{ background: "rgba(232,160,32,0.09)", mb: 0.5 }}
              />
              <Skeleton
                width="40%"
                height={15}
                sx={{ background: "rgba(232,160,32,0.06)", mb: 1 }}
              />
              <Skeleton
                variant="rounded"
                height={6}
                sx={{ background: "rgba(39,174,96,0.2)", borderRadius: "3px" }}
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);
export default MaquinariaScreen;
