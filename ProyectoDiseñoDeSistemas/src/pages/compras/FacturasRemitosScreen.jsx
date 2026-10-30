import { money, pendingItems } from './logic';
import StockRecibido from '../../components/compras/StockRecibido';
import ComprobanteDetalle from '../../components/compras/ComprobanteDetalle';
import { ModuleDialog as Dialog, ModuleSurface, FormSection, FormDialog, SummaryCards, ListToolbar, RecordsView, RecordIcon, StatusChip } from '../../components/compras/ModuleUI';
import RecepcionForm from '../../components/compras/RecepcionForm';
import { initialReceptionState } from './mockData';
import { useState, useMemo } from "react";
import { Box, Paper, Typography, Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Alert, DialogTitle, DialogContent, DialogActions, Grid, Tabs, Tab } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloseIcon from "@mui/icons-material/Close";
import { INITIAL_FACTURAS, INITIAL_COMPROBANTES_PAGO, INITIAL_PROVEEDORES, INITIAL_ORDENES_COMPRA } from "./mockData";
import { DocumentoUploader } from "../../components/compras";

// Generador seguro de sufijo aleatorio para evitar alertas de PRNG inseguro (S2245)
const getSecureRandomSuffix = () => {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return 1000 + array[0] % 9000;
  }
  return 1000 + Date.now() % 9000;
};

// Funciones independientes para resolución de colores de estado (evita ternarios anidados S3358)

