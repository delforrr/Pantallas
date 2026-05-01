import React from "react";
import { Box, Grid, Typography, Chip, Button, Skeleton } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  SkeletonCard,
  SkeletonRow,
  SectionLabel,
} from "../../../components/SkeletonComponents";
import { TableSkeleton } from "../../../components/shared/adminHelpers";

export const CierreCajaScreen = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
            p: 3,
          }}
        >
          <SectionLabel>Resumen del día</SectionLabel>
          {[
            "Apertura de caja",
            "Total ventas",
            "Total cobrado",
            "Diferencia",
          ].map((l) => (
            <Box
              key={l}
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Skeleton
                width="45%"
                height={20}
                sx={{ bgcolor: "action.hover" }}
              />
              <Skeleton
                width="30%"
                height={20}
                sx={{ bgcolor: "action.hover" }}
              />
            </Box>
          ))}
          <Skeleton
            height={44}
            sx={{
              bgcolor: "success.main",
              opacity: 0.2,
              borderRadius: "10px",
              mt: 2,
              transform: "none",
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionLabel>Movimientos del turno</SectionLabel>
        <TableSkeleton rows={6} cols={4} />
      </Grid>
    </Grid>
  </Box>
);
export default CierreCajaScreen;
