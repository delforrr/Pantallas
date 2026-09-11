---
name: mui-patterns
description: Patrones de diseño y snippets de referencia en Material-UI (MUI) para el ERP PastaFab. Úsalo como referencia para estructurar tablas paginadas, formularios modales en dos columnas, filtros de estado y confirmaciones de borrado en memoria.
---

# Patrones de Referencia Material-UI (MUI) para PastaFab

Colección de patrones estandarizados para que todas las pantallas de ventas, compras, producción y mantenimiento compartan la misma consistencia visual y de código.

---

## 1. Patrón: Barra de Filtros y Búsqueda

```jsx
import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

export const FilterBar = ({ searchTerm, onSearchChange, statusFilter, onStatusChange, onNewClick, newButtonLabel = "Nuevo Registro" }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, minWidth: 260 }}>
      <TextField
        size="small"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 240, bgcolor: 'background.paper' }}
      />
      <FormControl size="small" sx={{ minWidth: 160, bgcolor: 'background.paper' }}>
        <InputLabel id="status-filter-label">Estado</InputLabel>
        <Select
          labelId="status-filter-label"
          value={statusFilter}
          label="Estado"
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <MenuItem value="TODOS">Todos los estados</MenuItem>
          <MenuItem value="PENDIENTE">Pendiente</MenuItem>
          <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
          <MenuItem value="FINALIZADA">Finalizada</MenuItem>
          <MenuItem value="CANCELADA">Cancelada</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onNewClick}
      sx={{ whiteSpace: 'nowrap' }}
    >
      {newButtonLabel}
    </Button>
  </Box>
);
```

---

## 2. Patrón: Tabla de Datos con Estados y Acciones

```jsx
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Paper, Chip, IconButton, Tooltip, Typography, Box
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const STATUS_COLOR_MAP = {
  PENDIENTE: 'warning',
  EN_PROCESO: 'info',
  FINALIZADA: 'success',
  CANCELADA: 'error',
};

export const DataTable = ({ items, onEdit, onDelete, onView }) => (
  <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
    <Table sx={{ minWidth: 650 }}>
      <TableHead sx={{ bgcolor: 'action.hover' }}>
        <TableRow>
          <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Descripción / Entidad</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
          <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
              <Typography variant="body2">No se encontraron registros</Typography>
            </TableCell>
          </TableRow>
        ) : (
          items.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ fontWeight: 600 }}>#{row.id}</TableCell>
              <TableCell>{row.titulo || row.nombre || row.descripcion}</TableCell>
              <TableCell>{row.fecha}</TableCell>
              <TableCell>
                <Chip
                  label={row.estado}
                  size="small"
                  color={STATUS_COLOR_MAP[row.estado] || 'default'}
                  sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                />
              </TableCell>
              <TableCell align="right">
                {onView && (
                  <Tooltip title="Ver detalles">
                    <IconButton size="small" onClick={() => onView(row)} sx={{ color: 'text.secondary' }}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onEdit && (
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => onEdit(row)} sx={{ color: 'primary.main' }}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Eliminar">
                    <IconButton size="small" onClick={() => onDelete(row)} sx={{ color: 'error.main' }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);
```

---

## 3. Patrón: Formulario en Modal (`Dialog`) de 2 Columnas

```jsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, MenuItem, Typography, Box
} from '@mui/material';

export const FormDialog = ({ open, onClose, onSave, initialData, title = "Registro" }) => {
  // Manejar estado local del formulario
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Campo 1" size="small" required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Campo 2" size="small" select defaultValue="OPCION_1">
              <MenuItem value="OPCION_1">Opción 1</MenuItem>
              <MenuItem value="OPCION_2">Opción 2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Observaciones" size="small" multiline rows={3} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={onSave} variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};
```