const getDetailDocumentoLabel = type => {
  if (type === "factura") return "Factura Adjunta del Proveedor";
  if (type === "remito") return "Remito Firmado Adjunto";
  return "Comprobante de Transferencia / Pago";
};
export const FacturasRemitosScreen = () => {
  const [currentTab, setCurrentTab] = useState(0);
  // Estados de datos en memoria
  const [facturas, setFacturas] = useState(INITIAL_FACTURAS);
  const [receptionData, setReceptionData] = useState(initialReceptionState);
  const {
    remitos
  } = receptionData;
  const [receptionNotice, setReceptionNotice] = useState('');
  const [pagos, setPagos] = useState(INITIAL_COMPROBANTES_PAGO);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Modales
  const [openDetail, setOpenDetail] = useState(false);
  const [openNewFactura, setOpenNewFactura] = useState(false);
  const [openNewRemito, setOpenNewRemito] = useState(false);
  const [openPagarFactura, setOpenPagarFactura] = useState(false);

  // Selecciones
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailType, setDetailType] = useState("factura"); // 'factura', 'remito', 'pago'

  const receiptOrder = detailType === 'remito' && selectedItem ? receptionData.ordenes.find(order => order.id === selectedItem.ordenCompraId) : null;
  const receiptBalance = receiptOrder ? pendingItems(receiptOrder, remitos) : [];

  // Forms
  const [facturaForm, setFacturaForm] = useState({
    id: "",
    ordenCompraId: "OC-2026-0102",
    proveedorId: 2,
    fechaEmision: new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires'
    }),
    fechaVencimiento: "",
    condicionPago: "Contado Contra Entrega",
    netoGravado: 809917,
    iva21: 170083,
    total: 980000,
    estado: "Pendiente de Pago",
    documentoUrl: ""
  });
  const [pagoForm, setPagoForm] = useState({
    medioPago: "Transferencia Bancaria",
    documentoUrl: ""
  });

  // Filtrado de Facturas
  const filteredFacturas = useMemo(() => {
    return facturas.filter(f => {
      const match = f.id.toLowerCase().includes(searchTerm.toLowerCase()) || f.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) || f.ordenCompraId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || f.estado === statusFilter;
      return match && matchStatus;
    });
  }, [facturas, searchTerm, statusFilter]);

  // Filtrado de Remitos
  const filteredRemitos = useMemo(() => {
    return remitos.filter(r => {
      const match = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) || r.ordenCompraId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || r.estado === statusFilter;
      return match && matchStatus;
    });
  }, [remitos, searchTerm, statusFilter]);

  // Filtrado de Pagos
  const filteredPagos = useMemo(() => {
    return pagos.filter(p => {
      const match = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.facturaId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || p.estado === statusFilter;
      return match && matchStatus;
    });
  }, [pagos, searchTerm, statusFilter]);

  // Handlers para detalles
  const handleOpenDetail = (item, type) => {
    setSelectedItem(item);
    setDetailType(type);
    setOpenDetail(true);
  };

  // Crear Factura
  const handleSaveFactura = e => {
    e.preventDefault();
    const prov = INITIAL_PROVEEDORES.find(p => p.id === Number(facturaForm.proveedorId));
    const neto = Number(facturaForm.netoGravado);
    const iva = Math.round(neto * 0.21);
    const total = neto + iva;
    const newFactura = {
      id: facturaForm.id || `FC-A-000${facturas.length + 1}-0000${getSecureRandomSuffix()}`,
      ordenCompraId: facturaForm.ordenCompraId,
      proveedorId: prov?.id || 1,
      proveedorNombre: prov?.razonSocial || "Proveedor S.A.",
      cuit: prov?.cuit || "30-00000000-0",
      fechaEmision: facturaForm.fechaEmision,
      fechaVencimiento: facturaForm.fechaVencimiento || "2026-04-15",
      condicionPago: facturaForm.condicionPago,
      netoGravado: neto,
      iva21: iva,
      total,
      estado: facturaForm.estado,
      comprobantePagoId: null,
      documentoUrl: facturaForm.documentoUrl
    };
    setFacturas(prev => [newFactura, ...prev]);
    setOpenNewFactura(false);
  };

  // Registrar Pago a Factura
  const handleOpenPagar = factura => {
    setSelectedItem(factura);
    setPagoForm({
      medioPago: "Transferencia Bancaria",
      documentoUrl: ""
    });
    setOpenPagarFactura(true);
  };
  const handleConfirmarPago = () => {
    if (!selectedItem) return;
    const nextPagoId = `OP-2026-00${pagos.length + 50}`;
    const newPago = {
      id: nextPagoId,
      facturaId: selectedItem.id,
      proveedorId: selectedItem.proveedorId,
      proveedorNombre: selectedItem.proveedorNombre,
      fechaEmision: new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires'
      }),
      medioPago: pagoForm.medioPago,
      nroTransaccion: `TRX-${Date.now().toString().slice(-6)}`,
      banco: pagoForm.medioPago === "Efectivo" ? "Caja Principal Planta" : "Banco de la Provincia de Buenos Aires",
      total: selectedItem.total,
      estado: "Conciliado",
      observaciones: "Pago liquidado con comprobante adjunto.",
      documentoUrl: pagoForm.documentoUrl
    };

    // Actualizar factura a Pagada
    setFacturas(prev => prev.map(f => f.id === selectedItem.id ? {
      ...f,
      estado: "Pagada",
      comprobantePagoId: nextPagoId
    } : f));

    // Agregar comprobante de pago
    setPagos(prev => [newPago, ...prev]);
    setOpenPagarFactura(false);
  };
  return <ModuleSurface>
      {receptionNotice && <Alert severity="success" onClose={() => setReceptionNotice('')}>{receptionNotice}</Alert>}

      {/* Pestañas Superiores */}
      <Paper elevation={0} sx={{
      borderBottom: "1px solid",
      borderColor: "divider",
      mb: 3,
      bgcolor: "transparent"
    }}>
        <Tabs variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile value={currentTab} onChange={(e, val) => {
        setCurrentTab(val);
        setStatusFilter("TODOS");
        setSearchTerm("");
      }} textColor="primary" indicatorColor="primary" sx={{
        "& .MuiTab-root": {
          fontWeight: 600,
          fontSize: "0.9rem",
          textTransform: "none",
          minHeight: 48
        }
      }}>
          <Tab icon={<ReceiptLongIcon />} iconPosition="start" label={`Facturas Proveedores (${facturas.length})`} />
          <Tab icon={<PaymentIcon />} iconPosition="start" label={`Comprobantes de Pago (${pagos.length})`} />
          <Tab icon={<LocalShippingIcon />} iconPosition="start" label={`Remitos de Entrega (${remitos.length})`} />
        </Tabs>
      </Paper>



      <SummaryCards items={currentTab === 0 ? [{
      label: 'Facturas',
      value: facturas.length
    }, {
      label: 'Total facturado',
      value: facturas.filter(f => f.estado !== 'Anulada').reduce((sum, f) => sum + f.total, 0).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
      })
    }, {
      label: 'Pendiente de pago',
      value: facturas.filter(f => f.estado === 'Pendiente de Pago').reduce((sum, f) => sum + f.total, 0).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }),
      color: 'warning.main'
    }, {
      label: 'Pagadas',
      value: facturas.filter(f => f.estado === 'Pagada').length,
      color: 'success.main'
    }] : currentTab === 1 ? [{
      label: 'Comprobantes de pago',
      value: pagos.length
    }, {
      label: 'Total abonado',
      value: pagos.reduce((sum, p) => sum + p.total, 0).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }),
      color: 'success.main'
    }] : [{
      label: 'Remitos registrados',
      value: remitos.length
    }, {
      label: 'Órdenes con saldo pendiente',
      value: receptionData.ordenes.filter(o => ['Enviada', 'Recibida Parcial'].includes(o.estado)).length,
      color: 'warning.main'
    }]} />
      <RecordsView toolbar={<ListToolbar search={searchTerm} onSearch={setSearchTerm} status={statusFilter} onStatus={setStatusFilter} statuses={['Pendiente de Pago', 'Pagada', 'Anulada']} showStatus={currentTab === 0} onCreate={currentTab === 0 ? () => setOpenNewFactura(true) : currentTab === 2 ? () => setOpenNewRemito(true) : undefined} createLabel={currentTab === 0 ? 'Registrar factura' : 'Registrar remito'} />} rows={currentTab === 0 ? filteredFacturas : currentTab === 1 ? filteredPagos : filteredRemitos} cardTitle={row => row.id} empty={searchTerm || statusFilter !== 'TODOS' ? 'No hay resultados para estos filtros.' : 'Todavía no hay documentos registrados.'} onClear={searchTerm || statusFilter !== 'TODOS' ? () => {
      setSearchTerm('');
      setStatusFilter('TODOS');
    } : undefined} columns={[{
      label: 'Documento',
      render: row => row.id
    }, {
      label: 'Proveedor',
      render: row => row.proveedorNombre
    }, {
      label: currentTab === 1 ? 'Factura vinculada' : 'Orden de compra',
      render: row => row.facturaId || row.ordenCompraId
    }, {
      label: 'Fecha de emisión',
      render: row => row.fechaEmision
    }, ...(currentTab === 0 ? [{
      label: 'Vencimiento',
      render: row => row.fechaVencimiento
    }] : []), ...(currentTab !== 2 ? [{
      label: 'Total',
      numeric: true,
      render: row => row.total.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
      })
    }, {
      label: 'Estado',
      render: row => <StatusChip value={row.estado} />
    }] : [{
      label: 'Fecha de recepción',
      render: row => row.fechaEntregaReal
    }])]} actions={row => <><RecordIcon label="Ver detalle" onClick={() => handleOpenDetail(row, currentTab === 0 ? 'factura' : currentTab === 1 ? 'pago' : 'remito')}><VisibilityOutlinedIcon /></RecordIcon>{currentTab === 0 && row.estado === 'Pendiente de Pago' && <RecordIcon label="Registrar pago" color="primary" onClick={() => handleOpenPagar(row)}><PaymentIcon /></RecordIcon>}</>} />

      {currentTab === 2 && <StockRecibido stock={receptionData.stock} remitos={remitos} onViewReceipt={remito => handleOpenDetail(remito, 'remito')} />}
      <Dialog open={openNewFactura} onClose={() => setOpenNewFactura(false)} maxWidth="md" fullWidth slotProps={{
      backdrop: {
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: theme => theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(15, 23, 42, 0.45)"
        }
      },
      paper: {
        ...{
          component: "form",
          onSubmit: handleSaveFactura,
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
              <ReceiptLongIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{
              fontWeight: 800,
              lineHeight: 1.2
            }}>
                Registrar Factura de Proveedor
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Carga fiscal para imputación a cuenta corriente y liquidación de
                pagos
              </Typography>
            </Box>
          </Box>
          <IconButton aria-label="Cerrar diálogo" onClick={() => setOpenNewFactura(false)} size="small">
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
          {/* Sección 1: Identificación */}
          <FormSection number={1} title="Identificación y Proveedor Emisor">
            <Grid container spacing={2}>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <TextField fullWidth size="small" label="Nº de Factura Oficial" placeholder="FC-A-0001-0000XXXX" value={facturaForm.id} onChange={e => setFacturaForm({
                ...facturaForm,
                id: e.target.value
              })} required />
              </Grid>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="factura-prov-label">
                    Proveedor Emisor
                  </InputLabel>
                  <Select labelId="factura-prov-label" value={facturaForm.proveedorId} label="Proveedor Emisor" onChange={e => setFacturaForm({
                  ...facturaForm,
                  proveedorId: e.target.value
                })}>
                    {INITIAL_PROVEEDORES.map(p => <MenuItem key={p.id} value={p.id}>
                        {p.razonSocial}
                      </MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="factura-oc-label">
                    Orden de Compra Vinculada
                  </InputLabel>
                  <Select labelId="factura-oc-label" value={facturaForm.ordenCompraId} label="Orden de Compra Vinculada" onChange={e => setFacturaForm({
                  ...facturaForm,
                  ordenCompraId: e.target.value
                })}>
                    {INITIAL_ORDENES_COMPRA.map(o => <MenuItem key={o.id} value={o.id}>
                        {o.id} - {o.proveedorNombre}
                      </MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </FormSection>

          {/* Sección 2: Fechas y Plazos */}
          <FormSection number={2} title="Fechas de Emisión y Vencimiento">
            <Grid container spacing={2}>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <TextField fullWidth size="small" type="date" label="Fecha de Emisión" value={facturaForm.fechaEmision} onChange={e => setFacturaForm({
                ...facturaForm,
                fechaEmision: e.target.value
              })} slotProps={{
                inputLabel: {
                  shrink: true
                }
              }} required />
              </Grid>
              <Grid size={{
              xs: 12,
              sm: 6
            }}>
                <TextField fullWidth size="small" type="date" label="Fecha de Vencimiento" value={facturaForm.fechaVencimiento} onChange={e => setFacturaForm({
                ...facturaForm,
                fechaVencimiento: e.target.value
              })} slotProps={{
                inputLabel: {
                  shrink: true
                }
              }} required />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection number={3} title="Importes e IVA">
            <Grid container spacing={3} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField fullWidth label="Neto gravado" type="number" value={facturaForm.netoGravado} onChange={event => setFacturaForm({ ...facturaForm, netoGravado: event.target.value })} slotProps={{ htmlInput: { step: '0.01', inputMode: 'decimal' }, input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }} required helperText="Importe sin IVA" />
              </Grid>
              <Grid size={{ xs: 12, sm: 7 }}>
                <Box component="dl" sx={{ m: 0, pl: { sm: 3 }, pt: { xs: 2, sm: 0 }, borderLeft: { sm: '1px solid' }, borderTop: { xs: '1px solid', sm: 0 }, borderColor: 'divider', fontVariantNumeric: 'tabular-nums' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, pb: 1.5 }}><Typography component="dt" variant="body2" color="text.secondary">IVA · 21%</Typography><Typography component="dd" variant="body2" sx={{ m: 0, textAlign: 'right', fontWeight: 600 }}>{money(Math.round(Number(facturaForm.netoGravado || 0) * 0.21))}</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', flexWrap: 'wrap' }}><Typography component="dt" variant="subtitle2">Total a facturar</Typography><Typography component="dd" sx={{ m: 0, ml: 'auto', fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 750, textAlign: 'right', color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark' }}>{money(Number(facturaForm.netoGravado || 0) + Math.round(Number(facturaForm.netoGravado || 0) * 0.21))}</Typography></Box>
                </Box>
              </Grid>
            </Grid>
          </FormSection>

          {/* Sección 4: Carga de Comprobante / Factura Oficial */}
          <FormSection number={4} title="Documento de respaldo">
            <DocumentoUploader label="Comprobante / Foto de la Factura Oficial" value={facturaForm.documentoUrl} onChange={newUrl => setFacturaForm(prev => ({
            ...prev,
            documentoUrl: newUrl
          }))} helperText="Cargue la foto o escaneo digital de la factura fiscal emitida por el proveedor." />
          </FormSection>
        </DialogContent>

        <DialogActions sx={{
        px: 3.5,
        py: 2,
        bgcolor: theme => theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
        borderTop: "1px solid",
        borderColor: "divider"
      }}>
          <Button variant="outlined" onClick={() => setOpenNewFactura(false)} color="inherit" sx={{
          fontWeight: 600
        }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{
          px: 3,
          fontWeight: 700,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)"
          }
        }}>
            Guardar Factura
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= MODAL: REGISTRAR REMITO - UI ESTILIZADA ================= */}
      {openNewRemito && <RecepcionForm state={receptionData} onClose={() => setOpenNewRemito(false)} onReceive={(next, receipt) => {
      setReceptionData(next);
      setOpenNewRemito(false);
      setReceptionNotice(`Remito ${receipt.id} confirmado. Cantidades aceptadas ingresadas al stock.`);
    }} />}


      {/* ================= MODAL: REGISTRAR PAGO A FACTURA - UI ESTILIZADA ================= */}
      <Dialog open={openPagarFactura} onClose={() => setOpenPagarFactura(false)} maxWidth="sm" fullWidth slotProps={{
      backdrop: {
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: theme => theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(15, 23, 42, 0.45)"
        }
      },
      paper: {
        ...{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: theme => theme.palette.mode === "dark" ? "0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(15, 23, 42, 0.2)"
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
            bgcolor: "success.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 2
          }}>
              <PaymentIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{
              fontWeight: 800,
              lineHeight: 1.2
            }}>
                Registrar Orden de Pago Proveedor
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Liquidación de factura mediante transferencia bancaria o caja
              </Typography>
            </Box>
          </Box>
          <IconButton aria-label="Cerrar diálogo" onClick={() => setOpenPagarFactura(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{
        px: 3.5,
        pt: "24px !important",
        pb: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2.5
      }}>
          {openPagarFactura && selectedItem && <>
              <FormSection number={1} title="Factura y monto a cancelar"><Box sx={{
            p: 2,
            bgcolor: theme => theme.palette.mode === "dark" ? "rgba(46, 204, 113, 0.12)" : "rgba(46, 204, 113, 0.08)",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: theme => theme.palette.mode === "dark" ? "success.dark" : "success.light"
          }}>
                <Typography variant="body2" sx={{
              fontWeight: 700
            }}>
                  Factura a Cancelar: <strong>{selectedItem.id}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proveedor: {selectedItem.proveedorNombre}
                </Typography>
                <Typography variant="h6" sx={{
              fontWeight: 800,
              color: "success.main",
              mt: 1
            }}>
                  Monto a Abonar: ${selectedItem.total.toLocaleString("es-AR")}
                </Typography>
              </Box>

              </FormSection><FormSection number={2} title="Medio de pago y comprobante"><FormControl fullWidth size="small">
                <InputLabel id="pago-medio-label">Medio de Pago</InputLabel>
                <Select labelId="pago-medio-label" value={pagoForm.medioPago} label="Medio de Pago" onChange={e => setPagoForm({
              ...pagoForm,
              medioPago: e.target.value
            })}>
                  <MenuItem value="Transferencia Bancaria">
                    Transferencia Bancaria (BAPRO)
                  </MenuItem>
                  <MenuItem value="Débito Automático">
                    Débito Automático
                  </MenuItem>
                  <MenuItem value="Efectivo">
                    Efectivo contra Recibo de Mostrador
                  </MenuItem>
                </Select>
              </FormControl>

              <DocumentoUploader label="Comprobante de Transferencia / Recibo de Pago" value={pagoForm.documentoUrl} onChange={newUrl => setPagoForm(prev => ({
            ...prev,
            documentoUrl: newUrl
          }))} helperText="Cargue la foto o comprobante bancario para respaldar la liquidación del pago." /></FormSection>
            </>}
        </DialogContent>
        <DialogActions sx={{
        px: 3.5,
        py: 2,
        bgcolor: theme => theme.palette.mode === "dark" ? "action.hover" : "#f8fafc",
        borderTop: "1px solid",
        borderColor: "divider"
      }}>
          <Button variant="outlined" onClick={() => setOpenPagarFactura(false)} color="inherit" sx={{
          fontWeight: 600
        }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmarPago} variant="contained" color="success" sx={{
          px: 3,
          fontWeight: 700,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)"
          }
        }}>
            Confirmar y Emitir Pago
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= MODAL: VER DETALLE GENERAL - UI ESTILIZADA ================= */}
      <FormDialog open={openDetail} onClose={() => setOpenDetail(false)} title={detailType === 'factura' ? 'Detalle de factura' : detailType === 'remito' ? 'Detalle de remito' : 'Detalle de pago'} maxWidth="lg">
        {selectedItem && <><ComprobanteDetalle tipo={detailType === 'factura' ? 'Factura de proveedor' : detailType === 'remito' ? 'Remito de entrega' : 'Comprobante de pago'} numero={selectedItem.id} estado={selectedItem.estado} emisor={detailType === 'pago' ? 'PastaFab' : selectedItem.proveedorNombre} quantityLabel="Cantidad recibida" items={detailType === 'remito' ? selectedItem.items : undefined} total={detailType === 'remito' ? undefined : selectedItem.total} observaciones={selectedItem.observaciones} fields={[{
          label: 'Proveedor',
          value: selectedItem.proveedorNombre
        }, {
          label: 'CUIT',
          value: selectedItem.cuit
        }, {
          label: 'Fecha de emisión',
          value: selectedItem.fechaEmision
        }, ...(detailType === 'pago' ? [{
          label: 'Factura vinculada',
          value: selectedItem.facturaId
        }, {
          label: 'Medio de pago',
          value: selectedItem.medioPago
        }, {
          label: 'Nº de transacción',
          value: selectedItem.nroTransaccion
        }, {
          label: 'Banco',
          value: selectedItem.banco
        }] : [{
          label: 'Orden de compra',
          value: selectedItem.ordenCompraId
        }]), ...(detailType === 'factura' ? [{
          label: 'Vencimiento',
          value: selectedItem.fechaVencimiento
        }, {
          label: 'Condición de pago',
          value: selectedItem.condicionPago
        }] : []), ...(detailType === 'remito' ? [{
          label: 'Fecha de recepción',
          value: selectedItem.fechaEntregaReal
        }] : [])]} netoGravado={detailType === 'factura' ? selectedItem.netoGravado : undefined} importeIVA={detailType === 'factura' ? selectedItem.iva21 : undefined}>{detailType === 'remito' && receiptOrder && <Box>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mb: 1.5 }}><Typography variant="subtitle2">Estado de recepción</Typography><StatusChip value={receiptOrder.estado} /></Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Acumulado de la orden {receiptOrder.id}, incluyendo sus remitos registrados.</Typography>
            <Box component="dl" sx={{ m: 0, display: 'grid', gap: 1.5 }}>{receiptBalance.map(item => <Box key={`${item.materiaPrima}|${item.unidad}`} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography component="dt" variant="body2" sx={{ fontWeight: 600, mb: 1 }}>{item.materiaPrima}</Typography>
              <Box component="dd" sx={{ m: 0, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>{[['Pedido', item.cantidad], ['Recibido', item.recibida], ['Saldo', item.pendiente]].map(([label, value]) => <Box key={label}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>{value} {item.unidad}</Typography></Box>)}</Box>
            </Box>)}</Box>
          </Box>}</ComprobanteDetalle>
          {selectedItem.documentoUrl && <DocumentoUploader label={getDetailDocumentoLabel(detailType)} value={selectedItem.documentoUrl} readOnly />}
        </>}
      </FormDialog>
    </ModuleSurface>;
};
export default FacturasRemitosScreen;
