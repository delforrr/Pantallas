import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Autocomplete,
  Typography,
  Tooltip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_INSUMOS_CATALOG = [
  {
    nombre: "Harina 0000 Especial Pastas (bolsa 50kg)",
    unidad: "Bolsas",
    precioSugerido: 32000,
  },
  {
    nombre: "Semolín de Trigo Candeal (bolsa 25kg)",
    unidad: "Bolsas",
    precioSugerido: 32000,
  },
  {
    nombre: "Harina 0000 Industrial (bolsa 50kg)",
    unidad: "Bolsas",
    precioSugerido: 35500,
  },
  {
    nombre: "Semolín común (bolsa 25kg)",
    unidad: "Bolsas",
    precioSugerido: 35250,
  },
  {
    nombre: "Levadura fresca prensada (caja 5kg)",
    unidad: "Cajas",
    precioSugerido: 22000,
  },
  {
    nombre: "Polvo Leudante Químico (balde 10kg)",
    unidad: "Baldes",
    precioSugerido: 20000,
  },
  {
    nombre: "Huevos seleccionados Grado A (maple x30)",
    unidad: "Maples",
    precioSugerido: 4500,
  },
  {
    nombre: "Ricotta fresca entera pasteurizada",
    unidad: "Kilos",
    precioSugerido: 6800,
  },
  {
    nombre: "Queso Muzzarella en barra",
    unidad: "Kilos",
    precioSugerido: 9640,
  },
  {
    nombre: "Queso Parmesano para rallar",
    unidad: "Kilos",
    precioSugerido: 10000,
  },
  { nombre: "Espinaca fresca lavada", unidad: "Kilos", precioSugerido: 2800 },
  {
    nombre: "Carne vacuna picada especial",
    unidad: "Kilos",
    precioSugerido: 7500,
  },
  {
    nombre: "Cajas para ravioles 1kg con separador",
    unidad: "Unidades",
    precioSugerido: 320,
  },
  {
    nombre: "Bandejas plásticas fideos termoformadas",
    unidad: "Unidades",
    precioSugerido: 140,
  },
  {
    nombre: "Potes térmicos salsas 500cc c/tapa",
    unidad: "Unidades",
    precioSugerido: 200,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export const UNIDADES_MEDIDA = [
  "Bolsas",
  "Kilos",
  "Cajas",
  "Maples",
  "Baldes",
  "Unidades",
  "Litros",
  "Docenas",
];

/**
 * DetalleItemsTable
 * Componente modular para la carga y edición ergonómica de múltiples líneas de insumos/artículos.
 */
export const DetalleItemsTable = ({
  items = [],
  onChange,
  onImportPresupuesto,
  presupuestoDisponible = false,
  readOnly = false,
  unitReadOnly = false,
  priceReadOnly = false,
  catalog = DEFAULT_INSUMOS_CATALOG,
  unidades = UNIDADES_MEDIDA,
}) => {
  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      const newItem = { ...item, [field]: value };

      // Si selecciona una materia prima conocida del catálogo, autocompletar unidad y precio unitario
      if (field === "materiaPrima") {
        const found = catalog.find(
          (c) =>
            c.nombre.trim().toLowerCase() ===
            (value || "").trim().toLowerCase(),
        );
        if (found) {
          newItem.unidad = found.unidad;
          newItem.precioUnitario = found.precioSugerido;
        }
      }

      // Recalcular subtotal
      const qty =
        field === "cantidad" ? Number(value) : Number(newItem.cantidad || 0);
      const price =
        field === "precioUnitario"
          ? Number(value)
          : Number(newItem.precioUnitario || 0);
      newItem.subtotal = Math.max(0, Math.round(qty * price));

      return newItem;
    });

    onChange(updated);
  };

  const handleAddRow = () => {
    const nextId =
      items.length > 0
        ? Math.max(...items.map((it) => Number(it.id) || 0)) + 1
        : 1;
    const defaultInsumo = catalog[items.length % catalog.length];
    const newRow = {
      id: nextId,
      materiaPrima: defaultInsumo ? defaultInsumo.nombre : "",
      unidad: defaultInsumo ? defaultInsumo.unidad : "Bolsas",
      cantidad: 10,
      precioUnitario: defaultInsumo ? defaultInsumo.precioSugerido : 1000,
      subtotal: (defaultInsumo ? defaultInsumo.precioSugerido : 1000) * 10,
    };
    onChange([...items, newRow]);
  };

  const handleRemoveRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const totalGeneral = items.reduce(
    (acc, curr) => acc + (Number(curr.subtotal) || 0),
    0,
  );
  const totalCantidad = items.reduce(
    (acc, curr) => acc + (Number(curr.cantidad) || 0),
    0,
  );

  const renderUnidadCell = (row, idx) => {
    if (readOnly) {
      return <Typography variant="body2">{row.unidad}</Typography>;
    }

    if (unitReadOnly) {
      return (
        <Tooltip title="Unidad según el insumo">
          <TextField
            size="small"
            fullWidth
            value={row.unidad || ""}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              bgcolor: "action.hover",
              "& .MuiInputBase-input": {
                fontSize: "0.85rem",
                cursor: "default",
                color: "text.primary",
                fontWeight: 500,
              },
            }}
          />
        </Tooltip>
      );
    }

    return (
      <FormControl fullWidth size="small">
        <Select
          value={row.unidad || "Unidades"}
          onChange={(e) => handleItemChange(idx, "unidad", e.target.value)}
          sx={{
            fontSize: "0.85rem",
            bgcolor: "background.paper",
          }}
        >
          {unidades.map((u) => (
            <MenuItem key={u} value={u} sx={{ fontSize: "0.85rem" }}>
              {u}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const renderPrecioUnitarioCell = (row, idx) => {
    if (readOnly) {
      return (
        <Typography variant="body2">
          ${Number(row.precioUnitario || 0).toLocaleString("es-AR")}
        </Typography>
      );
    }

    if (priceReadOnly) {
      return (
        <Tooltip title="Precio unitario fijado según catálogo de insumos">
          <TextField
            size="small"
            fullWidth
            value={
              row.precioUnitario !== undefined &&
              row.precioUnitario !== null &&
              row.precioUnitario !== ""
                ? Number(row.precioUnitario).toLocaleString("es-AR")
                : "0"
            }
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                    }}
                  >
                    $
                  </Typography>
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "action.hover",
              "& .MuiInputBase-input": {
                fontSize: "0.85rem",
                textAlign: "right",
                fontWeight: 600,
                cursor: "default",
                color: "text.primary",
              },
            }}
          />
        </Tooltip>
      );
    }

    return (
      <TextField
        size="small"
        type="number"
        inputProps={{ min: 0, step: 100 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                }}
              >
                $
              </Typography>
            </InputAdornment>
          ),
        }}
        value={row.precioUnitario ?? ""}
        onChange={(e) => handleItemChange(idx, "precioUnitario", e.target.value)}
        required
        sx={{
          "& .MuiInputBase-input": {
            fontSize: "0.85rem",
            textAlign: "right",
          },
          bgcolor: "background.paper",
        }}
      />
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: "12px",
          borderColor: "divider",
          overflowX: "auto",
          bgcolor: "background.paper",
        }}
      >
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell
                sx={{
                  width: 40,
                  fontWeight: 700,
                  textAlign: "center",
                  py: 1.2,
                }}
              >
                #
              </TableCell>
              <TableCell sx={{ minWidth: 260, fontWeight: 700, py: 1.2 }}>
                Materia Prima / Insumo *
              </TableCell>
              <TableCell sx={{ width: 110, fontWeight: 700, py: 1.2 }}>
                Cantidad *
              </TableCell>
              <TableCell sx={{ width: 130, fontWeight: 700, py: 1.2 }}>
                Unidad
              </TableCell>
              <TableCell sx={{ width: 150, fontWeight: 700, py: 1.2 }}>
                Precio Unitario ($){!priceReadOnly && " *"}
              </TableCell>
              <TableCell
                align="right"
                sx={{ width: 140, fontWeight: 700, py: 1.2 }}
              >
                Subtotal
              </TableCell>
              {!readOnly && (
                <TableCell align="center" sx={{ width: 50, py: 1.2 }}>
                  Acción
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={readOnly ? 6 : 7}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ShoppingBagOutlinedIcon
                      sx={{
                        fontSize: 38,
                        color: "text.secondary",
                        opacity: 0.7,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No hay insumos añadidos a la orden aún.
                    </Typography>
                    {!readOnly && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddRow}
                        sx={{ mt: 1, borderRadius: "8px" }}
                      >
                        Agregar Primer Insumo
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              items.map((row, idx) => (
                <TableRow
                  key={row.id || idx}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                    bgcolor: idx % 2 === 1 ? "action.hover" : "inherit",
                  }}
                >
                  {/* # Índice */}
                  <TableCell
                    align="center"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                    }}
                  >
                    {idx + 1}
                  </TableCell>

                  {/* Materia Prima / Insumo */}
                  <TableCell>
                    {readOnly ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.materiaPrima}
                      </Typography>
                    ) : (
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={catalog.map((c) => c.nombre)}
                        value={row.materiaPrima || ""}
                        onChange={(_, newValue) =>
                          handleItemChange(idx, "materiaPrima", newValue || "")
                        }
                        onInputChange={(_, newInputValue, reason) => {
                          if (reason === "input") {
                            handleItemChange(
                              idx,
                              "materiaPrima",
                              newInputValue,
                            );
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Ej: Harina 0000, Semolín..."
                            required
                            sx={{
                              "& .MuiInputBase-input": { fontSize: "0.85rem" },
                              bgcolor: "background.paper",
                            }}
                          />
                        )}
                      />
                    )}
                  </TableCell>

                  {/* Cantidad (Inmediatamente después de Materia Prima) */}
                  <TableCell>
                    {readOnly ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.cantidad}
                      </Typography>
                    ) : (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ min: 1, step: 1 }}
                        value={row.cantidad ?? ""}
                        onChange={(e) =>
                          handleItemChange(idx, "cantidad", e.target.value)
                        }
                        required
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: "0.85rem",
                            textAlign: "right",
                          },
                          bgcolor: "background.paper",
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Unidad (Solo lectura si unitReadOnly está activo) */}
                  <TableCell>
                    {renderUnidadCell(row, idx)}
                  </TableCell>

                  {/* Precio Unitario */}
                  <TableCell>
                    {renderPrecioUnitarioCell(row, idx)}
                  </TableCell>

                  {/* Subtotal */}
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: "0.9rem",
                      }}
                    >
                      ${Number(row.subtotal || 0).toLocaleString("es-AR")}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  {!readOnly && (
                    <TableCell align="center">
                      <Tooltip title="Eliminar fila">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveRow(idx)}
                            color="error"
                            disabled={items.length === 1}
                            sx={{
                              opacity: items.length === 1 ? 0.35 : 0.85,
                              "&:hover": {
                                opacity: 1,
                                bgcolor: "error.lighter",
                              },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Barra de Acciones y Resumen de Totales */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          p: 1.5,
          borderRadius: "12px",
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Botones de acción */}
        {!readOnly && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              sx={{ fontWeight: 600, borderRadius: "8px" }}
            >
              Agregar Insumo
            </Button>

            {presupuestoDisponible && onImportPresupuesto && (
              <Button
                size="small"
                variant="text"
                color="secondary"
                startIcon={<AutoFixHighIcon />}
                onClick={onImportPresupuesto}
                sx={{ fontWeight: 600 }}
              >
                Cargar Insumos del Presupuesto
              </Button>
            )}
          </Box>
        )}

        {/* Resumen Total */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            ml: "auto",
            flexWrap: "wrap",
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", fontWeight: 600 }}
            >
              Cant. Líneas / Bultos
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {items.length} {items.length === 1 ? "línea" : "líneas"} ·{" "}
              {totalCantidad.toLocaleString("es-AR")} un.
            </Typography>
          </Box>

          <Box
            sx={{
              pl: 2,
              borderLeft: "2px solid",
              borderColor: "primary.main",
              textAlign: { xs: "right", sm: "right" },
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", fontWeight: 700 }}
            >
              TOTAL PREVISTO
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.2 }}
            >
              ${totalGeneral.toLocaleString("es-AR")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

DetalleItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      materiaPrima: PropTypes.string,
      unidad: PropTypes.string,
      cantidad: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      precioUnitario: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      subtotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  onChange: PropTypes.func.isRequired,
  onImportPresupuesto: PropTypes.func,
  presupuestoDisponible: PropTypes.bool,
  readOnly: PropTypes.bool,
  unitReadOnly: PropTypes.bool,
  priceReadOnly: PropTypes.bool,
  catalog: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string,
      unidad: PropTypes.string,
      precioSugerido: PropTypes.number,
    }),
  ),
  unidades: PropTypes.arrayOf(PropTypes.string),
};

export default DetalleItemsTable;
