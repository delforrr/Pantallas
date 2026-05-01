import React from "react";
import { Box, Grid, Typography, Chip, Button, Skeleton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  SkeletonCard,
  SkeletonRow,
  SectionLabel,
} from "../../../components/SkeletonComponents";
import { ActionBar } from "../../../components/shared/adminHelpers";

export const RecetasScreen = () => (
  <Box>
    <ActionBar />
    <Grid container spacing={2.5}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box
            sx={{
              background: "rgba(42,34,16,0.55)",
              border: "1px solid rgba(232,160,32,0.1)",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <Skeleton
              height={130}
              sx={{ background: "rgba(232,160,32,0.07)", transform: "none" }}
            />
            <Box sx={{ p: 2 }}>
              <Skeleton
                width="60%"
                height={20}
                sx={{ background: "rgba(232,160,32,0.09)", mb: 0.5 }}
              />
              <Skeleton
                width="40%"
                height={15}
                sx={{ background: "rgba(232,160,32,0.06)" }}
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);
export default RecetasScreen;
