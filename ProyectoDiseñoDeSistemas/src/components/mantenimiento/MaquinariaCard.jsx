import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
} from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const STATUS_COLOR_MAP = {
  Operativa: "success",
  "En Mantenimiento": "warning",
  "En Reparación": "error",
  "Fuera de Servicio": "default",
};

export const MaquinariaCard = ({
  maquinaria,
  onEdit,
  onDelete,
  onNewOrder,
  onViewDetail,
}) => {
  if (!maquinaria) return null;

  const usagePercent = Math.min(
    100,
    Math.round((maquinaria.horasUso / 1000) * 100),
  );

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: maquinaria.alerta48hs ? "error.main" : "divider",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: "background.paper",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.6)"
              : "0 8px 24px rgba(0,0,0,0.09)",
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* Header de Tarjeta */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              bgcolor:
                maquinaria.estado === "Operativa"
                  ? "action.hover"
                  : maquinaria.estado === "En Mantenimiento"
                    ? "warning.light"
                    : "error.light",
              color:
                maquinaria.estado === "Operativa"
                  ? "primary.main"
                  : maquinaria.estado === "En Mantenimiento"
                    ? "warning.dark"
                    : "error.dark",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PrecisionManufacturingIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: "text.secondary",
                display: "block",
              }}
            >
              {maquinaria.codigo}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={maquinaria.nombre}
            >
              {maquinaria.nombre}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={maquinaria.estado}
          size="small"
          color={STATUS_COLOR_MAP[maquinaria.estado] || "default"}
          sx={{ fontWeight: 700, fontSize: "0.72rem", flexShrink: 0, ml: 1 }}
        />
      </Box>

      {/* Datos Técnicos */}
      <Box sx={{ mb: 2 }}>
        {/* Indicador de Horas de Uso */}
        <Box sx={{ mt: 1.5 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon
                sx={{ fontSize: "0.85rem", color: "text.secondary" }}
              />
              <Typography variant="caption" color="text.secondary">
                Horas de Operación
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {maquinaria.horasUso} hs / 1.000 hs
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={usagePercent}
            color={usagePercent > 80 ? "warning" : "primary"}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      </Box>

      {/* Acciones de Tarjeta - Pinned to bottom */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 1.5,
          mt: "auto",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<BuildCircleIcon />}
          onClick={() => onNewOrder(maquinaria)}
          sx={{ borderRadius: "8px", fontSize: "0.75rem", py: 0.5, px: 1.5 }}
        >
          Crear Orden
        </Button>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Ficha técnica completa">
            <IconButton
              size="small"
              onClick={() => onViewDetail(maquinaria)}
              sx={{ color: "text.secondary" }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar maquinaria">
            <IconButton
              size="small"
              onClick={() => onEdit(maquinaria)}
              sx={{ color: "primary.main" }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar maquinaria">
            <IconButton
              size="small"
              onClick={() => onDelete(maquinaria)}
              sx={{ color: "error.main" }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default MaquinariaCard;
