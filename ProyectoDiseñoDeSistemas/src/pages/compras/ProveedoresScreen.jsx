import DomicilioProveedorFields from '../../components/compras/DomicilioProveedorFields';
import { buildAddressCatalog } from './addressCatalog';
import ComprobanteDetalle from '../../components/compras/ComprobanteDetalle';
import { ModuleDialog as Dialog, ModuleSurface, FormSection, FormDialog, SummaryCards, ListToolbar, RecordsView, RecordIcon } from '../../components/compras/ModuleUI';
import { useState, useMemo } from "react";
import { Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, DialogTitle, DialogContent, DialogActions, Grid } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { INITIAL_PROVEEDORES } from "./mockData";

const EstadoSelect = ({ value, onChange, ariaLabel = "Cambiar estado del proveedor", size = "small", disabled = false }) => <FormControl size={size} sx={{ flexShrink: 0 }}>
  <Select value={value} onChange={onChange} disabled={disabled} onClick={event => event.stopPropagation()} inputProps={{ 'aria-label': ariaLabel }} sx={{ minHeight: 44, '& .MuiSelect-select': { py: 0.75, display: 'flex', alignItems: 'center' } }}>
    <MenuItem value="Activo">Activo</MenuItem>
    <MenuItem value="Inactivo">Inactivo</MenuItem>
  </Select>
