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
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <Skeleton
              height={130}
              sx={{ bgcolor: "action.hover", transform: "none" }}
            />
            <Box sx={{ p: 2 }}>
              <Skeleton
                width="60%"
                height={20}
                sx={{ bgcolor: "action.hover", mb: 0.5 }}
              />
              <Skeleton
                width="40%"
                height={15}
                sx={{ bgcolor: "action.hover" }}
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);
export default RecetasScreen;