</FormControl>;
export const ProveedoresScreen = () => {
  const [proveedores, setProveedores] = useState(INITIAL_PROVEEDORES);
  const [addressCatalog, setAddressCatalog] = useState(() => buildAddressCatalog(INITIAL_PROVEEDORES));
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("TODAS");
  const [estadoFilter, setEstadoFilter] = useState("TODOS");

  // Modales
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Selecciones
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialFormState = {
    cuit: "",
    razonSocial: "",
    contacto: "",
    telefono: "",
    email: "",
    calle: "",
    altura: "",
    piso: "",
    depto: "",
    localidad: "",
    provincia: "",
    categoria: "Insumos Locales / Frescos",
    insumosPrincipales: "",
    estado: "Activo"
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filtros combinados
  const filteredProveedores = useMemo(() => {
    return proveedores.filter(p => {
      const matchesSearch = p.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) || p.cuit.toLowerCase().includes(searchTerm.toLowerCase()) || p.contacto.toLowerCase().includes(searchTerm.toLowerCase()) || (p.insumosPrincipales || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = categoriaFilter === "TODAS" || p.categoria === categoriaFilter;
      const matchesEst = estadoFilter === "TODOS" || p.estado === estadoFilter;
      return matchesSearch && matchesCat && matchesEst;
    });
  }, [proveedores, searchTerm, categoriaFilter, estadoFilter]);

  // Métricas
  const stats = useMemo(() => {
    const total = proveedores.length;
    const activos = proveedores.filter(p => p.estado === "Activo").length;
    const principales = proveedores.filter(p => p.categoria.includes("Principal")).length;
    const locales = proveedores.filter(p => p.categoria.includes("Locales")).length;
    return {
      total,
      activos,
      principales,
      locales
    };
  }, [proveedores]);

  // Handlers
  const handleStatusChange = (provId, newStatus) => {
    setProveedores(prev => prev.map(p => p.id === provId ? {
      ...p,
      estado: newStatus
    } : p));
    setSelectedProveedor(prev => prev && prev.id === provId ? {
      ...prev,
      estado: newStatus
    } : prev);
  };
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setOpenForm(true);
  };
  const handleOpenEdit = prov => {
    setIsEditing(true);
    setSelectedProveedor(prov);
    setFormData({
      ...prov,
      altura: prov.altura === 'S/N' ? '' : prov.altura,
      piso: prov.piso ?? '',
      depto: prov.depto ?? '',
      estado: prov.estado || "Activo"
    });
    setOpenForm(true);
  };
  const handleOpenDetail = prov => {
    setSelectedProveedor(prov);
    setOpenDetail(true);
  };
  const handleOpenDelete = prov => {
    setSelectedProveedor(prov);
    setOpenDelete(true);
  };
  const handleSaveForm = e => {
    e.preventDefault();
    if (!formData.razonSocial.trim() || !formData.cuit.trim()) return;
    const savedForm = {
      ...formData,
      razonSocial: formData.razonSocial.trim(),
      cuit: formData.cuit.trim(),
      altura: isEditing && selectedProveedor.altura === 'S/N' && formData.altura === '' ? 'S/N' : formData.altura
    };
    if (isEditing) {
      setProveedores(prev => prev.map(p => p.id === selectedProveedor.id ? {
        ...savedForm,
        id: p.id
      } : p));
      setSelectedProveedor(prev => prev && prev.id === selectedProveedor.id ? {
        ...savedForm,
        id: prev.id
      } : prev);
    } else {
      const newProv = {
        ...savedForm,
        id: Date.now(),
        estado: "Activo" // Siempre creamos un proveedor activo
      };
      setProveedores(prev => [newProv, ...prev]);
    }
    setOpenForm(false);
  };
  const handleDeleteConfirm = () => {
    setProveedores(prev => prev.filter(p => p.id !== selectedProveedor.id));
    setOpenDelete(false);
    setSelectedProveedor(null);
  };
  return <ModuleSurface>

      <SummaryCards items={[{
      label: 'Proveedores',
      value: stats.total
    }, {
      label: 'Activos',
      value: stats.activos,
      color: 'success.main'
    }, {
      label: 'Materia prima principal',
      value: stats.principales
    }, {
      label: 'Proveedores locales',
      value: stats.locales,
      color: 'info.main'
    }]} />
      <RecordsView toolbar={<ListToolbar filterActive={categoriaFilter !== "TODAS"} onClear={() => {
      setSearchTerm('');
      setEstadoFilter('TODOS');
      setCategoriaFilter('TODAS');
    }} search={searchTerm} onSearch={setSearchTerm} status={estadoFilter} onStatus={setEstadoFilter} statuses={['Activo', 'Inactivo']} createLabel="Nuevo proveedor" onCreate={handleOpenCreate}>
        <TextField select label="Categoría" value={categoriaFilter} onChange={e => setCategoriaFilter(e.target.value)} sx={{
        minWidth: {
          sm: 210
        }
      }}><MenuItem value="TODAS">Todas las categorías</MenuItem>{[...new Set(proveedores.map(p => p.categoria))].map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}</TextField>
      </ListToolbar>} rows={filteredProveedores} cardTitle={p => p.razonSocial} empty={proveedores.length ? 'No hay resultados para estos filtros.' : 'Todavía no hay proveedores registrados.'} onClear={searchTerm || estadoFilter !== 'TODOS' || categoriaFilter !== 'TODAS' ? () => {
      setSearchTerm('');
      setEstadoFilter('TODOS');
      setCategoriaFilter('TODAS');
    } : undefined} columns={[{
      label: 'Proveedor',
      render: p => p.razonSocial
    }, {
      label: 'CUIT',
      render: p => p.cuit
    }, {
      label: 'Categoría',
      render: p => p.categoria
    }, {
      label: 'Localidad',
      render: p => p.localidad
    }, {
      label: 'Teléfono',
      render: p => p.telefono
    }, {
      label: 'Estado',
      render: p => <EstadoSelect value={p.estado} onChange={e => handleStatusChange(p.id, e.target.value)} ariaLabel={`Cambiar estado de ${p.razonSocial}`} />
    }]} actions={p => <><RecordIcon label="Ver detalle" onClick={() => handleOpenDetail(p)}><VisibilityOutlinedIcon /></RecordIcon><RecordIcon label="Editar" color="primary" onClick={() => handleOpenEdit(p)}><EditOutlinedIcon /></RecordIcon><RecordIcon label="Eliminar" color="error" onClick={() => handleOpenDelete(p)}><DeleteOutlineIcon /></RecordIcon></>} />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth slotProps={{
      backdrop: {
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: theme => theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(15, 23, 42, 0.45)"
        }
      },
      paper: {
        ...{
          component: "form",
          onSubmit: handleSaveForm,
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: theme => theme.palette.mode === "dark" ? "0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(15, 23, 42, 0.2)",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column"
          }
        }
      }
    }}>
        <DialogTitle sx={{
        p: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: theme => theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
        borderBottom: "1px solid",
        borderColor: "divider"
      }}>
          <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}>
            <Box sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 2
          }}>
              <StorefrontIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{
              fontWeight: 800,
              lineHeight: 1.2
            }}>
                {isEditing ? `Editar Proveedor · ${selectedProveedor?.razonSocial}` : "Registrar Nuevo Proveedor"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Alta fiscal, condiciones de entrega y categoría de suministro de
                insumos
              </Typography>
            </Box>
          </Box>
          <IconButton aria-label="Cerrar diálogo" onClick={() => setOpenForm(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{
        px: 3.5,
        pt: "24px !important",
        pb: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        overflowY: "auto"
      }}>
          {/* Sección 1: Datos Fiscales */}
          <FormSection number={1} title="Datos Fiscales y Razón Social">
            <Grid container spacing={2}>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <TextField fullWidth size="small" label="Razón Social" autoFocus autoComplete="organization" placeholder="Ej: Molino Harinero Central S.A." value={formData.razonSocial} onChange={e => setFormData({
                ...formData,
                razonSocial: e.target.value
              })} required />
              </Grid>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <TextField fullWidth size="small" label="CUIT" slotProps={{ htmlInput: { inputMode: 'numeric' } }} placeholder="30-XXXXXXXX-X" value={formData.cuit} onChange={e => setFormData({
                ...formData,
                cuit: e.target.value
              })} required />
              </Grid>
              <Grid size={{
              xs: 12,
              sm: isEditing ? 6 : 12
            }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="prov-cat-label">
                    Categoría de Proveedor
                  </InputLabel>
                  <Select labelId="prov-cat-label" value={formData.categoria} label="Categoría de Proveedor" onChange={e => setFormData({
                  ...formData,
                  categoria: e.target.value
                })}>
                    <MenuItem value="Materia Prima Principal (Semestral)">
                      Materia Prima Principal (Semestral)
                    </MenuItem>
                    <MenuItem value="Insumos Locales / Frescos">
                      Insumos Locales / Frescos
                    </MenuItem>
                    <MenuItem value="Descartables & Packaging">
                      Descartables & Packaging
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {isEditing && <Grid size={{
              xs: 12,
              sm: 6
            }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="prov-estado-label">
                      Estado del Proveedor
                    </InputLabel>
                    <Select labelId="prov-estado-label" value={formData.estado || "Activo"} label="Estado del Proveedor" onChange={e => setFormData({
                  ...formData,
                  estado: e.target.value
                })}>
                      <MenuItem value="Activo">
                        Activo
                      </MenuItem>
                      <MenuItem value="Inactivo">
                        Inactivo
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>}
            </Grid>
          </FormSection>

          {/* Sección 2: Contacto Comercial */}
          <FormSection number={2} title="Contacto Comercial y Comunicación">
            <Grid container spacing={2}>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <TextField fullWidth size="small" label="Teléfono" type="tel" autoComplete="tel" placeholder="Ej: (02392) 42-8819" value={formData.telefono} onChange={e => setFormData({
                ...formData,
                telefono: e.target.value
              })} required />
              </Grid>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <TextField fullWidth size="small" label="Correo Electrónico" type="email" autoComplete="email" placeholder="ventas@molinoharinas.com" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} required />
              </Grid>
            </Grid>
          </FormSection>

          {/* Sección 3: Domicilio e Insumos */}
          <FormSection number={3} title="Domicilio fiscal">
            <DomicilioProveedorFields value={formData} onChange={setFormData} catalog={addressCatalog} onCatalogChange={setAddressCatalog} legacyNoNumber={isEditing && selectedProveedor?.altura === 'S/N'} />
          </FormSection>
        </DialogContent>

        <DialogActions sx={{
        px: 3.5,
        py: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: theme => theme.palette.mode === "dark" ? "action.hover" : "#f8fafc"
      }}>
          <Button variant="outlined" onClick={() => setOpenForm(false)} color="inherit" sx={{
          fontWeight: 600
        }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} sx={{
          px: 3,
          fontWeight: 700,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)"
          }
        }}>
            {isEditing ? "Guardar Cambios" : "Registrar Proveedor"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Dialog: Detalle de Proveedor */}
      <FormDialog open={openDetail} onClose={() => setOpenDetail(false)} title="Ficha del proveedor">{selectedProveedor && <ComprobanteDetalle numberBelowIssuer tipo="Ficha de proveedor" numero={selectedProveedor.id} estado={selectedProveedor.estado} emisor={selectedProveedor.razonSocial} fields={[{
        label: 'Razón social',
        value: selectedProveedor.razonSocial
      }, {
        label: 'CUIT',
        value: selectedProveedor.cuit
      }, {
        label: 'Categoría',
        value: selectedProveedor.categoria
      }, {
        label: 'Persona de contacto',
        value: selectedProveedor.contacto
      }, {
        label: 'Teléfono',
        value: selectedProveedor.telefono
      }, {
        label: 'Correo electrónico',
        value: selectedProveedor.email
      }, {
        label: 'Domicilio',
        value: `${selectedProveedor.calle} ${selectedProveedor.altura}`
      }, {
        label: 'Piso / Dpto',
        value: [selectedProveedor.piso, selectedProveedor.depto].map(value => value == null || value === '' ? '—' : value).join(' / ')
      }, {
        label: 'Localidad',
        value: selectedProveedor.localidad
      }, {
        label: 'Provincia',
        value: selectedProveedor.provincia
      }]} />}</FormDialog>

      {/* Modal Dialog: Confirmación de Eliminación */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth slotProps={{
      backdrop: {
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: theme => theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(15, 23, 42, 0.45)"
        }
      },
      paper: {
        ...{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: theme => theme.palette.mode === "dark" ? "0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(15, 23, 42, 0.2)"
          }
        }
      }
    }}>
        <DialogTitle sx={{
        p: 2.5,
        bgcolor: theme => theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 1.5
      }}>
          <Box sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          bgcolor: "error.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
            <WarningAmberIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" sx={{
          fontWeight: 700
        }}>
            Confirmar Baja de Proveedor
          </Typography>
        </DialogTitle>
        <DialogContent sx={{
        px: 3,
        pt: "24px !important",
        pb: 2
      }}>
          <Typography variant="body2" color="text.secondary">
            ¿Está seguro de que desea dar de baja al proveedor{" "}
            <strong>{selectedProveedor?.razonSocial}</strong> (CUIT{" "}
            {selectedProveedor?.cuit})? Esta acción se reflejará en memoria
            inmediatamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{
        px: 3,
        py: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: theme => theme.palette.mode === "dark" ? "action.hover" : "#f8fafc"
      }}>
          <Button variant="outlined" onClick={() => setOpenDelete(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{
          fontWeight: 700
        }}>
            Eliminar Proveedor
          </Button>
        </DialogActions>
      </Dialog>
    </ModuleSurface>;
};
export default ProveedoresScreen;
